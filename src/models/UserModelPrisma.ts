import { PrismaClient } from '@prisma/client';
import { User } from '@/types';
import { dbLogger } from '@/utils/logger';
import { PrismaDatabaseManager } from '@/database/prisma-adapter';

/**
 * Modelo para operaciones CRUD de usuarios usando Prisma
 */
export class UserModelPrisma {
  private static prisma: PrismaClient = PrismaDatabaseManager.getInstance().getClient();

  /**
   * Crear nuevo usuario de Telegram
   */
  static async create(telegramId: number, username?: string, firstName?: string, lastName?: string): Promise<User> {
    try {
      const telegramUser = await this.prisma.telegramUser.create({
        data: {
          telegramId: telegramId.toString(),
          username: username || null,
          firstName: firstName || null,
          lastName: lastName || null,
        },
      });

      dbLogger.info(`Usuario de Telegram creado: ${telegramUser.id}`, { telegramId, username });
      
      const user: User = {
        id: telegramUser.id, // Usar el CUID directamente
        telegramId: telegramId,
        createdAt: telegramUser.createdAt,
        isActive: true,
      };
      
      if (telegramUser.username) user.username = telegramUser.username;
      if (telegramUser.firstName) user.firstName = telegramUser.firstName;
      if (telegramUser.lastName) user.lastName = telegramUser.lastName;
      
      return user;
    } catch (error) {
      dbLogger.error('Error creando usuario', error as Error, { telegramId, username });
      throw error;
    }
  }

  /**
   * Buscar usuario por Telegram ID
   */
  static async findByTelegramId(telegramId: number): Promise<User | null> {
    try {
      const telegramUser = await this.prisma.telegramUser.findUnique({
        where: { telegramId: telegramId.toString() },
      });

      if (!telegramUser) return null;

      const user: User = {
        id: telegramUser.id, // Usar el CUID directamente
        telegramId: telegramId,
        createdAt: telegramUser.createdAt,
        isActive: true,
      };
      
      if (telegramUser.username) user.username = telegramUser.username;
      if (telegramUser.firstName) user.firstName = telegramUser.firstName;
      if (telegramUser.lastName) user.lastName = telegramUser.lastName;
      
      return user;
    } catch (error) {
      dbLogger.error('Error buscando usuario por Telegram ID', error as Error, { telegramId });
      return null;
    }
  }

  /**
   * Buscar o crear usuario
   */
  static async findOrCreate(telegramId: number, username?: string, firstName?: string, lastName?: string): Promise<User> {
    try {
      let user = await this.findByTelegramId(telegramId);
      
      if (!user) {
        user = await this.create(telegramId, username, firstName, lastName);
      } else {
        // Actualizar información si cambió
        if (username !== user.username || firstName !== user.firstName || lastName !== user.lastName) {
          await this.update(telegramId, { 
            username: username || null, 
            firstName: firstName || null, 
            lastName: lastName || null 
          } as any);
          user = await this.findByTelegramId(telegramId);
        }
      }

      return user!;
    } catch (error) {
      dbLogger.error('Error en findOrCreate', error as Error, { telegramId, username });
      throw error;
    }
  }

  /**
   * Actualizar usuario
   */
  static async update(telegramId: number, data: Partial<{ username?: string; firstName?: string; lastName?: string }>): Promise<boolean> {
    try {
      await this.prisma.telegramUser.update({
        where: { telegramId: telegramId.toString() },
        data: {
          username: data.username || null,
          firstName: data.firstName || null,
          lastName: data.lastName || null,
          lastActivity: new Date(),
        },
      });

      dbLogger.info(`Usuario actualizado: ${telegramId}`);
      return true;
    } catch (error) {
      dbLogger.error('Error actualizando usuario', error as Error, { telegramId });
      return false;
    }
  }

  /**
   * Eliminar usuario
   */
  static async delete(telegramId: number): Promise<boolean> {
    try {
      await this.prisma.telegramUser.delete({
        where: { telegramId: telegramId.toString() },
      });

      dbLogger.info(`Usuario eliminado: ${telegramId}`);
      return true;
    } catch (error) {
      dbLogger.error('Error eliminando usuario', error as Error, { telegramId });
      return false;
    }
  }

  /**
   * Obtener todos los usuarios
   */
  static async findAll(): Promise<User[]> {
    try {
      const telegramUsers = await this.prisma.telegramUser.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return telegramUsers.map(telegramUser => {
        const user: User = {
          id: telegramUser.id,
          telegramId: parseInt(telegramUser.telegramId),
          createdAt: telegramUser.createdAt,
          isActive: true,
        };
        
        if (telegramUser.username) user.username = telegramUser.username;
        if (telegramUser.firstName) user.firstName = telegramUser.firstName;
        if (telegramUser.lastName) user.lastName = telegramUser.lastName;
        
        return user;
      });
    } catch (error) {
      dbLogger.error('Error obteniendo todos los usuarios', error as Error);
      return [];
    }
  }

  /**
   * Contar usuarios
   */
  static async count(): Promise<number> {
    try {
      return await this.prisma.telegramUser.count();
    } catch (error) {
      dbLogger.error('Error contando usuarios', error as Error);
      return 0;
    }
  }

  /**
   * Buscar usuarios activos (últimos 30 días)
   */
  static async findActiveUsers(days: number = 30): Promise<User[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const telegramUsers = await this.prisma.telegramUser.findMany({
        where: {
          lastActivity: {
            gte: cutoffDate,
          },
        },
        orderBy: { lastActivity: 'desc' },
      });

      return telegramUsers.map(telegramUser => {
        const user: User = {
          id: telegramUser.id,
          telegramId: parseInt(telegramUser.telegramId),
          createdAt: telegramUser.createdAt,
          isActive: true,
        };
        
        if (telegramUser.username) user.username = telegramUser.username;
        if (telegramUser.firstName) user.firstName = telegramUser.firstName;
        if (telegramUser.lastName) user.lastName = telegramUser.lastName;
        
        return user;
      });
    } catch (error) {
      dbLogger.error('Error obteniendo usuarios activos', error as Error);
      return [];
    }
  }

  /**
   * Marcar actividad del usuario
   */
  static async updateActivity(telegramId: number): Promise<void> {
    try {
      await this.prisma.telegramUser.update({
        where: { telegramId: telegramId.toString() },
        data: { lastActivity: new Date() },
      });
    } catch (error) {
      // No logear como error porque puede no existir el usuario aún
      dbLogger.debug('Usuario no encontrado para actualizar actividad', { telegramId });
    }
  }

  /**
   * Obtener estadísticas de usuarios
   */
  static async getUserStats(): Promise<{
    total: number;
    active30Days: number;
    linked: number;
    unlinked: number;
  }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);

      const [total, active30Days, linked, unlinked] = await Promise.all([
        this.prisma.telegramUser.count(),
        this.prisma.telegramUser.count({
          where: { lastActivity: { gte: cutoffDate } },
        }),
        this.prisma.telegramUser.count({
          where: { isLinked: true },
        }),
        this.prisma.telegramUser.count({
          where: { isLinked: false },
        }),
      ]);

      return { total, active30Days, linked, unlinked };
    } catch (error) {
      dbLogger.error('Error obteniendo estadísticas de usuarios', error as Error);
      return { total: 0, active30Days: 0, linked: 0, unlinked: 0 };
    }
  }
}
