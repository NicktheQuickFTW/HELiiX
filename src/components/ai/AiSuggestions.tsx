"use client"

import { useState } from "react"
import { Card, Button } from "@once-ui-system/core"
import { Sparkles, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface AISuggestion {
  type: 'optimization' | 'warning' | 'insight'
  title: string
  description: string
  action?: () => void
  actionLabel?: string
}

export function AISuggestions() {
  const [suggestions] = useState<AISuggestion[]>([
    {
      type: 'optimization',
      title: 'Bulk Order Opportunity',
      description: '5 awards are low in stock. Consider placing a bulk order to save 15% on shipping.',
      actionLabel: 'View Awards',
      action: () => toast.info('Navigating to low stock awards...')
    },
    {
      type: 'warning',
      title: '3 Invoices Due Soon',
      description: 'You have 3 invoices totaling $2,450 due within the next 7 days.',
      actionLabel: 'Review Invoices',
      action: () => toast.info('Opening due invoices...')
    },
    {
      type: 'insight',
      title: 'Popular Award Trend',
      description: 'Leadership Excellence awards have increased 40% this quarter. Consider stocking up.',
      actionLabel: 'View Analytics',
      action: () => toast.info('Opening analytics...')
    }
  ])

  const getIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case 'insight':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Suggestions
        </CardTitle>
        <CardDescription>
          Smart recommendations based on your data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="mt-0.5">{getIcon(suggestion.type)}</div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{suggestion.title}</p>
              <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              {suggestion.action && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={suggestion.action}
                >
                  {suggestion.actionLabel}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}