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

    const alerts = await prisma.alert.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { message: 'Failed to fetch alerts' },
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

    const body = await request.json()
    
    // Validar campos requeridos
    if (!body.origin || !body.destination || !body.maxPrice || !body.alertType) {
      return NextResponse.json(
        { message: 'Missing required fields: origin, destination, maxPrice, alertType' },
        { status: 400 }
      )
    }

    // Validar tipos de datos
    if (typeof body.maxPrice !== 'number' || body.maxPrice <= 0) {
      return NextResponse.json(
        { message: 'maxPrice must be a positive number' },
        { status: 400 }
      )
    }

    if (!['SPECIFIC', 'MONTHLY', 'FLEXIBLE'].includes(body.alertType)) {
      return NextResponse.json(
        { message: 'alertType must be SPECIFIC, MONTHLY, or FLEXIBLE' },
        { status: 400 }
      )
    }
    
    // Verificar si ya existe una alerta similar para este usuario
    const existingAlert = await prisma.alert.findFirst({
      where: {
        userId: session.user.id,
        origin: body.origin,
        destination: body.destination,
        alertType: body.alertType,
        ...(body.alertType === 'SPECIFIC' && body.departureDate 
          ? { departureDate: new Date(body.departureDate) }
          : {}),
        isActive: true
      }
    })

    if (existingAlert) {
      return NextResponse.json(
        { 
          message: `Ya tienes una alerta activa para ${body.origin} → ${body.destination}`,
          existingAlert 
        },
        { status: 409 }
      )
    }

    const alertData = {
      userId: session.user.id,
      origin: body.origin.toUpperCase(),
      destination: body.destination.toUpperCase(),
      maxPrice: parseFloat(body.maxPrice),
      currency: body.currency || 'USD',
      departureDate: body.departureDate ? new Date(body.departureDate) : null,
      returnDate: body.returnDate ? new Date(body.returnDate) : null,
      isFlexible: Boolean(body.isFlexible) || false,
      adults: parseInt(body.adults) || 1,
      children: parseInt(body.children) || 0,
      infants: parseInt(body.infants) || 0,
      alertType: body.alertType,
      isActive: true,
      isPaused: false,
    }

    console.log('Creating alert with data:', alertData)

    const newAlert = await prisma.alert.create({
      data: alertData
    })

    return NextResponse.json(newAlert, { status: 201 })
  } catch (error) {
    console.error('Error creating alert:', error)
    
    // Mejor manejo de errores de Prisma
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { message: 'Ya existe una alerta similar' },
          { status: 409 }
        )
      }
      
      if (error.message.includes('Invalid date')) {
        return NextResponse.json(
          { message: 'Fecha inválida proporcionada' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { message: 'Failed to create alert', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
