#!/usr/bin/env node

// Test de flujo completo de OAuth
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'webapp', '.env') });

async function testOAuthFlow() {
  console.log('🔄 Simulando flujo completo de OAuth...\n');
  
  try {
    const fetch = require('node-fetch').default;
    
    // Test 1: Verificar página de signin
    console.log('1. Probando página de signin...');
    const signinResponse = await fetch('http://localhost:3000/auth/signin');
    if (signinResponse.ok) {
      console.log('   ✅ Página de signin accesible');
    } else {
      console.log('   ❌ Error accediendo a signin:', signinResponse.status);
      return;
    }
    
    // Test 2: Probar inicio de OAuth
    console.log('\n2. Probando inicio de flujo OAuth...');
    const oauthResponse = await fetch('http://localhost:3000/api/auth/signin/google', {
      redirect: 'manual'
    });
    
    if (oauthResponse.status === 302) {
      const location = oauthResponse.headers.get('location');
      console.log('   ✅ Redirección OAuth iniciada');
      console.log(`   📍 Redirigiendo a: ${location?.substring(0, 100)}...`);
      
      if (location?.includes('accounts.google.com')) {
        console.log('   ✅ URL de Google correcta');
      } else {
        console.log('   ❌ URL de redirección inesperada');
      }
    } else {
      console.log('   ❌ Error iniciando OAuth:', oauthResponse.status);
      const text = await oauthResponse.text();
      console.log('   📝 Respuesta:', text.substring(0, 200));
    }
    
    // Test 3: Verificar configuración en headers
    console.log('\n3. Verificando headers de CSRF...');
    const csrfResponse = await fetch('http://localhost:3000/api/auth/csrf');
    if (csrfResponse.ok) {
      const csrf = await csrfResponse.json();
      console.log('   ✅ CSRF token generado:', csrf.csrfToken?.substring(0, 20) + '...');
    } else {
      console.log('   ❌ Error obteniendo CSRF token');
    }
    
    // Test 4: Verificar session
    console.log('\n4. Verificando session endpoint...');
    const sessionResponse = await fetch('http://localhost:3000/api/auth/session');
    if (sessionResponse.ok) {
      const session = await sessionResponse.json();
      console.log('   ✅ Session endpoint funciona');
      console.log('   📝 Session actual:', session.user ? 'Usuario logueado' : 'Sin usuario');
    } else {
      console.log('   ❌ Error verificando session');
    }
    
    console.log('\n🔍 DIAGNÓSTICO:');
    console.log('Si el flujo OAuth falla, verificar:');
    console.log('1. 🌐 Configuración en Google Console:');
    console.log('   - https://console.cloud.google.com/');
    console.log('   - APIs & Services > Credentials');
    console.log(`   - Verificar Client ID: ${process.env.GOOGLE_CLIENT_ID}`);
    console.log('   - URL autorizada: http://localhost:3000/api/auth/callback/google');
    console.log('   - Dominio autorizado: localhost');
    
    console.log('\n2. 🛠️ Comandos para debugging:');
    console.log('   - Limpiar cache del navegador');
    console.log('   - Probar en ventana incógnita');
    console.log('   - Verificar consola del navegador');
    console.log('   - Verificar Network tab en DevTools');
    
    console.log('\n3. 🔑 URLs importantes:');
    console.log('   - Login page: http://localhost:3000/auth/signin');
    console.log('   - Direct OAuth: http://localhost:3000/api/auth/signin/google');
    console.log('   - Session info: http://localhost:3000/api/auth/session');
    
  } catch (error) {
    console.error('❌ Error en test OAuth:', error);
  }
}

testOAuthFlow();
