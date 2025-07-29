'use client';

import React, { useState, useRef } from 'react';
import {
  Card,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  Option,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Divider,
  Badge,
  Avatar,
  Column,
  Row,
  Grid,
  Text,
  Heading,
  Icon,
  Switch,
  toast,
} from '@once-ui-system/core';
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
    officeLocation: 'Big 12 Conference Headquarters',
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
    weekStart: 'sunday',
    defaultView: 'dashboard',
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    loginAlerts: true,
    sessionTimeout: '8 hours',
  });

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
        toast.success('Avatar uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = () => {
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = () => {
    if (security.newPassword !== security.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password changed successfully');
    setSecurity({
      ...security,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const exportProfile = () => {
    const profileData = {
      profile,
      preferences,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(profileData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'heliix-profile.json';
    link.click();
    toast.success('Profile data exported successfully');
  };

  return (
    <Column fillWidth gap="l" padding="l">
      <Row fillWidth justifyContent="space-between" alignItems="center">
        <Column>
          <Row alignItems="center" gap="s">
            <User className="h-8 w-8" />
            <Heading as="h1" variant="h-32">
              Account & Profile
            </Heading>
          </Row>
          <Text
            variant="body-default-s"
            onBackground="neutral-weak"
            marginTop="s"
          >
            Manage your personal information, avatar, and account preferences
          </Text>
        </Column>
        <Row gap="s">
          <Button variant="secondary" onClick={exportProfile}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleProfileUpdate}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </Row>
      </Row>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <Row alignItems="center" gap="xs">
              <User className="h-4 w-4" />
              <Text>Profile</Text>
            </Row>
          </TabsTrigger>
          <TabsTrigger value="avatar">
            <Row alignItems="center" gap="xs">
              <Camera className="h-4 w-4" />
              <Text>Avatar & Photo</Text>
            </Row>
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Row alignItems="center" gap="xs">
              <Calendar className="h-4 w-4" />
              <Text>Preferences</Text>
            </Row>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Row alignItems="center" gap="xs">
              <Shield className="h-4 w-4" />
              <Text>Security</Text>
            </Row>
          </TabsTrigger>
        </TabsList>

        {/* Profile Information */}
        <TabsContent value="profile">
          <Grid columns="1fr 1fr" gap="l">
            <Card>
              <Column gap="m" padding="l">
                <Column gap="xs">
                  <Heading as="h3" variant="h-22">
                    Personal Information
                  </Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Update your personal details and contact information
                  </Text>
                </Column>
                <Column gap="m">
                  <Grid columns="1fr 1fr" gap="m">
                    <Column gap="xs">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) =>
                          setProfile({ ...profile, firstName: e.target.value })
                        }
                      />
                    </Column>
                    <Column gap="xs">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) =>
                          setProfile({ ...profile, lastName: e.target.value })
                        }
                      />
                    </Column>
                  </Grid>

                  <Column gap="xs">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </Column>

                  <Column gap="xs">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                    />
                  </Column>

                  <Column gap="xs">
                    <Label htmlFor="hometown">Hometown</Label>
                    <Input
                      id="hometown"
                      value={profile.hometown}
                      onChange={(e) =>
                        setProfile({ ...profile, hometown: e.target.value })
                      }
                    />
                  </Column>
                </Column>
              </Column>
            </Card>

            <Card>
              <Column gap="m" padding="l">
                <Column gap="xs">
                  <Heading as="h3" variant="h-22">
                    Professional Details
                  </Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Your role and organizational information
                  </Text>
                </Column>
                <Column gap="m">
                  <Column gap="xs">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={profile.title}
                      onChange={(e) =>
                        setProfile({ ...profile, title: e.target.value })
                      }
                    />
                  </Column>

                  <Column gap="xs">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={profile.department}
                      onChange={(e) =>
                        setProfile({ ...profile, department: e.target.value })
                      }
                    />
                  </Column>

                  <Column gap="xs">
                    <Label htmlFor="supervisor">Supervisor</Label>
                    <Input
                      id="supervisor"
                      value={profile.supervisor}
                      onChange={(e) =>
                        setProfile({ ...profile, supervisor: e.target.value })
                      }
                    />
                  </Column>

                  <Column gap="xs">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={profile.startDate}
                      onChange={(e) =>
                        setProfile({ ...profile, startDate: e.target.value })
                      }
                    />
                  </Column>

                  <Column gap="xs">
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={profile.birthDate}
                      onChange={(e) =>
                        setProfile({ ...profile, birthDate: e.target.value })
                      }
                    />
                  </Column>
                </Column>
              </Column>
            </Card>
          </Grid>

          <Card>
            <Column gap="m" padding="l">
              <Column gap="xs">
                <Heading as="h3" variant="h-22">
                  Professional Bio
                </Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  A brief description of your role and responsibilities
                </Text>
              </Column>
              <Textarea
                placeholder="Enter your professional bio..."
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                rows={4}
              />
            </Column>
          </Card>
        </TabsContent>

        {/* Avatar & Photo */}
        <TabsContent value="avatar">
          <Grid columns="1fr 1fr" gap="l">
            <Card>
              <Column gap="m" padding="l">
                <Column gap="xs">
                  <Heading as="h3" variant="h-22">
                    Profile Photo
                  </Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Upload and manage your profile picture and avatar
                  </Text>
                </Column>
                <Column gap="l" alignItems="center">
                  <Avatar
                    src={avatarPreview || undefined}
                    size="xl"
                    initials={`${profile.firstName[0]}${profile.lastName[0]}`}
                  />

                  <Column alignItems="center" gap="xs">
                    <Heading as="h4" variant="h-18">
                      {profile.firstName} {profile.lastName}
                    </Heading>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      {profile.title}
                    </Text>
                  </Column>
                </Column>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />

                <Column gap="s">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    fillWidth
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Photo
                  </Button>

                  <Button variant="secondary" fillWidth>
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>

                  {avatarPreview && (
                    <Button
                      variant="secondary"
                      fillWidth
                      onClick={() => {
                        setAvatarPreview(null);
                        toast.success('Avatar removed');
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Photo
                    </Button>
                  )}
                </Column>

                <Column gap="xs">
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    • Maximum file size: 5MB
                  </Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    • Supported formats: JPG, PNG, GIF
                  </Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    • Recommended: Square image, 400x400px
                  </Text>
                </Column>
              </Column>
            </Card>

            <Card>
              <Column gap="m" padding="l">
                <Column gap="xs">
                  <Heading as="h3" variant="h-22">
                    Display Settings
                  </Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Control how your profile appears to others
                  </Text>
                </Column>
                <Column gap="m">
                  <Row justifyContent="space-between" alignItems="flex-start">
                    <Column>
                      <Label>Show photo in directory</Label>
                      <Text
                        variant="body-default-s"
                        onBackground="neutral-weak"
                      >
                        Display your photo in the staff directory
                      </Text>
                    </Column>
                    <Switch defaultChecked />
                  </Row>

                  <Row justifyContent="space-between" alignItems="flex-start">
                    <Column>
                      <Label>Show in team listings</Label>
                      <Text
                        variant="body-default-s"
                        onBackground="neutral-weak"
                      >
                        Include your photo in team and project views
                      </Text>
                    </Column>
                    <Switch defaultChecked />
                  </Row>

                  <Row justifyContent="space-between" alignItems="flex-start">
                    <Column>
                      <Label>Public profile</Label>
                      <Text
                        variant="body-default-s"
                        onBackground="neutral-weak"
                      >
                        Allow external contacts to see your profile
                      </Text>
                    </Column>
                    <Switch />
                  </Row>
                </Column>

                <Divider />

                <Column gap="xs">
                  <Label>Profile visibility</Label>
                  <Select defaultValue="internal">
                    <Option value="public">Public - Everyone can see</Option>
                    <Option value="internal">
                      Internal - Big 12 staff only
                    </Option>
                    <Option value="team">Team - My department only</Option>
                    <Option value="private">Private - Only me</Option>
                  </Select>
                </Column>
              </Column>
            </Card>
          </Grid>

          <Card>
            <Column gap="m" padding="l">
              <Column gap="xs">
                <Heading as="h3" variant="h-22">
                  Professional Headshot Gallery
                </Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Manage multiple professional photos for different uses
                </Text>
              </Column>
              <Grid columns="repeat(4, 1fr)" gap="m">
                <Card
                  variant="secondary"
                  style={{
                    border: '2px dashed var(--neutral-border)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onHover={{ borderColor: 'var(--neutral-border-strong)' }}
                >
                  <Column
                    fillWidth
                    alignItems="center"
                    justifyContent="center"
                    padding="m"
                    minHeight={96}
                  >
                    <Upload className="h-6 w-6 text-gray-400 mb-2" />
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Upload New
                    </Text>
                  </Column>
                </Card>

                <Card style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src="/headshots/nick-professional.jpg"
                    alt="Professional headshot"
                    className="w-full h-24 object-cover"
                  />
                  <Row
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.5)',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                    }}
                    className="hover:opacity-100"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button size="s" variant="secondary">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </Row>
                  <Badge
                    variant="secondary"
                    style={{ position: 'absolute', top: 4, right: 4 }}
                  >
                    Primary
                  </Badge>
                </Card>

                <Card style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src="/headshots/nick-casual.jpg"
                    alt="Casual headshot"
                    className="w-full h-24 object-cover"
                  />
                  <Row
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.5)',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                    }}
                    className="hover:opacity-100"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button size="s" variant="secondary">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </Row>
                </Card>
              </Grid>
            </Column>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Grid columns="1fr 1fr" gap="l">
            <Card>
              <Column gap="m" padding="l">
                <Column gap="xs">
                  <Heading as="h3" variant="h-22">
                    Display Preferences
                  </Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Customize how information is displayed
                  </Text>
                </Column>
                <Column gap="m">
                  <Column gap="xs">
                    <Label>Language</Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, language: value })
                      }
                    >
                      <Option value="en">English (US)</Option>
                      <Option value="es">Español</Option>
                      <Option value="fr">Français</Option>
                    </Select>
                  </Column>

                  <Column gap="xs">
                    <Label>Date Format</Label>
                    <Select
                      value={preferences.dateFormat}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, dateFormat: value })
                      }
                    >
                      <Option value="MM/dd/yyyy">MM/DD/YYYY</Option>
                      <Option value="dd/MM/yyyy">DD/MM/YYYY</Option>
                      <Option value="yyyy-MM-dd">YYYY-MM-DD</Option>
                    </Select>
                  </Column>

                  <Column gap="xs">
                    <Label>Time Format</Label>
                    <Select
                      value={preferences.timeFormat}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, timeFormat: value })
                      }
                    >
                      <Option value="12h">12 Hour (AM/PM)</Option>
                      <Option value="24h">24 Hour</Option>
                    </Select>
                  </Column>

                  <Column gap="xs">
                    <Label>Week Starts On</Label>
                    <Select
                      value={preferences.weekStart}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, weekStart: value })
                      }
                    >
                      <Option value="sunday">Sunday</Option>
                      <Option value="monday">Monday</Option>
                    </Select>
                  </Column>
                </Column>
              </Column>
            </Card>

            <Card>
              <Column gap="m" padding="l">
                <Column gap="xs">
                  <Heading as="h3" variant="h-22">
                    Application Preferences
                  </Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Default views and navigation settings
                  </Text>
                </Column>
                <Column gap="m">
                  <Column gap="xs">
                    <Label>Default Landing Page</Label>
                    <Select
                      value={preferences.defaultView}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, defaultView: value })
                      }
                    >
                      <Option value="dashboard">Dashboard</Option>
                      <Option value="calendar">Calendar View</Option>
                      <Option value="operations">Operations Center</Option>
                      <Option value="awards">Awards Management</Option>
                    </Select>
                  </Column>

                  <Column gap="xs">
                    <Label>Timezone</Label>
                    <Select
                      value={profile.timezone}
                      onValueChange={(value) =>
                        setProfile({ ...profile, timezone: value })
                      }
                    >
                      <Option value="America/Chicago">Central Time</Option>
                      <Option value="America/New_York">Eastern Time</Option>
                      <Option value="America/Denver">Mountain Time</Option>
                      <Option value="America/Los_Angeles">Pacific Time</Option>
                    </Select>
                  </Column>
                </Column>
              </Column>
            </Card>
          </Grid>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Grid columns="1fr 1fr" gap="l">
            <Card>
              <Column gap="m" padding="l">
                <Column gap="xs">
                  <Heading as="h3" variant="h-22">
                    Change Password
                  </Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Update your account password
                  </Text>
                </Column>
                <Column gap="m">
                  <Column gap="xs">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Row style={{ position: 'relative' }}>
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={security.currentPassword}
                        onChange={(e) =>
                          setSecurity({
                            ...security,
                            currentPassword: e.target.value,
                          })
                        }
                        fillWidth
                      />
                      <Button
                        variant="ghost"
                        size="s"
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          padding: '0.5rem',
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </Row>
                  </Column>

                  <Column gap="xs">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={security.newPassword}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </Column>

                  <Column gap="xs">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={security.confirmPassword}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </Column>

                  <Button onClick={handlePasswordChange} fillWidth>
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </Column>
              </Column>
            </Card>

            <Card>
              <Column gap="m" padding="l">
                <Column gap="xs">
                  <Heading as="h3" variant="h-22">
                    Account Status
                  </Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Current account security and verification status
                  </Text>
                </Column>
                <Column gap="m">
                  <Column gap="m">
                    <Row alignItems="center" gap="m">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <Column>
                        <Text variant="body-default-m" weight="medium">
                          Email Verified
                        </Text>
                        <Text
                          variant="body-default-s"
                          onBackground="neutral-weak"
                        >
                          nick.williams@big12sports.com
                        </Text>
                      </Column>
                    </Row>

                    <Row alignItems="center" gap="m">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <Column>
                        <Text variant="body-default-m" weight="medium">
                          Phone Verified
                        </Text>
                        <Text
                          variant="body-default-s"
                          onBackground="neutral-weak"
                        >
                          +1 (512) 555-0123
                        </Text>
                      </Column>
                    </Row>

                    <Row alignItems="center" gap="m">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      <Column>
                        <Text variant="body-default-m" weight="medium">
                          Two-Factor Authentication
                        </Text>
                        <Text
                          variant="body-default-s"
                          onBackground="neutral-weak"
                        >
                          Not enabled
                        </Text>
                      </Column>
                    </Row>
                  </Column>

                  <Divider />

                  <Column gap="xs">
                    <Row justifyContent="space-between">
                      <Text variant="body-default-s">
                        Account Security Score
                      </Text>
                      <Text variant="body-default-s" weight="medium">
                        75/100
                      </Text>
                    </Row>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Enable 2FA to improve your security score
                    </Text>
                  </Column>
                </Column>
              </Column>
            </Card>
          </Grid>
        </TabsContent>
      </Tabs>
    </Column>
  );
}
