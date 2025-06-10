'use client';

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Plus, Search, Trophy, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recipients = [
  { 
    id: 1, 
    name: "Kansas Jayhawks Basketball", 
    type: "Team", 
    school: "University of Kansas",
    awards: 5, 
    lastAward: "2024-03-15",
    category: "Championship"
  },
  { 
    id: 2, 
    name: "Sarah Johnson", 
    type: "Individual", 
    school: "Texas Tech University",
    awards: 3, 
    lastAward: "2024-02-28",
    category: "Academic Excellence"
  },
  { 
    id: 3, 
    name: "Baylor Bears Football", 
    type: "Team", 
    school: "Baylor University",
    awards: 8, 
    lastAward: "2024-01-20",
    category: "Championship"
  },
  { 
    id: 4, 
    name: "Michael Chen", 
    type: "Individual", 
    school: "Iowa State University",
    awards: 2, 
    lastAward: "2024-03-10",
    category: "Sportsmanship"
  },
]

export default function RecipientsPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Users className="h-8 w-8" />
                Award Recipients
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage award recipients and their history
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Recipient
            </Button>
          </div>
          
          <Separator className="mb-6" />

          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search recipients..." className="pl-10" />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
          
          {/* Recipients List */}
          <div className="space-y-4">
            {recipients.map((recipient) => (
              <Card key={recipient.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {recipient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{recipient.name}</h3>
                        <p className="text-muted-foreground">{recipient.school}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant={recipient.type === 'Team' ? 'default' : 'secondary'}>
                            {recipient.type}
                          </Badge>
                          <Badge variant="outline">{recipient.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">{recipient.awards} Awards</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Last: {new Date(recipient.lastAward).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Statistics */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recipient Statistics</CardTitle>
              <CardDescription>Overview of award recipients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">127</div>
                  <p className="text-sm text-muted-foreground">Total Recipients</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">89</div>
                  <p className="text-sm text-muted-foreground">Teams</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">38</div>
                  <p className="text-sm text-muted-foreground">Individuals</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">342</div>
                  <p className="text-sm text-muted-foreground">Total Awards</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}