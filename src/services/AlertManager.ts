import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { FlightAlert, FlightDeal, AlertNotification, ArajetPassenger } from '../types/arajet-api';
import { scrapingLogger as databaseLogger } from '../utils/logger';

export class AlertManager {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.initializeTables();
  }

  /**
   * Inicializa las tablas necesarias para las alertas
   */
  private initializeTables(): void {
    try {
      // Tabla de alertas de vuelos
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS flight_alerts (
          id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          chat_id INTEGER NOT NULL,
          from_airport TEXT NOT NULL,
          to_airport TEXT NOT NULL,
          max_price REAL NOT NULL,
          currency TEXT DEFAULT 'USD',
          passengers TEXT NOT NULL, -- JSON stringified
          search_month TEXT NOT NULL, -- YYYY-MM format
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_checked DATETIME,
          alerts_sent INTEGER DEFAULT 0
        )
      `);

      // Tabla de ofertas encontradas
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS flight_deals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          alert_id TEXT NOT NULL,
          date TEXT NOT NULL,
          price REAL NOT NULL,
          price_without_tax REAL NOT NULL,
          fare_class TEXT NOT NULL,
          flight_number TEXT NOT NULL,
          departure_time TEXT NOT NULL,
          arrival_time TEXT NOT NULL,
          is_cheapest_of_month BOOLEAN DEFAULT 0,
          found_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (alert_id) REFERENCES flight_alerts (id)
        )
      `);

      // Tabla de notificaciones enviadas
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS alert_notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          alert_id TEXT NOT NULL,
          user_id INTEGER NOT NULL,
          chat_id INTEGER NOT NULL,
          deals_count INTEGER NOT NULL,
          message TEXT NOT NULL,
          sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (alert_id) REFERENCES flight_alerts (id)
        )
      `);

      // Índices para mejorar performance
      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_alerts_user ON flight_alerts (user_id);
        CREATE INDEX IF NOT EXISTS idx_alerts_active ON flight_alerts (is_active);
        CREATE INDEX IF NOT EXISTS idx_deals_alert ON flight_deals (alert_id);
        CREATE INDEX IF NOT EXISTS idx_notifications_user ON alert_notifications (user_id);
      `);

      databaseLogger.info('Tablas de alertas inicializadas correctamente');
    } catch (error) {
      databaseLogger.error('Error inicializando tablas de alertas:', error as Error);
      throw error;
    }
  }

  /**
   * Crea una nueva alerta de vuelo
   */
  createAlert(
    userId: number,
    chatId: number,
    fromAirport: string,
    toAirport: string,
    maxPrice: number,
    passengers: ArajetPassenger[],
    searchMonth: string
  ): FlightAlert {
    const id = uuidv4();
    const alert: FlightAlert = {
      id,
      userId,
      chatId,
      fromAirport: fromAirport.toUpperCase(),
      toAirport: toAirport.toUpperCase(),
      maxPrice,
      currency: 'USD',
      passengers,
      searchMonth,
      isActive: true,
      createdAt: new Date(),
      alertsSent: 0
    };

    try {
      const stmt = this.db.prepare(`
        INSERT INTO flight_alerts (
          id, user_id, chat_id, from_airport, to_airport, max_price,
          currency, passengers, search_month, is_active, created_at, alerts_sent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        alert.id,
        alert.userId,
        alert.chatId,
        alert.fromAirport,
        alert.toAirport,
        alert.maxPrice,
        alert.currency,
        JSON.stringify(alert.passengers),
        alert.searchMonth,
        alert.isActive ? 1 : 0,
        alert.createdAt.toISOString(),
        alert.alertsSent
      );

      databaseLogger.info(`Nueva alerta creada: ${alert.id} para ${userId}`);
      return alert;
    } catch (error) {
      databaseLogger.error('Error creando alerta:', error as Error);
      throw error;
    }
  }

  /**
   * Crea una nueva alerta mensual con configuración por defecto para Arajet
   */
  createMonthlyAlert(
    userId: number,
    fromAirport: string,
    toAirport: string,
    maxPrice: number,
    chatId?: number
  ): FlightAlert {
    // Configuración por defecto para búsqueda mensual
    const defaultPassengers: ArajetPassenger[] = [
      { code: 'ADT', count: 1 }
    ];
    
    // Mes actual en formato YYYY-MM
    const now = new Date();
    const searchMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    return this.createAlert(
      userId,
      chatId || userId, // Si no se proporciona chatId, usar userId
      fromAirport,
      toAirport,
      maxPrice,
      defaultPassengers,
      searchMonth
    );
  }

  /**
   * Obtiene todas las alertas activas de un usuario
   */
  getUserAlerts(userId: number): FlightAlert[] {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM flight_alerts 
        WHERE user_id = ? AND is_active = 1 
        ORDER BY created_at DESC
      `);

      const rows = stmt.all(userId) as any[];
      
      return rows.map(row => this.mapRowToAlert(row));
    } catch (error) {
      databaseLogger.error('Error obteniendo alertas de usuario:', error as Error);
      return [];
    }
  }

  /**
   * Obtiene todas las alertas activas
   */
  getAllActiveAlerts(): FlightAlert[] {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM flight_alerts 
        WHERE is_active = 1 
        ORDER BY last_checked ASC
      `);

      const rows = stmt.all() as any[];
      
      return rows.map(row => this.mapRowToAlert(row));
    } catch (error) {
      databaseLogger.error('Error obteniendo todas las alertas:', error as Error);
      return [];
    }
  }

  /**
   * Actualiza la fecha de última verificación de una alerta
   */
  updateLastChecked(alertId: string): void {
    try {
      const stmt = this.db.prepare(`
        UPDATE flight_alerts 
        SET last_checked = ? 
        WHERE id = ?
      `);

      stmt.run(new Date().toISOString(), alertId);
    } catch (error) {
      databaseLogger.error('Error actualizando last_checked:', error as Error);
    }
  }

  /**
   * Incrementa el contador de alertas enviadas
   */
  incrementAlertsSent(alertId: string): void {
    try {
      const stmt = this.db.prepare(`
        UPDATE flight_alerts 
        SET alerts_sent = alerts_sent + 1 
        WHERE id = ?
      `);

      stmt.run(alertId);
    } catch (error) {
      databaseLogger.error('Error incrementando alerts_sent:', error as Error);
    }
  }

  /**
   * Desactiva una alerta
   */
  deactivateAlert(alertId: string, userId: number): boolean {
    try {
      const stmt = this.db.prepare(`
        UPDATE flight_alerts 
        SET is_active = 0 
        WHERE id = ? AND user_id = ?
      `);

      const result = stmt.run(alertId, userId);
      const success = result.changes > 0;
      
      if (success) {
        databaseLogger.info(`Alerta ${alertId} desactivada por usuario ${userId}`);
      }
      
      return success;
    } catch (error) {
      databaseLogger.error('Error desactivando alerta:', error as Error);
      return false;
    }
  }

  /**
   * Elimina una alerta
   */
  deleteAlert(alertId: string, userId: number): boolean {
    try {
      const stmt = this.db.prepare(`
        DELETE FROM flight_alerts 
        WHERE id = ? AND user_id = ?
      `);

      const result = stmt.run(alertId, userId);
      const success = result.changes > 0;
      
      if (success) {
        databaseLogger.info(`Alerta ${alertId} eliminada por usuario ${userId}`);
      }
      
      return success;
    } catch (error) {
      databaseLogger.error('Error eliminando alerta:', error as Error);
      return false;
    }
  }

  /**
   * Guarda ofertas encontradas
   */
  saveDeals(deals: FlightDeal[]): void {
    if (deals.length === 0) return;

    try {
      const stmt = this.db.prepare(`
        INSERT INTO flight_deals (
          alert_id, date, price, price_without_tax, fare_class,
          flight_number, departure_time, arrival_time, is_cheapest_of_month, found_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const transaction = this.db.transaction((deals: FlightDeal[]) => {
        for (const deal of deals) {
          stmt.run(
            deal.alertId,
            deal.date,
            deal.price,
            deal.priceWithoutTax,
            deal.fareClass,
            deal.flightNumber,
            deal.departureTime,
            deal.arrivalTime,
            deal.isCheapestOfMonth ? 1 : 0,
            deal.foundAt.toISOString()
          );
        }
      });

      transaction(deals);
      databaseLogger.info(`Guardadas ${deals.length} ofertas`);
    } catch (error) {
      databaseLogger.error('Error guardando ofertas:', error as Error);
    }
  }

  /**
   * Guarda notificación enviada
   */
  saveNotification(notification: AlertNotification): void {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO alert_notifications (
          alert_id, user_id, chat_id, deals_count, message, sent_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        notification.alertId,
        notification.userId,
        notification.chatId,
        notification.deals.length,
        notification.message,
        notification.sentAt.toISOString()
      );

      databaseLogger.info(`Notificación guardada para alerta ${notification.alertId}`);
    } catch (error) {
      databaseLogger.error('Error guardando notificación:', error as Error);
    }
  }

  /**
   * Obtiene estadísticas de un usuario
   */
  getUserStats(userId: number): {
    totalAlerts: number;
    activeAlerts: number;
    totalNotifications: number;
    totalDealsFound: number;
  } {
    try {
      const alertsStmt = this.db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active
        FROM flight_alerts 
        WHERE user_id = ?
      `);

      const notificationsStmt = this.db.prepare(`
        SELECT COUNT(*) as total
        FROM alert_notifications 
        WHERE user_id = ?
      `);

      const dealsStmt = this.db.prepare(`
        SELECT COUNT(*) as total
        FROM flight_deals fd
        JOIN flight_alerts fa ON fd.alert_id = fa.id
        WHERE fa.user_id = ?
      `);

      const alertsResult = alertsStmt.get(userId) as any;
      const notificationsResult = notificationsStmt.get(userId) as any;
      const dealsResult = dealsStmt.get(userId) as any;

      return {
        totalAlerts: alertsResult.total || 0,
        activeAlerts: alertsResult.active || 0,
        totalNotifications: notificationsResult.total || 0,
        totalDealsFound: dealsResult.total || 0
      };
    } catch (error) {
      databaseLogger.error('Error obteniendo estadísticas:', error as Error);
      return {
        totalAlerts: 0,
        activeAlerts: 0,
        totalNotifications: 0,
        totalDealsFound: 0
      };
    }
  }

  /**
   * Mapea una fila de base de datos a un objeto FlightAlert
   */
  private mapRowToAlert(row: any): FlightAlert {
    return {
      id: row.id,
      userId: row.user_id,
      chatId: row.chat_id,
      fromAirport: row.from_airport,
      toAirport: row.to_airport,
      maxPrice: row.max_price,
      currency: row.currency,
      passengers: JSON.parse(row.passengers),
      searchMonth: row.search_month,
      isActive: row.is_active === 1,
      createdAt: new Date(row.created_at),
      lastChecked: row.last_checked ? new Date(row.last_checked) : undefined,
      alertsSent: row.alerts_sent
    };
  }

  /**
   * Limpia ofertas y notificaciones antiguas (más de 30 días)
   */
  cleanupOldData(): void {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const cleanupDeals = this.db.prepare(`
        DELETE FROM flight_deals 
        WHERE found_at < ?
      `);

      const cleanupNotifications = this.db.prepare(`
        DELETE FROM alert_notifications 
        WHERE sent_at < ?
      `);

      const dealsDeleted = cleanupDeals.run(thirtyDaysAgo.toISOString());
      const notificationsDeleted = cleanupNotifications.run(thirtyDaysAgo.toISOString());

      databaseLogger.info(
        `Limpieza completada: ${dealsDeleted.changes} ofertas y ${notificationsDeleted.changes} notificaciones eliminadas`
      );
    } catch (error) {
      databaseLogger.error('Error en limpieza de datos:', error as Error);
    }
  }

  /**
   * Cierra la conexión a la base de datos
   */
  close(): void {
    this.db.close();
  }
}
