'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Music, 
  Play, 
  Pause, 
  Download, 
  Settings, 
  Zap,
  Clock,
  Volume2,
  RefreshCw,
  Headphones,
  Piano
} from 'lucide-react'

interface MusicTrack {
  id: string
  title: string
  genre: string
  mood: string
  tempo: number
  key: string
  duration: number
  audioUrl?: string
  isGenerating?: boolean
}

const GENRES = [
  'Classical', 'Pop', 'Lo-fi', 'Devotional', 'Romantic', 'Rock', 'Jazz', 'Electronic', 'Folk'
]

const MOODS = [
  'Calm', 'Energetic', 'Romantic', 'Meditative', 'Happy', 'Melancholic', 'Uplifting', 'Mysterious'
]

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const INSTRUMENTS = [
  'Tanpura', 'Harmonium', 'Piano', 'Guitar', 'Strings', 'Flute', 'Drums', 'Full Orchestra'
]

export default function PracticeMusic() {
  const [selectedGenre, setSelectedGenre] = useState('Lo-fi')
  const [selectedMood, setSelectedMood] = useState('Calm')
  const [selectedKey, setSelectedKey] = useState('C')
  const [selectedInstrument, setSelectedInstrument] = useState('Piano')
  const [tempo, setTempo] = useState([120])
  const [duration, setDuration] = useState([30])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTracks, setGeneratedTracks] = useState<MusicTrack[]>([])
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)

  const generateMusic = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate music generation progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    // Simulate API call to ACE-Step
    setTimeout(() => {
      clearInterval(progressInterval)
      setGenerationProgress(100)
      
      const newTrack: MusicTrack = {
        id: Date.now().toString(),
        title: `${selectedMood} ${selectedGenre} in ${selectedKey}`,
        genre: selectedGenre,
        mood: selectedMood,
        tempo: tempo[0],
        key: selectedKey,
        duration: duration[0],
        audioUrl: '/api/placeholder-audio', // Placeholder
        isGenerating: false
      }

      setGeneratedTracks(prev => [newTrack, ...prev])
      setIsGenerating(false)
      setGenerationProgress(0)
    }, 3000)
  }

  const togglePlay = (trackId: string) => {
    setIsPlaying(isPlaying === trackId ? null : trackId)
  }

  const downloadTrack = (track: MusicTrack) => {
    // Simulate download
    const link = document.createElement('a')
    link.href = track.audioUrl || '#'
    link.download = `${track.title}.mp3`
    link.click()
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            AI Practice Music
          </h1>
          <p className="text-gray-600">Generate custom backing tracks powered by ACE-Step technology</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Music Generator */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-purple-600" />
                  Music Generator
                </CardTitle>
                <CardDescription>
                  Customize your practice music with AI-powered generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Genre</label>
                        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {GENRES.map(genre => (
                              <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Mood</label>
                        <Select value={selectedMood} onValueChange={setSelectedMood}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MOODS.map(mood => (
                              <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Key</label>
                        <Select value={selectedKey} onValueChange={setSelectedKey}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {KEYS.map(key => (
                              <SelectItem key={key} value={key}>{key}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Instrument</label>
                        <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {INSTRUMENTS.map(instrument => (
                              <SelectItem key={instrument} value={instrument}>{instrument}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Tempo (BPM)</label>
                          <span className="text-sm text-gray-600">{tempo[0]} BPM</span>
                        </div>
                        <Slider
                          value={tempo}
                          onValueChange={setTempo}
                          max={200}
                          min={40}
                          step={5}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Duration</label>
                          <span className="text-sm text-gray-600">{formatDuration(duration[0])}</span>
                        </div>
                        <Slider
                          value={duration}
                          onValueChange={setDuration}
                          max={300}
                          min={15}
                          step={15}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Time Signature</label>
                        <Select defaultValue="4/4">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4/4">4/4</SelectItem>
                            <SelectItem value="3/4">3/4</SelectItem>
                            <SelectItem value="6/8">6/8</SelectItem>
                            <SelectItem value="2/4">2/4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Scale Type</label>
                        <Select defaultValue="major">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="major">Major</SelectItem>
                            <SelectItem value="minor">Minor</SelectItem>
                            <SelectItem value="pentatonic">Pentatonic</SelectItem>
                            <SelectItem value="blues">Blues</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Complexity</label>
                        <Slider
                          defaultValue={[50]}
                          max={100}
                          min={0}
                          step={10}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Instrument Layers</label>
                        <Slider
                          defaultValue={[3]}
                          max={8}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Generation Progress */}
                {isGenerating && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-purple-600" />
                      <span className="text-sm font-medium">Generating music...</span>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">
                      ACE-Step is creating your custom track
                    </p>
                  </div>
                )}

                {/* Generate Button */}
                <div className="mt-6">
                  <Button 
                    onClick={generateMusic}
                    disabled={isGenerating}
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Music className="mr-2 h-5 w-5" />
                        Generate Practice Music
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generated Tracks */}
            {generatedTracks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-6 w-6 text-green-600" />
                    Your Generated Tracks
                  </CardTitle>
                  <CardDescription>
                    Play, download, or practice with your custom music
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedTracks.map((track) => (
                      <div key={track.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{track.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {track.genre}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {track.key} • {track.tempo} BPM
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatDuration(track.duration)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => togglePlay(track.id)}
                            >
                              {isPlaying === track.id ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadTrack(track)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Audio Waveform Placeholder */}
                        <div className="h-12 bg-gray-200 rounded-lg flex items-center px-2">
                          <div className="w-full h-8 bg-gradient-to-r from-purple-200 to-pink-200 rounded flex items-center justify-center">
                            <Volume2 className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Tanpura Practice', genre: 'Classical', mood: 'Meditative', instrument: 'Tanpura' },
                    { name: 'Lo-fi Study', genre: 'Lo-fi', mood: 'Calm', instrument: 'Piano' },
                    { name: 'Pop Vocal', genre: 'Pop', mood: 'Happy', instrument: 'Full Orchestra' },
                    { name: 'Devotional', genre: 'Devotional', mood: 'Meditative', instrument: 'Harmonium' },
                  ].map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setSelectedGenre(template.genre)
                        setSelectedMood(template.mood)
                        setSelectedInstrument(template.instrument)
                      }}
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Generations Today</span>
                      <span>3/10</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>This Month</span>
                      <span>47/100</span>
                    </div>
                    <Progress value={47} className="h-2" />
                  </div>

                  <div className="pt-2 border-t">
                    <div className="text-lg font-bold text-purple-600">23</div>
                    <div className="text-sm text-gray-600">Total tracks created</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Piano className="h-5 w-5 text-purple-500" />
                  Practice Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Start with slower tempos and gradually increase</li>
                  <li>• Practice in different keys to build versatility</li>
                  <li>• Use consistent tempo for rhythm training</li>
                  <li>• Try different moods to explore emotional range</li>
                  <li>• Record yourself practicing with the tracks</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}