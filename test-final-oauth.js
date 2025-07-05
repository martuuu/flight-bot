#!/usr/bin/env node
/**
 * Test final de Google OAuth con las nuevas credenciales
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'webapp', '.env') });

async function testFinalOAuth() {
    console.log('\n🎉 TESTING NUEVAS CREDENCIALES DE GOOGLE OAUTH\n');
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const baseUrl = process.env.NEXTAUTH_URL;
    
    console.log('📋 Nuevas credenciales configuradas:');
    console.log(`   Client ID: ${clientId}`);
    console.log(`   Client Secret: ${clientSecret ? '***configurado***' : 'MISSING'}`);
    console.log(`   Base URL: ${baseUrl}`);
    
    // Test providers endpoint
    console.log('\n🔍 Testing providers endpoint...');
    try {
        const response = await fetch(`${baseUrl}/api/auth/providers`);
        const providers = await response.json();
        
        console.log(`   Status: ${response.status}`);
        if (providers.google) {
            console.log('   ✅ Google provider detectado correctamente');
            console.log(`   📍 Signin URL: ${providers.google.signinUrl}`);
            console.log(`   📍 Callback URL: ${providers.google.callbackUrl}`);
        } else {
            console.log('   ❌ Google provider NO encontrado');
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }
    
    // Test signin flow
    console.log('\n🔗 Testing signin flow...');
    try {
        const signinResponse = await fetch(`${baseUrl}/api/auth/signin/google`, {
            redirect: 'manual'
        });
        
        console.log(`   Status: ${signinResponse.status}`);
        const location = signinResponse.headers.get('location');
        console.log(`   Location: ${location}`);
        
        if (location && location.includes('accounts.google.com')) {
            console.log('   ✅ Redirige correctamente a Google OAuth');
        } else if (location && location.includes('error=google')) {
            console.log('   ❌ Todavía hay error con las credenciales');
        } else {
            console.log('   ⚠️  Respuesta inesperada');
        }
        
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('\n🎯 SIGUIENTE PASO:');
    console.log('1. Abrir http://localhost:3000 en el navegador');
    console.log('2. Hacer clic en "Sign in with Google"');
    console.log('3. Debería funcionar correctamente ahora');
    
    console.log('\n✅ TEST COMPLETADO');
}

testFinalOAuth().catch(console.error);
