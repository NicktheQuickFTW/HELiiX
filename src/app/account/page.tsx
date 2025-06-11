'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { 
  User, 
  Camera, 
  Upload, 
  Download, 
  Save, 
  Edit,
  Shield,
  Key,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building2,
  Trophy,
  Users,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'sonner'

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [profile, setProfile] = useState({
    firstName: 'Nick',
    lastName: 'Williams',
    email: 'nick.williams@big12sports.com',
    phone: '+1 (512) 555-0123',
    title: 'Assistant Commissioner, Operations',
    department: 'Big 12 Conference Operations',
    bio: 'Responsible for coordinating operational activities across all Big 12 Conference sports and championship events. Specialized in scheduling optimization, venue management, and award program administration.',
    hometown: 'Austin, Texas',
    timezone: 'America/Chicago',
    startDate: '2019-08-15',
    birthDate: '1985-03-22',
    supervisor: 'Commissioner Brett Yormark',
    officeLocation: 'Big 12 Conference Headquarters'
  })

  const [preferences, setPreferences] = useState({
    language: 'en',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
    weekStart: 'sunday',
    defaultView: 'dashboard'
  })

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    loginAlerts: true,
    sessionTimeout: '8 hours'
  })

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
        toast.success('Avatar uploaded successfully')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUpdate = () => {
    toast.success('Profile updated successfully')
  }

  const handlePasswordChange = () => {
    if (security.newPassword !== security.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    toast.success('Password changed successfully')
    setSecurity({ ...security, currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const exportProfile = () => {
    const profileData = {
      profile,
      preferences,
      exportedAt: new Date().toISOString()
    }
    const dataStr = JSON.stringify(profileData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'heliix-profile.json'
    link.click()
    toast.success('Profile data exported successfully')
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8" />
            Account & Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information, avatar, and account preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportProfile}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleProfileUpdate}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="avatar">
            <Camera className="h-4 w-4 mr-2" />
            Avatar & Photo
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Calendar className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Information */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hometown">Hometown</Label>
                  <Input 
                    id="hometown" 
                    value={profile.hometown}
                    onChange={(e) => setProfile({ ...profile, hometown: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
                <CardDescription>
                  Your role and organizational information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input 
                    id="title" 
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input 
                    id="department" 
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supervisor">Supervisor</Label>
                  <Input 
                    id="supervisor" 
                    value={profile.supervisor}
                    onChange={(e) => setProfile({ ...profile, supervisor: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    type="date"
                    value={profile.startDate}
                    onChange={(e) => setProfile({ ...profile, startDate: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input 
                    id="birthDate" 
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Professional Bio</CardTitle>
              <CardDescription>
                A brief description of your role and responsibilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Enter your professional bio..."
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Avatar & Photo */}
        <TabsContent value="avatar" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>
                  Upload and manage your profile picture and avatar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage 
                      src={avatarPreview || "/avatars/nick-williams.jpg"} 
                      alt={`${profile.firstName} ${profile.lastName}`} 
                    />
                    <AvatarFallback className="text-2xl">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center">
                    <h3 className="font-medium">{profile.firstName} {profile.lastName}</h3>
                    <p className="text-sm text-muted-foreground">{profile.title}</p>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Photo
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                  
                  {avatarPreview && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setAvatarPreview(null)
                        toast.success('Avatar removed')
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Photo
                    </Button>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Maximum file size: 5MB</p>
                  <p>• Supported formats: JPG, PNG, GIF</p>
                  <p>• Recommended: Square image, 400x400px</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>
                  Control how your profile appears to others
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show photo in directory</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your photo in the staff directory
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show in team listings</Label>
                      <p className="text-sm text-muted-foreground">
                        Include your photo in team and project views
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Public profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow external contacts to see your profile
                      </p>
                    </div>
                    <input type="checkbox" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Profile visibility</Label>
                  <Select defaultValue="internal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Everyone can see</SelectItem>
                      <SelectItem value="internal">Internal - Big 12 staff only</SelectItem>
                      <SelectItem value="team">Team - My department only</SelectItem>
                      <SelectItem value="private">Private - Only me</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Professional Headshot Gallery</CardTitle>
              <CardDescription>
                Manage multiple professional photos for different uses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                  <div className="flex flex-col items-center justify-center h-24">
                    <Upload className="h-6 w-6 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">Upload New</span>
                  </div>
                </div>
                
                <div className="relative group">
                  <img 
                    src="/headshots/nick-professional.jpg" 
                    alt="Professional headshot"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button size="sm" variant="secondary">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  <Badge className="absolute top-1 right-1" variant="secondary">
                    Primary
                  </Badge>
                </div>
                
                <div className="relative group">
                  <img 
                    src="/headshots/nick-casual.jpg" 
                    alt="Casual headshot"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button size="sm" variant="secondary">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Display Preferences</CardTitle>
                <CardDescription>
                  Customize how information is displayed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={preferences.language} onValueChange={(value) => setPreferences({ ...preferences, language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={preferences.dateFormat} onValueChange={(value) => setPreferences({ ...preferences, dateFormat: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Time Format</Label>
                  <Select value={preferences.timeFormat} onValueChange={(value) => setPreferences({ ...preferences, timeFormat: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Week Starts On</Label>
                  <Select value={preferences.weekStart} onValueChange={(value) => setPreferences({ ...preferences, weekStart: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunday">Sunday</SelectItem>
                      <SelectItem value="monday">Monday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
                <CardDescription>
                  Default views and navigation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Landing Page</Label>
                  <Select value={preferences.defaultView} onValueChange={(value) => setPreferences({ ...preferences, defaultView: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="calendar">Calendar View</SelectItem>
                      <SelectItem value="operations">Operations Center</SelectItem>
                      <SelectItem value="awards">Awards Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile({ ...profile, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
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
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your account password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input 
                      id="currentPassword" 
                      type={showPassword ? "text" : "password"}
                      value={security.currentPassword}
                      onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    value={security.newPassword}
                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                  />
                </div>
                
                <Button onClick={handlePasswordChange} className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>
                  Current account security and verification status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Email Verified</p>
                      <p className="text-sm text-muted-foreground">nick.williams@big12sports.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Phone Verified</p>
                      <p className="text-sm text-muted-foreground">+1 (512) 555-0123</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Not enabled</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Account Security Score</span>
                    <span className="font-medium">75/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enable 2FA to improve your security score
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}