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

const venues = [
  {
    name: 'Arizona Stadium',
    school: 'Arizona',
    sport: 'Football',
    capacity: 56000,
    opened: 1929,
    surface: 'Grass',
    city: 'Tucson',
    state: 'AZ',
    nickname: 'The Pride of Arizona',
    renovated: 2013
  },
  {
    name: 'Sun Devil Stadium',
    school: 'Arizona State',
    sport: 'Football',
    capacity: 53599,
    opened: 1958,
    surface: 'Grass',
    city: 'Tempe',
    state: 'AZ',
    nickname: 'The Furnace',
    renovated: 2019
  },
  {
    name: 'McLane Stadium',
    school: 'Baylor',
    sport: 'Football',
    capacity: 45140,
    opened: 2014,
    surface: 'Artificial Turf',
    city: 'Waco',
    state: 'TX',
    nickname: 'The Brazos River Stadium',
    renovated: null
  },
  {
    name: 'LaVell Edwards Stadium',
    school: 'BYU',
    sport: 'Football',
    capacity: 63470,
    opened: 1964,
    surface: 'Artificial Turf',
    city: 'Provo',
    state: 'UT',
    nickname: 'The Home of Champions',
    renovated: 2020
  },
  {
    name: 'Nippert Stadium',
    school: 'Cincinnati',
    sport: 'Football',
    capacity: 40000,
    opened: 1901,
    surface: 'Artificial Turf',
    city: 'Cincinnati',
    state: 'OH',
    nickname: 'The Nipp',
    renovated: 2015
  },
  {
    name: 'Folsom Field',
    school: 'Colorado',
    sport: 'Football',
    capacity: 50183,
    opened: 1924,
    surface: 'Artificial Turf',
    city: 'Boulder',
    state: 'CO',
    nickname: 'Rocky Mountain High',
    renovated: 2018
  },
  {
    name: 'TDECU Stadium',
    school: 'Houston',
    sport: 'Football',
    capacity: 40000,
    opened: 2014,
    surface: 'Artificial Turf',
    city: 'Houston',
    state: 'TX',
    nickname: 'The Cage',
    renovated: null
  },
  {
    name: 'Jack Trice Stadium',
    school: 'Iowa State',
    sport: 'Football',
    capacity: 61500,
    opened: 1975,
    surface: 'Artificial Turf',
    city: 'Ames',
    state: 'IA',
    nickname: 'Home of the Cyclones',
    renovated: 2019
  },
  {
    name: 'David Booth Kansas Memorial Stadium',
    school: 'Kansas',
    sport: 'Football',
    capacity: 47233,
    opened: 1921,
    surface: 'Artificial Turf',
    city: 'Lawrence',
    state: 'KS',
    nickname: 'The Booth',
    renovated: 2017
  },
  {
    name: 'Bill Snyder Family Stadium',
    school: 'Kansas State',
    sport: 'Football',
    capacity: 50000,
    opened: 1968,
    surface: 'Artificial Turf',
    city: 'Manhattan',
    state: 'KS',
    nickname: 'The Wizard\'s Castle',
    renovated: 2013
  },
  {
    name: 'Boone Pickens Stadium',
    school: 'Oklahoma State',
    sport: 'Football',
    capacity: 60218,
    opened: 1920,
    surface: 'Artificial Turf',
    city: 'Stillwater',
    state: 'OK',
    nickname: 'The Palace on the Prairie',
    renovated: 2019
  },
  {
    name: 'Amon G. Carter Stadium',
    school: 'TCU',
    sport: 'Football',
    capacity: 44008,
    opened: 1930,
    surface: 'Artificial Turf',
    city: 'Fort Worth',
    state: 'TX',
    nickname: 'The Carter',
    renovated: 2012
  },
  {
    name: 'Jones AT&T Stadium',
    school: 'Texas Tech',
    sport: 'Football',
    capacity: 60454,
    opened: 1947,
    surface: 'Artificial Turf',
    city: 'Lubbock',
    state: 'TX',
    nickname: 'The Jones',
    renovated: 2013
  },
  {
    name: 'FBC Mortgage Stadium',
    school: 'UCF',
    sport: 'Football',
    capacity: 44206,
    opened: 2007,
    surface: 'Artificial Turf',
    city: 'Orlando',
    state: 'FL',
    nickname: 'The Bounce House',
    renovated: 2014
  },
  {
    name: 'Rice-Eccles Stadium',
    school: 'Utah',
    sport: 'Football',
    capacity: 51444,
    opened: 1927,
    surface: 'Artificial Turf',
    city: 'Salt Lake City',
    state: 'UT',
    nickname: 'The Rice',
    renovated: 2002
  },
  {
    name: 'Milan Puskar Stadium',
    school: 'West Virginia',
    sport: 'Football',
    capacity: 60000,
    opened: 1980,
    surface: 'Artificial Turf',
    city: 'Morgantown',
    state: 'WV',
    nickname: 'Mountaineer Field',
    renovated: 2008
  }
]

