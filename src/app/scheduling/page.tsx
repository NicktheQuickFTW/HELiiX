'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Zap,
  TrendingUp,
  BarChart3,
  Settings
} from 'lucide-react'
import { useState } from 'react'

const schedulingData = [
  {
    id: 1,
    sport: 'Football',
    home: 'Texas Tech',
    away: 'Kansas',
    date: '2025-09-13',
    time: '19:00',
    venue: 'Jones AT&T Stadium',
    status: 'confirmed',
    tvNetwork: 'ESPN',
    attendance: 60454,
    weather: 'Clear, 75°F',
    conflicts: 0,
    aiOptimized: true
  },
  {
    id: 2,
    sport: 'Basketball',
    home: 'Kansas',
    away: 'Baylor',
    date: '2025-01-25',
    time: '20:00',
    venue: 'Allen Fieldhouse',
    status: 'confirmed',
    tvNetwork: 'ESPN2',
    attendance: 16300,
    weather: 'Indoor',
    conflicts: 0,
    aiOptimized: true
  },
  {
    id: 3,
    sport: 'Wrestling',
    home: 'Iowa State',
    away: 'Oklahoma State',
    date: '2025-02-14',
    time: '19:00',
    venue: 'Hilton Coliseum',
    status: 'pending',
    tvNetwork: 'Big 12 Now',
    attendance: 14384,
    weather: 'Indoor',
    conflicts: 1,
    aiOptimized: false
  },
  {
    id: 4,
    sport: 'Baseball',
    home: 'TCU',
    away: 'West Virginia',
    date: '2025-04-18',
    time: '18:30',
    venue: 'Lupton Stadium',
    status: 'tentative',
    tvNetwork: 'TBD',
    attendance: 3500,
    weather: 'Partly Cloudy, 78°F',
    conflicts: 0,
    aiOptimized: true
  }
]

const schedulingStats = {
  totalGames: 847,
  conflictsResolved: 156,
  efficiencyRate: 94,
  aiOptimizations: 623,
  venueUtilization: 87,
  broadcastWindows: 23
}

export default function FlexTimeSchedulingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sportFilter, setSportFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedView, setSelectedView] = useState('calendar')

  const filteredGames = schedulingData.filter(game => {
    const matchesSearch = game.home.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.away.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.sport.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = sportFilter === 'all' || game.sport.toLowerCase() === sportFilter
    const matchesStatus = statusFilter === 'all' || game.status === statusFilter
    return matchesSearch && matchesSport && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'tentative':
        return <Badge className="bg-yellow-100 text-yellow-800">Tentative</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-orbitron flex items-center gap-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            FlexTime Intelligent Scheduling
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered sports scheduling with 94% efficiency across all Big 12 sports
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Zap className="h-4 w-4 mr-2" />
          AI Optimize
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedulingStats.totalGames}</div>
            <p className="text-xs text-muted-foreground">This season</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Efficiency Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{schedulingStats.efficiencyRate}%</div>
            <p className="text-xs text-muted-foreground">AI optimization</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Conflicts Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedulingStats.conflictsResolved}</div>
            <p className="text-xs text-muted-foreground">This season</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">AI Optimizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedulingStats.aiOptimizations}</div>
            <p className="text-xs text-muted-foreground">Applied</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Venue Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedulingStats.venueUtilization}%</div>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Broadcast Windows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedulingStats.broadcastWindows}</div>
            <p className="text-xs text-muted-foreground">Optimized</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search games by team or sport..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={sportFilter} onValueChange={setSportFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            <SelectItem value="football">Football</SelectItem>
            <SelectItem value="basketball">Basketball</SelectItem>
            <SelectItem value="wrestling">Wrestling</SelectItem>
            <SelectItem value="baseball">Baseball</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="tentative">Tentative</SelectItem>
          </SelectContent>
        </Select>
        
        <Badge variant="secondary">
          {filteredGames.length} of {schedulingData.length} games
        </Badge>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="optimization">AI Optimization</TabsTrigger>
          <TabsTrigger value="conflicts">Conflict Resolution</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid gap-4">
            {filteredGames.map((game) => (
              <Card key={game.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                      <div>
                        <CardTitle className="text-lg">
                          {game.away} @ {game.home}
                        </CardTitle>
                        <CardDescription>
                          {game.sport} • {new Date(game.date).toLocaleDateString()} at {game.time}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {game.aiOptimized && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          <Zap className="w-3 h-3 mr-1" />
                          AI Optimized
                        </Badge>
                      )}
                      {getStatusBadge(game.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Venue
                      </p>
                      <p className="text-sm text-muted-foreground">{game.venue}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Capacity
                      </p>
                      <p className="text-sm text-muted-foreground">{game.attendance.toLocaleString()}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">TV Network</p>
                      <p className="text-sm text-muted-foreground">{game.tvNetwork}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Weather</p>
                      <p className="text-sm text-muted-foreground">{game.weather}</p>
                    </div>
                  </div>
                  
                  {game.conflicts > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">
                          {game.conflicts} scheduling conflict detected
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Modify Schedule
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Optimization Engine</CardTitle>
              <CardDescription>Real-time scheduling optimization and conflict resolution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">94%</div>
                  <p className="text-sm text-muted-foreground">Efficiency Rate</p>
                  <p className="text-xs text-muted-foreground">vs 67% manual scheduling</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">87%</div>
                  <p className="text-sm text-muted-foreground">Conflicts Reduced</p>
                  <p className="text-xs text-muted-foreground">through AI prediction</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">340</div>
                  <p className="text-sm text-muted-foreground">Hours Saved</p>
                  <p className="text-xs text-muted-foreground">per season</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Current Optimizations</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Travel Optimization</p>
                      <p className="text-sm text-muted-foreground">
                        Minimized back-to-back road games for Kansas basketball team
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">TV Window Optimization</p>
                      <p className="text-sm text-muted-foreground">
                        Adjusted 12 games to maximize primetime broadcast opportunities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Weather Integration</p>
                      <p className="text-sm text-muted-foreground">
                        Preemptively rescheduled 3 outdoor events due to forecasted severe weather
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conflict Resolution Dashboard</CardTitle>
              <CardDescription>Real-time monitoring and resolution of scheduling conflicts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">No Active Conflicts</h3>
                <p className="text-green-600">All current schedules are optimized and conflict-free</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Scheduling Efficiency Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center bg-muted/30 rounded">
                  <TrendingUp className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sport Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Football</span>
                    <div className="text-right">
                      <span className="font-medium">128 games</span>
                      <p className="text-xs text-muted-foreground">15%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Basketball</span>
                    <div className="text-right">
                      <span className="font-medium">288 games</span>
                      <p className="text-xs text-muted-foreground">34%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Other Sports</span>
                    <div className="text-right">
                      <span className="font-medium">431 games</span>
                      <p className="text-xs text-muted-foreground">51%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}