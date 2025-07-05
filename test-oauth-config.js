#!/usr/bin/env node

// Test de configuración OAuth y base de datos
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'webapp', '.env') });

async function testOAuthConfig() {
  console.log('🔄 Verificando configuración OAuth y base de datos...\n');
  
  try {
    // Cambiar al directorio de webapp
    process.chdir(path.join(__dirname, 'webapp'));
    
    // Verificar variables de entorno
    console.log('1. Verificando variables de entorno...');
    const requiredVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET', 
      'NEXTAUTH_URL',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET'
    ];
    
    const missing = [];
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        missing.push(varName);
      }
    });
    
    if (missing.length > 0) {
      console.log('❌ Variables faltantes:', missing);
      console.log('📝 Verificar archivo .env');
      return;
    }
    console.log('✅ Variables de entorno OK');
    
    // Test de conexión a base de datos
    console.log('\n2. Probando conexión a base de datos...');
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    try {
      await prisma.$connect();
      console.log('✅ Conexión a PostgreSQL exitosa');
      
      // Verificar tablas importantes
      const userCount = await prisma.user.count();
      const accountCount = await prisma.account.count();
      console.log(`✅ Usuarios en DB: ${userCount}`);
      console.log(`✅ Cuentas OAuth en DB: ${accountCount}`);
      
    } catch (dbError) {
      console.log('❌ Error de base de datos:', dbError.message);
    } finally {
      await prisma.$disconnect();
    }
    
    // Verificar configuración OAuth
    console.log('\n3. Verificando configuración OAuth...');
    console.log('✅ GOOGLE_CLIENT_ID configurado');
    console.log('✅ GOOGLE_CLIENT_SECRET configurado');
    console.log(`✅ NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`);
    
    console.log('\n4. Configuración de redirección OAuth:');
    console.log(`📍 URL de callback: ${process.env.NEXTAUTH_URL}/api/auth/callback/google`);
    console.log('📋 Verificar que esta URL esté en Google Console');
    
    console.log('\n🎉 Configuración OAuth parece correcta!');
    console.log('\n🚀 Para probar el login:');
    console.log('   1. cd webapp');
    console.log('   2. npm run dev');
    console.log('   3. Ir a http://localhost:3000');
    console.log('   4. Probar login con Google');
    
  } catch (error) {
    console.error('❌ Error en test:', error);
  }
}

testOAuthConfig();
