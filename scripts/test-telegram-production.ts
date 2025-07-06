#!/usr/bin/env tsx

/**
 * Script para probar la vinculación Telegram en producción
 * Simula el proceso completo de vinculación
 */

import fetch from 'node-fetch'

const PRODUCTION_URL = 'https://flight-bot.com'
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7726760770:AAEhEDu0oEGj5unLTeNxXbyJXQX4fdCVTHw'

async function testTelegramLinking() {
  console.log('🧪 PRUEBA DE VINCULACIÓN TELEGRAM EN PRODUCCIÓN')
  console.log('================================================')
  console.log(`🌐 URL de producción: ${PRODUCTION_URL}`)
  console.log(`🤖 Bot token disponible: ${BOT_TOKEN ? 'SÍ' : 'NO'}`)
  console.log('')

  // Test 1: Verificar que la API de vinculación responda
  console.log('1️⃣ Probando endpoint de vinculación...')
  try {
    const response = await fetch(`${PRODUCTION_URL}/api/telegram/link-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'initiate'
      })
    })

    const result = await response.json()
    console.log(`   Status: ${response.status}`)
    console.log(`   Response:`, result)

    if (response.status === 401) {
      console.log('   ❌ Error: Sin autenticación (esperado sin sesión)')
    } else if (response.status === 500) {
      console.log('   ❌ Error del servidor - posible problema de DB o configuración')
    } else {
      console.log('   ✅ API responde correctamente')
    }

  } catch (error) {
    console.log('   ❌ Error conectando con la API:', error)
  }

  console.log('')

  // Test 2: Verificar que el bot esté activo
  console.log('2️⃣ Probando estado del bot de Telegram...')
  try {
    const botResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`)
    const botResult = await botResponse.json()
    
    if (botResult.ok) {
      console.log(`   ✅ Bot activo: @${botResult.result.username}`)
      console.log(`   📱 Bot ID: ${botResult.result.id}`)
    } else {
      console.log('   ❌ Bot no responde correctamente:', botResult)
    }
  } catch (error) {
    console.log('   ❌ Error consultando bot:', error)
  }

  console.log('')

  // Test 3: Simular vinculación desde bot
  console.log('3️⃣ Simulando vinculación desde bot...')
  try {
    const mockTelegramData = {
      action: 'confirm_from_bot',
      telegramId: '123456789',
      telegramUsername: 'test_user',
      telegramFirstName: 'Test',
      telegramLastName: 'User',
      linkingCode: '123456' // Código de prueba
    }

    const response = await fetch(`${PRODUCTION_URL}/api/telegram/link-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockTelegramData)
    })

    const result = await response.json()
    console.log(`   Status: ${response.status}`)
    console.log(`   Response:`, result)

    if (result.error?.includes('inválido o expirado')) {
      console.log('   ✅ API funciona - código expirado (comportamiento esperado)')
    } else if (response.status === 500) {
      console.log('   ❌ Error del servidor - posible problema de configuración')
    }

  } catch (error) {
    console.log('   ❌ Error en simulación:', error)
  }

  console.log('')

  // Test 4: Verificar variables de entorno críticas
  console.log('4️⃣ Verificando configuración...')
  console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || 'NO CONFIGURADO'}`)
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'CONFIGURADO' : 'NO CONFIGURADO'}`)
  console.log(`   TELEGRAM_BOT_TOKEN: ${process.env.TELEGRAM_BOT_TOKEN ? 'CONFIGURADO' : 'NO CONFIGURADO'}`)
  console.log(`   GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? 'CONFIGURADO' : 'NO CONFIGURADO'}`)

  console.log('')
  console.log('🎯 DIAGNÓSTICO COMPLETO')
  console.log('Si ves errores 500, el problema está en la configuración de Netlify')
  console.log('Si ves errores de conexión, el problema está en la red/DNS')
  console.log('Si todo responde pero falla la vinculación, el problema está en el flujo de datos')
}

// Ejecutar
testTelegramLinking()
  .then(() => {
    console.log('\n✅ Prueba completada')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error en la prueba:', error)
    process.exit(1)
  })
