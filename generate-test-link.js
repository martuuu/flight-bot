#!/usr/bin/env node

// Generar enlace real para probar con el bot

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function generateRealTestLink() {
  try {
    // Obtener el usuario de prueba
    const user = await prisma.user.findUnique({
      where: { email: 'test-e2e@telegramlink.com' }
    });
    
    if (!user) {
      console.log('❌ Usuario de prueba no encontrado');
      return;
    }
    
    // Resetear su estado de vinculación
    await prisma.user.update({
      where: { id: user.id },
      data: {
        telegramLinked: false,
        telegramId: null,
        telegramUsername: null,
        telegramLinkedAt: null
      }
    });
    
    // Generar enlace de autenticación
    const authData = Buffer.from(JSON.stringify({
      userId: user.id,
      userRole: user.role,
      userEmail: user.email,
      timestamp: Date.now()
    })).toString('base64');
    
    const telegramLink = `https://t.me/ticketscannerbot_bot?start=auth_${authData}`;
    
    console.log('🔗 ENLACE PARA PROBAR CON EL BOT REAL:');
    console.log('');
    console.log(telegramLink);
    console.log('');
    console.log('📝 INSTRUCCIONES:');
    console.log('1. Copia el enlace de arriba');
    console.log('2. Ábrelo en Telegram');
    console.log('3. Revisa los logs del bot para verificar el proceso');
    console.log('');
    console.log('👤 Usuario de prueba:', {
      id: user.id,
      email: user.email,
      role: user.role
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateRealTestLink();
