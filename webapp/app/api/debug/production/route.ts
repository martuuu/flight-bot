// Debug específico para problemas de OAuth en producción
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const host = req.headers.get('host')
    const protocol = req.headers.get('x-forwarded-proto') || 'http'
    const userAgent = req.headers.get('user-agent')
    const referer = req.headers.get('referer')
    
    // Información del entorno
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      
      // URLs y configuración básica
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      host: host,
      protocol: protocol,
      fullUrl: `${protocol}://${host}`,
      
      // Estado de las credenciales
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      
      // Google Client ID (parcial para seguridad)
      googleClientIdPreview: process.env.GOOGLE_CLIENT_ID ? 
        `${process.env.GOOGLE_CLIENT_ID.substring(0, 25)}...` : 'NOT_SET',
        
      // URLs de OAuth calculadas
      expectedRedirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
      actualRedirectUri: `${protocol}://${host}/api/auth/callback/google`,
      
      // Headers de la request
      headers: {
        host,
        protocol,
        userAgent: userAgent?.substring(0, 100) + '...',
        referer
      }
    }
    
    // Validaciones
    const validations = {
      nextAuthUrlMatchesHost: process.env.NEXTAUTH_URL === `${protocol}://${host}`,
      hasAllGoogleCredentials: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      isProduction: process.env.NODE_ENV === 'production',
      isHttps: protocol === 'https',
      domainIsFlightBot: host?.includes('flight-bot.com')
    }
    
    // Diagnóstico
    const issues = []
    if (!validations.nextAuthUrlMatchesHost) {
      issues.push(`NEXTAUTH_URL (${process.env.NEXTAUTH_URL}) no coincide con el host actual (${protocol}://${host})`)
    }
    if (!validations.hasAllGoogleCredentials) {
      issues.push('Faltan credenciales de Google OAuth')
    }
    if (validations.isProduction && !validations.isHttps) {
      issues.push('Producción debería usar HTTPS')
    }
    
    // Recomendaciones específicas
    const recommendations = []
    if (issues.length === 0) {
      recommendations.push('✅ Configuración básica parece correcta')
    } else {
      recommendations.push('❌ Se encontraron problemas de configuración')
    }
    
    if (!validations.nextAuthUrlMatchesHost) {
      recommendations.push(`Actualizar NEXTAUTH_URL en Vercel a: ${protocol}://${host}`)
    }
    
    if (validations.isProduction) {
      recommendations.push('Verificar que Google OAuth consent screen esté en modo "Publicado"')
      recommendations.push('Verificar que el dominio esté verificado en Google Cloud Console')
      recommendations.push(`Confirmar que ${protocol}://${host}/api/auth/callback/google esté en las URIs autorizadas`)
    }
    
    const response = {
      timestamp: new Date().toISOString(),
      environment: envInfo,
      validations,
      issues,
      recommendations,
      
      // Para debugging en caso de error de callback
      expectedGoogleRedirect: `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${process.env.NEXTAUTH_URL}/api/auth/callback/google`)}&response_type=code&scope=openid%20email%20profile&state=...`,
      
      // Debugging info
      debug: {
        requestUrl: req.url,
        searchParams: Object.fromEntries(req.nextUrl.searchParams.entries()),
        method: req.method
      }
    }
    
    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
