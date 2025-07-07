import { NextRequest, NextResponse } from 'next/server'

// Legacy API endpoint - deprecated, kept for backward compatibility
// This endpoint has been migrated to the new PostgreSQL/Prisma system

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({
      error: 'This endpoint has been migrated to the new PostgreSQL system. Please use the webapp dashboard to manage your alerts.',
      migration_info: 'Bot alerts are now managed through the unified PostgreSQL database.',
      redirect_to: '/dashboard/alerts'
    }, { status: 410 }) // 410 Gone - resource is no longer available
  } catch (error) {
    console.error('Error in legacy bot-alerts endpoint:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: 'This legacy endpoint is no longer supported'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      error: 'This endpoint has been migrated to the new PostgreSQL system. Please use the webapp dashboard to view your alerts.',
      migration_info: 'Bot alerts are now managed through the unified PostgreSQL database.',
      redirect_to: '/dashboard/alerts'
    }, { status: 410 }) // 410 Gone - resource is no longer available
  } catch (error) {
    console.error('Error in legacy bot-alerts endpoint:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: 'This legacy endpoint is no longer supported'
    }, { status: 500 })
  }
}