'use client'

import { 
  Column, 
  Row, 
  Grid, 
  Card, 
  Button, 
  Heading, 
  Text,
  Background, 
  Icon, 
  Badge, 
  StatusIndicator, 
  Dropdown,
  Option,
  ToggleButton
} from "@once-ui-system/core"
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
        return <Badge variant="success">Confirmed</Badge>
      case 'pending':
        return <Badge variant="neutral">Pending</Badge>
      case 'completed':
        return <Badge variant="info">Completed</Badge>
      default:
        return <Badge variant="neutral">{status}</Badge>
    }
  }

  const getMethodIcon = (method: string) => {
    if (method.includes('Flight')) return <Icon name="plane" size="s" />
    if (method.includes('Bus')) return <Icon name="car" size="s" />
    return <Icon name="route" size="s" />
  }

  return (
    <Background background="page" fillWidth>
      <Column fillWidth padding="m" gap="m">
        <Row fillWidth justifyContent="space-between" alignItems="flex-start">
          <Column>
            <Heading as="h1" variant="display-strong-s">
              <Icon name="route" size="m" /> Travel Planning
            </Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Coordinate and optimize travel for Big 12 athletic teams
            </Text>
          </Column>
          <Button variant="primary">
            <Icon name="calendar" size="xs" /> Plan New Trip
          </Button>
        </Row>

        {/* Key Stats */}
        <Grid columns="2" tabletColumns="3" desktopColumns="6" gap="s">
          <Card padding="s" border="neutral-medium">
            <Column gap="xs">
              <Text variant="body-default-s" weight="medium">Total Miles</Text>
              <Heading as="div" variant="heading-strong-m">{travelStats.totalMiles.toLocaleString()}</Heading>
              <Text variant="body-default-xs" onBackground="neutral-weak">This season</Text>
            </Column>
          </Card>
          
          <Card padding="s" border="neutral-medium">
            <Column gap="xs">
              <Text variant="body-default-s" weight="medium">Total Cost</Text>
              <Heading as="div" variant="heading-strong-m">{travelStats.totalCost}</Heading>
              <Text variant="body-default-xs" onBackground="neutral-weak">Budget used</Text>
            </Column>
          </Card>
          
          <Card padding="s" border="neutral-medium">
            <Column gap="xs">
              <Text variant="body-default-s" weight="medium">Average Cost</Text>
              <Heading as="div" variant="heading-strong-m">{travelStats.averageCost}</Heading>
              <Text variant="body-default-xs" onBackground="neutral-weak">Per trip</Text>
            </Column>
          </Card>
          
          <Card padding="s" border="neutral-medium">
            <Column gap="xs">
              <Text variant="body-default-s" weight="medium">Total Trips</Text>
              <Heading as="div" variant="heading-strong-m">{travelStats.totalTrips}</Heading>
              <Text variant="body-default-xs" onBackground="neutral-weak">Scheduled</Text>
            </Column>
          </Card>
          
          <Card padding="s" border="neutral-medium">
            <Column gap="xs">
              <Text variant="body-default-s" weight="medium">On-Time %</Text>
              <Heading as="div" variant="heading-strong-m">{travelStats.onTimePercentage}%</Heading>
              <Text variant="body-default-xs" onBackground="neutral-weak">Performance</Text>
            </Column>
          </Card>
          
          <Card padding="s" border="neutral-medium">
            <Column gap="xs">
              <Text variant="body-default-s" weight="medium">Savings</Text>
              <Heading as="div" variant="heading-strong-m" style={{ color: 'rgb(34, 197, 94)' }}>
                {travelStats.costSavings}
              </Heading>
              <Text variant="body-default-xs" onBackground="neutral-weak">vs. commercial</Text>
            </Column>
          </Card>
        </Grid>

        {/* Filters */}
        <Row fillWidth gap="s" alignItems="center" wrap>
          <Column flex={1} maxWidth="400px">
            <Text as="label" variant="body-default-s" htmlFor="search-routes" onBackground="neutral-weak">
              Search routes
            </Text>
            <input
              id="search-routes"
              type="text"
              placeholder="Search routes by school or sport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.1)',
                background: 'var(--neutral-on-background-weak)',
                fontSize: '14px'
              }}
            />
          </Column>
          
          <Dropdown>
            <Option value="all">All Status</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="pending">Pending</Option>
            <Option value="completed">Completed</Option>
          </Dropdown>
          
          <Dropdown>
            <Option value="all">All Sports</Option>
            <Option value="football">Football</Option>
            <Option value="basketball">Basketball</Option>
            <Option value="wrestling">Wrestling</Option>
            <Option value="soccer">Soccer</Option>
          </Dropdown>
          
          <Badge variant="neutral">
            {filteredRoutes.length} of {travelRoutes.length} routes
          </Badge>
        </Row>

        <Column fillWidth gap="s">
          <Row gap="s">
            <ToggleButton 
              selected={selectedView === 'routes'} 
              onClick={() => setSelectedView('routes')}
            >
              Travel Routes
            </ToggleButton>
            <ToggleButton 
              selected={selectedView === 'calendar'} 
              onClick={() => setSelectedView('calendar')}
            >
              Calendar View
            </ToggleButton>
            <ToggleButton 
              selected={selectedView === 'optimization'} 
              onClick={() => setSelectedView('optimization')}
            >
              Route Optimization
            </ToggleButton>
            <ToggleButton 
              selected={selectedView === 'analytics'} 
              onClick={() => setSelectedView('analytics')}
            >
              Analytics
            </ToggleButton>
          </Row>

          {selectedView === 'routes' && (
            <Column gap="s">
              {filteredRoutes.map((route, index) => (
                <Card key={index} padding="m" border="neutral-medium" style={{ transition: 'all 0.2s ease' }}>
                  <Column gap="s">
                    <Row justifyContent="space-between" alignItems="flex-start">
                      <Row gap="s" alignItems="center">
                        {getMethodIcon(route.method)}
                        <Column>
                          <Heading as="h3" variant="heading-strong-s">
                            {route.from} → {route.to}
                          </Heading>
                          <Text variant="body-default-s" onBackground="neutral-weak">
                            {route.sport} • {new Date(route.date).toLocaleDateString()}
                          </Text>
                        </Column>
                      </Row>
                      {getStatusBadge(route.status)}
                    </Row>

                    <Grid columns="2" tabletColumns="4" gap="s">
                      <Column gap="xs">
                        <Row gap="xs" alignItems="center">
                          <Icon name="location" size="xs" />
                          <Text variant="body-default-s" weight="medium">Distance</Text>
                        </Row>
                        <Heading as="div" variant="heading-strong-s">{route.distance} mi</Heading>
                      </Column>
                      
                      <Column gap="xs">
                        <Row gap="xs" alignItems="center">
                          <Icon name="clock" size="xs" />
                          <Text variant="body-default-s" weight="medium">Duration</Text>
                        </Row>
                        <Heading as="div" variant="heading-strong-s">{route.duration}</Heading>
                      </Column>
                      
                      <Column gap="xs">
                        <Row gap="xs" alignItems="center">
                          <Icon name="dollar" size="xs" />
                          <Text variant="body-default-s" weight="medium">Cost</Text>
                        </Row>
                        <Heading as="div" variant="heading-strong-s">{route.cost}</Heading>
                      </Column>
                      
                      <Column gap="xs">
                        <Row gap="xs" alignItems="center">
                          <Icon name="team" size="xs" />
                          <Text variant="body-default-s" weight="medium">Team Size</Text>
                        </Row>
                        <Heading as="div" variant="heading-strong-s">{route.teamSize}</Heading>
                      </Column>
                    </Grid>
                    
                    <Card padding="s" background="neutral-weak">
                      <Grid columns="1" tabletColumns="2" gap="s">
                        <Column gap="xs">
                          <Text variant="body-default-s" weight="medium">Departure</Text>
                          <Text variant="body-default-s" onBackground="neutral-weak">{route.departure}</Text>
                        </Column>
                        <Column gap="xs">
                          <Text variant="body-default-s" weight="medium">Arrival</Text>
                          <Text variant="body-default-s" onBackground="neutral-weak">{route.arrival}</Text>
                        </Column>
                        <Column gap="xs">
                          <Text variant="body-default-s" weight="medium">Hotel</Text>
                          <Text variant="body-default-s" onBackground="neutral-weak">{route.hotel}</Text>
                        </Column>
                        <Column gap="xs">
                          <Text variant="body-default-s" weight="medium">Method</Text>
                          <Text variant="body-default-s" onBackground="neutral-weak">{route.method}</Text>
                        </Column>
                      </Grid>
                      {route.notes && (
                        <Column gap="xs" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                          <Text variant="body-default-s" weight="medium">Notes</Text>
                          <Text variant="body-default-s" onBackground="neutral-weak">{route.notes}</Text>
                        </Column>
                      )}
                    </Card>
                    
                    <Row gap="xs">
                      <Button variant="secondary" size="s">Edit Route</Button>
                      <Button variant="secondary" size="s">View Details</Button>
                      <Button variant="secondary" size="s">Track Status</Button>
                    </Row>
                  </Column>
                </Card>
              ))}
            </Column>
          )}

          {selectedView === 'calendar' && (
            <Card padding="m" border="neutral-medium">
              <Column gap="s">
                <Heading as="h3" variant="heading-strong-s">Travel Calendar</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Monthly view of all scheduled team travel
                </Text>
                
                <Card padding="l" background="neutral-weak" style={{ textAlign: 'center' }}>
                  <Column gap="s" alignItems="center">
                    <Icon name="calendar" size="l" />
                    <Heading as="h4" variant="heading-strong-s">Interactive Calendar Coming Soon</Heading>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      Visual calendar interface for managing all Big 12 team travel schedules
                    </Text>
                  </Column>
                </Card>
              </Column>
            </Card>
          )}

          {selectedView === 'optimization' && (
            <Card padding="m" border="neutral-medium">
              <Column gap="s">
                <Heading as="h3" variant="heading-strong-s">Route Optimization</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  AI-powered travel optimization and cost savings
                </Text>
                
                <Grid columns="1" tabletColumns="3" gap="s">
                  <Card padding="s" border="green-medium" style={{ textAlign: 'center' }}>
                    <Heading as="div" variant="heading-strong-l" style={{ color: 'rgb(34, 197, 94)' }}>
                      $340K
                    </Heading>
                    <Text variant="body-default-s">Cost Savings</Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">vs. commercial flights</Text>
                  </Card>
                  <Card padding="s" border="blue-medium" style={{ textAlign: 'center' }}>
                    <Heading as="div" variant="heading-strong-l" style={{ color: 'rgb(59, 130, 246)' }}>
                      23%
                    </Heading>
                    <Text variant="body-default-s">Route Efficiency</Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">improvement this year</Text>
                  </Card>
                  <Card padding="s" border="purple-medium" style={{ textAlign: 'center' }}>
                    <Heading as="div" variant="heading-strong-l" style={{ color: 'rgb(139, 69, 193)' }}>
                      156
                    </Heading>
                    <Text variant="body-default-s">Hours Saved</Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">through optimization</Text>
                  </Card>
                </Grid>
                
                <Column gap="s">
                  <Heading as="h4" variant="heading-strong-s">Optimization Recommendations</Heading>
                  <Column gap="s">
                    <Row gap="s" alignItems="flex-start" padding="s" style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                      <Icon name="check" size="s" style={{ color: 'rgb(34, 197, 94)', marginTop: '2px' }} />
                      <Column>
                        <Text variant="body-default-s" weight="medium">Charter Flight Consolidation</Text>
                        <Text variant="body-default-s" onBackground="neutral-weak">
                          Combine Kansas and Kansas State basketball trips to save $15K
                        </Text>
                      </Column>
                    </Row>
                    <Row gap="s" alignItems="flex-start" padding="s" style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                      <Icon name="warning" size="s" style={{ color: 'rgb(245, 158, 11)', marginTop: '2px' }} />
                      <Column>
                        <Text variant="body-default-s" weight="medium">Weather Contingency</Text>
                        <Text variant="body-default-s" onBackground="neutral-weak">
                          Monitor Colorado-bound flights for winter weather delays
                        </Text>
                      </Column>
                    </Row>
                    <Row gap="s" alignItems="flex-start" padding="s" style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                      <Icon name="check" size="s" style={{ color: 'rgb(34, 197, 94)', marginTop: '2px' }} />
                      <Column>
                        <Text variant="body-default-s" weight="medium">Regional Bus Routes</Text>
                        <Text variant="body-default-s" onBackground="neutral-weak">
                          Use charter buses for Iowa State-Kansas rivalry games (under 300 miles)
                        </Text>
                      </Column>
                    </Row>
                  </Column>
                </Column>
              </Column>
            </Card>
          )}

          {selectedView === 'analytics' && (
            <Grid columns="1" tabletColumns="2" gap="s">
              <Card padding="m" border="neutral-medium">
                <Column gap="s">
                  <Heading as="h3" variant="heading-strong-s">Travel Method Breakdown</Heading>
                  
                  <Column gap="s">
                    <Row justifyContent="space-between" alignItems="center">
                      <Row gap="xs" alignItems="center">
                        <Icon name="plane" size="xs" />
                        <Text variant="body-default-s">Charter Flights</Text>
                      </Row>
                      <Column alignItems="flex-end">
                        <Text variant="body-default-s" weight="medium">68%</Text>
                        <Text variant="body-default-xs" onBackground="neutral-weak">59 trips</Text>
                      </Column>
                    </Row>
                    <Row justifyContent="space-between" alignItems="center">
                      <Row gap="xs" alignItems="center">
                        <Icon name="car" size="xs" />
                        <Text variant="body-default-s">Charter Bus</Text>
                      </Row>
                      <Column alignItems="flex-end">
                        <Text variant="body-default-s" weight="medium">28%</Text>
                        <Text variant="body-default-xs" onBackground="neutral-weak">24 trips</Text>
                      </Column>
                    </Row>
                    <Row justifyContent="space-between" alignItems="center">
                      <Row gap="xs" alignItems="center">
                        <Icon name="route" size="xs" />
                        <Text variant="body-default-s">Other</Text>
                      </Row>
                      <Column alignItems="flex-end">
                        <Text variant="body-default-s" weight="medium">4%</Text>
                        <Text variant="body-default-xs" onBackground="neutral-weak">4 trips</Text>
                      </Column>
                    </Row>
                  </Column>
                </Column>
              </Card>
              
              <Card padding="m" border="neutral-medium">
                <Column gap="s">
                  <Heading as="h3" variant="heading-strong-s">Sport Distribution</Heading>
                  
                  <Column gap="s">
                    <Row justifyContent="space-between" alignItems="center">
                      <Text variant="body-default-s">Football</Text>
                      <Column alignItems="flex-end">
                        <Text variant="body-default-s" weight="medium">45%</Text>
                        <Text variant="body-default-xs" onBackground="neutral-weak">39 trips</Text>
                      </Column>
                    </Row>
                    <Row justifyContent="space-between" alignItems="center">
                      <Text variant="body-default-s">Basketball</Text>
                      <Column alignItems="flex-end">
                        <Text variant="body-default-s" weight="medium">32%</Text>
                        <Text variant="body-default-xs" onBackground="neutral-weak">28 trips</Text>
                      </Column>
                    </Row>
                    <Row justifyContent="space-between" alignItems="center">
                      <Text variant="body-default-s">Other Sports</Text>
                      <Column alignItems="flex-end">
                        <Text variant="body-default-s" weight="medium">23%</Text>
                        <Text variant="body-default-xs" onBackground="neutral-weak">20 trips</Text>
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