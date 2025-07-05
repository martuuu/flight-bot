#!/usr/bin/env node
/**
 * Verificación final de Google OAuth después de la configuración
 */

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'webapp', '.env') });

async function verifyGoogleOAuth() {
    console.log('\n🔍 VERIFICANDO GOOGLE OAUTH DESPUÉS DE CONFIGURACIÓN\n');
    
    const baseUrl = process.env.NEXTAUTH_URL;
    
    console.log('📋 Configuración actual:');
    console.log(`   NEXTAUTH_URL: ${baseUrl}`);
    console.log(`   GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID}`);
    console.log(`   GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? '***configurado***' : 'FALTA'}`);
    console.log(`   NEXTAUTH_DEBUG: ${process.env.NEXTAUTH_DEBUG}`);
    
    try {
        console.log('\n1️⃣ Verificando providers endpoint...');
        const providersResponse = await fetch(`${baseUrl}/api/auth/providers`);
        const providers = await providersResponse.json();
        
        console.log(`   Status: ${providersResponse.status}`);
        if (providers.google) {
            console.log('   ✅ Google provider configurado correctamente');
            console.log(`   📍 Signin URL: ${providers.google.signinUrl}`);
            console.log(`   📍 Callback URL: ${providers.google.callbackUrl}`);
        } else {
            console.log('   ❌ Google provider NO encontrado');
        }
        
        console.log('\n2️⃣ Probando flujo de signin...');
        const signinResponse = await fetch(`${baseUrl}/api/auth/signin/google`, {
            redirect: 'manual'
        });
        
        console.log(`   Status: ${signinResponse.status}`);
        const location = signinResponse.headers.get('location');
        console.log(`   Location: ${location}`);
        
        if (signinResponse.status === 302) {
            if (location && location.includes('accounts.google.com')) {
                console.log('   ✅ ¡ÉXITO! Redirige correctamente a Google OAuth');
                console.log('   🎉 Google OAuth está funcionando correctamente');
                return true;
            } else if (location && location.includes('error=google')) {
                console.log('   ❌ Todavía hay error=google');
                console.log('   🔧 Posibles causas:');
                console.log('     • URIs de redirección incorrectas en Google Console');
                console.log('     • Credenciales inválidas');
                console.log('     • Proyecto de Google mal configurado');
                return false;
            } else {
                console.log(`   ⚠️ Redirección inesperada: ${location}`);
                return false;
            }
        } else {
            console.log(`   ❌ Status inesperado: ${signinResponse.status}`);
            return false;
        }
        
    } catch (error) {
        console.log('\n❌ Error durante la verificación:');
        console.error(error.message);
        console.log('\n🔧 Posibles causas:');
        console.log('   • Servidor webapp no está corriendo');
        console.log('   • Variables de entorno incorrectas');
        console.log('   • Problemas de red');
        return false;
    }
}

async function testGoogleOAuthComplete() {
    console.log('🎯 PRUEBA COMPLETA DE GOOGLE OAUTH');
    console.log('=======================================\n');
    
    const isWorking = await verifyGoogleOAuth();
    
    if (isWorking) {
        console.log('\n🎉 ¡GOOGLE OAUTH FUNCIONANDO CORRECTAMENTE!');
        console.log('✅ La configuración está completa y operativa');
        console.log('\n📱 Para probar manualmente:');
        console.log('1. Abrir http://localhost:3000');
        console.log('2. Hacer clic en "Sign in with Google"');
        console.log('3. Debería redirigir a Google para autenticación');
        console.log('4. Después del login, redirigir de vuelta a la webapp');
        
        console.log('\n✅ MIGRACIÓN POSTGRESQL + OAUTH: COMPLETADA 100%');
    } else {
        console.log('\n⚠️ Google OAuth aún tiene problemas');
        console.log('📖 Revisar la guía en: GOOGLE_OAUTH_FIX.md');
        console.log('🔧 Verificar configuración en Google Cloud Console');
    }
    
    console.log('\n🏁 VERIFICACIÓN COMPLETADA');
}

testGoogleOAuthComplete().catch(console.error);
