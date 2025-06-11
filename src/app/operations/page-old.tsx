'use client';

import { useState } from 'react';
import { 
  Background,
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
  Fade
} from '@once-ui-system/core';
import { SafeFade, SafeCard, SafeRow } from '@/components/ui/safe-ui';
import { 
  Calendar,
  Users,
  Trophy,
  DollarSign,
  MapPin,
  FileText,
  BarChart3,
  Brain,
  Activity,
  Zap,
  Building2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Cloud,
  Shield,
  Eye
} from 'lucide-react';
// Components will be built with Once UI
// import { WeatherDashboard } from '@/components/big12/WeatherDashboard';
// import { GovernanceCompliance } from '@/components/big12/GovernanceCompliance';

// HELiiX Operational Modules
const modules = [
  {
    id: 'flextime',
    name: 'FlexTime Scheduling',
    description: 'AI-powered sports scheduling with constraint optimization',
    icon: Calendar,
    status: 'operational',
    metrics: { efficiency: 94, conflicts: 2, scheduled: 2437 },
    color: 'blue'
  },
  {
    id: 'weather',
    name: 'Weather Command Center',
    description: 'Real-time weather monitoring across all 16 campuses',
    icon: Cloud,
    status: 'operational',
    metrics: { campuses: 16, alerts: 2, accuracy: '98%' },
    color: 'sky'
  },
  {
    id: 'governance',
    name: 'XII Playing Rules & Policies',
    description: 'Playing rules, sport policies, and championship manuals',
    icon: Shield,
    status: 'operational',
    metrics: { documents: 147, compliance: 98.2, manuals: 25 },
    color: 'indigo'
  },
  {
    id: 'awards',
    name: 'Awards & Recognition',
    description: 'Inventory tracking for trophies, medals, and honors',
    icon: Trophy,
    status: 'operational',
    metrics: { items: 1250, pending: 47, delivered: 1203 },
    color: 'yellow'
  },
  {
    id: 'finance',
    name: 'Financial Operations',
    description: 'Invoice processing and budget management',
    icon: DollarSign,
    status: 'operational',
    metrics: { processed: '$31.7M', pending: '$2.3M', efficiency: 87 },
    color: 'green'
  },
  {
    id: 'intelligence',
    name: 'FT Scout Intelligence',
    description: 'Institution research, news monitoring, staff changes tracking',
    icon: Eye,
    status: 'operational',
    metrics: { schools: 16, updates: 342, insights: 1245 },
    color: 'purple'
  },
  {
    id: 'analytics',
    name: 'COMPASS Analytics',
    description: 'Performance metrics and predictive analytics',
    icon: BarChart3,
    status: 'operational',
    metrics: { models: 12, accuracy: 91, insights: 3240 },
    color: 'cyan'
  }
];

// Real-time operational events
const recentEvents = [
  { type: 'schedule', message: 'Kansas vs Iowa State rescheduled due to weather', time: '5 min ago', severity: 'warning' },
  { type: 'award', message: '50 Championship medals delivered to TCU', time: '1 hour ago', severity: 'success' },
  { type: 'finance', message: 'Q2 distributions processed - $31.7M total', time: '2 hours ago', severity: 'info' },
  { type: 'travel', message: 'Baseball tournament travel optimized - saved $45K', time: '3 hours ago', severity: 'success' },
];

