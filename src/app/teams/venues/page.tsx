'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building, MapPin, Users, Calendar, ExternalLink, Search, Trophy } from 'lucide-react'
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
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building className="h-8 w-8" />
            Big 12 Venues
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete directory of stadiums and arenas across the Big 12 Conference
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search venues by name, school, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">
          {filteredVenues.length} of {currentVenues.length} venues
        </Badge>
      </div>

      <Tabs value={selectedSport} onValueChange={setSelectedSport} className="space-y-4">
        <TabsList>
          <TabsTrigger value="football">Football Stadiums</TabsTrigger>
          <TabsTrigger value="basketball">Basketball Arenas</TabsTrigger>
          <TabsTrigger value="baseball">Baseball Fields</TabsTrigger>
          <TabsTrigger value="other">Other Sports</TabsTrigger>
        </TabsList>

        <TabsContent value="football" className="space-y-4">
          <Tabs value={selectedView} onValueChange={setSelectedView}>
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredVenues.map((venue, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{venue.name}</CardTitle>
                        <Badge variant="outline">{venue.sport}</Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {venue.city}, {venue.state}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold">{venue.capacity.toLocaleString()}</div>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">School:</span>
                          <span className="font-medium">{venue.school}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Opened:</span>
                          <span className="font-medium">{venue.opened}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Surface:</span>
                          <span className="font-medium">{venue.surface}</span>
                        </div>
                        {venue.renovated && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Renovated:</span>
                            <span className="font-medium">{venue.renovated}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Nickname:</span>
                          <span className="font-medium italic">{venue.nickname}</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full" size="sm">
                        <Trophy className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="table" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Football Stadiums Directory</CardTitle>
                  <CardDescription>Complete information for all Big 12 football stadiums</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Stadium</th>
                          <th className="text-left p-2">School</th>
                          <th className="text-left p-2">Location</th>
                          <th className="text-left p-2">Capacity</th>
                          <th className="text-left p-2">Opened</th>
                          <th className="text-left p-2">Surface</th>
                          <th className="text-left p-2">Renovated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVenues.map((venue, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="p-2 font-medium">{venue.name}</td>
                            <td className="p-2">{venue.school}</td>
                            <td className="p-2">{venue.city}, {venue.state}</td>
                            <td className="p-2">{venue.capacity.toLocaleString()}</td>
                            <td className="p-2">{venue.opened}</td>
                            <td className="p-2">{venue.surface}</td>
                            <td className="p-2">{venue.renovated || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Stadiums</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{venues.length}</div>
                    <p className="text-xs text-muted-foreground">Across 16 schools</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {venues.reduce((sum, venue) => sum + venue.capacity, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Combined seats</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Average Capacity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(venues.reduce((sum, venue) => sum + venue.capacity, 0) / venues.length).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Per stadium</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Largest Stadium</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">
                      {venues.reduce((max, venue) => venue.capacity > max.capacity ? venue : max, venues[0]).name}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {venues.reduce((max, venue) => venue.capacity > max.capacity ? venue : max, venues[0]).capacity.toLocaleString()} seats
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Stadium Age Distribution</CardTitle>
                  <CardDescription>Age breakdown of Big 12 football stadiums</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">
                          {venues.filter(v => 2024 - v.opened < 25).length}
                        </div>
                        <p className="text-sm text-muted-foreground">Modern (under 25 years)</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">
                          {venues.filter(v => 2024 - v.opened >= 25 && 2024 - v.opened < 50).length}
                        </div>
                        <p className="text-sm text-muted-foreground">Established (25-50 years)</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">
                          {venues.filter(v => 2024 - v.opened >= 50).length}
                        </div>
                        <p className="text-sm text-muted-foreground">Historic (50+ years)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="basketball" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basketball Arenas</CardTitle>
              <CardDescription>Big 12 basketball venues coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Basketball Arenas Database</h3>
                <p className="text-muted-foreground">
                  Complete directory of Big 12 basketball arenas with capacity, features, and history
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="baseball" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Baseball Fields</CardTitle>
              <CardDescription>Big 12 baseball venues coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Baseball Fields Database</h3>
                <p className="text-muted-foreground">
                  Complete directory of Big 12 baseball fields and facilities
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Other Sports Venues</CardTitle>
              <CardDescription>Track, tennis, golf, and specialty sport facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Multi-Sport Facilities</h3>
                <p className="text-muted-foreground">
                  Comprehensive database of all Big 12 athletic facilities by sport
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}