import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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
    
    // Solo SuperAdmins pueden crear usuarios manualmente
    if (!session?.user || session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { 
      name, 
      email, 
      password, 
      role = 'BASIC',
      phone,
      subscriptionPlan = 'BASIC',
      subscriptionDays,
      telegramId,
      telegramUsername
    } = await req.json()

    // Validaciones básicas
    if (!name || !email) {
      return NextResponse.json({ 
        error: 'Nombre y email son requeridos' 
      }, { status: 400 })
    }

    // Verificar que el email no exista
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ 
        error: 'Ya existe un usuario con este email' 
      }, { status: 400 })
    }

    // Preparar datos del usuario
    const userData: any = {
      name,
      email,
      emailVerified: new Date(), // Marcar como verificado
      role,
      phone: phone || null,
      subscriptionStatus: 'ACTIVE',
      subscriptionPlan,
      subscriptionActive: true,
      telegramId: telegramId || null,
      telegramUsername: telegramUsername || null,
      telegramLinked: !!(telegramId || telegramUsername)
    }

    // Si se proporciona contraseña, hashearla
    if (password) {
      userData.password = await bcrypt.hash(password, 12)
    }

    // Configurar suscripción
    if (subscriptionDays && subscriptionDays > 0) {
      userData.subscriptionExpires = new Date(Date.now() + subscriptionDays * 24 * 60 * 60 * 1000)
      userData.subscriptionEnd = new Date(Date.now() + subscriptionDays * 24 * 60 * 60 * 1000)
    } else {
      // Suscripción permanente para roles admin
      if (['SUPERADMIN', 'SUPPORTER'].includes(role)) {
        userData.subscriptionExpires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año
        userData.subscriptionEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    }

    // Si se vincula Telegram desde el inicio
    if (telegramId || telegramUsername) {
      userData.telegramLinkedAt = new Date()
    }

    // Crear usuario
    const newUser = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        phone: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        subscriptionExpires: true,
        subscriptionActive: true,
        telegramId: true,
        telegramUsername: true,
        telegramLinked: true,
        telegramLinkedAt: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: newUser
    })

  } catch (error: any) {
    console.error('Error creando usuario:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error.message 
    }, { status: 500 })
  }
}
