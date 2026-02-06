import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { LLM } from 'z-ai-web-dev-sdk'

// Initialize the LLM SDK
const llm = new LLM({
  apiKey: process.env.Z_AI_API_KEY || 'demo-key'
})

const lyricsGenerationSchema = z.object({
  theme: z.string(),
  language: z.string(),
  style: z.string(),
  idea: z.string().min(10),
  mood: z.string().optional()
})

const karaokeParseSchema = z.object({
  lyrics: z.string().min(50)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body

    if (type === 'generate') {
      return await generateLyrics(body)
    } else if (type === 'parse-karaoke') {
      return await parseKaraoke(body)
    } else {
      return NextResponse.json(
        { error: 'Invalid request type' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error in lyrics API:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

async function generateLyrics(body: any) {
  try {
    const validatedData = lyricsGenerationSchema.parse(body)
    const { theme, language, style, idea, mood } = validatedData

    const prompt = `Generate song lyrics based on the following parameters:
    
    Theme: ${theme}
    Language: ${language}
    Style: ${style}
    Idea: ${idea}
    ${mood ? `Mood: ${mood}` : ''}
    
    Please write complete song lyrics with:
    - Clear verse-chorus structure
    - Rhyming patterns appropriate for ${style} style
    - Emotional depth and storytelling
    - Length suitable for a 2-4 minute song
    - Format with clear section labels (Verse 1, Chorus, Verse 2, Bridge, etc.)
    
    The lyrics should be original, creative, and suitable for singing practice.`

    const result = await llm.chat([
      {
        role: 'system',
        content: 'You are a professional songwriter and lyricist. Create high-quality, original song lyrics based on user requirements.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], {
      model: 'text-generation',
      temperature: 0.8,
      max_tokens: 1500
    })

    const lyrics = result.content || ''

    // Parse lyrics into karaoke format
    const karaokeLines = parseLyricsToLines(lyrics)

    const lyricsData = {
      id: `lyrics_${Date.now()}`,
      title: `${theme} Song`,
      theme,
      language,
      style,
      mood,
      lyrics,
      karaokeLines,
      createdAt: new Date().toISOString(),
      wordCount: lyrics.split(' ').length,
      lineCount: karaokeLines.length
    }

    return NextResponse.json({
      success: true,
      data: lyricsData,
      message: 'Lyrics generated successfully'
    })

  } catch (error) {
    console.error('Error generating lyrics:', error)
    return NextResponse.json(
      { error: 'Failed to generate lyrics' },
      { status: 500 }
    )
  }
}

async function parseKaraoke(body: any) {
  try {
    const validatedData = karaokeParseSchema.parse(body)
    const { lyrics } = validatedData

    const karaokeLines = parseLyricsToLines(lyrics)

    return NextResponse.json({
      success: true,
      data: {
        karaokeLines,
        totalLines: karaokeLines.length,
        estimatedDuration: karaokeLines.length * 4 // 4 seconds per line estimate
      }
    })

  } catch (error) {
    console.error('Error parsing karaoke:', error)
    return NextResponse.json(
      { error: 'Failed to parse lyrics for karaoke' },
      { status: 500 }
    )
  }
}

function parseLyricsToLines(lyrics: string) {
  const lines = lyrics.split('\n').filter(line => line.trim() && !line.includes(':'))
  
  return lines.map((line, index) => ({
    id: `line-${index}`,
    text: line.trim(),
    startTime: index * 4, // 4 seconds per line
    endTime: (index + 1) * 4,
    isCurrent: false
  }))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')

    // In a real implementation, this would fetch from database
    const sampleLyrics = [
      {
        id: 'lyrics_1',
        title: 'Love Song',
        theme: 'Love',
        language: 'English',
        style: 'Pop',
        lyrics: 'Verse 1:\nIn the quiet of the morning light\nI see your face and feel so right...\n\nChorus:\nLove is the song that we sing together...',
        createdAt: new Date().toISOString()
      }
    ]

    return NextResponse.json({
      lyrics: sampleLyrics.slice(0, limit),
      total: sampleLyrics.length
    })

  } catch (error) {
    console.error('Error fetching lyrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lyrics' },
      { status: 500 }
    )
  }
}