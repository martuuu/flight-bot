#!/usr/bin/env node
/**
 * Test específico de las variables de entorno y NextAuth
 */

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'webapp', '.env') });

async function debugNextAuthConfig() {
    console.log('\n🔍 DEBUG DE NEXTAUTH CONFIGURATION\n');
    
    // Test 1: Variables de entorno
    console.log('1️⃣ Variables de entorno:');
    const vars = {
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '***present***' : 'MISSING',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_DEBUG: process.env.NEXTAUTH_DEBUG,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '***present***' : 'MISSING',
    };
    
    Object.entries(vars).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
    });
    
    // Test 2: Verificar que Google esté configurado según la lógica
    console.log('\n2️⃣ Verificación de configuración:');
    const isGoogleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
    console.log(`   Google configured: ${isGoogleConfigured}`);
    console.log(`   Client ID length: ${process.env.GOOGLE_CLIENT_ID?.length || 0}`);
    console.log(`   Client Secret length: ${process.env.GOOGLE_CLIENT_SECRET?.length || 0}`);
    
    // Test 3: Simular validación de variables como lo hace env-validation.ts
    console.log('\n3️⃣ Simulando validación de entorno:');
    try {
        if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.length < 32) {
            console.log('   ❌ NEXTAUTH_SECRET: invalid or too short');
        } else {
            console.log('   ✅ NEXTAUTH_SECRET: valid');
        }
        
        if (!process.env.NEXTAUTH_URL) {
            console.log('   ❌ NEXTAUTH_URL: missing');
        } else {
            console.log('   ✅ NEXTAUTH_URL: present');
        }
        
        if (!process.env.GOOGLE_CLIENT_ID) {
            console.log('   ❌ GOOGLE_CLIENT_ID: missing');
        } else {
            console.log('   ✅ GOOGLE_CLIENT_ID: present');
        }
        
        if (!process.env.GOOGLE_CLIENT_SECRET) {
            console.log('   ❌ GOOGLE_CLIENT_SECRET: missing');
        } else {
            console.log('   ✅ GOOGLE_CLIENT_SECRET: present');
        }
        
    } catch (error) {
        console.log(`   ❌ Error en validación: ${error.message}`);
    }
    
    // Test 4: Verificar formato de Client ID
    console.log('\n4️⃣ Verificación de formato:');
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId) {
        const isValidFormat = clientId.includes('.apps.googleusercontent.com');
        const projectNumber = clientId.split('-')[0];
        console.log(`   Client ID format: ${isValidFormat ? 'VALID' : 'INVALID'}`);
        console.log(`   Project number: ${projectNumber}`);
        console.log(`   Full Client ID: ${clientId}`);
        
        if (clientId.includes('example') || clientId.includes('your-client-id')) {
            console.log('   ❌ PLACEHOLDER CLIENT ID DETECTED!');
        }
    }
    
    // Test 5: Probar la URL de OAuth directamente
    console.log('\n5️⃣ Construyendo URL de OAuth:');
    const baseUrl = process.env.NEXTAUTH_URL;
    const redirectUri = `${baseUrl}/api/auth/callback/google`;
    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId || '')}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent('openid email profile')}&` +
        `state=test`;
    
    console.log(`   OAuth URL: ${googleOAuthUrl}`);
    
    // Test 6: Verificar si podemos hacer request a Google
    console.log('\n6️⃣ Probando validez de credenciales con Google...');
    try {
        const testResponse = await fetch(googleOAuthUrl.substring(0, 200), { method: 'HEAD' });
        console.log(`   Google responds: ${testResponse.status}`);
    } catch (error) {
        console.log(`   Error contacting Google: ${error.message}`);
    }
    
    console.log('\n✅ DEBUG COMPLETADO');
}

debugNextAuthConfig().catch(console.error);
