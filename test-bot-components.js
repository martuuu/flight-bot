#!/usr/bin/env node

// Test rápido de inicio del bot sin ejecutar completamente
const { PrismaDatabaseManager } = require('./dist/database/prisma-adapter');
const { UserModelPrisma } = require('./dist/models/UserModelPrisma');

async function testBotComponents() {
  console.log('🔄 Probando componentes del bot...');
  
  try {
    // Test 1: Database Manager
    console.log('1. Probando Database Manager...');
    const dbManager = PrismaDatabaseManager.getInstance();
    console.log('✅ Database Manager inicializado');
    
    // Test 2: UserModelPrisma
    console.log('2. Probando UserModelPrisma...');
    const stats = await UserModelPrisma.getUserStats();
    console.log('✅ UserModelPrisma funcionando. Estadísticas:', stats);
    
    // Test 3: Conexión con Prisma
    console.log('3. Probando conexión Prisma...');
    const prisma = dbManager.getClient();
    await prisma.$connect();
    console.log('✅ Conexión Prisma exitosa');
    
    console.log('🎉 Todos los componentes del bot funcionando correctamente!');
    
  } catch (error) {
    console.error('❌ Error en test de componentes:', error);
    process.exit(1);
  }
}

testBotComponents();
