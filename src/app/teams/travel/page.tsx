'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  MapPin, 
  Plane, 
  Car, 
  Clock, 
  DollarSign, 
  Route, 
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter
} from 'lucide-react'
import { useState } from 'react'

const travelRoutes = [
  {
    from: 'Arizona',
    to: 'Texas Tech',
    sport: 'Football',
    date: '2024-11-15',
    distance: 456,
    method: 'Charter Flight',
    duration: '1h 20m',
    cost: '$45,000',
    status: 'confirmed',
    teamSize: 85,
    departure: '2024-11-14 14:00',
    arrival: '2024-11-14 16:20',
    hotel: 'Hilton Lubbock',
    notes: 'Weather contingency in place'
  },
  {
    from: 'Kansas',
    to: 'West Virginia',
    sport: 'Basketball',
    date: '2024-12-08',
    distance: 890,
    method: 'Charter Flight',
    duration: '2h 15m',
    cost: '$38,000',
    status: 'pending',
    teamSize: 22,
    departure: '2024-12-07 15:30',
    arrival: '2024-12-07 18:45',
    hotel: 'Marriott Morgantown',
    notes: 'Same-day return flight'
  },
  {
    from: 'Iowa State',
    to: 'Kansas State',
    sport: 'Wrestling',
    date: '2024-01-20',
    distance: 275,
    method: 'Charter Bus',
    duration: '4h 30m',
    cost: '$8,500',
    status: 'confirmed',
    teamSize: 35,
    departure: '2024-01-20 08:00',
    arrival: '2024-01-20 12:30',
    hotel: 'Hampton Inn Manhattan',
    notes: 'Regional rivalry match'
  },
  {
    from: 'TCU',
    to: 'Colorado',
    sport: 'Football',
    date: '2024-10-28',
    distance: 658,
    method: 'Charter Flight',
    duration: '1h 45m',
    cost: '$42,000',
    status: 'confirmed',
    teamSize: 85,
    departure: '2024-10-27 13:00',
    arrival: '2024-10-27 15:45',
    hotel: 'Boulder Marriott',
    notes: 'Altitude acclimatization day'
  },
  {
    from: 'Houston',
    to: 'UCF',
    sport: 'Soccer',
    date: '2024-09-22',
    distance: 960,
    method: 'Charter Flight',
    duration: '2h 10m',
    cost: '$28,000',
    status: 'completed',
    teamSize: 28,
    departure: '2024-09-21 16:00',
    arrival: '2024-09-21 19:10',
    hotel: 'Hyatt Orlando',
    notes: 'Conference championship game'
  }
]

const travelStats = {
  totalMiles: 1250000,
  totalCost: '$2.8M',
  averageCost: '$32,000',
  totalTrips: 87,
  onTimePercentage: 94,
  costSavings: '$340K'
}

