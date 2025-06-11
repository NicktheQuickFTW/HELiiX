"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, Bar, BarChart, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

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
  Users, 
  TrendingUp, 
  Building2,
  Phone,
  Mail,
  Calendar
} from "lucide-react"

// Mock data for contact growth over time
const contactGrowthData = [
  { date: "2024-01-01", total: 45, conference: 15, schools: 30 },
  { date: "2024-02-01", total: 52, conference: 17, schools: 35 },
  { date: "2024-03-01", total: 61, conference: 19, schools: 42 },
  { date: "2024-04-01", total: 68, conference: 20, schools: 48 },
  { date: "2024-05-01", total: 75, conference: 22, schools: 53 },
  { date: "2024-06-01", total: 84, conference: 24, schools: 60 },
  { date: "2024-07-01", total: 92, conference: 26, schools: 66 },
  { date: "2024-08-01", total: 98, conference: 28, schools: 70 },
  { date: "2024-09-01", total: 105, conference: 30, schools: 75 },
  { date: "2024-10-01", total: 112, conference: 32, schools: 80 },
  { date: "2024-11-01", total: 118, conference: 33, schools: 85 },
  { date: "2024-12-01", total: 125, conference: 35, schools: 90 },
]

// Mock data for contact distribution by organization
const organizationData = [
  { organization: "Big 12 Conference", count: 35, color: "var(--chart-1)" },
  { organization: "Texas", count: 12, color: "var(--chart-2)" },
  { organization: "Oklahoma", count: 11, color: "var(--chart-3)" },
  { organization: "Kansas", count: 10, color: "var(--chart-4)" },
  { organization: "Iowa State", count: 9, color: "var(--chart-5)" },
  { organization: "Other Schools", count: 48, color: "var(--muted-foreground)" },
]

// Mock data for contact activity by month
const activityData = [
  { month: "Jan", added: 7, updated: 12, emails: 45 },
  { month: "Feb", added: 5, updated: 8, emails: 38 },
  { month: "Mar", added: 9, updated: 15, emails: 52 },
  { month: "Apr", added: 6, updated: 10, emails: 41 },
  { month: "May", added: 8, updated: 13, emails: 48 },
  { month: "Jun", added: 12, updated: 18, emails: 67 },
  { month: "Jul", added: 8, updated: 14, emails: 55 },
  { month: "Aug", added: 6, updated: 11, emails: 43 },
  { month: "Sep", added: 10, updated: 16, emails: 59 },
  { month: "Oct", added: 7, updated: 12, emails: 46 },
  { month: "Nov", added: 9, updated: 15, emails: 53 },
  { month: "Dec", added: 11, updated: 17, emails: 62 },
]

