import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Mock user storage (in production, use a real database)
const users: Array<{
  id: string
  name: string
  email: string
  phone: string
  password: string
  createdAt: Date
}> = []

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, password } = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = users.find(user => user.email === email)

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Create user (in production, hash the password)
    const user = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      password, // In production, hash this
      createdAt: new Date(),
    }

    users.push(user)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'User created successfully',
      user: userWithoutPassword
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
