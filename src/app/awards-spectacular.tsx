'use client';

import { 
  Column, Row, Grid, Card, Button, Heading, Text, Background, 
  Icon, Badge, StatusIndicator, Avatar, AvatarGroup, SmartImage,
  Line, Fade, Tag, IconButton, Carousel, InlineCode, Scroller
} from "@once-ui/components";
import { useEffect, useState, useRef } from "react";

// 3D Trophy Showcase
const Trophy3D = ({ award }: { award: any }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setRotation({
      x: (y - 0.5) * 30,
      y: (x - 0.5) * 30,
    });
  };
  
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setRotation({ x: 0, y: 0 });
      }}
      style={{
        perspective: '1000px',
        cursor: 'pointer',
        padding: '40px',
      }}
    >
      <div
        style={{
          width: '200px',
          height: '250px',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${isHovered ? 'scale(1.1)' : 'scale(1)'}`,
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Trophy Base */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120px',
            height: '40px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}
        />
        
        {/* Trophy Body */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100px',
            height: '150px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
            clipPath: 'polygon(20% 100%, 80% 100%, 90% 0%, 10% 0%)',
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.5)',
          }}
        />
        
        {/* Trophy Handles */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '0',
            width: '100%',
            height: '60px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '-10px',
              width: '40px',
              height: '60px',
              border: '8px solid #FFD700',
              borderRight: 'none',
              borderRadius: '30px 0 0 30px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '-10px',
              width: '40px',
              height: '60px',
              border: '8px solid #FFD700',
              borderLeft: 'none',
              borderRadius: '0 30px 30px 0',
            }}
          />
        </div>
        
        {/* Award Icon */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '48px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
        >
          {award.icon}
        </div>
      </div>
      
      <Column gap="8" alignItems="center" style={{ marginTop: '20px' }}>
        <Heading variant="heading-strong-m">{award.name}</Heading>
        <Text variant="body-default-s" onBackground="neutral-weak" align="center">
          {award.description}
        </Text>
      </Column>
    </div>
  );
};

// Award Progress Visualization
const AwardProgress = ({ category, current, total }: any) => {
  const percentage = (current / total) * 100;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <Column gap="16" alignItems="center">
      <div style={{ position: 'relative', width: '200px', height: '200px' }}>
        <svg
          width="200"
          height="200"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="var(--neutral-border-weak)"
            strokeWidth="20"
            fill="none"
          />
          
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="20"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
              filter: 'drop-shadow(0 0 10px var(--accent-solid-strong))',
            }}
          />
          
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--brand-solid-strong)" />
              <stop offset="100%" stopColor="var(--accent-solid-strong)" />
            </linearGradient>
          </defs>
        </svg>
        
        <Column
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          alignItems="center"
          justifyContent="center"
        >
          <Heading variant="display-strong-l">{current}</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">of {total}</Text>
        </Column>
      </div>
      
      <Column gap="4" alignItems="center">
        <Heading variant="heading-strong-m">{category}</Heading>
        <Text variant="label-default-s" onBackground="accent-weak">
          {percentage.toFixed(0)}% Complete
        </Text>
      </Column>
    </Column>
  );
};

// Animated Leaderboard
const Leaderboard = () => {
  const [schools, setSchools] = useState([
    { rank: 1, name: 'Kansas', awards: 147, change: 0, trend: 'stable' },
    { rank: 2, name: 'Baylor', awards: 142, change: 2, trend: 'up' },
    { rank: 3, name: 'Texas Tech', awards: 138, change: -1, trend: 'down' },
    { rank: 4, name: 'Oklahoma State', awards: 135, change: 1, trend: 'up' },
    { rank: 5, name: 'TCU', awards: 132, change: -2, trend: 'down' },
    { rank: 6, name: 'Iowa State', awards: 128, change: 0, trend: 'stable' },
    { rank: 7, name: 'West Virginia', awards: 125, change: 3, trend: 'up' },
    { rank: 8, name: 'Kansas State', awards: 122, change: -1, trend: 'down' },
  ]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSchools(prev => {
        const newSchools = [...prev];
        const randomIndex = Math.floor(Math.random() * newSchools.length);
        newSchools[randomIndex].awards += Math.floor(Math.random() * 3);
        
        return newSchools.sort((a, b) => b.awards - a.awards).map((school, i) => ({
          ...school,
          rank: i + 1,
          change: school.rank - (i + 1),
          trend: school.rank > i + 1 ? 'down' : school.rank < i + 1 ? 'up' : 'stable',
        }));
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Column gap="12">
      {schools.map((school, i) => (
        <Fade key={school.name} duration="m" delay={`${i * 50}ms` as any}>
          <Card
            padding="16"
            radius="m"
            style={{
              background: i < 3 ? 
                `linear-gradient(135deg, var(--${i === 0 ? 'yellow' : i === 1 ? 'neutral' : 'orange'}-background-strong) 0%, transparent 100%)` : 
                'rgba(var(--neutral-background-strong-rgb), 0.3)',
              backdropFilter: 'blur(10px)',
              border: i < 3 ? `1px solid var(--${i === 0 ? 'yellow' : i === 1 ? 'neutral' : 'orange'}-border-weak)` : '1px solid var(--neutral-border-weak)',
              transform: school.trend === 'up' ? 'translateY(-2px)' : school.trend === 'down' ? 'translateY(2px)' : 'translateY(0)',
              transition: 'all 0.5s ease',
            }}
          >
            <Row horizontal="space-between" alignItems="center">
              <Row gap="16" alignItems="center">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: i < 3 ? 
                      `linear-gradient(135deg, var(--${i === 0 ? 'yellow' : i === 1 ? 'neutral' : 'orange'}-solid-strong) 0%, var(--${i === 0 ? 'yellow' : i === 1 ? 'neutral' : 'orange'}-solid-weak) 100%)` : 
                      'var(--neutral-background-weak)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                  }}
                >
                  {school.rank}
                </div>
                
                <Column gap="4">
                  <Text variant="label-default-m" onBackground="neutral-strong">
                    {school.name}
                  </Text>
                  <Row gap="8" alignItems="center">
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      {school.awards} awards
                    </Text>
                    {school.change !== 0 && (
                      <Tag size="s" variant={school.trend === 'up' ? 'success' : 'danger'}>
                        <Row gap="4" alignItems="center">
                          <Icon name={school.trend === 'up' ? 'trendingUp' : 'trendingDown'} size="xs" />
                          {Math.abs(school.change)}
                        </Row>
                      </Tag>
                    )}
                  </Row>
                </Column>
              </Row>
              
              <div
                style={{
                  width: `${(school.awards / 150) * 100}px`,
                  height: '8px',
                  background: `linear-gradient(90deg, var(--brand-solid-strong) 0%, var(--accent-solid-strong) 100%)`,
                  borderRadius: '4px',
                  transition: 'width 0.5s ease',
                }}
              />
            </Row>
          </Card>
        </Fade>
      ))}
    </Column>
  );
};

// Timeline Visualization
const AwardsTimeline = () => {
  const events = [
    { date: 'Jan 15', title: 'Spring Awards Open', type: 'milestone', status: 'completed' },
    { date: 'Feb 28', title: 'Nominations Due', type: 'deadline', status: 'completed' },
    { date: 'Mar 15', title: 'Review Period', type: 'process', status: 'active' },
    { date: 'Apr 1', title: 'Winners Announced', type: 'milestone', status: 'upcoming' },
    { date: 'May 20', title: 'Awards Ceremony', type: 'event', status: 'upcoming' },
  ];
  
  return (
    <div style={{ position: 'relative', padding: '20px 0' }}>
      {/* Timeline line */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'var(--neutral-border-weak)',
          transform: 'translateX(-50%)',
        }}
      />
      
      {events.map((event, i) => (
        <Fade key={i} duration="l" delay={`${i * 100}ms` as any}>
          <Row
            gap="24"
            alignItems="center"
            style={{
              marginBottom: '40px',
              justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start',
            }}
          >
            {i % 2 === 0 && (
              <Card
                padding="20"
                radius="l"
                style={{
                  width: '45%',
                  background: event.status === 'active' ? 
                    'linear-gradient(135deg, var(--brand-background-strong) 0%, var(--accent-background-strong) 100%)' :
                    'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  backdropFilter: 'blur(10px)',
                  border: event.status === 'active' ? '1px solid var(--accent-border-weak)' : '1px solid var(--neutral-border-weak)',
                }}
              >
                <Column gap="8">
                  <Text variant="label-default-s" onBackground="neutral-weak">{event.date}</Text>
                  <Heading variant="heading-strong-s">{event.title}</Heading>
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
              </Card>
            )}
            
            {/* Timeline node */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: event.status === 'completed' ? 'var(--green-solid-strong)' :
                           event.status === 'active' ? 'var(--brand-solid-strong)' : 'var(--neutral-background-weak)',
                border: '4px solid var(--neutral-background-strong)',
                boxShadow: event.status === 'active' ? '0 0 20px var(--brand-solid-strong)' : 'none',
                animation: event.status === 'active' ? 'pulse 2s ease-in-out infinite' : 'none',
              }}
            />
            
            {i % 2 === 1 && (
              <Card
                padding="20"
                radius="l"
                style={{
                  width: '45%',
                  marginLeft: 'auto',
                  background: event.status === 'active' ? 
                    'linear-gradient(135deg, var(--brand-background-strong) 0%, var(--accent-background-strong) 100%)' :
                    'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  backdropFilter: 'blur(10px)',
                  border: event.status === 'active' ? '1px solid var(--accent-border-weak)' : '1px solid var(--neutral-border-weak)',
                }}
              >
                <Column gap="8">
                  <Text variant="label-default-s" onBackground="neutral-weak">{event.date}</Text>
                  <Heading variant="heading-strong-s">{event.title}</Heading>
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
              </Card>
            )}
          </Row>
        </Fade>
      ))}
    </div>
  );
};

export default function SpectacularAwards() {
  const awards = [
    { name: 'Academic Excellence', icon: '🎓', description: 'Outstanding GPA achievement' },
    { name: 'Athletic Performance', icon: '🏆', description: 'Superior athletic accomplishment' },
    { name: 'Leadership', icon: '⭐', description: 'Exceptional leadership qualities' },
    { name: 'Community Service', icon: '❤️', description: 'Dedication to community impact' },
  ];
  
  const categories = [
    { name: 'Academic', current: 342, total: 500 },
    { name: 'Athletic', current: 287, total: 400 },
    { name: 'Leadership', current: 156, total: 200 },
    { name: 'Service', current: 98, total: 150 },
  ];
  
  return (
    <>
      <Background
        position="fixed"
        gradient={{
          display: true,
          opacity: 40,
          colorStart: 'yellow-background-strong',
          colorEnd: 'static-transparent',
          x: 0,
          y: 0,
        }}
        dots={{ display: true, opacity: 15 }}
      />
      
      <Column maxWidth="xl" fillWidth gap="40" padding="32">
        {/* Header */}
        <Fade duration="m">
          <Column gap="16" alignItems="center">
            <Badge variant="warning" size="m">
              <Row gap="8" alignItems="center">
                <Icon name="award" size="s" />
                <Text variant="label-default-s">Awards Excellence Program</Text>
              </Row>
            </Badge>
            
            <Heading
              variant="display-strong-xl"
              align="center"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(255, 215, 0, 0.5)',
              }}
            >
              Big 12 Awards Showcase
            </Heading>
            
            <Text
              variant="display-default-m"
              align="center"
              onBackground="neutral-weak"
              style={{ maxWidth: '600px' }}
            >
              Celebrating excellence across academics, athletics, leadership, and community service
            </Text>
          </Column>
        </Fade>
        
        {/* Trophy Showcase */}
        <Fade duration="l" delay="s">
          <Column gap="24">
            <Heading variant="display-default-l" align="center">
              Award Categories
            </Heading>
            
            <Grid columns="4" mobileColumns="1" tabletColumns="2" gap="24">
              {awards.map((award, i) => (
                <Fade key={i} duration="l" delay={`${i * 100}ms` as any}>
                  <Trophy3D award={award} />
                </Fade>
              ))}
            </Grid>
          </Column>
        </Fade>
        
        {/* Progress Visualization */}
        <Fade duration="l" delay="m">
          <Card
            padding="48"
            radius="xl"
            style={{
              background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--neutral-border-weak)',
            }}
          >
            <Column gap="32">
              <Heading variant="display-default-m" align="center">
                2024-25 Award Distribution
              </Heading>
              
              <Grid columns="4" mobileColumns="2" tabletColumns="2" gap="32">
                {categories.map((category, i) => (
                  <Fade key={i} duration="l" delay={`${i * 100}ms` as any}>
                    <AwardProgress {...category} />
                  </Fade>
                ))}
              </Grid>
              
              <Row justifyContent="center" gap="24" style={{ marginTop: '24px' }}>
                <Column gap="8" alignItems="center">
                  <Heading variant="display-strong-l">883</Heading>
                  <Text variant="body-default-m" onBackground="neutral-weak">Total Awards</Text>
                </Column>
                <Line direction="vertical" style={{ height: '60px' }} />
                <Column gap="8" alignItems="center">
                  <Heading variant="display-strong-l">$2.4M</Heading>
                  <Text variant="body-default-m" onBackground="neutral-weak">Total Value</Text>
                </Column>
                <Line direction="vertical" style={{ height: '60px' }} />
                <Column gap="8" alignItems="center">
                  <Heading variant="display-strong-l">1,247</Heading>
                  <Text variant="body-default-m" onBackground="neutral-weak">Recipients</Text>
                </Column>
              </Row>
            </Column>
          </Card>
        </Fade>
        
        {/* Timeline & Leaderboard */}
        <Grid columns="12" mobileColumns="1" tabletColumns="1" gap="32">
          {/* Timeline */}
          <Column style={{ gridColumn: 'span 7' }}>
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
                  <Heading variant="display-default-m">Awards Timeline</Heading>
                  <AwardsTimeline />
                </Column>
              </Card>
            </Fade>
          </Column>
          
          {/* Leaderboard */}
          <Column style={{ gridColumn: 'span 5' }}>
            <Fade duration="l" delay="xl">
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
                    <Heading variant="display-default-m">School Rankings</Heading>
                    <IconButton
                      icon="refresh"
                      size="s"
                      variant="ghost"
                      tooltip="Updates every 5 seconds"
                    />
                  </Row>
                  <Leaderboard />
                </Column>
              </Card>
            </Fade>
          </Column>
        </Grid>
        
        {/* CTA Section */}
        <Fade duration="xl" delay="xl">
          <Card
            padding="48"
            radius="xl"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
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
                opacity: 0.3,
                animation: 'pulse 4s ease-in-out infinite',
              }}
            />
            
            <Column gap="24" alignItems="center" style={{ position: 'relative', zIndex: 1 }}>
              <Icon name="award" size="xl" />
              <Heading variant="display-strong-l" align="center">
                Nominate an Outstanding Student-Athlete
              </Heading>
              <Text variant="body-default-l" align="center" style={{ maxWidth: '600px' }}>
                Recognize excellence in your institution. Submit nominations for the 2025 awards season.
              </Text>
              <Row gap="16">
                <Button size="l" variant="primary" style={{ background: 'black', color: 'white' }}>
                  Submit Nomination
                </Button>
                <Button size="l" variant="secondary" style={{ background: 'white', color: 'black' }}>
                  View Guidelines
                </Button>
              </Row>
            </Column>
          </Card>
        </Fade>
      </Column>
    </>
  );
}