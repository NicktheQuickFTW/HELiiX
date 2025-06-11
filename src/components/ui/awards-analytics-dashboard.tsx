"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts'
import { 
  TrendingUp, TrendingDown, Award, Users, Calendar, Trophy, 
  Target, BarChart3, PieChart as PieChartIcon, Activity,
  Download, Filter, RefreshCw
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

interface AnalyticsData {
  overview: {
    totalAwards: number
    totalRecipients: number
    completionRate: number
    averageDeliveryTime: number
    topPerformingSport: string
    growthRate: number
  }
  sportPerformance: Array<{
    sport: string
    awards: number
    recipients: number
    completion: number
    satisfaction: number
    efficiency: number
  }>
  deliveryAnalytics: Array<{
    month: string
    ordered: number
    delivered: number
    pending: number
    cancelled: number
  }>
  recipientAnalytics: Array<{
    school: string
    totalAwards: number
    individual: number
    team: number
    categories: Array<{ category: string; count: number }>
  }>
  trendAnalysis: Array<{
    year: string
    totalAwards: number
    budget: number
    efficiency: number
    satisfaction: number
  }>
  geographicDistribution: Array<{
    region: string
    schools: number
    awards: number
    value: number
  }>
  performanceMetrics: {
    deliveryAccuracy: number
    budgetAdherence: number
    qualityScore: number
    vendorReliability: number
    processEfficiency: number
    recipientSatisfaction: number
  }
  categoryInsights: Array<{
    category: string
    demand: number
    costEfficiency: number
    leadTime: number
    popularity: number
    trend: 'up' | 'down' | 'stable'
  }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C']

export function AwardsAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState("year")
  const [selectedMetric, setSelectedMetric] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedTimeframe, selectedMetric])

  const fetchAnalyticsData = async () => {
    setRefreshing(true)
    // Mock data - replace with actual API call
    const mockData: AnalyticsData = {
      overview: {
        totalAwards: 2022,
        totalRecipients: 1847,
        completionRate: 94.2,
        averageDeliveryTime: 14.5,
        topPerformingSport: "Football",
        growthRate: 12.8
      },
      sportPerformance: [
        { sport: "Football", awards: 285, recipients: 264, completion: 96.8, satisfaction: 4.8, efficiency: 92.5 },
        { sport: "Basketball (M)", awards: 245, recipients: 230, completion: 94.2, satisfaction: 4.7, efficiency: 89.3 },
        { sport: "Basketball (W)", awards: 245, recipients: 235, completion: 95.1, satisfaction: 4.6, efficiency: 90.1 },
        { sport: "Baseball", awards: 180, recipients: 168, completion: 92.4, satisfaction: 4.5, efficiency: 87.2 },
        { sport: "Softball", awards: 165, recipients: 158, completion: 93.6, satisfaction: 4.7, efficiency: 88.9 },
        { sport: "Soccer", awards: 150, recipients: 142, completion: 91.8, satisfaction: 4.4, efficiency: 85.6 },
        { sport: "Volleyball", awards: 140, recipients: 134, completion: 94.5, satisfaction: 4.6, efficiency: 89.7 },
        { sport: "Track & Field", awards: 325, recipients: 298, completion: 93.2, satisfaction: 4.5, efficiency: 88.1 },
        { sport: "Swimming", awards: 120, recipients: 115, completion: 95.8, satisfaction: 4.8, efficiency: 91.3 },
        { sport: "Tennis", awards: 95, recipients: 89, completion: 92.1, satisfaction: 4.4, efficiency: 86.8 }
      ],
      deliveryAnalytics: [
        { month: "Jul", ordered: 145, delivered: 142, pending: 3, cancelled: 2 },
        { month: "Aug", ordered: 180, delivered: 175, pending: 4, cancelled: 1 },
        { month: "Sep", ordered: 220, delivered: 210, pending: 8, cancelled: 2 },
        { month: "Oct", ordered: 285, delivered: 275, pending: 9, cancelled: 1 },
        { month: "Nov", ordered: 320, delivered: 305, pending: 12, cancelled: 3 },
        { month: "Dec", ordered: 280, delivered: 270, pending: 8, cancelled: 2 },
        { month: "Jan", ordered: 190, delivered: 0, pending: 190, cancelled: 0 },
        { month: "Feb", ordered: 150, delivered: 0, pending: 150, cancelled: 0 },
        { month: "Mar", ordered: 120, delivered: 0, pending: 120, cancelled: 0 },
        { month: "Apr", ordered: 80, delivered: 0, pending: 80, cancelled: 0 },
        { month: "May", ordered: 60, delivered: 0, pending: 60, cancelled: 0 },
        { month: "Jun", ordered: 45, delivered: 0, pending: 45, cancelled: 0 }
      ],
      recipientAnalytics: [
        { 
          school: "Kansas", 
          totalAwards: 145, 
          individual: 89, 
          team: 56,
          categories: [
            { category: "All-Conference", count: 45 },
            { category: "Player of Year", count: 12 },
            { category: "Academic", count: 28 },
            { category: "Championship", count: 35 },
            { category: "Milestone", count: 25 }
          ]
        },
        { 
          school: "Texas Tech", 
          totalAwards: 138, 
          individual: 85, 
          team: 53,
          categories: [
            { category: "All-Conference", count: 42 },
            { category: "Player of Year", count: 11 },
            { category: "Academic", count: 26 },
            { category: "Championship", count: 33 },
            { category: "Milestone", count: 26 }
          ]
        },
        { 
          school: "Baylor", 
          totalAwards: 142, 
          individual: 88, 
          team: 54,
          categories: [
            { category: "All-Conference", count: 44 },
            { category: "Player of Year", count: 13 },
            { category: "Academic", count: 27 },
            { category: "Championship", count: 32 },
            { category: "Milestone", count: 26 }
          ]
        }
      ],
      trendAnalysis: [
        { year: "2020-21", totalAwards: 1650, budget: 125000, efficiency: 78.5, satisfaction: 4.2 },
        { year: "2021-22", totalAwards: 1780, budget: 135000, efficiency: 82.1, satisfaction: 4.3 },
        { year: "2022-23", totalAwards: 1920, budget: 145000, efficiency: 86.8, satisfaction: 4.5 },
        { year: "2023-24", totalAwards: 1985, budget: 148000, efficiency: 89.2, satisfaction: 4.6 },
        { year: "2024-25", totalAwards: 2022, budget: 151437, efficiency: 91.8, satisfaction: 4.7 }
      ],
      geographicDistribution: [
        { region: "South Central", schools: 6, awards: 782, value: 68500 },
        { region: "Mountain West", schools: 4, awards: 485, value: 42300 },
        { region: "Southeast", schools: 3, awards: 368, value: 31200 },
        { region: "Southwest", schools: 2, awards: 254, value: 22100 },
        { region: "Great Plains", schools: 1, awards: 133, value: 11400 }
      ],
      performanceMetrics: {
        deliveryAccuracy: 96.8,
        budgetAdherence: 94.2,
        qualityScore: 92.5,
        vendorReliability: 89.7,
        processEfficiency: 91.3,
        recipientSatisfaction: 4.6
      },
      categoryInsights: [
        { category: "Champion Trophies", demand: 95, costEfficiency: 88, leadTime: 21, popularity: 92, trend: "up" },
        { category: "OTY Awards", demand: 88, costEfficiency: 92, leadTime: 14, popularity: 89, trend: "stable" },
        { category: "All-Big 12 Trophies", demand: 92, costEfficiency: 85, leadTime: 18, popularity: 94, trend: "up" },
        { category: "Medallions", demand: 78, costEfficiency: 96, leadTime: 10, popularity: 82, trend: "down" },
        { category: "MOP Awards", demand: 85, costEfficiency: 90, leadTime: 16, popularity: 87, trend: "stable" }
      ]
    }
    
    setAnalyticsData(mockData)
    setRefreshing(false)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const exportAnalytics = () => {
    toast.success("Analytics exported", {
      description: "Awards analytics report has been downloaded",
    })
  }

  if (!analyticsData) {
    return <div>Loading analytics data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Awards Analytics Dashboard</h2>
          <p className="text-muted-foreground">Performance insights and trend analysis</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metrics</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="quality">Quality</SelectItem>
              <SelectItem value="satisfaction">Satisfaction</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalyticsData} variant="outline" disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportAnalytics} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Separator />

      {/* Overview KPIs */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Awards</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalAwards.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{analyticsData.overview.growthRate}% vs last year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalRecipients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across 16 schools
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.completionRate}%</div>
            <Progress value={analyticsData.overview.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.averageDeliveryTime} days</div>
            <p className="text-xs text-muted-foreground">
              Industry target: 21 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Sport</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{analyticsData.overview.topPerformingSport}</div>
            <p className="text-xs text-muted-foreground">
              Most awards this year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5.0</div>
            <p className="text-xs text-muted-foreground">
              Average rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="sports">Sports Analysis</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Trends</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Radar</CardTitle>
                <CardDescription>Overall system performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={[
                    { subject: 'Delivery', A: analyticsData.performanceMetrics.deliveryAccuracy, fullMark: 100 },
                    { subject: 'Budget', A: analyticsData.performanceMetrics.budgetAdherence, fullMark: 100 },
                    { subject: 'Quality', A: analyticsData.performanceMetrics.qualityScore, fullMark: 100 },
                    { subject: 'Vendor', A: analyticsData.performanceMetrics.vendorReliability, fullMark: 100 },
                    { subject: 'Process', A: analyticsData.performanceMetrics.processEfficiency, fullMark: 100 },
                    { subject: 'Satisfaction', A: analyticsData.performanceMetrics.recipientSatisfaction * 20, fullMark: 100 }
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Performance" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Year-over-Year Trends</CardTitle>
                <CardDescription>Historical performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.trendAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="totalAwards" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="efficiency" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Detailed performance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {Object.entries(analyticsData.performanceMetrics).map(([key, value]) => {
                  const displayValue = key === 'recipientSatisfaction' ? value.toFixed(1) : `${value}%`
                  const progressValue = key === 'recipientSatisfaction' ? (value / 5) * 100 : value
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                        <span className={`text-sm font-bold ${getPerformanceColor(progressValue)}`}>
                          {displayValue}
                        </span>
                      </div>
                      <Progress value={progressValue} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sport Performance Analysis</CardTitle>
              <CardDescription>Awards distribution and efficiency by sport</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.sportPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sport" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="awards" fill="#8884d8" name="Awards" />
                  <Bar dataKey="recipients" fill="#82ca9d" name="Recipients" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sport</TableHead>
                    <TableHead>Awards</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Satisfaction</TableHead>
                    <TableHead>Efficiency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.sportPerformance.map((sport) => (
                    <TableRow key={sport.sport}>
                      <TableCell className="font-medium">{sport.sport}</TableCell>
                      <TableCell>{sport.awards}</TableCell>
                      <TableCell>{sport.recipients}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={sport.completion} className="w-16" />
                          <span className="text-sm">{sport.completion}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{sport.satisfaction}/5</TableCell>
                      <TableCell>
                        <span className={getPerformanceColor(sport.efficiency)}>
                          {sport.efficiency}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Performance Trends</CardTitle>
              <CardDescription>Monthly order and delivery tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData.deliveryAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="ordered" stroke="#8884d8" strokeWidth={2} name="Ordered" />
                  <Line type="monotone" dataKey="delivered" stroke="#82ca9d" strokeWidth={2} name="Delivered" />
                  <Line type="monotone" dataKey="pending" stroke="#ffc658" strokeWidth={2} name="Pending" />
                  <Line type="monotone" dataKey="cancelled" stroke="#ff7c7c" strokeWidth={2} name="Cancelled" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipients" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Recipient Schools</CardTitle>
                <CardDescription>Awards distribution by institution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.recipientAnalytics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ school, totalAwards }) => `${school}: ${totalAwards}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalAwards"
                    >
                      {analyticsData.recipientAnalytics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Individual vs Team Awards</CardTitle>
                <CardDescription>Award type distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.recipientAnalytics.slice(0, 5).map((school) => (
                    <div key={school.school} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{school.school}</span>
                        <span>{school.totalAwards} total</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="bg-blue-500 h-2 rounded-l" style={{ width: `${(school.individual / school.totalAwards) * 100}%` }} />
                        <div className="bg-green-500 h-2 rounded-r" style={{ width: `${(school.team / school.totalAwards) * 100}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Individual: {school.individual}</span>
                        <span>Team: {school.team}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Awards and value by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.geographicDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="awards" fill="#8884d8" name="Awards" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="space-y-4">
                  {analyticsData.geographicDistribution.map((region) => (
                    <div key={region.region} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{region.region}</div>
                        <div className="text-sm text-muted-foreground">{region.schools} schools</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{region.awards} awards</div>
                        <div className="text-sm text-muted-foreground">${region.value.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance Insights</CardTitle>
              <CardDescription>Demand, efficiency, and trend analysis by award category</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Demand</TableHead>
                    <TableHead>Cost Efficiency</TableHead>
                    <TableHead>Lead Time</TableHead>
                    <TableHead>Popularity</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.categoryInsights.map((category) => (
                    <TableRow key={category.category}>
                      <TableCell className="font-medium">{category.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={category.demand} className="w-16" />
                          <span className="text-sm">{category.demand}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={getPerformanceColor(category.costEfficiency)}>
                          {category.costEfficiency}%
                        </span>
                      </TableCell>
                      <TableCell>{category.leadTime} days</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={category.popularity} className="w-16" />
                          <span className="text-sm">{category.popularity}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(category.trend)}
                          <span className="capitalize text-sm">{category.trend}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}