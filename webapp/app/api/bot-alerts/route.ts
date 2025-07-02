import { NextRequest, NextResponse } from 'next/server'
import { getBotDatabaseService, formatAlertForApi, isValidAirport } from '@/lib/bot-database'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    const { 
      origin, 
      destination, 
      maxPrice, 
      alertType = 'MONTHLY',
      adults = 1,
      children = 0,
      infants = 0,
      departureDate,
      returnDate,
      month,
      telegramId // This should come from auth or session
    } = data

    // Validation
    if (!origin || !destination || !maxPrice || !telegramId) {
      return NextResponse.json({
        error: 'Missing required fields: origin, destination, maxPrice, telegramId'
      }, { status: 400 })
    }

    if (!isValidAirport(origin) || !isValidAirport(destination)) {
      return NextResponse.json({
        error: 'Invalid airport codes'
      }, { status: 400 })
    }

    if (origin.toUpperCase() === destination.toUpperCase()) {
      return NextResponse.json({
        error: 'Origin and destination cannot be the same'
      }, { status: 400 })
    }

    if (maxPrice <= 0 || maxPrice > 10000) {
      return NextResponse.json({
        error: 'Max price must be between 1 and 10000'
      }, { status: 400 })
    }

    const totalPassengers = adults + children + infants
    if (totalPassengers > 9) {
      return NextResponse.json({
        error: 'Maximum 9 passengers allowed'
      }, { status: 400 })
    }

    // Get database service
    const botDb = getBotDatabaseService()

    // Find or create user
    const user = botDb.findOrCreateUser(telegramId)
    if (!user) {
      return NextResponse.json({
        error: 'Failed to create or find user'
      }, { status: 500 })
    }

    // Check for duplicate alerts
    const duplicate = botDb.findDuplicateAlert(user.id, origin, destination)
    if (duplicate) {
      return NextResponse.json({
        error: `You already have an active alert for ${origin} → ${destination}`
      }, { status: 409 })
    }

    // Check alert limit (max 20 per user)
    const alertCount = botDb.countActiveAlertsByUserId(user.id)
    if (alertCount >= 20) {
      return NextResponse.json({
        error: 'You have reached the maximum limit of 20 active alerts'
      }, { status: 409 })
    }

    // Prepare alert data
    let searchMonth: string | undefined
    if (alertType === 'MONTHLY' && month) {
      searchMonth = month
    } else if (alertType === 'MONTHLY') {
      // Use current month if not specified
      const now = new Date()
      searchMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    }

    // Create alert
    const alert = botDb.createAlert(
      user.id,
      origin,
      destination,
      maxPrice,
      'USD', // Default currency
      alertType,
      departureDate,
      returnDate,
      totalPassengers,
      'economy', // Default cabin class
      searchMonth
    )

    if (!alert) {
      return NextResponse.json({
        error: 'Failed to create alert'
      }, { status: 500 })
    }

    // Format response
    const formattedAlert = formatAlertForApi(alert)

    // Return success response
    return NextResponse.json({
      success: true,
      alert: formattedAlert,
      message: `Alert created successfully! You'll be notified when flights from ${origin} to ${destination} are available for $${maxPrice} or less.`
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const telegramId = searchParams.get('telegramId')

    if (!telegramId) {
      return NextResponse.json({
        error: 'Missing telegramId parameter'
      }, { status: 400 })
    }

    const botDb = getBotDatabaseService()
    const user = botDb.findUserByTelegramId(parseInt(telegramId))

    if (!user) {
      return NextResponse.json({
        alerts: []
      })
    }

    const alerts = botDb.findAlertsByUserId(user.id)
    const formattedAlerts = alerts.map(formatAlertForApi)

    return NextResponse.json({
      alerts: formattedAlerts
    })

  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}
