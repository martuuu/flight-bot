#!/usr/bin/env node

/**
 * Test simplificado de Google OAuth - Genera URL para prueba manual
 */

const http = require('http');

// Configuración
const GOOGLE_CLIENT_ID = '1079216797376-j49rd41nialvufovcpl202mtuhcojtq0.apps.googleusercontent.com';
const REDIRECT_URI = 'http://localhost:3000/api/auth/callback/google';

console.log('🔍 PRUEBA MANUAL DE GOOGLE OAUTH\n');

// 1. URL de autorización de Google
const authParams = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
});

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`;

console.log('📋 INSTRUCCIONES PARA PRUEBA MANUAL:');
console.log('\n1. Asegúrate de que la webapp esté corriendo en http://localhost:3000');
console.log('2. Abre la siguiente URL en tu navegador:');
console.log(`\n   ${authUrl}\n`);
console.log('3. Autoriza la aplicación con tu cuenta de Google');
console.log('4. Observa el resultado:\n');
console.log('   ✅ ÉXITO: Deberías ver la página de la webapp con tu usuario logueado');
console.log('   ❌ ERROR: Si ves "error=google", hay un problema de configuración\n');

// Verificar que NextAuth esté funcionando
console.log('🔧 Verificando NextAuth...');

const checkEndpoint = (path, description) => {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            console.log(`   ${description}: ✅ ${res.statusCode}`);
            resolve(true);
        });

        req.on('error', (error) => {
            console.log(`   ${description}: ❌ ${error.message}`);
            resolve(false);
        });

        req.setTimeout(3000, () => {
            console.log(`   ${description}: ❌ TIMEOUT`);
            req.destroy();
            resolve(false);
        });

        req.end();
    });
};

async function runCheck() {
    await checkEndpoint('/api/auth/providers', 'Providers endpoint');
    await checkEndpoint('/api/auth/signin/google', 'Google signin endpoint');
    
    console.log('\n🎯 SI EL ERROR PERSISTE, VERIFICA EN GOOGLE CLOUD CONSOLE:');
    console.log('   1. OAuth Consent Screen configurado como "External"');
    console.log('   2. Tu email en la lista de "Test users"');
    console.log('   3. APIs habilitadas: Google+ API o People API');
    console.log('   4. URIs de redirección exactamente como:');
    console.log(`      ${REDIRECT_URI}`);
    console.log('   5. Esperar 10-15 minutos para propagación de cambios');
    
    console.log('\n🔄 También puedes probar crear un nuevo OAuth Client ID desde cero');
}

runCheck();
