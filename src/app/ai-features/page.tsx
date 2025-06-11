'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NaturalLanguageSearch } from '@/components/ai/natural-language-search'
import { InventoryPredictions } from '@/components/ai/inventory-predictions'
import { ReportGenerator } from '@/components/ai/report-generator'
import { PineconeSearch } from '@/components/ai/pinecone-search'
import { Brain, Search, FileText, TrendingUp, Database } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function AIFeaturesPage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'search'

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-orbitron flex items-center gap-2">
          <Brain className="h-8 w-8" />
          AI Features
        </h1>
        <p className="text-muted-foreground mt-2">
          Leverage AI to automate tasks, gain insights, and make better decisions
        </p>
      </div>

      <Tabs defaultValue={tab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Natural Search
          </TabsTrigger>
          <TabsTrigger value="vector" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Vector Search
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Natural Language Search</h2>
            <p className="text-sm text-muted-foreground">
              Search your awards and invoices using natural language. Try queries like:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• &ldquo;Show me all pending awards from last month&rdquo;</li>
              <li>• &ldquo;Find invoices over $1000 from vendor XYZ&rdquo;</li>
              <li>• &ldquo;Which awards are running low on inventory?&rdquo;</li>
              <li>• &ldquo;List all delivered orders from this week&rdquo;</li>
            </ul>
          </div>
          <NaturalLanguageSearch />
        </TabsContent>

        <TabsContent value="vector" className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Vector Search with Pinecone</h2>
            <p className="text-sm text-muted-foreground">
              Semantic search using vector embeddings. Store and search through documents, text, and knowledge bases with AI-powered similarity matching.
            </p>
          </div>
          <PineconeSearch />
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Inventory Predictions</h2>
            <p className="text-sm text-muted-foreground">
              AI-powered predictions help you maintain optimal inventory levels by analyzing historical data and identifying trends.
            </p>
          </div>
          <InventoryPredictions 
            currentInventory={[]}
            historicalData={[]} // Would fetch from API
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Automated Reports</h2>
            <p className="text-sm text-muted-foreground">
              Generate comprehensive reports with AI-powered insights and recommendations.
            </p>
          </div>
          <ReportGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
}