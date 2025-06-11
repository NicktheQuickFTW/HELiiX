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

const footballTeams = [
  { school: "Arizona", record: "8-4", ranking: "#15", conference: "7-2" },
  { school: "Arizona State", record: "10-2", ranking: "#12", conference: "8-1" },
  { school: "Baylor", record: "6-6", ranking: "NR", conference: "4-5" },
  { school: "BYU", record: "9-3", ranking: "#18", conference: "7-2" },
  { school: "Cincinnati", record: "5-7", ranking: "NR", conference: "3-6" },
  { school: "Colorado", record: "8-4", ranking: "#20", conference: "6-3" },
  { school: "Houston", record: "4-8", ranking: "NR", conference: "3-6" },
  { school: "Iowa State", record: "7-5", ranking: "#25", conference: "5-4" },
  { school: "Kansas", record: "3-9", ranking: "NR", conference: "2-7" },
  { school: "Kansas State", record: "8-4", ranking: "#22", conference: "6-3" },
  { school: "Oklahoma State", record: "6-6", ranking: "NR", conference: "4-5" },
  { school: "TCU", record: "7-5", ranking: "NR", conference: "5-4" },
  { school: "Texas Tech", record: "7-5", ranking: "NR", conference: "5-4" },
  { school: "UCF", record: "4-8", ranking: "NR", conference: "2-7" },
  { school: "Utah", record: "4-8", ranking: "NR", conference: "1-8" },
  { school: "West Virginia", record: "6-6", ranking: "NR", conference: "4-5" }
]

const upcomingGames = [
  { date: "Dec 7", teams: "Arizona State vs Iowa State", venue: "AT&T Stadium", time: "12:00 PM EST", title: "Big 12 Championship Game" },
  { date: "Dec 20", teams: "BYU vs Colorado", venue: "Alamo Bowl", time: "9:15 PM EST", title: "Bowl Game" },
  { date: "Dec 23", teams: "Kansas State vs Rutgers", venue: "Rate Bowl", time: "5:30 PM EST", title: "Bowl Game" },
  { date: "Dec 27", teams: "Arizona vs Miami", venue: "Pop-Tarts Bowl", time: "3:30 PM EST", title: "Bowl Game" }
]

const championshipHistory = [
  { year: "2024", champion: "TBD", record: "TBD", note: "Championship Game: Dec 7" },
  { year: "2023", champion: "Texas", record: "12-2", note: "First Big 12 Championship" },
  { year: "2022", champion: "TCU", record: "13-2", note: "CFP National Championship Game" },
  { year: "2021", champion: "Baylor", record: "12-2", note: "Big 12 Championship Game" },
  { year: "2020", champion: "Oklahoma", record: "9-2", note: "COVID-19 season" }
]

export default function FootballPage() {
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
        <span className="text-sm font-medium">Football</span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center text-white text-2xl">
            🏈
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Big 12 Football</h1>
            <p className="text-muted-foreground">
              Premier collegiate football featuring 16 member institutions competing for the Big 12 Championship.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">Fall Sport</Badge>
          <Badge variant="outline">16 Teams</Badge>
          <Badge variant="outline">9-Game Conference Schedule</Badge>
          <Badge className="bg-accent text-accent-foreground">Championship Game</Badge>
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
            <div className="text-2xl font-bold">144</div>
            <p className="text-xs text-muted-foreground">
              Regular season games
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Championship Game</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Dec 7</div>
            <p className="text-xs text-muted-foreground">
              AT&T Stadium
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bowl Eligible</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">
              Teams with 6+ wins
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TV Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$380M+</div>
            <p className="text-xs text-muted-foreground">
              Annual distribution
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="standings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="championships">Championships</TabsTrigger>
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="standings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>2024 Conference Standings</CardTitle>
              <CardDescription>
                Final regular season standings and championship game participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {footballTeams.map((team, index) => (
                  <div 
                    key={team.school} 
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      index < 2 ? 'bg-accent/10 border-accent/20' : 'hover:bg-muted/50'
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
                      {index < 2 && (
                        <Badge variant="secondary" className="ml-2">
                          Championship Game
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

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Games & Bowl Schedule</CardTitle>
              <CardDescription>
                Championship game and bowl game matchups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingGames.map((game, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50">
                    <div className="space-y-1">
                      <div className="font-medium">{game.title}</div>
                      <div className="text-sm font-medium">{game.teams}</div>
                      <div className="flex items-center text-sm text-muted-foreground space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {game.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {game.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {game.venue}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="championships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Championship History</CardTitle>
              <CardDescription>
                Recent Big 12 Football Champions and their achievements
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

        <TabsContent value="directory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Football Directory</CardTitle>
              <CardDescription>Contact information for football personnel</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Directory functionality coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Championship Game Operations</CardTitle>
                <CardDescription>
                  Big 12 Championship Game at AT&T Stadium
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Venue Setup</span>
                    <span className="text-sm font-medium">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Media Credentials</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Security Planning</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Broadcast Setup</span>
                    <span className="text-sm font-medium">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Season Statistics</CardTitle>
                <CardDescription>
                  Key metrics and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Attendance</span>
                  <span className="text-sm font-medium">4.2M+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg. Per Game</span>
                  <span className="text-sm font-medium">58,750</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">TV Viewership</span>
                  <span className="text-sm font-medium">125M+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Media Value</span>
                  <span className="text-sm font-medium">$2.1B</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CFP Teams</span>
                  <span className="text-sm font-medium">2</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}