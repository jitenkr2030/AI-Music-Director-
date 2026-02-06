# 🎵 ACE-Step 1.5 Integration Guide

## Overview

AI Music Studio integrates **ACE-Step 1.5** - a state-of-the-art music generation model that produces commercial-quality audio in seconds. This integration allows users to generate professional music for practice, creation, and commercial use.

## 🚀 ACE-Step 1.5 Capabilities

### Performance Metrics
- **Generation Speed**: Under 2 seconds per full song on A100, under 10 seconds on RTX 3090
- **Quality Level**: Commercial-grade, between Suno v4.5 and Suno v5
- **Hardware Requirements**: Less than 4GB VRAM for basic generation
- **Duration Support**: 10 seconds to 10 minutes (600s)

### Key Features
- ✅ **Ultra-Fast Generation** - Lightning-fast music creation
- ✅ **Rich Style Support** - 1000+ instruments and musical styles
- ✅ **Multi-Language Lyrics** - Support for 50+ languages
- ✅ **Reference Audio Input** - Style transfer from existing music
- ✅ **Advanced Controls** - BPM, key, scale, time signature
- ✅ **Simple Mode** - Generate full songs from basic descriptions
- ✅ **Audio Understanding** - Extract musical features from audio
- ✅ **LoRA Training** - Personalize with your own style

## 🛠 Integration Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Next.js API   │    │  ACE-Step 1.5   │
│   (React)       │◄──►│   (route.ts)    │◄──►│   (Python)      │
│                 │    │                 │    │                 │
│ • Music UI      │    │ • Validation    │    │ • Generation    │
│ • Controls      │    │ • API Calls     │    │ • Models        │
│ • Preview       │    │ • File Handling │    │ • Processing    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 API Integration

### Endpoints

#### Generate Music
```http
POST /api/ace-step
Content-Type: application/json

{
  "prompt": "Happy pop song with piano",
  "duration": 120,
  "style": "pop",
  "mood": "happy",
  "tempo": 120,
  "key": "C",
  "instrument": "piano",
  "language": "english",
  "simple_mode": false
}
```

#### Check Status
```http
GET /api/ace-step?type=status
```

#### Get Available Models
```http
GET /api/ace-step?type=models
```

### Response Format
```json
{
  "success": true,
  "audio_url": "/audio/ace_step_1234567890.wav",
  "metadata": {
    "duration": 120,
    "style": "pop",
    "mood": "happy",
    "tempo": 120,
    "key": "C",
    "instrument": "piano",
    "language": "english",
    "generation_time": "1.8s",
    "model_used": "acestep-v15-turbo"
  }
}
```

## 🎯 Usage Examples

### Basic Music Generation
```typescript
const generateMusic = async () => {
  const response = await fetch('/api/ace-step', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: "Relaxing acoustic guitar melody",
      duration: 60,
      style: "acoustic",
      mood: "calm",
      tempo: 80,
      key: "G"
    })
  });
  
  const result = await response.json();
  if (result.success) {
    const audio = new Audio(result.audio_url);
    audio.play();
  }
};
```

### Simple Mode Generation
```typescript
const generateSimpleMusic = async () => {
  const response = await fetch('/api/ace-step', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: "Upbeat workout music",
      simple_mode: true,
      duration: 30
    })
  });
  
  return await response.json();
};
```

### Reference Audio Style Transfer
```typescript
const generateWithReference = async (referenceAudioUrl: string) => {
  const response = await fetch('/api/ace-step', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: "Create similar music",
      reference_audio: referenceAudioUrl,
      duration: 90
    })
  });
  
  return await response.json();
};
```

## 🎛 Available Models

### DiT Models (Music Generation)
| Model | Description | Use Case |
|-------|-------------|----------|
| `acestep-v15-turbo` | Fast generation model | Quick prototyping, practice |
| `acestep-v15-turbo-shift3` | High quality with shift3 | Professional production |

### Language Models (Planning & Lyrics)
| Model | Description | VRAM Required |
|-------|-------------|---------------|
| `acestep-5Hz-lm-0.6B` | Lightweight language model | 2GB |
| `acestep-5Hz-lm-1.7B` | Full-featured language model | 6GB |

## 🎨 Musical Parameters

### Styles
- **Pop**: Modern popular music
- **Rock**: Electric guitars, drums, bass
- **Classical**: Orchestral instruments
- **Jazz**: Swing, improvisation
- **Electronic**: Synthesizers, digital sounds
- **Folk**: Acoustic, traditional instruments
- **Blues**: Soulful, melancholic
- **Country**: Twang, acoustic guitars
- **Hip-Hop**: Beats, rap elements
- **Ambient**: Atmospheric, minimal

