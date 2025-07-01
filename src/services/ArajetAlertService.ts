import axios, { AxiosResponse } from 'axios';
import { scrapingLogger } from '../utils/logger';
import { 
  ArajetApiBase, 
  ArajetLowestFareResponse, 
  FlightAlert,
  FlightDeal,
  MonthlyFlightData,
  PriceAnalysis,
  ArajetPassenger,
  ArajetCalendarFlight
} from '../types/arajet-api';

export class ArajetAlertService {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor() {
    this.baseUrl = process.env['ARAJET_API_URL'] || 'https://arajet-api.ezycommerce.sabre.com';
    this.headers = {
      'Accept': 'text/plain',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'en-US,en;q=0.8',
      'Access-Control-Allow-Origin': '*',
      'AppContext': 'ibe',
      'Content-Type': 'application/json',
      'LanguageCode': 'es-do',
      'Origin': 'https://www.arajet.com',
      'Referer': 'https://www.arajet.com/',
      'Sec-CH-UA': '"Brave";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
      'Sec-CH-UA-Mobile': '?0',
      'Sec-CH-UA-Platform': '"macOS"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-GPC': '1',
      'Tenant-Identifier': process.env['ARAJET_TENANT_ID'] || 'caTRCudVPKmnHNnNeTgD3jDHwtsVvNtTmVHnRhYQzEqVboamwZp6fDEextRR8DAB',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
      'X-ClientVersion': process.env['ARAJET_CLIENT_VERSION'] || '0.5.3476',
      'X-UserIdentifier': process.env['ARAJET_USER_ID'] || 'kKEBDZhkH9m6TPYLFjqgUGiohOmMqE'
    };
  }

  /**
   * Obtiene el calendario de precios para un mes específico
   */
  async getMonthlyPrices(
    fromAirport: string,
    toAirport: string,
    month: string, // Format: YYYY-MM
    passengers: ArajetPassenger[]
  ): Promise<MonthlyFlightData> {
    scrapingLogger.info(`Obteniendo precios mensuales: ${fromAirport} -> ${toAirport} para ${month}`);

    // Calcular fechas del mes
    const year = parseInt(month.split('-')[0]);
    const monthNum = parseInt(month.split('-')[1]);
    const startDate = `${month}-01`;
    const endDate = new Date(year, monthNum, 0).toISOString().split('T')[0]; // Último día del mes
    const departureDate = `${month}-15`; // Fecha de referencia en el medio del mes

    const payload: ArajetApiBase = {
      currency: "USD",
      fareTypeCategories: null,
      isManageBooking: false,
      languageCode: "es-do",
      passengers,
      routes: [{
        fromAirport,
        toAirport,
        departureDate,
        startDate,
        endDate
      }]
    };

    try {
      const response: AxiosResponse<ArajetLowestFareResponse> = await axios.post(
        `${this.baseUrl}/api/v1/Availability/SearchLowestFare`,
        payload,
        {
          headers: this.headers,
          timeout: 30000
        }
      );

      if (response.status !== 200) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const flights = this.extractFlightsFromResponse(response.data);
      const analysis = this.analyzePrices(flights);

      const monthlyData: MonthlyFlightData = {
        month,
        fromAirport,
        toAirport,
        flights,
        analysis,
        lastUpdated: new Date()
      };

      scrapingLogger.info(`Encontrados ${flights.length} vuelos para ${month}. Precio promedio: $${analysis.avgPrice}`);

      return monthlyData;

    } catch (error) {
      scrapingLogger.error(`Error obteniendo precios mensuales: ${error}`);
      throw error;
    }
  }

  /**
   * Busca ofertas que cumplan los criterios de una alerta
   */
  async findDealsForAlert(alert: FlightAlert): Promise<FlightDeal[]> {
    try {
      const monthlyData = await this.getMonthlyPrices(
        alert.fromAirport,
        alert.toAirport,
        alert.searchMonth,
        alert.passengers
      );

      const deals: FlightDeal[] = [];

      for (const flight of monthlyData.flights) {
        // Verificar si el precio cumple el criterio de la alerta
        if (flight.pricePerPassenger <= alert.maxPrice && !flight.isSoldOut) {
          const deal: FlightDeal = {
            alertId: alert.id,
            date: flight.date,
            price: flight.pricePerPassenger,
            priceWithoutTax: flight.pricePerPassengerWithoutTax,
            fareClass: flight.fareClass,
            flightNumber: flight.legs[0]?.flightNumber || 'N/A',
            departureTime: flight.legs[0]?.departureDate || '',
            arrivalTime: flight.legs[0]?.arrivalDate || '',
            isCheapestOfMonth: flight.isCheapestOfMonth,
            foundAt: new Date()
          };

          deals.push(deal);
        }
      }

      scrapingLogger.info(`Encontradas ${deals.length} ofertas para alerta ${alert.id}`);
      return deals;

    } catch (error) {
      scrapingLogger.error(`Error buscando ofertas para alerta ${alert.id}: ${error}`);
      return [];
    }
  }

