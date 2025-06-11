'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search,
  Filter,
  Users,
  Calendar,
  AlertTriangle,
  FileText,
  Download,
  User,
  Building
} from 'lucide-react'
import { toast } from 'sonner'

interface CredentialRequest {
  id: string
  championship_event_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  title: string
  credential_type: string
  requested_access_levels: string[]
  purpose: string
  status: string
  submitted_at: string
  reviewed_by: string | null
  reviewed_at: string | null
  review_notes: string | null
  championship_events: {
    name: string
    sport: string
    start_date: string
    venue_name: string
  }
  organizations: {
    name: string
    type: string
  } | null
  emergency_contact_name: string
  emergency_contact_phone: string
  medical_conditions: string
  allergies: string
  special_accommodations: string
  vehicle_info: any
}

interface ReviewAction {
  action: 'approve' | 'deny'
  notes: string
  accessLevels?: string[]
}

export default function CredentialReviewsPage() {
  const { user, hasPermission } = useAuth()
  const [requests, setRequests] = useState<CredentialRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<CredentialRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<CredentialRequest | null>(null)
  const [reviewAction, setReviewAction] = useState<ReviewAction>({
    action: 'approve',
    notes: '',
    accessLevels: []
  })
  const [processing, setProcessing] = useState(false)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [eventFilter, setEventFilter] = useState('all')

  const [stats, setStats] = useState({
    pending: 0,
    underReview: 0,
    approved: 0,
    denied: 0
  })

  useEffect(() => {
    if (hasPermission('championships', 'read')) {
      fetchRequests()
    }
  }, [user, hasPermission])

  useEffect(() => {
    applyFilters()
  }, [requests, searchTerm, statusFilter, typeFilter, eventFilter])

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('credential_requests')
        .select(`
          *,
          championship_events(name, sport, start_date, venue_name),
          organizations(name, type)
        `)
        .in('status', ['submitted', 'under_review'])
        .order('submitted_at', { ascending: true })

      if (error) throw error

      setRequests(data || [])

      // Calculate stats
      const pending = data?.filter(r => r.status === 'submitted').length || 0
      const underReview = data?.filter(r => r.status === 'under_review').length || 0
      
      // Get approved/denied counts from all requests
      const { data: allData, error: allError } = await supabase
        .from('credential_requests')
        .select('status')

      if (!allError && allData) {
        const approved = allData.filter(r => r.status === 'approved').length
        const denied = allData.filter(r => r.status === 'denied').length
        
        setStats({ pending, underReview, approved, denied })
      }

    } catch (error) {
      console.error('Error fetching requests:', error)
      toast.error('Failed to load credential requests')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...requests]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        `${request.first_name} ${request.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.championship_events.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.organizations?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(request => request.credential_type === typeFilter)
    }

    // Event filter
    if (eventFilter !== 'all') {
      filtered = filtered.filter(request => request.championship_event_id === eventFilter)
    }

    setFilteredRequests(filtered)
  }

  const handleReviewRequest = async () => {
    if (!selectedRequest || !user) return

    setProcessing(true)
    try {
      const updateData = {
        status: reviewAction.action === 'approve' ? 'approved' : 'denied',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewAction.notes,
        ...(reviewAction.action === 'deny' && { denial_reason: reviewAction.notes })
      }

      const { error: updateError } = await supabase
        .from('credential_requests')
        .update(updateData)
        .eq('id', selectedRequest.id)

      if (updateError) throw updateError

      // If approved, create the issued credential
      if (reviewAction.action === 'approve') {
        const credentialData = {
          credential_request_id: selectedRequest.id,
          championship_event_id: selectedRequest.championship_event_id,
          credential_number: await generateCredentialNumber(),
          qr_code: await generateQRCode(selectedRequest.id),
          access_levels: reviewAction.accessLevels || selectedRequest.requested_access_levels,
          valid_from: selectedRequest.championship_events.start_date + 'T00:00:00Z',
          valid_until: selectedRequest.championship_events.start_date + 'T23:59:59Z',
          holder_name: `${selectedRequest.first_name} ${selectedRequest.last_name}`,
          holder_title: selectedRequest.title,
          organization_name: selectedRequest.organizations?.name || 'Independent',
          issued_by: user.id,
          status: 'active'
        }

        const { error: credentialError } = await supabase
          .from('issued_credentials')
          .insert([credentialData])

        if (credentialError) throw credentialError
      }

      toast.success(`Credential request ${reviewAction.action}d successfully`)
      setSelectedRequest(null)
      setReviewAction({ action: 'approve', notes: '', accessLevels: [] })
      fetchRequests() // Refresh the list

    } catch (error) {
      console.error('Error processing review:', error)
      toast.error('Failed to process review')
    } finally {
      setProcessing(false)
    }
  }

  const generateCredentialNumber = async () => {
    // This would call the database function
    const { data, error } = await supabase.rpc('generate_credential_number')
    if (error) throw error
    return data || `B12-${new Date().getFullYear()}-${Math.random().toString().substr(2, 6)}`
  }

  const generateQRCode = async (requestId: string) => {
    // Generate QR code data
    const qrData = {
      id: requestId,
      timestamp: Date.now(),
      hash: btoa(requestId + Date.now())
    }
    return JSON.stringify(qrData)
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      'submitted': 'bg-blue-100 text-blue-800',
      'under_review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'denied': 'bg-red-100 text-red-800'
    }

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    )
  }

  const formatAccessLevels = (levels: string[]) => {
    return levels.map(level => 
      level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    ).join(', ')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!hasPermission('championships', 'read')) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              You don't have permission to access credential reviews.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading credential requests...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CheckCircle className="h-8 w-8" />
            Credential Reviews
          </h1>
          <p className="text-muted-foreground mt-2">
            Review and approve championship credential requests
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting initial review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.underReview}</div>
            <p className="text-xs text-muted-foreground">Currently being reviewed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Approved credentials</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.denied}</div>
            <p className="text-xs text-muted-foreground">Denied requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Name, email, event..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="official">Official</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="photographer">Photographer</SelectItem>
                  <SelectItem value="broadcaster">Broadcaster</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Event</Label>
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {/* Add event options dynamically */}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setTypeFilter('all')
                  setEventFilter('all')
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {request.first_name} {request.last_name}
                  </CardTitle>
                  <CardDescription>
                    {request.credential_type.replace('_', ' ')} • {request.championship_events.name}
                  </CardDescription>
                </div>
                {getStatusBadge(request.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">{request.email}</p>
                    <p className="text-muted-foreground">{request.phone || 'No phone'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">{request.organizations?.name || 'Independent'}</p>
                    <p className="text-muted-foreground">{request.title || 'No title'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">{formatDate(request.submitted_at)}</p>
                    <p className="text-muted-foreground">Submitted</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">{request.requested_access_levels.length} access levels</p>
                    <p className="text-muted-foreground">Requested</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Requested Access:</p>
                <p className="text-sm text-muted-foreground">
                  {formatAccessLevels(request.requested_access_levels)}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Purpose:</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {request.purpose}
                </p>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        Review Credential Request
                      </DialogTitle>
                      <DialogDescription>
                        {selectedRequest?.first_name} {selectedRequest?.last_name} • {selectedRequest?.championship_events.name}
                      </DialogDescription>
                    </DialogHeader>

                    {selectedRequest && (
                      <div className="space-y-6">
                        {/* Personal Information */}
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="font-semibold mb-2">Personal Information</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Name:</span> {selectedRequest.first_name} {selectedRequest.last_name}
                              </div>
                              <div>
                                <span className="font-medium">Email:</span> {selectedRequest.email}
                              </div>
                              <div>
                                <span className="font-medium">Phone:</span> {selectedRequest.phone || 'Not provided'}
                              </div>
                              <div>
                                <span className="font-medium">Title:</span> {selectedRequest.title || 'Not provided'}
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Organization</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Organization:</span> {selectedRequest.organizations?.name || 'Independent'}
                              </div>
                              <div>
                                <span className="font-medium">Type:</span> {selectedRequest.organizations?.type || 'Individual'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Emergency Contact */}
                        {selectedRequest.emergency_contact_name && (
                          <div>
                            <h4 className="font-semibold mb-2">Emergency Contact</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Name:</span> {selectedRequest.emergency_contact_name}
                              </div>
                              <div>
                                <span className="font-medium">Phone:</span> {selectedRequest.emergency_contact_phone}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Credential Details */}
                        <div>
                          <h4 className="font-semibold mb-2">Credential Details</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Type:</span> {selectedRequest.credential_type.replace('_', ' ')}
                            </div>
                            <div>
                              <span className="font-medium">Requested Access:</span> {formatAccessLevels(selectedRequest.requested_access_levels)}
                            </div>
                            <div>
                              <span className="font-medium">Purpose:</span>
                              <p className="mt-1 text-muted-foreground">{selectedRequest.purpose}</p>
                            </div>
                          </div>
                        </div>

                        {/* Review Action */}
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-4">Review Decision</h4>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Decision</Label>
                              <Select 
                                value={reviewAction.action} 
                                onValueChange={(value: 'approve' | 'deny') => 
                                  setReviewAction({...reviewAction, action: value})
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="approve">Approve</SelectItem>
                                  <SelectItem value="deny">Deny</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Review Notes</Label>
                              <Textarea
                                value={reviewAction.notes}
                                onChange={(e) => setReviewAction({...reviewAction, notes: e.target.value})}
                                placeholder={reviewAction.action === 'approve' ? 
                                  'Optional notes about the approval...' : 
                                  'Reason for denial (required)...'
                                }
                                required={reviewAction.action === 'deny'}
                              />
                            </div>

                            {reviewAction.action === 'approve' && (
                              <div className="space-y-2">
                                <Label>Approved Access Levels</Label>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Select which access levels to grant (defaults to requested levels)
                                </p>
                                {/* Access level checkboxes would go here */}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleReviewRequest}
                        disabled={processing || (reviewAction.action === 'deny' && !reviewAction.notes)}
                        className={reviewAction.action === 'approve' ? '' : 'bg-red-600 hover:bg-red-700'}
                      >
                        {processing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            {reviewAction.action === 'approve' ? (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-2" />
                            )}
                            {reviewAction.action === 'approve' ? 'Approve' : 'Deny'} Request
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={async () => {
                    // Mark as under review
                    try {
                      await supabase
                        .from('credential_requests')
                        .update({ 
                          status: 'under_review',
                          reviewed_by: user?.id,
                          reviewed_at: new Date().toISOString()
                        })
                        .eq('id', request.id)
                      
                      fetchRequests()
                      toast.success('Request marked as under review')
                    } catch (error) {
                      toast.error('Failed to update status')
                    }
                  }}
                  disabled={request.status === 'under_review'}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  {request.status === 'under_review' ? 'Under Review' : 'Start Review'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Requests Found</h3>
              <p className="text-muted-foreground">
                {requests.length === 0 
                  ? 'No credential requests are currently pending review.'
                  : 'No requests match your current filters.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}