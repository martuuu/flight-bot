import { db } from '@/database';
import { PriceHistory, FlightResult } from '@/types';
import { dbLogger } from '@/utils/logger';

/**
 * Modelo para operaciones CRUD del historial de precios
 */
export class PriceHistoryModel {
  /**
   * Guardar resultado de vuelo en el historial
   */
  static create(flight: FlightResult): PriceHistory {
    try {
      const stmt = db.prepare(`
        INSERT INTO price_history (
          origin, destination, price, currency, departure_date, return_date,
          airline, flight_number, available_seats, booking_url, cabin_class,
          duration_minutes, stops
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        flight.origin,
        flight.destination,
        flight.price,
        flight.currency,
        flight.departureDate.toISOString().split('T')[0],
        flight.arrivalDate ? flight.arrivalDate.toISOString().split('T')[0] : null,
        flight.airline,
        flight.flightNumber,
        flight.availableSeats,
        flight.bookingUrl,
        flight.cabinClass,
        flight.duration,
        flight.stops
      );

      dbLogger.debug(`Precio guardado en historial: ${flight.origin}-${flight.destination} ${flight.price} ${flight.currency}`);

      return this.findById(Number(result.lastInsertRowid))!;
    } catch (error) {
      dbLogger.error('Error guardando precio en historial', error as Error, flight);
      throw error;
    }
  }

  /**
   * Buscar registro por ID
   */
  static findById(id: number): PriceHistory | null {
    try {
      const stmt = db.prepare(`
        SELECT id, origin, destination, price, currency,
               departure_date as departureDate, return_date as returnDate,
               airline, flight_number as flightNumber, scraped_at as scrapedAt,
               available_seats as availableSeats, booking_url as bookingUrl
        FROM price_history 
        WHERE id = ?
      `);

      const result = stmt.get(id) as any;

      if (result) {
        return {
          ...result,
          departureDate: new Date(result.departureDate),
          returnDate: result.returnDate ? new Date(result.returnDate) : undefined,
          scrapedAt: new Date(result.scrapedAt),
        };
      }

      return null;
    } catch (error) {
      dbLogger.error('Error buscando precio por ID', error as Error, { id });
      throw error;
    }
  }

  /**
   * Buscar precios para una ruta específica
   */
  static findByRoute(
    origin: string,
    destination: string,
    departureDate?: Date,
    limit = 50
  ): PriceHistory[] {
    try {
      let sql = `
        SELECT id, origin, destination, price, currency,
               departure_date as departureDate, return_date as returnDate,
               airline, flight_number as flightNumber, scraped_at as scrapedAt,
               available_seats as availableSeats, booking_url as bookingUrl
        FROM price_history 
        WHERE origin = ? AND destination = ?
      `;

      const params: any[] = [origin.toUpperCase(), destination.toUpperCase()];

      if (departureDate) {
        sql += ' AND departure_date = ?';
        params.push(departureDate.toISOString().split('T')[0]);
      }

      sql += ' ORDER BY scraped_at DESC LIMIT ?';
      params.push(limit);

      const stmt = db.prepare(sql);
      const results = stmt.all(...params) as any[];

      return results.map(result => ({
        ...result,
        departureDate: new Date(result.departureDate),
        returnDate: result.returnDate ? new Date(result.returnDate) : undefined,
        scrapedAt: new Date(result.scrapedAt),
      }));
    } catch (error) {
      dbLogger.error('Error buscando precios por ruta', error as Error, { origin, destination });
      throw error;
    }
  }

  /**
   * Obtener precio más bajo para una ruta
   */
  static getLowestPrice(
    origin: string,
    destination: string,
    departureDate?: Date,
    daysRange = 7
  ): PriceHistory | null {
    try {
      let sql = `
        SELECT id, origin, destination, price, currency,
               departure_date as departureDate, return_date as returnDate,
               airline, flight_number as flightNumber, scraped_at as scrapedAt,
               available_seats as availableSeats, booking_url as bookingUrl
        FROM price_history 
        WHERE origin = ? AND destination = ?
      `;

      const params: any[] = [origin.toUpperCase(), destination.toUpperCase()];

      if (departureDate) {
        sql += ' AND departure_date BETWEEN ? AND ?';
        const startDate = new Date(departureDate);
        const endDate = new Date(departureDate);
        endDate.setDate(endDate.getDate() + daysRange);
        
        params.push(startDate.toISOString().split('T')[0]);
        params.push(endDate.toISOString().split('T')[0]);
      }

      sql += ' ORDER BY price ASC LIMIT 1';

      const stmt = db.prepare(sql);
      const result = stmt.get(...params) as any;

      if (result) {
        return {
          ...result,
          departureDate: new Date(result.departureDate),
          returnDate: result.returnDate ? new Date(result.returnDate) : undefined,
          scrapedAt: new Date(result.scrapedAt),
        };
      }

      return null;
    } catch (error) {
      dbLogger.error('Error obteniendo precio más bajo', error as Error, { origin, destination });
      throw error;
    }
  }

  /**
   * Obtener precios recientes (últimas 24 horas)
   */
  static getRecentPrices(
    origin: string,
    destination: string,
    departureDate?: Date
  ): PriceHistory[] {
    try {
      let sql = `
        SELECT id, origin, destination, price, currency,
               departure_date as departureDate, return_date as returnDate,
               airline, flight_number as flightNumber, scraped_at as scrapedAt,
               available_seats as availableSeats, booking_url as bookingUrl
        FROM price_history 
        WHERE origin = ? AND destination = ?
        AND scraped_at >= datetime('now', '-24 hours')
      `;

      const params: any[] = [origin.toUpperCase(), destination.toUpperCase()];

      if (departureDate) {
        sql += ' AND departure_date = ?';
        params.push(departureDate.toISOString().split('T')[0]);
      }

      sql += ' ORDER BY scraped_at DESC';

      const stmt = db.prepare(sql);
      const results = stmt.all(...params) as any[];

      return results.map(result => ({
        ...result,
        departureDate: new Date(result.departureDate),
        returnDate: result.returnDate ? new Date(result.returnDate) : undefined,
        scrapedAt: new Date(result.scrapedAt),
      }));
    } catch (error) {
      dbLogger.error('Error obteniendo precios recientes', error as Error, { origin, destination });
      throw error;
    }
  }

  /**
   * Calcular precio promedio para una ruta
   */
  static getAveragePrice(
    origin: string,
    destination: string,
    days = 30
  ): number | null {
    try {
      const stmt = db.prepare(`
        SELECT AVG(price) as average
        FROM price_history 
        WHERE origin = ? AND destination = ?
        AND scraped_at >= datetime('now', '-${days} days')
      `);

      const result = stmt.get(origin.toUpperCase(), destination.toUpperCase()) as { average: number | null };
      return result.average;
    } catch (error) {
      dbLogger.error('Error calculando precio promedio', error as Error, { origin, destination });
      throw error;
    }
  }

  /**
   * Obtener tendencia de precios (últimos 7 días)
   */
  static getPriceTrend(
    origin: string,
    destination: string
  ): Array<{ date: string; minPrice: number; maxPrice: number; avgPrice: number }> {
    try {
      const stmt = db.prepare(`
        SELECT 
          DATE(scraped_at) as date,
          MIN(price) as minPrice,
          MAX(price) as maxPrice,
          AVG(price) as avgPrice
        FROM price_history 
        WHERE origin = ? AND destination = ?
        AND scraped_at >= datetime('now', '-7 days')
        GROUP BY DATE(scraped_at)
        ORDER BY date DESC
      `);

      const results = stmt.all(origin.toUpperCase(), destination.toUpperCase()) as any[];
      return results;
    } catch (error) {
      dbLogger.error('Error obteniendo tendencia de precios', error as Error, { origin, destination });
      throw error;
    }
  }

  /**
   * Obtener aerolíneas con mejores precios
   */
  static getBestAirlines(
    origin: string,
    destination: string,
    limit = 5
  ): Array<{ airline: string; avgPrice: number; flightCount: number }> {
    try {
      const stmt = db.prepare(`
        SELECT 
          airline,
          AVG(price) as avgPrice,
          COUNT(*) as flightCount
        FROM price_history 
        WHERE origin = ? AND destination = ?
        AND scraped_at >= datetime('now', '-30 days')
        GROUP BY airline
        ORDER BY avgPrice ASC
        LIMIT ?
      `);

      const results = stmt.all(origin.toUpperCase(), destination.toUpperCase(), limit) as any[];
      return results;
    } catch (error) {
      dbLogger.error('Error obteniendo mejores aerolíneas', error as Error, { origin, destination });
      throw error;
    }
  }

  /**
   * Limpiar datos antiguos
   */
  static cleanOldData(days = 30): number {
    try {
      const stmt = db.prepare(`
        DELETE FROM price_history 
        WHERE scraped_at < datetime('now', '-${days} days')
      `);

      const result = stmt.run();
      dbLogger.info(`${result.changes} registros de precios antiguos eliminados`);
      
      return result.changes;
    } catch (error) {
      dbLogger.error('Error limpiando datos antiguos de precios', error as Error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas del historial
   */
  static getStats(): any {
    try {
      const totalRecords = db.prepare('SELECT COUNT(*) as count FROM price_history').get() as { count: number };
      const recordsToday = db.prepare(`
        SELECT COUNT(*) as count FROM price_history 
        WHERE DATE(scraped_at) = DATE('now')
      `).get() as { count: number };
      
      const topRoutes = db.prepare(`
        SELECT origin, destination, COUNT(*) as count
        FROM price_history 
        WHERE scraped_at >= datetime('now', '-7 days')
        GROUP BY origin, destination
        ORDER BY count DESC
        LIMIT 5
      `).all() as Array<{ origin: string; destination: string; count: number }>;

      const topAirlines = db.prepare(`
        SELECT airline, COUNT(*) as count
        FROM price_history 
        WHERE scraped_at >= datetime('now', '-7 days')
        GROUP BY airline
        ORDER BY count DESC
        LIMIT 5
      `).all() as Array<{ airline: string; count: number }>;

      return {
        totalRecords: totalRecords.count,
        recordsToday: recordsToday.count,
        topRoutes,
        topAirlines,
      };
    } catch (error) {
      dbLogger.error('Error obteniendo estadísticas del historial', error as Error);
      throw error;
    }
  }
}
