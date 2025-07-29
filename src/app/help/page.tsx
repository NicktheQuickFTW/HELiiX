'use client';

import { AppSidebar } from '@/components/navigation/AppSidebar';
import { SiteHeader } from '@/components/navigation/SiteHeader';

import {
  HelpCircle,
  Book,
  MessageCircle,
  Video,
  ExternalLink,
} from 'lucide-react';
import {
  Button,
  Card,
  Column,
  Divider,
  Heading,
  Text,
} from '@once-ui-system/core';

export default function HelpPage() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <HelpCircle className="h-8 w-8" />
                Help & Support
              </h1>
              <p className="text-muted-foreground mt-2">
                Get help with HELiiX platform features and operations
              </p>
            </div>
          </div>

          <Divider className="mb-6" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Documentation */}
            <Card>
              <Column gap="xs">
                <Heading
                  variant="heading-sm"
                  className="flex items-center gap-2"
                >
                  <Book className="h-5 w-5" />
                  Documentation
                </Heading>
                <Text variant="body-sm" muted>
                  Comprehensive guides and references
                </Text>
              </Column>
              <Column className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Getting Started Guide
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  AI Features Guide
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  API Documentation
                </Button>
              </Column>
            </Card>

            {/* Video Tutorials */}
            <Card>
              <Column gap="xs">
                <Heading
                  variant="heading-sm"
                  className="flex items-center gap-2"
                >
                  <Video className="h-5 w-5" />
                  Video Tutorials
                </Heading>
                <Text variant="body-sm" muted>
                  Step-by-step video guides
                </Text>
              </Column>
              <Column className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Platform Overview
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  FlexTime Scheduling
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  AI Assistant Usage
                </Button>
              </Column>
            </Card>

            {/* Support */}
            <Card>
              <Column gap="xs">
                <Heading
                  variant="heading-sm"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Support
                </Heading>
                <Text variant="body-sm" muted>
                  Get help from our support team
                </Text>
              </Column>
              <Column className="space-y-3">
                <Button className="w-full">Contact Support</Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Community Forum
                </Button>
              </Column>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="mt-6">
            <Column gap="xs">
              <Heading variant="heading-sm">Frequently Asked Questions</Heading>
              <Text variant="body-sm" muted>
                Common questions about HELiiX platform
              </Text>
            </Column>
            <Column>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">
                    How do I access FlexTime scheduling?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    FlexTime scheduling runs as a separate application. Use the
                    links in the sidebar under "FlexTime Scheduling" to access
                    the schedule builder and analytics.
                  </p>
                </div>
                <Divider />
                <div>
                  <h4 className="font-medium mb-2">
                    Which AI models are available?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    HELiiX supports multiple AI providers: Claude (Anthropic),
                    GPT-4 (OpenAI), Gemini (Google), and Perplexity for web
                    search. Each model is optimized for different tasks.
                  </p>
                </div>
                <Divider />
                <div>
                  <h4 className="font-medium mb-2">
                    How do I manage awards inventory?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Navigate to Dashboard → Awards tab to view and manage your
                    awards inventory. You can track stock levels, recipients,
                    and order status.
                  </p>
                </div>
              </div>
            </Column>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
