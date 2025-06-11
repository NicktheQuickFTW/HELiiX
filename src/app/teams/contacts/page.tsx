'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TeamLogo } from '@/components/ui/team-logo'
import { Building2, Phone, Mail, ExternalLink, Search, Users, MapPin } from 'lucide-react'
import { useState } from 'react'

const big12Contacts = [
  {
    school: "Arizona",
    city: "Tucson, AZ",
    athletics: {
      director: "Desiree Reed-Francois",
      phone: "+1-520-621-4163",
      email: "dreed@arizona.edu"
    },
    compliance: {
      director: "Jessica Dill",
      phone: "+1-520-621-9547", 
      email: "jessicadill@arizona.edu"
    },
    communications: {
      director: "Ryan Finley",
      phone: "+1-520-621-2211",
      email: "rfinley@arizona.edu"
    },
    website: "arizona.edu",
    athleticsWebsite: "arizonawildcats.com"
  },
  {
    school: "Arizona State",
    city: "Tempe, AZ", 
    athletics: {
      director: "Graham Rossini",
      phone: "+1-480-965-6592",
      email: "graham.rossini@asu.edu"
    },
    compliance: {
      director: "Jean Boyd",
      phone: "+1-480-965-3482",
      email: "jean.boyd@asu.edu"
    },
    communications: {
      director: "Jeremy Hawkes",
      phone: "+1-480-965-9011",
      email: "jeremy.hawkes@asu.edu"
    },
    website: "asu.edu",
    athleticsWebsite: "thesundevils.com"
  },
  {
    school: "Baylor",
    city: "Waco, TX",
    athletics: {
      director: "Mack Rhoades",
      phone: "+1-254-710-1234",
      email: "mack_rhoades@baylor.edu"
    },
    compliance: {
      director: "Kevin Jackson",
      phone: "+1-254-710-1161",
      email: "kevin_jackson@baylor.edu"
    },
    communications: {
      director: "Nick Joos",
      phone: "+1-254-710-1011",
      email: "nick_joos@baylor.edu"
    },
    website: "baylor.edu",
    athleticsWebsite: "baylorbears.com"
  },
  {
    school: "BYU",
    city: "Provo, UT",
    athletics: {
      director: "Tom Holmoe",
      phone: "+1-801-422-2116",
      email: "tom_holmoe@byu.edu"
    },
    compliance: {
      director: "Liz Darger",
      phone: "+1-801-422-5071",
      email: "liz_darger@byu.edu"
    },
    communications: {
      director: "Duff Tittle",
      phone: "+1-801-422-4636",
      email: "duff_tittle@byu.edu"
    },
    website: "byu.edu",
    athleticsWebsite: "byucougars.com"
  },
  {
    school: "Cincinnati",
    city: "Cincinnati, OH",
    athletics: {
      director: "John Cunningham",
      phone: "+1-513-556-0100",
      email: "john.cunningham@uc.edu"
    },
    compliance: {
      director: "Mike Thomas",
      phone: "+1-513-556-5191",
      email: "mike.thomas@uc.edu"
    },
    communications: {
      director: "Tom Hathaway",
      phone: "+1-513-556-6000",
      email: "tom.hathaway@uc.edu"
    },
    website: "uc.edu",
    athleticsWebsite: "gobearcats.com"
  },
  {
    school: "Colorado",
    city: "Boulder, CO",
    athletics: {
      director: "Rick George", 
      phone: "+1-303-492-5626",
      email: "rick.george@colorado.edu"
    },
    compliance: {
      director: "David Plati",
      phone: "+1-303-492-4007",
      email: "david.plati@colorado.edu"
    },
    communications: {
      director: "Dave Plati",
      phone: "+1-303-492-1411",
      email: "dave.plati@colorado.edu"
    },
    website: "colorado.edu",
    athleticsWebsite: "cubuffs.com"
  },
  {
    school: "Houston",
    city: "Houston, TX",
    athletics: {
      director: "Chris Pezman",
      phone: "+1-713-743-9370",
      email: "cpezman@uh.edu"
    },
    compliance: {
      director: "Donna Turner",
      phone: "+1-713-743-9404",
      email: "dturner@uh.edu"
    },
    communications: {
      director: "David Bassity",
      phone: "+1-713-743-2255",
      email: "dbassity@uh.edu"
    },
    website: "uh.edu",
    athleticsWebsite: "uhcougars.com"
  },
  {
    school: "Iowa State",
    city: "Ames, IA",
    athletics: {
      director: "Jamie Pollard",
      phone: "+1-515-294-3662",
      email: "jpollard@iastate.edu"
    },
    compliance: {
      director: "Steve Malchow",
      phone: "+1-515-294-0123",
      email: "smalchow@iastate.edu"
    },
    communications: {
      director: "Mike Green",
      phone: "+1-515-294-4111",
      email: "mgreen@iastate.edu"
    },
    website: "iastate.edu",
    athleticsWebsite: "cyclones.com"
  },
  {
    school: "Kansas",
    city: "Lawrence, KS",
    athletics: {
      director: "Travis Goff",
      phone: "+1-785-864-3143",
      email: "tgoff@ku.edu"
    },
    compliance: {
      director: "Sean Lester",
      phone: "+1-785-864-7749",
      email: "slester@ku.edu"
    },
    communications: {
      director: "Dan Beckler",
      phone: "+1-785-864-2700",
      email: "dbeckler@ku.edu"
    },
    website: "ku.edu",
    athleticsWebsite: "kuathletics.com"
  },
  {
    school: "Kansas State",
    city: "Manhattan, KS",
    athletics: {
      director: "Gene Taylor",
      phone: "+1-785-532-6010",
      email: "gtaylor@k-state.edu"
    },
    compliance: {
      director: "Lamont Evans",
      phone: "+1-785-532-1234",
      email: "levans@k-state.edu"
    },
    communications: {
      director: "Kenny Lannou",
      phone: "+1-785-532-6011",
      email: "klannou@k-state.edu"
    },
    website: "k-state.edu",
    athleticsWebsite: "kstatesports.com"
  },
  {
    school: "Oklahoma State",
    city: "Stillwater, OK",
    athletics: {
      director: "Chad Weiberg",
      phone: "+1-405-744-7740",
      email: "chad.weiberg@okstate.edu"
    },
    compliance: {
      director: "Kevin Klintworth",
      phone: "+1-405-744-7355",
      email: "kevin.klintworth@okstate.edu"
    },
    communications: {
      director: "Kevin Klintworth",
      phone: "+1-405-744-5000",
      email: "kevin.klintworth@okstate.edu"
    },
    website: "okstate.edu",
    athleticsWebsite: "okstate.com"
  },
  {
    school: "TCU",
    city: "Fort Worth, TX",
    athletics: {
      director: "Jeremiah Donati",
      phone: "+1-817-257-5228",
      email: "j.donati@tcu.edu"
    },
    compliance: {
      director: "Annie Scarff",
      phone: "+1-817-257-6565",
      email: "a.scarff@tcu.edu"
    },
    communications: {
      director: "Mark Cohen",
      phone: "+1-817-257-7000",
      email: "m.cohen@tcu.edu"
    },
    website: "tcu.edu",
    athleticsWebsite: "gofrogs.com"
  },
  {
    school: "Texas Tech",
    city: "Lubbock, TX",
    athletics: {
      director: "Kirby Hocutt",
      phone: "+1-806-742-0123",
      email: "kirby.hocutt@ttu.edu"
    },
    compliance: {
      director: "Robert Giovannetti",
      phone: "+1-806-742-1234",
      email: "robert.giovannetti@ttu.edu"
    },
    communications: {
      director: "Chris Cook",
      phone: "+1-806-742-2011",
      email: "chris.cook@ttu.edu"
    },
    website: "ttu.edu",
    athleticsWebsite: "texastech.com"
  },
  {
    school: "UCF",
    city: "Orlando, FL",
    athletics: {
      director: "Terry Mohajir",
      phone: "+1-407-823-2197",
      email: "terry.mohajir@ucf.edu"
    },
    compliance: {
      director: "Angela Suggs",
      phone: "+1-407-823-5445",
      email: "angela.suggs@ucf.edu"
    },
    communications: {
      director: "Jason Behnken",
      phone: "+1-407-823-2000",
      email: "jason.behnken@ucf.edu"
    },
    website: "ucf.edu",
    athleticsWebsite: "ucfknights.com"
  },
  {
    school: "Utah",
    city: "Salt Lake City, UT",
    athletics: {
      director: "Mark Harlan",
      phone: "+1-801-581-3510",
      email: "mark.harlan@utah.edu"
    },
    compliance: {
      director: "Morgan Scalley",
      phone: "+1-801-585-9924",
      email: "morgan.scalley@utah.edu"
    },
    communications: {
      director: "Liz Abel",
      phone: "+1-801-581-7200",
      email: "liz.abel@utah.edu"
    },
    website: "utah.edu",
    athleticsWebsite: "utahutes.com"
  },
  {
    school: "West Virginia",
    city: "Morgantown, WV",
    athletics: {
      director: "Wren Baker",
      phone: "+1-304-293-2821",
      email: "wren.baker@mail.wvu.edu"
    },
    compliance: {
      director: "Keli Cunningham",
      phone: "+1-304-293-5621",
      email: "keli.cunningham@mail.wvu.edu"
    },
    communications: {
      director: "Mike Montoro",
      phone: "+1-304-293-0111",
      email: "mike.montoro@mail.wvu.edu"
    },
    website: "wvu.edu",
    athleticsWebsite: "wvusports.com"
  }
]

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const filteredContacts = big12Contacts.filter(contact => 
    contact.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Big 12 Contacts Directory
          </h1>
          <p className="text-muted-foreground mt-2">
            Key contacts across all 16 Big 12 Conference member institutions
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schools or cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">
          {filteredContacts.length} of {big12Contacts.length} schools
        </Badge>
      </div>

      <Tabs value={selectedDepartment} onValueChange={setSelectedDepartment} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Contacts</TabsTrigger>
          <TabsTrigger value="athletics">Athletics Directors</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {filteredContacts.map((contact, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <TeamLogo team={contact.school} size="lg" />
                    <div className="flex-1">
                      <CardTitle className="text-xl">{contact.school}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {contact.city}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Athletics Director */}
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm text-blue-600 dark:text-blue-400 mb-2">Athletics Director</h4>
                    <p className="font-medium">{contact.athletics.director}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <a href={`tel:${contact.athletics.phone}`} className="flex items-center gap-1 hover:text-primary">
                        <Phone className="h-3 w-3" />
                        {contact.athletics.phone}
                      </a>
                      <a href={`mailto:${contact.athletics.email}`} className="flex items-center gap-1 hover:text-primary">
                        <Mail className="h-3 w-3" />
                        {contact.athletics.email}
                      </a>
                    </div>
                  </div>

                  {/* Compliance */}
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm text-purple-600 dark:text-purple-400 mb-2">Compliance</h4>
                    <p className="font-medium">{contact.compliance.director}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <a href={`tel:${contact.compliance.phone}`} className="flex items-center gap-1 hover:text-primary">
                        <Phone className="h-3 w-3" />
                        {contact.compliance.phone}
                      </a>
                      <a href={`mailto:${contact.compliance.email}`} className="flex items-center gap-1 hover:text-primary">
                        <Mail className="h-3 w-3" />
                        {contact.compliance.email}
                      </a>
                    </div>
                  </div>

                  {/* Communications */}
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm text-green-600 dark:text-green-400 mb-2">Communications</h4>
                    <p className="font-medium">{contact.communications.director}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <a href={`tel:${contact.communications.phone}`} className="flex items-center gap-1 hover:text-primary">
                        <Phone className="h-3 w-3" />
                        {contact.communications.phone}
                      </a>
                      <a href={`mailto:${contact.communications.email}`} className="flex items-center gap-1 hover:text-primary">
                        <Mail className="h-3 w-3" />
                        {contact.communications.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={`https://${contact.website}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        University
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={`https://${contact.athleticsWebsite}`} target="_blank" rel="noopener noreferrer">
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

        <TabsContent value="athletics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Athletics Directors</CardTitle>
              <CardDescription>Key athletics leadership across the Big 12</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <TeamLogo team={contact.school} size="md" />
                      <div>
                        <p className="font-semibold">{contact.athletics.director}</p>
                        <p className="text-sm text-muted-foreground">{contact.school}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`tel:${contact.athletics.phone}`}>
                          <Phone className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`mailto:${contact.athletics.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Directors</CardTitle>
              <CardDescription>Compliance and governance contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <TeamLogo team={contact.school} size="md" />
                      <div>
                        <p className="font-semibold">{contact.compliance.director}</p>
                        <p className="text-sm text-muted-foreground">{contact.school}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`tel:${contact.compliance.phone}`}>
                          <Phone className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`mailto:${contact.compliance.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communications Directors</CardTitle>
              <CardDescription>Media and communications contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <TeamLogo team={contact.school} size="md" />
                      <div>
                        <p className="font-semibold">{contact.communications.director}</p>
                        <p className="text-sm text-muted-foreground">{contact.school}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`tel:${contact.communications.phone}`}>
                          <Phone className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`mailto:${contact.communications.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}