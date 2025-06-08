'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Trophy,
  Building2,
  BarChart3,
  AlertCircle
} from 'lucide-react';

// Big 12 Conference data
const conferenceStats = {
  schools: 16,
  sports: 25,
  studentAthletes: 7500,
  annualEvents: 2800,
  championships: 25,
  tvViewership: '185M+'
};

const upcomingEvents = [
  { sport: 'Football', event: 'Championship Game', date: 'Dec 7', venue: 'AT&T Stadium' },
  { sport: 'Basketball', event: 'Tournament', date: 'Mar 13-16', venue: 'T-Mobile Center' },
  { sport: 'Baseball', event: 'Tournament', date: 'May 21-25', venue: 'Globe Life Field' },
];

const operationalMetrics = [
  { name: 'Travel Coordination', value: 87, status: 'good' },
  { name: 'Venue Readiness', value: 94, status: 'excellent' },
  { name: 'Broadcast Coverage', value: 78, status: 'warning' },
  { name: 'Compliance Rate', value: 96, status: 'excellent' },
];

export function ConferenceOverview() {
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Schools</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conferenceStats.schools}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sports</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conferenceStats.sports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Athletes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conferenceStats.studentAthletes.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conferenceStats.annualEvents.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Championships</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conferenceStats.championships}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TV Viewership</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conferenceStats.tvViewership}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="operations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          <TabsTrigger value="schools">Member Schools</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operational Health</CardTitle>
              <CardDescription>
                Real-time status of conference operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {operationalMetrics.map((metric) => (
                <div key={metric.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <Badge 
                      variant={metric.status === 'excellent' ? 'default' : 
                              metric.status === 'good' ? 'secondary' : 'destructive'}
                    >
                      {metric.value}%
                    </Badge>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className={`h-2 ${
                      metric.status === 'warning' ? '[&>div]:bg-yellow-500' : ''
                    }`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Championships</CardTitle>
              <CardDescription>
                Major events requiring operational coordination
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{event.sport} {event.event}</p>
                      <p className="text-sm text-muted-foreground">{event.venue}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{event.date}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schools" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {['Arizona', 'Arizona State', 'Baylor', 'BYU', 'UCF', 'Cincinnati', 'Colorado', 'Houston'].map((school) => (
              <Card key={school} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{school}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Teams</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Athletes</span>
                    <span className="font-medium">450+</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="financials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>
                Conference financial health and distribution metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Annual Revenue</p>
                      <p className="text-sm text-muted-foreground">FY 2024</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">$470M</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Per School Distribution</p>
                      <p className="text-sm text-muted-foreground">Average</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">$31.7M</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}