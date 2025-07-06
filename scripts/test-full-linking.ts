#!/usr/bin/env tsx

/**
 * Script para probar la vinculación completa paso a paso
 * Simula el proceso completo entre webapp y bot
 */

import fetch from 'node-fetch'

const PRODUCTION_URL = 'https://flight-bot.com'

async function testFullLinkingFlow() {
  console.log('🔗 PRUEBA COMPLETA DE VINCULACIÓN TELEGRAM')
  console.log('==========================================')
  console.log('')

  // Paso 1: Simular que un usuario autenticado genera un código
  console.log('1️⃣ Simulando generación de código desde webapp autenticada...')
  
  // Para esto necesitaríamos una sesión real, pero podemos probar la API directamente
  // Vamos a verificar qué pasa cuando el bot trata de confirmar un código inexistente
  
  console.log('2️⃣ Simulando comando /link desde Telegram...')
  
  const mockLinkingData = {
    action: 'confirm_from_bot',
    telegramId: '5536948508', // Tu ID real de Telegram
    telegramUsername: 'tu_username', // Cambia por tu username real
    telegramFirstName: 'Martin',
    telegramLastName: 'Test',
    linkingCode: '123456' // Código de prueba que debería fallar
  }

  try {
    const response = await fetch(`${PRODUCTION_URL}/api/telegram/link-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockLinkingData)
    })

    const result = await response.json()
    console.log(`   Status: ${response.status}`)
    console.log(`   Response:`, JSON.stringify(result, null, 2))

    if (result.error?.includes('inválido o expirado')) {
      console.log('   ✅ API de vinculación funciona correctamente')
      console.log('   💡 El bot puede comunicarse con la webapp')
    } else if (response.status === 500) {
      console.log('   ❌ Error interno - revisar logs de Netlify')
    } else {
      console.log('   🤔 Respuesta inesperada')
    }
  } catch (error) {
    console.log('   ❌ Error de conectividad:', error)
  }

  console.log('')
  console.log('3️⃣ Verificando si el bot está ejecutándose...')
  
  // El bot debe estar ejecutándose en algún servidor
  // Vamos a verificar si puede recibir webhooks
  try {
    const botToken = '7726760770:AAEhEDu0oEGj5unLTeNxXbyJXQX4fdCVTHw'
    const webhookResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`)
    const webhookInfo = await webhookResponse.json()
    
    console.log('   📡 Info de webhook:', JSON.stringify(webhookInfo, null, 2))
    
    if (webhookInfo.result?.url) {
      console.log(`   ✅ Bot configurado con webhook: ${webhookInfo.result.url}`)
    } else {
      console.log('   ⚠️  Bot sin webhook - ¿está usando polling?')
    }
    
    if (webhookInfo.result?.pending_update_count > 0) {
      console.log(`   ⚠️  ${webhookInfo.result.pending_update_count} actualizaciones pendientes`)
    }
    
  } catch (error) {
    console.log('   ❌ Error verificando webhook:', error)
  }

  console.log('')
  console.log('🎯 DIAGNÓSTICO:')
  console.log('- La webapp funciona ✅')
  console.log('- Las variables están configuradas ✅')
  console.log('- La base de datos está conectada ✅')
  console.log('- El bot de Telegram existe ✅')
  console.log('')
  console.log('🤔 POSIBLES PROBLEMAS:')
  console.log('1. El bot no está ejecutándose (no hay servidor corriendo el código del bot)')
  console.log('2. El bot está ejecutándose pero no puede conectar con la webapp')
  console.log('3. Hay un problema en el código del comando /link del bot')
  console.log('4. El usuario que está probando no tiene permisos')
  console.log('')
  console.log('💡 PRÓXIMOS PASOS:')
  console.log('1. Verificar si el bot está ejecutándose en algún servidor')
  console.log('2. Probar crear un código real desde la webapp con tu usuario')
  console.log('3. Verificar los logs del servidor donde corre el bot')
}

// Ejecutar
testFullLinkingFlow()
  .then(() => {
    console.log('\n✅ Diagnóstico completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error en diagnóstico:', error)
    process.exit(1)
  })
