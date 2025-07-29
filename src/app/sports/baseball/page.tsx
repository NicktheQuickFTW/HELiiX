'use client';

import Link from 'next/link';
import {
  Badge,
  Button,
  Card,
  Column,
  Heading,
  ProgressBar,
  Tab,
  TabContent,
  Tabs,
  Text,
} from '@once-ui-system/core';
import {
  Trophy,
  Users,
  Calendar,
  MapPin,
  Clock,
  Target,
  Medal,
  Zap,
  ArrowLeft,
  TrendingUp,
  Star,
  Award,
  ChevronRight,
} from 'lucide-react';

const baseballTeams = [
  {
    school: 'Texas',
    record: '45-15',
    ranking: '#3',
    conference: '18-6',
    rpi: 8,
  },
  {
    school: 'Oklahoma State',
    record: '42-18',
    ranking: '#8',
    conference: '17-7',
    rpi: 12,
  },
  {
    school: 'TCU',
    record: '41-19',
    ranking: '#12',
    conference: '16-8',
    rpi: 15,
  },
  {
    school: 'Texas Tech',
    record: '39-21',
    ranking: '#18',
    conference: '15-9',
    rpi: 22,
  },
  {
    school: 'West Virginia',
    record: '38-22',
    ranking: '#25',
    conference: '14-10',
    rpi: 28,
  },
  {
    school: 'Baylor',
    record: '35-25',
    ranking: 'NR',
    conference: '13-11',
    rpi: 34,
  },
  {
    school: 'Kansas State',
    record: '34-26',
    ranking: 'NR',
    conference: '12-12',
    rpi: 42,
  },
  {
    school: 'Iowa State',
    record: '32-28',
    ranking: 'NR',
    conference: '11-13',
    rpi: 48,
  },
  {
    school: 'Kansas',
    record: '30-30',
    ranking: 'NR',
    conference: '10-14',
    rpi: 56,
  },
  {
    school: 'BYU',
    record: '28-32',
    ranking: 'NR',
    conference: '9-15',
    rpi: 67,
  },
  {
    school: 'Utah',
    record: '26-34',
    ranking: 'NR',
    conference: '8-16',
    rpi: 78,
  },
  {
    school: 'Arizona State',
    record: '24-36',
    ranking: 'NR',
    conference: '7-17',
    rpi: 89,
  },
  {
    school: 'Cincinnati',
    record: '22-38',
    ranking: 'NR',
    conference: '6-18',
    rpi: 95,
  },
  {
    school: 'Houston',
    record: '20-40',
    ranking: 'NR',
    conference: '5-19',
    rpi: 102,
  },
];

const tournamentSchedule = [
  {
    date: 'May 21-24',
    event: 'Big 12 Championship',
    venue: 'Globe Life Field',
    location: 'Arlington, TX',
  },
  {
    date: 'May 31',
    event: 'NCAA Selection Show',
    venue: 'ESPN',
    location: 'TV Broadcast',
  },
  {
    date: 'June 1-4',
    event: 'NCAA Regionals',
    venue: 'Campus Sites',
    location: 'TBD',
  },
  {
    date: 'June 8-11',
    event: 'NCAA Super Regionals',
    venue: 'Campus Sites',
    location: 'TBD',
  },
  {
    date: 'June 15-25',
    event: "Men's College World Series",
    venue: 'Charles Schwab Field',
    location: 'Omaha, NE',
  },
];

const mlbDraftProspects = [
  {
    player: 'Jake Sullivan',
    school: 'Texas',
    position: 'RHP',
    projected: '1st Round',
  },
  {
    player: 'Marcus Johnson',
    school: 'Oklahoma State',
    position: 'OF',
    projected: '2nd Round',
  },
  {
    player: 'Tyler Rodriguez',
    school: 'TCU',
    position: 'SS',
    projected: '3rd Round',
  },
  {
    player: 'David Chen',
    school: 'Texas Tech',
    position: 'C',
    projected: '4th Round',
  },
  {
    player: 'Michael Thompson',
    school: 'West Virginia',
    position: '1B',
    projected: '5th Round',
  },
  {
    player: 'Alex Martinez',
    school: 'Baylor',
    position: 'LHP',
    projected: '6th Round',
  },
];

const championshipHistory = [
  {
    year: '2024',
    champion: 'Texas',
    record: '50-15',
    note: 'College World Series Runner-up',
  },
  {
    year: '2023',
    champion: 'Oklahoma State',
    record: '48-18',
    note: 'Super Regional appearance',
  },
  {
    year: '2022',
    champion: 'TCU',
    record: '45-20',
    note: 'Regional Champions',
  },
  {
    year: '2021',
    champion: 'Texas Tech',
    record: '42-19',
    note: 'Regional appearance',
  },
  {
    year: '2020',
    champion: 'Oklahoma State',
    record: '16-3',
    note: 'COVID-19 Shortened Season',
  },
];

