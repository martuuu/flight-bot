#!/usr/bin/env tsx

/**
 * Script para probar la vinculación real paso a paso
 */

import fetch from 'node-fetch'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testRealLinking() {
  console.log('🔗 PRUEBA DE VINCULACIÓN REAL')
  console.log('============================')
  console.log('')

  console.log('📋 INSTRUCCIONES:')
  console.log('1. Ve a https://flight-bot.com')
  console.log('2. Inicia sesión con Google usando martin.navarro.dev@gmail.com')
  console.log('3. Ve a tu perfil')
  console.log('4. Genera un código de vinculación')
  console.log('5. Usa ese código con /link CODIGO en Telegram')
  console.log('')

  console.log('🔍 ESTADO ACTUAL:')
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'martin.navarro.dev@gmail.com' }
    })
    
    if (user) {
      console.log(`📧 Usuario: ${user.email}`)
      console.log(`👑 Rol: ${user.role}`)
      console.log(`🔗 Telegram vinculado: ${user.telegramLinked ? '✅ SÍ' : '❌ NO'}`)
      if (user.telegramId) {
        console.log(`🆔 Telegram ID: ${user.telegramId}`)
      }
    }

    const telegramUser = await prisma.telegramUser.findUnique({
      where: { telegramId: '5536948508' }
    })
    
    if (telegramUser) {
      console.log(`🤖 Usuario Telegram: @${telegramUser.username || 'sin username'} (ID: ${telegramUser.telegramId})`)
      console.log(`🔗 Linked: ${telegramUser.isLinked ? '✅ SÍ' : '❌ NO'}`)
      console.log(`👤 Linked a usuario: ${telegramUser.linkedUserId || 'ninguno'}`)
    }

  } catch (error) {
    console.log('❌ Error:', error)
  }

  console.log('')
  console.log('⚠️  IMPORTANTE:')
  console.log('- El bot debe estar ejecutándose: npm run dev')
  console.log('- Usar el comando /link CODIGO en Telegram')
  console.log('- El código expira en 15 minutos')
  console.log('')
  console.log('🐛 PARA DEBUGGEAR:')
  console.log('- Revisa logs del bot cuando uses /link')
  console.log('- Verifica que el bot puede conectar con https://flight-bot.com')

  await prisma.$disconnect()
}

testRealLinking()
  .then(() => {
    console.log('\n✅ Listo para probar vinculación real')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error:', error)
    process.exit(1)
  })
