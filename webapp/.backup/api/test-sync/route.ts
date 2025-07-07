import { NextRequest, NextResponse } from 'next/server'
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

// GET /api/test-sync - Test sync functionality without auth
export async function GET() {
  try {
    console.log('[TEST-SYNC] Starting test sync...')
    
    // Get our test user
    console.log('[TEST-SYNC] Looking for user with telegramId = "1"')
    const testUser = await prisma.user.findFirst({
      where: { telegramId: '1' }
    })

    console.log('[TEST-SYNC] User query result:', testUser)

    if (!testUser) {
      console.log('[TEST-SYNC] No test user found')
      return NextResponse.json({ 
        message: 'Test user not found. Run create-test-user.ts first.' 
      }, { status: 404 })
    }

    console.log('[TEST-SYNC] Using test user:', testUser.id, testUser.telegramId)

    // Initialize AlertReader with the bot's database
    const dbPath = path.join(process.cwd(), '..', 'data', 'alerts.db')
    console.log('[TEST-SYNC] Using database path:', dbPath)
    
    const alertReader = new SimpleAlertReader(dbPath)
    
    // Get alerts from bot database
    const botAlerts = alertReader.getUserAlerts(parseInt(testUser.telegramId!))
    console.log('[TEST-SYNC] Found bot alerts:', botAlerts.length)

    // Sync each alert to the webapp database
    const syncedAlerts = []
    
    for (const botAlert of botAlerts) {
      // Check if alert already exists
      const existingAlert = await prisma.alert.findFirst({
        where: {
          userId: testUser.id,
          origin: botAlert.fromAirport,
          destination: botAlert.toAirport,
          maxPrice: botAlert.maxPrice
        }
      })

      if (!existingAlert) {
        console.log('[TEST-SYNC] Creating new alert from bot:', {
          id: botAlert.id,
          from: botAlert.fromAirport,
          to: botAlert.toAirport,
          price: botAlert.maxPrice
        })

        // Map bot alert structure to webapp alert structure
        const newAlert = await prisma.alert.create({
          data: {
            userId: testUser.id,
            origin: botAlert.fromAirport,
            destination: botAlert.toAirport,
            maxPrice: botAlert.maxPrice,
            currency: botAlert.currency || 'USD',
            departureDate: null,
            returnDate: null,
            isFlexible: true,
            adults: botAlert.passengers?.find((p: any) => p.code === 'ADT')?.count || 1,
            children: botAlert.passengers?.find((p: any) => p.code === 'CHD')?.count || 0,
            infants: botAlert.passengers?.find((p: any) => p.code === 'INF')?.count || 0,
            isActive: botAlert.isActive !== false,
            isPaused: false,
            alertType: 'MONTHLY',
            lastChecked: botAlert.lastChecked ? new Date(botAlert.lastChecked) : null,
            createdAt: botAlert.createdAt ? new Date(botAlert.createdAt) : new Date()
          }
        })
        syncedAlerts.push(newAlert)
      } else {
        console.log('[TEST-SYNC] Alert already exists, skipping:', botAlert.id)
      }
    }

    console.log('[TEST-SYNC] Sync completed:', {
      totalBotAlerts: botAlerts.length,
      syncedCount: syncedAlerts.length
    })

    // Close database connection
    alertReader.close()

    return NextResponse.json({
      message: 'Test sync completed successfully',
      totalBotAlerts: botAlerts.length,
      syncedCount: syncedAlerts.length,
      botAlerts: botAlerts,
      syncedAlerts: syncedAlerts
    })

  } catch (error) {
    console.error('[TEST-SYNC] Error:', error)
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
