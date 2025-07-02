#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUserAlerts() {
  console.log('🔍 Verificando alertas del usuario...\n')

  try {
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: 'martin.navarro.dev@gmail.com' }
    })

    if (!user) {
      console.log('❌ Usuario no encontrado')
      return
    }

    console.log(`📧 Usuario: ${user.email} (ID: ${user.id})`)

    // Verificar alertas en base de datos local (Prisma)
    const webappAlerts = await prisma.alert.findMany({
      where: { userId: user.id }
    })

    console.log(`\n🌐 Alertas en webapp (Prisma): ${webappAlerts.length}`)
    if (webappAlerts.length > 0) {
      webappAlerts.forEach((alert, index) => {
        console.log(`   ${index + 1}. ${alert.origin} → ${alert.destination} ($${alert.maxPrice})`)
        console.log(`      Tipo: ${alert.alertType}, Activa: ${alert.isActive}`)
      })
    } else {
      console.log('   ✅ No hay alertas en webapp (correcto para usuario nuevo)')
    }

    // Verificar alertas en el bot (usando telegramId si estuviera vinculado)
    if (user.telegramId) {
      console.log(`\n🤖 Telegram ID: ${user.telegramId}`)
      // Aquí podríamos verificar alertas del bot
      // const botAlerts = await checkBotAlerts(user.telegramId)
    } else {
      console.log('\n🤖 Telegram no vinculado (normal para usuario nuevo)')
    }

    // Verificar través de API
    console.log('\n🔗 Verificando a través de API webapp...')
    try {
      // Simular request a la API
      const response = await fetch(`http://localhost:3000/api/bot-alerts?telegramId=${user.telegramId || 'none'}`)
      if (response.ok) {
        const data = await response.json()
        console.log(`   API response: ${data.alerts?.length || 0} alertas`)
      } else {
        console.log(`   API error: ${response.status}`)
      }
    } catch (apiError) {
      console.log('   API no disponible (servidor no corriendo)')
    }

    // Resumen
    console.log('\n📋 Resumen:')
    console.log(`   Usuario creado: ✅`)
    console.log(`   Alertas webapp: ${webappAlerts.length} (debería ser 0)`)
    console.log(`   Telegram vinculado: ${user.telegramId ? '✅' : '❌ No'}`)
    console.log(`   Estado: ${webappAlerts.length === 0 ? '✅ Correcto' : '⚠️ Tiene alertas (revisar)'}`)

  } catch (error) {
    console.error('❌ Error verificando alertas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserAlerts()
