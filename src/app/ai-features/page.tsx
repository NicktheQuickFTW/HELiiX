'use client'

import { SegmentedControl, Card, Heading, Text, Flex } from '@once-ui-system/core'
import { NaturalLanguageSearch } from '@/components/ai/NaturalLanguageSearch'
import { InventoryPredictions } from '@/components/ai/InventoryPredictions'
import { ReportGenerator } from '@/components/ai/ReportGenerator'
import { PineconeSearch } from '@/components/ai/PineconeSearch'
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

      <SegmentedControl 
        defaultValue={tab} 
        className="space-y-4"
        options={[
          { label: "Natural Search", value: "search" },
          { label: "Vector Search", value: "vector" },
          { label: "Predictions", value: "predictions" },
          { label: "Reports", value: "reports" }
        ]}
      />

        {tab === 'search' && (
          <Flex direction="column" gap="m">
            <Card padding="m">
              <Heading variant="label-default-m" marginBottom="s">Natural Language Search</Heading>
              <Text variant="body-default-s" marginBottom="s">
                Search your awards and invoices using natural language. Try queries like:
              </Text>
              <Flex direction="column" gap="xs">
                <Text variant="body-default-s">• &ldquo;Show me all pending awards from last month&rdquo;</Text>
                <Text variant="body-default-s">• &ldquo;Find invoices over $1000 from vendor XYZ&rdquo;</Text>
                <Text variant="body-default-s">• &ldquo;Which awards are running low on inventory?&rdquo;</Text>
                <Text variant="body-default-s">• &ldquo;List all delivered orders from this week&rdquo;</Text>
              </Flex>
            </Card>
            <NaturalLanguageSearch />
          </Flex>
        )}

        {tab === 'vector' && (
          <Flex direction="column" gap="m">
            <Card padding="m">
              <Heading variant="label-default-m" marginBottom="s">Vector Search with Pinecone</Heading>
              <Text variant="body-default-s">
                Semantic search using vector embeddings. Store and search through documents, text, and knowledge bases with AI-powered similarity matching.
              </Text>
            </Card>
            <PineconeSearch />
          </Flex>
        )}

        {tab === 'predictions' && (
          <Flex direction="column" gap="m">
            <Card padding="m">
              <Heading variant="label-default-m" marginBottom="s">Inventory Predictions</Heading>
              <Text variant="body-default-s">
                AI-powered predictions help you maintain optimal inventory levels by analyzing historical data and identifying trends.
              </Text>
            </Card>
            <InventoryPredictions 
              currentInventory={[]}
              historicalData={[]} // Would fetch from API
            />
          </Flex>
        )}

        {tab === 'reports' && (
          <Flex direction="column" gap="m">
            <Card padding="m">
              <Heading variant="label-default-m" marginBottom="s">Automated Reports</Heading>
              <Text variant="body-default-s">
                Generate comprehensive reports with AI-powered insights and recommendations.
              </Text>
            </Card>
            <ReportGenerator />
          </Flex>
        )}
    </div>
  )
}