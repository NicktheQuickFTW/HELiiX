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

const big12Schools = [
  {
    name: 'Arizona',
    city: 'Tucson',
    state: 'Arizona',
    enrollment: 47000,
    founded: 1885,
    colors: ['Cardinal', 'Navy'],
    mascot: 'Wildcats',
    conference: 'Big 12',
    website: 'arizona.edu',
    athletics: 'arizonawildcats.com',
    sports: 25,
    phone: '+1-520-621-2211'
  },
  {
    name: 'Arizona State',
    city: 'Tempe',
    state: 'Arizona',
    enrollment: 80000,
    founded: 1885,
    colors: ['Maroon', 'Gold'],
    mascot: 'Sun Devils',
    conference: 'Big 12',
    website: 'asu.edu',
    athletics: 'thesundevils.com',
    sports: 26,
    phone: '+1-480-965-9011'
  },
  {
    name: 'Baylor',
    city: 'Waco',
    state: 'Texas',
    enrollment: 20000,
    founded: 1845,
    colors: ['Green', 'Gold'],
    mascot: 'Bears',
    conference: 'Big 12',
    website: 'baylor.edu',
    athletics: 'baylorbears.com',
    sports: 19,
    phone: '+1-254-710-1011'
  },
  {
    name: 'BYU',
    city: 'Provo',
    state: 'Utah',
    enrollment: 33000,
    founded: 1875,
    colors: ['Royal Blue', 'White'],
    mascot: 'Cougars',
    conference: 'Big 12',
    website: 'byu.edu',
    athletics: 'byucougars.com',
    sports: 21,
    phone: '+1-801-422-4636'
  },
  {
    name: 'Cincinnati',
    city: 'Cincinnati',
    state: 'Ohio',
    enrollment: 46000,
    founded: 1819,
    colors: ['Red', 'Black'],
    mascot: 'Bearcats',
    conference: 'Big 12',
    website: 'uc.edu',
    athletics: 'gobearcats.com',
    sports: 18,
    phone: '+1-513-556-6000'
  },
  {
    name: 'Colorado',
    city: 'Boulder',
    state: 'Colorado',
    enrollment: 35000,
    founded: 1876,
    colors: ['Gold', 'Black'],
    mascot: 'Buffaloes',
    conference: 'Big 12',
    website: 'colorado.edu',
    athletics: 'cubuffs.com',
    sports: 17,
    phone: '+1-303-492-1411'
  },
  {
    name: 'Houston',
    city: 'Houston',
    state: 'Texas',
    enrollment: 47000,
    founded: 1927,
    colors: ['Scarlet Red', 'Albino White'],
    mascot: 'Cougars',
    conference: 'Big 12',
    website: 'uh.edu',
    athletics: 'uhcougars.com',
    sports: 17,
    phone: '+1-713-743-2255'
  },
  {
    name: 'Iowa State',
    city: 'Ames',
    state: 'Iowa',
    enrollment: 31000,
    founded: 1858,
    colors: ['Cardinal', 'Gold'],
    mascot: 'Cyclones',
    conference: 'Big 12',
    website: 'iastate.edu',
    athletics: 'cyclones.com',
    sports: 20,
    phone: '+1-515-294-4111'
  },
  {
    name: 'Kansas',
    city: 'Lawrence',
    state: 'Kansas',
    enrollment: 28000,
    founded: 1865,
    colors: ['Crimson', 'Blue'],
    mascot: 'Jayhawks',
    conference: 'Big 12',
    website: 'ku.edu',
    athletics: 'kuathletics.com',
    sports: 18,
    phone: '+1-785-864-2700'
  },
  {
    name: 'Kansas State',
    city: 'Manhattan',
    state: 'Kansas',
    enrollment: 24000,
    founded: 1863,
    colors: ['Royal Purple', 'White'],
    mascot: 'Wildcats',
    conference: 'Big 12',
    website: 'k-state.edu',
    athletics: 'kstatesports.com',
    sports: 16,
    phone: '+1-785-532-6011'
  },
  {
    name: 'Oklahoma State',
    city: 'Stillwater',
    state: 'Oklahoma',
    enrollment: 25000,
    founded: 1890,
    colors: ['Orange', 'Black'],
    mascot: 'Cowboys',
    conference: 'Big 12',
    website: 'okstate.edu',
    athletics: 'okstate.com',
    sports: 18,
    phone: '+1-405-744-5000'
  },
  {
    name: 'TCU',
    city: 'Fort Worth',
    state: 'Texas',
    enrollment: 11000,
    founded: 1873,
    colors: ['Purple', 'White'],
    mascot: 'Horned Frogs',
    conference: 'Big 12',
    website: 'tcu.edu',
    athletics: 'gofrogs.com',
    sports: 20,
    phone: '+1-817-257-7000'
  },
  {
    name: 'Texas Tech',
    city: 'Lubbock',
    state: 'Texas',
    enrollment: 40000,
    founded: 1923,
    colors: ['Scarlet', 'Black'],
    mascot: 'Red Raiders',
    conference: 'Big 12',
    website: 'ttu.edu',
    athletics: 'texastech.com',
    sports: 17,
    phone: '+1-806-742-2011'
  },
  {
    name: 'UCF',
    city: 'Orlando',
    state: 'Florida',
    enrollment: 68000,
    founded: 1963,
    colors: ['Black', 'Gold'],
    mascot: 'Knights',
    conference: 'Big 12',
    website: 'ucf.edu',
    athletics: 'ucfknights.com',
    sports: 16,
    phone: '+1-407-823-2000'
  },
  {
    name: 'Utah',
    city: 'Salt Lake City',
    state: 'Utah',
    enrollment: 33000,
    founded: 1850,
    colors: ['Crimson', 'White'],
    mascot: 'Utes',
    conference: 'Big 12',
    website: 'utah.edu',
    athletics: 'utahutes.com',
    sports: 20,
    phone: '+1-801-581-7200'
  },
  {
    name: 'West Virginia',
    city: 'Morgantown',
    state: 'West Virginia',
    enrollment: 26000,
    founded: 1867,
    colors: ['Gold', 'Blue'],
    mascot: 'Mountaineers',
    conference: 'Big 12',
    website: 'wvu.edu',
    athletics: 'wvusports.com',
    sports: 18,
    phone: '+1-304-293-0111'
  }
]

