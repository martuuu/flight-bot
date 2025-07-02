/**
 * Modelo de aeropuerto con información completa de la API
 */
export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  timezone?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  connections?: string[]; // Códigos de aeropuertos conectados
  restrictions?: {
    isActive: boolean;
    notes?: string;
  };
  fees?: {
    security?: number;
    service?: number;
    total?: number;
  };
  metadata?: {
    region?: string;
    continent?: string;
    hub?: boolean;
    international?: boolean;
  };
}

/**
 * Clase para manejar operaciones de aeropuertos
 */
export class AirportService {
  private static airports: Map<string, Airport> = new Map();

  /**
   * Inicializar aeropuertos desde los datos de la API
   */
  static initializeAirports(apiData: any): void {
    // Limpiar aeropuertos existentes
    this.airports.clear();

    // Procesar datos de la API
    if (apiData.airportsWithValidConnections) {
      for (const [code, connections] of Object.entries(apiData.airportsWithValidConnections)) {
        const airport = this.createAirportFromCode(code as string, connections as string[]);
        if (airport) {
          this.airports.set(code, airport);
        }
      }
    }

    // Agregar información adicional de fees, restrictions, etc.
    if (apiData.data?.restrictionsByOrigin) {
      this.addRestrictionsData(apiData.data.restrictionsByOrigin);
    }

    if (apiData.data?.feesByOrigin) {
      this.addFeesData(apiData.data.feesByOrigin);
    }
  }

