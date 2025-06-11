'use client'

import { useState, useEffect } from 'react'
import { useAuth, UserProfile } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { 
  User, 
  Shield, 
  Clock, 
  Settings, 
  Key,
  Bell,
  Trash2,
  Upload,
  Save
} from 'lucide-react'

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver', 
  'America/Los_Angeles',
  'America/Phoenix',
  'UTC'
]

const departments = [
  'Administration',
  'Finance',
  'Operations',
  'Marketing',
  'Communications',
  'Technology',
  'Legal',
  'Compliance'
]

export default function ProfilePage() {
  const { user, profile, updateProfile, signOut } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})

  useEffect(() => {
    if (profile) {
      setFormData({ ...profile })
    }
  }, [profile])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const { error } = await updateProfile(formData)
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Profile updated successfully')
        setIsEditing(false)
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({ ...profile })
    }
    setIsEditing(false)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'finance': return 'bg-green-100 text-green-800'
      case 'operations': return 'bg-blue-100 text-blue-800'
      case 'marketing': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  if (!user || !profile) {
    return (
      <div className="container py-6">
        <div className="text-center">
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8" />
            User Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your Big 12 HELiiX account settings and preferences
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your basic account information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {getInitials(profile.first_name, profile.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Profile Picture</p>
                  <Button variant="outline" size="sm" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.first_name || ''}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.last_name || ''}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  disabled // Email cannot be changed
                />
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed. Contact your administrator if needed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department || ''}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId">Big 12 Employee ID</Label>
                <Input
                  id="employeeId"
                  value={formData.big12_employee_id || ''}
                  onChange={(e) => setFormData({ ...formData, big12_employee_id: e.target.value })}
                  disabled={!isEditing}
                  placeholder="B12-####"
                />
              </div>

              {/* Role Badge */}
              <div className="space-y-2">
                <Label>Current Role</Label>
                <div>
                  <Badge className={getRoleColor(profile.role)}>
                    <Shield className="h-3 w-3 mr-1" />
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Contact your administrator to change your role permissions.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                  <Button variant="outline">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" disabled>
                    <Shield className="h-4 w-4 mr-2" />
                    Enable 2FA
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Active Sessions</h4>
                    <p className="text-sm text-muted-foreground">
                      Manage devices that are signed in to your account
                    </p>
                  </div>
                  <Button variant="outline" disabled>
                    View Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your HELiiX experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={formData.timezone || 'America/Chicago'}
                  onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Notification Preferences</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      <Bell className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Distribution Reminders</p>
                      <p className="text-sm text-muted-foreground">Get notified about upcoming distributions</p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      <Bell className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>
                Recent account activity and login history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Last Login</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.last_login 
                          ? new Date(profile.last_login).toLocaleString()
                          : 'No previous login recorded'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Account Created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Activity Log</p>
                    <p className="text-sm text-muted-foreground">
                      View detailed activity history
                    </p>
                  </div>
                  <Button variant="outline" disabled>
                    View Log
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-600">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button variant="destructive" disabled>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}