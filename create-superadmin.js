#!/usr/bin/env node

// Script para crear usuario superadmin

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    console.log('🔧 Creando usuario superadmin...\n');
    
    // Cambiar este email por el tuyo real
    const email = 'martin.navarro.dev@gmail.com'; // Cambia esto por tu email real
    const name = 'Martin Navarro';
    
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: 'SUPERADMIN',
        subscriptionStatus: 'ACTIVE',
        subscriptionPlan: 'PREMIUM',
        telegramLinked: false,
        emailVerified: new Date() // Marcar como verificado
      }
    });
    
    console.log('✅ Usuario superadmin creado:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      subscriptionPlan: user.subscriptionPlan,
      telegramLinked: user.telegramLinked
    });
    
    console.log('\n📋 Información para vincular:');
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    
    console.log('\n🔗 Ahora puedes:');
    console.log('1. Ir a http://localhost:3000/login');
    console.log('2. Hacer login con tu email');
    console.log('3. Ir a la página de test y vincular Telegram');
    
  } catch (error) {
    console.error('❌ Error creando superadmin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
