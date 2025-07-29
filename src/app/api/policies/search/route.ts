import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q');
    const sport_code = searchParams.get('sport_code');
    const category = searchParams.get('category');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Use the search function we created in the migration
    const rpcQuery = supabase.rpc('search_policies', { search_term: query });

    // Apply additional filters if provided
    const { data, error } = await rpcQuery;

    if (error) {
      console.error('Error searching policies:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter results by sport_code or category if provided
    let filteredData = data;

    if (sport_code) {
      filteredData = data.filter(
        (policy: any) =>
          policy.sport_name?.toLowerCase().includes(sport_code.toLowerCase()) ||
          policy.applies_to_sports?.includes(sport_code)
      );
    }

    if (category) {
      filteredData = filteredData.filter(
        (policy: any) => policy.category === category
      );
    }

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Policy search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
