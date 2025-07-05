#!/usr/bin/env node

/**
 * Test directo del Google OAuth - Verifica la URL de autorización
 * y simula el flujo completo
 */

const https = require('https');
const url = require('url');

// Configuración de Google OAuth
const GOOGLE_CLIENT_ID = '1079216797376-j49rd41nialvufovcpl202mtuhcojtq0.apps.googleusercontent.com';
const REDIRECT_URI = 'http://localhost:3000/api/auth/callback/google';
const SCOPES = 'openid email profile';

console.log('🔍 DIAGNÓSTICO GOOGLE OAUTH - DIRECTO\n');

// 1. Construir URL de autorización de Google
const authParams = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES,
    access_type: 'offline',
    prompt: 'consent'
});

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`;

console.log('1. URL de Autorización Google:');
console.log(`   ${authUrl}\n`);

// 2. Verificar que el Client ID sea válido haciendo una petición a Google
console.log('2. Verificando Client ID con Google...');

const verifyClientId = () => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'accounts.google.com',
            path: '/.well-known/openid_configuration',
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const config = JSON.parse(data);
                    console.log(`   ✅ Endpoint de autorización: ${config.authorization_endpoint}`);
                    console.log(`   ✅ Endpoint de token: ${config.token_endpoint}`);
                    resolve(config);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
};

// 3. Verificar el endpoint de NextAuth
console.log('\n3. Verificando endpoints de NextAuth...');

const checkNextAuthEndpoint = (endpoint) => {
    return new Promise((resolve, reject) => {
        const http = require('http');
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: endpoint,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            console.log(`   ${endpoint}: ${res.statusCode} ${res.statusMessage}`);
            resolve(res.statusCode);
        });

        req.on('error', (error) => {
            console.log(`   ${endpoint}: ERROR - ${error.message}`);
            resolve(null);
        });

        req.setTimeout(5000, () => {
            console.log(`   ${endpoint}: TIMEOUT`);
            req.destroy();
            resolve(null);
        });

        req.end();
    });
};

async function runDiagnostic() {
    try {
        // Verificar Google configuration
        await verifyClientId();
        
        // Verificar NextAuth endpoints
        await checkNextAuthEndpoint('/api/auth/providers');
        await checkNextAuthEndpoint('/api/auth/signin/google');
        
        console.log('\n4. Configuración verificada:');
        console.log(`   ✅ Client ID: ${GOOGLE_CLIENT_ID.substring(0, 20)}...`);
        console.log(`   ✅ Redirect URI: ${REDIRECT_URI}`);
        console.log(`   ✅ Scopes: ${SCOPES}`);
        
        console.log('\n📋 PASOS PARA PROBAR MANUALMENTE:');
        console.log('1. Abre la siguiente URL en tu navegador:');
        console.log(`   ${authUrl}`);
        console.log('2. Autoriza la aplicación con tu cuenta de Google');
        console.log('3. Deberías ser redirigido de vuelta a la webapp');
        console.log('4. Si ves "error=google", verifica la configuración en Google Cloud Console');
        
        console.log('\n🔧 Si el error persiste, verifica:');
        console.log('- Que el OAuth Consent Screen esté configurado como "External"');
        console.log('- Que tu email esté en la lista de "Test users"');
        console.log('- Que las APIs de Google+ o People API estén habilitadas');
        console.log('- Que los URIs de redirección coincidan exactamente');

    } catch (error) {
        console.error('❌ Error en diagnóstico:', error.message);
    }
}

runDiagnostic();
