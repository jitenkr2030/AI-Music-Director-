import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { LLM } from 'z-ai-web-dev-sdk'

// Initialize the LLM SDK for ACE-Step integration
const llm = new LLM({
  apiKey: process.env.Z_AI_API_KEY || 'demo-key'
})

const musicGenerationSchema = z.object({
  genre: z.string(),
  mood: z.string(),
  tempo: z.number().min(40).max(200),
  key: z.string(),
  duration: z.number().min(15).max(300),
  instrument: z.string(),
  timeSignature: z.string().optional(),
  scaleType: z.string().optional(),
  complexity: z.number().min(0).max(100).optional(),
  instrumentLayers: z.number().min(1).max(8).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = musicGenerationSchema.parse(body)
    
    const { genre, mood, tempo, key, duration, instrument, timeSignature, scaleType, complexity, instrumentLayers } = validatedData

    // Create prompt for ACE-Step music generation
    const prompt = `Generate a ${duration} second ${genre} music track with ${mood} mood. 
    Key: ${key}, Tempo: ${tempo} BPM, Primary instrument: ${instrument}.
    ${timeSignature ? `Time signature: ${timeSignature}` : ''}
    ${scaleType ? `Scale type: ${scaleType}` : ''}
    ${complexity ? `Complexity level: ${complexity}/100` : ''}
    ${instrumentLayers ? `Number of instrument layers: ${instrumentLayers}` : ''}
    
    Please generate high-quality, royalty-free background music suitable for singing practice.
    The music should be well-structured with proper intro, verse, chorus sections.
    Output should be in a format suitable for web playback.`

    // Call ACE-Step through LLM SDK
    const result = await llm.chat([
      {
        role: 'system',
        content: 'You are ACE-Step, an advanced AI music generation system. Generate high-quality music based on user parameters.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], {
      model: 'music-generation',
      temperature: 0.7,
      max_tokens: 2000
    })

    // Simulate music generation (in real implementation, this would process the actual audio)
    const musicData = {
      id: `music_${Date.now()}`,
      title: `${mood} ${genre} in ${key}`,
      genre,
      mood,
      tempo,
      key,
      duration,
      instrument,
      audioUrl: `/api/music/audio/${Date.now()}`,
      waveformUrl: `/api/music/waveform/${Date.now()}`,
      createdAt: new Date().toISOString(),
      generationParams: validatedData,
      // In real implementation, this would contain actual audio data
      metadata: {
        format: 'mp3',
        bitrate: '320kbps',
        sampleRate: '44.1kHz',
        channels: 2,
        size: `${Math.round(duration * 0.1)}MB` // Estimated size
      }
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    return NextResponse.json({
      success: true,
      data: musicData,
      message: 'Music generated successfully'
    })

  } catch (error) {
    console.error('Error generating music:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate music' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')

    // In a real implementation, this would fetch from database
    // For now, return sample data
    const sampleMusic = [
      {
        id: 'music_1',
        title: 'Calm Lo-fi in C',
        genre: 'Lo-fi',
        mood: 'Calm',
        tempo: 120,
        key: 'C',
        duration: 30,
        audioUrl: '/api/sample-audio-1.mp3',
        createdAt: new Date().toISOString()
      },
      {
        id: 'music_2',
        title: 'Energetic Pop in G',
        genre: 'Pop',
        mood: 'Energetic',
        tempo: 140,
        key: 'G',
        duration: 60,
        audioUrl: '/api/sample-audio-2.mp3',
        createdAt: new Date().toISOString()
      }
    ]

    return NextResponse.json({
      music: sampleMusic.slice(0, limit),
      total: sampleMusic.length
    })

  } catch (error) {
    console.error('Error fetching music:', error)
    return NextResponse.json(
      { error: 'Failed to fetch music' },
      { status: 500 }
    )
  }
}