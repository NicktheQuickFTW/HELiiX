'use client';

import { 
  Column, Row, Grid, Card, Button, Heading, Text, Background, 
  Icon, Badge, StatusIndicator, SegmentedControl, Dropdown, Option,
  Line, Fade, Tag, IconButton, InlineCode, Scroller
} from "@once-ui/components";
import { useEffect, useState, useRef } from "react";

// Advanced 3D Chart Visualization
const Chart3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const barCount = 12;
    const barWidth = width / barCount / 2;
    const data = Array(barCount).fill(0).map(() => Math.random() * 100);
    
    let rotation = 0;
    
    const draw3DBar = (x: number, y: number, w: number, h: number, depth: number, color: string, opacity: number = 1) => {
      // Front face
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.fillRect(x, y, w, h);
      
      // Top face
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + depth, y - depth);
      ctx.lineTo(x + w + depth, y - depth);
      ctx.lineTo(x + w, y);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      
      // Right face
      ctx.beginPath();
      ctx.moveTo(x + w, y);
      ctx.lineTo(x + w + depth, y - depth);
      ctx.lineTo(x + w + depth, y + h - depth);
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity * 0.8;
      ctx.fill();
      
      ctx.globalAlpha = 1;
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      rotation += 0.5;
      
      data.forEach((value, i) => {
        const x = i * (width / barCount) + 20;
        const barHeight = (value / 100) * (height - 100);
        const y = height - barHeight - 50;
        const depth = 15;
        
        const isHovered = hoveredBar === i;
        const scale = isHovered ? 1.1 : 1;
        const opacity = hoveredBar !== null && !isHovered ? 0.5 : 1;
        
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, isHovered ? 'var(--accent-solid-strong)' : 'var(--brand-solid-strong)');
        gradient.addColorStop(1, isHovered ? 'var(--accent-solid-weak)' : 'var(--brand-solid-weak)');
        
        draw3DBar(
          x - (scale - 1) * barWidth / 2, 
          y - (scale - 1) * barHeight, 
          barWidth * scale, 
          barHeight * scale, 
          depth * scale, 
          gradient,
          opacity
        );
        
        // Value label
        ctx.fillStyle = 'var(--neutral-on-background-strong)';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(value.toFixed(0), x + barWidth / 2, y - 10);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hoveredBar]);
  
  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={300}
      style={{ width: '100%', height: '300px', cursor: 'pointer' }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const barIndex = Math.floor((x / rect.width) * 12);
        setHoveredBar(barIndex >= 0 && barIndex < 12 ? barIndex : null);
      }}
      onMouseLeave={() => setHoveredBar(null)}
    />
  );
};

// Real-time Data Flow Visualization
const DataFlow = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const particles: any[] = [];
    const nodes = [
      { x: 100, y: 150, label: 'Source' },
      { x: 300, y: 100, label: 'Process' },
      { x: 300, y: 200, label: 'Filter' },
      { x: 500, y: 150, label: 'Output' },
    ];
    
    const connections = [
      [0, 1], [0, 2], [1, 3], [2, 3]
    ];
    
    // Create particles
    setInterval(() => {
      if (particles.length < 20) {
        const connectionIndex = Math.floor(Math.random() * connections.length);
        const [start, end] = connections[connectionIndex];
        
        particles.push({
          x: nodes[start].x,
          y: nodes[start].y,
          targetX: nodes[end].x,
          targetY: nodes[end].y,
          progress: 0,
          speed: 0.02 + Math.random() * 0.02,
        });
      }
    }, 500);
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      ctx.strokeStyle = 'var(--neutral-border-weak)';
      ctx.lineWidth = 2;
      connections.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(nodes[start].x, nodes[start].y);
        ctx.lineTo(nodes[end].x, nodes[end].y);
        ctx.stroke();
      });
      
      // Draw nodes
      nodes.forEach((node, i) => {
        ctx.fillStyle = 'var(--brand-background-strong)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'var(--brand-solid-strong)';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.fillStyle = 'var(--neutral-on-background-strong)';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);
      });
      
      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.progress += particle.speed;
        
        if (particle.progress >= 1) {
          particles.splice(i, 1);
          return;
        }
        
        const x = particle.x + (particle.targetX - particle.x) * particle.progress;
        const y = particle.y + (particle.targetY - particle.y) * particle.progress;
        
        ctx.fillStyle = 'var(--accent-solid-strong)';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        gradient.addColorStop(0, 'rgba(var(--accent-solid-strong-rgb), 0.5)');
        gradient.addColorStop(1, 'rgba(var(--accent-solid-strong-rgb), 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={300}
      style={{ width: '100%', height: '300px', borderRadius: '12px' }}
    />
  );
};

