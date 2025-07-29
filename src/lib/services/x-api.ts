import { TwitterApi } from 'twitter-api-v2';

interface XApiConfig {
  appKey?: string;
  appSecret?: string;
  accessToken?: string;
  accessSecret?: string;
  bearerToken?: string;
}

interface Tweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  entities?: {
    hashtags?: Array<{ tag: string }>;
    mentions?: Array<{ username: string }>;
  };
  referenced_tweets?: Array<{
    type: 'retweeted' | 'quoted' | 'replied_to';
    id: string;
  }>;
}

interface TweetAuthor {
  id: string;
  name: string;
  username: string;
  verified?: boolean;
  profile_image_url?: string;
}

export class XApiService {
  private client: TwitterApi | null = null;
  private readonly BIG12_HANDLES = {
    // Men's Basketball
    Arizona: '@ArizonaMBB',
    'Arizona State': '@SunDevilHoops',
    Baylor: '@BaylorMBB',
    BYU: '@BYUMBB',
    Cincinnati: '@GoBearcatsMBB',
    Colorado: '@CUBuffsMBB',
    Houston: '@UHCougarMBB',
    'Iowa State': '@CycloneMBB',
    Kansas: '@KUHoops',
    'Kansas State': '@KStateMBB',
    'Oklahoma State': '@OSUMBB',
    TCU: '@TCUBasketball',
    'Texas Tech': '@TexasTechMBB',
    UCF: '@UCF_MBB',
    Utah: '@UtahMBB',
    'West Virginia': '@WVUHoops',
    // Women's Basketball
    'Arizona W': '@ArizonaWBB',
    'Arizona State W': '@SunDevilWBB',
    'Baylor W': '@BaylorWBB',
    'BYU W': '@BYUWBB',
    'Cincinnati W': '@GoBearcatsWBB',
    'Colorado W': '@CUBuffsWBB',
    'Houston W': '@UHCougarWBB',
    'Iowa State W': '@CycloneWBB',
    'Kansas W': '@KUWBasketball',
    'Kansas State W': '@KStateWBB',
    'Oklahoma State W': '@CowgirlHoops',
    'TCU W': '@TCUWomensHoops',
    'Texas Tech W': '@LadyRaidersBB',
    'UCF W': '@UCF_WBB',
    'Utah W': '@UtahWBB',
    'West Virginia W': '@WVUWomensHoops',
  };

  private readonly BIG12_HASHTAGS = [
    '#Big12MBB',
    '#Big12WBB',
    '#Big12Hoops',
    '#Big12Conference',
  ];

  private readonly PRIORITY_KEYWORDS = {
    HIGH: [
      'injury',
      'ejection',
      'technical foul',
      'overtime',
      'upset',
      'ranking',
      'coach',
      'fired',
      'hired',
      'breaking',
    ],
    MEDIUM: [
      'transfer portal',
      'recruiting',
      'commit',
      'decommit',
      'suspension',
      'practice',
      'starting lineup',
    ],
    LOW: ['highlights', 'recap', 'preview', 'tickets', 'merchandise'],
  };

  constructor(config?: XApiConfig) {
    if (config?.bearerToken) {
      this.client = new TwitterApi(config.bearerToken);
    } else if (config?.appKey && config?.appSecret) {
      this.client = new TwitterApi({
        appKey: config.appKey,
        appSecret: config.appSecret,
        accessToken: config.accessToken,
        accessSecret: config.accessSecret,
      });
    }
  }

  async searchBig12Basketball(
    query?: string,
    maxResults: number = 100
  ): Promise<{
    tweets: Tweet[];
    authors: Map<string, TweetAuthor>;
  }> {
    if (!this.client) {
      console.warn('X API client not initialized, returning mock data');
      return this.getMockData();
    }

    try {
      const handles = Object.values(this.BIG12_HANDLES).join(' OR from:');
      const hashtags = this.BIG12_HASHTAGS.join(' OR ');

      let searchQuery = `(from:${handles}) OR (${hashtags})`;
      if (query) {
        searchQuery += ` ${query}`;
      }
      searchQuery += ' -is:retweet';

      const response = await this.client.v2.search(searchQuery, {
        max_results: maxResults,
        'tweet.fields': [
          'created_at',
          'author_id',
          'public_metrics',
          'entities',
          'referenced_tweets',
        ],
        'user.fields': ['name', 'username', 'verified', 'profile_image_url'],
        expansions: ['author_id'],
      });

      const tweets: Tweet[] = response.data.data || [];
      const authors = new Map<string, TweetAuthor>();

      if (response.includes?.users) {
        response.includes.users.forEach((user) => {
          authors.set(user.id, {
            id: user.id,
            name: user.name,
            username: user.username,
            verified: user.verified,
            profile_image_url: user.profile_image_url,
          });
        });
      }

      return { tweets, authors };
    } catch (error) {
      console.error('X API search error:', error);
      return this.getMockData();
    }
  }

