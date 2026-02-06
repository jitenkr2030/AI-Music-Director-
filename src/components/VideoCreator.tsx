'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Video, 
  Play, 
  Download, 
  Settings, 
  Wand2,
  Music,
  FileVideo,
  Palette,
  Clock,
  Zap,
  Eye,
  Sparkles
} from 'lucide-react'

interface VideoTemplate {
  id: string
  name: string
  description: string
  duration: number
  defaultProps: any
  customizable: string[]
}

interface GeneratedVideo {
  id: string
  url: string
  template: string
  createdAt: Date
  status: 'processing' | 'completed' | 'error'
  metadata?: any
}

export default function VideoCreator() {
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplate | null>(null)
  const [videoProps, setVideoProps] = useState<any>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([])
  const [templates, setTemplates] = useState<VideoTemplate[]>([])

  // Load templates on mount
  React.useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/video?type=templates')
      const data = await response.json()
      setTemplates(data.templates)
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  }

  const generateVideo = async () => {
    if (!selectedTemplate) {
      alert('Please select a template')
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      const response = await fetch('/api/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          compositionId: selectedTemplate.id,
          inputProps: { ...selectedTemplate.defaultProps, ...videoProps },
          format: 'mp4',
          quality: 'medium',
          fps: 30,
          width: selectedTemplate.id === 'PromoVideo' ? 1080 : 1920,
          height: selectedTemplate.id === 'PromoVideo' ? 1920 : 1080
        })
      })

      const data = await response.json()

      clearInterval(progressInterval)
      setGenerationProgress(100)

      if (data.success) {
        const newVideo: GeneratedVideo = {
          id: Date.now().toString(),
          url: data.videoUrl,
          template: selectedTemplate.name,
          createdAt: new Date(),
          status: 'completed',
          metadata: data.metadata
        }

        setGeneratedVideos(prev => [newVideo, ...prev])
      } else {
        throw new Error(data.error)
      }

    } catch (error) {
      console.error('Video generation failed:', error)
      alert('Failed to generate video. Please try again.')
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  const updateVideoProp = (key: string, value: any) => {
    setVideoProps(prev => ({ ...prev, [key]: value }))
  }

  const renderTemplateCustomization = () => {
    if (!selectedTemplate) return null

    const { customizable, defaultProps } = selectedTemplate

    return (
      <div className="space-y-4">
        {customizable.includes('songTitle') && (
          <div className="space-y-2">
            <Label htmlFor="songTitle">Song Title</Label>
            <Input
              id="songTitle"
              value={videoProps.songTitle || defaultProps.songTitle || ''}
              onChange={(e) => updateVideoProp('songTitle', e.target.value)}
              placeholder="Enter song title"
            />
          </div>
        )}

        {customizable.includes('artistName') && (
          <div className="space-y-2">
            <Label htmlFor="artistName">Artist Name</Label>
            <Input
              id="artistName"
              value={videoProps.artistName || defaultProps.artistName || ''}
              onChange={(e) => updateVideoProp('artistName', e.target.value)}
              placeholder="Enter artist name"
            />
          </div>
        )}

        {customizable.includes('mood') && (
          <div className="space-y-2">
            <Label htmlFor="mood">Mood</Label>
            <Select 
              value={videoProps.mood || defaultProps.mood || 'happy'} 
              onValueChange={(value) => updateVideoProp('mood', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="sad">Sad</SelectItem>
                <SelectItem value="energetic">Energetic</SelectItem>
                <SelectItem value="calm">Calm</SelectItem>
                <SelectItem value="romantic">Romantic</SelectItem>
                <SelectItem value="mysterious">Mysterious</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {customizable.includes('genre') && (
          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Select 
              value={videoProps.genre || defaultProps.genre || 'Pop'} 
              onValueChange={(value) => updateVideoProp('genre', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pop">Pop</SelectItem>
                <SelectItem value="Rock">Rock</SelectItem>
                <SelectItem value="Electronic">Electronic</SelectItem>
                <SelectItem value="Classical">Classical</SelectItem>
                <SelectItem value="Jazz">Jazz</SelectItem>
                <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {customizable.includes('visualStyle') && (
          <div className="space-y-2">
            <Label htmlFor="visualStyle">Visual Style</Label>
            <Select 
              value={videoProps.visualStyle || defaultProps.visualStyle || 'abstract'} 
              onValueChange={(value) => updateVideoProp('visualStyle', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abstract">Abstract</SelectItem>
                <SelectItem value="geometric">Geometric</SelectItem>
                <SelectItem value="organic">Organic</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {customizable.includes('style') && (
          <div className="space-y-2">
            <Label htmlFor="style">Lyric Style</Label>
            <Select 
              value={videoProps.style || defaultProps.style || 'dynamic'} 
              onValueChange={(value) => updateVideoProp('style', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="dynamic">Dynamic</SelectItem>
                <SelectItem value="cinematic">Cinematic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {customizable.includes('colorScheme') && (
          <div className="space-y-2">
            <Label htmlFor="colorScheme">Color Scheme</Label>
            <Select 
              value={videoProps.colorScheme || defaultProps.colorScheme || 'rainbow'} 
              onValueChange={(value) => updateVideoProp('colorScheme', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rainbow">Rainbow</SelectItem>
                <SelectItem value="monochrome">Monochrome</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="neon">Neon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {customizable.includes('lyrics') && (
          <div className="space-y-2">
            <Label htmlFor="lyrics">Lyrics (one per line)</Label>
            <Textarea
              id="lyrics"
              value={videoProps.lyrics?.map((l: any) => l.text).join('\n') || ''}
              onChange={(e) => {
                const lines = e.target.value.split('\n').filter(line => line.trim())
                const lyrics = lines.map((text, index) => ({
                  text,
                  startTime: index * 4,
                  endTime: (index + 1) * 4
                }))
                updateVideoProp('lyrics', lyrics)
              }}
              placeholder="Enter lyrics, one line per verse"
              rows={6}
            />
          </div>
        )}

        {customizable.includes('callToAction') && (
          <div className="space-y-2">
            <Label htmlFor="callToAction">Call to Action</Label>
            <Input
              id="callToAction"
              value={videoProps.callToAction || defaultProps.callToAction || 'Listen Now'}
              onChange={(e) => updateVideoProp('callToAction', e.target.value)}
              placeholder="Enter call to action text"
            />
          </div>
        )}

        {customizable.includes('description') && (
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={videoProps.description || ''}
              onChange={(e) => updateVideoProp('description', e.target.value)}
              placeholder="Enter video description"
              rows={3}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            AI Video Creator
          </h1>
          <p className="text-gray-600">Create stunning music videos using Remotion and AI</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileVideo className="h-6 w-6 text-purple-600" />
                  Video Templates
                </CardTitle>
                <CardDescription>
                  Choose a template to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate?.id === template.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedTemplate(template)
                        setVideoProps({})
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {template.duration}s
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generation Progress */}
            {isGenerating && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-6 w-6 text-purple-600 animate-spin" />
                    Generating Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={generationProgress} className="h-2" />
                    <p className="text-sm text-gray-600">
                      {generationProgress < 30 && 'Preparing assets...'}
                      {generationProgress >= 30 && generationProgress < 70 && 'Rendering frames...'}
                      {generationProgress >= 70 && 'Encoding video...'}
                      {generationProgress >= 90 && 'Finalizing...'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Customization */}
          <div className="lg:col-span-2 space-y-6">
            {selectedTemplate ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-6 w-6 text-purple-600" />
                    Customize {selectedTemplate.name}
                  </CardTitle>
                  <CardDescription>
                    Adjust the settings to create your perfect video
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderTemplateCustomization()}
                  
                  <div className="mt-6 pt-6 border-t">
                    <Button
                      onClick={generateVideo}
                      disabled={isGenerating}
                      size="lg"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isGenerating ? (
                        <>
                          <Wand2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Video className="mr-2 h-5 w-5" />
                          Generate Video
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Select a Template
                  </h3>
                  <p className="text-sm text-gray-500">
                    Choose a video template from the left to get started
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Generated Videos */}
            {generatedVideos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-6 w-6 text-green-600" />
                    Your Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedVideos.map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{video.template}</h4>
                          <p className="text-sm text-gray-600">
                            Created {video.createdAt.toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}