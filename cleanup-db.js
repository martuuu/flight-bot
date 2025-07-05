#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupDatabase() {
  try {
    console.log('🧹 Iniciando limpieza de base de datos...');
    
    // 1. Eliminar usuario temporal
    console.log('🗑️ Eliminando usuario temporal...');
    await prisma.user.deleteMany({
      where: {
        email: 'telegram_5536948508@temp.com'
      }
    });
    
    // 2. Limpiar vinculaciones de usuarios de prueba
    console.log('🧽 Limpiando vinculaciones de usuarios de prueba...');
    await prisma.user.updateMany({
      where: {
        OR: [
          { email: { contains: 'test' } },
          { email: { contains: 'telegramlink' } }
        ]
      },
      data: {
        telegramId: null,
        telegramLinked: false,
        telegramLinkedAt: null,
        telegramUsername: null
      }
    });
    
    // 3. Verificar estado final
    console.log('📊 Verificando estado final...');
    const telegramUsers = await prisma.user.findMany({
      where: {
        telegramId: { not: null }
      },
      select: {
        id: true,
        email: true,
        telegramId: true,
        telegramLinked: true
      }
    });
    
    console.log(`✅ Usuarios con Telegram restantes: ${telegramUsers.length}`);
    telegramUsers.forEach(user => {
      console.log(`  - ${user.email} (ID: ${user.telegramId})`);
    });
    
    // 4. Verificar usuario de prueba
    const testUser = await prisma.user.findUnique({
      where: { email: 'test-e2e@telegramlink.com' },
      select: {
        id: true,
        email: true,
        telegramId: true,
        telegramLinked: true
      }
    });
    
    if (testUser) {
      console.log('👤 Usuario de prueba:', testUser);
    } else {
      console.log('❌ Usuario de prueba no encontrado');
    }
    
    console.log('\n🎉 Limpieza completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en limpieza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDatabase();
