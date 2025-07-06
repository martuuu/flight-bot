#!/usr/bin/env tsx

/**
 * Script para diagnosticar la vinculación completa
 * Verifica bot local -> webapp -> base de datos
 */

import { PrismaClient } from '@prisma/client'
import fetch from 'node-fetch'

const prisma = new PrismaClient()

async function diagnoseLinkingIssue() {
  console.log('🔍 DIAGNÓSTICO DE VINCULACIÓN COMPLETA')
  console.log('====================================')
  console.log('')

  // 1. Verificar estado actual de la base de datos
  console.log('1️⃣ Verificando estado de la base de datos...')
  try {
    const userCount = await prisma.user.count()
    const telegramUserCount = await prisma.telegramUser.count()
    
    console.log(`   👥 Usuarios en webapp: ${userCount}`)
    console.log(`   🤖 Usuarios de Telegram: ${telegramUserCount}`)

    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: {
          email: true,
          telegramLinked: true,
          telegramId: true,
          telegramUsername: true
        }
      })
      
      console.log('   📋 Usuarios webapp:')
      users.forEach((user, i) => {
        console.log(`   ${i + 1}. ${user.email} - Telegram: ${user.telegramLinked ? '✅' : '❌'} ${user.telegramId || ''}`)
      })
    }

    if (telegramUserCount > 0) {
      const tgUsers = await prisma.telegramUser.findMany({
        select: {
          telegramId: true,
          username: true,
          isLinked: true,
          linkedUserId: true
        }
      })
      
      console.log('   📋 Usuarios Telegram:')
      tgUsers.forEach((user, i) => {
        console.log(`   ${i + 1}. @${user.username} (ID: ${user.telegramId}) - Linked: ${user.isLinked ? '✅' : '❌'}`)
      })
    }

  } catch (error) {
    console.log('   ❌ Error accediendo a la base de datos:', error)
  }

  console.log('')

  // 2. Verificar configuración del bot local
  console.log('2️⃣ Verificando configuración del bot local...')
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'CONFIGURADO' : 'NO CONFIGURADO'}`)
  console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || 'NO CONFIGURADO'}`)
  console.log(`   TELEGRAM_BOT_TOKEN: ${process.env.TELEGRAM_BOT_TOKEN ? 'CONFIGURADO' : 'NO CONFIGURADO'}`)

  // 3. Simular el flujo completo de vinculación
  console.log('')
  console.log('3️⃣ Simulando flujo completo de vinculación...')
  
  // Paso 3a: Generar código desde webapp (simular usuario autenticado)
  console.log('   📱 Paso 1: Generando código desde webapp...')
  
  // Como no tenemos sesión, vamos a crear un código manualmente en la base de datos
  const testCode = Math.random().toString().substring(2, 8)
  const expirationTime = Date.now() + 15 * 60 * 1000 // 15 minutos
  
  try {
    // Buscar el usuario SUPERADMIN
    const superAdmin = await prisma.user.findFirst({
      where: { role: 'SUPERADMIN' }
    })
    
    if (!superAdmin) {
      console.log('   ❌ No se encontró usuario SUPERADMIN')
      return
    }
    
    console.log(`   ✅ Usuario encontrado: ${superAdmin.email}`)
    console.log(`   🔑 Código de prueba: ${testCode}`)
    
    // Paso 3b: Simular comando /link desde bot hacia webapp
    console.log('   🤖 Paso 2: Simulando /link desde bot hacia webapp...')
    
    const webappUrl = process.env.NEXTAUTH_URL || 'https://flight-bot.com'
    const linkingData = {
      action: 'confirm_from_bot',
      telegramId: '5536948508', // Tu ID real
      telegramUsername: 'martin_test', // Cambia por tu username real
      telegramFirstName: 'Martin',
      telegramLastName: 'Test',
      linkingCode: testCode
    }

    // Primero, agregar el código a la memoria temporal (simular webapp)
    // Como no podemos acceder a la variable linkingCodes, vamos directo a la DB
    
    // Crear registro de TelegramUser si no existe
    const existingTgUser = await prisma.telegramUser.findUnique({
      where: { telegramId: '5536948508' }
    })
    
    if (!existingTgUser) {
      await prisma.telegramUser.create({
        data: {
          telegramId: '5536948508',
          username: 'martin_test',
          firstName: 'Martin',
          lastName: 'Test',
          isLinked: false,
          linkingCode: testCode,
          linkingExpires: new Date(expirationTime)
        }
      })
      console.log('   ✅ Usuario Telegram creado con código de vinculación')
    } else {
      await prisma.telegramUser.update({
        where: { telegramId: '5536948508' },
        data: {
          linkingCode: testCode,
          linkingExpires: new Date(expirationTime)
        }
      })
      console.log('   ✅ Usuario Telegram actualizado con código de vinculación')
    }

    // Ahora probar la API de vinculación
    console.log('   🌐 Paso 3: Llamando API de vinculación...')
    const response = await fetch(`${webappUrl}/api/telegram/link-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(linkingData)
    })

    const result = await response.json()
    console.log(`   📊 Status: ${response.status}`)
    console.log(`   📄 Response:`, JSON.stringify(result, null, 2))

    if (result.success) {
      console.log('   ✅ Vinculación exitosa!')
      
      // Verificar en la base de datos
      const updatedUser = await prisma.user.findUnique({
        where: { id: superAdmin.id }
      })
      
      console.log(`   🔗 Usuario vinculado: ${updatedUser?.telegramLinked}`)
      console.log(`   🆔 Telegram ID: ${updatedUser?.telegramId}`)
      
    } else {
      console.log('   ❌ Error en vinculación:', result.error)
    }

  } catch (error) {
    console.log('   ❌ Error en simulación:', error)
  }

  console.log('')
  console.log('4️⃣ Verificando estado final...')
  
  try {
    const finalUser = await prisma.user.findFirst({
      where: { role: 'SUPERADMIN' }
    })
    
    if (finalUser?.telegramLinked) {
      console.log('   ✅ Usuario correctamente vinculado!')
      console.log(`   📧 Email: ${finalUser.email}`)
      console.log(`   🤖 Telegram ID: ${finalUser.telegramId}`)
    } else {
      console.log('   ❌ Usuario no vinculado')
    }
    
  } catch (error) {
    console.log('   ❌ Error verificando estado final:', error)
  }

  await prisma.$disconnect()
}

// Ejecutar
diagnoseLinkingIssue()
  .then(() => {
    console.log('\n✅ Diagnóstico completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error en diagnóstico:', error)
    process.exit(1)
  })
