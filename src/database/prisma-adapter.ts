import { PrismaClient } from '@prisma/client';
import { dbLogger } from '@/utils/logger';

/**
 * Adaptador de Prisma para mantener compatibilidad con la interfaz SQLite
 */
export class PrismaDatabaseManager {
  private static instance: PrismaDatabaseManager;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
    dbLogger.info('Prisma client initialized');
  }

  /**
   * Obtener instancia singleton
   */
  public static getInstance(): PrismaDatabaseManager {
    if (!PrismaDatabaseManager.instance) {
      PrismaDatabaseManager.instance = new PrismaDatabaseManager();
    }
    return PrismaDatabaseManager.instance;
  }

  /**
   * Obtener cliente de Prisma
   */
  public getClient(): PrismaClient {
    return this.prisma;
  }

  /**
   * Cerrar conexión
   */
  public async close(): Promise<void> {
    await this.prisma.$disconnect();
    dbLogger.info('Prisma connection closed');
  }

  /**
   * Crear backup - placeholder para compatibilidad
   */
  public async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupName = `postgres_backup_${timestamp}`;
    dbLogger.info(`Backup would be created: ${backupName}`);
    return backupName;
  }

  /**
   * Ejecutar operaciones en transacción
   */
  public async transaction<T>(fn: (prisma: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(async (tx) => {
      return await fn(tx);
    });
  }

  // Métodos específicos para usuarios de Telegram
  public async findOrCreateTelegramUser(
    telegramId: string,
    username?: string,
    firstName?: string,
    lastName?: string
  ) {
    try {
      return await this.prisma.telegramUser.upsert({
        where: { telegramId },
        update: {
          username: username || null,
          firstName: firstName || null,
          lastName: lastName || null,
          lastActivity: new Date(),
        },
        create: {
          telegramId,
          username: username || null,
          firstName: firstName || null,
          lastName: lastName || null,
        },
      });
    } catch (error) {
      dbLogger.error('Error finding/creating Telegram user', error as Error);
      throw error;
    }
  }

  public async getUserByTelegramId(telegramId: string) {
    try {
      return await this.prisma.telegramUser.findUnique({
        where: { telegramId },
      });
    } catch (error) {
      dbLogger.error('Error getting user by Telegram ID', error as Error);
      throw error;
    }
  }

  public async linkTelegramToUser(telegramId: string, userId: string) {
    try {
      return await this.prisma.telegramUser.update({
        where: { telegramId },
        data: {
          isLinked: true,
          linkedUserId: userId,
          linkingCode: null,
          linkingExpires: null,
        },
      });
    } catch (error) {
      dbLogger.error('Error linking Telegram to user', error as Error);
      throw error;
    }
  }

  // Métodos para estadísticas
  public async getUserStats() {
    try {
      const [totalUsers, linkedUsers, totalAlerts, activeAlerts] = await Promise.all([
        this.prisma.telegramUser.count(),
        this.prisma.telegramUser.count({ where: { isLinked: true } }),
        this.prisma.flightAlert.count(),
        this.prisma.flightAlert.count({ where: { isActive: true } }),
      ]);

      return {
        totalUsers,
        linkedUsers,
        totalAlerts,
        activeAlerts,
      };
    } catch (error) {
      dbLogger.error('Error getting user stats', error as Error);
      throw error;
    }
  }
}
