'use client';

import React, { useState, useEffect } from 'react';
import {
  Column,
  Row,
  Grid,
  Card,
  Button,
  Heading,
  Text,
  Badge,
  StatusIndicator,
  Icon,
  Background,
  Flex,
  Tag,
  Chip,
  SegmentedControl,
  Avatar,
  AvatarGroup,
  ProgressBar,
  Line,
  Scroller,
  Input,
  InteractiveDetails,
  Tooltip,
} from '@once-ui-system/core';
import { RevealFx, GlitchFx, HoloFx, TiltFx } from '@/components/effects';
import { BorderBeam } from '@/components/ui/Concepts/border-beam';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { Meteors } from '@/components/ui/meteors';
import { TeamLogo } from '@/components/ui/TeamLogo';

// Team gradients
const gradients = {
  primary:
    'linear-gradient(135deg, var(--brand-solid-strong) 0%, var(--accent-background-strong) 50%, var(--neutral-background-strong) 100%)',
  mesh: 'radial-gradient(at 40% 20%, var(--brand-solid-strong) 0px, transparent 50%), radial-gradient(at 80% 0%, var(--neutral-background-strong) 0px, transparent 50%)',
  holographic:
    'linear-gradient(45deg, #ff0080, #ff8c00, #ffd700, #00ff00, #00ffff, #ff0080)',
};

// Big 12 teams data with stats
const teams = [
  {
    id: 'kansas',
    name: 'Kansas Jayhawks',
    logo: 'kansas',
    location: 'Lawrence, KS',
    founded: '1865',
    enrollment: 28447,
    colors: ['#0051BA', '#E8000D'],
    stats: {
      nationalChampionships: 6,
      conferenceChampionships: 63,
      allAmericans: 52,
      overallRecord: '2366-877',
    },
    sports: 18,
    facilities: [
      'Allen Fieldhouse',
      'David Booth Kansas Memorial Stadium',
      'Hoglund Ballpark',
    ],
    recentAchievements: [
      '2022 NCAA Basketball Champions',
      '2023 Big 12 Regular Season Champions',
    ],
  },
  {
    id: 'houston',
    name: 'Houston Cougars',
    logo: 'houston',
    location: 'Houston, TX',
    founded: '1927',
    enrollment: 47000,
    colors: ['#C8102E', '#FFFFFF'],
    stats: {
      nationalChampionships: 1,
      conferenceChampionships: 33,
      allAmericans: 18,
      overallRecord: '1792-963',
    },
    sports: 17,
    facilities: ['Fertitta Center', 'TDECU Stadium', 'Schroeder Park'],
    recentAchievements: [
      '2023 AAC Tournament Champions',
      '2023 NCAA Final Four',
    ],
  },
  {
    id: 'baylor',
    name: 'Baylor Bears',
    logo: 'baylor',
    location: 'Waco, TX',
    founded: '1845',
    enrollment: 20626,
    colors: ['#003015', '#FFB81C'],
    stats: {
      nationalChampionships: 4,
      conferenceChampionships: 41,
      allAmericans: 23,
      overallRecord: '1687-1099',
    },
    sports: 19,
    facilities: ['Foster Pavilion', 'McLane Stadium', 'Baylor Ballpark'],
    recentAchievements: [
      '2021 NCAA Basketball Champions',
      '2021 Big 12 Tournament Champions',
    ],
  },
  {
    id: 'texas_tech',
    name: 'Texas Tech Red Raiders',
    logo: 'texas_tech',
    location: 'Lubbock, TX',
    founded: '1923',
    enrollment: 40322,
    colors: ['#CC0000', '#000000'],
    stats: {
      nationalChampionships: 1,
      conferenceChampionships: 15,
      allAmericans: 14,
      overallRecord: '1456-1267',
    },
    sports: 17,
    facilities: [
      'United Supermarkets Arena',
      'Jones AT&T Stadium',
      'Dan Law Field',
    ],
    recentAchievements: [
      '2019 NCAA Basketball Runner-up',
      '2023 Big 12 Baseball Champions',
    ],
  },
  // Add more teams as needed...
];

