import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 })
    }

    // Obtener datos del usuario desde la base de datos
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
    console.error('Error en test-status:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: String(error)
    }, { status: 500 })
  }
}
