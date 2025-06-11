'use client';

import { 
  Column, Row, Grid, Card, Button, Heading, Text, Background, 
  Icon, Badge, StatusIndicator, Avatar, AvatarGroup, SmartImage,
  Line, Fade, Tag, IconButton, Carousel, InlineCode
} from "@once-ui/components";
import { useEffect, useState, useRef } from "react";

// Team Card with 3D Tilt Effect
const TeamCard3D = ({ team }: { team: any }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setTilt({
      x: (y - 0.5) * 20,
      y: -(x - 0.5) * 20,
    });
  };
  
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      style={{
        perspective: '1000px',
        height: '100%',
      }}
    >
      <Card
        padding="0"
        radius="xl"
        style={{
          height: '100%',
          background: team.primaryColor,
          position: 'relative',
          overflow: 'hidden',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? 'scale(1.05)' : 'scale(1)'}`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.3s ease',
          cursor: 'pointer',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: `linear-gradient(135deg, ${team.secondaryColor} 0%, transparent 50%)`,
            opacity: 0.3,
            transform: 'rotate(45deg)',
          }}
        />
        
        {/* Logo */}
        <Column
          alignItems="center"
          justifyContent="center"
          style={{
            height: '200px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Text
            variant="display-strong-xl"
            style={{
              fontSize: '5rem',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            }}
          >
            {team.logo}
          </Text>
        </Column>
        
        {/* Team Info */}
        <Column
          padding="24"
          gap="16"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Column gap="8">
            <Heading variant="heading-strong-l" style={{ color: 'white' }}>
              {team.name}
            </Heading>
            <Text variant="body-default-m" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {team.location}
            </Text>
          </Column>
          
          <Row gap="8" wrap>
            <Badge variant="neutral" size="s">
              <Text variant="label-default-xs">{team.conference}</Text>
            </Badge>
            <Badge variant="neutral" size="s">
              <Text variant="label-default-xs">Est. {team.established}</Text>
            </Badge>
          </Row>
          
          <Grid columns="3" gap="12">
            <Column gap="4" alignItems="center">
              <Text variant="heading-strong-m" style={{ color: 'white' }}>{team.championships}</Text>
              <Text variant="label-default-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Titles</Text>
            </Column>
            <Column gap="4" alignItems="center">
              <Text variant="heading-strong-m" style={{ color: 'white' }}>{team.sports}</Text>
              <Text variant="label-default-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Sports</Text>
            </Column>
            <Column gap="4" alignItems="center">
              <Text variant="heading-strong-m" style={{ color: 'white' }}>{team.enrollment}</Text>
              <Text variant="label-default-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Students</Text>
            </Column>
          </Grid>
        </Column>
      </Card>
    </div>
  );
};

// Interactive Conference Map
const ConferenceMap = () => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  
  const teamLocations = [
    { name: 'Arizona', x: 15, y: 65, abbr: 'UA' },
    { name: 'Arizona State', x: 15, y: 60, abbr: 'ASU' },
    { name: 'BYU', x: 20, y: 45, abbr: 'BYU' },
    { name: 'Baylor', x: 55, y: 75, abbr: 'BU' },
    { name: 'Cincinnati', x: 75, y: 40, abbr: 'UC' },
    { name: 'Colorado', x: 35, y: 40, abbr: 'CU' },
    { name: 'Houston', x: 58, y: 85, abbr: 'UH' },
    { name: 'Iowa State', x: 55, y: 35, abbr: 'ISU' },
    { name: 'Kansas', x: 58, y: 42, abbr: 'KU' },
    { name: 'Kansas State', x: 56, y: 40, abbr: 'KSU' },
    { name: 'Oklahoma State', x: 55, y: 55, abbr: 'OSU' },
    { name: 'TCU', x: 55, y: 70, abbr: 'TCU' },
    { name: 'Texas Tech', x: 48, y: 70, abbr: 'TTU' },
    { name: 'UCF', x: 85, y: 85, abbr: 'UCF' },
    { name: 'Utah', x: 22, y: 42, abbr: 'UU' },
    { name: 'West Virginia', x: 82, y: 38, abbr: 'WVU' },
  ];
  
  return (
    <div
      ref={mapRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '500px',
        background: 'linear-gradient(135deg, var(--neutral-background-strong) 0%, var(--neutral-background-weak) 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Map Grid */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            repeating-linear-gradient(0deg, var(--neutral-border-weak) 0, var(--neutral-border-weak) 1px, transparent 1px, transparent 50px),
            repeating-linear-gradient(90deg, var(--neutral-border-weak) 0, var(--neutral-border-weak) 1px, transparent 1px, transparent 50px)
          `,
          opacity: 0.3,
        }}
      />
      
      {/* Connection Lines */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {teamLocations.map((team1, i) => 
          teamLocations.slice(i + 1).map((team2, j) => {
            const distance = Math.sqrt(
              Math.pow(team2.x - team1.x, 2) + Math.pow(team2.y - team1.y, 2)
            );
            if (distance < 20) {
              return (
                <line
                  key={`${i}-${j}`}
                  x1={`${team1.x}%`}
                  y1={`${team1.y}%`}
                  x2={`${team2.x}%`}
                  y2={`${team2.y}%`}
                  stroke="var(--brand-solid-weak)"
                  strokeWidth="1"
                  opacity="0.3"
                />
              );
            }
            return null;
          })
        )}
      </svg>
      
      {/* Team Markers */}
      {teamLocations.map((team, i) => (
        <div
          key={i}
          onClick={() => setSelectedTeam(team.name)}
          style={{
            position: 'absolute',
            left: `${team.x}%`,
            top: `${team.y}%`,
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: selectedTeam === team.name ? '60px' : '40px',
              height: selectedTeam === team.name ? '60px' : '40px',
              borderRadius: '50%',
              background: selectedTeam === team.name ? 
                'linear-gradient(135deg, var(--brand-solid-strong) 0%, var(--accent-solid-strong) 100%)' :
                'var(--brand-background-strong)',
              border: '2px solid var(--brand-solid-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: selectedTeam === team.name ? 
                '0 0 30px var(--brand-solid-strong)' : 
                '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <Text
              variant="label-default-s"
              style={{
                fontWeight: 'bold',
                color: selectedTeam === team.name ? 'white' : 'var(--brand-solid-strong)',
              }}
            >
              {team.abbr}
            </Text>
          </div>
          
          {selectedTeam === team.name && (
            <Fade duration="s">
              <Card
                padding="12"
                radius="m"
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: '8px',
                  minWidth: '150px',
                  background: 'var(--neutral-background-strong)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
              >
                <Column gap="4">
                  <Text variant="label-default-s" onBackground="neutral-strong">
                    {team.name}
                  </Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    Click for details
                  </Text>
                </Column>
              </Card>
            </Fade>
          )}
        </div>
      ))}
    </div>
  );
};

// Team Performance Radar Chart
const PerformanceRadar = ({ team }: { team: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;
    const categories = ['Academics', 'Athletics', 'Revenue', 'Facilities', 'Fan Base', 'Championships'];
    const values = team.performance;
    
    const drawRadar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      for (let i = 1; i <= 5; i++) {
        ctx.strokeStyle = 'var(--neutral-border-weak)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let j = 0; j < categories.length; j++) {
          const angle = (j * 2 * Math.PI) / categories.length - Math.PI / 2;
          const x = centerX + (radius * i / 5) * Math.cos(angle);
          const y = centerY + (radius * i / 5) * Math.sin(angle);
          
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        
        ctx.closePath();
        ctx.stroke();
      }
      
      // Draw axes
      categories.forEach((_, i) => {
        const angle = (i * 2 * Math.PI) / categories.length - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        ctx.strokeStyle = 'var(--neutral-border-weak)';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      });
      
      // Draw data
      ctx.fillStyle = 'rgba(var(--brand-solid-strong-rgb), 0.3)';
      ctx.strokeStyle = 'var(--brand-solid-strong)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      values.forEach((value: number, i: number) => {
        const angle = (i * 2 * Math.PI) / categories.length - Math.PI / 2;
        const x = centerX + (radius * value / 100) * Math.cos(angle);
        const y = centerY + (radius * value / 100) * Math.sin(angle);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Draw labels
      ctx.fillStyle = 'var(--neutral-on-background-strong)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      categories.forEach((category, i) => {
        const angle = (i * 2 * Math.PI) / categories.length - Math.PI / 2;
        const x = centerX + (radius + 30) * Math.cos(angle);
        const y = centerY + (radius + 30) * Math.sin(angle);
        
        ctx.fillText(category, x, y);
      });
    };
    
    drawRadar();
  }, [team]);
  
  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      style={{ width: '100%', height: '300px' }}
    />
  );
};

