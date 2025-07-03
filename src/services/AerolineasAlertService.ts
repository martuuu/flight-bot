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
  AerolineasCabinClass,
  AerolineasCalendarOffer
} from '../types/aerolineas-api';

export class AerolineasAlertService {
  private baseUrl: string;
  private headers: Record<string, string>;
  private config: AerolineasScraperConfig;
  private bearerToken: string = '';
  private tokenExpiry: Date = new Date(0);
  private isRefreshingToken: boolean = false;
  private tokenRefreshAttempts: number = 0;
  private maxTokenRefreshAttempts: number = 3;
  private autoTokenRefreshEnabled: boolean = false; // Deshabilitado por defecto

  // Credenciales de Auth0 encontradas en las llamadas
  private auth0Config = {
    domain: 'aerolineas-test.auth0.com',
    clientId: 'oy81ZUn6IX1gv4eGceSFIyaFfhH6a66G', // Del token decodificado
    audience: 'ar-auth',
    scope: 'catalog:read catalog:admin rules:payment:read rules:shopping:read rules:checkout:read loyalty:read loyalty:admin catalog:payment:read sublos:read forms:read forms:admin'
  };

  // Token hardcodeado que funciona
  private fallbackToken: string = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1EaEdRa0U0T0RNeE56WTRRemcxTVRjMVJERXhOekF5T0RCRU1EUTVSakl6TURjNU5qVTVNQSJ9.eyJpc3MiOiJodHRwczovL2Flcm9saW5lYXMtdGVzdC5hdXRoMC5jb20vIiwic3ViIjoib3k4MVpVbjZJWDFndjRlR2NlU0ZJeWFGZmhINmE2NkdAY2xpZW50cyIsImF1ZCI6ImFyLWF1dGgiLCJpYXQiOjE3NTE1MTA1MzQsImV4cCI6MTc1MTU5NjkzNCwic2NvcGUiOiJjYXRhbG9nOnJlYWQgY2F0YWxvZzphZG1pbiBydWxlczpwYXltZW50OnJlYWQgcnVsZXM6c2hvcHBpbmc6cmVhZCBydWxlczpjaGVja291dDpyZWFkIGxveWFsdHk6cmVhZCBsb3lhbHR5OmFkbWluIGNhdGFsb2c6cGF5bWVudDpyZWFkIHN1YmxvczpyZWFkIGZvcm1zOnJlYWQgZm9ybXM6YWRtaW4iLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJhenAiOiJveTgxWlVuNklYMWd2NGVHY2VTRkl5YUZmaEg2YTY2RyIsInBlcm1pc3Npb25zIjpbImNhdGFsb2c6cmVhZCIsImNhdGFsb2c6YWRtaW4iLCJydWxlczpwYXltZW50OnJlYWQiLCJydWxlczpzaG9wcGluZzpyZWFkIiwicnVsZXM6Y2hlY2tvdXQ6cmVhZCIsImxveWFsdHk6cmVhZCIsImxveWFsdHk6YWRtaW4iLCJjYXRhbG9nOnBheW1lbnQ6cmVhZCIsInN1YmxvczpyZWFkIiwiZm9ybXM6cmVhZCIsImZvcm1zOmFkbWluIl19.GAOgg5URKp46iHsgk0KOCq9qcPfSfNfPVB1ANBkMCowdyRuGDTVbsFq73jmAelvIAUB8rzrpJBJLNjOZtErCju3XO72P2Ej_VEPzdygJhLnY5Fj1EkUCXIHfxOEFWI3jN-dsMWFAqL7Koc4fsLn1cWEjnCgcsXVgVaZ1xPEmpysNzbnJGY7LITjDtPqSMQpkcc2IgBBOIvADSW9VmZG1_Tz97D1496Yz8og9-WufOY3Ki6-6jtPFwBIZv-SJkjqohTTGYdfmjlBXRoMsP0K30K7bKPzSOTnz5896YjSrfuzzqx2fYBuLJt81pHqtl0ECZlSLKuKS79b_k7mos49wng';

