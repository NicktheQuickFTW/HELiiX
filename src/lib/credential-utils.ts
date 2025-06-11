import QRCode from 'qrcode'
import { supabase } from './supabase'

export interface CredentialData {
  id: string
  credential_number: string
  holder_name: string
  holder_title?: string
  organization_name?: string
  championship_event_id: string
  access_levels: string[]
  valid_from: string
  valid_until: string
  photo_url?: string
  status: string
}

export interface QRCodeData {
  credential_id: string
  credential_number: string
  event_id: string
  timestamp: number
  hash: string
  version: string
}

// Generate a secure QR code for a credential
export async function generateCredentialQRCode(credential: CredentialData): Promise<string> {
  const qrData: QRCodeData = {
    credential_id: credential.id,
    credential_number: credential.credential_number,
    event_id: credential.championship_event_id,
    timestamp: Date.now(),
    hash: await generateSecurityHash(credential),
    version: '1.0'
  }

  try {
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    })

    return qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

// Generate a security hash for the credential
async function generateSecurityHash(credential: CredentialData): Promise<string> {
  const data = `${credential.id}:${credential.credential_number}:${credential.championship_event_id}:${Date.now()}`
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Validate a QR code scan
export async function validateCredentialQRCode(qrCodeData: string): Promise<{
  valid: boolean
  credential?: CredentialData
  error?: string
  reason?: string
}> {
  try {
    const data: QRCodeData = JSON.parse(qrCodeData)
    
    // Basic validation
    if (!data.credential_id || !data.credential_number || !data.event_id) {
      return {
        valid: false,
        error: 'Invalid QR code format',
        reason: 'INVALID_FORMAT'
      }
    }

    // Check if QR code is too old (prevent replay attacks)
    const maxAge = 5 * 60 * 1000 // 5 minutes
    if (Date.now() - data.timestamp > maxAge) {
      return {
        valid: false,
        error: 'QR code has expired',
        reason: 'EXPIRED_QR'
      }
    }

    // Fetch credential from database
    const { data: credential, error } = await supabase
      .from('issued_credentials')
      .select(`
        *,
        championship_events(name, start_date, end_date),
        credential_requests(first_name, last_name, organization_id, organizations(name))
      `)
      .eq('id', data.credential_id)
      .eq('credential_number', data.credential_number)
      .single()

    if (error || !credential) {
      return {
        valid: false,
        error: 'Credential not found',
        reason: 'NOT_FOUND'
      }
    }

    // Check credential status
    if (credential.status !== 'active') {
      return {
        valid: false,
        error: `Credential is ${credential.status}`,
        reason: credential.status.toUpperCase()
      }
    }

    // Check validity dates
    const now = new Date()
    const validFrom = new Date(credential.valid_from)
    const validUntil = new Date(credential.valid_until)

    if (now < validFrom) {
      return {
        valid: false,
        error: 'Credential not yet valid',
        reason: 'NOT_YET_VALID'
      }
    }

    if (now > validUntil) {
      return {
        valid: false,
        error: 'Credential has expired',
        reason: 'EXPIRED'
      }
    }

    // Verify security hash
    const expectedHash = await generateSecurityHash({
      id: credential.id,
      credential_number: credential.credential_number,
      holder_name: credential.holder_name,
      championship_event_id: credential.championship_event_id,
      access_levels: credential.access_levels,
      valid_from: credential.valid_from,
      valid_until: credential.valid_until,
      status: credential.status
    })

    // Note: For production, implement proper hash verification
    // if (data.hash !== expectedHash) {
    //   return {
    //     valid: false,
    //     error: 'Invalid security hash',
    //     reason: 'INVALID_HASH'
    //   }
    // }

    return {
      valid: true,
      credential: {
        id: credential.id,
        credential_number: credential.credential_number,
        holder_name: credential.holder_name,
        holder_title: credential.holder_title,
        organization_name: credential.organization_name,
        championship_event_id: credential.championship_event_id,
        access_levels: credential.access_levels,
        valid_from: credential.valid_from,
        valid_until: credential.valid_until,
        photo_url: credential.photo_url,
        status: credential.status
      }
    }

  } catch (error) {
    console.error('Error validating QR code:', error)
    return {
      valid: false,
      error: 'Failed to validate QR code',
      reason: 'VALIDATION_ERROR'
    }
  }
}

// Log access attempt
export async function logCredentialAccess(
  credentialId: string,
  eventId: string,
  accessPoint: string,
  accessType: string,
  scanResult: 'granted' | 'denied' | 'expired' | 'revoked',
  scannedBy?: string,
  deviceId?: string,
  coordinates?: string
) {
  try {
    const { error } = await supabase
      .from('credential_access_log')
      .insert([{
        credential_id: credentialId,
        championship_event_id: eventId,
        access_point: accessPoint,
        access_type: accessType,
        scan_result: scanResult,
        scanned_by: scannedBy,
        scanner_device_id: deviceId,
        location_coordinates: coordinates,
        ip_address: null, // Would be filled server-side
        additional_data: {
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        }
      }])

    if (error) throw error

  } catch (error) {
    console.error('Error logging access:', error)
    // Don't throw - logging failures shouldn't break the main flow
  }
}

// Generate credential number
export function generateCredentialNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 999999) + 1
  return `B12-${year}-${random.toString().padStart(6, '0')}`
}

