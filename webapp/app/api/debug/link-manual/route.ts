import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { webappUserId, telegramId, telegramUsername } = await req.json()
    
    console.log('🔗 Vinculación manual forzada:', {
      webappUserId,
      telegramId,
      telegramUsername
    })
    
    // Actualizar usuario en la base de datos
    const updatedUser = await prisma.user.update({
      where: { id: webappUserId },
      data: {
        telegramId: telegramId.toString(),
        telegramUsername: telegramUsername || `user_${telegramId}`,
        telegramLinked: true,
        telegramLinkedAt: new Date()
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Vinculación manual exitosa',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        telegramId: updatedUser.telegramId,
        telegramLinked: updatedUser.telegramLinked,
        role: updatedUser.role
      }
    })
    
  } catch (error: any) {
    console.error('Error en vinculación manual:', error)
    return NextResponse.json({ 
      error: 'Error en vinculación manual',
      details: error.message 
    }, { status: 500 })
  }
}
