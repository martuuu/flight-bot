import { NextRequest, NextResponse } from 'next/server'

/**
 * Endpoint de diagnóstico para verificar configuración en producción
 * Solo accesible para debugging, remover en producción final
 */
export async function GET(req: NextRequest) {
  // Verificar que estemos en modo desarrollo o con una key especial
  const debugKey = req.nextUrl.searchParams.get('debug')
  
  if (debugKey !== 'check-config-2025') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const config: any = {
    // Variables de NextAuth
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'CONFIGURADO' : 'NO CONFIGURADO',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'CONFIGURADO' : 'NO CONFIGURADO',
    
    // Variables de Google OAuth
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'CONFIGURADO' : 'NO CONFIGURADO',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'CONFIGURADO' : 'NO CONFIGURADO',
    
    // Variables de base de datos
    DATABASE_URL: process.env.DATABASE_URL ? 'CONFIGURADO' : 'NO CONFIGURADO',
    
    // Variables del bot de Telegram
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? 'CONFIGURADO' : 'NO CONFIGURADO',
    TELEGRAM_BOT_USERNAME: process.env.TELEGRAM_BOT_USERNAME || 'NO CONFIGURADO',
    
    // Variables del entorno
    NODE_ENV: process.env.NODE_ENV || 'NO CONFIGURADO',
    NETLIFY: process.env.NETLIFY ? 'SÍ' : 'NO',
    
    // Verificación de conectividad
    timestamp: new Date().toISOString(),
    server: 'Netlify Functions'
  }

  // También intentar una consulta básica a la DB
  let dbStatus = 'NO PROBADO'
  try {
    // Importar Prisma dinámicamente para evitar errores si no está configurado
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    const userCount = await prisma.user.count()
    dbStatus = `CONECTADO (${userCount} usuarios)`
    await prisma.$disconnect()
  } catch (error) {
    dbStatus = `ERROR: ${(error as Error).message}`
  }

  config['DATABASE_STATUS'] = dbStatus

  return NextResponse.json({
    success: true,
    config,
    message: 'Diagnóstico de configuración de producción'
  })
}
