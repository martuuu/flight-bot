import { PrismaClient } from '@prisma/client';
import { dbLogger } from '@/utils/logger';

/**
 * Clase para manejar la conexión y operaciones de base de datos con Prisma
 */
export class DatabaseManager {
  private prisma: PrismaClient;
  private static instance: DatabaseManager;

  private constructor() {
    // Inicializar Prisma Client
    this.prisma = new PrismaClient({
      log: ['error', 'warn'],
      errorFormat: 'pretty',
    });
    
    dbLogger.info('Prisma Client inicializado');
    this.connect();
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
   * Conectar a la base de datos
   */
  private async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      dbLogger.info('Conexión a PostgreSQL establecida correctamente');
    } catch (error) {
      dbLogger.error('Error conectando a PostgreSQL', error as Error);
      throw error;
    }
  }

  /**
   * Obtener instancia de Prisma Client
   */
  public getClient(): PrismaClient {
    return this.prisma;
  }

  /**
   * Ejecutar múltiples operaciones en transacción
   */
  public async transaction<T>(fn: (prisma: any) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      return fn(tx);
    });
  }

  /**
   * Cerrar conexión a la base de datos
   */
  public async close(): Promise<void> {
    if (this.prisma) {
      await this.prisma.$disconnect();
      dbLogger.info('Conexión a base de datos cerrada');
    }
  }

  /**
   * Obtener estadísticas de la base de datos
   */
  public async getStats(): Promise<any> {
    try {
      const [
        totalUsers,
        activeAlerts,
        totalPriceRecords,
        notificationsSent
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.alert.count({ where: { isActive: true } }),
        this.prisma.priceHistory.count(),
        this.prisma.alertNotification.count({ where: { sent: true } })
      ]);

      return {
        totalUsers,
        activeAlerts,
        totalPriceRecords,
        notificationsSent,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      dbLogger.error('Error obteniendo estadísticas de base de datos', error as Error);
      throw error;
    }
  }

  /**
   * Limpiar datos antiguos (mantener solo últimos 30 días)
   */
  public async cleanOldData(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      await this.transaction(async (tx) => {
        // Limpiar historial de precios mayor a 30 días
        const priceResults = await tx.priceHistory.deleteMany({
          where: {
            foundAt: {
              lt: thirtyDaysAgo
            }
          }
        });

        // Limpiar notificaciones mayores a 90 días
        const notificationResults = await tx.alertNotification.deleteMany({
          where: {
            createdAt: {
              lt: ninetyDaysAgo
            }
          }
        });

        dbLogger.info(`Limpieza completada: ${priceResults.count} precios, ${notificationResults.count} notificaciones eliminados`);
      });
    } catch (error) {
      dbLogger.error('Error en limpieza de datos antiguos', error as Error);
      throw error;
    }
  }

  /**
   * Verificar salud de la conexión
   */
  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbLogger.info('Verificación de salud de base de datos: OK');
      return true;
    } catch (error) {
      dbLogger.error('Problemas de conexión detectados', error as Error);
      return false;
    }
  }

  /**
   * Obtener usuario por telegram ID
   */
  public async getUserByTelegramId(telegramId: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { telegramId },
      include: {
        alerts: true,
        notificationSettings: true
      }
    });
  }

  /**
   * Actualizar información de Telegram de un usuario existente
   */
  public async updateTelegramUserInfo(telegramId: string, data: {
    username?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<any> {
    const { username, firstName, lastName } = data;
    const name = firstName && lastName ? `${firstName} ${lastName}` : firstName || username || null;
    
    return this.prisma.user.update({
      where: { telegramId },
      data: {
        telegramUsername: username || null,
        name: name,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Crear usuario que solo existe en Telegram (sin webapp)
   */
  public async createTelegramOnlyUser(userData: {
    telegramId: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<any> {
    const { telegramId, username, firstName, lastName } = userData;
    const name = firstName && lastName ? `${firstName} ${lastName}` : firstName || username || `User ${telegramId}`;
    
    return this.prisma.user.create({
      data: {
        telegramId,
        telegramUsername: username || null,
        name: name,
        email: `telegram_${telegramId}@temp.com`, // Email temporal para cumplir constraint
        telegramLinked: false, // NO vincular automáticamente
        role: 'BASIC' // Role por defecto para usuarios solo de Telegram
      }
    });
  }

  /**
   * Crear alerta
   */
  public async createAlert(alertData: {
    userId: string;
    origin: string;
    destination: string;
    maxPrice: number;
    currency?: string;
    departureDate?: Date;
    returnDate?: Date;
    adults?: number;
    children?: number;
    infants?: number;
    telegramAlertId?: string;
  }): Promise<any> {
    return this.prisma.alert.create({
      data: {
        ...alertData,
        currency: alertData.currency || 'USD',
        adults: alertData.adults || 1,
        children: alertData.children || 0,
        infants: alertData.infants || 0
      }
    });
  }

  /**
   * Obtener alertas activas de un usuario
   */
  public async getUserAlerts(userId: string): Promise<any[]> {
    return this.prisma.alert.findMany({
      where: {
        userId,
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Obtener todas las alertas activas para procesamiento
   */
  public async getActiveAlerts(): Promise<any[]> {
    return this.prisma.alert.findMany({
      where: {
        isActive: true,
        isPaused: false
      },
      include: {
        user: true
      }
    });
  }

  /**
   * Actualizar última verificación de alerta
   */
  public async updateAlertLastChecked(alertId: string): Promise<void> {
    await this.prisma.alert.update({
      where: { id: alertId },
      data: { lastChecked: new Date() }
    });
  }

  /**
   * Registrar precio encontrado
   */
  public async recordPrice(priceData: {
    alertId: string;
    userId: string;
    price: number;
    currency: string;
    airline?: string;
    flightNumber?: string;
    departureDate: Date;
    returnDate?: Date;
    source?: string;
  }): Promise<any> {
    return this.prisma.priceHistory.create({
      data: {
        ...priceData,
        source: priceData.source || 'ARAJET'
      }
    });
  }

  /**
   * Crear notificación
   */
  public async createNotification(notificationData: {
    alertId: string;
    userId: string;
    type: string;
    channel: string;
    message: string;
    price?: number;
    currency?: string;
  }): Promise<any> {
    return this.prisma.alertNotification.create({
      data: notificationData
    });
  }

  /**
   * Marcar notificación como enviada
   */
  public async markNotificationSent(notificationId: string): Promise<void> {
    await this.prisma.alertNotification.update({
      where: { id: notificationId },
      data: {
        sent: true,
        sentAt: new Date()
      }
    });
  }

  /**
   * Crear backup de la base de datos
   */
  public async createBackup(): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const backupPath = `./backups/postgres_backup_${timestamp}.sql`;
      
      // En un entorno real, usarías pg_dump aquí
      // Por ahora, solo retornamos la ruta donde estaría el backup
      dbLogger.info(`Backup simulado creado en: ${backupPath}`);
      return backupPath;
    } catch (error) {
      dbLogger.error('Error creando backup', error as Error);
      throw error;
    }
  }

  /**
   * Verificar integridad de la base de datos
   */
  public async checkIntegrity(): Promise<boolean> {
    try {
      // Verificar que las tablas principales existan y funcionen
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.alert.count(),
        this.prisma.priceHistory.count(),
        this.prisma.alertNotification.count()
      ]);
      
      dbLogger.info('Verificación de integridad: OK');
      return true;
    } catch (error) {
      dbLogger.error('Problemas de integridad detectados', error as Error);
      return false;
    }
  }

  /**
   * Encontrar usuario por ID
   */
  public async findUserById(userId: string): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        alerts: true,
        notificationSettings: true
      }
    });
  }

  /**
   * Actualizar información de Telegram de un usuario de webapp
   */
  public async updateUserTelegramInfo(userId: string, data: {
    telegramId: string;
    telegramUsername?: string | undefined;
    telegramLinked: boolean;
    telegramLinkedAt: Date;
  }): Promise<any> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        telegramId: data.telegramId,
        telegramUsername: data.telegramUsername || null,
        telegramLinked: data.telegramLinked,
        telegramLinkedAt: data.telegramLinkedAt,
        updatedAt: new Date()
      }
    });
  }

}

// Exportar instancia singleton
export const db = DatabaseManager.getInstance();
