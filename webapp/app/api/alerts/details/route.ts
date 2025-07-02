import { NextRequest, NextResponse } from 'next/server'

// Mock data - En producción esto vendría de la base de datos real
const mockAlertDetails = {
  'MIA-PUJ-2026-02': {
    id: '1',
    fromAirport: 'MIA',
    toAirport: 'PUJ',
    fromAirportName: 'Miami International Airport',
    toAirportName: 'Punta Cana International Airport',
    maxPrice: 400,
    currency: 'USD',
    searchMonth: '2026-02',
    passengers: [{ type: 'adult', count: 1 }],
    isActive: true,
    createdAt: '2025-01-01T10:00:00Z',
    lastChecked: '2025-01-01T14:30:00Z',
    alertsSent: 3,
    priceAnalysis: {
      minPrice: 210,
      maxPrice: 450,
      avgPrice: 320,
      totalFlights: 45,
      cheapestDates: ['2026-02-05', '2026-02-12', '2026-02-19']
    },
    flights: [
      {
        id: '1',
        date: '2026-02-05',
        price: 210,
        priceWithoutTax: 180,
        fareClass: 'Economy',
        flightNumber: 'DM-123',
        departureTime: '2026-02-05T08:30:00Z',
        arrivalTime: '2026-02-05T12:45:00Z',
        duration: 255,
        aircraft: 'Boeing 737-800',
        isCheapestOfMonth: true,
        isSoldOut: false,
        departureAirport: {
          code: 'MIA',
          name: 'Miami International Airport',
          city: 'Miami'
        },
        arrivalAirport: {
          code: 'PUJ',
          name: 'Punta Cana International Airport',
          city: 'Punta Cana'
        },
        taxes: 30,
        checkInAllowed: true
      },
      {
        id: '2',
        date: '2026-02-12',
        price: 235,
        priceWithoutTax: 205,
        fareClass: 'Economy',
        flightNumber: 'DM-456',
        departureTime: '2026-02-12T14:15:00Z',
        arrivalTime: '2026-02-12T18:30:00Z',
        duration: 255,
        aircraft: 'Boeing 737-800',
        isCheapestOfMonth: false,
        isSoldOut: false,
        departureAirport: {
          code: 'MIA',
          name: 'Miami International Airport',
          city: 'Miami'
        },
        arrivalAirport: {
          code: 'PUJ',
          name: 'Punta Cana International Airport',
          city: 'Punta Cana'
        },
        taxes: 30,
        checkInAllowed: true
      },
      {
        id: '3',
        date: '2026-02-19',
        price: 215,
        priceWithoutTax: 185,
        fareClass: 'Economy',
        flightNumber: 'DM-789',
        departureTime: '2026-02-19T16:45:00Z',
        arrivalTime: '2026-02-19T21:00:00Z',
        duration: 255,
        aircraft: 'Boeing 737-800',
        isCheapestOfMonth: false,
        isSoldOut: false,
        departureAirport: {
          code: 'MIA',
          name: 'Miami International Airport',
          city: 'Miami'
        },
        arrivalAirport: {
          code: 'PUJ',
          name: 'Punta Cana International Airport',
          city: 'Punta Cana'
        },
        taxes: 30,
        checkInAllowed: true
      },
      {
        id: '4',
        date: '2026-02-26',
        price: 380,
        priceWithoutTax: 350,
        fareClass: 'Economy',
        flightNumber: 'DM-101',
        departureTime: '2026-02-26T09:15:00Z',
        arrivalTime: '2026-02-26T13:30:00Z',
        duration: 255,
        aircraft: 'Boeing 737-800',
        isCheapestOfMonth: false,
        isSoldOut: false,
        departureAirport: {
          code: 'MIA',
          name: 'Miami International Airport',
          city: 'Miami'
        },
        arrivalAirport: {
          code: 'PUJ',
          name: 'Punta Cana International Airport',
          city: 'Punta Cana'
        },
        taxes: 30,
        checkInAllowed: true
      }
    ]
  },
  'BOG-MIA-2026-03': {
    id: '2',
    fromAirport: 'BOG',
    toAirport: 'MIA',
    fromAirportName: 'El Dorado International Airport',
    toAirportName: 'Miami International Airport',
    maxPrice: 350,
    currency: 'USD',
    searchMonth: '2026-03',
    passengers: [{ type: 'adult', count: 1 }],
    isActive: true,
    createdAt: '2025-01-02T10:00:00Z',
    lastChecked: '2025-01-02T14:30:00Z',
    alertsSent: 1,
    priceAnalysis: {
      minPrice: 280,
      maxPrice: 420,
      avgPrice: 340,
      totalFlights: 38,
      cheapestDates: ['2026-03-08', '2026-03-15', '2026-03-22']
    },
    flights: [
      {
        id: '5',
        date: '2026-03-08',
        price: 280,
        priceWithoutTax: 250,
        fareClass: 'Economy',
        flightNumber: 'DM-201',
        departureTime: '2026-03-08T06:00:00Z',
        arrivalTime: '2026-03-08T12:15:00Z',
        duration: 375,
        aircraft: 'Boeing 737-800',
        isCheapestOfMonth: true,
        isSoldOut: false,
        departureAirport: {
          code: 'BOG',
          name: 'El Dorado International Airport',
          city: 'Bogotá'
        },
        arrivalAirport: {
          code: 'MIA',
          name: 'Miami International Airport',
          city: 'Miami'
        },
        taxes: 30,
        checkInAllowed: true
      },
      {
        id: '6',
        date: '2026-03-15',
        price: 295,
        priceWithoutTax: 265,
        fareClass: 'Economy',
        flightNumber: 'DM-202',
        departureTime: '2026-03-15T11:30:00Z',
        arrivalTime: '2026-03-15T17:45:00Z',
        duration: 375,
        aircraft: 'Boeing 737-800',
        isCheapestOfMonth: false,
        isSoldOut: false,
        departureAirport: {
          code: 'BOG',
          name: 'El Dorado International Airport',
          city: 'Bogotá'
        },
        arrivalAirport: {
          code: 'MIA',
          name: 'Miami International Airport',
          city: 'Miami'
        },
        taxes: 30,
        checkInAllowed: true
      },
      {
        id: '7',
        date: '2026-03-22',
        price: 310,
        priceWithoutTax: 280,
        fareClass: 'Economy',
        flightNumber: 'DM-203',
        departureTime: '2026-03-22T15:45:00Z',
        arrivalTime: '2026-03-22T22:00:00Z',
        duration: 375,
        aircraft: 'Boeing 737-800',
        isCheapestOfMonth: false,
        isSoldOut: false,
        departureAirport: {
          code: 'BOG',
          name: 'El Dorado International Airport',
          city: 'Bogotá'
        },
        arrivalAirport: {
          code: 'MIA',
          name: 'Miami International Airport',
          city: 'Miami'
        },
        taxes: 30,
        checkInAllowed: true
      }
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const alertId = searchParams.get('id')

    if (!alertId) {
      return NextResponse.json(
        { error: 'Alert ID is required' },
        { status: 400 }
      )
    }

    // En un entorno real, aquí harías una consulta a la base de datos
    // y posiblemente llamarías al ArajetAlertService para obtener datos frescos
    
    // Simular consulta a base de datos
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Buscar en mock data
    const alertKey = Object.keys(mockAlertDetails).find(key => 
      key.includes(alertId) || mockAlertDetails[key as keyof typeof mockAlertDetails].id === alertId
    )
    
    if (!alertKey) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      )
    }

    const alertDetails = mockAlertDetails[alertKey as keyof typeof mockAlertDetails]
    
    return NextResponse.json({
      success: true,
      data: alertDetails
    })

  } catch (error) {
    console.error('Error fetching alert details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST endpoint para refrescar los datos de una alerta
export async function POST(request: NextRequest) {
  try {
    const { alertId } = await request.json()

    if (!alertId) {
      return NextResponse.json(
        { error: 'Alert ID is required' },
        { status: 400 }
      )
    }

    // En un entorno real, aquí llamarías al ArajetAlertService
    // para obtener datos frescos de la API de Arajet
    
    // TODO: Integrar con el sistema real del bot
    // const { ArajetAlertService } = require('../../../../src/services/ArajetAlertService')
    // const arajetService = new ArajetAlertService()
    // const freshData = await arajetService.getMonthlyPrices(...)
    
    // Simular llamada a la API de Arajet
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return NextResponse.json({
      success: true,
      message: 'Alert data refreshed successfully',
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error refreshing alert data:', error)
    return NextResponse.json(
      { error: 'Failed to refresh alert data' },
      { status: 500 }
    )
  }
}
