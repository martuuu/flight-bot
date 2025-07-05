import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        telegramId: true,
        telegramUsername: true,
        telegramLinked: true,
        role: true,
        createdAt: true
      }
    })
    
    return NextResponse.json({
      totalUsers: users.length,
      users: users
    })
    
  } catch (error) {
    console.error('Error getting all users:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
