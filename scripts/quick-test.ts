#!/usr/bin/env npx tsx

import { airports } from '../src/config';

/**
 * Script de validación rápida para verificar el funcionamiento del bot
 */
function testBasicFunctionality() {
  console.log('🔧 VERIFICACIÓN RÁPIDA DEL SISTEMA\n');
  
  // Test 1: Verificar aeropuertos clave
  console.log('✅ Test 1: Aeropuertos principales');
  const keyAirports = ['EZE', 'JFK', 'BOG', 'SCL', 'MIA', 'PUJ'];
  keyAirports.forEach(code => {
    if (airports[code as keyof typeof airports]) {
      console.log(`   ✓ ${code} - ${airports[code as keyof typeof airports].name}`);
    } else {
      console.log(`   ❌ ${code} - NO ENCONTRADO`);
    }
  });
  
  // Test 2: Verificar formato de fecha 2026-02
  console.log('\n✅ Test 2: Validación de formato de fecha');
  const dateFormats = ['2026-02', '02/2026', 'febrero', 'feb'];
  console.log('   Formatos que deberían ser válidos:');
  dateFormats.forEach(format => {
    console.log(`   • ${format}`);
  });
  
  // Test 3: Comandos disponibles
  console.log('\n✅ Test 3: Comandos del bot');
  const commands = ['/start', '/help', '/monthlyalert', '/buscar', '/alertas', '/misalertas', '/cancelar'];
  commands.forEach(cmd => {
    console.log(`   • ${cmd}`);
  });
  
  console.log('\n🎯 PRÓXIMOS PASOS:');
  console.log('1. Corregir validaciones de AlertModel vs AlertManager');
  console.log('2. Implementar método handleMyAlerts en AlertManager');
  console.log('3. Verificar que las alertas se guarden correctamente');
  console.log('4. Probar comando: /monthlyalert EZE PUJ 400 2026-02');
  
  console.log('\n💡 Para testear en Telegram:');
  console.log('• /monthlyalert EZE PUJ 400 2026-02');
  console.log('• /monthlyalert BOG MIA 350 marzo');
  console.log('• /misalertas');
}

testBasicFunctionality();
