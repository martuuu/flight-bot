import axios from 'axios';
import { scrapingLogger } from '../utils/logger';
import { 
  AerolineasSearchParams,
  AerolineasCalendarResponse,
  AerolineasFlightResponse,
  AerolineasLanguageBundle,
  AerolineasDeal,
  AerolineasPriceAnalysis,
  AerolineasScraperConfig,
  AerolineasCabinClass
} from '../types/aerolineas-api';

export class AerolineasAlertService {
  private baseUrl: string;
  private headers: Record<string, string>;
  private config: AerolineasScraperConfig;

  constructor() {
    this.baseUrl = process.env['AEROLINEAS_API_URL'] || 'https://api.aerolineas.com.ar';
    this.headers = {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
      'Content-Type': 'application/json',
      'Origin': 'https://www.aerolineas.com.ar',
      'Referer': 'https://www.aerolineas.com.ar/',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };

    this.config = {
      baseUrl: this.baseUrl,
      endpoints: {
        languageBundle: '/v1/localization/languageBundles/es-AR_flightOffers',
        calendarSearch: '/v1/flights/offers',
        flightSearch: '/v1/flights/offers'
      },
      headers: this.headers,
      rateLimit: {
        requestsPerMinute: 30,
        delayBetweenRequests: 2000
      },
      retry: {
        maxAttempts: 3,
        delayMs: 1000
      }
    };
  }

  /**
   * Buscar vuelos con calendario flexible para encontrar las mejores ofertas
   */
  async searchFlexibleCalendar(params: AerolineasSearchParams): Promise<AerolineasCalendarResponse> {
    try {
      const searchParams = new URLSearchParams({
        adt: params.adults.toString(),
        inf: (params.infants || 0).toString(),
        chd: (params.children || 0).toString(),
        flexDates: 'true',
        cabinClass: params.cabinClass || 'Economy',
        flightType: params.flightType,
        leg: `${params.origin}-${params.destination}-${params.departureDate.replace(/-/g, '')}`
      });

      if (params.awardBooking) {
        searchParams.append('awardBooking', 'true');
      }

      const url = `${this.baseUrl}${this.config.endpoints.calendarSearch}?${searchParams.toString()}`;
      
      scrapingLogger.info(`[AEROLINEAS] Searching flexible calendar: ${params.origin} → ${params.destination}`, {
        url,
        params
      });

      const response = await axios.get<AerolineasCalendarResponse>(url, {
        headers: this.headers,
        timeout: 30000
      });

      scrapingLogger.info(`[AEROLINEAS] Calendar search completed`, {
        currency: response.data.searchMetadata.currency,
        market: response.data.searchMetadata.market,
        routes: response.data.searchMetadata.routes,
        offersCount: Object.keys(response.data.calendarOffers).length
      });

      return response.data;
    } catch (error) {
      this.handleApiError(error as any, 'calendar search');
      throw error;
    }
  }

  /**
   * Buscar vuelos específicos para una fecha
   */
  async searchSpecificFlights(params: AerolineasSearchParams): Promise<AerolineasFlightResponse> {
    try {
      const searchParams = new URLSearchParams({
        adt: params.adults.toString(),
        inf: (params.infants || 0).toString(),
        chd: (params.children || 0).toString(),
        flexDates: 'false',
        cabinClass: params.cabinClass || 'Economy',
        flightType: params.flightType,
        leg: `${params.origin}-${params.destination}-${params.departureDate.replace(/-/g, '')}`
      });

      if (params.awardBooking) {
        searchParams.append('awardBooking', 'true');
      }

      if (params.shoppingId) {
        searchParams.append('shoppingId', params.shoppingId);
      }

      const url = `${this.baseUrl}${this.config.endpoints.flightSearch}?${searchParams.toString()}`;
      
      scrapingLogger.info(`[AEROLINEAS] Searching specific flights: ${params.origin} → ${params.destination}`, {
        url,
        params
      });

      const response = await axios.get<AerolineasFlightResponse>(url, {
        headers: this.headers,
        timeout: 30000
      });

      scrapingLogger.info(`[AEROLINEAS] Flight search completed`, {
        currency: response.data.searchMetadata.currency,
        market: response.data.searchMetadata.market,
        routes: response.data.searchMetadata.routes,
        alternateOffers: Object.keys(response.data.alternateOffers || {}).length,
        brandedOffers: Object.keys(response.data.brandedOffers || {}).length
      });

      return response.data;
    } catch (error) {
      this.handleApiError(error as any, 'flight search');
      throw error;
    }
  }

