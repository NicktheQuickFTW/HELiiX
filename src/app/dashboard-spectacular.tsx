'use client';

import { 
  Column, Row, Grid, Card, Button, Heading, Text, Background, 
  Icon, Badge, StatusIndicator, SegmentedControl, Avatar,
  Line, Fade, Tag, IconButton, Dropdown, Option,
  ToggleButton, Skeleton, SmartImage
} from "@once-ui-system/core";
import { useEffect, useState, useRef } from "react";

// Data Visualization Components
const LiveDataStream = ({ data, color }: { data: number[], color: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    let offset = 0;
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < data.length; i++) {
        const x = (i / data.length) * width + offset;
        const y = height - (data[i] / 100) * height;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      
      offset -= 2;
      if (offset < -width) offset = 0;
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, color]);
  
  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={100}
      style={{ width: '100%', height: '100px', borderRadius: '8px' }}
    />
  );
};

// 3D Rotating Globe Component
const Globe3D = () => {
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div
      style={{
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, var(--accent-solid-strong) 0%, var(--brand-solid-strong) 50%, var(--neutral-background-strong) 100%)',
        position: 'relative',
        transform: `rotateY(${rotation}deg)`,
        transformStyle: 'preserve-3d',
        boxShadow: '0 0 60px var(--accent-solid-weak)',
      }}
    >
      {/* Conference locations */}
      {[...Array(16)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: 'var(--accent-solid-strong)',
            borderRadius: '50%',
            left: `${50 + 40 * Math.cos((i * 22.5 * Math.PI) / 180)}%`,
            top: `${50 + 40 * Math.sin((i * 22.5 * Math.PI) / 180)}%`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px var(--accent-solid-strong)',
          }}
        />
      ))}
    </div>
  );
};

// Real-time Activity Feed
const ActivityFeed = () => {
  const activities = [
    { type: 'award', user: 'Sarah Chen', action: 'approved award', target: 'Academic Excellence', time: '2m ago', icon: 'award' },
    { type: 'event', user: 'Mike Johnson', action: 'scheduled', target: 'Championship Finals', time: '5m ago', icon: 'calendar' },
    { type: 'finance', user: 'Alex Rivera', action: 'processed invoice', target: '$45,320', time: '12m ago', icon: 'dollarSign' },
    { type: 'team', user: 'Chris Lee', action: 'updated roster', target: 'Kansas Basketball', time: '18m ago', icon: 'users' },
    { type: 'weather', user: 'System', action: 'weather alert', target: 'TCU Stadium', time: '25m ago', icon: 'cloud' },
  ];
  
  return (
    <Column gap="12">
      {activities.map((activity, i) => (
        <Fade key={i} duration="m" delay={`${i * 100}ms` as any}>
          <Row gap="12" alignItems="center">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, var(--${
                  activity.type === 'award' ? 'green' :
                  activity.type === 'event' ? 'brand' :
                  activity.type === 'finance' ? 'yellow' :
                  activity.type === 'team' ? 'accent' : 'red'
                }-background-strong) 0%, transparent 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name={activity.icon as any} size="s" />
            </div>
            <Column fillWidth gap="4">
              <Row gap="8" alignItems="center">
                <Text variant="label-default-s" onBackground="neutral-strong">
                  {activity.user}
                </Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  {activity.action}
                </Text>
                <Text variant="label-default-s" onBackground="accent-weak">
                  {activity.target}
                </Text>
              </Row>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {activity.time}
              </Text>
            </Column>
          </Row>
        </Fade>
      ))}
    </Column>
  );
};

