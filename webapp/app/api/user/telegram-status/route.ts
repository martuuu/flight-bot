import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener datos actualizados del usuario desde la base de datos
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        telegramId: true,
        telegramLinked: true,
        telegramLinkedAt: true,
        telegramUsername: true,
        subscriptionEnd: true,
        subscriptionActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        telegramId: user.telegramId,
        telegramLinked: user.telegramLinked,
        telegramLinkedAt: user.telegramLinkedAt,
        telegramUsername: user.telegramUsername,
        subscriptionEnd: user.subscriptionEnd,
        subscriptionActive: user.subscriptionActive
      }
    })

  } catch (error) {
    console.error('Error obteniendo estado de Telegram:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