### Moods
- **Happy**: Upbeat, major keys
- **Sad**: Slow, minor keys
- **Energetic**: Fast tempo, driving rhythm
- **Relaxing**: Slow tempo, soft dynamics
- **Mysterious**: Dissonant, atmospheric
- **Romantic**: Lyrical, expressive
- **Dramatic**: Dynamic contrasts
- **Peaceful**: Calm, serene

### Instruments
- **Piano**: Versatile keyboard
- **Guitar**: Acoustic/Electric
- **Violin**: String instrument
- **Drums**: Percussion
- **Bass**: Low-frequency support
- **Synthesizer**: Electronic sounds
- **Flute**: Woodwind instrument
- **Trumpet**: Brass instrument
- **Saxophone**: Jazz/classical
- **Cello**: Deep strings

### Keys & Scales
- **Major**: Happy, bright (C, D, E, F, G, A, B)
- **Minor**: Sad, emotional (Am, Dm, Em, Fm, Gm, Cm)
- **Pentatonic**: Folk, blues (C5, D5, E5, G5, A5)
- **Blues**: Jazz, blues (C, Eb, F, F#, G, Bb)
- **Chromatic**: All 12 notes

## 🔧 Configuration

### Environment Variables
```env
# ACE-Step Configuration
ACESTEP_API_KEY=your-api-key
ACESTEP_API_URL=http://localhost:8001
ACESTEP_MODEL=acestep-v15-turbo
ACESTEP_LM_MODEL=acestep-5Hz-lm-0.6B

# Generation Settings
ACESTEP_DEFAULT_DURATION=30
ACESTEP_MAX_DURATION=300
ACESTEP_QUALITY=high
```

### Model Selection
```typescript
// Configure based on available hardware
const selectModel = (vramGB: number) => {
  if (vramGB >= 6) {
    return {
      dit: 'acestep-v15-turbo-shift3',
      lm: 'acestep-5Hz-lm-1.7B'
    };
  } else {
    return {
      dit: 'acestep-v15-turbo',
      lm: 'acestep-5Hz-lm-0.6B'
    };
  }
};
```

## 🎵 Music Generation Workflow

### 1. User Input
```typescript
const userRequest = {
  prompt: "Create a happy pop song for my birthday",
  duration: 120,
  style: "pop",
  mood: "happy"
};
```

### 2. Prompt Enhancement
The system enhances the user prompt with musical details:
```
"Create a happy pop song for my birthday, pop music, happy mood, 
120 BPM, key of C, featuring piano, 120 seconds duration, 
high quality, professional production, suitable for singing practice, 
clear melody and harmony"
```

### 3. API Call
```typescript
const response = await fetch('/api/ace-step', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(enhancedRequest)
});
```

### 4. Processing
- ACE-Step generates audio based on the prompt
- Audio is processed and saved to filesystem
- Metadata is extracted and stored

### 5. Response
```json
{
  "success": true,
  "audio_url": "/audio/generated_1234567890.wav",
  "metadata": {
    "duration": 120,
    "tempo": 120,
    "key": "C",
    "generation_time": "1.8s"
  }
}
```

## 🎯 Use Cases in AI Music Studio

### 1. **Practice Music Generation**
- Generate backing tracks for singing practice
- Create exercises in different keys and tempos
- Produce accompaniment for various skill levels

### 2. **Song Creation**
- Create complete songs from user ideas
- Generate custom music for lyrics
- Produce professional-quality demos

### 3. **Marketplace Content**
- Generate royalty-free background music
- Create jingles for commercial use
- Produce audio for content creators

### 4. **Video Soundtracks**
- Generate music for Remotion videos
- Create mood-appropriate soundtracks
- Produce audio for social media content

## 🚀 Performance Optimization

### Caching Strategy
```typescript
// Cache generated music for repeated requests
const cacheKey = `music_${JSON.stringify(requestParams)}`;
const cached = await cache.get(cacheKey);

if (cached) {
  return cached;
}

const result = await generateMusic(requestParams);
await cache.set(cacheKey, result, { ttl: 3600 });
```

### Batch Generation
```typescript
// Generate multiple variations
const generateVariations = async (basePrompt: string) => {
  const variations = [
    `${basePrompt}, slow tempo`,
    `${basePrompt}, fast tempo`,
    `${basePrompt}, minor key`,
    `${basePrompt}, major key`
  ];
  
  return Promise.all(
    variations.map(prompt => generateMusic({ prompt }))
  );
};
```

### Quality Settings
```typescript
const qualityPresets = {
  draft: { steps: 20, cfg_scale: 7 },
  standard: { steps: 50, cfg_scale: 7.5 },
  high: { steps: 100, cfg_scale: 8 }
};
```

## 🔍 Troubleshooting

### Common Issues

#### 1. ACE-Step API Not Available
**Problem**: API returns "disconnected" status
**Solution**: 
- Ensure ACE-Step server is running on port 8001
- Check Python environment and dependencies
- Verify model files are downloaded

#### 2. Slow Generation
**Problem**: Music generation takes too long
**Solution**:
- Use turbo model for faster generation
- Reduce duration or complexity
- Check GPU availability and memory

#### 3. Poor Quality Output
**Problem**: Generated music doesn't match expectations
**Solution**:
- Use more detailed prompts
- Try different model combinations
- Adjust parameters (tempo, key, style)

#### 4. Memory Issues
**Problem**: Out of memory errors
**Solution**:
- Use smaller language model
- Enable CPU offloading
- Reduce batch size

### Debug Mode
```typescript
// Enable detailed logging
const debugGeneration = async (params: MusicParams) => {
  console.log('Generation request:', params);
  
  const startTime = Date.now();
  const result = await generateMusic(params);
  const endTime = Date.now();
  
  console.log('Generation completed in:', endTime - startTime, 'ms');
  console.log('Result:', result);
  
  return result;
};
```

## 📈 Monitoring & Analytics

### Generation Metrics
```typescript
// Track generation performance
const trackGeneration = (params: MusicParams, result: MusicResult) => {
  analytics.track('music_generated', {
    duration: params.duration,
    style: params.style,
    mood: params.mood,
    generation_time: result.metadata.generation_time,
    model_used: result.metadata.model_used,
    success: result.success
  });
};
```

### Quality Scoring
```typescript
// Implement quality assessment
const assessQuality = (audioBuffer: ArrayBuffer) => {
  // Analyze audio characteristics
  const analysis = analyzeAudio(audioBuffer);
  
  return {
    clarity: analysis.signalToNoiseRatio,
    dynamics: analysis.dynamicRange,
    balance: analysis.frequencyBalance,
    overall: calculateOverallScore(analysis)
  };
};
```

## 🎚 Advanced Features

### Reference Audio Processing
```typescript
// Extract features from reference audio
const extractFeatures = async (audioFile: File) => {
  const audioData = await audioFile.arrayBuffer();
  const features = await analyzeAudio(audioData);
  
  return {
    tempo: features.tempo,
    key: features.key,
    timbre: features.timbre,
    structure: features.structure
  };
};
```

### Style Transfer
```typescript
// Apply style from reference audio
const styleTransfer = async (
  prompt: string, 
  referenceFeatures: AudioFeatures
) => {
  const enhancedPrompt = `
    ${prompt},
    in the style of: ${referenceFeatures.style},
    tempo: ${referenceFeatures.tempo} BPM,
    key: ${referenceFeatures.key},
    timbre characteristics: ${referenceFeatures.timbre}
  `;
  
  return generateMusic({ prompt: enhancedPrompt });
};
```

### Multi-Track Generation
```typescript
// Generate separate tracks for mixing
const generateMultiTrack = async (params: MusicParams) => {
  const tracks = await Promise.all([
    generateMusic({ ...params, instrument: 'drums' }),
    generateMusic({ ...params, instrument: 'bass' }),
    generateMusic({ ...params, instrument: 'piano' }),
    generateMusic({ ...params, instrument: 'melody' })
  ]);
  
  return mixTracks(tracks);
};
```

## 🔮 Future Enhancements

### Planned Features
- **Real-time Generation**: Live music creation
- **Custom Model Training**: User-specific style models
- **Collaborative Generation**: Multi-user music creation
- **Advanced Editing**: Note-level music editing
- **Integration Expansion**: More DAW and platform integrations

### Research Directions
- **Music Theory Integration**: Automated harmony and counterpoint
- **Emotion Recognition**: Generate music based on user mood
- **Cultural Adaptation**: Region-specific musical styles
- **Accessibility**: Features for musicians with disabilities

---

## 📞 Support

For ACE-Step integration issues:
- **Documentation**: [ACE-Step 1.5 Docs](https://github.com/ace-step/ACE-Step-1.5)
- **Community**: [ACE-Step Discord](https://discord.gg/PeWDxrkdj7)
- **Issues**: [GitHub Issues](https://github.com/ace-step/ACE-Step-1.5/issues)
- **AI Music Studio**: [Platform Support](https://github.com/jitenkr2030/AI-Music-Director-/issues)

---

*This integration brings professional music generation capabilities to AI Music Studio, enabling users to create high-quality music for learning, practice, and commercial use.*