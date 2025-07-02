import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or requesting their own data
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    const isAdmin = currentUser && ['SUPERADMIN', 'SUPPORTER'].includes(currentUser.role)
    const isOwnData = session.user.id === params.id

    if (!isAdmin && !isOwnData) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
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
        alerts: {
          select: {
            id: true,
            origin: true,
            destination: true,
            maxPrice: true,
            alertType: true,
            isActive: true,
            isPaused: true,
            createdAt: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { message: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Check if user is admin or updating their own data
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    const isAdmin = currentUser && ['SUPERADMIN', 'SUPPORTER'].includes(currentUser.role)
    const isOwnData = session.user.id === params.id

    if (!isAdmin && !isOwnData) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Prepare update data based on permissions
    const updateData: any = {}

    // Users can update their own basic info
    if (body.name !== undefined) updateData.name = body.name
    if (body.telegramUsername !== undefined) updateData.telegramUsername = body.telegramUsername

    // Only admins can update these fields
    if (isAdmin) {
      if (body.role !== undefined) updateData.role = body.role
      if (body.subscriptionStatus !== undefined) updateData.subscriptionStatus = body.subscriptionStatus
      if (body.subscriptionPlan !== undefined) updateData.subscriptionPlan = body.subscriptionPlan
      if (body.subscriptionExpires !== undefined) {
        updateData.subscriptionExpires = body.subscriptionExpires ? new Date(body.subscriptionExpires) : null
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { message: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is superadmin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!currentUser || currentUser.role !== 'SUPERADMIN') {
      return NextResponse.json({ message: 'Forbidden - Superadmin access required' }, { status: 403 })
    }

    // Don't allow deleting yourself
    if (session.user.id === params.id) {
      return NextResponse.json({ message: 'Cannot delete your own account' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { message: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
