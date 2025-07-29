'use client';

import React from 'react';
import {
  Column,
  Row,
  Card,
  Heading,
  Text,
  Grid,
  Line,
  Avatar,
  Button,
  Scroller,
  StatusIndicator,
  Icon,
  LineChart,
} from '@once-ui-system/core';
import { Sidebar1, Header1 } from '.';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
  href?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  positive = true,
  href,
}) => (
  <Card
    minWidth={12}
    href={href}
    padding="20"
    gap="12"
    radius="l"
    fillWidth
    direction="column"
  >
    <Row vertical="center" gap="12">
      <Row
        fillWidth
        textVariant="label-default-s"
        onBackground="neutral-medium"
      >
        {title}
      </Row>
      <Row
        gap="8"
        vertical="center"
        onBackground={positive ? 'success-weak' : 'danger-weak'}
      >
        <Icon size="xs" name={positive ? 'trendUp' : 'trendDown'} />
        <Text variant="body-default-xs">{change}</Text>
      </Row>
    </Row>
    <Heading variant="display-strong-xs">{value}</Heading>
  </Card>
);

interface ActivityItemProps {
  avatar: string;
  action: string;
  time: string;
  href?: string;
  icon: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  avatar,
  action,
  time,
  href,
  icon,
}) => (
  <Card
    direction="column"
    href={href}
    background="transparent"
    border="transparent"
    fillWidth
  >
    <Row
      fillWidth
      horizontal="space-between"
      paddingX="24"
      height="64"
      vertical="center"
    >
      <Column fillWidth gap="8">
        <Text variant="body-default-s">{action}</Text>
        <Row vertical="center" gap="12" data-scaling="90">
          <Avatar size="xs" src={avatar} />
          <Text variant="label-default-s" onBackground="neutral-weak">
            {time}
          </Text>
        </Row>
      </Column>
      <Icon name={icon} size="xs" onBackground="neutral-weak" />
    </Row>
    <Line />
  </Card>
);

interface StatusItemProps {
  name: string;
  status: string;
  href?: string;
  icon: string;
}

const StatusItem: React.FC<StatusItemProps> = ({
  name,
  status,
  icon,
  href = '#',
}) => (
  <Card
    direction="column"
    background="transparent"
    href={href}
    border="transparent"
    fillWidth
  >
    <Row
      fillWidth
      horizontal="space-between"
      height="64"
      vertical="center"
      paddingX="24"
    >
      <Row vertical="center" gap="12">
        <Icon name={icon} size="xs" onBackground="neutral-weak" />
        <Text variant="body-default-s">{name}</Text>
      </Row>
      <Row vertical="center" gap="12">
        <Text variant="body-default-xs" onBackground="neutral-weak">
          {status}
        </Text>
        <StatusIndicator color={getStatusVariant(status)} />
      </Row>
    </Row>
    <Line />
  </Card>
);

const getStatusVariant = (
  status: string
): 'green' | 'yellow' | 'red' | 'gray' => {
  switch (status.toLowerCase()) {
    case 'on track':
      return 'green';
    case 'at risk':
      return 'red';
    case 'delayed':
      return 'gray';
    default:
      return 'gray';
  }
};

