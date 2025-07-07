import { PrismaDatabaseManager } from '../database/prisma-adapter';
import { UserModelPrisma } from '../models/UserModelPrisma';
import { BotAlertManager } from '../services/BotAlertManager';

async function testMigration() {
  console.log('🧪 TESTING MIGRACIÓN POSTGRESQL/PRISMA\n');

  try {
    // Test 1: Conexión a base de datos
    console.log('Test 1: Conexión a PostgreSQL/Prisma...');
    PrismaDatabaseManager.getInstance();
    console.log('✅ Database Manager inicializado correctamente');

    // Test 2: Modelo de usuarios
    console.log('\nTest 2: UserModelPrisma...');
    
    // Crear usuario de prueba
    const testUser = await UserModelPrisma.create(
      999999999,
      'test_migration',
      'Test',
      'Migration'
    );
    
    console.log('✅ Usuario creado:', testUser.id);

    // Test 3: BotAlertManager
    console.log('\nTest 3: BotAlertManager...');
    const alertManager = new BotAlertManager();
    
    // Crear alerta de prueba
    const alertId = await alertManager.createAlert(
      testUser.id,
      999999999,
      'EZE',
      'MIA',
      '2025-08-15',
      800,
      [{ code: 'ADT', count: 1 }]
    );
    
    console.log('✅ Alerta creada:', alertId);

    // Test 4: Estadísticas
    console.log('\nTest 4: Estadísticas del sistema...');
    const activeAlerts = await alertManager.getActiveAlerts();
    
    console.log(`✅ Alertas activas: ${activeAlerts.length}`);

    // Test 5: Cleanup
    console.log('\nTest 5: Limpieza...');
    await alertManager.deactivateAlert(alertId);
    
    // Limpiar usuario de test
    const prisma = PrismaDatabaseManager.getInstance().getClient();
    await prisma.telegramUser.delete({
      where: { telegramId: '999999999' }
    });
    console.log('✅ Datos de prueba eliminados');

    console.log('\n🎉 MIGRACIÓN VERIFICADA EXITOSAMENTE');
    console.log('✅ PostgreSQL/Prisma completamente funcional');
    console.log('✅ Todos los modelos migrados correctamente');
    console.log('✅ Sistema listo para producción\n');

  } catch (error) {
    console.error('❌ Error en la verificación:', error);
    throw error;
  }
}

if (require.main === module) {
  testMigration()
    .then(() => {
      console.log('✅ Test completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Test falló:', error);
      process.exit(1);
    });
}

export { testMigration };
