// Validación de variables de entorno
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // OAuth opcional
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  
  // Email opcional
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  
  // Twilio opcional
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_WHATSAPP_NUMBER: z.string().optional(),
  
  // Bot config opcional
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_BOT_USERNAME: z.string().optional(),
  BOT_DATABASE_PATH: z.string().optional(),
  BOT_ALERTS_DATABASE_PATH: z.string().optional(),
  
  // JWT opcional
  JWT_SECRET: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
})

function validateEnv() {
  try {
    const env = envSchema.parse(process.env)
    return env
  } catch (error) {
    console.error('❌ Invalid environment variables:', error)
    throw new Error('Environment validation failed')
  }
}

export const env = validateEnv()

// Helper para verificar si los servicios están configurados
export const isConfigured = {
  google: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
  email: !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS),
  twilio: !!(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN),
  telegram: !!(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_BOT_USERNAME),
  botIntegration: !!(env.BOT_DATABASE_PATH && env.BOT_ALERTS_DATABASE_PATH),
}