const chartConfig = {
  total: {
    label: "Total Contacts",
    color: "var(--chart-1)",
  },
  conference: {
    label: "Conference Staff",
    color: "var(--chart-2)",
  },
  schools: {
    label: "School Contacts",
    color: "var(--chart-3)",
  },
  added: {
    label: "Contacts Added",
    color: "var(--chart-1)",
  },
  updated: {
    label: "Contacts Updated",
    color: "var(--chart-2)",
  },
  emails: {
    label: "Emails Sent",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ContactsAnalyticsChart() {
  const [timeRange, setTimeRange] = React.useState("12m")
  const [activeChart, setActiveChart] = React.useState<"growth" | "activity" | "distribution">("growth")

  const filteredGrowthData = contactGrowthData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-12-01")
    let monthsToSubtract = 12
    if (timeRange === "6m") {
      monthsToSubtract = 6
    } else if (timeRange === "3m") {
      monthsToSubtract = 3
    }
    const startDate = new Date(referenceDate)
    startDate.setMonth(startDate.getMonth() - monthsToSubtract)
    return date >= startDate
  })

  const renderGrowthChart = () => (
    <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
      <AreaChart data={filteredGrowthData}>
        <defs>
          <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillConference" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-conference)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-conference)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillSchools" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-schools)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-schools)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString("en-US", {
              month: "short",
              year: "2-digit",
            })
          }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              }}
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="schools"
          type="natural"
          fill="url(#fillSchools)"
          stroke="var(--color-schools)"
          stackId="a"
        />
        <Area
          dataKey="conference"
          type="natural"
          fill="url(#fillConference)"
          stroke="var(--color-conference)"
          stackId="a"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  )

  const renderActivityChart = () => (
    <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
      <BarChart data={activityData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="added" fill="var(--color-added)" radius={4} />
        <Bar dataKey="updated" fill="var(--color-updated)" radius={4} />
        <Bar dataKey="emails" fill="var(--color-emails)" radius={4} />
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  )

  const renderDistributionChart = () => (
    <div className="flex items-center justify-center h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={organizationData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="count"
          >
            {organizationData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: data.color }}
                      />
                      <span className="font-medium">{data.organization}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {data.count} contacts
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            Contact Analytics
          </CardTitle>
          <CardDescription>
            Comprehensive view of contact database growth and engagement
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={activeChart} onValueChange={(value) => setActiveChart(value as any)}>
            <SelectTrigger className="w-[140px] rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="growth" className="rounded-lg">
                Growth Trend
              </SelectItem>
              <SelectItem value="activity" className="rounded-lg">
                Activity
              </SelectItem>
              <SelectItem value="distribution" className="rounded-lg">
                Distribution
              </SelectItem>
            </SelectContent>
          </Select>
          {activeChart === "growth" && (
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px] rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="12m" className="rounded-lg">
                  Last 12 months
                </SelectItem>
                <SelectItem value="6m" className="rounded-lg">
                  Last 6 months
                </SelectItem>
                <SelectItem value="3m" className="rounded-lg">
                  Last 3 months
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="flex items-center space-x-3 p-3 rounded-lg border">
            <div className="p-2 rounded-lg bg-accent/10">
              <Users className="h-4 w-4 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold">125</div>
              <div className="text-xs text-muted-foreground">Total Contacts</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg border">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <Building2 className="h-4 w-4" style={{ color: "var(--chart-2)" }} />
            </div>
            <div>
              <div className="text-2xl font-bold">16</div>
              <div className="text-xs text-muted-foreground">Organizations</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg border">
            <div className="p-2 rounded-lg bg-chart-3/10">
              <Mail className="h-4 w-4" style={{ color: "var(--chart-3)" }} />
            </div>
            <div>
              <div className="text-2xl font-bold">89%</div>
              <div className="text-xs text-muted-foreground">With Email</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg border">
            <div className="p-2 rounded-lg bg-chart-4/10">
              <Phone className="h-4 w-4" style={{ color: "var(--chart-4)" }} />
            </div>
            <div>
              <div className="text-2xl font-bold">76%</div>
              <div className="text-xs text-muted-foreground">With Phone</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        {activeChart === "growth" && renderGrowthChart()}
        {activeChart === "activity" && renderActivityChart()}
        {activeChart === "distribution" && renderDistributionChart()}

        {/* Legend for Distribution Chart */}
        {activeChart === "distribution" && (
          <div className="mt-4">
            <div className="grid gap-2 md:grid-cols-3">
              {organizationData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item.organization}</span>
                  <Badge variant="outline" className="ml-auto">
                    {item.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="mt-6 p-4 rounded-lg bg-muted/30">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-accent mt-0.5" />
            <div className="text-sm">
              <div className="font-medium mb-1">Key Insights</div>
              {activeChart === "growth" && (
                <div className="text-muted-foreground">
                  Contact database has grown by 178% over the past year, with significant growth in member school contacts during summer months.
                </div>
              )}
              {activeChart === "activity" && (
                <div className="text-muted-foreground">
                  Peak activity occurs during championship seasons (March, June) with 67% more email communications than off-season months.
                </div>
              )}
              {activeChart === "distribution" && (
                <div className="text-muted-foreground">
                  28% of contacts are conference staff, while 72% represent member institutions across all 16 Big 12 schools.
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}