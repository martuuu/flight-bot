/**
 * Modelo extendido para información detallada de vuelos
 */
export interface FlightDetails {
  id?: number;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  aircraft?: string;
  price: number;
  currency: string;
  cabinClass: string;
  availableSeats?: number;
  
  // Información adicional de la API
  taxes?: {
    security?: number;
    service?: number;
    government?: number;
    total?: number;
  };
  
  fees?: {
    booking?: number;
    processing?: number;
    total?: number;
  };
  
  restrictions?: {
    refundable?: boolean;
    changeable?: boolean;
    notes?: string[];
  };
  
  baggage?: {
    carry_on?: {
      included: boolean;
      weight?: string;
      dimensions?: string;
    };
    checked?: {
      included: boolean;
      weight?: string;
      fee?: number;
    };
  };
  
  amenities?: string[];
  meal?: string;
  wifi?: boolean;
  entertainment?: boolean;
  
  // Información de conexiones
  stops?: number;
  layovers?: Array<{
    airport: string;
    duration: string;
    city: string;
  }>;
  
  // Metadatos
  bookingClass?: string;
  fareType?: string;
  validatingCarrier?: string;
  
  // Información de precios dinámicos
  priceHistory?: Array<{
    price: number;
    timestamp: string;
    currency: string;
  }>;
  
  // Información adicional de la API
  rawApiData?: any;
  searchTimestamp: string;
  lastUpdated: string;
}

/**
 * Modelo para manejar información detallada de vuelos
 */
export class FlightDetailsModel {
  