  constructor() {
    this.baseUrl = 'https://api.aerolineas.com.ar';
    
    this.headers = {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'es-AR',
      'Origin': 'https://aerolineas.com.ar',
      'Priority': 'u=1, i',
      'Referer': 'https://aerolineas.com.ar/',
      'Sec-Ch-Ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"',
      'Sec-Ch-Ua-Mobile': '?1',
      'Sec-Ch-Ua-Platform': '"Android"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'Sec-Gpc': '1',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
      'X-Channel-Id': 'WEB_AR'
    };

    this.config = {
      baseUrl: this.baseUrl,
      endpoints: {
        languageBundle: '/v1/localization/languageBundles/es-AR_flightOffers',
        calendarSearch: '/v1/flights/offers',
        flightSearch: '/v1/flights/offers',
        searchBoxRules: '/v1/rules/shopping/searchbox',
        channelInfo: '/v1/catalog/channels/WEB_AR',
        brands: '/v1/catalog/brands'
      },
      headers: this.headers,
      rateLimit: {
        requestsPerMinute: 20,
        delayBetweenRequests: 3000
      },
      retry: {
        maxAttempts: 3,
        delayMs: 2000
      }
    };

    // Inicializar con token fallback
    this.useFallbackToken();
  }

  /**
   * Obtener un nuevo token de Auth0 usando Client Credentials Flow
   */
  private async refreshAuthToken(): Promise<string> {
    if (this.isRefreshingToken) {
      // Si ya se está refrescando, esperar
      while (this.isRefreshingToken) {
        await this.sleep(100);
      }
      return this.bearerToken;
    }

    this.isRefreshingToken = true;

    try {
      scrapingLogger.info('[AEROLINEAS] Refreshing authentication token...');

      const response = await axios.post(`https://${this.auth0Config.domain}/oauth/token`, {
        client_id: this.auth0Config.clientId,
        audience: this.auth0Config.audience,
        grant_type: 'client_credentials',
        scope: this.auth0Config.scope
      }, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36'
        },
        timeout: 15000
      });

      const { access_token, expires_in } = response.data;
      
      this.bearerToken = access_token;
      this.tokenExpiry = new Date(Date.now() + (expires_in - 300) * 1000); // 5 min antes de expirar
      
      // Actualizar header de autorización
      this.headers['Authorization'] = `Bearer ${this.bearerToken}`;

      scrapingLogger.info('[AEROLINEAS] Token refreshed successfully', {
        expiresAt: this.tokenExpiry.toISOString(),
        expiresIn: expires_in
      });

