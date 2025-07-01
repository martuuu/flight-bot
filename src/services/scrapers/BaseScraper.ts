import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { FlightSearchParams, FlightResult, ScrapingResult, AirlineConfig } from '@/types';
import { scrapingLogger } from '@/utils/logger';
import { airlineConfigs } from '@/config';

/**
 * Scraper base para aerolíneas
 */
export abstract class BaseScraper {
  protected httpClient: AxiosInstance;
  protected config: AirlineConfig;
  protected lastRequestTime = 0;

  constructor(config: AirlineConfig) {
    this.config = config;
    this.httpClient = axios.create({
      timeout: config.timeout,
      headers: config.headers,
    });

    this.setupInterceptors();
  }

  /**
   * Configurar interceptores de HTTP
   */
  private setupInterceptors(): void {
    // Rate limiting
    this.httpClient.interceptors.request.use(async (config) => {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      const minInterval = this.config.rateLimit.windowMs / this.config.rateLimit.requests;

      if (timeSinceLastRequest < minInterval) {
        const waitTime = minInterval - timeSinceLastRequest;
        await this.sleep(waitTime);
      }

      this.lastRequestTime = Date.now();
      return config;
    });

    // Logging de requests
    this.httpClient.interceptors.request.use((config) => {
      scrapingLogger.debug(`Request to ${this.config.name}`, {
        url: config.url,
        method: config.method,
      });
      return config;
    });

    // Logging de responses
    this.httpClient.interceptors.response.use(
      (response) => {
        scrapingLogger.debug(`Response from ${this.config.name}`, {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      (error) => {
        scrapingLogger.error(`Request failed for ${this.config.name}`, error, {
          url: error.config?.url,
          status: error.response?.status,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Buscar vuelos (implementar en cada scraper específico)
   */
  abstract searchFlights(params: FlightSearchParams): Promise<ScrapingResult>;

  /**
   * Hacer request con retry automático
   */
  protected async makeRequest<T>(config: AxiosRequestConfig): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await this.httpClient.request<T>(config);
        return response.data;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.config.retryAttempts) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          scrapingLogger.warn(`Retry attempt ${attempt} for ${this.config.name}`, { delay });
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  /**
   * Validar parámetros de búsqueda
   */
  protected validateSearchParams(params: FlightSearchParams): void {
    if (!params.origin || !params.destination) {
      throw new Error('Origin and destination are required');
    }

    if (params.origin === params.destination) {
      throw new Error('Origin and destination cannot be the same');
    }

    if (params.departureDate < new Date()) {
      throw new Error('Departure date cannot be in the past');
    }

    if (params.returnDate && params.returnDate <= params.departureDate) {
      throw new Error('Return date must be after departure date');
    }
  }

  /**
   * Sleep utility
   */
  protected async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Formatear fecha para API
   */
  protected formatDateForAPI(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}

/**
 * Scraper para Avianca (Mock implementation)
 */
export class AviancaScraper extends BaseScraper {
  constructor() {
    super(airlineConfigs.AVIANCA as AirlineConfig);
  }

  async searchFlights(params: FlightSearchParams): Promise<ScrapingResult> {
    try {
      this.validateSearchParams(params);

      scrapingLogger.info(`Searching Avianca flights: ${params.origin} → ${params.destination}`);

      // TODO: Implementar llamada real a API de Avianca
      // Por ahora retornamos datos mock
      const mockFlights = this.generateMockFlights(params);

      return {
        success: true,
        flights: mockFlights,
        timestamp: new Date(),
        airline: 'Avianca',
        searchParams: params,
      };

    } catch (error) {
      scrapingLogger.error('Error searching Avianca flights', error as Error, params);
      return {
        success: false,
        flights: [],
        error: (error as Error).message,
        timestamp: new Date(),
        airline: 'Avianca',
        searchParams: params,
      };
    }
  }

  private generateMockFlights(params: FlightSearchParams): FlightResult[] {
    // Generar 1-3 vuelos mock para demostración
    const flightCount = Math.floor(Math.random() * 3) + 1;
    const flights: FlightResult[] = [];

    for (let i = 0; i < flightCount; i++) {
      const basePrice = this.getBasePriceForRoute(params.origin, params.destination);
      const variation = (Math.random() - 0.5) * 0.3; // ±15% variation
      const price = Math.round(basePrice * (1 + variation));

      flights.push({
        airline: 'Avianca',
        flightNumber: `AV${Math.floor(Math.random() * 9000) + 1000}`,
        origin: params.origin,
        destination: params.destination,
        departureDate: params.departureDate,
        arrivalDate: new Date(params.departureDate.getTime() + (Math.random() * 8 + 2) * 3600000),
        price,
        currency: 'COP',
        availableSeats: Math.floor(Math.random() * 50) + 1,
        cabinClass: params.cabinClass || 'economy',
        bookingUrl: `https://avianca.com/booking?flight=AV${Math.floor(Math.random() * 9000) + 1000}`,
        duration: Math.floor(Math.random() * 480) + 120, // 2-10 hours
        stops: Math.random() > 0.7 ? 1 : 0, // 30% chance of 1 stop
      });
    }

    return flights;
  }

  private getBasePriceForRoute(origin: string, destination: string): number {
    // Precios base aproximados en COP
    const domesticRoutes: Record<string, number> = {
      'BOG-MDE': 300000,
      'BOG-CTG': 400000,
      'BOG-CLO': 350000,
      'MDE-CTG': 350000,
    };

    const internationalRoutes: Record<string, number> = {
      'BOG-MIA': 1200000,
      'BOG-JFK': 1800000,
      'BOG-MAD': 2500000,
      'BOG-LIM': 600000,
      'MDE-MIA': 1300000,
      'CTG-MIA': 1100000,
    };

    const routeKey = `${origin}-${destination}`;
    const reverseKey = `${destination}-${origin}`;

    return domesticRoutes[routeKey] || 
           domesticRoutes[reverseKey] || 
           internationalRoutes[routeKey] || 
           internationalRoutes[reverseKey] || 
           800000; // Default price
  }
}

/**
 * Scraper para LATAM (Mock implementation)
 */
export class LatamScraper extends BaseScraper {
  constructor() {
    super(airlineConfigs.LATAM as AirlineConfig);
  }

  async searchFlights(params: FlightSearchParams): Promise<ScrapingResult> {
    try {
      this.validateSearchParams(params);

      scrapingLogger.info(`Searching LATAM flights: ${params.origin} → ${params.destination}`);

      // TODO: Implementar llamada real a API de LATAM
      const mockFlights = this.generateMockFlights(params);

      return {
        success: true,
        flights: mockFlights,
        timestamp: new Date(),
        airline: 'LATAM',
        searchParams: params,
      };

    } catch (error) {
      scrapingLogger.error('Error searching LATAM flights', error as Error, params);
      return {
        success: false,
        flights: [],
        error: (error as Error).message,
        timestamp: new Date(),
        airline: 'LATAM',
        searchParams: params,
      };
    }
  }

  private generateMockFlights(params: FlightSearchParams): FlightResult[] {
    const flightCount = Math.floor(Math.random() * 4) + 1;
    const flights: FlightResult[] = [];

    for (let i = 0; i < flightCount; i++) {
      const basePrice = this.getBasePriceForRoute(params.origin, params.destination);
      const variation = (Math.random() - 0.5) * 0.25;
      const price = Math.round(basePrice * (1 + variation));

      flights.push({
        airline: 'LATAM',
        flightNumber: `LA${Math.floor(Math.random() * 9000) + 1000}`,
        origin: params.origin,
        destination: params.destination,
        departureDate: params.departureDate,
        arrivalDate: new Date(params.departureDate.getTime() + (Math.random() * 8 + 2) * 3600000),
        price,
        currency: 'COP',
        availableSeats: Math.floor(Math.random() * 60) + 1,
        cabinClass: params.cabinClass || 'economy',
        bookingUrl: `https://latam.com/booking?flight=LA${Math.floor(Math.random() * 9000) + 1000}`,
        duration: Math.floor(Math.random() * 420) + 140,
        stops: Math.random() > 0.8 ? 1 : 0,
      });
    }

    return flights;
  }

  private getBasePriceForRoute(origin: string, destination: string): number {
    // Precios LATAM típicamente 5-10% más altos que Avianca
    const aviancaScraper = new AviancaScraper();
    const basePrice = (aviancaScraper as any).getBasePriceForRoute(origin, destination);
    return Math.round(basePrice * 1.07);
  }
}

/**
 * Factory para crear scrapers
 */
export class ScraperFactory {
  static createScraper(airline: string): BaseScraper {
    switch (airline.toUpperCase()) {
      case 'AVIANCA':
        return new AviancaScraper();
      case 'LATAM':
        return new LatamScraper();
      case 'ARAJET':
        const { ArajetScraper } = require('./ArajetScraper');
        return new ArajetScraper();
      // TODO: Agregar más scrapers
      // case 'VIVA':
      //   return new VivaScraper();
      // case 'WINGO':
      //   return new WingoScraper();
      default:
        throw new Error(`Scraper not implemented for airline: ${airline}`);
    }
  }

  static getSupportedAirlines(): string[] {
    return ['AVIANCA', 'LATAM', 'ARAJET'];
  }
}
