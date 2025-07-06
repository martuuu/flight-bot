#!/usr/bin/env tsx

/**
 * Script para preparar el bot para servidor dedicado
 * Elimina webhooks y configura para polling
 */

import fetch from 'node-fetch'

const BOT_TOKEN = '7726760770:AAEhEDu0oEGj5unLTeNxXbyJXQX4fdCVTHw'

async function setupBotForDedicatedServer() {
  console.log('🖥️  CONFIGURANDO BOT PARA SERVIDOR DEDICADO')
  console.log('==========================================')
  console.log('')

  try {
    // 1. Eliminar webhook para usar polling
    console.log('1️⃣ Eliminando webhook (cambio a polling)...')
    const deleteResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`, {
      method: 'POST'
    })
    const deleteResult = await deleteResponse.json()
    
    if (deleteResult.ok) {
      console.log('   ✅ Webhook eliminado exitosamente')
      console.log('   📄 Descripción:', deleteResult.description)
    } else {
      console.log('   ❌ Error eliminando webhook:', deleteResult.description)
    }

    // 2. Verificar que no hay webhook
    console.log('2️⃣ Verificando configuración...')
    const infoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`)
    const infoResult = await infoResponse.json()
    
    console.log('   📊 Estado actual:')
    console.log(`   - URL: ${infoResult.result.url || 'NINGUNO (correcto para polling)'}`)
    console.log(`   - Pendientes: ${infoResult.result.pending_update_count || 0}`)

    if (!infoResult.result.url) {
      console.log('   ✅ Bot configurado para polling')
    } else {
      console.log('   ❌ Webhook aún configurado')
    }

    // 3. Limpiar actualizaciones pendientes
    console.log('3️⃣ Limpiando actualizaciones pendientes...')
    const updatesResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=-1`)
    const updatesResult = await updatesResponse.json()
    
    if (updatesResult.ok) {
      console.log(`   ✅ ${updatesResult.result.length} actualizaciones limpiadas`)
    }

    // 4. Enviar mensaje de confirmación
    console.log('4️⃣ Enviando mensaje de configuración...')
    const messageResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: '5536948508', // Tu chat ID
        text: `🖥️ **Bot configurado para servidor dedicado**

✅ Webhook eliminado
✅ Modo polling activado
✅ Listo para servidor dedicado

**Próximos pasos:**
1. Configura tu servidor Linux
2. Instala Node.js 18+
3. Clona el repositorio
4. Configura las variables de entorno
5. Ejecuta: \`npm run start-bot\`

Una vez que tengas el bot ejecutándose en tu servidor, podrás usar todos los comandos normalmente.`,
        parse_mode: 'Markdown'
      })
    })

    const messageResult = await messageResponse.json()
    if (messageResult.ok) {
      console.log('   ✅ Mensaje de confirmación enviado')
    }

    console.log('')
    console.log('🎉 CONFIGURACIÓN COMPLETADA')
    console.log('')
    console.log('📋 INSTRUCCIONES PARA SERVIDOR DEDICADO:')
    console.log('')
    console.log('1. **Preparar servidor (Ubuntu/Debian):**')
    console.log('   ```bash')
    console.log('   sudo apt update && sudo apt upgrade -y')
    console.log('   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -')
    console.log('   sudo apt-get install -y nodejs git')
    console.log('   ```')
    console.log('')
    console.log('2. **Clonar repositorio:**')
    console.log('   ```bash')
    console.log('   git clone https://github.com/martuuu/flight-bot.git')
    console.log('   cd flight-bot')
    console.log('   npm install')
    console.log('   ```')
    console.log('')
    console.log('3. **Configurar variables de entorno:**')
    console.log('   ```bash')
    console.log('   cp .env.example .env.production')
    console.log('   nano .env.production')
    console.log('   # Configura:')
    console.log('   # - DATABASE_URL (Neon PostgreSQL)')
    console.log('   # - TELEGRAM_BOT_TOKEN')
    console.log('   # - NEXTAUTH_URL=https://flight-bot.com')
    console.log('   ```')
    console.log('')
    console.log('4. **Ejecutar bot:**')
    console.log('   ```bash')
    console.log('   npm run start-bot')
    console.log('   # o para desarrollo:')
    console.log('   npm run dev')
    console.log('   ```')
    console.log('')
    console.log('5. **Configurar como servicio (opcional):**')
    console.log('   ```bash')
    console.log('   npm run pm2:start')
    console.log('   ```')

  } catch (error) {
    console.error('💥 Error configurando bot:', error)
  }
}

// Ejecutar
setupBotForDedicatedServer()
  .then(() => {
    console.log('\n✅ Bot listo para servidor dedicado!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error)
    process.exit(1)
  })
