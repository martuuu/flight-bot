import Database from 'better-sqlite3'
import path from 'path'

// Configuración de la base de datos del bot
const DB_PATH = process.env.BOT_DATABASE_PATH || path.join(process.cwd(), '../data/flights.db')
const ALERTS_DB_PATH = process.env.BOT_ALERTS_DATABASE_PATH || path.join(process.cwd(), '../data/alerts.db')

interface User {
  id: number
  telegram_id: number
  username?: string
  first_name?: string
  last_name?: string
  created_at: string
  updated_at: string
  is_active: boolean
}

interface Alert {
  id: number
  user_id: number
  origin: string
  destination: string
  max_price: number
  currency: string
  departure_date?: string
  return_date?: string
  passengers: number
  cabin_class: string
  active: boolean
  created_at: string
  last_checked?: string
  notification_count: number
}

export class BotDatabaseService {
  private db: Database.Database
  private alertsDb: Database.Database

  constructor() {
    this.db = new Database(DB_PATH)
    this.alertsDb = new Database(ALERTS_DB_PATH)
  }

  // User operations
  findUserByTelegramId(telegramId: number): User | null {
    try {
      const stmt = this.db.prepare('SELECT * FROM users WHERE telegram_id = ?')
      const user = stmt.get(telegramId) as User | undefined
      return user || null
    } catch (error) {
      console.error('Error finding user by telegram ID:', error)
      return null
    }
  }

  findOrCreateUser(
    telegramId: number,
    username?: string,
    firstName?: string,
    lastName?: string
  ): User | null {
    try {
      let user = this.findUserByTelegramId(telegramId)
      
      if (!user) {
        const stmt = this.db.prepare(`
          INSERT INTO users (telegram_id, username, first_name, last_name)
          VALUES (?, ?, ?, ?)
        `)
        const result = stmt.run(telegramId, username, firstName, lastName)
        user = this.findUserByTelegramId(telegramId)
      }
      
      return user
    } catch (error) {
      console.error('Error finding or creating user:', error)
      return null
    }
  }

  // Alert operations
  createAlert(
    userId: number,
    origin: string,
    destination: string,
    maxPrice: number,
    currency = 'USD',
    alertType: 'MONTHLY' | 'SPECIFIC' = 'MONTHLY',
    departureDate?: string,
    returnDate?: string,
    passengers = 1,
    cabinClass = 'economy',
    searchMonth?: string
  ): Alert | null {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO alerts (
          user_id, origin, destination, max_price, currency, 
          departure_date, return_date, passengers, cabin_class
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      const result = stmt.run(
        userId,
        origin.toUpperCase(),
        destination.toUpperCase(),
        maxPrice,
        currency,
        departureDate,
        returnDate,
        passengers,
        cabinClass
      )

      return this.findAlertById(Number(result.lastInsertRowid))
    } catch (error) {
      console.error('Error creating alert:', error)
      return null
    }
  }

  findAlertById(alertId: number): Alert | null {
    try {
      const stmt = this.db.prepare('SELECT * FROM alerts WHERE id = ?')
      const alert = stmt.get(alertId) as Alert | undefined
      return alert || null
    } catch (error) {
      console.error('Error finding alert by ID:', error)
      return null
    }
  }

  findAlertsByUserId(userId: number): Alert[] {
    try {
      const stmt = this.db.prepare('SELECT * FROM alerts WHERE user_id = ? AND active = 1 ORDER BY created_at DESC')
      const alerts = stmt.all(userId) as Alert[]
      return alerts
    } catch (error) {
      console.error('Error finding alerts by user ID:', error)
      return []
    }
  }

  findDuplicateAlert(userId: number, origin: string, destination: string): Alert | null {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM alerts 
        WHERE user_id = ? AND origin = ? AND destination = ? AND active = 1
        LIMIT 1
      `)
      const alert = stmt.get(userId, origin.toUpperCase(), destination.toUpperCase()) as Alert | undefined
      return alert || null
    } catch (error) {
      console.error('Error finding duplicate alert:', error)
      return null
    }
  }

  pauseAlert(alertId: number): boolean {
    try {
      const stmt = this.db.prepare('UPDATE alerts SET active = 0 WHERE id = ?')
      const result = stmt.run(alertId)
      return result.changes > 0
    } catch (error) {
      console.error('Error pausing alert:', error)
      return false
    }
  }

  deleteAlert(alertId: number): boolean {
    try {
      const stmt = this.db.prepare('UPDATE alerts SET active = 0 WHERE id = ?')
      const result = stmt.run(alertId)
      return result.changes > 0
    } catch (error) {
      console.error('Error deleting alert:', error)
      return false
    }
  }

  deleteAllUserAlerts(userId: number): number {
    try {
      const stmt = this.db.prepare('UPDATE alerts SET active = 0 WHERE user_id = ?')
      const result = stmt.run(userId)
      return result.changes
    } catch (error) {
      console.error('Error deleting user alerts:', error)
      return 0
    }
  }

  countActiveAlertsByUserId(userId: number): number {
    try {
      const stmt = this.db.prepare('SELECT COUNT(*) as count FROM alerts WHERE user_id = ? AND active = 1')
      const result = stmt.get(userId) as { count: number }
      return result.count
    } catch (error) {
      console.error('Error counting user alerts:', error)
      return 0
    }
  }

  // Test database connection
  testConnection(): boolean {
    try {
      this.db.exec('SELECT 1')
      this.alertsDb.exec('SELECT 1')
      return true
    } catch (error) {
      console.error('Database connection failed:', error)
      return false
    }
  }

  // Close database connections
  close(): void {
    try {
      this.db.close()
      this.alertsDb.close()
    } catch (error) {
      console.error('Error closing database connections:', error)
    }
  }
}

// Singleton instance
let botDbService: BotDatabaseService | null = null

export function getBotDatabaseService(): BotDatabaseService {
  if (!botDbService) {
    botDbService = new BotDatabaseService()
  }
  return botDbService
}

// Helper function to format alert data for API responses
export function formatAlertForApi(alert: Alert): any {
  return {
    id: alert.id.toString(),
    userId: alert.user_id.toString(),
    origin: alert.origin,
    destination: alert.destination,
    maxPrice: alert.max_price,
    currency: alert.currency,
    departureDate: alert.departure_date,
    returnDate: alert.return_date,
    adults: alert.passengers,
    children: 0, // Bot doesn't track this separately yet
    infants: 0,  // Bot doesn't track this separately yet
    isActive: alert.active,
    isPaused: false, // Bot doesn't have pause feature in this table
    alertType: alert.departure_date ? 'SPECIFIC' : 'MONTHLY',
    searchMonth: undefined, // This table doesn't have search_month
    createdAt: alert.created_at,
    updatedAt: alert.created_at, // No updated_at field in this table
    lastChecked: alert.last_checked,
    isFlexible: !alert.departure_date // If no specific date, it's flexible
  }
}

// Airport codes validation - SOLO ARAJET según tu API real
export const VALID_AIRPORTS = [
  'SDQ', // Santo Domingo, RD - Las Americas Intl.
  'PUJ', // Punta Cana, RD - Aeropuerto Intl. Terminal B  
  'STI', // Santiago, RD - Aeropuerto Internacional Cibao
  'MIA', // Miami, Estados Unidos
  'SJU', // San Juan, Puerto Rico
  'SFB', // Orlando Sanford, Estados Unidos
]

export function isValidAirport(code: string): boolean {
  return VALID_AIRPORTS.includes(code.toUpperCase())
}
