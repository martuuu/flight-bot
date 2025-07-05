import { PrismaClient } from '@prisma/client';
import { FlightAlert, FlightDeal } from '../types/arajet-api';
import { scrapingLogger as databaseLogger } from '../utils/logger';

export class AlertManager {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Crea una nueva alerta de vuelo
   */
  async createAlert(alert: Omit<FlightAlert, 'id' | 'createdAt' | 'lastChecked' | 'alertsSent'>): Promise<string> {
    try {
      // Verificar si el usuario existe en la base de datos
      let user = await this.prisma.user.findUnique({
        where: { telegramId: alert.userId.toString() }
      });

      // Si no existe, crear el usuario
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            telegramId: alert.userId.toString(),
            email: `telegram_${alert.userId}@temp.com`,
            name: `User ${alert.userId}`,
            telegramLinked: true,
            telegramLinkedAt: new Date()
          }
        });
      }

      // Contar pasajeros por tipo
      const adults = alert.passengers.find(p => p.code === 'ADT')?.count || 1;
      const children = alert.passengers.find(p => p.code === 'CHD')?.count || 0;
      const infants = alert.passengers.find(p => p.code === 'INF')?.count || 0;

      // Crear la alerta usando el schema de Prisma
      const newAlert = await this.prisma.alert.create({
        data: {
          userId: user.id,
          origin: alert.fromAirport,
          destination: alert.toAirport,
          maxPrice: alert.maxPrice,
          currency: alert.currency || 'USD',
          adults,
          children,
          infants,
          alertType: 'MONTHLY', // Para alertas de mes completo
          isActive: alert.isActive
        }
      });

      databaseLogger.info(`Alerta creada: ${newAlert.id} para ${alert.fromAirport}-${alert.toAirport}`);
      return newAlert.id;
    } catch (error) {
      databaseLogger.error('Error creando alerta:', error as Error);
      throw error;
    }
  }

  /**
   * Obtiene una alerta por su ID
   */
  async getAlert(alertId: string): Promise<FlightAlert | null> {
    try {
      const alert = await this.prisma.alert.findUnique({
        where: { id: alertId },
        include: {
          user: true
        }
      });

      if (!alert || !alert.user.telegramId) return null;

      // Convertir a formato legacy para compatibilidad
      return {
        id: alert.id,
        userId: parseInt(alert.user.telegramId),
        chatId: parseInt(alert.user.telegramId), // Asumir que chat_id = user_id
        fromAirport: alert.origin,
        toAirport: alert.destination,
        maxPrice: alert.maxPrice,
        currency: alert.currency,
        passengers: [
          { code: 'ADT' as const, count: alert.adults },
          { code: 'CHD' as const, count: alert.children },
          { code: 'INF' as const, count: alert.infants }
        ].filter(p => p.count > 0),
        searchMonth: new Date().toISOString().substring(0, 7), // YYYY-MM
        isActive: alert.isActive,
        createdAt: alert.createdAt,
        lastChecked: alert.lastChecked || undefined,
        alertsSent: 0 // TODO: calcular desde notificaciones
      };
    } catch (error) {
      databaseLogger.error(`Error obteniendo alerta ${alertId}:`, error as Error);
      return null;
    }
  }

  /**
   * Obtiene todas las alertas activas
   */
  async getActiveAlerts(): Promise<FlightAlert[]> {
    try {
      const alerts = await this.prisma.alert.findMany({
        where: {
          isActive: true,
          isPaused: false
        },
        include: {
          user: true
        }
      });

      return alerts
        .filter((alert: any) => alert.user.telegramId)
        .map((alert: any) => ({
          id: alert.id,
          userId: parseInt(alert.user.telegramId!),
          chatId: parseInt(alert.user.telegramId!),
          fromAirport: alert.origin,
          toAirport: alert.destination,
          maxPrice: alert.maxPrice,
          currency: alert.currency,
          passengers: [
            { code: 'ADT' as const, count: alert.adults },
            { code: 'CHD' as const, count: alert.children },
            { code: 'INF' as const, count: alert.infants }
          ].filter(p => p.count > 0),
          searchMonth: new Date().toISOString().substring(0, 7),
          isActive: alert.isActive,
          createdAt: alert.createdAt,
          lastChecked: alert.lastChecked || undefined,
          alertsSent: 0
        }));
    } catch (error) {
      databaseLogger.error('Error obteniendo alertas activas:', error as Error);
      return [];
    }
  }

  /**
   * Obtiene alertas por usuario
   */
  async getAlertsByUser(userId: number): Promise<FlightAlert[]> {
    try {
      const alerts = await this.prisma.alert.findMany({
        where: {
          user: {
            telegramId: userId.toString()
          }
        },
        include: {
          user: true
        }
      });

      return alerts.map((alert: any) => ({
        id: alert.id,
        userId: parseInt(alert.user.telegramId!),
        chatId: parseInt(alert.user.telegramId!),
        fromAirport: alert.origin,
        toAirport: alert.destination,
        maxPrice: alert.maxPrice,
        currency: alert.currency,
        passengers: [
          { code: 'ADT' as const, count: alert.adults },
          { code: 'CHD' as const, count: alert.children },
          { code: 'INF' as const, count: alert.infants }
        ].filter(p => p.count > 0),
        searchMonth: new Date().toISOString().substring(0, 7),
        isActive: alert.isActive,
        createdAt: alert.createdAt,
        lastChecked: alert.lastChecked || undefined,
        alertsSent: 0
      }));
    } catch (error) {
      databaseLogger.error(`Error obteniendo alertas del usuario ${userId}:`, error as Error);
      return [];
    }
  }

  /**
   * Actualiza el último chequeo de una alerta
   */
  async updateLastChecked(alertId: string): Promise<void> {
    try {
      await this.prisma.alert.update({
        where: { id: alertId },
        data: { lastChecked: new Date() }
      });
    } catch (error) {
      databaseLogger.error(`Error actualizando última verificación de alerta ${alertId}:`, error as Error);
    }
  }

  /**
   * Desactiva una alerta
   */
  async deactivateAlert(alertId: string): Promise<boolean> {
    try {
      await this.prisma.alert.update({
        where: { id: alertId },
        data: { isActive: false }
      });
      databaseLogger.info(`Alerta desactivada: ${alertId}`);
      return true;
    } catch (error) {
      databaseLogger.error(`Error desactivando alerta ${alertId}:`, error as Error);
      return false;
    }
  }

  /**
   * Elimina una alerta
   */
  async deleteAlert(alertId: string): Promise<boolean> {
    try {
      await this.prisma.alert.delete({
        where: { id: alertId }
      });
      databaseLogger.info(`Alerta eliminada: ${alertId}`);
      return true;
    } catch (error) {
      databaseLogger.error(`Error eliminando alerta ${alertId}:`, error as Error);
      return false;
    }
  }

  /**
   * Guarda múltiples ofertas de vuelo
   */
  async saveFlightDeals(alertId: string, deals: FlightDeal[]): Promise<void> {
    try {
      const alert = await this.prisma.alert.findUnique({
        where: { id: alertId }
      });

      if (!alert) {
        throw new Error(`Alerta ${alertId} no encontrada`);
      }

      // Usar transacción para guardar todas las ofertas
      await this.prisma.$transaction(async (tx: any) => {
        for (const deal of deals) {
          await tx.priceHistory.create({
            data: {
              alertId: alert.id,
              userId: alert.userId,
              price: deal.price,
              currency: 'USD', // Las ofertas de Arajet siempre en USD
              airline: 'ARAJET',
              flightNumber: deal.flightNumber,
              departureDate: new Date(deal.date),
              source: 'ARAJET'
            }
          });
        }
      });

      databaseLogger.info(`${deals.length} ofertas guardadas para alerta ${alertId}`);
    } catch (error) {
      databaseLogger.error(`Error guardando ofertas para alerta ${alertId}:`, error as Error);
      throw error;
    }
  }

  /**
   * Crea una notificación
   */
  async createNotification(alertId: string, message: string, price?: number): Promise<void> {
    try {
      const alert = await this.prisma.alert.findUnique({
        where: { id: alertId }
      });

      if (!alert) {
        throw new Error(`Alerta ${alertId} no encontrada`);
      }

      await this.prisma.alertNotification.create({
        data: {
          alertId: alert.id,
          userId: alert.userId,
          type: 'PRICE_ALERT',
          channel: 'TELEGRAM',
          message,
          price: price || null,
          currency: price ? 'USD' : null,
          sent: true,
          sentAt: new Date()
        }
      });

      databaseLogger.info(`Notificación creada para alerta ${alertId}`);
    } catch (error) {
      databaseLogger.error(`Error creando notificación:`, error as Error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de alertas
   */
  async getAlertStats(): Promise<{
    totalAlerts: number;
    activeAlerts: number;
    totalNotifications: number;
    totalDeals: number;
  }> {
    try {
      const [totalAlerts, activeAlerts, totalNotifications, totalDeals] = await Promise.all([
        this.prisma.alert.count(),
        this.prisma.alert.count({ where: { isActive: true } }),
        this.prisma.alertNotification.count(),
        this.prisma.priceHistory.count()
      ]);

      return {
        totalAlerts,
        activeAlerts,
        totalNotifications,
        totalDeals
      };
    } catch (error) {
      databaseLogger.error('Error obteniendo estadísticas:', error as Error);
      return {
        totalAlerts: 0,
        activeAlerts: 0,
        totalNotifications: 0,
        totalDeals: 0
      };
    }
  }

  /**
   * Cierra la conexión a la base de datos
   */
  async close(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
