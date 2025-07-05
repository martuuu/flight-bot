#!/usr/bin/env node

// Test de configuración específica de Google
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'webapp', '.env') });

// Importar la lógica de validación de env
process.chdir(path.join(__dirname, 'webapp'));

async function testGoogleConfig() {
  console.log('🔄 Verificando configuración específica de Google...\n');
  
  try {
    // Test variables directas
    console.log('1. Variables de entorno directas:');
    console.log(`   GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? 'PRESENTE' : 'FALTANTE'}`);
    console.log(`   GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? 'PRESENTE' : 'FALTANTE'}`);
    
    // Test importación de env-validation
    console.log('\n2. Verificando validación de env...');
    try {
      const { env, isConfigured } = require('./lib/env-validation');
      console.log(`   env.GOOGLE_CLIENT_ID: ${env.GOOGLE_CLIENT_ID ? 'PRESENTE' : 'FALTANTE'}`);
      console.log(`   env.GOOGLE_CLIENT_SECRET: ${env.GOOGLE_CLIENT_SECRET ? 'PRESENTE' : 'FALTANTE'}`);
      console.log(`   isConfigured.google: ${isConfigured.google}`);
      
      if (!isConfigured.google) {
        console.log('   ❌ Google NO está configurado según env-validation');
        console.log('   🔍 Verificando condición:');
        console.log(`      !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)`);
        console.log(`      !!(${!!env.GOOGLE_CLIENT_ID} && ${!!env.GOOGLE_CLIENT_SECRET})`);
      } else {
        console.log('   ✅ Google está correctamente configurado');
      }
    } catch (envError) {
      console.log('   ❌ Error importando env-validation:', envError.message);
    }
    
    // Test configuración auth
    console.log('\n3. Verificando configuración auth...');
    try {
      const { authOptions } = require('./lib/auth');
      const googleProvider = authOptions.providers.find(p => p.id === 'google');
      
      if (googleProvider) {
        console.log('   ✅ Google provider encontrado en authOptions');
        console.log(`   📋 Provider config: ${JSON.stringify(googleProvider.options || {}, null, 2).substring(0, 200)}...`);
      } else {
        console.log('   ❌ Google provider NO encontrado en authOptions');
        console.log(`   📋 Providers disponibles: ${authOptions.providers.map(p => p.id || p.name)}`);
      }
    } catch (authError) {
      console.log('   ❌ Error importando auth config:', authError.message);
    }
    
    // Test NextAuth providers endpoint
    console.log('\n4. Verificando endpoint de providers en tiempo real...');
    const fetch = require('node-fetch').default;
    try {
      const response = await fetch('http://localhost:3000/api/auth/providers');
      const providers = await response.json();
      
      if (providers.google) {
        console.log('   ✅ Google provider activo en NextAuth');
      } else {
        console.log('   ❌ Google provider NO está activo en NextAuth');
        console.log('   📋 Providers activos:', Object.keys(providers));
      }
    } catch (fetchError) {
      console.log('   ❌ Error verificando providers endpoint:', fetchError.message);
    }
    
  } catch (error) {
    console.error('❌ Error en test:', error);
  }
}

testGoogleConfig();
