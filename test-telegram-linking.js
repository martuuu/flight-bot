#!/usr/bin/env node

// Test de la funcionalidad crítica de vinculación de Telegram
const { UserModelPrisma } = require('./dist/models/UserModelPrisma');
const { BotAlertManager } = require('./dist/services/BotAlertManager');

async function testTelegramLinking() {
  console.log('🔄 Probando funcionalidad de vinculación de Telegram...');
  
  try {
    const testTelegramId = 123456789;
    const testChatId = BigInt(987654321);
    
    // Test 1: Crear/encontrar usuario de Telegram
    console.log('1. Probando creación de usuario de Telegram...');
    const user = await UserModelPrisma.findOrCreate(
      testTelegramId,
      'test_user_linking',
      'Test',
      'User'
    );
    console.log('✅ Usuario creado/encontrado:', {
      id: user.id,
      telegramId: user.telegramId,
      username: user.username
    });
    
    // Test 2: Crear alerta para el usuario
    console.log('2. Probando creación de alerta...');
    const alertManager = new BotAlertManager();
    const alertId = await alertManager.createAlert(
      user.id,
      testChatId,
      'SDQ',
      'BOG',
      '2025-08',
      300,
      []
    );
    console.log('✅ Alerta creada:', alertId);
    
    // Test 3: Buscar alertas del usuario
    console.log('3. Probando búsqueda de alertas...');
    const userAlerts = await alertManager.getAlertsByUser(user.id);
    console.log('✅ Alertas encontradas:', userAlerts.length);
    
    // Test 4: Actualizar actividad del usuario
    console.log('4. Probando actualización de actividad...');
    await UserModelPrisma.updateActivity(testTelegramId);
    console.log('✅ Actividad actualizada');
    
    // Test 5: Verificar estadísticas
    console.log('5. Probando estadísticas...');
    const stats = await UserModelPrisma.getUserStats();
    console.log('✅ Estadísticas:', stats);
    
    // Cleanup
    console.log('6. Limpiando datos de test...');
    await alertManager.deactivateAlert(alertId);
    console.log('✅ Alerta desactivada');
    
    console.log('\n🎉 FUNCIONALIDAD DE VINCULACIÓN DE TELEGRAM FUNCIONANDO PERFECTAMENTE!');
    console.log('📊 Resumen del test:');
    console.log(`   - Usuario de Telegram: ✅ Creado/actualizado`);
    console.log(`   - Alerta: ✅ Creada y gestionada`);
    console.log(`   - Actividad: ✅ Actualizada`);
    console.log(`   - Estadísticas: ✅ Funcionando`);
    console.log(`   - Base PostgreSQL: ✅ Totalmente operativa`);
    
  } catch (error) {
    console.error('❌ Error en test de vinculación:', error);
    process.exit(1);
  }
}

testTelegramLinking();
