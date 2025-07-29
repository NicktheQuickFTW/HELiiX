/**
 * X (Twitter) API Integration for Big 12 Conference
 * Handles real-time sports updates, social sentiment, and conference news
 */

import { BIG12_TEAMS } from './big12-schools';

// X API v2 endpoints
const X_API_BASE_URL = 'https://api.twitter.com/2';

// Search terms for Big 12 content
const BIG12_SEARCH_TERMS = [
  'Big12',
  'Big 12',
  'Big12Conference',
  'Big12Sports',
  '#Big12',
  '#Big12FB',
  '#Big12MBB',
  '#Big12WBB',
];

// Team hashtags and handles
export const TEAM_SOCIAL_HANDLES = {
  ARIZONA: { handle: '@ArizonaAthletics', hashtags: ['#BearDown'] },
  ARIZONA_STATE: { handle: '@TheSunDevils', hashtags: ['#ForksUp'] },
  BAYLOR: { handle: '@BaylorAthletics', hashtags: ['#SicEm'] },
  BYU: { handle: '@BYUCougars', hashtags: ['#GoCougs', '#BYUFootball'] },
  CINCINNATI: { handle: '@GoBEARCATS', hashtags: ['#Bearcats'] },
  COLORADO: { handle: '@CUBuffs', hashtags: ['#GoBuffs', '#SkoBuffs'] },
  HOUSTON: { handle: '@UHCougarFB', hashtags: ['#GoCoogs'] },
  IOWA_STATE: { handle: '@CycloneATH', hashtags: ['#Cyclones'] },
  KANSAS: { handle: '@KUAthletics', hashtags: ['#RockChalk'] },
  KANSAS_STATE: { handle: '@KStateFB', hashtags: ['#EMAW'] },
  OKLAHOMA_STATE: { handle: '@OSUAthletics', hashtags: ['#GoPokes'] },
  TCU: { handle: '@TCUAthletics', hashtags: ['#GoFrogs'] },
  TEXAS_TECH: { handle: '@TexasTechFB', hashtags: ['#WreckEm'] },
  UCF: { handle: '@UCF_Football', hashtags: ['#GoKnights'] },
  UTAH: { handle: '@Utah_Football', hashtags: ['#GoUtes'] },
  WEST_VIRGINIA: { handle: '@WVUfootball', hashtags: ['#HailWV'] },
};

export interface XPost {
  id: string;
  text: string;
  author_id: string;
  author_name?: string;
  author_username?: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  referenced_tweets?: Array<{
    type: 'retweeted' | 'quoted' | 'replied_to';
    id: string;
  }>;
  entities?: {
    hashtags?: Array<{ tag: string }>;
    mentions?: Array<{ username: string }>;
    urls?: Array<{ url: string; expanded_url: string }>;
  };
  media?: Array<{
    type: 'photo' | 'video' | 'animated_gif';
    url: string;
    preview_image_url?: string;
  }>;
}

export interface XSearchResult {
  posts: XPost[];
  next_token?: string;
  result_count: number;
}

export interface XStreamRule {
  id?: string;
  value: string;
  tag?: string;
}

export class XAPIClient {
  private bearerToken: string;
  private apiKey: string;
  private apiSecret: string;
  private accessToken: string;
  private accessTokenSecret: string;
  private isDemo: boolean;

  constructor() {
    this.bearerToken = process.env.X_BEARER_TOKEN || '';
    this.apiKey = process.env.X_API_KEY || '';
    this.apiSecret = process.env.X_API_SECRET || '';
    this.accessToken = process.env.X_ACCESS_TOKEN || '';
    this.accessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET || '';
    this.isDemo = !this.bearerToken;

    if (this.isDemo) {
      console.warn('X API running in demo mode - using mock data');
    }
  }

