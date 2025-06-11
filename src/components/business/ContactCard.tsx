'use client'

import { Card, Badge, Button } from "@once-ui-system/core"
import { 
  Phone, 
  Mail, 
  Building2, 
  ExternalLink,
  MapPin,
  Globe,
  User,
  Calendar,
  Award,
  ChevronRight
} from "lucide-react"

interface ContactCardProps {
  contact: {
    id: string
    properties: Record<string, any>
    created_time: string
    last_edited_time: string
    url: string
  }
  variant?: 'default' | 'compact' | 'detailed'
}

export function ContactCard({ contact, variant = 'default' }: ContactCardProps) {
  // Helper to render contact property values
  const renderProperty = (value: any): string => {
    if (value === null || value === undefined) return ''
    if (Array.isArray(value)) return value.join(', ')
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  // Extract common contact fields with multiple possible property names
  const getField = (fieldNames: string[]): string => {
    for (const field of fieldNames) {
      if (contact.properties[field]) {
        return renderProperty(contact.properties[field])
      }
    }
    return ''
  }

  const name = getField(['Name', 'Full Name', 'Contact Name', 'Title']) || 'Unnamed Contact'
  const organization = getField(['Organization', 'School', 'Company', 'Institution', 'Department']) || 'No Organization'
  const email = getField(['Email', 'Email Address', 'Contact Email'])
  const phone = getField(['Phone', 'Phone Number', 'Mobile', 'Contact Phone'])
  const title = getField(['Job Title', 'Position', 'Role', 'Title'])
  const location = getField(['Location', 'City', 'State', 'Address'])
  const website = getField(['Website', 'URL', 'Web'])

  // Get Big 12 school colors if applicable
  const getBadgeVariant = (org: string) => {
    const big12Schools = [
      'Arizona', 'Arizona State', 'Baylor', 'BYU', 'Cincinnati', 'Colorado',
      'Houston', 'Iowa State', 'Kansas', 'Kansas State', 'Oklahoma State',
      'TCU', 'Texas Tech', 'UCF', 'Utah', 'West Virginia'
    ]
    
    if (big12Schools.some(school => org.toLowerCase().includes(school.toLowerCase()))) {
      return 'default'
    }
    return 'secondary'
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-semibold">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-sm">{name}</div>
            <div className="text-xs text-muted-foreground">{organization}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {email && (
            <Button variant="ghost" size="sm" asChild>
              <a href={`mailto:${email}`}>
                <Mail className="h-3 w-3" />
              </a>
            </Button>
          )}
          <Button variant="ghost" size="sm" asChild>
            <a href={contact.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white text-lg font-semibold">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-lg">{name}</CardTitle>
                {title && (
                  <CardDescription className="text-sm font-medium text-foreground/80">
                    {title}
                  </CardDescription>
                )}
                <CardDescription className="flex items-center space-x-1 mt-1">
                  <Building2 className="h-3 w-3" />
                  <span>{organization}</span>
                </CardDescription>
              </div>
            </div>
            <Badge variant={getBadgeVariant(organization)}>
              {organization.includes('Big 12') ? 'Conference' : 'Member School'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {email && (
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a 
                href={`mailto:${email}`}
                className="text-accent hover:underline"
              >
                {email}
              </a>
            </div>
          )}
          {phone && (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a 
                href={`tel:${phone}`}
                className="text-accent hover:underline"
              >
                {phone}
              </a>
            </div>
          )}
          {location && (
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{location}</span>
            </div>
          )}
          {website && (
            <div className="flex items-center space-x-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a 
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {website}
              </a>
            </div>
          )}
          
          {/* Additional properties */}
          <div className="pt-2 space-y-1">
            {Object.entries(contact.properties)
              .filter(([key]) => !['Name', 'Full Name', 'Contact Name', 'Title', 'Job Title', 'Position', 'Role', 'Organization', 'School', 'Company', 'Institution', 'Department', 'Email', 'Email Address', 'Contact Email', 'Phone', 'Phone Number', 'Mobile', 'Contact Phone', 'Location', 'City', 'State', 'Address', 'Website', 'URL', 'Web'].includes(key))
              .slice(0, 3)
              .map(([key, value]) => (
                <div key={key} className="flex items-start space-x-2 text-xs">
                  <span className="font-medium text-muted-foreground min-w-[80px]">
                    {key}:
                  </span>
                  <span className="flex-1">{renderProperty(value)}</span>
                </div>
              ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Badge variant="outline" className="text-xs">
              {new Date(contact.created_time).toLocaleDateString()}
            </Badge>
            <Button variant="ghost" size="sm" asChild>
              <a href={contact.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
                <span className="sr-only">Open in Notion</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="flex items-center space-x-1">
          <Building2 className="h-3 w-3" />
          <span>{organization}</span>
        </CardDescription>
        {title && (
          <Badge variant="outline" className="text-xs w-fit">
            {title}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {email && (
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a 
              href={`mailto:${email}`}
              className="text-accent hover:underline"
            >
              {email}
            </a>
          </div>
        )}
        {phone && (
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a 
              href={`tel:${phone}`}
              className="text-accent hover:underline"
            >
              {phone}
            </a>
          </div>
        )}
        <div className="flex items-center justify-between pt-2">
          <Badge variant="outline" className="text-xs">
            {new Date(contact.created_time).toLocaleDateString()}
          </Badge>
          <Button variant="ghost" size="sm" asChild>
            <a href={contact.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}