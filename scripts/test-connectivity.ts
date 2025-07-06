#!/usr/bin/env tsx

/**
 * Script para probar la conectividad del bot con la webapp
 */

import fetch from 'node-fetch'

async function testConnectivity() {
  console.log('🌐 PRUEBA DE CONECTIVIDAD BOT -> WEBAPP')
  console.log('=====================================')
  console.log('')

  const webappUrl = process.env.NEXTAUTH_URL || 'https://flight-bot.com'
  console.log(`📍 URL objetivo: ${webappUrl}`)
  console.log('')

  // Test 1: Conectividad básica
  console.log('1️⃣ Probando conectividad básica...')
  try {
    const response = await fetch(webappUrl, {
      method: 'GET',
      timeout: 10000, // 10 segundos timeout
      headers: {
        'User-Agent': 'FlightBot/1.0'
      }
    })
    
    console.log(`   Status: ${response.status}`)
    console.log(`   Headers: ${JSON.stringify(Object.fromEntries(response.headers), null, 2)}`)
    
    if (response.ok) {
      console.log('   ✅ Conectividad básica OK')
    } else {
      console.log('   ❌ Error en respuesta HTTP')
    }
  } catch (error) {
    console.log('   ❌ Error de conectividad:', error.message)
    console.log('   📋 Detalles:', error)
  }

  console.log('')

  // Test 2: API específica de vinculación
  console.log('2️⃣ Probando API de vinculación...')
  try {
    const apiUrl = `${webappUrl}/api/telegram/link-simple`
    console.log(`   📍 API URL: ${apiUrl}`)
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FlightBot/1.0'
      },
      body: JSON.stringify({
        action: 'confirm_from_bot',
        telegramId: '5536948508',
        telegramUsername: 'test',
        telegramFirstName: 'Test',
        telegramLastName: 'User',
        linkingCode: '123456'
      }),
      timeout: 10000
    })

    console.log(`   Status: ${response.status}`)
    const result = await response.json()
    console.log(`   Response:`, JSON.stringify(result, null, 2))
    
    if (response.status === 400 && result.error?.includes('inválido')) {
      console.log('   ✅ API responde correctamente (código inválido esperado)')
    } else if (response.status === 500) {
      console.log('   ❌ Error interno del servidor')
    } else {
      console.log('   🤔 Respuesta inesperada')
    }

  } catch (error) {
    console.log('   ❌ Error en API:', error.message)
    console.log('   📋 Detalles:', error)
  }

  console.log('')

  // Test 3: DNS resolution
  console.log('3️⃣ Probando resolución DNS...')
  try {
    const { exec } = require('child_process')
    const util = require('util')
    const execPromise = util.promisify(exec)
    
    const { stdout } = await execPromise('nslookup flight-bot.com')
    console.log('   ✅ DNS OK')
    console.log('   📋 Resultado:', stdout.split('\n').slice(0, 4).join('\n'))
  } catch (error) {
    console.log('   ❌ Error DNS:', error.message)
  }

  console.log('')
  console.log('🎯 DIAGNÓSTICO:')
  
  if (webappUrl.includes('localhost')) {
    console.log('⚠️  PROBLEMA: URL apunta a localhost pero debería ser https://flight-bot.com')
  } else if (!webappUrl.includes('https://')) {
    console.log('⚠️  PROBLEMA: URL no usa HTTPS')
  } else {
    console.log('✅ URL parece correcta')
  }
  
  console.log('')
  console.log('🛠️  SOLUCIONES:')
  console.log('1. Verificar que NEXTAUTH_URL=https://flight-bot.com')
  console.log('2. Probar con curl desde terminal: curl https://flight-bot.com')
  console.log('3. Verificar firewall/antivirus')
  console.log('4. Intentar con HTTP timeout mayor')
}

testConnectivity()
  .then(() => {
    console.log('\n✅ Test de conectividad completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error en test:', error)
    process.exit(1)
  })
