const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('🔍 Probando conexión a PostgreSQL...');
  
  const prisma = new PrismaClient();
  
  try {
    // Test básico de conexión
    await prisma.$connect();
    console.log('✅ Conexión a PostgreSQL exitosa');

    // Test creación de usuario
    const testUser = await prisma.telegramUser.upsert({
      where: { telegramId: '12345' },
      update: { lastActivity: new Date() },
      create: {
        telegramId: '12345',
        username: 'test_user',
        firstName: 'Test',
        lastName: 'User'
      }
    });
    console.log('✅ Usuario de prueba creado/actualizado:', testUser.id);

    // Test conteo de usuarios
    const userCount = await prisma.telegramUser.count();
    console.log('✅ Total de usuarios en DB:', userCount);

    console.log('🎉 Test de conexión exitoso!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

testDatabaseConnection();
