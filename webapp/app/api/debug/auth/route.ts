import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Checking auth configuration...')
    
    // Verificar configuración de Google
    const googleProvider = authOptions.providers?.find(p => p.id === 'google')
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      providers: authOptions.providers?.map(p => ({
        id: p.id,
        name: p.name,
        type: p.type
      })),
      googleProvider: googleProvider ? {
        id: googleProvider.id,
        name: googleProvider.name,
        type: googleProvider.type,
        configured: !!googleProvider
      } : null,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_DEBUG: process.env.NEXTAUTH_DEBUG,
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        googleClientIdLength: process.env.GOOGLE_CLIENT_ID?.length,
        googleClientSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length,
      }
    }
    
    console.log('🔍 DEBUG INFO:', JSON.stringify(debugInfo, null, 2))
    
    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error('❌ DEBUG ERROR:', error)
    return NextResponse.json({ 
      error: 'Debug failed', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
