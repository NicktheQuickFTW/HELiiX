'use client'

import { useState, useEffect } from 'react'
import { Card, Badge, Button, Skeleton } from "@once-ui-system/core"
import { ContactCard } from "@/components/business/contact-card"
import { 
  Users, 
  ExternalLink, 
  RefreshCw,
  ChevronRight,
  Search,
  Building2
} from "lucide-react"
import Link from "next/link"
import { NOTION_CONFIG } from '@/lib/notion'

interface Contact {
  id: string
  properties: Record<string, any>
  created_time: string
  last_edited_time: string
  url: string
}

interface ContactsWidgetProps {
  title?: string
  description?: string
  maxContacts?: number
  showHeader?: boolean
  variant?: 'grid' | 'list' | 'compact'
  filterByOrg?: string // Filter by specific organization
}

export function ContactsWidget({ 
  title = "Conference Contacts",
  description = "Key personnel and staff directory",
  maxContacts = 6,
  showHeader = true,
  variant = 'compact',
  filterByOrg
}: ContactsWidgetProps) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContacts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/notion/database?page_size=${maxContacts * 2}`) // Fetch more for filtering
      const result = await response.json()
      
      if (result.success) {
        let filteredContacts = result.data.entries
        
        // Filter by organization if specified
        if (filterByOrg) {
          filteredContacts = filteredContacts.filter((contact: Contact) => {
            const orgFields = ['Organization', 'School', 'Company', 'Institution', 'Department']
            return orgFields.some(field => {
              const value = contact.properties[field]
              return value && String(value).toLowerCase().includes(filterByOrg.toLowerCase())
            })
          })
        }
        
        setContacts(filteredContacts.slice(0, maxContacts))
      } else {
        setError(result.error || 'Failed to fetch contacts')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching contacts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [maxContacts, filterByOrg])

  // Helper to get contact name
  const getContactName = (contact: Contact): string => {
    const nameFields = ['Name', 'Full Name', 'Contact Name', 'Title']
    for (const field of nameFields) {
      if (contact.properties[field]) {
        const value = contact.properties[field]
        return Array.isArray(value) ? value.join(', ') : String(value || '')
      }
    }
    return 'Unnamed Contact'
  }

  // Helper to get organization
  const getContactOrg = (contact: Contact): string => {
    const orgFields = ['Organization', 'School', 'Company', 'Institution', 'Department']
    for (const field of orgFields) {
      if (contact.properties[field]) {
        const value = contact.properties[field]
        return Array.isArray(value) ? value.join(', ') : String(value || '')
      }
    }
    return 'No Organization'
  }

  if (variant === 'grid') {
    return (
      <Card padding="m" border="neutral-medium" background="surface">
        {showHeader && (
          <div className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-accent" />
                <span className="text-lg font-semibold">{title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="s" onClick={fetchContacts} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="secondary" size="s" asChild>
                  <Link href="/contacts">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <p className="text-sm text-neutral-weak">{description}</p>
          </div>
        )}
        <div>
          <div className="grid gap-3 md:grid-cols-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton width="75%" height="1rem" />
                  <Skeleton width="50%" height="0.75rem" />
                </div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-4 text-destructive text-sm">{error}</div>
            ) : contacts.length === 0 ? (
              <div className="col-span-full text-center py-4 text-muted-foreground text-sm">No contacts found</div>
            ) : (
              contacts.map((contact) => (
                <ContactCard 
                  key={contact.id} 
                  contact={contact} 
                  variant="compact"
                />
              ))
            )}
          </div>
          {contacts.length > 0 && (
            <div className="pt-4">
              <Button variant="secondary" size="s" className="w-full" asChild>
                <Link href="/contacts">
                  View All Contacts <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </Card>
    )
  }

  // Compact or list variants
  return (
    <Card padding="m" border="neutral-medium" background="surface">
      {showHeader && (
        <div className={variant === 'compact' ? 'pb-3' : 'pb-4'}>
          <div className="flex items-center justify-between text-lg">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-accent" />
              <span className="font-semibold">{title}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Badge variant="secondary">{contacts.length}</Badge>
              <Button variant="tertiary" size="s" asChild>
                <Link href="/contacts">
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
          {variant !== 'compact' && <p className="text-sm text-neutral-weak">{description}</p>}
        </div>
      )}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: Math.min(maxContacts, 3) }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-2">
              <Skeleton width="2rem" height="2rem" className="rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton width="67%" height="0.75rem" />
                <Skeleton width="50%" height="0.5rem" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="text-center py-4 text-destructive text-sm">{error}</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            {filterByOrg ? `No contacts found for ${filterByOrg}` : 'No contacts found'}
          </div>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="flex items-center space-x-3 p-2 rounded hover:bg-muted/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-semibold">
                {getContactName(contact).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{getContactName(contact)}</div>
                <div className="text-xs text-muted-foreground truncate">{getContactOrg(contact)}</div>
              </div>
              <Button variant="tertiary" size="s" asChild>
                <a href={contact.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          ))
        )}
        
        {contacts.length > 0 && (
          <div className="pt-2">
            <Button variant="secondary" size="s" className="w-full" asChild>
              <Link href="/contacts">
                View All <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}