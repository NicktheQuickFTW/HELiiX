'use client'

import { useState, useRef, useEffect } from 'react'
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

interface QueryMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  sources?: Array<{
    sport: string
    filename: string
    relevantSections: number
  }>
  mode?: string
  timestamp: Date
}

const QUERY_MODES = [
  { value: 'question', label: 'General Question', description: 'Ask any question about policies or procedures' },
  { value: 'comparison', label: 'Cross-Sport Comparison', description: 'Compare policies across different sports' },
  { value: 'summary', label: 'Policy Summary', description: 'Get organized summaries of complex policies' },
  { value: 'policy-analysis', label: 'Deep Analysis', description: 'Analyze implications and compliance requirements' }
]

const SPORTS_OPTIONS = [
  'Soccer', 'Volleyball', 'Football', 'Basketball', 'Wrestling', 
  'Baseball', 'Gymnastics', 'Softball', 'Tennis'
]

const EXAMPLE_QUERIES = [
  {
    question: "What are the weather postponement policies for outdoor sports?",
    sports: ['Soccer', 'Baseball', 'Softball'],
    mode: 'comparison'
  },
  {
    question: "How do officiating procedures differ between Football and Basketball?",
    sports: ['Football', 'Basketball'],
    mode: 'comparison'
  },
  {
    question: "What are the championship selection criteria for all sports?",
    sports: [],
    mode: 'summary'
  },
  {
    question: "Analyze the media timeout policies across basketball and football",
    sports: ['Football', 'Basketball'],
    mode: 'policy-analysis'
  }
]

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<QueryMessage[]>([])
  const [currentQuery, setCurrentQuery] = useState('')
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [selectedMode, setSelectedMode] = useState('question')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingResponse, setStreamingResponse] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingResponse])

  const handleSubmitQuery = async () => {
    if (!currentQuery.trim()) return

    const userMessage: QueryMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentQuery,
      mode: selectedMode,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setCurrentQuery('')

    try {
      const response = await fetch('/api/manuals/ai-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuery,
          sports: selectedSports.length > 0 ? selectedSports : undefined,
          mode: selectedMode,
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: QueryMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.answer,
        sources: data.sources,
        mode: data.mode,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Query error:', error)
      const errorMessage: QueryMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error processing your query. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleQuery = (example: any) => {
    setCurrentQuery(example.question)
    setSelectedSports(example.sports)
    setSelectedMode(example.mode)
  }

  const toggleSport = (sport: string) => {
    setSelectedSports(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    )
  }

  const clearConversation = () => {
    setMessages([])
    setStreamingResponse('')
  }

  return (
    <Column fillWidth gap="l" padding="xl">
      {/* Header */}
      <Row fillWidth justifyContent="space-between" alignItems="center">
        <Column gap="xs">
          <Heading variant="display-strong-s">AI Manual Assistant</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Ask questions, compare policies, and get insights from Big 12 administrative manuals
          </Text>
        </Column>
        <Button variant="secondary" size="s" onClick={clearConversation}>
          Clear Chat
        </Button>
      </Row>

      <Grid columns="1" gap="l">
        {/* Query Configuration */}
        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="m">
            <Text variant="heading-strong-s">Query Configuration</Text>
            
            {/* Mode Selection */}
            <Column gap="s">
              <Text variant="body-strong-s">Analysis Mode:</Text>
              <Row gap="xs" wrap>
                {QUERY_MODES.map(mode => (
                  <Button
                    key={mode.value}
                    variant={selectedMode === mode.value ? "primary" : "secondary"}
                    size="s"
                    onClick={() => setSelectedMode(mode.value)}
                  >
                    {mode.label}
                  </Button>
                ))}
              </Row>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {QUERY_MODES.find(m => m.value === selectedMode)?.description}
              </Text>
            </Column>

            {/* Sports Filter */}
            <Column gap="s">
              <Text variant="body-strong-s">Sports Filter (optional):</Text>
              <Row gap="xs" wrap>
                <Button
                  variant={selectedSports.length === 0 ? "primary" : "secondary"}
                  size="s"
                  onClick={() => setSelectedSports([])}
                >
                  All Sports
                </Button>
                {SPORTS_OPTIONS.map(sport => (
                  <Button
                    key={sport}
                    variant={selectedSports.includes(sport) ? "primary" : "secondary"}
                    size="s"
                    onClick={() => toggleSport(sport)}
                  >
                    {sport}
                  </Button>
                ))}
              </Row>
            </Column>
          </Column>
        </Card>

        {/* Example Queries */}
        {messages.length === 0 && (
          <Card padding="m" background="surface" border="neutral-medium">
            <Column gap="m">
              <Text variant="heading-strong-s">Example Queries</Text>
              <Grid columns="1" gap="s">
                {EXAMPLE_QUERIES.map((example, index) => (
                  <Card 
                    key={index} 
                    padding="s" 
                    background="neutral-weak" 
                    border="neutral-medium"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleExampleQuery(example)}
                  >
                    <Column gap="xs">
                      <Text variant="body-strong-s">{example.question}</Text>
                      <Row gap="xs" alignItems="center">
                        <Badge variant="brand" size="xs">{example.mode}</Badge>
                        {example.sports.length > 0 && (
                          <Text variant="body-default-xs" onBackground="neutral-weak">
                            Sports: {example.sports.join(', ')}
                          </Text>
                        )}
                      </Row>
                    </Column>
                  </Card>
                ))}
              </Grid>
            </Column>
          </Card>
        )}

        {/* Conversation */}
        {messages.length > 0 && (
          <Card padding="m" background="surface" border="neutral-medium">
            <Column gap="m">
              <Text variant="heading-strong-s">Conversation</Text>
              <Column gap="m" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {messages.map(message => (
                  <Card 
                    key={message.id}
                    padding="s" 
                    background={message.type === 'user' ? 'brand-weak' : 'neutral-weak'}
                    border="neutral-medium"
                  >
                    <Column gap="s">
                      <Row justifyContent="space-between" alignItems="center">
                        <Row gap="xs" alignItems="center">
                          <Badge 
                            variant={message.type === 'user' ? 'brand' : 'neutral'} 
                            size="xs"
                          >
                            {message.type === 'user' ? 'You' : 'AI Assistant'}
                          </Badge>
                          {message.mode && (
                            <Badge variant="neutral" size="xs">
                              {QUERY_MODES.find(m => m.value === message.mode)?.label}
                            </Badge>
                          )}
                        </Row>
                        <Text variant="body-default-xs" onBackground="neutral-weak">
                          {message.timestamp.toLocaleTimeString()}
                        </Text>
                      </Row>
                      
                      <Text variant="body-default-s" style={{ whiteSpace: 'pre-wrap' }}>
                        {message.content}
                      </Text>
                      
                      {message.sources && message.sources.length > 0 && (
                        <Column gap="xs">
                          <Text variant="body-strong-xs">Sources:</Text>
                          <Row gap="xs" wrap>
                            {message.sources.map((source, idx) => (
                              <Badge key={idx} variant="neutral" size="xs">
                                {source.sport} ({source.relevantSections} sections)
                              </Badge>
                            ))}
                          </Row>
                        </Column>
                      )}
                    </Column>
                  </Card>
                ))}
                
                {streamingResponse && (
                  <Card padding="s" background="neutral-weak" border="neutral-medium">
                    <Column gap="s">
                      <Row gap="xs" alignItems="center">
                        <Badge variant="neutral" size="xs">AI Assistant</Badge>
                        <Badge variant="brand" size="xs">Thinking...</Badge>
                      </Row>
                      <Text variant="body-default-s" style={{ whiteSpace: 'pre-wrap' }}>
                        {streamingResponse}
                      </Text>
                    </Column>
                  </Card>
                )}
                
                <div ref={messagesEndRef} />
              </Column>
            </Column>
          </Card>
        )}

        {/* Query Input */}
        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="m">
            <Text variant="heading-strong-s">Ask a Question</Text>
            <Column gap="s">
              <textarea
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                placeholder="Ask anything about Big 12 policies, procedures, or manual content..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  border: '1px solid var(--neutral-border-medium)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSubmitQuery()
                  }
                }}
              />
              
              <Row justifyContent="space-between" alignItems="center">
                <Row gap="xs" alignItems="center">
                  {selectedSports.length > 0 && (
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Filtering: {selectedSports.join(', ')}
                    </Text>
                  )}
                  <Badge variant="neutral" size="xs">
                    {QUERY_MODES.find(m => m.value === selectedMode)?.label}
                  </Badge>
                </Row>
                
                <Row gap="s">
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    Powered by Gemini Pro
                  </Text>
                  <Button 
                    variant="primary" 
                    size="s"
                    onClick={handleSubmitQuery}
                    disabled={!currentQuery.trim() || isLoading}
                  >
                    {isLoading ? 'Analyzing...' : 'Ask Question'}
                  </Button>
                </Row>
              </Row>
            </Column>
          </Column>
        </Card>

        {/* Capabilities */}
        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="m">
            <Text variant="heading-strong-s">AI Assistant Capabilities</Text>
            <Grid columns="2" gap="m">
              <Column gap="s">
                <Text variant="body-strong-s">🔍 Deep Research</Text>
                <Text variant="body-default-s">
                  Powered by Gemini Pro for comprehensive document analysis and cross-referencing across all Big 12 administrative manuals
                </Text>
              </Column>
              
              <Column gap="s">
                <Text variant="body-strong-s">⚖️ Policy Comparison</Text>
                <Text variant="body-default-s">
                  Compare policies, procedures, and requirements across different sports with detailed analysis of similarities and differences
                </Text>
              </Column>
              
              <Column gap="s">
                <Text variant="body-strong-s">📊 Pattern Analysis</Text>
                <Text variant="body-default-s">
                  Identify patterns, inconsistencies, and optimization opportunities across manual content with AI-powered insights
                </Text>
              </Column>
              
              <Column gap="s">
                <Text variant="body-strong-s">🎯 Contextual Answers</Text>
                <Text variant="body-default-s">
                  Get specific citations, operational implications, and actionable recommendations based on official manual content
                </Text>
              </Column>
            </Grid>
          </Column>
        </Card>
      </Grid>
    </Column>
  )
}