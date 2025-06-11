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
  StatusIndicator
} from "@once-ui-system/core"

interface Manual {
  filename: string
  sport: string
  sportCode: string
  season: string
  size: number
  modified: string
}

interface ParseResult {
  manual: string
  sport: string
  section?: string
  status: 'processed' | 'error'
  error?: string
}

export default function ParseManualsPage() {
  const [manuals, setManuals] = useState<Manual[]>([])
  const [loading, setLoading] = useState(true)
  const [parsing, setParsing] = useState(false)
  const [parseResults, setParseResults] = useState<ParseResult[]>([])

  useEffect(() => {
    fetchManuals()
  }, [])

  const fetchManuals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/manuals/parse-sport-sections')
      if (response.ok) {
        const data = await response.json()
        setManuals(data.manuals)
      }
    } catch (error) {
      console.error('Error fetching manuals:', error)
    } finally {
      setLoading(false)
    }
  }

  const parseManuals = async () => {
    try {
      setParsing(true)
      setParseResults([])
      
      const response = await fetch('/api/manuals/parse-sport-sections', {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        setParseResults(data.results)
      }
    } catch (error) {
      console.error('Error parsing manuals:', error)
    } finally {
      setParsing(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getSportColor = (sport: string) => {
    const colors: Record<string, string> = {
      'Football': 'red',
      'Basketball': 'orange', 
      'Baseball': 'green',
      'Soccer': 'blue',
      'Volleyball': 'purple',
      'Wrestling': 'yellow',
      'Gymnastics': 'pink',
      'Softball': 'teal',
      'Tennis': 'cyan'
    }
    return colors[sport] || 'gray'
  }

  if (loading) {
    return (
      <Column fillWidth gap="l" padding="xl">
        <Row justifyContent="center" alignItems="center" style={{ height: '400px' }}>
          <StatusIndicator variant="loading" size="m" />
          <Text variant="body-default-m">Loading administrative manuals...</Text>
        </Row>
      </Column>
    )
  }

  return (
    <Column fillWidth gap="l" padding="xl">
      {/* Header */}
      <Row fillWidth justifyContent="space-between" alignItems="center">
        <Column gap="xs">
          <Heading variant="display-strong-s">Parse Administrative Manuals</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Extract sport-specific sections from Big 12 administrative manuals
          </Text>
        </Column>
        <Button 
          variant="primary" 
          size="m"
          onClick={parseManuals}
          disabled={parsing}
        >
          {parsing ? 'Parsing...' : 'Parse All Manuals'}
        </Button>
      </Row>

      {/* Stats */}
      <Grid columns="4" gap="m">
        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="xs">
            <Text variant="heading-strong-l">{manuals.length}</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Total Manuals
            </Text>
          </Column>
        </Card>
        
        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="xs">
            <Text variant="heading-strong-l">
              {new Set(manuals.map(m => m.sport)).size}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Sports Covered
            </Text>
          </Column>
        </Card>
        
        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="xs">
            <Text variant="heading-strong-l">
              {manuals.filter(m => m.season === '2024-25').length}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Current Season
            </Text>
          </Column>
        </Card>
        
        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="xs">
            <Text variant="heading-strong-l">
              {formatFileSize(manuals.reduce((total, m) => total + m.size, 0))}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Total Size
            </Text>
          </Column>
        </Card>
      </Grid>

      {/* Parsing Instructions */}
      <Card padding="m" background="surface" border="neutral-medium">
        <Column gap="s">
          <Text variant="heading-strong-s">Parsing Instructions</Text>
          <Text variant="body-default-s" onBackground="neutral-medium">
            This process will extract only sport-specific policy sections with substantial text content:
          </Text>
          
          <Column gap="xs" style={{ marginLeft: '16px' }}>
            <Text variant="body-strong-s" onBackground="success-medium">✓ Will Parse:</Text>
            <Text variant="body-default-s">• Competition Format & Procedures</Text>
            <Text variant="body-default-s">• Eligibility Requirements</Text>
            <Text variant="body-default-s">• Equipment Specifications</Text>
            <Text variant="body-default-s">• Championship Procedures</Text>
            <Text variant="body-default-s">• Officiating Guidelines</Text>
          </Column>
          
          <Column gap="xs" style={{ marginLeft: '16px', marginTop: '8px' }}>
            <Text variant="body-strong-s" onBackground="warning-medium">✗ Will Skip:</Text>
            <Text variant="body-default-s">• Table of Contents & Directories</Text>
            <Text variant="body-default-s">• TV Commercial Formats</Text>
            <Text variant="body-default-s">• Timing Sheets & Scorecards</Text>
            <Text variant="body-default-s">• Brackets & Diagrams</Text>
            <Text variant="body-default-s">• Forms & Templates</Text>
            <Text variant="body-default-s">• Conference Rules (provided separately)</Text>
            <Text variant="body-default-s">• Graphics-heavy pages</Text>
          </Column>
          
          <Text variant="body-default-s" onBackground="neutral-weak" style={{ fontStyle: 'italic' }}>
            Only sections with substantial policy text and regulatory language will be extracted.
          </Text>
        </Column>
      </Card>

      {/* Manuals List */}
      <Card padding="m" background="surface" border="neutral-medium">
        <Column gap="m">
          <Text variant="heading-strong-s">Available Manuals</Text>
          
          <Grid columns="1" gap="s">
            {manuals.map((manual, index) => (
              <Card 
                key={index}
                padding="s" 
                background="neutral-weak" 
                border="neutral-medium"
              >
                <Row fillWidth justifyContent="space-between" alignItems="center">
                  <Column gap="xs" flex={1}>
                    <Row alignItems="center" gap="s">
                      <Badge variant="brand" size="s">
                        {manual.sportCode}
                      </Badge>
                      <Text variant="body-strong-s">{manual.filename}</Text>
                    </Row>
                    <Row gap="m" alignItems="center">
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        Sport: {manual.sport}
                      </Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        Season: {manual.season}
                      </Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        Size: {formatFileSize(manual.size)}
                      </Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        Modified: {formatDate(manual.modified)}
                      </Text>
                    </Row>
                  </Column>
                  
                  <StatusIndicator 
                    variant={getSportColor(manual.sport)} 
                    size="s"
                  >
                    Ready
                  </StatusIndicator>
                </Row>
              </Card>
            ))}
          </Grid>
        </Column>
      </Card>

      {/* Parse Results */}
      {parseResults.length > 0 && (
        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="m">
            <Text variant="heading-strong-s">Parsing Results</Text>
            
            <Grid columns="1" gap="s">
              {parseResults.map((result, index) => (
                <Row 
                  key={index}
                  fillWidth 
                  justifyContent="space-between" 
                  alignItems="center"
                  style={{ padding: '8px', borderBottom: '1px solid var(--neutral-border-medium)' }}
                >
                  <Column gap="xs">
                    <Text variant="body-strong-s">{result.manual}</Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {result.sport} {result.section && `• ${result.section}`}
                    </Text>
                    {result.error && (
                      <Text variant="body-default-xs" onBackground="danger-medium">
                        Error: {result.error}
                      </Text>
                    )}
                  </Column>
                  
                  <StatusIndicator 
                    variant={result.status === 'processed' ? 'green' : 'red'} 
                    size="s"
                  >
                    {result.status === 'processed' ? 'Success' : 'Error'}
                  </StatusIndicator>
                </Row>
              ))}
            </Grid>
            
            <Row gap="s" style={{ marginTop: '16px' }}>
              <Text variant="body-default-s">
                Processed: {parseResults.filter(r => r.status === 'processed').length}
              </Text>
              <Text variant="body-default-s">
                Errors: {parseResults.filter(r => r.status === 'error').length}
              </Text>
            </Row>
          </Column>
        </Card>
      )}
    </Column>
  )
}