// 3D Team card component
const Team3DCard: React.FC<{
  team: (typeof teams)[0];
  selected: boolean;
  onSelect: () => void;
}> = ({ team, selected, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const [statsAnimated, setStatsAnimated] = useState(false);

  useEffect(() => {
    if (selected && !statsAnimated) {
      setStatsAnimated(true);
    }
  }, [selected, statsAnimated]);

  return (
    <TiltFx>
      <Card
        onClick={onSelect}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        radius="l"
        padding="l"
        style={{
          background: selected
            ? `linear-gradient(135deg, ${team.colors[0]} 0%, ${team.colors[1]} 100%)`
            : 'rgba(var(--background-primary-rgb), 0.8)',
          backdropFilter: 'blur(20px)',
          border: selected
            ? '2px solid var(--brand-solid-strong)'
            : '1px solid rgba(var(--border-medium-rgb), 0.3)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '250px',
          transform: hovered ? 'translateZ(20px)' : 'translateZ(0)',
          transition: 'all 0.3s ease',
        }}
      >
        {selected && <AnimatedBeam />}

        <Column gap="l" fillWidth>
          {/* Team header */}
          <Row horizontal="space-between" vertical="center">
            <HoloFx
              shine={{ opacity: hovered ? 80 : 40 }}
              burn={{ opacity: 30 }}
            >
              <TeamLogo
                team={team.logo}
                size={80}
                variant={selected ? 'dark' : 'light'}
              />
            </HoloFx>

            <Column alignItems="flex-end" gap="xs">
              <Badge variant={selected ? 'warning' : 'neutral'} size="s">
                {team.sports} SPORTS
              </Badge>
              <Text
                variant="label-default-xs"
                style={{
                  color: selected
                    ? 'rgba(255,255,255,0.8)'
                    : 'var(--text-tertiary)',
                }}
              >
                EST. {team.founded}
              </Text>
            </Column>
          </Row>

          {/* Team info */}
          <Column gap="s">
            <GlitchFx trigger={selected ? 'hover' : 'custom'} speed="fast">
              <Heading
                variant="heading-strong-l"
                style={{ color: selected ? 'white' : 'inherit' }}
              >
                {team.name}
              </Heading>
            </GlitchFx>

            <Row gap="s" vertical="center">
              <Icon
                name="map-pin"
                size="xs"
                style={{
                  color: selected
                    ? 'rgba(255,255,255,0.8)'
                    : 'var(--text-tertiary)',
                }}
              />
              <Text
                variant="body-default-s"
                style={{
                  color: selected
                    ? 'rgba(255,255,255,0.8)'
                    : 'var(--text-secondary)',
                }}
              >
                {team.location}
              </Text>
            </Row>

            <Row gap="s" vertical="center">
              <Icon
                name="users"
                size="xs"
                style={{
                  color: selected
                    ? 'rgba(255,255,255,0.8)'
                    : 'var(--text-tertiary)',
                }}
              />
              <Text
                variant="body-default-s"
                style={{
                  color: selected
                    ? 'rgba(255,255,255,0.8)'
                    : 'var(--text-secondary)',
                }}
              >
                {team.enrollment.toLocaleString()} Students
              </Text>
            </Row>
          </Column>

          {/* Quick stats */}
          {selected && (
            <RevealFx speed="fast">
              <Grid columns={2} gap="s">
                <Card
                  padding="s"
                  radius="s"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <Column gap="xs" alignItems="center">
                    <Text
                      variant="label-default-xs"
                      style={{ color: 'rgba(255,255,255,0.8)' }}
                    >
                      Championships
                    </Text>
                    <Heading
                      variant="heading-strong-m"
                      style={{ color: 'white' }}
                    >
                      {team.stats.conferenceChampionships}
                    </Heading>
                  </Column>
                </Card>

                <Card
                  padding="s"
                  radius="s"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <Column gap="xs" alignItems="center">
                    <Text
                      variant="label-default-xs"
                      style={{ color: 'rgba(255,255,255,0.8)' }}
                    >
                      All-Americans
                    </Text>
                    <Heading
                      variant="heading-strong-m"
                      style={{ color: 'white' }}
                    >
                      {team.stats.allAmericans}
                    </Heading>
                  </Column>
                </Card>
              </Grid>
            </RevealFx>
          )}
        </Column>
      </Card>
    </TiltFx>
  );
};

// School detail panel
const SchoolDetailPanel: React.FC<{
  team: (typeof teams)[0];
}> = ({ team }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Card
      radius="l"
      padding="l"
      style={{
        background: 'rgba(var(--background-primary-rgb), 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(var(--accent-solid-strong-rgb), 0.3)',
        height: '100%',
      }}
    >
      <Column gap="l" fillWidth>
        {/* Header */}
        <Row horizontal="space-between" vertical="center">
          <Row gap="m" vertical="center">
            <TeamLogo team={team.logo} size={60} variant="light" />
            <Column gap="xs">
              <Heading variant="heading-strong-l">{team.name}</Heading>
              <Text variant="body-default-s" onBackground="neutral-medium">
                Member since 1996
              </Text>
            </Column>
          </Row>

          <Button variant="secondary" size="m" prefixIcon="external-link">
            Visit Website
          </Button>
        </Row>

        {/* Tab navigation */}
        <Row gap="s">
          <Chip
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Chip>
          <Chip
            active={activeTab === 'facilities'}
            onClick={() => setActiveTab('facilities')}
          >
            Facilities
          </Chip>
          <Chip
            active={activeTab === 'achievements'}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </Chip>
          <Chip
            active={activeTab === 'contacts'}
            onClick={() => setActiveTab('contacts')}
          >
            Contacts
          </Chip>
        </Row>

        {/* Tab content */}
        <Column gap="m">
          {activeTab === 'overview' && (
            <>
              <Grid columns={2} gap="m">
                <Column gap="xs">
                  <Text variant="label-default-s" onBackground="neutral-medium">
                    Overall Record
                  </Text>
                  <Heading variant="heading-strong-m">
                    {team.stats.overallRecord}
                  </Heading>
                </Column>
                <Column gap="xs">
                  <Text variant="label-default-s" onBackground="neutral-medium">
                    National Championships
                  </Text>
                  <Heading variant="heading-strong-m">
                    {team.stats.nationalChampionships}
                  </Heading>
                </Column>
              </Grid>

              <Column gap="xs">
                <Text variant="label-default-s" onBackground="neutral-medium">
                  School Colors
                </Text>
                <Row gap="s">
                  {team.colors.map((color, index) => (
                    <Flex
                      key={index}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-s)',
                        background: color,
                        border: '2px solid var(--border-medium)',
                      }}
                    />
                  ))}
                </Row>
              </Column>
            </>
          )}

          {activeTab === 'facilities' && (
            <Column gap="m">
              {team.facilities.map((facility, index) => (
                <Card
                  key={index}
                  background="transparent"
                  border="neutral-medium"
                  radius="m"
                  padding="m"
                >
                  <Row gap="s" vertical="center">
                    <Icon name="building" size="s" />
                    <Text variant="body-strong-s">{facility}</Text>
                  </Row>
                </Card>
              ))}
            </Column>
          )}

          {activeTab === 'achievements' && (
            <Column gap="m">
              {team.recentAchievements.map((achievement, index) => (
                <Row key={index} gap="s" vertical="center">
                  <Icon
                    name="trophy"
                    size="s"
                    style={{ color: 'var(--warning)' }}
                  />
                  <Text variant="body-default-s">{achievement}</Text>
                </Row>
              ))}
            </Column>
          )}
        </Column>
      </Column>
    </Card>
  );
};

