import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body

    if (type === 'login') {
      return await handleLogin(body)
    } else if (type === 'register') {
      return await handleRegister(body)
    } else if (type === 'logout') {
      return await handleLogout()
    } else {
      return NextResponse.json(
        { error: 'Invalid request type' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error in auth API:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

async function handleLogin(body: any) {
  try {
    const validatedData = loginSchema.parse(body)
    const { email, password } = validatedData

    // Find user by email
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // In a real implementation, you would verify the password hash
    // For demo purposes, we'll accept any password
    
    // Create session token (in real implementation, use JWT)
    const sessionToken = `session_${Date.now()}_${user.id}`

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      isPremium: user.isPremium,
      subscription: user.subscription
    }

    return NextResponse.json({
      success: true,
      user: userData,
      token: sessionToken,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Error in login:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

async function handleRegister(body: any) {
  try {
    const validatedData = registerSchema.parse(body)
    const { email, password, name } = validatedData

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Create new user
    const user = await db.user.create({
      data: {
        email,
        name,
        // In real implementation, hash the password
        isPremium: false,
        subscription: 'free'
      }
    })

    // Create session token
    const sessionToken = `session_${Date.now()}_${user.id}`

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      isPremium: user.isPremium,
      subscription: user.subscription
    }

    return NextResponse.json({
      success: true,
      user: userData,
      token: sessionToken,
      message: 'Registration successful'
    })

  } catch (error) {
    console.error('Error in registration:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}

async function handleLogout() {
  // In a real implementation, you would invalidate the session token
  return NextResponse.json({
    success: true,
    message: 'Logout successful'
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        isPremium: true,
        subscription: true,
        bio: true,
        createdAt: true,
        _count: {
          songs: true,
          purchases: true,
          reviews: true,
          practiceSessions: true
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user
    })

  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}