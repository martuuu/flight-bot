import { db } from '@/database';
import { Alert } from '@/types';
import { dbLogger } from '@/utils/logger';

/**
 * Modelo para operaciones CRUD de alertas
 */
export class AlertModel {
  /**
   * Crear nueva alerta
   */
  static create(
    userId: number,
    origin: string,
    destination: string,
    maxPrice: number,
    currency = 'COP',
    departureDate?: Date,
    returnDate?: Date,
    passengers = 1,
    cabinClass = 'economy'
  ): Alert {
    try {
      const stmt = db.prepare(`
        INSERT INTO alerts (user_id, origin, destination, max_price, currency, 
                           departure_date, return_date, passengers, cabin_class)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        userId,
        origin.toUpperCase(),
        destination.toUpperCase(),
        maxPrice,
        currency,
        departureDate?.toISOString().split('T')[0],
        returnDate?.toISOString().split('T')[0],
        passengers,
        cabinClass
      );

      dbLogger.info(`Alerta creada con ID: ${result.lastInsertRowid}`, {
        userId,
        origin,
        destination,
        maxPrice,
      });

      return this.findById(Number(result.lastInsertRowid))!;
    } catch (error) {
      dbLogger.error('Error creando alerta', error as Error, {
        userId,
        origin,
        destination,
        maxPrice,
      });
      throw error;
    }
  }

  /**
   * Buscar alerta por ID
   */
  static findById(id: number): Alert | null {
    try {
      const stmt = db.prepare(`
        SELECT id, user_id as userId, origin, destination, max_price as maxPrice,
               active, created_at as createdAt, last_checked as lastChecked,
               notification_count as notificationCount
        FROM alerts 
        WHERE id = ?
      `);

      const result = stmt.get(id) as any;

      if (result) {
        return {
          ...result,
          createdAt: new Date(result.createdAt),
          lastChecked: result.lastChecked ? new Date(result.lastChecked) : undefined,
        };
      }

      return null;
    } catch (error) {
      dbLogger.error('Error buscando alerta por ID', error as Error, { id });
      throw error;
    }
  }

  /**
   * Obtener alertas activas de un usuario
   */
  static findActiveByUserId(userId: number): Alert[] {
    try {
      const stmt = db.prepare(`
        SELECT id, user_id as userId, origin, destination, max_price as maxPrice,
               active, created_at as createdAt, last_checked as lastChecked,
               notification_count as notificationCount
        FROM alerts 
        WHERE user_id = ? AND active = 1
        ORDER BY created_at DESC
      `);

      const results = stmt.all(userId) as any[];

      return results.map(alert => ({
        ...alert,
        createdAt: new Date(alert.createdAt),
        lastChecked: alert.lastChecked ? new Date(alert.lastChecked) : undefined,
      }));
    } catch (error) {
      dbLogger.error('Error obteniendo alertas activas de usuario', error as Error, { userId });
      throw error;
    }
  }

  /**
   * Obtener todas las alertas activas del sistema
   */
  static findAllActive(): Alert[] {
    try {
      const stmt = db.prepare(`
        SELECT id, user_id as userId, origin, destination, max_price as maxPrice,
               active, created_at as createdAt, last_checked as lastChecked,
               notification_count as notificationCount
        FROM alerts 
        WHERE active = 1
        ORDER BY last_checked ASC NULLS FIRST
      `);

      const results = stmt.all() as any[];

      return results.map(alert => ({
        ...alert,
        createdAt: new Date(alert.createdAt),
        lastChecked: alert.lastChecked ? new Date(alert.lastChecked) : undefined,
      }));
    } catch (error) {
      dbLogger.error('Error obteniendo todas las alertas activas', error as Error);
      throw error;
    }
  }

  /**
   * Desactivar alerta
   */
  static deactivate(id: number): boolean {
    try {
      const stmt = db.prepare(`
        UPDATE alerts 
        SET active = 0 
        WHERE id = ?
      `);

      const result = stmt.run(id);

      if (result.changes > 0) {
        dbLogger.info(`Alerta desactivada: ${id}`);
      }

      return result.changes > 0;
    } catch (error) {
      dbLogger.error('Error desactivando alerta', error as Error, { id });
      throw error;
    }
  }

  /**
   * Desactivar todas las alertas de un usuario
   */
  static deactivateAllByUserId(userId: number): number {
    try {
      const stmt = db.prepare(`
        UPDATE alerts 
        SET active = 0 
        WHERE user_id = ? AND active = 1
      `);

      const result = stmt.run(userId);

      dbLogger.info(`${result.changes} alertas desactivadas para usuario ${userId}`);

      return result.changes;
    } catch (error) {
      dbLogger.error('Error desactivando todas las alertas del usuario', error as Error, { userId });
      throw error;
    }
  }

  /**
   * Actualizar última verificación de alerta
   */
  static updateLastChecked(id: number): boolean {
    try {
      const stmt = db.prepare(`
        UPDATE alerts 
        SET last_checked = CURRENT_TIMESTAMP 
        WHERE id = ?
      `);

      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      dbLogger.error('Error actualizando última verificación', error as Error, { id });
      throw error;
    }
  }

  /**
   * Contar alertas activas de un usuario
   */
  static countActiveByUserId(userId: number): number {
    try {
      const stmt = db.prepare(`
        SELECT COUNT(*) as count 
        FROM alerts 
        WHERE user_id = ? AND active = 1
      `);

      const result = stmt.get(userId) as { count: number };
      return result.count;
    } catch (error) {
      dbLogger.error('Error contando alertas activas de usuario', error as Error, { userId });
      throw error;
    }
  }

  /**
   * Verificar si existe alerta duplicada
   */
  static findDuplicate(
    userId: number,
    origin: string,
    destination: string,
    departureDate?: Date
  ): Alert | null {
    try {
      let sql = `
        SELECT id, user_id as userId, origin, destination, max_price as maxPrice,
               active, created_at as createdAt, last_checked as lastChecked,
               notification_count as notificationCount
        FROM alerts 
        WHERE user_id = ? AND origin = ? AND destination = ? AND active = 1
      `;

      const params: any[] = [userId, origin.toUpperCase(), destination.toUpperCase()];

      if (departureDate) {
        sql += ' AND departure_date = ?';
        params.push(departureDate.toISOString().split('T')[0]);
      }

      const stmt = db.prepare(sql);
      const result = stmt.get(...params) as any;

      if (result) {
        return {
          ...result,
          createdAt: new Date(result.createdAt),
          lastChecked: result.lastChecked ? new Date(result.lastChecked) : undefined,
        };
      }

      return null;
    } catch (error) {
      dbLogger.error('Error buscando alerta duplicada', error as Error, {
        userId,
        origin,
        destination,
      });
      throw error;
    }
  }

  /**
   * Obtener alertas que necesitan verificación
   */
  static findPendingCheck(limitMinutes = 30): Alert[] {
    try {
      const stmt = db.prepare(`
        SELECT id, user_id as userId, origin, destination, max_price as maxPrice,
               active, created_at as createdAt, last_checked as lastChecked,
               notification_count as notificationCount
        FROM alerts 
        WHERE active = 1 
        AND (last_checked IS NULL OR last_checked < datetime('now', '-${limitMinutes} minutes'))
        ORDER BY last_checked ASC NULLS FIRST
        LIMIT 50
      `);

      const results = stmt.all() as any[];

      return results.map(alert => ({
        ...alert,
        createdAt: new Date(alert.createdAt),
        lastChecked: alert.lastChecked ? new Date(alert.lastChecked) : undefined,
      }));
    } catch (error) {
      dbLogger.error('Error obteniendo alertas pendientes de verificación', error as Error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de alertas
   */
  static getStats(): any {
    try {
      const totalAlerts = db.prepare('SELECT COUNT(*) as count FROM alerts').get() as { count: number };
      const activeAlerts = db.prepare('SELECT COUNT(*) as count FROM alerts WHERE active = 1').get() as { count: number };
      const alertsToday = db.prepare(`
        SELECT COUNT(*) as count FROM alerts 
        WHERE DATE(created_at) = DATE('now')
      `).get() as { count: number };

      const topRoutes = db.prepare(`
        SELECT origin, destination, COUNT(*) as count
        FROM alerts 
        WHERE active = 1
        GROUP BY origin, destination
        ORDER BY count DESC
        LIMIT 5
      `).all() as Array<{ origin: string; destination: string; count: number }>;

      return {
        total: totalAlerts.count,
        active: activeAlerts.count,
        newToday: alertsToday.count,
        topRoutes,
      };
    } catch (error) {
      dbLogger.error('Error obteniendo estadísticas de alertas', error as Error);
      throw error;
    }
  }
}
