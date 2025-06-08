import { Pinecone } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_API_KEY) {
  throw new Error('PINECONE_API_KEY is required');
}

if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error('PINECONE_INDEX_NAME is required');
}

// Initialize Pinecone client
export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Get the index
export const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

// Vector operations helper functions
export const vectorOperations = {
  // Upsert vectors
  async upsert(vectors: Array<{
    id: string;
    values: number[];
    metadata?: Record<string, any>;
  }>) {
    try {
      await index.upsert(vectors);
      return { success: true };
    } catch (error) {
      console.error('Error upserting vectors:', error);
      throw error;
    }
  },

  // Query similar vectors
  async query(vector: number[], topK: number = 10, filter?: Record<string, any>) {
    try {
      const results = await index.query({
        vector,
        topK,
        filter,
        includeMetadata: true,
        includeValues: false
      });
      return results;
    } catch (error) {
      console.error('Error querying vectors:', error);
      throw error;
    }
  },

  // Delete vectors
  async delete(ids: string[]) {
    try {
      await index.deleteMany(ids);
      return { success: true };
    } catch (error) {
      console.error('Error deleting vectors:', error);
      throw error;
    }
  },

  // Get index stats
  async getStats() {
    try {
      const stats = await index.describeIndexStats();
      return stats;
    } catch (error) {
      console.error('Error getting index stats:', error);
      throw error;
    }
  },

  // Fetch vectors by ID
  async fetch(ids: string[]) {
    try {
      const results = await index.fetch(ids);
      return results;
    } catch (error) {
      console.error('Error fetching vectors:', error);
      throw error;
    }
  }
};

// Text embedding helper (requires OpenAI)
export async function createEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-3-small'
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

// Vector search with text
export async function searchSimilarText(
  query: string, 
  topK: number = 10, 
  filter?: Record<string, any>
) {
  const embedding = await createEmbedding(query);
  return vectorOperations.query(embedding, topK, filter);
}

// Store text with vector
export async function storeTextWithVector(
  id: string, 
  text: string, 
  metadata: Record<string, any> = {}
) {
  const embedding = await createEmbedding(text);
  return vectorOperations.upsert([{
    id,
    values: embedding,
    metadata: { text, ...metadata }
  }]);
}