import { NextRequest, NextResponse } from 'next/server'

// Script para diagnosticar problemas de OAuth en producción
export async function GET(req: NextRequest) {
  // Solo permitir en desarrollo o con un token específico
  const isDebugAllowed = process.env.NODE_ENV === 'development' || 
                        req.nextUrl.searchParams.get('debug_token') === process.env.DEBUG_TOKEN

  if (!isDebugAllowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const host = req.headers.get('host')
    const protocol = req.headers.get('x-forwarded-proto') || 'http'
    
    const config = {
      environment: process.env.NODE_ENV,
      nextauth_url: process.env.NEXTAUTH_URL,
      nextauth_secret: process.env.NEXTAUTH_SECRET ? '[SET]' : '[NOT SET]',
      google_client_id: process.env.GOOGLE_CLIENT_ID ? 
        `${process.env.GOOGLE_CLIENT_ID?.substring(0, 20)}...` : '[NOT SET]',
      google_client_secret: process.env.GOOGLE_CLIENT_SECRET ? '[SET]' : '[NOT SET]',
      database_url: process.env.DATABASE_URL ? '[SET]' : '[NOT SET]',
      
      // OAuth specific checks
      oauth_redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
      host: host,
      protocol: protocol,
      user_agent: req.headers.get('user-agent'),
      
      // Check for common production issues
      checks: {
        nextauth_url_matches_host: process.env.NEXTAUTH_URL?.includes(host || ''),
        has_google_credentials: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        nextauth_secret_present: !!process.env.NEXTAUTH_SECRET,
        using_https: protocol === 'https',
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      config,
      suggestions: [
        'Verify Google OAuth redirect URI in Google Cloud Console',
        'Ensure NEXTAUTH_URL matches your domain exactly',
        'Check that all environment variables are set in Vercel',
        'Verify SSL certificate is working properly',
        'Check Google Cloud Console OAuth consent screen configuration'
      ]
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
