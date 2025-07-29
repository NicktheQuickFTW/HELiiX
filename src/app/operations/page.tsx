'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Flex,
  LineChart,
  BarChart,
  Tag,
  Chip,
  SegmentedControl,
  Scroller,
  InteractiveDetails,
  Avatar,
  AvatarGroup,
  Tooltip,
  Skeleton,
  Line,
} from '@once-ui-system/core';
import { RevealFx, GlitchFx, HoloFx, TiltFx } from '@/components/effects';
import { BorderBeam } from '@/components/ui/Concepts/border-beam';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { Meteors } from '@/components/ui/meteors';

// Futuristic gradients
const gradients = {
  primary:
    'linear-gradient(135deg, var(--brand-solid-strong) 0%, var(--accent-background-strong) 50%, var(--neutral-background-strong) 100%)',
  mesh: 'radial-gradient(at 40% 20%, var(--brand-solid-strong) 0px, transparent 50%), radial-gradient(at 80% 0%, var(--neutral-background-strong) 0px, transparent 50%)',
  holographic:
    'linear-gradient(45deg, #ff0080, #ff8c00, #ffd700, #00ff00, #00ffff, #ff0080)',
  terminal:
    'linear-gradient(180deg, rgba(0, 255, 0, 0.1) 0%, rgba(0, 255, 0, 0.02) 50%, transparent 100%)',
};

// System status types
type SystemStatus = 'operational' | 'warning' | 'critical' | 'maintenance';

// Command center module
interface Module {
  id: string;
  name: string;
  status: SystemStatus;
  uptime: number;
  lastUpdate: string;
  metrics: {
    cpu: number;
    memory: number;
    requests: number;
  };
}

// Live operation log entry
interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  module: string;
}

