#!/usr/bin/env node

/**
 * Script de configuración para Arajet Scraper
 * 
 * Uso:
 * 1. Obtén la información de la API de Arajet siguiendo ARAJET_SCRAPING_GUIDE.md
 * 2. Ejecuta este script con la información capturada
 * 3. El scraper se configurará automáticamente
 */

import { ArajetScraper } from '../src/services/scrapers/ArajetScraper';

interface ArajetConfig {
  searchEndpoint: string;
  headers?: Record<string, string>;
  sampleRequest?: any;
  sampleResponse?: any;
}

/**
 * Configurar Arajet con información real
 */
async function configureArajet() {
  console.log('🔧 Configurando Arajet Scraper...\n');

  // TODO: Reemplazar con la información real cuando la tengas
  const config: ArajetConfig = {
    // Ejemplo del endpoint que esperamos encontrar:
    searchEndpoint: 'https://api.arajet.com/v1/flights/search',
    
    headers: {
      // Headers adicionales que pueden ser necesarios:
      'Authorization': 'Bearer TOKEN_AQUI', // Si requiere autenticación
      'X-API-Key': 'API_KEY_AQUI', // Si requiere API key
      // Otros headers específicos...
    },

    // Ejemplo de request que esperamos hacer:
    sampleRequest: {
      origin: 'BOG',
      destination: 'SDQ',
      departureDate: '2025-07-15',
      returnDate: '2025-07-22',
      passengers: {
        adults: 1,
        children: 0,
        infants: 0
      }
    },

    // Ejemplo de respuesta que esperamos recibir:
    sampleResponse: {
      success: true,
      flights: [
        {
          flightNumber: 'DM-123',
          origin: 'BOG',
          destination: 'SDQ',
          departureDate: '2025-07-15T08:00:00Z',
          arrivalDate: '2025-07-15T12:00:00Z',
          price: 189,
          currency: 'USD',
          availableSeats: 45,
          cabinClass: 'economy'
        }
      ]
    }
  };

  try {
    const scraper = new ArajetScraper();
    
    // Configurar el endpoint y headers
    scraper.configureSearchEndpoint(config.searchEndpoint, config.headers);
    
    console.log('✅ Arajet configurado exitosamente');
    console.log(`📡 Endpoint: ${config.searchEndpoint}`);
    console.log(`🔑 Headers adicionales: ${Object.keys(config.headers || {}).length}`);
    
    // Opcional: Hacer una prueba con los datos de ejemplo
    if (process.argv.includes('--test')) {
      console.log('\n🧪 Ejecutando prueba...');
      await testArajetScraper(scraper);
    }

  } catch (error) {
    console.error('❌ Error configurando Arajet:', error);
    process.exit(1);
  }
}

/**
 * Probar el scraper configurado
 */
async function testArajetScraper(scraper: ArajetScraper) {
  try {
    const testParams = {
      origin: 'BOG',
      destination: 'SDQ',
      departureDate: new Date('2025-07-15'),
      returnDate: new Date('2025-07-22'),
      passengers: 1
    };

    console.log('🔍 Buscando vuelos de prueba...');
    const result = await scraper.searchFlights(testParams);
    
    console.log(`✅ Búsqueda ${result.success ? 'exitosa' : 'fallida'}`);
    console.log(`📊 Vuelos encontrados: ${result.flights.length}`);
    
    if (result.flights.length > 0) {
      console.log('\n📋 Primer vuelo:');
      const flight = result.flights[0];
      console.log(`   ${flight.airline} ${flight.flightNumber}`);
      console.log(`   ${flight.origin} → ${flight.destination}`);
      console.log(`   💰 ${flight.currency} ${flight.price}`);
      console.log(`   🗓️  ${flight.departureDate.toLocaleDateString()}`);
    }

    if (result.error) {
      console.log(`⚠️  Error: ${result.error}`);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

/**
 * Función helper para actualizar la configuración con datos reales
 */
function updateConfigWithRealData() {
  console.log(`
📝 Para configurar Arajet con datos reales:

1. Sigue la guía en ARAJET_SCRAPING_GUIDE.md
2. Captura la información de red de arajet.com
3. Actualiza este archivo (scripts/configure-arajet.ts) con:
   - endpoint real
   - headers requeridos
   - estructura de request/response

4. Ejecuta: npm run configure-arajet
5. Prueba con: npm run configure-arajet -- --test

Ejemplo de configuración real:
{
  searchEndpoint: "https://booking.arajet.com/api/search",
  headers: {
    "Authorization": "Bearer abc123...",
    "X-Client-Version": "1.0.0"
  }
}
`);
}

// Ejecutar script
if (require.main === module) {
  if (process.argv.includes('--help')) {
    updateConfigWithRealData();
  } else {
    configureArajet();
  }
}
