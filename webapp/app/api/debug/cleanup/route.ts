import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { action, userId } = await req.json()
    
    if (action === 'delete-telegram-user' && userId) {
      // Eliminar usuario de Telegram duplicado
      await prisma.user.delete({
        where: { id: userId }
      })
      
      return NextResponse.json({
        success: true,
        message: 'Usuario de Telegram eliminado'
      })
    }
    
    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
    
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error.message 
    }, { status: 500 })
  }
}
