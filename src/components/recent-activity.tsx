"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: number
  type: 'award' | 'invoice'
  action: string
  item: string
  status: string
  timestamp: string
}

const statusColors = {
  planned: "bg-gray-500/10 text-gray-500",
  ordered: "bg-blue-500/10 text-blue-500",
  approved: "bg-purple-500/10 text-purple-500",
  delivered: "bg-orange-500/10 text-orange-500",
  received: "bg-green-500/10 text-green-500"
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // Fetch recent items and create activity feed
    Promise.all([
      fetch('/api/awards').then(res => res.json()),
      fetch('/api/invoices').then(res => res.json())
    ]).then(([awards, invoices]) => {
      const allItems = [
        ...awards.map((a: any) => ({
          id: a.id,
          type: 'award' as const,
          action: 'Award created',
          item: a.name,
          status: a.status,
          timestamp: a.createdAt
        })),
        ...invoices.map((i: any) => ({
          id: i.id,
          type: 'invoice' as const,
          action: 'Invoice added',
          item: `#${i.invoiceNumber}`,
          status: i.status,
          timestamp: i.createdAt
        }))
      ]

      // Sort by most recent and take top 10
      const sorted = allItems
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10)

      setActivities(sorted)
    }).catch(console.error)
  }, [])

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest updates from awards and invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={`${activity.type}-${activity.id}`} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.item}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={statusColors[activity.status as keyof typeof statusColors]}>
                    {activity.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}