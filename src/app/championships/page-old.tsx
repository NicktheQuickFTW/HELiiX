'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { 
  Column, Row, Grid, Card, Button, Heading, Text, Badge, 
  Background, Icon, Tabs, StatusIndicator, ToggleButton
} from '@once-ui-system/core'
import { 
  Trophy,
  Plus,
  Calendar,
  MapPin,
  Users,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface ChampionshipEvent {
  id: string
  name: string
  sport: string
  start_date: string
  end_date: string
  venue_name: string
  city: string
  state: string
  capacity: number
  description: string
  status: string
  credential_deadline: string
}

interface CredentialRequest {
  id: string
  championship_event_id: string
  first_name: string
  last_name: string
  credential_type: string
  status: string
  submitted_at: string
  championship_events: ChampionshipEvent
  organizations: { name: string }
}

export default function ChampionshipsPage() {
  const { user, hasPermission } = useAuth()
  const [events, setEvents] = useState<ChampionshipEvent[]>([])
  const [myRequests, setMyRequests] = useState<CredentialRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('events')
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeRequests: 0,
    approvedCredentials: 0,
    pendingReview: 0
  })

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      // Fetch championship events
      const { data: eventsData, error: eventsError } = await supabase
        .from('championship_events')
        .select('*')
        .order('start_date', { ascending: true })

      if (eventsError) throw eventsError

      // Fetch my credential requests if user is logged in
      let requestsData = []
      if (user) {
        const { data, error } = await supabase
          .from('credential_requests')
          .select(`
            *,
            championship_events(name, sport, start_date, venue_name),
            organizations(name)
          `)
          .eq('requester_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        requestsData = data || []
      }

      setEvents(eventsData || [])
      setMyRequests(requestsData)

      // Calculate stats
      const activeRequests = requestsData.filter(r => 
        ['submitted', 'under_review'].includes(r.status)
      ).length
      
      const approvedCredentials = requestsData.filter(r => 
        ['approved', 'issued', 'active'].includes(r.status)
      ).length
      
      const pendingReview = requestsData.filter(r => 
        r.status === 'under_review'
      ).length

      setStats({
        totalEvents: eventsData?.length || 0,
        activeRequests,
        approvedCredentials,
        pendingReview
      })

    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load championship data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { color: 'neutral', text: 'DRAFT' },
      'submitted': { color: 'brand', text: 'SUBMITTED' },
      'under_review': { color: 'warning', text: 'UNDER REVIEW' },
      'approved': { color: 'success', text: 'APPROVED' },
      'denied': { color: 'danger', text: 'DENIED' },
      'issued': { color: 'success', text: 'ISSUED' },
      'active': { color: 'success', text: 'ACTIVE' },
      'revoked': { color: 'danger', text: 'REVOKED' },
      'expired': { color: 'neutral', text: 'EXPIRED' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'neutral', text: status.toUpperCase() }
    
    return (
      <Badge variant={config.color}>
        {config.text}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatSport = (sport: string) => {
    return sport.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const isCredentialDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date()
  }

  const tabOptions = [
    { value: 'events', label: 'Championship Events' },
    ...(user ? [{ value: 'my-requests', label: 'My Requests' }] : []),
    ...(hasPermission('championships', 'read') ? [{ value: 'management', label: 'Management' }] : [])
  ]

  if (loading) {
    return (
      <Background fillWidth background="page">
        <Column fillWidth maxWidth="l" gap="l" padding="l">
          <Row alignItems="center" justifyContent="center" minHeight="50vh">
            <Column alignItems="center" gap="m">
              <StatusIndicator loading size="l" />
              <Text variant="body-default-s" color="neutral-weak">
                Loading championships...
              </Text>
            </Column>
          </Row>
        </Column>
      </Background>
    )
  }

  return (
    <Background fillWidth background="page">
      <Column fillWidth maxWidth="l" gap="l" padding="l">
        {/* Header */}
        <Row alignItems="center" justifyContent="space-between" fillWidth>
          <Column>
            <Row alignItems="center" gap="s">
              <Icon size="l" onBackground="neutral-strong">
                <Trophy />
              </Icon>
              <Heading as="h1" variant="display-strong-l">
                Championship Credentials
              </Heading>
            </Row>
            <Text variant="body-default-m" color="neutral-weak" marginTop="xs">
              Manage credentials for Big 12 Championship events
            </Text>
          </Column>
          {hasPermission('championships', 'write') && (
            <Button size="m" href="/championships/events/new">
              <Icon size="xs">
                <Plus />
              </Icon>
              New Event
            </Button>
          )}
        </Row>

        {/* Stats Overview */}
        {user && (
          <Grid columns="4" tabletColumns="2" mobileColumns="1" gap="m">
            <Card>
              <Column gap="xs" padding="m">
                <Text variant="label-default-s" color="neutral-weak">
                  Total Events
                </Text>
                <Heading variant="display-strong-xl">
                  {stats.totalEvents}
                </Heading>
                <Text variant="body-default-xs" color="neutral-weak">
                  Championship events
                </Text>
              </Column>
            </Card>
            
            <Card>
              <Column gap="xs" padding="m">
                <Text variant="label-default-s" color="neutral-weak">
                  Active Requests
                </Text>
                <Heading variant="display-strong-xl">
                  {stats.activeRequests}
                </Heading>
                <Text variant="body-default-xs" color="neutral-weak">
                  Pending approval
                </Text>
              </Column>
            </Card>
            
            <Card>
              <Column gap="xs" padding="m">
                <Text variant="label-default-s" color="neutral-weak">
                  Approved Credentials
                </Text>
                <Heading variant="display-strong-xl">
                  {stats.approvedCredentials}
                </Heading>
                <Text variant="body-default-xs" color="neutral-weak">
                  Ready to use
                </Text>
              </Column>
            </Card>
            
            <Card>
              <Column gap="xs" padding="m">
                <Text variant="label-default-s" color="neutral-weak">
                  Under Review
                </Text>
                <Heading variant="display-strong-xl">
                  {stats.pendingReview}
                </Heading>
                <Text variant="body-default-xs" color="neutral-weak">
                  Being processed
                </Text>
              </Column>
            </Card>
          </Grid>
        )}

        {/* Tab Navigation */}
        <Column gap="l">
          <Row gap="xs">
            {tabOptions.map((tab) => (
              <ToggleButton
                key={tab.value}
                selected={activeTab === tab.value}
                onClick={() => setActiveTab(tab.value)}
                size="m"
              >
                {tab.label}
              </ToggleButton>
            ))}
          </Row>

          {/* Championship Events Tab */}
          {activeTab === 'events' && (
            <Column gap="m">
              {events.map((event) => (
                <Card key={event.id} style={{ cursor: "pointer" }}>
                  <Column gap="m" padding="l">
                    <Row alignItems="flex-start" justifyContent="space-between">
                      <Column>
                        <Heading variant="heading-strong-l">
                          {event.name}
                        </Heading>
                        <Text variant="body-default-m" color="neutral-weak" marginTop="xs">
                          {formatSport(event.sport)} • {event.venue_name}
                        </Text>
                      </Column>
                      <Badge variant={event.status === 'upcoming' ? 'brand' : 'neutral'}>
                        {event.status.toUpperCase()}
                      </Badge>
                    </Row>
                    
                    <Grid columns="4" tabletColumns="2" mobileColumns="1" gap="m">
                      <Row alignItems="center" gap="s">
                        <Icon size="s" onBackground="neutral-weak">
                          <Calendar />
                        </Icon>
                        <Column>
                          <Text variant="body-default-s" weight="medium">
                            {formatDate(event.start_date)}
                          </Text>
                          {event.start_date !== event.end_date && (
                            <Text variant="body-default-xs" color="neutral-weak">
                              to {formatDate(event.end_date)}
                            </Text>
                          )}
                        </Column>
                      </Row>
                      
                      <Row alignItems="center" gap="s">
                        <Icon size="s" onBackground="neutral-weak">
                          <MapPin />
                        </Icon>
                        <Column>
                          <Text variant="body-default-s" weight="medium">
                            {event.city}, {event.state}
                          </Text>
                          <Text variant="body-default-xs" color="neutral-weak">
                            {event.venue_name}
                          </Text>
                        </Column>
                      </Row>
                      
                      <Row alignItems="center" gap="s">
                        <Icon size="s" onBackground="neutral-weak">
                          <Users />
                        </Icon>
                        <Column>
                          <Text variant="body-default-s" weight="medium">
                            {event.capacity?.toLocaleString()} capacity
                          </Text>
                          <Text variant="body-default-xs" color="neutral-weak">
                            Venue size
                          </Text>
                        </Column>
                      </Row>
                      
                      <Row alignItems="center" gap="s">
                        <Icon size="s" onBackground="neutral-weak">
                          <Clock />
                        </Icon>
                        <Column>
                          <Text variant="body-default-s" weight="medium">
                            {event.credential_deadline ? formatDate(event.credential_deadline) : 'TBD'}
                          </Text>
                          <Text 
                            variant="body-default-xs" 
                            color={
                              event.credential_deadline && isCredentialDeadlinePassed(event.credential_deadline) 
                                ? 'danger' 
                                : 'neutral-weak'
                            }
                          >
                            Credential deadline
                          </Text>
                        </Column>
                      </Row>
                    </Grid>
                    
                    {event.description && (
                      <Text variant="body-default-s" color="neutral-weak">
                        {event.description}
                      </Text>
                    )}
                    
                    <Row gap="s" wrap>
                      <Button variant="secondary" size="s" href={`/championships/events/${event.id}`}>
                        <Icon size="xs">
                          <Eye />
                        </Icon>
                        View Details
                      </Button>
                      
                      {user && event.status === 'upcoming' && (
                        <Button size="s" href={`/championships/request/${event.id}`}>
                          <Icon size="xs">
                            <FileText />
                          </Icon>
                          Request Credential
                        </Button>
                      )}
                      
                      {hasPermission('championships', 'write') && (
                        <Button variant="secondary" size="s" href={`/championships/events/${event.id}/manage`}>
                          <Icon size="xs">
                            <Settings />
                          </Icon>
                          Manage
                        </Button>
                      )}
                    </Row>
                  </Column>
                </Card>
              ))}
              
              {events.length === 0 && (
                <Card>
                  <Column alignItems="center" gap="m" padding="xl">
                    <Icon size="xl" onBackground="neutral-weak">
                      <Trophy />
                    </Icon>
                    <Heading variant="heading-strong-l">
                      No Championship Events
                    </Heading>
                    <Text variant="body-default-m" color="neutral-weak" align="center">
                      No championship events are currently scheduled.
                    </Text>
                    {hasPermission('championships', 'write') && (
                      <Button href="/championships/events/new">
                        <Icon size="xs">
                          <Plus />
                        </Icon>
                        Create First Event
                      </Button>
                    )}
                  </Column>
                </Card>
              )}
            </Column>
          )}

          {/* My Requests Tab */}
          {user && activeTab === 'my-requests' && (
            <Column gap="m">
              {myRequests.map((request) => (
                <Card key={request.id}>
                  <Column gap="m" padding="l">
                    <Row alignItems="flex-start" justifyContent="space-between">
                      <Column>
                        <Heading variant="heading-strong-l">
                          {request.championship_events.name}
                        </Heading>
                        <Text variant="body-default-m" color="neutral-weak" marginTop="xs">
                          {formatSport(request.championship_events.sport)} • {request.credential_type.replace('_', ' ')}
                        </Text>
                      </Column>
                      {getStatusBadge(request.status)}
                    </Row>
                    
                    <Grid columns="3" tabletColumns="2" mobileColumns="1" gap="m">
                      <Column>
                        <Text variant="body-default-s" weight="medium">
                          Applicant
                        </Text>
                        <Text variant="body-default-s" color="neutral-weak">
                          {request.first_name} {request.last_name}
                        </Text>
                      </Column>
                      
                      <Column>
                        <Text variant="body-default-s" weight="medium">
                          Organization
                        </Text>
                        <Text variant="body-default-s" color="neutral-weak">
                          {request.organizations?.name || 'Individual'}
                        </Text>
                      </Column>
                      
                      <Column>
                        <Text variant="body-default-s" weight="medium">
                          Submitted
                        </Text>
                        <Text variant="body-default-s" color="neutral-weak">
                          {request.submitted_at ? formatDate(request.submitted_at) : 'Draft'}
                        </Text>
                      </Column>
                    </Grid>
                    
                    <Row gap="s" wrap>
                      <Button variant="secondary" size="s" href={`/championships/requests/${request.id}`}>
                        <Icon size="xs">
                          <Eye />
                        </Icon>
                        View Request
                      </Button>
                      
                      {request.status === 'draft' && (
                        <Button size="s" href={`/championships/requests/${request.id}/edit`}>
                          <Icon size="xs">
                            <FileText />
                          </Icon>
                          Continue Editing
                        </Button>
                      )}
                      
                      {['approved', 'issued', 'active'].includes(request.status) && (
                        <Button size="s" href={`/championships/credentials/${request.id}`}>
                          <Icon size="xs">
                            <CheckCircle />
                          </Icon>
                          View Credential
                        </Button>
                      )}
                    </Row>
                  </Column>
                </Card>
              ))}
              
              {myRequests.length === 0 && (
                <Card>
                  <Column alignItems="center" gap="m" padding="xl">
                    <Icon size="xl" onBackground="neutral-weak">
                      <FileText />
                    </Icon>
                    <Heading variant="heading-strong-l">
                      No Credential Requests
                    </Heading>
                    <Text variant="body-default-m" color="neutral-weak" align="center">
                      You haven't submitted any credential requests yet.
                    </Text>
                    <Button href="/championships">
                      <Icon size="xs">
                        <Plus />
                      </Icon>
                      Request First Credential
                    </Button>
                  </Column>
                </Card>
              )}
            </Column>
          )}

          {/* Management Tab */}
          {hasPermission('championships', 'read') && activeTab === 'management' && (
            <Grid columns="3" tabletColumns="2" mobileColumns="1" gap="m">
              <Card>
                <Column gap="m" padding="l">
                  <Column>
                    <Heading variant="heading-strong-l">
                      Pending Reviews
                    </Heading>
                    <Text variant="body-default-m" color="neutral-weak" marginTop="xs">
                      Credential requests awaiting approval
                    </Text>
                  </Column>
                  <Heading variant="display-strong-xl">
                    {stats.pendingReview}
                  </Heading>
                  <Button fillWidth href="/championships/admin/reviews">
                    Review Requests
                  </Button>
                </Column>
              </Card>
              
              <Card>
                <Column gap="m" padding="l">
                  <Column>
                    <Heading variant="heading-strong-l">
                      Event Management
                    </Heading>
                    <Text variant="body-default-m" color="neutral-weak" marginTop="xs">
                      Manage championship events and settings
                    </Text>
                  </Column>
                  <Heading variant="display-strong-xl">
                    {stats.totalEvents}
                  </Heading>
                  <Button fillWidth href="/championships/admin/events">
                    Manage Events
                  </Button>
                </Column>
              </Card>
              
              <Card>
                <Column gap="m" padding="l">
                  <Column>
                    <Heading variant="heading-strong-l">
                      Credential Analytics
                    </Heading>
                    <Text variant="body-default-m" color="neutral-weak" marginTop="xs">
                      View reports and analytics
                    </Text>
                  </Column>
                  <Heading variant="display-strong-xl">
                    {stats.approvedCredentials}
                  </Heading>
                  <Button fillWidth href="/championships/admin/analytics">
                    View Analytics
                  </Button>
                </Column>
              </Card>
            </Grid>
          )}
        </Column>
      </Column>
    </Background>
  )
}