#!/usr/bin/env npx tsx

// Script para debuggear el error redirect_uri_mismatch

async function debugRedirectURI() {
  console.log('🔍 Debuggeando redirect_uri_mismatch...\n')
  
  // Verificar variables de entorno
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const nextAuthUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  
  console.log('📋 Configuración actual:')
  console.log(`   NEXTAUTH_URL: ${nextAuthUrl}`)
  console.log(`   GOOGLE_CLIENT_ID: ${clientId ? '✅ Configurado' : '❌ Faltante'}`)
  console.log(`   GOOGLE_CLIENT_SECRET: ${clientSecret ? '✅ Configurado' : '❌ Faltante'}`)
  
  // Calcular URL de redirect esperada
  const expectedRedirectUri = `${nextAuthUrl}/api/auth/callback/google`
  console.log(`\n🎯 URL de redirect que NextAuth está usando:`)
  console.log(`   ${expectedRedirectUri}`)
  
  console.log('\n✅ En Google Cloud Console debes tener EXACTAMENTE:')
  console.log('┌─────────────────────────────────────────────────────────────┐')
  console.log('│ Authorized JavaScript origins:                              │')
  console.log('│ http://localhost:3000                                       │')
  console.log('│                                                             │')
  console.log('│ Authorized redirect URIs:                                   │')
  console.log('│ http://localhost:3000/api/auth/callback/google              │')
  console.log('└─────────────────────────────────────────────────────────────┘')
  
  console.log('\n❌ URLs que NO funcionan:')
  console.log('   ❌ https://localhost:3000 (no uses HTTPS en localhost)')
  console.log('   ❌ http://localhost:3000/ (no agregues barra al final)')
  console.log('   ❌ http://localhost:3000/api/auth/callback (falta /google)')
  console.log('   ❌ http://127.0.0.1:3000 (usa localhost, no 127.0.0.1)')
  
  // Verificar si el servidor está corriendo
  try {
    const response = await fetch(`${nextAuthUrl}/api/auth/providers`)
    if (response.ok) {
      const providers = await response.json()
      console.log('\n🌐 Providers detectados:')
      console.log(`   Google: ${providers.google ? '✅ Activo' : '❌ No detectado'}`)
      
      if (providers.google) {
        console.log('\n🧪 Para probar después de arreglar Google Console:')
        console.log('   1. Guarda los cambios en Google Console')
        console.log('   2. Espera 1-2 minutos')
        console.log('   3. Ve a: http://localhost:3000/auth/signin')
        console.log('   4. Haz clic en "Continue with Google"')
      }
    }
  } catch (error) {
    console.log('\n❌ Error: El servidor no está corriendo')
    console.log('   Ejecuta: npm run dev')
  }
  
  console.log('\n📖 Si el problema persiste:')
  console.log('   1. Verifica las URLs en Google Console (copia/pega exacto)')
  console.log('   2. Espera 1-2 minutos después de guardar cambios')
  console.log('   3. Prueba en ventana incógnita')
  console.log('   4. Verifica que el proyecto sea el correcto en Google Console')
}

debugRedirectURI()
