'use client';

import Link from 'next/link';
import {
  Badge,
  Button,
  Card,
  Column,
  Heading,
  Tab,
  TabContent,
  Tabs,
  Text,
} from '@once-ui-system/core';
import {
  Trophy,
  Calendar,
  Medal,
  ArrowLeft,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';

const volleyballTeams = [
  { school: 'Texas', record: '28-3', ranking: '#1', conference: '17-1' },
  { school: 'Nebraska', record: '27-4', ranking: '#3', conference: '16-2' },
  { school: 'Wisconsin', record: '25-6', ranking: '#8', conference: '15-3' },
  { school: 'Penn State', record: '24-7', ranking: '#12', conference: '14-4' },
  { school: 'Kansas', record: '22-9', ranking: '#18', conference: '13-5' },
  { school: 'Baylor', record: '21-10', ranking: '#22', conference: '12-6' },
  { school: 'Iowa State', record: '20-11', ranking: 'NR', conference: '11-7' },
  { school: 'TCU', record: '19-12', ranking: 'NR', conference: '10-8' },
  {
    school: 'Arizona State',
    record: '18-13',
    ranking: 'NR',
    conference: '9-9',
  },
  { school: 'Colorado', record: '17-14', ranking: 'NR', conference: '8-10' },
  {
    school: 'Oklahoma State',
    record: '16-15',
    ranking: 'NR',
    conference: '7-11',
  },
  {
    school: 'West Virginia',
    record: '15-16',
    ranking: 'NR',
    conference: '6-12',
  },
  { school: 'Cincinnati', record: '14-17', ranking: 'NR', conference: '5-13' },
  { school: 'Arizona', record: '13-18', ranking: 'NR', conference: '4-14' },
  { school: 'Utah', record: '12-19', ranking: 'NR', conference: '3-15' },
];

export default function VolleyballPage() {
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
        <span className="text-sm font-medium">Volleyball</span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center text-white text-2xl">
            🏐
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Big 12 Volleyball
            </h1>
            <p className="text-muted-foreground">
              Elite volleyball competition featuring nationally ranked programs
              and NCAA Tournament contenders.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant="secondary">Fall Sport</Badge>
          <Badge variant="outline">15 Teams</Badge>
          <Badge variant="outline">Women's Only</Badge>
          <Badge className="bg-accent text-accent-foreground">
            Round Robin Format
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
              Conference Matches
            </Heading>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </Column>
          <Column>
            <div className="text-2xl font-bold">210</div>
            <p className="text-xs text-muted-foreground">
              Regular season matches
            </p>
          </Column>
        </Card>
        <Card>
          <Column
            gap="xs"
            className="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <Heading variant="heading-sm" className="text-sm font-medium">
              Championship
            </Heading>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </Column>
          <Column>
            <div className="text-2xl font-bold">Nov 21-23</div>
            <p className="text-xs text-muted-foreground">
              Championship weekend
            </p>
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
            <p className="text-xs text-muted-foreground">In AVCA Top 25</p>
          </Column>
        </Card>
        <Card>
          <Column
            gap="xs"
            className="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <Heading variant="heading-sm" className="text-sm font-medium">
              NCAA Bids
            </Heading>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </Column>
          <Column>
            <div className="text-2xl font-bold">8-10</div>
            <p className="text-xs text-muted-foreground">
              Expected tournament teams
            </p>
          </Column>
        </Card>
      </div>

      {/* Standings */}
      <Card>
        <Column gap="xs">
          <Heading variant="heading-sm">2024 Final Standings</Heading>
          <Text variant="body-sm" muted>
            Conference regular season standings and NCAA Tournament qualifiers
          </Text>
        </Column>
        <Column>
          <div className="space-y-2">
            {volleyballTeams.map((team, index) => (
              <div
                key={team.school}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  index < 6
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
                  {index < 6 && (
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
    </div>
  );
}