  /**
   * Obtener bundle de idiomas (para traducciones)
   */
  async getLanguageBundle(): Promise<AerolineasLanguageBundle> {
    try {
      const url = `${this.baseUrl}${this.config.endpoints.languageBundle}`;
      
      const response = await axios.get<AerolineasLanguageBundle>(url, {
        headers: this.headers,
        timeout: 15000
      });

      return response.data;
    } catch (error) {
      this.handleApiError(error as any, 'language bundle');
      throw error;
    }
  }

  /**
   * Buscar ofertas promocionales de millas
   */
  async searchPromoMiles(
    origin: string,
    destination: string,
    departureDate: string,
    options: {
      maxMiles?: number;
      cabinClass?: AerolineasCabinClass;
      adults?: number;
      children?: number;
      infants?: number;
    } = {}
  ): Promise<AerolineasDeal[]> {
    try {
      const searchParams: AerolineasSearchParams = {
        origin,
        destination,
        departureDate,
        adults: options.adults || 1,
        children: options.children || 0,
        infants: options.infants || 0,
        cabinClass: options.cabinClass || 'Economy',
        flightType: 'ONE_WAY',
        awardBooking: true,
        flexDates: true
      };

      // Intentar búsqueda real primero
      try {
        const calendarResponse = await this.searchFlexibleCalendar(searchParams);
        const calendarDeals = this.extractDealsFromCalendar(calendarResponse, options.maxMiles);
        
        // Si encontramos ofertas reales, devolverlas
        if (calendarDeals.length > 0) {
          const promoDeals = calendarDeals.filter(deal => deal.isPromo);
          scrapingLogger.info(`[AEROLINEAS] Found ${promoDeals.length} real promo deals`);
          return promoDeals;
        }
      } catch (apiError) {
        scrapingLogger.warn('[AEROLINEAS] API search failed, using mock data', apiError as Error);
      }

      // Si la API falla, usar datos mock para desarrollo
      const mockDeals = this.generateMockDeals(origin, destination, departureDate, options);
      scrapingLogger.info(`[AEROLINEAS] Using ${mockDeals.length} mock deals for development`);
      return mockDeals;
    } catch (error) {
      scrapingLogger.error('[AEROLINEAS] Error searching promo miles', error as Error);
      throw error;
    }
  }

  /**
   * Extraer ofertas del calendario
   */
  private extractDealsFromCalendar(response: AerolineasCalendarResponse, maxMiles?: number): AerolineasDeal[] {
    const deals: AerolineasDeal[] = [];
    
    for (const [routeIndex, offers] of Object.entries(response.calendarOffers)) {
      for (const offer of offers) {
        if (offer.offerDetails && offer.leg && !offer.soldOut) {
          const deal: AerolineasDeal = {
            id: `${offer.departure}-${routeIndex}`,
            origin: offer.leg.segments[0]?.departureAirport || '',
            destination: offer.leg.segments[offer.leg.segments.length - 1]?.arrivalAirport || '',
            departureDate: offer.departure,
            miles: offer.offerDetails.miles,
            price: offer.offerDetails.price,
            currency: response.searchMetadata.currency,
            cabinClass: offer.offerDetails.cabinClass,
            flightType: response.searchMetadata.flightType,
            fareFamily: offer.offerDetails.fareFamily || '',
            availableSeats: offer.offerDetails.availableSeats || 0,
            segments: offer.leg.segments,
            restrictions: offer.offerDetails.restrictions || [],
            isPromo: this.isPromoOffer(offer.offerDetails.fareFamily),
            foundAt: new Date()
          };

          if (!maxMiles || (deal.miles && deal.miles <= maxMiles)) {
            deals.push(deal);
          }
        }
      }
    }

    return deals;
  }

