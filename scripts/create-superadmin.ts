#!/usr/bin/env tsx

/**
 * Script para crear el primer usuario SUPERADMIN
 * Se ejecuta después del reset de la base de datos
 */

import { PrismaClient } from '@prisma/client'

// Import bcrypt dinámicamente para evitar errores de dependencia
let bcrypt: any
try {
  bcrypt = require('bcryptjs')
} catch (e) {
  console.log('⚠️  bcryptjs no encontrado, las contraseñas no se podrán hashear')
}

const prisma = new PrismaClient()

interface CreateSuperAdminOptions {
  email: string
  name?: string
  password?: string
}

async function createSuperAdmin(options: CreateSuperAdminOptions) {
  console.log('👑 Creando usuario SUPERADMIN...')
  
  try {
    // Verificar que no existan usuarios
    const existingUserCount = await prisma.user.count()
    if (existingUserCount > 0) {
      console.log('⚠️  Ya existen usuarios en la base de datos.')
      console.log('💡 Ejecuta primero el reset-database.ts si quieres empezar desde cero.')
      return
    }
    
    // Generar password hasheado si se proporciona
    let hashedPassword: string | undefined = undefined
    if (options.password && bcrypt) {
      hashedPassword = await bcrypt.hash(options.password, 12)
    } else if (options.password && !bcrypt) {
      console.log('⚠️  bcryptjs no disponible, guardando password en texto plano (NO RECOMENDADO)')
      hashedPassword = options.password
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
        password: hashedPassword,
        emailVerified: new Date(), // Pre-verificado
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Usuario SUPERADMIN creado exitosamente!')
    console.log(`📧 Email: ${superAdmin.email}`)
    console.log(`🆔 ID: ${superAdmin.id}`)
    console.log(`👑 Rol: ${superAdmin.role}`)
    console.log(`📅 Creado: ${superAdmin.createdAt}`)
    
    if (options.password) {
      console.log('🔐 Password configurado (hasheado)')
    }
    
    console.log('\n🔗 Para vincular con Telegram:')
    console.log('1. Inicia sesión en la webapp con este email')
    console.log('2. Ve a Profile/Configuración')
    console.log('3. Sigue el proceso de vinculación con Telegram')
    
    return superAdmin
    
  } catch (error) {
    console.error('❌ Error creando SUPERADMIN:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Configuración por defecto (puedes cambiar esto)
const DEFAULT_CONFIG = {
  email: 'admin@flight-bot.com', // Cambia esto por tu email
  name: 'Flight Bot Admin',
  password: 'admin123' // Cambia esto por una contraseña segura
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  // Puedes cambiar estos valores por los tuyos
  const config = {
    email: process.argv[2] || DEFAULT_CONFIG.email,
    name: process.argv[3] || DEFAULT_CONFIG.name,
    password: process.argv[4] || DEFAULT_CONFIG.password
  }
  
  console.log(`📧 Creando SUPERADMIN con email: ${config.email}`)
  
  createSuperAdmin(config)
    .then(() => {
      console.log('\n🎉 SUPERADMIN creado exitosamente!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error)
      process.exit(1)
    })
}

export { createSuperAdmin }
