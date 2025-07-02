import fs from 'fs';
import path from 'path';
import { AirportService } from '../src/models/Airport';

async function initializeAirports() {
  try {
    console.log('🛫 Inicializando datos de aeropuertos...');
    
    // Leer el archivo de respuesta de la API
    const responsePath = path.join(__dirname, '..', 'response.json');
    const responseData = JSON.parse(fs.readFileSync(responsePath, 'utf8'));
    
    console.log('📄 Estructura de datos recibida:');
    console.log('  - airportsWithValidConnections:', Object.keys(responseData.airportsWithValidConnections || {}).length, 'aeropuertos');
    console.log('  - data.restrictionsByOrigin:', Object.keys(responseData.data?.restrictionsByOrigin || {}).length, 'restricciones');
    console.log('  - data.feesByOrigin:', Object.keys(responseData.data?.feesByOrigin || {}).length, 'tarifas');
    
    // Inicializar los aeropuertos usando el servicio
    AirportService.initializeAirports(responseData);
    
    // Verificar que se cargaron los datos
    const allAirports = AirportService.getAllAirports();
    console.log(`\n✅ ${allAirports.length} aeropuertos cargados correctamente`);
    
    // Mostrar algunos ejemplos
    console.log('\n📋 Primeros 10 aeropuertos:');
    allAirports.slice(0, 10).forEach(airport => {
      const connectionsCount = airport.connections?.length || 0;
      const hasRestrictions = airport.restrictions?.notes ? '⚠️' : '✅';
      const hasFees = airport.fees ? '💰' : '  ';
      console.log(`  ${airport.code}: ${airport.name}`);
      console.log(`    📍 ${airport.city}, ${airport.country}`);
      console.log(`    🔗 ${connectionsCount} conexiones ${hasRestrictions} ${hasFees}`);
    });
    
    // Verificar conexiones específicas
    const sdqConnections = AirportService.getConnectedAirports('SDQ');
    console.log(`\n🔗 Conexiones desde SDQ (Santo Domingo): ${sdqConnections.length} destinos`);
    if (sdqConnections.length > 0) {
      console.log('  Destinos disponibles:');
      sdqConnections.slice(0, 5).forEach(airport => {
        console.log(`    → ${airport.code}: ${airport.city}, ${airport.country}`);
      });
      if (sdqConnections.length > 5) {
        console.log(`    ... y ${sdqConnections.length - 5} más`);
      }
    }
    
    // Estadísticas por región
    const regions = ['Caribbean', 'South America', 'North America', 'Europe'];
    console.log('\n🌍 Distribución por regiones:');
    regions.forEach(region => {
      const regionAirports = AirportService.getAirportsByRegion(region);
      if (regionAirports.length > 0) {
        console.log(`  ${region}: ${regionAirports.length} aeropuertos`);
      }
    });
    
    // Verificar funcionalidad de búsqueda
    const searchResults = AirportService.searchAirports('Santo Domingo');
    console.log(`\n🔍 Búsqueda "Santo Domingo": ${searchResults.length} resultados`);
    
    console.log('\n🎉 Inicialización completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error al inicializar aeropuertos:', error);
    if (error instanceof Error) {
      console.error('  Detalle:', error.message);
      console.error('  Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeAirports();
}

export { initializeAirports };
