#!/usr/bin/env node
/**
 * Test específico para identificar el problema exacto de Google OAuth
 */

async function diagnoseGoogleOAuthError() {
    console.log('\n🔍 DIAGNÓSTICO ESPECÍFICO DE GOOGLE OAUTH ERROR\n');
    
    const clientId = '1079216797376-j49rd41nialvufovcpl202mtuhcojtq0.apps.googleusercontent.com';
    const redirectUri = 'http://localhost:3000/api/auth/callback/google';
    
    console.log('📋 Información del cliente:');
    console.log(`   Client ID: ${clientId}`);
    console.log(`   Project Number: ${clientId.split('-')[0]}`);
    console.log(`   Redirect URI: ${redirectUri}`);
    
    console.log('\n🧪 Tests diagnósticos:');
    
    // Test 1: Verificar formato del Client ID
    console.log('\n1️⃣ Formato del Client ID:');
    if (clientId.includes('.apps.googleusercontent.com')) {
        console.log('   ✅ Formato válido');
    } else {
        console.log('   ❌ Formato inválido');
    }
    
    // Test 2: Construir URL de OAuth step by step
    console.log('\n2️⃣ Construcción de URL OAuth:');
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        state: 'test'
    });
    
    const fullUrl = `${baseUrl}?${params.toString()}`;
    console.log('   ✅ URL construida correctamente');
    console.log(`   🔗 ${fullUrl}`);
    
    // Test 3: Problemas comunes
    console.log('\n3️⃣ Verificación de problemas comunes:');
    
    const commonIssues = [
        {
            check: 'Client ID contains placeholder text',
            test: clientId.includes('example') || clientId.includes('your-client-id'),
            fix: 'Usar Client ID real de Google Cloud Console'
        },
        {
            check: 'Redirect URI has wrong protocol',
            test: !redirectUri.startsWith('http://localhost:3000'),
            fix: 'Verificar que sea exactamente http://localhost:3000/api/auth/callback/google'
        },
        {
            check: 'Missing OAuth Consent Screen',
            test: false, // No podemos verificar esto automáticamente
            fix: 'Configurar OAuth Consent Screen en Google Cloud Console'
        },
        {
            check: 'APIs not enabled',
            test: false, // No podemos verificar esto automáticamente
            fix: 'Habilitar Google+ API o People API'
        }
    ];
    
    commonIssues.forEach(issue => {
        console.log(`   ${issue.test ? '❌' : '✅'} ${issue.check}`);
        if (issue.test) {
            console.log(`      💡 Fix: ${issue.fix}`);
        }
    });
    
    console.log('\n4️⃣ Recomendaciones específicas:');
    console.log('   🎯 Pasos para resolver el problema:');
    console.log('   1. Ve a https://console.cloud.google.com/');
    console.log('   2. Selecciona el proyecto flight-bot');
    console.log('   3. Ve a APIs & Services > OAuth consent screen');
    console.log('   4. Configura como External si no está configurado');
    console.log('   5. Agrega tu email como Test user');
    console.log('   6. Ve a APIs & Services > Library');
    console.log('   7. Busca y habilita "Google+ API" o "People API"');
    console.log('   8. Espera 10-15 minutos y prueba nuevamente');
    
    console.log('\n5️⃣ URL para probar manualmente:');
    console.log(`   ${fullUrl}`);
    console.log('\n   📝 Si esta URL funciona = problema de NextAuth');
    console.log('   📝 Si esta URL falla = problema de Google Cloud Console');
    
    console.log('\n✅ DIAGNÓSTICO COMPLETADO');
}

diagnoseGoogleOAuthError().catch(console.error);
