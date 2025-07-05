import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST /api/notifications/clear - Clear all notifications for the user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Here you would implement the logic to clear all notifications
    // For now, we'll simulate the API call
    
    // Example implementation:
    // 1. Delete all notifications for the user from the database
    // 2. Sync with Telegram bot
    
    const clearedCount = 0 // This would be the actual count from database

    // Sync with Telegram bot
    try {
      await fetch(`${process.env.BOT_API_URL}/api/notifications/clear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BOT_API_SECRET}`
        },
        body: JSON.stringify({
          userId: session.user.id
        })
      })
    } catch (syncError) {
      console.error('Failed to sync clear action with bot:', syncError)
      // Continue even if sync fails
    }

    return NextResponse.json({
      message: 'All notifications cleared',
      clearedCount
    })

  } catch (error) {
    console.error('Error clearing notifications:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