  /**
   * Determinar si una oferta es promocional
   */
  private isPromoOffer(fareFamily?: string): boolean {
    if (!fareFamily) return false;
    
    const promoKeywords = ['promo', 'promotion', 'award', 'plus', 'discount', 'offer'];
    const lowerFareFamily = fareFamily.toLowerCase();
    
    return promoKeywords.some(keyword => lowerFareFamily.includes(keyword));
  }

  /**
   * Analizar precios y disponibilidad
   */
  async analyzePrices(
    origin: string,
    destination: string,
    fromDate: string,
    toDate: string,
    options: {
      cabinClass?: AerolineasCabinClass;
      adults?: number;
    } = {}
  ): Promise<AerolineasPriceAnalysis> {
    try {
      const searchParams: AerolineasSearchParams = {
        origin,
        destination,
        departureDate: fromDate,
        adults: options.adults || 1,
        cabinClass: options.cabinClass || 'Economy',
        flightType: 'ONE_WAY',
        awardBooking: true,
        flexDates: true
      };

      const response = await this.searchFlexibleCalendar(searchParams);
      
      const allOffers = Object.values(response.calendarOffers).flat();
      const validOffers = allOffers.filter(offer => 
        offer.offerDetails && !offer.soldOut && 
        offer.departure >= fromDate && offer.departure <= toDate
      );

      const prices = validOffers.map(offer => offer.offerDetails!.price).filter(p => p !== undefined) as number[];
      const miles = validOffers.map(offer => offer.offerDetails!.miles).filter(m => m !== undefined) as number[];
      
      const promoOffers = validOffers.filter(offer => 
        this.isPromoOffer(offer.offerDetails!.fareFamily)
      );

      const analysis: AerolineasPriceAnalysis = {
        route: `${origin}-${destination}`,
        period: `${fromDate} to ${toDate}`,
        minPrice: prices.length > 0 ? Math.min(...prices) : undefined,
        maxPrice: prices.length > 0 ? Math.max(...prices) : undefined,
        avgPrice: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : undefined,
        minMiles: miles.length > 0 ? Math.min(...miles) : undefined,
        maxMiles: miles.length > 0 ? Math.max(...miles) : undefined,
        avgMiles: miles.length > 0 ? Math.round(miles.reduce((a, b) => a + b, 0) / miles.length) : undefined,
        totalOffers: validOffers.length,
        promoOffers: promoOffers.length,
        regularOffers: validOffers.length - promoOffers.length,
        availabilityCalendar: validOffers.reduce((acc, offer) => {
          acc[offer.departure] = !offer.soldOut;
          return acc;
        }, {} as Record<string, boolean>),
        lastUpdated: new Date()
      };

      return analysis;
    } catch (error) {
      scrapingLogger.error('[AEROLINEAS] Error analyzing prices', error as Error);
      throw error;
    }
  }

  /**
   * Verificar disponibilidad de millas para fechas específicas
   */
  async checkMilesAvailability(
    origin: string,
    destination: string,
    dates: string[],
    maxMiles?: number
  ): Promise<Record<string, boolean>> {
    const availability: Record<string, boolean> = {};
    
    for (const date of dates) {
      try {
        const searchParams: AerolineasSearchParams = {
          origin,
          destination,
          departureDate: date,
          adults: 1,
          cabinClass: 'Economy',
          flightType: 'ONE_WAY',
          awardBooking: true,
          flexDates: false
        };

        const response = await this.searchSpecificFlights(searchParams);
        const hasAvailability = this.hasAvailableSeats(response, maxMiles);
        availability[date] = hasAvailability;
        
        // Delay para evitar rate limiting
        await this.sleep(this.config.rateLimit.delayBetweenRequests);
      } catch (error) {
        scrapingLogger.warn(`[AEROLINEAS] Error checking availability for ${date}`, error as Error);
        availability[date] = false;
      }
    }

    return availability;
  }

