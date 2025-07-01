/**
 * Tipos principales para el sistema de monitoreo de vuelos
 */

export interface User {
  id: number;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface Alert {
  id: number;
  userId: number;
  origin: string;
  destination: string;
  maxPrice: number;
  active: boolean;
  createdAt: Date;
  lastChecked?: Date;
  notificationCount: number;
}

export interface PriceHistory {
  id: number;
  origin: string;
  destination: string;
  price: number;
  currency: string;
  departureDate: Date;
  returnDate?: Date;
  airline: string;
  scrapedAt: Date;
  flightNumber?: string;
  availableSeats?: number;
  bookingUrl?: string;
}

export interface NotificationSent {
  id: number;
  alertId: number;
  price: number;
  currency: string;
  flightDate: Date;
  airline: string;
  sentAt: Date;
  telegramMessageId?: number;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers?: number;
  cabinClass?: 'economy' | 'premium' | 'business' | 'first';
}

export interface FlightResult {
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: Date;
  arrivalDate: Date;
  price: number;
  currency: string;
  availableSeats: number;
  cabinClass: string;
  bookingUrl: string;
  duration: number; // en minutos
  stops: number;
}

export interface AirlineConfig {
  name: string;
  code: string;
  apiUrl: string;
  apiKey?: string;
  headers: Record<string, string>;
  rateLimit: {
    requests: number;
    windowMs: number;
  };
  timeout: number;
  retryAttempts: number;
  isActive: boolean;
}

export interface ScrapingResult {
  success: boolean;
  flights: FlightResult[];
  error?: string;
  timestamp: Date;
  airline: string;
  searchParams: FlightSearchParams;
}

export interface BotCommand {
  command: string;
  description: string;
  handler: string;
  requiresParams: boolean;
  adminOnly?: boolean;
}

export interface TelegramMessage {
  chatId: number;
  text: string;
  parseMode?: 'Markdown' | 'HTML';
  replyMarkup?: any;
  disableWebPagePreview?: boolean;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: Date;
  ttl: number; // tiempo de vida en ms
}

export interface AppConfig {
  telegram: {
    token: string;
    webhookUrl?: string;
    adminChatId?: number;
  };
  database: {
    path: string;
    backupPath: string;
  };
  scraping: {
    intervalMinutes: number;
    maxConcurrentRequests: number;
    requestTimeoutMs: number;
    retryAttempts: number;
    retryDelayMs: number;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  alerts: {
    maxAlertsPerUser: number;
    cooldownMinutes: number;
    priceChangeThreshold: number;
  };
  logging: {
    level: string;
    filePath: string;
  };
  cache: {
    ttlMinutes: number;
  };
}

export interface DatabaseTables {
  users: User;
  alerts: Alert;
  price_history: PriceHistory;
  notifications_sent: NotificationSent;
}

export type AirlineCode = 'AVIANCA' | 'LATAM' | 'VIVA' | 'WINGO' | 'COPA' | 'JETBLUE';

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
}

export interface PriceAlert {
  alertId: number;
  currentPrice: number;
  previousPrice?: number;
  priceChange: number;
  priceChangePercent: number;
  flight: FlightResult;
  alert: Alert;
  user: User;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
  services: {
    database: boolean;
    telegram: boolean;
    scraping: boolean;
  };
  lastError?: string;
}

export interface BotStats {
  totalUsers: number;
  activeAlerts: number;
  totalFlightsScraped: number;
  notificationsSentToday: number;
  averageResponseTime: number;
  uptime: number;
}
