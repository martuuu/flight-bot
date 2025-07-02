import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!currentUser || !['SUPERADMIN', 'SUPPORTER'].includes(currentUser.role)) {
      return NextResponse.json({ message: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        subscriptionExpires: true,
        telegramLinked: true,
        telegramUsername: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            alerts: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { message: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!currentUser || currentUser.role !== 'SUPERADMIN') {
      return NextResponse.json({ message: 'Forbidden - Superadmin access required' }, { status: 403 })
    }

    const body = await request.json()
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        role: body.role || 'BASIC',
        subscriptionStatus: body.subscriptionStatus || 'ACTIVE',
        subscriptionPlan: body.subscriptionPlan || 'BASIC',
        subscriptionExpires: body.subscriptionExpires ? new Date(body.subscriptionExpires) : null,
        telegramUsername: body.telegramUsername || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        subscriptionExpires: true,
        telegramLinked: true,
        telegramUsername: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { message: 'Failed to create user' },
      { status: 500 }
    )
  }
}