  /**
   * Verificar si hay asientos disponibles
   */
  private hasAvailableSeats(response: AerolineasFlightResponse, maxMiles?: number): boolean {
    const allOffers = [
      ...Object.values(response.alternateOffers || {}).flat(),
      ...Object.values(response.brandedOffers || {}).flat()
    ];

    return allOffers.some(offer => {
      const hasSeats = offer.availableSeats > 0;
      const withinMilesLimit = !maxMiles || !offer.miles || offer.miles <= maxMiles;
      return hasSeats && withinMilesLimit;
    });
  }

  /**
   * Sleep utility para rate limiting
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Manejo centralizado de errores de API
   */
  private handleApiError(error: any, operation: string): void {
    const errorInfo: any = {
      operation,
      baseUrl: this.baseUrl,
      timestamp: new Date().toISOString()
    };

    if (error.response) {
      // Error de respuesta HTTP
      const statusCode = error.response.status;
      const statusText = error.response.statusText;
      const responseData = error.response.data;

      errorInfo.statusCode = statusCode;
      errorInfo.statusText = statusText;
      errorInfo.responseData = responseData;

      if (statusCode === 401) {
        scrapingLogger.error(`[AEROLINEAS] Authentication error during ${operation}`, error, {
          ...errorInfo,
          message: 'API requires authentication - check credentials or session tokens',
          suggestion: 'Verify AEROLINEAS_API_URL and authentication headers'
        });
      } else if (statusCode === 403) {
        scrapingLogger.error(`[AEROLINEAS] Access forbidden during ${operation}`, error, {
          ...errorInfo,
          message: 'API access forbidden - check permissions or rate limits'
        });
      } else if (statusCode === 404) {
        scrapingLogger.error(`[AEROLINEAS] Endpoint not found during ${operation}`, error, {
          ...errorInfo,
          message: 'API endpoint not found - check URL configuration'
        });
      } else if (statusCode >= 500) {
        scrapingLogger.error(`[AEROLINEAS] Server error during ${operation}`, error, {
          ...errorInfo,
          message: 'API server error - may be temporary'
        });
      } else {
        scrapingLogger.error(`[AEROLINEAS] HTTP error during ${operation}`, error, errorInfo);
      }
    } else if (error.request) {
      // Error de red/conexión
      scrapingLogger.error(`[AEROLINEAS] Network error during ${operation}`, error, {
        ...errorInfo,
        message: 'Network error - check internet connection or API availability',
        code: error.code
      });
    } else {
      // Error genérico
      scrapingLogger.error(`[AEROLINEAS] Error during ${operation}`, error, {
        ...errorInfo,
        message: error.message
      });
    }
  }

