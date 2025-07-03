// Input sanitization utilities
import { z } from 'zod'

// Esquemas de validación comunes
export const emailSchema = z.string().email('Invalid email address').toLowerCase()
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long')
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')

// Sanitización de strings básica (sin DOMPurify por ahora)
export function sanitizeString(input: string): string {
  return input.replace(/[<>]/g, '').trim()
}

export function sanitizeHtml(input: string): string {
  // Implementación básica, se puede mejorar con DOMPurify después
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

// Validación de IDs
export function validateId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,50}$/.test(id)
}

// Validación de códigos de aeropuerto
export function validateAirportCode(code: string): boolean {
  return /^[A-Z]{3}$/.test(code.toUpperCase())
}

// Validación de precios
export function validatePrice(price: number): boolean {
  return price > 0 && price < 1000000 && Number.isFinite(price)
}

// Validación de fechas
export function validateDate(date: string | Date): boolean {
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj.getTime()) && dateObj > new Date()
}

// Esquema para alertas de vuelo
export const flightAlertSchema = z.object({
  origin: z.string().length(3, 'Origin must be 3 characters').transform(s => s.toUpperCase()),
  destination: z.string().length(3, 'Destination must be 3 characters').transform(s => s.toUpperCase()),
  maxPrice: z.number().min(1, 'Price must be positive').max(100000, 'Price too high'),
  currency: z.string().length(3, 'Currency must be 3 characters').default('USD'),
  departureDate: z.string().datetime().optional(),
  returnDate: z.string().datetime().optional(),
  adults: z.number().min(1, 'At least 1 adult required').max(9, 'Too many adults').default(1),
  children: z.number().min(0).max(9, 'Too many children').default(0),
  infants: z.number().min(0).max(9, 'Too many infants').default(0),
  isFlexible: z.boolean().default(true),
  alertType: z.enum(['SPECIFIC', 'MONTHLY']).default('SPECIFIC')
})

// Esquema para actualizar usuario
export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  role: z.enum(['SUPERADMIN', 'SUPPORTER', 'PREMIUM', 'BASIC', 'TESTING']).optional(),
  subscriptionStatus: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']).optional(),
  subscriptionPlan: z.enum(['BASIC', 'PREMIUM']).optional(),
  subscriptionExpires: z.string().datetime().optional()
})

// Esquema para registro de usuario
export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema
})

// Esquema para login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})
