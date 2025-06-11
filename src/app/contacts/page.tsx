'use client'

import { useState, useEffect } from 'react'
import { 
  Column, 
  Row, 
  Grid, 
  Card, 
  Button, 
  Heading, 
  Text,
  Background, 
  Icon, 
  Badge, 
  Option,
  Dropdown
} from "@once-ui-system/core"
import { NotionWidget } from "@/components/business/NotionWidget"
import { ContactCard } from "@/components/business/ContactCard"
import { ContactsAnalyticsChart } from "@/components/charts/ContactsAnalyticsChart"
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  Building2, 
  ExternalLink, 
  RefreshCw,
  UserPlus,
  Download,
  Filter,
  Grid as GridIcon,
  List,
  Database,
  Globe,
  MapPin,
  Calendar,
  Award,
  Settings
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

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'embedded'>('grid')

  // Fetch contacts from Notion database
  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notion/database?page_size=100')
      const result = await response.json()
      
      if (result.success) {
        setContacts(result.data.entries)
      } else {
        console.error('Failed to fetch contacts:', result.error)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => {
    const searchableText = Object.values(contact.properties)
      .map(prop => String(prop || ''))
      .join(' ')
      .toLowerCase()
    return searchableText.includes(searchTerm.toLowerCase())
  })

  // Helper to render contact property values
  const renderContactProperty = (value: any): string => {
    if (value === null || value === undefined) return '-'
    if (Array.isArray(value)) return value.join(', ')
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  // Get contact name (first property or fallback)
  const getContactName = (contact: Contact): string => {
    const properties = contact.properties
    const nameFields = ['Name', 'Full Name', 'Contact Name', 'Title']
    
    for (const field of nameFields) {
      if (properties[field]) {
        return renderContactProperty(properties[field])
      }
    }
    
    // Fallback to first property
    const firstProperty = Object.values(properties)[0]
    return firstProperty ? renderContactProperty(firstProperty) : 'Unnamed Contact'
  }

  // Get contact organization
  const getContactOrg = (contact: Contact): string => {
    const properties = contact.properties
    const orgFields = ['Organization', 'School', 'Company', 'Institution', 'Department']
    
    for (const field of orgFields) {
      if (properties[field]) {
        return renderContactProperty(properties[field])
      }
    }
    return 'No Organization'
  }

  // Get contact email
  const getContactEmail = (contact: Contact): string => {
    const properties = contact.properties
    const emailFields = ['Email', 'Email Address', 'Contact Email']
    
    for (const field of emailFields) {
      if (properties[field]) {
        return renderContactProperty(properties[field])
      }
    }
    return ''
  }

  // Get contact phone
  const getContactPhone = (contact: Contact): string => {
    const properties = contact.properties
    const phoneFields = ['Phone', 'Phone Number', 'Mobile', 'Contact Phone']
    
    for (const field of phoneFields) {
      if (properties[field]) {
        return renderContactProperty(properties[field])
      }
    }
    return ''
  }

  return (
    <Background background="page" fillWidth>
      <Column gap="xl" paddingX="xl" paddingY="l">
        {/* Header */}
        <Column gap="m">
          <Row gap="m" style={{ alignItems: "center" }}>
            <Column 
              background="accent" 
              radius="l"
              style={{
                width: "64px",
                height: "64px", 
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.5rem"
              }}
            >
              <Icon name={Users} size="xl" />
            </Column>
            <Column gap="xs">
              <Heading variant="display-strong-xl">Big 12 Conference Contacts</Heading>
              <Text variant="body-default-m" onBackground="neutral-weak">
                Comprehensive directory of conference staff, member school contacts, and key personnel.
              </Text>
            </Column>
          </Row>
          
          <Row style={{ alignItems: "center" }} gap="s">
            <Badge variant="neutral">Live Data</Badge>
            <Badge variant="neutral">{filteredContacts.length} Contacts</Badge>
            <Badge variant="accent">Notion Powered</Badge>
          </Row>
        </Column>

        {/* Quick Stats */}
        <Grid columns={4} gap="m">
          <Card>
            <Row style={{ alignItems: "center", justifyContent: "space-between" }} paddingBottom="xs">
              <Text variant="label-default-s">Total Contacts</Text>
              <Icon name={Users} size="s" onBackground="neutral-weak" />
            </Row>
            <Column gap="xs" paddingTop="xs">
              <Text variant="display-strong-xl">{contacts.length}</Text>
              <Text variant="label-default-xs" onBackground="neutral-weak">
                Directory entries
              </Text>
            </Column>
          </Card>
          <Card>
            <Row style={{ alignItems: "center", justifyContent: "space-between" }} paddingBottom="xs">
              <Text variant="label-default-s">Search Results</Text>
              <Icon name={Search} size="s" onBackground="neutral-weak" />
            </Row>
            <Column gap="xs" paddingTop="xs">
              <Text variant="display-strong-xl">{filteredContacts.length}</Text>
              <Text variant="label-default-xs" onBackground="neutral-weak">
                Matching entries
              </Text>
            </Column>
          </Card>
          <Card>
            <Row style={{ alignItems: "center", justifyContent: "space-between" }} paddingBottom="xs">
              <Text variant="label-default-s">Last Updated</Text>
              <Icon name={Calendar} size="s" onBackground="neutral-weak" />
            </Row>
            <Column gap="xs" paddingTop="xs">
              <Text variant="display-strong-xl">
                {contacts.length > 0 ? new Date(Math.max(...contacts.map(c => new Date(c.last_edited_time).getTime()))).toLocaleDateString() : '-'}
              </Text>
              <Text variant="label-default-xs" onBackground="neutral-weak">
                Most recent edit
              </Text>
            </Column>
          </Card>
          <Card>
            <Row style={{ alignItems: "center", justifyContent: "space-between" }} paddingBottom="xs">
              <Text variant="label-default-s">Quick Actions</Text>
              <Icon name={Settings} size="s" onBackground="neutral-weak" />
            </Row>
            <Column gap="xs" paddingTop="xs">
              <Row gap="xs">
                <Button 
                  variant="secondary" 
                  size="s"
                  href={NOTION_CONFIG.PUBLIC_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name={ExternalLink} size="xs" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="s"
                  onClick={fetchContacts} 
                  disabled={loading}
                >
                  <Icon name={RefreshCw} size="xs" className={loading ? 'animate-spin' : ''} />
                </Button>
              </Row>
            </Column>
          </Card>
        </Grid>

        {/* Search and Controls */}
        <Card>
          <Row style={{ alignItems: "center", justifyContent: "space-between" }} paddingBottom="s">
            <Row style={{ alignItems: "center" }} gap="s">
              <Icon name={Search} size="m" />
              <Heading variant="heading-strong-m">Search & Filter</Heading>
            </Row>
            <Row gap="s">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                size="s"
                onClick={() => setViewMode('grid')}
              >
                <Icon name={GridIcon} size="s" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'secondary'}
                size="s"
                onClick={() => setViewMode('list')}
              >
                <Icon name={List} size="s" />
              </Button>
              <Button
                variant={viewMode === 'embedded' ? 'primary' : 'secondary'}
                size="s"
                onClick={() => setViewMode('embedded')}
              >
                <Icon name={Database} size="s" />
              </Button>
            </Row>
          </Row>
          <Text variant="body-default-s" onBackground="neutral-weak" paddingBottom="m">
            Search by name, organization, email, or any other contact information
          </Text>
          <Row gap="m" style={{ alignItems: "center" }}>
            <div className="relative flex-1">
              <Icon 
                name={Search} 
                size="s" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <Button variant="secondary" size="s">
              <Icon name={Filter} size="s" />
              <Text variant="label-default-s">Filters</Text>
            </Button>
            <Button variant="secondary" size="s">
              <Icon name={Download} size="s" />
              <Text variant="label-default-s">Export</Text>
            </Button>
          </Row>
        </Card>

        {/* Main Content */}
        {viewMode === 'embedded' ? (
          <NotionWidget 
            title="Conference Contacts Database"
            description="Full interactive Notion database with editing capabilities"
            height={600}
            variant="embedded"
            showHeader={true}
          />
        ) : viewMode === 'grid' ? (
          <Grid columns={3} gap="m">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <Column gap="s">
                    <div className="h-4 bg-neutral-200 rounded animate-pulse" style={{width: '75%'}} />
                    <div className="h-3 bg-neutral-200 rounded animate-pulse" style={{width: '50%'}} />
                  </Column>
                  <div className="h-8 bg-neutral-200 rounded animate-pulse w-full mt-4" />
                </Card>
              ))
            ) : filteredContacts.length === 0 ? (
              <div className="col-span-full">
                <Column style={{ alignItems: "center" }} gap="m" paddingY="xl">
                  <Icon name={Users} size="xl" onBackground="neutral-weak" />
                  <Heading variant="heading-strong-l">No contacts found</Heading>
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    {searchTerm ? 'Try adjusting your search terms' : 'Add contacts to get started'}
                  </Text>
                  <Button 
                    variant="primary"
                    href={NOTION_CONFIG.PUBLIC_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name={UserPlus} size="s" />
                    <Text variant="label-default-m">Add Contacts in Notion</Text>
                  </Button>
                </Column>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <ContactCard 
                  key={contact.id} 
                  contact={contact} 
                  variant="detailed"
                />
              ))
            )}
          </Grid>
        ) : (
          // List view
          <Card>
            <Column gap="s" paddingBottom="s">
              <Heading variant="heading-strong-l">Contact Directory</Heading>
              <Text variant="body-default-s" onBackground="neutral-weak">
                Detailed list view of all conference contacts
              </Text>
            </Column>
            <Column gap="s">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Row key={i} style={{ alignItems: "center" }} gap="m" padding="m" style={{border: '1px solid #e5e7eb', borderRadius: '8px'}}>
                    <div className="h-10 w-10 bg-neutral-200 rounded-full animate-pulse" />
                    <Column gap="xs" flex="1">
                      <div className="h-4 bg-neutral-200 rounded animate-pulse" style={{width: '33%'}} />
                      <div className="h-3 bg-neutral-200 rounded animate-pulse" style={{width: '50%'}} />
                    </Column>
                    <div className="h-8 w-20 bg-neutral-200 rounded animate-pulse" />
                  </Row>
                ))
              ) : filteredContacts.length === 0 ? (
                <Column style={{ alignItems: "center" }} paddingY="l">
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    {searchTerm ? 'No contacts match your search' : 'No contacts found'}
                  </Text>
                </Column>
              ) : (
                filteredContacts.map((contact) => (
                  <ContactCard 
                    key={contact.id} 
                    contact={contact} 
                    variant="compact"
                  />
                ))
              )}
            </Column>
          </Card>
        )}

        {/* Analytics Section */}
        <ContactsAnalyticsChart />
      </Column>
    </Background>
  )
}