"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Bar, BarChart, Line, LineChart, ComposedChart, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Activity, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

// Mock data for budget utilization over time
const budgetData = [
  { month: "Jan", budget: 485000, spent: 32450, allocated: 78900, remaining: 374200 },
  { month: "Feb", budget: 485000, spent: 67890, allocated: 156780, remaining: 328110 },
  { month: "Mar", budget: 485000, spent: 125670, allocated: 234560, remaining: 359330 },
  { month: "Apr", budget: 485000, spent: 178450, allocated: 298760, remaining: 306550 },
  { month: "May", budget: 485000, spent: 234780, allocated: 367890, remaining: 250220 },
  { month: "Jun", budget: 485000, spent: 290985, allocated: 425670, remaining: 194015 },
  { month: "Jul", budget: 485000, spent: 342150, allocated: 465890, remaining: 142850 },
  { month: "Aug", budget: 485000, spent: 378560, allocated: 485000, remaining: 106440 },
  { month: "Sep", budget: 485000, spent: 412340, allocated: 485000, remaining: 72660 },
  { month: "Oct", budget: 485000, spent: 445670, allocated: 485000, remaining: 39330 },
  { month: "Nov", budget: 485000, spent: 467890, allocated: 485000, remaining: 17110 },
  { month: "Dec", budget: 485000, spent: 485000, allocated: 485000, remaining: 0 },
]

// Mock data for event completion and processing
const eventMetricsData = [
  { week: "Week 1", eventsPlanned: 8, eventsCompleted: 8, onTime: 7, delayed: 1, avgSatisfaction: 4.2 },
  { week: "Week 2", eventsPlanned: 12, eventsCompleted: 11, onTime: 9, delayed: 2, avgSatisfaction: 4.1 },
  { week: "Week 3", eventsPlanned: 15, eventsCompleted: 14, onTime: 12, delayed: 2, avgSatisfaction: 4.4 },
  { week: "Week 4", eventsPlanned: 18, eventsCompleted: 17, onTime: 15, delayed: 2, avgSatisfaction: 4.3 },
  { week: "Week 5", eventsPlanned: 22, eventsCompleted: 22, onTime: 19, delayed: 3, avgSatisfaction: 4.5 },
  { week: "Week 6", eventsPlanned: 19, eventsCompleted: 18, onTime: 16, delayed: 2, avgSatisfaction: 4.2 },
  { week: "Week 7", eventsPlanned: 25, eventsCompleted: 24, onTime: 22, delayed: 2, avgSatisfaction: 4.6 },
  { week: "Week 8", eventsPlanned: 21, eventsCompleted: 21, onTime: 18, delayed: 3, avgSatisfaction: 4.4 },
]

// Mock data for staff productivity and workload
const productivityData = [
  { department: "Operations", efficiency: 92, workload: 85, satisfaction: 4.3, tickets: 124 },
  { department: "Finance", efficiency: 88, workload: 78, satisfaction: 4.1, tickets: 67 },
  { department: "Communications", efficiency: 94, workload: 92, satisfaction: 4.5, tickets: 89 },
  { department: "Championships", efficiency: 90, workload: 88, satisfaction: 4.2, tickets: 156 },
  { department: "Technology", efficiency: 87, workload: 82, satisfaction: 4.0, tickets: 203 },
  { department: "Student Services", efficiency: 91, workload: 79, satisfaction: 4.4, tickets: 78 },
]

// Mock data for system performance and uptime
const systemData = [
  { date: "2024-12-01", uptime: 99.9, responseTime: 145, activeUsers: 2341, errors: 2 },
  { date: "2024-12-02", uptime: 99.7, responseTime: 167, activeUsers: 2456, errors: 5 },
  { date: "2024-12-03", uptime: 99.8, responseTime: 134, activeUsers: 2389, errors: 3 },
  { date: "2024-12-04", uptime: 100.0, responseTime: 123, activeUsers: 2567, errors: 0 },
  { date: "2024-12-05", uptime: 99.6, responseTime: 178, activeUsers: 2623, errors: 7 },
  { date: "2024-12-06", uptime: 99.9, responseTime: 142, activeUsers: 2789, errors: 1 },
  { date: "2024-12-07", uptime: 99.8, responseTime: 156, activeUsers: 2834, errors: 4 },
]

