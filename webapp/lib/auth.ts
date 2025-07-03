import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextAuthOptions } from 'next-auth'
import { logger } from '@/lib/logger'
import { env, isConfigured } from '@/lib/env-validation'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: env.NODE_ENV === 'development',
  providers: [
    // Google OAuth Provider - Con configuración mejorada
    ...(isConfigured.google 
      ? [GoogleProvider({
          clientId: env.GOOGLE_CLIENT_ID!,
          clientSecret: env.GOOGLE_CLIENT_SECRET!,
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
            }
          }
        })]
      : []
    ),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error('Please verify your email before signing in')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role as 'SUPERADMIN' | 'SUPPORTER' | 'PREMIUM' | 'BASIC' | 'TESTING',
          telegramId: user.telegramId || undefined,
          telegramLinked: !!user.telegramId,
          subscriptionEnd: user.subscriptionExpires?.toISOString(),
          subscriptionActive: user.subscriptionStatus === 'ACTIVE',
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Cuando el usuario se registra por primera vez
      if (user) {
        token.role = user.role
        token.telegramId = user.telegramId
        token.telegramLinked = user.telegramLinked
        token.subscriptionEnd = user.subscriptionEnd
        token.subscriptionActive = user.subscriptionActive
      }

      // Actualizar token si hay cambios en la sesión
      if (trigger === 'update' && session) {
        token.role = session.user.role
        token.telegramId = session.user.telegramId
        token.telegramLinked = session.user.telegramLinked
        token.subscriptionEnd = session.user.subscriptionEnd
        token.subscriptionActive = session.user.subscriptionActive
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role
        session.user.telegramId = token.telegramId
        session.user.telegramLinked = token.telegramLinked
        session.user.subscriptionEnd = token.subscriptionEnd
        session.user.subscriptionActive = token.subscriptionActive
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Buscar usuario existente
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // El usuario será creado automáticamente por PrismaAdapter
            return true
          } else {
            // Usuario existente, actualizar última actividad
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                updatedAt: new Date(),
                emailVerified: new Date(), // OAuth users are considered verified
              }
            })
          }

          return true
        } catch (error) {
          logger.error('Error durante sign in', error)
          return false
        }
      }
      
      // Para credenciales, la verificación ya se hizo en el provider
      if (account?.provider === 'credentials') {
        return true
      }
      
      return true
    },
  },
  events: {
    async createUser({ user }) {
      // Evento que se ejecuta cuando se crea un nuevo usuario
      try {
        // Verificar si ya hay un superadmin
        const superadmin = await prisma.user.findFirst({
          where: { role: 'SUPERADMIN' }
        })

        // Si no hay superadmin, hacer al primer usuario SUPERADMIN
        const role = !superadmin ? 'SUPERADMIN' : 'BASIC'

        await prisma.user.update({
          where: { id: user.id },
          data: {
            role,
            subscriptionStatus: 'ACTIVE',
            subscriptionPlan: role === 'SUPERADMIN' ? 'PREMIUM' : 'BASIC',
            subscriptionExpires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
            // Para OAuth, marcar como verificado inmediatamente
            emailVerified: user.email ? new Date() : null,
          }
        })
        
        // Solo enviar email de verificación para registro manual (no OAuth)
        if (user.email) {
          // Generar token de verificación
          const verificationToken = await prisma.verificationToken.create({
            data: {
              identifier: user.email,
              token: Math.random().toString(36).substring(2) + Date.now().toString(36),
              expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
            }
          })

          // Enviar email de verificación
          const { sendVerificationEmail } = await import('@/lib/email')
          await sendVerificationEmail(user.email, verificationToken.token)
          logger.info('Email de verificación enviado', { email: user.email })
        }
        
        // Enviar email de bienvenida
        if (user.email) {
          try {
            const { sendWelcomeEmail } = await import('@/lib/email')
            await sendWelcomeEmail(user.email, user.name || 'Usuario')
            logger.info('Email de bienvenida enviado', { email: user.email })
          } catch (emailError) {
            logger.error('Error enviando email de bienvenida', emailError)
          }
        }
        
        logger.info('Usuario creado', { role, email: user.email })
      } catch (error) {
        logger.error('Error en evento createUser', error)
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    newUser: '/dashboard', // Redirecciona a los nuevos usuarios al dashboard
  },
  session: {
    strategy: 'jwt' as const,
  },
}