// Heatmap Component
const HeatmapGrid = () => {
  const [data, setData] = useState<number[][]>([]);
  
  useEffect(() => {
    const grid = Array(7).fill(0).map(() => 
      Array(24).fill(0).map(() => Math.random() * 100)
    );
    setData(grid);
  }, []);
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <Column gap="8">
      <Row gap="4">
        <div style={{ width: '40px' }} />
        {[...Array(24)].map((_, i) => (
          <Text
            key={i}
            variant="body-default-xs"
            onBackground="neutral-weak"
            style={{ width: '20px', textAlign: 'center' }}
          >
            {i % 4 === 0 ? i : ''}
          </Text>
        ))}
      </Row>
      {data.map((row, i) => (
        <Row key={i} gap="4" alignItems="center">
          <Text
            variant="body-default-xs"
            onBackground="neutral-weak"
            style={{ width: '40px' }}
          >
            {days[i]}
          </Text>
          {row.map((value, j) => (
            <div
              key={j}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                background: `rgba(var(--accent-solid-strong-rgb), ${value / 100})`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title={`${days[i]} ${j}:00 - ${value.toFixed(0)}%`}
            />
          ))}
        </Row>
      ))}
    </Column>
  );
};

// Performance Metrics with Animation
const PerformanceRing = ({ value, label, color }: { value: number, label: string, color: string }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);
  
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;
  
  return (
    <Column gap="8" alignItems="center">
      <div style={{ position: 'relative', width: '100px', height: '100px' }}>
        <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="var(--neutral-border-weak)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
              filter: `drop-shadow(0 0 10px ${color})`,
            }}
          />
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
          <Heading variant="heading-strong-l">{animatedValue}%</Heading>
        </Column>
      </div>
      <Text variant="label-default-s" onBackground="neutral-weak">{label}</Text>
    </Column>
  );
};