export default function SchoolsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedView, setSelectedView] = useState('grid')

  const filteredSchools = big12Schools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.state.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Background background="page" fillWidth>
      <Column fillWidth padding="m" gap="m">
        <Row fillWidth justifyContent="space-between" alignItems="flex-start">
          <Column>
            <Heading as="h1" variant="display-strong-s">
              <Icon name="building" size="m" /> Big 12 Member Schools
            </Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Complete directory of all 16 Big 12 Conference member institutions
            </Text>
          </Column>
        </Row>

        <Row fillWidth gap="s" alignItems="center">
          <Column flex={1} maxWidth="400px">
            <Text as="label" variant="body-default-s" htmlFor="search-schools" onBackground="neutral-weak">
              Search schools
            </Text>
            <input
              id="search-schools"
              type="text"
              placeholder="Search schools by name, city, or state..."
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
            {filteredSchools.length} of {big12Schools.length} schools
          </Badge>
        </Row>

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
              selected={selectedView === 'map'} 
              onClick={() => setSelectedView('map')}
            >
              Map View
            </ToggleButton>
          </Row>

          {selectedView === 'grid' && (
            <Grid 
              columns="1" 
              tabletColumns="2" 
              desktopColumns="3" 
              desktopLColumns="4" 
              gap="m"
            >
              {filteredSchools.map((school, index) => (
                <Card key={index} padding="m" border="neutral-medium" style={{ transition: 'all 0.2s ease' }}>
                  <Column fillWidth gap="s">
                    <Row justifyContent="space-between" alignItems="flex-start">
                      <Column>
                        <Heading as="h3" variant="heading-strong-s">{school.name}</Heading>
                        <Row gap="xs" alignItems="center">
                          <Icon name="location" size="xs" />
                          <Text variant="body-default-s" onBackground="neutral-weak">
                            {school.city}, {school.state}
                          </Text>
                        </Row>
                      </Column>
                      <Badge variant="neutral">{school.mascot}</Badge>
                    </Row>

                    <Column gap="xs">
                      <Row justifyContent="space-between">
                        <Text variant="body-default-s" onBackground="neutral-weak">Founded:</Text>
                        <Text variant="body-default-s" weight="medium">{school.founded}</Text>
                      </Row>
                      <Row justifyContent="space-between">
                        <Text variant="body-default-s" onBackground="neutral-weak">Enrollment:</Text>
                        <Text variant="body-default-s" weight="medium">{school.enrollment.toLocaleString()}</Text>
                      </Row>
                      <Row justifyContent="space-between">
                        <Text variant="body-default-s" onBackground="neutral-weak">Sports:</Text>
                        <Text variant="body-default-s" weight="medium">{school.sports}</Text>
                      </Row>
                      <Row justifyContent="space-between">
                        <Text variant="body-default-s" onBackground="neutral-weak">Colors:</Text>
                        <Text variant="body-default-s" weight="medium">{school.colors.join(', ')}</Text>
                      </Row>
                    </Column>
                    
                    <Row gap="xs">
                      <Button 
                        href={`https://${school.website}`} 
                        variant="secondary" 
                        size="s" 
                        target="_blank"
                        fillWidth
                      >
                        <Icon name="external" size="xs" /> Website
                      </Button>
                      <Button 
                        href={`https://${school.athletics}`} 
                        variant="secondary" 
                        size="s" 
                        target="_blank"
                        fillWidth
                      >
                        <Icon name="external" size="xs" /> Athletics
                      </Button>
                    </Row>
                  </Column>
                </Card>
              ))}
            </Grid>
          )}

          {selectedView === 'table' && (
            <Card padding="m" border="neutral-medium">
              <Column gap="s">
                <Heading as="h3" variant="heading-strong-s">Schools Directory</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Complete information for all Big 12 member schools
                </Text>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>School</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Location</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Enrollment</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Founded</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Sports</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Mascot</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSchools.map((school, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <td style={{ padding: '8px' }}>
                            <Text variant="body-default-s" weight="medium">{school.name}</Text>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <Text variant="body-default-s">{school.city}, {school.state}</Text>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <Text variant="body-default-s">{school.enrollment.toLocaleString()}</Text>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <Text variant="body-default-s">{school.founded}</Text>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <Text variant="body-default-s">{school.sports}</Text>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <Text variant="body-default-s">{school.mascot}</Text>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <Row gap="xs">
                              <Button 
                                href={`https://${school.website}`} 
                                variant="ghost" 
                                size="s" 
                                target="_blank"
                              >
                                <Icon name="external" size="xs" />
                              </Button>
                              <Button 
                                href={`tel:${school.phone}`} 
                                variant="ghost" 
                                size="s"
                              >
                                <Icon name="phone" size="xs" />
                              </Button>
                            </Row>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Column>
            </Card>
          )}

          {selectedView === 'map' && (
            <Card padding="m" border="neutral-medium">
              <Column gap="s">
                <Heading as="h3" variant="heading-strong-s">Geographic Distribution</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Big 12 schools across the United States
                </Text>
                
                <Card padding="l" background="neutral-weak" style={{ textAlign: 'center' }}>
                  <Column gap="s" alignItems="center">
                    <Icon name="location" size="l" />
                    <Heading as="h4" variant="heading-strong-s">Interactive Map Coming Soon</Heading>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      Geographic visualization of all 16 Big 12 schools with interactive features
                    </Text>
                  </Column>
                </Card>
                
                <Column gap="s">
                  <Heading as="h4" variant="heading-strong-s">Schools by State</Heading>
                  <Grid columns="1" tabletColumns="2" desktopColumns="3" gap="s">
                    <Card padding="s" border="neutral-medium">
                      <Text variant="body-default-s" weight="medium">Texas (4):</Text>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        Baylor, Houston, TCU, Texas Tech
                      </Text>
                    </Card>
                    <Card padding="s" border="neutral-medium">
                      <Text variant="body-default-s" weight="medium">Arizona (2):</Text>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        Arizona, Arizona State
                      </Text>
                    </Card>
                    <Card padding="s" border="neutral-medium">
                      <Text variant="body-default-s" weight="medium">Kansas (2):</Text>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        Kansas, Kansas State
                      </Text>
                    </Card>
                    <Card padding="s" border="neutral-medium">
                      <Text variant="body-default-s" weight="medium">Utah (2):</Text>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        BYU, Utah
                      </Text>
                    </Card>
                    <Card padding="s" border="neutral-medium">
                      <Text variant="body-default-s" weight="medium">Single States (6):</Text>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        Cincinnati (OH), Colorado (CO), Iowa State (IA), Oklahoma State (OK), UCF (FL), West Virginia (WV)
                      </Text>
                    </Card>
                  </Grid>
                </Column>
              </Column>
            </Card>
          )}
        </Column>
      </Column>
    </Background>
  )
}