import { AirportService } from '@/models/Airport';
import { FlightDetailsModel } from '@/models/FlightDetails';
import { DatabaseManager } from '@/database';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Script para inicializar la base de datos con los datos completos de la API
 */
export class DatabaseInitializer {
  
  /**
   * Inicializar aeropuertos desde el archivo response.json
   */
  static async initializeAirports(): Promise<void> {
    try {
      console.log('🛫 Inicializando aeropuertos desde API response...');
      
      // Leer el archivo response.json
      const responsePath = join(process.cwd(), 'response.json');
      const responseData = JSON.parse(readFileSync(responsePath, 'utf8'));
      
      // Inicializar aeropuertos usando el servicio
      AirportService.initializeAirports(responseData);
      
      const airports = AirportService.getAllAirports();
      console.log(`✅ ${airports.length} aeropuertos inicializados exitosamente`);
      
      // Mostrar estadísticas por región
      const regions = new Map<string, number>();
      airports.forEach(airport => {
        const region = airport.metadata?.region || 'Unknown';
        regions.set(region, (regions.get(region) || 0) + 1);
      });
      
      console.log('📊 Aeropuertos por región:');
      for (const [region, count] of regions.entries()) {
        console.log(`   ${region}: ${count} aeropuertos`);
      }
      
      return;
    } catch (error) {
      console.error('❌ Error inicializando aeropuertos:', error);
      throw error;
    }
  }
  
  /**
   * Crear las nuevas tablas en la base de datos
   */
  static async createNewTables(): Promise<void> {
    try {
      console.log('🏗️  Creando nuevas tablas en la base de datos...');
      
      const dbManager = DatabaseManager.getInstance();
      const db = dbManager.getConnection();
      
      // Crear tabla flight_details
      const createFlightDetailsTable = `
        CREATE TABLE IF NOT EXISTS flight_details (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          flight_number TEXT NOT NULL,
          airline TEXT NOT NULL,
          origin TEXT NOT NULL,
          destination TEXT NOT NULL,
          departure_date DATE NOT NULL,
          arrival_date DATE NOT NULL,
          departure_time TEXT NOT NULL,
          arrival_time TEXT NOT NULL,
          duration TEXT NOT NULL,
          aircraft TEXT,
          price DECIMAL(10,2) NOT NULL,
          currency TEXT DEFAULT 'USD',
          cabin_class TEXT DEFAULT 'economy',
          available_seats INTEGER,
          
          -- Información adicional en JSON
          taxes TEXT,
          fees TEXT,
          restrictions TEXT,
          baggage TEXT,
          amenities TEXT,
          
          -- Servicios incluidos
          meal TEXT,
          wifi BOOLEAN DEFAULT 0,
          entertainment BOOLEAN DEFAULT 0,
          
          -- Información de conexiones
          stops INTEGER DEFAULT 0,
          layovers TEXT,
          
          -- Metadatos
          booking_class TEXT,
          fare_type TEXT,
          validating_carrier TEXT,
          
          -- Historial y datos
          price_history TEXT,
          raw_api_data TEXT,
          search_timestamp TEXT NOT NULL,
          last_updated TEXT NOT NULL,
          
          -- Índices únicos
          UNIQUE(flight_number, departure_date, origin, destination)
        )
      `;
      
      db.exec(createFlightDetailsTable);
      
      // Crear índices
      const indices = [
        'CREATE INDEX IF NOT EXISTS idx_flight_details_route ON flight_details(origin, destination)',
        'CREATE INDEX IF NOT EXISTS idx_flight_details_date ON flight_details(departure_date)',
        'CREATE INDEX IF NOT EXISTS idx_flight_details_flight ON flight_details(flight_number, departure_date)',
        'CREATE INDEX IF NOT EXISTS idx_flight_details_updated ON flight_details(last_updated)',
        'CREATE INDEX IF NOT EXISTS idx_flight_details_price ON flight_details(price, currency)'
      ];
      
      for (const index of indices) {
        db.exec(index);
      }
      
      console.log('✅ Tablas creadas exitosamente');
    } catch (error) {
      console.error('❌ Error creando tablas:', error);
      throw error;
    }
  }
  
