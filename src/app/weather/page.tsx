'use client'

import {
  Background,
  Column,
  Row,
  Grid,
  Card,
  Button,
  Heading,
  Text,
  Badge,
  Icon,
  Input
} from '@once-ui-system/core'
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
      <Badge variant="brand" onBackground="danger-strong">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Alert
      </Badge>
    )
  }

  return (
    <Background background="page" fillWidth>
      <Column padding="l" gap="l" fillWidth>
        <Row style={{ alignItems: "center" }} justifyContent="between" fillWidth>
          <Column gap="xs">
            <Row style={{ alignItems: "center" }} gap="s">
              <Icon name="cloud" size="l" color="blue-600" />
              <Heading as="h1" size="xl">Weather Command Center</Heading>
            </Row>
            <Text size="l" color="neutral-500">
              Real-time weather monitoring across all 16 Big 12 campuses
            </Text>
          </Column>
          <Button variant="primary" size="s">
            <Icon name="alertTriangle" size="s" />
            Send Alert
          </Button>
        </Row>

        {/* Key Metrics */}
        <Grid columns={6} gap="m" fillWidth>
          <Card padding="m">
            <Column gap="s">
              <Text size="s" weight="medium">Weather Stations</Text>
              <Text size="xl" weight="bold">{weatherStats.totalStations}</Text>
              <Text size="xs" color="neutral-500">Active campuses</Text>
            </Column>
          </Card>
          
          <Card padding="m">
            <Column gap="s">
              <Text size="s" weight="medium">Active Alerts</Text>
              <Text size="xl" weight="bold" color="red-600">{weatherStats.activeAlerts}</Text>
              <Text size="xs" color="neutral-500">Current warnings</Text>
            </Column>
          </Card>
          
          <Card padding="m">
            <Column gap="s">
              <Text size="s" weight="medium">Average Temp</Text>
              <Text size="xl" weight="bold">{weatherStats.averageTemp}°F</Text>
              <Text size="xs" color="neutral-500">Across all campuses</Text>
            </Column>
          </Card>
          
          <Card padding="m">
            <Column gap="s">
              <Text size="s" weight="medium">Games Monitored</Text>
              <Text size="xl" weight="bold">{weatherStats.gamesMonitored}</Text>
              <Text size="xs" color="neutral-500">Next 7 days</Text>
            </Column>
          </Card>
          
          <Card padding="m">
            <Column gap="s">
              <Text size="s" weight="medium">Alerts Today</Text>
              <Text size="xl" weight="bold">{weatherStats.alertsSentToday}</Text>
              <Text size="xs" color="neutral-500">Notifications sent</Text>
            </Column>
          </Card>
          
          <Card padding="m">
            <Column gap="s">
              <Text size="s" weight="medium">System Uptime</Text>
              <Text size="xl" weight="bold" color="green-600">{weatherStats.uptime}%</Text>
              <Text size="xs" color="neutral-500">This month</Text>
            </Column>
          </Card>
        </Grid>

        {/* Search */}
        <Row style={{ alignItems: "center" }} gap="m" wrap>
          <div style={{ position: 'relative', maxWidth: '24rem', flex: 1 }}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Search by school or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <Badge variant="neutral">
            {filteredData.length} of {weatherData.length} stations
          </Badge>
        </Row>

        {/* Tabs Simulation with Once UI */}
        <Column gap="l" fillWidth>
          <Row gap="s">
            <Button 
              variant={selectedView === 'overview' ? 'primary' : 'secondary'} 
              size="s"
              onClick={() => setSelectedView('overview')}
            >
              Campus Overview
            </Button>
            <Button 
              variant={selectedView === 'alerts' ? 'primary' : 'secondary'} 
              size="s"
              onClick={() => setSelectedView('alerts')}
            >
              Active Alerts
            </Button>
            <Button 
              variant={selectedView === 'forecast' ? 'primary' : 'secondary'} 
              size="s"
              onClick={() => setSelectedView('forecast')}
            >
              7-Day Forecast
            </Button>
            <Button 
              variant={selectedView === 'analytics' ? 'primary' : 'secondary'} 
              size="s"
              onClick={() => setSelectedView('analytics')}
            >
              Analytics
            </Button>
          </Row>

          {selectedView === 'overview' && (
            <Grid columns={4} gap="m" fillWidth>
              {filteredData.map((station, index) => (
                <Card key={index} padding="m" className="hover:shadow-lg transition-shadow">
                  <Column gap="m">
                    <Row style={{ alignItems: "center" }} justifyContent="between">
                      <Column gap="xs">
                        <Row style={{ alignItems: "center" }} gap="s">
                          {getWeatherIcon(station.condition)}
                          <Heading as="h3" size="m">{station.school}</Heading>
                        </Row>
                        <Row style={{ alignItems: "center" }} gap="xs">
                          <MapPin className="h-4 w-4" />
                          <Text size="s" color="neutral-600">{station.city}, {station.state}</Text>
                        </Row>
                      </Column>
                      {getAlertBadge(station.alerts)}
                    </Row>
                    
                    <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--neutral-surface)', borderRadius: '0.5rem' }}>
                      <Text size="xxl" weight="bold">{station.temp}°F</Text>
                      <Text size="s" color="neutral-500">{station.condition}</Text>
                    </div>
                    
                    <Grid columns={2} gap="m">
                      <Row style={{ alignItems: "center" }} gap="xs">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <Text size="s">{station.humidity}%</Text>
                      </Row>
                      <Row style={{ alignItems: "center" }} gap="xs">
                        <Wind className="h-4 w-4 text-gray-500" />
                        <Text size="s">{station.windSpeed} mph</Text>
                      </Row>
                      <Row style={{ alignItems: "center" }} gap="xs">
                        <Eye className="h-4 w-4 text-green-500" />
                        <Text size="s">{station.visibility} mi</Text>
                      </Row>
                      <Row style={{ alignItems: "center" }} gap="xs">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <Text size="s">{station.upcomingGames} games</Text>
                      </Row>
                    </Grid>
                    
                    {station.alerts.length > 0 && (
                      <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '0.5rem' }}>
                        <Row style={{ alignItems: "center" }} gap="xs" marginBottom="xs">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <Text size="s" weight="medium" color="red-800">Active Alerts</Text>
                        </Row>
                        {station.alerts.map((alert, i) => (
                          <Text key={i} size="s" color="red-700">{alert}</Text>
                        ))}
                      </div>
                    )}
                    
                    <Row style={{ alignItems: "center" }} justifyContent="between">
                      <Text size="xs" color="neutral-500">Updated {station.lastUpdated}</Text>
                      <Button variant="secondary" size="s">
                        <Clock className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </Row>
                  </Column>
                </Card>
              ))}
            </Grid>
          )}

          {selectedView === 'alerts' && (
            <Card padding="m">
              <Column gap="m">
                <Column gap="xs">
                  <Heading as="h3" size="m">Active Weather Alerts</Heading>
                  <Text size="s" color="neutral-600">Current weather warnings and advisories across Big 12 campuses</Text>
                </Column>
                
                <div style={{ border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                  <Row style={{ alignItems: "center" }} gap="s" marginBottom="s">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <Text weight="medium" color="red-800">Severe Thunderstorm Watch</Text>
                    <Badge variant="brand" onBackground="danger-strong">Active</Badge>
                  </Row>
                  <Text size="s" color="red-700" marginBottom="s">
                    Kansas (Lawrence) - Valid until 9:00 PM CDT. Large hail and damaging winds possible.
                  </Text>
                  <Row gap="s" wrap>
                    <Button size="s" variant="secondary">View Details</Button>
                    <Button size="s" variant="secondary">Send Notification</Button>
                    <Button size="s" style={{ backgroundColor: '#ea580c' }}>Postpone Games</Button>
                    <Button size="s" style={{ backgroundColor: '#2563eb' }}>Move to Indoor Venue</Button>
                  </Row>
                </div>
                
                <div style={{ border: '1px solid rgba(59, 130, 246, 0.2)', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                  <Row style={{ alignItems: "center" }} gap="s" marginBottom="s">
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                    <Text weight="medium" color="blue-800">Winter Weather Advisory</Text>
                    <Badge variant="neutral">Active</Badge>
                  </Row>
                  <Text size="s" color="blue-700" marginBottom="s">
                    Colorado (Boulder) - Valid until 6:00 AM MST. 2-4 inches of snow expected.
                  </Text>
                  <Row gap="s" wrap>
                    <Button size="s" variant="secondary">View Details</Button>
                    <Button size="s" variant="secondary">Send Notification</Button>
                    <Button size="s" style={{ backgroundColor: '#ea580c' }}>Postpone Games</Button>
                    <Button size="s" style={{ backgroundColor: '#7c3aed' }}>Delay Start Time</Button>
                    <Button size="s" style={{ backgroundColor: '#16a34a' }}>Activate Clearing Crew</Button>
                  </Row>
                </div>
                
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <Text color="neutral-500">All other campuses have no active weather alerts</Text>
                </div>
              </Column>
            </Card>
          )}

          {selectedView === 'forecast' && (
            <Card padding="m">
              <Column gap="m">
                <Column gap="xs">
                  <Heading as="h3" size="m">7-Day Weather Forecast</Heading>
                  <Text size="s" color="neutral-600">Extended forecast for all Big 12 campuses</Text>
                </Column>
                
                <div style={{ backgroundColor: 'var(--neutral-surface)', padding: '2rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <Cloud className="h-12 w-12 mx-auto mb-4 text-neutral-500" />
                  <Heading as="h3" size="m" marginBottom="s">Extended Forecast Coming Soon</Heading>
                  <Text color="neutral-500">
                    Detailed 7-day weather predictions with game impact analysis
                  </Text>
                </div>
              </Column>
            </Card>
          )}

          {selectedView === 'analytics' && (
            <Grid columns={2} gap="m" fillWidth>
              <Card padding="m">
                <Column gap="m">
                  <Heading as="h3" size="m">Weather Impact Statistics</Heading>
                  
                  <Column gap="s">
                    <Row style={{ alignItems: "center" }} justifyContent="between">
                      <Text size="s">Games Postponed (Weather)</Text>
                      <Column alignItems="end" gap="xs">
                        <Text weight="medium">3</Text>
                        <Text size="xs" color="neutral-500">This season</Text>
                      </Column>
                    </Row>
                    <Row style={{ alignItems: "center" }} justifyContent="between">
                      <Text size="s">Safety Incidents</Text>
                      <Column alignItems="end" gap="xs">
                        <Text weight="medium" color="green-600">0</Text>
                        <Text size="xs" color="neutral-500">Zero tolerance achieved</Text>
                      </Column>
                    </Row>
                    <Row style={{ alignItems: "center" }} justifyContent="between">
                      <Text size="s">Early Warnings Issued</Text>
                      <Column alignItems="end" gap="xs">
                        <Text weight="medium">47</Text>
                        <Text size="xs" color="neutral-500">This month</Text>
                      </Column>
                    </Row>
                  </Column>
                </Column>
              </Card>
              
              <Card padding="m">
                <Column gap="m">
                  <Heading as="h3" size="m">Campus Temperature Range</Heading>
                  
                  <Column gap="s">
                    <Row style={{ alignItems: "center" }} justifyContent="between">
                      <Text size="s">Highest</Text>
                      <Column alignItems="end" gap="xs">
                        <Text weight="medium">82°F</Text>
                        <Text size="xs" color="neutral-500">Arizona State</Text>
                      </Column>
                    </Row>
                    <Row style={{ alignItems: "center" }} justifyContent="between">
                      <Text size="s">Lowest</Text>
                      <Column alignItems="end" gap="xs">
                        <Text weight="medium">38°F</Text>
                        <Text size="xs" color="neutral-500">West Virginia</Text>
                      </Column>
                    </Row>
                    <Row style={{ alignItems: "center" }} justifyContent="between">
                      <Text size="s">Average</Text>
                      <Column alignItems="end" gap="xs">
                        <Text weight="medium">63°F</Text>
                        <Text size="xs" color="neutral-500">Conference-wide</Text>
                      </Column>
                    </Row>
                  </Column>
                </Column>
              </Card>
            </Grid>
          )}
        </Column>
      </Column>
    </Background>
  )
}