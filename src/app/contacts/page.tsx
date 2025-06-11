'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { NotionWidget } from "@/components/notion-widget"
import { ContactCard } from "@/components/contact-card"
import { ContactsAnalyticsChart } from "@/components/charts/contacts-analytics-chart"
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
  Grid,
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
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center text-white text-2xl">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Big 12 Conference Contacts</h1>
            <p className="text-muted-foreground">
              Comprehensive directory of conference staff, member school contacts, and key personnel.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">Live Data</Badge>
          <Badge variant="outline">{filteredContacts.length} Contacts</Badge>
          <Badge className="bg-accent text-accent-foreground">Notion Powered</Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">
              Directory entries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Search Results</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredContacts.length}</div>
            <p className="text-xs text-muted-foreground">
              Matching entries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.length > 0 ? new Date(Math.max(...contacts.map(c => new Date(c.last_edited_time).getTime()))).toLocaleDateString() : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              Most recent edit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" asChild>
                <a href={NOTION_CONFIG.PUBLIC_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={fetchContacts} disabled={loading}>
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search & Filter</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'embedded' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('embedded')}
              >
                <Database className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Search by name, organization, email, or any other contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))
          ) : filteredContacts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Add contacts to get started'}
              </p>
              <Button asChild>
                <a href={NOTION_CONFIG.PUBLIC_URL} target="_blank" rel="noopener noreferrer">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Contacts in Notion
                </a>
              </Button>
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
        </div>
      ) : (
        // List view
        <Card>
          <CardHeader>
            <CardTitle>Contact Directory</CardTitle>
            <CardDescription>
              Detailed list view of all conference contacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No contacts match your search' : 'No contacts found'}
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <ContactCard 
                    key={contact.id} 
                    contact={contact} 
                    variant="compact"
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Section */}
      <div className="mt-8">
        <ContactsAnalyticsChart />
      </div>
    </div>
  )
}