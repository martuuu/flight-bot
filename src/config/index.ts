import dotenv from 'dotenv';
import { AppConfig } from '@/types';

// Cargar variables de entorno
dotenv.config();

/**
 * Configuración principal de la aplicación
 */
export const config: AppConfig = {
  telegram: {
    token: process.env['TELEGRAM_BOT_TOKEN'] || '',
    ...(process.env['TELEGRAM_WEBHOOK_URL'] && { webhookUrl: process.env['TELEGRAM_WEBHOOK_URL'] }),
    ...(process.env['ADMIN_CHAT_ID'] && { adminChatId: parseInt(process.env['ADMIN_CHAT_ID']) }),
  },
  database: {
    path: process.env['DATABASE_PATH'] || './data/flights.db',
    backupPath: process.env['DATABASE_BACKUP_PATH'] || './backups/',
  },
  scraping: {
    intervalMinutes: parseInt(process.env['SCRAPING_INTERVAL_MINUTES'] || '5'), // Cambiado a 5 minutos para testing
    maxConcurrentRequests: parseInt(process.env['MAX_CONCURRENT_REQUESTS'] || '5'),
    requestTimeoutMs: parseInt(process.env['REQUEST_TIMEOUT_MS'] || '10000'),
    retryAttempts: parseInt(process.env['RETRY_ATTEMPTS'] || '3'),
    retryDelayMs: parseInt(process.env['RETRY_DELAY_MS'] || '2000'),
  },
  rateLimit: {
    windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '60000'),
    maxRequests: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '10'),
  },
  alerts: {
    maxAlertsPerUser: parseInt(process.env['MAX_ALERTS_PER_USER'] || '10'),
    cooldownMinutes: parseInt(process.env['ALERT_COOLDOWN_MINUTES'] || '60'),
    priceChangeThreshold: parseFloat(process.env['PRICE_CHANGE_THRESHOLD'] || '0.1'),
  },
  logging: {
    level: process.env['LOG_LEVEL'] || 'info',
    filePath: process.env['LOG_FILE_PATH'] || './logs/app.log',
  },
  cache: {
    ttlMinutes: parseInt(process.env['CACHE_TTL_MINUTES'] || '5'),
  },
};

/**
 * Configuración de aerolíneas con sus endpoints y parámetros
 */
export const airlineConfigs = {
  AVIANCA: {
    name: 'Avianca',
    code: 'AV',
    apiUrl: 'https://api.avianca.com/flights', // URL mock - reemplazar por la real
    apiKey: process.env['AVIANCA_API_KEY'],
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'FlightBot/1.0',
    },
    rateLimit: {
      requests: 10,
      windowMs: 60000, // 1 minuto
    },
    timeout: 8000,
    retryAttempts: 2,
    isActive: true,
  },
  LATAM: {
    name: 'LATAM',
    code: 'LA',
    apiUrl: 'https://api.latam.com/search', // URL mock - reemplazar por la real
    apiKey: process.env['LATAM_API_KEY'],
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'FlightBot/1.0',
    },
    rateLimit: {
      requests: 15,
      windowMs: 60000,
    },
    timeout: 10000,
    retryAttempts: 3,
    isActive: true,
  },
  VIVA: {
    name: 'Viva Air',
    code: 'VV',
    apiUrl: 'https://api.vivaair.com/flights', // URL mock - reemplazar por la real
    apiKey: process.env['VIVA_API_KEY'],
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'FlightBot/1.0',
    },
    rateLimit: {
      requests: 8,
      windowMs: 60000,
    },
    timeout: 6000,
    retryAttempts: 2,
    isActive: true,
  },
  WINGO: {
    name: 'Wingo',
    code: 'P5',
    apiUrl: 'https://api.wingo.com/search', // URL mock - reemplazar por la real
    apiKey: process.env['WINGO_API_KEY'],
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'FlightBot/1.0',
    },
    rateLimit: {
      requests: 12,
      windowMs: 60000,
    },
    timeout: 7000,
    retryAttempts: 2,
    isActive: true,
  },
};

/**
 * Base de datos completa de aeropuertos internacionales
 * Incluye los aeropuertos más importantes del mundo por región
 */
