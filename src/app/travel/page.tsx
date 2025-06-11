'use client';

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
  Icon
} from '@once-ui-system/core'
import { 
  Plane, 
  MapPin, 
  Calendar,
  Trophy,
  Clock,
  Users,
  Building2,
  Target,
  Zap
} from "lucide-react"
import { FlightSearch } from "@/components/business/FlightSearch"

// Upcoming Big 12 Events requiring travel
const upcomingEvents = [
  {
    id: 1,
    name: "College World Series",
    location: "Omaha, NE",
    airport: "OMA",
    date: "June 13-16, 2025",
    sport: "Baseball",
    participants: ["Arizona", "Texas Tech", "Oklahoma State"],
    urgency: "high",
    description: "Arizona plays Friday at 1:00 PM CT"
  },
  {
    id: 2,
    name: "Big 12 Football Championship",
    location: "Arlington, TX",
    airport: "DFW",
    date: "December 7, 2024",
    sport: "Football",
    participants: ["Conference Champions"],
    urgency: "medium",
    description: "AT&T Stadium - Championship Game"
  },
  {
    id: 3,
    name: "Big 12 Basketball Tournament",
    location: "Kansas City, MO",
    airport: "MCI",
    date: "March 12-15, 2025",
    sport: "Basketball",
    participants: ["All 16 Teams"],
    urgency: "low",
    description: "T-Mobile Center - Conference Tournament"
  }
];

// Big 12 Travel Statistics
const travelStats = {
  totalTrips: 147,
  activeBookings: 23,
  upcomingEvents: 8,
  totalSpent: 89750,
  averageCost: 612
};

