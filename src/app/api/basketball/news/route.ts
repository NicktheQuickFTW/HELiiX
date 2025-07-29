import { NextRequest, NextResponse } from 'next/server';
import { XApiService } from '@/lib/services/x-api';
import { GrokAnalysisService } from '@/lib/services/grok-analysis';
import { BasketballNews } from '@/lib/db/basketball-news';

// In-memory cache (replace with Redis in production)
let newsCache: BasketballNews[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('refresh') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');
    const team = searchParams.get('team');
    const priority = searchParams.get('priority');

    // Check cache
    if (
      !forceRefresh &&
      newsCache.length > 0 &&
      Date.now() - lastFetchTime < CACHE_DURATION
    ) {
      return NextResponse.json({
        news: filterNews(newsCache, { category, team, priority }).slice(
          0,
          limit
        ),
        cached: true,
        timestamp: new Date(lastFetchTime),
      });
    }

    // Initialize services
    const xApi = new XApiService({
      bearerToken: process.env.X_BEARER_TOKEN,
      appKey: process.env.X_API_KEY,
      appSecret: process.env.X_API_SECRET,
      accessToken: process.env.X_ACCESS_TOKEN,
      accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
    });

    const grokAnalysis = new GrokAnalysisService({
      apiKey: process.env.GROK_API_KEY,
      apiUrl: process.env.GROK_API_URL,
      model: process.env.GROK_MODEL,
    });

    // Fetch tweets
    const { tweets, authors } = await xApi.searchBig12Basketball();

    // Process tweets
    const processedNews: BasketballNews[] = [];

    for (const tweet of tweets) {
      const author = authors.get(tweet.author_id);

      // Analyze with Grok
      const analysis = await grokAnalysis.analyzeTweet(
        tweet.text,
        author?.username || 'unknown'
      );

      const news: BasketballNews = {
        id: `news_${tweet.id}`,
        tweet_id: tweet.id,
        text: tweet.text,
        author_id: tweet.author_id,
        author_username: author?.username || 'unknown',
        author_name: author?.name || 'Unknown',
        author_verified: author?.verified || false,
        created_at: new Date(tweet.created_at),

        // Analysis results
        ...analysis,

        // Engagement metrics
        retweet_count: tweet.public_metrics?.retweet_count || 0,
        reply_count: tweet.public_metrics?.reply_count || 0,
        like_count: tweet.public_metrics?.like_count || 0,
        quote_count: tweet.public_metrics?.quote_count || 0,

        // Metadata
        hashtags: tweet.entities?.hashtags?.map((h: any) => h.tag) || [],
        mentions: tweet.entities?.mentions?.map((m: any) => m.username) || [],
        is_processed: true,
        processed_at: new Date(),
        notification_sent: false,
      };

      processedNews.push(news);
    }

    // Sort by priority and date
    processedNews.sort((a, b) => {
      if (a.priority !== b.priority) {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.created_at.getTime() - a.created_at.getTime();
    });

    // Update cache
    newsCache = processedNews;
    lastFetchTime = Date.now();

    // Return filtered results
    return NextResponse.json({
      news: filterNews(processedNews, { category, team, priority }).slice(
        0,
        limit
      ),
      cached: false,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error fetching basketball news:', error);

    // Return mock data if APIs fail
    const mockNews: BasketballNews[] = getMockNews();

    return NextResponse.json({
      news: mockNews,
      cached: false,
      error: 'Using mock data due to API error',
      timestamp: new Date(),
    });
  }
}

function filterNews(
  news: BasketballNews[],
  filters: {
    category?: string | null;
    team?: string | null;
    priority?: string | null;
  }
): BasketballNews[] {
  return news.filter((item) => {
    if (
      filters.category &&
      filters.category !== 'all' &&
      item.category !== filters.category
    ) {
      return false;
    }
    if (
      filters.team &&
      filters.team !== 'all' &&
      !item.teams_mentioned.includes(filters.team)
    ) {
      return false;
    }
    if (filters.priority && item.priority !== filters.priority) {
      return false;
    }
    return true;
  });
}

function getMockNews(): BasketballNews[] {
  return [
    {
      id: 'mock_1',
      tweet_id: '1',
      text: '🚨 BREAKING: Kansas star forward expected to miss 2-3 weeks with ankle injury suffered in practice today. #Big12MBB',
      author_id: 'ku_hoops',
      author_username: 'KUHoops',
      author_name: 'Kansas Basketball',
      author_verified: true,
      created_at: new Date(),
      category: 'injury',
      priority: 'high',
      sentiment: 'negative',
      teams_mentioned: ['Kansas'],
      key_events: ['ankle injury', '2-3 weeks'],
      action_required: true,
      summary: 'Kansas star forward injured, out 2-3 weeks',
      retweet_count: 156,
      reply_count: 42,
      like_count: 892,
      quote_count: 23,
      hashtags: ['Big12MBB'],
      mentions: [],
      is_processed: true,
      processed_at: new Date(),
      notification_sent: false,
    },
    {
      id: 'mock_2',
      tweet_id: '2',
      text: 'FINAL: Houston 78, Cincinnati 72 (OT)\n\nWhat a thriller! Cougars survive in overtime. #Big12MBB',
      author_id: 'uh_cougars',
      author_username: 'UHCougarMBB',
      author_name: 'Houston Basketball',
      author_verified: true,
      created_at: new Date(Date.now() - 3600000),
      category: 'game_update',
      priority: 'medium',
      sentiment: 'positive',
      teams_mentioned: ['Houston', 'Cincinnati'],
      key_events: ['overtime', 'final score'],
      action_required: false,
      summary: 'Houston defeats Cincinnati 78-72 in overtime',
      retweet_count: 89,
      reply_count: 31,
      like_count: 445,
      quote_count: 12,
      hashtags: ['Big12MBB'],
      mentions: [],
      is_processed: true,
      processed_at: new Date(),
      notification_sent: false,
    },
  ];
}
