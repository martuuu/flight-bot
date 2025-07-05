#!/usr/bin/env node

// Simular comando de autenticación directo al bot

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function simulateBotAuth() {
  try {
    console.log('🧪 Simulando comando de autenticación al bot\n');
    
    // 1. Obtener usuario de prueba
    const user = await prisma.user.findUnique({
      where: { email: 'test-fresh@telegramlink.com' }
    });
    
    if (!user) {
      console.log('❌ Usuario de prueba no encontrado');
      return;
    }
    
    console.log('👤 Usuario encontrado:', {
      id: user.id,
      email: user.email,
      telegramLinked: user.telegramLinked
    });
    
    // 2. Generar datos de autenticación
    const authData = Buffer.from(JSON.stringify({
      userId: user.id,
      userRole: user.role,
      userEmail: user.email,
      timestamp: Date.now()
    })).toString('base64');
    
    const authParam = `auth_${authData}`;
    console.log('🔗 Parámetro de autenticación:', authParam.substring(0, 50) + '...');
    
    // 3. Simular datos del usuario de Telegram (tu ID real)
    const telegramUser = {
      id: 5536948508, // Tu ID de Telegram real
      username: 'martin_navarro_dev', // Tu username (ajusta si es diferente)
      first_name: 'Martin',
      last_name: 'Navarro'
    };
    
    console.log('👤 Usuario de Telegram (real):', telegramUser);
    
    // 4. Simular el proceso de vinculación directamente
    console.log('\n🔄 Simulando proceso de vinculación...');
    
    // Decodificar datos
    const authDataDecoded = authParam.replace('auth_', '');
    const decodedData = JSON.parse(Buffer.from(authDataDecoded, 'base64').toString('utf8'));
    
    console.log('📋 Datos decodificados:', {
      userId: decodedData.userId,
      userRole: decodedData.userRole,
      userEmail: decodedData.userEmail,
      timestamp: new Date(decodedData.timestamp).toISOString()
    });
    
    // Verificar validez del enlace
    const maxAge = 30 * 60 * 1000; // 30 minutos
    const isValid = Date.now() - decodedData.timestamp < maxAge;
    console.log('⏰ Enlace válido:', isValid);
    
    if (!isValid) {
      throw new Error('Enlace expirado');
    }
    
    // Buscar usuario de webapp
    const webappUser = await prisma.user.findUnique({
      where: { id: decodedData.userId }
    });
    
    if (!webappUser) {
      throw new Error('Usuario de webapp no encontrado');
    }
    
    console.log('✅ Usuario de webapp encontrado:', {
      id: webappUser.id,
      email: webappUser.email,
      currentTelegramId: webappUser.telegramId,
      currentTelegramLinked: webappUser.telegramLinked
    });
    
    // Verificar que el telegramId no esté ya en uso
    const existingTelegramUser = await prisma.user.findFirst({
      where: {
        telegramId: telegramUser.id.toString(),
        NOT: { id: decodedData.userId }
      }
    });
    
    if (existingTelegramUser) {
      console.log('⚠️ Telegram ID ya en uso por:', {
        userId: existingTelegramUser.id,
        email: existingTelegramUser.email
      });
      throw new Error('Telegram ID ya en uso');
    }
    
    console.log('✅ Telegram ID disponible');
    
    // Actualizar usuario con datos de Telegram
    console.log('\n💾 Actualizando usuario...');
    const updatedUser = await prisma.user.update({
      where: { id: decodedData.userId },
      data: {
        telegramId: telegramUser.id.toString(),
        telegramUsername: telegramUser.username,
        telegramLinked: true,
        telegramLinkedAt: new Date()
      }
    });
    
    console.log('✅ Usuario actualizado exitosamente:', {
      id: updatedUser.id,
      email: updatedUser.email,
      telegramId: updatedUser.telegramId,
      telegramUsername: updatedUser.telegramUsername,
      telegramLinked: updatedUser.telegramLinked,
      telegramLinkedAt: updatedUser.telegramLinkedAt
    });
    
    // Verificar el estado final
    console.log('\n📊 Verificando estado final...');
    const finalUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        telegramId: true,
        telegramLinked: true,
        telegramLinkedAt: true,
        telegramUsername: true
      }
    });
    
    console.log('📋 Estado final:', finalUser);
    
    console.log('\n🎉 Simulación completada exitosamente!');
    console.log('\n📝 Ahora puedes:');
    console.log('1. Ir a la página de test: http://localhost:3000/test-telegram');
    console.log('2. Hacer clic en "Verificar Estado" para ver la vinculación');
    console.log('3. O iniciar polling para ver si detecta el cambio');
    
  } catch (error) {
    console.error('❌ Error en simulación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simulateBotAuth();
