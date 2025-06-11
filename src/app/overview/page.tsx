'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Trophy,
  DollarSign,
  Users,
  Calendar,
  Activity,
  Brain,
  Search,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building2,
  FileText,
  Settings,
  Zap,
  BarChart3,
  Shield,
  Globe,
  Smartphone
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface PlatformStats {
  championships: {
    totalEvents: number
    activeCredentials: number
    pendingReviews: number
    recentScans: number
  }
  finance: {
    totalDistributed: number
    pendingDistributions: number
    activeAwards: number
    monthlyGrowth: number
  }
  operations: {
    upcomingEvents: number
    activeAlerts: number
    systemHealth: number
    weatherAlerts: number
  }
  users: {
    totalUsers: number
    activeToday: number
    newThisWeek: number
    loginRate: number
  }
}

interface QuickAction {
  title: string
  description: string
  icon: any
  url: string
  category: string
  featured?: boolean
  badge?: string
}

interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: string
  user?: string
  status?: string
}

export default function PlatformOverviewPage() {
  const { user, profile, hasPermission } = useAuth()
  const [stats, setStats] = useState<PlatformStats>({
    championships: { totalEvents: 0, activeCredentials: 0, pendingReviews: 0, recentScans: 0 },
    finance: { totalDistributed: 0, pendingDistributions: 0, activeAwards: 0, monthlyGrowth: 0 },
    operations: { upcomingEvents: 0, activeAlerts: 0, systemHealth: 100, weatherAlerts: 0 },
    users: { totalUsers: 0, activeToday: 0, newThisWeek: 0, loginRate: 0 }
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const quickActions: QuickAction[] = [
    // Championship Actions
    {
      title: "Request Championship Credential",
      description: "Submit a new credential request for upcoming championship events",
      icon: Trophy,
      url: "/championships",
      category: "Championships",
      featured: true,
      badge: "Popular"
    },
    {
      title: "Scan QR Credentials",
      description: "Mobile scanner for venue access control",
      icon: Smartphone,
      url: "/championships/scanner",
      category: "Championships",
      featured: true
    },
    {
      title: "Review Credential Requests",
      description: "Approve or deny pending credential applications",
      icon: CheckCircle,
      url: "/championships/admin/reviews",
      category: "Championships"
    },

    // Financial Actions
    {
      title: "Revenue Distributions",
      description: "Manage quarterly revenue distributions to member schools",
      icon: DollarSign,
      url: "/finance/distributions",
      category: "Finance",
      featured: true
    },
    {
      title: "Budget Management",
      description: "Track and manage Big 12 Conference budgets",
      icon: BarChart3,
      url: "/finance/budgets",
      category: "Finance"
    },
    {
      title: "Awards Tracking",
      description: "Monitor and manage awards and recognition programs",
      icon: Star,
      url: "/awards",
      category: "Finance"
    },

    // Operations Actions
    {
      title: "Weather Command Center",
      description: "Real-time weather monitoring for all venues",
      icon: Globe,
      url: "/weather",
      category: "Operations",
      badge: "Live"
    },
    {
      title: "Event Scheduling",
      description: "AI-powered scheduling and conflict resolution",
      icon: Calendar,
      url: "/scheduling",
      category: "Operations"
    },
    {
      title: "Operations Dashboard",
      description: "Monitor all operational activities and alerts",
      icon: Activity,
      url: "/operations",
      category: "Operations"
    },

    // Teams & Venues
    {
      title: "Member Schools",
      description: "Manage information for all 16 Big 12 member institutions",
      icon: Building2,
      url: "/teams/schools",
      category: "Teams"
    },
    {
      title: "Venue Management",
      description: "Track and manage championship venues and facilities",
      icon: Building2,
      url: "/teams/venues",
      category: "Teams"
    },
    {
      title: "Travel Planning",
      description: "Coordinate travel logistics for teams and staff",
      icon: Users,
      url: "/teams/travel",
      category: "Teams"
    },

    // AI & Analytics
    {
      title: "AI Assistant",
      description: "Get intelligent help with conference operations",
      icon: Brain,
      url: "/ai-assistant",
      category: "AI",
      badge: "Alpha"
    },
    {
      title: "Analytics Dashboard",
      description: "Comprehensive analytics and reporting platform",
      icon: TrendingUp,
      url: "/dashboard",
      category: "AI"
    },
    {
      title: "AI Features",
      description: "Explore advanced AI capabilities and tools",
      icon: Zap,
      url: "/ai-features",
      category: "AI"
    },

    // System Actions
    {
      title: "User Profile",
      description: "Manage your account settings and preferences",
      icon: Settings,
      url: "/profile",
      category: "System"
    },
    {
      title: "Platform Settings",
      description: "Configure system-wide settings and preferences",
      icon: Settings,
      url: "/settings",
      category: "System"
    }
  ]

  useEffect(() => {
    fetchPlatformData()
  }, [user])

  const fetchPlatformData = async () => {
    try {
      // Fetch championship stats
      const { data: events } = await supabase
        .from('championship_events')
        .select('id, status')

      const { data: credentials } = await supabase
        .from('issued_credentials')
        .select('id, status')

      const { data: pendingRequests } = await supabase
        .from('credential_requests')
        .select('id')
        .in('status', ['submitted', 'under_review'])

      // Fetch recent activity
      const { data: accessLogs } = await supabase
        .from('credential_access_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      // Update stats
      setStats(prev => ({
        ...prev,
        championships: {
          totalEvents: events?.length || 0,
          activeCredentials: credentials?.filter(c => c.status === 'active').length || 0,
          pendingReviews: pendingRequests?.length || 0,
          recentScans: accessLogs?.length || 0
        }
      }))

      // Create recent activity from various sources
      const activities: RecentActivity[] = []
      
      // Add recent access logs
      accessLogs?.slice(0, 5).forEach(log => {
        activities.push({
          id: log.id,
          type: 'credential_scan',
          description: `Credential scanned at ${log.access_point}`,
          timestamp: log.created_at,
          status: log.scan_result
        })
      })

      setRecentActivity(activities)

    } catch (error) {
      console.error('Error fetching platform data:', error)
      toast.error('Failed to load platform data')
    } finally {
      setLoading(false)
    }
  }

  const filteredActions = quickActions.filter(action =>
    action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getActionsByCategory = (category: string) => {
    return filteredActions.filter(action => action.category === category)
  }

  const featuredActions = filteredActions.filter(action => action.featured)

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'credential_scan': return Shield
      case 'user_login': return Users
      case 'finance_update': return DollarSign
      case 'event_created': return Calendar
      default: return Activity
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'granted': return 'text-green-600'
      case 'denied': return 'text-red-600'
      case 'pending': return 'text-yellow-600'
      default: return 'text-muted-foreground'
    }
  }

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading platform overview...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-orbitron">Platform Overview</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to HELiiX - Big 12 Conference Operations Platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            System Healthy
          </Badge>
          <Badge variant="outline">
            {profile?.role?.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Welcome Message */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Welcome back, {profile?.first_name || 'User'}!
              </h3>
              <p className="text-blue-700 dark:text-blue-200 mt-1">
                Your role: <strong>{profile?.role?.replace('_', ' ').toUpperCase()}</strong> • 
                Department: <strong>{profile?.department || 'General'}</strong>
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                Access all Big 12 Conference operational tools and data from this unified platform.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Championships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.championships.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.championships.activeCredentials} active credentials
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.championships.pendingReviews} pending reviews
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Finance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$126.2M</div>
            <p className="text-xs text-muted-foreground">Total distributed this year</p>
            <p className="text-xs text-green-600">+12.3% growth</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.operations.systemHealth}%</div>
            <p className="text-xs text-muted-foreground">System health</p>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Platform Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.activeToday}</div>
            <p className="text-xs text-muted-foreground">Active users today</p>
            <p className="text-xs text-muted-foreground">{stats.users.totalUsers} total users</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search features, tools, or actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="featured" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="championships">Championships</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="ai">AI & Analytics</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{action.title}</CardTitle>
                        {action.badge && (
                          <Badge variant="secondary" className="mt-1">
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {action.description}
                  </CardDescription>
                  <Button asChild className="w-full">
                    <Link href={action.url}>
                      Get Started
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {['championships', 'finance', 'operations', 'teams', 'ai'].map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getActionsByCategory(category.charAt(0).toUpperCase() + category.slice(1)).map((action, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{action.title}</CardTitle>
                        {action.badge && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 text-sm">
                      {action.description}
                    </CardDescription>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={action.url}>
                        Open
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Platform Activity
              </CardTitle>
              <CardDescription>
                Latest actions and events across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Recent Activity</h3>
                  <p className="text-muted-foreground">
                    Activity will appear here as you use the platform.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = getActivityIcon(activity.type)
                    return (
                      <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="bg-muted p-2 rounded-lg">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground">
                              {formatTimestamp(activity.timestamp)}
                            </p>
                            {activity.status && (
                              <Badge variant="outline" className={`text-xs ${getStatusColor(activity.status)}`}>
                                {activity.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}