"use client";

import React, { useState, useEffect } from "react";
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
  Tag,
  Badge,
  Scroller,
  LineChart,
  BarChart,
  Background,
  Icon,
  StatusIndicator,
  Flex,
  Logo,
  Fade,
  SegmentedControl,
  Skeleton,
  InteractiveDetails,
  Chip,
  Tooltip
} from "@once-ui-system/core";
import { RevealFx, GlitchFx, HoloFx, TiltFx } from "@/components/effects";
import { BorderBeam } from "@/components/ui/Concepts/border-beam";
import { TeamLogo } from "@/components/ui/TeamLogo";

// Dynamic gradients with brand colors
const gradients = {
  primary: "linear-gradient(135deg, var(--brand-electric-500) 0%, var(--brand-purple-600) 50%, var(--brand-midnight-800) 100%)",
  secondary: "radial-gradient(circle at 20% 80%, var(--brand-electric-400) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--brand-purple-500) 0%, transparent 50%)",
  mesh: "radial-gradient(at 40% 20%, var(--brand-electric-500) 0px, transparent 50%), radial-gradient(at 80% 0%, var(--brand-midnight-600) 0px, transparent 50%)",
  card: "linear-gradient(145deg, rgba(var(--brand-midnight-800-rgb), 0.9) 0%, rgba(var(--brand-purple-900-rgb), 0.4) 100%)",
};

// Live data simulation
const generateLiveData = () => ({
  revenue: Math.floor(Math.random() * 5000) + 20000,
  activeEvents: Math.floor(Math.random() * 10) + 20,
  operations: Math.floor(Math.random() * 20) + 140,
  tickets: Math.floor(Math.random() * 1000) + 5000,
});

