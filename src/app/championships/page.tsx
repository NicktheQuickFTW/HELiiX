'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
    const variants = {
      'draft': 'secondary',
      'submitted': 'default',
      'under_review': 'default',
      'approved': 'default',
      'denied': 'destructive',
      'issued': 'default',
      'active': 'default',
      'revoked': 'destructive',
      'expired': 'secondary'
    } as const

    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'submitted': 'bg-blue-100 text-blue-800',
      'under_review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'denied': 'bg-red-100 text-red-800',
      'issued': 'bg-green-100 text-green-800',
      'active': 'bg-green-100 text-green-800',
      'revoked': 'bg-red-100 text-red-800',
      'expired': 'bg-gray-100 text-gray-800'
    }

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.replace('_', ' ').toUpperCase()}
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

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading championships...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-orbitron flex items-center gap-2">
            <Trophy className="h-8 w-8" />
            Championship Credentials
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage credentials for Big 12 Championship events
          </p>
        </div>
        {hasPermission('championships', 'write') && (
          <Button asChild>
            <Link href="/championships/events/new">
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      {user && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Championship events</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeRequests}</div>
              <p className="text-xs text-muted-foreground">Pending approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Approved Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvedCredentials}</div>
              <p className="text-xs text-muted-foreground">Ready to use</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReview}</div>
              <p className="text-xs text-muted-foreground">Being processed</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Championship Events</TabsTrigger>
          {user && <TabsTrigger value="my-requests">My Requests</TabsTrigger>}
          {hasPermission('championships', 'read') && (
            <TabsTrigger value="management">Management</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{event.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {formatSport(event.sport)} • {event.venue_name}
                      </CardDescription>
                    </div>
                    <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                      {event.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">{formatDate(event.start_date)}</p>
                        {event.start_date !== event.end_date && (
                          <p className="text-muted-foreground">to {formatDate(event.end_date)}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">{event.city}, {event.state}</p>
                        <p className="text-muted-foreground">{event.venue_name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">{event.capacity?.toLocaleString()} capacity</p>
                        <p className="text-muted-foreground">Venue size</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">
                          {event.credential_deadline ? formatDate(event.credential_deadline) : 'TBD'}
                        </p>
                        <p className={`text-muted-foreground ${
                          event.credential_deadline && isCredentialDeadlinePassed(event.credential_deadline) 
                            ? 'text-red-600' 
                            : ''
                        }`}>
                          Credential deadline
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-4">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/championships/events/${event.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </Button>
                    
                    {user && event.status === 'upcoming' && (
                      <Button size="sm" asChild>
                        <Link href={`/championships/request/${event.id}`}>
                          <FileText className="h-4 w-4 mr-1" />
                          Request Credential
                        </Link>
                      </Button>
                    )}
                    
                    {hasPermission('championships', 'write') && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/championships/events/${event.id}/manage`}>
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {events.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Championship Events</h3>
                  <p className="text-muted-foreground mb-4">
                    No championship events are currently scheduled.
                  </p>
                  {hasPermission('championships', 'write') && (
                    <Button asChild>
                      <Link href="/championships/events/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Event
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {user && (
          <TabsContent value="my-requests" className="space-y-4">
            <div className="grid gap-4">
              {myRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {request.championship_events.name}
                        </CardTitle>
                        <CardDescription>
                          {formatSport(request.championship_events.sport)} • {request.credential_type.replace('_', ' ')}
                        </CardDescription>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm font-medium">Applicant</p>
                        <p className="text-sm text-muted-foreground">
                          {request.first_name} {request.last_name}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Organization</p>
                        <p className="text-sm text-muted-foreground">
                          {request.organizations?.name || 'Individual'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Submitted</p>
                        <p className="text-sm text-muted-foreground">
                          {request.submitted_at ? formatDate(request.submitted_at) : 'Draft'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/championships/requests/${request.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Request
                        </Link>
                      </Button>
                      
                      {request.status === 'draft' && (
                        <Button size="sm" asChild>
                          <Link href={`/championships/requests/${request.id}/edit`}>
                            <FileText className="h-4 w-4 mr-1" />
                            Continue Editing
                          </Link>
                        </Button>
                      )}
                      
                      {['approved', 'issued', 'active'].includes(request.status) && (
                        <Button size="sm" asChild>
                          <Link href={`/championships/credentials/${request.id}`}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            View Credential
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {myRequests.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Credential Requests</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't submitted any credential requests yet.
                    </p>
                    <Button asChild>
                      <Link href="/championships">
                        <Plus className="h-4 w-4 mr-2" />
                        Request First Credential
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        )}

        {hasPermission('championships', 'read') && (
          <TabsContent value="management" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pending Reviews</CardTitle>
                  <CardDescription>Credential requests awaiting approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{stats.pendingReview}</div>
                  <Button className="w-full" asChild>
                    <Link href="/championships/admin/reviews">
                      Review Requests
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Event Management</CardTitle>
                  <CardDescription>Manage championship events and settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{stats.totalEvents}</div>
                  <Button className="w-full" asChild>
                    <Link href="/championships/admin/events">
                      Manage Events
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Credential Analytics</CardTitle>
                  <CardDescription>View reports and analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{stats.approvedCredentials}</div>
                  <Button className="w-full" asChild>
                    <Link href="/championships/admin/analytics">
                      View Analytics
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}