export default function OperationsPage() {
  const [selectedModule, setSelectedModule] = useState('overview');

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      operational: { variant: 'positive', label: 'Operational' },
      beta: { variant: 'neutral', label: 'Beta' },
      development: { variant: 'warning', label: 'In Development' }
    };
    return variants[status] || variants.development;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'schedule': return Calendar;
      case 'award': return Trophy;
      case 'finance': return DollarSign;
      case 'travel': return MapPin;
      default: return Activity;
    }
  };

  return (
    <Background background="page">
      <Column fillWidth minHeight="100vh" paddingY="xl" gap="xl">
        <Column maxWidth="xl" paddingX="l" gap="xl">
          {/* Header */}
          <SafeFade trigger="inView" translateY="8">
            <SafeRow gap="m" style={{ alignItems: "center" }}>
              <Column 
                background="brand-alpha-medium"
                padding="m" 
                radius="xl" 
                width="56"
                height="56"
                style={{ justifyContent: 'center', alignItems: 'center' }}
              >
                <Brain size={28} />
              </Column>
              <Column gap="xs">
                <Row gap="s" style={{ alignItems: "center" }} wrap>
                  <Heading variant="display-strong-l">
                    HELiiX Operations Center
                  </Heading>
                  <Badge variant="neutral" size="s">
                    <Sparkles size={12} />
                    AI-Powered
                  </Badge>
                </Row>
                <Text variant="body-default-m" onBackground="neutral-weak">
                  Unified command center for Big 12 Conference operations
                </Text>
              </Column>
            </SafeRow>
          </SafeFade>

          {/* System Health */}
          <SafeFade trigger="inView" translateY="8" delay={0.1}>
            <Card padding="l" border="neutral-medium">
              <Column gap="m">
                <SafeRow gap="s" style={{ alignItems: "center" }}>
                  <Activity size={20} />
                  <Heading variant="heading-strong-m">System Health</Heading>
                </SafeRow>
                <Grid columns="4" mobileColumns="2" gap="m">
                  <Column gap="xs">
                    <SafeRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        Overall Health
                      </Text>
                      <Badge variant="accent" size="s">Excellent</Badge>
                    </SafeRow>
                    <Text variant="heading-strong-l">96%</Text>
                  </Column>
                  <Column gap="xs">
                    <SafeRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        AI Processing
                      </Text>
                      <Text variant="body-default-xs" onBackground="accent-strong">
                        2.3ms avg
                      </Text>
                    </SafeRow>
                    <Text variant="heading-strong-l">88%</Text>
                  </Column>
                  <Column gap="xs">
                    <SafeRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        Data Sync
                      </Text>
                      <Text variant="body-default-xs" onBackground="accent-strong">
                        Real-time
                      </Text>
                    </SafeRow>
                    <Text variant="heading-strong-l">100%</Text>
                  </Column>
                  <Column gap="xs">
                    <SafeRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        API Uptime
                      </Text>
                      <Text variant="body-default-xs" onBackground="accent-strong">
                        99.98%
                      </Text>
                    </SafeRow>
                    <Text variant="heading-strong-l">99.98%</Text>
                  </Column>
                </Grid>
              </Column>
            </Card>
          </SafeFade>

          {/* Main Content */}
          <Tabs 
            size="m"
            fillWidth
            selected={selectedModule}
            onSelectionChange={setSelectedModule}
            options={[
              { label: 'Overview', value: 'overview' },
              { label: 'Scheduling', value: 'flextime' },
              { label: 'Weather', value: 'weather' },
              { label: 'Rules & Policies', value: 'governance' },
              { label: 'Awards', value: 'awards' },
              { label: 'Finance', value: 'finance' },
              { label: 'Intelligence', value: 'intelligence' },
              { label: 'Analytics', value: 'analytics' }
            ]}
          />

          {selectedModule === 'overview' && (
            <Column gap="l">
              {/* Operational Modules Grid */}
              <Grid columns="3" mobileColumns="1" tabletColumns="2" gap="m">
                {modules.map((module) => {
                  const Icon = module.icon;
                  const statusBadge = getStatusBadge(module.status);
                  
                  return (
                    <SafeCard 
                      key={module.id} 
                      padding="l"
                      border="neutral-medium"
                      hover
                      onClick={() => setSelectedModule(module.id)}
                    >
                      <Column gap="m">
                        <SafeRow style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                          <SafeRow gap="s" style={{ alignItems: "center" }}>
                            <Column 
                              background="accent-alpha-weak"
                              padding="s" 
                              radius="m" 
                              width="32"
                              height="32"
                              style={{ justifyContent: 'center', alignItems: 'center' }}
                            >
                              <Icon size={16} />
                            </Column>
                            <Heading variant="heading-strong-s">{module.name}</Heading>
                          </SafeRow>
                          <Badge variant={statusBadge.variant} size="s">{statusBadge.label}</Badge>
                        </SafeRow>
                        <Text variant="body-default-s" onBackground="neutral-weak">
                          {module.description}
                        </Text>
                        <Column gap="xs">
                          {Object.entries(module.metrics).map(([key, value]) => (
                            <SafeRow key={key} style={{ justifyContent: "space-between" }}>
                              <Text variant="body-default-xs" onBackground="neutral-weak" style={{ textTransform: 'capitalize' }}>
                                {key}:
                              </Text>
                              <Text variant="body-strong-xs">
                                {typeof value === 'number' && key !== 'efficiency' ? value.toLocaleString() : value}{key === 'efficiency' && '%'}
                              </Text>
                            </SafeRow>
                          ))}
                        </Column>
                        <Button variant="tertiary" size="s" fillWidth suffixIcon="arrowRight">
                          Manage
                        </Button>
                      </Column>
                    </SafeCard>
                  );
                })}
              </Grid>

            {/* Recent Events */}
            <Card padding="l" border="neutral-medium">
              <Column gap="m">
                <Column gap="xs">
                  <Heading variant="heading-strong-s">Recent Activity</Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Real-time operational events across all systems
                  </Text>
                </Column>
                <Column gap="s">
                  {recentEvents.map((event, idx) => {
                    const Icon = getEventIcon(event.type);
                    return (
                      <Card key={idx} padding="m" border="neutral-weak">
                        <SafeRow gap="m" style={{ alignItems: "flex-start" }}>
                          <div className="mt-0.5">
                            {event.severity === 'success' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : event.severity === 'warning' ? (
                              <AlertCircle className="h-5 w-5 text-yellow-500" />
                            ) : (
                              <Icon className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <Column gap="xs" flex="1">
                            <Text variant="body-strong-s">{event.message}</Text>
                            <Text variant="body-default-xs" onBackground="neutral-weak">
                              {event.time}
                            </Text>
                          </Column>
                        </SafeRow>
                      </Card>
                    );
                  })}
                </Column>
              </Column>
            </Card>
          </Column>
        )}

        {selectedModule === 'flextime' && (
          <Card padding="l" border="neutral-medium">
            <Column gap="m">
              <Column gap="xs">
                <Heading variant="heading-strong-s">FlexTime Scheduling Engine</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  AI-powered scheduling with constraint optimization for 25 sports across 16 schools
                </Text>
              </Column>
              <Card padding="m" background="accent-alpha-weak" border="accent-alpha-medium">
                <SafeRow gap="s" style={{ alignItems: "center" }}>
                  <Zap className="h-4 w-4" />
                  <Column gap="xs">
                    <Text variant="body-strong-s">Scheduling Intelligence Active</Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      94% scheduling efficiency with automated conflict resolution
                    </Text>
                  </Column>
                </SafeRow>
              </Card>
              <Grid columns="3" gap="m">
                <Card padding="m" border="neutral-weak" className="text-center">
                  <Column gap="xs" style={{ alignItems: "center" }}>
                    <Heading variant="display-strong-l">2,437</Heading>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Games Scheduled
                    </Text>
                  </Column>
                </Card>
                <Card padding="m" border="neutral-weak" className="text-center">
                  <Column gap="xs" style={{ alignItems: "center" }}>
                    <Heading variant="display-strong-l">2</Heading>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Active Conflicts
                    </Text>
                  </Column>
                </Card>
                <Card padding="m" border="neutral-weak" className="text-center">
                  <Column gap="xs" style={{ alignItems: "center" }}>
                    <Heading variant="display-strong-l">94%</Heading>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Optimization Rate
                    </Text>
                  </Column>
                </Card>
              </Grid>
              <Button variant="primary" size="m" fillWidth>
                <SafeRow gap="xs" style={{ alignItems: "center" }}>
                  <Text>Open FlexTime Scheduler</Text>
                  <ArrowRight className="h-4 w-4" />
                </SafeRow>
              </Button>
            </Column>
          </Card>
        )}

        {selectedModule === 'weather' && (
          <Card padding="l" border="neutral-medium">
            <Column gap="m">
              <Column gap="xs">
                <Heading variant="heading-strong-s">Weather Command Center</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Real-time weather monitoring across all 16 Big 12 campuses
                </Text>
              </Column>
              <Card padding="m" background="accent-alpha-weak" border="accent-alpha-medium">
                <SafeRow gap="s" style={{ alignItems: "center" }}>
                  <Cloud className="h-4 w-4" />
                  <Column gap="xs">
                    <Text variant="body-strong-s">Weather Monitoring Active</Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Real-time data from all 16 campuses with predictive alerts
                    </Text>
                  </Column>
                </SafeRow>
              </Card>
              <Grid columns="4" mobileColumns="2" gap="m">
                <Card padding="m" border="neutral-weak" className="text-center">
                  <Column gap="xs" style={{ alignItems: "center" }}>
                    <Heading variant="display-strong-l">16</Heading>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Campuses Monitored
                    </Text>
                  </Column>
                </Card>
                <Card padding="m" border="neutral-weak" className="text-center">
                  <Column gap="xs" style={{ alignItems: "center" }}>
                    <Heading variant="display-strong-l" className="text-yellow-600">2</Heading>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Active Alerts
                    </Text>
                  </Column>
                </Card>
                <Card padding="m" border="neutral-weak" className="text-center">
                  <Column gap="xs" style={{ alignItems: "center" }}>
                    <Heading variant="display-strong-l">98%</Heading>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Forecast Accuracy
                    </Text>
                  </Column>
                </Card>
                <Card padding="m" border="neutral-weak" className="text-center">
                  <Column gap="xs" style={{ alignItems: "center" }}>
                    <Heading variant="display-strong-l">0</Heading>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Delayed Games
                    </Text>
                  </Column>
                </Card>
              </Grid>
            </Column>
          </Card>
        )}

        {selectedModule === 'governance' && (
          <Card padding="l" border="neutral-medium">
            <Column gap="m">
              <Column gap="xs">
                <Heading variant="heading-strong-s">XII Playing Rules & Policies</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Playing rules, sport policies, and championship manuals management
                </Text>
              </Column>
              <Card padding="m" background="accent-alpha-weak" border="accent-alpha-medium">
                <SafeRow gap="s" style={{ alignItems: "center" }}>
                  <Shield className="h-4 w-4" />
                  <Column gap="xs">
                    <Text variant="body-strong-s">Governance System Active</Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      98.2% compliance rate across all Big 12 sports and policies
                    </Text>
                  </Column>
                </SafeRow>
              </Card>
              <Grid columns="3" gap="m">
                <Card padding="m" border="neutral-weak" className="text-center">
                  <Column gap="xs" style={{ alignItems: "center" }}>
                    <Heading variant="display-strong-l">147</Heading>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Policy Documents
                    </Text>
                  </Column>
                </Card>
                <Card padding="m" border="neutral-weak" className="text-center">
                  <Column gap="xs" style={{ alignItems: "center" }}>
                    <Heading variant="display-strong-l">25</Heading>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Championship Manuals
                    </Text>
                  </Column>
                </Card>
                <Card padding="m" border="neutral-weak" className="text-center">
                  <Column gap="xs" style={{ alignItems: "center" }}>
                    <Heading variant="display-strong-l">98.2%</Heading>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Compliance Rate
                    </Text>
                  </Column>
                </Card>
              </Grid>
            </Column>
          </Card>
        )}

        {selectedModule === 'intelligence' && (
          <Card padding="l" border="neutral-medium">
            <Column gap="m">
              <Column gap="xs">
                <Heading variant="heading-strong-s">FT Scout Intelligence System</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Real-time monitoring of Big 12 institutions, news, and personnel changes
                </Text>
              </Column>
              <Card padding="m" background="accent-alpha-weak" border="accent-alpha-medium">
                <SafeRow gap="s" style={{ alignItems: "center" }}>
                  <Eye className="h-4 w-4" />
                  <Column gap="xs">
                    <Text variant="body-strong-s">Intelligence Active</Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Monitoring all 16 Big 12 schools with 65 specialized research agents
                    </Text>
                  </Column>
                </SafeRow>
              </Card>
              <Grid columns="3" gap="m">
                <Card padding="m" border="neutral-weak" className="text-center">
                  <Column gap="xs" style={{ alignItems: "center" }}>
                    <Heading variant="display-strong-l">342</Heading>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Updates Today
                    </Text>
                  </Column>
                </Card>
                <Card padding="m" border="neutral-weak" className="text-center">
                  <Column gap="xs" style={{ alignItems: "center" }}>
                    <Heading variant="display-strong-l">23</Heading>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Staff Changes
                    </Text>
                  </Column>
                </Card>
                <Card padding="m" border="neutral-weak" className="text-center">
                  <Column gap="xs" style={{ alignItems: "center" }}>
                    <Heading variant="display-strong-l">1,245</Heading>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Insights Generated
                    </Text>
                  </Column>
                </Card>
              </Grid>
              <Column gap="m">
                <Heading variant="heading-strong-xs">Recent Intelligence</Heading>
                <Column gap="s">
                  <Card padding="m" border="neutral-weak">
                    <Column gap="xs">
                      <Text variant="body-strong-s">Kansas State - New Assistant Coach Hired</Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        Basketball program adds recruiting specialist from SEC
                      </Text>
                    </Column>
                  </Card>
                  <Card padding="m" border="neutral-weak">
                    <Column gap="xs">
                      <Text variant="body-strong-s">Texas Tech - Facility Upgrade Announced</Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        $45M renovation of football training complex approved
                      </Text>
                    </Column>
                  </Card>
                  <Card padding="m" border="neutral-weak">
                    <Column gap="xs">
                      <Text variant="body-strong-s">UCF - Transfer Portal Activity</Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        5-star quarterback enters portal, multiple Big 12 schools interested
                      </Text>
                    </Column>
                  </Card>
                </Column>
              </Column>
            </Column>
          </Card>
        )}

          {/* Additional module tabs would go here */}
        </Column>
      </Column>
    </Background>
  );
}