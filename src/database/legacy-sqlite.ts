import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { config } from '@/config';
import { dbLogger } from '@/utils/logger';

/**
 * Clase para manejar la conexión y operaciones de base de datos
 */
export class DatabaseManager {
  private db: Database.Database;
  private static instance: DatabaseManager;

  private constructor() {
    // Crear directorio de datos si no existe
    const dataDir = path.dirname(config.database.path);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      dbLogger.info(`Directorio de datos creado: ${dataDir}`);
    }

    // Inicializar conexión a la base de datos
    this.db = new Database(config.database.path);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    
    dbLogger.info(`Base de datos conectada: ${config.database.path}`);
    this.initializeSchema();
  }

  /**
   * Obtener instancia singleton de la base de datos
   */
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * Inicializar schema de base de datos
   */
  private initializeSchema(): void {
    try {
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Ejecutar schema en transacción
      const transaction = this.db.transaction(() => {
        this.db.exec(schema);
      });
      
      transaction();
      dbLogger.info('Schema de base de datos inicializado correctamente');
    } catch (error) {
      dbLogger.error('Error inicializando schema de base de datos', error as Error);
      throw error;
    }
  }

  /**
   * Obtener conexión a la base de datos
   */
  public getConnection(): Database.Database {
    return this.db;
  }

  /**
   * Ejecutar consulta preparada con parámetros
   */
  public prepare(sql: string): Database.Statement {
    return this.db.prepare(sql);
  }

  /**
   * Ejecutar múltiples operaciones en transacción
   */
  public transaction<T>(fn: () => T): T {
    const txn = this.db.transaction(fn);
    return txn();
  }

  /**
   * Cerrar conexión a la base de datos
   */
  public close(): void {
    if (this.db) {
      this.db.close();
      dbLogger.info('Conexión a base de datos cerrada');
    }
  }

  /**
   * Crear backup de la base de datos
   */
  public async createBackup(): Promise<string> {
    try {
      const backupDir = config.database.backupPath;
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(backupDir, `flights_backup_${timestamp}.db`);
      
      await this.db.backup(backupPath);
      dbLogger.info(`Backup creado exitosamente: ${backupPath}`);
      
      return backupPath;
    } catch (error) {
      dbLogger.error('Error creando backup de base de datos', error as Error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de la base de datos
   */
  public getStats(): any {
    try {
      const stats = {
        totalUsers: this.db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number },
        activeAlerts: this.db.prepare('SELECT COUNT(*) as count FROM alerts WHERE active = 1').get() as { count: number },
        totalPriceRecords: this.db.prepare('SELECT COUNT(*) as count FROM price_history').get() as { count: number },
        notificationsSent: this.db.prepare('SELECT COUNT(*) as count FROM notifications_sent').get() as { count: number },
        dbSize: fs.statSync(config.database.path).size,
      };

      return stats;
    } catch (error) {
      dbLogger.error('Error obteniendo estadísticas de base de datos', error as Error);
      throw error;
    }
  }

  /**
   * Limpiar datos antiguos (mantener solo últimos 30 días)
   */
  public cleanOldData(): void {
    try {
      const transaction = this.db.transaction(() => {
        // Limpiar historial de precios mayor a 30 días
        const deletePriceHistory = this.db.prepare(`
          DELETE FROM price_history 
          WHERE scraped_at < datetime('now', '-30 days')
        `);

        // Limpiar notificaciones mayores a 90 días
        const deleteNotifications = this.db.prepare(`
          DELETE FROM notifications_sent 
          WHERE sent_at < datetime('now', '-90 days')
        `);

        // Limpiar logs de errores mayores a 7 días
        const deleteErrorLogs = this.db.prepare(`
          DELETE FROM error_logs 
          WHERE created_at < datetime('now', '-7 days') AND resolved = 1
        `);

        const priceResults = deletePriceHistory.run();
        const notificationResults = deleteNotifications.run();
        const errorResults = deleteErrorLogs.run();

        dbLogger.info(`Limpieza completada: ${priceResults.changes} precios, ${notificationResults.changes} notificaciones, ${errorResults.changes} logs eliminados`);
      });

      transaction();
    } catch (error) {
      dbLogger.error('Error en limpieza de datos antiguos', error as Error);
      throw error;
    }
  }

  /**
   * Verificar integridad de la base de datos
   */
  public checkIntegrity(): boolean {
    try {
      const result = this.db.prepare('PRAGMA integrity_check').get() as { integrity_check: string };
      const isOk = result.integrity_check === 'ok';
      
      if (isOk) {
        dbLogger.info('Verificación de integridad de base de datos: OK');
      } else {
        dbLogger.error(`Problemas de integridad detectados: ${result.integrity_check}`);
      }
      
      return isOk;
    } catch (error) {
      dbLogger.error('Error verificando integridad de base de datos', error as Error);
      return false;
    }
  }
}

// Exportar instancia singleton
export const db = DatabaseManager.getInstance();
