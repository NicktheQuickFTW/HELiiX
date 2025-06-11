'use client';

import { useState } from 'react';
import { Card, Button, Badge } from '@once-ui-system/core';
import { Dropdown, Option, Text, Input } from '@once-ui-system/core';
// Note: Calendar, Dialog, and Alert components need Once UI implementation
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react';

// Sample data for Big 12 scheduling
const sports = [
  'Football', 'Men\'s Basketball', 'Women\'s Basketball', 'Baseball', 
  'Softball', 'Volleyball', 'Soccer', 'Wrestling', 'Track & Field'
];

const venues = [
  { name: 'AT&T Stadium', location: 'Arlington, TX', capacity: 80000 },
  { name: 'T-Mobile Center', location: 'Kansas City, MO', capacity: 19000 },
  { name: 'Globe Life Field', location: 'Arlington, TX', capacity: 40000 },
  { name: 'CHI Health Center', location: 'Omaha, NE', capacity: 17000 },
];

const sampleGames = [
  {
    id: 1,
    sport: 'Football',
    homeTeam: 'Kansas',
    awayTeam: 'Iowa State',
    date: '2024-11-09',
    time: '7:00 PM',
    venue: 'David Booth Kansas Memorial Stadium',
    status: 'scheduled',
    tvNetwork: 'ESPN',
    conflicts: []
  },
  {
    id: 2,
    sport: 'Men\'s Basketball',
    homeTeam: 'Baylor',
    awayTeam: 'Houston',
    date: '2024-01-20',
    time: '2:00 PM',
    venue: 'Foster Pavilion',
    status: 'scheduled',
    tvNetwork: 'CBS',
    conflicts: ['Venue overlap with Women\'s Basketball']
  }
];

export function SportScheduler() {
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [games, setGames] = useState(sampleGames);
  const [isAddingGame, setIsAddingGame] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'conflict':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {sports.map(sport => (
                <SelectItem key={sport} value={sport}>{sport}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <CalendarDays className="h-4 w-4 mr-2" />
                Add Game
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Schedule New Game</DialogTitle>
                <DialogDescription>
                  Add a new game to the Big 12 Conference schedule
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sport</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent>
                        {sports.map(sport => (
                          <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Home Team</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kansas">Kansas</SelectItem>
                        <SelectItem value="baylor">Baylor</SelectItem>
                        <SelectItem value="houston">Houston</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Away Team</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iowa-state">Iowa State</SelectItem>
                        <SelectItem value="tcu">TCU</SelectItem>
                        <SelectItem value="texas-tech">Texas Tech</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Venue</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map(venue => (
                        <SelectItem key={venue.name} value={venue.name}>
                          {venue.name} - {venue.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  Schedule Game
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">Export Schedule</Button>
          <Button variant="outline">Sync to Calendar</Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Conflict Alert */}
          {games.some(g => g.conflicts.length > 0) && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Scheduling Conflicts Detected</AlertTitle>
              <AlertDescription>
                {games.filter(g => g.conflicts.length > 0).length} games have conflicts that need resolution
              </AlertDescription>
            </Alert>
          )}

          {/* Games List */}
          <div className="space-y-4">
            {games.map(game => (
              <Card key={game.id} className={game.conflicts.length > 0 ? 'border-yellow-500' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(game.conflicts.length > 0 ? 'conflict' : game.status)}
                      <CardTitle className="text-lg">
                        {game.homeTeam} vs {game.awayTeam}
                      </CardTitle>
                    </div>
                    <Badge variant="outline">{game.sport}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(game.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{game.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{game.venue}</span>
                      </div>
                    </div>
                    {game.tvNetwork && (
                      <Badge variant="secondary" className="w-fit">
                        📺 {game.tvNetwork}
                      </Badge>
                    )}
                    {game.conflicts.length > 0 && (
                      <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
                        <p className="font-medium text-yellow-800 dark:text-yellow-200">Conflicts:</p>
                        <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300">
                          {game.conflicts.map((conflict, idx) => (
                            <li key={idx}>{conflict}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">Reschedule</Button>
                    {game.conflicts.length > 0 && (
                      <Button size="sm" variant="default">Resolve Conflicts</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conflict Resolution Center</CardTitle>
              <CardDescription>
                Manage and resolve scheduling conflicts across all sports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {games.filter(g => g.conflicts.length > 0).map(game => (
                  <Alert key={game.id}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>
                      {game.sport}: {game.homeTeam} vs {game.awayTeam}
                    </AlertTitle>
                    <AlertDescription>
                      {game.conflicts.join(', ')}
                      <div className="mt-2">
                        <Button size="sm">Auto-Resolve</Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}