#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAuthFlow() {
  console.log('🧪 Probando flujo de autenticación completo...\n')

  try {
    // Test 1: Verificar endpoints de NextAuth
    console.log('1️⃣ Verificando endpoints de NextAuth...')
    
    const providersResponse = await fetch('http://localhost:3000/api/auth/providers')
    if (!providersResponse.ok) {
      throw new Error('NextAuth endpoints no están funcionando')
    }
    
    const providers = await providersResponse.json()
    console.log('✅ NextAuth endpoints funcionando')
    console.log(`📊 Providers disponibles: ${Object.keys(providers).join(', ')}`)
    
    const hasGoogle = providers.google !== undefined
    const hasCredentials = providers.credentials !== undefined
    
    console.log(`🔍 Google OAuth: ${hasGoogle ? '✅ Habilitado' : '❌ No configurado'}`)
    console.log(`🔐 Credenciales: ${hasCredentials ? '✅ Habilitado' : '❌ Error'}`)
    
    if (!hasGoogle) {
      console.log('⚠️  Para habilitar Google OAuth:')
      console.log('   1. Ve a: https://console.cloud.google.com/')
      console.log('   2. Ejecuta: ./setup-google-oauth-production.sh')
      console.log('   3. Consulta: GOOGLE_OAUTH_PRODUCTION_SETUP.md')
    }
    
    // Test 2: Verificar base de datos
    console.log('\n2️⃣ Verificando conexión a base de datos...')
    const userCount = await prisma.user.count()
    console.log(`✅ Base de datos conectada (${userCount} usuarios)`)
    
    // Test 3: Crear usuario de prueba manual
    console.log('\n3️⃣ Probando registro manual...')
    const testEmail = `test-${Date.now()}@example.com`
    
    const signupResponse = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: testEmail,
        phone: '+1234567890',
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!'
      })
    })
    
    if (signupResponse.ok) {
      console.log('✅ Registro manual funcionando')
      
      // Verificar usuario en base de datos
      const createdUser = await prisma.user.findUnique({
        where: { email: testEmail }
      })
      
      if (createdUser) {
        console.log(`✅ Usuario creado en base de datos con rol: ${createdUser.role}`)
        
        // Limpiar usuario de prueba
        await prisma.user.delete({ where: { email: testEmail } })
        console.log('🧹 Usuario de prueba eliminado')
      }
    } else {
      const error = await signupResponse.json()
      console.log(`❌ Error en registro manual: ${error.message}`)
    }
    
    // Test 4: Verificar páginas de autenticación
    console.log('\n4️⃣ Verificando páginas de autenticación...')
    
    const signinResponse = await fetch('http://localhost:3000/auth/signin')
    const signupPageResponse = await fetch('http://localhost:3000/auth/signup')
    
    console.log(`✅ Página de login: ${signinResponse.ok ? 'Funcionando' : 'Error'}`)
    console.log(`✅ Página de registro: ${signupPageResponse.ok ? 'Funcionando' : 'Error'}`)
    
    // Test 5: Resumen
    console.log('\n📋 Resumen de funcionalidades:')
    console.log('┌─────────────────────────────────────┬─────────┐')
    console.log('│ Funcionalidad                       │ Estado  │')
    console.log('├─────────────────────────────────────┼─────────┤')
    console.log(`│ NextAuth endpoints                  │ ${hasCredentials ? '✅ OK   ' : '❌ Error'}│`)
    console.log(`│ Registro manual (email/password)    │ ${signupResponse.ok ? '✅ OK   ' : '❌ Error'}│`)
    console.log(`│ Google OAuth                        │ ${hasGoogle ? '✅ OK   ' : '⏳ Setup'}│`)
    console.log(`│ Base de datos                       │ ✅ OK   │`)
    console.log(`│ Páginas de auth                     │ ${signinResponse.ok && signupPageResponse.ok ? '✅ OK   ' : '❌ Error'}│`)
    console.log('└─────────────────────────────────────┴─────────┘')
    
    if (!hasGoogle) {
      console.log('\n💡 Para habilitar Google OAuth:')
      console.log('   1. Ejecuta: ./setup-google-oauth-production.sh')
      console.log('   2. Sigue la guía: GOOGLE_OAUTH_PRODUCTION_SETUP.md')
      console.log('   3. Reinicia el servidor después de configurar')
    }
    
    if (hasGoogle && hasCredentials) {
      console.log('\n🎉 ¡Autenticación completamente configurada!')
      console.log('   - Usuarios pueden registrarse con email/password')
      console.log('   - Usuarios pueden usar "Sign in with Google"')
      console.log('   - Ambos métodos crean cuentas con el ID de Google')
    }
    
    console.log('\n🎉 ¡Pruebas completadas!')
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar pruebas
testAuthFlow()
