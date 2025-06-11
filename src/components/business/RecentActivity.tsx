"use client"

import { Card, Badge } from "@once-ui-system/core"
import { TeamLogo } from "@/components/ui/team-logo"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: number
  type: 'award' | 'invoice'
  action: string
  item: string
  status: string
  timestamp: string
  team?: string
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch recent items and create activity feed
    Promise.all([
      fetch('/api/awards').then(res => res.ok ? res.json() : []),
      fetch('/api/invoices').then(res => res.ok ? res.json() : [])
    ]).then(([awards, invoices]) => {
      const allItems = [
        ...(awards || [])
          .filter((a: any) => a.id) // Only include items with valid IDs
          .map((a: any, index: number) => ({
            id: a.id || `award-${index}`,
            type: 'award' as const,
            action: 'Award created',
            item: a.name || 'Unknown award',
            status: a.status || 'planned',
            timestamp: a.createdAt || a.created_at || new Date().toISOString(),
            team: a.sport === 'Football' ? 'Oklahoma State' : 
                  a.sport === 'Basketball' ? 'Kansas' :
                  a.sport === 'Baseball' ? 'Texas Tech' : 
                  ['Arizona', 'Baylor', 'Houston', 'Utah', 'Cincinnati'][index % 5]
          })),
        ...(invoices || [])
          .filter((i: any) => i.id) // Only include items with valid IDs
          .map((i: any, index: number) => ({
            id: i.id || `invoice-${index}`,
            type: 'invoice' as const,
            action: 'Invoice added',
            item: `#${i.invoiceNumber || i.invoice_number || i.id || 'N/A'}`,
            status: i.status || 'planned',
            timestamp: i.createdAt || i.created_at || new Date().toISOString()
          }))
      ]

      // Filter out invalid timestamps and sort by most recent
      const validItems = allItems.filter(item => 
        item.timestamp && !isNaN(new Date(item.timestamp).getTime())
      )
      
      const sorted = validItems
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10)

      setActivities(sorted)
    }).catch((error) => {
      console.error('Error fetching activities:', error)
      // Set some fallback activities
      setActivities([
        {
          id: 1,
          type: 'award',
          action: 'System initialized',
          item: 'Awards tracking active',
          status: 'received',
          timestamp: new Date().toISOString()
        }
      ])
    }).finally(() => {
      setLoading(false)
    })
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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">Loading activities...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            ) : (
              activities.map((activity, index) => (
                <div key={`${activity.type}-${activity.id}-${index}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {activity.team && (
                      <TeamLogo team={activity.team} size="sm" />
                    )}
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.item}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={statusColors[activity.status as keyof typeof statusColors] || statusColors.planned}>
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp && !isNaN(new Date(activity.timestamp).getTime()) 
                        ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })
                        : 'Just now'
                      }
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}