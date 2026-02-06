'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Mic, Music, PlayCircle, ShoppingBag, Star, TrendingUp, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [activeTab, setActiveTab] = useState('learn')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Navigation Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Music Studio
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#learn" className="text-gray-700 hover:text-purple-600 transition-colors">
                Learn
              </Link>
              <Link href="#create" className="text-gray-700 hover:text-purple-600 transition-colors">
                Create
              </Link>
              <Link href="#marketplace" className="text-gray-700 hover:text-purple-600 transition-colors">
                Marketplace
              </Link>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button size="sm">
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200">
            🎵 Learn • Create • Earn
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Transform Your Voice Into
            <br />
            AI-Enhanced Music
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Learn singing with AI feedback, create professional tracks with ACE-Step technology, 
            and sell your music in our integrated marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Mic className="mr-2 h-5 w-5" />
              Start Learning Free
            </Button>
            <Button size="lg" variant="outline">
              <PlayCircle className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">10K+</div>
            <div className="text-gray-600">Active Learners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600">50K+</div>
            <div className="text-gray-600">Songs Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">₹2Cr+</div>
            <div className="text-gray-600">Creator Earnings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">4.8★</div>
            <div className="text-gray-600">User Rating</div>
          </div>
        </div>
      </section>

      {/* Main Features Tabs */}
      <section className="container mx-auto px-4 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12">
            <TabsTrigger value="learn" className="text-lg">
              <Mic className="mr-2 h-5 w-5" />
              Learn Singing
            </TabsTrigger>
            <TabsTrigger value="create" className="text-lg">
              <Music className="mr-2 h-5 w-5" />
              Create Music
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="text-lg">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Marketplace
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learn" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-6 w-6 text-purple-600" />
                    AI Voice Analysis
                  </CardTitle>
                  <CardDescription>
                    Get real-time feedback on your pitch, rhythm, and stability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span>Pitch accuracy detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span>Rhythm timing analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span>Vocal stability tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span>Personalized improvement tips</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-pink-600" />
                    Progress Tracking
                  </CardTitle>
                  <CardDescription>
                    Monitor your improvement with detailed analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span>Daily practice streaks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span>Performance analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span>Achievement badges</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span>Personalized goals</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>AI Practice Music</CardTitle>
                  <CardDescription>
                    Generate custom backing tracks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• Tanpura & Harmonium bases</div>
                    <div>• Lo-fi, Pop, Devotional tracks</div>
                    <div>• Adjustable tempo & key</div>
                    <div>• Multiple mood options</div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Try Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Sing With AI</CardTitle>
                  <CardDescription>
                    Create complete songs with your voice
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• Select mood & language</div>
                    <div>• Choose duration & style</div>
                    <div>• AI syncs with your voice</div>
                    <div>• Professional mixing</div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Start Creating
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Lyrics & Karaoke</CardTitle>
                  <CardDescription>
                    AI-assisted songwriting help
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• AI lyric suggestions</div>
                    <div>• Karaoke-style guidance</div>
                    <div>• Line-by-line practice</div>
                    <div>• Rhyme & rhythm help</div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Write Songs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-6 w-6 text-orange-600" />
                    For Creators
                  </CardTitle>
                  <CardDescription>
                    Monetize your musical creations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Sell background music</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>License for Reels/Shorts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Commercial jingles</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>70% revenue share</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-blue-600" />
                    For Buyers
                  </CardTitle>
                  <CardDescription>
                    High-quality, royalty-free music
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>Content creators</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>YouTubers & Podcasters</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>App developers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>Business & brands</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-gray-600">Start free, upgrade when you're ready</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold">₹0<span className="text-lg text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• 5 practice sessions/month</li>
                <li>• Basic AI feedback</li>
                <li>• Limited music generation</li>
                <li>• Community access</li>
              </ul>
              <Button className="w-full mt-4" variant="outline">
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:shadow-lg transition-shadow relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-purple-600 text-white">Most Popular</Badge>
            </div>
            <CardHeader>
              <CardTitle>Premium</CardTitle>
              <CardDescription>For serious creators</CardDescription>
              <div className="text-3xl font-bold">₹99<span className="text-lg text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Unlimited practice sessions</li>
                <li>• Advanced AI analysis</li>
                <li>• Unlimited music generation</li>
                <li>• Priority support</li>
                <li>• Early feature access</li>
              </ul>
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                Start Free Trial
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Annual</CardTitle>
              <CardDescription>Best value for committed artists</CardDescription>
              <div className="text-3xl font-bold">₹499<span className="text-lg text-gray-500">/year</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Everything in Premium</li>
                <li>• 2 months free</li>
                <li>• Marketplace priority</li>
                <li>• Creator verification</li>
                <li>• Custom branding</li>
              </ul>
              <Button className="w-full mt-4" variant="outline">
                Save 58% Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Music className="h-6 w-6" />
                <span className="text-xl font-bold">AI Music Studio</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transform your voice into professional music with AI-powered tools.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">Learn Singing</Link></li>
                <li><Link href="#" className="hover:text-white">Create Music</Link></li>
                <li><Link href="#" className="hover:text-white">Marketplace</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white">License Agreement</Link></li>
                <li><Link href="#" className="hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 AI Music Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}