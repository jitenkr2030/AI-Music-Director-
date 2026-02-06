import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const sessionType = searchParams.get('sessionType')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const where: any = { userId }
    if (sessionType && sessionType !== 'all') {
      where.sessionType = sessionType
    }

    const sessions = await db.practiceSession.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Calculate stats
    const totalSessions = await db.practiceSession.count({ where })
    const totalDuration = await db.practiceSession.aggregate({
      where,
      _sum: { duration: true }
    })

    const averageScores = await db.practiceSession.aggregate({
      where,
      _avg: {
        pitchScore: true,
        rhythmScore: true,
        stabilityScore: true,
        overallScore: true
      }
    })

    return NextResponse.json({
      sessions,
      stats: {
        totalSessions,
        totalDuration: totalDuration._sum.duration || 0,
        averageScores: {
          pitch: averageScores._avg.pitchScore || 0,
          rhythm: averageScores._avg.rhythmScore || 0,
          stability: averageScores._avg.stabilityScore || 0,
          overall: averageScores._avg.overallScore || 0
        }
      }
    })

  } catch (error) {
    console.error('Error fetching practice sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch practice sessions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      userId, 
      sessionType, 
      duration, 
      pitchScore, 
      rhythmScore, 
      stabilityScore, 
      overallScore, 
      notes, 
      audioUrl 
    } = body

    // Validate required fields
    if (!userId || !sessionType || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create practice session
    const session = await db.practiceSession.create({
      data: {
        userId,
        sessionType,
        duration,
        pitchScore,
        rhythmScore,
        stabilityScore,
        overallScore,
        notes,
        audioUrl
      }
    })

    return NextResponse.json(session, { status: 201 })

  } catch (error) {
    console.error('Error creating practice session:', error)
    return NextResponse.json(
      { error: 'Failed to create practice session' },
      { status: 500 }
    )
  }
}