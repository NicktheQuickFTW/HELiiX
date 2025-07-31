'use client';

import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Camera,
  Upload,
  Download,
  Save,
  Shield,
  Key,
  Calendar,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    firstName: 'Nick',
    lastName: 'Wright',
    email: 'nick.wright@big12sports.com',
    phone: '+1 (469) 767-8710',
    department: 'Competition',
    role: 'Director of Competition',
    bio: 'Overseeing championship events and competition logistics for the Big 12 Conference. Leading digital transformation initiatives and data-driven decision making.',
    location: 'Dallas, TX',
    timezone: 'America/Chicago',
    joinDate: 'January 2019',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    darkMode: false,
    compactView: false,
    autoRefresh: true,
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour',
    firstDayOfWeek: 'sunday',
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    lastPasswordChange: '3 months ago',
    activeSessions: 3,
    loginHistory: [
      { device: 'MacBook Pro', location: 'Dallas, TX', time: '2 hours ago' },
      { device: 'iPhone 14', location: 'Dallas, TX', time: '1 day ago' },
      { device: 'iPad Pro', location: 'Irving, TX', time: '3 days ago' },
    ],
  });

  const handleProfileUpdate = () => {
    // Simulated save
    alert('Profile updated successfully');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const exportProfile = () => {
    const dataStr = JSON.stringify({ profile, preferences, security }, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'profile-export.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    alert('Profile data exported successfully');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Account & Profile</h1>
          </div>
          <p className="text-gray-600">
            Manage your personal information, avatar, and account preferences
          </p>
        </div>
        <div className="flex gap-3">
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="avatar" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Avatar & Photo
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Information */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                Personal Information
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Update your personal details and contact information
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">Work Information</h3>
              <p className="text-sm text-gray-600 mb-6">
                Your role and department details
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profile.department}
                    onChange={(e) =>
                      setProfile({ ...profile, department: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={profile.role}
                    onChange={(e) =>
                      setProfile({ ...profile, role: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) =>
                      setProfile({ ...profile, location: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={profile.timezone}
                    onValueChange={(value) =>
                      setProfile({ ...profile, timezone: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Chicago">
                        Central Time
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        Eastern Time
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Member Since</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {profile.joinDate}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Avatar & Photo */}
        <TabsContent value="avatar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">Profile Photo</h3>
              <p className="text-sm text-gray-600 mb-6">
                Upload a new profile photo or avatar
              </p>
              <div className="flex flex-col items-center space-y-6">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={avatarPreview || undefined} />
                  <AvatarFallback>
                    {profile.firstName[0]}
                    {profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2 text-center">
                  <h4 className="font-medium">
                    {profile.firstName} {profile.lastName}
                  </h4>
                  <p className="text-sm text-gray-600">{profile.role}</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <div className="flex gap-3">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Photo
                  </Button>
                  {avatarPreview && (
                    <Button
                      variant="outline"
                      onClick={() => setAvatarPreview(null)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">Photo Guidelines</h3>
              <p className="text-sm text-gray-600 mb-6">
                Follow these guidelines for best results
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      Use a clear, front-facing photo
                    </p>
                    <p className="text-sm text-gray-600">
                      Your face should be clearly visible
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Professional appearance</p>
                    <p className="text-sm text-gray-600">
                      Business casual or professional attire recommended
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Minimum 400x400 pixels</p>
                    <p className="text-sm text-gray-600">
                      Higher resolution photos look better
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium">File size under 5MB</p>
                    <p className="text-sm text-gray-600">
                      JPEG or PNG format preferred
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">Notifications</h3>
              <p className="text-sm text-gray-600 mb-6">
                Choose how you want to receive updates
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        emailNotifications: checked,
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Browser push notifications
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        pushNotifications: checked,
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Text message alerts</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={preferences.smsNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        smsNotifications: checked,
                      })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">Display Settings</h3>
              <p className="text-sm text-gray-600 mb-6">
                Customize your viewing experience
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, language: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select
                    value={preferences.dateFormat}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, dateFormat: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="time-format">Time Format</Label>
                  <Select
                    value={preferences.timeFormat}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, timeFormat: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12-hour">12 Hour</SelectItem>
                      <SelectItem value="24-hour">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="first-day">First Day of Week</Label>
                  <Select
                    value={preferences.firstDayOfWeek}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, firstDayOfWeek: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunday">Sunday</SelectItem>
                      <SelectItem value="monday">Monday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">Appearance</h3>
              <p className="text-sm text-gray-600 mb-6">
                Customize the look and feel
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-gray-600">Use dark theme</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={preferences.darkMode}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, darkMode: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-view">Compact View</Label>
                    <p className="text-sm text-gray-600">
                      Reduce spacing between elements
                    </p>
                  </div>
                  <Switch
                    id="compact-view"
                    checked={preferences.compactView}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, compactView: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-refresh">Auto Refresh</Label>
                    <p className="text-sm text-gray-600">
                      Automatically update data
                    </p>
                  </div>
                  <Switch
                    id="auto-refresh"
                    checked={preferences.autoRefresh}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, autoRefresh: checked })
                    }
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                Password & Authentication
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Manage your password and security settings
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? 'text' : 'password'}
                      value="••••••••"
                      readOnly
                      className="mt-1 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Last Changed</p>
                    <p className="text-sm text-gray-600">
                      {security.lastPasswordChange}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {security.twoFactorEnabled && (
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Enabled
                      </Badge>
                    )}
                    <Switch
                      id="two-factor"
                      checked={security.twoFactorEnabled}
                      onCheckedChange={(checked) =>
                        setSecurity({ ...security, twoFactorEnabled: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">Active Sessions</h3>
              <p className="text-sm text-gray-600 mb-6">
                Manage devices with access to your account
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Active Sessions</p>
                  <Badge variant="outline">
                    {security.activeSessions} devices
                  </Badge>
                </div>

                <div className="space-y-3">
                  {security.loginHistory.map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-t first:border-t-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{session.device}</p>
                          <p className="text-sm text-gray-600">
                            {session.location} • {session.time}
                          </p>
                        </div>
                      </div>
                      {index === 0 ? (
                        <Badge variant="outline" className="text-green-600">
                          Current
                        </Badge>
                      ) : (
                        <Button variant="ghost" size="sm">
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    Sign Out All Other Sessions
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-red-200 bg-red-50">
              <h3 className="text-xl font-semibold mb-2 text-red-900">
                Danger Zone
              </h3>
              <p className="text-sm text-red-700 mb-6">
                Irreversible actions for your account
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-900">Delete Account</p>
                  <p className="text-sm text-red-700">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