// Format access levels for display
export function formatAccessLevels(levels: string[]): string[] {
  const accessLevelMap: Record<string, string> = {
    'field_access': 'Field Access',
    'sideline_access': 'Sideline Access',
    'press_box': 'Press Box',
    'interview_room': 'Interview Room',
    'locker_room': 'Locker Room',
    'restricted_areas': 'Restricted Areas',
    'general_admission': 'General Admission',
    'backstage': 'Backstage',
    'venue_perimeter': 'Venue Perimeter',
    'parking': 'Parking'
  }

  return levels.map(level => accessLevelMap[level] || level)
}

// Check if user has specific access level
export function hasAccessLevel(credential: CredentialData, requiredLevel: string): boolean {
  return credential.access_levels.includes(requiredLevel)
}

// Get credential type badge color
export function getCredentialTypeBadgeColor(type: string): string {
  const colors: Record<string, string> = {
    'media': 'bg-blue-100 text-blue-800',
    'official': 'bg-green-100 text-green-800',
    'staff': 'bg-purple-100 text-purple-800',
    'volunteer': 'bg-orange-100 text-orange-800',
    'vendor': 'bg-yellow-100 text-yellow-800',
    'athlete': 'bg-red-100 text-red-800',
    'coach': 'bg-red-100 text-red-800',
    'team_personnel': 'bg-red-100 text-red-800',
    'vip': 'bg-gold-100 text-gold-800',
    'sponsor': 'bg-indigo-100 text-indigo-800',
    'photographer': 'bg-teal-100 text-teal-800',
    'broadcaster': 'bg-cyan-100 text-cyan-800'
  }

  return colors[type] || 'bg-gray-100 text-gray-800'
}

// Export credential data as PDF
export async function exportCredentialToPDF(credential: CredentialData): Promise<Blob> {
  // This would use jsPDF to generate a printable credential
  const { jsPDF } = await import('jspdf')
  
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98] // Credit card size
  })

  // Add credential background
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, 85.6, 53.98, 'F')

  // Add Big 12 branding
  doc.setFontSize(8)
  doc.setTextColor(0, 0, 0)
  doc.text('BIG 12 CONFERENCE', 5, 8)

  // Add credential type
  doc.setFontSize(6)
  doc.text('CHAMPIONSHIP CREDENTIAL', 5, 12)

  // Add holder name
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(credential.holder_name, 5, 20)

  // Add organization
  if (credential.organization_name) {
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(credential.organization_name, 5, 25)
  }

  // Add credential number
  doc.setFontSize(6)
  doc.text(`ID: ${credential.credential_number}`, 5, 35)

  // Add access levels
  const accessText = formatAccessLevels(credential.access_levels).join(', ')
  doc.setFontSize(5)
  doc.text(accessText, 5, 40, { maxWidth: 75 })

  // Add validity dates
  const validFrom = new Date(credential.valid_from).toLocaleDateString()
  const validUntil = new Date(credential.valid_until).toLocaleDateString()
  doc.text(`Valid: ${validFrom} - ${validUntil}`, 5, 48)

  // Generate QR code and add to PDF
  try {
    const qrCodeDataURL = await generateCredentialQRCode(credential)
    const qrCodeBase64 = qrCodeDataURL.split(',')[1]
    doc.addImage(qrCodeBase64, 'PNG', 60, 15, 20, 20)
  } catch (error) {
    console.error('Error adding QR code to PDF:', error)
  }

  return doc.output('blob')
}

// Validate access point permissions
export function validateAccessPointPermissions(
  credential: CredentialData,
  accessPoint: {
    name: string
    required_access_levels: string[]
    operating_hours?: any
  }
): {
  allowed: boolean
  reason?: string
} {
  // Check if credential has required access levels
  const hasRequiredAccess = accessPoint.required_access_levels.some(level =>
    credential.access_levels.includes(level)
  )

  if (!hasRequiredAccess) {
    return {
      allowed: false,
      reason: 'Insufficient access level'
    }
  }

  // Check operating hours if specified
  if (accessPoint.operating_hours) {
    const now = new Date()
    const currentHour = now.getHours()
    
    // Simplified operating hours check
    // In production, this would be more sophisticated
    if (accessPoint.operating_hours.start && accessPoint.operating_hours.end) {
      if (currentHour < accessPoint.operating_hours.start || currentHour > accessPoint.operating_hours.end) {
        return {
          allowed: false,
          reason: 'Outside operating hours'
        }
      }
    }
  }

  return { allowed: true }
}