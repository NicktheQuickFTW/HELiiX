'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContactsAnalyticsChart } from "@/components/charts/contacts-analytics-chart"
import { SportsPerformanceChart } from "@/components/charts/sports-performance-chart"
import { OperationalMetricsChart } from "@/components/charts/operational-metrics-chart"
import { 
  BarChart3, 
  TrendingUp, 
  Activity,
  Target,
  Users,
  Trophy,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Share,
  Settings,
  Database,
  Sync
} from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center text-white text-2xl">
            <BarChart3 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Big 12 Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive data insights and performance metrics across all conference operations.
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">Real-time Data</Badge>
            <Badge variant="outline">Interactive Charts</Badge>
            <Badge className="bg-accent text-accent-foreground">AI Insights</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/sync">
                <Sync className="h-4 w-4 mr-2" />
                Data Sync
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/contacts">
                <Database className="h-4 w-4 mr-2" />
                Contacts
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Championships</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">19</div>
            <p className="text-xs text-muted-foreground">
              +3 from last season
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">60%</div>
            <p className="text-xs text-muted-foreground">
              $290K of $485K
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events On Time</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              +5% improvement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.8%</div>
            <p className="text-xs text-muted-foreground">
              Above SLA target
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conference Rank</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#1</div>
            <p className="text-xs text-muted-foreground">
              Nationally ranked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Dashboard Controls</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share Dashboard
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Manage data sources, refresh intervals, and export options for comprehensive reporting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Live Data Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Auto-refresh: 5 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Data Sources: Notion, Supabase, Internal APIs</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contacts">Contact Analytics</TabsTrigger>
          <TabsTrigger value="sports">Sports Performance</TabsTrigger>
          <TabsTrigger value="operations">Operational Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <ContactsAnalyticsChart />
          
          {/* Additional Contact Insights */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Engagement Trends</CardTitle>
                <CardDescription>
                  Communication patterns and outreach effectiveness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Open Rate</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Response Rate</span>
                    <span className="text-sm font-medium">34%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conference Call Attendance</span>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Directory Completeness</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Contacted Organizations</CardTitle>
                <CardDescription>
                  Most frequent communication partners this quarter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { org: "Texas Athletics", contacts: 45, change: "+12%" },
                    { org: "Kansas Athletics", contacts: 38, change: "+8%" },
                    { org: "Iowa State Athletics", contacts: 32, change: "+5%" },
                    { org: "Oklahoma State", contacts: 29, change: "+15%" },
                    { org: "Baylor Athletics", contacts: 27, change: "+3%" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{item.org}</div>
                        <div className="text-xs text-muted-foreground">{item.contacts} interactions</div>
                      </div>
                      <Badge variant="secondary" className="text-green-600">
                        {item.change}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sports" className="space-y-4">
          <SportsPerformanceChart />
          
          {/* Additional Sports Insights */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">National Recognition</CardTitle>
                <CardDescription>
                  Big 12 achievements in national rankings and awards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sports in Top 25</span>
                    <span className="text-sm font-medium">42</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">All-Americans</span>
                    <span className="text-sm font-medium">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Coach of the Year Awards</span>
                    <span className="text-sm font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Academic All-Americans</span>
                    <span className="text-sm font-medium">156</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Impact</CardTitle>
                <CardDescription>
                  Financial performance driven by athletic success
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { metric: "TV Revenue", value: "$42.6M", change: "+18%" },
                    { metric: "Ticket Sales", value: "$28.3M", change: "+12%" },
                    { metric: "Merchandise", value: "$15.7M", change: "+8%" },
                    { metric: "Sponsorships", value: "$31.2M", change: "+22%" },
                    { metric: "Championship Bonuses", value: "$8.9M", change: "+35%" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{item.metric}</div>
                        <div className="text-xs text-muted-foreground">{item.value}</div>
                      </div>
                      <Badge variant="secondary" className="text-green-600">
                        {item.change}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <OperationalMetricsChart />
          
          {/* Additional Operational Insights */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Process Automation</CardTitle>
                <CardDescription>
                  Efficiency gains through HELiiX platform automation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Automated Workflows</span>
                    <span className="text-sm font-medium">67</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Manual Tasks Reduced</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Processing Time Saved</span>
                    <span className="text-sm font-medium">342 hrs/month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error Rate Reduction</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resource Utilization</CardTitle>
                <CardDescription>
                  Conference resource allocation and efficiency metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { resource: "Staff Productivity", utilization: "91%", status: "optimal" },
                    { resource: "Technology Assets", utilization: "87%", status: "good" },
                    { resource: "Facility Usage", utilization: "94%", status: "optimal" },
                    { resource: "Vendor Contracts", utilization: "89%", status: "good" },
                    { resource: "Budget Allocation", utilization: "92%", status: "optimal" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{item.resource}</div>
                        <div className="text-xs text-muted-foreground">{item.utilization} utilized</div>
                      </div>
                      <Badge 
                        variant={item.status === "optimal" ? "default" : "secondary"}
                        className={item.status === "optimal" ? "text-green-600" : ""}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Executive Summary
          </CardTitle>
          <CardDescription>
            Key performance indicators and strategic insights for leadership
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">Strengths</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• #1 conference ranking nationally</li>
                <li>• 99.8% system uptime exceeds SLA</li>
                <li>• 94% event completion rate</li>
                <li>• Strong revenue growth (+18% TV)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-amber-600">Opportunities</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Expand contact database (+12% growth)</li>
                <li>• Automate remaining manual processes</li>
                <li>• Increase championship success rate</li>
                <li>• Optimize Technology budget allocation</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">Strategic Focus</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Continue digital transformation</li>
                <li>• Maintain competitive advantage</li>
                <li>• Enhance member school relations</li>
                <li>• Invest in championship programs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}