'use client';

import { useChat } from '@ai-sdk/react';
import { 
  Button, 
  Input, 
  Card, 
  Dropdown, 
  Option, 
  Column, 
  Row, 
  Heading, 
  Text, 
  Icon,
  AutoScroll
} from '@once-ui-system/core';
import { Brain, Send } from 'lucide-react';
import { useState } from 'react';

export function HELiiXChat() {
  const [task, setTask] = useState<'research' | 'analysis' | 'creative' | 'fast' | 'web-search'>('analysis');
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
    body: { task },
  });

  return (
    <Card padding="l" fillWidth>
      <Column gap="l">
        {/* Header */}
        <Column gap="m">
          <Row alignItems="center" gap="s">
            <Icon>
              <Brain />
            </Icon>
            <Heading variant="label-default-l">
              HELiiX AI Assistant
            </Heading>
          </Row>
          
          <Row alignItems="center" gap="s">
            <Text variant="body-default-s" onBackground="neutral-weak">
              Model Task:
            </Text>
            <Dropdown
              value={task}
              onValueChange={(value) => setTask(value as typeof task)}
            >
              <Option value="research">Research (Claude Opus)</Option>
              <Option value="analysis">Analysis (GPT-4)</Option>
              <Option value="creative">Creative (Claude Sonnet)</Option>
              <Option value="fast">Fast Response (Gemini)</Option>
              <Option value="web-search">Web Search (Perplexity)</Option>
            </Dropdown>
          </Row>
        </Column>

        {/* Messages */}
        <AutoScroll style={{ height: '400px' }}>
          <Column gap="m" padding="s">
            {messages.map((message) => (
              <Row
                key={message.id}
                justifyContent={message.role === 'user' ? 'end' : 'start'}
                fillWidth
              >
                <Card
                  padding="m"
                  background={message.role === 'user' ? 'brand-strong' : 'surface'}
                  style={{ 
                    maxWidth: '80%',
                    color: message.role === 'user' ? 'var(--brand-on-background-strong)' : undefined
                  }}
                >
                  <Text 
                    variant="body-default-s" 
                    style={{ 
                      whiteSpace: 'pre-wrap',
                      color: message.role === 'user' ? 'var(--brand-on-background-strong)' : undefined
                    }}
                  >
                    {message.content}
                  </Text>
                </Card>
              </Row>
            ))}
            
            {messages.length === 0 && (
              <Column alignItems="center" justifyContent="center" gap="s" style={{ height: '200px' }}>
                <Icon size="l" onBackground="neutral-weak">
                  <Brain />
                </Icon>
                <Text variant="body-default-m" onBackground="neutral-weak" align="center">
                  Start a conversation with the HELiiX AI Assistant
                </Text>
                <Text variant="body-default-s" onBackground="neutral-weak" align="center">
                  Ask about Big 12 operations, scheduling, compliance, or any other questions
                </Text>
              </Column>
            )}
          </Column>
        </AutoScroll>
        
        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          <Row gap="s" fillWidth>
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about Big 12 operations, scheduling, compliance..."
              disabled={isLoading}
              style={{ flex: 1 }}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              variant="primary"
            >
              <Icon>
                <Send />
              </Icon>
            </Button>
          </Row>
        </form>
      </Column>
    </Card>
  );
}