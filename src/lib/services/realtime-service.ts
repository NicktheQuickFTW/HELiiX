import { EventEmitter } from 'events';
import { XApiService } from './x-api';
import { GrokAnalysisService, TweetAnalysis } from './grok-analysis';
import {
  BasketballNews,
  NewsUpdateEvent,
  SentimentUpdateEvent,
  GameUpdateEvent,
  BasketballGame,
  TeamSentiment,
} from '../db/basketball-news';

interface RealtimeConfig {
  pollInterval?: number; // milliseconds
  xApiConfig?: any;
  grokConfig?: any;
}

export class RealtimeBasketballService extends EventEmitter {
  private xApi: XApiService;
  private grokAnalysis: GrokAnalysisService;
  private pollInterval: number;
  private pollTimer?: NodeJS.Timeout;
  private lastProcessedTweetIds = new Set<string>();
  private newsCache = new Map<string, BasketballNews>();
  private gameCache = new Map<string, BasketballGame>();
  private sentimentCache = new Map<string, TeamSentiment>();

  constructor(config: RealtimeConfig = {}) {
    super();
    this.pollInterval = config.pollInterval || 30000; // 30 seconds default
    this.xApi = new XApiService(config.xApiConfig);
    this.grokAnalysis = new GrokAnalysisService(config.grokConfig);
  }

  async start() {
    console.log('Starting real-time basketball monitoring...');

    // Initial fetch
    await this.pollForUpdates();

    // Set up polling
    this.pollTimer = setInterval(() => {
      this.pollForUpdates().catch(console.error);
    }, this.pollInterval);
  }

