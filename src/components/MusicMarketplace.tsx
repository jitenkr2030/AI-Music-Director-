'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Music, 
  Play, 
  Pause, 
  ShoppingCart, 
  Star, 
  Heart, 
  Download,
  Filter,
  Search,
  TrendingUp,
  Clock,
  User,
  Headphones,
  Zap,
  Crown
} from 'lucide-react'

interface Song {
  id: string
  title: string
  artist: string
  genre: string
  mood: string
  duration: number
  price: number
  licenseType: 'personal' | 'commercial' | 'exclusive'
  rating: number
  playCount: number
  coverImage: string
  audioUrl: string
  tags: string[]
  createdAt: Date
}

const SAMPLE_SONGS: Song[] = [
  {
    id: '1',
    title: 'Sunset Dreams',
    artist: 'Alex Music',
    genre: 'Lo-fi',
    mood: 'Calm',
    duration: 180,
    price: 29.99,
    licenseType: 'personal',
    rating: 4.8,
    playCount: 1250,
    coverImage: '/api/placeholder-cover',
    audioUrl: '/api/placeholder-audio',
    tags: ['relaxing', 'study', 'background'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Energize Your Day',
    artist: 'Beat Master',
    genre: 'Electronic',
    mood: 'Energetic',
    duration: 120,
    price: 49.99,
    licenseType: 'commercial',
    rating: 4.6,
    playCount: 890,
    coverImage: '/api/placeholder-cover',
    audioUrl: '/api/placeholder-audio',
    tags: ['workout', 'motivation', 'upbeat'],
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    title: 'Romantic Evening',
    artist: 'Sarah Voice',
    genre: 'Pop',
    mood: 'Romantic',
    duration: 210,
    price: 39.99,
    licenseType: 'commercial',
    rating: 4.9,
    playCount: 2100,
    coverImage: '/api/placeholder-cover',
    audioUrl: '/api/placeholder-audio',
    tags: ['love', 'romantic', 'emotional'],
    createdAt: new Date('2024-01-25')
  },
  {
    id: '4',
    title: 'Divine Peace',
    artist: 'Sacred Sounds',
    genre: 'Devotional',
    mood: 'Meditative',
    duration: 300,
    price: 19.99,
    licenseType: 'personal',
    rating: 4.7,
    playCount: 650,
    coverImage: '/api/placeholder-cover',
    audioUrl: '/api/placeholder-audio',
    tags: ['meditation', 'spiritual', 'peaceful'],
    createdAt: new Date('2024-02-01')
  },
  {
    id: '5',
    title: 'Urban Nights',
    artist: 'City Lights',
    genre: 'Hip-Hop',
    mood: 'Energetic',
    duration: 150,
    price: 59.99,
    licenseType: 'exclusive',
    rating: 4.5,
    playCount: 3200,
    coverImage: '/api/placeholder-cover',
    audioUrl: '/api/placeholder-audio',
    tags: ['urban', 'modern', 'street'],
    createdAt: new Date('2024-02-05')
  },
  {
    id: '6',
    title: 'Nature Symphony',
    artist: 'Earth Tones',
    genre: 'Classical',
    mood: 'Calm',
    duration: 240,
    price: 34.99,
    licenseType: 'commercial',
    rating: 4.9,
    playCount: 1800,
    coverImage: '/api/placeholder-cover',
    audioUrl: '/api/placeholder-audio',
    tags: ['nature', 'orchestral', 'cinematic'],
    createdAt: new Date('2024-02-10')
  }
]

const GENRES = ['All', 'Lo-fi', 'Pop', 'Electronic', 'Devotional', 'Classical', 'Hip-Hop', 'Rock']
const MOODS = ['All', 'Calm', 'Energetic', 'Romantic', 'Meditative', 'Happy', 'Melancholic']
const LICENSE_TYPES = ['All', 'personal', 'commercial', 'exclusive']
const SORT_OPTIONS = ['Popular', 'Newest', 'Price: Low to High', 'Price: High to Low', 'Rating']

export default function MusicMarketplace() {
  const [songs, setSongs] = useState<Song[]>(SAMPLE_SONGS)
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(SAMPLE_SONGS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedMood, setSelectedMood] = useState('All')
  const [selectedLicense, setSelectedLicense] = useState('All')
  const [sortBy, setSortBy] = useState('Popular')
  const [priceRange, setPriceRange] = useState([0, 100])
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [cart, setCart] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  // Filter and sort songs
  React.useEffect(() => {
    let filtered = songs.filter(song => {
      const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           song.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesGenre = selectedGenre === 'All' || song.genre === selectedGenre
      const matchesMood = selectedMood === 'All' || song.mood === selectedMood
      const matchesLicense = selectedLicense === 'All' || song.licenseType === selectedLicense
      const matchesPrice = song.price >= priceRange[0] && song.price <= priceRange[1]

      return matchesSearch && matchesGenre && matchesMood && matchesLicense && matchesPrice
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Popular':
          return b.playCount - a.playCount
        case 'Newest':
          return b.createdAt.getTime() - a.createdAt.getTime()
        case 'Price: Low to High':
          return a.price - b.price
        case 'Price: High to Low':
          return b.price - a.price
        case 'Rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

    setFilteredSongs(filtered)
  }, [songs, searchQuery, selectedGenre, selectedMood, selectedLicense, sortBy, priceRange])

  const togglePlay = (songId: string) => {
    setIsPlaying(isPlaying === songId ? null : songId)
  }

  const toggleCart = (songId: string) => {
    setCart(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    )
  }

  const toggleFavorite = (songId: string) => {
    setFavorites(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    )
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getLicenseColor = (license: string) => {
    switch (license) {
      case 'exclusive': return 'bg-purple-100 text-purple-800'
      case 'commercial': return 'bg-blue-100 text-blue-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            AI Music Marketplace
          </h1>
          <p className="text-gray-600">Discover and license high-quality AI-generated music for your projects</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search songs, artists..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Genre Filter */}
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

                {/* Mood Filter */}
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

                {/* License Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">License Type</label>
                  <Select value={selectedLicense} onValueChange={setSelectedLicense}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LICENSE_TYPES.map(license => (
                        <SelectItem key={license} value={license}>
                          {license === 'All' ? license : license.charAt(0).toUpperCase() + license.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingCart className="h-5 w-5" />
                    Cart ({cart.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total:</span>
                      <span className="font-bold">
                        ${songs
                          .filter(song => cart.includes(song.id))
                          .reduce((sum, song) => sum + song.price, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <Button className="w-full" size="sm">
                      Proceed to Checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{filteredSongs.length}</div>
                  <div className="text-xs text-gray-600">Available Tracks</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-pink-600">2.5K+</div>
                  <div className="text-xs text-gray-600">Happy Customers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">4.8★</div>
                  <div className="text-xs text-gray-600">Avg Rating</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-xs text-gray-600">Support</div>
                </CardContent>
              </Card>
            </div>

            {/* Song Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSongs.map((song) => (
                <Card key={song.id} className="group hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    {/* Cover Image */}
                    <div className="h-48 bg-gradient-to-br from-purple-200 to-pink-200 rounded-t-lg flex items-center justify-center">
                      <Music className="h-16 w-16 text-white/50" />
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
                      <Button
                        size="lg"
                        onClick={() => togglePlay(song.id)}
                        className="bg-white text-black hover:bg-gray-100"
                      >
                        {isPlaying === song.id ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </Button>
                    </div>

                    {/* License Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge className={`text-xs ${getLicenseColor(song.licenseType)}`}>
                        {song.licenseType}
                      </Badge>
                    </div>

                    {/* Favorite Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 left-2 bg-white/80 hover:bg-white"
                      onClick={() => toggleFavorite(song.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          favorites.includes(song.id) ? 'text-red-500 fill-current' : 'text-gray-600'
                        }`}
                      />
                    </Button>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Title and Artist */}
                      <div>
                        <h3 className="font-semibold text-lg truncate">{song.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {song.artist}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {song.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {song.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{song.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(song.duration)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Headphones className="h-3 w-3" />
                          {song.playCount.toLocaleString()}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {renderStars(song.rating)}
                        </div>
                        <span className="text-sm text-gray-600">{song.rating}</span>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <div className="text-xl font-bold text-purple-600">${song.price}</div>
                          <div className="text-xs text-gray-500">one-time purchase</div>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => toggleCart(song.id)}
                          variant={cart.includes(song.id) ? "secondary" : "default"}
                        >
                          {cart.includes(song.id) ? (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              In Cart
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredSongs.length === 0 && (
              <div className="text-center py-12">
                <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No songs found</h3>
                <p className="text-sm text-gray-500">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}