// Tipos seguros para reemplazar usos de 'any'
import { User as PrismaUser, Alert as PrismaAlert } from '@prisma/client'

export interface SafeUser extends Omit<PrismaUser, 'password'> {
  id: string
  email: string
  name: string | null
  role: 'SUPERADMIN' | 'SUPPORTER' | 'PREMIUM' | 'BASIC' | 'TESTING'
  telegramId: string | null
  telegramLinked: boolean
  subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
  subscriptionPlan: 'BASIC' | 'PREMIUM'
  subscriptionExpires: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface SafeAlert extends PrismaAlert {
  id: string
  userId: string
  origin: string
  destination: string
  maxPrice: number
  currency: string
  departureDate: Date | null
  returnDate: Date | null
  isFlexible: boolean
  adults: number
  children: number
  infants: number
  isActive: boolean
  isPaused: boolean
  alertType: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthSession {
  user: {
    id: string
    email: string
    name: string | null
    role: SafeUser['role']
    telegramId: string | null
    telegramLinked: boolean
    subscriptionEnd: string | null
    subscriptionActive: boolean
  }
  expires: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
    details?: unknown
  }
  pagination?: {
    page: number
    limit: number
    total: number
  }
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  phone?: string
  role?: SafeUser['role']
  subscriptionStatus?: SafeUser['subscriptionStatus']
  subscriptionPlan?: SafeUser['subscriptionPlan']
  subscriptionExpires?: Date
}

export interface CreateAlertPayload {
  origin: string
  destination: string
  maxPrice: number
  currency?: string
  departureDate?: Date
  returnDate?: Date
  isFlexible?: boolean
  adults?: number
  children?: number
  infants?: number
  alertType?: string
}

export interface JWTPayload {
  sub: string
  role: SafeUser['role']
  telegramId: string | null
  telegramLinked: boolean
  subscriptionEnd: string | null
  subscriptionActive: boolean
  iat: number
  exp: number
}
