#!/usr/bin/env tsx

/**
 * Script para configurar el bot en modo webhook para Netlify
 * Esto permite que el bot responda sin necesidad de un servidor dedicado
 */

import fetch from 'node-fetch'

const BOT_TOKEN = '7726760770:AAEhEDu0oEGj5unLTeNxXbyJXQX4fdCVTHw'
const WEBHOOK_URL = 'https://flight-bot.com/api/telegram/webhook'

async function setupTelegramWebhook() {
  console.log('🔧 CONFIGURANDO WEBHOOK DE TELEGRAM PARA NETLIFY')
  console.log('================================================')
  console.log(`🤖 Bot Token: ${BOT_TOKEN.substring(0, 20)}...`)
  console.log(`🌐 Webhook URL: ${WEBHOOK_URL}`)
  console.log('')

  try {
    // 1. Eliminar webhook existente
    console.log('1️⃣ Eliminando webhook existente...')
    const deleteResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`)
    const deleteResult = await deleteResponse.json()
    console.log('   Resultado:', deleteResult.description)

    // 2. Configurar nuevo webhook
    console.log('2️⃣ Configurando nuevo webhook...')
    const setWebhookResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        allowed_updates: ['message', 'callback_query'],
        drop_pending_updates: true
      })
    })

    const setWebhookResult = await setWebhookResponse.json()
    
    if (setWebhookResult.ok) {
      console.log('   ✅ Webhook configurado exitosamente!')
      console.log('   📄 Descripción:', setWebhookResult.description)
    } else {
      console.log('   ❌ Error configurando webhook:', setWebhookResult.description)
    }

    // 3. Verificar configuración
    console.log('3️⃣ Verificando configuración...')
    const infoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`)
    const infoResult = await infoResponse.json()
    
    console.log('   📊 Info del webhook:')
    console.log('   - URL:', infoResult.result.url)
    console.log('   - Pendientes:', infoResult.result.pending_update_count)
    console.log('   - Último error:', infoResult.result.last_error_message || 'Ninguno')

    // 4. Enviar mensaje de prueba
    console.log('4️⃣ Enviando mensaje de prueba...')
    const testMessage = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: '5536948508', // Tu chat ID
        text: '🔧 Webhook configurado correctamente!\n\nPrueba: /link 123456',
        parse_mode: 'Markdown'
      })
    })

    const testResult = await testMessage.json()
    if (testResult.ok) {
      console.log('   ✅ Mensaje de prueba enviado!')
    } else {
      console.log('   ❌ Error enviando mensaje:', testResult.description)
    }

  } catch (error) {
    console.error('💥 Error configurando webhook:', error)
  }
}

// Ejecutar
setupTelegramWebhook()
  .then(() => {
    console.log('\n🎉 Configuración de webhook completada!')
    console.log('\n📋 PRÓXIMOS PASOS:')
    console.log('1. Crear el endpoint /api/telegram/webhook en Netlify')
    console.log('2. Probar el comando /link en Telegram')
    console.log('3. Verificar los logs de Netlify Functions')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error)
    process.exit(1)
  })
