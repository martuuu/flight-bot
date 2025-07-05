#!/usr/bin/env node

// Script para verificar el estado actual de la base de datos

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabaseStatus() {
  try {
    console.log('🔍 Verificando estado de la base de datos...\n');
    
    // Contar usuarios
    const userCount = await prisma.user.count();
    console.log(`📊 Total de usuarios: ${userCount}`);
    
    // Listar todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        telegramId: true,
        telegramLinked: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });
    
    console.log('\n👥 Usuarios en la base de datos:');
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. Usuario:`, {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        telegramId: user.telegramId || 'No vinculado',
        telegramLinked: user.telegramLinked,
        createdAt: user.createdAt.toISOString()
      });
    });
    
    // Contar cuentas OAuth
    const accountCount = await prisma.account.count();
    console.log(`\n🔗 Total de cuentas OAuth: ${accountCount}`);
    
    if (accountCount > 0) {
      const accounts = await prisma.account.findMany({
        select: {
          id: true,
          userId: true,
          provider: true,
          providerAccountId: true
        }
      });
      
      console.log('\n🔑 Cuentas OAuth:');
      accounts.forEach((account, index) => {
        console.log(`${index + 1}.`, {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          userId: account.userId
        });
      });
    }
    
    console.log('\n✅ Verificación completada.');
    
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseStatus();