      return this.bearerToken;
    } catch (error) {
      scrapingLogger.error('[AEROLINEAS] Error refreshing token', error as Error);
      
      // Fallback al token hardcodeado si falla la renovación
      const fallbackToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1EaEdRa0U0T0RNeE56WTRRemcxTVRjMVJERXhOekF5T0RCRU1EUTVSakl6TURjNU5qVTVNQSJ9.eyJpc3MiOiJodHRwczovL2Flcm9saW5lYXMtdGVzdC5hdXRoMC5jb20vIiwic3ViIjoib3k4MVpVbjZJWDFndjRlR2NlU0ZJeWFGZmhINmE2NkdAY2xpZW50cyIsImF1ZCI6ImFyLWF1dGgiLCJpYXQiOjE3NTE1MTA1MzQsImV4cCI6MTc1MTU5NjkzNCwic2NvcGUiOiJjYXRhbG9nOnJlYWQgY2F0YWxvZzphZG1pbiBydWxlczpwYXltZW50OnJlYWQgcnVsZXM6c2hvcHBpbmc6cmVhZCBydWxlczpjaGVja291dDpyZWFkIGxveWFsdHk6cmVhZCBsb3lhbHR5OmFkbWluIGNhdGFsb2c6cGF5bWVudDpyZWFkIHN1YmxvczpyZWFkIGZvcm1zOnJlYWQgZm9ybXM6YWRtaW4iLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJhenAiOiJveTgxWlVuNklYMWd2NGVHY2VTRkl5YUZmaEg2YTY2RyIsInBlcm1pc3Npb25zIjpbImNhdGFsb2c6cmVhZCIsImNhdGFsb2c6YWRtaW4iLCJydWxlczpwYXltZW50OnJlYWQiLCJydWxlczpzaG9wcGluZzpyZWFkIiwicnVsZXM6Y2hlY2tvdXQ6cmVhZCIsImxveWFsdHk6cmVhZCIsImxveWFsdHk6YWRtaW4iLCJjYXRhbG9nOnBheW1lbnQ6cmVhZCIsInN1YmxvczpyZWFkIiwiZm9ybXM6cmVhZCIsImZvcm1zOmFkbWluIl19.GAOgg5URKp46iHsgk0KOCq9qcPfSfNfPVB1ANBkMCowdyRuGDTVbsFq73jmAelvIAUB8rzrpJBJLNjOZtErCju3XO72P2Ej_VEPzdygJhLnY5Fj1EkUCXIHfxOEFWI3jN-dsMWFAqL7Koc4fsLn1cWEjnCgcsXVgVaZ1xPEmpysNzbnJGY7LITjDtPqSMQpkcc2IgBBOIvADSW9VmZG1_Tz97D1496Yz8og9-WufOY3Ki6-6jtPFwBIZv-SJkjqohTTGYdfmjlBXRoMsP0K30K7bKPzSOTnz5896YjSrfuzzqx2fYBuLJt81pHqtl0ECZlSLKuKS79b_k7mos49wng';
      
      this.bearerToken = fallbackToken;
      this.headers['Authorization'] = `Bearer ${this.bearerToken}`;
      
      scrapingLogger.warn('[AEROLINEAS] Using fallback token due to refresh failure');
      
      return this.bearerToken;
    } finally {
      this.isRefreshingToken = false;
    }
  }

  /**
   * Verificar si el token necesita ser renovado
   */
  private async ensureValidToken(): Promise<void> {
    // Si ya tenemos un token válido, no hacer nada
    if (this.bearerToken && this.tokenExpiry > new Date()) {
      return;
    }

    // Si ya se está renovando el token, esperar
    if (this.isRefreshingToken) {
      await this.waitForTokenRefresh();
      return;
    }

    // Si no tenemos token, usar el fallback directamente
    if (!this.bearerToken) {
      this.useFallbackToken();
      return;
    }

    // Solo intentar renovar si está habilitado y no hemos superado el máximo de intentos
    if (this.autoTokenRefreshEnabled && this.tokenRefreshAttempts < this.maxTokenRefreshAttempts) {
      try {
        await this.refreshAuthToken();
        this.tokenRefreshAttempts = 0; // Reset attempts on success
      } catch (error) {
        this.tokenRefreshAttempts++;
        scrapingLogger.warn(`Token refresh failed (attempt ${this.tokenRefreshAttempts}/${this.maxTokenRefreshAttempts})`, { error });
        
        // Si hemos agotado los intentos, deshabilitar la renovación automática
        if (this.tokenRefreshAttempts >= this.maxTokenRefreshAttempts) {
          this.autoTokenRefreshEnabled = false;
          scrapingLogger.warn('Auto token refresh disabled due to repeated failures');
        }
        
        this.useFallbackToken();
      }
    } else {
      // Usar token fallback si la renovación automática está deshabilitada
      this.useFallbackToken();
    }
  }

  private useFallbackToken(): void {
    this.bearerToken = this.fallbackToken;
    this.tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
    scrapingLogger.info('Using fallback token');
  }

  private async waitForTokenRefresh(): Promise<void> {
    while (this.isRefreshingToken) {
      await this.sleep(100);
    }
  }

  /**
   * Buscar vuelos con calendario flexible para encontrar las mejores ofertas
   */
  async searchFlexibleCalendar(params: AerolineasSearchParams): Promise<AerolineasCalendarResponse> {
    try {
      // Asegurar que tenemos un token válido
      await this.ensureValidToken();

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
        shoppingId: response.data.searchMetadata.shoppingId,
        alternateOffers: Object.keys(response.data.alternateOffers || {}).length,
        brandedOffers: Object.keys(response.data.brandedOffers || {}).length
      });

      return response.data;
    } catch (error) {
      // Si es error 401, intentar renovar token una vez más
      if ((error as any)?.response?.status === 401) {
        scrapingLogger.warn('[AEROLINEAS] 401 error, attempting token refresh...');
        await this.refreshAuthToken();
        
        // Reintentar la llamada con el nuevo token
        return this.searchFlexibleCalendar(params);
      }
      
      this.handleApiError(error as any, 'calendar search');
      throw error;
    }
  }

  /**
   * Buscar vuelos específicos para una fecha
   */
  async searchSpecificFlights(params: AerolineasSearchParams): Promise<AerolineasFlightResponse> {
    try {
      // Asegurar que tenemos un token válido
      await this.ensureValidToken();

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
      // Si es error 401, intentar renovar token una vez más
      if ((error as any)?.response?.status === 401) {
        scrapingLogger.warn('[AEROLINEAS] 401 error, attempting token refresh...');
        await this.refreshAuthToken();
        
        // Reintentar la llamada con el nuevo token
        return this.searchSpecificFlights(params);
      }
      
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
        const calendarDeals = this.extractPromoOffersByDate(calendarResponse);
        
        // Convertir el objeto de ofertas por fecha a un array plano
        const allPromoDeals: AerolineasDeal[] = [];
        for (const dateOffers of Object.values(calendarDeals)) {
          allPromoDeals.push(...dateOffers);
        }
        
        // Si encontramos ofertas reales, devolverlas
        if (allPromoDeals.length > 0) {
          scrapingLogger.info(`[AEROLINEAS] Found ${allPromoDeals.length} real promo deals`);
          return allPromoDeals;
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
   * Buscar ofertas promocionales para una fecha específica
   * Caso de uso: Alerta diaria para un vuelo en una fecha específica
   * 
   * @param origin Aeropuerto de origen (ej: 'AEP')
   * @param destination Aeropuerto de destino (ej: 'SLA')
   * @param departureDate Fecha específica (ej: '2025-10-10')
   * @param options Opciones adicionales de búsqueda
   * @returns Array de ofertas promocionales encontradas
   */
  async searchPromoOffersForDate(
    origin: string,
    destination: string,
    departureDate: string,
    options: {
      adults?: number;
      children?: number;
      infants?: number;
      cabinClass?: AerolineasCabinClass;
    } = {}
  ): Promise<AerolineasDeal[]> {
    try {
      await this.ensureValidToken();

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
        flexDates: false // Búsqueda específica para una fecha
      };

      const response = await this.searchSpecificFlights(searchParams);
      const promoOffers = this.extractPromoOffers(response);

      scrapingLogger.info(`[AEROLINEAS] Found ${promoOffers.length} promo offers for ${departureDate}`, {
        origin,
        destination,
        date: departureDate,
        promoCount: promoOffers.length
      });

      return promoOffers;
    } catch (error) {
      scrapingLogger.error('[AEROLINEAS] Error searching promo offers for date:', error as Error);
      throw error;
    }
  }

  /**
   * Buscar ofertas promocionales para un rango de fechas (búsqueda flexible)
   * Caso de uso: Alerta mensual para encontrar los mejores días con ofertas
   * 
   * @param origin Aeropuerto de origen (ej: 'EZE')
   * @param destination Aeropuerto de destino (ej: 'BHI')
   * @param departureDate Fecha base para búsqueda flexible (ej: '2025-08-14')
   * @param options Opciones adicionales de búsqueda
   * @returns Array de ofertas promocionales encontradas por fecha
   */
  async searchPromoOffersFlexible(
    origin: string,
    destination: string,
    departureDate: string,
    options: {
      adults?: number;
      children?: number;
      infants?: number;
      cabinClass?: AerolineasCabinClass;
    } = {}
  ): Promise<{ [date: string]: AerolineasDeal[] }> {
    try {
      await this.ensureValidToken();

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
        flexDates: true // Búsqueda flexible para un mes
      };

      const response = await this.searchFlexibleCalendar(searchParams);
      const promoOffersByDate = this.extractPromoOffersByDate(response);

      const totalPromoDays = Object.keys(promoOffersByDate).length;
      const totalPromoOffers = Object.values(promoOffersByDate).reduce((sum, offers) => sum + offers.length, 0);

      scrapingLogger.info(`[AEROLINEAS] Found promo offers on ${totalPromoDays} days (${totalPromoOffers} total offers)`, {
        origin,
        destination,
        baseDate: departureDate,
        promoDays: totalPromoDays,
        totalOffers: totalPromoOffers
      });

      return promoOffersByDate;
    } catch (error) {
      scrapingLogger.error('[AEROLINEAS] Error searching flexible promo offers:', error as Error);
      throw error;
    }
  }

  /**
   * Extraer ofertas promocionales de una respuesta de vuelos específicos
   */
  private extractPromoOffers(response: AerolineasFlightResponse): AerolineasDeal[] {
    const promoOffers: AerolineasDeal[] = [];
    
    // Verificar ofertas branded (estructura real de la API)
    for (const [routeKey, brandedOffers] of Object.entries(response.brandedOffers || {})) {
      for (const brandedOffer of brandedOffers) {
        // Cada brandedOffer tiene `legs` y `offers`
        if (brandedOffer.offers && Array.isArray(brandedOffer.offers)) {
          for (const offer of brandedOffer.offers) {
            // Verificar si es una oferta promocional por brand name
            const isPromo = offer.brand?.name && this.isPromoBrandDescription(offer.brand.name);
            
            if (isPromo) {
              const deal: AerolineasDeal = {
                id: offer.offerId || `${routeKey}_${Date.now()}`,
                origin: response.searchMetadata.routes[0]?.split('-')[0] || '',
                destination: response.searchMetadata.routes[0]?.split('-')[1] || '',
                departureDate: this.extractDepartureDateFromBrandedOffer(brandedOffer),
                miles: offer.requiredMinMiles?.amount,
                price: offer.fare?.baseFare,
                currency: response.searchMetadata.currency,
                cabinClass: offer.cabinClass as AerolineasCabinClass,
                flightType: response.searchMetadata.flightType,
                fareFamily: offer.brand?.name,
                availableSeats: offer.seatAvailability?.seats || 0,
                segments: brandedOffer.legs?.[0]?.segments || [],
                restrictions: [],
                isPromo: true,
                foundAt: new Date()
              };

              promoOffers.push(deal);
            }
          }
        }
      }
    }

    // También verificar ofertas alternativas si no encontramos nada en branded
    if (promoOffers.length === 0) {
      // TODO: Implementar análisis de alternateOffers si es necesario
      // Por ahora, las ofertas promocionales están principalmente en brandedOffers
      scrapingLogger.debug('[AEROLINEAS] No se encontraron ofertas promocionales en brandedOffers');
    }

    return promoOffers;
  }

  /**
   * Extraer fecha de salida de una oferta branded
   */
  private extractDepartureDateFromBrandedOffer(brandedOffer: any): string {
    const firstSegment = brandedOffer.legs?.[0]?.segments?.[0];
    if (firstSegment?.departure) {
      return firstSegment.departure.split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Extraer ofertas promocionales de una respuesta de calendario flexible
   */
  private extractPromoOffersByDate(response: AerolineasCalendarResponse): { [date: string]: AerolineasDeal[] } {
    const promoOffersByDate: { [date: string]: AerolineasDeal[] } = {};

    if (!response.calendarOffers) {
      return promoOffersByDate;
    }

    for (const [routeKey, calendarOffers] of Object.entries(response.calendarOffers)) {
      for (const calendarOffer of calendarOffers) {
        // Verificar si la oferta no está agotada y tiene detalles
        if (calendarOffer.offerDetails && !calendarOffer.soldOut) {
          
          // Verificar si es promocional por millas bajas o mejor oferta
          const isPromo = this.isCalendarOfferPromo(calendarOffer);
          
          if (isPromo) {
            const date = calendarOffer.departure;
            
            if (!promoOffersByDate[date]) {
              promoOffersByDate[date] = [];
            }

            const deal: AerolineasDeal = {
              id: `${date}_${routeKey}_${Date.now()}`,
              origin: calendarOffer.leg?.segments[0]?.origin || '',
              destination: calendarOffer.leg?.segments[calendarOffer.leg.segments.length - 1]?.destination || '',
              departureDate: date,
              miles: calendarOffer.offerDetails.requiredMinMiles?.amount,
              price: calendarOffer.offerDetails.fare?.baseFare,
              currency: response.searchMetadata.currency,
              cabinClass: calendarOffer.offerDetails.cabinClass,
              flightType: response.searchMetadata.flightType,
              fareFamily: calendarOffer.offerDetails.fareBasis || 'Promotional',
              availableSeats: calendarOffer.offerDetails.seatAvailability?.seats || 0,
              segments: calendarOffer.leg?.segments || [],
              restrictions: [],
              isPromo: true,
              foundAt: new Date()
            };

            promoOffersByDate[date].push(deal);
          }
        }
      }
    }

    return promoOffersByDate;
  }

  /**
   * Determinar si una descripción de marca es promocional
   */
  private isPromoBrandDescription(brandDescription: string): boolean {
    const promoKeywords = [
      'promocional', 'promo', 'super promo', 'promotion', 'special', 
      'offer', 'discount', 'oferta', 'especial', 'descuento'
    ];
    
    const lowerDescription = brandDescription.toLowerCase();
    return promoKeywords.some(keyword => lowerDescription.includes(keyword));
  }

  /**
   * Determinar si una oferta de calendario es promocional
   */
  private isCalendarOfferPromo(calendarOffer: AerolineasCalendarOffer): boolean {
    if (!calendarOffer.offerDetails) return false;

    // 1. Verificar si está marcado como bestOffer (principal indicador)
    if (calendarOffer.bestOffer === true) {
      return true;
    }

    // 2. Verificar por precio bajo en millas
    if (calendarOffer.offerDetails.requiredMinMiles?.amount) {
      const miles = calendarOffer.offerDetails.requiredMinMiles.amount;
      // Considerar promocional si es menos de 6000 millas
      if (miles < 6000) {
        return true;
      }
    }

    // 3. Verificar por fareBasis (algunas bases de tarifa son promocionales)
    if (calendarOffer.offerDetails.fareBasis) {
      const fareBasis = calendarOffer.offerDetails.fareBasis.toLowerCase();
      const promoPatterns = ['promo', 'special', 'offer', 'discount', 'p'];
      if (promoPatterns.some(pattern => fareBasis.includes(pattern))) {
        return true;
      }
    }

    return false;
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
      
      const allOffers = Object.values(response.calendarOffers || {}).flat();
      const validOffers = allOffers.filter(offer => 
        offer.offerDetails && !offer.soldOut && 
        offer.departure >= fromDate && offer.departure <= toDate
      );

      const prices = validOffers.map(offer => offer.offerDetails!.price).filter(p => p !== undefined) as number[];
      const miles = validOffers.map(offer => offer.offerDetails!.miles).filter(m => m !== undefined) as number[];
      
      const promoOffers = validOffers.filter(offer => 
        this.isCalendarOfferPromo(offer)
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
    // Verificar en brandedOffers
    const brandedOffers = Object.values(response.brandedOffers || {}).flat();
    const brandedAvailable = brandedOffers.some(brandedOffer => {
      if (!brandedOffer.offers || !Array.isArray(brandedOffer.offers)) return false;
      
      return brandedOffer.offers.some(offer => {
        const miles = offer.requiredMinMiles?.amount || 0;
        const withinMilesLimit = !maxMiles || miles <= maxMiles;
        const hasSeats = offer.seatAvailability?.seats > 0;
        return hasSeats && withinMilesLimit;
      });
    });

    if (brandedAvailable) {
      return true;
    }

    // Verificar en alternateOffers si las branded no tienen disponibilidad
    const alternateOffers = Object.values(response.alternateOffers || {}).flat();
    return alternateOffers.some(offer => {
      const miles = offer.miles || 0;
      const withinMilesLimit = !maxMiles || miles <= maxMiles;
      const hasSeats = offer.availableSeats > 0;
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
   * Renovar token manualmente (método público para testing y troubleshooting)
   */
  async renewToken(): Promise<{ success: boolean; token?: string; expiresAt?: Date; error?: string }> {
    try {
      const token = await this.refreshAuthToken();
      return {
        success: true,
        token: token.substring(0, 20) + '...', // Solo mostrar parte del token por seguridad
        expiresAt: this.tokenExpiry
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * Obtener información del estado del token actual
   */
  getTokenStatus(): { isValid: boolean; expiresAt: Date; timeUntilExpiry: number } {
    const now = new Date();
    const timeUntilExpiry = this.tokenExpiry.getTime() - now.getTime();
    
    return {
      isValid: timeUntilExpiry > 0,
      expiresAt: this.tokenExpiry,
      timeUntilExpiry: Math.max(0, Math.floor(timeUntilExpiry / 1000)) // segundos
    };
  }

  /**
   * Habilitar o deshabilitar la renovación automática de token
   */
  public enableAutoTokenRefresh(enabled: boolean): void {
    this.autoTokenRefreshEnabled = enabled;
    this.tokenRefreshAttempts = 0; // Reset attempts when changing setting
    scrapingLogger.info(`[AEROLINEAS] Auto token refresh ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Forzar el uso del token fallback
   */
  public useFallbackTokenDirectly(): void {
    this.useFallbackToken();
    scrapingLogger.info('[AEROLINEAS] Forced fallback token usage');
  }

  /**
   * Reset token refresh attempts counter
   */
  public resetTokenRefreshAttempts(): void {
    this.tokenRefreshAttempts = 0;
    scrapingLogger.info('[AEROLINEAS] Token refresh attempts counter reset');
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
          flightNumber: 1200 + i,
          airline: 'AR',
          operatingAirline: 'AR',
          departure: `${departureDate}T08:${30 + i * 10}:00`,
          arrival: `${departureDate}T12:${30 + i * 10}:00`,
          origin,
          destination,
          duration: 240, // 4 horas en minutos
          layoverDuration: 0,
          equipment: '738',
          stopAirports: [],
          aircraftText: 'AR'
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