  /**
   * Testear conectividad con la API de Aerolíneas
   */
  async testApiConnectivity(): Promise<{ success: boolean; endpoints: Record<string, any> }> {
    const results = {
      success: false,
      endpoints: {} as Record<string, any>
    };

    // Diferentes URLs base para probar
    const baseUrls = [
      'https://api.aerolineas.com.ar',
      'https://www.aerolineas.com.ar/api',
      'https://www.aerolineas.com.ar/es/api',
      'https://booking.aerolineas.com.ar/api'
    ];

    // Diferentes endpoints para probar
    const endpoints = [
      '/v1/flights/offers',
      '/v1/localization/languageBundles/es-AR_flightOffers',
      '/flights/offers',
      '/api/v1/flights/offers',
      '/search/flights'
    ];

    for (const baseUrl of baseUrls) {
      for (const endpoint of endpoints) {
        try {
          const testUrl = `${baseUrl}${endpoint}`;
          scrapingLogger.info(`[AEROLINEAS] Testing endpoint: ${testUrl}`);
          
          const response = await axios.get(testUrl, {
            headers: this.headers,
            timeout: 10000,
            validateStatus: () => true // No rechazar por códigos de estado
          });

          results.endpoints[testUrl] = {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            dataType: typeof response.data,
            hasData: !!response.data
          };

          if (response.status < 400) {
            results.success = true;
            scrapingLogger.info(`[AEROLINEAS] Found working endpoint: ${testUrl} (${response.status})`);
          }
        } catch (error: any) {
          results.endpoints[`${baseUrl}${endpoint}`] = {
            error: error.message,
            code: error.code,
            status: error.response?.status
          };
        }
      }
    }

    return results;
  }

  /**
   * Obtener configuración de la API desde el sitio web
   */
  async getApiConfiguration(): Promise<{ apiUrl?: string; endpoints?: any; headers?: any }> {
    try {
      // Intentar obtener la configuración desde la página principal
      const response = await axios.get('https://www.aerolineas.com.ar/', {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      const html = response.data;
      const config: any = {};

      // Buscar configuración de API en el HTML
      const apiUrlMatch = html.match(/apiUrl["\s]*:["\s]*([^"]+)/i);
      if (apiUrlMatch) {
        config.apiUrl = apiUrlMatch[1];
      }

      // Buscar endpoints en el HTML
      const endpointsMatch = html.match(/endpoints["\s]*:["\s]*{([^}]+)}/i);
      if (endpointsMatch) {
        try {
          config.endpoints = JSON.parse(`{${endpointsMatch[1]}}`);
        } catch (e) {
          // Ignore parse errors
        }
      }

      scrapingLogger.info('[AEROLINEAS] API configuration extracted from website', config);
      return config;
    } catch (error) {
      scrapingLogger.warn('[AEROLINEAS] Could not extract API configuration from website', error as Error);
      return {};
    }
  }

  /**
   * Generar datos mock para desarrollo
   */
  private generateMockDeals(
    origin: string,
    destination: string,
    departureDate: string,
    options: any
  ): AerolineasDeal[] {
    const mockDeals: AerolineasDeal[] = [];
    
    // Generar algunas ofertas mock realistas
    const baseMiles = 45000;
    const basePrice = 800;
    
    for (let i = 0; i < 3; i++) {
      const deal: AerolineasDeal = {
        id: `mock_${Date.now()}_${i}`,
        origin,
        destination,
        departureDate,
        miles: baseMiles + (i * 10000),
        price: basePrice + (i * 200),
        currency: 'ARS',
        cabinClass: options.cabinClass || 'Economy',
        flightType: 'ONE_WAY',
        fareFamily: i === 0 ? 'PROMO_PLUS' : 'STANDARD',
        availableSeats: 9 - i,
        segments: [{
          flightNumber: `AR${1200 + i}`,
          departureAirport: origin,
          arrivalAirport: destination,
          departureTime: `${departureDate}T08:${30 + i * 10}:00`,
          arrivalTime: `${departureDate}T12:${30 + i * 10}:00`,
          duration: 'PT4H0M',
          aircraft: 'Boeing 737-800',
          airline: 'AR',
          cabinClass: options.cabinClass || 'Economy',
          bookingClass: 'O',
          stops: 0
        }],
        restrictions: ['No cambios', 'No reembolsos'],
        isPromo: i === 0,
        foundAt: new Date()
      };
      
      if (!options.maxMiles || (deal.miles && deal.miles <= options.maxMiles)) {
        mockDeals.push(deal);
      }
    }
    
    return mockDeals.filter(deal => deal.isPromo);
  }
}
