import { NextRequest, NextResponse } from 'next/server';
import { XApiService } from '@/lib/services/x-api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const team = searchParams.get('team');
    const maxResults = parseInt(searchParams.get('limit') || '50');

    const xApi = new XApiService({
      bearerToken: process.env.X_BEARER_TOKEN,
      appKey: process.env.X_API_KEY,
      appSecret: process.env.X_API_SECRET,
      accessToken: process.env.X_ACCESS_TOKEN,
      accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
    });

    // Build search query
    let searchQuery = query || '';
    if (team && team !== 'all') {
      // Add team-specific handles to search
      const teamHandles = {
        Arizona: ['@ArizonaMBB', '@ArizonaWBB'],
        'Arizona State': ['@SunDevilHoops', '@SunDevilWBB'],
        Baylor: ['@BaylorMBB', '@BaylorWBB'],
        BYU: ['@BYUMBB', '@BYUWBB'],
        Cincinnati: ['@GoBearcatsMBB', '@GoBearcatsWBB'],
        Colorado: ['@CUBuffsMBB', '@CUBuffsWBB'],
        Houston: ['@UHCougarMBB', '@UHCougarWBB'],
        'Iowa State': ['@CycloneMBB', '@CycloneWBB'],
        Kansas: ['@KUHoops', '@KUWBasketball'],
        'Kansas State': ['@KStateMBB', '@KStateWBB'],
        'Oklahoma State': ['@OSUMBB', '@CowgirlHoops'],
        TCU: ['@TCUBasketball', '@TCUWomensHoops'],
        'Texas Tech': ['@TexasTechMBB', '@LadyRaidersBB'],
        UCF: ['@UCF_MBB', '@UCF_WBB'],
        Utah: ['@UtahMBB', '@UtahWBB'],
        'West Virginia': ['@WVUHoops', '@WVUWomensHoops'],
      };

      const handles = teamHandles[team as keyof typeof teamHandles];
      if (handles) {
        searchQuery = `(from:${handles.join(' OR from:')}) ${searchQuery}`;
      }
    }

    const { tweets, authors } = await xApi.searchBig12Basketball(
      searchQuery,
      maxResults
    );

    // Format response
    const timeline = tweets.map((tweet) => ({
      id: tweet.id,
      text: tweet.text,
      author: {
        id: tweet.author_id,
        ...authors.get(tweet.author_id),
      },
      created_at: tweet.created_at,
      metrics: tweet.public_metrics,
      entities: tweet.entities,
      priority: xApi.determinePriority(tweet),
    }));

    return NextResponse.json({
      timeline,
      count: timeline.length,
      query: searchQuery || 'Big 12 Basketball',
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('X API timeline error:', error);

    // Return mock data on error
    return NextResponse.json({
      timeline: [
        {
          id: 'mock_1',
          text: '🏀 Kansas remains undefeated at home this season! Rock Chalk! #Big12MBB',
          author: {
            id: 'ku_hoops',
            name: 'Kansas Basketball',
            username: 'KUHoops',
            verified: true,
          },
          created_at: new Date().toISOString(),
          metrics: {
            retweet_count: 234,
            reply_count: 56,
            like_count: 1823,
            quote_count: 34,
          },
          priority: 'medium',
        },
      ],
      count: 1,
      query: 'mock data',
      error: 'Using mock data',
      timestamp: new Date(),
    });
  }
}
