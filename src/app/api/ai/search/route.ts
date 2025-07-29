import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
  try {
    const { query, type = 'all' } = await req.json();

    // Generate embedding for the search query
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: query,
    });

    // Convert query to structured search parameters
    const searchParams = await analyzeQuery(query);

    const results = { awards: [], invoices: [] };

    // Search awards
    if (type === 'all' || type === 'awards') {
      const awardsQuery = supabase.from('awards').select('*');

      if (searchParams.status) {
        awardsQuery.eq('status', searchParams.status);
      }
      if (searchParams.dateRange) {
        awardsQuery.gte('created_at', searchParams.dateRange.start);
        awardsQuery.lte('created_at', searchParams.dateRange.end);
      }

      const { data: awards } = await awardsQuery;

      // Semantic search on names and descriptions
      if (awards) {
        results.awards = awards.filter((award) => {
          const text = `${award.name} ${award.description || ''}`.toLowerCase();
          return (
            text.includes(query.toLowerCase()) ||
            calculateSimilarity(text, query) > 0.7
          );
        });
      }
    }

    // Search invoices
    if (type === 'all' || type === 'invoices') {
      const invoicesQuery = supabase.from('invoices').select('*');

      if (searchParams.vendor) {
        invoicesQuery.ilike('vendor_name', `%${searchParams.vendor}%`);
      }
      if (searchParams.amountRange) {
        invoicesQuery.gte('amount', searchParams.amountRange.min * 100);
        invoicesQuery.lte('amount', searchParams.amountRange.max * 100);
      }

      const { data: invoices } = await invoicesQuery;

      if (invoices) {
        results.invoices = invoices;
      }
    }

    return Response.json({
      query,
      interpretation: searchParams.interpretation,
      results,
      totalResults: results.awards.length + results.invoices.length,
    });
  } catch (error) {
    return Response.json({ error: 'Search failed' }, { status: 500 });
  }
}

async function analyzeQuery(query: string) {
  const result = await openai('gpt-4-turbo').doGenerate({
    prompt: `Analyze this search query and extract relevant parameters:
      Query: "${query}"
      
      Extract:
      - Type of search (awards, invoices, or both)
      - Status filter if mentioned
      - Date range if mentioned
      - Vendor name if mentioned
      - Amount range if mentioned
      - Natural language interpretation
      
      Return as JSON.`,
  });

  return JSON.parse(result.text || '{}');
}

function calculateSimilarity(text1: string, text2: string): number {
  // Simple similarity calculation (can be improved with better algorithms)
  const words1 = text1.toLowerCase().split(' ');
  const words2 = text2.toLowerCase().split(' ');
  const intersection = words1.filter((word) => words2.includes(word));
  return intersection.length / Math.max(words1.length, words2.length);
}
