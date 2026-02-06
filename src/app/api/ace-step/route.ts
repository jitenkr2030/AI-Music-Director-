import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface ACEStepRequest {
  prompt: string
  duration?: number
  style?: string
  mood?: string
  tempo?: number
  key?: string
  instrument?: string
  language?: string
  reference_audio?: string
  simple_mode?: boolean
}

interface ACEStepResponse {
  success: boolean
  audio_url?: string
  metadata?: any
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ACEStepRequest = await request.json()
    const {
      prompt,
      duration = 30,
      style = 'pop',
      mood = 'happy',
      tempo = 120,
      key = 'C',
      instrument = 'piano',
      language = 'english',
      reference_audio,
      simple_mode = false
    } = body

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `ace_step_${timestamp}.wav`
    const outputPath = join(process.cwd(), 'public', 'audio', filename)
    
    // Ensure audio directory exists
    await mkdir(join(process.cwd(), 'public', 'audio'), { recursive: true })

    // Build ACE-Step API call
    const aceStepUrl = 'http://localhost:8001/generate' // Default ACE-Step API server
    
    // Prepare request payload for ACE-Step
    const aceStepPayload = {
      prompt: buildDetailedPrompt({
        prompt,
        duration,
        style,
        mood,
        tempo,
        key,
        instrument,
        language,
        reference_audio,
        simple_mode
      }),
      duration: duration,
      // Add other ACE-Step specific parameters
      ...(reference_audio && { reference_audio }),
      ...(simple_mode && { mode: 'simple' })
    }

    console.log('Calling ACE-Step API with payload:', aceStepPayload)

