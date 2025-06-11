'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Database, 
  ExternalLink, 
  RefreshCw,
  Calendar,
  Eye,
  ChevronRight
} from "lucide-react"
import { NOTION_CONFIG } from '@/lib/notion'
import Link from 'next/link'

interface NotionEntry {
  id: string
  properties: Record<string, any>
  created_time: string
  last_edited_time: string
  url: string
}

interface NotionWidgetProps {
  title?: string
  description?: string
  maxEntries?: number
  showHeader?: boolean
  height?: string | number
  variant?: 'embedded' | 'list' | 'compact'
}

export function NotionWidget({ 
  title = "Notion Database",
  description = "Live data from your Notion workspace",
  maxEntries = 5,
  showHeader = true,
  height = 400,
  variant = 'embedded'
}: NotionWidgetProps) {
  const [entries, setEntries] = useState<NotionEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEntries = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/notion/database?page_size=${maxEntries}`)
      const result = await response.json()
      
      if (result.success) {
        setEntries(result.data.entries.slice(0, maxEntries))
      } else {
        setError(result.error || 'Failed to fetch data')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching entries:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [maxEntries])

  const renderPropertyValue = (value: any): string => {
    if (value === null || value === undefined) return '-'
    if (Array.isArray(value)) return value.slice(0, 2).join(', ') + (value.length > 2 ? '...' : '')
    if (typeof value === 'object') return 'Object'
    const str = String(value)
    return str.length > 50 ? str.substring(0, 50) + '...' : str
  }

  if (variant === 'embedded') {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-accent" />
                <span>{title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/notion">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={NOTION_CONFIG.PUBLIC_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        )}
        <CardContent>
          <div 
            className="w-full border rounded-lg overflow-hidden"
            style={{ height: typeof height === 'number' ? `${height}px` : height }}
          >
            <iframe
              src={NOTION_CONFIG.EMBED_URL}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              title="Notion Database"
              className="w-full h-full"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'compact') {
    return (
      <Card>
        {showHeader && (
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-accent" />
                <span>{title}</span>
              </div>
              <Badge variant="secondary">{entries.length}</Badge>
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="space-y-2">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))
          ) : error ? (
            <div className="text-center py-4 text-destructive text-sm">{error}</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">No entries found</div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-2 rounded border text-sm hover:bg-muted/50">
                <div className="flex-1 truncate">
                  {Object.values(entry.properties)[0] ? renderPropertyValue(Object.values(entry.properties)[0]) : 'Untitled'}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.created_time).toLocaleDateString()}
                  </span>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={entry.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            ))
          )}
          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/notion">
                View All <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // List variant
  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-accent" />
              <span>{title}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={fetchEntries} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/notion">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
            </div>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: maxEntries }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))
          ) : error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No entries found</div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {new Date(entry.created_time).toLocaleDateString()}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={entry.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(entry.properties).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="flex items-start space-x-2 text-sm">
                        <span className="font-medium text-muted-foreground min-w-[80px] text-xs">
                          {key}:
                        </span>
                        <span className="flex-1 text-xs">{renderPropertyValue(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}