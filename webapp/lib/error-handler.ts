// Utility para manejo seguro de errores en APIs
import { NextResponse } from 'next/server'
import { logger } from './logger'

export interface ApiError {
  message: string
  statusCode: number
  code?: string
  details?: any
}

export class AppError extends Error {
  statusCode: number
  code?: string
  details?: any

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.name = 'AppError'
  }
}

export function handleApiError(error: unknown, context?: string): NextResponse {
  // Log completo del error para debugging
  const errorInfo = {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString()
  }

  logger.error(`API Error in ${context || 'unknown context'}:`, errorInfo)

  // Respuesta sanitizada para el cliente
  if (error instanceof AppError) {
    return NextResponse.json({
      error: {
        message: error.message,
        code: error.code || 'APP_ERROR'
      }
    }, { status: error.statusCode })
  }

  // Error de validación Zod
  if (error && typeof error === 'object' && 'errors' in error) {
    return NextResponse.json({
      error: {
        message: 'Invalid input data',
        code: 'VALIDATION_ERROR',
        details: error.errors
      }
    }, { status: 400 })
  }

  // Error de Prisma
  if (error instanceof Error && error.message.includes('Unique constraint')) {
    return NextResponse.json({
      error: {
        message: 'Resource already exists',
        code: 'DUPLICATE_RESOURCE'
      }
    }, { status: 400 })
  }

  // Error genérico - no exponer detalles internos
  return NextResponse.json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  }, { status: 500 })
}

// Middleware para validar autenticación
export function requireAuth(handler: Function) {
  return async (request: any, context: any) => {
    try {
      // Validar token de autenticación aquí
      return await handler(request, context)
    } catch (error) {
      return handleApiError(error, 'auth-middleware')
    }
  }
}
