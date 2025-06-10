'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, MapPin, Users, Phone, Mail, ExternalLink, Search } from 'lucide-react'
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
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Big 12 Member Schools
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete directory of all 16 Big 12 Conference member institutions
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schools by name, city, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">
          {filteredSchools.length} of {big12Schools.length} schools
        </Badge>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSchools.map((school, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{school.name}</CardTitle>
                    <Badge variant="outline">{school.mascot}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {school.city}, {school.state}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Founded:</span>
                      <span className="font-medium">{school.founded}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Enrollment:</span>
                      <span className="font-medium">{school.enrollment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sports:</span>
                      <span className="font-medium">{school.sports}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Colors:</span>
                      <span className="font-medium">{school.colors.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={`https://${school.website}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Website
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={`https://${school.athletics}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Athletics
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schools Directory</CardTitle>
              <CardDescription>Complete information for all Big 12 member schools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">School</th>
                      <th className="text-left p-2">Location</th>
                      <th className="text-left p-2">Enrollment</th>
                      <th className="text-left p-2">Founded</th>
                      <th className="text-left p-2">Sports</th>
                      <th className="text-left p-2">Mascot</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchools.map((school, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{school.name}</td>
                        <td className="p-2">{school.city}, {school.state}</td>
                        <td className="p-2">{school.enrollment.toLocaleString()}</td>
                        <td className="p-2">{school.founded}</td>
                        <td className="p-2">{school.sports}</td>
                        <td className="p-2">{school.mascot}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`https://${school.website}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`tel:${school.phone}`}>
                                <Phone className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Big 12 schools across the United States</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-8 rounded-lg text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Interactive Map Coming Soon</h3>
                <p className="text-muted-foreground">
                  Geographic visualization of all 16 Big 12 schools with interactive features
                </p>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Schools by State</h4>
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="p-3 border rounded-lg">
                    <span className="font-medium">Texas (4):</span>
                    <p className="text-sm text-muted-foreground">Baylor, Houston, TCU, Texas Tech</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <span className="font-medium">Arizona (2):</span>
                    <p className="text-sm text-muted-foreground">Arizona, Arizona State</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <span className="font-medium">Kansas (2):</span>
                    <p className="text-sm text-muted-foreground">Kansas, Kansas State</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <span className="font-medium">Utah (2):</span>
                    <p className="text-sm text-muted-foreground">BYU, Utah</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <span className="font-medium">Single States (6):</span>
                    <p className="text-sm text-muted-foreground">Cincinnati (OH), Colorado (CO), Iowa State (IA), Oklahoma State (OK), UCF (FL), West Virginia (WV)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}