export default function SpectacularDashboard() {
  const [timeframe, setTimeframe] = useState('live');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [streamData, setStreamData] = useState<number[]>([]);
  
  // Generate live data stream
  useEffect(() => {
    const generateData = () => {
      setStreamData(prev => {
        const newData = [...prev, Math.random() * 100];
        if (newData.length > 50) newData.shift();
        return newData;
      });
    };
    
    const interval = setInterval(generateData, 100);
    return () => clearInterval(interval);
  }, []);
  
  // Add futuristic grid animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gridMove {
        0% { transform: translateY(0); }
        100% { transform: translateY(32px); }
      }
      
      .animated-grid {
        background-image: linear-gradient(
          var(--neutral-border-weak) 1px, 
          transparent 1px
        ),
        linear-gradient(
          90deg,
          var(--neutral-border-weak) 1px, 
          transparent 1px
        );
        background-size: 32px 32px;
        animation: gridMove 2s linear infinite;
        opacity: 0.5;
      }
      
      @keyframes dataPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
      }
      
      .data-pulse {
        animation: dataPulse 2s ease-in-out infinite;
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
        mask={{ cursor: false, x: 50, y: 50, radius: 150 }}
        gradient={{ display: true, opacity: 30 }}
        dots={{ display: true, opacity: 10 }}
      />
      
      {/* Animated Grid Background */}
      <div
        className="animated-grid"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '200%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      
      <Column maxWidth="xl" fillWidth gap="24" padding="24" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Fade duration="m">
          <Row fillWidth horizontal="space-between" alignItems="center">
            <Column gap="8">
              <Heading variant="display-strong-l">
                Command Center
              </Heading>
              <Row gap="8" alignItems="center">
                <StatusIndicator color="green" />
                <Text variant="label-default-s" onBackground="neutral-weak">
                  All systems operational
                </Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  • Last sync: 2 seconds ago
                </Text>
              </Row>
            </Column>
            
            <Row gap="16" alignItems="center">
              <SegmentedControl
                size="m"
                value={timeframe}
                onValueChange={setTimeframe}
                buttons={[
                  { label: 'Live', value: 'live' },
                  { label: '24h', value: '24h' },
                  { label: '7d', value: '7d' },
                  { label: '30d', value: '30d' },
                ]}
              />
              
              <Dropdown value={selectedMetric} onValueChange={setSelectedMetric}>
                <Option value="all">All Metrics</Option>
                <Option value="operations">Operations</Option>
                <Option value="finance">Finance</Option>
                <Option value="awards">Awards</Option>
                <Option value="events">Events</Option>
              </Dropdown>
              
              <IconButton
                icon="settings"
                size="m"
                tooltip="Dashboard Settings"
                variant="ghost"
              />
            </Row>
          </Row>
        </Fade>
        
        {/* Key Metrics Grid */}
        <Fade duration="l" delay="s">
          <Grid columns="4" mobileColumns="2" tabletColumns="2" gap="16">
            {[
              { 
                label: "Active Operations", 
                value: "1,247", 
                change: "+12.5%", 
                trend: "up",
                sparkline: [40, 45, 42, 50, 48, 55, 52, 60, 58, 65]
              },
              { 
                label: "Revenue MTD", 
                value: "$2.4M", 
                change: "+8.3%", 
                trend: "up",
                sparkline: [20, 25, 30, 28, 35, 40, 45, 50, 55, 60]
              },
              { 
                label: "Awards Processed", 
                value: "342", 
                change: "-2.1%", 
                trend: "down",
                sparkline: [60, 58, 55, 52, 50, 48, 45, 42, 40, 38]
              },
              { 
                label: "System Health", 
                value: "98.5%", 
                change: "+0.3%", 
                trend: "up",
                sparkline: [90, 91, 92, 91, 93, 94, 95, 96, 97, 98]
              },
            ].map((metric, i) => (
              <Card
                key={i}
                padding="20"
                radius="l"
                className="data-pulse"
                style={{
                  background: 'rgba(var(--neutral-background-strong-rgb), 0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--neutral-border-weak)',
                  overflow: 'hidden',
                }}
              >
                <Column gap="12">
                  <Row horizontal="space-between" alignItems="start">
                    <Column gap="4">
                      <Text variant="label-default-s" onBackground="neutral-weak">
                        {metric.label}
                      </Text>
                      <Heading variant="display-strong-m">
                        {metric.value}
                      </Heading>
                    </Column>
                    <Tag
                      size="s"
                      variant={metric.trend === 'up' ? 'success' : 'danger'}
                    >
                      {metric.change}
                    </Tag>
                  </Row>
                  
                  {/* Mini sparkline */}
                  <div style={{ height: '40px', position: 'relative' }}>
                    <svg width="100%" height="40" preserveAspectRatio="none">
                      <polyline
                        fill="none"
                        stroke="var(--accent-solid-strong)"
                        strokeWidth="2"
                        points={metric.sparkline.map((v, i) => 
                          `${(i / (metric.sparkline.length - 1)) * 100}%,${40 - (v / 100) * 40}`
                        ).join(' ')}
                      />
                    </svg>
                  </div>
                </Column>
              </Card>
            ))}
          </Grid>
        </Fade>
        
        {/* Main Dashboard Content */}
        <Grid columns="12" mobileColumns="1" tabletColumns="1" gap="24">
          {/* Left Column - Live Data & Globe */}
          <Column style={{ gridColumn: 'span 4' }} gap="24">
            <Fade duration="l" delay="m">
              <Card
                padding="24"
                radius="l"
                style={{
                  background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <Column gap="16">
                  <Row horizontal="space-between" alignItems="center">
                    <Heading variant="heading-strong-m">Network Status</Heading>
                    <StatusIndicator color="green" pulse />
                  </Row>
                  
                  <Column alignItems="center" paddingY="20">
                    <Globe3D />
                  </Column>
                  
                  <Grid columns="2" gap="12">
                    <Column gap="4">
                      <Text variant="label-default-xs" onBackground="neutral-weak">Uptime</Text>
                      <Text variant="heading-strong-s">99.98%</Text>
                    </Column>
                    <Column gap="4">
                      <Text variant="label-default-xs" onBackground="neutral-weak">Latency</Text>
                      <Text variant="heading-strong-s">12ms</Text>
                    </Column>
                    <Column gap="4">
                      <Text variant="label-default-xs" onBackground="neutral-weak">Requests/s</Text>
                      <Text variant="heading-strong-s">4.2K</Text>
                    </Column>
                    <Column gap="4">
                      <Text variant="label-default-xs" onBackground="neutral-weak">Active Users</Text>
                      <Text variant="heading-strong-s">847</Text>
                    </Column>
                  </Grid>
                </Column>
              </Card>
            </Fade>
            
            <Fade duration="l" delay="l">
              <Card
                padding="24"
                radius="l"
                style={{
                  background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <Column gap="16">
                  <Heading variant="heading-strong-m">Live Data Stream</Heading>
                  <LiveDataStream data={streamData} color="var(--accent-solid-strong)" />
                  
                  <Row gap="12">
                    <Badge variant="neutral" size="s">
                      <Row gap="4" alignItems="center">
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green-solid-strong)' }} />
                        <Text variant="label-default-xs">CPU: 42%</Text>
                      </Row>
                    </Badge>
                    <Badge variant="neutral" size="s">
                      <Row gap="4" alignItems="center">
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--yellow-solid-strong)' }} />
                        <Text variant="label-default-xs">Memory: 68%</Text>
                      </Row>
                    </Badge>
                  </Row>
                </Column>
              </Card>
            </Fade>
          </Column>
          
          {/* Center Column - Activity & Heatmap */}
          <Column style={{ gridColumn: 'span 5' }} gap="24">
            <Fade duration="l" delay="m">
              <Card
                padding="24"
                radius="l"
                style={{
                  background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <Column gap="16">
                  <Row horizontal="space-between" alignItems="center">
                    <Heading variant="heading-strong-m">Activity Heatmap</Heading>
                    <ToggleButton
                      selected={false}
                      size="s"
                      label="Auto-refresh"
                    />
                  </Row>
                  
                  <HeatmapGrid />
                  
                  <Row gap="8">
                    <Text variant="label-default-xs" onBackground="neutral-weak">Peak activity:</Text>
                    <Text variant="label-default-xs" onBackground="accent-weak">Weekdays 2-4 PM CST</Text>
                  </Row>
                </Column>
              </Card>
            </Fade>
            
            <Fade duration="l" delay="l">
              <Card
                padding="24"
                radius="l"
                style={{
                  background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  backdropFilter: 'blur(20px)',
                  maxHeight: '400px',
                  overflow: 'hidden',
                }}
              >
                <Column gap="16" height="100%">
                  <Row horizontal="space-between" alignItems="center">
                    <Heading variant="heading-strong-m">Recent Activity</Heading>
                    <Button size="s" variant="ghost" suffixIcon="arrowRight">
                      View All
                    </Button>
                  </Row>
                  
                  <div style={{ overflowY: 'auto', flex: 1 }}>
                    <ActivityFeed />
                  </div>
                </Column>
              </Card>
            </Fade>
          </Column>
          
          {/* Right Column - Performance */}
          <Column style={{ gridColumn: 'span 3' }} gap="24">
            <Fade duration="l" delay="m">
              <Card
                padding="24"
                radius="l"
                style={{
                  background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <Column gap="16">
                  <Heading variant="heading-strong-m">Performance</Heading>
                  
                  <Column gap="20" alignItems="center">
                    <PerformanceRing value={87} label="Efficiency" color="var(--brand-solid-strong)" />
                    <PerformanceRing value={94} label="Satisfaction" color="var(--accent-solid-strong)" />
                    <PerformanceRing value={76} label="Utilization" color="var(--green-solid-strong)" />
                  </Column>
                </Column>
              </Card>
            </Fade>
            
            <Fade duration="l" delay="l">
              <Card
                padding="24"
                radius="l"
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
                    animation: 'dataPulse 3s ease-in-out infinite',
                  }}
                />
                
                <Column gap="12" style={{ position: 'relative', zIndex: 1 }}>
                  <Icon name="zap" size="m" />
                  <Heading variant="heading-strong-m">Quick Actions</Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Common tasks at your fingertips
                  </Text>
                  
                  <Column gap="8" marginTop="12">
                    <Button size="s" variant="secondary" fillWidth>
                      Create Report
                    </Button>
                    <Button size="s" variant="secondary" fillWidth>
                      Schedule Event
                    </Button>
                    <Button size="s" variant="secondary" fillWidth>
                      Process Awards
                    </Button>
                  </Column>
                </Column>
              </Card>
            </Fade>
          </Column>
        </Grid>
      </Column>
    </>
  );
}