    try {
      // Call ACE-Step API
      const response = await fetch(aceStepUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add API key if configured
          ...(process.env.ACE_STEP_API_KEY && {
            'Authorization': `Bearer ${process.env.ACE_STEP_API_KEY}`
          })
        },
        body: JSON.stringify(aceStepPayload)
      })

      if (!response.ok) {
        throw new Error(`ACE-Step API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      // Save the generated audio file
      if (result.audio_data) {
        // Convert base64 audio data to file
        const audioBuffer = Buffer.from(result.audio_data, 'base64')
        await writeFile(outputPath, audioBuffer)
        
        const audioUrl = `/audio/${filename}`
        
        return NextResponse.json({
          success: true,
          audio_url: audioUrl,
          metadata: {
            duration,
            style,
            mood,
            tempo,
            key,
            instrument,
            language,
            generation_time: result.generation_time,
            model_used: result.model_used
          }
        })
      } else {
        throw new Error('No audio data received from ACE-Step')
      }

    } catch (apiError) {
      console.error('ACE-Step API call failed:', apiError)
      
      // Fallback to mock generation for demo purposes
      return await generateMockAudio({
        prompt,
        duration,
        style,
        mood,
        tempo,
        key,
        instrument,
        language,
        filename,
        outputPath
      })
    }

  } catch (error) {
    console.error('Error in ACE-Step generation:', error)
    return NextResponse.json(
      { error: 'Failed to generate music', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function buildDetailedPrompt(params: {
  prompt: string
  duration: number
  style: string
  mood: string
  tempo: number
  key: string
  instrument: string
  language: string
  reference_audio?: string
  simple_mode: boolean
}): string {
  const {
    prompt,
    duration,
    style,
    mood,
    tempo,
    key,
    instrument,
    language,
    reference_audio,
    simple_mode
  } = params

  if (simple_mode) {
    return `${prompt}, ${style} style, ${mood} mood, ${duration} seconds`
  }

  let detailedPrompt = prompt

  // Add musical parameters
  detailedPrompt += `, ${style} music, ${mood} mood`
  detailedPrompt += `, ${tempo} BPM, key of ${key}`
  detailedPrompt += `, featuring ${instrument}`
  
  if (language !== 'english') {
    detailedPrompt += `, ${language} lyrics`
  }

  // Add duration specification
  detailedPrompt += `, ${duration} seconds duration`

  // Add reference audio info if provided
  if (reference_audio) {
    detailedPrompt += `, in the style of the reference audio`
  }

  // Add ACE-Step specific instructions
  detailedPrompt += ', high quality, professional production'
  detailedPrompt += ', suitable for singing practice'
  detailedPrompt += ', clear melody and harmony'

  return detailedPrompt
}

async function generateMockAudio(params: {
  prompt: string
  duration: number
  style: string
  mood: string
  tempo: number
  key: string
  instrument: string
  language: string
  filename: string
  outputPath: string
}): Promise<NextResponse> {
  // For demo purposes, create a placeholder audio file
  // In production, this would integrate with actual ACE-Step
  
  try {
    // Create a simple WAV file header (44 bytes) + silence
    const sampleRate = 44100
    const channels = 2
    const bitsPerSample = 16
    const duration = params.duration
    const byteRate = sampleRate * channels * bitsPerSample / 8
    const blockAlign = channels * bitsPerSample / 8
    const dataSize = duration * sampleRate * channels * bitsPerSample / 8
    const fileSize = 36 + dataSize

    const wavHeader = Buffer.alloc(44)
    let offset = 0

    // RIFF header
    wavHeader.write('RIFF', offset); offset += 4
    wavHeader.writeUInt32LE(fileSize, offset); offset += 4
    wavHeader.write('WAVE', offset); offset += 4
    
    // fmt chunk
    wavHeader.write('fmt ', offset); offset += 4
    wavHeader.writeUInt32LE(16, offset); offset += 4 // chunk size
    wavHeader.writeUInt16LE(1, offset); offset += 2 // audio format (PCM)
    wavHeader.writeUInt16LE(channels, offset); offset += 2
    wavHeader.writeUInt32LE(sampleRate, offset); offset += 4
    wavHeader.writeUInt32LE(byteRate, offset); offset += 4
    wavHeader.writeUInt16LE(blockAlign, offset); offset += 2
    wavHeader.writeUInt16LE(bitsPerSample, offset); offset += 2
    
    // data chunk
    wavHeader.write('data', offset); offset += 4
    wavHeader.writeUInt32LE(dataSize, offset); offset += 4

    // Create silence data
    const silenceData = Buffer.alloc(dataSize)
    
    // Combine header and data
    const wavFile = Buffer.concat([wavHeader, silenceData])
    
    await writeFile(params.outputPath, wavFile)
    
    const audioUrl = `/audio/${params.filename}`
    
    return NextResponse.json({
      success: true,
      audio_url: audioUrl,
      metadata: {
        duration: params.duration,
        style: params.style,
        mood: params.mood,
        tempo: params.tempo,
        key: params.key,
        instrument: params.instrument,
        language: params.language,
        generation_time: 'Mock generation',
        model_used: 'ACE-Step 1.5 (Mock)',
        note: 'This is a demo placeholder. Integrate with actual ACE-Step API for real music generation.'
      }
    })

  } catch (error) {
    throw new Error(`Failed to create mock audio: ${error}`)
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'status') {
      // Check ACE-Step API server status
      try {
        const response = await fetch('http://localhost:8001/health', {
          method: 'GET',
          timeout: 5000
        })
        
        if (response.ok) {
          const health = await response.json()
          return NextResponse.json({
            status: 'connected',
            ace_step: health,
            integration: 'active'
          })
        } else {
          return NextResponse.json({
            status: 'disconnected',
            ace_step: null,
            integration: 'inactive',
            message: 'ACE-Step API server not responding'
          })
        }
      } catch (error) {
        return NextResponse.json({
          status: 'disconnected',
          ace_step: null,
          integration: 'mock',
          message: 'Using mock generation - ACE-Step API not available'
        })
      }
    }

    if (type === 'models') {
      // Get available ACE-Step models
      return NextResponse.json({
        models: [
          {
            id: 'acestep-v15-turbo',
            name: 'ACE-Step v1.5 Turbo',
            description: 'Fast generation model',
            recommended: true
          },
          {
            id: 'acestep-v15-turbo-shift3',
            name: 'ACE-Step v1.5 Turbo Shift3',
            description: 'High quality model with shift3 enhancement'
          }
        ],
        language_models: [
          {
            id: 'acestep-5Hz-lm-0.6B',
            name: 'ACE-Step 5Hz LM 0.6B',
            description: 'Lightweight language model'
          },
          {
            id: 'acestep-5Hz-lm-1.7B',
            name: 'ACE-Step 5Hz LM 1.7B',
            description: 'Full-featured language model'
          }
        ]
      })
    }

    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error in ACE-Step API:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}