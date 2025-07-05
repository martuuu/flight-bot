#!/usr/bin/env node

// Script para probar el flujo completo de vinculación

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testTelegramLinking() {
  try {
    console.log('🧪 Iniciando test de vinculación de Telegram\n');
    
    // 1. Crear usuario de prueba
    console.log('👤 Paso 1: Creando usuario de prueba...');
    const testUser = await prisma.user.upsert({
      where: { email: 'test@telegramlink.com' },
      update: {
        telegramLinked: false,
        telegramId: null,
        telegramUsername: null,
        telegramLinkedAt: null
      },
      create: {
        email: 'test@telegramlink.com',
        name: 'Test User',
        role: 'BASIC',
        telegramLinked: false
      }
    });
    
    console.log('✅ Usuario creado/actualizado:', {
      id: testUser.id,
      email: testUser.email,
      telegramLinked: testUser.telegramLinked
    });
    
    // 2. Simular generación de enlace
    console.log('\n🔗 Paso 2: Generando enlace de vinculación...');
    const authData = Buffer.from(JSON.stringify({
      userId: testUser.id,
      userRole: testUser.role,
      userEmail: testUser.email,
      timestamp: Date.now()
    })).toString('base64');
    
    const authLink = `https://t.me/ticketscannerbot_bot?start=auth_${authData}`;
    console.log('📎 Enlace generado:', authLink);
    
    // 3. Simular datos que recibiría el bot
    console.log('\n🤖 Paso 3: Simulando datos que recibiría el bot...');
    const telegramUserId = 987654321;
    const telegramUsername = 'test_user_telegram';
    
    console.log('📨 Datos de Telegram simulados:', {
      telegramUserId,
      telegramUsername,
      chatId: 123456789
    });
    
    // 4. Simular proceso de vinculación (como lo haría el bot)
    console.log('\n🔄 Paso 4: Simulando vinculación...');
    
    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: testUser.id }
    });
    
    if (!existingUser) {
      throw new Error('Usuario no encontrado');
    }
    
    // Verificar que el telegramId no esté ya en uso
    const existingTelegramUser = await prisma.user.findFirst({
      where: {
        telegramId: telegramUserId.toString(),
        NOT: { id: testUser.id }
      }
    });
    
    if (existingTelegramUser) {
      throw new Error('Telegram ID ya en uso por otro usuario');
    }
    
    // Actualizar usuario con datos de Telegram
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: {
        telegramId: telegramUserId.toString(),
        telegramUsername: telegramUsername,
        telegramLinked: true,
        telegramLinkedAt: new Date()
      }
    });
    
    console.log('✅ Usuario vinculado exitosamente:', {
      id: updatedUser.id,
      email: updatedUser.email,
      telegramId: updatedUser.telegramId,
      telegramUsername: updatedUser.telegramUsername,
      telegramLinked: updatedUser.telegramLinked,
      telegramLinkedAt: updatedUser.telegramLinkedAt
    });
    
    // 5. Verificar que el endpoint de status funciona
    console.log('\n📊 Paso 5: Verificando consulta de estado...');
    const statusUser = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        telegramId: true,
        telegramLinked: true,
        telegramLinkedAt: true,
        telegramUsername: true
      }
    });
    
    console.log('📋 Estado actual del usuario:', statusUser);
    
    console.log('\n🎉 Test completado exitosamente!\n');
    
    return {
      success: true,
      user: statusUser
    };
    
  } catch (error) {
    console.error('❌ Error en el test:', error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar test
testTelegramLinking().then(result => {
  if (result.success) {
    console.log('✅ Test exitoso');
    process.exit(0);
  } else {
    console.log('❌ Test fallido');
    process.exit(1);
  }
});
