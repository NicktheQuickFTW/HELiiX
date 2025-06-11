'use client';

import { 
  Column, Row, Grid, Card, Button, Heading, Text, Background, 
  Icon, Badge, StatusIndicator, Avatar, AvatarGroup, SmartImage,
  Line, Fade, Tag, IconButton, Carousel, InlineCode
} from "@once-ui/components";
import { useEffect, useState, useRef } from "react";

// Live Tournament Bracket Visualization
const TournamentBracket = () => {
  const [hoveredMatch, setHoveredMatch] = useState<number | null>(null);
  
  const rounds = [
    {
      name: 'Quarterfinals',
      matches: [
        { team1: 'Kansas', score1: 78, team2: 'Iowa State', score2: 72, winner: 'Kansas' },
        { team1: 'Baylor', score1: 84, team2: 'TCU', score2: 81, winner: 'Baylor' },
        { team1: 'Texas Tech', score1: 69, team2: 'Oklahoma State', score2: 75, winner: 'Oklahoma State' },
        { team1: 'West Virginia', score1: 71, team2: 'Kansas State', score2: 68, winner: 'West Virginia' },
      ]
    },
    {
      name: 'Semifinals',
      matches: [
        { team1: 'Kansas', score1: 82, team2: 'Baylor', score2: 79, winner: 'Kansas' },
        { team1: 'Oklahoma State', score1: 77, team2: 'West Virginia', score2: 73, winner: 'Oklahoma State' },
      ]
    },
    {
      name: 'Championship',
      matches: [
        { team1: 'Kansas', score1: null, team2: 'Oklahoma State', score2: null, winner: null },
      ]
    }
  ];
  
  return (
    <div style={{ overflowX: 'auto', paddingBottom: '20px' }}>
      <Row gap="32" style={{ minWidth: '800px' }}>
        {rounds.map((round, roundIndex) => (
          <Column key={roundIndex} gap="24" style={{ flex: 1 }}>
            <Heading variant="heading-strong-m" align="center">{round.name}</Heading>
            <Column gap="16" style={{ justifyContent: 'space-around', height: '400px' }}>
              {round.matches.map((match, matchIndex) => {
                const globalMatchIndex = rounds.slice(0, roundIndex).reduce((acc, r) => acc + r.matches.length, 0) + matchIndex;
                const isHovered = hoveredMatch === globalMatchIndex;
                
                return (
                  <Card
                    key={matchIndex}
                    padding="16"
                    radius="l"
                    onMouseEnter={() => setHoveredMatch(globalMatchIndex)}
                    onMouseLeave={() => setHoveredMatch(null)}
                    style={{
                      background: isHovered ? 
                        'linear-gradient(135deg, var(--brand-background-strong) 0%, var(--accent-background-strong) 100%)' :
                        'rgba(var(--neutral-background-strong-rgb), 0.3)',
                      backdropFilter: 'blur(10px)',
                      border: match.winner ? '1px solid var(--brand-border-weak)' : '1px solid var(--neutral-border-weak)',
                      cursor: 'pointer',
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Column gap="12">
                      <Row horizontal="space-between" alignItems="center">
                        <Text 
                          variant="label-default-s" 
                          style={{ 
                            fontWeight: match.winner === match.team1 ? 'bold' : 'normal',
                            color: match.winner === match.team1 ? 'var(--brand-solid-strong)' : 'var(--neutral-on-background-weak)'
                          }}
                        >
                          {match.team1}
                        </Text>
                        <Text variant="heading-strong-s">
                          {match.score1 || '-'}
                        </Text>
                      </Row>
                      
                      <Line background="neutral-alpha-weak" />
                      
                      <Row horizontal="space-between" alignItems="center">
                        <Text 
                          variant="label-default-s"
                          style={{ 
                            fontWeight: match.winner === match.team2 ? 'bold' : 'normal',
                            color: match.winner === match.team2 ? 'var(--brand-solid-strong)' : 'var(--neutral-on-background-weak)'
                          }}
                        >
                          {match.team2}
                        </Text>
                        <Text variant="heading-strong-s">
                          {match.score2 || '-'}
                        </Text>
                      </Row>
                      
                      {!match.winner && roundIndex === 2 && (
                        <Badge variant="warning" size="s">
                          <Row gap="4" alignItems="center">
                            <StatusIndicator color="yellow" pulse />
                            <Text variant="label-default-xs">LIVE</Text>
                          </Row>
                        </Badge>
                      )}
                    </Column>
                  </Card>
                );
              })}
            </Column>
          </Column>
        ))}
      </Row>
    </div>
  );
};

// Championship Trophy Animation
const ChampionshipTrophy = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsAnimating(true)}
      onMouseLeave={() => setIsAnimating(false)}
      style={{
        width: '300px',
        height: '400px',
        position: 'relative',
        cursor: 'pointer',
        margin: '0 auto',
      }}
    >
      {/* Trophy Base */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '180px',
          height: '60px',
          background: 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        }}
      />
      
      {/* Trophy Stem */}
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '80px',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        }}
      />
      
      {/* Trophy Cup */}
      <div
        style={{
          position: 'absolute',
          top: '50px',
          left: '50%',
          transform: `translateX(-50%) ${isAnimating ? 'rotateY(360deg)' : 'rotateY(0deg)'}`,
          transformStyle: 'preserve-3d',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
          borderRadius: '50% 50% 100px 100px',
          boxShadow: 'inset 0 0 30px rgba(255,255,255,0.5), 0 10px 30px rgba(0,0,0,0.3)',
          transition: 'transform 1s ease',
        }}
      >
        {/* Trophy Handles */}
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '-40px',
            width: '60px',
            height: '80px',
            border: '12px solid #FFD700',
            borderRight: 'none',
            borderRadius: '40px 0 0 40px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '-40px',
            width: '60px',
            height: '80px',
            border: '12px solid #FFD700',
            borderLeft: 'none',
            borderRadius: '0 40px 40px 0',
          }}
        />
        
        {/* Big 12 Logo */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#FFF',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          XII
        </div>
      </div>
      
      {/* Sparkles */}
      {isAnimating && [...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
            width: '4px',
            height: '4px',
            background: '#FFD700',
            borderRadius: '50%',
            animation: `sparkle 1s ease-in-out ${i * 0.1}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

// Event Schedule Timeline
const EventSchedule = () => {
  const events = [
    { time: '12:00 PM', title: 'Gates Open', status: 'completed', icon: 'door' },
    { time: '1:00 PM', title: 'Fan Zone Activities', status: 'completed', icon: 'users' },
    { time: '3:00 PM', title: 'Team Warm-ups', status: 'active', icon: 'activity' },
    { time: '5:00 PM', title: 'Opening Ceremony', status: 'upcoming', icon: 'star' },
    { time: '6:00 PM', title: 'Championship Game', status: 'upcoming', icon: 'award' },
    { time: '8:30 PM', title: 'Trophy Presentation', status: 'upcoming', icon: 'trophy' },
  ];
  
  return (
    <Column gap="0">
      {events.map((event, i) => (
        <Fade key={i} duration="m" delay={`${i * 100}ms` as any}>
          <Row gap="16" alignItems="start" style={{ position: 'relative', paddingBottom: '24px' }}>
            {/* Timeline line */}
            {i < events.length - 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '40px',
                  bottom: 0,
                  width: '2px',
                  background: event.status === 'completed' ? 'var(--green-solid-strong)' : 'var(--neutral-border-weak)',
                }}
              />
            )}
            
            {/* Timeline node */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: event.status === 'completed' ? 'var(--green-solid-strong)' :
                           event.status === 'active' ? 'var(--brand-solid-strong)' : 'var(--neutral-background-weak)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
                boxShadow: event.status === 'active' ? '0 0 20px var(--brand-solid-strong)' : 'none',
                animation: event.status === 'active' ? 'pulse 2s ease-in-out infinite' : 'none',
              }}
            >
              <Icon name={event.icon as any} size="s" />
            </div>
            
            {/* Event details */}
            <Column gap="4" fillWidth>
              <Row horizontal="space-between" alignItems="center">
                <Heading variant="heading-strong-s">{event.title}</Heading>
                <Text variant="label-default-s" onBackground="neutral-weak">{event.time}</Text>
              </Row>
              <Badge
                variant={
                  event.status === 'completed' ? 'success' :
                  event.status === 'active' ? 'warning' : 'neutral'
                }
                size="s"
              >
                {event.status}
              </Badge>
            </Column>
          </Row>
        </Fade>
      ))}
    </Column>
  );
};

// Live Stats Dashboard
const LiveStats = () => {
  const [stats, setStats] = useState({
    attendance: 18542,
    viewership: 2847329,
    engagement: 87,
    socialReach: 12400000,
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        attendance: prev.attendance,
        viewership: prev.viewership + Math.floor(Math.random() * 1000),
        engagement: Math.min(100, prev.engagement + (Math.random() - 0.3) * 2),
        socialReach: prev.socialReach + Math.floor(Math.random() * 10000),
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Grid columns="2" gap="16">
      <Card
        padding="20"
        radius="l"
        style={{
          background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--neutral-border-weak)',
        }}
      >
        <Column gap="8">
          <Row gap="8" alignItems="center">
            <Icon name="users" size="s" />
            <Text variant="label-default-s" onBackground="neutral-weak">Attendance</Text>
          </Row>
          <Heading variant="display-strong-m">{stats.attendance.toLocaleString()}</Heading>
          <Text variant="body-default-xs" onBackground="accent-weak">Sold Out</Text>
        </Column>
      </Card>
      
      <Card
        padding="20"
        radius="l"
        style={{
          background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--neutral-border-weak)',
        }}
      >
        <Column gap="8">
          <Row gap="8" alignItems="center">
            <Icon name="eye" size="s" />
            <Text variant="label-default-s" onBackground="neutral-weak">Live Viewers</Text>
          </Row>
          <Heading variant="display-strong-m">{(stats.viewership / 1000000).toFixed(1)}M</Heading>
          <Row gap="4" alignItems="center">
            <StatusIndicator color="green" pulse />
            <Text variant="body-default-xs" onBackground="green-weak">Streaming Now</Text>
          </Row>
        </Column>
      </Card>
      
      <Card
        padding="20"
        radius="l"
        style={{
          background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--neutral-border-weak)',
        }}
      >
        <Column gap="8">
          <Row gap="8" alignItems="center">
            <Icon name="activity" size="s" />
            <Text variant="label-default-s" onBackground="neutral-weak">Fan Engagement</Text>
          </Row>
          <Heading variant="display-strong-m">{stats.engagement.toFixed(0)}%</Heading>
          <div
            style={{
              height: '4px',
              background: 'var(--neutral-border-weak)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${stats.engagement}%`,
                background: 'var(--brand-solid-strong)',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </Column>
      </Card>
      
      <Card
        padding="20"
        radius="l"
        style={{
          background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--neutral-border-weak)',
        }}
      >
        <Column gap="8">
          <Row gap="8" alignItems="center">
            <Icon name="share2" size="s" />
            <Text variant="label-default-s" onBackground="neutral-weak">Social Reach</Text>
          </Row>
          <Heading variant="display-strong-m">{(stats.socialReach / 1000000).toFixed(1)}M</Heading>
          <Text variant="body-default-xs" onBackground="accent-weak">#Big12Champs</Text>
        </Column>
      </Card>
    </Grid>
  );
};

