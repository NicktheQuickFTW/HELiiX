'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Database, 
  ExternalLink, 
  RefreshCw, 
  Search,
  Calendar,
  FileText,
  Users,
  Settings,
  Filter,
  ArrowUpDown,
  Eye,
  Code
} from "lucide-react"
import { NOTION_CONFIG } from '@/lib/notion'

interface NotionEntry {
  id: string
  properties: Record<string, any>
  created_time: string
  last_edited_time: string
  url: string
}

interface DatabaseSchema {
  id: string
  title: string
  properties: Record<string, any>
  url: string
  created_time: string
  last_edited_time: string
}

export default function NotionPage() {
  const [entries, setEntries] = useState<NotionEntry[]>([])
  const [schema, setSchema] = useState<DatabaseSchema | null>(null)
  const [loading, setLoading] = useState(true)
  const [schemaLoading, setSchemaLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeView, setActiveView] = useState<'embedded' | 'api' | 'schema'>('embedded')

  // Fetch database entries via API
  const fetchEntries = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notion/database')
      const result = await response.json()
      
      if (result.success) {
        setEntries(result.data.entries)
      } else {
        console.error('Failed to fetch entries:', result.error)
      }
    } catch (error) {
      console.error('Error fetching entries:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch database schema
  const fetchSchema = async () => {
    try {
      setSchemaLoading(true)
      const response = await fetch('/api/notion/schema')
      const result = await response.json()
      
      if (result.success) {
        setSchema(result.data)
      } else {
        console.error('Failed to fetch schema:', result.error)
      }
    } catch (error) {
      console.error('Error fetching schema:', error)
    } finally {
      setSchemaLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
    fetchSchema()
  }, [])

  // Filter entries based on search term
  const filteredEntries = entries.filter(entry => {
    const searchableText = Object.values(entry.properties)
      .map(prop => String(prop || ''))
      .join(' ')
      .toLowerCase()
    return searchableText.includes(searchTerm.toLowerCase())
  })

  const renderPropertyValue = (value: any): string => {
    if (value === null || value === undefined) return '-'
    if (Array.isArray(value)) return value.join(', ')
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center text-white text-2xl">
            <Database className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notion Database Integration</h1>
            <p className="text-muted-foreground">
              Access and manage your Notion database with embedded views and API integration.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">Live Data</Badge>
          <Badge variant="outline">Real-time Sync</Badge>
          <Badge className="bg-accent text-accent-foreground">API Enabled</Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
            <p className="text-xs text-muted-foreground">
              Database records
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schema ? Object.keys(schema.properties).length : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              Database fields
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schema ? new Date(schema.last_edited_time).toLocaleDateString() : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              Schema modified
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">View Options</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Available views
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="embedded">Embedded View</TabsTrigger>
          <TabsTrigger value="api">API Data View</TabsTrigger>
          <TabsTrigger value="schema">Database Schema</TabsTrigger>
        </TabsList>

        <TabsContent value="embedded" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ExternalLink className="h-5 w-5" />
                <span>Live Notion Database</span>
              </CardTitle>
              <CardDescription>
                Embedded view of your Notion database with full interactivity
              </CardDescription>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={NOTION_CONFIG.PUBLIC_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in Notion
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[600px] border rounded-lg overflow-hidden">
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
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Database Entries</span>
                </div>
                <Button variant="outline" size="sm" onClick={fetchEntries} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription>
                API-driven view with search and filtering capabilities
              </CardDescription>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Badge variant="secondary">{filteredEntries.length} results</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))
                ) : filteredEntries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No entries match your search' : 'No entries found'}
                  </div>
                ) : (
                  filteredEntries.map((entry) => (
                    <div key={entry.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
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
                        <div className="grid gap-2">
                          {Object.entries(entry.properties).map(([key, value]) => (
                            <div key={key} className="flex items-start space-x-2 text-sm">
                              <span className="font-medium text-muted-foreground min-w-[120px]">
                                {key}:
                              </span>
                              <span className="flex-1">{renderPropertyValue(value)}</span>
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
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Database Schema</span>
                </div>
                <Button variant="outline" size="sm" onClick={fetchSchema} disabled={schemaLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${schemaLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription>
                Database structure, properties, and configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schemaLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : schema ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-semibold mb-2">Database Info</h3>
                      <div className="space-y-1 text-sm">
                        <div><span className="font-medium">Title:</span> {schema.title}</div>
                        <div><span className="font-medium">ID:</span> {schema.id}</div>
                        <div><span className="font-medium">Created:</span> {new Date(schema.created_time).toLocaleString()}</div>
                        <div><span className="font-medium">Modified:</span> {new Date(schema.last_edited_time).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Properties ({Object.keys(schema.properties).length})</h3>
                    <div className="grid gap-2">
                      {Object.entries(schema.properties).map(([key, property]: [string, any]) => (
                        <div key={key} className="flex items-center justify-between p-2 border rounded text-sm">
                          <span className="font-medium">{key}</span>
                          <Badge variant="secondary">{property.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Failed to load schema
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}