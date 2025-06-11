'use client'

import { SyncStatusDashboard } from '@/components/sync-status-dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  ArrowLeft, 
  Database, 
  Sync, 
  FileText,
  ExternalLink,
  Info
} from "lucide-react"

export default function SyncPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Back Navigation */}
      <div className="flex items-center space-x-2">
        <Link href="/analytics">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analytics
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center text-white text-2xl">
            <Sync className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Synchronization</h1>
            <p className="text-muted-foreground">
              Monitor and manage data sync between Notion and Supabase databases for real-time contact management.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">Real-time Sync</Badge>
          <Badge variant="outline">Notion Integration</Badge>
          <Badge variant="outline">Supabase Database</Badge>
          <Badge className="bg-accent text-accent-foreground">Automated</Badge>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-accent" />
              <span>About Data Sync</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The sync system automatically transfers contact data from your Notion database to Supabase, 
              enabling faster queries and better performance for the HELiiX platform.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>Automated incremental updates</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>Real-time contact directory</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>Sport-specific filtering</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>Comprehensive sync logging</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-accent" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href="/contacts">
                  <Database className="h-4 w-4 mr-2" />
                  View Contacts Directory
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <a 
                  href="https://www.notion.so/13779839c200819db58bd3f239672f9a" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Notion Database
                </a>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href="/analytics">
                  <FileText className="h-4 w-4 mr-2" />
                  View Analytics Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Sync Dashboard */}
      <SyncStatusDashboard />
    </div>
  )
}