  /**
   * Procesar y almacenar vuelos de ejemplo de la API
   */
  static async processAPIFlights(): Promise<void> {
    try {
      console.log('✈️  Procesando vuelos de la API...');
      
      // Leer el archivo response.json
      const responsePath = join(process.cwd(), 'response.json');
      const responseData = JSON.parse(readFileSync(responsePath, 'utf8'));
      
      let flightsProcessed = 0;
      
      // Procesar vuelos si existen en la respuesta
      if (responseData.data?.flights) {
        for (const flight of responseData.data.flights) {
          try {
            const flightDetails = this.parseAPIFlightToDetails(flight, responseData);
            FlightDetailsModel.createOrUpdate(flightDetails);
            flightsProcessed++;
          } catch (error) {
            console.warn(`⚠️  Error procesando vuelo:`, error);
          }
        }
      }
      
      console.log(`✅ ${flightsProcessed} vuelos procesados exitosamente`);
    } catch (error) {
      console.error('❌ Error procesando vuelos de la API:', error);
      throw error;
    }
  }
  
  /**
   * Convertir vuelo de API a formato FlightDetails
   */
  private static parseAPIFlightToDetails(flight: any, apiResponse: any): any {
    const now = new Date().toISOString();
    
    return {
      flightNumber: flight.flightNumber || 'UNKNOWN',
      airline: flight.airline || 'Arajet',
      origin: flight.origin || 'SDQ',
      destination: flight.destination || 'MIA',
      departureDate: flight.departureDate || '2025-07-01',
      arrivalDate: flight.arrivalDate || '2025-07-01',
      departureTime: flight.departureTime || '00:00',
      arrivalTime: flight.arrivalTime || '00:00',
      duration: flight.duration || '0h 0m',
      aircraft: flight.aircraft,
      price: flight.price || 0,
      currency: flight.currency || 'USD',
      cabinClass: flight.cabinClass || 'economy',
      availableSeats: flight.availableSeats,
      
      // Información adicional de la API
      taxes: apiResponse.data?.taxesBreakdown || {},
      fees: apiResponse.data?.feesBreakdown || {},
      restrictions: flight.restrictions || {},
      baggage: flight.baggage || {},
      amenities: flight.amenities || [],
      
      meal: flight.meal,
      wifi: flight.wifi || false,
      entertainment: flight.entertainment || false,
      
      stops: flight.stops || 0,
      layovers: flight.layovers || [],
      
      bookingClass: flight.bookingClass,
      fareType: flight.fareType,
      validatingCarrier: flight.validatingCarrier,
      
      priceHistory: [{
        price: flight.price || 0,
        timestamp: now,
        currency: flight.currency || 'USD'
      }],
      
      rawApiData: flight,
      searchTimestamp: now,
      lastUpdated: now
    };
  }
  
  /**
   * Ejecutar inicialización completa
   */
  static async initializeAll(): Promise<void> {
    try {
      console.log('🚀 Iniciando inicialización completa de la base de datos...');
      
      await this.createNewTables();
      await this.initializeAirports();
      await this.processAPIFlights();
      
      console.log('🎉 Inicialización completada exitosamente!');
      
      // Mostrar estadísticas finales
      const airports = AirportService.getAllAirports();
      console.log(`\n📈 Estadísticas finales:`);
      console.log(`   - Aeropuertos: ${airports.length}`);
      
      // Mostrar conexiones por aeropuerto principal
      const mainAirports = ['SDQ', 'MIA', 'BOG', 'SCL', 'LIM'];
      console.log(`\n🗺️  Conexiones principales:`);
      
      for (const code of mainAirports) {
        const airport = AirportService.getAirport(code);
        if (airport) {
          const connections = AirportService.getConnectedAirports(code);
          console.log(`   ${code} (${airport.city}): ${connections.length} destinos`);
        }
      }
      
    } catch (error) {
      console.error('❌ Error en la inicialización:', error);
      throw error;
    }
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  DatabaseInitializer.initializeAll()
    .then(() => {
      console.log('✅ Script ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error ejecutando script:', error);
      process.exit(1);
    });
}
