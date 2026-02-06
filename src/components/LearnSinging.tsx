'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

interface PracticeSession {
  id: string
  type: 'pitch' | 'rhythm' | 'stability' | 'full-song'
  duration: number
  score: number
  feedback: string
  timestamp: Date
}

export default function LearnSinging() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null)
  const [sessionHistory, setSessionHistory] = useState<PracticeSession[]>([])
  const [selectedExercise, setSelectedExercise] = useState<'pitch' | 'rhythm' | 'stability'>('pitch')
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Setup audio context for level monitoring
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 256

      // Setup media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      const chunks: Blob[] = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        await analyzeRecording(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
        updateAudioLevel()
      }, 100)

    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Please allow microphone access to use this feature.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }

  const updateAudioLevel = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      setAudioLevel(Math.min(100, (average / 128) * 100))
    }
  }

  const analyzeRecording = async (blob: Blob) => {
    // Simulate AI analysis
    const scores = {
      pitch: Math.random() * 40 + 60, // 60-100
      rhythm: Math.random() * 30 + 70, // 70-100
      stability: Math.random() * 35 + 65, // 65-100
    }

    const overallScore = (scores.pitch + scores.rhythm + scores.stability) / 3

    const feedback = generateFeedback(selectedExercise, overallScore)

    const session: PracticeSession = {
      id: Date.now().toString(),
      type: selectedExercise,
      duration: recordingTime,
      score: overallScore,
      feedback,
      timestamp: new Date()
    }

    setCurrentSession(session)
    setSessionHistory(prev => [session, ...prev.slice(0, 9)]) // Keep last 10 sessions
  }

  const generateFeedback = (type: string, score: number): string => {
    if (score >= 90) {
      return "Excellent! Your performance is outstanding. Keep up the great work!"
    } else if (score >= 75) {
      return "Good job! You're showing solid improvement. Focus on consistency."
    } else if (score >= 60) {
      return "Nice effort! Practice regularly to build muscle memory and control."
    } else {
      return "Keep practicing! Everyone starts somewhere. Focus on breathing and posture."
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number): string => {
    if (score >= 90) return 'Excellent'
    if (score >= 75) return 'Good'
    if (score >= 60) return 'Fair'
    return 'Needs Practice'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Learn Singing
          </h1>
          <p className="text-gray-600">Practice with AI-powered feedback and improve your vocal skills</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Practice Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-6 w-6 text-purple-600" />
                  Voice Recording Studio
                </CardTitle>
                <CardDescription>
                  Select an exercise type and start practicing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedExercise} onValueChange={(value) => setSelectedExercise(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pitch">Pitch</TabsTrigger>
                    <TabsTrigger value="rhythm">Rhythm</TabsTrigger>
                    <TabsTrigger value="stability">Stability</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pitch" className="mt-4">
                    <div className="text-sm text-gray-600 mb-4">
                      Practice hitting accurate notes and maintaining pitch control.
                    </div>
                  </TabsContent>
                  <TabsContent value="rhythm" className="mt-4">
                    <div className="text-sm text-gray-600 mb-4">
                      Work on timing, tempo, and rhythmic precision.
                    </div>
                  </TabsContent>
                  <TabsContent value="stability" className="mt-4">
                    <div className="text-sm text-gray-600 mb-4">
                      Develop consistent tone quality and vocal control.
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Recording Interface */}
                <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-mono mb-2">
                      {formatTime(recordingTime)}
                    </div>
                    
                    {/* Audio Level Visualizer */}
                    <div className="mb-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-100"
                          style={{ width: `${audioLevel}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Audio Level</div>
                    </div>

                    {/* Control Buttons */}
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
                        <Button 
                          onClick={stopRecording}
                          size="lg"
                          variant="destructive"
                        >
                          <MicOff className="mr-2 h-5 w-5" />
                          Stop Recording
                        </Button>
                      )}
                      
                      <Button 
                        onClick={() => setRecordingTime(0)}
                        size="lg"
                        variant="outline"
                      >
                        <RotateCcw className="mr-2 h-5 w-5" />
                        Reset
                      </Button>
                    </div>
                  </div>

                  {isRecording && (
                    <div className="flex items-center justify-center gap-2 text-red-500">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm">Recording in progress...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current Session Results */}
            {currentSession && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    Session Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className={`text-5xl font-bold ${getScoreColor(currentSession.score)}`}>
                        {Math.round(currentSession.score)}%
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`mt-2 ${
                          currentSession.score >= 80 ? 'border-green-500 text-green-700' :
                          currentSession.score >= 60 ? 'border-yellow-500 text-yellow-700' :
                          'border-red-500 text-red-700'
                        }`}
                      >
                        {getScoreBadge(currentSession.score)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Duration: {formatTime(currentSession.duration)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Exercise: {currentSession.type}</span>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">{currentSession.feedback}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Practice Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Practice Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Daily Goal</span>
                      <span>15/30 min</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Weekly Streak</span>
                      <span>5 days</span>
                    </div>
                    <Progress value={71} className="h-2" />
                  </div>

                  <div className="pt-2 border-t">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-gray-600">Sessions this week</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {sessionHistory.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No sessions yet. Start practicing!
                    </p>
                  ) : (
                    sessionHistory.map((session) => (
                      <div key={session.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium capitalize">{session.type}</span>
                          <span className={`text-sm font-bold ${getScoreColor(session.score)}`}>
                            {Math.round(session.score)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTime(session.duration)} • {new Date(session.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Warm up your voice before practice</li>
                  <li>• Stay hydrated - drink room temperature water</li>
                  <li>• Maintain good posture while singing</li>
                  <li>• Practice consistently for best results</li>
                  <li>• Record yourself to track progress</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}