export default function SpectacularChampionships() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <>
      <Background
        position="fixed"
        gradient={{
          display: true,
          opacity: 30,
          colorStart: 'brand-background-strong',
          colorEnd: 'accent-background-strong',
          x: 50,
          y: 0,
          tilt: 45,
        }}
        dots={{ display: true, opacity: 20 }}
      />
      
      <Column maxWidth="xl" fillWidth gap="40" padding="32">
        {/* Header */}
        <Fade duration="m">
          <Column gap="16" alignItems="center">
            <Badge variant="warning" size="l">
              <Row gap="8" alignItems="center">
                <StatusIndicator color="yellow" pulse />
                <Text variant="label-default-m">CHAMPIONSHIP WEEK</Text>
              </Row>
            </Badge>
            
            <Heading
              variant="display-strong-xl"
              align="center"
              style={{
                background: 'linear-gradient(135deg, var(--brand-solid-strong) 0%, var(--accent-solid-strong) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Big 12 Championships
            </Heading>
            
            <Text
              variant="display-default-m"
              align="center"
              onBackground="neutral-weak"
              style={{ maxWidth: '600px' }}
            >
              The pinnacle of conference competition across all sports
            </Text>
          </Column>
        </Fade>
        
        {/* Trophy Section */}
        <Fade duration="l" delay="s">
          <Card
            padding="48"
            radius="xl"
            style={{
              background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--neutral-border-weak)',
            }}
          >
            <Column gap="32" alignItems="center">
              <Heading variant="display-default-l">The Championship Trophy</Heading>
              <ChampionshipTrophy />
              <Text variant="body-default-l" onBackground="neutral-weak" align="center" style={{ maxWidth: '500px' }}>
                Awarded annually to the conference champion, representing excellence in collegiate athletics
              </Text>
            </Column>
          </Card>
        </Fade>
        
        {/* Tournament Bracket */}
        <Fade duration="l" delay="m">
          <Card
            padding="32"
            radius="xl"
            style={{
              background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--neutral-border-weak)',
            }}
          >
            <Column gap="24">
              <Row horizontal="space-between" alignItems="center">
                <Heading variant="display-default-m">Basketball Tournament</Heading>
                <Row gap="8">
                  <Badge variant="success">
                    <Text variant="label-default-s">Men's Division</Text>
                  </Badge>
                  <IconButton icon="maximize" size="s" variant="ghost" tooltip="Fullscreen" />
                </Row>
              </Row>
              <TournamentBracket />
            </Column>
          </Card>
        </Fade>
        
        {/* Live Dashboard */}
        <Grid columns="12" mobileColumns="1" tabletColumns="1" gap="32">
          {/* Event Schedule */}
          <Column style={{ gridColumn: 'span 5' }}>
            <Fade duration="l" delay="l">
              <Card
                padding="32"
                radius="xl"
                style={{
                  background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--neutral-border-weak)',
                  height: '100%',
                }}
              >
                <Column gap="24">
                  <Row horizontal="space-between" alignItems="center">
                    <Heading variant="display-default-m">Today's Schedule</Heading>
                    <Text variant="label-default-s" onBackground="neutral-weak">
                      March 15, 2025
                    </Text>
                  </Row>
                  <EventSchedule />
                </Column>
              </Card>
            </Fade>
          </Column>
          
          {/* Live Stats & Media */}
          <Column style={{ gridColumn: 'span 7' }} gap="24">
            <Fade duration="l" delay="l">
              <Card
                padding="32"
                radius="xl"
                style={{
                  background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--neutral-border-weak)',
                }}
              >
                <Column gap="24">
                  <Row horizontal="space-between" alignItems="center">
                    <Heading variant="display-default-m">Live Statistics</Heading>
                    <Row gap="4" alignItems="center">
                      <StatusIndicator color="green" pulse />
                      <Text variant="label-default-s" onBackground="green-weak">Real-time</Text>
                    </Row>
                  </Row>
                  <LiveStats />
                </Column>
              </Card>
            </Fade>
            
            <Fade duration="l" delay="xl">
              <Card
                padding="32"
                radius="xl"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-background-strong) 0%, var(--accent-background-strong) 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, white 0%, transparent 70%)',
                    opacity: 0.1,
                    animation: 'pulse 4s ease-in-out infinite',
                  }}
                />
                
                <Column gap="24" style={{ position: 'relative', zIndex: 1 }}>
                  <Icon name="tv" size="l" />
                  <Heading variant="heading-strong-l">Watch Live</Heading>
                  <Text variant="body-default-m">
                    Stream all championship events on ESPN+ and Big 12 Now
                  </Text>
                  <Row gap="12">
                    <Button size="m" variant="primary">
                      Watch on ESPN+
                    </Button>
                    <Button size="m" variant="secondary">
                      Big 12 Now
                    </Button>
                  </Row>
                </Column>
              </Card>
            </Fade>
          </Column>
        </Grid>
      </Column>
    </>
  );
}