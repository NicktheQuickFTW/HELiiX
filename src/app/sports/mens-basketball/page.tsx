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

const basketballTeams = [
  { school: 'Houston', record: '15-2', ranking: '#8', conference: '4-0' },
  { school: 'Iowa State', record: '13-2', ranking: '#12', conference: '3-1' },
  { school: 'Kansas', record: '12-3', ranking: '#15', conference: '3-1' },
  {
    school: 'Arizona State',
    record: '12-3',
    ranking: '#18',
    conference: '3-1',
  },
  { school: 'Cincinnati', record: '12-3', ranking: '#22', conference: '2-2' },
  { school: 'Texas Tech', record: '11-4', ranking: '#25', conference: '2-2' },
  { school: 'Arizona', record: '10-5', ranking: 'NR', conference: '2-2' },
  { school: 'BYU', record: '11-4', ranking: 'NR', conference: '2-2' },
  { school: 'TCU', record: '10-5', ranking: 'NR', conference: '2-2' },
  { school: 'Colorado', record: '9-6', ranking: 'NR', conference: '1-3' },
  { school: 'Kansas State', record: '9-6', ranking: 'NR', conference: '1-3' },
  { school: 'West Virginia', record: '8-7', ranking: 'NR', conference: '1-3' },
  { school: 'Baylor', record: '8-7', ranking: 'NR', conference: '1-3' },
  { school: 'Oklahoma State', record: '8-7', ranking: 'NR', conference: '0-4' },
  { school: 'UCF', record: '7-8', ranking: 'NR', conference: '0-4' },
  { school: 'Utah', record: '6-9', ranking: 'NR', conference: '0-4' },
];

const upcomingGames = [
  {
    date: 'Jan 12',
    teams: 'Kansas at Houston',
    venue: 'Fertitta Center',
    time: '2:00 PM EST',
    tv: 'ESPN',
  },
  {
    date: 'Jan 14',
    teams: 'Iowa State at Arizona',
    venue: 'McKale Center',
    time: '9:00 PM EST',
    tv: 'ESPN2',
  },
  {
    date: 'Jan 15',
    teams: 'Texas Tech at Cincinnati',
    venue: 'Fifth Third Arena',
    time: '7:00 PM EST',
    tv: 'FS1',
  },
  {
    date: 'Jan 18',
    teams: 'Arizona State at BYU',
    venue: 'Marriott Center',
    time: '9:00 PM EST',
    tv: 'ESPN+',
  },
];

const tournamentHistory = [
  {
    year: '2024',
    champion: 'Iowa State',
    record: '29-8',
    note: 'Big 12 Tournament Champions',
  },
  {
    year: '2023',
    champion: 'Kansas',
    record: '28-7',
    note: 'NCAA Elite Eight',
  },
  {
    year: '2022',
    champion: 'Kansas',
    record: '34-6',
    note: 'NCAA National Champions',
  },
  {
    year: '2021',
    champion: 'Baylor',
    record: '28-2',
    note: 'NCAA National Champions',
  },
  {
    year: '2020',
    champion: 'Kansas',
    record: '28-3',
    note: 'Tournament Cancelled',
  },
];

export default function MensBasketballPage() {
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
        <span className="text-sm font-medium">Men's Basketball</span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center text-white text-2xl">
            🏀
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Big 12 Men's Basketball
            </h1>
            <p className="text-muted-foreground">
              Elite men's basketball featuring some of the nation's top programs
              and March Madness contenders.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant="secondary">Winter Sport</Badge>
          <Badge variant="outline">16 Teams</Badge>
          <Badge variant="outline">20-Game Conference Schedule</Badge>
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
            <div className="text-2xl font-bold">160</div>
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
            <div className="text-2xl font-bold">Mar 12-16</div>
            <p className="text-xs text-muted-foreground">Kansas City, MO</p>
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
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">In AP Top 25</p>
          </Column>
        </Card>
        <Card>
          <Column
            gap="xs"
            className="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <Heading variant="heading-sm" className="text-sm font-medium">
              March Madness
            </Heading>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </Column>
          <Column>
            <div className="text-2xl font-bold">8-10</div>
            <p className="text-xs text-muted-foreground">Projected bids</p>
          </Column>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="standings" className="space-y-4">
        <Tab value="standings">Standings</Tab>
        <Tab value="schedule">Schedule</Tab>
        <Tab value="tournament">Tournament</Tab>
        <Tab value="directory">Directory</Tab>
        <Tab value="operations">Operations</Tab>

        <TabContent value="standings" className="space-y-4">
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm">
                2024-25 Conference Standings
              </Heading>
              <Text variant="body-sm" muted>
                Current standings through early conference play
              </Text>
            </Column>
            <Column>
              <div className="space-y-2">
                {basketballTeams.map((team, index) => (
                  <div
                    key={team.school}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      index < 4
                        ? 'bg-accent/10 border-accent/20'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium w-6">{index + 1}</div>
                      <div>
                        <div className="font-medium">{team.school}</div>
                        <div className="text-sm text-muted-foreground">
                          Conference: {team.conference}
                        </div>
                      </div>
                      {index < 4 && (
                        <Badge variant="secondary" className="ml-2">
                          Double Bye
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

        <TabContent value="schedule" className="space-y-4">
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm">Upcoming Conference Games</Heading>
              <Text variant="body-sm" muted>
                Key matchups and nationally televised games
              </Text>
            </Column>
            <Column>
              <div className="space-y-4">
                {upcomingGames.map((game, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{game.teams}</div>
                      <div className="flex items-center text-sm text-muted-foreground space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {game.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {game.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {game.venue}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{game.tv}</Badge>
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
              <Heading variant="heading-sm">Big 12 Tournament History</Heading>
              <Text variant="body-sm" muted>
                Recent tournament champions and NCAA Tournament success
              </Text>
            </Column>
            <Column>
              <div className="space-y-4">
                {tournamentHistory.map((champ, index) => (
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

        <TabContent value="directory" className="space-y-4">
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm">Men's Basketball Directory</Heading>
              <Text variant="body-sm" muted>
                Contact information for men's basketball personnel
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
                  Big 12 Tournament at T-Mobile Center
                </Text>
              </Column>
              <Column className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Venue Preparation</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <ProgressBar value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Media Credentials</span>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <ProgressBar value={60} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Broadcast Setup</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <ProgressBar value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Ticket Sales</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <ProgressBar value={45} className="h-2" />
                </div>
              </Column>
            </Card>

            <Card>
              <Column gap="xs">
                <Heading variant="heading-sm">Season Statistics</Heading>
                <Text variant="body-sm" muted>
                  Key performance metrics and achievements
                </Text>
              </Column>
              <Column className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg. Attendance</span>
                  <span className="text-sm font-medium">14,250</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">TV Games</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">National Rankings</span>
                  <span className="text-sm font-medium">6 teams</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">All-Americans</span>
                  <span className="text-sm font-medium">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">NBA Draft Prospects</span>
                  <span className="text-sm font-medium">12+</span>
                </div>
              </Column>
            </Card>
          </div>
        </TabContent>
      </Tabs>
    </div>
  );
}
