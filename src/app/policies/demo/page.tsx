'use client'

import { useState } from 'react'
import { 
  Column, 
  Row, 
  Grid, 
  Card, 
  Button, 
  Heading, 
  Text,
  Badge 
} from "@once-ui-system/core"

// Demo data based on our analysis results
const demoAnalysisData = {
  totalCategories: 11,
  categoryCount: {
    'sport_specific': 9,
    'season_format': 9,
    'awards_recognition': 6,
    'championship_procedures': 5,
    'officiating': 4,
    'media_relations': 3,
    'eligibility_requirements': 3,
    'facility_standards': 3,
    'equipment_specifications': 2,
    'travel_procedures': 2,
    'weather_policies': 1
  },
  categoriesBySport: {
    'Football': ['sport_specific', 'season_format', 'officiating', 'media_relations', 'championship_procedures', 'awards_recognition', 'eligibility_requirements', 'facility_standards', 'equipment_specifications', 'travel_procedures', 'weather_policies'],
    'Basketball': ['sport_specific', 'season_format', 'officiating', 'media_relations', 'championship_procedures', 'awards_recognition', 'eligibility_requirements', 'facility_standards', 'equipment_specifications'],
    'Soccer': ['sport_specific', 'season_format', 'officiating', 'awards_recognition', 'championship_procedures', 'eligibility_requirements', 'facility_standards'],
    'Baseball': ['sport_specific', 'season_format', 'awards_recognition', 'championship_procedures', 'officiating'],
    'Volleyball': ['sport_specific', 'season_format', 'awards_recognition', 'championship_procedures'],
    'Tennis': ['sport_specific', 'season_format', 'awards_recognition'],
    'Wrestling': ['sport_specific', 'season_format', 'officiating'],
    'Softball': ['sport_specific', 'season_format'],
    'Gymnastics': ['sport_specific', 'awards_recognition']
  },
  sectionTitlesBySport: {
    'Football': [
      'GAME OPERATIONS',
      'TELEVISION TIMEOUTS', 
      'OFFICIATING PROCEDURES',
      'CHAMPIONSHIP SELECTION',
      'WEATHER POLICIES',
      'TRAVEL PROCEDURES',
      'EQUIPMENT SPECIFICATIONS',
      'FACILITY STANDARDS',
      'ELIGIBILITY REQUIREMENTS',
      'AWARDS RECOGNITION'
    ],
    'Basketball': [
      'GAME OPERATIONS',
      'TOURNAMENT PROCEDURES',
      'OFFICIATING ASSIGNMENTS', 
      'MEDIA RELATIONS',
      'CHAMPIONSHIP FORMAT',
      'AWARDS RECOGNITION',
      'ELIGIBILITY STANDARDS',
      'FACILITY REQUIREMENTS'
    ],
    'Soccer': [
      'MATCH PROTOCOLS',
      'SEASON FORMAT',
      'OFFICIATING GUIDELINES',
      'AWARDS RECOGNITION',
      'CHAMPIONSHIP PROCEDURES',
      'ELIGIBILITY REQUIREMENTS',
      'FACILITY STANDARDS'
    ]
  }
}

const demoPolicies = [
  {
    id: '1',
    title: 'Football Television Timeout Procedures',
    category: 'media_relations',
    sport: 'Football',
    version: '1.0',
    status: 'current',
    summary: 'Standardized procedures for television timeouts during football games',
    lastUpdated: '2024-08-15'
  },
  {
    id: '2', 
    title: 'Basketball Championship Selection Criteria',
    category: 'championship_procedures',
    sport: 'Basketball',
    version: '2.1',
    status: 'current',
    summary: 'Updated selection criteria for Big 12 Basketball Championship',
    lastUpdated: '2024-12-05'
  },
  {
    id: '3',
    title: 'Soccer Weather Postponement Policy',
    category: 'weather_policies',
    sport: 'Soccer',
    version: '1.2',
    status: 'current',
    summary: 'Guidelines for postponing soccer matches due to weather conditions',
    lastUpdated: '2024-09-26'
  },
  {
    id: '4',
    title: 'Conference-Wide Travel Reimbursement',
    category: 'travel_procedures',
    sport: 'All Sports',
    version: '3.0',
    status: 'current',
    summary: 'Standardized travel reimbursement procedures across all Big 12 sports',
    lastUpdated: '2024-07-01'
  }
]