  /**
   * Crear aeropuerto básico desde código
   */
  private static createAirportFromCode(code: string, connections: string[]): Airport | null {
    // Base de datos de aeropuertos conocidos
    const knownAirports: { [key: string]: Partial<Airport> } = {
      // República Dominicana
      'SDQ': { 
        name: 'Las Américas International Airport', 
        city: 'Santo Domingo', 
        country: 'República Dominicana',
        timezone: 'America/Santo_Domingo',
        metadata: { region: 'Caribbean', continent: 'North America', hub: true, international: true }
      },
      'PUJ': { 
        name: 'Punta Cana International Airport', 
        city: 'Punta Cana', 
        country: 'República Dominicana',
        timezone: 'America/Santo_Domingo',
        metadata: { region: 'Caribbean', continent: 'North America', hub: false, international: true }
      },
      'STI': { 
        name: 'Gregorio Luperón International Airport', 
        city: 'Puerto Plata', 
        country: 'República Dominicana',
        timezone: 'America/Santo_Domingo',
        metadata: { region: 'Caribbean', continent: 'North America', hub: false, international: true }
      },
      'LRM': { 
        name: 'Casa de Campo International Airport', 
        city: 'La Romana', 
        country: 'República Dominicana',
        timezone: 'America/Santo_Domingo',
        metadata: { region: 'Caribbean', continent: 'North America', hub: false, international: true }
      },

      // Colombia
      'BOG': { 
        name: 'El Dorado International Airport', 
        city: 'Bogotá', 
        country: 'Colombia',
        timezone: 'America/Bogota',
        metadata: { region: 'South America', continent: 'South America', hub: true, international: true }
      },
      'MDE': { 
        name: 'José María Córdova International Airport', 
        city: 'Medellín', 
        country: 'Colombia',
        timezone: 'America/Bogota',
        metadata: { region: 'South America', continent: 'South America', hub: false, international: true }
      },
      'CTG': { 
        name: 'Rafael Núñez International Airport', 
        city: 'Cartagena', 
        country: 'Colombia',
        timezone: 'America/Bogota',
        metadata: { region: 'South America', continent: 'South America', hub: false, international: true }
      },
      'CLO': { 
        name: 'Alfonso Bonilla Aragón International Airport', 
        city: 'Cali', 
        country: 'Colombia',
        timezone: 'America/Bogota',
        metadata: { region: 'South America', continent: 'South America', hub: false, international: true }
      },
      'BAQ': { 
        name: 'Ernesto Cortissoz International Airport', 
        city: 'Barranquilla', 
        country: 'Colombia',
        timezone: 'America/Bogota',
        metadata: { region: 'South America', continent: 'South America', hub: false, international: true }
      },

      // Argentina
      'EZE': { 
        name: 'Ministro Pistarini International Airport', 
        city: 'Buenos Aires', 
        country: 'Argentina',
        timezone: 'America/Argentina/Buenos_Aires',
        metadata: { region: 'South America', continent: 'South America', hub: true, international: true }
      },

      // Chile
      'SCL': { 
        name: 'Arturo Merino Benítez International Airport', 
        city: 'Santiago', 
        country: 'Chile',
        timezone: 'America/Santiago',
        metadata: { region: 'South America', continent: 'South America', hub: true, international: true }
      },

      // Perú
      'LIM': { 
        name: 'Jorge Chávez International Airport', 
        city: 'Lima', 
        country: 'Perú',
        timezone: 'America/Lima',
        metadata: { region: 'South America', continent: 'South America', hub: true, international: true }
      },

      // Ecuador
      'UIO': { 
        name: 'Mariscal Sucre International Airport', 
        city: 'Quito', 
        country: 'Ecuador',
        timezone: 'America/Guayaquil',
        metadata: { region: 'South America', continent: 'South America', hub: true, international: true }
      },
      'GYE': { 
        name: 'José Joaquín de Olmedo International Airport', 
        city: 'Guayaquil', 
        country: 'Ecuador',
        timezone: 'America/Guayaquil',
        metadata: { region: 'South America', continent: 'South America', hub: false, international: true }
      },

      // Estados Unidos
      'MIA': { 
        name: 'Miami International Airport', 
        city: 'Miami', 
        country: 'Estados Unidos',
        timezone: 'America/New_York',
        metadata: { region: 'North America', continent: 'North America', hub: true, international: true }
      },
      'JFK': { 
        name: 'John F. Kennedy International Airport', 
        city: 'New York', 
        country: 'Estados Unidos',
        timezone: 'America/New_York',
        metadata: { region: 'North America', continent: 'North America', hub: true, international: true }
      },
      'FLL': { 
        name: 'Fort Lauderdale-Hollywood International Airport', 
        city: 'Fort Lauderdale', 
        country: 'Estados Unidos',
        timezone: 'America/New_York',
        metadata: { region: 'North America', continent: 'North America', hub: false, international: true }
      },
      'JFN': { 
        name: 'Aeropuerto Internacional de Nueva York', 
        city: 'Nueva York', 
        country: 'Estados Unidos',
        timezone: 'America/New_York',
        metadata: { region: 'North America', continent: 'North America', hub: true, international: true }
      },

      // Curaçao
      'CUR': { 
        name: 'Hato International Airport', 
        city: 'Willemstad', 
        country: 'Curaçao',
        timezone: 'America/Curacao',
        metadata: { region: 'Caribbean', continent: 'North America', hub: false, international: true }
      },

      // Aruba
      'AUA': { 
        name: 'Queen Beatrix International Airport', 
        city: 'Oranjestad', 
        country: 'Aruba',
        timezone: 'America/Aruba',
        metadata: { region: 'Caribbean', continent: 'North America', hub: false, international: true }
      },

      // Costa Rica
      'SJO': { 
        name: 'Juan Santamaría International Airport', 
        city: 'San José', 
        country: 'Costa Rica',
        timezone: 'America/Costa_Rica',
        metadata: { region: 'Central America', continent: 'North America', hub: true, international: true }
      },

      // Guatemala
      'GUA': { 
        name: 'La Aurora International Airport', 
        city: 'Ciudad de Guatemala', 
        country: 'Guatemala',
        timezone: 'America/Guatemala',
        metadata: { region: 'Central America', continent: 'North America', hub: true, international: true }
      },

      // Panamá
      'PTY': { 
        name: 'Tocumen International Airport', 
        city: 'Ciudad de Panamá', 
        country: 'Panamá',
        timezone: 'America/Panama',
        metadata: { region: 'Central America', continent: 'North America', hub: true, international: true }
      },

      // España
      'MAD': { 
        name: 'Adolfo Suárez Madrid-Barajas Airport', 
        city: 'Madrid', 
        country: 'España',
        timezone: 'Europe/Madrid',
        metadata: { region: 'Europe', continent: 'Europe', hub: true, international: true }
      },
      'BCN': { 
        name: 'Josep Tarradellas Barcelona-El Prat Airport', 
        city: 'Barcelona', 
        country: 'España',
        timezone: 'Europe/Madrid',
        metadata: { region: 'Europe', continent: 'Europe', hub: false, international: true }
      },

      // México
      'MEX': { 
        name: 'Aeropuerto Internacional de la Ciudad de México', 
        city: 'Ciudad de México', 
        country: 'México',
        timezone: 'America/Mexico_City',
        metadata: { region: 'North America', continent: 'North America', hub: true, international: true }
      },
      'CUN': { 
        name: 'Cancún International Airport', 
        city: 'Cancún', 
        country: 'México',
        timezone: 'America/Cancun',
        metadata: { region: 'North America', continent: 'North America', hub: false, international: true }
      },

      // Brasil
      'GRU': { 
        name: 'São Paulo/Guarulhos International Airport', 
        city: 'São Paulo', 
        country: 'Brasil',
        timezone: 'America/Sao_Paulo',
        metadata: { region: 'South America', continent: 'South America', hub: true, international: true }
      },

      // Canadá
      'YYZ': { 
        name: 'Toronto Pearson International Airport', 
        city: 'Toronto', 
        country: 'Canadá',
        timezone: 'America/Toronto',
        metadata: { region: 'North America', continent: 'North America', hub: true, international: true }
      }
    };

    const knownData = knownAirports[code];
    if (!knownData) {
      // Si no conocemos el aeropuerto, crear uno básico
      return {
        code,
        name: `${code} Airport`,
        city: 'Unknown',
        country: 'Unknown',
        connections,
        restrictions: { isActive: true },
        metadata: { international: true }
      };
    }

    const airport: Airport = {
      code,
      name: knownData.name || `${code} Airport`,
      city: knownData.city || 'Unknown',
      country: knownData.country || 'Unknown',
      connections,
      restrictions: { isActive: true },
      metadata: knownData.metadata || { international: true }
    };

    if (knownData.timezone) {
      airport.timezone = knownData.timezone;
    }

    if (knownData.location) {
      airport.location = knownData.location;
    }

    return airport;
  }

