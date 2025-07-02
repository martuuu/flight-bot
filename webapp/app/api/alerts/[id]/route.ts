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

    const alert = await prisma.alert.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!alert) {
      return NextResponse.json({ message: 'Alert not found' }, { status: 404 })
    }

    return NextResponse.json(alert)
  } catch (error) {
    console.error('Error fetching alert:', error)
    return NextResponse.json(
      { message: 'Failed to fetch alert' },
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
    
    const alert = await prisma.alert.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!alert) {
      return NextResponse.json({ message: 'Alert not found' }, { status: 404 })
    }

    const updatedAlert = await prisma.alert.update({
      where: { id: params.id },
      data: {
        origin: body.origin,
        destination: body.destination,
        maxPrice: body.maxPrice,
        currency: body.currency || 'USD',
        departureDate: body.departureDate ? new Date(body.departureDate) : null,
        returnDate: body.returnDate ? new Date(body.returnDate) : null,
        isFlexible: body.isFlexible || false,
        adults: body.adults || 1,
        children: body.children || 0,
        infants: body.infants || 0,
        alertType: body.alertType,
        isActive: body.isActive ?? true,
        isPaused: body.isPaused ?? false,
      }
    })

    return NextResponse.json(updatedAlert)
  } catch (error) {
    console.error('Error updating alert:', error)
    return NextResponse.json(
      { message: 'Failed to update alert' },
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

    const alert = await prisma.alert.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!alert) {
      return NextResponse.json({ message: 'Alert not found' }, { status: 404 })
    }

    await prisma.alert.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Alert deleted successfully' })
  } catch (error) {
    console.error('Error deleting alert:', error)
    return NextResponse.json(
      { message: 'Failed to delete alert' },
      { status: 500 }
    )
  }
}
