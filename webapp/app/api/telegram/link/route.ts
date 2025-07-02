import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Extiende el tipo de sesión
interface ExtendedUser {
  id: string
  role: 'SUPERADMIN' | 'SUPPORTER' | 'PREMIUM' | 'BASIC' | 'TESTING'
  email?: string | null
  name?: string | null
  image?: string | null
}

interface ExtendedSession {
  user: ExtendedUser
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession | null
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { telegramId, telegramUsername } = await req.json()

    if (!telegramId) {
      return NextResponse.json({ error: 'ID de Telegram requerido' }, { status: 400 })
    }

    // Verificar que el telegramId no esté ya en uso por otro usuario
    const existingUser = await prisma.user.findFirst({
      where: {
        telegramId: telegramId.toString(),
        NOT: { id: session.user.id }
      }
    })

    if (existingUser) {
      return NextResponse.json({ 
        error: 'Este ID de Telegram ya está vinculado a otra cuenta' 
      }, { status: 409 })
    }

    // Actualizar usuario con datos de Telegram
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        telegramId: telegramId.toString(),
        telegramLinked: true,
        telegramLinkedAt: new Date(),
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        telegramId: updatedUser.telegramId,
        telegramLinked: updatedUser.telegramLinked,
        role: updatedUser.role
      }
    })

  } catch (error) {
    console.error('Error al vincular Telegram:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Desvincular Telegram del usuario
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        telegramId: null,
        telegramLinked: false,
        telegramLinkedAt: null,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Telegram desvinculado correctamente'
    })

  } catch (error) {
    console.error('Error al desvincular Telegram:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
