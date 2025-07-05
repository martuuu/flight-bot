#!/usr/bin/env node

// Script para eliminar el usuario duplicado de Telegram

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupDuplicateUser() {
  try {
    console.log('🧹 Limpiando usuario duplicado de Telegram...\n');
    
    // Buscar el usuario de Telegram que se creó
    const telegramUser = await prisma.user.findUnique({
      where: { email: 'telegram_5536948508@temp.com' }
    });
    
    if (!telegramUser) {
      console.log('❌ Usuario de Telegram no encontrado');
      return;
    }
    
    console.log('🔍 Usuario encontrado:', {
      id: telegramUser.id,
      email: telegramUser.email,
      telegramId: telegramUser.telegramId,
      role: telegramUser.role
    });
    
    // Eliminar el usuario duplicado
    await prisma.user.delete({
      where: { id: telegramUser.id }
    });
    
    console.log('✅ Usuario duplicado eliminado exitosamente');
    
    // Verificar estado final
    const remainingUsers = await prisma.user.count();
    console.log(`📊 Usuarios restantes: ${remainingUsers}`);
    
  } catch (error) {
    console.error('❌ Error eliminando usuario duplicado:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicateUser();
