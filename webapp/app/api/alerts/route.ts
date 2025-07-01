import { NextRequest, NextResponse } from 'next/server'

// Mock data for alerts
const mockAlerts = [
  {
    id: '1',
    userId: 'user1',
    origin: 'MIA',
    destination: 'PUJ',
    maxPrice: 400,
    currency: 'USD',
    departureDate: '2025-03-15',
    isFlexible: true,
    adults: 2,
    children: 0,
    infants: 0,
    isActive: true,
    isPaused: false,
    alertType: 'MONTHLY' as const,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    lastChecked: '2025-01-01T12:00:00Z',
  },
  {
    id: '2',
    userId: 'user1',
    origin: 'BOG',
    destination: 'MIA',
    maxPrice: 350,
    currency: 'USD',
    departureDate: '2025-03-15',
    isFlexible: false,
    adults: 1,
    children: 0,
    infants: 0,
    isActive: true,
    isPaused: false,
    alertType: 'SPECIFIC' as const,
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
    lastChecked: '2025-01-02T12:00:00Z',
  },
]

export async function GET() {
  return NextResponse.json(mockAlerts)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newAlert = {
      id: String(Date.now()),
      userId: 'user1',
      ...body,
      isActive: true,
      isPaused: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    mockAlerts.push(newAlert)
    
    return NextResponse.json(newAlert, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create alert' },
      { status: 500 }
    )
  }
}
