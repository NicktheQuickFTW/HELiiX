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
  Badge,
  StatusIndicator,
  Dropdown,
  Option
} from "@once-ui-system/core"

interface Policy {
  id: string
  title: string
  short_name?: string
  category: string
  sport_id?: number
  policy_number: string
  version: string
  status: string
  summary?: string
  effective_date?: string
  expiration_date?: string
  sports?: {
    sport_code: string
    sport_name: string
  }
  created_at: string
  updated_at: string
}

interface Sport {
  sport_id: number
  sport_code: string
  sport_name: string
}

const POLICY_CATEGORIES = [
  'governance',
  'playing_rules',
  'championship_procedures', 
  'officiating',
  'sport_specific',
  'administrative',
  'compliance',
  'ncaa_guidelines',
  'conference_operations'
]

const POLICY_STATUSES = [
  'draft',
  'under_review',
  'pending_approval', 
  'current',
  'archived',
  'superseded'
]

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [sports, setSports] = useState<Sport[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSport, setSelectedSport] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    fetchSports()
    fetchPolicies()
  }, [])

  useEffect(() => {
    fetchPolicies()
  }, [selectedSport, selectedCategory, selectedStatus, searchQuery])

  const fetchSports = async () => {
    try {
      const response = await fetch('/api/sports')
      if (response.ok) {
        const data = await response.json()
        setSports(data)
      }
    } catch (error) {
      console.error('Error fetching sports:', error)
    }
  }

  const fetchPolicies = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (selectedSport) params.set('sport_id', selectedSport)
      if (selectedCategory) params.set('category', selectedCategory)
      if (selectedStatus) params.set('status', selectedStatus)
      if (searchQuery) params.set('search', searchQuery)
      
      const response = await fetch(`/api/policies?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setPolicies(data)
      }
    } catch (error) {
      console.error('Error fetching policies:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'green'
      case 'draft': return 'orange'
      case 'under_review': return 'blue'
      case 'pending_approval': return 'purple'
      case 'archived': return 'gray'
      case 'superseded': return 'red'
      default: return 'gray'
    }
  }

  const getCategoryDisplay = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <Column fillWidth gap="l" padding="xl">
      {/* Header */}
      <Row fillWidth justifyContent="space-between" alignItems="center">
        <Column gap="xs">
          <Heading variant="display-strong-s">Policy Management</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Track and manage Big 12 Conference policies across all sports
          </Text>
        </Column>
        <Button variant="primary" size="m">
          Create Policy
        </Button>
      </Row>

      {/* Filters */}
      <Card padding="m" border="neutral-medium" background="surface">
        <Column gap="m">
          <Text variant="label-strong-s">Filters</Text>
          <Grid columns="4" gap="m">
            <Column gap="xs">
              <Text variant="label-default-xs">Sport</Text>
              <Dropdown 
                value={selectedSport}
                onSelectionChange={setSelectedSport}
              >
                <Option value="">All Sports</Option>
                {sports.map(sport => (
                  <Option key={sport.sport_id} value={sport.sport_id.toString()}>
                    {sport.sport_name}
                  </Option>
                ))}
              </Dropdown>
            </Column>
            
            <Column gap="xs">
              <Text variant="label-default-xs">Category</Text>
              <Dropdown 
                value={selectedCategory}
                onSelectionChange={setSelectedCategory}
              >
                <Option value="">All Categories</Option>
                {POLICY_CATEGORIES.map(category => (
                  <Option key={category} value={category}>
                    {getCategoryDisplay(category)}
                  </Option>
                ))}
              </Dropdown>
            </Column>
            
            <Column gap="xs">
              <Text variant="label-default-xs">Status</Text>
              <Dropdown 
                value={selectedStatus}
                onSelectionChange={setSelectedStatus}
              >
                <Option value="">All Statuses</Option>
                {POLICY_STATUSES.map(status => (
                  <Option key={status} value={status}>
                    {getCategoryDisplay(status)}
                  </Option>
                ))}
              </Dropdown>
            </Column>

            <Column gap="xs">
              <Text variant="label-default-xs">Search</Text>
              <input
                type="text"
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--neutral-border-medium)',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </Column>
          </Grid>
        </Column>
      </Card>

      {/* Policies Grid */}
      {loading ? (
        <Card padding="xl" background="surface" border="neutral-medium">
          <Column alignItems="center" gap="m">
            <StatusIndicator variant="loading" size="m" />
            <Text variant="body-default-m">Loading policies...</Text>
          </Column>
        </Card>
      ) : (
        <Grid columns="1" gap="m">
          {policies.length === 0 ? (
            <Card padding="xl" background="surface" border="neutral-medium">
              <Column alignItems="center" gap="m">
                <Text variant="heading-strong-m">No policies found</Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Try adjusting your filters or create a new policy
                </Text>
              </Column>
            </Card>
          ) : (
            policies.map(policy => (
              <Card 
                key={policy.id} 
                padding="m" 
                background="surface" 
                border="neutral-medium"
                style={{ cursor: 'pointer' }}
              >
                <Column gap="m">
                  <Row fillWidth justifyContent="space-between" alignItems="flex-start">
                    <Column gap="xs" flex={1}>
                      <Row alignItems="center" gap="s">
                        <Text variant="heading-strong-s">{policy.title}</Text>
                        <Badge variant="neutral" size="s">
                          v{policy.version}
                        </Badge>
                      </Row>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        {policy.policy_number} • {getCategoryDisplay(policy.category)}
                      </Text>
                      {policy.summary && (
                        <Text variant="body-default-s" onBackground="neutral-medium">
                          {policy.summary}
                        </Text>
                      )}
                    </Column>
                    
                    <Column alignItems="flex-end" gap="xs">
                      <StatusIndicator 
                        variant={getStatusColor(policy.status)} 
                        size="s"
                      >
                        {getCategoryDisplay(policy.status)}
                      </StatusIndicator>
                      {policy.sports && (
                        <Badge variant="neutral" size="xs">
                          {policy.sports.sport_code}
                        </Badge>
                      )}
                    </Column>
                  </Row>
                  
                  <Row gap="m" alignItems="center">
                    {policy.effective_date && (
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        Effective: {new Date(policy.effective_date).toLocaleDateString()}
                      </Text>
                    )}
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Updated: {new Date(policy.updated_at).toLocaleDateString()}
                    </Text>
                  </Row>
                </Column>
              </Card>
            ))
          )}
        </Grid>
      )}

      {/* Summary Stats */}
      <Row gap="m">
        <Card padding="m" background="surface" border="neutral-medium" flex={1}>
          <Column gap="xs">
            <Text variant="heading-strong-l">{policies.length}</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Total Policies
            </Text>
          </Column>
        </Card>
        
        <Card padding="m" background="surface" border="neutral-medium" flex={1}>
          <Column gap="xs">
            <Text variant="heading-strong-l">
              {policies.filter(p => p.status === 'current').length}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Current Policies
            </Text>
          </Column>
        </Card>
        
        <Card padding="m" background="surface" border="neutral-medium" flex={1}>
          <Column gap="xs">
            <Text variant="heading-strong-l">
              {policies.filter(p => p.status === 'under_review').length}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Under Review
            </Text>
          </Column>
        </Card>
        
        <Card padding="m" background="surface" border="neutral-medium" flex={1}>
          <Column gap="xs">
            <Text variant="heading-strong-l">
              {new Set(policies.map(p => p.category)).size}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Categories
            </Text>
          </Column>
        </Card>
      </Row>
    </Column>
  )
}