// System module card with real-time monitoring
const SystemModuleCard: React.FC<{
  module: Module;
  onSelect: (id: string) => void;
  selected: boolean;
}> = ({ module, onSelect, selected }) => {
  const [cpuValue, setCpuValue] = useState(module.metrics.cpu);
  const [memoryValue, setMemoryValue] = useState(module.metrics.memory);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuValue((prev) =>
        Math.max(0, Math.min(100, prev + (Math.random() * 10 - 5)))
      );
      setMemoryValue((prev) =>
        Math.max(0, Math.min(100, prev + (Math.random() * 8 - 4)))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    operational: {
      color: 'var(--success)',
      label: 'OPERATIONAL',
      icon: 'check-circle',
    },
    warning: {
      color: 'var(--warning)',
      label: 'WARNING',
      icon: 'alert-triangle',
    },
    critical: {
      color: 'var(--danger)',
      label: 'CRITICAL',
      icon: 'alert-circle',
    },
    maintenance: { color: 'var(--info)', label: 'MAINTENANCE', icon: 'tool' },
  };

  const config = statusConfig[module.status];

  return (
    <TiltFx>
      <Card
        onClick={() => onSelect(module.id)}
        radius="l"
        padding="l"
        style={{
          background: selected
            ? 'rgba(var(--brand-solid-strong-rgb), 0.1)'
            : 'rgba(var(--background-primary-rgb), 0.8)',
          backdropFilter: 'blur(20px)',
          border: selected
            ? '2px solid var(--brand-solid-strong)'
            : `1px solid ${config.color}30`,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        {selected && <AnimatedBeam />}

        <Column gap="m" fillWidth>
          <Row horizontal="space-between" vertical="center">
            <HoloFx shine={{ opacity: 30 }}>
              <Heading variant="heading-strong-m">{module.name}</Heading>
            </HoloFx>
            <Badge
              variant={
                module.status === 'operational'
                  ? 'success'
                  : module.status === 'warning'
                    ? 'warning'
                    : 'danger'
              }
              size="s"
            >
              <StatusIndicator
                variant={
                  module.status === 'operational'
                    ? 'success'
                    : module.status === 'warning'
                      ? 'warning'
                      : 'danger'
                }
                size="s"
              />
              {config.label}
            </Badge>
          </Row>

          <Grid columns={2} gap="m">
            <Column gap="xs">
              <Row horizontal="space-between">
                <Text variant="label-default-xs" onBackground="neutral-medium">
                  CPU
                </Text>
                <Text variant="label-default-xs">{Math.round(cpuValue)}%</Text>
              </Row>
              <div
                style={{
                  width: '100%',
                  height: '3px',
                  backgroundColor: 'var(--neutral-border-medium)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${cpuValue}%`,
                    height: '100%',
                    backgroundColor:
                      cpuValue > 80
                        ? 'var(--danger-text-strong)'
                        : cpuValue > 60
                          ? 'var(--warning-text-strong)'
                          : 'var(--success-text-strong)',
                    borderRadius: '2px',
                  }}
                />
              </div>
            </Column>

            <Column gap="xs">
              <Row horizontal="space-between">
                <Text variant="label-default-xs" onBackground="neutral-medium">
                  Memory
                </Text>
                <Text variant="label-default-xs">
                  {Math.round(memoryValue)}%
                </Text>
              </Row>
              <div
                style={{
                  width: '100%',
                  height: '3px',
                  backgroundColor: 'var(--neutral-border-medium)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${memoryValue}%`,
                    height: '100%',
                    backgroundColor:
                      memoryValue > 80
                        ? 'var(--danger-text-strong)'
                        : memoryValue > 60
                          ? 'var(--warning-text-strong)'
                          : 'var(--success-text-strong)',
                    borderRadius: '2px',
                  }}
                />
              </div>
            </Column>
          </Grid>

          <Row horizontal="space-between" vertical="center">
            <Column gap="xs">
              <Text variant="label-default-xs" onBackground="neutral-medium">
                Uptime
              </Text>
              <Text variant="body-strong-s">{module.uptime}%</Text>
            </Column>
            <Column gap="xs" alignItems="flex-end">
              <Text variant="label-default-xs" onBackground="neutral-medium">
                Requests/min
              </Text>
              <GlitchFx trigger="custom" interval={3000} speed="fast">
                <Text variant="body-strong-s" style={{ color: config.color }}>
                  {module.metrics.requests.toLocaleString()}
                </Text>
              </GlitchFx>
            </Column>
          </Row>
        </Column>
      </Card>
    </TiltFx>
  );
};

// Terminal-style log viewer
const OperationsLog: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const typeConfig = {
    info: { color: 'var(--info)', icon: 'info' },
    success: { color: 'var(--success)', icon: 'check-circle' },
    warning: { color: 'var(--warning)', icon: 'alert-triangle' },
    error: { color: 'var(--danger)', icon: 'alert-circle' },
  };

  return (
    <Card
      radius="m"
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--brand-solid-strong)',
        height: '400px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Column
        padding="m"
        gap="xs"
        style={{ height: '100%', fontFamily: 'monospace' }}
      >
        <Row horizontal="space-between" vertical="center" paddingBottom="s">
          <Row gap="xs" vertical="center">
            <StatusIndicator variant="success" size="s" />
            <Text variant="label-default-s" style={{ color: 'var(--success)' }}>
              OPERATIONS LOG - LIVE
            </Text>
          </Row>
          <Text
            variant="label-default-xs"
            style={{ color: 'var(--brand-solid-strong)' }}
          >
            {new Date().toLocaleTimeString()}
          </Text>
        </Row>

        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '8px',
          }}
        >
          <Column gap="xs">
            {logs.map((log) => {
              const config = typeConfig[log.type];
              return (
                <Row key={log.id} gap="m" style={{ fontFamily: 'monospace' }}>
                  <Text
                    variant="body-default-xs"
                    style={{
                      color: 'var(--brand-background-medium)',
                      minWidth: '80px',
                    }}
                  >
                    {log.timestamp.toLocaleTimeString()}
                  </Text>
                  <Tag size="xs" variant="neutral" style={{ minWidth: '80px' }}>
                    {log.module}
                  </Tag>
                  <Icon
                    name={config.icon as any}
                    size="xs"
                    style={{ color: config.color, minWidth: '16px' }}
                  />
                  <Text
                    variant="body-default-xs"
                    style={{
                      color: config.color,
                      flex: 1,
                    }}
                  >
                    {log.message}
                  </Text>
                </Row>
              );
            })}
          </Column>
        </div>
      </Column>

      {/* Terminal cursor effect */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          width: '8px',
          height: '16px',
          background: 'var(--success)',
          animation: 'blink 1s infinite',
        }}
      />
    </Card>
  );
};