export default function BaseballPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Back Navigation */}
      <div className="flex items-center space-x-2">
        <Link href="/sports">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sports
          </Button>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Baseball</span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center text-white text-2xl">
            ⚾
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Big 12 Baseball
            </h1>
            <p className="text-muted-foreground">
              Elite collegiate baseball featuring championship-caliber programs
              and MLB draft prospects.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant="secondary">Spring Sport</Badge>
          <Badge variant="outline">14 Teams</Badge>
          <Badge variant="outline">24-Game Conference Schedule</Badge>
          <Badge className="bg-accent text-accent-foreground">
            Big 12 Tournament
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <Column
            gap="xs"
            className="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <Heading variant="heading-sm" className="text-sm font-medium">
              Conference Games
            </Heading>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </Column>
          <Column>
            <div className="text-2xl font-bold">336</div>
            <p className="text-xs text-muted-foreground">
              Regular season games
            </p>
          </Column>
        </Card>
        <Card>
          <Column
            gap="xs"
            className="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <Heading variant="heading-sm" className="text-sm font-medium">
              Tournament
            </Heading>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </Column>
          <Column>
            <div className="text-2xl font-bold">May 21-24</div>
            <p className="text-xs text-muted-foreground">Globe Life Field</p>
          </Column>
        </Card>
        <Card>
          <Column
            gap="xs"
            className="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <Heading variant="heading-sm" className="text-sm font-medium">
              Ranked Teams
            </Heading>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </Column>
          <Column>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">In Top 25</p>
          </Column>
        </Card>
        <Card>
          <Column
            gap="xs"
            className="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <Heading variant="heading-sm" className="text-sm font-medium">
              MLB Prospects
            </Heading>
            <Star className="h-4 w-4 text-muted-foreground" />
          </Column>
          <Column>
            <div className="text-2xl font-bold">78</div>
            <p className="text-xs text-muted-foreground">
              Draft eligible players
            </p>
          </Column>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="standings" className="space-y-4">
        <Tab value="standings">Standings</Tab>
        <Tab value="tournament">Tournament</Tab>
        <Tab value="prospects">MLB Prospects</Tab>
        <Tab value="directory">Directory</Tab>
        <Tab value="operations">Operations</Tab>

        <TabContent value="standings" className="space-y-4">
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm">2024 Final Standings</Heading>
              <Text variant="body-sm" muted>
                Conference regular season standings and NCAA Tournament
                projections
              </Text>
            </Column>
            <Column>
              <div className="space-y-2">
                {baseballTeams.map((team, index) => (
                  <div
                    key={team.school}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      index < 8
                        ? 'bg-accent/10 border-accent/20'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium w-6">{index + 1}</div>
                      <div>
                        <div className="font-medium">{team.school}</div>
                        <div className="text-sm text-muted-foreground">
                          Conference: {team.conference} • RPI: {team.rpi}
                        </div>
                      </div>
                      {index < 8 && (
                        <Badge variant="secondary" className="ml-2">
                          NCAA Tournament
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{team.record}</div>
                      <div className="text-sm text-muted-foreground">
                        {team.ranking}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Column>
          </Card>
        </TabContent>

        <TabContent value="tournament" className="space-y-4">
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm">Postseason Schedule</Heading>
              <Text variant="body-sm" muted>
                Big 12 Tournament and NCAA Championship timeline
              </Text>
            </Column>
            <Column>
              <div className="space-y-4">
                {tournamentSchedule.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{event.event}</div>
                      <div className="flex items-center text-sm text-muted-foreground space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.venue}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{event.location}</Badge>
                  </div>
                ))}
              </div>
            </Column>
          </Card>

          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm">Championship History</Heading>
              <Text variant="body-sm" muted>
                Recent Big 12 Baseball Champions and postseason success
              </Text>
            </Column>
            <Column>
              <div className="space-y-4">
                {championshipHistory.map((champ, index) => (
                  <div
                    key={champ.year}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-accent' : 'bg-muted-foreground'
                        }`}
                      >
                        {champ.year}
                      </div>
                      <div>
                        <div className="font-medium">{champ.champion}</div>
                        <div className="text-sm text-muted-foreground">
                          {champ.note}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{champ.record}</div>
                      <div className="text-sm text-muted-foreground">
                        Final Record
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Column>
          </Card>
        </TabContent>

        <TabContent value="prospects" className="space-y-4">
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm">2024 MLB Draft Prospects</Heading>
              <Text variant="body-sm" muted>
                Top Big 12 players projected for the MLB Draft
              </Text>
            </Column>
            <Column>
              <div className="space-y-3">
                {mlbDraftProspects.map((prospect, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-bold">
                        {prospect.player
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <div className="font-medium">{prospect.player}</div>
                        <div className="text-sm text-muted-foreground">
                          {prospect.school} • {prospect.position}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        prospect.projected.includes('1st') ||
                        prospect.projected.includes('2nd')
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {prospect.projected}
                    </Badge>
                  </div>
                ))}
              </div>
            </Column>
          </Card>
        </TabContent>

        <TabContent value="directory" className="space-y-4">
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm">Baseball Directory</Heading>
              <Text variant="body-sm" muted>
                Contact information for baseball personnel
              </Text>
            </Column>
            <Column>
              <p className="text-muted-foreground">
                Directory functionality coming soon...
              </p>
            </Column>
          </Card>
        </TabContent>

        <TabContent value="operations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <Column gap="xs">
                <Heading variant="heading-sm">Tournament Operations</Heading>
                <Text variant="body-sm" muted>
                  Big 12 Championship preparation and logistics
                </Text>
              </Column>
              <Column className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Venue Setup</span>
                    <span className="text-sm font-medium">98%</span>
                  </div>
                  <ProgressBar value={98} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Team Logistics</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <ProgressBar value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Media Credentials</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <ProgressBar value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Broadcast Setup</span>
                    <span className="text-sm font-medium">100%</span>
                  </div>
                  <ProgressBar value={100} className="h-2" />
                </div>
              </Column>
            </Card>

            <Card>
              <Column gap="xs">
                <Heading variant="heading-sm">Season Statistics</Heading>
                <Text variant="body-sm" muted>
                  Key metrics and conference achievements
                </Text>
              </Column>
              <Column className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg. Attendance</span>
                  <span className="text-sm font-medium">3,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Televised Games</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">All-Americans</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">MLB Draft Picks</span>
                  <span className="text-sm font-medium">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Academic All-Big 12</span>
                  <span className="text-sm font-medium">67</span>
                </div>
              </Column>
            </Card>
          </div>
        </TabContent>
      </Tabs>
    </div>
  );
}
