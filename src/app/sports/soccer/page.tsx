'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { 
  Trophy, 
  Users, 
  Calendar, 
  MapPin,
  Clock,
  Target,
  Medal,
  Zap,
  ArrowLeft,
  TrendingUp,
  Star,
  Award,
  ChevronRight
} from "lucide-react"

const soccerTeams = [
  { school: "West Virginia", record: "12-3-2", ranking: "#5", conference: "8-1-1" },
  { school: "BYU", record: "11-4-2", ranking: "#12", conference: "7-2-1" },
  { school: "TCU", record: "10-5-3", ranking: "#18", conference: "6-3-1" },
  { school: "Colorado", record: "10-6-1", ranking: "#22", conference: "6-4-0" },
  { school: "Arizona State", record: "9-6-2", ranking: "NR", conference: "5-4-1" },
  { school: "Texas Tech", record: "8-7-3", ranking: "NR", conference: "4-5-1" },
  { school: "Kansas", record: "8-8-1", ranking: "NR", conference: "4-6-0" },
  { school: "Oklahoma State", record: "7-8-2", ranking: "NR", conference: "3-6-1" },
  { school: "Iowa State", record: "7-9-1", ranking: "NR", conference: "3-7-0" },
  { school: "Baylor", record: "6-9-2", ranking: "NR", conference: "2-7-1" },
  { school: "Cincinnati", record: "6-10-1", ranking: "NR", conference: "2-8-0" },
  { school: "Arizona", record: "5-10-2", ranking: "NR", conference: "1-8-1" },
  { school: "Houston", record: "4-11-2", ranking: "NR", conference: "1-9-0" },
  { school: "Kansas State", record: "3-12-2", ranking: "NR", conference: "0-9-1" },
  { school: "UCF", record: "3-13-1", ranking: "NR", conference: "0-10-0" },
  { school: "Utah", record: "2-14-1", ranking: "NR", conference: "0-10-0" }
]

const upcomingEvents = [
  { date: "Nov 8-10", event: "Big 12 Championship", venue: "Swope Soccer Village", location: "Kansas City, MO" },
  { date: "Nov 15", event: "NCAA Tournament Selection", venue: "NCAA.com", location: "Virtual" },
  { date: "Nov 16-18", event: "NCAA First Round", venue: "Campus Sites", location: "TBD" },
  { date: "Nov 23-25", event: "NCAA Second Round", venue: "Campus Sites", location: "TBD" }
]

const championshipHistory = [
  { year: "2023", champion: "West Virginia", record: "15-4-2", note: "NCAA Elite Eight" },
  { year: "2022", champion: "TCU", record: "14-5-3", note: "NCAA Second Round" },
  { year: "2021", champion: "Texas", record: "16-3-1", note: "NCAA Quarterfinals" },
  { year: "2020", champion: "Texas Tech", record: "12-2-1", note: "COVID-19 Season" },
  { year: "2019", champion: "Texas", record: "17-4-1", note: "NCAA College Cup" }
]

export default function SoccerPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Back Navigation */}
      <div className="flex items-center space-x-2">
        <Link href="/sports">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sports
          </Button>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Soccer</span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center text-white text-2xl">
            ⚽
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Big 12 Women's Soccer</h1>
            <p className="text-muted-foreground">
              Competitive women's soccer featuring top-tier programs and NCAA Tournament contenders.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">Fall Sport</Badge>
          <Badge variant="outline">16 Teams</Badge>
          <Badge variant="outline">Women's Only</Badge>
          <Badge className="bg-accent text-accent-foreground">Championship Tournament</Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conference Games</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">160</div>
            <p className="text-xs text-muted-foreground">
              Regular season games
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Championship</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Nov 8-10</div>
            <p className="text-xs text-muted-foreground">
              Kansas City, MO
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ranked Teams</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              In Top 25
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NCAA Bids</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6-8</div>
            <p className="text-xs text-muted-foreground">
              Projected tournament teams
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="standings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="championship">Championship</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="standings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>2024 Final Standings</CardTitle>
              <CardDescription>
                Conference regular season standings and championship seeding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {soccerTeams.map((team, index) => (
                  <div 
                    key={team.school} 
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      index < 8 ? 'bg-accent/10 border-accent/20' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium w-6">{index + 1}</div>
                      <div>
                        <div className="font-medium">{team.school}</div>
                        <div className="text-sm text-muted-foreground">
                          Conference: {team.conference}
                        </div>
                      </div>
                      {index < 8 && (
                        <Badge variant="secondary" className="ml-2">
                          Championship Qualified
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{team.record}</div>
                      <div className="text-sm text-muted-foreground">{team.ranking}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="championship" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Big 12 Championship Schedule</CardTitle>
              <CardDescription>
                Championship tournament and key dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50">
                    <div className="space-y-1">
                      <div className="font-medium">{event.event}</div>
                      <div className="flex items-center text-sm text-muted-foreground space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.venue}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{event.location}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Championship History</CardTitle>
              <CardDescription>
                Recent Big 12 Soccer Champions and NCAA Tournament success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {championshipHistory.map((champ, index) => (
                  <div key={champ.year} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-accent' : 'bg-muted-foreground'
                      }`}>
                        {champ.year}
                      </div>
                      <div>
                        <div className="font-medium">{champ.champion}</div>
                        <div className="text-sm text-muted-foreground">{champ.note}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{champ.record}</div>
                      <div className="text-sm text-muted-foreground">Final Record</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Championship Operations</CardTitle>
                <CardDescription>
                  Tournament logistics and preparation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Field Preparation</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Media Setup</span>
                    <span className="text-sm font-medium">80%</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Team Logistics</span>
                    <span className="text-sm font-medium">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Officials Assignment</span>
                    <span className="text-sm font-medium">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Season Statistics</CardTitle>
                <CardDescription>
                  Key metrics and achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg. Attendance</span>
                  <span className="text-sm font-medium">1,850</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Live Streams</span>
                  <span className="text-sm font-medium">90%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">All-Americans</span>
                  <span className="text-sm font-medium">6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Professional Signings</span>
                  <span className="text-sm font-medium">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Olympic Pool Players</span>
                  <span className="text-sm font-medium">3</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}