  /**
   * Search for tweets related to Big 12 sports
   */
  async searchBig12Tweets(
    options: {
      query?: string;
      sport?: 'football' | 'basketball' | 'all';
      team?: keyof typeof BIG12_TEAMS;
      maxResults?: number;
      nextToken?: string;
    } = {}
  ): Promise<XSearchResult> {
    const { query, sport = 'all', team, maxResults = 10, nextToken } = options;

    // Build search query
    let searchQuery = query || '';

    // Add Big 12 terms if no specific query
    if (!query) {
      searchQuery = BIG12_SEARCH_TERMS.join(' OR ');
    }

    // Add sport-specific terms
    if (sport === 'football') {
      searchQuery += ' (#Big12FB OR "Big 12 Football")';
    } else if (sport === 'basketball') {
      searchQuery += ' (#Big12MBB OR #Big12WBB OR "Big 12 Basketball")';
    }

    // Add team-specific terms
    if (team && TEAM_SOCIAL_HANDLES[team]) {
      const teamData = TEAM_SOCIAL_HANDLES[team];
      searchQuery += ` (${teamData.handle} OR ${teamData.hashtags.join(' OR ')})`;
    }

    // Add filters
    searchQuery += ' -is:retweet lang:en';

    const params = new URLSearchParams({
      query: searchQuery,
      max_results: maxResults.toString(),
      'tweet.fields':
        'author_id,created_at,public_metrics,referenced_tweets,entities',
      'user.fields': 'name,username,profile_image_url',
      'media.fields': 'type,url,preview_image_url',
      expansions: 'author_id,attachments.media_keys',
    });

    if (nextToken) {
      params.append('next_token', nextToken);
    }

    if (this.isDemo) {
      // Return mock data for demo
      return this.getMockSearchResults(searchQuery, maxResults);
    }

    try {
      const response = await fetch(
        `${X_API_BASE_URL}/tweets/search/recent?${params}`,
        {
          headers: {
            Authorization: `Bearer ${this.bearerToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `X API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return this.parseSearchResults(data);
    } catch (error) {
      console.error('Error searching X posts:', error);
      // Return mock data as fallback
      return this.getMockSearchResults(searchQuery, maxResults);
    }
  }

  /**
   * Get live game updates from X
   */
  async getLiveGameUpdates(
    homeTeam: keyof typeof BIG12_TEAMS,
    awayTeam: keyof typeof BIG12_TEAMS,
    sport: 'football' | 'basketball'
  ): Promise<XPost[]> {
    const homeData = TEAM_SOCIAL_HANDLES[homeTeam];
    const awayData = TEAM_SOCIAL_HANDLES[awayTeam];

    const query = `(${homeData.handle} OR ${awayData.handle} OR ${homeData.hashtags.join(' OR ')} OR ${awayData.hashtags.join(' OR ')}) (score OR touchdown OR field goal OR basket OR final)`;

    const result = await this.searchBig12Tweets({
      query,
      sport,
      maxResults: 50,
    });

    return result.posts;
  }

  /**
   * Get conference announcements and news
   */
  async getConferenceNews(maxResults: number = 20): Promise<XPost[]> {
    const officialAccounts = [
      '@Big12Conference',
      '@Brett_McMurphy',
      '@ESPNBig12',
    ];

    const query = `(from:${officialAccounts.join(' OR from:')}) OR @Big12Conference`;

    const result = await this.searchBig12Tweets({
      query,
      maxResults,
    });

    return result.posts;
  }

  /**
   * Analyze social sentiment for a team or game
   */
  async analyzeSentiment(posts: XPost[]): Promise<{
    positive: number;
    negative: number;
    neutral: number;
    engagement: number;
  }> {
    // Simple sentiment analysis based on engagement metrics
    // In production, you'd use a proper NLP service

    let totalEngagement = 0;
    let positiveSignals = 0;
    let negativeSignals = 0;

    posts.forEach((post) => {
      const engagement =
        post.public_metrics.like_count +
        post.public_metrics.retweet_count +
        post.public_metrics.quote_count;

      totalEngagement += engagement;

      // Simple heuristic: high likes = positive
      if (
        post.public_metrics.like_count >
        post.public_metrics.reply_count * 2
      ) {
        positiveSignals++;
      } else if (
        post.public_metrics.reply_count > post.public_metrics.like_count
      ) {
        negativeSignals++;
      }
    });

    const total = posts.length;
    const positive = (positiveSignals / total) * 100;
    const negative = (negativeSignals / total) * 100;
    const neutral = 100 - positive - negative;

    return {
      positive: Math.round(positive),
      negative: Math.round(negative),
      neutral: Math.round(neutral),
      engagement: Math.round(totalEngagement / total),
    };
  }

  /**
   * Set up filtered stream rules for real-time updates
   */
  async setupStreamRules(): Promise<void> {
    // Get current rules
    const currentRules = await this.getStreamRules();

    // Delete existing rules
    if (currentRules.length > 0) {
      await this.deleteStreamRules(currentRules.map((r) => r.id!));
    }

    // Add new rules for Big 12 content
    const rules: XStreamRule[] = [
      {
        value: '@Big12Conference OR #Big12',
        tag: 'big12-general',
      },
      {
        value: '#Big12FB OR #Big12MBB OR #Big12WBB',
        tag: 'big12-sports',
      },
      ...Object.entries(TEAM_SOCIAL_HANDLES).map(([team, data]) => ({
        value: `${data.handle} OR ${data.hashtags.join(' OR ')}`,
        tag: `team-${team.toLowerCase()}`,
      })),
    ];

    await this.addStreamRules(rules);
  }

  private async getStreamRules(): Promise<XStreamRule[]> {
    const response = await fetch(
      `${X_API_BASE_URL}/tweets/search/stream/rules`,
      {
        headers: {
          Authorization: `Bearer ${this.bearerToken}`,
        },
      }
    );

    const data = await response.json();
    return data.data || [];
  }

  private async deleteStreamRules(ids: string[]): Promise<void> {
    await fetch(`${X_API_BASE_URL}/tweets/search/stream/rules`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        delete: { ids },
      }),
    });
  }

