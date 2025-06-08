'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { WeatherDashboard } from '@/components/big12/weather-dashboard';
import { GovernanceCompliance } from '@/components/big12/governance-compliance';

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
      operational: { variant: 'default', label: 'Operational' },
      beta: { variant: 'secondary', label: 'Beta' },
      development: { variant: 'outline', label: 'In Development' }
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
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              HELiiX Operations Center
              <Badge variant="secondary" className="ml-2">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              Unified command center for Big 12 Conference operations
            </p>
          </div>
        </div>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Health</span>
                <Badge variant="default">Excellent</Badge>
              </div>
              <Progress value={96} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">AI Processing</span>
                <span className="text-sm text-muted-foreground">2.3ms avg</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Data Sync</span>
                <span className="text-sm text-muted-foreground">Real-time</span>
              </div>
              <Progress value={100} className="h-2 [&>div]:bg-green-500" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">API Uptime</span>
                <span className="text-sm text-muted-foreground">99.98%</span>
              </div>
              <Progress value={99.98} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={selectedModule} onValueChange={setSelectedModule} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="flextime">Scheduling</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="governance">Rules & Policies</TabsTrigger>
          <TabsTrigger value="awards">Awards</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Operational Modules Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;
              const statusBadge = getStatusBadge(module.status);
              
              return (
                <Card 
                  key={module.id} 
                  className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => setSelectedModule(module.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${module.color}-100 dark:bg-${module.color}-900/20 rounded-lg`}>
                          <Icon className={`h-5 w-5 text-${module.color}-600 dark:text-${module.color}-400`} />
                        </div>
                        <CardTitle className="text-base">{module.name}</CardTitle>
                      </div>
                      <Badge {...statusBadge}>{statusBadge.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                    <div className="space-y-2">
                      {Object.entries(module.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="capitalize text-muted-foreground">{key}:</span>
                          <span className="font-medium">{typeof value === 'number' && key !== 'efficiency' ? value.toLocaleString() : value}{key === 'efficiency' && '%'}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-4" size="sm">
                      Manage <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Real-time operational events across all systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEvents.map((event, idx) => {
                  const Icon = getEventIcon(event.type);
                  return (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="mt-0.5">
                        {event.severity === 'success' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : event.severity === 'warning' ? (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.message}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flextime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FlexTime Scheduling Engine</CardTitle>
              <CardDescription>
                AI-powered scheduling with constraint optimization for 25 sports across 16 schools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Zap className="h-4 w-4" />
                <AlertTitle>Scheduling Intelligence Active</AlertTitle>
                <AlertDescription>
                  94% scheduling efficiency with automated conflict resolution
                </AlertDescription>
              </Alert>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold">2,437</div>
                  <p className="text-sm text-muted-foreground">Games Scheduled</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold">2</div>
                  <p className="text-sm text-muted-foreground">Active Conflicts</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold">94%</div>
                  <p className="text-sm text-muted-foreground">Optimization Rate</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button className="w-full">
                  Open FlexTime Scheduler <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weather" className="space-y-4">
          <WeatherDashboard />
        </TabsContent>

        <TabsContent value="governance" className="space-y-4">
          <GovernanceCompliance />
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FT Scout Intelligence System</CardTitle>
              <CardDescription>
                Real-time monitoring of Big 12 institutions, news, and personnel changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Eye className="h-4 w-4" />
                <AlertTitle>Intelligence Active</AlertTitle>
                <AlertDescription>
                  Monitoring all 16 Big 12 schools with 65 specialized research agents
                </AlertDescription>
              </Alert>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold">342</div>
                  <p className="text-sm text-muted-foreground">Updates Today</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold">23</div>
                  <p className="text-sm text-muted-foreground">Staff Changes</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold">1,245</div>
                  <p className="text-sm text-muted-foreground">Insights Generated</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <h4 className="font-medium">Recent Intelligence</h4>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">Kansas State - New Assistant Coach Hired</p>
                    <p className="text-xs text-muted-foreground">Basketball program adds recruiting specialist from SEC</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">Texas Tech - Facility Upgrade Announced</p>
                    <p className="text-xs text-muted-foreground">$45M renovation of football training complex approved</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">UCF - Transfer Portal Activity</p>
                    <p className="text-xs text-muted-foreground">5-star quarterback enters portal, multiple Big 12 schools interested</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional module tabs would go here */}
      </Tabs>
    </div>
  );
}