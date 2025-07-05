#!/usr/bin/env node

// Script para vincular la cuenta de Google OAuth con el usuario existente

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function linkGoogleAccount() {
  try {
    console.log('🔗 Vinculando cuenta de Google OAuth...\n');
    
    const email = 'martin.navarro.dev@gmail.com';
    const googleId = '112835873324935448203'; // Del log de OAuth
    
    // Buscar el usuario existente
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.error('❌ Usuario no encontrado:', email);
      return;
    }
    
    console.log('✅ Usuario encontrado:', {
      id: user.id,
      email: user.email,
      role: user.role
    });
    
    // Verificar si ya existe la vinculación
    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: user.id,
        provider: 'google'
      }
    });
    
    if (existingAccount) {
      console.log('⚠️ La cuenta de Google ya está vinculada');
      return;
    }
    
    // Crear la vinculación OAuth
    const account = await prisma.account.create({
      data: {
        userId: user.id,
        type: 'oauth',
        provider: 'google',
        providerAccountId: googleId,
        // Datos adicionales de OAuth (opcionales)
        scope: 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        token_type: 'Bearer',
      }
    });
    
    console.log('✅ Cuenta de Google vinculada exitosamente:', {
      accountId: account.id,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      userId: account.userId
    });
    
    console.log('\n🎉 ¡Listo! Ahora puedes hacer login con Google.');
    console.log('Ve a http://localhost:3000/login e intenta de nuevo.');
    
  } catch (error) {
    console.error('❌ Error vinculando cuenta de Google:', error);
  } finally {
    await prisma.$disconnect();
  }
}

linkGoogleAccount();