export const Dashboard1: React.FC = () => {
  return (
    <Column fillWidth style={{ minHeight: '100%' }}>
      <Header1 authenticated avatar="/images/creators/lorant.jpg" />
      <Row
        fillWidth
        style={{ minHeight: 'calc(100% - var(--static-space-64))' }}
      >
        <Row
          hide="m"
          maxWidth={16}
          horizontal="center"
          borderRight="neutral-medium"
          background="page"
        >
          <Sidebar1
            top="48"
            position="sticky"
            background="page"
            radius={undefined}
            fitHeight
          />
        </Row>
        <Row fillWidth horizontal="center" paddingX="l" paddingBottom="l">
          <Column fillWidth gap="m" maxWidth="xl">
            <Column fillWidth gap="8" paddingTop="24" paddingX="16">
              <Row
                vertical="center"
                fillWidth
                horizontal="space-between"
                gap="8"
                wrap
              >
                <Heading variant="display-strong-s">Dashboard</Heading>
                <Button prefixIcon="plus" size="s" data-border="rounded">
                  New{' '}
                  <Row hide="s" marginLeft="4">
                    Project
                  </Row>
                </Button>
              </Row>
              <Text variant="body-default-m" onBackground="neutral-medium">
                Welcome back, Alex! Here's what's happening today.
              </Text>
            </Column>

            <Scroller>
              <Row fitWidth flex={1} gap="8">
                {[
                  {
                    title: 'Conference Revenue',
                    value: '$2.4M',
                    change: '12.5%',
                    positive: true,
                  },
                  {
                    title: 'Active Events',
                    value: '28',
                    change: '8.3%',
                    positive: true,
                  },
                  {
                    title: 'Championships',
                    value: '16',
                    change: '1.8%',
                    positive: false,
                  },
                  {
                    title: 'Member Schools',
                    value: '16',
                    change: '0%',
                    positive: true,
                  },
                ].map((stat, index) => (
                  <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    change={stat.change}
                    positive={stat.positive}
                    href="#"
                  />
                ))}
              </Row>
            </Scroller>

            <LineChart
              minHeight={20}
              axis="x"
              title="Big 12 Operations Activity"
              description="January 2025"
              date={{
                start: new Date('2024-12-31'),
                end: new Date('2025-01-31'),
                format: 'MMM dd',
              }}
              series={[
                { key: 'Events Managed', color: 'green' },
                { key: 'Awards Processed', color: 'magenta' },
              ]}
              data={[
                {
                  date: '2025-01-01',
                  'Events Managed': 12,
                  'Awards Processed': 8,
                },
                {
                  date: '2025-01-02',
                  'Events Managed': 15,
                  'Awards Processed': 12,
                },
                {
                  date: '2025-01-03',
                  'Events Managed': 18,
                  'Awards Processed': 14,
                },
                {
                  date: '2025-01-04',
                  'Events Managed': 22,
                  'Awards Processed': 16,
                },
                {
                  date: '2025-01-05',
                  'Events Managed': 19,
                  'Awards Processed': 18,
                },
                {
                  date: '2025-01-06',
                  'Events Managed': 16,
                  'Awards Processed': 11,
                },
                {
                  date: '2025-01-07',
                  'Events Managed': 21,
                  'Awards Processed': 13,
                },
                {
                  date: '2025-01-08',
                  'Events Managed': 24,
                  'Awards Processed': 15,
                },
                {
                  date: '2025-01-09',
                  'Events Managed': 14,
                  'Awards Processed': 9,
                },
                {
                  date: '2025-01-10',
                  'Events Managed': 17,
                  'Awards Processed': 12,
                },
                {
                  date: '2025-01-11',
                  'Events Managed': 20,
                  'Awards Processed': 17,
                },
                {
                  date: '2025-01-12',
                  'Events Managed': 25,
                  'Awards Processed': 19,
                },
                {
                  date: '2025-01-13',
                  'Events Managed': 28,
                  'Awards Processed': 22,
                },
                {
                  date: '2025-01-14',
                  'Events Managed': 31,
                  'Awards Processed': 24,
                },
                {
                  date: '2025-01-15',
                  'Events Managed': 18,
                  'Awards Processed': 14,
                },
                {
                  date: '2025-01-16',
                  'Events Managed': 16,
                  'Awards Processed': 11,
                },
                {
                  date: '2025-01-17',
                  'Events Managed': 13,
                  'Awards Processed': 8,
                },
                {
                  date: '2025-01-18',
                  'Events Managed': 15,
                  'Awards Processed': 12,
                },
              ]}
            />

            <Grid columns="2" tabletColumns="1" gap="m" fillWidth>
              <Column
                fillWidth
                border="neutral-medium"
                radius="l"
                overflow="hidden"
                height={20}
              >
                <Row
                  vertical="center"
                  horizontal="space-between"
                  fillWidth
                  paddingLeft="24"
                  paddingRight="12"
                  paddingY="12"
                  gap="m"
                  wrap
                >
                  <Heading wrap="nowrap" variant="heading-strong-s">
                    Championship Status
                  </Heading>
                  <Row gap="4">
                    <Button weight="default" variant="secondary" size="s">
                      Weekly
                    </Button>
                    <Button weight="default" size="s">
                      Monthly
                    </Button>
                    <Button weight="default" variant="secondary" size="s">
                      Yearly
                    </Button>
                  </Row>
                </Row>

                <Column fillWidth borderTop="neutral-medium" overflowY="auto">
                  {[
                    {
                      name: "Men's Basketball Tournament",
                      status: 'On Track',
                      icon: 'dribbble',
                    },
                    {
                      name: 'Football Championship',
                      status: 'On Track',
                      icon: 'football',
                    },
                    {
                      name: "Women's Soccer Finals",
                      status: 'At Risk',
                      icon: 'football',
                    },
                    {
                      name: 'Baseball Season',
                      status: 'On Track',
                      icon: 'baseball',
                    },
                    {
                      name: 'Track & Field Championships',
                      status: 'Delayed',
                      icon: 'flag',
                    },
                    {
                      name: 'Swimming & Diving',
                      status: 'On Track',
                      icon: 'waves',
                    },
                  ].map((project, index) => (
                    <StatusItem
                      key={index}
                      name={project.name}
                      status={project.status}
                      icon={project.icon}
                    />
                  ))}
                </Column>
              </Column>

              <Column
                border="neutral-medium"
                radius="l"
                fillWidth
                overflow="hidden"
                height={20}
              >
                <Row
                  fillWidth
                  vertical="center"
                  horizontal="space-between"
                  paddingLeft="24"
                  paddingRight="12"
                  paddingY="12"
                  gap="16"
                  wrap
                >
                  <Heading wrap="nowrap" variant="heading-strong-s">
                    Recent activity
                  </Heading>
                  <Button
                    size="s"
                    weight="default"
                    variant="secondary"
                    suffixIcon="chevronRight"
                  >
                    View all
                  </Button>
                </Row>
                <Column fillWidth borderTop="neutral-medium" overflowY="auto">
                  {[
                    {
                      avatar: '/images/creators/lorant.jpg',
                      action: 'Processed championship credentials for Kansas',
                      time: '2 hours ago',
                      icon: 'check',
                    },
                    {
                      avatar: '/images/creators/vincent.jpg',
                      action: 'Updated travel arrangements for Houston',
                      time: '4 hours ago',
                      icon: 'map-pin',
                    },
                    {
                      avatar: '/images/creators/zsofia.jpg',
                      action: 'Created new award category for Basketball',
                      time: 'Yesterday',
                      icon: 'trophy',
                    },
                    {
                      avatar: '/images/creators/texz.jpg',
                      action: 'Completed 5 award distributions',
                      time: 'Yesterday',
                      icon: 'check',
                    },
                    {
                      avatar: '/images/creators/justin.jpg',
                      action: 'Scheduled venue inspection for TCU',
                      time: '2 days ago',
                      icon: 'calendar',
                    },
                    {
                      avatar: '/images/creators/zsofia.jpg',
                      action: 'Updated Big 12 conference standings',
                      time: '4 days ago',
                      icon: 'trending-up',
                    },
                  ].map((activity, index) => (
                    <ActivityItem
                      key={index}
                      avatar={activity.avatar}
                      action={activity.action}
                      time={activity.time}
                      icon={activity.icon}
                    />
                  ))}
                </Column>
              </Column>
            </Grid>
          </Column>
        </Row>
      </Row>
    </Column>
  );
};