export default function SpectacularOperationsCenter() {
  const [selectedModule, setSelectedModule] = useState('flextime');
  const [viewMode, setViewMode] = useState('overview');
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // System modules data
  const modules: Module[] = [
    {
      id: 'flextime',
      name: 'FlexTime Scheduling',
      status: 'operational',
      uptime: 99.98,
      lastUpdate: '2 min ago',
      metrics: { cpu: 45, memory: 62, requests: 1847 },
    },
    {
      id: 'awards',
      name: 'Awards Management',
      status: 'operational',
      uptime: 99.95,
      lastUpdate: '5 min ago',
      metrics: { cpu: 38, memory: 54, requests: 923 },
    },
    {
      id: 'credentials',
      name: 'Championship Credentials',
      status: 'warning',
      uptime: 98.2,
      lastUpdate: '1 min ago',
      metrics: { cpu: 78, memory: 82, requests: 2341 },
    },
    {
      id: 'travel',
      name: 'Travel Coordination',
      status: 'operational',
      uptime: 99.99,
      lastUpdate: '30 sec ago',
      metrics: { cpu: 42, memory: 58, requests: 1234 },
    },
    {
      id: 'analytics',
      name: 'Analytics Engine',
      status: 'operational',
      uptime: 99.87,
      lastUpdate: '1 min ago',
      metrics: { cpu: 65, memory: 71, requests: 3456 },
    },
    {
      id: 'ai',
      name: 'Aura AI Assistant',
      status: 'operational',
      uptime: 99.99,
      lastUpdate: 'Just now',
      metrics: { cpu: 52, memory: 67, requests: 4123 },
    },
  ];

  // Simulate live logs
  useEffect(() => {
    const logMessages = [
      {
        type: 'success',
        message: 'Schedule optimization completed',
        module: 'FLEXTIME',
      },
      {
        type: 'info',
        message: 'Processing credential request #4521',
        module: 'CREDENTIALS',
      },
      {
        type: 'success',
        message: 'Travel itinerary generated for Kansas',
        module: 'TRAVEL',
      },
      {
        type: 'warning',
        message: 'High memory usage detected',
        module: 'ANALYTICS',
      },
      {
        type: 'info',
        message: 'AI model training checkpoint saved',
        module: 'AURA',
      },
      {
        type: 'success',
        message: 'Award inventory updated: +250 items',
        module: 'AWARDS',
      },
      {
        type: 'info',
        message: 'Weather data sync completed',
        module: 'FLEXTIME',
      },
      {
        type: 'success',
        message: 'Database backup completed',
        module: 'SYSTEM',
      },
    ];

    const interval = setInterval(() => {
      const randomLog =
        logMessages[Math.floor(Math.random() * logMessages.length)];
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type: randomLog.type as any,
        message: randomLog.message,
        module: randomLog.module,
      };
      setLogs((prev) => [...prev.slice(-20), newLog]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Column
      fillWidth
      gap="xl"
      padding="l"
      maxWidth="xxl"
      marginX="auto"
      style={{
        background: gradients.mesh,
        minHeight: '100vh',
      }}
    >
      {/* Header with glitch effect */}
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
          <Meteors number={10} />

          <Row fillWidth horizontal="space-between" vertical="center" wrap>
            <Column gap="s">
              <Row gap="m" vertical="center">
                <GlitchFx speed="medium" continuous>
                  <Heading variant="display-strong-xl">
                    OPERATIONS COMMAND CENTER
                  </Heading>
                </GlitchFx>
                <Badge variant="info" size="l">
                  <StatusIndicator variant="info" size="s" />
                  LEVEL 5 ACCESS
                </Badge>
              </Row>
              <Text variant="body-default-m" onBackground="neutral-medium">
                Real-time monitoring and control of all HELiiX operational
                systems
              </Text>
            </Column>

            <Row gap="m">
              <SegmentedControl
                buttons={[
                  { label: 'Overview', value: 'overview' },
                  { label: 'Systems', value: 'systems' },
                  { label: 'Metrics', value: 'metrics' },
                ]}
                defaultValue="overview"
                onToggle={setViewMode}
              />
              <HoloFx shine={{ opacity: 80 }} burn={{ opacity: 60 }}>
                <Button
                  variant="danger"
                  size="m"
                  prefixIcon="shield"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--danger) 0%, var(--brand-solid-strong) 100%)',
                    border: 'none',
                  }}
                >
                  Emergency Protocol
                </Button>
              </HoloFx>
            </Row>
          </Row>
        </Card>
      </RevealFx>

      {/* System modules grid */}
      <Column gap="l">
        <RevealFx speed="medium">
          <Row horizontal="space-between" vertical="center">
            <Column gap="xs">
              <Heading variant="heading-strong-l">System Modules</Heading>
              <Text variant="body-default-s" onBackground="neutral-medium">
                Click any module for detailed diagnostics
              </Text>
            </Column>
            <Row gap="s">
              <Badge variant="success" size="m">
                {modules.filter((m) => m.status === 'operational').length}{' '}
                Operational
              </Badge>
              <Badge variant="warning" size="m">
                {modules.filter((m) => m.status === 'warning').length} Warnings
              </Badge>
            </Row>
          </Row>
        </RevealFx>

        <Grid columns={{ base: 1, s: 2, l: 3 }} gap="m">
          {modules.map((module, index) => (
            <RevealFx key={module.id} speed="fast" delay={index * 0.05}>
              <SystemModuleCard
                module={module}
                onSelect={setSelectedModule}
                selected={selectedModule === module.id}
              />
            </RevealFx>
          ))}
        </Grid>
      </Column>

      {/* Main monitoring section */}
      <Grid columns={{ base: 1, l: 2 }} gap="l">
        {/* Performance metrics */}
        <RevealFx speed="medium">
          <Card
            radius="l"
            padding="l"
            style={{
              background: 'rgba(var(--background-primary-rgb), 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(var(--accent-solid-strong-rgb), 0.3)',
            }}
          >
            <Column gap="l" fillWidth>
              <Row horizontal="space-between" vertical="center">
                <Heading variant="heading-strong-l">System Performance</Heading>
                <Row gap="xs">
                  <Chip active>Real-time</Chip>
                  <Chip>Historical</Chip>
                </Row>
              </Row>

              <LineChart
                minHeight={16}
                axis="x"
                legend={{
                  display: true,
                  position: 'top',
                }}
                date={{
                  start: new Date(Date.now() - 3600000),
                  end: new Date(),
                  format: 'HH:mm',
                }}
                series={[
                  { key: 'Requests/sec', color: 'var(--brand-solid-strong)' },
                  {
                    key: 'Response Time (ms)',
                    color: 'var(--accent-solid-strong)',
                  },
                  { key: 'Error Rate', color: 'var(--danger)' },
                ]}
                data={Array.from({ length: 12 }, (_, i) => ({
                  date: new Date(Date.now() - (11 - i) * 300000).toISOString(),
                  'Requests/sec': Math.floor(Math.random() * 500) + 1500,
                  'Response Time (ms)': Math.floor(Math.random() * 50) + 80,
                  'Error Rate': Math.floor(Math.random() * 5),
                }))}
              />

              {/* Quick stats */}
              <Grid columns={3} gap="m">
                {[
                  {
                    label: 'Avg Response',
                    value: '94ms',
                    trend: 'down',
                    good: true,
                  },
                  {
                    label: 'Throughput',
                    value: '2.1K/s',
                    trend: 'up',
                    good: true,
                  },
                  {
                    label: 'Error Rate',
                    value: '0.02%',
                    trend: 'stable',
                    good: true,
                  },
                ].map((stat, index) => (
                  <Card
                    key={index}
                    padding="m"
                    radius="m"
                    style={{
                      background: 'rgba(var(--background-secondary-rgb), 0.4)',
                      border: '1px solid var(--border-medium)',
                    }}
                  >
                    <Column gap="xs" alignItems="center">
                      <Text
                        variant="label-default-xs"
                        onBackground="neutral-medium"
                      >
                        {stat.label}
                      </Text>
                      <Row gap="xs" vertical="center">
                        <Heading variant="heading-strong-m">
                          {stat.value}
                        </Heading>
                        <Icon
                          name={
                            stat.trend === 'up'
                              ? 'trending-up'
                              : stat.trend === 'down'
                                ? 'trending-down'
                                : 'minus'
                          }
                          size="xs"
                          style={{
                            color: stat.good
                              ? 'var(--success)'
                              : 'var(--danger)',
                          }}
                        />
                      </Row>
                    </Column>
                  </Card>
                ))}
              </Grid>
            </Column>
          </Card>
        </RevealFx>

        {/* Network topology visualization */}
        <RevealFx speed="medium" delay={0.1}>
          <Card
            radius="l"
            padding="l"
            style={{
              background: 'rgba(var(--background-primary-rgb), 0.8)',
              backdropFilter: 'blur(20px)',
              border:
                '1px solid rgba(var(--neutral-background-strong-rgb), 0.3)',
            }}
          >
            <Column gap="l" fillWidth>
              <Row horizontal="space-between" vertical="center">
                <Heading variant="heading-strong-l">Network Topology</Heading>
                <Badge variant="success" size="s">
                  <StatusIndicator variant="success" size="xs" />
                  All nodes connected
                </Badge>
              </Row>

              {/* Network visualization placeholder */}
              <div
                style={{
                  height: '280px',
                  background: 'rgba(var(--neutral-background-strong-rgb), 0.3)',
                  borderRadius: 'var(--radius-m)',
                  border: '1px solid var(--border-medium)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Central node */}
                <HoloFx shine={{ opacity: 60 }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: gradients.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 40px var(--brand-solid-strong)',
                    }}
                  >
                    <Icon name="server" size="l" />
                  </div>
                </HoloFx>

                {/* Orbiting nodes */}
                {[0, 60, 120, 180, 240, 300].map((angle, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(100px)`,
                    }}
                  >
                    <TiltFx>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'var(--accent-background-strong)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transform: `rotate(-${angle}deg)`,
                        }}
                      >
                        <Icon name="cpu" size="s" />
                      </div>
                    </TiltFx>
                  </div>
                ))}
              </div>

              {/* Connection stats */}
              <Row gap="m" wrap>
                <Tag size="s" variant="neutral">
                  16 Active Nodes
                </Tag>
                <Tag size="s" variant="neutral">
                  128 Connections
                </Tag>
                <Tag size="s" variant="success">
                  0 Packet Loss
                </Tag>
                <Tag size="s" variant="info">
                  12ms Latency
                </Tag>
              </Row>
            </Column>
          </Card>
        </RevealFx>
      </Grid>

      {/* Operations log */}
      <RevealFx speed="medium" delay={0.2}>
        <Column gap="m">
          <Row horizontal="space-between" vertical="center">
            <Heading variant="heading-strong-l">Live Operations Log</Heading>
            <Row gap="s">
              <Button variant="ghost" size="s" prefixIcon="download">
                Export
              </Button>
              <Button variant="ghost" size="s" prefixIcon="filter">
                Filter
              </Button>
            </Row>
          </Row>
          <OperationsLog logs={logs} />
        </Column>
      </RevealFx>

      {/* Quick actions */}
      <RevealFx speed="fast" delay={0.3}>
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

          <Row horizontal="space-between" vertical="center" wrap gap="l">
            <Column gap="s" flex={1}>
              <Row gap="m" vertical="center">
                <Icon name="sparkles" size="l" />
                <GlitchFx trigger="hover" speed="fast">
                  <Heading
                    variant="heading-strong-l"
                    style={{ color: 'white' }}
                  >
                    AI Operations Assistant Ready
                  </Heading>
                </GlitchFx>
              </Row>
              <Text
                variant="body-default-m"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                Aura AI can optimize your operations, predict issues, and
                automate routine tasks
              </Text>
            </Column>

            <Row gap="m">
              <Button
                variant="secondary"
                size="m"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                }}
              >
                View Recommendations
              </Button>
              <Button
                variant="primary"
                size="m"
                suffixIcon="arrowRight"
                style={{
                  background: 'white',
                  color: 'var(--neutral-background-strong)',
                }}
              >
                Activate AI Mode
              </Button>
            </Row>
          </Row>
        </Card>
      </RevealFx>

      <style jsx>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </Column>
  );
}
