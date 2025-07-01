import { db } from '@/database';
import { User } from '@/types';
import { dbLogger } from '@/utils/logger';

/**
 * Modelo para operaciones CRUD de usuarios
 */
export class UserModel {
  /**
   * Crear nuevo usuario
   */
  static create(telegramId: number, username?: string, firstName?: string, lastName?: string): User {
    try {
      const stmt = db.prepare(`
        INSERT INTO users (telegram_id, username, first_name, last_name)
        VALUES (?, ?, ?, ?)
      `);

      const result = stmt.run(telegramId, username, firstName, lastName);
      
      dbLogger.info(`Usuario creado con ID: ${result.lastInsertRowid}`, { telegramId, username });
      
      return this.findByTelegramId(telegramId)!;
    } catch (error) {
      dbLogger.error('Error creando usuario', error as Error, { telegramId, username });
      throw error;
    }
  }

  /**
   * Buscar usuario por Telegram ID
   */
  static findByTelegramId(telegramId: number): User | null {
    try {
      const stmt = db.prepare(`
        SELECT id, telegram_id as telegramId, username, first_name as firstName, 
               last_name as lastName, created_at as createdAt, is_active as isActive
        FROM users 
        WHERE telegram_id = ?
      `);

      const result = stmt.get(telegramId) as User | undefined;
      
      if (result) {
        // Convertir string dates a Date objects
        result.createdAt = new Date(result.createdAt);
      }
      
      return result || null;
    } catch (error) {
      dbLogger.error('Error buscando usuario por Telegram ID', error as Error, { telegramId });
      throw error;
    }
  }

  /**
   * Buscar usuario por ID interno
   */
  static findById(id: number): User | null {
    try {
      const stmt = db.prepare(`
        SELECT id, telegram_id as telegramId, username, first_name as firstName, 
               last_name as lastName, created_at as createdAt, is_active as isActive
        FROM users 
        WHERE id = ?
      `);

      const result = stmt.get(id) as User | undefined;
      
      if (result) {
        result.createdAt = new Date(result.createdAt);
      }
      
      return result || null;
    } catch (error) {
      dbLogger.error('Error buscando usuario por ID', error as Error, { id });
      throw error;
    }
  }

  /**
   * Actualizar última actividad del usuario
   */
  static updateLastActivity(telegramId: number): boolean {
    try {
      const stmt = db.prepare(`
        UPDATE users 
        SET last_activity = CURRENT_TIMESTAMP 
        WHERE telegram_id = ?
      `);

      const result = stmt.run(telegramId);
      return result.changes > 0;
    } catch (error) {
      dbLogger.error('Error actualizando última actividad', error as Error, { telegramId });
      throw error;
    }
  }

  /**
   * Obtener o crear usuario (upsert)
   */
  static findOrCreate(telegramId: number, username?: string, firstName?: string, lastName?: string): User {
    let user = this.findByTelegramId(telegramId);
    
    if (!user) {
      user = this.create(telegramId, username, firstName, lastName);
    } else {
      // Actualizar información si cambió
      this.updateInfo(telegramId, username, firstName, lastName);
      this.updateLastActivity(telegramId);
    }
    
    return user;
  }

  /**
   * Actualizar información del usuario
   */
  static updateInfo(telegramId: number, username?: string, firstName?: string, lastName?: string): boolean {
    try {
      const stmt = db.prepare(`
        UPDATE users 
        SET username = ?, first_name = ?, last_name = ?
        WHERE telegram_id = ?
      `);

      const result = stmt.run(username, firstName, lastName, telegramId);
      return result.changes > 0;
    } catch (error) {
      dbLogger.error('Error actualizando información de usuario', error as Error, { telegramId });
      throw error;
    }
  }

  /**
   * Desactivar usuario
   */
  static deactivate(telegramId: number): boolean {
    try {
      const stmt = db.prepare(`
        UPDATE users 
        SET is_active = 0 
        WHERE telegram_id = ?
      `);

      const result = stmt.run(telegramId);
      
      if (result.changes > 0) {
        dbLogger.info(`Usuario desactivado: ${telegramId}`);
      }
      
      return result.changes > 0;
    } catch (error) {
      dbLogger.error('Error desactivando usuario', error as Error, { telegramId });
      throw error;
    }
  }

  /**
   * Reactivar usuario
   */
  static reactivate(telegramId: number): boolean {
    try {
      const stmt = db.prepare(`
        UPDATE users 
        SET is_active = 1 
        WHERE telegram_id = ?
      `);

      const result = stmt.run(telegramId);
      
      if (result.changes > 0) {
        dbLogger.info(`Usuario reactivado: ${telegramId}`);
      }
      
      return result.changes > 0;
    } catch (error) {
      dbLogger.error('Error reactivando usuario', error as Error, { telegramId });
      throw error;
    }
  }

  /**
   * Obtener estadísticas de usuarios
   */
  static getStats(): any {
    try {
      const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
      const activeUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE is_active = 1').get() as { count: number };
      const usersToday = db.prepare(`
        SELECT COUNT(*) as count FROM users 
        WHERE DATE(created_at) = DATE('now')
      `).get() as { count: number };
      
      const usersThisWeek = db.prepare(`
        SELECT COUNT(*) as count FROM users 
        WHERE created_at >= datetime('now', '-7 days')
      `).get() as { count: number };

      return {
        total: totalUsers.count,
        active: activeUsers.count,
        newToday: usersToday.count,
        newThisWeek: usersThisWeek.count,
      };
    } catch (error) {
      dbLogger.error('Error obteniendo estadísticas de usuarios', error as Error);
      throw error;
    }
  }

  /**
   * Listar todos los usuarios activos
   */
  static listActive(limit = 100, offset = 0): User[] {
    try {
      const stmt = db.prepare(`
        SELECT id, telegram_id as telegramId, username, first_name as firstName, 
               last_name as lastName, created_at as createdAt, is_active as isActive
        FROM users 
        WHERE is_active = 1
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `);

      const results = stmt.all(limit, offset) as User[];
      
      return results.map(user => ({
        ...user,
        createdAt: new Date(user.createdAt),
      }));
    } catch (error) {
      dbLogger.error('Error listando usuarios activos', error as Error);
      throw error;
    }
  }
}
