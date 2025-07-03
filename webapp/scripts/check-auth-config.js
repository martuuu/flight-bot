#!/usr/bin/env node

/**
 * Script para verificar la configuración de NextAuth
 * Ejecuta: node scripts/check-auth-config.js
 */

require('dotenv').config()

// Función para verificar una variable de entorno
function checkEnvVar(name) {
  const value = process.env[name]
  const exists = !!value
  console.log(`${name}: ${exists ? '✅ Configurada' : '❌ No configurada'}`)
  
  if (exists && name.toLowerCase().includes('secret')) {
    console.log(`  Longitud: ${value.length} caracteres`)
  }
  
  return exists
}

// Encabezado
console.log('\n=== VERIFICACIÓN DE CONFIGURACIÓN DE NEXTAUTH ===\n')

// Verificar variables necesarias
console.log('Variables esenciales:')
const nextAuthSecret = checkEnvVar('NEXTAUTH_SECRET')
const nextAuthUrl = checkEnvVar('NEXTAUTH_URL')
console.log()

console.log('Configuración de Google OAuth:')
const googleClientId = checkEnvVar('GOOGLE_CLIENT_ID')
const googleClientSecret = checkEnvVar('GOOGLE_CLIENT_SECRET')
console.log()

// Verificar URL base para callbacks
if (nextAuthUrl) {
  console.log('URLs de callback:')
  console.log(`Google OAuth callback: ${process.env.NEXTAUTH_URL}/api/auth/callback/google`)
  
  // Verificar si la URL es localhost (desarrollo) o production
  if (process.env.NEXTAUTH_URL.includes('localhost')) {
    console.log('\n⚠️  Estás usando una URL de desarrollo (localhost).')
    console.log('   Asegúrate de que esta URL coincida con las URLs configuradas en Google Cloud Console.')
  } else {
    console.log('\n✅ Estás usando una URL de producción.')
    console.log('   Asegúrate de que esta URL coincida con las URLs configuradas en Google Cloud Console.')
  }
}

// Resumen final
console.log('\nResumen:')
if (nextAuthSecret && nextAuthUrl && googleClientId && googleClientSecret) {
  console.log('✅ La configuración básica de NextAuth parece estar completa.')
  console.log('   Asegúrate de que las URLs de redirección estén correctamente configuradas en Google Cloud Console.')
} else {
  console.log('❌ Hay variables de configuración faltantes. Completa la configuración antes de probar la autenticación.')
}

console.log('\n=================================================\n')
