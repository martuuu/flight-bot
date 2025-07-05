import { NextRequest, NextResponse } from 'next/server'

/**
 * Webhook de Telegram para Netlify Functions
 * Maneja los comandos del bot directamente desde Netlify
 */

interface TelegramMessage {
  message_id: number
  from: {
    id: number
    is_bot: boolean
    first_name: string
    last_name?: string
    username?: string
  }
  chat: {
    id: number
    type: string
  }
  date: number
  text?: string
}

interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!

async function sendTelegramMessage(chatId: number, text: string, extra: any = {}) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        ...extra
      })
    })

    return await response.json()
  } catch (error) {
    console.error('Error enviando mensaje:', error)
    return { ok: false, error }
  }
}

async function handleLinkCommand(chatId: number, user: any, args: string[]) {
  if (args.length === 0) {
    const helpMessage = `🔗 **Vincular con Webapp**

Para vincular tu cuenta de Telegram con la webapp:

1️⃣ Ve a la webapp y genera un código de vinculación
2️⃣ Envía el comando: \`/link CODIGO\`

🌐 **Webapp:** ${process.env.NEXTAUTH_URL || 'https://flight-bot.com'}`

    await sendTelegramMessage(chatId, helpMessage, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🌐 Ir a Webapp', url: process.env.NEXTAUTH_URL || 'https://flight-bot.com' }
          ]
        ]
      }
    })
    return
  }

  const linkingCode = args[0]

  // Validar formato del código (6 dígitos)
  if (!/^\d{6}$/.test(linkingCode)) {
    await sendTelegramMessage(chatId, '❌ Código inválido. Debe ser un código de 6 dígitos.')
    return
  }

  // Llamar al endpoint de la webapp para confirmar la vinculación
  const webappUrl = process.env.NEXTAUTH_URL || 'https://flight-bot.com'
  
  try {
    const response = await fetch(`${webappUrl}/api/telegram/link-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'confirm_from_bot',
        telegramId: user.id.toString(),
        telegramUsername: user.username,
        telegramFirstName: user.first_name,
        telegramLastName: user.last_name,
        linkingCode: linkingCode
      })
    })

    const result = await response.json()

    if (result.success) {
      const successMessage = `✅ **¡Vinculación exitosa!**

🎉 Tu cuenta de Telegram está ahora vinculada con la webapp.

**¿Qué puedes hacer ahora?**
• 🌐 Gestionar alertas desde la webapp
• 🔔 Recibir notificaciones aquí
• 📊 Ver estadísticas detalladas en la webapp`

      await sendTelegramMessage(chatId, successMessage, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🌐 Ir al Dashboard', url: `${webappUrl}/dashboard` }
            ]
          ]
        }
      })

      console.log('Usuario vinculado exitosamente:', { 
        telegramUserId: user.id, 
        username: user.username,
        linkingCode 
      })

    } else {
      let errorMessage = '❌ No se pudo completar la vinculación.'
      
      if (result.error === 'Código de vinculación inválido o expirado') {
        errorMessage += '\n\n🕐 El código ha expirado o es incorrecto. Genera uno nuevo desde la webapp.'
      } else if (result.error && result.error.includes('ya está vinculado')) {
        errorMessage += '\n\n🔗 Esta cuenta de Telegram ya está vinculada a otra cuenta.'
      }

      await sendTelegramMessage(chatId, errorMessage)
    }

  } catch (fetchError) {
    console.error('Error conectando con webapp:', fetchError)
    await sendTelegramMessage(chatId, '❌ Error conectando con la webapp. Intenta más tarde.')
  }
}

async function handleStartCommand(chatId: number, user: any) {
  const welcomeMessage = `👋 ¡Hola ${user.first_name}!

🎫 **Bienvenido al Flight Bot**

Para comenzar a usar el bot, necesitas vincular tu cuenta con la webapp:

1️⃣ Ve a la webapp
2️⃣ Crea tu cuenta o inicia sesión
3️⃣ Ve a "Perfil" → "Vincular Telegram"
4️⃣ Usa el código que te dé con \`/link CODIGO\`

🌐 **Webapp:** ${process.env.NEXTAUTH_URL || 'https://flight-bot.com'}`

  await sendTelegramMessage(chatId, welcomeMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🌐 Ir a Webapp', url: process.env.NEXTAUTH_URL || 'https://flight-bot.com' }
        ]
      ]
    }
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as TelegramUpdate

    // Verificar que sea un mensaje válido
    if (!body.message || !body.message.text) {
      return NextResponse.json({ ok: true })
    }

    const message = body.message
    const chatId = message.chat.id
    const user = message.from
    const text = message.text!

    console.log(`Mensaje recibido de ${user.username}: ${text}`)

    // Procesar comandos
    if (text.startsWith('/')) {
      const [command, ...args] = text.split(' ')
      
      switch (command) {
        case '/start':
          await handleStartCommand(chatId, user)
          break
          
        case '/link':
          await handleLinkCommand(chatId, user, args)
          break
          
        default:
          await sendTelegramMessage(chatId, `🤖 Comando no reconocido: ${command}

Comandos disponibles:
• \`/start\` - Información de bienvenida
• \`/link CODIGO\` - Vincular cuenta con webapp

Para más funciones, usa la webapp: ${process.env.NEXTAUTH_URL || 'https://flight-bot.com'}`)
      }
    } else {
      // Mensaje no es comando
      await sendTelegramMessage(chatId, `🤖 Hola ${user.first_name}!

Para usar el bot, prueba estos comandos:
• \`/start\` - Información de bienvenida  
• \`/link CODIGO\` - Vincular con webapp

🌐 Webapp: ${process.env.NEXTAUTH_URL || 'https://flight-bot.com'}`)
    }

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error('Error en webhook de Telegram:', error)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}
