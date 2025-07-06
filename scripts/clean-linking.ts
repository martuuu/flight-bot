#!/usr/bin/env tsx

/**
 * Script para limpiar vinculaciones previas y empezar desde cero
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanLinkingData() {
  console.log('🧹 LIMPIANDO DATOS DE VINCULACIÓN')
  console.log('=================================')
  console.log('')

  try {
    // 1. Desvincular el usuario de Telegram
    console.log('1️⃣ Desvinculando usuario de Telegram...')
    const telegramUser = await prisma.telegramUser.findUnique({
      where: { telegramId: '5536948508' }
    })
    
    if (telegramUser) {
      await prisma.telegramUser.update({
        where: { telegramId: '5536948508' },
        data: {
          isLinked: false,
          linkedUserId: null,
          linkingCode: null,
          linkingExpires: null
        }
      })
      console.log('   ✅ Usuario Telegram desvinculado')
    } else {
      console.log('   ℹ️  No se encontró usuario Telegram')
    }

    // 2. Limpiar cualquier vinculación en el usuario webapp
    console.log('2️⃣ Limpiando usuario webapp...')
    const webappUser = await prisma.user.findUnique({
      where: { email: 'martin.navarro.dev@gmail.com' }
    })
    
    if (webappUser) {
      await prisma.user.update({
        where: { email: 'martin.navarro.dev@gmail.com' },
        data: {
          telegramId: null,
          telegramUsername: null,
          telegramLinked: false,
          telegramLinkedAt: null,
          telegramLinkingCode: null,
          telegramLinkingExpires: null
        }
      })
      console.log('   ✅ Usuario webapp limpio')
    }

    // 3. Verificar estado final
    console.log('3️⃣ Verificando estado final...')
    
    const finalWebappUser = await prisma.user.findUnique({
      where: { email: 'martin.navarro.dev@gmail.com' }
    })
    
    const finalTelegramUser = await prisma.telegramUser.findUnique({
      where: { telegramId: '5536948508' }
    })
    
    console.log('   📊 Estado final:')
    console.log(`   👤 Usuario webapp vinculado: ${finalWebappUser?.telegramLinked ? '✅' : '❌'}`)
    console.log(`   🤖 Usuario Telegram vinculado: ${finalTelegramUser?.isLinked ? '✅' : '❌'}`)
    
    console.log('')
    console.log('🎉 LIMPIEZA COMPLETADA')
    console.log('')
    console.log('📋 PRÓXIMOS PASOS:')
    console.log('1. 🌐 Ve a https://flight-bot.com')
    console.log('2. 🔐 Inicia sesión con martin.navarro.dev@gmail.com')
    console.log('3. 👤 Ve a tu perfil')
    console.log('4. 🔑 Genera un código de vinculación')
    console.log('5. 🤖 Usa /link CODIGO en Telegram')
    console.log('')
    console.log('⚠️  IMPORTANTE: Asegúrate de que el bot esté ejecutándose')

  } catch (error) {
    console.error('❌ Error en limpieza:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanLinkingData()
  .then(() => {
    console.log('\n✅ Sistema listo para vinculación limpia')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error)
    process.exit(1)
  })