  stop() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = undefined;
    }
    console.log('Stopped real-time monitoring');
  }

  private async pollForUpdates() {
    try {
      // Fetch latest tweets
      const { tweets, authors } = await this.xApi.searchBig12Basketball();

      // Process new tweets
      for (const tweet of tweets) {
        if (!this.lastProcessedTweetIds.has(tweet.id)) {
          await this.processTweet(tweet, authors.get(tweet.author_id));
          this.lastProcessedTweetIds.add(tweet.id);
        }
      }

      // Update game statuses
      await this.updateGameStatuses();

      // Update team sentiments
      await this.updateTeamSentiments();
    } catch (error) {
      console.error('Error polling for updates:', error);
      this.emit('error', error);
    }
  }

  private async processTweet(tweet: any, author: any) {
    try {
      // Analyze tweet with Grok
      const analysis = await this.grokAnalysis.analyzeTweet(
        tweet.text,
        author?.username || 'unknown'
      );

      // Create news item
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

      // Cache the news
      this.newsCache.set(news.id, news);

      // Emit news event
      const event: NewsUpdateEvent = {
        type: 'new',
        news,
        timestamp: new Date(),
      };
      this.emit('news', event);

      // Handle high priority notifications
      if (news.priority === 'high' || news.action_required) {
        this.emit('alert', news);
      }

      // Check if it's a game update
      if (news.category === 'game_update') {
        await this.processGameUpdate(news);
      }
    } catch (error) {
      console.error('Error processing tweet:', error);
    }
  }

  private async processGameUpdate(news: BasketballNews) {
    // Extract game information from the tweet
    const gameTexts = [news.text];

    // Get recent game tweets for context
    const recentGameTweets = Array.from(this.newsCache.values())
      .filter(
        (n) =>
          n.category === 'game_update' &&
          n.teams_mentioned.some((t) => news.teams_mentioned.includes(t)) &&
          new Date(n.created_at).getTime() > Date.now() - 3600000 // Last hour
      )
      .map((n) => n.text);

    gameTexts.push(...recentGameTweets);

    // Analyze game state
    const gameAnalysis = await this.grokAnalysis.analyzeGameTweets(gameTexts);

    // Create or update game
    const gameId = `game_${gameAnalysis.home_team}_${gameAnalysis.away_team}_${new Date().toISOString().split('T')[0]}`;

    const existingGame = this.gameCache.get(gameId);
    const game: BasketballGame = {
      id: gameId,
      ...gameAnalysis,
      game_date: new Date(),
      game_status: gameAnalysis.period?.includes('Final') ? 'final' : 'live',
      social_volume: existingGame ? existingGame.social_volume + 1 : 1,
      sentiment_score: 0, // Will be updated by sentiment analysis
      trending_topics: news.key_events,
    };

    this.gameCache.set(gameId, game);

    // Emit game update
    const event: GameUpdateEvent = {
      type: 'game',
      game,
      update_type: game.game_status === 'final' ? 'final' : 'score',
      timestamp: new Date(),
    };
    this.emit('game', event);
  }

  private async updateGameStatuses() {
    // Check for live games
    const { tweets } = await this.xApi.getLiveGameUpdates();

    // Group tweets by potential games
    const gameGroups = new Map<string, string[]>();

    for (const tweet of tweets) {
      const priority = this.xApi.determinePriority(tweet);
      if (priority === 'high' || priority === 'medium') {
        // Simple grouping by time window (could be enhanced)
        const timeKey = new Date(tweet.created_at).getHours();
        const key = `games_${timeKey}`;
        if (!gameGroups.has(key)) {
          gameGroups.set(key, []);
        }
        gameGroups.get(key)!.push(tweet.text);
      }
    }

    // Analyze each game group
    for (const [key, texts] of gameGroups) {
      if (texts.length > 0) {
        try {
          const gameAnalysis = await this.grokAnalysis.analyzeGameTweets(texts);
          // Process game analysis (similar to processGameUpdate)
        } catch (error) {
          console.error('Error analyzing game group:', error);
        }
      }
    }
  }

  private async updateTeamSentiments() {
    const teams = [
      'Arizona',
      'Arizona State',
      'Baylor',
      'BYU',
      'Cincinnati',
      'Colorado',
      'Houston',
      'Iowa State',
      'Kansas',
      'Kansas State',
      'Oklahoma State',
      'TCU',
      'Texas Tech',
      'UCF',
      'Utah',
      'West Virginia',
    ];

    for (const team of teams) {
      const teamNews = Array.from(this.newsCache.values()).filter(
        (n) =>
          n.teams_mentioned.includes(team) &&
          new Date(n.created_at).getTime() > Date.now() - 86400000 // Last 24 hours
      );

      if (teamNews.length > 0) {
        const tweets = teamNews.map((n) => n.text);
        const sentiment = await this.grokAnalysis.analyzeSentimentTrend(
          team,
          tweets
        );

        const existingSentiment = this.sentimentCache.get(team);
        const sentimentChange = existingSentiment
          ? sentiment.sentiment_score - existingSentiment.sentiment_score
          : 0;

        // Create team sentiment object
        const teamSentiment: TeamSentiment = {
          id: `sentiment_${team}_${new Date().toISOString()}`,
          team_name: team,
          date: new Date(),
          sentiment_score: sentiment.sentiment_score,
          sentiment_trend: sentiment.trend,
          tweet_volume: teamNews.length,
          positive_topics: sentiment.key_topics.filter((t) =>
            teamNews.some(
              (n) => n.sentiment === 'positive' && n.text.includes(t)
            )
          ),
          negative_topics: sentiment.key_topics.filter((t) =>
            teamNews.some(
              (n) => n.sentiment === 'negative' && n.text.includes(t)
            )
          ),
          neutral_topics: sentiment.key_topics.filter((t) =>
            teamNews.some(
              (n) => n.sentiment === 'neutral' && n.text.includes(t)
            )
          ),
          total_engagement: teamNews.reduce(
            (sum, n) => sum + n.like_count + n.retweet_count,
            0
          ),
          average_engagement_per_tweet:
            teamNews.length > 0
              ? teamNews.reduce(
                  (sum, n) => sum + n.like_count + n.retweet_count,
                  0
                ) / teamNews.length
              : 0,
          hourly_sentiment: {}, // Could be calculated
          peak_activity_hour: new Date().getHours(), // Simplified
        };

        this.sentimentCache.set(team, teamSentiment);

        // Emit sentiment update if significant change
        if (Math.abs(sentimentChange) > 0.1) {
          const event: SentimentUpdateEvent = {
            type: 'sentiment',
            team,
            current_sentiment: sentiment.sentiment_score,
            change: sentimentChange,
            timestamp: new Date(),
          };
          this.emit('sentiment', event);
        }
      }
    }
  }

  // Public methods for external access
  getLatestNews(limit: number = 50): BasketballNews[] {
    return Array.from(this.newsCache.values())
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit);
  }

  getHighPriorityNews(): BasketballNews[] {
    return Array.from(this.newsCache.values())
      .filter((n) => n.priority === 'high' || n.action_required)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  getLiveGames(): BasketballGame[] {
    return Array.from(this.gameCache.values()).filter(
      (g) => g.game_status === 'live'
    );
  }

  getTeamSentiment(team: string): TeamSentiment | undefined {
    return this.sentimentCache.get(team);
  }

  getAllSentiments(): TeamSentiment[] {
    return Array.from(this.sentimentCache.values());
  }

  async generateDigest(): Promise<string> {
    const highPriority = this.getHighPriorityNews();
    const analyses = highPriority.map((n) => ({
      category: n.category,
      priority: n.priority,
      sentiment: n.sentiment,
      teams_mentioned: n.teams_mentioned,
      key_events: n.key_events,
      action_required: n.action_required,
      summary: n.summary,
    }));

    return this.grokAnalysis.generateOperationalSummary(analyses);
  }
}
