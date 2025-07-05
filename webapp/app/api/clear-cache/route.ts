import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'clear-users') {
      // Eliminar todos los usuarios (excepto si queremos mantener algún admin)
      const deleteResult = await prisma.user.deleteMany({
        where: {
          role: {
            not: 'SUPERADMIN' // Mantener superadmins si los hay
          }
        }
      })
      
      return NextResponse.json({
        message: `Deleted ${deleteResult.count} users`,
        success: true
      })
    }
    
    if (action === 'clear-sessions') {
      // Limpiar sesiones y tokens
      await Promise.all([
        prisma.session.deleteMany({}),
        prisma.verificationToken.deleteMany({}),
        prisma.account.deleteMany({})
      ])
      
      return NextResponse.json({
        message: 'Cleared all sessions and tokens',
        success: true
      })
    }
    
    if (action === 'list-users') {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          telegramId: true,
          telegramLinked: true,
          telegramLinkedAt: true,
          createdAt: true,
          accounts: {
            select: {
              provider: true,
              type: true
            }
          }
        }
      })
      
      return NextResponse.json({ users })
    }
    
    return NextResponse.json({
      error: 'Invalid action'
    }, { status: 400 })
    
  } catch (error) {
    console.error('Database cleanup error:', error)
    return NextResponse.json({
      error: 'Failed to perform database operation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
