'use client';

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Book, MessageCircle, Video, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function HelpPage() {
  return (
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
          
          <Separator className="mb-6" />
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Documentation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Documentation
                </CardTitle>
                <CardDescription>
                  Comprehensive guides and references
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
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
              </CardContent>
            </Card>

            {/* Video Tutorials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Tutorials
                </CardTitle>
                <CardDescription>
                  Step-by-step video guides
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
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
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Support
                </CardTitle>
                <CardDescription>
                  Get help from our support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Community Forum
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions about HELiiX platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">How do I access FlexTime scheduling?</h4>
                  <p className="text-sm text-muted-foreground">
                    FlexTime scheduling runs as a separate application. Use the links in the sidebar under "FlexTime Scheduling" to access the schedule builder and analytics.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Which AI models are available?</h4>
                  <p className="text-sm text-muted-foreground">
                    HELiiX supports multiple AI providers: Claude (Anthropic), GPT-4 (OpenAI), Gemini (Google), and Perplexity for web search. Each model is optimized for different tasks.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">How do I manage awards inventory?</h4>
                  <p className="text-sm text-muted-foreground">
                    Navigate to Dashboard → Awards tab to view and manage your awards inventory. You can track stock levels, recipients, and order status.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}