  private async addStreamRules(rules: XStreamRule[]): Promise<void> {
    await fetch(`${X_API_BASE_URL}/tweets/search/stream/rules`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        add: rules,
      }),
    });
  }

  private parseSearchResults(data: any): XSearchResult {
    const posts: XPost[] = [];
    const tweets = data.data || [];
    const users = data.includes?.users || [];
    const media = data.includes?.media || [];

    // Create user map
    const userMap = new Map(users.map((u: any) => [u.id, u]));
    const mediaMap = new Map(media.map((m: any) => [m.media_key, m]));

    tweets.forEach((tweet: any) => {
      const author = userMap.get(tweet.author_id);
      const mediaKeys = tweet.attachments?.media_keys || [];
      const tweetMedia = mediaKeys
        .map((key: string) => mediaMap.get(key))
        .filter(Boolean);

      posts.push({
        id: tweet.id,
        text: tweet.text,
        author_id: tweet.author_id,
        author_name: author?.name,
        author_username: author?.username,
        created_at: tweet.created_at,
        public_metrics: tweet.public_metrics,
        referenced_tweets: tweet.referenced_tweets,
        entities: tweet.entities,
        media: tweetMedia,
      });
    });

    return {
      posts,
      next_token: data.meta?.next_token,
      result_count: data.meta?.result_count || 0,
    };
  }

  /**
   * Generate mock search results for demo
   */
  private getMockSearchResults(
    query: string,
    maxResults: number
  ): XSearchResult {
    const mockPosts: XPost[] = [
      {
        id: '1',
        text: 'Incredible comeback by @KUAthletics! Rock Chalk! #Big12MBB',
        author_id: '123',
        author_name: 'Big 12 Conference',
        author_username: 'Big12Conference',
        created_at: new Date().toISOString(),
        public_metrics: {
          retweet_count: 245,
          reply_count: 89,
          like_count: 1523,
          quote_count: 34,
        },
        entities: {
          hashtags: [{ tag: 'Big12MBB' }],
          mentions: [{ username: 'KUAthletics' }],
        },
      },
      {
        id: '2',
        text: 'TCU stuns Oklahoma State in overtime! What a finish! #GoFrogs #Big12FB',
        author_id: '124',
        author_name: 'ESPN Big 12',
        author_username: 'ESPNBig12',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        public_metrics: {
          retweet_count: 456,
          reply_count: 234,
          like_count: 2341,
          quote_count: 67,
        },
        entities: {
          hashtags: [{ tag: 'GoFrogs' }, { tag: 'Big12FB' }],
        },
      },
      {
        id: '3',
        text: 'Breaking: Big 12 announces new partnership with cutting-edge AI technology to enhance fan experience across all sports! 🚀 #Big12',
        author_id: '123',
        author_name: 'Big 12 Conference',
        author_username: 'Big12Conference',
        created_at: new Date(Date.now() - 7200000).toISOString(),
        public_metrics: {
          retweet_count: 789,
          reply_count: 156,
          like_count: 3456,
          quote_count: 89,
        },
        entities: {
          hashtags: [{ tag: 'Big12' }],
        },
      },
      {
        id: '4',
        text: 'Kansas State dominates at home! Bill Snyder Family Stadium was electric tonight! #EMAW #Big12FB',
        author_id: '125',
        author_name: 'K-State Athletics',
        author_username: 'KStateFB',
        created_at: new Date(Date.now() - 10800000).toISOString(),
        public_metrics: {
          retweet_count: 345,
          reply_count: 78,
          like_count: 1890,
          quote_count: 23,
        },
        entities: {
          hashtags: [{ tag: 'EMAW' }, { tag: 'Big12FB' }],
        },
        media: [
          {
            type: 'photo',
            url: 'https://pbs.twimg.com/media/stadium.jpg',
            preview_image_url:
              'https://pbs.twimg.com/media/stadium_preview.jpg',
          },
        ],
      },
      {
        id: '5',
        text: 'Utah cruises to victory! The Utes are looking strong this season. #GoUtes #Big12',
        author_id: '126',
        author_name: 'Utah Athletics',
        author_username: 'Utah_Football',
        created_at: new Date(Date.now() - 14400000).toISOString(),
        public_metrics: {
          retweet_count: 234,
          reply_count: 56,
          like_count: 1234,
          quote_count: 12,
        },
        entities: {
          hashtags: [{ tag: 'GoUtes' }, { tag: 'Big12' }],
        },
      },
    ];

    // Filter based on query
    const filteredPosts = mockPosts
      .filter(
        (post) =>
          post.text.toLowerCase().includes(query.toLowerCase()) ||
          post.entities?.hashtags?.some((h) =>
            h.tag.toLowerCase().includes(query.toLowerCase())
          )
      )
      .slice(0, maxResults);

    return {
      posts:
        filteredPosts.length > 0
          ? filteredPosts
          : mockPosts.slice(0, maxResults),
      next_token: mockPosts.length > maxResults ? 'mock_next_token' : undefined,
      result_count: filteredPosts.length || mockPosts.length,
    };
  }
}

export default XAPIClient;
