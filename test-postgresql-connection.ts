#!/usr/bin/env ts-node
/**
 * Test básico de conectividad PostgreSQL y funcionalidad del bot
 */

import { PrismaDatabaseManager } from './src/database/prisma-adapter';
import { BotAlertManager } from './src/services/BotAlertManager';
import { UserModelPrisma } from './src/models/UserModelPrisma';

async function testDatabaseConnection() {
  console.log('🔍 Probando conexión a PostgreSQL...');
  
  try {
    // Test 1: Verificar instancia de Prisma
    PrismaDatabaseManager.getInstance();
    console.log('✅ Instancia de Prisma obtenida');

    // Test 2: Crear usuario de prueba
    console.log('🔍 Probando creación de usuario...');
    const testUser = await UserModelPrisma.findOrCreate(
      12345,
      'test_user',
      'Test',
      'User'
    );
    console.log('✅ Usuario de prueba creado:', testUser.id);

    // Test 3: Gestión de alertas
    console.log('🔍 Probando gestión de alertas...');
    const alertManager = new BotAlertManager();
    
    const alertId = await alertManager.createAlert(
      12345,
      12345,
      'YUL',
      'YYZ',
      300,
      [],
      '2025-08',
      'CAD'
    );
    console.log('✅ Alerta de prueba creada:', alertId);

    if (alertId) {
      const userAlerts = await alertManager.getAlertsByUser(12345);
      console.log('✅ Alertas del usuario obtenidas:', userAlerts.length);

      const deactivated = await alertManager.deactivateAlert(alertId);
      console.log('✅ Alerta desactivada:', deactivated);
    }

    console.log('🎉 Todos los tests pasaron exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en test de database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Ejecutar test
testDatabaseConnection();
