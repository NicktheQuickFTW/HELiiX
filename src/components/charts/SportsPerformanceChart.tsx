"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Bar, BarChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts"

import { Card, Badge, Dropdown, Option } from "@once-ui-system/core"
import { 
  Trophy, 
  TrendingUp, 
  Medal,
  Target,
  Star,
  Award
} from "lucide-react"

// Mock data for conference performance over seasons
const performanceData = [
  { season: "2019-20", wins: 1247, losses: 823, championships: 12, ncaaBids: 45, rank: 3 },
  { season: "2020-21", wins: 987, losses: 654, championships: 8, ncaaBids: 32, rank: 4 },
  { season: "2021-22", wins: 1356, losses: 891, championships: 15, ncaaBids: 52, rank: 2 },
  { season: "2022-23", wins: 1423, losses: 867, championships: 18, ncaaBids: 58, rank: 1 },
  { season: "2023-24", wins: 1398, losses: 902, championships: 16, ncaaBids: 54, rank: 2 },
  { season: "2024-25", wins: 1456, losses: 834, championships: 19, ncaaBids: 61, rank: 1 },
]

// Mock data for sports rankings comparison
const rankingsData = [
  { sport: "Football", big12Avg: 15.2, nationalAvg: 35.8, teams: 16 },
  { sport: "M Basketball", big12Avg: 28.4, nationalAvg: 68.5, teams: 16 },
  { sport: "W Basketball", big12Avg: 32.1, nationalAvg: 72.3, teams: 16 },
  { sport: "Baseball", big12Avg: 24.6, nationalAvg: 58.7, teams: 14 },
  { sport: "Softball", big12Avg: 31.8, nationalAvg: 65.4, teams: 11 },
  { sport: "Soccer", big12Avg: 29.3, nationalAvg: 67.2, teams: 16 },
  { sport: "Volleyball", big12Avg: 25.7, nationalAvg: 61.9, teams: 15 },
  { sport: "Track & Field", big12Avg: 18.9, nationalAvg: 52.3, teams: 16 },
]

// Mock data for championship distribution by school
const championshipData = [
  { school: "Texas", championships: 12, ncaaApps: 28, natChamps: 3 },
  { school: "Oklahoma", championships: 11, ncaaApps: 25, natChamps: 2 },
  { school: "Kansas", championships: 9, ncaaApps: 22, natChamps: 1 },
  { school: "Iowa State", championships: 8, ncaaApps: 19, natChamps: 1 },
  { school: "Baylor", championships: 7, ncaaApps: 18, natChamps: 2 },
  { school: "Texas Tech", championships: 6, ncaaApps: 16, natChamps: 0 },
  { school: "Oklahoma State", championships: 8, ncaaApps: 21, natChamps: 1 },
  { school: "West Virginia", championships: 5, ncaaApps: 14, natChamps: 0 },
]

// Mock data for conference strength radar
const strengthData = [
  { category: "Academic Excellence", value: 92, fullMark: 100 },
  { category: "Athletic Performance", value: 88, fullMark: 100 },
  { category: "Revenue Generation", value: 95, fullMark: 100 },
  { category: "Fan Engagement", value: 85, fullMark: 100 },
  { category: "Media Coverage", value: 91, fullMark: 100 },
  { category: "Facility Quality", value: 89, fullMark: 100 },
  { category: "Recruiting Power", value: 87, fullMark: 100 },
  { category: "Championship Success", value: 84, fullMark: 100 },
]

