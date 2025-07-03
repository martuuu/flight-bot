// Logger utility para reemplazar console.log
type LogLevel = 'error' | 'warn' | 'info' | 'debug'

class Logger {
  private static instance: Logger
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (this.isDevelopment) {
      console[level](message, ...args)
    } else if (level === 'error') {
      // En producción, solo loguear errores críticos
      console.error(message, ...args)
    }
  }

  error(message: string, ...args: any[]) {
    this.log('error', `[ERROR] ${message}`, ...args)
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', `[WARN] ${message}`, ...args)
  }

  info(message: string, ...args: any[]) {
    this.log('info', `[INFO] ${message}`, ...args)
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', `[DEBUG] ${message}`, ...args)
  }
}

export const logger = Logger.getInstance()
