'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Music, 
  Mic, 
  ShoppingBag, 
  User, 
  Menu,
  X,
  LogIn,
  Crown,
  Sparkles
} from 'lucide-react'

interface NavigationProps {
  currentPage?: string
  user?: {
    name: string
    isPremium: boolean
  }
}

export default function Navigation({ currentPage = 'home', user }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { 
      id: 'home', 
      label: 'Home', 
      href: '/',
      icon: Music 
    },
    { 
      id: 'learn', 
      label: 'Learn Singing', 
      href: '/learn',
      icon: Mic 
    },
    { 
      id: 'practice', 
      label: 'Practice Music', 
      href: '/practice',
      icon: Music 
    },
    { 
      id: 'create', 
      label: 'Create Songs', 
      href: '/create',
      icon: Sparkles 
    },
    { 
      id: 'lyrics', 
      label: 'Lyrics & Karaoke', 
      href: '/lyrics',
      icon: Mic 
    },
    { 
      id: 'videos', 
      label: 'Create Videos', 
      href: '/videos',
      icon: PlayCircle 
    },
    { 
      id: 'marketplace', 
      label: 'Marketplace', 
      href: '/marketplace',
      icon: ShoppingBag 
    }
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Music Studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.isPremium && (
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.id
                
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              <div className="border-t pt-4 mt-4 space-y-2">
                {user ? (
                  <>
                    {user.isPremium && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium Member
                      </Badge>
                    )}
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <Link href="/profile">
                        <User className="h-4 w-4 mr-2" />
                        {user.name}
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <Link href="/auth">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Link>
                    </Button>
                    <Button size="sm" className="w-full" asChild>
                      <Link href="/auth">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}