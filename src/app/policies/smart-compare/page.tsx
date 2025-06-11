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

const SPORTS_OPTIONS = [
  'Soccer', 'Volleyball', 'Football', 'Basketball', 'Wrestling', 
  'Baseball', 'Gymnastics', 'Softball', 'Tennis'
]

const COMPARISON_TOPICS = [
  {
    id: 'weather',
    title: 'Weather Policies',
    description: 'Compare weather postponement and delay policies',
    query: 'Compare the weather postponement policies and procedures across sports'
  },
  {
    id: 'officiating',
    title: 'Officiating Procedures',
    description: 'Compare officiating assignments and procedures',
    query: 'Compare officiating procedures, assignments, and evaluation processes'
  },
  {
    id: 'championship',
    title: 'Championship Selection',
    description: 'Compare championship selection criteria and procedures',
    query: 'Compare championship selection criteria, tournament formats, and qualification procedures'
  },
  {
    id: 'media',
    title: 'Media Relations',
    description: 'Compare media timeout, interview, and broadcasting policies',
    query: 'Compare media relations policies including timeouts, interviews, and broadcasting requirements'
  },
  {
    id: 'equipment',
    title: 'Equipment Standards',
    description: 'Compare equipment specifications and uniform requirements',
    query: 'Compare equipment specifications, uniform requirements, and safety standards'
  },
  {
    id: 'eligibility',
    title: 'Eligibility Requirements',
    description: 'Compare player eligibility and roster requirements',
    query: 'Compare student-athlete eligibility requirements, roster procedures, and verification processes'
  }
]

interface ComparisonResult {
  topic: string
  sports: string[]
  analysis: string
  sources: Array<{
    sport: string
    filename: string
    relevantSections: number
  }>
  timestamp: Date
}

