'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

import {
  FileText,
  Upload,
  Save,
  Send,
  ArrowLeft,
  Camera,
  AlertTriangle,
  CheckCircle,
  User,
  Building,
  Shield,
  Heart,
  Car,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  Badge,
  Button,
  Card,
  Column,
  Heading,
  Input,
  Label,
  Option,
  Select,
  Switch,
  Text,
  Textarea,
} from '@once-ui-system/core';

interface ChampionshipEvent {
  id: string;
  name: string;
  sport: string;
  start_date: string;
  end_date: string;
  venue_name: string;
  city: string;
  state: string;
  credential_deadline: string;
  description: string;
}

interface Organization {
  id: string;
  name: string;
  type: string;
  verification_status: string;
}

const credentialTypes = [
  {
    value: 'media',
    label: 'Media',
    description: 'Press, journalists, photographers',
  },
  {
    value: 'official',
    label: 'Official',
    description: 'Referees, game officials',
  },
  { value: 'staff', label: 'Staff', description: 'Event staff, volunteers' },
  { value: 'vendor', label: 'Vendor', description: 'Concessions, merchandise' },
  { value: 'vip', label: 'VIP', description: 'Sponsors, dignitaries' },
  {
    value: 'photographer',
    label: 'Photographer',
    description: 'Professional photographers',
  },
  {
    value: 'broadcaster',
    label: 'Broadcaster',
    description: 'TV, radio, streaming',
  },
];

const accessLevels = [
  {
    value: 'field_access',
    label: 'Field Access',
    description: 'Access to playing field',
  },
  {
    value: 'sideline_access',
    label: 'Sideline Access',
    description: 'Access to team sidelines',
  },
  {
    value: 'press_box',
    label: 'Press Box',
    description: 'Media press box access',
  },
  {
    value: 'interview_room',
    label: 'Interview Room',
    description: 'Post-game interviews',
  },
  {
    value: 'locker_room',
    label: 'Locker Room',
    description: 'Team locker room access',
  },
  {
    value: 'restricted_areas',
    label: 'Restricted Areas',
    description: 'Staff-only areas',
  },
  {
    value: 'general_admission',
    label: 'General Admission',
    description: 'Public seating areas',
  },
  {
    value: 'backstage',
    label: 'Backstage',
    description: 'Behind-scenes areas',
  },
  {
    value: 'venue_perimeter',
    label: 'Venue Perimeter',
    description: 'Venue exterior areas',
  },
  { value: 'parking', label: 'Parking', description: 'Special parking access' },
];