  async getLiveGameUpdates(teamHandles?: string[]): Promise<{
    tweets: Tweet[];
    authors: Map<string, TweetAuthor>;
  }> {
    const gameKeywords =
      'score OR final OR halftime OR "end of" OR leads OR timeout OR foul OR shot';
    const handles = teamHandles || Object.values(this.BIG12_HANDLES);

    return this.searchBig12Basketball(gameKeywords, 50);
  }

  async getBreakingNews(): Promise<{
    tweets: Tweet[];
    authors: Map<string, TweetAuthor>;
  }> {
    const breakingKeywords = this.PRIORITY_KEYWORDS.HIGH.join(' OR ');
    return this.searchBig12Basketball(breakingKeywords, 25);
  }

  determinePriority(tweet: Tweet): 'high' | 'medium' | 'low' {
    const text = tweet.text.toLowerCase();

    for (const keyword of this.PRIORITY_KEYWORDS.HIGH) {
      if (text.includes(keyword)) return 'high';
    }

    for (const keyword of this.PRIORITY_KEYWORDS.MEDIUM) {
      if (text.includes(keyword)) return 'medium';
    }

    return 'low';
  }

  private getMockData(): {
    tweets: Tweet[];
    authors: Map<string, TweetAuthor>;
  } {
    const mockTweets: Tweet[] = [
      {
        id: '1',
        text: '🚨 BREAKING: Kansas star forward expected to miss 2-3 weeks with ankle injury suffered in practice today. #Big12MBB',
        author_id: 'ku_hoops',
        created_at: new Date().toISOString(),
        public_metrics: {
          retweet_count: 156,
          reply_count: 42,
          like_count: 892,
          quote_count: 23,
        },
        entities: {
          hashtags: [{ tag: 'Big12MBB' }],
        },
      },
      {
        id: '2',
        text: 'FINAL: Houston 78, Cincinnati 72 (OT)\n\nWhat a thriller! Cougars survive in overtime behind 28 points from their senior guard. #Big12MBB',
        author_id: 'uh_cougars',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        public_metrics: {
          retweet_count: 89,
          reply_count: 31,
          like_count: 445,
          quote_count: 12,
        },
      },
      {
        id: '3',
        text: '🏀 Transfer Portal News: Former 5-star recruit enters portal, Big 12 schools showing interest including Baylor and Texas Tech. #TransferPortal',
        author_id: 'big12_insider',
        created_at: new Date(Date.now() - 7200000).toISOString(),
        public_metrics: {
          retweet_count: 234,
          reply_count: 67,
          like_count: 1023,
          quote_count: 45,
        },
      },
    ];

    const mockAuthors = new Map<string, TweetAuthor>([
      [
        'ku_hoops',
        {
          id: 'ku_hoops',
          name: 'Kansas Basketball',
          username: 'KUHoops',
          verified: true,
          profile_image_url: 'https://pbs.twimg.com/profile_images/kansas.jpg',
        },
      ],
      [
        'uh_cougars',
        {
          id: 'uh_cougars',
          name: 'Houston Basketball',
          username: 'UHCougarMBB',
          verified: true,
          profile_image_url: 'https://pbs.twimg.com/profile_images/houston.jpg',
        },
      ],
      [
        'big12_insider',
        {
          id: 'big12_insider',
          name: 'Big 12 Basketball Insider',
          username: 'Big12Insider',
          verified: false,
          profile_image_url: 'https://pbs.twimg.com/profile_images/insider.jpg',
        },
      ],
    ]);

    return { tweets: mockTweets, authors: mockAuthors };
  }
}
