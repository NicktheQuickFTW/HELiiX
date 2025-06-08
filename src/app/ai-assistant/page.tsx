'use client';

import { HELiiXChat } from '@/components/ai/heliix-chat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Sparkles, Globe, Zap, Search } from 'lucide-react';

export default function AIAssistantPage() {
  return (
    <div className="container py-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8" />
          HELiiX AI Assistant
        </h1>
        <p className="text-muted-foreground mt-2">
          Powered by the latest AI SDK with multiple AI providers
        </p>
      </div>

      {/* AI Providers Info */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Claude (Anthropic)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Deep analysis & research</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              GPT-4 (OpenAI)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Structured data analysis</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Gemini (Google)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Fast responses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Perplexity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Real-time web search</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4" />
              Pinecone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Vector search & memory</p>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <HELiiXChat />

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Example Queries</CardTitle>
          <CardDescription>
            Try these example questions to see the AI assistant in action
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Scheduling & Operations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• "What are the optimal dates for the Big 12 Basketball Championship?"</li>
                <li>• "Analyze travel patterns for football teams this season"</li>
                <li>• "Generate a conflict-free schedule for wrestling tournaments"</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Compliance & Intelligence</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• "What are the latest NIL policy updates?" (Web Search)</li>
                <li>• "Summarize recent coaching changes in Big 12" (Research)</li>
                <li>• "Check compliance status for all schools" (Analysis)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}