export default function SpectacularTeamsShowcase() {
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Background
      style={{
        background: gradients.mesh,
        minHeight: '100vh',
      }}
    >
      <Column fillWidth gap="xl" padding="l">
        {/* Epic header */}
        <RevealFx speed="fast">
          <Card
            variant="secondary"
            radius="l"
            padding="l"
            style={{
              background: 'rgba(var(--background-secondary-rgb), 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(var(--brand-solid-strong-rgb), 0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Meteors number={20} />

            <Row fillWidth horizontal="space-between" vertical="center" wrap>
              <Column gap="s">
                <Row gap="m" vertical="center">
                  <GlitchFx speed="slow" continuous>
                    <Heading variant="display-strong-xl">
                      BIG 12 MEMBER SCHOOLS
                    </Heading>
                  </GlitchFx>
                  <HoloFx shine={{ opacity: 60 }}>
                    <Badge variant="info" size="l">
                      <Icon name="building" size="s" />
                      16 ELITE INSTITUTIONS
                    </Badge>
                  </HoloFx>
                </Row>
                <Text variant="body-default-m" onBackground="neutral-medium">
                  Showcasing the powerhouse programs of the Big 12 Conference
                </Text>
              </Column>

              <Row gap="m" vertical="center">
                <Input
                  placeholder="Search schools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  prefixIcon="search"
                  style={{ minWidth: '200px' }}
                />
                <SegmentedControl
                  buttons={[
                    { label: 'Grid', value: 'grid' },
                    { label: 'List', value: 'list' },
                    { label: 'Map', value: 'map' },
                  ]}
                  defaultValue="grid"
                  onToggle={setViewMode}
                />
              </Row>
            </Row>
          </Card>
        </RevealFx>

        {/* Conference stats overview */}
        <RevealFx speed="medium">
          <Grid columns={{ base: 1, s: 2, l: 4 }} gap="m">
            {[
              {
                label: 'Total Enrollment',
                value: '576K+',
                icon: 'users',
                color: 'var(--brand-solid-strong)',
              },
              {
                label: 'Combined Championships',
                value: '193',
                icon: 'trophy',
                color: 'var(--warning)',
              },
              {
                label: 'Athletic Programs',
                value: '286',
                icon: 'activity',
                color: 'var(--accent-solid-strong)',
              },
              {
                label: 'Annual Revenue',
                value: '$2.8B',
                icon: 'dollar-sign',
                color: 'var(--success)',
              },
            ].map((stat, index) => (
              <Card
                key={index}
                padding="m"
                radius="m"
                style={{
                  background: 'rgba(var(--background-secondary-rgb), 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border-medium)',
                }}
              >
                <Column gap="s" alignItems="center">
                  <Icon
                    name={stat.icon as any}
                    size="m"
                    style={{ color: stat.color }}
                  />
                  <GlitchFx trigger="hover" speed="fast">
                    <Heading
                      variant="display-strong-s"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </Heading>
                  </GlitchFx>
                  <Text variant="label-default-s" onBackground="neutral-medium">
                    {stat.label}
                  </Text>
                </Column>
              </Card>
            ))}
          </Grid>
        </RevealFx>

        {/* Main content */}
        <Grid columns={{ base: 1, l: 3 }} gap="l">
          {/* Teams grid - 2 columns */}
          <Column span={{ base: 1, l: 2 }}>
            <Column gap="l">
              <Row horizontal="space-between" vertical="center">
                <Heading variant="heading-strong-l">Select a School</Heading>
                <Text variant="body-default-s" onBackground="neutral-medium">
                  {filteredTeams.length} schools found
                </Text>
              </Row>

              <Grid columns={{ base: 1, m: 2 }} gap="m">
                {filteredTeams.map((team, index) => (
                  <RevealFx key={team.id} speed="fast" delay={index * 0.05}>
                    <Team3DCard
                      team={team}
                      selected={selectedTeam.id === team.id}
                      onSelect={() => setSelectedTeam(team)}
                    />
                  </RevealFx>
                ))}
              </Grid>
            </Column>
          </Column>

          {/* Selected team details - 1 column */}
          <Column>
            <RevealFx speed="medium" delay={0.2}>
              <SchoolDetailPanel team={selectedTeam} />
            </RevealFx>
          </Column>
        </Grid>

        {/* Conference unity message */}
        <RevealFx speed="medium" delay={0.3}>
          <Card
            radius="l"
            padding="l"
            style={{
              background: gradients.primary,
              border: 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <BorderBeam />

            <Row horizontal="center" vertical="center" padding="l">
              <Column gap="m" alignItems="center" maxWidth="l">
                <GlitchFx trigger="hover" speed="fast">
                  <Heading
                    variant="display-strong-l"
                    align="center"
                    style={{ color: 'white' }}
                  >
                    United in Excellence
                  </Heading>
                </GlitchFx>

                <Text
                  variant="body-default-l"
                  align="center"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  16 schools. One conference. Unlimited potential. Together,
                  we're shaping the future of collegiate athletics.
                </Text>

                <HoloFx shine={{ opacity: 80 }} burn={{ opacity: 60 }}>
                  <Button
                    variant="primary"
                    size="l"
                    suffixIcon="arrowRight"
                    style={{
                      background: 'white',
                      color: 'var(--neutral-background-strong)',
                      padding: 'var(--spacing-m) var(--spacing-xl)',
                    }}
                  >
                    Explore Conference History
                  </Button>
                </HoloFx>
              </Column>
            </Row>
          </Card>
        </RevealFx>
      </Column>
    </Background>
  );
}