export default function TravelPage() {
  return (
    <Background background="page" fillWidth>
      <Column padding="l" gap="l" fillWidth>
        {/* Header */}
        <Row style={{ alignItems: "center" }} justifyContent="between" fillWidth>
          <Column gap="xs">
            <Row style={{ alignItems: "center" }} gap="s">
              <Icon name="plane" size="l" color="blue-600" />
              <Heading as="h1" size="xl">Big 12 Travel Coordination</Heading>
            </Row>
            <Text size="l" color="neutral-500">
              Flight search and travel management for conference events and championships
            </Text>
          </Column>
          <Row gap="s">
            <Button variant="secondary" size="s">
              <Icon name="calendar" size="s" />
              Travel Calendar
            </Button>
            <Button variant="primary" size="s">
              <Icon name="users" size="s" />
              Group Booking
            </Button>
          </Row>
        </Row>

        {/* Travel Statistics */}
        <Grid columns={5} gap="m" fillWidth>
          <Card padding="m">
            <Row style={{ alignItems: "center" }} justifyContent="between" marginBottom="s">
              <Text size="s" weight="medium">Total Trips</Text>
              <Icon name="plane" size="s" color="neutral-500" />
            </Row>
            <Column gap="xs">
              <Text size="xl" weight="bold">{travelStats.totalTrips}</Text>
              <Text size="xs" color="neutral-500">This season</Text>
            </Column>
          </Card>

          <Card padding="m">
            <Row style={{ alignItems: "center" }} justifyContent="between" marginBottom="s">
              <Text size="s" weight="medium">Active Bookings</Text>
              <Icon name="calendar" size="s" color="blue-600" />
            </Row>
            <Column gap="xs">
              <Text size="xl" weight="bold" color="blue-600">{travelStats.activeBookings}</Text>
              <Text size="xs" color="neutral-500">Confirmed flights</Text>
            </Column>
          </Card>

          <Card padding="m">
            <Row style={{ alignItems: "center" }} justifyContent="between" marginBottom="s">
              <Text size="s" weight="medium">Upcoming Events</Text>
              <Icon name="trophy" size="s" color="yellow-600" />
            </Row>
            <Column gap="xs">
              <Text size="xl" weight="bold" color="yellow-600">{travelStats.upcomingEvents}</Text>
              <Text size="xs" color="neutral-500">Requiring travel</Text>
            </Column>
          </Card>

          <Card padding="m">
            <Row style={{ alignItems: "center" }} justifyContent="between" marginBottom="s">
              <Text size="s" weight="medium">Travel Budget</Text>
              <Icon name="target" size="s" color="green-600" />
            </Row>
            <Column gap="xs">
              <Text size="xl" weight="bold">${travelStats.totalSpent.toLocaleString()}</Text>
              <Text size="xs" color="neutral-500">YTD spending</Text>
            </Column>
          </Card>

          <Card padding="m">
            <Row style={{ alignItems: "center" }} justifyContent="between" marginBottom="s">
              <Text size="s" weight="medium">Avg Cost</Text>
              <Icon name="zap" size="s" color="neutral-500" />
            </Row>
            <Column gap="xs">
              <Text size="xl" weight="bold">${travelStats.averageCost}</Text>
              <Text size="xs" color="neutral-500">Per trip</Text>
            </Column>
          </Card>
        </Grid>

        {/* Main Content Tabs - Simplified for Once UI */}
        <Column gap="l" fillWidth>
          <Row gap="s">
            <Button variant="primary" size="s">Flight Search</Button>
            <Button variant="secondary" size="s">Upcoming Events</Button>
            <Button variant="secondary" size="s">Group Travel</Button>
          </Row>

          {/* Flight Search Content */}
          <FlightSearch 
            defaultOrigin="DFW"
            defaultDestination="OMA"
            quickScenario="college_world_series"
          />

          {/* Upcoming Events */}
          <Card padding="m">
            <Column gap="m">
              <Row style={{ alignItems: "center" }} gap="s">
                <Icon name="trophy" size="m" color="yellow-600" />
                <Heading as="h3" size="m">Upcoming Big 12 Events</Heading>
              </Row>
              <Text size="s" color="neutral-600">
                Conference championships and tournaments requiring travel coordination
              </Text>
              
              <Column gap="m">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} padding="m" border="neutral-medium">
                    <Column gap="m">
                      <Row style={{ alignItems: "center" }} justifyContent="between">
                        <Column gap="xs">
                          <Heading as="h4" size="m">{event.name}</Heading>
                          <Text size="s" color="neutral-600">{event.description}</Text>
                        </Column>
                        <Row gap="s">
                          <Badge variant={event.urgency === 'high' ? 'brand' : event.urgency === 'medium' ? 'neutral' : 'neutral'}>
                            {event.urgency} priority
                          </Badge>
                          <Badge variant="neutral">{event.sport}</Badge>
                        </Row>
                      </Row>

                      <Grid columns={3} gap="m">
                        <Row style={{ alignItems: "center" }} gap="s">
                          <Icon name="mapPin" size="s" color="neutral-500" />
                          <Column gap="xs">
                            <Text size="s" weight="medium">{event.location}</Text>
                            <Text size="xs" color="neutral-500">Airport: {event.airport}</Text>
                          </Column>
                        </Row>
                        <Row style={{ alignItems: "center" }} gap="s">
                          <Icon name="calendar" size="s" color="neutral-500" />
                          <Column gap="xs">
                            <Text size="s" weight="medium">{event.date}</Text>
                            <Text size="xs" color="neutral-500">Championship dates</Text>
                          </Column>
                        </Row>
                        <Row style={{ alignItems: "center" }} gap="s">
                          <Icon name="users" size="s" color="neutral-500" />
                          <Column gap="xs">
                            <Text size="s" weight="medium">{event.participants.length} Team{event.participants.length > 1 ? 's' : ''}</Text>
                            <Text size="xs" color="neutral-500">{event.participants.join(', ')}</Text>
                          </Column>
                        </Row>
                      </Grid>

                      <Row gap="s">
                        <Button size="s" variant="primary">
                          <Icon name="plane" size="s" />
                          Search Flights
                        </Button>
                        <Button variant="secondary" size="s">
                          <Icon name="building2" size="s" />
                          Book Hotels
                        </Button>
                        <Button variant="secondary" size="s">
                          <Icon name="users" size="s" />
                          Group Options
                        </Button>
                      </Row>
                    </Column>
                  </Card>
                ))}
              </Column>
            </Column>
          </Card>

          {/* Group Travel */}
          <Grid columns={2} gap="m" fillWidth>
            <Card padding="m">
              <Column gap="m">
                <Row style={{ alignItems: "center" }} gap="s">
                  <Icon name="users" size="m" color="blue-600" />
                  <Heading as="h3" size="m">Team Travel Coordination</Heading>
                </Row>
                <Text size="s" color="neutral-600">
                  Manage group bookings and team travel logistics
                </Text>
                
                <Column gap="s">
                  <div style={{ border: '1px solid var(--neutral-border)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                    <Row style={{ alignItems: "center" }} justifyContent="between">
                      <Column gap="xs">
                        <Text weight="medium">Arizona Baseball Team</Text>
                        <Text size="s" color="neutral-600">25 travelers • College World Series</Text>
                      </Column>
                      <Badge variant="brand" onBackground="success-strong">Confirmed</Badge>
                    </Row>
                  </div>
                  
                  <div style={{ border: '1px solid var(--neutral-border)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                    <Row style={{ alignItems: "center" }} justifyContent="between">
                      <Column gap="xs">
                        <Text weight="medium">Conference Staff</Text>
                        <Text size="s" color="neutral-600">8 travelers • Various events</Text>
                      </Column>
                      <Badge variant="accent">Pending</Badge>
                    </Row>
                  </div>
                  
                  <div style={{ border: '1px solid var(--neutral-border)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                    <Row style={{ alignItems: "center" }} justifyContent="between">
                      <Column gap="xs">
                        <Text weight="medium">Media Group</Text>
                        <Text size="s" color="neutral-600">12 travelers • Championship coverage</Text>
                      </Column>
                      <Badge variant="neutral">Planning</Badge>
                    </Row>
                  </div>
                </Column>

                <Button size="m" variant="primary" fillWidth>
                  <Icon name="users" size="s" />
                  Create New Group Booking
                </Button>
              </Column>
            </Card>

            <Card padding="m">
              <Column gap="m">
                <Row style={{ alignItems: "center" }} gap="s">
                  <Icon name="clock" size="m" color="orange-600" />
                  <Heading as="h3" size="m">Travel Alerts & Updates</Heading>
                </Row>
                <Text size="s" color="neutral-600">
                  Flight status and travel notifications
                </Text>
                
                <Column gap="s">
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: '0.5rem' }}>
                    <Row alignItems="flex-start" gap="s" marginBottom="xs">
                      <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#f59e0b', marginTop: '0.5rem' }} />
                      <Column gap="xs">
                        <Text size="s" weight="medium">Flight AA1234 Delayed</Text>
                        <Text size="xs" color="neutral-500">DFW → OMA • 45 minute delay due to weather</Text>
                      </Column>
                    </Row>
                  </div>
                  
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '0.5rem' }}>
                    <Row alignItems="flex-start" gap="s" marginBottom="xs">
                      <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#3b82f6', marginTop: '0.5rem' }} />
                      <Column gap="xs">
                        <Text size="s" weight="medium">Gate Change Alert</Text>
                        <Text size="xs" color="neutral-500">UA5678 moved to Gate B12 • Terminal change</Text>
                      </Column>
                    </Row>
                  </div>
                  
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '0.5rem' }}>
                    <Row alignItems="flex-start" gap="s" marginBottom="xs">
                      <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#22c55e', marginTop: '0.5rem' }} />
                      <Column gap="xs">
                        <Text size="s" weight="medium">Check-in Available</Text>
                        <Text size="xs" color="neutral-500">Southwest WN9012 • Check-in opens in 2 hours</Text>
                      </Column>
                    </Row>
                  </div>
                </Column>

                <Button variant="secondary" size="m" fillWidth>
                  <Icon name="calendar" size="s" />
                  View All Notifications
                </Button>
              </Column>
            </Card>
          </Grid>
        </Column>
      </Column>
    </Background>
  );
}