const chartConfig = {
  wins: {
    label: "Wins",
    color: "var(--chart-1)",
  },
  losses: {
    label: "Losses", 
    color: "var(--chart-2)",
  },
  championships: {
    label: "Championships",
    color: "var(--chart-3)",
  },
  ncaaBids: {
    label: "NCAA Bids",
    color: "var(--chart-4)",
  },
  big12Avg: {
    label: "Big 12 Average",
    color: "var(--chart-1)",
  },
  nationalAvg: {
    label: "National Average",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function SportsPerformanceChart() {
  const [timeRange, setTimeRange] = React.useState("6y")
  const [activeChart, setActiveChart] = React.useState<"performance" | "rankings" | "championships" | "strength">("performance")

  const filteredPerformanceData = performanceData.filter((item) => {
    if (timeRange === "3y") {
      return ["2022-23", "2023-24", "2024-25"].includes(item.season)
    } else if (timeRange === "5y") {
      return !["2019-20"].includes(item.season)
    }
    return true // 6y shows all data
  })

  const renderPerformanceChart = () => (
    <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
      <AreaChart data={filteredPerformanceData}>
        <defs>
          <linearGradient id="fillWins" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-wins)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-wins)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillChampionships" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-championships)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-championships)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="season"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
        />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="wins"
          type="natural"
          fill="url(#fillWins)"
          stroke="var(--color-wins)"
          strokeWidth={2}
        />
        <Area
          dataKey="championships"
          type="natural"
          fill="url(#fillChampionships)"
          stroke="var(--color-championships)"
          strokeWidth={2}
          yAxisId="right"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  )

  const renderRankingsChart = () => (
    <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
      <BarChart data={rankingsData} layout="horizontal">
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis 
          dataKey="sport" 
          type="category" 
          tickLine={false} 
          axisLine={false}
          width={80}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="big12Avg" fill="var(--color-big12Avg)" radius={4} />
        <Bar dataKey="nationalAvg" fill="var(--color-nationalAvg)" radius={4} />
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  )

  const renderChampionshipsChart = () => (
    <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
      <BarChart data={championshipData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="school"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="championships" fill="var(--color-championships)" radius={4} />
        <Bar dataKey="ncaaApps" fill="var(--color-ncaaBids)" radius={4} />
      </BarChart>
    </ChartContainer>
  )

  const renderStrengthChart = () => (
    <div className="flex items-center justify-center h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={strengthData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            tickCount={6}
          />
          <Radar
            name="Big 12 Conference"
            dataKey="value"
            stroke="var(--chart-1)"
            fill="var(--chart-1)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="font-medium">{data.category}</div>
                    <div className="text-sm text-muted-foreground">
                      Score: {data.value}/100
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Sports Performance Analytics
          </CardTitle>
          <CardDescription>
            Conference-wide athletic performance metrics and competitive analysis
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={activeChart} onValueChange={(value) => setActiveChart(value as any)}>
            <SelectTrigger className="w-[140px] rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="performance" className="rounded-lg">
                Performance
              </SelectItem>
              <SelectItem value="rankings" className="rounded-lg">
                Rankings
              </SelectItem>
              <SelectItem value="championships" className="rounded-lg">
                Championships
              </SelectItem>
              <SelectItem value="strength" className="rounded-lg">
                Strength
              </SelectItem>
            </SelectContent>
          </Select>
          {activeChart === "performance" && (
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px] rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="6y" className="rounded-lg">
                  6 Years
                </SelectItem>
                <SelectItem value="5y" className="rounded-lg">
                  5 Years
                </SelectItem>
                <SelectItem value="3y" className="rounded-lg">
                  3 Years
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
              <Trophy className="h-4 w-4 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold">19</div>
              <div className="text-xs text-muted-foreground">Championships</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg border">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <Medal className="h-4 w-4" style={{ color: "var(--chart-2)" }} />
            </div>
            <div>
              <div className="text-2xl font-bold">61</div>
              <div className="text-xs text-muted-foreground">NCAA Bids</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg border">
            <div className="p-2 rounded-lg bg-chart-3/10">
              <Target className="h-4 w-4" style={{ color: "var(--chart-3)" }} />
            </div>
            <div>
              <div className="text-2xl font-bold">#1</div>
              <div className="text-xs text-muted-foreground">Conference Rank</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg border">
            <div className="p-2 rounded-lg bg-chart-4/10">
              <Star className="h-4 w-4" style={{ color: "var(--chart-4)" }} />
            </div>
            <div>
              <div className="text-2xl font-bold">89%</div>
              <div className="text-xs text-muted-foreground">Win Rate</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        {activeChart === "performance" && renderPerformanceChart()}
        {activeChart === "rankings" && renderRankingsChart()}
        {activeChart === "championships" && renderChampionshipsChart()}
        {activeChart === "strength" && renderStrengthChart()}

        {/* Top Performers */}
        {activeChart === "championships" && (
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Top Performing Schools</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {championshipData.slice(0, 4).map((school, index) => (
                <div key={school.school} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{school.school}</div>
                      <div className="text-sm text-muted-foreground">
                        {school.championships} championships, {school.ncaaApps} NCAA appearances
                      </div>
                    </div>
                  </div>
                  {school.natChamps > 0 && (
                    <Badge variant="default" className="bg-chart-3">
                      {school.natChamps} National
                    </Badge>
                  )}
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
              <div className="font-medium mb-1">Performance Insights</div>
              {activeChart === "performance" && (
                <div className="text-muted-foreground">
                  Big 12 Conference ranks #1 nationally with 19 championships and 61 NCAA tournament bids this season, marking our strongest performance in over a decade.
                </div>
              )}
              {activeChart === "rankings" && (
                <div className="text-muted-foreground">
                  Big 12 schools consistently outperform national averages across all major sports, with Football and Track & Field showing the strongest competitive advantages.
                </div>
              )}
              {activeChart === "championships" && (
                <div className="text-muted-foreground">
                  Texas leads with 12 championships, while 8 schools have captured national titles, demonstrating the depth and competitiveness across the conference.
                </div>
              )}
              {activeChart === "strength" && (
                <div className="text-muted-foreground">
                  Revenue generation (95%) and academic excellence (92%) are our strongest metrics, with opportunities for growth in championship success and recruiting power.
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}