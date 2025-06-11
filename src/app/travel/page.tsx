'use client';

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { FlightSearch } from "@/components/flight-search"

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
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Plane className="h-8 w-8 text-blue-600" />
                Big 12 Travel Coordination
              </h1>
              <p className="text-muted-foreground mt-1 text-lg">
                Flight search and travel management for conference events and championships
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Travel Calendar
              </Button>
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Group Booking
              </Button>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Travel Statistics */}
          <div className="grid gap-4 md:grid-cols-5 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
                <Plane className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{travelStats.totalTrips}</div>
                <p className="text-xs text-muted-foreground">This season</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{travelStats.activeBookings}</div>
                <p className="text-xs text-muted-foreground">Confirmed flights</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{travelStats.upcomingEvents}</div>
                <p className="text-xs text-muted-foreground">Requiring travel</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Travel Budget</CardTitle>
                <Target className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${travelStats.totalSpent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">YTD spending</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Cost</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${travelStats.averageCost}</div>
                <p className="text-xs text-muted-foreground">Per trip</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="flight-search" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-xl">
              <TabsTrigger value="flight-search">Flight Search</TabsTrigger>
              <TabsTrigger value="events">Upcoming Events</TabsTrigger>
              <TabsTrigger value="group-travel">Group Travel</TabsTrigger>
            </TabsList>

            {/* Flight Search Tab */}
            <TabsContent value="flight-search" className="space-y-6">
              <FlightSearch 
                defaultOrigin="DFW"
                defaultDestination="OMA"
                quickScenario="college_world_series"
              />
            </TabsContent>

            {/* Upcoming Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Upcoming Big 12 Events
                  </CardTitle>
                  <CardDescription>
                    Conference championships and tournaments requiring travel coordination
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <Card key={event.id} className="border-2">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{event.name}</h3>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={event.urgency === 'high' ? 'destructive' : event.urgency === 'medium' ? 'default' : 'secondary'}>
                                {event.urgency} priority
                              </Badge>
                              <Badge variant="outline">{event.sport}</Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{event.location}</p>
                                <p className="text-xs text-muted-foreground">Airport: {event.airport}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{event.date}</p>
                                <p className="text-xs text-muted-foreground">Championship dates</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{event.participants.length} Team{event.participants.length > 1 ? 's' : ''}</p>
                                <p className="text-xs text-muted-foreground">{event.participants.join(', ')}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm">
                              <Plane className="h-4 w-4 mr-2" />
                              Search Flights
                            </Button>
                            <Button variant="outline" size="sm">
                              <Building2 className="h-4 w-4 mr-2" />
                              Book Hotels
                            </Button>
                            <Button variant="outline" size="sm">
                              <Users className="h-4 w-4 mr-2" />
                              Group Options
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Group Travel Tab */}
            <TabsContent value="group-travel" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Team Travel Coordination
                    </CardTitle>
                    <CardDescription>
                      Manage group bookings and team travel logistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Arizona Baseball Team</p>
                          <p className="text-sm text-muted-foreground">25 travelers • College World Series</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Conference Staff</p>
                          <p className="text-sm text-muted-foreground">8 travelers • Various events</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Media Group</p>
                          <p className="text-sm text-muted-foreground">12 travelers • Championship coverage</p>
                        </div>
                        <Badge variant="outline">Planning</Badge>
                      </div>
                    </div>

                    <Button className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Create New Group Booking
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      Travel Alerts & Updates
                    </CardTitle>
                    <CardDescription>
                      Flight status and travel notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border-yellow-200 border">
                        <div className="w-2 h-2 rounded-full bg-yellow-600 mt-2" />
                        <div>
                          <p className="text-sm font-medium">Flight AA1234 Delayed</p>
                          <p className="text-xs text-muted-foreground">DFW → OMA • 45 minute delay due to weather</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-blue-200 border">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                        <div>
                          <p className="text-sm font-medium">Gate Change Alert</p>
                          <p className="text-xs text-muted-foreground">UA5678 moved to Gate B12 • Terminal change</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-green-200 border">
                        <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
                        <div>
                          <p className="text-sm font-medium">Check-in Available</p>
                          <p className="text-xs text-muted-foreground">Southwest WN9012 • Check-in opens in 2 hours</p>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      View All Notifications
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}