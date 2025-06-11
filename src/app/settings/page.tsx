'use client'

import React, { useState } from 'react'
import {
  Background,
  Column,
  Row,
  Grid,
  Card,
  Button,
  Heading,
  Text,
  Badge,
  Icon,
  Input
} from '@once-ui-system/core'
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

  const [activeTab, setActiveTab] = useState('notifications')

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const resetToDefaults = () => {
    console.log('Settings reset to defaults')
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'heliix-settings.json'
    link.click()
  }

  return (
    <Background background="page" fillWidth>
      <Column padding="l" gap="l" fillWidth>
        <Row style={{ alignItems: "center", justifyContent: "space-between" }} fillWidth>
          <Column gap="xs">
            <Row style={{ alignItems: "center" }} gap="s">
              <Icon name="settings" size="l" />
              <Heading as="h1" size="xl">Settings & Preferences</Heading>
            </Row>
            <Text size="l" color="neutral-500">
              Configure your HELiiX platform experience and integrations
            </Text>
          </Column>
          <Row gap="s">
            <Button variant="secondary" size="s" onClick={exportSettings}>
              <Icon name="download" size="s" />
              Export
            </Button>
            <Button variant="secondary" size="s" onClick={resetToDefaults}>
              Reset Defaults
            </Button>
          </Row>
        </Row>

        <Column gap="l" fillWidth>
          {/* Tab Navigation */}
          <Row gap="s" wrap>
            <Button 
              variant={activeTab === 'notifications' ? 'primary' : 'secondary'} 
              size="s"
              onClick={() => setActiveTab('notifications')}
            >
              <Icon name="bell" size="s" />
              Notifications
            </Button>
            <Button 
              variant={activeTab === 'appearance' ? 'primary' : 'secondary'} 
              size="s"
              onClick={() => setActiveTab('appearance')}
            >
              <Icon name="palette" size="s" />
              Appearance
            </Button>
            <Button 
              variant={activeTab === 'ai' ? 'primary' : 'secondary'} 
              size="s"
              onClick={() => setActiveTab('ai')}
            >
              <Icon name="brain" size="s" />
              AI & ML
            </Button>
            <Button 
              variant={activeTab === 'database' ? 'primary' : 'secondary'} 
              size="s"
              onClick={() => setActiveTab('database')}
            >
              <Icon name="database" size="s" />
              Database
            </Button>
            <Button 
              variant={activeTab === 'security' ? 'primary' : 'secondary'} 
              size="s"
              onClick={() => setActiveTab('security')}
            >
              <Icon name="lock" size="s" />
              Security
            </Button>
            <Button 
              variant={activeTab === 'integrations' ? 'primary' : 'secondary'} 
              size="s"
              onClick={() => setActiveTab('integrations')}
            >
              <Icon name="globe" size="s" />
              Integrations
            </Button>
            <Button 
              variant={activeTab === 'advanced' ? 'primary' : 'secondary'} 
              size="s"
              onClick={() => setActiveTab('advanced')}
            >
              <Icon name="shield" size="s" />
              Advanced
            </Button>
          </Row>

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Card padding="m">
              <Column gap="m">
                <Column gap="xs">
                  <Heading as="h3" size="m">Notification Preferences</Heading>
                  <Text size="s" color="neutral-600">
                    Choose how and when you want to receive notifications from HELiiX
                  </Text>
                </Column>
                
                <Grid columns={2} gap="m" fillWidth>
                  <Column gap="m">
                    <Text weight="medium">Core Notifications</Text>
                    <Column gap="s">
                      <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Text size="s">Email notifications</Text>
                        <Button 
                          variant={settings.notifications.email ? "primary" : "secondary"}
                          size="s"
                          onClick={() => updateSetting('notifications', 'email', !settings.notifications.email)}
                        >
                          {settings.notifications.email ? "On" : "Off"}
                        </Button>
                      </Row>
                      <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Text size="s">Push notifications</Text>
                        <Button 
                          checked={settings.notifications.push}
                          onChange={(checked) => updateSetting('notifications', 'push', checked)}
                        />
                      </Row>
                      <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Text size="s">System maintenance</Text>
                        <Button 
                          checked={settings.notifications.systemMaintenance}
                          onChange={(checked) => updateSetting('notifications', 'systemMaintenance', checked)}
                        />
                      </Row>
                    </Column>
                  </Column>

                  <Column gap="m">
                    <Text weight="medium">Big 12 Operations</Text>
                    <Column gap="s">
                      <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Text size="s">Schedule alerts</Text>
                        <Button 
                          checked={settings.notifications.scheduleAlerts}
                          onChange={(checked) => updateSetting('notifications', 'scheduleAlerts', checked)}
                        />
                      </Row>
                      <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Text size="s">Award updates</Text>
                        <Button 
                          checked={settings.notifications.awardUpdates}
                          onChange={(checked) => updateSetting('notifications', 'awardUpdates', checked)}
                        />
                      </Row>
                      <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Text size="s">Invoice reminders</Text>
                        <Button 
                          checked={settings.notifications.invoiceReminders}
                          onChange={(checked) => updateSetting('notifications', 'invoiceReminders', checked)}
                        />
                      </Row>
                      <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Text size="s">Weather alerts</Text>
                        <Button 
                          checked={settings.notifications.weatherAlerts}
                          onChange={(checked) => updateSetting('notifications', 'weatherAlerts', checked)}
                        />
                      </Row>
                    </Column>
                  </Column>
                </Grid>
              </Column>
            </Card>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <Grid columns={2} gap="m" fillWidth>
              <Card padding="m">
                <Column gap="m">
                  <Column gap="xs">
                    <Heading as="h3" size="m">Theme Settings</Heading>
                    <Text size="s" color="neutral-600">
                      Customize the visual appearance of HELiiX
                    </Text>
                  </Column>
                  
                  <Column gap="s">
                    <Text size="s">Theme preference</Text>
                    <Row gap="s">
                      <Button 
                        variant={settings.appearance.theme === 'light' ? 'primary' : 'secondary'} 
                        size="s"
                        onClick={() => updateSetting('appearance', 'theme', 'light')}
                      >
                        <Icon name="sun" size="s" />
                        Light
                      </Button>
                      <Button 
                        variant={settings.appearance.theme === 'dark' ? 'primary' : 'secondary'} 
                        size="s"
                        onClick={() => updateSetting('appearance', 'theme', 'dark')}
                      >
                        <Icon name="moon" size="s" />
                        Dark
                      </Button>
                      <Button 
                        variant={settings.appearance.theme === 'system' ? 'primary' : 'secondary'} 
                        size="s"
                        onClick={() => updateSetting('appearance', 'theme', 'system')}
                      >
                        <Icon name="monitor" size="s" />
                        System
                      </Button>
                    </Row>
                    
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Text size="s">Compact mode</Text>
                      <Button 
                        checked={settings.appearance.compactMode}
                        onChange={(checked) => updateSetting('appearance', 'compactMode', checked)}
                      />
                    </Row>
                    
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Text size="s">Enable animations</Text>
                      <Button 
                        checked={settings.appearance.animations}
                        onChange={(checked) => updateSetting('appearance', 'animations', checked)}
                      />
                    </Row>
                    
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Text size="s">Reduce motion</Text>
                      <Button 
                        checked={settings.appearance.reduceMotion}
                        onChange={(checked) => updateSetting('appearance', 'reduceMotion', checked)}
                      />
                    </Row>
                  </Column>
                </Column>
              </Card>

              <Card padding="m">
                <Column gap="m">
                  <Column gap="xs">
                    <Heading as="h3" size="m">Big 12 Branding</Heading>
                    <Text size="s" color="neutral-600">
                      Conference-specific appearance settings
                    </Text>
                  </Column>
                  
                  <div style={{ padding: '1rem', border: '1px solid var(--neutral-border)', borderRadius: '0.5rem' }}>
                    <Text weight="medium" marginBottom="s">Current Theme</Text>
                    <Row style={{ alignItems: "center" }} gap="s" marginBottom="s">
                      <div style={{ width: '1rem', height: '1rem', backgroundColor: 'var(--brand-background)', borderRadius: '0.25rem' }} />
                      <Text size="s">Big 12 Primary Blue</Text>
                    </Row>
                    <Row style={{ alignItems: "center" }} gap="s">
                      <div style={{ width: '1rem', height: '1rem', backgroundColor: 'var(--accent-background)', borderRadius: '0.25rem' }} />
                      <Text size="s">FlexTime Accent</Text>
                    </Row>
                  </div>
                  
                  <Button variant="secondary" size="m" fillWidth>
                    <Icon name="palette" size="s" />
                    Customize Colors
                  </Button>
                </Column>
              </Card>
            </Grid>
          )}

          {/* AI & ML */}
          {activeTab === 'ai' && (
            <Grid columns={2} gap="m" fillWidth>
              <Card padding="m">
                <Column gap="m">
                  <Column gap="xs">
                    <Heading as="h3" size="m">AI Assistant Settings</Heading>
                    <Text size="s" color="neutral-600">
                      Configure AI features and model preferences
                    </Text>
                  </Column>
                  
                  <Column gap="s">
                    <Text size="s">Preferred AI model</Text>
                    <Row gap="s" wrap>
                      <Button 
                        variant={settings.ai.preferredModel === 'claude-3-5-sonnet' ? 'primary' : 'secondary'} 
                        size="s"
                        onClick={() => updateSetting('ai', 'preferredModel', 'claude-3-5-sonnet')}
                      >
                        Claude 3.5 Sonnet
                      </Button>
                      <Button 
                        variant={settings.ai.preferredModel === 'gpt-4-turbo' ? 'primary' : 'secondary'} 
                        size="s"
                        onClick={() => updateSetting('ai', 'preferredModel', 'gpt-4-turbo')}
                      >
                        GPT-4 Turbo
                      </Button>
                    </Row>
                    
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Text size="s">AI suggestions</Text>
                      <Button 
                        checked={settings.ai.suggestions}
                        onChange={(checked) => updateSetting('ai', 'suggestions', checked)}
                      />
                    </Row>
                    
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Text size="s">Auto categorize documents</Text>
                      <Button 
                        checked={settings.ai.autoCategorize}
                        onChange={(checked) => updateSetting('ai', 'autoCategorize', checked)}
                      />
                    </Row>
                    
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Text size="s">Predictive text</Text>
                      <Button 
                        checked={settings.ai.predictiveText}
                        onChange={(checked) => updateSetting('ai', 'predictiveText', checked)}
                      />
                    </Row>
                    
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Text size="s">Smart search</Text>
                      <Button 
                        checked={settings.ai.smartSearch}
                        onChange={(checked) => updateSetting('ai', 'smartSearch', checked)}
                      />
                    </Row>
                  </Column>
                </Column>
              </Card>

              <Card padding="m">
                <Column gap="m">
                  <Column gap="xs">
                    <Heading as="h3" size="m">AI Performance</Heading>
                    <Text size="s" color="neutral-600">
                      Monitor and configure AI usage
                    </Text>
                  </Column>
                  
                  <Column gap="s">
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Text size="s">Monthly usage</Text>
                      <Text weight="medium">2,847 / 10,000 requests</Text>
                    </Row>
                    <div style={{ width: '100%', height: '0.5rem', backgroundColor: 'var(--neutral-border)', borderRadius: '0.25rem' }}>
                      <div style={{ width: '28%', height: '100%', backgroundColor: 'var(--brand-background)', borderRadius: '0.25rem' }} />
                    </div>
                    
                    <Grid columns={2} gap="s">
                      <div style={{ padding: '0.75rem', border: '1px solid var(--neutral-border)', borderRadius: '0.5rem', textAlign: 'center' }}>
                        <Text size="xl" weight="bold">2.3ms</Text>
                        <Text size="xs" color="neutral-500">Avg Response</Text>
                      </div>
                      <div style={{ padding: '0.75rem', border: '1px solid var(--neutral-border)', borderRadius: '0.5rem', textAlign: 'center' }}>
                        <Text size="xl" weight="bold">99.8%</Text>
                        <Text size="xs" color="neutral-500">Accuracy</Text>
                      </div>
                    </Grid>
                    
                    <Button variant="secondary" size="m" fillWidth>
                      <Icon name="brain" size="s" />
                      View AI Analytics
                    </Button>
                  </Column>
                </Column>
              </Card>
            </Grid>
          )}

          {/* Database */}
          {activeTab === 'database' && (
            <Grid columns={2} gap="m" fillWidth>
              <Card padding="m">
                <Column gap="m">
                  <Column gap="xs">
                    <Heading as="h3" size="m">Database Configuration</Heading>
                    <Text size="s" color="neutral-600">
                      Manage your Supabase connection and sync settings
                    </Text>
                  </Column>
                  
                  <Row style={{ alignItems: "center" }} gap="s" style={{ padding: '0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '0.5rem' }}>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <Text size="s" weight="medium">Connected to Supabase</Text>
                  </Row>
                  
                  <Column gap="s">
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Text size="s">Auto sync enabled</Text>
                      <Button 
                        checked={settings.database.autoSync}
                        onChange={(checked) => updateSetting('database', 'autoSync', checked)}
                      />
                    </Row>
                    
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Text size="s">Automatic backups</Text>
                      <Button 
                        checked={settings.database.backupEnabled}
                        onChange={(checked) => updateSetting('database', 'backupEnabled', checked)}
                      />
                    </Row>
                    
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Text size="s">Data compression</Text>
                      <Button 
                        checked={settings.database.compressionEnabled}
                        onChange={(checked) => updateSetting('database', 'compressionEnabled', checked)}
                      />
                    </Row>
                  </Column>
                </Column>
              </Card>

              <Card padding="m">
                <Column gap="m">
                  <Column gap="xs">
                    <Heading as="h3" size="m">Data Management</Heading>
                    <Text size="s" color="neutral-600">
                      Backup, restore, and manage your data
                    </Text>
                  </Column>
                  
                  <Column gap="s">
                    <Text size="s">Last backup: June 10, 2025 at 2:30 PM</Text>
                    
                    <Button variant="secondary" size="m" fillWidth>
                      <Icon name="download" size="s" />
                      Download Backup
                    </Button>
                    
                    <Button variant="secondary" size="m" fillWidth>
                      <Icon name="upload" size="s" />
                      Restore from Backup
                    </Button>
                    
                    <Button variant="secondary" size="m" fillWidth>
                      Test Connection
                    </Button>
                    
                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(251, 191, 36, 0.1)', borderRadius: '0.5rem' }}>
                      <Row style={{ alignItems: "center" }} gap="s">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <Text size="s" weight="medium">Storage Usage</Text>
                      </Row>
                      <Text size="s" color="neutral-500" marginTop="xs">
                        Using 2.1 GB of 10 GB available
                      </Text>
                    </div>
                  </Column>
                </Column>
              </Card>
            </Grid>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <Grid columns={2} gap="m" fillWidth>
              <Card padding="m">
                <Column gap="m">
                  <Column gap="xs">
                    <Heading as="h3" size="m">Account Security</Heading>
                    <Text size="s" color="neutral-600">
                      Manage your account security and access controls
                    </Text>
                  </Column>
                  
                  <Column gap="s">
                    <Button variant="secondary" size="m" fillWidth>
                      Change Password
                      <Icon name="chevronRight" size="s" />
                    </Button>
                    
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Column gap="xs">
                        <Text size="s">Two-factor authentication</Text>
                        <Text size="xs" color="neutral-500">Add an extra layer of security</Text>
                      </Column>
                      <Button 
                        checked={settings.security.twoFactor}
                        onChange={(checked) => updateSetting('security', 'twoFactor', checked)}
                      />
                    </Row>
                    
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Text size="s">Login notifications</Text>
                      <Button 
                        checked={settings.security.loginNotifications}
                        onChange={(checked) => updateSetting('security', 'loginNotifications', checked)}
                      />
                    </Row>
                    
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Text size="s">Device tracking</Text>
                      <Button 
                        checked={settings.security.deviceTracking}
                        onChange={(checked) => updateSetting('security', 'deviceTracking', checked)}
                      />
                    </Row>
                  </Column>
                </Column>
              </Card>

              <Card padding="m">
                <Column gap="m">
                  <Column gap="xs">
                    <Heading as="h3" size="m">Active Sessions</Heading>
                    <Text size="s" color="neutral-600">
                      Monitor and manage your active sessions
                    </Text>
                  </Column>
                  
                  <Column gap="s">
                    <div style={{ border: '1px solid var(--neutral-border)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                      <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Column gap="xs">
                          <Text size="s" weight="medium">Current Session</Text>
                          <Text size="xs" color="neutral-500">Chrome on macOS</Text>
                          <Text size="xs" color="neutral-500">Austin, TX</Text>
                        </Column>
                        <Badge variant="neutral">Active</Badge>
                      </Row>
                    </div>
                    
                    <div style={{ border: '1px solid var(--neutral-border)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                      <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Column gap="xs">
                          <Text size="s" weight="medium">Mobile Session</Text>
                          <Text size="xs" color="neutral-500">Safari on iOS</Text>
                          <Text size="xs" color="neutral-500">Austin, TX</Text>
                        </Column>
                        <Button variant="ghost" size="s">
                          <Icon name="trash2" size="s" />
                        </Button>
                      </Row>
                    </div>
                    
                    <Button variant="secondary" size="m" fillWidth>
                      Revoke All Sessions
                    </Button>
                    
                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                      <Row style={{ alignItems: "center" }} gap="s">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <Text size="s" weight="medium">Security Score: 85/100</Text>
                      </Row>
                      <Text size="s" color="neutral-500" marginTop="xs">
                        Enable 2FA to improve your score
                      </Text>
                    </div>
                  </Column>
                </Column>
              </Card>
            </Grid>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <Grid columns={2} gap="m" fillWidth>
              <Card padding="m">
                <Column gap="m">
                  <Column gap="xs">
                    <Heading as="h3" size="m">Connected Services</Heading>
                    <Text size="s" color="neutral-600">
                      Manage integrations with external services
                    </Text>
                  </Column>
                  
                  <Column gap="s">
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Row style={{ alignItems: "center" }} gap="s">
                        <Icon name="calendar" size="m" />
                        <Column gap="xs">
                          <Text weight="medium">Calendar Integration</Text>
                          <Text size="s" color="neutral-600">Sync with Google Calendar</Text>
                        </Column>
                      </Row>
                      <Button 
                        checked={settings.integrations.calendar}
                        onChange={(checked) => updateSetting('integrations', 'calendar', checked)}
                      />
                    </Row>
                    
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Row style={{ alignItems: "center" }} gap="s">
                        <Icon name="globe" size="m" />
                        <Column gap="xs">
                          <Text weight="medium">Email Integration</Text>
                          <Text size="s" color="neutral-600">Send notifications via email</Text>
                        </Column>
                      </Row>
                      <Button 
                        checked={settings.integrations.email}
                        onChange={(checked) => updateSetting('integrations', 'email', checked)}
                      />
                    </Row>
                    
                    <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <Row style={{ alignItems: "center" }} gap="s">
                        <Icon name="users" size="m" />
                        <Column gap="xs">
                          <Text weight="medium">Slack Integration</Text>
                          <Text size="s" color="neutral-600">Send alerts to Slack channels</Text>
                        </Column>
                      </Row>
                      <Button 
                        checked={settings.integrations.slack}
                        onChange={(checked) => updateSetting('integrations', 'slack', checked)}
                      />
                    </Row>
                  </Column>
                </Column>
              </Card>

              <Card padding="m">
                <Column gap="m">
                  <Column gap="xs">
                    <Heading as="h3" size="m">API Configuration</Heading>
                    <Text size="s" color="neutral-600">
                      Manage API keys and external connections
                    </Text>
                  </Column>
                  
                  <Column gap="s">
                    <Text size="s">API Keys</Text>
                    <Column gap="xs">
                      <Row style={{ alignItems: "center", justifyContent: "space-between", padding: '0.5rem', border: '1px solid var(--neutral-border)', borderRadius: '0.25rem' }}>
                        <Text size="s">OpenAI API</Text>
                        <Badge variant="brand" onBackground="success-strong">Connected</Badge>
                      </Row>
                      <Row style={{ alignItems: "center", justifyContent: "space-between", padding: '0.5rem', border: '1px solid var(--neutral-border)', borderRadius: '0.25rem' }}>
                        <Text size="s">Anthropic API</Text>
                        <Badge variant="brand" onBackground="success-strong">Connected</Badge>
                      </Row>
                      <Row style={{ alignItems: "center", justifyContent: "space-between", padding: '0.5rem', border: '1px solid var(--neutral-border)', borderRadius: '0.25rem' }}>
                        <Text size="s">Pinecone API</Text>
                        <Badge variant="brand" onBackground="success-strong">Connected</Badge>
                      </Row>
                    </Column>
                    
                    <Button variant="secondary" size="m" fillWidth>
                      <Icon name="key" size="s" />
                      Manage API Keys
                    </Button>
                    
                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '0.5rem' }}>
                      <Row style={{ alignItems: "center" }} gap="s">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <Text size="s" weight="medium">All services operational</Text>
                      </Row>
                    </div>
                  </Column>
                </Column>
              </Card>
            </Grid>
          )}

          {/* Advanced */}
          {activeTab === 'advanced' && (
            <Card padding="m">
              <Column gap="m">
                <Column gap="xs">
                  <Heading as="h3" size="m">Advanced Configuration</Heading>
                  <Text size="s" color="neutral-600">
                    Developer and system administration options
                  </Text>
                </Column>
                
                <Grid columns={2} gap="m" fillWidth>
                  <Column gap="m">
                    <Text weight="medium">System</Text>
                    <Button variant="secondary" size="m" fillWidth>
                      <Icon name="database" size="s" />
                      Database Console
                    </Button>
                    <Button variant="secondary" size="m" fillWidth>
                      <Icon name="monitor" size="s" />
                      System Logs
                    </Button>
                    <Button variant="secondary" size="m" fillWidth>
                      <Icon name="shield" size="s" />
                      Security Audit
                    </Button>
                  </Column>
                  
                  <Column gap="m">
                    <Text weight="medium">Developer</Text>
                    <Button variant="secondary" size="m" fillWidth>
                      <Icon name="key" size="s" />
                      API Documentation
                    </Button>
                    <Button variant="secondary" size="m" fillWidth>
                      <Icon name="globe" size="s" />
                      Webhook Logs
                    </Button>
                    <Button variant="secondary" size="m" fillWidth>
                      <Icon name="download" size="s" />
                      Export Logs
                    </Button>
                  </Column>
                </Grid>
                
                <Column gap="m">
                  <Text weight="medium" color="danger">Danger Zone</Text>
                  <div style={{ padding: '1rem', border: '1px solid var(--danger-border)', borderRadius: '0.5rem' }}>
                    <Text size="s" color="neutral-600" marginBottom="s">
                      These actions cannot be undone. Please proceed with caution.
                    </Text>
                    <Row gap="s">
                      <Button variant="secondary" size="s">
                        Reset All Settings
                      </Button>
                      <Button variant="primary" size="s" style={{ backgroundColor: 'var(--danger-background)' }}>
                        <Icon name="trash2" size="s" />
                        Delete All Data
                      </Button>
                    </Row>
                  </div>
                </Column>
              </Column>
            </Card>
          )}
        </Column>
      </Column>
    </Background>
  )
}