export default function SpectacularTeams() {
  const teams = [
    {
      name: 'Arizona Wildcats',
      location: 'Tucson, AZ',
      logo: '🐻',
      primaryColor: '#003366',
      secondaryColor: '#CC0033',
      conference: 'Big 12',
      established: '1885',
      championships: 23,
      sports: 20,
      enrollment: '47K',
      performance: [85, 88, 75, 90, 85, 80],
    },
    {
      name: 'Arizona State Sun Devils',
      location: 'Tempe, AZ',
      logo: '🔱',
      primaryColor: '#8C1D40',
      secondaryColor: '#FFC627',
      conference: 'Big 12',
      established: '1885',
      championships: 26,
      sports: 26,
      enrollment: '90K',
      performance: [82, 85, 88, 85, 90, 78],
    },
    {
      name: 'Baylor Bears',
      location: 'Waco, TX',
      logo: '🐻',
      primaryColor: '#154734',
      secondaryColor: '#FFAA00',
      conference: 'Big 12',
      established: '1845',
      championships: 29,
      sports: 19,
      enrollment: '20K',
      performance: [90, 92, 70, 88, 75, 85],
    },
    {
      name: 'BYU Cougars',
      location: 'Provo, UT',
      logo: 'Y',
      primaryColor: '#002E5D',
      secondaryColor: '#FFFFFF',
      conference: 'Big 12',
      established: '1875',
      championships: 31,
      sports: 21,
      enrollment: '34K',
      performance: [88, 80, 65, 82, 92, 75],
    },
    {
      name: 'Cincinnati Bearcats',
      location: 'Cincinnati, OH',
      logo: '🐾',
      primaryColor: '#E00122',
      secondaryColor: '#000000',
      conference: 'Big 12',
      established: '1819',
      championships: 19,
      sports: 18,
      enrollment: '47K',
      performance: [78, 82, 72, 80, 80, 76],
    },
    {
      name: 'Colorado Buffaloes',
      location: 'Boulder, CO',
      logo: '🦬',
      primaryColor: '#CFB87C',
      secondaryColor: '#000000',
      conference: 'Big 12',
      established: '1876',
      championships: 28,
      sports: 17,
      enrollment: '35K',
      performance: [84, 78, 80, 85, 88, 72],
    },
    {
      name: 'Houston Cougars',
      location: 'Houston, TX',
      logo: '🐾',
      primaryColor: '#C8102E',
      secondaryColor: '#FFFFFF',
      conference: 'Big 12',
      established: '1927',
      championships: 17,
      sports: 17,
      enrollment: '47K',
      performance: [80, 88, 82, 78, 85, 82],
    },
    {
      name: 'Iowa State Cyclones',
      location: 'Ames, IA',
      logo: '🌪️',
      primaryColor: '#C8102E',
      secondaryColor: '#F1BE48',
      conference: 'Big 12',
      established: '1858',
      championships: 15,
      sports: 18,
      enrollment: '30K',
      performance: [86, 75, 68, 82, 78, 70],
    },
  ];
  
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  
  return (
    <>
      <Background
        position="fixed"
        gradient={{
          display: true,
          opacity: 20,
          colorStart: 'brand-background-strong',
          colorEnd: 'accent-background-strong',
          x: 0,
          y: 100,
        }}
        dots={{ display: true, opacity: 15 }}
      />
      
      <Column maxWidth="xl" fillWidth gap="40" padding="32">
        {/* Header */}
        <Fade duration="m">
          <Column gap="16" alignItems="center">
            <Badge variant="brand" size="m">
              <Row gap="8" alignItems="center">
                <Icon name="users" size="s" />
                <Text variant="label-default-s">Conference Members</Text>
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
              Big 12 Teams
            </Heading>
            
            <Text
              variant="display-default-m"
              align="center"
              onBackground="neutral-weak"
              style={{ maxWidth: '600px' }}
            >
              16 powerhouse institutions united in pursuit of athletic and academic excellence
            </Text>
          </Column>
        </Fade>
        
        {/* Conference Map */}
        <Fade duration="l" delay="s">
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
              <Heading variant="display-default-m">Conference Geography</Heading>
              <ConferenceMap />
              <Row justifyContent="center" gap="24">
                <Column gap="4" alignItems="center">
                  <Heading variant="heading-strong-l">2,500+</Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">Miles Span</Text>
                </Column>
                <Line direction="vertical" style={{ height: '40px' }} />
                <Column gap="4" alignItems="center">
                  <Heading variant="heading-strong-l">4</Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">Time Zones</Text>
                </Column>
                <Line direction="vertical" style={{ height: '40px' }} />
                <Column gap="4" alignItems="center">
                  <Heading variant="heading-strong-l">11</Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">States</Text>
                </Column>
              </Row>
            </Column>
          </Card>
        </Fade>
        
        {/* Team Cards Grid */}
        <Fade duration="l" delay="m">
          <Column gap="24">
            <Heading variant="display-default-l">Member Institutions</Heading>
            <Grid columns="4" mobileColumns="1" tabletColumns="2" gap="24">
              {teams.map((team, i) => (
                <Fade key={i} duration="l" delay={`${i * 100}ms` as any}>
                  <div onClick={() => setSelectedTeamIndex(i)}>
                    <TeamCard3D team={team} />
                  </div>
                </Fade>
              ))}
            </Grid>
          </Column>
        </Fade>
        
        {/* Team Details */}
        <Fade duration="l" delay="l">
          <Card
            padding="48"
            radius="xl"
            style={{
              background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--neutral-border-weak)',
            }}
          >
            <Grid columns="12" mobileColumns="1" tabletColumns="1" gap="48">
              <Column style={{ gridColumn: 'span 5' }}>
                <Column gap="24">
                  <Row gap="16" alignItems="center">
                    <Text variant="display-strong-xl" style={{ fontSize: '4rem' }}>
                      {teams[selectedTeamIndex].logo}
                    </Text>
                    <Column gap="8">
                      <Heading variant="display-default-m">
                        {teams[selectedTeamIndex].name}
                      </Heading>
                      <Text variant="body-default-l" onBackground="neutral-weak">
                        {teams[selectedTeamIndex].location}
                      </Text>
                    </Column>
                  </Row>
                  
                  <PerformanceRadar team={teams[selectedTeamIndex]} />
                </Column>
              </Column>
              
              <Column style={{ gridColumn: 'span 7' }} gap="32">
                <Column gap="16">
                  <Heading variant="heading-strong-l">Quick Facts</Heading>
                  <Grid columns="2" gap="16">
                    <Row gap="12" alignItems="center">
                      <Icon name="calendar" size="m" />
                      <Column gap="4">
                        <Text variant="label-default-s" onBackground="neutral-weak">Founded</Text>
                        <Text variant="heading-strong-s">{teams[selectedTeamIndex].established}</Text>
                      </Column>
                    </Row>
                    <Row gap="12" alignItems="center">
                      <Icon name="users" size="m" />
                      <Column gap="4">
                        <Text variant="label-default-s" onBackground="neutral-weak">Enrollment</Text>
                        <Text variant="heading-strong-s">{teams[selectedTeamIndex].enrollment}</Text>
                      </Column>
                    </Row>
                    <Row gap="12" alignItems="center">
                      <Icon name="award" size="m" />
                      <Column gap="4">
                        <Text variant="label-default-s" onBackground="neutral-weak">Championships</Text>
                        <Text variant="heading-strong-s">{teams[selectedTeamIndex].championships}</Text>
                      </Column>
                    </Row>
                    <Row gap="12" alignItems="center">
                      <Icon name="activity" size="m" />
                      <Column gap="4">
                        <Text variant="label-default-s" onBackground="neutral-weak">Varsity Sports</Text>
                        <Text variant="heading-strong-s">{teams[selectedTeamIndex].sports}</Text>
                      </Column>
                    </Row>
                  </Grid>
                </Column>
                
                <Column gap="16">
                  <Heading variant="heading-strong-l">Team Colors</Heading>
                  <Row gap="16">
                    <Row gap="12" alignItems="center">
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '12px',
                          background: teams[selectedTeamIndex].primaryColor,
                          border: '2px solid var(--neutral-border-weak)',
                        }}
                      />
                      <Column gap="4">
                        <Text variant="label-default-s" onBackground="neutral-weak">Primary</Text>
                        <Text variant="body-default-m">{teams[selectedTeamIndex].primaryColor}</Text>
                      </Column>
                    </Row>
                    <Row gap="12" alignItems="center">
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '12px',
                          background: teams[selectedTeamIndex].secondaryColor,
                          border: '2px solid var(--neutral-border-weak)',
                        }}
                      />
                      <Column gap="4">
                        <Text variant="label-default-s" onBackground="neutral-weak">Secondary</Text>
                        <Text variant="body-default-m">{teams[selectedTeamIndex].secondaryColor}</Text>
                      </Column>
                    </Row>
                  </Row>
                </Column>
                
                <Row gap="16">
                  <Button variant="primary" prefixIcon="link">
                    Visit Website
                  </Button>
                  <Button variant="secondary" prefixIcon="grid">
                    View Athletics
                  </Button>
                </Row>
              </Column>
            </Grid>
          </Card>
        </Fade>
      </Column>
    </>
  );
}