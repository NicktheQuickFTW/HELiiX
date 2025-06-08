'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface AutoCategorizeProps {
  name: string
  description?: string
  onCategorize: (category: string, tags: string[]) => void
}

export function AutoCategorize({ name, description, onCategorize }: AutoCategorizeProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleCategorize = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      })

      const data = await response.json()
      setResult(data)
      onCategorize(data.category, data.tags)
      
      toast.success('Award categorized', {
        description: `Category: ${data.category} (${Math.round(data.confidence * 100)}% confidence)`
      })
    } catch (error) {
      toast.error('Failed to categorize award')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCategorize}
        disabled={loading}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {loading ? 'Categorizing...' : 'Auto-categorize'}
      </Button>

      {result && (
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary">{result.category}</Badge>
          <Badge variant="outline">{result.subcategory}</Badge>
          {result.tags.map((tag: string) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      )}
    </div>
  )
}