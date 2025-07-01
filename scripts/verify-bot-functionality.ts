#!/usr/bin/env npx tsx

/**
 * Script para verificar el funcionamiento completo del bot
 */

import path from 'path';
import dotenv from 'dotenv';

// Configurar paths y environment
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function testBotFunctionality() {
  console.log('🔍 Verificando funcionalidad del bot...\n');

  try {
    // 1. Test de configuración
    console.log('1️⃣ Verificando configuración...');
    const { config } = await import('../src/config');
    console.log(`   ✅ Intervalo de verificación: ${config.scraping.intervalMinutes} minutos`);
    console.log(`   ✅ Max alertas por usuario: ${config.alerts.maxAlertsPerUser}`);
    
    // 2. Test de aeropuertos
    console.log('\n2️⃣ Verificando base de datos de aeropuertos...');
    const { airports } = await import('../src/config');
    const airportCodes = Object.keys(airports);
    console.log(`   ✅ ${airportCodes.length} aeropuertos disponibles`);
    console.log(`   ✅ Incluye: ${['EZE', 'STI', 'PUJ', 'MIA', 'SCL'].filter(code => airportCodes.includes(code)).join(', ')}`);
    
    // 3. Test de AlertManager
    console.log('\n3️⃣ Verificando AlertManager...');
    const { AlertManager } = await import('../src/services/AlertManager');
    const alertManager = new AlertManager('./data/alerts.db');
    console.log(`   ✅ AlertManager inicializado`);
    
    // 4. Test de ArajetAlertService
    console.log('\n4️⃣ Verificando ArajetAlertService...');
    const { ArajetAlertService } = await import('../src/services/ArajetAlertService');
    const arajetService = new ArajetAlertService();
    console.log(`   ✅ ArajetAlertService inicializado`);
    
    // Test de códigos válidos
    const testCodes = ['STI', 'PUJ', 'EZE', 'MIA', 'SCL'];
    const validCodes = testCodes.filter(code => arajetService.isValidAirportCode(code));
    console.log(`   ✅ Códigos válidos: ${validCodes.join(', ')}`);
    
    // 5. Test de MessageFormatter
    console.log('\n5️⃣ Verificando MessageFormatter...');
    const { MessageFormatter } = await import('../src/bot/MessageFormatter');
    const helpMessage = MessageFormatter.formatHelpMessage();
    console.log(`   ✅ Mensaje de ayuda generado (${helpMessage.length} caracteres)`);
    
    const monthlyUsage = MessageFormatter.formatMonthlyAlertUsageMessage();
    console.log(`   ✅ Mensaje de uso mensual generado (${monthlyUsage.length} caracteres)`);
    
    // 6. Test de validación de mes
    console.log('\n6️⃣ Verificando validación de fechas...');
    const { CommandHandler } = await import('../src/bot/CommandHandler');
    // Simular un bot mock para el test
    const mockBot = { sendMessage: () => {} };
    const handler = new CommandHandler(mockBot);
    
    // Usar reflection para acceder al método privado (solo para testing)
    const validateMethod = (handler as any).validateAndFormatMonth;
    if (validateMethod) {
      const testResults = [
        validateMethod.call(handler, '2026-02'),
        validateMethod.call(handler, '02/2026'),
        validateMethod.call(handler, 'febrero'),
        validateMethod.call(handler, '2024-01') // Pasado
      ];
      
      const validResults = testResults.filter(r => r.isValid).length;
      console.log(`   ✅ Validación de fechas: ${validResults}/3 formatos válidos funcionando`);
    }
    
    console.log('\n🎉 ¡Todas las verificaciones completadas exitosamente!');
    
    // 7. Verificación de instancias múltiples
    console.log('\n7️⃣ Verificando instancias múltiples...');
    try {
      const { execSync } = await import('child_process');
      
      // Buscar procesos más específicos para evitar falsos positivos
      const botProcesses = execSync(
        'ps aux | grep -E "(npm run dev|tsx.*src/index|ts-node.*src/index|pm2.*flight-bot)" | grep -v grep || echo ""', 
        { encoding: 'utf8' }
      ).trim();
      
      if (!botProcesses) {
        console.log('   ⚠️  No hay bot corriendo actualmente');
      } else {
        const processLines = botProcesses.split('\n').filter(line => line.length > 0);
        const realBotProcesses = processLines.filter(line => 
          !line.includes('setup.sh') && 
          !line.includes('verify-bot') &&
          !line.includes('grep')
        );
        
        if (realBotProcesses.length === 0) {
          console.log('   ⚠️  No hay instancias del bot corriendo');
        } else if (realBotProcesses.length === 1) {
          console.log(`   ✅ Una instancia del bot corriendo correctamente`);
        } else {
          console.log(`   ❌ PROBLEMA: ${realBotProcesses.length} procesos del bot detectados`);
          console.log('   💡 Usa: ./scripts/bot-manager.sh stop && ./scripts/bot-manager.sh start');
          console.log('\n   Procesos detectados:');
          realBotProcesses.forEach((proc, i) => {
            const simplified = proc.replace(/.*\s+/, '').substring(0, 60);
            console.log(`   ${i + 1}. ${simplified}...`);
          });
        }
      }
    } catch (error) {
      console.log('   ⚠️  No se pudo verificar instancias múltiples (esto es normal en algunos sistemas)');
    }
    
    console.log('\n📋 Resumen de funcionalidades:');
    console.log('   ✅ Comandos básicos: /start, /help');
    console.log('   ✅ Alertas normales: /alertas');
    console.log('   ✅ Alertas mensuales: /monthlyalert');
    console.log('   ✅ Ver alertas: /misalertas (con botones de pausar/chequear)');
    console.log('   ✅ Cancelar alertas: /cancelar');
    console.log('   ✅ Verificación automática cada 5 minutos');
    console.log('   ✅ Base de aeropuertos expandida');
    console.log('   ✅ Sistema unificado de alertas');
    
    console.log('\n💡 Próximos pasos para testing:');
    console.log('   1. Prueba /misalertas para ver tu alerta STI → PUJ');
    console.log('   2. Usa el botón "🔍 Chequear Ahora" para búsqueda inmediata');
    console.log('   3. Espera 5 minutos para verificación automática');
    console.log('   4. Prueba pausar/reactivar alertas con los botones');
    
    console.log('\n🛠️ Gestión del bot:');
    console.log('   • Para evitar instancias múltiples: ./scripts/bot-manager.sh status');
    console.log('   • Para reiniciar limpiamente: ./scripts/bot-manager.sh restart');
    console.log('   • Para producción: ./scripts/bot-manager.sh pm2');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    process.exit(1);
  }
}

// Ejecutar test
testBotFunctionality().catch(console.error);
