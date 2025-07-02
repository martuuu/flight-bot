#!/usr/bin/env npx tsx

// Script para verificar rápidamente si Google OAuth está configurado

async function checkGoogleOAuth() {
  console.log('🔍 Verificando configuración de Google OAuth...\n')
  
  // Verificar variables de entorno
  const hasClientId = !!process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id'
  const hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_SECRET !== 'your-google-client-secret'
  
  console.log('📋 Variables de entorno:')
  console.log(`   GOOGLE_CLIENT_ID: ${hasClientId ? '✅ Configurado' : '❌ No configurado'}`)
  console.log(`   GOOGLE_CLIENT_SECRET: ${hasClientSecret ? '✅ Configurado' : '❌ No configurado'}`)
  
  if (!hasClientId || !hasClientSecret) {
    console.log('\n⚠️  Google OAuth NO está configurado')
    console.log('\n🔧 Para configurarlo:')
    console.log('   1. Ejecuta: ./setup-google-oauth-production.sh')
    console.log('   2. Sigue la guía: GOOGLE_OAUTH_PRODUCTION_SETUP.md')
    return false
  }
  
  // Verificar que NextAuth detecte las credenciales
  try {
    const response = await fetch('http://localhost:3000/api/auth/providers')
    if (response.ok) {
      const providers = await response.json()
      const hasGoogle = !!providers.google
      
      console.log('\n🌐 Providers de NextAuth:')
      console.log(`   Google: ${hasGoogle ? '✅ Activo' : '❌ No detectado'}`)
      console.log(`   Credentials: ${providers.credentials ? '✅ Activo' : '❌ No detectado'}`)
      
      if (hasGoogle) {
        console.log('\n🎉 ¡Google OAuth está completamente configurado!')
        console.log('\n🧪 Para probar:')
        console.log('   1. Ve a: http://localhost:3000/auth/signin')
        console.log('   2. Busca el botón "Continue with Google"')
        console.log('   3. Prueba con tu cuenta de Google real')
        return true
      }
    }
  } catch (error) {
    console.log('\n❌ Error: El servidor no está corriendo')
    console.log('   Ejecuta: npm run dev')
    return false
  }
  
  console.log('\n❌ Google OAuth no está funcionando correctamente')
  return false
}

checkGoogleOAuth()
