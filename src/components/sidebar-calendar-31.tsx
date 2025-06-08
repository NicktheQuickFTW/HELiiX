"use client"

import * as React from "react"
import { formatDateRange } from "little-date"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar"

// Mock events - in real app, these would come from your database
const mockEvents = [
  {
    title: "Q1 Awards Deadline",
    from: new Date().toISOString(),
    to: new Date(new Date().getTime() + 3600000).toISOString(), // +1 hour
    type: "award",
  },
  {
    title: "Invoice #1234 Due",
    from: new Date(new Date().getTime() + 86400000).toISOString(), // +1 day
    to: new Date(new Date().getTime() + 90000000).toISOString(),
    type: "invoice",
  },
  {
    title: "Vendor Payment",
    from: new Date(new Date().getTime() + 172800000).toISOString(), // +2 days
    to: new Date(new Date().getTime() + 176400000).toISOString(),
    type: "invoice",
  },
]

export function SidebarCalendar31() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  
  // Filter events for selected date
  const selectedDateEvents = React.useMemo(() => {
    if (!date) return []
    
    return mockEvents.filter(event => {
      const eventDate = new Date(event.from)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }, [date])

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
            {mockEvents.slice(0, 3).map((event) => (
              <div
                key={event.title}
                className={`relative rounded-md p-2 pl-5 text-xs after:absolute after:inset-y-2 after:left-2 after:w-0.5 after:rounded-full ${
                  event.type === 'award' 
                    ? 'bg-blue-50 dark:bg-blue-950 after:bg-blue-500' 
                    : 'bg-green-50 dark:bg-green-950 after:bg-green-500'
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
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}