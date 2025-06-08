import { NextRequest, NextResponse } from 'next/server';
import { vectorOperations, searchSimilarText, storeTextWithVector } from '@/lib/pinecone';

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json();

    switch (action) {
      case 'search':
        const { query, topK = 10, filter } = params;
        const searchResults = await searchSimilarText(query, topK, filter);
        return NextResponse.json({ success: true, data: searchResults });

      case 'store':
        const { id, text, metadata = {} } = params;
        await storeTextWithVector(id, text, metadata);
        return NextResponse.json({ success: true, message: 'Text stored successfully' });

      case 'upsert':
        const { vectors } = params;
        await vectorOperations.upsert(vectors);
        return NextResponse.json({ success: true, message: 'Vectors upserted successfully' });

      case 'delete':
        const { ids } = params;
        await vectorOperations.delete(ids);
        return NextResponse.json({ success: true, message: 'Vectors deleted successfully' });

      case 'stats':
        const stats = await vectorOperations.getStats();
        return NextResponse.json({ success: true, data: stats });

      case 'fetch':
        const { fetchIds } = params;
        const fetchResults = await vectorOperations.fetch(fetchIds);
        return NextResponse.json({ success: true, data: fetchResults });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Pinecone API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'stats') {
      const stats = await vectorOperations.getStats();
      return NextResponse.json({ success: true, data: stats });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action for GET request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Pinecone GET API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}