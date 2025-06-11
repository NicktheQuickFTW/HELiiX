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

interface Sport {
  sport_id: number
  sport_code: string
  sport_name: string
  sport_season: string
  team_count: number
}

interface GeneratedManual {
  id: string
  title: string
  season_year: string
  status: string
  created_at: string
  sports: {
    sport_code: string
    sport_name: string
  }
  policies_included: string[]
  metadata: any
}

export default function GenerateManualPage() {
  const [sports, setSports] = useState<Sport[]>([])
  const [generatedManuals, setGeneratedManuals] = useState<GeneratedManual[]>([])
  const [selectedSport, setSelectedSport] = useState<string>('')
  const [templateType, setTemplateType] = useState<string>('administrative_guide')
  const [seasonYear, setSeasonYear] = useState<string>('2024-25')
  const [includeSections, setIncludeSections] = useState<string[]>(['sport_specific', 'championship_procedures', 'officiating'])
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const TEMPLATE_TYPES = [
    { value: 'administrative_guide', label: 'Administrative Guide' },
    { value: 'championship_manual', label: 'Championship Manual' },
    { value: 'officials_manual', label: 'Officials Manual' },
    { value: 'sport_handbook', label: 'Sport Handbook' }
  ]

  const SECTION_TYPES = [
    { value: 'sport_specific', label: 'Sport-Specific Rules' },
    { value: 'championship_procedures', label: 'Championship Procedures' },
    { value: 'officiating', label: 'Officiating Guidelines' },
    { value: 'equipment', label: 'Equipment Specifications' },
    { value: 'administrative', label: 'Administrative Procedures' }
  ]

  const SEASON_OPTIONS = [
    '2024-25',
    '2025-26',
    '2026-27'
  ]

  useEffect(() => {
    fetchSports()
    fetchGeneratedManuals()
  }, [])

  const fetchSports = async () => {
    try {
      const response = await fetch('/api/sports')
      if (response.ok) {
        const data = await response.json()
        setSports(data)
      }
    } catch (error) {
      console.error('Error fetching sports:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGeneratedManuals = async () => {
    try {
      const response = await fetch('/api/manuals/generate')
      if (response.ok) {
        const data = await response.json()
        setGeneratedManuals(data)
      }
    } catch (error) {
      console.error('Error fetching generated manuals:', error)
    }
  }

  const generateManual = async () => {
    if (!selectedSport) {
      alert('Please select a sport')
      return
    }

    setGenerating(true)
    setGeneratedContent('')

    try {
      const response = await fetch('/api/manuals/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sport_id: parseInt(selectedSport),
          template_type: templateType,
          season_year: seasonYear,
          include_sections: includeSections
        })
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedContent(data.content)
        await fetchGeneratedManuals() // Refresh the list
      } else {
        const error = await response.json()
        alert(`Error generating manual: ${error.error}`)
      }
    } catch (error) {
      console.error('Error generating manual:', error)
      alert('Error generating manual. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const toggleSection = (section: string) => {
    setIncludeSections(prev => 
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const getTemplateTypeLabel = (type: string) => {
    return TEMPLATE_TYPES.find(t => t.value === type)?.label || type
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <Column fillWidth gap="l" padding="xl">
        <Row justifyContent="center" alignItems="center" style={{ height: '400px' }}>
          <StatusIndicator variant="loading" size="m" />
          <Text variant="body-default-m">Loading sports data...</Text>
        </Row>
      </Column>
    )
  }

  return (
    <Column fillWidth gap="l" padding="xl">
      {/* Header */}
      <Row fillWidth justifyContent="space-between" alignItems="center">
        <Column gap="xs">
          <Heading variant="display-strong-s">Generate Manual</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Create AI-powered manuals from policy database
          </Text>
        </Column>
      </Row>

      <Grid columns="2" gap="l">
        {/* Generation Form */}
        <Column gap="m">
          <Card padding="m" border="neutral-medium" background="surface">
            <Column gap="m">
              <Text variant="heading-strong-s">Manual Configuration</Text>
              
              <Column gap="s">
                <Text variant="label-default-xs">Sport</Text>
                <Dropdown value={selectedSport} onSelectionChange={setSelectedSport}>
                  <Option value="">Select Sport</Option>
                  {sports.map(sport => (
                    <Option key={sport.sport_id} value={sport.sport_id.toString()}>
                      {sport.sport_name} ({sport.sport_code})
                    </Option>
                  ))}
                </Dropdown>
              </Column>
              
              <Column gap="s">
                <Text variant="label-default-xs">Template Type</Text>
                <Dropdown value={templateType} onSelectionChange={setTemplateType}>
                  {TEMPLATE_TYPES.map(template => (
                    <Option key={template.value} value={template.value}>
                      {template.label}
                    </Option>
                  ))}
                </Dropdown>
              </Column>
              
              <Column gap="s">
                <Text variant="label-default-xs">Season</Text>
                <Dropdown value={seasonYear} onSelectionChange={setSeasonYear}>
                  {SEASON_OPTIONS.map(season => (
                    <Option key={season} value={season}>
                      {season}
                    </Option>
                  ))}
                </Dropdown>
              </Column>
              
              <Column gap="s">
                <Text variant="label-default-xs">
                  Include Sections ({includeSections.length} selected)
                </Text>
                <Column gap="xs">
                  {SECTION_TYPES.map(section => (
                    <Row key={section.value} alignItems="center" gap="s">
                      <input
                        type="checkbox"
                        checked={includeSections.includes(section.value)}
                        onChange={() => toggleSection(section.value)}
                      />
                      <Text variant="body-default-s">{section.label}</Text>
                    </Row>
                  ))}
                </Column>
              </Column>
              
              <Button
                variant="primary"
                size="m"
                onClick={generateManual}
                disabled={generating || !selectedSport}
                fillWidth
              >
                {generating ? 'Generating Manual...' : 'Generate Manual'}
              </Button>
            </Column>
          </Card>

          {/* Generated Manuals History */}
          <Card padding="m" border="neutral-medium" background="surface">
            <Column gap="m">
              <Text variant="heading-strong-s">Recent Generations</Text>
              
              {generatedManuals.length === 0 ? (
                <Text variant="body-default-s" onBackground="neutral-weak">
                  No manuals generated yet
                </Text>
              ) : (
                <Column gap="s">
                  {generatedManuals.slice(0, 5).map(manual => (
                    <Card key={manual.id} padding="s" background="neutral-weak" border="neutral-medium">
                      <Column gap="xs">
                        <Row justifyContent="space-between" alignItems="center">
                          <Text variant="body-strong-s">{manual.title}</Text>
                          <Badge variant="neutral" size="s">
                            {manual.sports.sport_code}
                          </Badge>
                        </Row>
                        <Row gap="m" alignItems="center">
                          <Text variant="body-default-xs" onBackground="neutral-weak">
                            {formatDate(manual.created_at)}
                          </Text>
                          <Text variant="body-default-xs" onBackground="neutral-weak">
                            {manual.policies_included.length} policies
                          </Text>
                          <StatusIndicator variant="green" size="s">
                            {manual.status}
                          </StatusIndicator>
                        </Row>
                      </Column>
                    </Card>
                  ))}
                </Column>
              )}
            </Column>
          </Card>
        </Column>

        {/* Generated Content Preview */}
        <Column gap="m">
          <Card padding="m" border="neutral-medium" background="surface">
            <Column gap="m">
              <Row justifyContent="space-between" alignItems="center">
                <Text variant="heading-strong-s">Generated Content</Text>
                {generatedContent && (
                  <Button variant="secondary" size="s">
                    Download PDF
                  </Button>
                )}
              </Row>
              
              {generating ? (
                <Column alignItems="center" gap="m" style={{ padding: '40px' }}>
                  <StatusIndicator variant="loading" size="m" />
                  <Text variant="body-default-m">Generating manual...</Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    This may take a few moments
                  </Text>
                </Column>
              ) : generatedContent ? (
                <Column gap="s">
                  <div 
                    style={{
                      backgroundColor: 'var(--neutral-background-weak)',
                      border: '1px solid var(--neutral-border-medium)',
                      borderRadius: '8px',
                      padding: '16px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      lineHeight: '1.4',
                      maxHeight: '600px',
                      overflowY: 'auto',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {generatedContent}
                  </div>
                  
                  <Row gap="s" style={{ marginTop: '16px' }}>
                    <Button variant="primary" size="s">
                      Save Manual
                    </Button>
                    <Button variant="secondary" size="s">
                      Edit Content
                    </Button>
                    <Button variant="ghost" size="s">
                      Copy to Clipboard
                    </Button>
                  </Row>
                </Column>
              ) : (
                <Column alignItems="center" gap="m" style={{ padding: '40px' }}>
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    Generated manual content will appear here
                  </Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Configure your settings and click "Generate Manual" to begin
                  </Text>
                </Column>
              )}
            </Column>
          </Card>
        </Column>
      </Grid>
    </Column>
  )
}