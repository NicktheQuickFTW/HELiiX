'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Download,
  Printer,
  QrCode,
  Calendar,
  MapPin,
  Shield,
  User,
  Building,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import { generateCredentialQRCode, exportCredentialToPDF, formatAccessLevels, CredentialData } from '@/lib/credential-utils'
import QRCodeDisplay from 'react-qr-code'

interface IssuedCredential extends CredentialData {
  championship_events: {
    name: string
    sport: string
    start_date: string
    end_date: string
    venue_name: string
    city: string
    state: string
  }
  credential_requests: {
    first_name: string
    last_name: string
    title: string
    organizations: {
      name: string
    } | null
  }
}

export default function CredentialDisplayPage() {
  const params = useParams()
  const { user } = useAuth()
  const [credential, setCredential] = useState<IssuedCredential | null>(null)
  const [qrCode, setQrCode] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [printing, setPrinting] = useState(false)
  const credentialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchCredential()
  }, [params.requestId, user])

  const fetchCredential = async () => {
    try {
      const { data, error } = await supabase
        .from('issued_credentials')
        .select(`
          *,
          championship_events(name, sport, start_date, end_date, venue_name, city, state),
          credential_requests!inner(
            requester_id,
            first_name,
            last_name,
            title,
            organizations(name)
          )
        `)
        .eq('credential_request_id', params.requestId)
        .single()

      if (error) throw error

      // Check if user owns this credential
      if (data.credential_requests.requester_id !== user?.id) {
        throw new Error('Access denied')
      }

      setCredential(data as IssuedCredential)
      
      // Generate QR code
      if (data.qr_code) {
        setQrCode(data.qr_code)
      } else {
        await generateQRCode(data)
      }

    } catch (error) {
      console.error('Error fetching credential:', error)
      toast.error('Failed to load credential')
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = async (credentialData: CredentialData) => {
    setGenerating(true)
    try {
      const qrCodeData = await generateCredentialQRCode(credentialData)
      setQrCode(qrCodeData)

      // Update database with QR code
      await supabase
        .from('issued_credentials')
        .update({ qr_code: qrCodeData })
        .eq('id', credentialData.id)

    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Failed to generate QR code')
    } finally {
      setGenerating(false)
    }
  }

  const handlePrint = async () => {
    if (!credential) return

    setPrinting(true)
    try {
      // Update print count
      await supabase
        .from('issued_credentials')
        .update({
          print_count: (credential.print_count || 0) + 1,
          last_printed_at: new Date().toISOString()
        })
        .eq('id', credential.id)

      // Print the credential
      window.print()

    } catch (error) {
      console.error('Error printing credential:', error)
      toast.error('Failed to print credential')
    } finally {
      setPrinting(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!credential) return

    try {
      const pdfBlob = await exportCredentialToPDF(credential)
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `big12-credential-${credential.credential_number}.pdf`
      link.click()
      URL.revokeObjectURL(url)

      toast.success('Credential downloaded successfully')

    } catch (error) {
      console.error('Error downloading PDF:', error)
      toast.error('Failed to download credential')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'suspended': return 'bg-yellow-100 text-yellow-800'
      case 'revoked': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isCredentialValid = () => {
    if (!credential) return false
    const now = new Date()
    const validFrom = new Date(credential.valid_from)
    const validUntil = new Date(credential.valid_until)
    return credential.status === 'active' && now >= validFrom && now <= validUntil
  }

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading credential...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!credential) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Credential Not Found</h3>
            <p className="text-muted-foreground">
              The requested credential could not be found or you don't have permission to view it.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Digital Credential
          </h1>
          <p className="text-muted-foreground mt-2">
            {credential.championship_events.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} disabled={printing}>
            {printing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Printer className="h-4 w-4 mr-2" />
            )}
            Print
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      <Card className={`border-l-4 ${isCredentialValid() ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            {isCredentialValid() ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            <span className={`font-medium ${isCredentialValid() ? 'text-green-800' : 'text-red-800'}`}>
              {isCredentialValid() ? 'Credential is valid and active' : 'Credential is not currently valid'}
            </span>
            <Badge className={getStatusColor(credential.status)}>
              {credential.status.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Digital Credential Display */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Digital Credential</CardTitle>
              <CardDescription>Present this credential for venue access</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Credential Card */}
              <div 
                ref={credentialRef}
                className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg p-6 space-y-4 print:bg-white print:text-black print:border-2 print:border-black"
                style={{ aspectRatio: '1.6/1', maxWidth: '400px' }}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">BIG 12 CONFERENCE</h3>
                    <p className="text-sm opacity-90">Championship Credential</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-75">ID: {credential.credential_number}</p>
                    <Badge className={`${getStatusColor(credential.status)} print:bg-gray-200 print:text-black`}>
                      {credential.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Holder Information */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-white">
                    <AvatarImage src={credential.photo_url} />
                    <AvatarFallback className="bg-white text-blue-800 font-bold">
                      {credential.credential_requests.first_name.charAt(0)}
                      {credential.credential_requests.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg">
                      {credential.credential_requests.first_name} {credential.credential_requests.last_name}
                    </h4>
                    {credential.credential_requests.title && (
                      <p className="text-sm opacity-90">{credential.credential_requests.title}</p>
                    )}
                    {credential.credential_requests.organizations?.name && (
                      <p className="text-sm opacity-75">{credential.credential_requests.organizations.name}</p>
                    )}
                  </div>
                </div>

                {/* Event Information */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="opacity-75">Event</p>
                    <p className="font-medium">{credential.championship_events.name}</p>
                  </div>
                  <div>
                    <p className="opacity-75">Venue</p>
                    <p className="font-medium">{credential.championship_events.venue_name}</p>
                  </div>
                </div>

                {/* Access Levels */}
                <div>
                  <p className="text-sm opacity-75 mb-1">Authorized Access</p>
                  <div className="flex flex-wrap gap-1">
                    {formatAccessLevels(credential.access_levels).map((level, index) => (
                      <span key={index} className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                        {level}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Validity */}
                <div className="flex justify-between text-xs opacity-75">
                  <span>Valid: {new Date(credential.valid_from).toLocaleDateString()}</span>
                  <span>Expires: {new Date(credential.valid_until).toLocaleDateString()}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="mt-6 text-center">
                <div className="inline-block p-4 bg-white rounded-lg shadow-md">
                  {qrCode ? (
                    <div>
                      <QRCodeDisplay value={qrCode} size={200} />
                      <p className="text-xs text-muted-foreground mt-2">
                        Scan for instant verification
                      </p>
                    </div>
                  ) : (
                    <div className="w-[200px] h-[200px] flex items-center justify-center">
                      {generating ? (
                        <div className="text-center">
                          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Generating...</p>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => generateQRCode(credential)}
                          disabled={generating}
                        >
                          <QrCode className="h-4 w-4 mr-2" />
                          Generate QR Code
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credential Details Sidebar */}
        <div className="space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Championship Event</p>
                <p className="text-sm text-muted-foreground">{credential.championship_events.name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Sport</p>
                <p className="text-sm text-muted-foreground">
                  {credential.championship_events.sport.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{credential.championship_events.venue_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {credential.championship_events.city}, {credential.championship_events.state}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Event Dates</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(credential.championship_events.start_date).toLocaleDateString()} - {' '}
                    {new Date(credential.championship_events.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credential Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Credential Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Credential Number</p>
                <p className="text-sm text-muted-foreground font-mono">{credential.credential_number}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Issued</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(credential.issued_at || credential.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Valid Period</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(credential.valid_from).toLocaleDateString()} - {' '}
                  {new Date(credential.valid_until).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Print Count</p>
                <p className="text-sm text-muted-foreground">
                  {credential.print_count || 0} times
                  {credential.last_printed_at && (
                    <span className="block">
                      Last: {new Date(credential.last_printed_at).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Access Levels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Access Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formatAccessLevels(credential.access_levels).map((level, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{level}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Usage Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Present this credential at venue entrances</p>
              <p>• Keep your photo ID ready for verification</p>
              <p>• QR code must be scannable (avoid covering)</p>
              <p>• Report lost or stolen credentials immediately</p>
              <p>• Credential is non-transferable</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:visible,
          .print\\:visible * {
            visibility: visible;
          }
          .container {
            max-width: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}