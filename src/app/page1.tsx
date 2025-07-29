'use client';

import {
  Column,
  Row,
  Grid,
  Card,
  Button,
  Heading,
  Text,
  Background,
  Icon,
  Badge,
  StatusIndicator,
  SegmentedControl,
  Avatar,
  Line,
  Fade,
  Tag,
  IconButton,
  Dropdown,
  Option,
  ToggleButton,
  Skeleton,
  SmartImage,
} from '@once-ui-system/core';
import { useEffect, useState, useRef } from 'react';

// 3D Command Console Component
const CommandConsole = () => {
  const [commands, setCommands] = useState<string[]>([
    '> SYSTEM: Initializing HELiiX Command Center...',
    '> AUTH: Access granted - Level 5 clearance',
    '> SCAN: 16 conference nodes online',
    '> SYNC: Real-time data streams established',
    '> STATUS: All systems operational',
  ]);
  const [input, setInput] = useState('');

  const handleCommand = (cmd: string) => {
    setCommands((prev) => [
      ...prev,
      `> USER: ${cmd}`,
      `> SYSTEM: Processing...`,
    ]);
    setTimeout(() => {
      setCommands((prev) => [
        ...prev,
        `> SYSTEM: Command executed successfully`,
      ]);
    }, 1000);
  };

  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid var(--accent-solid-strong)',
        borderRadius: '12px',
        padding: '20px',
        fontFamily: 'monospace',
        height: '400px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100px',
          background:
            'linear-gradient(to bottom, rgba(var(--accent-solid-strong-rgb), 0.2), transparent)',
          pointerEvents: 'none',
        }}
      />

      <Column gap="8" style={{ height: '100%' }}>
        <Row gap="8" align="center">
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'var(--green-solid-strong)',
            }}
          />
          <Text
            variant="label-default-s"
            style={{ color: 'var(--accent-solid-strong)' }}
          >
            HELIIX COMMAND INTERFACE v3.0
          </Text>
        </Row>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
          {commands.map((cmd, i) => (
            <div
              key={i}
              style={{
                color: cmd.includes('USER')
                  ? 'var(--brand-solid-strong)'
                  : 'var(--accent-solid-strong)',
                marginBottom: '8px',
                opacity: i < commands.length - 5 ? 0.5 : 1,
              }}
            >
              {cmd}
            </div>
          ))}
        </div>

        <Row gap="8" align="center">
          <Text style={{ color: 'var(--accent-solid-strong)' }}>{'>'}</Text>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && input) {
                handleCommand(input);
                setInput('');
              }
            }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--brand-solid-strong)',
              fontFamily: 'monospace',
              fontSize: '14px',
            }}
            placeholder="Enter command..."
          />
        </Row>
      </Column>
    </div>
  );
};

// Holographic Data Visualization
const HolographicViz = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: any[] = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 2,
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        if (p.z < 0 || p.z > 100) p.vz *= -1;

        const scale = p.z / 100;
        const size = 3 * scale;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(var(--accent-solid-strong-rgb), ${scale})`;
        ctx.fill();

        // Connect nearby particles
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.sqrt(
            (p.x - p2.x) ** 2 + (p.y - p2.y) ** 2 + (p.z - p2.z) ** 2
          );
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(var(--accent-solid-strong-rgb), ${0.2 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      style={{
        width: '100%',
        height: '300px',
        borderRadius: '12px',
        background: 'rgba(var(--neutral-background-strong-rgb), 0.5)',
      }}
    />
  );
};

// System Monitor Grid
const SystemMonitor = () => {
  const systems = [
    { name: 'Awards Engine', status: 'online', load: 45, health: 98 },
    { name: 'Finance Core', status: 'online', load: 72, health: 95 },
    { name: 'Event Manager', status: 'online', load: 38, health: 100 },
    { name: 'Data Pipeline', status: 'maintenance', load: 0, health: 75 },
    { name: 'AI Assistant', status: 'online', load: 84, health: 92 },
    { name: 'Weather API', status: 'online', load: 23, health: 99 },
  ];

  return (
    <Grid columns="3" mobileColumns="1" tabletColumns="2" gap="12">
      {systems.map((system, i) => (
        <Card
          key={i}
          padding="16"
          radius="m"
          style={{
            background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${system.status === 'online' ? 'var(--green-border-weak)' : 'var(--yellow-border-weak)'}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${system.load}%`,
              background: `linear-gradient(to top, var(--${system.load > 70 ? 'red' : 'accent'}-background-strong), transparent)`,
              transition: 'height 0.5s ease',
            }}
          />

          <Column gap="8" style={{ position: 'relative', zIndex: 1 }}>
            <Row horizontal="space-between">
              <Text variant="label-default-s" onBackground="neutral-strong">
                {system.name}
              </Text>
              <StatusIndicator
                color={system.status === 'online' ? 'green' : 'yellow'}
              />
            </Row>

            <Row gap="16">
              <Column gap="4">
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  Load
                </Text>
                <Text variant="heading-strong-s">{system.load}%</Text>
              </Column>
              <Column gap="4">
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  Health
                </Text>
                <Text variant="heading-strong-s">{system.health}%</Text>
              </Column>
            </Row>
          </Column>
        </Card>
      ))}
    </Grid>
  );
};