  /**
   * Extrae vuelos de la respuesta de la API
   */
  private extractFlightsFromResponse(response: ArajetLowestFareResponse): ArajetCalendarFlight[] {
    const flights: ArajetCalendarFlight[] = [];

    for (const route of response.routes) {
      if (route.flights) {
        flights.push(...route.flights);
      }
    }

    return flights;
  }

  /**
   * Analiza precios de un conjunto de vuelos
   */
  private analyzePrices(flights: ArajetCalendarFlight[]): PriceAnalysis {
    if (flights.length === 0) {
      return {
        minPrice: 0,
        maxPrice: 0,
        avgPrice: 0,
        cheapestDates: [],
        priceDistribution: {},
        totalFlights: 0,
        availableDates: []
      };
    }

    const prices = flights.map(f => f.pricePerPassenger);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

    // Encontrar fechas más baratas
    const cheapestDates = flights
      .filter(f => f.pricePerPassenger === minPrice)
      .map(f => f.date.split('T')[0]);

    // Distribución de precios
    const priceDistribution: Record<string, number> = {};
    flights.forEach(flight => {
      const priceRange = Math.floor(flight.pricePerPassenger / 50) * 50; // Agrupar en rangos de $50
      const key = `$${priceRange}-${priceRange + 49}`;
      priceDistribution[key] = (priceDistribution[key] || 0) + 1;
    });

    // Fechas disponibles (no agotadas)
    const availableDates = flights
      .filter(f => !f.isSoldOut)
      .map(f => f.date.split('T')[0]);

    return {
      minPrice,
      maxPrice,
      avgPrice,
      cheapestDates,
      priceDistribution,
      totalFlights: flights.length,
      availableDates
    };
  }

  /**
   * Formatea un mensaje de alerta para Telegram
   */
  formatAlertMessage(alert: FlightAlert, deals: FlightDeal[]): string {
    if (deals.length === 0) {
      return `🔍 No se encontraron ofertas para ${alert.fromAirport} → ${alert.toAirport} en ${alert.searchMonth} por debajo de $${alert.maxPrice}`;
    }

    // Ordenar por precio
    const sortedDeals = deals.sort((a, b) => a.price - b.price);
    const cheapest = sortedDeals[0];

    let message = `🎉 *¡${deals.length} ofertas encontradas!*\n\n`;
    message += `✈️ ${alert.fromAirport} → ${alert.toAirport}\n`;
    message += `📅 Mes: ${alert.searchMonth}\n`;
    message += `💰 Presupuesto máximo: $${alert.maxPrice}\n\n`;

    message += `🏆 *MEJOR OFERTA:*\n`;
    message += `📅 ${this.formatDate(cheapest.date)}\n`;
    message += `💵 $${cheapest.price} USD${cheapest.isCheapestOfMonth ? ' 🥇' : ''}\n`;
    message += `✈️ Vuelo ${cheapest.flightNumber}\n`;
    message += `🕐 ${this.formatTime(cheapest.departureTime)} → ${this.formatTime(cheapest.arrivalTime)}\n\n`;

    // Mostrar hasta 5 ofertas adicionales
    if (deals.length > 1) {
      const nextDeals = sortedDeals.slice(1, 6); // Próximas 5 ofertas
      message += `📋 *Top ${Math.min(5, deals.length)} ofertas:*\n`;
      
      nextDeals.forEach((deal, index) => {
        message += `${index + 2}. ${this.formatDate(deal.date)} - $${deal.price}${deal.isCheapestOfMonth ? ' 🥇' : ''}\n`;
        message += `   ✈️ ${deal.flightNumber} | ${this.formatTime(deal.departureTime)} → ${this.formatTime(deal.arrivalTime)}\n`;
      });

      if (deals.length > 6) {
        message += `\n... y ${deals.length - 6} ofertas más disponibles\n`;
      }
    }

    message += `\n🔄 Actualizado: ${new Date().toLocaleString('es-ES', { timeZone: 'America/Santiago' })}`;
    message += `\n💡 Usa /misalertas para gestionar tus alertas`;

    return message;
  }