export const airports = {
  // === AMÉRICA DEL NORTE ===
  // Estados Unidos - Principales Hubs
  JFK: { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA', timezone: 'America/New_York' },
  LAX: { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
  MIA: { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA', timezone: 'America/New_York' },
  ORD: { code: 'ORD', name: 'O\'Hare International', city: 'Chicago', country: 'USA', timezone: 'America/Chicago' },
  DFW: { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA', timezone: 'America/Chicago' },
  ATL: { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'USA', timezone: 'America/New_York' },
  LAS: { code: 'LAS', name: 'McCarran International', city: 'Las Vegas', country: 'USA', timezone: 'America/Los_Angeles' },
  SEA: { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'USA', timezone: 'America/Los_Angeles' },
  SFO: { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA', timezone: 'America/Los_Angeles' },
  BOS: { code: 'BOS', name: 'Logan International', city: 'Boston', country: 'USA', timezone: 'America/New_York' },
  
  // Canadá
  YYZ: { code: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada', timezone: 'America/Toronto' },
  YVR: { code: 'YVR', name: 'Vancouver International', city: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver' },
  YUL: { code: 'YUL', name: 'Montréal-Pierre Elliott Trudeau International', city: 'Montreal', country: 'Canada', timezone: 'America/Montreal' },
  
  // México
  MEX: { code: 'MEX', name: 'Aeropuerto Internacional de la Ciudad de México', city: 'Ciudad de México', country: 'México', timezone: 'America/Mexico_City' },
  CUN: { code: 'CUN', name: 'Cancún International', city: 'Cancún', country: 'México', timezone: 'America/Cancun' },
  GDL: { code: 'GDL', name: 'Miguel Hidalgo y Costilla Guadalajara International', city: 'Guadalajara', country: 'México', timezone: 'America/Mexico_City' },
  
  // === AMÉRICA DEL SUR ===
  // Argentina
  EZE: { code: 'EZE', name: 'Ministro Pistarini International (Ezeiza)', city: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires' },
  AEP: { code: 'AEP', name: 'Jorge Newbery Airfield', city: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires' },
  COR: { code: 'COR', name: 'Córdoba Airport', city: 'Córdoba', country: 'Argentina', timezone: 'America/Argentina/Cordoba' },
  MDZ: { code: 'MDZ', name: 'Governor Francisco Gabrielli International', city: 'Mendoza', country: 'Argentina', timezone: 'America/Argentina/Mendoza' },
  
  // Brasil
  GRU: { code: 'GRU', name: 'São Paulo/Guarulhos International', city: 'São Paulo', country: 'Brasil', timezone: 'America/Sao_Paulo' },
  GIG: { code: 'GIG', name: 'Rio de Janeiro/Galeão International', city: 'Rio de Janeiro', country: 'Brasil', timezone: 'America/Sao_Paulo' },
  BSB: { code: 'BSB', name: 'Brasília International', city: 'Brasília', country: 'Brasil', timezone: 'America/Sao_Paulo' },
  SDU: { code: 'SDU', name: 'Santos Dumont Airport', city: 'Rio de Janeiro', country: 'Brasil', timezone: 'America/Sao_Paulo' },
  CGH: { code: 'CGH', name: 'São Paulo/Congonhas Airport', city: 'São Paulo', country: 'Brasil', timezone: 'America/Sao_Paulo' },
  
  // Chile
  SCL: { code: 'SCL', name: 'Arturo Merino Benítez International', city: 'Santiago', country: 'Chile', timezone: 'America/Santiago' },
  
  // Colombia
  BOG: { code: 'BOG', name: 'El Dorado International', city: 'Bogotá', country: 'Colombia', timezone: 'America/Bogota' },
  MDE: { code: 'MDE', name: 'José María Córdova International', city: 'Medellín', country: 'Colombia', timezone: 'America/Bogota' },
  CTG: { code: 'CTG', name: 'Rafael Núñez International', city: 'Cartagena', country: 'Colombia', timezone: 'America/Bogota' },
  CLO: { code: 'CLO', name: 'Alfonso Bonilla Aragón International', city: 'Cali', country: 'Colombia', timezone: 'America/Bogota' },
  BAQ: { code: 'BAQ', name: 'Ernesto Cortissoz International', city: 'Barranquilla', country: 'Colombia', timezone: 'America/Bogota' },
  SMR: { code: 'SMR', name: 'Simón Bolívar International', city: 'Santa Marta', country: 'Colombia', timezone: 'America/Bogota' },
  
  // Perú
  LIM: { code: 'LIM', name: 'Jorge Chávez International', city: 'Lima', country: 'Perú', timezone: 'America/Lima' },
  CUZ: { code: 'CUZ', name: 'Alejandro Velasco Astete International', city: 'Cusco', country: 'Perú', timezone: 'America/Lima' },
  
  // Ecuador
  UIO: { code: 'UIO', name: 'Mariscal Sucre International', city: 'Quito', country: 'Ecuador', timezone: 'America/Guayaquil' },
  GYE: { code: 'GYE', name: 'José Joaquín de Olmedo International', city: 'Guayaquil', country: 'Ecuador', timezone: 'America/Guayaquil' },
  
  // Venezuela
  CCS: { code: 'CCS', name: 'Simón Bolívar International', city: 'Caracas', country: 'Venezuela', timezone: 'America/Caracas' },
  
  // Uruguay
  MVD: { code: 'MVD', name: 'Carrasco International', city: 'Montevideo', country: 'Uruguay', timezone: 'America/Montevideo' },
  
  // Paraguay
  ASU: { code: 'ASU', name: 'Silvio Pettirossi International', city: 'Asunción', country: 'Paraguay', timezone: 'America/Asuncion' },
  
  // === CENTROAMÉRICA Y CARIBE ===
  // Panamá
  PTY: { code: 'PTY', name: 'Tocumen International', city: 'Ciudad de Panamá', country: 'Panamá', timezone: 'America/Panama' },
  
  // Costa Rica
  SJO: { code: 'SJO', name: 'Juan Santamaría International', city: 'San José', country: 'Costa Rica', timezone: 'America/Costa_Rica' },
  
  // Guatemala
  GUA: { code: 'GUA', name: 'La Aurora International', city: 'Ciudad de Guatemala', country: 'Guatemala', timezone: 'America/Guatemala' },
  
  // Puerto Rico
  SJU: { code: 'SJU', name: 'Luis Muñoz Marín International', city: 'San Juan', country: 'Puerto Rico', timezone: 'America/Puerto_Rico' },
  SDQ: { code: 'SDQ', name: 'Las Américas International', city: 'Santo Domingo', country: 'República Dominicana', timezone: 'America/Santo_Domingo' },
  PUJ: { code: 'PUJ', name: 'Punta Cana International', city: 'Punta Cana', country: 'República Dominicana', timezone: 'America/Santo_Domingo' },
  STI: { code: 'STI', name: 'Gregorio Luperón International', city: 'Puerto Plata', country: 'República Dominicana', timezone: 'America/Santo_Domingo' },
  
  // Curaçao
  CUR: { code: 'CUR', name: 'Hato International', city: 'Willemstad', country: 'Curaçao', timezone: 'America/Curacao' },
  
  // Aruba
  AUA: { code: 'AUA', name: 'Queen Beatrix International', city: 'Oranjestad', country: 'Aruba', timezone: 'America/Aruba' },
  
  // Cuba
  HAV: { code: 'HAV', name: 'José Martí International', city: 'La Habana', country: 'Cuba', timezone: 'America/Havana' },
  
  // Jamaica
  KIN: { code: 'KIN', name: 'Norman Manley International', city: 'Kingston', country: 'Jamaica', timezone: 'America/Jamaica' },
  
  // === EUROPA ===
  // España
  MAD: { code: 'MAD', name: 'Adolfo Suárez Madrid-Barajas', city: 'Madrid', country: 'España', timezone: 'Europe/Madrid' },
  BCN: { code: 'BCN', name: 'Josep Tarradellas Barcelona-El Prat', city: 'Barcelona', country: 'España', timezone: 'Europe/Madrid' },
  
  // Francia
  CDG: { code: 'CDG', name: 'Charles de Gaulle', city: 'París', country: 'Francia', timezone: 'Europe/Paris' },
  ORY: { code: 'ORY', name: 'Orly', city: 'París', country: 'Francia', timezone: 'Europe/Paris' },
  
  // Reino Unido
  LHR: { code: 'LHR', name: 'Heathrow', city: 'Londres', country: 'Reino Unido', timezone: 'Europe/London' },
  LGW: { code: 'LGW', name: 'Gatwick', city: 'Londres', country: 'Reino Unido', timezone: 'Europe/London' },
  
  // Alemania
  FRA: { code: 'FRA', name: 'Frankfurt am Main', city: 'Frankfurt', country: 'Alemania', timezone: 'Europe/Berlin' },
  MUC: { code: 'MUC', name: 'Munich', city: 'Munich', country: 'Alemania', timezone: 'Europe/Berlin' },
  
  // Italia
  FCO: { code: 'FCO', name: 'Leonardo da Vinci International', city: 'Roma', country: 'Italia', timezone: 'Europe/Rome' },
  MXP: { code: 'MXP', name: 'Milan Malpensa', city: 'Milán', country: 'Italia', timezone: 'Europe/Rome' },
  
  // Países Bajos
  AMS: { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Ámsterdam', country: 'Países Bajos', timezone: 'Europe/Amsterdam' },
  
  // === ASIA ===
  // Japón
  NRT: { code: 'NRT', name: 'Narita International', city: 'Tokio', country: 'Japón', timezone: 'Asia/Tokyo' },
  HND: { code: 'HND', name: 'Haneda', city: 'Tokio', country: 'Japón', timezone: 'Asia/Tokyo' },
  
  // China
  PEK: { code: 'PEK', name: 'Beijing Capital International', city: 'Beijing', country: 'China', timezone: 'Asia/Shanghai' },
  PVG: { code: 'PVG', name: 'Shanghai Pudong International', city: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai' },
  
  // Singapur
  SIN: { code: 'SIN', name: 'Singapore Changi', city: 'Singapur', country: 'Singapur', timezone: 'Asia/Singapore' },
  
  // Emiratos Árabes Unidos
  DXB: { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  
  // === OCEANÍA ===
  // Australia
  SYD: { code: 'SYD', name: 'Kingsford Smith', city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  MEL: { code: 'MEL', name: 'Melbourne', city: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne' },
};

/**
 * Comandos del bot con sus descripciones
 */
export const botCommands = [
  { command: 'start', description: 'Iniciar el bot y registrarse', handler: 'handleStart', requiresParams: false },
  { command: 'help', description: 'Ver lista de comandos disponibles', handler: 'handleHelp', requiresParams: false },
  { command: 'alert', description: 'Crear nueva alerta de precio', handler: 'handleCreateAlert', requiresParams: true },
  { command: 'monthlyalert', description: 'Crear alerta mensual automática (Arajet)', handler: 'handleMonthlyAlert', requiresParams: true },
  { command: 'myalerts', description: 'Ver mis alertas activas', handler: 'handleMyAlerts', requiresParams: false },
  { command: 'stop', description: 'Desactivar una alerta específica', handler: 'handleStopAlert', requiresParams: true },
  { command: 'clearall', description: 'Desactivar todas mis alertas', handler: 'handleClearAll', requiresParams: false },
  { command: 'search', description: 'Buscar vuelos disponibles', handler: 'handleSearch', requiresParams: true },
  { command: 'stats', description: 'Ver estadísticas del bot', handler: 'handleStats', requiresParams: false, adminOnly: true },
];

/**
 * Validar que todas las variables de entorno requeridas estén presentes
 */
export function validateConfig(): void {
  const requiredVars = ['TELEGRAM_BOT_TOKEN'];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Variable de entorno requerida faltante: ${varName}`);
    }
  }
  
  // Validar configuraciones numéricas
  if (config.scraping.intervalMinutes < 1) {
    throw new Error('SCRAPING_INTERVAL_MINUTES debe ser mayor a 0');
  }
  
  if (config.alerts.maxAlertsPerUser < 1) {
    throw new Error('MAX_ALERTS_PER_USER debe ser mayor a 0');
  }
}

/**
 * Valida un código de aeropuerto basado en los destinos disponibles de Arajet
 */
export function isValidAirportCode(code: string): boolean {
  return airports.hasOwnProperty(code.toUpperCase());
}

/**
 * Obtiene información de un aeropuerto por código
 */
export function getAirportInfo(code: string): { name: string; city: string; country: string } | null {
  const airport = airports[code.toUpperCase() as keyof typeof airports];
  return airport ? {
    name: airport.name,
    city: airport.city,
    country: airport.country
  } : null;
}

/**
 * Obtiene lista de códigos de aeropuertos válidos
 */
export function getValidAirportCodes(): string[] {
  return Object.keys(airports);
}

/**
 * Agrupa aeropuertos por país para mejor visualización
 */
export function getAirportsByCountry(): Record<string, typeof airports[keyof typeof airports][]> {
  const grouped: Record<string, typeof airports[keyof typeof airports][]> = {};
  
  Object.values(airports).forEach(airport => {
    if (!grouped[airport.country]) {
      grouped[airport.country] = [];
    }
    grouped[airport.country].push(airport);
  });
  
  return grouped;
}
