'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Thermometer,
  Wind,
  Eye,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Search,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react'
import { useState } from 'react'

const weatherData = [
  {
    school: 'Arizona',
    city: 'Tucson',
    state: 'AZ',
    temp: 78,
    condition: 'Sunny',
    humidity: 32,
    windSpeed: 8,
    visibility: 10,
    alerts: [],
    upcomingGames: 2,
    lastUpdated: '2 minutes ago'
  },
  {
    school: 'Arizona State',
    city: 'Tempe',
    state: 'AZ',
    temp: 82,
    condition: 'Partly Cloudy',
    humidity: 28,
    windSpeed: 12,
    visibility: 10,
    alerts: [],
    upcomingGames: 1,
    lastUpdated: '1 minute ago'
  },
  {
    school: 'Baylor',
    city: 'Waco',
    state: 'TX',
    temp: 74,
    condition: 'Sunny',
    humidity: 45,
    windSpeed: 10,
    visibility: 10,
    alerts: [],
    upcomingGames: 2,
    lastUpdated: '1 minute ago'
  },
  {
    school: 'BYU',
    city: 'Provo',
    state: 'UT',
    temp: 58,
    condition: 'Partly Cloudy',
    humidity: 35,
    windSpeed: 7,
    visibility: 10,
    alerts: [],
    upcomingGames: 1,
    lastUpdated: '3 minutes ago'
  },
  {
    school: 'Cincinnati',
    city: 'Cincinnati',
    state: 'OH',
    temp: 54,
    condition: 'Overcast',
    humidity: 68,
    windSpeed: 11,
    visibility: 8,
    alerts: [],
    upcomingGames: 3,
    lastUpdated: '2 minutes ago'
  },
  {
    school: 'Colorado',
    city: 'Boulder',
    state: 'CO',
    temp: 45,
    condition: 'Snow Showers',
    humidity: 85,
    windSpeed: 22,
    visibility: 3,
    alerts: ['Winter Weather Advisory'],
    upcomingGames: 3,
    lastUpdated: '30 seconds ago'
  },
  {
    school: 'Houston',
    city: 'Houston',
    state: 'TX',
    temp: 79,
    condition: 'Partly Cloudy',
    humidity: 72,
    windSpeed: 9,
    visibility: 9,
    alerts: [],
    upcomingGames: 2,
    lastUpdated: '1 minute ago'
  },
  {
    school: 'Iowa State',
    city: 'Ames',
    state: 'IA',
    temp: 51,
    condition: 'Clear',
    humidity: 55,
    windSpeed: 13,
    visibility: 10,
    alerts: [],
    upcomingGames: 2,
    lastUpdated: '2 minutes ago'
  },
  {
    school: 'Kansas',
    city: 'Lawrence',
    state: 'KS',
    temp: 62,
    condition: 'Thunderstorms',
    humidity: 78,
    windSpeed: 18,
    visibility: 5,
    alerts: ['Severe Thunderstorm Watch'],
    upcomingGames: 2,
    lastUpdated: '45 seconds ago'
  },
  {
    school: 'Kansas State',
    city: 'Manhattan',
    state: 'KS',
    temp: 59,
    condition: 'Partly Cloudy',
    humidity: 61,
    windSpeed: 16,
    visibility: 9,
    alerts: [],
    upcomingGames: 1,
    lastUpdated: '1 minute ago'
  },
  {
    school: 'Oklahoma State',
    city: 'Stillwater',
    state: 'OK',
    temp: 68,
    condition: 'Clear',
    humidity: 48,
    windSpeed: 12,
    visibility: 10,
    alerts: [],
    upcomingGames: 2,
    lastUpdated: '3 minutes ago'
  },
  {
    school: 'TCU',
    city: 'Fort Worth',
    state: 'TX',
    temp: 76,
    condition: 'Sunny',
    humidity: 42,
    windSpeed: 8,
    visibility: 10,
    alerts: [],
    upcomingGames: 1,
    lastUpdated: '1 minute ago'
  },
  {
    school: 'Texas Tech',
    city: 'Lubbock',
    state: 'TX',
    temp: 72,
    condition: 'Clear',
    humidity: 41,
    windSpeed: 15,
    visibility: 10,
    alerts: [],
    upcomingGames: 1,
    lastUpdated: '1 minute ago'
  },
  {
    school: 'UCF',
    city: 'Orlando',
    state: 'FL',
    temp: 84,
    condition: 'Partly Cloudy',
    humidity: 78,
    windSpeed: 6,
    visibility: 10,
    alerts: [],
    upcomingGames: 2,
    lastUpdated: '2 minutes ago'
  },
  {
    school: 'Utah',
    city: 'Salt Lake City',
    state: 'UT',
    temp: 52,
    condition: 'Clear',
    humidity: 31,
    windSpeed: 9,
    visibility: 10,
    alerts: [],
    upcomingGames: 1,
    lastUpdated: '4 minutes ago'
  },
  {
    school: 'West Virginia',
    city: 'Morgantown',
    state: 'WV',
    temp: 38,
    condition: 'Overcast',
    humidity: 72,
    windSpeed: 14,
    visibility: 8,
    alerts: [],
    upcomingGames: 2,
    lastUpdated: '2 minutes ago'
  }
]

