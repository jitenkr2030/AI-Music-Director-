import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const videoGenerationSchema = {
  type: 'object',
  properties: {
    compositionId: { type: 'string' },
    inputProps: { type: 'object' },
    format: { type: 'string', enum: ['mp4', 'webm'], default: 'mp4' },
    quality: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' },
    fps: { type: 'number', default: 30 },
    width: { type: 'number', default: 1920 },
    height: { type: 'number', default: 1080 }
  },
  required: ['compositionId', 'inputProps']
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { compositionId, inputProps, format, quality, fps, width, height } = body

    // Validate request
    if (!compositionId || !inputProps) {
      return NextResponse.json(
        { error: 'Missing required fields: compositionId, inputProps' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `video_${timestamp}.${format || 'mp4'}`
    const outputPath = join(process.cwd(), 'public', 'videos', filename)

    // Ensure videos directory exists
    await mkdir(join(process.cwd(), 'public', 'videos'), { recursive: true })

    // Build Remotion render command
    const remotionPath = join(process.cwd(), 'remotion')
    const inputPropsPath = join(remotionPath, 'temp-input.json')
    
    // Write input props to temporary file
    await writeFile(inputPropsPath, JSON.stringify(inputProps))

    // Quality settings
    const qualitySettings = {
      low: '--codec=libx264 --crf=28',
      medium: '--codec=libx264 --crf=23',
      high: '--codec=libx264 --crf=18'
    }

    const command = `cd ${remotionPath} && bun run remotion render src/index.ts ${compositionId} ${outputPath} --props=${inputPropsPath} --fps=${fps || 30} --width=${width || 1920} --height=${height || 1080} ${qualitySettings[quality as keyof typeof qualitySettings] || qualitySettings.medium}`

    console.log('Executing Remotion command:', command)

    // Execute Remotion render
    const { stdout, stderr } = await execAsync(command)

    if (stderr && !stderr.includes('✔')) {
      console.error('Remotion stderr:', stderr)
      throw new Error(`Video generation failed: ${stderr}`)
    }

    // Clean up temporary file
    try {
      await execAsync(`rm ${inputPropsPath}`)
    } catch (error) {
      console.warn('Could not clean up temp file:', error)
    }

    // Return video URL
    const videoUrl = `/videos/${filename}`

    return NextResponse.json({
      success: true,
      videoUrl,
      filename,
      metadata: {
        format,
        quality,
        fps,
        width,
        height,
        duration: 'Estimated based on composition',
        size: 'Will be available after generation'
      }
    })

  } catch (error) {
    console.error('Error generating video:', error)
    return NextResponse.json(
      { error: 'Failed to generate video', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'templates') {
      // Return available video templates
      const templates = [
        {
          id: 'MusicVideo',
          name: 'Music Video',
          description: 'Dynamic music video with audio-reactive visuals',
          duration: 30,
          defaultProps: {
            songTitle: 'Your Song Title',
            artistName: 'Artist Name',
            mood: 'happy',
            genre: 'Pop',
            visualStyle: 'abstract'
          },
          customizable: ['songTitle', 'artistName', 'mood', 'genre', 'visualStyle', 'albumArt', 'lyrics']
        },
        {
          id: 'LyricVideo',
          name: 'Lyric Video',
          description: 'Karaoke-style video with synchronized lyrics',
          duration: 30,
          defaultProps: {
            songTitle: 'Your Song Title',
            artistName: 'Artist Name',
            lyrics: [],
            style: 'dynamic'
          },
          customizable: ['songTitle', 'artistName', 'lyrics', 'backgroundImage', 'style']
        },
        {
          id: 'Visualizer',
          name: 'Audio Visualizer',
          description: 'Audio-reactive visualization with multiple styles',
          duration: 30,
          defaultProps: {
            visualStyle: 'bars',
            colorScheme: 'rainbow',
            sensitivity: 1.0
          },
          customizable: ['visualStyle', 'colorScheme', 'sensitivity']
        },
        {
          id: 'PromoVideo',
          name: 'Promo Video',
          description: 'Short promotional video for social media',
          duration: 15,
          defaultProps: {
            songTitle: 'Your Song Title',
            artistName: 'Artist Name',
            genre: 'Pop',
            mood: 'energetic',
            callToAction: 'Listen Now'
          },
          customizable: ['songTitle', 'artistName', 'genre', 'mood', 'albumArt', 'description', 'callToAction']
        }
      ]

      return NextResponse.json({ templates })
    }

    if (type === 'status') {
      // Check video generation status (placeholder implementation)
      return NextResponse.json({
        status: 'ready',
        remotionVersion: '4.0.419',
        availableCompositions: ['MusicVideo', 'LyricVideo', 'Visualizer', 'PromoVideo']
      })
    }

    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error in video API:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}