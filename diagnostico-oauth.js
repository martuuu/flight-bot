#!/usr/bin/env node
/**
 * Script para diagnosticar el problema específico con Google OAuth
 */

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'webapp', '.env') });

async function diagnosticarOAuthError() {
    console.log('\n🔍 DIAGNÓSTICO DETALLADO DE GOOGLE OAUTH ERROR\n');
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const baseUrl = process.env.NEXTAUTH_URL;
    
    console.log('📋 Configuración actual:');
    console.log(`   Client ID: ${clientId}`);
    console.log(`   Tiene Client Secret: ${clientSecret ? 'SÍ' : 'NO'}`);
    console.log(`   Base URL: ${baseUrl}`);
    
    // Test 1: Verificar que el error específico sigue ahí
    console.log('\n1️⃣ Verificando error actual...');
    try {
        const response = await fetch(`${baseUrl}/api/auth/signin/google`, {
            redirect: 'manual'
        });
        
        const location = response.headers.get('location');
        console.log(`   Status: ${response.status}`);
        console.log(`   Location: ${location}`);
        
        if (location && location.includes('error=google')) {
            console.log('   ❌ Confirma: error=google persiste');
        } else if (location && location.includes('accounts.google.com')) {
            console.log('   ✅ ¡Se solucionó! Redirige a Google');
            return;
        }
    } catch (error) {
        console.log(`   ❌ Error de red: ${error.message}`);
    }
    
    // Test 2: Posibles causas
    console.log('\n2️⃣ Posibles causas del problema:');
    
    console.log('\n   📍 Verificación de URIs de redirección:');
    console.log('   En Google Cloud Console debe estar configurado:');
    console.log('   ✓ Authorized JavaScript origins: http://localhost:3000');
    console.log('   ✓ Authorized redirect URIs: http://localhost:3000/api/auth/callback/google');
    
    console.log('\n   📍 APIs que deben estar habilitadas:');
    console.log('   ✓ Google+ API (o People API)');
    console.log('   ✓ Google OAuth2 API');
    
    console.log('\n   📍 OAuth Consent Screen:');
    console.log('   ✓ Debe estar configurado como "External"');
    console.log('   ✓ Tu email debe estar en "Test users"');
    
    // Test 3: Recomendaciones específicas
    console.log('\n3️⃣ Próximos pasos recomendados:');
    console.log('\n   🔧 Verificar en Google Cloud Console:');
    console.log('   1. Ve a APIs & Services > Credentials');
    console.log('   2. Edita tu OAuth 2.0 Client ID');
    console.log('   3. Verifica que las URIs sean EXACTAMENTE:');
    console.log('      - JavaScript origins: http://localhost:3000');
    console.log('      - Redirect URIs: http://localhost:3000/api/auth/callback/google');
    console.log('   4. Guarda los cambios');
    
    console.log('\n   📝 También verifica:');
    console.log('   • Que el proyecto esté seleccionado correctamente');
    console.log('   • Que las APIs estén habilitadas');
    console.log('   • Que el OAuth consent screen esté configurado');
    
    console.log('\n4️⃣ Si todo está correcto y sigue fallando:');
    console.log('   • Puede tomar unos minutos en propagarse los cambios');
    console.log('   • Intenta crear un nuevo OAuth Client ID');
    console.log('   • Verifica que el proyecto no tenga restricciones');
    
    console.log('\n✅ DIAGNÓSTICO COMPLETADO');
}

diagnosticarOAuthError().catch(console.error);
