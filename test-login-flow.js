#!/usr/bin/env node

// Test específico para OAuth y login
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'webapp', '.env') });

async function testLoginFlow() {
  console.log('🔄 Probando flujo de login específicamente...\n');
  
  try {
    // Test 1: Verificar variables críticas
    console.log('1. Variables críticas:');
    console.log(`   ✅ NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`);
    console.log(`   ✅ GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID?.substring(0, 20)}...`);
    console.log(`   ✅ GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? 'CONFIGURADO' : 'FALTANTE'}`);
    console.log(`   ✅ NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? 'CONFIGURADO' : 'FALTANTE'}`);
    
    // Test 2: Verificar conexión webapp
    console.log('\n2. Probando conexión webapp...');
    const fetch = require('node-fetch').default;
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/providers');
      if (response.ok) {
        const providers = await response.json();
        console.log('   ✅ Providers disponibles:', Object.keys(providers));
        
        if (providers.google) {
          console.log('   ✅ Google OAuth configurado');
          console.log(`   📍 URL de signin: ${providers.google.signinUrl}`);
          console.log(`   📍 URL de callback: ${providers.google.callbackUrl}`);
        } else {
          console.log('   ❌ Google OAuth NO encontrado');
        }
      } else {
        console.log('   ❌ Error accediendo a providers:', response.status);
      }
    } catch (fetchError) {
      console.log('   ❌ Error de conexión webapp:', fetchError.message);
      console.log('   💡 Asegurar que la webapp esté corriendo: cd webapp && npm run dev');
    }
    
    // Test 3: Verificar base de datos
    console.log('\n3. Probando base de datos...');
    const { PrismaClient } = require('./webapp/node_modules/@prisma/client');
    const prisma = new PrismaClient();
    
    try {
      await prisma.$connect();
      console.log('   ✅ Base de datos conectada');
      
      // Verificar tablas necesarias para auth
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'accounts', 'sessions');
      `;
      console.log('   ✅ Tablas de auth encontradas:', tables.map(t => t.table_name));
      
    } catch (dbError) {
      console.log('   ❌ Error de base de datos:', dbError.message);
    } finally {
      await prisma.$disconnect();
    }
    
    // Test 4: Instrucciones de debugging
    console.log('\n4. 🔍 Para debugging adicional:');
    console.log('   📝 Verificar logs de la webapp en la consola');
    console.log('   📝 Verificar que el puerto 3000 esté libre');
    console.log('   📝 Probar login manual en: http://localhost:3000/auth/signin');
    console.log('   📝 Verificar configuración en Google Console:');
    console.log('      - Client ID correcto');
    console.log('      - Client Secret correcto');
    console.log('      - URL de redirección: http://localhost:3000/api/auth/callback/google');
    
    console.log('\n🚀 Si todo parece correcto, el problema puede ser:');
    console.log('   1. Configuración en Google Console');
    console.log('   2. Cookies/localStorage del navegador');
    console.log('   3. Firewall/proxy bloqueando OAuth');
    
  } catch (error) {
    console.error('❌ Error en test:', error);
  }
}

testLoginFlow();
