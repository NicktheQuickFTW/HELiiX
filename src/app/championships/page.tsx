"use client";

import React, { useState, useEffect } from "react";
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
  InteractiveDetails,
  Scroller,
  Select,
  Option
} from "@once-ui-system/core";
import { RevealFx, GlitchFx, HoloFx, TiltFx } from "@/components/effects";
import { BorderBeam } from "@/components/ui/Concepts/border-beam";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Meteors } from "@/components/ui/meteors";
import { TeamLogo } from "@/components/ui/TeamLogo";

// Championship gradients
const gradients = {
  primary: "linear-gradient(135deg, var(--brand-electric-500) 0%, var(--brand-purple-600) 50%, var(--brand-midnight-800) 100%)",
  live: "linear-gradient(135deg, #FF0000 0%, #FF4444 50%, #FF8888 100%)",
  upcoming: "linear-gradient(135deg, #0099FF 0%, #0066CC 50%, #003399 100%)",
  completed: "linear-gradient(135deg, #00CC66 0%, #009944 50%, #006622 100%)",
  mesh: "radial-gradient(at 40% 20%, var(--brand-electric-500) 0px, transparent 50%), radial-gradient(at 80% 0%, var(--brand-midnight-600) 0px, transparent 50%)",
};

// Championship event card with live updates
const ChampionshipEventCard: React.FC<{
  event: {
    id: string;
    sport: string;
    title: string;
    status: "live" | "upcoming" | "completed";
    date: string;
    time: string;
    venue: string;
    teams?: { name: string; logo: string; score?: number }[];
    attendance?: number;
    capacity?: number;
    broadcast?: string[];
  };
  featured?: boolean;
}> = ({ event, featured }) => {
  const [liveScore1, setLiveScore1] = useState(event.teams?.[0]?.score || 0);
  const [liveScore2, setLiveScore2] = useState(event.teams?.[1]?.score || 0);
  const [timeLeft, setTimeLeft] = useState("15:42");

  useEffect(() => {
    if (event.status === "live" && event.teams) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          if (Math.random() > 0.5) {
            setLiveScore1(prev => prev + (Math.random() > 0.3 ? 3 : 2));
          } else {
            setLiveScore2(prev => prev + (Math.random() > 0.3 ? 3 : 2));
          }
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [event.status, event.teams]);

  const statusConfig = {
    live: { gradient: gradients.live, label: "LIVE", icon: "radio" },
    upcoming: { gradient: gradients.upcoming, label: "UPCOMING", icon: "calendar" },
    completed: { gradient: gradients.completed, label: "FINAL", icon: "check-circle" },
  };

  const config = statusConfig[event.status];

  return (
    <TiltFx>
      <Card
        radius="l"
        padding={featured ? "xl" : "l"}
        style={{
          background: "rgba(var(--background-primary-rgb), 0.8)",
          backdropFilter: "blur(20px)",
          border: event.status === "live" 
            ? "2px solid var(--danger)" 
            : "1px solid rgba(var(--border-medium-rgb), 0.3)",
          position: "relative",
          overflow: "hidden",
          minHeight: featured ? "300px" : "200px",
        }}
      >
        {event.status === "live" && <AnimatedBeam />}
        
        <Column gap="l" fillWidth fillHeight>
          {/* Header */}
          <Row horizontal="space-between" vertical="center">
            <Row gap="m" vertical="center">
              <HoloFx shine={{ opacity: event.status === "live" ? 60 : 30 }}>
                <Icon 
                  name={event.sport === "basketball" ? "dribbble" : event.sport === "football" ? "football" : "trophy"} 
                  size={featured ? "l" : "m"} 
                  style={{ color: "var(--brand-electric-500)" }}
                />
              </HoloFx>
              <Column gap="xs">
                <Heading variant={featured ? "heading-strong-l" : "heading-strong-m"}>
                  {event.title}
                </Heading>
                <Text variant="body-default-s" onBackground="neutral-medium">
                  {event.venue}
                </Text>
              </Column>
            </Row>
            
            <Badge 
              variant={event.status === "live" ? "danger" : event.status === "upcoming" ? "info" : "success"}
              size={featured ? "m" : "s"}
            >
              {event.status === "live" && <StatusIndicator variant="danger" size="s" />}
              {config.label}
            </Badge>
          </Row>

          {/* Teams/Scores */}
          {event.teams && (
            <Card
              padding="m"
              radius="m"
              style={{
                background: event.status === "live" 
                  ? "rgba(var(--danger-rgb), 0.1)" 
                  : "rgba(var(--background-secondary-rgb), 0.4)",
                border: "1px solid var(--border-medium)",
              }}
            >
              <Column gap="m">
                {event.status === "live" && (
                  <Row horizontal="center">
                    <GlitchFx trigger="custom" interval={10000} speed="fast">
                      <Text variant="body-strong-s" style={{ color: "var(--danger)" }}>
                        {timeLeft} - 2nd Half
                      </Text>
                    </GlitchFx>
                  </Row>
                )}
                
                <Row horizontal="space-between" vertical="center">
                  {event.teams.map((team, index) => (
                    <React.Fragment key={index}>
                      <Row gap="m" vertical="center" flex={1} justifyContent={index === 0 ? "flex-start" : "flex-end"}>
                        {index === 0 && (
                          <>
                            <TeamLogo team={team.logo} size={featured ? 60 : 40} variant="light" />
                            <Column gap="xs">
                              <Text variant="body-strong-s">{team.name}</Text>
                              {event.status !== "upcoming" && (
                                <Heading 
                                  variant={featured ? "display-strong-m" : "heading-strong-l"}
                                  style={{ color: event.status === "live" ? "var(--danger)" : "inherit" }}
                                >
                                  {event.status === "live" ? liveScore1 : team.score}
                                </Heading>
                              )}
                            </Column>
                          </>
                        )}
                        
                        {index === 1 && (
                          <>
                            <Column gap="xs" alignItems="flex-end">
                              <Text variant="body-strong-s">{team.name}</Text>
                              {event.status !== "upcoming" && (
                                <Heading 
                                  variant={featured ? "display-strong-m" : "heading-strong-l"}
                                  style={{ color: event.status === "live" ? "var(--danger)" : "inherit" }}
                                >
                                  {event.status === "live" ? liveScore2 : team.score}
                                </Heading>
                              )}
                            </Column>
                            <TeamLogo team={team.logo} size={featured ? 60 : 40} variant="light" />
                          </>
                        )}
                      </Row>
                      
                      {index === 0 && (
                        <Flex 
                          alignItems="center" 
                          justifyContent="center"
                          style={{ padding: "0 16px" }}
                        >
                          <Text variant="body-strong-l" onBackground="neutral-medium">
                            {event.status === "upcoming" ? "VS" : "-"}
                          </Text>
                        </Flex>
                      )}
                    </React.Fragment>
                  ))}
                </Row>
              </Column>
            </Card>
          )}

          {/* Event details */}
          <Column gap="s">
            <Row gap="m" wrap>
              <Row gap="xs" vertical="center">
                <Icon name="calendar" size="xs" />
                <Text variant="body-default-xs" onBackground="neutral-medium">{event.date}</Text>
              </Row>
              <Row gap="xs" vertical="center">
                <Icon name="clock" size="xs" />
                <Text variant="body-default-xs" onBackground="neutral-medium">{event.time}</Text>
              </Row>
              {event.attendance && (
                <Row gap="xs" vertical="center">
                  <Icon name="users" size="xs" />
                  <Text variant="body-default-xs" onBackground="neutral-medium">
                    {event.attendance.toLocaleString()}/{event.capacity?.toLocaleString()}
                  </Text>
                </Row>
              )}
            </Row>
            
            {event.broadcast && (
              <Row gap="s">
                <Icon name="tv" size="xs" />
                {event.broadcast.map((channel, index) => (
                  <Tag key={index} size="xs" variant="neutral">{channel}</Tag>
                ))}
              </Row>
            )}
          </Column>
        </Column>
      </Card>
    </TiltFx>
  );
};

// Credential stats card
const CredentialStatsCard: React.FC<{
  title: string;
  value: number;
  total: number;
  icon: string;
  color: string;
}> = ({ title, value, total, icon, color }) => {
  const percentage = (value / total) * 100;

  return (
    <Card
      padding="l"
      radius="m"
      style={{
        background: "rgba(var(--background-secondary-rgb), 0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid var(--border-medium)",
      }}
    >
      <Column gap="m">
        <Row horizontal="space-between" vertical="center">
          <Row gap="s" vertical="center">
            <Icon name={icon as any} size="s" style={{ color }} />
            <Text variant="body-strong-s">{title}</Text>
          </Row>
          <Tag size="s" variant="neutral">
            {percentage.toFixed(0)}%
          </Tag>
        </Row>
        
        <Column gap="xs">
          <Row horizontal="space-between">
            <Text variant="label-default-xs" onBackground="neutral-medium">Issued</Text>
            <Text variant="label-default-xs">{value.toLocaleString()} / {total.toLocaleString()}</Text>
          </Row>
          <ProgressBar size="s" value={percentage} variant="info" />
        </Column>
      </Column>
    </Card>
  );
};

export default function SpectacularChampionshipPortal() {
  const [viewMode, setViewMode] = useState("events");
  const [sportFilter, setSportFilter] = useState("all");
  const [tickerMessage, setTickerMessage] = useState(0);

  const tickerMessages = [
    "🏀 Kansas leads Houston 72-68 with 5:23 remaining in Men's Basketball Championship",
    "🏈 Football Championship tickets now on sale - Limited availability",
    "🏆 Baseball Championship moved to prime time slot on ESPN",
    "📺 All championship events will be broadcast on ESPN+ and Big 12 Network",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerMessage(prev => (prev + 1) % tickerMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const events = [
    {
      id: "1",
      sport: "basketball",
      title: "Men's Basketball Championship",
      status: "live" as const,
      date: "March 15, 2025",
      time: "7:00 PM CT",
      venue: "T-Mobile Center, Kansas City",
      teams: [
        { name: "Kansas", logo: "kansas", score: 72 },
        { name: "Houston", logo: "houston", score: 68 },
      ],
      attendance: 18972,
      capacity: 19000,
      broadcast: ["ESPN", "Big 12 Now"],
    },
    {
      id: "2",
      sport: "football",
      title: "Football Championship",
      status: "upcoming" as const,
      date: "December 7, 2025",
      time: "11:00 AM CT",
      venue: "AT&T Stadium, Arlington",
      teams: [
        { name: "Texas Tech", logo: "texas_tech" },
        { name: "Oklahoma State", logo: "oklahoma_state" },
      ],
      broadcast: ["ABC", "ESPN+"],
    },
    {
      id: "3",
      sport: "baseball",
      title: "Baseball Championship Game 3",
      status: "completed" as const,
      date: "May 28, 2025",
      time: "6:00 PM CT",
      venue: "Globe Life Field, Arlington",
      teams: [
        { name: "TCU", logo: "tcu", score: 8 },
        { name: "West Virginia", logo: "west_virginia", score: 6 },
      ],
      attendance: 12543,
      capacity: 15000,
      broadcast: ["ESPN2"],
    },
  ];

  return (
    <Background
      style={{
        background: gradients.mesh,
        minHeight: "100vh",
      }}
    >
      <Column fillWidth gap="xl" padding="l">
        {/* Championship header with ticker */}
        <RevealFx speed="fast">
          <Card
            variant="secondary"
            radius="l"
            style={{
              background: "rgba(var(--background-secondary-rgb), 0.6)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(var(--brand-electric-500-rgb), 0.3)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Column>
              <Row fillWidth padding="l" horizontal="space-between" vertical="center" wrap>
                <Column gap="s">
                  <Row gap="m" vertical="center">
                    <GlitchFx speed="medium" continuous>
                      <Heading variant="display-strong-xl">
                        CHAMPIONSHIP CENTRAL
                      </Heading>
                    </GlitchFx>
                    <HoloFx shine={{ opacity: 80 }}>
                      <Badge variant="danger" size="l">
                        <StatusIndicator variant="danger" size="s" />
                        3 LIVE EVENTS
                      </Badge>
                    </HoloFx>
                  </Row>
                </Column>
                
                <Row gap="m">
                  <SegmentedControl
                    buttons={[
                      { label: "Events", value: "events" },
                      { label: "Credentials", value: "credentials" },
                      { label: "Broadcast", value: "broadcast" },
                    ]}
                    defaultValue="events"
                    onToggle={setViewMode}
                  />
                  <Button
                    variant="primary"
                    size="m"
                    prefixIcon="ticket"
                    style={{
                      background: gradients.primary,
                      border: "none",
                    }}
                  >
                    Manage Tickets
                  </Button>
                </Row>
              </Row>
              
              {/* Live ticker */}
              <div
                style={{
                  background: "rgba(var(--danger-rgb), 0.1)",
                  borderTop: "1px solid var(--danger)",
                  padding: "12px 24px",
                  overflow: "hidden",
                }}
              >
                <Scroller speed="slow" pauseOnHover>
                  <Row gap="xl">
                    {[...Array(3)].map((_, i) => (
                      <React.Fragment key={i}>
                        {tickerMessages.map((message, index) => (
                          <Row key={`${i}-${index}`} gap="xl" vertical="center">
                            <Text variant="body-strong-s" style={{ whiteSpace: "nowrap" }}>
                              {message}
                            </Text>
                            <Text variant="body-default-s" onBackground="neutral-weak">•</Text>
                          </Row>
                        ))}
                      </React.Fragment>
                    ))}
                  </Row>
                </Scroller>
              </div>
            </Column>
          </Card>
        </RevealFx>

        {/* Sport filter */}
        <RevealFx speed="fast">
          <Row gap="m" vertical="center">
            <Text variant="body-strong-s">Filter by Sport:</Text>
            <Row gap="s">
              <Chip active={sportFilter === "all"} onClick={() => setSportFilter("all")}>
                All Sports
              </Chip>
              <Chip active={sportFilter === "basketball"} onClick={() => setSportFilter("basketball")}>
                Basketball
              </Chip>
              <Chip active={sportFilter === "football"} onClick={() => setSportFilter("football")}>
                Football
              </Chip>
              <Chip active={sportFilter === "baseball"} onClick={() => setSportFilter("baseball")}>
                Baseball
              </Chip>
            </Row>
          </Row>
        </RevealFx>

        {viewMode === "events" && (
          <>
            {/* Featured live event */}
            {events.filter(e => e.status === "live").map((event, index) => (
              <RevealFx key={event.id} speed="medium" delay={index * 0.1}>
                <ChampionshipEventCard event={event} featured />
              </RevealFx>
            ))}

            {/* Other events grid */}
            <Grid columns={{ base: 1, m: 2 }} gap="l">
              {events.filter(e => e.status !== "live").map((event, index) => (
                <RevealFx key={event.id} speed="fast" delay={index * 0.1}>
                  <ChampionshipEventCard event={event} />
                </RevealFx>
              ))}
            </Grid>
          </>
        )}

        {viewMode === "credentials" && (
          <Column gap="l">
            {/* Credential overview */}
            <RevealFx speed="medium">
              <Card
                radius="l"
                padding="l"
                style={{
                  background: "rgba(var(--background-primary-rgb), 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(var(--brand-purple-500-rgb), 0.3)",
                }}
              >
                <Column gap="l">
                  <Row horizontal="space-between" vertical="center">
                    <Heading variant="heading-strong-l">Credential Management</Heading>
                    <Button variant="secondary" size="m" prefixIcon="plus">
                      Issue Credentials
                    </Button>
                  </Row>
                  
                  <Grid columns={{ base: 1, s: 2, l: 4 }} gap="m">
                    <CredentialStatsCard
                      title="Media"
                      value={342}
                      total={400}
                      icon="camera"
                      color="var(--brand-electric-500)"
                    />
                    <CredentialStatsCard
                      title="Team Personnel"
                      value={856}
                      total={900}
                      icon="users"
                      color="var(--brand-purple-500)"
                    />
                    <CredentialStatsCard
                      title="Officials"
                      value={124}
                      total={150}
                      icon="shield"
                      color="var(--success)"
                    />
                    <CredentialStatsCard
                      title="VIP/Guests"
                      value={189}
                      total={250}
                      icon="star"
                      color="var(--warning)"
                    />
                  </Grid>
                </Column>
              </Card>
            </RevealFx>

            {/* Recent credential activity */}
            <RevealFx speed="medium" delay={0.1}>
              <Card
                radius="l"
                padding="l"
                style={{
                  background: "rgba(var(--background-primary-rgb), 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(var(--brand-midnight-600-rgb), 0.3)",
                }}
              >
                <Column gap="l">
                  <Heading variant="heading-strong-l">Recent Credential Activity</Heading>
                  
                  <Column gap="m">
                    {[
                      { name: "ESPN Broadcast Crew", type: "Media", event: "Basketball Championship", status: "approved", time: "5 min ago" },
                      { name: "Kansas Team Staff", type: "Team", event: "Basketball Championship", status: "active", time: "1 hour ago" },
                      { name: "Big 12 Officials", type: "Officials", event: "Football Championship", status: "pending", time: "2 hours ago" },
                      { name: "VIP Guest List", type: "VIP", event: "Baseball Championship", status: "approved", time: "3 hours ago" },
                    ].map((activity, index) => (
                      <Card
                        key={index}
                        background="transparent"
                        border="neutral-medium"
                        radius="m"
                        padding="m"
                      >
                        <Row horizontal="space-between" vertical="center">
                          <Column gap="xs">
                            <Text variant="body-strong-s">{activity.name}</Text>
                            <Row gap="s">
                              <Tag size="xs" variant="neutral">{activity.type}</Tag>
                              <Text variant="body-default-xs" onBackground="neutral-medium">
                                {activity.event}
                              </Text>
                            </Row>
                          </Column>
                          
                          <Row gap="m" vertical="center">
                            <Badge 
                              variant={
                                activity.status === "approved" ? "success" : 
                                activity.status === "active" ? "info" : 
                                "warning"
                              }
                              size="s"
                            >
                              {activity.status}
                            </Badge>
                            <Text variant="label-default-xs" onBackground="neutral-weak">
                              {activity.time}
                            </Text>
                          </Row>
                        </Row>
                      </Card>
                    ))}
                  </Column>
                </Column>
              </Card>
            </RevealFx>
          </Column>
        )}

        {/* AI Assistant CTA */}
        <RevealFx speed="fast" delay={0.3}>
          <Card
            radius="l"
            padding="l"
            style={{
              background: gradients.primary,
              border: "none",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <BorderBeam />
            <Meteors number={10} />
            
            <Row horizontal="space-between" vertical="center" wrap gap="l">
              <Column gap="s" flex={1}>
                <Row gap="m" vertical="center">
                  <HoloFx shine={{ opacity: 100 }}>
                    <Icon name="sparkles" size="xl" style={{ color: "white" }} />
                  </HoloFx>
                  <GlitchFx trigger="hover" speed="fast">
                    <Heading variant="heading-strong-xl" style={{ color: "white" }}>
                      Championship AI Assistant
                    </Heading>
                  </GlitchFx>
                </Row>
                <Text variant="body-default-m" style={{ color: "rgba(255,255,255,0.8)" }}>
                  Get real-time insights, automated scheduling, and predictive analytics for all championship events
                </Text>
              </Column>
              
              <Row gap="m">
                <Button
                  variant="secondary"
                  size="m"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                  }}
                >
                  View Insights
                </Button>
                <Button
                  variant="primary"
                  size="m"
                  suffixIcon="arrowRight"
                  style={{
                    background: "white",
                    color: "var(--brand-midnight-800)",
                  }}
                >
                  Activate AI Mode
                </Button>
              </Row>
            </Row>
          </Card>
        </RevealFx>
      </Column>
    </Background>
  );
}