export default function TravelPlanningPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sportFilter, setSportFilter] = useState('all')
  const [selectedView, setSelectedView] = useState('routes')

  const filteredRoutes = travelRoutes.filter(route => {
    const matchesSearch = route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.sport.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || route.status === statusFilter
    const matchesSport = sportFilter === 'all' || route.sport.toLowerCase() === sportFilter
    return matchesSearch && matchesStatus && matchesSport
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMethodIcon = (method: string) => {
    if (method.includes('Flight')) return <Plane className="h-4 w-4" />
    if (method.includes('Bus')) return <Car className="h-4 w-4" />
    return <Route className="h-4 w-4" />
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Route className="h-8 w-8" />
            Travel Planning
          </h1>
          <p className="text-muted-foreground mt-2">
            Coordinate and optimize travel for Big 12 athletic teams
          </p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Plan New Trip
        </Button>
      </div>

      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Miles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{travelStats.totalMiles.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This season</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{travelStats.totalCost}</div>
            <p className="text-xs text-muted-foreground">Budget used</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{travelStats.averageCost}</div>
            <p className="text-xs text-muted-foreground">Per trip</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{travelStats.totalTrips}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">On-Time %</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{travelStats.onTimePercentage}%</div>
            <p className="text-xs text-muted-foreground">Performance</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{travelStats.costSavings}</div>
            <p className="text-xs text-muted-foreground">vs. commercial</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search routes by school or sport..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sportFilter} onValueChange={setSportFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            <SelectItem value="football">Football</SelectItem>
            <SelectItem value="basketball">Basketball</SelectItem>
            <SelectItem value="wrestling">Wrestling</SelectItem>
            <SelectItem value="soccer">Soccer</SelectItem>
          </SelectContent>
        </Select>
        
        <Badge variant="secondary">
          {filteredRoutes.length} of {travelRoutes.length} routes
        </Badge>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="routes">Travel Routes</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="optimization">Route Optimization</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          <div className="grid gap-4">
            {filteredRoutes.map((route, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getMethodIcon(route.method)}
                      <div>
                        <CardTitle className="text-lg">
                          {route.from} → {route.to}
                        </CardTitle>
                        <CardDescription>
                          {route.sport} • {new Date(route.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(route.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Distance
                      </p>
                      <p className="text-lg font-bold">{route.distance} mi</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Duration
                      </p>
                      <p className="text-lg font-bold">{route.duration}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Cost
                      </p>
                      <p className="text-lg font-bold">{route.cost}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Team Size
                      </p>
                      <p className="text-lg font-bold">{route.teamSize}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium">Departure</p>
                        <p className="text-sm text-muted-foreground">{route.departure}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Arrival</p>
                        <p className="text-sm text-muted-foreground">{route.arrival}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Hotel</p>
                        <p className="text-sm text-muted-foreground">{route.hotel}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Method</p>
                        <p className="text-sm text-muted-foreground">{route.method}</p>
                      </div>
                    </div>
                    {route.notes && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-medium">Notes</p>
                        <p className="text-sm text-muted-foreground">{route.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Edit Route
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Track Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Travel Calendar</CardTitle>
              <CardDescription>Monthly view of all scheduled team travel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-8 rounded-lg text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Interactive Calendar Coming Soon</h3>
                <p className="text-muted-foreground">
                  Visual calendar interface for managing all Big 12 team travel schedules
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Optimization</CardTitle>
              <CardDescription>AI-powered travel optimization and cost savings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">$340K</div>
                  <p className="text-sm text-muted-foreground">Cost Savings</p>
                  <p className="text-xs text-muted-foreground">vs. commercial flights</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">23%</div>
                  <p className="text-sm text-muted-foreground">Route Efficiency</p>
                  <p className="text-xs text-muted-foreground">improvement this year</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <p className="text-sm text-muted-foreground">Hours Saved</p>
                  <p className="text-xs text-muted-foreground">through optimization</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Optimization Recommendations</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Charter Flight Consolidation</p>
                      <p className="text-sm text-muted-foreground">
                        Combine Kansas and Kansas State basketball trips to save $15K
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Weather Contingency</p>
                      <p className="text-sm text-muted-foreground">
                        Monitor Colorado-bound flights for winter weather delays
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Regional Bus Routes</p>
                      <p className="text-sm text-muted-foreground">
                        Use charter buses for Iowa State-Kansas rivalry games (under 300 miles)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Travel Method Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4" />
                      <span className="text-sm">Charter Flights</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">68%</span>
                      <p className="text-xs text-muted-foreground">59 trips</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span className="text-sm">Charter Bus</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">28%</span>
                      <p className="text-xs text-muted-foreground">24 trips</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Route className="h-4 w-4" />
                      <span className="text-sm">Other</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">4%</span>
                      <p className="text-xs text-muted-foreground">4 trips</p>
                    </div>
                  </div>
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
                      <span className="font-medium">45%</span>
                      <p className="text-xs text-muted-foreground">39 trips</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Basketball</span>
                    <div className="text-right">
                      <span className="font-medium">32%</span>
                      <p className="text-xs text-muted-foreground">28 trips</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Other Sports</span>
                    <div className="text-right">
                      <span className="font-medium">23%</span>
                      <p className="text-xs text-muted-foreground">20 trips</p>
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