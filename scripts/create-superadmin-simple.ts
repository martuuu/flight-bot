#!/usr/bin/env tsx

/**
 * Script simple para crear el primer usuario SUPERADMIN
 * Sin dependencias externas, solo para OAuth con Google
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CreateSuperAdminOptions {
  email: string
  name?: string
}

async function createSuperAdmin(options: CreateSuperAdminOptions) {
  console.log('👑 Creando usuario SUPERADMIN...')
  
  try {
    // Verificar que no existan usuarios
    const existingUserCount = await prisma.user.count()
    if (existingUserCount > 0) {
      console.log('⚠️  Ya existen usuarios en la base de datos.')
      
      // Mostrar usuarios existentes
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          telegramLinked: true,
          createdAt: true
        }
      })
      
      console.log('\n📋 Usuarios existentes:')
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.role}) - Telegram: ${user.telegramLinked ? '✅' : '❌'}`)
      })
      
      console.log('\n💡 Ejecuta primero el reset-database.ts si quieres empezar desde cero.')
      return
    }
    
    // Crear el usuario SUPERADMIN
    const superAdmin = await prisma.user.create({
      data: {
        email: options.email,
        name: options.name || 'Super Admin',
        role: 'SUPERADMIN',
        subscriptionStatus: 'ACTIVE',
        subscriptionPlan: 'PREMIUM',
        subscriptionActive: true,
        emailVerified: new Date(), // Pre-verificado para OAuth
        telegramLinked: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Usuario SUPERADMIN creado exitosamente!')
    console.log(`📧 Email: ${superAdmin.email}`)
    console.log(`🆔 ID: ${superAdmin.id}`)
    console.log(`👑 Rol: ${superAdmin.role}`)
    console.log(`📅 Creado: ${superAdmin.createdAt}`)
    console.log(`🔗 Telegram vinculado: ${superAdmin.telegramLinked ? '✅' : '❌'}`)
    
    console.log('\n🔗 Para vincular con Telegram:')
    console.log('1. 🌐 Ve a tu webapp (https://flight-bot.com)')
    console.log('2. 🔐 Inicia sesión con Google usando este email')
    console.log('3. 👤 Ve a Profile/Configuración')
    console.log('4. 🤖 Sigue el proceso de vinculación con Telegram')
    
    return superAdmin
    
  } catch (error) {
    console.error('❌ Error creando SUPERADMIN:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Verificar argumentos
const email = process.argv[2]
const name = process.argv[3]

if (!email) {
  console.log('❌ Error: Debes proporcionar un email')
  console.log('📖 Uso: npx tsx scripts/create-superadmin-simple.ts <email> [nombre]')
  console.log('📖 Ejemplo: npx tsx scripts/create-superadmin-simple.ts tu@gmail.com "Tu Nombre"')
  process.exit(1)
}

// Validar email básico
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) {
  console.log('❌ Error: Email no válido')
  process.exit(1)
}

console.log(`📧 Creando SUPERADMIN con email: ${email}`)
if (name) {
  console.log(`👤 Nombre: ${name}`)
}

// Ejecutar
createSuperAdmin({ email, name })
  .then(() => {
    console.log('\n🎉 SUPERADMIN creado exitosamente!')
    console.log('\n📋 PRÓXIMOS PASOS:')
    console.log('1. Ve a https://flight-bot.com')
    console.log('2. Haz clic en "Sign in with Google"')
    console.log(`3. Usa la cuenta: ${email}`)
    console.log('4. Vincula tu Telegram en el perfil')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })
