'use client';

import { useState } from 'react';
import { Card, Input, Button, Badge } from '@once-ui-system/core';
import { Search, Database, Upload, Trash2 } from 'lucide-react';

interface SearchResult {
  id: string;
  score: number;
  metadata: {
    text: string;
    [key: string]: any;
  };
}

export function PineconeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  // Search for similar vectors
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/pinecone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'search',
          query,
          topK: 10
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setResults(data.data.matches || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get index stats
  const handleGetStats = async () => {
    try {
      const response = await fetch('/api/pinecone?action=stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  // Store sample text
  const handleStoreSample = async () => {
    const sampleTexts = [
      { id: 'doc1', text: 'HELiiX is a logistics and operations management platform for Big 12 Conference sports.', category: 'platform' },
      { id: 'doc2', text: 'The dashboard provides real-time analytics and performance metrics for teams and events.', category: 'analytics' },
      { id: 'doc3', text: 'Awards tracking system manages trophies, medals, and recognition items inventory.', category: 'awards' },
      { id: 'doc4', text: 'Invoice processing uses AI to extract data and categorize expenses automatically.', category: 'finance' },
      { id: 'doc5', text: 'Sports scheduling optimization ensures minimal conflicts and optimal resource allocation.', category: 'scheduling' }
    ];

    for (const sample of sampleTexts) {
      try {
        await fetch('/api/pinecone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'store',
            id: sample.id,
            text: sample.text,
            metadata: { category: sample.category, timestamp: Date.now() }
          })
        });
      } catch (error) {
        console.error('Store error:', error);
      }
    }
    
    alert('Sample data stored successfully!');
    handleGetStats();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Pinecone Vector Search
          </CardTitle>
          <CardDescription>
            Semantic search through your knowledge base using vector embeddings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Interface */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter your search query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGetStats}>
              <Database className="h-4 w-4 mr-2" />
              Get Stats
            </Button>
            <Button variant="outline" onClick={handleStoreSample}>
              <Upload className="h-4 w-4 mr-2" />
              Store Sample Data
            </Button>
          </div>

          {/* Index Stats */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Index Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Total Vectors</div>
                    <div className="text-muted-foreground">{stats.totalVectorCount || 0}</div>
                  </div>
                  <div>
                    <div className="font-medium">Dimension</div>
                    <div className="text-muted-foreground">{stats.dimension || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="font-medium">Index Fullness</div>
                    <div className="text-muted-foreground">{((stats.indexFullness || 0) * 100).toFixed(2)}%</div>
                  </div>
                  <div>
                    <div className="font-medium">Namespaces</div>
                    <div className="text-muted-foreground">{Object.keys(stats.namespaces || {}).length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Search Results */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Search Results</h3>
            {results.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No results found. Try searching for something or store sample data first.
              </p>
            ) : (
              results.map((result, index) => (
                <Card key={result.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-xs">
                        Score: {result.score.toFixed(4)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {result.metadata.category || 'general'}
                      </Badge>
                    </div>
                    <p className="text-sm">{result.metadata.text}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      ID: {result.id}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}