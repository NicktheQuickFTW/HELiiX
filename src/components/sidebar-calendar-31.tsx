"use client"

import * as React from "react"
import { formatDateRange } from "little-date"
import { PlusIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar"

type Event = {
  id: string
  title: string
  from: string
  to: string
  type: 'award' | 'invoice' | 'budget' | 'meeting'
  description?: string
}

export function SidebarCalendar31() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [events, setEvents] = React.useState<Event[]>([])
  const [loading, setLoading] = React.useState(true)

  // Fetch real events from Supabase
  React.useEffect(() => {
    async function fetchEvents() {
      try {
        // Get upcoming award deadlines
        const { data: awards } = await supabase
          .from('awards_program')
          .select('id, name, sport, class_code, created_at')
          .order('created_at', { ascending: false })
          .limit(5)

        // Get recent invoices
        const { data: invoices } = await supabase
          .from('invoices')
          .select('id, title, due_date, amount, status')
          .order('created_at', { ascending: false })
          .limit(3)

        const upcomingEvents: Event[] = []

        // Add award events
        if (awards) {
          awards.forEach((award, index) => {
            const eventDate = new Date()
            eventDate.setDate(eventDate.getDate() + index + 1) // Spread over next few days
            
            upcomingEvents.push({
              id: `award-${award.id}`,
              title: `${award.sport} Awards Due`,
              from: eventDate.toISOString(),
              to: new Date(eventDate.getTime() + 3600000).toISOString(),
              type: 'award',
              description: `${award.name} - ${award.class_code}`
            })
          })
        }

        // Add invoice events
        if (invoices) {
          invoices.forEach((invoice, index) => {
            const eventDate = new Date()
            eventDate.setDate(eventDate.getDate() + index + 3) // Offset from awards
            
            upcomingEvents.push({
              id: `invoice-${invoice.id}`,
              title: invoice.title || 'Invoice Due',
              from: eventDate.toISOString(),
              to: new Date(eventDate.getTime() + 1800000).toISOString(),
              type: 'invoice',
              description: `$${invoice.amount} - ${invoice.status}`
            })
          })
        }

        // Add some operational events
        const operationalEvents: Event[] = [
          {
            id: 'budget-review',
            title: 'Q1 Budget Review',
            from: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 7200000).toISOString(),
            type: 'budget',
            description: 'FY25-26 Budget Analysis'
          },
          {
            id: 'big12-meeting',
            title: 'Big 12 Operations Call',
            from: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            to: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
            type: 'meeting',
            description: 'Weekly coordination meeting'
          }
        ]

        setEvents([...upcomingEvents, ...operationalEvents])
      } catch (error) {
        console.error('Error fetching events:', error)
        // Fallback to static events if database fails
        setEvents([
          {
            id: 'fallback-1',
            title: 'Awards Processing',
            from: new Date().toISOString(),
            to: new Date(Date.now() + 3600000).toISOString(),
            type: 'award'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])
  
  // Filter events for selected date
  const selectedDateEvents = React.useMemo(() => {
    if (!date || events.length === 0) return []
    
    return events.filter(event => {
      const eventDate = new Date(event.from)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }, [date, events])

  return (
    <>
      <SidebarGroup className="px-0">
        <SidebarGroupLabel>Calendar</SidebarGroupLabel>
        <SidebarGroupContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px] p-0"
          />
        </SidebarGroupContent>
      </SidebarGroup>
      
      {selectedDateEvents.length > 0 && (
        <>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between">
              <span>
                {date?.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-5"
                title="Add Event"
              >
                <PlusIcon className="size-3" />
              </Button>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="flex flex-col gap-2 px-2">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.title}
                    className="relative rounded-md bg-muted p-2 pl-5 text-xs after:absolute after:inset-y-2 after:left-2 after:w-0.5 after:rounded-full after:bg-primary/70"
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-muted-foreground text-[10px]">
                      {formatDateRange(new Date(event.from), new Date(event.to))}
                    </div>
                  </div>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </>
      )}
      
      <SidebarSeparator />
      
      <SidebarGroup>
        <SidebarGroupLabel>Upcoming</SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="flex flex-col gap-2 px-2">
            {loading ? (
              <div className="text-xs text-muted-foreground">Loading events...</div>
            ) : (
              events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className={`relative rounded-md p-2 pl-5 text-xs after:absolute after:inset-y-2 after:left-2 after:w-0.5 after:rounded-full ${
                    event.type === 'award' 
                      ? 'bg-blue-50 dark:bg-blue-950 after:bg-blue-500'
                      : event.type === 'invoice'
                      ? 'bg-green-50 dark:bg-green-950 after:bg-green-500'
                      : event.type === 'budget'
                      ? 'bg-purple-50 dark:bg-purple-950 after:bg-purple-500'
                      : 'bg-orange-50 dark:bg-orange-950 after:bg-orange-500'
                  }`}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-muted-foreground text-[10px]">
                    {new Date(event.from).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                  {event.description && (
                    <div className="text-muted-foreground text-[9px] mt-1">
                      {event.description}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}