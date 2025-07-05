import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/bot/sync-notifications - Sync notifications with Telegram bot
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, alertId, notificationData } = body

    console.log('Sync request:', { action, alertId, notificationData, userId: session.user.id })

    switch (action) {
      case 'send_notification':
        // Mark notification as sent in database
        try {
          await prisma.alertNotification.create({
            data: {
              alertId,
              userId: session.user.id,
              type: notificationData.type || 'PRICE_ALERT',
              channel: 'WHATSAPP', // Assuming Telegram notifications
              message: notificationData.message || 'Flight notification',
              sent: true,
              sentAt: new Date(),
              price: notificationData.price,
              currency: notificationData.currency || 'USD'
            }
          })
          console.log('Notification marked as sent in database')
        } catch (dbError) {
          console.error('Error saving notification to database:', dbError)
        }
        break

      case 'clear_notifications':
        // Mark notifications as delivered for this alert
        try {
          await prisma.alertNotification.updateMany({
            where: {
              alertId,
              sent: true,
              delivered: false
            },
            data: {
              delivered: true
            }
          })
          console.log('Notifications marked as delivered in database')
        } catch (dbError) {
          console.error('Error updating notifications in database:', dbError)
        }
        break

      case 'sync_alert_status':
        // Update alert active/paused status
        try {
          await prisma.alert.update({
            where: {
              id: alertId,
              userId: session.user.id
            },
            data: {
              isActive: notificationData.status === 'ACTIVE',
              isPaused: notificationData.status === 'PAUSED',
              updatedAt: new Date()
            }
          })
          console.log('Alert status updated in database')
        } catch (dbError) {
          console.error('Error updating alert status in database:', dbError)
        }
        break

      default:
        return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
    }
    
    return NextResponse.json({
      message: 'Sync successful',
      action,
      alertId
    })

  } catch (error) {
    console.error('Error syncing with bot:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/bot/sync-notifications - Get pending notifications from database
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
      // Get recent notifications for this user
      const notifications = await prisma.alertNotification.findMany({
        where: {
          userId: session.user.id,
          sent: true,
          delivered: false
        },
        include: {
          alert: {
            select: {
              origin: true,
              destination: true,
              maxPrice: true,
              currency: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      })

      return NextResponse.json({
        notifications
      })
    } catch (dbError) {
      console.error('Error fetching notifications from database:', dbError)
      return NextResponse.json({
        message: 'Error fetching notifications',
        notifications: []
      })
    }

  } catch (error) {
    console.error('Error in GET /api/bot/sync-notifications:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
