'use client'

import { useState } from 'react'
import { Input, Button, Card } from '@once-ui-system/core'
import { Search, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface NaturalLanguageSearchProps {
  onResultsFound?: (results: any) => void
}

export function NaturalLanguageSearch({ onResultsFound }: NaturalLanguageSearchProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })

      const data = await response.json()
      setResults(data)
      onResultsFound?.(data.results)
      
      toast.success(`Found ${data.totalResults} results`, {
        description: data.interpretation
      })
    } catch (error) {
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search naturally... e.g., 'Show me all pending awards from last month'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          <Sparkles className="h-4 w-4 mr-2" />
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {results && (
        <div className="space-y-4">
          {/* Search interpretation */}
          {results.interpretation && (
            <Card className="p-3 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Understanding:</span> {results.interpretation}
              </p>
            </Card>
          )}

          {/* Results summary */}
          <div className="grid grid-cols-2 gap-4">
            {results.results.awards?.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Awards ({results.results.awards.length})</h3>
                <ul className="space-y-1">
                  {results.results.awards.slice(0, 5).map((award: any) => (
                    <li key={award.id} className="text-sm">
                      • {award.name} - {award.status}
                    </li>
                  ))}
                  {results.results.awards.length > 5 && (
                    <li className="text-sm text-muted-foreground">
                      ...and {results.results.awards.length - 5} more
                    </li>
                  )}
                </ul>
              </Card>
            )}

            {results.results.invoices?.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Invoices ({results.results.invoices.length})</h3>
                <ul className="space-y-1">
                  {results.results.invoices.slice(0, 5).map((invoice: any) => (
                    <li key={invoice.id} className="text-sm">
                      • #{invoice.invoice_number} - ${(invoice.amount / 100).toFixed(2)}
                    </li>
                  ))}
                  {results.results.invoices.length > 5 && (
                    <li className="text-sm text-muted-foreground">
                      ...and {results.results.invoices.length - 5} more
                    </li>
                  )}
                </ul>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}