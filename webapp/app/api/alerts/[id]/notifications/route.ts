import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// DELETE /api/alerts/[id]/notifications - Clear notifications for an alert
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const alertId = params.id

    // Here you would implement the logic to clear notifications
    // For now, we'll simulate the API call
    
    // Example implementation:
    // 1. Update the alert in the database to clear hasNotifications
    // 2. Update lastNotificationAt to null
    // 3. Send notification to Telegram bot API to sync the state
    
    const updatedAlert = {
      id: alertId,
      hasNotifications: false,
      lastNotificationAt: null,
      updatedAt: new Date().toISOString()
    }

    // Sync with Telegram bot
    try {
      await fetch(`${process.env.BOT_API_URL}/api/alerts/${alertId}/notifications`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BOT_API_SECRET}`
        },
        body: JSON.stringify({
          userId: session.user.id
        })
      })
    } catch (syncError) {
      console.error('Failed to sync notification clear with bot:', syncError)
      // Continue even if sync fails
    }

    return NextResponse.json({
      message: 'Notifications cleared successfully',
      alert: updatedAlert
    })

  } catch (error) {
    console.error('Error clearing notifications:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/alerts/[id]/notifications - Trigger a test notification
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const alertId = params.id
    const body = await request.json()

    // Example: Trigger a test notification
    const notification = {
      alertId,
      userId: session.user.id,
      type: body.type || 'price_drop',
      price: body.price,
      currency: body.currency || 'USD',
      triggeredAt: new Date().toISOString()
    }

    // Sync with Telegram bot
    try {
      await fetch(`${process.env.BOT_API_URL}/api/alerts/${alertId}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BOT_API_SECRET}`
        },
        body: JSON.stringify(notification)
      })
    } catch (syncError) {
      console.error('Failed to sync notification with bot:', syncError)
    }

    return NextResponse.json({
      message: 'Test notification sent successfully',
      notification
    })

  } catch (error) {
    console.error('Error sending test notification:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