  /**
   * Formatea una fecha para mostrar
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }

  /**
   * Formatea una hora para mostrar
   */
  private formatTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Valida un código de aeropuerto
   */
  isValidAirportCode(code: string): boolean {
    // Lista de códigos válidos de Arajet (puede expandirse)
    const validCodes = [
      'SCL', 'EZE', 'PUJ', 'SDQ', 'STI', 'BOG', 'MDE', 'CTG',
      'CUN', 'GUA', 'SJO', 'SAL', 'KIN', 'NLU', 'YUL', 'YYZ',
      'MIA', 'SJU', 'SFB', 'ORD', 'BOS', 'EWR'
    ];

    return validCodes.includes(code.toUpperCase());
  }

  /**
   * Obtiene información de un aeropuerto por código
   */
  getAirportInfo(code: string): { name: string; country: string } | null {
    const airports: Record<string, { name: string; country: string }> = {
      'SCL': { name: 'Santiago de Chile', country: 'Chile' },
      'EZE': { name: 'Buenos Aires (Ezeiza)', country: 'Argentina' },
      'PUJ': { name: 'Punta Cana', country: 'República Dominicana' },
      'SDQ': { name: 'Santo Domingo', country: 'República Dominicana' },
      'STI': { name: 'Santiago (DR)', country: 'República Dominicana' },
      'BOG': { name: 'Bogotá', country: 'Colombia' },
      'MDE': { name: 'Medellín', country: 'Colombia' },
      'CTG': { name: 'Cartagena', country: 'Colombia' },
      'CUN': { name: 'Cancún', country: 'México' },
      'GUA': { name: 'Ciudad Guatemala', country: 'Guatemala' },
      'SJO': { name: 'San José', country: 'Costa Rica' },
      'SAL': { name: 'San Salvador', country: 'El Salvador' },
      'KIN': { name: 'Kingston', country: 'Jamaica' },
      'NLU': { name: 'Mexico City (Felipe Ángeles)', country: 'México' },
      'YUL': { name: 'Montreal', country: 'Canadá' },
      'YYZ': { name: 'Toronto', country: 'Canadá' },
      'MIA': { name: 'Miami', country: 'Estados Unidos' },
      'SJU': { name: 'San Juan', country: 'Puerto Rico' },
      'SFB': { name: 'Orlando Sanford', country: 'Estados Unidos' },
      'ORD': { name: 'Chicago O\'Hare', country: 'Estados Unidos' },
      'BOS': { name: 'Boston', country: 'Estados Unidos' },
      'EWR': { name: 'New York/Newark', country: 'Estados Unidos' }
    };

    return airports[code.toUpperCase()] || null;
  }

  /**
   * Valida el formato de mes (YYYY-MM)
   */
  isValidMonth(month: string): boolean {
    const regex = /^\d{4}-\d{2}$/;
    if (!regex.test(month)) return false;

    const [year, monthNum] = month.split('-').map(Number);
    const currentDate = new Date();
    const inputDate = new Date(year, monthNum - 1);

    // No permitir meses en el pasado
    return inputDate >= currentDate;
  }

  /**
   * Test de conectividad con la API
   */
  async testApiConnection(): Promise<boolean> {
    try {
      const testPayload: ArajetApiBase = {
        currency: "USD",
        fareTypeCategories: null,
        isManageBooking: false,
        languageCode: "es-do",
        passengers: [{ code: "ADT", count: 1 }],
        routes: [{
          fromAirport: "SCL",
          toAirport: "PUJ",
          departureDate: "2026-02-15",
          startDate: "2026-02-01",
          endDate: "2026-02-28"
        }]
      };

      const response = await axios.post(
        `${this.baseUrl}/api/v1/Availability/SearchLowestFare`,
        testPayload,
        {
          headers: this.headers,
          timeout: 10000
        }
      );

      return response.status === 200;
    } catch (error) {
      scrapingLogger.error(`Test de API falló: ${error}`);
      return false;
    }
  }
}
