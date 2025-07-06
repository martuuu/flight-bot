#!/usr/bin/env tsx

/**
 * Script para verificar el estado actual de la base de datos
 * Muestra información sobre usuarios, alertas, etc.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabaseStatus() {
  console.log('📊 ESTADO ACTUAL DE LA BASE DE DATOS')
  console.log('===================================')
  
  try {
    // Contar registros en todas las tablas principales
    const userCount = await prisma.user.count()
    const accountCount = await prisma.account.count()
    const sessionCount = await prisma.session.count()
    const alertCount = await prisma.alert.count()
    const flightAlertCount = await prisma.flightAlert.count()
    const priceHistoryCount = await prisma.priceHistory.count()
    const notificationSettingsCount = await prisma.notificationSettings.count()
    
    console.log(`👥 Usuarios: ${userCount}`)
    console.log(`🔐 Cuentas (OAuth): ${accountCount}`)
    console.log(`🎫 Sesiones activas: ${sessionCount}`)
    console.log(`🚨 Alertas: ${alertCount}`)
    console.log(`✈️  Alertas de vuelos: ${flightAlertCount}`)
    console.log(`📈 Historial de precios: ${priceHistoryCount}`)
    console.log(`⚙️  Configuraciones: ${notificationSettingsCount}`)
    
    console.log('\n' + '='.repeat(50))
    
    if (userCount === 0) {
      console.log('✅ Base de datos vacía - Lista para empezar desde cero')
      return
    }
    
    // Mostrar detalles de usuarios si existen
    console.log('\n👥 DETALLES DE USUARIOS:')
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        telegramLinked: true,
        telegramUsername: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    })
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.email}`)
      console.log(`   👤 Nombre: ${user.name || 'Sin nombre'}`)
      console.log(`   👑 Rol: ${user.role}`)
      console.log(`   🤖 Telegram: ${user.telegramLinked ? `✅ @${user.telegramUsername || 'Sin username'}` : '❌ No vinculado'}`)
      console.log(`   💎 Plan: ${user.subscriptionPlan} (${user.subscriptionStatus})`)
      console.log(`   📅 Creado: ${user.createdAt.toLocaleString()}`)
    })
    
    // Mostrar cuentas OAuth vinculadas
    if (accountCount > 0) {
      console.log('\n🔐 CUENTAS OAUTH:')
      const accounts = await prisma.account.findMany({
        select: {
          provider: true,
          providerAccountId: true,
          user: {
            select: {
              email: true
            }
          }
        }
      })
      
      accounts.forEach((account, index) => {
        console.log(`${index + 1}. ${account.user.email} - ${account.provider} (${account.providerAccountId})`)
      })
    }
    
    // Mostrar resumen de alertas
    if (alertCount > 0) {
      console.log('\n🚨 RESUMEN DE ALERTAS:')
      const alertsByUser = await prisma.alert.groupBy({
        by: ['userId'],
        _count: {
          id: true
        }
      })
      
      for (const group of alertsByUser) {
        const user = await prisma.user.findUnique({
          where: { id: group.userId },
          select: { email: true }
        })
        console.log(`${user?.email}: ${group._count.id} alertas`)
      }
    }
    
  } catch (error) {
    console.error('❌ Error consultando la base de datos:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
checkDatabaseStatus()
  .then(() => {
    console.log('\n✅ Consulta completada')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })
