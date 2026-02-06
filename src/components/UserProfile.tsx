'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Mail, 
  Lock, 
  Music, 
  TrendingUp, 
  Crown,
  Settings,
  LogOut,
  Edit,
  Camera,
  Star,
  PlayCircle,
  Download,
  Eye
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  isPremium: boolean
  subscription: 'free' | 'monthly' | 'yearly'
  bio: string
  joinDate: Date
  stats: {
    songsCreated: number
    practiceHours: number
    marketplaceSales: number
    averageRating: number
  }
}

const SAMPLE_USER: UserProfile = {
  id: '1',
  name: 'Alex Musician',
  email: 'alex@example.com',
  isPremium: true,
  subscription: 'monthly',
  bio: 'Passionate singer and music creator. Love experimenting with AI-generated music!',
  joinDate: new Date('2023-06-15'),
  stats: {
    songsCreated: 24,
    practiceHours: 156,
    marketplaceSales: 12,
    averageRating: 4.7
  }
}

export default function UserProfile() {
  const [user, setUser] = useState<UserProfile>(SAMPLE_USER)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user.name,
    bio: user.bio
  })

  const handleSaveProfile = () => {
    setUser(prev => ({
      ...prev,
      name: editForm.name,
      bio: editForm.bio
    }))
    setIsEditing(false)
  }

  const handleUpgrade = () => {
    // Handle subscription upgrade
    alert('Redirecting to payment...')
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case 'yearly':
        return <Badge className="bg-purple-600 text-white">Premium Annual</Badge>
      case 'monthly':
        return <Badge className="bg-purple-500 text-white">Premium Monthly</Badge>
      default:
        return <Badge variant="outline">Free</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">Manage your account and track your musical journey</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-2xl">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute bottom-2 right-0 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>

                  <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                  <p className="text-gray-600 mb-3">{user.email}</p>
                  
                  <div className="flex justify-center mb-4">
                    {getSubscriptionBadge(user.subscription)}
                  </div>

                  {!isEditing ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-700">{user.bio}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="w-full"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          value={editForm.bio}
                          onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                          className="w-full p-2 border rounded-md text-sm"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveProfile} className="flex-1">
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t text-sm text-gray-600">
                    <p>Member since {formatDate(user.joinDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.isPremium ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {user.subscription === 'yearly' ? '₹499/year' : '₹99/month'}
                      </div>
                      <p className="text-sm text-gray-600">
                        {user.subscription === 'yearly' ? 'Saving 58% compared to monthly' : 'Billed monthly'}
                      </p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full" />
                        <span>Unlimited practice sessions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full" />
                        <span>Advanced AI analysis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full" />
                        <span>Priority marketplace placement</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Manage Subscription
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">Free Plan</div>
                      <p className="text-sm text-gray-600">Limited features available</p>
                    </div>
                    
                    <Button onClick={handleUpgrade} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade to Premium
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="songs">My Songs</TabsTrigger>
                <TabsTrigger value="purchases">Purchases</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="stats" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Music className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{user.stats.songsCreated}</div>
                      <div className="text-sm text-gray-600">Songs Created</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{user.stats.practiceHours}</div>
                      <div className="text-sm text-gray-600">Practice Hours</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Download className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{user.stats.marketplaceSales}</div>
                      <div className="text-sm text-gray-600">Sales</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{user.stats.averageRating}</div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Charts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Practice Progress</CardTitle>
                    <CardDescription>Your singing improvement over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Pitch Accuracy</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Rhythm Timing</span>
                          <span>78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Vocal Stability</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="songs" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>My Created Songs</CardTitle>
                    <CardDescription>Songs you've created using AI</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { title: 'Sunset Melody', plays: 1250, rating: 4.8, date: '2024-01-15' },
                        { title: 'Morning Vibes', plays: 890, rating: 4.6, date: '2024-01-20' },
                        { title: 'Love Song', plays: 2100, rating: 4.9, date: '2024-01-25' },
                      ].map((song, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{song.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <PlayCircle className="h-3 w-3" />
                                {song.plays.toLocaleString()} plays
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {song.rating}
                              </span>
                              <span>{song.date}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="purchases" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Marketplace Purchases</CardTitle>
                    <CardDescription>Music you've licensed from the marketplace</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { title: 'Urban Beats', artist: 'Beat Master', price: 49.99, license: 'Commercial' },
                        { title: 'Calm Piano', artist: 'Relaxing Music', price: 29.99, license: 'Personal' },
                        { title: 'Epic Orchestra', artist: 'Cinema Sounds', price: 89.99, license: 'Exclusive' },
                      ].map((purchase, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{purchase.title}</h4>
                            <div className="text-sm text-gray-600 mt-1">
                              by {purchase.artist} • {purchase.license} License
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">${purchase.price}</div>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" value={user.email} disabled />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value="••••••••" disabled />
                        <Button variant="outline" size="sm">Change Password</Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Notifications</Label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">Email notifications for new features</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">Practice reminders</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            <span className="text-sm">Marketing emails</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button variant="destructive" size="sm">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}