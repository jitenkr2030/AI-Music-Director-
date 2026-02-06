import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const genre = searchParams.get('genre')
    const mood = searchParams.get('mood')
    const licenseType = searchParams.get('licenseType')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isPublic: true
    }

    if (genre && genre !== 'All') {
      where.genre = genre
    }

    if (mood && mood !== 'All') {
      where.mood = mood
    }

    if (licenseType && licenseType !== 'All') {
      where.licenseType = licenseType
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } }
      ]
    }

    // Build order by clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Get songs and total count
    const [songs, total] = await Promise.all([
      db.song.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      db.song.count({ where })
    ])

    // Calculate average rating for each song
    const songsWithRating = songs.map(song => ({
      ...song,
      averageRating: song.reviews.length > 0 
        ? song.reviews.reduce((sum, review) => sum + review.rating, 0) / song.reviews.length
        : 0,
      reviewCount: song.reviews.length
    }))

    return NextResponse.json({
      songs: songsWithRating,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching songs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      description, 
      audioUrl, 
      coverImage, 
      duration, 
      genre, 
      mood, 
      language, 
      tempo, 
      key, 
      price, 
      licenseType, 
      tags, 
      authorId 
    } = body

    // Validate required fields
    if (!title || !audioUrl || !duration || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create song
    const song = await db.song.create({
      data: {
        title,
        description,
        audioUrl,
        coverImage,
        duration,
        genre,
        mood,
        language,
        tempo,
        key,
        price,
        licenseType,
        tags,
        authorId,
        isPublic: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(song, { status: 201 })

  } catch (error) {
    console.error('Error creating song:', error)
    return NextResponse.json(
      { error: 'Failed to create song' },
      { status: 500 }
    )
  }
}