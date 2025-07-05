const { PrismaClient } = require('@prisma/client');

async function testPostgresMigration() {
  console.log('🔄 Iniciando test de migración PostgreSQL...');
  
  const prisma = new PrismaClient();
  
  try {
    // Test 1: Conexión a la base de datos
    console.log('1. Probando conexión a PostgreSQL...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa');
    
    // Test 2: Verificar que las tablas existen
    console.log('2. Verificando tablas...');
    const tableCheck = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('TelegramUser', 'FlightAlert', 'FlightDeal', 'AlertNotificationBot');
    `;
    console.log('✅ Tablas encontradas:', tableCheck);
    
    // Test 3: Operaciones CRUD básicas
    console.log('3. Probando operaciones CRUD...');
    
    // Crear usuario de prueba
    const testUser = await prisma.telegramUser.upsert({
      where: { telegramId: '999999999' },
      update: { lastActivity: new Date() },
      create: {
        telegramId: '999999999',
        username: 'test_user',
        firstName: 'Test',
        lastName: 'User',
      },
    });
    console.log('✅ Usuario de prueba creado:', testUser.id);
    
    // Crear alerta de prueba
    const testAlert = await prisma.flightAlert.create({
      data: {
        telegramUserId: testUser.id,
        chatId: BigInt('999999999'),
        fromAirport: 'SDQ',
        toAirport: 'BOG',
        maxPrice: 300,
        searchMonth: '2025-08',
        passengers: [],
        isActive: true,
      },
    });
    console.log('✅ Alerta de prueba creada:', testAlert.id);
    
    // Limpiar datos de prueba
    await prisma.flightAlert.delete({ where: { id: testAlert.id } });
    await prisma.telegramUser.delete({ where: { id: testUser.id } });
    console.log('✅ Datos de prueba limpiados');
    
    console.log('🎉 Migración PostgreSQL funcionando correctamente!');
    
  } catch (error) {
    console.error('❌ Error en el test:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testPostgresMigration();
