// Interfaces para los endpoints de Arajet
// Generado automáticamente basado en las respuestas reales de la API

export interface ArajetApiBase {
  currency: string;
  fareTypeCategories: null;
  isManageBooking: boolean;
  languageCode: string;
  passengers: ArajetPassenger[];
  routes: ArajetSearchRoute[];
}

export interface ArajetPassenger {
  code: 'ADT' | 'CHD' | 'INF'; // Adult, Child, Infant
  count: number;
}

export interface ArajetSearchRoute {
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  startDate: string;
  endDate: string;
}

// Response del endpoint SearchLowestFare (calendario del mes)
export interface ArajetLowestFareResponse {
  routes: ArajetLowestFareRoute[];
  currency: string;
  concurrentUsersForRoute: number;
  isExternallyPriced: boolean;
}

export interface ArajetLowestFareRoute {
  from: ArajetAirport;
  to: ArajetAirport;
  flights: ArajetCalendarFlight[];
}

export interface ArajetCalendarFlight {
  date: string; // ISO date format
  key: string;
  pricePerPassenger: number;
  pricePerPassengerWithoutTax: number;
  isSoldOut: boolean;
  isCheapestOfMonth: boolean;
  fareClass: string;
  fareBasisCode: string;
  legs: ArajetFlightLeg[];
}

export interface ArajetFlightLeg {
  id: number;
  departureDate: string;
  arrivalDate: string;
  flightTime: number; // minutes
  from: ArajetAirport;
  to: ArajetAirport;
  flightNumber: string;
  carrierCode: string;
  passengerSegmentStatus: number;
  stopoverTime: number;
  equipmentType: string;
  throughCheckinAllowed: boolean;
  legType: string;
  deiDisclosure: string;
  operatingCarrierCode: string;
}

export interface ArajetAirport {
  name: string;
  code: string;
  currency?: string;
  countryCode?: string;
  restrictedOnDeparture: boolean;
  restrictedOnDestination: boolean;
}

// Response del endpoint SearchShop (detalles específicos)
export interface ArajetSearchShopResponse {
  routes: ArajetDetailedRoute[];
  dayRoutes: ArajetDayRoute[];
  currency: string;
  concurrentUsersForRoute: number;
  promoCodeCampaign: ArajetPromoCodeCampaign;
  isExternallyPriced: boolean;
}

export interface ArajetDetailedRoute {
  from: ArajetDetailedAirport;
  to: ArajetAirport;
  flights: ArajetDetailedFlight[];
}

export interface ArajetDetailedAirport extends ArajetAirport {
  connections: ArajetAirport[];
  shortName?: string;
}

export interface ArajetDetailedFlight {
  carrierCode: string;
  flightNumber: string;
  arrivalDate: string;
  lowestFareId: number;
  cabin: string;
  lowestPriceTotal: number;
  lowestPriceDiscount: number;
  fares: ArajetFare[];
  allFares?: ArajetFare[];
  fareTypes?: ArajetFareType[];
}

export interface ArajetFare {
  discount: number;
  fareBasis: string;
  name: string;
  id: number;
  price: number;
  code: string;
  adult: ArajetPassengerFare;
  faresByPassengerCode: ArajetFareByPassenger[];
  priceWithoutTax: number;
  seatCount: number;
  refundable: boolean;
  taxes: ArajetTax[];
  soldOut: boolean;
  fareBundle: ArajetFareBundle;
  cabin: string;
}

export interface ArajetPassengerFare {
  fareBasis: string;
  id: number;
  price: number;
  discount: number;
  code: string;
  priceWithoutTax: number;
  seatCount: number;
  taxes: ArajetTax[];
}

export interface ArajetFareByPassenger {
  passengerCode: string;
  fare: ArajetPassengerFare;
}

export interface ArajetTax {
  price: number;
  code: string;
  currency: string;
  description: string;
  isPaymentFee: boolean;
}

export interface ArajetFareBundle {
  bundleCode: string;
  bundleServices: any[];
  applicablePassengerTypeCodes: any[];
}

export interface ArajetFareType {
  id: number;
  name: string;
  fares: ArajetFare[];
}

export interface ArajetDayRoute {
  // Esta estructura puede variar según la respuesta
  [key: string]: any;
}

export interface ArajetPromoCodeCampaign {
  isCombinedPromoCode: boolean;
  isSanlamSubscriptionOnly: boolean;
  isExternalSubscriptionOnly: boolean;
  isApplied: boolean;
}

// Interfaces para el sistema de alertas
export interface FlightAlert {
  id: string;
  userId: number;
  chatId: number;
  fromAirport: string;
  toAirport: string;
  maxPrice: number;
  currency: string;
  passengers: ArajetPassenger[];
  searchMonth: string; // YYYY-MM format
  isActive: boolean;
  createdAt: Date;
  lastChecked?: Date | undefined;
  alertsSent: number;
}

export interface FlightDeal {
  alertId: string;
  date: string;
  price: number;
  priceWithoutTax: number;
  fareClass: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  isCheapestOfMonth: boolean;
  foundAt: Date;
}

export interface AlertNotification {
  alertId: string;
  userId: number;
  chatId: number;
  deals: FlightDeal[];
  message: string;
  sentAt: Date;
}

// Tipos utilitarios para el bot
export type AirportCode = string; // IATA codes like 'SCL', 'PUJ', etc.
export type CurrencyCode = 'USD' | 'EUR' | 'CLP' | 'ARS';
export type PassengerType = 'ADT' | 'CHD' | 'INF';
export type MonthYear = string; // Format: YYYY-MM

// Configuración del scraper
export interface ArajetScraperConfig {
  baseUrl: string;
  endpoints: {
    searchLowestFare: string;
    searchShop: string;
  };
  headers: Record<string, string>;
  rateLimit: {
    requestsPerMinute: number;
    delayBetweenRequests: number;
  };
  retry: {
    maxAttempts: number;
    delayMs: number;
  };
}

// Para análisis de precios
export interface PriceAnalysis {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  cheapestDates: string[];
  priceDistribution: Record<string, number>;
  totalFlights: number;
  availableDates: string[];
}

export interface MonthlyFlightData {
  month: string;
  fromAirport: string;
  toAirport: string;
  flights: ArajetCalendarFlight[];
  analysis: PriceAnalysis;
  lastUpdated: Date;
}

// Para testing
export interface EndpointTestResult {
  endpoint: string;
  success: boolean;
  responseTime: number;
  dataSize: number;
  timestamp: Date;
  sampleData?: any;
}

// Types for bot message formatting
export interface FlightResult {
  price: number;
  departureTime: string;
  arrivalTime: string;
  stops: number;
  fareClass?: string;
  flightNumber?: string;
}

export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

export interface ApiHealthCheck {
  searchLowestFare: EndpointTestResult;
  searchShop: EndpointTestResult;
  overall: 'healthy' | 'degraded' | 'down';
  checkedAt: Date;
}
