'use client';

import Link from 'next/link';
import {
  Badge,
  Button,
  Card,
  Column,
  Heading,
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
} from 'lucide-react';

const sportsData = [
  {
    id: 'football',
    name: 'Football',
    season: 'Fall',
    teams: 16,
    championships: 'Big 12 Championship Game',
    icon: '🏈',
    color: 'bg-accent',
    description:
      'Premier collegiate football with 16 member institutions competing for the Big 12 Championship.',
    features: [
      '9-game conference schedule',
      'Championship Game',
      'CFP eligibility',
      'National TV coverage',
    ],
  },
  {
    id: 'mens-basketball',
    name: "Men's Basketball",
    season: 'Winter',
    teams: 16,
    championships: 'Big 12 Tournament',
    icon: '🏀',
    color: 'bg-accent',
    description:
      "Elite men's basketball featuring some of the nation's top programs and players.",
    features: [
      '20-game conference schedule',
      'Big 12 Tournament',
      'March Madness',
      'National rankings',
    ],
  },
  {
    id: 'womens-basketball',
    name: "Women's Basketball",
    season: 'Winter',
    teams: 16,
    championships: 'Big 12 Tournament',
    icon: '🏀',
    color: 'bg-accent',
    description:
      "Competitive women's basketball with outstanding student-athletes and programs.",
    features: [
      '18-game conference schedule',
      'Big 12 Tournament',
      'NCAA Tournament',
      'National exposure',
    ],
  },
  {
    id: 'soccer',
    name: 'Soccer',
    season: 'Fall',
    teams: 16,
    championships: 'Big 12 Championship',
    icon: '⚽',
    color: 'bg-accent',
    description:
      "Women's soccer featuring top-tier competition and NCAA Tournament contenders.",
    features: [
      'Round robin play',
      'Championship weekend',
      'NCAA Tournament',
      'Olympic development',
    ],
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    season: 'Fall',
    teams: 15,
    championships: 'Big 12 Championship',
    icon: '🏐',
    color: 'bg-accent',
    description:
      'Elite volleyball competition with nationally ranked programs and players.',
    features: [
      'Round robin format',
      'Championship tournament',
      'NCAA Tournament',
      'Professional pipeline',
    ],
  },
  {
    id: 'cross-country',
    name: 'Cross Country',
    season: 'Fall',
    teams: 13,
    championships: 'Big 12 Championships',
    icon: '🏃',
    color: 'bg-accent',
    description:
      "Premier cross country competition featuring both men's and women's championships.",
    features: [
      'Team & individual titles',
      'NCAA qualifiers',
      'All-Americans',
      'Professional development',
    ],
  },
  {
    id: 'track-field',
    name: 'Track & Field',
    season: 'Spring',
    teams: 16,
    championships: 'Big 12 Championships',
    icon: '🏃‍♀️',
    color: 'bg-accent',
    description:
      'Indoor and outdoor track & field featuring world-class athletes and facilities.',
    features: [
      'Indoor championships',
      'Outdoor championships',
      'NCAA qualifiers',
      'Olympic pipeline',
    ],
  },
  {
    id: 'swimming-diving',
    name: 'Swimming & Diving',
    season: 'Winter',
    teams: 10,
    championships: 'Big 12 Championships',
    icon: '🏊',
    color: 'bg-accent',
    description:
      "Elite aquatic sports featuring both men's and women's swimming and diving.",
    features: [
      'Conference championships',
      'NCAA qualifiers',
      'Olympic training',
      'World-class facilities',
    ],
  },
  {
    id: 'wrestling',
    name: 'Wrestling',
    season: 'Winter',
    teams: 14,
    championships: 'Big 12 Championships',
    icon: '🤼',
    color: 'bg-accent',
    description:
      'Premier wrestling featuring traditional powers and rising programs.',
    features: [
      '10 weight classes',
      'Individual titles',
      'NCAA Tournament',
      'Olympic development',
    ],
  },
  {
    id: 'gymnastics',
    name: 'Gymnastics',
    season: 'Winter',
    teams: 7,
    championships: 'Big 12 Championships',
    icon: '🤸',
    color: 'bg-accent',
    description:
      "Women's gymnastics featuring artistic excellence and competitive spirit.",
    features: [
      'All-around competition',
      'Event specialists',
      'NCAA Tournament',
      'Elite training',
    ],
  },
  {
    id: 'equestrian',
    name: 'Equestrian',
    season: 'Fall/Spring',
    teams: 4,
    championships: 'Big 12 Championships',
    icon: '🐎',
    color: 'bg-accent',
    description:
      'Unique equestrian sport featuring hunter seat and western disciplines.',
    features: [
      'Hunt seat competition',
      'Western events',
      'NCEA championship',
      'Elite facilities',
    ],
  },
  {
    id: 'mens-tennis',
    name: "Men's Tennis",
    season: 'Spring',
    teams: 9,
    championships: 'Big 12 Championships',
    icon: '🎾',
    color: 'bg-accent',
    description:
      "Competitive men's tennis with top-ranked programs and players.",
    features: [
      'Individual & team',
      'ITA rankings',
      'NCAA Tournament',
      'Professional pathway',
    ],
  },
  {
    id: 'womens-tennis',
    name: "Women's Tennis",
    season: 'Spring',
    teams: 16,
    championships: 'Big 12 Championships',
    icon: '🎾',
    color: 'bg-accent',
    description:
      "Elite women's tennis featuring nationally ranked programs and student-athletes.",
    features: [
      'Individual & team',
      'ITA rankings',
      'NCAA Tournament',
      'WTA pipeline',
    ],
  },
  {
    id: 'lacrosse',
    name: 'Lacrosse',
    season: 'Spring',
    teams: 6,
    championships: 'Big 12 Championships',
    icon: '🥍',
    color: 'bg-accent',
    description:
      "Growing women's lacrosse sport with competitive programs and rising talent.",
    features: [
      'Conference tournament',
      'NCAA Tournament',
      'All-Americans',
      'Rapid growth',
    ],
  },
  {
    id: 'womens-golf',
    name: "Women's Golf",
    season: 'Fall/Spring',
    teams: 14,
    championships: 'Big 12 Championships',
    icon: '⛳',
    color: 'bg-accent',
    description:
      "Premier women's golf featuring championship courses and elite competition.",
    features: [
      'Stroke play format',
      'Individual medalist',
      'NCAA Tournament',
      'LPGA pathway',
    ],
  },
  {
    id: 'mens-golf',
    name: "Men's Golf",
    season: 'Fall/Spring',
    teams: 16,
    championships: 'Big 12 Championships',
    icon: '⛳',
    color: 'bg-accent',
    description:
      "Elite men's golf competition on premier courses with PGA Tour prospects.",
    features: [
      'Stroke play format',
      'Individual medalist',
      'NCAA Tournament',
      'PGA pathway',
    ],
  },
  {
    id: 'baseball',
    name: 'Baseball',
    season: 'Spring',
    teams: 14,
    championships: 'Big 12 Tournament',
    icon: '⚾',
    color: 'bg-accent',
    description:
      'Competitive baseball featuring top programs and MLB draft prospects.',
    features: [
      'Conference tournament',
      'MLB Draft pipeline',
      'College World Series',
      'Elite facilities',
    ],
  },
  {
    id: 'softball',
    name: 'Softball',
    season: 'Spring',
    teams: 11,
    championships: 'Big 12 Championship',
    icon: '🥎',
    color: 'bg-accent',
    description:
      "Fast-pitch softball featuring elite competition and Women's College World Series contenders.",
    features: [
      'Conference tournament',
      'WCWS contenders',
      'All-Americans',
      'Professional opportunities',
    ],
  },
  {
    id: 'rowing',
    name: 'Rowing',
    season: 'Spring',
    teams: 6,
    championships: 'Big 12 Championships',
    icon: '🚣',
    color: 'bg-accent',
    description:
      'Rowing sport featuring both varsity and emerging programs with NCAA championship aspirations.',
    features: [
      'Varsity & emerging',
      'Championship racing',
      'NCAA Tournament',
      'Olympic development',
    ],
  },
  {
    id: 'beach-volleyball',
    name: 'Beach Volleyball',
    season: 'Spring',
    teams: 3,
    championships: 'Emerging Sport',
    icon: '🏐',
    color: 'bg-accent',
    description:
      'Emerging beach volleyball sport with growing participation and competitive opportunities.',
    features: [
      'Pairs competition',
      'Emerging sport',
      'NCAA recognition',
      'Growth potential',
    ],
  },
];

