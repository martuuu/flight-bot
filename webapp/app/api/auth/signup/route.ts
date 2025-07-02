import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'

const prisma = new PrismaClient()

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, password } = signupSchema.parse(body)

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
      console.error('Failed to send verification email:', emailError)
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error.errors },
        { status: 400 }
      )
    }

    // Handle Prisma errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
