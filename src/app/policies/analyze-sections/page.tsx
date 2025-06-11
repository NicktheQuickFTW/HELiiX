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

interface ManualAnalysis {
  filename: string
  sport: string
  sportCode: string
  sections: SectionHeader[]
  tableOfContents: string[]
  sportSpecificSections: SectionHeader[]
  error?: string
}

interface SectionHeader {
  title: string
  level: number
  pageNumber?: number
  category?: string
  isSportSpecific: boolean
}

interface CategoryAnalysis {
  totalCategories: number
  categoryCount: Record<string, number>
  categoriesBySport: Record<string, string[]>
  sectionTitlesBySport: Record<string, string[]>
  commonCategories: string[]
}

export default function AnalyzeSectionsPage() {
  const [manuals, setManuals] = useState<any[]>([])
  const [analyses, setAnalyses] = useState<ManualAnalysis[]>([])
  const [categoryAnalysis, setCategoryAnalysis] = useState<CategoryAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    fetchManuals()
  }, [])

  const fetchManuals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/manuals/analyze-sections')
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

  const analyzeSections = async () => {
    try {
      setAnalyzing(true)
      const response = await fetch('/api/manuals/analyze-sections', {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        setAnalyses(data.analyses)
        setCategoryAnalysis(data.categoryAnalysis)
      }
    } catch (error) {
      console.error('Error analyzing sections:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'weather_policies': 'blue',
      'season_format': 'green',
      'eligibility_requirements': 'purple',
      'equipment_specifications': 'orange',
      'facility_standards': 'teal',
      'officiating': 'yellow',
      'safety_protocols': 'red',
      'media_relations': 'pink',
      'travel_procedures': 'cyan',
      'championship_procedures': 'indigo',
      'awards_recognition': 'emerald',
      'academic_standards': 'violet'
    }
    return colors[category] || 'gray'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <Column fillWidth gap="l" padding="xl">
        <Row justifyContent="center" alignItems="center" style={{ height: '400px' }}>
          <StatusIndicator variant="loading" size="m" />
          <Text variant="body-default-m">Loading manuals for analysis...</Text>
        </Row>
      </Column>
    )
  }

  return (
    <Column fillWidth gap="l" padding="xl">
      {/* Header */}
      <Row fillWidth justifyContent="space-between" alignItems="center">
        <Column gap="xs">
          <Heading variant="display-strong-s">Analyze Manual Sections</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Extract and categorize section headers from sport-specific information
          </Text>
        </Column>
        <Button 
          variant="primary" 
          size="m"
          onClick={analyzeSections}
          disabled={analyzing}
        >
          {analyzing ? 'Analyzing...' : 'Analyze All Sections'}
        </Button>
      </Row>

      {/* Available Manuals */}
      <Card padding="m" background="surface" border="neutral-medium">
        <Column gap="m">
          <Text variant="heading-strong-s">Available Manuals ({manuals.length})</Text>
          
          <Grid columns="3" gap="s">
            {manuals.map((manual, index) => (
              <Card key={index} padding="s" background="neutral-weak" border="neutral-medium">
                <Column gap="xs">
                  <Row alignItems="center" gap="s">
                    <Badge variant="brand" size="s">{manual.sportCode}</Badge>
                    <Text variant="body-strong-xs">{manual.sport}</Text>
                  </Row>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {formatFileSize(manual.size)}
                  </Text>
                </Column>
              </Card>
            ))}
          </Grid>
        </Column>
      </Card>

      {/* Analysis Results */}
      {categoryAnalysis && (
        <Column gap="m">
          <Text variant="heading-strong-s">Section Analysis Results</Text>
          
          {/* Summary Stats */}
          <Grid columns="4" gap="m">
            <Card padding="m" background="surface" border="neutral-medium">
              <Column gap="xs">
                <Text variant="heading-strong-l">{categoryAnalysis.totalCategories}</Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Unique Categories
                </Text>
              </Column>
            </Card>
            
            <Card padding="m" background="surface" border="neutral-medium">
              <Column gap="xs">
                <Text variant="heading-strong-l">{categoryAnalysis.commonCategories.length}</Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Common Categories
                </Text>
              </Column>
            </Card>
            
            <Card padding="m" background="surface" border="neutral-medium">
              <Column gap="xs">
                <Text variant="heading-strong-l">{analyses.length}</Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Sports Analyzed
                </Text>
              </Column>
            </Card>
            
            <Card padding="m" background="surface" border="neutral-medium">
              <Column gap="xs">
                <Text variant="heading-strong-l">
                  {Object.values(categoryAnalysis.categoryCount).reduce((a, b) => a + b, 0)}
                </Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Total Sections
                </Text>
              </Column>
            </Card>
          </Grid>

          {/* Category Frequency */}
          <Card padding="m" background="surface" border="neutral-medium">
            <Column gap="m">
              <Text variant="heading-strong-s">Category Frequency Across Sports</Text>
              <Grid columns="1" gap="s">
                {Object.entries(categoryAnalysis.categoryCount)
                  .sort(([,a], [,b]) => b - a)
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
                            width: `${(count / analyses.length) * 100}px`,
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

          {/* Sport-by-Sport Breakdown */}
          <Card padding="m" background="surface" border="neutral-medium">
            <Column gap="m">
              <Text variant="heading-strong-s">Categories by Sport</Text>
              <Grid columns="1" gap="s">
                {Object.entries(categoryAnalysis.categoriesBySport).map(([sport, categories]) => (
                  <Card key={sport} padding="s" background="neutral-weak" border="neutral-medium">
                    <Column gap="s">
                      <Row justifyContent="space-between" alignItems="center">
                        <Text variant="body-strong-s">{sport}</Text>
                        <Badge variant="neutral" size="s">{categories.length} categories</Badge>
                      </Row>
                      <Row gap="xs" wrap>
                        {categories.map(category => (
                          <Badge key={category} variant="brand" size="xs">
                            {category.replace('_', ' ')}
                          </Badge>
                        ))}
                      </Row>
                    </Column>
                  </Card>
                ))}
              </Grid>
            </Column>
          </Card>

          {/* Section Titles by Sport */}
          <Card padding="m" background="surface" border="neutral-medium">
            <Column gap="m">
              <Text variant="heading-strong-s">Sport-Specific Section Titles</Text>
              <Grid columns="1" gap="s">
                {Object.entries(categoryAnalysis.sectionTitlesBySport).map(([sport, titles]) => (
                  <Card key={sport} padding="s" background="neutral-weak" border="neutral-medium">
                    <Column gap="s">
                      <Row justifyContent="space-between" alignItems="center">
                        <Text variant="body-strong-s">{sport}</Text>
                        <Badge variant="neutral" size="s">{titles.length} sections</Badge>
                      </Row>
                      <Column gap="xs">
                        {titles.slice(0, 10).map((title, idx) => (
                          <Text key={idx} variant="body-default-xs" onBackground="neutral-weak">
                            • {title}
                          </Text>
                        ))}
                        {titles.length > 10 && (
                          <Text variant="body-default-xs" onBackground="neutral-weak" style={{ fontStyle: 'italic' }}>
                            ... and {titles.length - 10} more sections
                          </Text>
                        )}
                      </Column>
                    </Column>
                  </Card>
                ))}
              </Grid>
            </Column>
          </Card>
        </Column>
      )}

      {/* Analysis Progress */}
      {analyzing && (
        <Card padding="m" background="surface" border="neutral-medium">
          <Column alignItems="center" gap="m">
            <StatusIndicator variant="loading" size="m" />
            <Text variant="body-default-m">Analyzing PDF section headers...</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Extracting sport-specific sections from all 9 administrative manuals
            </Text>
          </Column>
        </Card>
      )}
    </Column>
  )
}