  /**
   * Agregar datos de restricciones
   */
  private static addRestrictionsData(restrictionsData: any): void {
    for (const [origin, restrictions] of Object.entries(restrictionsData)) {
      const airport = this.airports.get(origin);
      if (airport && restrictions) {
        airport.restrictions = {
          isActive: true,
          notes: JSON.stringify(restrictions)
        };
      }
    }
  }

  /**
   * Agregar datos de fees
   */
  private static addFeesData(feesData: any): void {
    for (const [origin, fees] of Object.entries(feesData)) {
      const airport = this.airports.get(origin);
      if (airport && fees) {
        airport.fees = fees as any;
      }
    }
  }

  /**
   * Obtener aeropuerto por código
   */
  static getAirport(code: string): Airport | undefined {
    return this.airports.get(code.toUpperCase());
  }

  /**
   * Obtener todos los aeropuertos
   */
  static getAllAirports(): Airport[] {
    return Array.from(this.airports.values());
  }

  /**
   * Buscar aeropuertos por ciudad o país
   */
  static searchAirports(query: string): Airport[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.airports.values()).filter(airport => 
      airport.city.toLowerCase().includes(lowerQuery) ||
      airport.country.toLowerCase().includes(lowerQuery) ||
      airport.name.toLowerCase().includes(lowerQuery) ||
      airport.code.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Obtener aeropuertos por región
   */
  static getAirportsByRegion(region: string): Airport[] {
    return Array.from(this.airports.values()).filter(airport => 
      airport.metadata?.region?.toLowerCase() === region.toLowerCase()
    );
  }

  /**
   * Obtener aeropuertos conectados desde un origen
   */
  static getConnectedAirports(originCode: string): Airport[] {
    const origin = this.airports.get(originCode.toUpperCase());
    if (!origin || !origin.connections) return [];

    return origin.connections
      .map(code => this.airports.get(code))
      .filter(airport => airport !== undefined) as Airport[];
  }

  /**
   * Verificar si dos aeropuertos están conectados
   */
  static areConnected(originCode: string, destinationCode: string): boolean {
    const origin = this.airports.get(originCode.toUpperCase());
    return origin?.connections?.includes(destinationCode.toUpperCase()) || false;
  }
}