const weatherStats = {
  totalStations: 16,
  activeAlerts: 2,
  averageTemp: 63,
  gamesMonitored: 23,
  alertsSentToday: 8,
  uptime: 99.98
}

export default function WeatherCommandPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedView, setSelectedView] = useState('overview')

  const filteredData = weatherData.filter(station => 
    station.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="h-6 w-6 text-yellow-500" />
      case 'partly cloudy':
      case 'overcast':
        return <Cloud className="h-6 w-6 text-gray-500" />
      case 'thunderstorms':
      case 'rain':
        return <CloudRain className="h-6 w-6 text-blue-500" />
      case 'snow showers':
        return <Cloud className="h-6 w-6 text-blue-300" />
      default:
        return <Cloud className="h-6 w-6 text-gray-400" />
    }
  }

  const getAlertBadge = (alerts: string[]) => {
    if (alerts.length === 0) return null
    return (
      <Badge variant="destructive" className="ml-2">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Alert
      </Badge>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-orbitron flex items-center gap-2">
            <Cloud className="h-8 w-8 text-blue-600" />
            Weather Command Center
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time weather monitoring across all 16 Big 12 campuses
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Send Alert
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Weather Stations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherStats.totalStations}</div>
            <p className="text-xs text-muted-foreground">Active campuses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{weatherStats.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">Current warnings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Temp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherStats.averageTemp}°F</div>
            <p className="text-xs text-muted-foreground">Across all campuses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Games Monitored</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherStats.gamesMonitored}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Alerts Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherStats.alertsSentToday}</div>
            <p className="text-xs text-muted-foreground">Notifications sent</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{weatherStats.uptime}%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by school or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">
          {filteredData.length} of {weatherData.length} stations
        </Badge>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Campus Overview</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="forecast">7-Day Forecast</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {filteredData.map((station, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getWeatherIcon(station.condition)}
                        {station.school}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {station.city}, {station.state}
                      </CardDescription>
                    </div>
                    {getAlertBadge(station.alerts)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-3xl font-bold">{station.temp}°F</div>
                    <p className="text-sm text-muted-foreground">{station.condition}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span>{station.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <span>{station.windSpeed} mph</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-500" />
                      <span>{station.visibility} mi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span>{station.upcomingGames} games</span>
                    </div>
                  </div>
                  
                  {station.alerts.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">Active Alerts</span>
                      </div>
                      {station.alerts.map((alert, i) => (
                        <p key={i} className="text-sm text-red-700">{alert}</p>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Updated {station.lastUpdated}</span>
                    <Button variant="outline" size="sm">
                      <Clock className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Weather Alerts</CardTitle>
              <CardDescription>Current weather warnings and advisories across Big 12 campuses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">Severe Thunderstorm Watch</span>
                  <Badge variant="destructive">Active</Badge>
                </div>
                <p className="text-sm text-red-700 mb-2">
                  Kansas (Lawrence) - Valid until 9:00 PM CDT. Large hail and damaging winds possible.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm" variant="outline">Send Notification</Button>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">Postpone Games</Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Move to Indoor Venue</Button>
                </div>
              </div>
              
              <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Winter Weather Advisory</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <p className="text-sm text-blue-700 mb-2">
                  Colorado (Boulder) - Valid until 6:00 AM MST. 2-4 inches of snow expected.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm" variant="outline">Send Notification</Button>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">Postpone Games</Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Delay Start Time</Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">Activate Clearing Crew</Button>
                </div>
              </div>
              
              <div className="text-center p-8 text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>All other campuses have no active weather alerts</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Weather Forecast</CardTitle>
              <CardDescription>Extended forecast for all Big 12 campuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-8 rounded-lg text-center">
                <Cloud className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Extended Forecast Coming Soon</h3>
                <p className="text-muted-foreground">
                  Detailed 7-day weather predictions with game impact analysis
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weather Impact Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Games Postponed (Weather)</span>
                    <div className="text-right">
                      <span className="font-medium">3</span>
                      <p className="text-xs text-muted-foreground">This season</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Safety Incidents</span>
                    <div className="text-right">
                      <span className="font-medium text-green-600">0</span>
                      <p className="text-xs text-muted-foreground">Zero tolerance achieved</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Early Warnings Issued</span>
                    <div className="text-right">
                      <span className="font-medium">47</span>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Campus Temperature Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Highest</span>
                    <div className="text-right">
                      <span className="font-medium">82°F</span>
                      <p className="text-xs text-muted-foreground">Arizona State</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lowest</span>
                    <div className="text-right">
                      <span className="font-medium">38°F</span>
                      <p className="text-xs text-muted-foreground">West Virginia</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average</span>
                    <div className="text-right">
                      <span className="font-medium">63°F</span>
                      <p className="text-xs text-muted-foreground">Conference-wide</p>
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