// Basketball arenas data
const basketballVenues = [
  {
    name: 'McKale Center',
    school: 'Arizona',
    sport: 'Basketball',
    capacity: 14644,
    opened: 1973,
    surface: 'Hardwood',
    city: 'Tucson',
    state: 'AZ',
    nickname: 'The Cathedral',
    renovated: 2016
  },
  {
    name: 'Desert Financial Arena',
    school: 'Arizona State',
    sport: 'Basketball',
    capacity: 14198,
    opened: 1974,
    surface: 'Hardwood',
    city: 'Tempe',
    state: 'AZ',
    nickname: 'The Madhouse',
    renovated: 2019
  },
  // Add more basketball venues...
]

export default function VenuesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('football')
  const [selectedView, setSelectedView] = useState('grid')

  const currentVenues = selectedSport === 'football' ? venues : basketballVenues
  const filteredVenues = currentVenues.filter(venue => 
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Background background="page" fillWidth>
      <Column fillWidth padding="m" gap="m">
        <Row fillWidth justifyContent="space-between" alignItems="flex-start">
          <Column>
            <Heading as="h1" variant="display-strong-s">
              <Icon name="building" size="m" /> Big 12 Venues
            </Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Complete directory of stadiums and arenas across the Big 12 Conference
            </Text>
          </Column>
        </Row>

        <Row fillWidth gap="s" alignItems="center" wrap>
          <Column flex={1} maxWidth="400px">
            <Text as="label" variant="body-default-s" htmlFor="search-venues" onBackground="neutral-weak">
              Search venues
            </Text>
            <input
              id="search-venues"
              type="text"
              placeholder="Search venues by name, school, or city..."
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
          <Badge variant="neutral">
            {filteredVenues.length} of {currentVenues.length} venues
          </Badge>
        </Row>

        <Column fillWidth gap="s">
          <Row gap="s">
            <ToggleButton 
              selected={selectedSport === 'football'} 
              onClick={() => setSelectedSport('football')}
            >
              Football Stadiums
            </ToggleButton>
            <ToggleButton 
              selected={selectedSport === 'basketball'} 
              onClick={() => setSelectedSport('basketball')}
            >
              Basketball Arenas
            </ToggleButton>
            <ToggleButton 
              selected={selectedSport === 'baseball'} 
              onClick={() => setSelectedSport('baseball')}
            >
              Baseball Fields
            </ToggleButton>
            <ToggleButton 
              selected={selectedSport === 'other'} 
              onClick={() => setSelectedSport('other')}
            >
              Other Sports
            </ToggleButton>
          </Row>

          {selectedSport === 'football' && (
            <Column fillWidth gap="s">
              <Row gap="s">
                <ToggleButton 
                  selected={selectedView === 'grid'} 
                  onClick={() => setSelectedView('grid')}
                >
                  Grid View
                </ToggleButton>
                <ToggleButton 
                  selected={selectedView === 'table'} 
                  onClick={() => setSelectedView('table')}
                >
                  Table View
                </ToggleButton>
                <ToggleButton 
                  selected={selectedView === 'stats'} 
                  onClick={() => setSelectedView('stats')}
                >
                  Statistics
                </ToggleButton>
              </Row>

              {selectedView === 'grid' && (
                <Grid columns="1" tabletColumns="2" desktopColumns="3" gap="m">
                  {filteredVenues.map((venue, index) => (
                    <Card key={index} padding="m" border="neutral-medium" style={{ transition: 'all 0.2s ease' }}>
                      <Column fillWidth gap="s">
                        <Row justifyContent="space-between" alignItems="flex-start">
                          <Heading as="h3" variant="heading-strong-s">{venue.name}</Heading>
                          <Badge variant="neutral">{venue.sport}</Badge>
                        </Row>
                        <Row gap="xs" alignItems="center">
                          <Icon name="location" size="xs" />
                          <Text variant="body-default-s" onBackground="neutral-weak">
                            {venue.city}, {venue.state}
                          </Text>
                        </Row>
                        
                        <Card padding="s" background="neutral-weak" style={{ textAlign: 'center' }}>
                          <Heading as="div" variant="heading-strong-l">{venue.capacity.toLocaleString()}</Heading>
                          <Text variant="body-default-s" onBackground="neutral-weak">Capacity</Text>
                        </Card>
                        
                        <Column gap="xs">
                          <Row justifyContent="space-between">
                            <Text variant="body-default-s" onBackground="neutral-weak">School:</Text>
                            <Text variant="body-default-s" weight="medium">{venue.school}</Text>
                          </Row>
                          <Row justifyContent="space-between">
                            <Text variant="body-default-s" onBackground="neutral-weak">Opened:</Text>
                            <Text variant="body-default-s" weight="medium">{venue.opened}</Text>
                          </Row>
                          <Row justifyContent="space-between">
                            <Text variant="body-default-s" onBackground="neutral-weak">Surface:</Text>
                            <Text variant="body-default-s" weight="medium">{venue.surface}</Text>
                          </Row>
                          {venue.renovated && (
                            <Row justifyContent="space-between">
                              <Text variant="body-default-s" onBackground="neutral-weak">Renovated:</Text>
                              <Text variant="body-default-s" weight="medium">{venue.renovated}</Text>
                            </Row>
                          )}
                          <Row justifyContent="space-between">
                            <Text variant="body-default-s" onBackground="neutral-weak">Nickname:</Text>
                            <Text variant="body-default-s" weight="medium" style={{ fontStyle: 'italic' }}>{venue.nickname}</Text>
                          </Row>
                        </Column>
                        
                        <Button variant="secondary" size="s" fillWidth>
                          <Icon name="trophy" size="xs" /> View Details
                        </Button>
                      </Column>
                    </Card>
                  ))}
                </Grid>
              )}

              {selectedView === 'table' && (
                <Card padding="m" border="neutral-medium">
                  <Column gap="s">
                    <Heading as="h3" variant="heading-strong-s">Football Stadiums Directory</Heading>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      Complete information for all Big 12 football stadiums
                    </Text>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Stadium</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>School</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Location</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Capacity</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Opened</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Surface</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Renovated</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVenues.map((venue, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                              <td style={{ padding: '8px' }}>
                                <Text variant="body-default-s" weight="medium">{venue.name}</Text>
                              </td>
                              <td style={{ padding: '8px' }}>
                                <Text variant="body-default-s">{venue.school}</Text>
                              </td>
                              <td style={{ padding: '8px' }}>
                                <Text variant="body-default-s">{venue.city}, {venue.state}</Text>
                              </td>
                              <td style={{ padding: '8px' }}>
                                <Text variant="body-default-s">{venue.capacity.toLocaleString()}</Text>
                              </td>
                              <td style={{ padding: '8px' }}>
                                <Text variant="body-default-s">{venue.opened}</Text>
                              </td>
                              <td style={{ padding: '8px' }}>
                                <Text variant="body-default-s">{venue.surface}</Text>
                              </td>
                              <td style={{ padding: '8px' }}>
                                <Text variant="body-default-s">{venue.renovated || 'N/A'}</Text>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Column>
                </Card>
              )}

              {selectedView === 'stats' && (
                <Column gap="s">
                  <Grid columns="2" tabletColumns="4" gap="s">
                    <Card padding="s" border="neutral-medium">
                      <Column gap="xs">
                        <Text variant="body-default-s" weight="medium">Total Stadiums</Text>
                        <Heading as="div" variant="heading-strong-l">{venues.length}</Heading>
                        <Text variant="body-default-xs" onBackground="neutral-weak">Across 16 schools</Text>
                      </Column>
                    </Card>
                    
                    <Card padding="s" border="neutral-medium">
                      <Column gap="xs">
                        <Text variant="body-default-s" weight="medium">Total Capacity</Text>
                        <Heading as="div" variant="heading-strong-l">
                          {venues.reduce((sum, venue) => sum + venue.capacity, 0).toLocaleString()}
                        </Heading>
                        <Text variant="body-default-xs" onBackground="neutral-weak">Combined seats</Text>
                      </Column>
                    </Card>
                    
                    <Card padding="s" border="neutral-medium">
                      <Column gap="xs">
                        <Text variant="body-default-s" weight="medium">Average Capacity</Text>
                        <Heading as="div" variant="heading-strong-l">
                          {Math.round(venues.reduce((sum, venue) => sum + venue.capacity, 0) / venues.length).toLocaleString()}
                        </Heading>
                        <Text variant="body-default-xs" onBackground="neutral-weak">Per stadium</Text>
                      </Column>
                    </Card>
                    
                    <Card padding="s" border="neutral-medium">
                      <Column gap="xs">
                        <Text variant="body-default-s" weight="medium">Largest Stadium</Text>
                        <Text variant="body-default-s" weight="medium">
                          {venues.reduce((max, venue) => venue.capacity > max.capacity ? venue : max, venues[0]).name}
                        </Text>
                        <Text variant="body-default-xs" onBackground="neutral-weak">
                          {venues.reduce((max, venue) => venue.capacity > max.capacity ? venue : max, venues[0]).capacity.toLocaleString()} seats
                        </Text>
                      </Column>
                    </Card>
                  </Grid>
                  
                  <Card padding="m" border="neutral-medium">
                    <Column gap="s">
                      <Heading as="h3" variant="heading-strong-s">Stadium Age Distribution</Heading>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        Age breakdown of Big 12 football stadiums
                      </Text>
                      
                      <Grid columns="1" tabletColumns="3" gap="s">
                        <Card padding="s" border="green-medium" style={{ textAlign: 'center' }}>
                          <Heading as="div" variant="heading-strong-l">
                            {venues.filter(v => 2024 - v.opened < 25).length}
                          </Heading>
                          <Text variant="body-default-s">Modern (under 25 years)</Text>
                        </Card>
                        <Card padding="s" border="blue-medium" style={{ textAlign: 'center' }}>
                          <Heading as="div" variant="heading-strong-l">
                            {venues.filter(v => 2024 - v.opened >= 25 && 2024 - v.opened < 50).length}
                          </Heading>
                          <Text variant="body-default-s">Established (25-50 years)</Text>
                        </Card>
                        <Card padding="s" border="purple-medium" style={{ textAlign: 'center' }}>
                          <Heading as="div" variant="heading-strong-l">
                            {venues.filter(v => 2024 - v.opened >= 50).length}
                          </Heading>
                          <Text variant="body-default-s">Historic (50+ years)</Text>
                        </Card>
                      </Grid>
                    </Column>
                  </Card>
                </Column>
              )}
            </Column>
          )}

          {selectedSport === 'basketball' && (
            <Card padding="m" border="neutral-medium">
              <Column gap="s">
                <Heading as="h3" variant="heading-strong-s">Basketball Arenas</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Big 12 basketball venues coming soon
                </Text>
                
                <Card padding="l" background="neutral-weak" style={{ textAlign: 'center' }}>
                  <Column gap="s" alignItems="center">
                    <Icon name="building" size="l" />
                    <Heading as="h4" variant="heading-strong-s">Basketball Arenas Database</Heading>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      Complete directory of Big 12 basketball arenas with capacity, features, and history
                    </Text>
                  </Column>
                </Card>
              </Column>
            </Card>
          )}

          {selectedSport === 'baseball' && (
            <Card padding="m" border="neutral-medium">
              <Column gap="s">
                <Heading as="h3" variant="heading-strong-s">Baseball Fields</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Big 12 baseball venues coming soon
                </Text>
                
                <Card padding="l" background="neutral-weak" style={{ textAlign: 'center' }}>
                  <Column gap="s" alignItems="center">
                    <Icon name="building" size="l" />
                    <Heading as="h4" variant="heading-strong-s">Baseball Fields Database</Heading>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      Complete directory of Big 12 baseball fields and facilities
                    </Text>
                  </Column>
                </Card>
              </Column>
            </Card>
          )}

          {selectedSport === 'other' && (
            <Card padding="m" border="neutral-medium">
              <Column gap="s">
                <Heading as="h3" variant="heading-strong-s">Other Sports Venues</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Track, tennis, golf, and specialty sport facilities
                </Text>
                
                <Card padding="l" background="neutral-weak" style={{ textAlign: 'center' }}>
                  <Column gap="s" alignItems="center">
                    <Icon name="building" size="l" />
                    <Heading as="h4" variant="heading-strong-s">Multi-Sport Facilities</Heading>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      Comprehensive database of all Big 12 athletic facilities by sport
                    </Text>
                  </Column>
                </Card>
              </Column>
            </Card>
          )}
        </Column>
      </Column>
    </Background>
  )
}