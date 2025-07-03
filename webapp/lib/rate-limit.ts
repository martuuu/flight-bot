// Rate limiting middleware para proteger APIs
import { NextRequest, NextResponse } from 'next/server'
import { logger } from './logger'

interface RateLimitInfo {
  count: number
  resetTime: number
}

// Map para almacenar contadores de rate limiting
const rateLimitMap = new Map<string, RateLimitInfo>()

export interface RateLimitConfig {
  windowMs: number // ventana de tiempo en ms
  maxRequests: number // número máximo de requests por ventana
  keyGenerator?: (req: NextRequest) => string
  skipSuccessfulRequests?: boolean
}

export function rateLimit(config: RateLimitConfig) {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    const {
      windowMs,
      maxRequests,
      keyGenerator = (req) => req.ip || 'unknown',
      skipSuccessfulRequests = false
    } = config

    const key = keyGenerator(req)
    const now = Date.now()
    
    // Limpiar entradas expiradas
    if (rateLimitMap.size > 1000) {
      const keysToDelete: string[] = []
      rateLimitMap.forEach((value, key) => {
        if (now > value.resetTime) {
          keysToDelete.push(key)
        }
      })
      keysToDelete.forEach(key => rateLimitMap.delete(key))
    }

    const rateLimitInfo = rateLimitMap.get(key)
    
    if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
      // Primera request o ventana expirada
      rateLimitMap.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      return null // Permitir request
    }

    if (rateLimitInfo.count >= maxRequests) {
      logger.warn(`Rate limit exceeded for key: ${key}`)
      return NextResponse.json({
        error: {
          message: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((rateLimitInfo.resetTime - now) / 1000)
        }
      }, { status: 429 })
    }

    // Incrementar contador
    rateLimitInfo.count++
    return null // Permitir request
  }
}

// Configuraciones predefinidas
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 5, // 5 intentos por IP
  keyGenerator: (req) => req.ip || 'unknown'
})

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  maxRequests: 60, // 60 requests por minuto
  keyGenerator: (req) => req.ip || 'unknown'
})

export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  maxRequests: 10, // 10 requests por minuto
  keyGenerator: (req) => req.ip || 'unknown'
})