export default function SmartComparePage() {
  const [selectedSports, setSelectedSports] = useState<string[]>(['Football', 'Basketball'])
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [customQuery, setCustomQuery] = useState('')
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const toggleSport = (sport: string) => {
    setSelectedSports(prev => {
      if (prev.includes(sport)) {
        return prev.filter(s => s !== sport)
      } else if (prev.length < 4) { // Limit to 4 sports for better comparison
        return [...prev, sport]
      }
      return prev
    })
  }

  const runComparison = async (query: string, topic: string) => {
    if (selectedSports.length < 2) {
      alert('Please select at least 2 sports to compare')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/manuals/ai-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          sports: selectedSports,
          mode: 'comparison',
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error('Failed to run comparison')
      }

      const data = await response.json()

      const result: ComparisonResult = {
        topic,
        sports: selectedSports,
        analysis: data.answer,
        sources: data.sources,
        timestamp: new Date()
      }

      setComparisonResults(prev => [result, ...prev])
    } catch (error) {
      console.error('Comparison error:', error)
      alert('Failed to run comparison. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTopicComparison = (topic: any) => {
    runComparison(topic.query, topic.title)
  }

  const handleCustomComparison = () => {
    if (!customQuery.trim()) return
    runComparison(customQuery, 'Custom Comparison')
    setCustomQuery('')
  }

  const clearResults = () => {
    setComparisonResults([])
  }

  return (
    <Column fillWidth gap="l" padding="xl">
      {/* Header */}
      <Row fillWidth justifyContent="space-between" alignItems="center">
        <Column gap="xs">
          <Heading variant="display-strong-s">Smart Policy Comparison</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            AI-powered cross-sport policy analysis using Gemini Pro deep research
          </Text>
        </Column>
        <Row gap="s">
          <Button variant="secondary" size="s" onClick={clearResults}>
            Clear Results
          </Button>
          <Button variant="secondary" size="s" onClick={() => window.location.href = '/policies/ai-assistant'}>
            🤖 Full AI Assistant
          </Button>
        </Row>
      </Row>

      {/* Sports Selection */}
      <Card padding="m" background="surface" border="neutral-medium">
        <Column gap="m">
          <Row justifyContent="space-between" alignItems="center">
            <Text variant="heading-strong-s">Select Sports to Compare (2-4 sports)</Text>
            <Badge variant="neutral" size="s">
              {selectedSports.length} selected
            </Badge>
          </Row>
          
          <Row gap="xs" wrap>
            {SPORTS_OPTIONS.map(sport => (
              <Button
                key={sport}
                variant={selectedSports.includes(sport) ? "primary" : "secondary"}
                size="s"
                onClick={() => toggleSport(sport)}
                disabled={!selectedSports.includes(sport) && selectedSports.length >= 4}
              >
                {sport}
              </Button>
            ))}
          </Row>
          
          {selectedSports.length > 0 && (
            <Text variant="body-default-s" onBackground="neutral-weak">
              Comparing: {selectedSports.join(', ')}
            </Text>
          )}
        </Column>
      </Card>

      {/* Quick Comparison Topics */}
      <Card padding="m" background="surface" border="neutral-medium">
        <Column gap="m">
          <Text variant="heading-strong-s">Quick Comparisons</Text>
          <Grid columns="2" gap="s">
            {COMPARISON_TOPICS.map(topic => (
              <Card 
                key={topic.id} 
                padding="s" 
                background="neutral-weak" 
                border="neutral-medium"
                style={{ cursor: 'pointer' }}
                onClick={() => handleTopicComparison(topic)}
              >
                <Column gap="xs">
                  <Text variant="body-strong-s">{topic.title}</Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {topic.description}
                  </Text>
                </Column>
              </Card>
            ))}
          </Grid>
        </Column>
      </Card>

      {/* Custom Comparison */}
      <Card padding="m" background="surface" border="neutral-medium">
        <Column gap="m">
          <Text variant="heading-strong-s">Custom Comparison</Text>
          <Column gap="s">
            <textarea
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Enter your custom comparison question..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                border: '1px solid var(--neutral-border-medium)',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
            
            <Row justifyContent="space-between" alignItems="center">
              <Text variant="body-default-xs" onBackground="neutral-weak">
                Ask any comparison question about the selected sports
              </Text>
              <Button 
                variant="primary" 
                size="s"
                onClick={handleCustomComparison}
                disabled={!customQuery.trim() || selectedSports.length < 2 || isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Compare'}
              </Button>
            </Row>
          </Column>
        </Column>
      </Card>

      {/* Comparison Results */}
      {comparisonResults.length > 0 && (
        <Column gap="m">
          <Text variant="heading-strong-s">Comparison Results</Text>
          {comparisonResults.map((result, index) => (
            <Card key={index} padding="m" background="surface" border="neutral-medium">
              <Column gap="m">
                <Row justifyContent="space-between" alignItems="center">
                  <Column gap="xs">
                    <Text variant="heading-strong-s">{result.topic}</Text>
                    <Row gap="xs" alignItems="center">
                      <Badge variant="brand" size="s">Comparison</Badge>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        {result.sports.join(' vs ')}
                      </Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        {result.timestamp.toLocaleString()}
                      </Text>
                    </Row>
                  </Column>
                  
                  {result.sources && (
                    <Column gap="xs" alignItems="end">
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        Sources analyzed:
                      </Text>
                      <Row gap="xs" wrap>
                        {result.sources.map((source, idx) => (
                          <Badge key={idx} variant="neutral" size="xs">
                            {source.sport}
                          </Badge>
                        ))}
                      </Row>
                    </Column>
                  )}
                </Row>
                
                <Text variant="body-default-s" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {result.analysis}
                </Text>
              </Column>
            </Card>
          ))}
        </Column>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card padding="m" background="surface" border="neutral-medium">
          <Row justifyContent="center" alignItems="center" gap="m">
            <Text variant="body-default-s">🤖 AI analyzing policies across {selectedSports.join(', ')}...</Text>
          </Row>
        </Card>
      )}

      {/* System Info */}
      <Card padding="m" background="surface" border="neutral-medium">
        <Column gap="m">
          <Text variant="heading-strong-s">AI Comparison Capabilities</Text>
          <Grid columns="3" gap="m">
            <Column gap="s">
              <Text variant="body-strong-s">🧠 Deep Analysis</Text>
              <Text variant="body-default-s">
                Gemini Pro analyzes complete manual content to identify nuanced policy differences and similarities
              </Text>
            </Column>
            
            <Column gap="s">
              <Text variant="body-strong-s">📊 Pattern Recognition</Text>
              <Text variant="body-default-s">
                Identifies patterns, inconsistencies, and best practices across different sports policies
              </Text>
            </Column>
            
            <Column gap="s">
              <Text variant="body-strong-s">💡 Actionable Insights</Text>
              <Text variant="body-default-s">
                Provides recommendations for policy standardization and operational improvements
              </Text>
            </Column>
          </Grid>
        </Column>
      </Card>
    </Column>
  )
}