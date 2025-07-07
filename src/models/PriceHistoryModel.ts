import { PrismaClient, PriceHistory } from '@prisma/client';
import { DatabaseManager } from '@/database/prisma';

export interface CreatePriceHistoryData {
  alertId: string;
  userId: string;
  price: number;
  currency?: string;
  airline?: string;
  flightNumber?: string;
  departureDate: Date;
  returnDate?: Date | undefined;
  basePrice?: number;
  taxes?: number;
  fees?: number;
  source?: string;
}

export class PriceHistoryModel {
  private static prisma: PrismaClient = DatabaseManager.getInstance().getClient();

  /**
   * Crear un nuevo registro de historial de precios
   */
  static async create(data: CreatePriceHistoryData): Promise<PriceHistory> {
    return await this.prisma.priceHistory.create({
      data: {
        alertId: data.alertId,
        userId: data.userId,
        price: data.price,
        currency: data.currency || 'USD',
        airline: data.airline || null,
        flightNumber: data.flightNumber || null,
        departureDate: data.departureDate,
        returnDate: data.returnDate || null,
        basePrice: data.basePrice || null,
        taxes: data.taxes || null,
        fees: data.fees || null,
        source: data.source || 'ARAJET',
        foundAt: new Date()
      }
    });
  }

  /**
   * Obtener historial de precios por alerta
   */
  static async findByAlertId(alertId: string, limit: number = 50): Promise<PriceHistory[]> {
    return await this.prisma.priceHistory.findMany({
      where: { alertId },
      orderBy: { foundAt: 'desc' },
      take: limit
    });
  }

  /**
   * Obtener historial de precios por usuario
   */
  static async findByUserId(userId: string, limit: number = 100): Promise<PriceHistory[]> {
    return await this.prisma.priceHistory.findMany({
      where: { userId },
      orderBy: { foundAt: 'desc' },
      take: limit
    });
  }

  /**
   * Obtener el precio más bajo encontrado para una ruta
   */
  static async getLowestPrice(alertId: string): Promise<PriceHistory | null> {
    return await this.prisma.priceHistory.findFirst({
      where: { alertId },
      orderBy: { price: 'asc' }
    });
  }

  /**
   * Obtener estadísticas de precios
   */
  static async getStats(): Promise<{
    totalRecords: number;
    recordsToday: number;
    topRoutes: Array<{ route: string; count: number }>;
    topAirlines: Array<{ airline: string; count: number }>;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalRecords = await this.prisma.priceHistory.count();
    
    const recordsToday = await this.prisma.priceHistory.count({
      where: {
        foundAt: { gte: today }
      }
    });

    // Top routes by alert frequency
    const routeStats = await this.prisma.priceHistory.groupBy({
      by: ['alertId'],
      _count: { alertId: true },
      orderBy: { _count: { alertId: 'desc' } },
      take: 5
    });

    // Top airlines 
    const airlineStats = await this.prisma.priceHistory.groupBy({
      by: ['airline'],
      _count: { airline: true },
      where: { airline: { not: null } },
      orderBy: { _count: { airline: 'desc' } },
      take: 5
    });

    return {
      totalRecords,
      recordsToday,
      topRoutes: routeStats.map(r => ({ route: r.alertId, count: r._count.alertId })),
      topAirlines: airlineStats.map(a => ({ airline: a.airline || 'Unknown', count: a._count.airline }))
    };
  }

  /**
   * Limpiar registros antiguos (más de 90 días)
   */
  static async cleanup(): Promise<number> {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const result = await this.prisma.priceHistory.deleteMany({
      where: {
        foundAt: { lt: ninetyDaysAgo }
      }
    });

    return result.count;
  }

  /**
   * Obtener precio promedio para una ruta en los últimos días
   */
  static async getAveragePrice(alertId: string, days: number = 7): Promise<number | null> {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);

    const result = await this.prisma.priceHistory.aggregate({
      where: {
        alertId,
        foundAt: { gte: daysAgo }
      },
      _avg: { price: true }
    });

    return result._avg.price;
  }

  /**
   * Obtener tendencia de precios (últimos 30 registros)
   */
  static async getPriceTrend(alertId: string): Promise<Array<{
    price: number;
    foundAt: Date;
    airline: string | null;
    source: string;
  }>> {
    return await this.prisma.priceHistory.findMany({
      where: { alertId },
      orderBy: { foundAt: 'desc' },
      take: 30,
      select: {
        price: true,
        foundAt: true,
        airline: true,
        source: true
      }
    });
  }
}

export default PriceHistoryModel;
