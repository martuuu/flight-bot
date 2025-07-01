import winston from 'winston';
import { config } from '@/config';
import path from 'path';
import fs from 'fs';

// Crear directorio de logs si no existe
const logDir = path.dirname(config.logging.filePath);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

/**
 * Configuración del logger principal
 */
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }: any) => {
      return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
    })
  ),
  transports: [
    // Archivo de log principal
    new winston.transports.File({
      filename: config.logging.filePath,
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true,
    }),
    // Log de errores separado
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 3,
    }),
  ],
});

// En desarrollo, también log a consola
if (process.env['NODE_ENV'] !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

/**
 * Logger específico para el bot de Telegram
 */
export const botLogger = {
  info: (message: string, meta?: any): void => {
    logger.info(`[BOT] ${message}`, meta);
  },
  warn: (message: string, meta?: any): void => {
    logger.warn(`[BOT] ${message}`, meta);
  },
  error: (message: string, error?: Error, meta?: any): void => {
    logger.error(`[BOT] ${message}`, { error: error?.message, stack: error?.stack, ...meta });
  },
  debug: (message: string, meta?: any): void => {
    logger.debug(`[BOT] ${message}`, meta);
  },
};

/**
 * Logger específico para scraping
 */
export const scrapingLogger = {
  info: (message: string, meta?: any): void => {
    logger.info(`[SCRAPING] ${message}`, meta);
  },
  warn: (message: string, meta?: any): void => {
    logger.warn(`[SCRAPING] ${message}`, meta);
  },
  error: (message: string, error?: Error, meta?: any): void => {
    logger.error(`[SCRAPING] ${message}`, { error: error?.message, stack: error?.stack, ...meta });
  },
  debug: (message: string, meta?: any): void => {
    logger.debug(`[SCRAPING] ${message}`, meta);
  },
};

/**
 * Logger específico para alertas
 */
export const alertLogger = {
  info: (message: string, meta?: any): void => {
    logger.info(`[ALERTS] ${message}`, meta);
  },
  warn: (message: string, meta?: any): void => {
    logger.warn(`[ALERTS] ${message}`, meta);
  },
  error: (message: string, error?: Error, meta?: any): void => {
    logger.error(`[ALERTS] ${message}`, { error: error?.message, stack: error?.stack, ...meta });
  },
  debug: (message: string, meta?: any): void => {
    logger.debug(`[ALERTS] ${message}`, meta);
  },
};

/**
 * Logger específico para base de datos
 */
export const dbLogger = {
  info: (message: string, meta?: any): void => {
    logger.info(`[DATABASE] ${message}`, meta);
  },
  warn: (message: string, meta?: any): void => {
    logger.warn(`[DATABASE] ${message}`, meta);
  },
  error: (message: string, error?: Error, meta?: any): void => {
    logger.error(`[DATABASE] ${message}`, { error: error?.message, stack: error?.stack, ...meta });
  },
  debug: (message: string, meta?: any): void => {
    logger.debug(`[DATABASE] ${message}`, meta);
  },
};

export default logger;
