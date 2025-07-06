#!/usr/bin/env tsx

/**
 * Script para diagnosticar el problema de conectividad entre bot y webapp
 */

import fetch from 'node-fetch'

const PRODUCTION_URL = 'https://flight-bot.com'

async function testWebhookConnectivity() {
  console.log('🔍 DIAGNÓSTICO DE CONECTIVIDAD WEBHOOK')
  console.log('====================================')
  console.log('')

  // Test 1: Verificar que el endpoint webhook responda
  console.log('1️⃣ Probando endpoint webhook...')
  try {
    const testUpdate = {
      update_id: 123456,
      message: {
        message_id: 1,
        from: {
          id: 5536948508,
          is_bot: false,
          first_name: "Martin",
          username: "your_username"
        },
        chat: {
          id: 5536948508,
          type: "private"
        },
        date: Math.floor(Date.now() / 1000),
        text: "/start"
      }
    }

    const response = await fetch(`${PRODUCTION_URL}/api/telegram/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUpdate)
    })

    const result = await response.json()
    console.log(`   Status: ${response.status}`)
    console.log(`   Response:`, result)

    if (response.ok && result.ok) {
      console.log('   ✅ Webhook responde correctamente')
    } else {
      console.log('   ❌ Problema en el webhook')
    }

  } catch (error) {
    console.log('   ❌ Error conectando con webhook:', error)
  }

  console.log('')

  // Test 2: Simular comando /link desde webhook
  console.log('2️⃣ Simulando comando /link desde webhook...')
  try {
    const linkUpdate = {
      update_id: 123457,
      message: {
        message_id: 2,
        from: {
          id: 5536948508,
          is_bot: false,
          first_name: "Martin",
          username: "your_username"
        },
        chat: {
          id: 5536948508,
          type: "private"
        },
        date: Math.floor(Date.now() / 1000),
        text: "/link 123456"
      }
    }

    const response = await fetch(`${PRODUCTION_URL}/api/telegram/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(linkUpdate)
    })

    const result = await response.json()
    console.log(`   Status: ${response.status}`)
    console.log(`   Response:`, result)

  } catch (error) {
    console.log('   ❌ Error en comando /link:', error)
  }

  console.log('')

  // Test 3: Verificar conectividad desde webhook hacia API
  console.log('3️⃣ Verificando conectividad interna...')
  
  // Esto simula lo que hace el webhook internamente
  try {
    const mockData = {
      action: 'confirm_from_bot',
      telegramId: '5536948508',
      telegramUsername: 'test_user',
      telegramFirstName: 'Martin',
      telegramLastName: 'Test',
      linkingCode: '123456'
    }

    const response = await fetch(`${PRODUCTION_URL}/api/telegram/link-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockData)
    })

    const result = await response.json()
    console.log(`   Status: ${response.status}`)
    console.log(`   Response:`, result)

    if (result.error?.includes('inválido o expirado')) {
      console.log('   ✅ Conectividad webhook->API funciona')
    } else {
      console.log('   ❌ Problema en conectividad interna')
    }

  } catch (error) {
    console.log('   ❌ Error en conectividad interna:', error)
  }

  console.log('')

  // Test 4: Verificar configuración de Telegram
  console.log('4️⃣ Verificando configuración de Telegram...')
  try {
    const botToken = '7726760770:AAEhEDu0oEGj5unLTeNxXbyJXQX4fdCVTHw'
    
    // Verificar webhook
    const webhookResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`)
    const webhookInfo = await webhookResponse.json()
    
    console.log('   📡 Webhook Info:')
    console.log(`   - URL: ${webhookInfo.result?.url || 'NO CONFIGURADO'}`)
    console.log(`   - Pendientes: ${webhookInfo.result?.pending_update_count || 0}`)
    console.log(`   - Último error: ${webhookInfo.result?.last_error_message || 'Ninguno'}`)
    console.log(`   - Último código error: ${webhookInfo.result?.last_error_date || 'N/A'}`)

    if (!webhookInfo.result?.url) {
      console.log('   ❌ Webhook no configurado correctamente')
    } else {
      console.log('   ✅ Webhook configurado')
    }

  } catch (error) {
    console.log('   ❌ Error verificando Telegram:', error)
  }

  console.log('')
  console.log('🎯 RECOMENDACIONES:')
  console.log('')
  console.log('Si ves errores en los tests:')
  console.log('1. Verifica que Netlify Functions estén desplegadas')
  console.log('2. Revisa los logs de Netlify Functions')
  console.log('3. Confirma que las variables de entorno estén configuradas')
  console.log('')
  console.log('Para usar el bot en servidor dedicado:')
  console.log('1. Elimina el webhook: deleteWebhook')
  console.log('2. Usa polling en tu servidor dedicado')
  console.log('3. Configura las variables de entorno en el servidor')
}

// Ejecutar
testWebhookConnectivity()
  .then(() => {
    console.log('\n✅ Diagnóstico completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error en diagnóstico:', error)
    process.exit(1)
  })