export default function PolicyDemoPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSport, setSelectedSport] = useState<string | null>(null)

  const filteredPolicies = demoPolicies.filter(policy => {
    if (selectedCategory && policy.category !== selectedCategory) return false
    if (selectedSport && policy.sport !== selectedSport && policy.sport !== 'All Sports') return false
    return true
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'media_relations': 'blue',
      'championship_procedures': 'green', 
      'weather_policies': 'orange',
      'travel_procedures': 'purple',
      'officiating': 'teal',
      'season_format': 'indigo',
      'awards_recognition': 'pink'
    }
    return colors[category] || 'gray'
  }

  return (
    <Column fillWidth gap="l" padding="xl">
      {/* Header */}
      <Row fillWidth justifyContent="space-between" alignItems="center">
        <Column gap="xs">
          <Heading variant="display-strong-s">Policy Management System Demo</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Demonstration of Big 12 Conference policy tracking and comparison capabilities
          </Text>
        </Column>
        <Row gap="s">
          <Button variant="primary" size="m" onClick={() => window.location.href = '/policies/ai-assistant'}>
            🤖 AI Assistant
          </Button>
          <Button variant="primary" size="m" onClick={() => window.location.href = '/policies/smart-compare'}>
            ⚖️ Smart Compare
          </Button>
          <Button variant="primary" size="m" onClick={() => window.location.href = '/policies/category-manager'}>
            📋 Categories
          </Button>
          <Button variant="secondary" size="m" onClick={() => window.location.href = '/policies/analyze-sections'}>
            📊 Analysis
          </Button>
        </Row>
      </Row>

      {/* Analysis Summary */}
      <Grid columns="4" gap="m">
        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="xs">
            <Text variant="heading-strong-l">{demoAnalysisData.totalCategories}</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Policy Categories
            </Text>
          </Column>
        </Card>
        
        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="xs">
            <Text variant="heading-strong-l">{Object.keys(demoAnalysisData.categoriesBySport).length}</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Sports Analyzed
            </Text>
          </Column>
        </Card>
        
        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="xs">
            <Text variant="heading-strong-l">1,351</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Sections Extracted
            </Text>
          </Column>
        </Card>
        
        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="xs">
            <Text variant="heading-strong-l">{demoPolicies.length}</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Demo Policies
            </Text>
          </Column>
        </Card>
      </Grid>

      {/* Filters */}
      <Card padding="m" background="surface" border="neutral-medium">
        <Column gap="m">
          <Text variant="heading-strong-s">Filter Policies</Text>
          
          <Row gap="m" wrap>
            <Column gap="s">
              <Text variant="body-strong-s">By Category:</Text>
              <Row gap="xs" wrap>
                <Button 
                  variant={selectedCategory === null ? "primary" : "secondary"}
                  size="s"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
                </Button>
                {Object.keys(demoAnalysisData.categoryCount).slice(0, 6).map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "primary" : "secondary"}
                    size="s"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.replace('_', ' ')}
                  </Button>
                ))}
              </Row>
            </Column>

            <Column gap="s">
              <Text variant="body-strong-s">By Sport:</Text>
              <Row gap="xs" wrap>
                <Button 
                  variant={selectedSport === null ? "primary" : "secondary"}
                  size="s"
                  onClick={() => setSelectedSport(null)}
                >
                  All Sports
                </Button>
                {['Football', 'Basketball', 'Soccer', 'Baseball'].map(sport => (
                  <Button
                    key={sport}
                    variant={selectedSport === sport ? "primary" : "secondary"}
                    size="s"
                    onClick={() => setSelectedSport(sport)}
                  >
                    {sport}
                  </Button>
                ))}
              </Row>
            </Column>
          </Row>
        </Column>
      </Card>

      {/* Policy List */}
      <Card padding="m" background="surface" border="neutral-medium">
        <Column gap="m">
          <Row justifyContent="space-between" alignItems="center">
            <Text variant="heading-strong-s">
              Policies ({filteredPolicies.length})
            </Text>
            <Badge variant="neutral" size="s">
              {selectedCategory || 'All Categories'} • {selectedSport || 'All Sports'}
            </Badge>
          </Row>
          
          <Grid columns="1" gap="s">
            {filteredPolicies.map(policy => (
              <Card key={policy.id} padding="s" background="neutral-weak" border="neutral-medium">
                <Column gap="s">
                  <Row justifyContent="space-between" alignItems="center">
                    <Text variant="body-strong-s">{policy.title}</Text>
                    <Row gap="xs" alignItems="center">
                      <Badge variant="brand" size="xs">
                        {policy.category.replace('_', ' ')}
                      </Badge>
                      <Badge variant="neutral" size="xs">
                        v{policy.version}
                      </Badge>
                      <Badge variant="success" size="xs">
                        {policy.status}
                      </Badge>
                    </Row>
                  </Row>
                  
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {policy.summary}
                  </Text>
                  
                  <Row justifyContent="space-between" alignItems="center">
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Sport: {policy.sport} • Updated: {policy.lastUpdated}
                    </Text>
                    <Row gap="xs">
                      <Button variant="secondary" size="s">View</Button>
                      <Button variant="secondary" size="s">Compare</Button>
                      <Button variant="secondary" size="s">Edit</Button>
                    </Row>
                  </Row>
                </Column>
              </Card>
            ))}
          </Grid>
        </Column>
      </Card>

      {/* Category Distribution */}
      <Card padding="m" background="surface" border="neutral-medium">
        <Column gap="m">
          <Text variant="heading-strong-s">Category Distribution Across Sports</Text>
          <Grid columns="1" gap="s">
            {Object.entries(demoAnalysisData.categoryCount)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([category, count]) => (
                <Row key={category} fillWidth justifyContent="space-between" alignItems="center">
                  <Row alignItems="center" gap="s">
                    <Badge variant="brand" size="s">
                      {category.replace('_', ' ')}
                    </Badge>
                    <Text variant="body-default-s">
                      {category.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Text>
                  </Row>
                  <Row alignItems="center" gap="s">
                    <Text variant="body-default-s">{count} sports</Text>
                    <div 
                      style={{
                        width: `${(count / 9) * 100}px`,
                        height: '8px',
                        backgroundColor: 'var(--brand-background-medium)',
                        borderRadius: '4px'
                      }}
                    />
                  </Row>
                </Row>
              ))}
          </Grid>
        </Column>
      </Card>

      {/* Sport Coverage */}
      <Card padding="m" background="surface" border="neutral-medium">
        <Column gap="m">
          <Text variant="heading-strong-s">Policy Coverage by Sport</Text>
          <Grid columns="1" gap="s">
            {Object.entries(demoAnalysisData.categoriesBySport).slice(0, 6).map(([sport, categories]) => (
              <Card key={sport} padding="s" background="neutral-weak" border="neutral-medium">
                <Column gap="s">
                  <Row justifyContent="space-between" alignItems="center">
                    <Text variant="body-strong-s">{sport}</Text>
                    <Badge variant="neutral" size="s">{categories.length} categories</Badge>
                  </Row>
                  <Row gap="xs" wrap>
                    {categories.slice(0, 8).map(category => (
                      <Badge key={category} variant="brand" size="xs">
                        {category.replace('_', ' ')}
                      </Badge>
                    ))}
                    {categories.length > 8 && (
                      <Badge variant="neutral" size="xs">
                        +{categories.length - 8} more
                      </Badge>
                    )}
                  </Row>
                </Column>
              </Card>
            ))}
          </Grid>
        </Column>
      </Card>

      {/* System Capabilities */}
      <Card padding="m" background="surface" border="neutral-medium">
        <Column gap="m">
          <Text variant="heading-strong-s">System Capabilities Demonstrated</Text>
          <Grid columns="2" gap="m">
            <Column gap="s">
              <Text variant="body-strong-s">✅ Core System Features:</Text>
              <Column gap="xs">
                <Text variant="body-default-s">• PDF section analysis and categorization</Text>
                <Text variant="body-default-s">• Sport-specific content extraction</Text>
                <Text variant="body-default-s">• Granular policy categorization (30+ categories)</Text>
                <Text variant="body-default-s">• Cross-sport comparison framework</Text>
                <Text variant="body-default-s">• Once UI compliant interface</Text>
                <Text variant="body-default-s">• Database schema for policy management</Text>
                <Text variant="body-default-s">• API routes for CRUD operations</Text>
                <Text variant="body-default-s">• Manual generation templates</Text>
              </Column>
            </Column>
            
            <Column gap="s">
              <Text variant="body-strong-s">🤖 NEW: AI-Powered Features:</Text>
              <Column gap="xs">
                <Text variant="body-default-s">• NotebookLM-style AI query system with Gemini Pro</Text>
                <Text variant="body-default-s">• Custom category creation and analysis (e.g., Video Replay)</Text>
                <Text variant="body-default-s">• Deep research and document analysis</Text>
                <Text variant="body-default-s">• Intelligent cross-sport policy comparison</Text>
                <Text variant="body-default-s">• Pattern recognition and insights</Text>
                <Text variant="body-default-s">• Smart policy recommendations</Text>
                <Text variant="body-default-s">• Real-time conversational interface</Text>
                <Text variant="body-default-s">• Advanced policy analysis modes</Text>
                <Text variant="body-default-s">• Automated compliance insights</Text>
              </Column>
            </Column>
          </Grid>
        </Column>
      </Card>

      {/* AI Features Showcase */}
      <Card padding="m" background="brand-weak" border="brand-medium">
        <Column gap="m">
          <Row alignItems="center" gap="s">
            <Text variant="heading-strong-s">🚀 NEW: AI-Powered Manual Analysis</Text>
            <Badge variant="brand" size="s">Powered by Gemini Pro</Badge>
          </Row>
          
          <Text variant="body-default-s">
            Experience NotebookLM-style AI capabilities for Big 12 administrative manuals. Ask questions, 
            run comparisons, and get deep insights from all 9 sport manuals using advanced AI research capabilities.
          </Text>
          
          <Grid columns="4" gap="m">
            <Column gap="s">
              <Text variant="body-strong-s">🤖 AI Assistant</Text>
              <Text variant="body-default-s">
                Conversational interface for asking questions about policies, procedures, and manual content
              </Text>
            </Column>
            
            <Column gap="s">
              <Text variant="body-strong-s">⚖️ Smart Compare</Text>
              <Text variant="body-default-s">
                AI-powered cross-sport policy comparison with deep analysis and recommendations
              </Text>
            </Column>
            
            <Column gap="s">
              <Text variant="body-strong-s">📋 Category Manager</Text>
              <Text variant="body-default-s">
                Create custom policy categories like "Video Replay" and analyze them across all sports
              </Text>
            </Column>
            
            <Column gap="s">
              <Text variant="body-strong-s">📊 Deep Research</Text>
              <Text variant="body-default-s">
                Gemini Pro analyzes complete manual content for comprehensive insights and patterns
              </Text>
            </Column>
          </Grid>
          
          <Row gap="s">
            <Button variant="primary" size="m" onClick={() => window.location.href = '/policies/ai-assistant'}>
              Try AI Assistant →
            </Button>
            <Button variant="primary" size="m" onClick={() => window.location.href = '/policies/smart-compare'}>
              Try Smart Compare →
            </Button>
            <Button variant="primary" size="m" onClick={() => window.location.href = '/policies/category-manager'}>
              Try Category Manager →
            </Button>
          </Row>
        </Column>
      </Card>
    </Column>
  )
}