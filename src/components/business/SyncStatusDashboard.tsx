'use client'

import { useState, useEffect } from 'react'
import { Card, Badge, Button } from "@once-ui-system/core"
import { 
  RefreshCw, 
  Database, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Activity,
  BarChart3,
  Download,
  Upload
} from "lucide-react"

interface SyncLog {
  id: string
  sync_type: string
  status: string
  started_at: string
  completed_at?: string
  records_processed: number
  records_created: number
  records_updated: number
  records_deleted: number
  error_message?: string
}

interface SyncStatus {
  recentLogs: SyncLog[]
  contactStats: Record<string, number>
  lastSync?: string
}

export function SyncStatusDashboard() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSyncStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/sync/notion')
      const result = await response.json()
      
      if (result.success) {
        setSyncStatus(result.data)
      } else {
        setError(result.message || 'Failed to fetch sync status')
      }
    } catch (err) {
      setError('Network error fetching sync status')
    } finally {
      setLoading(false)
    }
  }

  const triggerSync = async (syncType: 'full' | 'incremental') => {
    try {
      setSyncing(true)
      setError(null)
      
      const response = await fetch(`/api/sync/notion?type=${syncType}`, {
        method: 'POST'
      })
      const result = await response.json()
      
      if (result.success) {
        // Refresh status after sync
        await fetchSyncStatus()
      } else {
        setError(result.message || 'Sync failed')
      }
    } catch (err) {
      setError('Network error during sync')
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchSyncStatus()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSyncStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />
      case 'running':
        return <RefreshCw className="h-4 w-4 text-warning animate-spin" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      failed: 'destructive',
      running: 'secondary'
    } as const
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    )
  }

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime)
    const end = endTime ? new Date(endTime) : new Date()
    const duration = Math.round((end.getTime() - start.getTime()) / 1000)
    
    if (duration < 60) return `${duration}s`
    if (duration < 3600) return `${Math.round(duration / 60)}m`
    return `${Math.round(duration / 3600)}h`
  }

  if (loading && !syncStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Notion Sync Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-accent" />
              <span>Notion Sync Dashboard</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchSyncStatus}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => triggerSync('incremental')}
                disabled={syncing}
              >
                <Upload className="h-4 w-4 mr-2" />
                Incremental Sync
              </Button>
              <Button 
                size="sm"
                onClick={() => triggerSync('full')}
                disabled={syncing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                Full Sync
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Monitor and manage synchronization between Notion and Supabase databases
          </CardDescription>
        </CardHeader>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <XCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {syncStatus && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="logs">Sync Logs</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Object.values(syncStatus.contactStats || {}).reduce((a, b) => a + b, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Synced from Notion
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {syncStatus.contactStats?.synced || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ready to use
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {syncStatus.lastSync ? 
                      new Date(syncStatus.lastSync).toLocaleDateString() : 
                      'Never'
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {syncStatus.lastSync ? 
                      new Date(syncStatus.lastSync).toLocaleTimeString() : 
                      'No sync completed'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sync Health</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {syncStatus.recentLogs?.[0]?.status === 'completed' ? (
                      <span className="text-success">Healthy</span>
                    ) : syncStatus.recentLogs?.[0]?.status === 'failed' ? (
                      <span className="text-destructive">Failed</span>
                    ) : syncing ? (
                      <span className="text-warning">Syncing</span>
                    ) : (
                      <span className="text-muted-foreground">Unknown</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    System status
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sync Activity</CardTitle>
                <CardDescription>
                  Latest synchronization operations and their results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {syncStatus.recentLogs?.slice(0, 3).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(log.status)}
                        <div>
                          <div className="font-medium capitalize">
                            {log.sync_type} Sync
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(log.started_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {log.records_processed} processed
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDuration(log.started_at, log.completed_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {!syncStatus.recentLogs?.length && (
                    <div className="text-center py-8 text-muted-foreground">
                      No sync operations recorded yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Sync Logs</CardTitle>
                <CardDescription>
                  Complete history of synchronization operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {syncStatus.recentLogs?.map((log) => (
                    <div key={log.id} className="p-4 rounded-lg border space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(log.status)}
                          <div>
                            <div className="font-medium">
                              {log.sync_type.charAt(0).toUpperCase() + log.sync_type.slice(1)} Sync
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(log.started_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(log.status)}
                          <span className="text-sm text-muted-foreground">
                            {formatDuration(log.started_at, log.completed_at)}
                          </span>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Processed</div>
                          <div className="font-medium">{log.records_processed}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Created</div>
                          <div className="font-medium text-success">{log.records_created}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Updated</div>
                          <div className="font-medium text-warning">{log.records_updated}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Deleted</div>
                          <div className="font-medium text-destructive">{log.records_deleted}</div>
                        </div>
                      </div>

                      {log.error_message && (
                        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                          <div className="text-sm text-destructive">
                            <strong>Error:</strong> {log.error_message}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Contact Status Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(syncStatus.contactStats || {}).map(([status, count]) => {
                      const total = Object.values(syncStatus.contactStats || {}).reduce((a, b) => a + b, 0)
                      const percentage = total > 0 ? (count / total) * 100 : 0
                      
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{status}</span>
                            <span>{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sync Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {syncStatus.recentLogs?.slice(0, 5).map((log, index) => (
                      <div key={log.id} className="flex items-center justify-between">
                        <div className="text-sm">
                          Sync #{syncStatus.recentLogs!.length - index}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {log.records_processed} records / {formatDuration(log.started_at, log.completed_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}