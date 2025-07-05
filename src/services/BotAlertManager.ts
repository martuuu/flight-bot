import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { FlightAlert, FlightDeal, ArajetPassenger } from '../types/arajet-api';
import { scrapingLogger as databaseLogger } from '../utils/logger';
import { PrismaDatabaseManager } from '../database/prisma-adapter';

// Interfaces para compatibilidad con formato legacy de DB
interface LegacyFlightDeal {
  id: number;
  alert_id: string;
  date: string;
  price: number;
  price_without_tax: number;
  fare_class: string;
  flight_number: string;
  departure_time: string;
  arrival_time: string;
  is_cheapest_of_month: boolean;
  found_at: string;
}

/**
 * Gestor de alertas específico para el bot usando modelos del bot
 */
export class BotAlertManager {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaDatabaseManager.getInstance().getClient();
  }

  /**
   * Crear una nueva alerta de vuelo
   */
  async createAlert(
    userId: string, // Cambiado a string para compatibilidad con CUID
    chatId: number,
    fromAirport: string,
    toAirport: string,
    searchMonth: string,
    maxPrice: number,
    passengers: ArajetPassenger[],
    currency: string = 'USD'
  ): Promise<string> {
    try {
      const alertId = uuidv4();

      // Primero asegurar que el usuario de Telegram existe
      await this.prisma.telegramUser.upsert({
        where: { telegramId: userId.toString() },
        update: { lastActivity: new Date() },
        create: {
          telegramId: userId.toString(),
          lastActivity: new Date(),
        },
      });

      const alert = await this.prisma.flightAlert.create({
        data: {
          id: alertId,
          telegramUserId: userId.toString(),
          chatId: BigInt(chatId),
          fromAirport,
          toAirport,
          maxPrice,
          currency,
          passengers: passengers as any, // JSON field
          searchMonth,
          isActive: true,
          alertsSent: 0,
        },
      });

      databaseLogger.info(`Alerta creada: ${alertId} para ${fromAirport} -> ${toAirport}`);
      return alert.id;
    } catch (error) {
      databaseLogger.error('Error creando alerta', error as Error);
      throw error;
    }
  }

  /**
   * Obtener alertas por usuario
   */
  async getAlertsByUser(userId: number): Promise<FlightAlert[]> {
    try {
      const alerts = await this.prisma.flightAlert.findMany({
        where: {
          telegramUserId: userId.toString(),
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return alerts.map(alert => ({
        id: alert.id,
        userId: parseInt(alert.telegramUserId || '0'),
        chatId: Number(alert.chatId),
        fromAirport: alert.fromAirport,
        toAirport: alert.toAirport,
        maxPrice: alert.maxPrice,
        currency: alert.currency,
        passengers: (alert.passengers as unknown) as ArajetPassenger[],
        searchMonth: alert.searchMonth,
        isActive: alert.isActive,
        createdAt: alert.createdAt,
        lastChecked: alert.lastChecked || undefined,
        alertsSent: alert.alertsSent,
      }));
    } catch (error) {
      databaseLogger.error('Error obteniendo alertas por usuario', error as Error);
      throw error;
    }
  }

  /**
   * Obtener alertas por usuario (método de compatibilidad)
   */
  async getUserAlerts(userId: number): Promise<FlightAlert[]> {
    return await this.getAlertsByUser(userId);
  }

  /**
   * Obtener alertas activas
   */
  async getActiveAlerts(): Promise<FlightAlert[]> {
    try {
      const alerts = await this.prisma.flightAlert.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return alerts.map(alert => ({
        id: alert.id,
        userId: parseInt(alert.telegramUserId || '0'),
        chatId: Number(alert.chatId),
        fromAirport: alert.fromAirport,
        toAirport: alert.toAirport,
        maxPrice: alert.maxPrice,
        currency: alert.currency,
        passengers: (alert.passengers as unknown) as ArajetPassenger[],
        searchMonth: alert.searchMonth,
        isActive: alert.isActive,
        createdAt: alert.createdAt,
        lastChecked: alert.lastChecked || undefined,
        alertsSent: alert.alertsSent,
      }));
    } catch (error) {
      databaseLogger.error('Error obteniendo alertas activas', error as Error);
      throw error;
    }
  }

  /**
   * Desactivar alerta
   */
  async deactivateAlert(alertId: string): Promise<boolean> {
    try {
      await this.prisma.flightAlert.update({
        where: { id: alertId },
        data: { isActive: false },
      });

      databaseLogger.info(`Alerta desactivada: ${alertId}`);
      return true;
    } catch (error) {
      databaseLogger.error('Error desactivando alerta', error as Error);
      return false;
    }
  }

  /**
   * Actualizar último chequeo de alerta
   */
  async updateLastChecked(alertId: string): Promise<void> {
    try {
      await this.prisma.flightAlert.update({
        where: { id: alertId },
        data: { lastChecked: new Date() },
      });
    } catch (error) {
      databaseLogger.error('Error actualizando último chequeo', error as Error);
      throw error;
    }
  }

  /**
   * Incrementar contador de alertas enviadas
   */
  async incrementAlertsSent(alertId: string): Promise<void> {
    try {
      await this.prisma.flightAlert.update({
        where: { id: alertId },
        data: { alertsSent: { increment: 1 } },
      });
    } catch (error) {
      databaseLogger.error('Error incrementando contador de alertas', error as Error);
      throw error;
    }
  }

  /**
   * Guardar oferta encontrada
   */
  async saveDeal(
    alertId: string,
    deal: FlightDeal
  ): Promise<void> {
    try {
      await this.prisma.flightDeal.create({
        data: {
          alertId,
          date: deal.date,
          price: deal.price,
          priceWithoutTax: deal.priceWithoutTax,
          fareClass: deal.fareClass,
          flightNumber: deal.flightNumber,
          departureTime: deal.departureTime,
          arrivalTime: deal.arrivalTime,
          isCheapestOfMonth: deal.isCheapestOfMonth,
        },
      });

      databaseLogger.info(`Oferta guardada para alerta ${alertId}: ${deal.price}`);
    } catch (error) {
      databaseLogger.error('Error guardando oferta', error as Error);
      throw error;
    }
  }

  /**
   * Obtener ofertas por alerta
   */
  async getDealsByAlert(alertId: string): Promise<LegacyFlightDeal[]> {
    try {
      const deals = await this.prisma.flightDeal.findMany({
        where: { alertId },
        orderBy: { foundAt: 'desc' },
      });

      return deals.map(deal => ({
        id: parseInt(deal.id),
        alert_id: deal.alertId,
        date: deal.date,
        price: deal.price,
        price_without_tax: deal.priceWithoutTax,
        fare_class: deal.fareClass,
        flight_number: deal.flightNumber,
        departure_time: deal.departureTime,
        arrival_time: deal.arrivalTime,
        is_cheapest_of_month: deal.isCheapestOfMonth,
        found_at: deal.foundAt.toISOString(),
      }));
    } catch (error) {
      databaseLogger.error('Error obteniendo ofertas por alerta', error as Error);
      throw error;
    }
  }

  /**
   * Guardar notificación de alerta
   */
  async saveNotification(
    alertId: string,
    chatId: number,
    message: string,
    dealPrice?: number,
    dealDate?: string
  ): Promise<void> {
    try {
      await this.prisma.alertNotificationBot.create({
        data: {
          alertId,
          chatId: BigInt(chatId),
          message,
          dealPrice: dealPrice || null,
          dealDate: dealDate || null,
          sent: true,
          sentAt: new Date(),
        },
      });

      databaseLogger.info(`Notificación guardada para alerta ${alertId}`);
    } catch (error) {
      databaseLogger.error('Error guardando notificación', error as Error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de alertas
   */
  async getAlertStats(): Promise<{
    totalAlerts: number;
    activeAlerts: number;
    totalDeals: number;
    totalNotifications: number;
  }> {
    try {
      const [totalAlerts, activeAlerts, totalDeals, totalNotifications] = await Promise.all([
        this.prisma.flightAlert.count(),
        this.prisma.flightAlert.count({ where: { isActive: true } }),
        this.prisma.flightDeal.count(),
        this.prisma.alertNotificationBot.count(),
      ]);

      return {
        totalAlerts,
        activeAlerts,
        totalDeals,
        totalNotifications,
      };
    } catch (error) {
      databaseLogger.error('Error obteniendo estadísticas', error as Error);
      throw error;
    }
  }

  /**
   * Eliminar alertas antiguas (cleanup)
   */
  async cleanupOldAlerts(daysOld: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await this.prisma.flightAlert.deleteMany({
        where: {
          isActive: false,
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

      databaseLogger.info(`Cleanup: ${result.count} alertas eliminadas`);
      return result.count;
    } catch (error) {
      databaseLogger.error('Error en cleanup de alertas', error as Error);
      throw error;
    }
  }
}
