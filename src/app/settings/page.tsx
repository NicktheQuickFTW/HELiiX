'use client';

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Bell, Lock, Database, Globe, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Settings className="h-8 w-8" />
                Settings
              </h1>
              <p className="text-muted-foreground mt-2">
                Configure your HELiiX platform preferences
              </p>
            </div>
          </div>
          
          <Separator className="mb-6" />
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Manage how you receive updates and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email notifications</Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push notifications</Label>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="schedule-alerts">Schedule alerts</Label>
                  <Switch id="schedule-alerts" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full">
                  Active Sessions
                </Button>
              </CardContent>
            </Card>

            {/* Database */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database
                </CardTitle>
                <CardDescription>
                  Database connection and sync settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-sync">Auto sync</Label>
                  <Switch id="auto-sync" defaultChecked />
                </div>
                <Button variant="outline" className="w-full">
                  Test Connection
                </Button>
                <Button variant="outline" className="w-full">
                  Backup Data
                </Button>
              </CardContent>
            </Card>

            {/* AI Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI Settings
                </CardTitle>
                <CardDescription>
                  Configure AI models and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ai-suggestions">AI suggestions</Label>
                  <Switch id="ai-suggestions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-categorize">Auto categorize</Label>
                  <Switch id="auto-categorize" defaultChecked />
                </div>
                <Button variant="outline" className="w-full">
                  Model Preferences
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}