// Real-time Operations Feed
const OperationsFeed = () => {
  const [operations, setOperations] = useState([
    {
      id: 1,
      type: 'deploy',
      title: 'Awards Module v2.4.1',
      status: 'in_progress',
      progress: 67,
    },
    {
      id: 2,
      type: 'sync',
      title: 'Database Synchronization',
      status: 'completed',
      progress: 100,
    },
    {
      id: 3,
      type: 'backup',
      title: 'System Backup #4821',
      status: 'in_progress',
      progress: 42,
    },
    {
      id: 4,
      type: 'update',
      title: 'Security Patch 2024.11',
      status: 'pending',
      progress: 0,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOperations((prev) =>
        prev.map((op) => {
          if (op.status === 'in_progress' && op.progress < 100) {
            return {
              ...op,
              progress: Math.min(op.progress + Math.random() * 10, 100),
            };
          }
          if (op.progress >= 100 && op.status === 'in_progress') {
            return { ...op, status: 'completed' };
          }
          return op;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'deploy':
        return 'arrow-up';
      case 'sync':
        return 'refresh';
      case 'backup':
        return 'folder';
      case 'update':
        return 'download';
      default:
        return 'activity';
    }
  };

  return (
    <Column gap="12">
      {operations.map((op) => (
        <Card
          key={op.id}
          padding="16"
          radius="m"
          style={{
            background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Column gap="12">
            <Row horizontal="space-between">
              <Row gap="12" align="center">
                <Icon name={getIcon(op.type) as any} size="s" />
                <Column gap="4">
                  <Text variant="label-default-s">{op.title}</Text>
                  <Tag
                    size="s"
                    variant={
                      op.status === 'completed'
                        ? 'success'
                        : op.status === 'in_progress'
                          ? 'warning'
                          : 'neutral'
                    }
                  >
                    {op.status.replace('_', ' ')}
                  </Tag>
                </Column>
              </Row>

              {op.status === 'in_progress' && (
                <Text variant="label-default-s" onBackground="accent-weak">
                  {Math.round(op.progress)}%
                </Text>
              )}
            </Row>

            {op.status === 'in_progress' && (
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
                    width: `${op.progress}%`,
                    background: 'var(--accent-solid-strong)',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            )}
          </Column>
        </Card>
      ))}
    </Column>
  );
};

// Tab Component (Once UI doesn't have tabs, so creating custom)
const TabButton = ({ active, children, onClick }: any) => (
  <Button
    variant={active ? 'primary' : 'secondary'}
    size="s"
    onClick={onClick}
    style={{
      borderRadius: '8px 8px 0 0',
      borderBottom: active ? '2px solid var(--brand-solid-strong)' : 'none',
      opacity: active ? 1 : 0.7,
    }}
  >
    {children}
  </Button>
);

export default function SpectacularOperations() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLive, setIsLive] = useState(true);

  return (
    <>
      <Background
        position="fixed"
        dots={{
          display: true,
          color: 'accent-on-background-weak',
          opacity: 20,
        }}
        lines={{ display: true, color: 'neutral-alpha-weak', opacity: 50 }}
        gradient={{
          display: true,
          opacity: 30,
          colorStart: 'brand-background-strong',
          colorEnd: 'static-transparent',
        }}
      />

      <Column maxWidth="xl" fillWidth gap="32" padding="32" marginX="auto">
        {/* Header */}
        <Fade>
          <Column gap="16">
            <Row horizontal="space-between">
              <Column gap="8">
                <Heading variant="display-strong-xl">
                  Operations Command Center
                </Heading>
                <Row gap="12">
                  <Badge
                    style={{
                      background: 'var(--green-background-strong)',
                      color: 'var(--green-solid-strong)',
                    }}
                  >
                    <Row gap="8">
                      <StatusIndicator color="green" />
                      <Text variant="label-default-s">LIVE</Text>
                    </Row>
                  </Badge>
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    Real-time monitoring and control
                  </Text>
                </Row>
              </Column>

              <Row gap="16">
                <ToggleButton
                  selected={isLive}
                  onToggle={setIsLive}
                  label="Live Mode"
                />
                <Button variant="secondary" prefixIcon="settings">
                  Configure
                </Button>
              </Row>
            </Row>

            {/* Custom Tabs */}
            <Row gap="4">
              {['overview', 'systems', 'deployments', 'analytics', 'logs'].map(
                (tab) => (
                  <TabButton
                    key={tab}
                    active={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabButton>
                )
              )}
            </Row>
          </Column>
        </Fade>

        {/* Main Grid */}
        <Grid columns="12" mobileColumns="1" tabletColumns="1" gap="24">
          {/* Left Column */}
          <Column style={{ gridColumn: 'span 8' }} gap="24">
            <Fade>
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
                  <Row horizontal="space-between">
                    <Heading variant="heading-strong-l">
                      System Overview
                    </Heading>
                    <Row gap="8">
                      <IconButton
                        icon="maximize"
                        size="s"
                        variant="secondary"
                        tooltip="Fullscreen"
                      />
                      <IconButton
                        icon="refresh"
                        size="s"
                        variant="secondary"
                        tooltip="Refresh"
                      />
                    </Row>
                  </Row>

                  <HolographicViz />

                  <Grid columns="4" mobileColumns="2" gap="16">
                    {[
                      { label: 'Uptime', value: '99.98%', icon: 'activity' },
                      { label: 'Response Time', value: '142ms', icon: 'zap' },
                      { label: 'Error Rate', value: '0.02%', icon: 'warning' },
                      {
                        label: 'Throughput',
                        value: '4.2K/s',
                        icon: 'chevron-up',
                      },
                    ].map((metric, i) => (
                      <Column key={i} gap="8">
                        <Row gap="8">
                          <Icon name={metric.icon as any} size="s" />
                          <Text
                            variant="label-default-s"
                            onBackground="neutral-weak"
                          >
                            {metric.label}
                          </Text>
                        </Row>
                        <Heading variant="heading-strong-m">
                          {metric.value}
                        </Heading>
                      </Column>
                    ))}
                  </Grid>
                </Column>
              </Card>
            </Fade>

            <Fade>
              <Card
                padding="32"
                radius="xl"
                style={{
                  background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--neutral-border-weak)',
                }}
              >
                <Column gap="20">
                  <Heading variant="heading-strong-l">
                    Command Interface
                  </Heading>
                  <CommandConsole />
                </Column>
              </Card>
            </Fade>

            <Fade>
              <Card
                padding="32"
                radius="xl"
                style={{
                  background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--neutral-border-weak)',
                }}
              >
                <Column gap="20">
                  <Row horizontal="space-between">
                    <Heading variant="heading-strong-l">System Status</Heading>
                    <Text variant="label-default-s" onBackground="neutral-weak">
                      Last updated: 2 seconds ago
                    </Text>
                  </Row>
                  <SystemMonitor />
                </Column>
              </Card>
            </Fade>
          </Column>

          {/* Right Column */}
          <Column style={{ gridColumn: 'span 4' }} gap="24">
            <Fade>
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
                  <Row horizontal="space-between">
                    <Heading variant="heading-strong-m">
                      Active Operations
                    </Heading>
                    <Badge
                      style={{
                        background: 'var(--neutral-background-strong)',
                        color: 'var(--neutral-solid-strong)',
                      }}
                    >
                      <Text variant="label-default-xs">4 Active</Text>
                    </Badge>
                  </Row>
                  <OperationsFeed />
                </Column>
              </Card>
            </Fade>

            <Fade>
              <Card
                padding="24"
                radius="xl"
                style={{
                  background:
                    'linear-gradient(135deg, var(--brand-background-strong) 0%, var(--accent-background-strong) 100%)',
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
                    background:
                      'radial-gradient(circle, white 0%, transparent 70%)',
                    opacity: 0.1,
                    animation: 'pulse 3s ease-in-out infinite',
                  }}
                />

                <Column gap="16" style={{ position: 'relative', zIndex: 1 }}>
                  <Icon name="shield" size="l" />
                  <Heading variant="heading-strong-m">Security Status</Heading>
                  <Column gap="12">
                    <Row horizontal="space-between">
                      <Text variant="label-default-s">Firewall</Text>
                      <StatusIndicator color="green" />
                    </Row>
                    <Row horizontal="space-between">
                      <Text variant="label-default-s">SSL Certificates</Text>
                      <StatusIndicator color="green" />
                    </Row>
                    <Row horizontal="space-between">
                      <Text variant="label-default-s">DDoS Protection</Text>
                      <StatusIndicator color="green" />
                    </Row>
                    <Row horizontal="space-between">
                      <Text variant="label-default-s">Intrusion Detection</Text>
                      <StatusIndicator color="green" />
                    </Row>
                  </Column>

                  <Button
                    size="s"
                    variant="secondary"
                    fillWidth
                    style={{ marginTop: '8px' }}
                  >
                    Security Report
                  </Button>
                </Column>
              </Card>
            </Fade>
          </Column>
        </Grid>
      </Column>
    </>
  );
}
