import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    
    // Obtener usuario completo directamente de la base de datos
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        accounts: {
          select: {
            id: true,
            provider: true,
            providerAccountId: true,
            type: true,
            scope: true
          }
        },
        sessions: {
          select: {
            id: true,
            expires: true,
            sessionToken: true
          }
        }
      }
    })
    
    // Obtener todos los usuarios para debug
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        telegramId: true,
        telegramUsername: true,
        telegramLinked: true,
        telegramLinkedAt: true,
        role: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        subscriptionActive: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return NextResponse.json({
      currentUser: user,
      session: session,
      allUsers: allUsers,
      debug: {
        sessionUser: session.user,
        dbUser: user,
        telegramMismatch: {
          sessionLinked: (session.user as any)?.telegramLinked,
          dbLinked: user?.telegramLinked,
          sessionTelegramId: (session.user as any)?.telegramId,
          dbTelegramId: user?.telegramId
        }
      }
    })
    
  } catch (error) {
    console.error('Error getting user debug info:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

// Endpoint para forzar actualización de sesión
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    
    // Obtener datos actualizados del usuario
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        telegramId: true,
        telegramLinked: true,
        subscriptionActive: true,
        subscriptionEnd: true
      }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }
    
    // Retornar datos actualizados para que el frontend actualice la sesión
    return NextResponse.json({
      success: true,
      updatedUser: {
        ...session.user,
        telegramId: user.telegramId,
        telegramLinked: user.telegramLinked,
        subscriptionActive: user.subscriptionActive,
        subscriptionEnd: user.subscriptionEnd
      }
    })
    
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
