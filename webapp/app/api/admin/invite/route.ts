import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendInvitationEmail } from '@/lib/email'

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
    
    if (!session?.user || session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { email, role } = await req.json()

    if (!email || !role) {
      return NextResponse.json({ error: 'Email y role son requeridos' }, { status: 400 })
    }

    if (!['SUPERADMIN', 'SUPPORTER', 'PREMIUM', 'BASIC', 'TESTING'].includes(role)) {
      return NextResponse.json({ error: 'Role inválido' }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 })
    }

    // Generar token de invitación
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas

    // Para ahora, solo enviamos el email (la lógica de invitación se puede implementar más tarde)
    // TODO: Implementar modelo de invitación en Prisma
    
    // Enviar email de invitación
    await sendInvitationEmail(email, session.user.name || 'Administrator')

    return NextResponse.json({ 
      message: 'Invitación enviada correctamente',
      invitation: {
        email,
        role,
        token,
        expiresAt
      }
    })

  } catch (error) {
    console.error('Error sending invitation:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
