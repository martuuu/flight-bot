#!/usr/bin/env node

/**
 * Test Suite para el Sistema de Millas de Aerolíneas Argentinas
 * 
 * Funcionalidades:
 * - Prueba validación de aeropuertos
 * - Testa servicio de búsqueda de millas
 * - Verifica conexión a API
 * - Genera reportes de rendimiento
 * 
 * Uso:
 * npx ts-node scripts/test-bot-functionality.ts [--verbose] [--quick]
 */

import { AerolineasAlertService } from '../src/services/AerolineasAlertService';
import { isValidAerolineasAirport, getAerolineasAirportInfo } from '../src/config/aerolineas-airports';

// Configuración de pruebas
const TEST_ROUTES = [
  { origin: 'EZE', destination: 'BHI', date: '2025-08-15', description: 'Buenos Aires → Bahía Blanca' },
  { origin: 'AEP', destination: 'SLA', date: '2025-09-01', description: 'Jorge Newbery → Salta' },
  { origin: 'COR', destination: 'MIA', date: '2025-10-15', description: 'Córdoba → Miami' },
  { origin: 'EZE', destination: 'SCL', date: '2025-11-01', description: 'Buenos Aires → Santiago' }
];

const INVALID_CODES = ['XXX', 'YYY', 'ZZZ', 'ABC', 'DEF'];
const VALID_CODES = ['EZE', 'AEP', 'BHI', 'SLA', 'COR', 'MDZ', 'MIA', 'SCL', 'MVD', 'BOG'];

interface TestResult {
  route: string;
  success: boolean;
  offers?: number;
  duration?: number;
  error?: string;
}

async function testAirportValidation() {
  console.log('\n🛫 === PRUEBA DE VALIDACIÓN DE AEROPUERTOS ===');
  
  console.log('\n✅ Códigos válidos:');
  let validCount = 0;
  for (const code of VALID_CODES) {
    const isValid = isValidAerolineasAirport(code);
    const info = getAerolineasAirportInfo(code);
    console.log(`  ${code}: ${isValid ? '✅' : '❌'} ${info ? `- ${info.city}, ${info.country}` : ''}`);
    if (isValid) validCount++;
  }
  
  console.log('\n❌ Códigos inválidos:');
  let invalidCount = 0;
  for (const code of INVALID_CODES) {
    const isValid = isValidAerolineasAirport(code);
    console.log(`  ${code}: ${isValid ? '✅' : '❌'}`);
    if (!isValid) invalidCount++;
  }
  
  console.log(`\n📊 Resumen: ${validCount}/${VALID_CODES.length} válidos, ${invalidCount}/${INVALID_CODES.length} inválidos detectados`);
  
  return {
    validPassed: validCount === VALID_CODES.length,
    invalidPassed: invalidCount === INVALID_CODES.length
  };
}

async function testAerolineasService() {
  console.log('\n🔍 === PRUEBA DE SERVICIO DE AEROLÍNEAS ===');
  
  const service = new AerolineasAlertService();
  const results: TestResult[] = [];
  
  for (const route of TEST_ROUTES) {
    console.log(`\n🛩️  Probando: ${route.description}`);
    console.log(`   Ruta: ${route.origin} → ${route.destination}`);
    console.log(`   Fecha: ${route.date}`);
    
    try {
      const startTime = Date.now();
      const offers = await service.searchPromoOffersForDate(
        route.origin,
        route.destination, 
        route.date,
        { adults: 1, cabinClass: 'Economy' }
      );
      const duration = Date.now() - startTime;
      
      console.log(`   ✅ Búsqueda completada en ${duration}ms`);
      console.log(`   📊 Ofertas encontradas: ${offers.length}`);
      
      if (offers.length > 0) {
        const firstOffer = offers[0];
        console.log(`   💰 Primera oferta: ${firstOffer.miles || 'N/A'} millas`);
        console.log(`   🎫 Clase: ${firstOffer.cabinClass}`);
        console.log(`   🪑 Asientos: ${firstOffer.availableSeats}`);
      }
      
      results.push({
        route: `${route.origin}-${route.destination}`,
        success: true,
        offers: offers.length,
        duration
      });
      
    } catch (error) {
      console.log(`   ❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      results.push({
        route: `${route.origin}-${route.destination}`,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
}

async function main() {
  console.log('🧪 === INICIANDO PRUEBAS DEL SISTEMA ===');
  console.log(`📅 Fecha: ${new Date().toLocaleString()}`);
  
  // Prueba validación de aeropuertos
  const airportResults = await testAirportValidation();
  
  // Prueba servicio de aerolíneas
  const serviceResults = await testAerolineasService();
  
  // Generar reporte final
  console.log('\n📊 === REPORTE FINAL ===');
  console.log(`✅ Validación de aeropuertos: ${airportResults.validPassed && airportResults.invalidPassed ? 'PASSED' : 'FAILED'}`);
  
  const successfulSearches = serviceResults.filter(r => r.success).length;
  const totalSearches = serviceResults.length;
  console.log(`� Búsquedas exitosas: ${successfulSearches}/${totalSearches}`);
  
  if (successfulSearches > 0) {
    const avgDuration = serviceResults
      .filter(r => r.success && r.duration)
      .reduce((sum, r) => sum + (r.duration || 0), 0) / successfulSearches;
    console.log(`⏱️  Tiempo promedio: ${Math.round(avgDuration)}ms`);
  }
  
  console.log('\n🎯 === COMANDOS PARA PROBAR EN TELEGRAM ===');
  console.log('  /millas-ar-search EZE BHI 2025-08-15');
  console.log('  /millas-ar-search AEP SLA 2025-09-01');
  console.log('  /millas-ar-search EZE MIA 2025-10-15');
  console.log('\n💡 También disponibles: /start, /help, /millas-ar');
  
  console.log('\n✅ Pruebas completadas!');
}

main().catch(console.error);