// Premium stat card with holographic effects
const StatCard: React.FC<{
  title: string;
  value: string | number;
  change: string;
  positive?: boolean;
  icon: string;
  color: string;
  live?: boolean;
}> = ({ title, value, change, positive = true, icon, color, live }) => {
  const [currentValue, setCurrentValue] = useState(value);
  
  useEffect(() => {
    if (live) {
      const interval = setInterval(() => {
        setCurrentValue(prev => {
          const num = typeof prev === 'string' ? parseInt(prev.replace(/\D/g, '')) : prev;
          const fluctuation = Math.floor(Math.random() * 100) - 50;
          return typeof value === 'string' ? `$${(num + fluctuation).toLocaleString()}` : num + fluctuation;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [live, value]);

  return (
    <TiltFx>
      <Card 
        radius="l" 
        padding="l"
        style={{
          background: "rgba(var(--background-primary-rgb), 0.8)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${color}30`,
          position: "relative",
          overflow: "hidden",
          height: "100%",
        }}
      >
        <BorderBeam />
        <Column gap="m" fillWidth>
          <Row vertical="center" horizontal="space-between" fillWidth>
            <HoloFx shine={{ opacity: 40 }}>
              <Flex
                alignItems="center"
                justifyContent="center"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-m)",
                  background: `${color}20`,
                }}
              >
                <Icon name={icon as any} size="m" style={{ color }} />
              </Flex>
            </HoloFx>
            <Tag
              size="s"
              variant={positive ? "success" : "danger"}
              prefixIcon={positive ? "trending-up" : "trending-down"}
            >
              {change}
            </Tag>
          </Row>
          
          <Column gap="xs">
            <Text variant="label-default-s" onBackground="neutral-medium">{title}</Text>
            <Row alignItems="baseline" gap="s">
              <GlitchFx trigger={live ? "custom" : "hover"} interval={5000} speed="fast">
                <Heading variant="display-strong-m" style={{ color }}>
                  {currentValue}
                </Heading>
              </GlitchFx>
              {live && (
                <Flex gap="xs" alignItems="center">
                  <StatusIndicator variant="success" size="s" />
                  <Text variant="label-default-xs" onBackground="neutral-weak">LIVE</Text>
                </Flex>
              )}
            </Row>
          </Column>
        </Column>
      </Card>
    </TiltFx>
  );
};

// Team performance card
const TeamPerformanceCard: React.FC<{
  team: string;
  logo: string;
  wins: number;
  losses: number;
  rank: number;
  trend: "up" | "down" | "stable";
}> = ({ team, logo, wins, losses, rank, trend }) => (
  <RevealFx speed="fast">
    <Card
      href="#"
      background="transparent"
      border="neutral-medium"
      radius="m"
      padding="m"
      style={{
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "var(--brand-electric-500)",
        }
      }}
    >
      <Row gap="m" vertical="center" fillWidth>
        <HoloFx shine={{ opacity: 20 }}>
          <TeamLogo team={logo} size={40} variant="light" />
        </HoloFx>
        
        <Column flex={1} gap="xs">
          <Text variant="body-strong-s">{team}</Text>
          <Row gap="m">
            <Text variant="label-default-xs" onBackground="neutral-medium">
              {wins}-{losses}
            </Text>
            <Badge size="s" variant="neutral">Rank #{rank}</Badge>
          </Row>
        </Column>
        
        <Icon 
          name={trend === "up" ? "trending-up" : trend === "down" ? "trending-down" : "minus"}
          size="s"
          style={{ 
            color: trend === "up" ? "var(--success)" : trend === "down" ? "var(--danger)" : "var(--neutral-medium)" 
          }}
        />
      </Row>
    </Card>
  </RevealFx>
);

// Championship event card
const ChampionshipCard: React.FC<{
  sport: string;
  date: string;
  venue: string;
  status: "upcoming" | "live" | "completed";
  icon: string;
}> = ({ sport, date, venue, status, icon }) => (
  <Card
    href="#"
    radius="m"
    padding="m"
    style={{
      background: status === "live" 
        ? "linear-gradient(135deg, rgba(var(--brand-electric-500-rgb), 0.1) 0%, rgba(var(--brand-purple-600-rgb), 0.1) 100%)"
        : "rgba(var(--background-secondary-rgb), 0.6)",
      border: status === "live" ? "1px solid var(--brand-electric-500)" : "1px solid var(--border-medium)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    
    <Column gap="m">
      <Row vertical="center" horizontal="space-between">
        <Row gap="s" vertical="center">
          <Icon name={icon as any} size="s" style={{ color: "var(--brand-electric-500)" }} />
          <Heading variant="heading-strong-s">{sport}</Heading>
        </Row>
        <Badge 
          variant={status === "live" ? "danger" : status === "upcoming" ? "info" : "success"}
          size="s"
        >
          {status === "live" && <StatusIndicator variant="danger" size="s" />}
          {status.toUpperCase()}
        </Badge>
      </Row>
      
      <Column gap="xs">
        <Row gap="xs" vertical="center">
          <Icon name="calendar" size="xs" />
          <Text variant="body-default-xs" onBackground="neutral-medium">{date}</Text>
        </Row>
        <Row gap="xs" vertical="center">
          <Icon name="map-pin" size="xs" />
          <Text variant="body-default-xs" onBackground="neutral-medium">{venue}</Text>
        </Row>
      </Column>
    </Column>
  </Card>
);

export default function SpectacularDashboard() {
  const [timeRange, setTimeRange] = useState("week");
  const [liveRevenue, setLiveRevenue] = useState(24345);
  const [selectedSport, setSelectedSport] = useState("all");

  // Simulate live revenue updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveRevenue(prev => prev + Math.floor(Math.random() * 200) - 50);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: "Total Revenue",
      value: `$${liveRevenue.toLocaleString()}`,
      change: "+12.5%",
      positive: true,
      icon: "coins",
      color: "var(--brand-electric-500)",
      live: true,
    },
    {
      title: "Active Events",
      value: "28",
      change: "+4",
      positive: true,
      icon: "calendar",
      color: "var(--brand-purple-500)",
      live: false,
    },
    {
      title: "Member Schools",
      value: "16",
      change: "0",
      positive: true,
      icon: "building",
      color: "var(--brand-midnight-600)",
      live: false,
    },
    {
      title: "Operations",
      value: "156",
      change: "+18",
      positive: true,
      icon: "activity",
      color: "var(--brand-electric-400)",
      live: true,
    },
  ];

  const topTeams = [
    { team: "Kansas", logo: "kansas", wins: 24, losses: 5, rank: 1, trend: "up" as const },
    { team: "Houston", logo: "houston", wins: 23, losses: 6, rank: 2, trend: "stable" as const },
    { team: "Baylor", logo: "baylor", wins: 22, losses: 7, rank: 3, trend: "up" as const },
    { team: "Texas Tech", logo: "texas_tech", wins: 21, losses: 8, rank: 4, trend: "down" as const },
  ];

  const upcomingEvents = [
    { sport: "Basketball", date: "Feb 15, 2025", venue: "Allen Fieldhouse", status: "live" as const, icon: "dribbble" },
    { sport: "Football", date: "Feb 20, 2025", venue: "McLane Stadium", status: "upcoming" as const, icon: "football" },
    { sport: "Baseball", date: "Mar 1, 2025", venue: "Minute Maid Park", status: "upcoming" as const, icon: "baseball" },
    { sport: "Track & Field", date: "Mar 5, 2025", venue: "Drake Stadium", status: "upcoming" as const, icon: "flag" },
  ];

  return (
    <Background
      style={{
        background: gradients.mesh,
        minHeight: "100vh",
      }}
    >
      <Column fillWidth gap="xl" padding="l">
        {/* Header Section */}
        <RevealFx speed="fast">
          <Card
            variant="secondary"
            radius="l"
            padding="l"
            style={{
              background: "rgba(var(--background-secondary-rgb), 0.6)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(var(--brand-electric-500-rgb), 0.2)",
            }}
          >
            <Row fillWidth horizontal="space-between" vertical="center" wrap>
              <Column gap="s">
                <Row gap="m" vertical="center">
                  <GlitchFx speed="slow" interval={8000} trigger="custom">
                    <Heading variant="display-strong-l">
                      Operations Command Center
                    </Heading>
                  </GlitchFx>
                  <Badge variant="success" size="m">
                    <StatusIndicator variant="success" size="s" />
                    ALL SYSTEMS OPERATIONAL
                  </Badge>
                </Row>
                <Text variant="body-default-m" onBackground="neutral-medium">
                  Real-time monitoring and analytics for Big 12 Conference operations
                </Text>
              </Column>
              
              <Row gap="m">
                <SegmentedControl
                  buttons={[
                    { label: "Week", value: "week" },
                    { label: "Month", value: "month" },
                    { label: "Year", value: "year" },
                  ]}
                  defaultValue="week"
                  onToggle={setTimeRange}
                />
                <HoloFx shine={{ opacity: 60 }} burn={{ opacity: 40 }}>
                  <Button
                    variant="primary"
                    size="m"
                    prefixIcon="sparkles"
                    style={{
                      background: gradients.primary,
                      border: "none",
                    }}
                  >
                    AI Insights
                  </Button>
                </HoloFx>
              </Row>
            </Row>
          </Card>
        </RevealFx>

        {/* Stats Grid */}
        <Grid columns={{ base: 1, s: 2, l: 4 }} gap="m">
          {stats.map((stat, index) => (
            <RevealFx key={index} speed="fast" delay={index * 0.1}>
              <StatCard {...stat} />
            </RevealFx>
          ))}
        </Grid>

        {/* Main Content Grid */}
        <Grid columns={{ base: 1, l: 3 }} gap="l">
          {/* Revenue Analytics - 2 columns */}
          <Column span={{ base: 1, l: 2 }} gap="m">
            <RevealFx speed="medium">
              <Card
                radius="l"
                padding="l"
                style={{
                  background: "rgba(var(--background-primary-rgb), 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(var(--brand-purple-500-rgb), 0.3)",
                  height: "100%",
                }}
              >
                <Column gap="l" fillWidth>
                  <Row horizontal="space-between" vertical="center">
                    <Column gap="xs">
                      <Heading variant="heading-strong-l">Revenue Analytics</Heading>
                      <Text variant="body-default-s" onBackground="neutral-medium">
                        Live tracking across all revenue streams
                      </Text>
                    </Column>
                    <Row gap="s">
                      <Chip active>TV Rights</Chip>
                      <Chip>Tickets</Chip>
                      <Chip>Sponsorships</Chip>
                    </Row>
                  </Row>

                  <LineChart
                    minHeight={20}
                    axis="x"
                    legend={{
                      display: true,
                      position: "top",
                    }}
                    date={{
                      start: new Date("2025-01-01"),
                      end: new Date("2025-01-31"),
                      format: "dd MMM"
                    }}
                    series={[
                      { key: "TV Rights", color: "var(--brand-electric-500)" },
                      { key: "Ticket Sales", color: "var(--brand-purple-500)" },
                      { key: "Sponsorships", color: "var(--brand-midnight-600)" }
                    ]}
                    data={[
                      { date: "2025-01-01", "TV Rights": 8654, "Ticket Sales": 4365, "Sponsorships": 2341 },
                      { date: "2025-01-05", "TV Rights": 9875, "Ticket Sales": 5457, "Sponsorships": 3452 },
                      { date: "2025-01-10", "TV Rights": 10234, "Ticket Sales": 6137, "Sponsorships": 4123 },
                      { date: "2025-01-15", "TV Rights": 11543, "Ticket Sales": 7023, "Sponsorships": 4532 },
                      { date: "2025-01-20", "TV Rights": 12234, "Ticket Sales": 8142, "Sponsorships": 5234 },
                      { date: "2025-01-25", "TV Rights": 13421, "Ticket Sales": 8956, "Sponsorships": 5867 },
                      { date: "2025-01-30", "TV Rights": 14567, "Ticket Sales": 9234, "Sponsorships": 6234 },
                    ]}
                  />

                  <Grid columns={3} gap="m">
                    {[
                      { label: "Peak Revenue", value: "$14.5K", icon: "trending-up", color: "var(--success)" },
                      { label: "Avg. Daily", value: "$9.8K", icon: "chart-bar", color: "var(--info)" },
                      { label: "Growth Rate", value: "+23%", icon: "activity", color: "var(--brand-electric-500)" },
                    ].map((metric, index) => (
                      <Card
                        key={index}
                        padding="m"
                        radius="m"
                        style={{
                          background: "rgba(var(--background-secondary-rgb), 0.4)",
                          border: "1px solid var(--border-medium)",
                        }}
                      >
                        <Column gap="xs" alignItems="center">
                          <Icon name={metric.icon as any} size="s" style={{ color: metric.color }} />
                          <Text variant="label-default-xs" onBackground="neutral-medium">{metric.label}</Text>
                          <Heading variant="heading-strong-m">{metric.value}</Heading>
                        </Column>
                      </Card>
                    ))}
                  </Grid>
                </Column>
              </Card>
            </RevealFx>
          </Column>

          {/* Championship Events - 1 column */}
          <Column gap="m">
            <RevealFx speed="medium" delay={0.2}>
              <Card
                radius="l"
                style={{
                  background: "rgba(var(--background-primary-rgb), 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(var(--brand-electric-500-rgb), 0.3)",
                  overflow: "hidden",
                }}
              >
                <Column>
                  <Row horizontal="space-between" vertical="center" padding="l" paddingBottom="m">
                    <Heading variant="heading-strong-l">Championships</Heading>
                    <Button variant="ghost" size="s" suffixIcon="chevronRight">
                      View All
                    </Button>
                  </Row>
                  
                  <Column gap="xs">
                    {upcomingEvents.map((event, index) => (
                      <React.Fragment key={index}>
                        <ChampionshipCard {...event} />
                        {index < upcomingEvents.length - 1 && <Line />}
                      </React.Fragment>
                    ))}
                  </Column>
                </Column>
              </Card>
            </RevealFx>
          </Column>
        </Grid>

        {/* Bottom Section */}
        <Grid columns={{ base: 1, m: 2 }} gap="l">
          {/* Team Rankings */}
          <RevealFx speed="medium" delay={0.3}>
            <Card
              radius="l"
              style={{
                background: "rgba(var(--background-primary-rgb), 0.8)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(var(--brand-purple-500-rgb), 0.3)",
                overflow: "hidden",
              }}
            >
              <Column>
                <Row horizontal="space-between" vertical="center" padding="l" paddingBottom="m">
                  <Column gap="xs">
                    <Heading variant="heading-strong-l">Basketball Rankings</Heading>
                    <Text variant="body-default-s" onBackground="neutral-medium">Current Season</Text>
                  </Column>
                  <Row gap="s">
                    <Button variant="ghost" size="s">Men's</Button>
                    <Button variant="secondary" size="s">Women's</Button>
                  </Row>
                </Row>
                
                <Column gap="xs" paddingX="m" paddingBottom="m">
                  {topTeams.map((team, index) => (
                    <TeamPerformanceCard key={index} {...team} />
                  ))}
                </Column>
              </Column>
            </Card>
          </RevealFx>

          {/* Operations Overview */}
          <RevealFx speed="medium" delay={0.4}>
            <Card
              radius="l"
              style={{
                background: "rgba(var(--background-primary-rgb), 0.8)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(var(--brand-midnight-600-rgb), 0.3)",
              }}
            >
              <Column padding="l" gap="l">
                <Column gap="xs">
                  <Heading variant="heading-strong-l">Operations Status</Heading>
                  <Text variant="body-default-s" onBackground="neutral-medium">
                    Real-time operational metrics
                  </Text>
                </Column>

                <Column gap="m">
                  {[
                    { label: "Credential Processing", value: 89, status: "healthy" },
                    { label: "Travel Coordination", value: 76, status: "warning" },
                    { label: "Award Fulfillment", value: 94, status: "healthy" },
                    { label: "System Performance", value: 98, status: "healthy" },
                  ].map((metric, index) => (
                    <Column key={index} gap="s">
                      <Row horizontal="space-between" vertical="center">
                        <Text variant="body-default-s">{metric.label}</Text>
                        <Badge 
                          variant={metric.status === "healthy" ? "success" : "warning"} 
                          size="s"
                        >
                          {metric.value}%
                        </Badge>
                      </Row>
                      <div 
                        style={{
                          width: "100%",
                          height: "4px",
                          backgroundColor: "var(--neutral-border-medium)",
                          borderRadius: "2px",
                          overflow: "hidden"
                        }}
                      >
                        <div
                          style={{
                            width: `${metric.value}%`,
                            height: "100%",
                            backgroundColor: "var(--brand-electric-500)",
                            borderRadius: "2px"
                          }}
                        />
                      </div>
                    </Column>
                  ))}
                </Column>

                <Card
                  padding="m"
                  radius="m"
                  style={{
                    background: gradients.primary,
                    border: "none",
                  }}
                >
                  <Row gap="m" vertical="center">
                    <Icon name="sparkles" size="m" />
                    <Column flex={1} gap="xs">
                      <Text variant="body-strong-s" style={{ color: "white" }}>
                        AI Optimization Available
                      </Text>
                      <Text variant="body-default-xs" style={{ color: "rgba(255,255,255,0.8)" }}>
                        Improve efficiency by 23% with Aura AI
                      </Text>
                    </Column>
                    <Icon name="chevronRight" size="s" />
                  </Row>
                </Card>
              </Column>
            </Card>
          </RevealFx>
        </Grid>
      </Column>
    </Background>
  );
}