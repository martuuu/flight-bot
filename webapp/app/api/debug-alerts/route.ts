import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Temporary debug endpoint to check alerts in database
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('DEBUG - Current session:', {
      user: session?.user,
      userId: session?.user?.id
    })

    // Get all alerts (not filtered by user) for debugging
    const allAlerts = await prisma.alert.findMany({
      take: 10, // Limit to 10 for safety
      orderBy: { createdAt: 'desc' }
    })

    console.log('DEBUG - All alerts in database:', allAlerts)

    // Get all users for debugging
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true
      },
      take: 5
    })

    console.log('DEBUG - All users in database:', allUsers)

    if (session?.user?.id) {
      const userAlerts = await prisma.alert.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
      })
      
      console.log('DEBUG - Alerts for current user:', userAlerts)
    }

    return NextResponse.json({
      currentUser: session?.user,
      allAlerts,
      allUsers,
      message: 'Debug info logged to console'
    })

  } catch (error) {
    console.error('DEBUG - Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
