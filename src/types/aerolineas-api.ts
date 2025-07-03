// Types para la API de Aerolíneas Argentinas Plus (Millas)

// Respuesta para búsqueda de bundle de idiomas
export interface AerolineasLanguageBundle {
  active: boolean;
  languageTag: string;
  bundle: string;
  translations: Record<string, string>;
  locale: string;
}

// Respuesta para búsqueda de calendario flexible
export interface AerolineasCalendarResponse {
  searchMetadata: {
    infoMessages: string[];
    warnMessages: string[];
    shoppingId: string;
    currency: "MILES" | "ARS" | "USD";
    flightType: "ONE_WAY" | "ROUND_TRIP";
    routes: string[];
    discountsApplied: boolean;
    market: "DOMESTIC" | "INTERNATIONAL";
    searchType?: "CALENDAR30";
  };
  calendarOffers: {
    [key: string]: AerolineasCalendarOffer[];
  };
}

// Respuesta para búsqueda de vuelos específicos
export interface AerolineasFlightResponse {
  searchMetadata: {
    infoMessages: string[];
    warnMessages: string[];
    shoppingId: string;
    currency: "MILES" | "ARS" | "USD";
    programId?: string;
    resultType?: "BRANDED";
    flightType: "ONE_WAY" | "ROUND_TRIP";
    routes: string[];
    discountsApplied: boolean;
    market: "DOMESTIC" | "INTERNATIONAL";
  };
  facets: AerolineasFacet[];
  fareRules: AerolineasFareRule[];
  fareFamilies: AerolineasFareFamily[];
  alternateOffers: {
    [key: string]: AerolineasOffer[];
  };
  brandedOffers: {
    [key: string]: AerolineasOffer[];
  };
  sortingOptions: AerolineasSortingOption[];
}

// Oferta de calendario
export interface AerolineasCalendarOffer {
  departure: string; // YYYY-MM-DD
  leg?: AerolineasLeg | null;
  offerDetails?: AerolineasOfferDetails | null;
  bestOffer: boolean;
  userSelection: boolean;
  soldOut: boolean;
}

// Segmento de vuelo
export interface AerolineasLeg {
  segments: AerolineasSegment[];
  dateDiff: number;
}

export interface AerolineasSegment {
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  aircraft: string;
  cabinClass: string;
  bookingClass: string;
  stops: number;
  stopAirports?: string[];
}

// Detalles de oferta
export interface AerolineasOfferDetails {
  cabinClass: "Economy" | "Premium Economy" | "Business" | "First";
  price?: number;
  miles?: number;
  currency?: string;
  taxes?: number;
  totalPrice?: number;
  fareFamily?: string;
  availableSeats?: number;
  restrictions?: string[];
}

// Oferta específica
export interface AerolineasOffer {
  id: string;
  leg: AerolineasLeg;
  offerDetails: AerolineasOfferDetails;
  price: number;
  miles?: number;
  currency: string;
  fareFamily: string;
  availableSeats: number;
  restrictions: string[];
  bookingUrl?: string;
}

// Facetas para filtrar
export interface AerolineasFacet {
  code: string;
  name: string;
  values: AerolineasFacetValue[];
}

export interface AerolineasFacetValue {
  code: string;
  name: string;
  count: number;
  selected: boolean;
}

// Reglas de tarifas
export interface AerolineasFareRule {
  active: boolean;
  comments: string;
  conditions?: string[];
}

// Familias de tarifas
export interface AerolineasFareFamily {
  id: string;
  name: string;
  description?: string;
  benefits?: string[];
  restrictions?: string[];
}

// Opciones de ordenamiento
export interface AerolineasSortingOption {
  code: string;
  label: string;
}

// Tipos de búsqueda
export type AerolineasSearchType = "PROMO" | "REGULAR" | "AWARD" | "ALL";
export type AerolineasCabinClass = "Economy" | "Premium Economy" | "Business" | "First";
export type AerolineasFlightType = "ONE_WAY" | "ROUND_TRIP";

// Parámetros de búsqueda
export interface AerolineasSearchParams {
  origin: string;
  destination: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  adults: number;
  children?: number;
  infants?: number;
  cabinClass?: AerolineasCabinClass;
  flightType: AerolineasFlightType;
  awardBooking?: boolean; // true para búsqueda de millas
  flexDates?: boolean;
  shoppingId?: string;
}

// Configuración del scraper
export interface AerolineasScraperConfig {
  baseUrl: string;
  endpoints: {
    languageBundle: string;
    calendarSearch: string;
    flightSearch: string;
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

// Tipos para el bot
export interface AerolineasAlert {
  id: string;
  userId: number;
  origin: string;
  destination: string;
  departureDate?: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  cabinClass?: AerolineasCabinClass;
  flightType: AerolineasFlightType;
  searchType: AerolineasSearchType;
  maxMiles?: number;
  maxPrice?: number;
  minAvailableSeats?: number;
  preferredTimes?: string[];
  excludeStops?: boolean;
  isActive: boolean;
  lastChecked?: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface AerolineasDeal {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  price?: number | undefined;
  miles?: number | undefined;
  currency: string;
  cabinClass: AerolineasCabinClass;
  flightType: AerolineasFlightType;
  fareFamily: string;
  availableSeats: number;
  segments: AerolineasSegment[];
  restrictions: string[];
  bookingUrl?: string;
  validUntil?: Date;
  isPromo: boolean;
  foundAt: Date;
}

// Análisis de precios
export interface AerolineasPriceAnalysis {
  route: string;
  period: string;
  minMiles?: number | undefined;
  maxMiles?: number | undefined;
  avgMiles?: number | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  avgPrice?: number | undefined;
  totalOffers: number;
  promoOffers: number;
  regularOffers: number;
  availabilityCalendar: Record<string, boolean>;
  lastUpdated: Date;
}

// Tipos utilitarios
export type AerolineasAirportCode = string; // IATA codes like 'EZE', 'MIA', etc.
export type AerolineasCurrencyCode = 'MILES' | 'ARS' | 'USD' | 'EUR';

// Configuración específica para diferentes tipos de búsqueda
export interface AerolineasPromoConfig {
  searchType: AerolineasSearchType;
  awardBooking: boolean;
  flexDates: boolean;
  maxDaysFromNow: number;
  preferredFamilies: string[];
  trackPriceChanges: boolean;
}
