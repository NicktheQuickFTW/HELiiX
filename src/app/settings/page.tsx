'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Bell, 
  Lock, 
  Database, 
  Globe, 
  Zap, 
  Monitor,
  Moon,
  Sun,
  Palette,
  Shield,
  Key,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Users,
  Brain,
  Calendar,
  ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      scheduleAlerts: true,
      awardUpdates: true,
      invoiceReminders: true,
      weatherAlerts: false,
      systemMaintenance: true
    },
    appearance: {
      theme: 'system',
      compactMode: false,
      animations: true,
      reduceMotion: false
    },
    ai: {
      suggestions: true,
      autoCategorize: true,
      predictiveText: true,
      smartSearch: true,
      preferredModel: 'claude-3-5-sonnet'
    },
    database: {
      autoSync: true,
      syncInterval: '15',
      backupEnabled: true,
      compressionEnabled: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: '8',
      loginNotifications: true,
      deviceTracking: true
    },
    integrations: {
      calendar: true,
      email: true,
      slack: false,
      teams: false,
      webhook: false
    }
  })

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
    toast.success('Setting updated successfully')
  }

  const resetToDefaults = () => {
    toast.info('Settings reset to defaults')
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'heliix-settings.json'
    link.click()
    toast.success('Settings exported successfully')
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Settings & Preferences
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure your HELiiX platform experience and integrations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={resetToDefaults}>
            Reset Defaults
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Brain className="h-4 w-4 mr-2" />
            AI & ML
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Globe className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Shield className="h-4 w-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when you want to receive notifications from HELiiX
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Core Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Email notifications</Label>
                      <Switch 
                        id="email-notifications" 
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications">Push notifications</Label>
                      <Switch 
                        id="push-notifications" 
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-maintenance">System maintenance</Label>
                      <Switch 
                        id="system-maintenance" 
                        checked={settings.notifications.systemMaintenance}
                        onCheckedChange={(checked) => updateSetting('notifications', 'systemMaintenance', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Big 12 Operations</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="schedule-alerts">Schedule alerts</Label>
                      <Switch 
                        id="schedule-alerts" 
                        checked={settings.notifications.scheduleAlerts}
                        onCheckedChange={(checked) => updateSetting('notifications', 'scheduleAlerts', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="award-updates">Award updates</Label>
                      <Switch 
                        id="award-updates" 
                        checked={settings.notifications.awardUpdates}
                        onCheckedChange={(checked) => updateSetting('notifications', 'awardUpdates', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="invoice-reminders">Invoice reminders</Label>
                      <Switch 
                        id="invoice-reminders" 
                        checked={settings.notifications.invoiceReminders}
                        onCheckedChange={(checked) => updateSetting('notifications', 'invoiceReminders', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="weather-alerts">Weather alerts</Label>
                      <Switch 
                        id="weather-alerts" 
                        checked={settings.notifications.weatherAlerts}
                        onCheckedChange={(checked) => updateSetting('notifications', 'weatherAlerts', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>
                  Customize the visual appearance of HELiiX
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme-select">Theme preference</Label>
                  <Select 
                    value={settings.appearance.theme}
                    onValueChange={(value) => updateSetting('appearance', 'theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="compact-mode">Compact mode</Label>
                  <Switch 
                    id="compact-mode" 
                    checked={settings.appearance.compactMode}
                    onCheckedChange={(checked) => updateSetting('appearance', 'compactMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="animations">Enable animations</Label>
                  <Switch 
                    id="animations" 
                    checked={settings.appearance.animations}
                    onCheckedChange={(checked) => updateSetting('appearance', 'animations', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="reduce-motion">Reduce motion</Label>
                  <Switch 
                    id="reduce-motion" 
                    checked={settings.appearance.reduceMotion}
                    onCheckedChange={(checked) => updateSetting('appearance', 'reduceMotion', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Big 12 Branding</CardTitle>
                <CardDescription>
                  Conference-specific appearance settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Current Theme</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span className="text-sm">Big 12 Primary Blue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-accent rounded"></div>
                    <span className="text-sm">FlexTime Accent</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Palette className="h-4 w-4 mr-2" />
                  Customize Colors
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI & ML */}
        <TabsContent value="ai" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>AI Assistant Settings</CardTitle>
                <CardDescription>
                  Configure AI features and model preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="preferred-model">Preferred AI model</Label>
                  <Select 
                    value={settings.ai.preferredModel}
                    onValueChange={(value) => updateSetting('ai', 'preferredModel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                      <SelectItem value="perplexity">Perplexity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="ai-suggestions">AI suggestions</Label>
                  <Switch 
                    id="ai-suggestions" 
                    checked={settings.ai.suggestions}
                    onCheckedChange={(checked) => updateSetting('ai', 'suggestions', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-categorize">Auto categorize documents</Label>
                  <Switch 
                    id="auto-categorize" 
                    checked={settings.ai.autoCategorize}
                    onCheckedChange={(checked) => updateSetting('ai', 'autoCategorize', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="predictive-text">Predictive text</Label>
                  <Switch 
                    id="predictive-text" 
                    checked={settings.ai.predictiveText}
                    onCheckedChange={(checked) => updateSetting('ai', 'predictiveText', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="smart-search">Smart search</Label>
                  <Switch 
                    id="smart-search" 
                    checked={settings.ai.smartSearch}
                    onCheckedChange={(checked) => updateSetting('ai', 'smartSearch', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Performance</CardTitle>
                <CardDescription>
                  Monitor and configure AI usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly usage</span>
                    <span className="font-medium">2,847 / 10,000 requests</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold">2.3ms</div>
                    <div className="text-xs text-muted-foreground">Avg Response</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold">99.8%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Brain className="h-4 w-4 mr-2" />
                  View AI Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Database */}
        <TabsContent value="database" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Database Configuration</CardTitle>
                <CardDescription>
                  Manage your Supabase connection and sync settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Connected to Supabase</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-sync">Auto sync enabled</Label>
                  <Switch 
                    id="auto-sync" 
                    checked={settings.database.autoSync}
                    onCheckedChange={(checked) => updateSetting('database', 'autoSync', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sync-interval">Sync interval (minutes)</Label>
                  <Select 
                    value={settings.database.syncInterval}
                    onValueChange={(value) => updateSetting('database', 'syncInterval', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="backup-enabled">Automatic backups</Label>
                  <Switch 
                    id="backup-enabled" 
                    checked={settings.database.backupEnabled}
                    onCheckedChange={(checked) => updateSetting('database', 'backupEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="compression-enabled">Data compression</Label>
                  <Switch 
                    id="compression-enabled" 
                    checked={settings.database.compressionEnabled}
                    onCheckedChange={(checked) => updateSetting('database', 'compressionEnabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Backup, restore, and manage your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Last backup</Label>
                  <p className="text-sm text-muted-foreground">
                    June 10, 2025 at 2:30 PM
                  </p>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Backup
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Restore from Backup
                </Button>
                
                <Separator />
                
                <Button variant="outline" className="w-full">
                  Test Connection
                </Button>
                
                <Button variant="outline" className="w-full">
                  View Migration Status
                </Button>
                
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Storage Usage</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Using 2.1 GB of 10 GB available
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your account security and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-between">
                  Change Password
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="two-factor">Two-factor authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Switch 
                    id="two-factor" 
                    checked={settings.security.twoFactor}
                    onCheckedChange={(checked) => updateSetting('security', 'twoFactor', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session timeout (hours)</Label>
                  <Select 
                    value={settings.security.sessionTimeout}
                    onValueChange={(value) => updateSetting('security', 'sessionTimeout', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-notifications">Login notifications</Label>
                  <Switch 
                    id="login-notifications" 
                    checked={settings.security.loginNotifications}
                    onCheckedChange={(checked) => updateSetting('security', 'loginNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="device-tracking">Device tracking</Label>
                  <Switch 
                    id="device-tracking" 
                    checked={settings.security.deviceTracking}
                    onCheckedChange={(checked) => updateSetting('security', 'deviceTracking', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Monitor and manage your active sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Current Session</p>
                      <p className="text-xs text-muted-foreground">Chrome on macOS</p>
                      <p className="text-xs text-muted-foreground">Austin, TX</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Mobile Session</p>
                      <p className="text-xs text-muted-foreground">Safari on iOS</p>
                      <p className="text-xs text-muted-foreground">Austin, TX</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Revoke All Sessions
                </Button>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Security Score: 85/100</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enable 2FA to improve your score
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>
                  Manage integrations with external services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Calendar Integration</p>
                      <p className="text-sm text-muted-foreground">Sync with Google Calendar</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.integrations.calendar}
                    onCheckedChange={(checked) => updateSetting('integrations', 'calendar', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Email Integration</p>
                      <p className="text-sm text-muted-foreground">Send notifications via email</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.integrations.email}
                    onCheckedChange={(checked) => updateSetting('integrations', 'email', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Slack Integration</p>
                      <p className="text-sm text-muted-foreground">Send alerts to Slack channels</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.integrations.slack}
                    onCheckedChange={(checked) => updateSetting('integrations', 'slack', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Microsoft Teams</p>
                      <p className="text-sm text-muted-foreground">Teams notifications</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.integrations.teams}
                    onCheckedChange={(checked) => updateSetting('integrations', 'teams', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Webhook Integration</p>
                      <p className="text-sm text-muted-foreground">Custom webhook endpoints</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.integrations.webhook}
                    onCheckedChange={(checked) => updateSetting('integrations', 'webhook', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>
                  Manage API keys and external connections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Keys</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">OpenAI API</span>
                      <Badge variant="outline" className="text-green-600">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Anthropic API</span>
                      <Badge variant="outline" className="text-green-600">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Pinecone API</span>
                      <Badge variant="outline" className="text-green-600">Connected</Badge>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Manage API Keys
                </Button>
                
                <Button variant="outline" className="w-full">
                  Test All Connections
                </Button>
                
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">All services operational</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Advanced */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Configuration</CardTitle>
              <CardDescription>
                Developer and system administration options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">System</h4>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Database Console
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Monitor className="h-4 w-4 mr-2" />
                    System Logs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Audit
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Developer</h4>
                  <Button variant="outline" className="w-full justify-start">
                    <Key className="h-4 w-4 mr-2" />
                    API Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="h-4 w-4 mr-2" />
                    Webhook Logs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Logs
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium text-destructive">Danger Zone</h4>
                <div className="p-4 border-destructive border rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    These actions cannot be undone. Please proceed with caution.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Reset All Settings
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}