export default function SportsPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Big 12 Conference Sports
        </h1>
        <p className="text-muted-foreground">
          Comprehensive overview of all Big 12 Conference sports programs,
          championships, and operations.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <Column
            gap="xs"
            className="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <Heading variant="heading-sm" className="text-sm font-medium">
              Total Sports
            </Heading>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </Column>
          <Column>
            <div className="text-2xl font-bold">20</div>
            <p className="text-xs text-muted-foreground">Across all seasons</p>
          </Column>
        </Card>
        <Card>
          <Column
            gap="xs"
            className="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <Heading variant="heading-sm" className="text-sm font-medium">
              Member Schools
            </Heading>
            <Users className="h-4 w-4 text-muted-foreground" />
          </Column>
          <Column>
            <div className="text-2xl font-bold">16</div>
            <p className="text-xs text-muted-foreground">Active institutions</p>
          </Column>
        </Card>
        <Card>
          <Column
            gap="xs"
            className="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <Heading variant="heading-sm" className="text-sm font-medium">
              Championships
            </Heading>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </Column>
          <Column>
            <div className="text-2xl font-bold">20+</div>
            <p className="text-xs text-muted-foreground">
              Annual championships
            </p>
          </Column>
        </Card>
        <Card>
          <Column
            gap="xs"
            className="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <Heading variant="heading-sm" className="text-sm font-medium">
              Student-Athletes
            </Heading>
            <Target className="h-4 w-4 text-muted-foreground" />
          </Column>
          <Column>
            <div className="text-2xl font-bold">8,000+</div>
            <p className="text-xs text-muted-foreground">Across all sports</p>
          </Column>
        </Card>
      </div>

      {/* Sports Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sportsData.map((sport) => (
          <Card
            key={sport.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <Column gap="xs" className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-lg ${sport.color} flex items-center justify-center text-white text-xl`}
                  >
                    {sport.icon}
                  </div>
                  <div>
                    <Heading variant="heading-sm" className="text-lg">
                      {sport.name}
                    </Heading>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {sport.season}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {sport.teams} teams
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Column>
            <Column className="space-y-4">
              <Text variant="body-sm" muted className="text-sm">
                {sport.description}
              </Text>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Trophy className="h-4 w-4 mr-2" />
                  {sport.championships}
                </div>
              </div>

              <div className="space-y-1">
                {sport.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center text-xs text-muted-foreground"
                  >
                    <Zap className="h-3 w-3 mr-2 text-accent" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link href={`/sports/${sport.id}`}>
                  <Button className="w-full" size="sm">
                    View Sport Details
                  </Button>
                </Link>
              </div>
            </Column>
          </Card>
        ))}
      </div>
    </div>
  );
}
