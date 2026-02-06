'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { 
  Mic, 
  Music, 
  Play, 
  Pause, 
  BookOpen,
  PenTool,
  Sparkles,
  Clock,
  Volume2,
  FileText,
  MessageSquare,
  Lightbulb,
  ChevronRight,
  Type
} from 'lucide-react'

interface KaraokeLine {
  id: string
  text: string
  startTime: number
  endTime: number
  isCurrent?: boolean
}

interface LyricProject {
  id: string
  title: string
  theme: string
  language: string
  lyrics: string
  karaokeLines: KaraokeLine[]
  createdAt: Date
}

const THEMES = [
  'Love', 'Friendship', 'Nature', 'Celebration', 'Motivation', 'Heartbreak', 'Dreams', 'Journey'
]

const LANGUAGES = [
  'English', 'Hindi', 'Spanish', 'French', 'Tamil', 'Telugu', 'Punjabi', 'Bengali'
]

const LYRIC_STYLES = [
  'Rhyming', 'Free Verse', 'Narrative', 'Abstract', 'Conversational', 'Poetic'
]

export default function LyricsKaraoke() {
  const [selectedTheme, setSelectedTheme] = useState('Love')
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [selectedStyle, setSelectedStyle] = useState('Rhyming')
  const [lyricIdea, setLyricIdea] = useState('')
  const [generatedLyrics, setGeneratedLyrics] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [projects, setProjects] = useState<LyricProject[]>([])
  const [currentProject, setCurrentProject] = useState<LyricProject | null>(null)
  const [isKaraokeMode, setIsKaraokeMode] = useState(false)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState([1.0])

  const generateLyrics = async () => {
    if (!lyricIdea.trim()) {
      alert('Please enter your song idea or theme')
      return
    }

    setIsGenerating(true)
    
    // Simulate AI lyric generation
    setTimeout(() => {
      const sampleLyrics = `
Verse 1:
In the quiet of the morning light
I see your face and feel so right
The world outside can wait its turn
For this moment that we've earned

Chorus:
Love is the song that we sing together
Through stormy weather and sunny weather
Hand in hand, we'll face whatever
Our love will last forever

Verse 2:
Like rivers flowing to the sea
You're the destination meant for me
Every step along this winding road
You're the light that guides me home

Bridge:
When darkness falls and stars appear
I know that you are always near
Whisper words that calm my soul
You make me completely whole
      `.trim()

      setGeneratedLyrics(sampleLyrics)
      setIsGenerating(false)

      const newProject: LyricProject = {
        id: Date.now().toString(),
        title: `${selectedTheme} Song`,
        theme: selectedTheme,
        language: selectedLanguage,
        lyrics: sampleLyrics,
        karaokeLines: parseLyricsToKaraoke(sampleLyrics),
        createdAt: new Date()
      }

      setProjects(prev => [newProject, ...prev])
      setCurrentProject(newProject)
    }, 3000)
  }

  const parseLyricsToKaraoke = (lyrics: string): KaraokeLine[] => {
    const lines = lyrics.split('\n').filter(line => line.trim())
    return lines.map((line, index) => ({
      id: `line-${index}`,
      text: line.trim(),
      startTime: index * 4, // 4 seconds per line
      endTime: (index + 1) * 4,
      isCurrent: index === 0
    }))
  }

  const startKaraoke = () => {
    setIsKaraokeMode(true)
    setIsPlaying(true)
    setCurrentLineIndex(0)
    
    // Simulate karaoke playback
    const interval = setInterval(() => {
      setCurrentLineIndex(prev => {
        if (prev >= (currentProject?.karaokeLines.length || 0) - 1) {
          setIsPlaying(false)
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 4000 / playbackSpeed[0]) // Adjust timing based on playback speed
  }

  const stopKaraoke = () => {
    setIsKaraokeMode(false)
    setIsPlaying(false)
    setCurrentLineIndex(0)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Lyrics & Karaoke
          </h1>
          <p className="text-gray-600">Write songs with AI assistance and practice with karaoke-style guidance</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-6 w-6 text-purple-600" />
                  AI Lyric Writer
                </CardTitle>
                <CardDescription>
                  Describe your song idea and let AI help you create beautiful lyrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="create" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="create">Create Lyrics</TabsTrigger>
                    <TabsTrigger value="karaoke">Karaoke Practice</TabsTrigger>
                  </TabsList>

                  <TabsContent value="create" className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Theme</label>
                        <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {THEMES.map(theme => (
                              <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Language</label>
                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map(lang => (
                              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Style</label>
                        <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LYRIC_STYLES.map(style => (
                              <SelectItem key={style} value={style}>{style}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Your Song Idea</label>
                      <Textarea
                        value={lyricIdea}
                        onChange={(e) => setLyricIdea(e.target.value)}
                        placeholder="Describe what you want to sing about... (e.g., 'A song about finding love in unexpected places', 'Celebrating friendship through thick and thin')"
                        className="min-h-[100px]"
                      />
                    </div>

                    <Button 
                      onClick={generateLyrics}
                      disabled={isGenerating || !lyricIdea.trim()}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                          Generating Lyrics...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Generate Lyrics
                        </>
                      )}
                    </Button>

                    {generatedLyrics && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-3">Generated Lyrics</h3>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <pre className="whitespace-pre-wrap font-sans text-sm">
                            {generatedLyrics}
                          </pre>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Save
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Refine
                          </Button>
                          <Button variant="outline" size="sm">
                            <Music className="mr-2 h-4 w-4" />
                            Create Karaoke
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="karaoke" className="space-y-6">
                    {currentProject ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">{currentProject.title}</h3>
                            <p className="text-sm text-gray-600">
                              {currentProject.theme} • {currentProject.language}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!isKaraokeMode ? (
                              <Button onClick={startKaraoke}>
                                <Play className="mr-2 h-4 w-4" />
                                Start Practice
                              </Button>
                            ) : (
                              <Button onClick={stopKaraoke} variant="destructive">
                                <Pause className="mr-2 h-4 w-4" />
                                Stop
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Playback Controls */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium">Playback Speed</span>
                            <span className="text-sm text-gray-600">{playbackSpeed[0]}x</span>
                          </div>
                          <Slider
                            value={playbackSpeed}
                            onValueChange={setPlaybackSpeed}
                            max={1.5}
                            min={0.5}
                            step={0.1}
                            className="w-full"
                          />
                        </div>

                        {/* Karaoke Display */}
                        <div className="p-6 bg-gradient-to-b from-purple-100 to-pink-100 rounded-lg min-h-[300px]">
                          <div className="space-y-4">
                            {currentProject.karaokeLines.map((line, index) => (
                              <div
                                key={line.id}
                                className={`text-center p-3 rounded-lg transition-all ${
                                  index === currentLineIndex && isKaraokeMode
                                    ? 'bg-white shadow-lg text-purple-600 font-bold text-lg scale-105'
                                    : index < currentLineIndex && isKaraokeMode
                                    ? 'text-gray-400 text-sm'
                                    : 'text-gray-700'
                                }`}
                              >
                                {line.text}
                                {index === currentLineIndex && isKaraokeMode && (
                                  <div className="mt-2">
                                    <div className="h-1 bg-purple-200 rounded-full overflow-hidden">
                                      <div className="h-full bg-purple-600 rounded-full animate-pulse" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {isKaraokeMode && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Line {currentLineIndex + 1} of {currentProject.karaokeLines.length}</span>
                              <span>{formatTime(currentLineIndex * 4)}</span>
                            </div>
                            <Progress 
                              value={((currentLineIndex + 1) / currentProject.karaokeLines.length) * 100} 
                              className="h-2" 
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No Lyrics Yet</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Create some lyrics first to start practicing with karaoke
                        </p>
                        <Button onClick={() => {}} variant="outline">
                          <PenTool className="mr-2 h-4 w-4" />
                          Create Lyrics
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            {projects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-green-600" />
                    Your Lyric Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div 
                        key={project.id}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => setCurrentProject(project)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{project.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {project.theme}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {project.language}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {project.karaokeLines.length} lines
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
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
            {/* AI Writing Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  AI Writing Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Be specific about emotions</li>
                  <li>• Include sensory details</li>
                  <li>• Use metaphors and similes</li>
                  <li>• Create a clear story arc</li>
                  <li>• Repeat key phrases for impact</li>
                </ul>
              </CardContent>
            </Card>

            {/* Lyric Structure Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Type className="h-5 w-5 text-purple-500" />
                  Song Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-2 bg-purple-50 rounded">
                    <div className="font-medium text-purple-900">Verse</div>
                    <div className="text-xs text-purple-700">Tells the story, develops characters</div>
                  </div>
                  <div className="p-2 bg-pink-50 rounded">
                    <div className="font-medium text-pink-900">Chorus</div>
                    <div className="text-xs text-pink-700">Main message, memorable hook</div>
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="font-medium text-blue-900">Bridge</div>
                    <div className="text-xs text-blue-700">New perspective, emotional shift</div>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <div className="font-medium text-green-900">Outro</div>
                    <div className="text-xs text-green-700">Conclusion, fade out</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Practice Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Practice Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">12</div>
                      <div className="text-xs text-gray-600">Songs Written</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">28</div>
                      <div className="text-xs text-gray-600">Karaoke Sessions</div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-sm font-medium mb-2">Favorite Themes</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Love</span>
                        <span className="text-gray-500">45%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Motivation</span>
                        <span className="text-gray-500">30%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Nature</span>
                        <span className="text-gray-500">25%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}