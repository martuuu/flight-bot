import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import path from 'path'
import Database from 'better-sqlite3'

// Simple AlertManager-like functionality directly in the endpoint
class SimpleAlertReader {
  private db: Database.Database

  constructor(dbPath: string) {
    this.db = new Database(dbPath)
  }

  getUserAlerts(userId: number): any[] {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM flight_alerts 
        WHERE user_id = ? AND is_active = 1 
        ORDER BY created_at DESC
      `)

      const rows = stmt.all(userId) as any[]
      
      return rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        chatId: row.chat_id,
        fromAirport: row.from_airport,
        toAirport: row.to_airport,
        maxPrice: row.max_price,
        currency: row.currency,
        passengers: JSON.parse(row.passengers),
        searchMonth: row.search_month,
        isActive: row.is_active === 1,
        createdAt: new Date(row.created_at),
        lastChecked: row.last_checked ? new Date(row.last_checked) : undefined,
        alertsSent: row.alerts_sent
      }))
    } catch (error) {
      console.error('Error getting user alerts:', error)
      return []
    }
  }

  close(): void {
    this.db.close()
  }
}

// POST /api/alerts/sync-from-bot - Sync alerts from Telegram bot
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { telegramId } = body

    console.log('[SYNC] Starting sync for user:', {
      userId: session.user.id,
      telegramId,
      userTelegramId: session.user.telegramId
    })

    // Get the user's Telegram ID
    const targetTelegramId = telegramId || session.user.telegramId
    
    if (!targetTelegramId) {
      return NextResponse.json({ 
        message: 'No Telegram ID found for user' 
      }, { status: 400 })
    }

    // Initialize AlertManager with the bot's database
    const dbPath = path.join(process.cwd(), '..', 'data', 'alerts.db')
    console.log('[SYNC] Using database path:', dbPath)
    
    const alertReader = new SimpleAlertReader(dbPath)
    
    // Get alerts from bot database
    const botAlerts = alertReader.getUserAlerts(parseInt(targetTelegramId))
    console.log('[SYNC] Found bot alerts:', botAlerts.length)

    // Sync each alert to the webapp database
    const syncedAlerts = []
    
    for (const botAlert of botAlerts) {
      // Check if alert already exists (use origin, destination, and price as unique identifier)
      const existingAlert = await prisma.alert.findFirst({
        where: {
          userId: session.user.id,
          origin: botAlert.fromAirport,
          destination: botAlert.toAirport,
          maxPrice: botAlert.maxPrice
        }
      })

      if (!existingAlert) {
        console.log('[SYNC] Creating new alert from bot:', {
          id: botAlert.id,
          from: botAlert.fromAirport,
          to: botAlert.toAirport,
          price: botAlert.maxPrice
        })

        // Map bot alert structure to webapp alert structure
        const newAlert = await prisma.alert.create({
          data: {
            userId: session.user.id,
            origin: botAlert.fromAirport,
            destination: botAlert.toAirport,
            maxPrice: botAlert.maxPrice,
            currency: botAlert.currency || 'USD',
            departureDate: null, // Bot alerts are typically monthly searches
            returnDate: null,
            isFlexible: true, // Monthly alerts are flexible by nature
            adults: botAlert.passengers?.find((p: any) => p.code === 'ADT')?.count || 1,
            children: botAlert.passengers?.find((p: any) => p.code === 'CHD')?.count || 0,
            infants: botAlert.passengers?.find((p: any) => p.code === 'INF')?.count || 0,
            isActive: botAlert.isActive !== false,
            isPaused: false,
            alertType: 'MONTHLY', // Bot alerts are typically monthly
            lastChecked: botAlert.lastChecked ? new Date(botAlert.lastChecked) : null,
            createdAt: botAlert.createdAt ? new Date(botAlert.createdAt) : new Date()
          }
        })
        syncedAlerts.push(newAlert)
      } else {
        console.log('[SYNC] Alert already exists, skipping:', botAlert.id)
      }
    }

    console.log('[SYNC] Sync completed:', {
      totalBotAlerts: botAlerts.length,
      syncedCount: syncedAlerts.length
    })

    // Close database connection
    alertReader.close()

    return NextResponse.json({
      message: 'Alerts synced successfully',
      totalBotAlerts: botAlerts.length,
      syncedCount: syncedAlerts.length,
      alerts: syncedAlerts
    })

  } catch (error) {
    console.error('[SYNC] Error syncing alerts from bot:', error)
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/alerts/sync-from-bot - Manual sync trigger
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || !session.user.telegramId) {
      return NextResponse.json({ 
        message: 'User not linked to Telegram' 
      }, { status: 400 })
    }

    // For now, return instructions for manual sync
    // In production, this could trigger an automatic sync
    return NextResponse.json({
      message: 'Sync available',
      telegramId: session.user.telegramId,
      instructions: 'Use POST method to sync alerts from bot'
    })

  } catch (error) {
    console.error('Error in sync endpoint:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
