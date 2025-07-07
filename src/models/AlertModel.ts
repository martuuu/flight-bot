import { db } from '@/database';
import { dbLogger } from '@/utils/logger';
import { Alert as PrismaAlert } from '@prisma/client';

/**
 * Modelo para operaciones CRUD de alertas usando Prisma
 */
export class AlertModel {
  /**
   * Crear nueva alerta
   */
  static async create(
    userId: string,
    origin: string,
    destination: string,
    maxPrice: number,
    currency = 'USD',
    departureDate?: Date,
    returnDate?: Date,
    adults = 1,
    children = 0,
    infants = 0
  ): Promise<PrismaAlert> {
    try {
      const prisma = db.getClient();
      
      const alert = await prisma.alert.create({
        data: {
          userId,
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase(),
          maxPrice,
          currency,
          departureDate: departureDate || null,
          returnDate: returnDate || null,
          adults,
          children,
          infants,
          isActive: true,
        },
      });

      dbLogger.info(`Alerta creada con ID: ${alert.id}`, {
        userId,
        origin,
        destination,
        maxPrice,
      });

      return alert;
    } catch (error) {
      dbLogger.error('Error creando alerta', error as Error);
      throw error;
    }
  }

  /**
   * Buscar alerta por ID
   */
  static async findById(id: string): Promise<PrismaAlert | null> {
    try {
      const prisma = db.getClient();
      return await prisma.alert.findUnique({
        where: { id },
        include: {
          user: true,
          priceHistory: true,
        },
      });
    } catch (error) {
      dbLogger.error('Error buscando alerta por ID', error as Error);
      return null;
    }
  }

  /**
   * Obtener alertas activas de un usuario por String ID
   */
  static async findActiveByUserId(userId: string): Promise<PrismaAlert[]> {
    try {
      const prisma = db.getClient();
      return await prisma.alert.findMany({
        where: {
          userId,
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          priceHistory: {
            orderBy: {
              foundAt: 'desc',
            },
            take: 1, // Solo el precio más reciente
          },
        },
      });
    } catch (error) {
      dbLogger.error('Error obteniendo alertas activas de usuario', error as Error);
      throw error;
    }
  }

  /**
   * Obtener alertas activas de un usuario por Telegram ID
   */
  static async findActiveByTelegramId(telegramId: number): Promise<PrismaAlert[]> {
    try {
      const prisma = db.getClient();
      
      // Buscar el usuario de Telegram y obtener su ID de usuario vinculado
      const telegramUser = await prisma.telegramUser.findUnique({
        where: { telegramId: telegramId.toString() },
      });

      if (!telegramUser?.linkedUserId) {
        dbLogger.info(`Usuario de Telegram ${telegramId} no tiene usuario vinculado`);
        return [];
      }

      return await prisma.alert.findMany({
        where: {
          userId: telegramUser.linkedUserId,
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          priceHistory: {
            orderBy: {
              foundAt: 'desc',
            },
            take: 1, // Solo el precio más reciente
          },
        },
      });
    } catch (error) {
      dbLogger.error('Error obteniendo alertas activas por Telegram ID', error as Error);
      return [];
    }
  }

  /**
   * Obtener todas las alertas de un usuario
   */
  static async findByUserId(userId: string): Promise<PrismaAlert[]> {
    try {
      const prisma = db.getClient();
      return await prisma.alert.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          priceHistory: {
            orderBy: {
              foundAt: 'desc',
            },
            take: 1,
          },
        },
      });
    } catch (error) {
      dbLogger.error('Error obteniendo alertas de usuario', error as Error);
      return [];
    }
  }

  /**
   * Actualizar alerta
   */
  static async update(
    id: string,
    updates: Partial<{
      maxPrice: number;
      isActive: boolean;
      isPaused: boolean;
      departureDate: Date | null;
      returnDate: Date | null;
      lastChecked: Date;
    }>
  ): Promise<PrismaAlert | null> {
    try {
      const prisma = db.getClient();
      return await prisma.alert.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      dbLogger.error('Error actualizando alerta', error as Error);
      return null;
    }
  }

  /**
   * Eliminar alerta
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const prisma = db.getClient();
      await prisma.alert.delete({
        where: { id },
      });
      
      dbLogger.info(`Alerta eliminada: ${id}`);
      return true;
    } catch (error) {
      dbLogger.error('Error eliminando alerta', error as Error);
      return false;
    }
  }

  /**
   * Pausar/reanudar alerta
   */
  static async togglePause(id: string): Promise<PrismaAlert | null> {
    try {
      const prisma = db.getClient();
      const alert = await prisma.alert.findUnique({ where: { id } });
      
      if (!alert) return null;
      
      return await prisma.alert.update({
        where: { id },
        data: {
          isPaused: !alert.isPaused,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      dbLogger.error('Error pausando/reanudando alerta', error as Error);
      return null;
    }
  }

  /**
   * Obtener alertas activas para el sistema de scraping
   */
  static async findActiveForScraping(): Promise<PrismaAlert[]> {
    try {
      const prisma = db.getClient();
      return await prisma.alert.findMany({
        where: {
          isActive: true,
          isPaused: false,
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      dbLogger.error('Error obteniendo alertas para scraping', error as Error);
      return [];
    }
  }

  /**
   * Actualizar timestamp de última verificación
   */
  static async updateLastChecked(id: string): Promise<void> {
    try {
      const prisma = db.getClient();
      await prisma.alert.update({
        where: { id },
        data: {
          lastChecked: new Date(),
        },
      });
    } catch (error) {
      dbLogger.error('Error actualizando última verificación', error as Error);
    }
  }

  /**
   * Obtener estadísticas de alertas
   */
  static async getStats(): Promise<{
    total: number;
    active: number;
    paused: number;
    today: number;
  }> {
    try {
      const prisma = db.getClient();
      
      const total = await prisma.alert.count();
      const active = await prisma.alert.count({
        where: { isActive: true, isPaused: false },
      });
      const paused = await prisma.alert.count({
        where: { isPaused: true },
      });
      const today = await prisma.alert.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      });

      return { total, active, paused, today };
    } catch (error) {
      dbLogger.error('Error obteniendo estadísticas de alertas', error as Error);
      return { total: 0, active: 0, paused: 0, today: 0 };
    }
  }

  /**
   * Obtener alertas que necesitan verificación
   */
  static async findPendingCheck(limitMinutes = 30): Promise<(PrismaAlert & { user: any })[]> {
    try {
      const prisma = db.getClient();
      const cutoffTime = new Date();
      cutoffTime.setMinutes(cutoffTime.getMinutes() - limitMinutes);

      return await prisma.alert.findMany({
        where: {
          isActive: true,
          isPaused: false,
          OR: [
            { lastChecked: null },
            { lastChecked: { lt: cutoffTime } }
          ]
        },
        orderBy: [
          { lastChecked: 'asc' },
          { createdAt: 'asc' }
        ],
        take: 50, // Limitar a 50 alertas por verificación
        include: {
          user: true, // Incluir información del usuario
          priceHistory: {
            orderBy: {
              foundAt: 'desc',
            },
            take: 1,
          },
        },
      });
    } catch (error) {
      dbLogger.error('Error obteniendo alertas pendientes de verificación', error as Error);
      return [];
    }
  }
}

// Mantener compatibilidad con el tipo Alert legacy
export interface Alert {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  maxPrice: number;
  currency: string;
  departureDate?: Date | null;
  returnDate?: Date | null;
  adults: number;
  children: number;
  infants: number;
  isActive: boolean;
  isPaused: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastChecked?: Date | null;
}
