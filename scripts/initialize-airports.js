const fs = require('fs');
const path = require('path');

/**
 * Script simple para inicializar aeropuertos desde response.json
 */
async function initializeAirports() {
  try {
    console.log('🛫 Inicializando aeropuertos desde API response...');
    
    // Leer el archivo response.json
    const responsePath = path.join(__dirname, '..', 'response.json');
    const responseData = JSON.parse(fs.readFileSync(responsePath, 'utf8'));
    
    console.log('📊 Datos de la API cargados:');
    console.log(`   - airportsWithValidConnections: ${Object.keys(responseData.airportsWithValidConnections || {}).length} aeropuertos`);
    
    // Procesar aeropuertos con conexiones válidas
    const airports = responseData.airportsWithValidConnections || {};
    const airportList = [];
    
    for (const [code, connections] of Object.entries(airports)) {
      const airport = {
        code: code,
        connections: connections,
        connectionsCount: Array.isArray(connections) ? connections.length : 0
      };
      airportList.push(airport);
    }
    
    // Ordenar por número de conexiones
    airportList.sort((a, b) => b.connectionsCount - a.connectionsCount);
    
    console.log('\n🗺️  Top 10 aeropuertos por conexiones:');
    airportList.slice(0, 10).forEach((airport, index) => {
      console.log(`   ${index + 1}. ${airport.code}: ${airport.connectionsCount} destinos`);
    });
    
    // Crear archivo de configuración de aeropuertos
    const airportsConfig = {
      totalAirports: airportList.length,
      lastUpdated: new Date().toISOString(),
      airports: {}
    };
    
    // Agregar información conocida de aeropuertos
    const knownAirports = {
      'SDQ': { 
        name: 'Las Américas International Airport', 
        city: 'Santo Domingo', 
        country: 'República Dominicana',
        region: 'Caribbean'
      },
      'PUJ': { 
        name: 'Punta Cana International Airport', 
        city: 'Punta Cana', 
        country: 'República Dominicana',
        region: 'Caribbean'
      },
      'STI': { 
        name: 'Gregorio Luperón International Airport', 
        city: 'Puerto Plata', 
        country: 'República Dominicana',
        region: 'Caribbean'
      },
      'LRM': { 
        name: 'Casa de Campo International Airport', 
        city: 'La Romana', 
        country: 'República Dominicana',
        region: 'Caribbean'
      },
      'BOG': { 
        name: 'El Dorado International Airport', 
        city: 'Bogotá', 
        country: 'Colombia',
        region: 'South America'
      },
      'MDE': { 
        name: 'José María Córdova International Airport', 
        city: 'Medellín', 
        country: 'Colombia',
        region: 'South America'
      },
      'CTG': { 
        name: 'Rafael Núñez International Airport', 
        city: 'Cartagena', 
        country: 'Colombia',
        region: 'South America'
      },
      'CLO': { 
        name: 'Alfonso Bonilla Aragón International Airport', 
        city: 'Cali', 
        country: 'Colombia',
        region: 'South America'
      },
      'BAQ': { 
        name: 'Ernesto Cortissoz International Airport', 
        city: 'Barranquilla', 
        country: 'Colombia',
        region: 'South America'
      },
      'EZE': { 
        name: 'Ministro Pistarini International Airport', 
        city: 'Buenos Aires', 
        country: 'Argentina',
        region: 'South America'
      },
      'SCL': { 
        name: 'Arturo Merino Benítez International Airport', 
        city: 'Santiago', 
        country: 'Chile',
        region: 'South America'
      },
      'LIM': { 
        name: 'Jorge Chávez International Airport', 
        city: 'Lima', 
        country: 'Perú',
        region: 'South America'
      },
      'UIO': { 
        name: 'Mariscal Sucre International Airport', 
        city: 'Quito', 
        country: 'Ecuador',
        region: 'South America'
      },
      'GYE': { 
        name: 'José Joaquín de Olmedo International Airport', 
        city: 'Guayaquil', 
        country: 'Ecuador',
        region: 'South America'
      },
      'MIA': { 
        name: 'Miami International Airport', 
        city: 'Miami', 
        country: 'Estados Unidos',
        region: 'North America'
      },
      'JFK': { 
        name: 'John F. Kennedy International Airport', 
        city: 'New York', 
        country: 'Estados Unidos',
        region: 'North America'
      },
      'FLL': { 
        name: 'Fort Lauderdale-Hollywood International Airport', 
        city: 'Fort Lauderdale', 
        country: 'Estados Unidos',
        region: 'North America'
      },
      'CUR': { 
        name: 'Hato International Airport', 
        city: 'Willemstad', 
        country: 'Curaçao',
        region: 'Caribbean'
      },
      'AUA': { 
        name: 'Queen Beatrix International Airport', 
        city: 'Oranjestad', 
        country: 'Aruba',
        region: 'Caribbean'
      },
      'SJO': { 
        name: 'Juan Santamaría International Airport', 
        city: 'San José', 
        country: 'Costa Rica',
        region: 'Central America'
      },
      'GUA': { 
        name: 'La Aurora International Airport', 
        city: 'Ciudad de Guatemala', 
        country: 'Guatemala',
        region: 'Central America'
      },
      'PTY': { 
        name: 'Tocumen International Airport', 
        city: 'Ciudad de Panamá', 
        country: 'Panamá',
        region: 'Central America'
      },
      'MAD': { 
        name: 'Adolfo Suárez Madrid-Barajas Airport', 
        city: 'Madrid', 
        country: 'España',
        region: 'Europe'
      },
      'BCN': { 
        name: 'Josep Tarradellas Barcelona-El Prat Airport', 
        city: 'Barcelona', 
        country: 'España',
        region: 'Europe'
      },
      'MEX': { 
        name: 'Aeropuerto Internacional de la Ciudad de México', 
        city: 'Ciudad de México', 
        country: 'México',
        region: 'North America'
      },
      'CUN': { 
        name: 'Cancún International Airport', 
        city: 'Cancún', 
        country: 'México',
        region: 'North America'
      },
      'GRU': { 
        name: 'São Paulo/Guarulhos International Airport', 
        city: 'São Paulo', 
        country: 'Brasil',
        region: 'South America'
      },
      'YYZ': { 
        name: 'Toronto Pearson International Airport', 
        city: 'Toronto', 
        country: 'Canadá',
        region: 'North America'
      }
    };
    
    // Procesar cada aeropuerto
    for (const airport of airportList) {
      const known = knownAirports[airport.code];
      airportsConfig.airports[airport.code] = {
        code: airport.code,
        name: known?.name || `${airport.code} Airport`,
        city: known?.city || 'Unknown',
        country: known?.country || 'Unknown',
        region: known?.region || 'Unknown',
        connections: airport.connections,
        connectionsCount: airport.connectionsCount,
        isActive: true
      };
    }
    
    // Guardar configuración de aeropuertos
    const configPath = path.join(__dirname, '..', 'data', 'airports-config.json');
    
    // Crear directorio data si no existe
    const dataDir = path.dirname(configPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(configPath, JSON.stringify(airportsConfig, null, 2));
    
    console.log(`\n✅ Configuración de aeropuertos guardada en: ${configPath}`);
    
    // Mostrar estadísticas por región
    const regions = {};
    for (const airport of Object.values(airportsConfig.airports)) {
      const region = airport.region;
      regions[region] = (regions[region] || 0) + 1;
    }
    
    console.log('\n📊 Aeropuertos por región:');
    Object.entries(regions).forEach(([region, count]) => {
      console.log(`   ${region}: ${count} aeropuertos`);
    });
    
    return airportsConfig;
    
  } catch (error) {
    console.error('❌ Error inicializando aeropuertos:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeAirports()
    .then(() => {
      console.log('\n🎉 Inicialización completada exitosamente!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error ejecutando script:', error);
      process.exit(1);
    });
}

module.exports = { initializeAirports };
