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
  Badge
} from "@once-ui-system/core"

const SPORTS_OPTIONS = [
  'Soccer', 'Volleyball', 'Football', 'Basketball', 'Wrestling', 
  'Baseball', 'Gymnastics', 'Softball', 'Tennis'
]

interface Category {
  id: string
  name: string
  description: string
  keywords: string[]
  sports_applicable: string[]
  query_template: string
  created_at: string
  updated_at?: string
}

interface CategoryAnalysis {
  category: string
  description: string
  sports_analyzed: string[]
  total_sections_found: number
  analysis: string
  sport_findings: Array<{
    sport: string
    sections_analyzed: number
    relevance_score: number
    top_sections: Array<{
      header: string
      relevance: number
      keywords_found: string[]
    }>
    key_findings: string[]
  }>
  sources: Array<{
    sport: string
    filename: string
    sections_found: number
    relevance_score: number
  }>
  timestamp: string
}

export default function CategoryManagerPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [analysisResults, setAnalysisResults] = useState<CategoryAnalysis[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    keywords: '',
    sports_applicable: [] as string[],
    query_template: ''
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/policies/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const createCategory = async () => {
    if (!formData.name || !formData.description || !formData.keywords) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/policies/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          keywords: formData.keywords.split(',').map(k => k.trim()),
          query_template: formData.query_template || `Compare ${formData.name.toLowerCase()} policies and procedures across sports`
        })
      })

      if (response.ok) {
        await fetchCategories()
        setFormData({
          name: '',
          description: '',
          keywords: '',
          sports_applicable: [],
          query_template: ''
        })
        setShowCreateForm(false)
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error('Error creating category:', error)
      alert('Failed to create category')
    }
  }

  const analyzeCategory = async (category: Category, sports?: string[]) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/manuals/category-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          sports: sports && sports.length > 0 ? sports : category.sports_applicable
        })
      })

      if (response.ok) {
        const analysis = await response.json()
        setAnalysisResults(prev => [analysis, ...prev])
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error('Error analyzing category:', error)
      alert('Failed to analyze category')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSportSelection = (sport: string) => {
    setSelectedSports(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    )
  }

  const toggleFormSport = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      sports_applicable: prev.sports_applicable.includes(sport)
        ? prev.sports_applicable.filter(s => s !== sport)
        : [...prev.sports_applicable, sport]
    }))
  }

  return (
    <Column fillWidth gap="l" padding="xl">
      {/* Header */}
      <Row fillWidth justifyContent="space-between" alignItems="center">
        <Column gap="xs">
          <Heading variant="display-strong-s">Category Manager</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Create and analyze custom policy categories across Big 12 sports
          </Text>
        </Column>
        <Row gap="s">
          <Button 
            variant="primary" 
            size="m"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : '+ Add Category'}
          </Button>
        </Row>
      </Row>

      {/* Create Category Form */}
      {showCreateForm && (
        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="m">
            <Text variant="heading-strong-s">Create New Category</Text>
            
            <Grid columns="2" gap="m">
              <Column gap="s">
                <Text variant="body-strong-s">Category Name *</Text>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Video Replay"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--neutral-border-medium)',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </Column>
              
              <Column gap="s">
                <Text variant="body-strong-s">Keywords *</Text>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="video, replay, review, technology (comma-separated)"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--neutral-border-medium)',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </Column>
            </Grid>
            
            <Column gap="s">
              <Text variant="body-strong-s">Description *</Text>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this category covers..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '8px 12px',
                  border: '1px solid var(--neutral-border-medium)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </Column>
            
            <Column gap="s">
              <Text variant="body-strong-s">Applicable Sports</Text>
              <Row gap="xs" wrap>
                {SPORTS_OPTIONS.map(sport => (
                  <Button
                    key={sport}
                    variant={formData.sports_applicable.includes(sport) ? "primary" : "secondary"}
                    size="s"
                    onClick={() => toggleFormSport(sport)}
                  >
                    {sport}
                  </Button>
                ))}
              </Row>
            </Column>
            
            <Column gap="s">
              <Text variant="body-strong-s">Custom Query Template (optional)</Text>
              <input
                type="text"
                value={formData.query_template}
                onChange={(e) => setFormData(prev => ({ ...prev, query_template: e.target.value }))}
                placeholder="Auto-generated if left blank"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--neutral-border-medium)',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </Column>
            
            <Row justifyContent="end" gap="s">
              <Button variant="secondary" size="s" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="s" onClick={createCategory}>
                Create Category
              </Button>
            </Row>
          </Column>
        </Card>
      )}

      {/* Existing Categories */}
      <Card padding="m" background="surface" border="neutral-medium">
        <Column gap="m">
          <Text variant="heading-strong-s">Available Categories ({categories.length})</Text>
          
          <Grid columns="1" gap="s">
            {categories.map(category => (
              <Card 
                key={category.id} 
                padding="s" 
                background={selectedCategory?.id === category.id ? "brand-weak" : "neutral-weak"} 
                border="neutral-medium"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedCategory(selectedCategory?.id === category.id ? null : category)}
              >
                <Column gap="s">
                  <Row justifyContent="space-between" alignItems="center">
                    <Text variant="body-strong-s">{category.name}</Text>
                    <Row gap="xs">
                      <Badge variant="neutral" size="xs">
                        {category.sports_applicable.length} sports
                      </Badge>
                      <Badge variant="brand" size="xs">
                        {category.keywords.length} keywords
                      </Badge>
                    </Row>
                  </Row>
                  
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {category.description}
                  </Text>
                  
                  <Row gap="xs" wrap>
                    <Text variant="body-default-xs" onBackground="neutral-weak">Keywords:</Text>
                    {category.keywords.slice(0, 5).map(keyword => (
                      <Badge key={keyword} variant="neutral" size="xs">
                        {keyword}
                      </Badge>
                    ))}
                    {category.keywords.length > 5 && (
                      <Badge variant="neutral" size="xs">+{category.keywords.length - 5} more</Badge>
                    )}
                  </Row>
                  
                  <Row gap="xs" wrap>
                    <Text variant="body-default-xs" onBackground="neutral-weak">Sports:</Text>
                    {category.sports_applicable.map(sport => (
                      <Badge key={sport} variant="brand" size="xs">
                        {sport}
                      </Badge>
                    ))}
                  </Row>
                </Column>
              </Card>
            ))}
          </Grid>
        </Column>
      </Card>

      {/* Analysis Section */}
      {selectedCategory && (
        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="m">
            <Text variant="heading-strong-s">Analyze: {selectedCategory.name}</Text>
            
            <Column gap="s">
              <Text variant="body-strong-s">Select Sports to Analyze (optional - defaults to applicable sports)</Text>
              <Row gap="xs" wrap>
                <Button
                  variant={selectedSports.length === 0 ? "primary" : "secondary"}
                  size="s"
                  onClick={() => setSelectedSports([])}
                >
                  Use Default ({selectedCategory.sports_applicable.length} sports)
                </Button>
                {SPORTS_OPTIONS.map(sport => (
                  <Button
                    key={sport}
                    variant={selectedSports.includes(sport) ? "primary" : "secondary"}
                    size="s"
                    onClick={() => toggleSportSelection(sport)}
                  >
                    {sport}
                  </Button>
                ))}
              </Row>
              
              {selectedSports.length > 0 && (
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  Will analyze: {selectedSports.join(', ')}
                </Text>
              )}
            </Column>
            
            <Row justifyContent="space-between" alignItems="center">
              <Text variant="body-default-s">
                Query: {selectedCategory.query_template}
              </Text>
              <Button 
                variant="primary" 
                size="s"
                onClick={() => analyzeCategory(selectedCategory, selectedSports)}
                disabled={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Run Analysis'}
              </Button>
            </Row>
          </Column>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <Column gap="m">
          <Text variant="heading-strong-s">Analysis Results</Text>
          
          {analysisResults.map((result, index) => (
            <Card key={index} padding="m" background="surface" border="neutral-medium">
              <Column gap="m">
                <Row justifyContent="space-between" alignItems="center">
                  <Column gap="xs">
                    <Text variant="heading-strong-s">{result.category}</Text>
                    <Row gap="xs" alignItems="center">
                      <Badge variant="brand" size="s">Category Analysis</Badge>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        {result.sports_analyzed.join(', ')}
                      </Text>
                      <Badge variant="neutral" size="s">
                        {result.total_sections_found} sections found
                      </Badge>
                    </Row>
                  </Column>
                  
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {new Date(result.timestamp).toLocaleString()}
                  </Text>
                </Row>
                
                <Text variant="body-default-s" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {result.analysis}
                </Text>
                
                {/* Sport-specific findings */}
                <Column gap="s">
                  <Text variant="body-strong-s">Findings by Sport</Text>
                  <Grid columns="1" gap="s">
                    {result.sport_findings.map(finding => (
                      <Card key={finding.sport} padding="s" background="neutral-weak" border="neutral-medium">
                        <Column gap="xs">
                          <Row justifyContent="space-between" alignItems="center">
                            <Text variant="body-strong-s">{finding.sport}</Text>
                            <Row gap="xs">
                              <Badge variant="neutral" size="xs">
                                {finding.sections_analyzed} sections
                              </Badge>
                              <Badge variant="brand" size="xs">
                                Score: {finding.relevance_score}
                              </Badge>
                            </Row>
                          </Row>
                          
                          {finding.top_sections.length > 0 && (
                            <Column gap="xs">
                              <Text variant="body-default-xs" onBackground="neutral-weak">
                                Top sections: {finding.top_sections.map(s => s.header).join(', ')}
                              </Text>
                            </Column>
                          )}
                        </Column>
                      </Card>
                    ))}
                  </Grid>
                </Column>
              </Column>
            </Card>
          ))}
        </Column>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card padding="m" background="surface" border="neutral-medium">
          <Row justifyContent="center" alignItems="center" gap="m">
            <Text variant="body-default-s">
              🤖 AI analyzing "{selectedCategory?.name}" across {selectedSports.length > 0 ? selectedSports.join(', ') : selectedCategory?.sports_applicable.join(', ')}...
            </Text>
          </Row>
        </Card>
      )}
    </Column>
  )
}