#!/usr/bin/env node

// Script de prueba para validar las funcionalidades del bot

import { AerolineasAlertService } from '../src/services/AerolineasAlertService';
import { isValidAerolineasAirport } from '../src/config/aerolineas-airports';

async function testAirportValidation() {
  console.log('\n🛫 Probando validación de aeropuertos...');
  
  const validCodes = ['EZE', 'AEP', 'BHI', 'SLA', 'MIA', 'SCL'];
  const invalidCodes = ['XXX', 'YYY', 'ZZZ'];
  
  console.log('\n✅ Códigos válidos:');
  for (const code of validCodes) {
    const isValid = isValidAerolineasAirport(code);
    console.log(`  ${code}: ${isValid ? '✅' : '❌'}`);
  }
  
  console.log('\n❌ Códigos inválidos:');
  for (const code of invalidCodes) {
    const isValid = isValidAerolineasAirport(code);
    console.log(`  ${code}: ${isValid ? '✅' : '❌'}`);
  }
}

async function testAerolineasService() {
  console.log('\n🔍 Probando servicio de Aerolíneas...');
  
  const service = new AerolineasAlertService();
  
  try {
    console.log('• Buscando ofertas EZE → BHI para 2025-08-15...');
    const offers = await service.searchPromoOffersForDate(
      'EZE',
      'BHI', 
      '2025-08-15',
      { adults: 1, cabinClass: 'Economy' }
    );
    
    console.log(`• Encontradas ${offers.length} ofertas`);
    
    if (offers.length > 0) {
      console.log('• Primera oferta:');
      const firstOffer = offers[0];
      console.log(`  - Millas: ${firstOffer.miles || 'N/A'}`);
      console.log(`  - Clase: ${firstOffer.cabinClass}`);
      console.log(`  - Asientos disponibles: ${firstOffer.availableSeats}`);
    }
    
  } catch (error) {
    console.log(`• Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

async function main() {
  console.log('🧪 Iniciando pruebas del sistema...');
  
  await testAirportValidation();
  await testAerolineasService();
  
  console.log('\n✅ Pruebas completadas!');
  console.log('\n📋 Comandos para probar en Telegram:');
  console.log('  /millas-ar-search EZE BHI 2025-08-15');
  console.log('  /millas-ar-search AEP SLA 2025-09-01');
  console.log('  /millas-ar-search EZE MIA 2025-10-15');
  console.log('\n💡 También puedes usar: /start, /help, /millas-ar');
}

main().catch(console.error);