export default function CredentialRequestPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [event, setEvent] = useState<ChampionshipEvent | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Personal Information
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    title: '',
    date_of_birth: '',

    // Organization
    organization_id: '',

    // Credential Details
    credential_type: '',
    requested_access_levels: [] as string[],
    purpose: '',
    duration_start: '',
    duration_end: '',

    // Emergency Contact
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',

    // Medical Information
    medical_conditions: '',
    allergies: '',

    // Special Requests
    special_accommodations: '',
    vehicle_info: {
      license_plate: '',
      make: '',
      model: '',
      color: '',
    },
    equipment_list: [] as string[],

    // Documents (URLs will be filled after upload)
    photo_url: '',
    identification_document_url: '',
    letter_of_assignment_url: '',
  });

  useEffect(() => {
    fetchData();
  }, [params.eventId, profile]);

  const fetchData = async () => {
    try {
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('championship_events')
        .select('*')
        .eq('id', params.eventId)
        .single();

      if (eventError) throw eventError;

      // Fetch verified organizations
      const { data: orgsData, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .eq('verification_status', 'verified')
        .order('name');

      if (orgsError) throw orgsError;

      setEvent(eventData);
      setOrganizations(orgsData || []);

      // Set default duration to event dates
      if (eventData) {
        setFormData((prev) => ({
          ...prev,
          duration_start: eventData.start_date + 'T00:00',
          duration_end: eventData.end_date + 'T23:59',
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load event data');
      router.push('/championships');
    } finally {
      setLoading(false);
    }
  };

  const handleAccessLevelToggle = (accessLevel: string) => {
    setFormData((prev) => ({
      ...prev,
      requested_access_levels: prev.requested_access_levels.includes(
        accessLevel
      )
        ? prev.requested_access_levels.filter((level) => level !== accessLevel)
        : [...prev.requested_access_levels, accessLevel],
    }));
  };

  const handleEquipmentChange = (equipment: string) => {
    setFormData((prev) => ({
      ...prev,
      equipment_list: prev.equipment_list.includes(equipment)
        ? prev.equipment_list.filter((item) => item !== equipment)
        : [...prev.equipment_list, equipment],
    }));
  };

  const saveAsDraft = async () => {
    if (!user || !event) return;

    setSaving(true);
    try {
      const requestData = {
        championship_event_id: event.id,
        requester_id: user.id,
        ...formData,
        vehicle_info: JSON.stringify(formData.vehicle_info),
        status: 'draft',
      };

      const { error } = await supabase
        .from('credential_requests')
        .insert([requestData]);

      if (error) throw error;

      toast.success('Request saved as draft');
      router.push('/championships?tab=my-requests');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const submitRequest = async () => {
    if (!user || !event) return;

    // Validation
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error('Please fill in all required personal information');
      return;
    }

    if (!formData.credential_type) {
      toast.error('Please select a credential type');
      return;
    }

    if (formData.requested_access_levels.length === 0) {
      toast.error('Please select at least one access level');
      return;
    }

    if (!formData.purpose) {
      toast.error('Please provide a purpose for your credential request');
      return;
    }

    setSubmitting(true);
    try {
      const requestData = {
        championship_event_id: event.id,
        requester_id: user.id,
        ...formData,
        vehicle_info: JSON.stringify(formData.vehicle_info),
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('credential_requests')
        .insert([requestData]);

      if (error) throw error;

      toast.success('Credential request submitted successfully!');
      router.push('/championships?tab=my-requests');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const isDeadlinePassed = () => {
    if (!event?.credential_deadline) return false;
    return new Date(event.credential_deadline) < new Date();
  };

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">
              Loading request form...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-6">
        <Card>
          <Column className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Event Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The requested championship event could not be found.
            </p>
            <Button asChild>
              <Link href="/championships">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Championships
              </Link>
            </Button>
          </Column>
        </Card>
      </div>
    );
  }

  if (isDeadlinePassed()) {
    return (
      <div className="container py-6">
        <Card>
          <Column className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Credential Deadline Passed
            </h3>
            <p className="text-muted-foreground mb-4">
              The deadline for requesting credentials for this event has passed.
            </p>
            <Button asChild>
              <Link href="/championships">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Championships
              </Link>
            </Button>
          </Column>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/championships">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Request Credential
          </h1>
          <p className="text-muted-foreground mt-2">
            {event.name} • {new Date(event.start_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Event Info Banner */}
      <Card>
        <Column gap="xs">
          <Heading variant="heading-sm">Event Information</Heading>
        </Column>
        <Column>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-medium">Event</p>
              <p className="text-sm text-muted-foreground">{event.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Venue</p>
              <p className="text-sm text-muted-foreground">
                {event.venue_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm text-muted-foreground">
                {event.city}, {event.state}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Credential Deadline</p>
              <p className="text-sm text-muted-foreground">
                {event.credential_deadline
                  ? new Date(event.credential_deadline).toLocaleDateString()
                  : 'TBD'}
              </p>
            </div>
          </div>
        </Column>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm" className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </Heading>
              <Text variant="body-sm" muted>
                Basic information about the credential holder
              </Text>
            </Column>
            <Column className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title/Position</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Sports Reporter, Team Manager"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_of_birth: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </Column>
          </Card>

          {/* Organization */}
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm" className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Organization
              </Heading>
              <Text variant="body-sm" muted>
                The organization you represent (if applicable)
              </Text>
            </Column>
            <Column>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Select
                  value={formData.organization_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, organization_id: value })
                  }
                >
                  <SelectItem value="">Independent/Individual</SelectItem>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name} ({org.type})
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </Column>
          </Card>

          {/* Credential Details */}
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm" className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Credential Details
              </Heading>
              <Text variant="body-sm" muted>
                Type of credential and access requirements
              </Text>
            </Column>
            <Column className="space-y-4">
              <div className="space-y-2">
                <Label>Credential Type *</Label>
                <div className="grid gap-2">
                  {credentialTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        formData.credential_type === type.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          credential_type: type.value,
                        })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="credentialType"
                          value={type.value}
                          selected={formData.credential_type === type.value}
                          readOnly
                        />
                        <div>
                          <p className="font-medium">{type.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Requested Access Levels *</Label>
                <p className="text-sm text-muted-foreground">
                  Select all areas you need access to (subject to approval)
                </p>
                <div className="grid gap-2 md:grid-cols-2">
                  {accessLevels.map((level) => (
                    <div
                      key={level.value}
                      className="flex items-start space-x-2"
                    >
                      <Switch
                        id={level.value}
                        selected={formData.requested_access_levels.includes(
                          level.value
                        )}
                        onToggle={() => handleAccessLevelToggle(level.value)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor={level.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {level.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {level.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose/Justification *</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  placeholder="Explain why you need this credential and how you plan to use it..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="durationStart">Access Start</Label>
                  <Input
                    id="durationStart"
                    type="datetime-local"
                    value={formData.duration_start}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration_start: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="durationEnd">Access End</Label>
                  <Input
                    id="durationEnd"
                    type="datetime-local"
                    value={formData.duration_end}
                    onChange={(e) =>
                      setFormData({ ...formData, duration_end: e.target.value })
                    }
                  />
                </div>
              </div>
            </Column>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm" className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Emergency Contact
              </Heading>
              <Text variant="body-sm" muted>
                Emergency contact information (required for field access)
              </Text>
            </Column>
            <Column className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Emergency Contact Name</Label>
                <Input
                  id="emergencyName"
                  value={formData.emergency_contact_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergency_contact_name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Phone Number</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergency_contact_phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyRelationship">Relationship</Label>
                  <Input
                    id="emergencyRelationship"
                    value={formData.emergency_contact_relationship}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergency_contact_relationship: e.target.value,
                      })
                    }
                    placeholder="e.g., Spouse, Parent, Friend"
                  />
                </div>
              </div>
            </Column>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm" className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Information
              </Heading>
              <Text variant="body-sm" muted>
                Vehicle details for parking access (if applicable)
              </Text>
            </Column>
            <Column className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    value={formData.vehicle_info.license_plate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehicle_info: {
                          ...formData.vehicle_info,
                          license_plate: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleMake">Make</Label>
                  <Input
                    id="vehicleMake"
                    value={formData.vehicle_info.make}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehicle_info: {
                          ...formData.vehicle_info,
                          make: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., Toyota"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Model</Label>
                  <Input
                    id="vehicleModel"
                    value={formData.vehicle_info.model}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehicle_info: {
                          ...formData.vehicle_info,
                          model: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., Camry"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleColor">Color</Label>
                  <Input
                    id="vehicleColor"
                    value={formData.vehicle_info.color}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehicle_info: {
                          ...formData.vehicle_info,
                          color: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., Blue"
                  />
                </div>
              </div>
            </Column>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm">Submit Request</Heading>
              <Text variant="body-sm" muted>
                Review and submit your credential request
              </Text>
            </Column>
            <Column className="space-y-4">
              <div className="space-y-2">
                <Button
                  onClick={submitRequest}
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={saveAsDraft}
                  className="w-full"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save as Draft
                    </>
                  )}
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• All fields marked with * are required</p>
                <p>• Requests are subject to approval</p>
                <p>• You will be notified via email about the status</p>
              </div>
            </Column>
          </Card>

          {/* Required Documents */}
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm" className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Required Documents
              </Heading>
              <Text variant="body-sm" muted>
                Upload required documentation
              </Text>
            </Column>
            <Column className="space-y-4">
              <div className="space-y-2">
                <Label>Headshot Photo</Label>
                <Button variant="outline" size="sm" className="w-full" disabled>
                  <Camera className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
                <p className="text-xs text-muted-foreground">
                  High-quality headshot for credential printing
                </p>
              </div>

              <div className="space-y-2">
                <Label>Government ID</Label>
                <Button variant="outline" size="sm" className="w-full" disabled>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload ID
                </Button>
                <p className="text-xs text-muted-foreground">
                  Driver's license or passport
                </p>
              </div>

              <div className="space-y-2">
                <Label>Letter of Assignment</Label>
                <Button variant="outline" size="sm" className="w-full" disabled>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Letter
                </Button>
                <p className="text-xs text-muted-foreground">
                  From your employer/organization
                </p>
              </div>
            </Column>
          </Card>

          {/* Review Checklist */}
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm">Review Checklist</Heading>
            </Column>
            <Column>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {formData.first_name &&
                  formData.last_name &&
                  formData.email ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  Personal information complete
                </div>
                <div className="flex items-center gap-2">
                  {formData.credential_type ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  Credential type selected
                </div>
                <div className="flex items-center gap-2">
                  {formData.requested_access_levels.length > 0 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  Access levels selected
                </div>
                <div className="flex items-center gap-2">
                  {formData.purpose ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  Purpose provided
                </div>
              </div>
            </Column>
          </Card>
        </div>
      </div>
    </div>
  );
}
