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

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession | null
    
    if (!session?.user || session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { alerts: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ users })

  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession | null
    
    if (!session?.user || session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { userId, role, extendSubscription, unlinkTelegram } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID requerido' }, { status: 400 })
    }

    let updateData: any = {}

    if (role) {
      updateData.role = role
    }

    if (extendSubscription) {
      const currentEnd = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionEnd: true }
      })

      const startDate = currentEnd?.subscriptionEnd && new Date(currentEnd.subscriptionEnd) > new Date()
        ? new Date(currentEnd.subscriptionEnd)
        : new Date()

      updateData.subscriptionEnd = new Date(startDate.getTime() + extendSubscription * 24 * 60 * 60 * 1000)
      updateData.subscriptionActive = true
    }

    if (unlinkTelegram) {
      updateData.telegramId = null
      updateData.telegramLinked = false
      updateData.telegramLinkedAt = null
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    return NextResponse.json({ success: true, user: updatedUser })

  } catch (error) {
    console.error('Error actualizando usuario:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession | null
    
    if (!session?.user || session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID requerido' }, { status: 400 })
    }

    // No permitir que el admin se elimine a sí mismo
    if (userId === session.user.id) {
      return NextResponse.json({ error: 'No puedes eliminarte a ti mismo' }, { status: 400 })
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error eliminando usuario:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
