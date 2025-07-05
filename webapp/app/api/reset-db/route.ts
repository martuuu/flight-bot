import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Manejar requests sin body
    let body: any = {}
    try {
      const text = await request.text()
      body = text ? JSON.parse(text) : {}
    } catch (e) {
      body = {}
    }
    
    const { action, confirm } = body
    
    if (action === 'reset-all' && confirm === 'RESET_EVERYTHING') {
      // Eliminar TODO - base de datos completa
      await Promise.all([
        prisma.session.deleteMany({}),
        prisma.verificationToken.deleteMany({}),
        prisma.account.deleteMany({}),
        prisma.user.deleteMany({}) // Eliminar TODOS los usuarios
      ])
      
      return NextResponse.json({
        message: 'Base de datos completamente reseteada',
        success: true
      })
    }
    
    if (action === 'clear-sessions-only') {
      // Solo limpiar sesiones
      await Promise.all([
        prisma.session.deleteMany({}),
        prisma.verificationToken.deleteMany({}),
        prisma.account.deleteMany({})
      ])
      
      return NextResponse.json({
        message: 'Sesiones y tokens limpiados',
        success: true
      })
    }
    
    if (action === 'stats') {
      // Mostrar estadísticas de la base de datos
      const stats = await Promise.all([
        prisma.user.count(),
        prisma.account.count(),
        prisma.session.count(),
        prisma.verificationToken.count()
      ])
      
      return NextResponse.json({
        stats: {
          users: stats[0],
          accounts: stats[1],
          sessions: stats[2],
          verificationTokens: stats[3]
        }
      })
    }
    
    return NextResponse.json({
      error: 'Acción no válida',
      availableActions: [
        'reset-all (require confirm: "RESET_EVERYTHING")',
        'clear-sessions-only',
        'stats'
      ]
    }, { status: 400 })
    
  } catch (error) {
    console.error('Database reset error:', error)
    return NextResponse.json({
      error: 'Failed to perform database operation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