  /**
   * Crear o actualizar información detallada de vuelo
   */
  static createOrUpdate(flightDetails: Omit<FlightDetails, 'id'>): FlightDetails {
    const db = require('@/database').db;
    
    try {
      // Verificar si ya existe un vuelo similar
      const existing = this.findByFlightAndDate(
        flightDetails.flightNumber,
        flightDetails.departureDate
      );
      
      if (existing) {
        return this.update(existing.id!, flightDetails);
      }
      
      const stmt = db.prepare(`
        INSERT INTO flight_details (
          flight_number, airline, origin, destination,
          departure_date, arrival_date, departure_time, arrival_time,
          duration, aircraft, price, currency, cabin_class,
          available_seats, taxes, fees, restrictions, baggage,
          amenities, meal, wifi, entertainment, stops, layovers,
          booking_class, fare_type, validating_carrier,
          price_history, raw_api_data, search_timestamp, last_updated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        flightDetails.flightNumber,
        flightDetails.airline,
        flightDetails.origin,
        flightDetails.destination,
        flightDetails.departureDate,
        flightDetails.arrivalDate,
        flightDetails.departureTime,
        flightDetails.arrivalTime,
        flightDetails.duration,
        flightDetails.aircraft,
        flightDetails.price,
        flightDetails.currency,
        flightDetails.cabinClass,
        flightDetails.availableSeats,
        JSON.stringify(flightDetails.taxes),
        JSON.stringify(flightDetails.fees),
        JSON.stringify(flightDetails.restrictions),
        JSON.stringify(flightDetails.baggage),
        JSON.stringify(flightDetails.amenities),
        flightDetails.meal,
        flightDetails.wifi ? 1 : 0,
        flightDetails.entertainment ? 1 : 0,
        flightDetails.stops,
        JSON.stringify(flightDetails.layovers),
        flightDetails.bookingClass,
        flightDetails.fareType,
        flightDetails.validatingCarrier,
        JSON.stringify(flightDetails.priceHistory),
        JSON.stringify(flightDetails.rawApiData),
        flightDetails.searchTimestamp,
        flightDetails.lastUpdated
      );
      
      return this.findById(Number(result.lastInsertRowid))!;
    } catch (error) {
      console.error('Error creating flight details:', error);
      throw error;
    }
  }
  
  /**
   * Actualizar información de vuelo existente
   */
  static update(id: number, updates: Partial<FlightDetails>): FlightDetails {
    const db = require('@/database').db;
    
    try {
      const existing = this.findById(id);
      if (!existing) {
        throw new Error(`Flight details with id ${id} not found`);
      }
      
      // Actualizar historial de precios si el precio cambió
      if (updates.price && updates.price !== existing.price) {
        const priceHistory = existing.priceHistory || [];
        priceHistory.push({
          price: updates.price,
          timestamp: new Date().toISOString(),
          currency: updates.currency || existing.currency
        });
        updates.priceHistory = priceHistory;
      }
      
      updates.lastUpdated = new Date().toISOString();
      
      const fieldsToUpdate = Object.keys(updates).filter(key => key !== 'id');
      const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
      const values = fieldsToUpdate.map(field => {
        const value = (updates as any)[field];
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value);
        }
        if (typeof value === 'boolean') {
          return value ? 1 : 0;
        }
        return value;
      });
      
      const stmt = db.prepare(`UPDATE flight_details SET ${setClause} WHERE id = ?`);
      stmt.run(...values, id);
      
      return this.findById(id)!;
    } catch (error) {
      console.error('Error updating flight details:', error);
      throw error;
    }
  }
  
  /**
   * Buscar por ID
   */
  static findById(id: number): FlightDetails | null {
    const db = require('@/database').db;
    
    try {
      const stmt = db.prepare('SELECT * FROM flight_details WHERE id = ?');
      const row = stmt.get(id);
      
      if (!row) return null;
      
      return this.rowToFlightDetails(row);
    } catch (error) {
      console.error('Error finding flight details by id:', error);
      return null;
    }
  }
  
  /**
   * Buscar por número de vuelo y fecha
   */
  static findByFlightAndDate(flightNumber: string, departureDate: string): FlightDetails | null {
    const db = require('@/database').db;
    
    try {
      const stmt = db.prepare(`
        SELECT * FROM flight_details 
        WHERE flight_number = ? AND departure_date = ?
        ORDER BY last_updated DESC
        LIMIT 1
      `);
      const row = stmt.get(flightNumber, departureDate);
      
      if (!row) return null;
      
      return this.rowToFlightDetails(row);
    } catch (error) {
      console.error('Error finding flight details by flight and date:', error);
      return null;
    }
  }
  
  /**
   * Buscar vuelos por ruta y rango de fechas
   */
  static findByRoute(
    origin: string, 
    destination: string, 
    startDate?: string, 
    endDate?: string
  ): FlightDetails[] {
    const db = require('@/database').db;
    
    try {
      let query = `
        SELECT * FROM flight_details 
        WHERE origin = ? AND destination = ?
      `;
      const params = [origin.toUpperCase(), destination.toUpperCase()];
      
      if (startDate) {
        query += ' AND departure_date >= ?';
        params.push(startDate);
      }
      
      if (endDate) {
        query += ' AND departure_date <= ?';
        params.push(endDate);
      }
      
      query += ' ORDER BY departure_date ASC, departure_time ASC';
      
      const stmt = db.prepare(query);
      const rows = stmt.all(...params);
      
      return rows.map((row: any) => this.rowToFlightDetails(row));
    } catch (error) {
      console.error('Error finding flights by route:', error);
      return [];
    }
  }
  
  /**
   * Obtener historial de precios para una ruta
   */
  static getPriceHistory(origin: string, destination: string, days = 30): any[] {
    const db = require('@/database').db;
    
    try {
      const stmt = db.prepare(`
        SELECT flight_number, departure_date, price, currency, last_updated
        FROM flight_details 
        WHERE origin = ? AND destination = ?
          AND last_updated >= datetime('now', '-${days} days')
        ORDER BY last_updated ASC
      `);
      
      return stmt.all(origin.toUpperCase(), destination.toUpperCase());
    } catch (error) {
      console.error('Error getting price history:', error);
      return [];
    }
  }
  
  /**
   * Convertir fila de base de datos a objeto FlightDetails
   */
  private static rowToFlightDetails(row: any): FlightDetails {
    return {
      id: row.id,
      flightNumber: row.flight_number,
      airline: row.airline,
      origin: row.origin,
      destination: row.destination,
      departureDate: row.departure_date,
      arrivalDate: row.arrival_date,
      departureTime: row.departure_time,
      arrivalTime: row.arrival_time,
      duration: row.duration,
      aircraft: row.aircraft,
      price: row.price,
      currency: row.currency,
      cabinClass: row.cabin_class,
      availableSeats: row.available_seats,
      taxes: row.taxes ? JSON.parse(row.taxes) : undefined,
      fees: row.fees ? JSON.parse(row.fees) : undefined,
      restrictions: row.restrictions ? JSON.parse(row.restrictions) : undefined,
      baggage: row.baggage ? JSON.parse(row.baggage) : undefined,
      amenities: row.amenities ? JSON.parse(row.amenities) : undefined,
      meal: row.meal,
      wifi: row.wifi === 1,
      entertainment: row.entertainment === 1,
      stops: row.stops,
      layovers: row.layovers ? JSON.parse(row.layovers) : undefined,
      bookingClass: row.booking_class,
      fareType: row.fare_type,
      validatingCarrier: row.validating_carrier,
      priceHistory: row.price_history ? JSON.parse(row.price_history) : undefined,
      rawApiData: row.raw_api_data ? JSON.parse(row.raw_api_data) : undefined,
      searchTimestamp: row.search_timestamp,
      lastUpdated: row.last_updated
    };
  }
  
  /**
   * Limpiar datos antiguos
   */
  static cleanOldData(daysToKeep = 90): number {
    const db = require('@/database').db;
    
    try {
      const stmt = db.prepare(`
        DELETE FROM flight_details 
        WHERE last_updated < datetime('now', '-${daysToKeep} days')
      `);
      
      const result = stmt.run();
      return result.changes;
    } catch (error) {
      console.error('Error cleaning old flight details:', error);
      return 0;
    }
  }
}
