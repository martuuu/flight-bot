import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import { handleApiError } from '@/lib/error-handler'
import { signupSchema as validationSchema } from '@/lib/validation'
import { authRateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // Aplicar rate limiting
    const rateLimitResult = await authRateLimit(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const body = await request.json()
    const { name, email, phone, password } = validationSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user with proper role and subscription defaults
    const superadmin = await prisma.user.findFirst({
      where: { role: 'SUPERADMIN' }
    })
    
    // If no superadmin exists, make the first user a SUPERADMIN
    const role = !superadmin ? 'SUPERADMIN' : 'BASIC'
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        emailVerified: null,
        verificationToken,
        verificationExpires,
        subscriptionStatus: 'ACTIVE',
        subscriptionPlan: role === 'SUPERADMIN' ? 'PREMIUM' : 'BASIC',
        subscriptionExpires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      }
    })

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken)
    } catch (emailError) {
      logger.error('Failed to send verification email', emailError)
      // Continue with user creation even if email fails
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'User created successfully. Please check your email to verify your account.',
      user: userWithoutPassword,
      needsVerification: true
    }, { status: 201 })

  } catch (error) {
    return handleApiError(error, 'signup')
  }
}
