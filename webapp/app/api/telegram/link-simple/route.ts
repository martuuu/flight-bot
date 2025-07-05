import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface ExtendedUser {
  id: string
  role: 'SUPERADMIN' | 'SUPPORTER' | 'PREMIUM' | 'BASIC' | 'TESTING'
  email?: string | null
  name?: string | null
  telegramId?: string | null
  telegramLinked?: boolean
}

interface ExtendedSession {
  user: ExtendedUser
}

// Store temporal para códigos de vinculación (en producción usar Redis)
const linkingCodes = new Map<string, { userId: string; expires: number }>()

/**
 * Endpoint mejorado para vinculación Telegram-Webapp
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'initiate':
        return await initiateLinking(body);
      case 'confirm_from_bot':
        return await confirmLinkingFromBot(body);
      default:
        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error en vinculación Telegram:', error);
    return NextResponse.json({
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

/**
 * Iniciar proceso de vinculación desde la webapp
 */
async function initiateLinking(body: any) {
  const session = await getServerSession(authOptions) as ExtendedSession | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Verificar si ya está vinculado
  if (session.user.telegramLinked && session.user.telegramId) {
    return NextResponse.json({
      error: 'Ya tienes una cuenta de Telegram vinculada',
      telegramId: session.user.telegramId
    }, { status: 409 });
  }

  // Generar código de vinculación único de 6 dígitos
  const linkingCode = Math.random().toString().substring(2, 8);
  const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutos

  // Guardar código temporalmente (en producción usar Redis)
  linkingCodes.set(linkingCode, {
    userId: session.user.id,
    expires: expirationTime
  });

  // Limpiar códigos expirados
  cleanExpiredCodes();

  return NextResponse.json({
    success: true,
    linkingCode,
    message: 'Código de vinculación generado. Envía /link ' + linkingCode + ' en el bot de Telegram.',
    botUrl: `https://t.me/${process.env.TELEGRAM_BOT_USERNAME || 'ticketscannerbot_bot'}`,
    expiresIn: 15 // minutos
  });
}

/**
 * Confirmar vinculación desde el bot de Telegram
 */
async function confirmLinkingFromBot(body: any) {
  const { telegramId, telegramUsername, telegramFirstName, telegramLastName, linkingCode } = body;

  if (!telegramId || !linkingCode) {
    return NextResponse.json({
      error: 'ID de Telegram y código de vinculación requeridos'
    }, { status: 400 });
  }

  // Buscar código de vinculación
  const linkingData = linkingCodes.get(linkingCode);

  if (!linkingData) {
    return NextResponse.json({
      error: 'Código de vinculación inválido o expirado'
    }, { status: 400 });
  }

  if (Date.now() > linkingData.expires) {
    linkingCodes.delete(linkingCode);
    return NextResponse.json({
      error: 'Código de vinculación expirado'
    }, { status: 400 });
  }

  // Verificar que el telegramId no esté ya vinculado a otra cuenta
  const existingLink = await prisma.user.findFirst({
    where: {
      telegramId: telegramId.toString(),
      NOT: { id: linkingData.userId }
    }
  });

  if (existingLink) {
    return NextResponse.json({
      error: 'Este ID de Telegram ya está vinculado a otra cuenta'
    }, { status: 409 });
  }

  try {
    // Buscar o crear registro en TelegramUser
    let telegramUser = await prisma.telegramUser.findUnique({
      where: { telegramId: telegramId.toString() }
    });

    if (!telegramUser) {
      telegramUser = await prisma.telegramUser.create({
        data: {
          telegramId: telegramId.toString(),
          username: telegramUsername,
          firstName: telegramFirstName || '',
          lastName: telegramLastName || '',
          isLinked: true,
          linkedUserId: linkingData.userId,
          lastActivity: new Date()
        }
      });
    } else {
      // Actualizar registro existente
      telegramUser = await prisma.telegramUser.update({
        where: { id: telegramUser.id },
        data: {
          isLinked: true,
          linkedUserId: linkingData.userId,
          username: telegramUsername || telegramUser.username,
          firstName: telegramFirstName || telegramUser.firstName,
          lastName: telegramLastName || telegramUser.lastName,
          lastActivity: new Date()
        }
      });
    }

    // Actualizar usuario de webapp
    const updatedUser = await prisma.user.update({
      where: { id: linkingData.userId },
      data: {
        telegramId: telegramId.toString(),
        telegramUsername: telegramUsername,
        telegramLinked: true,
        telegramLinkedAt: new Date(),
      }
    });

    // Sincronizar alertas si existen
    await syncAlertsAfterLinking(linkingData.userId, telegramUser.id);

    // Limpiar código usado
    linkingCodes.delete(linkingCode);

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        telegramId: updatedUser.telegramId,
        telegramLinked: updatedUser.telegramLinked,
        role: updatedUser.role
      },
      message: '¡Vinculación exitosa! Ahora puedes usar el bot de Telegram.'
    });

  } catch (error) {
    console.error('Error completando vinculación:', error);
    return NextResponse.json({
      error: 'Error completando la vinculación'
    }, { status: 500 });
  }
}

/**
 * Sincronizar alertas después de vincular cuentas
 */
async function syncAlertsAfterLinking(userId: string, telegramUserId: string) {
  try {
    // Obtener alertas de Telegram
    const telegramAlerts = await prisma.flightAlert.findMany({
      where: { telegramUserId, isActive: true }
    })

    // Actualizar alertas de Telegram para vincularlas al usuario de webapp
    await prisma.flightAlert.updateMany({
      where: { telegramUserId, isActive: true },
      data: { userId }
    })

    console.log(`Sincronizadas ${telegramAlerts.length} alertas de Telegram con usuario ${userId}`)

  } catch (error) {
    console.error('Error sincronizando alertas:', error)
    // No fallar la vinculación por errores de sincronización
  }
}

/**
 * Limpiar códigos expirados
 */
function cleanExpiredCodes() {
  const now = Date.now()
  const codesToDelete: string[] = []
  
  linkingCodes.forEach((data, code) => {
    if (now > data.expires) {
      codesToDelete.push(code)
    }
  })
  
  codesToDelete.forEach(code => linkingCodes.delete(code))
}

/**
 * Desvincular cuenta de Telegram
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession | null
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener datos antes de desvincular
    const userBefore = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { telegramId: true }
    })

    if (!userBefore?.telegramId) {
      return NextResponse.json({ 
        error: 'No tienes una cuenta de Telegram vinculada' 
      }, { status: 400 })
    }

    // Desvincular en TelegramUser
    await prisma.telegramUser.updateMany({
      where: { telegramId: userBefore.telegramId },
      data: {
        isLinked: false,
        linkedUserId: null
      }
    })

    // Desvincular en User
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        telegramId: null,
        telegramUsername: null,
        telegramLinked: false,
        telegramLinkedAt: null,
      }
    })

    // Mantener alertas de Telegram pero desvincularlas del usuario
    await prisma.flightAlert.updateMany({
      where: { userId: session.user.id },
      data: { userId: null }
    })

    return NextResponse.json({
      success: true,
      message: 'Cuenta de Telegram desvinculada correctamente'
    })

  } catch (error) {
    console.error('Error al desvincular Telegram:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
