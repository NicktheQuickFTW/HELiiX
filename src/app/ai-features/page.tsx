'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NaturalLanguageSearch } from '@/components/ai/natural-language-search'
import { InventoryPredictions } from '@/components/ai/inventory-predictions'
import { ReportGenerator } from '@/components/ai/report-generator'
import { createClient } from '@/lib/supabase'
import { Brain, Search, FileText, TrendingUp } from 'lucide-react'

export default function AIFeaturesPage() {
  const [awards, setAwards] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchAwards()
  }, [])

  async function fetchAwards() {
    const { data } = await supabase
      .from('awards')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setAwards(data)
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8" />
          AI Features
        </h1>
        <p className="text-muted-foreground mt-2">
          Leverage AI to automate tasks, gain insights, and make better decisions
        </p>
      </div>

      <Tabs defaultValue="search" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Natural Search
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
              <li>• "Show me all pending awards from last month"</li>
              <li>• "Find invoices over $1000 from vendor XYZ"</li>
              <li>• "Which awards are running low on inventory?"</li>
              <li>• "List all delivered orders from this week"</li>
            </ul>
          </div>
          <NaturalLanguageSearch />
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Inventory Predictions</h2>
            <p className="text-sm text-muted-foreground">
              AI-powered predictions help you maintain optimal inventory levels by analyzing historical data and identifying trends.
            </p>
          </div>
          <InventoryPredictions 
            currentInventory={awards}
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