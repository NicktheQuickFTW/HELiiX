# shadcn UI Implementation Examples for Big 12 HELiiX

## Table of Contents
1. [Schedule Management Components](#schedule-management-components)
2. [Financial Tracking Components](#financial-tracking-components)
3. [Team Management Components](#team-management-components)
4. [Communication Components](#communication-components)
5. [Logistics Components](#logistics-components)

## Schedule Management Components

### Game Schedule Card
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react"

interface GameScheduleCardProps {
  game: {
    id: string
    homeTeam: string
    awayTeam: string
    date: Date
    venue: string
    sport: string
    status: 'scheduled' | 'in-progress' | 'completed' | 'postponed'
  }
}

export function GameScheduleCard({ game }: GameScheduleCardProps) {
  const statusColors = {
    scheduled: "default",
    'in-progress': "secondary",
    completed: "outline",
    postponed: "destructive"
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {game.homeTeam} vs {game.awayTeam}
            </CardTitle>
            <CardDescription>{game.sport}</CardDescription>
          </div>
          <Badge variant={statusColors[game.status]}>
            {game.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>{game.date.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPinIcon className="h-4 w-4" />
            <span>{game.venue}</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline">View Details</Button>
          <Button size="sm">Edit Schedule</Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Conference Schedule Builder
```tsx
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ScheduleBuilderProps {
  sports: string[]
  teams: { id: string; name: string; sport: string }[]
  onScheduleCreate: (schedule: any) => void
}

export function ConferenceScheduleBuilder({ sports, teams, onScheduleCreate }: ScheduleBuilderProps) {
  const [selectedSport, setSelectedSport] = useState("")
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [conflicts, setConflicts] = useState<string[]>([])

  const checkConflicts = () => {
    // Simulated conflict checking
    const potentialConflicts = []
    if (selectedDates.length > 0 && selectedSport === "Basketball") {
      potentialConflicts.push("Venue conflict: Arena already booked for Wrestling Championships")
    }
    setConflicts(potentialConflicts)
  }

  return (
    <Dialog>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Build Conference Schedule</DialogTitle>
          <DialogDescription>
            Create a new schedule for Big 12 Conference sports
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="sport">Select Sport</Label>
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger id="sport">
                <SelectValue placeholder="Choose a sport" />
              </SelectTrigger>
              <SelectContent>
                {sports.map(sport => (
                  <SelectItem key={sport} value={sport}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Select Competition Dates</Label>
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={(dates) => {
                setSelectedDates(dates || [])
                checkConflicts()
              }}
              className="rounded-md border"
            />
          </div>

          {conflicts.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {conflicts.map((conflict, i) => (
                    <li key={i}>{conflict}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button onClick={() => onScheduleCreate({ sport: selectedSport, dates: selectedDates })}>
            Create Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

## Financial Tracking Components

### Invoice Dashboard
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpIcon, ArrowDownIcon, DollarSignIcon } from "lucide-react"

interface Invoice {
  id: string
  vendor: string
  amount: number
  status: 'pending' | 'approved' | 'paid' | 'overdue'
  dueDate: Date
  category: string
}

export function InvoiceDashboard() {
  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "vendor",
      header: "Vendor",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const variants = {
          pending: "secondary",
          approved: "default",
          paid: "outline",
          overdue: "destructive"
        }
        return <Badge variant={variants[status]}>{status}</Badge>
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("dueDate"))
        return date.toLocaleDateString()
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpIcon className="inline h-3 w-3 text-red-500" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <Progress value={40} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$128,492.00</div>
            <p className="text-xs text-muted-foreground">
              <ArrowDownIcon className="inline h-3 w-3 text-green-500" />
              -5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Invoices</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <DataTable columns={columns} data={[]} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

## Team Management Components

### Team Roster Card
```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"
import { UserIcon, MailIcon, PhoneIcon } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  phone: string
  status: 'active' | 'injured' | 'suspended'
  avatar?: string
  stats?: {
    gamesPlayed: number
    average: number
  }
}

interface TeamRosterCardProps {
  teamName: string
  sport: string
  members: TeamMember[]
}

export function TeamRosterCard({ teamName, sport, members }: TeamRosterCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'injured': return 'secondary'
      case 'suspended': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{teamName}</CardTitle>
        <CardDescription>{sport} Roster - {members.length} Members</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member, index) => (
            <div key={member.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Avatar className="cursor-pointer">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <MailIcon className="h-3 w-3" />
                            <span>{member.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <PhoneIcon className="h-3 w-3" />
                            <span>{member.phone}</span>
                          </div>
                        </div>
                        {member.stats && (
                          <div className="pt-2 text-sm">
                            <p>Games: {member.stats.gamesPlayed}</p>
                            <p>Average: {member.stats.average}</p>
                          </div>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <Badge variant={getStatusColor(member.status)}>
                  {member.status}
                </Badge>
              </div>
              {index < members.length - 1 && <Separator className="my-3" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

## Communication Components

### Announcement Center
```tsx
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { BellIcon, SendIcon, AlertCircleIcon } from "lucide-react"

interface Announcement {
  id: string
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  recipients: string[]
  timestamp: Date
  read: boolean
}

export function AnnouncementCenter() {
  const [newAnnouncement, setNewAnnouncement] = useState("")
  const [priority, setPriority] = useState<string>("medium")
  const [recipients, setRecipients] = useState<string>("all")

  const sendAnnouncement = () => {
    toast.success("Announcement sent successfully", {
      description: `Sent to ${recipients === 'all' ? 'all teams' : recipients}`,
    })
    setNewAnnouncement("")
  }

  const priorityColors = {
    low: "secondary",
    medium: "default",
    high: "destructive",
    urgent: "destructive"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Announcement</CardTitle>
          <CardDescription>Send important updates to teams and staff</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Select value={recipients} onValueChange={setRecipients}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="football">Football Teams</SelectItem>
                <SelectItem value="basketball">Basketball Teams</SelectItem>
                <SelectItem value="coaches">All Coaches</SelectItem>
                <SelectItem value="staff">Administrative Staff</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Type your announcement here..."
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            className="min-h-[100px]"
          />

          <Button onClick={sendAnnouncement} className="w-full">
            <SendIcon className="mr-2 h-4 w-4" />
            Send Announcement
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Alert>
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Schedule Change</AlertTitle>
            <AlertDescription>
              The Basketball Championship game has been moved to March 15th due to venue conflicts.
            </AlertDescription>
          </Alert>

          <Alert>
            <BellIcon className="h-4 w-4" />
            <AlertTitle>Travel Update</AlertTitle>
            <AlertDescription>
              All teams traveling to Colorado this weekend should prepare for potential weather delays.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

## Logistics Components

### Travel Planning Dashboard
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { PlaneIcon, HotelIcon, BusIcon, MapPinIcon, CalendarIcon } from "lucide-react"

interface TravelItinerary {
  id: string
  team: string
  destination: string
  dates: {
    departure: Date
    return: Date
  }
  status: 'planning' | 'booked' | 'in-transit' | 'completed'
  transportation: {
    type: 'flight' | 'bus' | 'charter'
    details: string
  }
  accommodation: {
    name: string
    address: string
    checkIn: Date
    checkOut: Date
  }
  budget: {
    allocated: number
    spent: number
  }
}

export function TravelPlanningDashboard({ itineraries }: { itineraries: TravelItinerary[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'secondary'
      case 'booked': return 'default'
      case 'in-transit': return 'destructive'
      case 'completed': return 'outline'
      default: return 'secondary'
    }
  }

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'flight': return <PlaneIcon className="h-4 w-4" />
      case 'bus': return <BusIcon className="h-4 w-4" />
      default: return <MapPinIcon className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
            <PlaneIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 departing this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Travel Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.2M</div>
            <Progress value={72} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">72% utilized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Travel Itineraries</CardTitle>
          <CardDescription>Manage team travel plans and logistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {itineraries.map((itinerary) => (
              <AccordionItem key={itinerary.id} value={itinerary.id}>
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{itinerary.team}</span>
                      <span className="text-sm text-muted-foreground">→ {itinerary.destination}</span>
                    </div>
                    <Badge variant={getStatusColor(itinerary.status)}>
                      {itinerary.status}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Travel Dates</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-3 w-3" />
                            <span>Departure: {itinerary.dates.departure.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-3 w-3" />
                            <span>Return: {itinerary.dates.return.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Transportation</h4>
                        <div className="flex items-center gap-2 text-sm">
                          {getTransportIcon(itinerary.transportation.type)}
                          <span>{itinerary.transportation.details}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-2">Accommodation</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <HotelIcon className="h-3 w-3" />
                          <span>{itinerary.accommodation.name}</span>
                        </div>
                        <p className="text-muted-foreground">{itinerary.accommodation.address}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-2">Budget</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Allocated: ${itinerary.budget.allocated.toLocaleString()}</span>
                          <span>Spent: ${itinerary.budget.spent.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(itinerary.budget.spent / itinerary.budget.allocated) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm">View Details</Button>
                      <Button size="sm" variant="outline">Edit Itinerary</Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
```

## Implementation Notes

### 1. Component Composition Patterns
- Use compound components for complex UI structures
- Leverage shadcn's primitive components as building blocks
- Create domain-specific wrappers around base components

### 2. State Management
```tsx
// Example: Using React Query with shadcn components
import { useQuery } from '@tanstack/react-query'

function useScheduleData(sport: string) {
  return useQuery({
    queryKey: ['schedule', sport],
    queryFn: () => fetchSchedule(sport),
  })
}
```

### 3. Accessibility Enhancements
```tsx
// Always include proper ARIA labels
<Button
  aria-label="Create new schedule for basketball season"
  onClick={handleCreate}
>
  Create Schedule
</Button>
```

### 4. Responsive Design
```tsx
// Use shadcn's responsive utilities
<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Content adapts to screen size */}
</div>
```

### 5. Theme Customization
```css
/* In globals.css - Big 12 Conference theme */
@layer base {
  :root {
    --primary: 209 100% 20%; /* Big 12 Blue */
    --primary-foreground: 0 0% 100%;
    --secondary: 42 100% 55%; /* Big 12 Gold */
    --secondary-foreground: 0 0% 0%;
  }
}
```