// Predictive Analytics Dashboard
const PredictiveModel = () => {
  const [prediction, setPrediction] = useState(75);
  const [confidence, setConfidence] = useState(88);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPrediction(prev => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(0, Math.min(100, prev + change));
      });
      setConfidence(prev => {
        const change = (Math.random() - 0.5) * 5;
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
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
          background: 'radial-gradient(circle, var(--accent-solid-weak) 0%, transparent 70%)',
          opacity: 0.2,
          animation: 'pulse 3s ease-in-out infinite',
        }}
      />
      
      <Column gap="20" style={{ position: 'relative', zIndex: 1 }}>
        <Row horizontal="space-between" alignItems="center">
          <Heading variant="heading-strong-m">AI Prediction Engine</Heading>
          <StatusIndicator color="green" pulse />
        </Row>
        
        <Column gap="16">
          <Column gap="8">
            <Row horizontal="space-between" alignItems="center">
              <Text variant="label-default-s">Revenue Forecast</Text>
              <Text variant="heading-strong-s">{prediction.toFixed(1)}%</Text>
            </Row>
            <div
              style={{
                height: '8px',
                background: 'var(--neutral-border-weak)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${prediction}%`,
                  background: 'linear-gradient(90deg, var(--brand-solid-strong) 0%, var(--accent-solid-strong) 100%)',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          </Column>
          
          <Column gap="8">
            <Row horizontal="space-between" alignItems="center">
              <Text variant="label-default-s">Model Confidence</Text>
              <Text variant="heading-strong-s">{confidence.toFixed(1)}%</Text>
            </Row>
            <div
              style={{
                height: '8px',
                background: 'var(--neutral-border-weak)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${confidence}%`,
                  background: confidence > 80 ? 'var(--green-solid-strong)' : 
                             confidence > 60 ? 'var(--yellow-solid-strong)' : 'var(--red-solid-strong)',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          </Column>
        </Column>
        
        <Row gap="8" wrap>
          <Badge variant="neutral" size="s">
            <Text variant="label-default-xs">Deep Learning</Text>
          </Badge>
          <Badge variant="neutral" size="s">
            <Text variant="label-default-xs">98.2% Accuracy</Text>
          </Badge>
          <Badge variant="neutral" size="s">
            <Text variant="label-default-xs">Live Updates</Text>
          </Badge>
        </Row>
      </Column>
    </Card>
  );
};

// Metrics Grid with Sparklines
const MetricCard = ({ title, value, change, trend, sparkData }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 10;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw sparkline
    ctx.strokeStyle = trend === 'up' ? 'var(--green-solid-strong)' : 'var(--red-solid-strong)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    sparkData.forEach((value: number, i: number) => {
      const x = padding + (i / (sparkData.length - 1)) * (width - padding * 2);
      const y = height - padding - (value / 100) * (height - padding * 2);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Fill area under curve
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = trend === 'up' ? 'rgba(var(--green-solid-strong-rgb), 0.1)' : 'rgba(var(--red-solid-strong-rgb), 0.1)';
    ctx.fill();
  }, [sparkData, trend]);
  
  return (
    <Card
      padding="20"
      radius="l"
      style={{
        background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--neutral-border-weak)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Column gap="12">
        <Text variant="label-default-s" onBackground="neutral-weak">{title}</Text>
        <Row horizontal="space-between" alignItems="end">
          <Heading variant="display-strong-m">{value}</Heading>
          <Tag size="s" variant={trend === 'up' ? 'success' : 'danger'}>
            {change}
          </Tag>
        </Row>
        <canvas
          ref={canvasRef}
          width={200}
          height={60}
          style={{ width: '100%', height: '60px' }}
        />
      </Column>
    </Card>
  );
};

export default function SpectacularAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [dataSource, setDataSource] = useState('all');
  
  const metrics = [
    { 
      title: 'Total Revenue', 
      value: '$12.4M', 
      change: '+15.3%', 
      trend: 'up',
      sparkData: [30, 35, 32, 40, 45, 50, 48, 55, 60, 65, 70, 75]
    },
    { 
      title: 'Active Users', 
      value: '8,439', 
      change: '+8.7%', 
      trend: 'up',
      sparkData: [60, 62, 65, 63, 68, 70, 72, 75, 78, 80, 82, 85]
    },
    { 
      title: 'Engagement Rate', 
      value: '73.2%', 
      change: '-2.1%', 
      trend: 'down',
      sparkData: [80, 78, 75, 77, 74, 72, 70, 68, 70, 72, 71, 73]
    },
    { 
      title: 'Conversion Rate', 
      value: '4.8%', 
      change: '+0.5%', 
      trend: 'up',
      sparkData: [40, 42, 41, 43, 44, 45, 46, 45, 47, 48, 49, 48]
    },
  ];
  
  return (
    <>
      <Background
        position="fixed"
        gradient={{
          display: true,
          opacity: 25,
          colorStart: 'brand-background-strong',
          colorEnd: 'accent-background-strong',
          x: 100,
          y: 0,
        }}
        dots={{ display: true, opacity: 10 }}
        grid={{
          display: true,
          opacity: 30,
          color: 'neutral-alpha-weak',
        }}
      />
      
      <Column maxWidth="xl" fillWidth gap="32" padding="32">
        {/* Header */}
        <Fade duration="m">
          <Column gap="16">
            <Row horizontal="space-between" alignItems="center">
              <Column gap="8">
                <Heading variant="display-strong-xl">
                  Analytics Intelligence Hub
                </Heading>
                <Text variant="body-default-l" onBackground="neutral-weak">
                  Real-time insights powered by machine learning
                </Text>
              </Column>
              
              <Row gap="16" alignItems="center">
                <SegmentedControl
                  size="m"
                  value={timeRange}
                  onValueChange={setTimeRange}
                  buttons={[
                    { label: '24h', value: '24h' },
                    { label: '7d', value: '7d' },
                    { label: '30d', value: '30d' },
                    { label: '90d', value: '90d' },
                    { label: '1y', value: '1y' },
                  ]}
                />
                
                <Dropdown value={dataSource} onValueChange={setDataSource}>
                  <Option value="all">All Sources</Option>
                  <Option value="web">Web Analytics</Option>
                  <Option value="app">App Analytics</Option>
                  <Option value="api">API Metrics</Option>
                </Dropdown>
                
                <IconButton
                  icon="download"
                  size="m"
                  tooltip="Export Report"
                  variant="secondary"
                />
              </Row>
            </Row>
          </Column>
        </Fade>
        
        {/* Metrics Grid */}
        <Fade duration="l" delay="s">
          <Grid columns="4" mobileColumns="1" tabletColumns="2" gap="16">
            {metrics.map((metric, i) => (
              <Fade key={i} duration="m" delay={`${i * 100}ms` as any}>
                <MetricCard {...metric} />
              </Fade>
            ))}
          </Grid>
        </Fade>
        
        {/* Main Analytics Grid */}
        <Grid columns="12" mobileColumns="1" tabletColumns="1" gap="24">
          {/* Left Column - 3D Chart & Data Flow */}
          <Column style={{ gridColumn: 'span 8' }} gap="24">
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
                    <Heading variant="heading-strong-l">Performance Overview</Heading>
                    <Row gap="8">
                      <Button size="s" variant="ghost" prefixIcon="filter">
                        Filter
                      </Button>
                      <Button size="s" variant="ghost" prefixIcon="refresh">
                        Refresh
                      </Button>
                    </Row>
                  </Row>
                  
                  <Chart3D />
                  
                  <Row gap="16" wrap>
                    <Badge variant="neutral">
                      <Row gap="8" alignItems="center">
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-solid-strong)' }} />
                        <Text variant="label-default-xs">Current Period</Text>
                      </Row>
                    </Badge>
                    <Badge variant="neutral">
                      <Row gap="8" alignItems="center">
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neutral-solid-weak)' }} />
                        <Text variant="label-default-xs">Previous Period</Text>
                      </Row>
                    </Badge>
                    <Badge variant="success">
                      <Text variant="label-default-xs">↑ 23.5% Growth</Text>
                    </Badge>
                  </Row>
                </Column>
              </Card>
            </Fade>
            
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
                    <Heading variant="heading-strong-l">Data Pipeline Flow</Heading>
                    <StatusIndicator color="green" pulse />
                  </Row>
                  
                  <DataFlow />
                  
                  <Grid columns="3" gap="16">
                    <Column gap="8" alignItems="center">
                      <Heading variant="heading-strong-m">24.3K</Heading>
                      <Text variant="label-default-s" onBackground="neutral-weak">Events/sec</Text>
                    </Column>
                    <Column gap="8" alignItems="center">
                      <Heading variant="heading-strong-m">1.2ms</Heading>
                      <Text variant="label-default-s" onBackground="neutral-weak">Avg Latency</Text>
                    </Column>
                    <Column gap="8" alignItems="center">
                      <Heading variant="heading-strong-m">99.99%</Heading>
                      <Text variant="label-default-s" onBackground="neutral-weak">Uptime</Text>
                    </Column>
                  </Grid>
                </Column>
              </Card>
            </Fade>
          </Column>
          
          {/* Right Column - AI Insights */}
          <Column style={{ gridColumn: 'span 4' }} gap="24">
            <Fade duration="l" delay="m">
              <PredictiveModel />
            </Fade>
            
            <Fade duration="l" delay="l">
              <Card
                padding="24"
                radius="xl"
                style={{
                  background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--neutral-border-weak)',
                }}
              >
                <Column gap="20">
                  <Heading variant="heading-strong-m">Key Insights</Heading>
                  
                  <Column gap="16">
                    {[
                      { icon: 'trendingUp', text: 'Revenue up 23% from last quarter', color: 'green' },
                      { icon: 'users', text: 'User engagement peaked on weekends', color: 'brand' },
                      { icon: 'alertTriangle', text: 'High churn rate in West region', color: 'yellow' },
                      { icon: 'zap', text: 'Mobile conversion improved by 15%', color: 'accent' },
                    ].map((insight, i) => (
                      <Row key={i} gap="12" alignItems="start">
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: `var(--${insight.color}-background-strong)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon name={insight.icon as any} size="s" />
                        </div>
                        <Text variant="body-default-s">{insight.text}</Text>
                      </Row>
                    ))}
                  </Column>
                  
                  <Button size="s" variant="secondary" fillWidth>
                    View All Insights
                  </Button>
                </Column>
              </Card>
            </Fade>
            
            <Fade duration="l" delay="xl">
              <Card
                padding="24"
                radius="xl"
                style={{
                  background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--neutral-border-weak)',
                }}
              >
                <Column gap="16">
                  <Row horizontal="space-between" alignItems="center">
                    <Heading variant="heading-strong-m">Export Options</Heading>
                    <Icon name="download" size="s" />
                  </Row>
                  
                  <Column gap="8">
                    <Button size="s" variant="ghost" fillWidth>
                      <Row gap="8" alignItems="center">
                        <Icon name="file" size="s" />
                        <Text variant="label-default-s">PDF Report</Text>
                      </Row>
                    </Button>
                    <Button size="s" variant="ghost" fillWidth>
                      <Row gap="8" alignItems="center">
                        <Icon name="grid" size="s" />
                        <Text variant="label-default-s">Excel Spreadsheet</Text>
                      </Row>
                    </Button>
                    <Button size="s" variant="ghost" fillWidth>
                      <Row gap="8" alignItems="center">
                        <Icon name="code" size="s" />
                        <Text variant="label-default-s">API Access</Text>
                      </Row>
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