const chartConfig = {
  budget: {
    label: "Total Budget",
    color: "var(--chart-1)",
  },
  spent: {
    label: "Amount Spent",
    color: "var(--chart-2)",
  },
  allocated: {
    label: "Allocated",
    color: "var(--chart-3)",
  },
  remaining: {
    label: "Remaining",
    color: "var(--chart-4)",
  },
  eventsCompleted: {
    label: "Events Completed",
    color: "var(--chart-1)",
  },
  onTime: {
    label: "On Time",
    color: "var(--chart-2)",
  },
  delayed: {
    label: "Delayed",
    color: "var(--chart-3)",
  },
  efficiency: {
    label: "Efficiency %",
    color: "var(--chart-1)",
  },
  workload: {
    label: "Workload %",
    color: "var(--chart-2)",
  },
  uptime: {
    label: "Uptime %",
    color: "var(--chart-1)",
  },
  responseTime: {
    label: "Response Time (ms)",
    color: "var(--chart-2)",
  },
  activeUsers: {
    label: "Active Users",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function OperationalMetricsChart() {
  const [timeRange, setTimeRange] = React.useState("12m")
  const [activeChart, setActiveChart] = React.useState<"budget" | "events" | "productivity" | "system">("budget")

  const renderBudgetChart = () => (
    <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
      <ComposedChart data={budgetData}>
        <defs>
          <linearGradient id="fillSpent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-spent)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-spent)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Area
          dataKey="spent"
          type="natural"
          fill="url(#fillSpent)"
          stroke="var(--color-spent)"
          strokeWidth={2}
        />
        <Line
          dataKey="allocated"
          type="natural"
          stroke="var(--color-allocated)"
          strokeWidth={2}
          strokeDasharray="5 5"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </ComposedChart>
    </ChartContainer>
  )

  const renderEventsChart = () => (
    <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
      <BarChart data={eventMetricsData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="onTime" fill="var(--color-onTime)" radius={4} />
        <Bar dataKey="delayed" fill="var(--color-delayed)" radius={4} />
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  )

  const renderProductivityChart = () => (
    <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
      <BarChart data={productivityData} layout="horizontal">
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis 
          dataKey="department" 
          type="category" 
          tickLine={false} 
          axisLine={false}
          width={120}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="efficiency" fill="var(--color-efficiency)" radius={4} />
        <Bar dataKey="workload" fill="var(--color-workload)" radius={4} />
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  )

  const renderSystemChart = () => (
    <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
      <ComposedChart data={systemData}>
        <CartesianGrid vertical={false} />
        <XAxis 
          dataKey="date" 
          tickLine={false} 
          axisLine={false} 
          tickMargin={8}
          tickFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          }}
        />
        <YAxis yAxisId="left" tickLine={false} axisLine={false} />
        <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="uptime" yAxisId="left" fill="var(--color-uptime)" radius={4} />
        <Line 
          dataKey="responseTime" 
          yAxisId="right" 
          type="natural" 
          stroke="var(--color-responseTime)" 
          strokeWidth={2}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </ComposedChart>
    </ChartContainer>
  )

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            Operational Metrics Dashboard
          </CardTitle>
          <CardDescription>
            Real-time insights into conference operations, efficiency, and system performance
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={activeChart} onValueChange={(value) => setActiveChart(value as any)}>
            <SelectTrigger className="w-[140px] rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="budget" className="rounded-lg">
                Budget
              </SelectItem>
              <SelectItem value="events" className="rounded-lg">
                Events
              </SelectItem>
              <SelectItem value="productivity" className="rounded-lg">
                Productivity
              </SelectItem>
              <SelectItem value="system" className="rounded-lg">
                System
              </SelectItem>
            </SelectContent>
          </Select>
          {activeChart === "budget" && (
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px] rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="12m" className="rounded-lg">
                  12 Months
                </SelectItem>
                <SelectItem value="6m" className="rounded-lg">
                  6 Months
                </SelectItem>
                <SelectItem value="3m" className="rounded-lg">
                  3 Months
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {/* KPI Row */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="flex items-center space-x-3 p-3 rounded-lg border">
            <div className="p-2 rounded-lg bg-accent/10">
              <DollarSign className="h-4 w-4 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold">60%</div>
              <div className="text-xs text-muted-foreground">Budget Used</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg border">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <Calendar className="h-4 w-4" style={{ color: "var(--chart-2)" }} />
            </div>
            <div>
              <div className="text-2xl font-bold">94%</div>
              <div className="text-xs text-muted-foreground">Events On Time</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg border">
            <div className="p-2 rounded-lg bg-chart-3/10">
              <Users className="h-4 w-4" style={{ color: "var(--chart-3)" }} />
            </div>
            <div>
              <div className="text-2xl font-bold">91%</div>
              <div className="text-xs text-muted-foreground">Team Efficiency</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg border">
            <div className="p-2 rounded-lg bg-chart-4/10">
              <Clock className="h-4 w-4" style={{ color: "var(--chart-4)" }} />
            </div>
            <div>
              <div className="text-2xl font-bold">99.8%</div>
              <div className="text-xs text-muted-foreground">System Uptime</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        {activeChart === "budget" && renderBudgetChart()}
        {activeChart === "events" && renderEventsChart()}
        {activeChart === "productivity" && renderProductivityChart()}
        {activeChart === "system" && renderSystemChart()}

        {/* Department Performance Details */}
        {activeChart === "productivity" && (
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Department Performance Details</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {productivityData.map((dept, index) => (
                <div key={dept.department} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-sm">
                      {dept.department.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{dept.department}</div>
                      <div className="text-sm text-muted-foreground">
                        {dept.tickets} active tickets
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={dept.efficiency >= 90 ? "default" : "secondary"}>
                      {dept.efficiency}% efficient
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium">{dept.satisfaction}/5.0</div>
                      <div className="text-xs text-muted-foreground">satisfaction</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts and Status */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg border">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-green-700">All Systems Operational</div>
                <div className="text-muted-foreground">
                  All critical systems are running smoothly with 99.8% uptime this week.
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg border">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-amber-700">Budget Alert</div>
                <div className="text-muted-foreground">
                  Technology department approaching 85% budget utilization with 4 months remaining.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-6 p-4 rounded-lg bg-muted/30">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-accent mt-0.5" />
            <div className="text-sm">
              <div className="font-medium mb-1">Operational Insights</div>
              {activeChart === "budget" && (
                <div className="text-muted-foreground">
                  Budget utilization is on track with seasonal expectations. Q4 typically sees 35% of annual spending due to championship events.
                </div>
              )}
              {activeChart === "events" && (
                <div className="text-muted-foreground">
                  Event completion rate improved by 12% this quarter, with championship weeks showing highest efficiency at 94% on-time delivery.
                </div>
              )}
              {activeChart === "productivity" && (
                <div className="text-muted-foreground">
                  Communications department leads efficiency at 94%, while Technology handles the highest volume with 203 active tickets but needs capacity planning.
                </div>
              )}
              {activeChart === "system" && (
                <div className="text-muted-foreground">
                  System performance exceeds SLA targets with 99.8% uptime. Response times average 150ms, well below the 300ms target.
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}