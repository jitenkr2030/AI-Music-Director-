'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { 
  Mic, 
  Music, 
  Play, 
  Pause, 
  Download, 
  Wand2,
  Clock,
  Volume2,
  Sparkles,
  FileAudio,
  Layers,
  Zap
} from 'lucide-react'

interface CreationProject {
  id: string
  title: string
  mood: string
  language: string
  duration: number
  vocalStyle: string
  instrumentalStyle: string
  status: 'draft' | 'processing' | 'completed'
  audioUrl?: string
  createdAt: Date
}

const MOODS = [
  'Happy', 'Romantic', 'Energetic', 'Calm', 'Mysterious', 'Dramatic', 'Uplifting', 'Melancholic'
]

const LANGUAGES = [
  'English', 'Hindi', 'Spanish', 'French', 'Tamil', 'Telugu', 'Punjabi', 'Bengali'
]

const VOCAL_STYLES = [
  'Pop', 'Classical', 'R&B', 'Rock', 'Jazz', 'Folk', 'Rap', 'Country'
]

const INSTRUMENTAL_STYLES = [
  'Acoustic', 'Electronic', 'Orchestral', 'Lo-fi', 'Hip-Hop', 'EDM', 'Blues', 'Reggae'
]

export default function SingWithAI() {
  const [projectTitle, setProjectTitle] = useState('')
  const [selectedMood, setSelectedMood] = useState('Happy')
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [selectedVocalStyle, setSelectedVocalStyle] = useState('Pop')
  const [selectedInstrumentalStyle, setSelectedInstrumentalStyle] = useState('Electronic')
  const [duration, setDuration] = useState([120])
  const [lyrics, setLyrics] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [projects, setProjects] = useState<CreationProject[]>([])
  const [currentProject, setCurrentProject] = useState<CreationProject | null>(null)

  const startCreation = async () => {
    if (!projectTitle.trim()) {
      alert('Please enter a project title')
      return
    }

    const newProject: CreationProject = {
      id: Date.now().toString(),
      title: projectTitle,
      mood: selectedMood,
      language: selectedLanguage,
      duration: duration[0],
      vocalStyle: selectedVocalStyle,
      instrumentalStyle: selectedInstrumentalStyle,
      status: 'processing',
      createdAt: new Date()
    }

    setProjects(prev => [newProject, ...prev])
    setCurrentProject(newProject)
    setIsProcessing(true)
    setProcessingProgress(0)

    // Simulate AI processing
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 800)

    setTimeout(() => {
      clearInterval(progressInterval)
      setProcessingProgress(100)
      
      const completedProject = { ...newProject, status: 'completed' as const }
      setProjects(prev => prev.map(p => p.id === newProject.id ? completedProject : p))
      setCurrentProject(completedProject)
      setIsProcessing(false)
      setProcessingProgress(0)
    }, 8000)
  }

  const startRecording = () => {
    setIsRecording(true)
    // Simulate recording for demo
    setTimeout(() => {
      setIsRecording(false)
    }, 5000)
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'processing': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Sing With AI
          </h1>
          <p className="text-gray-600">Create complete songs by combining your voice with AI-generated music</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Creation Studio */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-6 w-6 text-purple-600" />
                  Creation Studio
                </CardTitle>
                <CardDescription>
                  Configure your song and let AI create the perfect backdrop for your voice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="settings" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="voice">Voice</TabsTrigger>
                    <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="settings" className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Project Title</label>
                      <input
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="Enter your song title..."
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
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
                        <label className="text-sm font-medium">Vocal Style</label>
                        <Select value={selectedVocalStyle} onValueChange={setSelectedVocalStyle}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {VOCAL_STYLES.map(style => (
                              <SelectItem key={style} value={style}>{style}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Instrumental Style</label>
                        <Select value={selectedInstrumentalStyle} onValueChange={setSelectedInstrumentalStyle}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {INSTRUMENTAL_STYLES.map(style => (
                              <SelectItem key={style} value={style}>{style}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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
                        min={30}
                        step={30}
                        className="w-full"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="voice" className="space-y-6">
                    <div className="text-center p-8 bg-gray-50 rounded-lg">
                      <div className="mb-4">
                        <div className="w-24 h-24 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                          <Mic className="h-12 w-12 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Record Your Voice</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Sing your melody and AI will create the perfect accompaniment
                        </p>
                      </div>

                      <div className="flex justify-center gap-4">
                        {!isRecording ? (
                          <Button
                            onClick={startRecording}
                            size="lg"
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            <Mic className="mr-2 h-5 w-5" />
                            Start Recording
                          </Button>
                        ) : (
                          <Button size="lg" variant="destructive" disabled>
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-2" />
                            Recording...
                          </Button>
                        )}
                      </div>

                      {isRecording && (
                        <div className="mt-4 text-sm text-red-600">
                          Recording your voice... Sing naturally!
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <h4 className="font-medium">Smart Sync</h4>
                            <p className="text-xs text-gray-600 mt-1">
                              AI automatically syncs music to your voice
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <Layers className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                            <h4 className="font-medium">Multi-layer</h4>
                            <p className="text-xs text-gray-600 mt-1">
                              Add harmonies and backing vocals
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="lyrics" className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Song Lyrics (Optional)</label>
                      <Textarea
                        value={lyrics}
                        onChange={(e) => setLyrics(e.target.value)}
                        placeholder="Enter your lyrics here, or let AI help you create them..."
                        className="min-h-[200px]"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1">
                        <Sparkles className="mr-2 h-4 w-4" />
                        AI Lyrics Help
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <FileAudio className="mr-2 h-4 w-4" />
                        Import Lyrics
                      </Button>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">AI Lyrics Assistant</h4>
                      <p className="text-sm text-blue-800">
                        Our AI can help you write lyrics based on your mood, theme, and style. 
                        Just describe what you want to sing about!
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Processing Progress */}
                {isProcessing && currentProject && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 animate-spin text-purple-600" />
                      <span className="text-sm font-medium">Creating your song...</span>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">
                      AI is generating music and syncing with your voice
                    </p>
                  </div>
                )}

                {/* Create Button */}
                <div className="mt-6">
                  <Button 
                    onClick={startCreation}
                    disabled={isProcessing || !projectTitle.trim()}
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isProcessing ? (
                      <>
                        <Zap className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Music className="mr-2 h-5 w-5" />
                        Create Song
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            {projects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileAudio className="h-6 w-6 text-green-600" />
                    Your Creations
                  </CardTitle>
                  <CardDescription>
                    Listen, download, or share your AI-enhanced songs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{project.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {project.mood}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {project.language}
                              </Badge>
                              <Badge className={`text-xs ${getStatusBadge(project.status)}`}>
                                {project.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatDuration(project.duration)}
                              </span>
                            </div>
                          </div>
                          
                          {project.status === 'completed' && (
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Play className="h-4 w-4" />
                              </Button>
                              
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Audio Waveform Placeholder */}
                        <div className="h-12 bg-gray-200 rounded-lg flex items-center px-2">
                          <div className="w-full h-8 bg-gradient-to-r from-purple-200 to-pink-200 rounded flex items-center justify-center">
                            {project.status === 'processing' ? (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                              </div>
                            ) : (
                              <Volume2 className="h-4 w-4 text-gray-500" />
                            )}
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
                    { name: 'Pop Love Song', mood: 'Romantic', vocal: 'Pop', instrumental: 'Electronic' },
                    { name: 'Devotional Bhajan', mood: 'Calm', vocal: 'Classical', instrumental: 'Acoustic' },
                    { name: 'Party Anthem', mood: 'Energetic', vocal: 'Pop', instrumental: 'EDM' },
                    { name: 'Acoustic Ballad', mood: 'Melancholic', vocal: 'Folk', instrumental: 'Acoustic' },
                  ].map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setProjectTitle(template.name)
                        setSelectedMood(template.mood)
                        setSelectedVocalStyle(template.vocal)
                        setSelectedInstrumentalStyle(template.instrumental)
                      }}
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Creation Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">8</div>
                      <div className="text-xs text-gray-600">Songs Created</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">2.5K</div>
                      <div className="text-xs text-gray-600">Total Plays</div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-sm font-medium mb-2">Most Used Styles</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Pop Vocals</span>
                        <span className="text-gray-500">40%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Electronic</span>
                        <span className="text-gray-500">30%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Acoustic</span>
                        <span className="text-gray-500">30%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  AI Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Smart vocal pitch correction</li>
                  <li>• Automatic harmony generation</li>
                  <li>• Intelligent music arrangement</li>
                  <li>• Real-time voice processing</li>
                  <li>• Professional mixing & mastering</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}