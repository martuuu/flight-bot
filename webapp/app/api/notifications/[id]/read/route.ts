import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PUT /api/notifications/[id]/read - Mark notification as read
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const notificationId = params.id

    // Here you would implement the logic to mark notification as read
    // For now, we'll simulate the API call
    
    // Example implementation:
    // 1. Update the notification in the database
    // 2. Sync with Telegram bot if needed
    
    const updatedNotification = {
      id: notificationId,
      isRead: true,
      readAt: new Date().toISOString()
    }

    // Optionally sync with Telegram bot
    try {
      await fetch(`${process.env.BOT_API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BOT_API_SECRET}`
        },
        body: JSON.stringify({
          userId: session.user.id,
          isRead: true
        })
      })
    } catch (syncError) {
      console.error('Failed to sync read status with bot:', syncError)
      // Continue even if sync fails
    }

    return NextResponse.json({
      message: 'Notification marked as read',
      notification: updatedNotification
    })

  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
