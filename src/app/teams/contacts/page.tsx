'use client'

export const dynamic = 'force-dynamic'

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
    <Background background="page" fillWidth>
      <Column fillWidth padding="m" gap="m">
        <Row fillWidth justifyContent="space-between" alignItems="flex-start">
          <Column>
            <Heading as="h1" variant="display-strong-s">
              <Icon name="team" size="m" /> Big 12 Contacts Directory
            </Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Key contacts across all 16 Big 12 Conference member institutions
            </Text>
          </Column>
        </Row>

        <Row fillWidth gap="s" alignItems="center">
          <Column flex={1} maxWidth="400px">
            <Text as="label" variant="body-default-s" htmlFor="search-contacts" onBackground="neutral-weak">
              Search contacts
            </Text>
            <input
              id="search-contacts"
              type="text"
              placeholder="Search schools or cities..."
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
            {filteredContacts.length} of {big12Contacts.length} schools
          </Badge>
        </Row>

        <Column fillWidth gap="s">
          <Row gap="s">
            <ToggleButton 
              selected={selectedDepartment === 'all'} 
              onClick={() => setSelectedDepartment('all')}
            >
              All Contacts
            </ToggleButton>
            <ToggleButton 
              selected={selectedDepartment === 'athletics'} 
              onClick={() => setSelectedDepartment('athletics')}
            >
              Athletics Directors
            </ToggleButton>
            <ToggleButton 
              selected={selectedDepartment === 'compliance'} 
              onClick={() => setSelectedDepartment('compliance')}
            >
              Compliance
            </ToggleButton>
            <ToggleButton 
              selected={selectedDepartment === 'communications'} 
              onClick={() => setSelectedDepartment('communications')}
            >
              Communications
            </ToggleButton>
          </Row>

          {selectedDepartment === 'all' && (
            <Grid columns="1" desktopColumns="2" gap="m">
              {filteredContacts.map((contact, index) => (
                <Card key={index} padding="m" border="neutral-medium" style={{ transition: 'all 0.2s ease' }}>
                  <Column fillWidth gap="s">
                    <Row alignItems="center" gap="s">
                      <Column flex={1}>
                        <Heading as="h3" variant="heading-strong-s">{contact.school}</Heading>
                        <Row gap="xs" alignItems="center">
                          <Icon name="location" size="xs" />
                          <Text variant="body-default-s" onBackground="neutral-weak">
                            {contact.city}
                          </Text>
                        </Row>
                      </Column>
                    </Row>

                    {/* Athletics Director */}
                    <Card padding="s" border="blue-medium" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
                      <Column gap="xs">
                        <Text variant="body-default-s" weight="medium" style={{ color: 'rgb(59, 130, 246)' }}>
                          Athletics Director
                        </Text>
                        <Text variant="body-default-s" weight="medium">{contact.athletics.director}</Text>
                        <Row gap="m" wrap>
                          <Button 
                            href={`tel:${contact.athletics.phone}`} 
                            variant="ghost" 
                            size="s"
                          >
                            <Icon name="phone" size="xs" />
                            <Text variant="body-default-s" onBackground="neutral-weak">
                              {contact.athletics.phone}
                            </Text>
                          </Button>
                          <Button 
                            href={`mailto:${contact.athletics.email}`} 
                            variant="ghost" 
                            size="s"
                          >
                            <Icon name="mail" size="xs" />
                            <Text variant="body-default-s" onBackground="neutral-weak">
                              {contact.athletics.email}
                            </Text>
                          </Button>
                        </Row>
                      </Column>
                    </Card>

                    {/* Compliance */}
                    <Card padding="s" border="purple-medium" style={{ backgroundColor: 'rgba(139, 69, 193, 0.05)' }}>
                      <Column gap="xs">
                        <Text variant="body-default-s" weight="medium" style={{ color: 'rgb(139, 69, 193)' }}>
                          Compliance
                        </Text>
                        <Text variant="body-default-s" weight="medium">{contact.compliance.director}</Text>
                        <Row gap="m" wrap>
                          <Button 
                            href={`tel:${contact.compliance.phone}`} 
                            variant="ghost" 
                            size="s"
                          >
                            <Icon name="phone" size="xs" />
                            <Text variant="body-default-s" onBackground="neutral-weak">
                              {contact.compliance.phone}
                            </Text>
                          </Button>
                          <Button 
                            href={`mailto:${contact.compliance.email}`} 
                            variant="ghost" 
                            size="s"
                          >
                            <Icon name="mail" size="xs" />
                            <Text variant="body-default-s" onBackground="neutral-weak">
                              {contact.compliance.email}
                            </Text>
                          </Button>
                        </Row>
                      </Column>
                    </Card>

                    {/* Communications */}
                    <Card padding="s" border="green-medium" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}>
                      <Column gap="xs">
                        <Text variant="body-default-s" weight="medium" style={{ color: 'rgb(34, 197, 94)' }}>
                          Communications
                        </Text>
                        <Text variant="body-default-s" weight="medium">{contact.communications.director}</Text>
                        <Row gap="m" wrap>
                          <Button 
                            href={`tel:${contact.communications.phone}`} 
                            variant="ghost" 
                            size="s"
                          >
                            <Icon name="phone" size="xs" />
                            <Text variant="body-default-s" onBackground="neutral-weak">
                              {contact.communications.phone}
                            </Text>
                          </Button>
                          <Button 
                            href={`mailto:${contact.communications.email}`} 
                            variant="ghost" 
                            size="s"
                          >
                            <Icon name="mail" size="xs" />
                            <Text variant="body-default-s" onBackground="neutral-weak">
                              {contact.communications.email}
                            </Text>
                          </Button>
                        </Row>
                      </Column>
                    </Card>
                    
                    <Row gap="xs">
                      <Button 
                        href={`https://${contact.website}`} 
                        variant="secondary" 
                        size="s" 
                        target="_blank"
                        fillWidth
                      >
                        <Icon name="external" size="xs" /> University
                      </Button>
                      <Button 
                        href={`https://${contact.athleticsWebsite}`} 
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

          {selectedDepartment === 'athletics' && (
            <Card padding="m" border="neutral-medium">
              <Column gap="s">
                <Heading as="h3" variant="heading-strong-s">Athletics Directors</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Key athletics leadership across the Big 12
                </Text>
                
                <Column gap="s">
                  {filteredContacts.map((contact, index) => (
                    <Row key={index} justifyContent="space-between" alignItems="center" padding="m" style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                      <Column>
                        <Text variant="body-default-s" weight="medium">{contact.athletics.director}</Text>
                        <Text variant="body-default-s" onBackground="neutral-weak">{contact.school}</Text>
                      </Column>
                      <Row gap="xs">
                        <Button variant="ghost" size="s" href={`tel:${contact.athletics.phone}`}>
                          <Icon name="phone" size="xs" />
                        </Button>
                        <Button variant="ghost" size="s" href={`mailto:${contact.athletics.email}`}>
                          <Icon name="mail" size="xs" />
                        </Button>
                      </Row>
                    </Row>
                  ))}
                </Column>
              </Column>
            </Card>
          )}

          {selectedDepartment === 'compliance' && (
            <Card padding="m" border="neutral-medium">
              <Column gap="s">
                <Heading as="h3" variant="heading-strong-s">Compliance Directors</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Compliance and governance contacts
                </Text>
                
                <Column gap="s">
                  {filteredContacts.map((contact, index) => (
                    <Row key={index} justifyContent="space-between" alignItems="center" padding="m" style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                      <Column>
                        <Text variant="body-default-s" weight="medium">{contact.compliance.director}</Text>
                        <Text variant="body-default-s" onBackground="neutral-weak">{contact.school}</Text>
                      </Column>
                      <Row gap="xs">
                        <Button variant="ghost" size="s" href={`tel:${contact.compliance.phone}`}>
                          <Icon name="phone" size="xs" />
                        </Button>
                        <Button variant="ghost" size="s" href={`mailto:${contact.compliance.email}`}>
                          <Icon name="mail" size="xs" />
                        </Button>
                      </Row>
                    </Row>
                  ))}
                </Column>
              </Column>
            </Card>
          )}

          {selectedDepartment === 'communications' && (
            <Card padding="m" border="neutral-medium">
              <Column gap="s">
                <Heading as="h3" variant="heading-strong-s">Communications Directors</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Media and communications contacts
                </Text>
                
                <Column gap="s">
                  {filteredContacts.map((contact, index) => (
                    <Row key={index} justifyContent="space-between" alignItems="center" padding="m" style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                      <Column>
                        <Text variant="body-default-s" weight="medium">{contact.communications.director}</Text>
                        <Text variant="body-default-s" onBackground="neutral-weak">{contact.school}</Text>
                      </Column>
                      <Row gap="xs">
                        <Button variant="ghost" size="s" href={`tel:${contact.communications.phone}`}>
                          <Icon name="phone" size="xs" />
                        </Button>
                        <Button variant="ghost" size="s" href={`mailto:${contact.communications.email}`}>
                          <Icon name="mail" size="xs" />
                        </Button>
                      </Row>
                    </Row>
                  ))}
                </Column>
              </Column>
            </Card>
          )}
        </Column>
      </Column>
    </Background>
  )
}