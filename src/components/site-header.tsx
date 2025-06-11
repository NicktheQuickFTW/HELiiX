'use client'

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { 
  Bell, 
  Shield, 
  Zap, 
  AlertTriangle,
  Clock,
  Users,
  DollarSign,
  Play,
  Pause
} from "lucide-react"
import { useState, useEffect } from 'react'

const gamesFeed = [
  { 
    type: 'live', 
    sport: 'Basketball', 
    away: 'Kansas', 
    home: 'Baylor', 
    score: '72-68', 
    time: '4:23 2H',
    status: 'Live'
  },
  { 
    type: 'upcoming', 
    sport: 'Football', 
    away: 'Texas Tech', 
    home: 'Iowa State', 
    time: 'Tomorrow 7:00 PM',
    status: 'Scheduled'
  },
  { 
    type: 'final', 
    sport: 'Wrestling', 
    away: 'Oklahoma State', 
    home: 'West Virginia', 
    score: '24-15', 
    status: 'Final'
  },
  { 
    type: 'upcoming', 
    sport: 'Soccer', 
    away: 'TCU', 
    home: 'Kansas State', 
    time: 'Today 6:30 PM',
    status: 'Scheduled'
  },
  { 
    type: 'final', 
    sport: 'Baseball', 
    away: 'Houston', 
    home: 'UCF', 
    score: '8-6', 
    status: 'Final'
  },
  { 
    type: 'upcoming', 
    sport: 'Basketball', 
    away: 'Colorado', 
    home: 'Arizona', 
    time: 'Tonight 9:00 PM',
    status: 'Scheduled'
  },
  { 
    type: 'live', 
    sport: 'Volleyball', 
    away: 'Utah', 
    home: 'Arizona State', 
    score: '2-1', 
    time: 'Set 4',
    status: 'Live'
  }
]

export function SiteHeader() {
  const [notifications] = useState(3)
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (isPaused) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % gamesFeed.length)
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [isPaused])

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'live': return 'bg-red-500 text-white'
      case 'upcoming': return 'bg-blue-500 text-white'
      case 'final': return 'bg-gray-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const currentGame = gamesFeed[currentIndex]

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left Section - Controls */}
      <div className="flex items-center gap-4 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        
        {/* System Status */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-green-700 dark:text-green-400">Operational</span>
        </div>
      </div>

      {/* Center Section - Scrolling Games Feed */}
      <div className="flex-1 mx-4 relative">
        <div 
          className="flex items-center justify-center gap-4 py-2 cursor-pointer"
          onClick={() => setIsPaused(!isPaused)}
        >
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor(currentGame.type)} text-xs font-medium`}>
              {currentGame.status}
            </Badge>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{currentGame.sport}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{currentGame.away}</span>
              <span className="text-muted-foreground">@</span>
              <span>{currentGame.home}</span>
            </div>
            
            {currentGame.score && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{currentGame.score}</span>
                  {currentGame.type === 'live' && (
                    <span className="text-xs text-muted-foreground">{currentGame.time}</span>
                  )}
                </div>
              </>
            )}
            
            {!currentGame.score && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-muted-foreground">{currentGame.time}</span>
              </>
            )}
          </div>
          
          <Button variant="ghost" size="sm" className="ml-2">
            {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </Button>
        </div>
        
        {/* Progress indicators */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-1">
          {gamesFeed.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-6 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Section - Controls & Profile */}
      <div className="flex items-center gap-3 px-4">
        {/* Live Metrics */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-blue-500" />
            <span>96%</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-purple-500" />
            <span>247</span>
          </div>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Alerts */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">2 Alerts</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-red-500">
                {notifications}
              </Badge>
            )}
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Settings */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-green-600">
            <Shield className="h-4 w-4" />
          </Button>
          <ThemeToggle />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium">Nick Williams</div>
            <div className="text-xs text-muted-foreground">Assistant Commissioner, Operations</div>
          </div>
          <Avatar className="h-8 w-8 border-2 border-white dark:border-gray-800">
            <AvatarImage 
              src="/avatars/nick-williams.jpg" 
              alt="Nick Williams"
              className="object-cover"
            />
            <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
              NW
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}