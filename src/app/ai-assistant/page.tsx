'use client';

import { AppSidebar } from "@/components/navigation/AppSidebar"
import { SiteHeader } from "@/components/navigation/SiteHeader"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { HELiiXChat } from '@/components/ai/HeliixChat';
import { 
  Background, 
  Column, 
  Row, 
  Card, 
  Text, 
  Heading, 
  Flex, 
  Grid,
  Line,
  Icon
} from '@once-ui-system/core';
import { Brain, Sparkles, Globe, Zap, Search } from 'lucide-react';

export default function AIAssistantPage() {
  return (
    <Background background="page" fillWidth>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <Column fillWidth padding="l" gap="l">
            {/* Header */}
            <Column gap="s">
              <Row alignItems="center" gap="m">
                <Icon>
                  <Brain />
                </Icon>
                <Heading variant="display-strong-l">
                  HELiiX AI Assistant
                </Heading>
              </Row>
              <Text variant="body-default-l" onBackground="neutral-weak">
                Powered by the latest AI SDK with multiple AI providers
              </Text>
            </Column>
            
            <Line />

            {/* AI Providers Info */}
            <Grid columns="5" tabletColumns="2" mobileColumns="1" gap="m">
              <Card padding="m">
                <Column gap="s">
                  <Row alignItems="center" gap="xs">
                    <Icon size="s">
                      <Brain />
                    </Icon>
                    <Heading variant="label-default-s">
                      Claude (Anthropic)
                    </Heading>
                  </Row>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    Deep analysis & research
                  </Text>
                </Column>
              </Card>
              
              <Card padding="m">
                <Column gap="s">
                  <Row alignItems="center" gap="xs">
                    <Icon size="s">
                      <Sparkles />
                    </Icon>
                    <Heading variant="label-default-s">
                      GPT-4 (OpenAI)
                    </Heading>
                  </Row>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    Structured data analysis
                  </Text>
                </Column>
              </Card>
              
              <Card padding="m">
                <Column gap="s">
                  <Row alignItems="center" gap="xs">
                    <Icon size="s">
                      <Zap />
                    </Icon>
                    <Heading variant="label-default-s">
                      Gemini (Google)
                    </Heading>
                  </Row>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    Fast responses
                  </Text>
                </Column>
              </Card>
              
              <Card padding="m">
                <Column gap="s">
                  <Row alignItems="center" gap="xs">
                    <Icon size="s">
                      <Globe />
                    </Icon>
                    <Heading variant="label-default-s">
                      Perplexity
                    </Heading>
                  </Row>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    Real-time web search
                  </Text>
                </Column>
              </Card>
              
              <Card padding="m">
                <Column gap="s">
                  <Row alignItems="center" gap="xs">
                    <Icon size="s">
                      <Search />
                    </Icon>
                    <Heading variant="label-default-s">
                      Pinecone
                    </Heading>
                  </Row>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    Vector search & memory
                  </Text>
                </Column>
              </Card>
            </Grid>

            {/* Chat Interface */}
            <HELiiXChat />

            {/* Usage Examples */}
            <Card padding="l">
              <Column gap="m">
                <Column gap="s">
                  <Heading variant="label-default-m">Example Queries</Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Try these example questions to see the AI assistant in action
                  </Text>
                </Column>
                
                <Grid columns="2" tabletColumns="1" gap="l">
                  <Column gap="s">
                    <Heading variant="label-default-s">Scheduling & Operations</Heading>
                    <Column gap="xs">
                      <Text variant="body-default-s">• "What are the optimal dates for the Big 12 Basketball Championship?"</Text>
                      <Text variant="body-default-s">• "Analyze travel patterns for football teams this season"</Text>
                      <Text variant="body-default-s">• "Generate a conflict-free schedule for wrestling tournaments"</Text>
                    </Column>
                  </Column>
                  
                  <Column gap="s">
                    <Heading variant="label-default-s">Compliance & Intelligence</Heading>
                    <Column gap="xs">
                      <Text variant="body-default-s">• "What are the latest NIL policy updates?" (Web Search)</Text>
                      <Text variant="body-default-s">• "Summarize recent coaching changes in Big 12" (Research)</Text>
                      <Text variant="body-default-s">• "Check compliance status for all schools" (Analysis)</Text>
                    </Column>
                  </Column>
                </Grid>
              </Column>
            </Card>
          </Column>
        </SidebarInset>
      </SidebarProvider>
    </Background>
  );
}