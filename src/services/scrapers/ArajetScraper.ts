import { BaseScraper } from './BaseScraper';
import { FlightResult, FlightSearchParams, ScrapingResult, AirlineConfig } from '../../types';
import { scrapingLogger } from '../../utils/logger';
import { AxiosRequestConfig } from 'axios';

interface ArajetSearchPayload {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
}

interface ArajetFlightResponse {
  // Esta interfaz se actualizará cuando tengamos la respuesta real de Arajet
  flights?: any[];
  outbound?: any[];
  inbound?: any[];
  success?: boolean;
  data?: any;
}

export class ArajetScraper extends BaseScraper {
  private searchEndpoint = ''; // Se configurará cuando tengamos el endpoint real
  
  constructor() {
    const config: AirlineConfig = {
      name: 'Arajet',
      code: 'DM',
      apiUrl: 'https://www.arajet.com',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Content-Type': 'application/json',
        'Origin': 'https://www.arajet.com',
        'Referer': 'https://www.arajet.com/',
      },
      rateLimit: {
        requests: 10,
        windowMs: 60000 // 1 minuto
      },
      timeout: 30000,
      retryAttempts: 3,
      isActive: true
    };
    super(config);
  }

  async searchFlights(params: FlightSearchParams): Promise<ScrapingResult> {
    const startTime = Date.now();
    scrapingLogger.info(`Searching Arajet flights: ${params.origin} -> ${params.destination} on ${params.departureDate.toISOString().split('T')[0]}`);

    try {
      // Si no tenemos el endpoint configurado, usar datos mock
      if (!this.searchEndpoint) {
        scrapingLogger.warn('Arajet search endpoint not configured. Using mock data.');
        const mockFlights = this.generateMockFlights(params);
        return {
          success: true,
          flights: mockFlights,
          timestamp: new Date(),
          airline: this.config.name,
          searchParams: params
        };
      }

      const searchPayload: ArajetSearchPayload = {
        origin: params.origin,
        destination: params.destination,
        departureDate: params.departureDate.toISOString().split('T')[0],
        passengers: {
          adults: params.passengers || 1,
          children: 0,
          infants: 0
        }
      };

      if (params.returnDate) {
        searchPayload.returnDate = params.returnDate.toISOString().split('T')[0];
      }

      const requestConfig: AxiosRequestConfig = {
        method: 'POST',
        url: this.searchEndpoint,
        data: searchPayload,
      };

      const response = await this.makeRequest<ArajetFlightResponse>(requestConfig);
      const flights = this.parseFlights(response, params);

      const duration = Date.now() - startTime;
      scrapingLogger.info(`Arajet search completed in ${duration}ms. Found ${flights.length} flights.`);

      return {
        success: true,
        flights,
        timestamp: new Date(),
        airline: this.config.name,
        searchParams: params
      };

    } catch (error) {
      scrapingLogger.error('Error searching Arajet flights:', error as Error);
      
      // Fallback a datos mock en caso de error
      const mockFlights = this.generateMockFlights(params);
      return {
        success: false,
        flights: mockFlights,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        airline: this.config.name,
        searchParams: params
      };
    }
  }

  private parseFlights(data: ArajetFlightResponse, params: FlightSearchParams): FlightResult[] {
    const flights: FlightResult[] = [];

    try {
      // TODO: Implementar parsing real cuando tengamos la estructura de respuesta
      if (data.flights) {
        data.flights.forEach((flight: any) => {
          flights.push({
            airline: 'Arajet',
            flightNumber: flight.flightNumber || 'DM-XXX',
            origin: flight.origin || params.origin,
            destination: flight.destination || params.destination,
            departureDate: new Date(flight.departureDate || params.departureDate),
            arrivalDate: new Date(flight.arrivalDate || params.departureDate),
            price: flight.price || 0,
            currency: flight.currency || 'USD',
            availableSeats: flight.availableSeats || 50,
            cabinClass: flight.cabinClass || 'economy',
            bookingUrl: flight.bookingUrl || 'https://www.arajet.com',
            duration: flight.duration || 240, // minutos
            stops: flight.stops || 0
          });
        });
      }
    } catch (error) {
      scrapingLogger.error('Error parsing Arajet flights:', error as Error);
    }

    return flights;
  }

  private generateMockFlights(params: FlightSearchParams): FlightResult[] {
    scrapingLogger.debug('Generating Arajet mock data');
    
    const mockFlights: FlightResult[] = [
      {
        airline: 'Arajet',
        flightNumber: 'DM-123',
        origin: params.origin,
        destination: params.destination,
        departureDate: new Date(params.departureDate.getTime() + 8 * 60 * 60 * 1000), // 8 AM
        arrivalDate: new Date(params.departureDate.getTime() + 12 * 60 * 60 * 1000), // 12 PM
        price: 189,
        currency: 'USD',
        availableSeats: 45,
        cabinClass: 'economy',
        bookingUrl: 'https://www.arajet.com/booking/DM123',
        duration: 240, // 4 horas
        stops: 0
      },
      {
        airline: 'Arajet',
        flightNumber: 'DM-456',
        origin: params.origin,
        destination: params.destination,
        departureDate: new Date(params.departureDate.getTime() + 15 * 60 * 60 * 1000), // 3 PM
        arrivalDate: new Date(params.departureDate.getTime() + 19 * 60 * 60 * 1000), // 7 PM
        price: 215,
        currency: 'USD',
        availableSeats: 32,
        cabinClass: 'economy',
        bookingUrl: 'https://www.arajet.com/booking/DM456',
        duration: 240,
        stops: 0
      }
    ];

    // Si es ida y vuelta, agregar vuelos de regreso
    if (params.returnDate) {
      mockFlights.push(
        {
          airline: 'Arajet',
          flightNumber: 'DM-789',
          origin: params.destination,
          destination: params.origin,
          departureDate: new Date(params.returnDate.getTime() + 9 * 60 * 60 * 1000), // 9 AM
          arrivalDate: new Date(params.returnDate.getTime() + 13 * 60 * 60 * 1000), // 1 PM
          price: 205,
          currency: 'USD',
          availableSeats: 28,
          cabinClass: 'economy',
          bookingUrl: 'https://www.arajet.com/booking/DM789',
          duration: 240,
          stops: 0
        },
        {
          airline: 'Arajet',
          flightNumber: 'DM-012',
          origin: params.destination,
          destination: params.origin,
          departureDate: new Date(params.returnDate.getTime() + 16 * 60 * 60 * 1000), // 4 PM
          arrivalDate: new Date(params.returnDate.getTime() + 20 * 60 * 60 * 1000), // 8 PM
          price: 225,
          currency: 'USD',
          availableSeats: 38,
          cabinClass: 'economy',
          bookingUrl: 'https://www.arajet.com/booking/DM012',
          duration: 240,
          stops: 0
        }
      );
    }

    return mockFlights;
  }

  /**
   * Configurar el endpoint de búsqueda cuando tengamos los datos reales
   */
  public configureSearchEndpoint(endpoint: string, additionalHeaders?: Record<string, string>) {
    this.searchEndpoint = endpoint;
    
    if (additionalHeaders) {
      Object.assign(this.config.headers, additionalHeaders);
    }
    
    scrapingLogger.info(`Arajet search endpoint configured: ${endpoint}`);
  }
}
