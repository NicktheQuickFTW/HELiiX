/**
 * Real-time Updates Service
 * Handles polling, notifications, and WebSocket connections for live updates
 */

import { XAPIClient, XPost } from './x-api';
import { Big12SportsAPI, GameResult } from './sports-api';
import { BIG12_TEAMS } from './big12-schools';

export interface RealtimeUpdate {
  id: string;
  type: 'social' | 'score' | 'news' | 'alert';
  timestamp: Date;
  data: XPost | GameResult | any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface UpdateSubscription {
  id: string;
  type: 'game' | 'team' | 'conference' | 'all';
  filters?: {
    teams?: Array<keyof typeof BIG12_TEAMS>;
    sports?: Array<'football' | 'basketball'>;
  };
  callback: (update: RealtimeUpdate) => void;
}

export class RealtimeService {
  private xClient: XAPIClient;
  private pollIntervals: Map<string, NodeJS.Timeout> = new Map();
  private subscriptions: Map<string, UpdateSubscription> = new Map();
  private updateCache: Map<string, RealtimeUpdate> = new Map();
  private isRunning: boolean = false;

  constructor() {
    this.xClient = new XAPIClient();
  }

  /**
   * Start the real-time service
   */
  async start(): Promise<void> {
    if (this.isRunning) return;

    this.isRunning = true;

    // Start polling for different update types
    this.startConferenceNewsPolling();
    this.startGameUpdatesPolling();
    this.startSocialSentimentPolling();
  }

  /**
   * Stop the real-time service
   */
  stop(): void {
    this.isRunning = false;

    // Clear all polling intervals
    this.pollIntervals.forEach((interval) => clearInterval(interval));
    this.pollIntervals.clear();

    // Clear cache
    this.updateCache.clear();
  }

  /**
   * Subscribe to real-time updates
   */
  subscribe(subscription: UpdateSubscription): () => void {
    this.subscriptions.set(subscription.id, subscription);

    // Return unsubscribe function
    return () => {
      this.subscriptions.delete(subscription.id);
    };
  }

  /**
   * Get live updates for a specific game
   */
  async getLiveGameUpdates(
    homeTeam: keyof typeof BIG12_TEAMS,
    awayTeam: keyof typeof BIG12_TEAMS,
    sport: 'football' | 'basketball'
  ): Promise<RealtimeUpdate[]> {
    try {
      // Get social updates from X
      const socialPosts = await this.xClient.getLiveGameUpdates(
        homeTeam,
        awayTeam,
        sport
      );

      // Convert to realtime updates
      const updates: RealtimeUpdate[] = socialPosts.map((post) => ({
        id: `social-${post.id}`,
        type: 'social' as const,
        timestamp: new Date(post.created_at),
        data: post,
        priority: this.calculatePriority(post),
      }));

      return updates.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );
    } catch (error) {
      console.error('Error getting live game updates:', error);
      return [];
    }
  }

  /**
   * Get social sentiment for a team
   */
  async getTeamSentiment(team: keyof typeof BIG12_TEAMS): Promise<{
    sentiment: {
      positive: number;
      negative: number;
      neutral: number;
      engagement: number;
    };
    recentPosts: XPost[];
  }> {
    try {
      const searchResult = await this.xClient.searchBig12Tweets({
        team,
        maxResults: 50,
      });

      const sentiment = await this.xClient.analyzeSentiment(searchResult.posts);

      return {
        sentiment,
        recentPosts: searchResult.posts.slice(0, 10),
      };
    } catch (error) {
      console.error('Error getting team sentiment:', error);
      return {
        sentiment: { positive: 0, negative: 0, neutral: 0, engagement: 0 },
        recentPosts: [],
      };
    }
  }

  /**
   * Poll for conference news
   */
  private startConferenceNewsPolling(): void {
    const pollNews = async () => {
      if (!this.isRunning) return;

      try {
        const news = await this.xClient.getConferenceNews();

        news.forEach((post) => {
          const updateId = `news-${post.id}`;

          // Check if we've already processed this update
          if (!this.updateCache.has(updateId)) {
            const update: RealtimeUpdate = {
              id: updateId,
              type: 'news',
              timestamp: new Date(post.created_at),
              data: post,
              priority:
                post.author_username === 'Big12Conference' ? 'high' : 'medium',
            };

            this.updateCache.set(updateId, update);
            this.notifySubscribers(update);
          }
        });
      } catch (error) {
        console.error('Error polling conference news:', error);
      }
    };

    // Poll every 2 minutes
    const interval = setInterval(pollNews, 2 * 60 * 1000);
    this.pollIntervals.set('conference-news', interval);

    // Initial poll
    pollNews();
  }

  /**
   * Poll for game updates
   */
  private startGameUpdatesPolling(): void {
    const pollGames = async () => {
      if (!this.isRunning) return;

      try {
        // Get games happening today
        const games = await Big12SportsAPI.getUpcomingGames(0);
        const liveGames = games.filter((g) => g.status === 'in_progress');

        // For each live game, get social updates
        for (const game of liveGames) {
          const homeTeamKey = this.findTeamKey(game.homeTeam.name);
          const awayTeamKey = this.findTeamKey(game.awayTeam.name);

          if (homeTeamKey && awayTeamKey) {
            const updates = await this.getLiveGameUpdates(
              homeTeamKey,
              awayTeamKey,
              game.sport as 'football' | 'basketball'
            );

            updates.forEach((update) => {
              if (!this.updateCache.has(update.id)) {
                this.updateCache.set(update.id, update);
                this.notifySubscribers(update);
              }
            });
          }
        }
      } catch (error) {
        console.error('Error polling game updates:', error);
      }
    };

    // Poll every 30 seconds during games
    const interval = setInterval(pollGames, 30 * 1000);
    this.pollIntervals.set('game-updates', interval);

    // Initial poll
    pollGames();
  }

  /**
   * Poll for social sentiment
   */
  private startSocialSentimentPolling(): void {
    const pollSentiment = async () => {
      if (!this.isRunning) return;

      try {
        // Get general Big 12 social posts
        const searchResult = await this.xClient.searchBig12Tweets({
          maxResults: 100,
        });

        // Analyze trending topics
        const trendingTopics = this.analyzeTrendingTopics(searchResult.posts);

        // Notify about significant trends
        trendingTopics.forEach((topic) => {
          const updateId = `trend-${topic.tag}-${Date.now()}`;

          if (!this.updateCache.has(updateId)) {
            const update: RealtimeUpdate = {
              id: updateId,
              type: 'alert',
              timestamp: new Date(),
              data: {
                type: 'trending',
                topic: topic.tag,
                count: topic.count,
                engagement: topic.engagement,
              },
              priority: topic.count > 50 ? 'high' : 'medium',
            };

            this.updateCache.set(updateId, update);
            this.notifySubscribers(update);
          }
        });
      } catch (error) {
        console.error('Error polling social sentiment:', error);
      }
    };

    // Poll every 5 minutes
    const interval = setInterval(pollSentiment, 5 * 60 * 1000);
    this.pollIntervals.set('social-sentiment', interval);

    // Initial poll
    pollSentiment();
  }

  /**
   * Notify subscribers of an update
   */
  private notifySubscribers(update: RealtimeUpdate): void {
    this.subscriptions.forEach((subscription) => {
      // Check if subscription matches the update
      if (this.matchesSubscription(update, subscription)) {
        subscription.callback(update);
      }
    });
  }

  /**
   * Check if an update matches a subscription
   */
  private matchesSubscription(
    update: RealtimeUpdate,
    subscription: UpdateSubscription
  ): boolean {
    // All subscriptions get all updates
    if (subscription.type === 'all') return true;

    // Conference subscriptions get news and alerts
    if (subscription.type === 'conference') {
      return update.type === 'news' || update.type === 'alert';
    }

    // Game subscriptions get social and score updates
    if (subscription.type === 'game') {
      return update.type === 'social' || update.type === 'score';
    }

    // Team subscriptions need team filtering
    if (subscription.type === 'team' && subscription.filters?.teams) {
      // Check if update is about one of the subscribed teams
      // This would need more sophisticated matching logic
      return true; // Simplified for now
    }

    return false;
  }

  /**
   * Calculate priority based on engagement
   */
  private calculatePriority(post: XPost): RealtimeUpdate['priority'] {
    const totalEngagement =
      post.public_metrics.like_count +
      post.public_metrics.retweet_count +
      post.public_metrics.quote_count;

    if (totalEngagement > 1000) return 'urgent';
    if (totalEngagement > 500) return 'high';
    if (totalEngagement > 100) return 'medium';
    return 'low';
  }

  /**
   * Find team key from team name
   */
  private findTeamKey(teamName: string): keyof typeof BIG12_TEAMS | null {
    const normalizedName = teamName.toLowerCase();

    for (const [key, id] of Object.entries(BIG12_TEAMS)) {
      if (normalizedName.includes(key.toLowerCase().replace('_', ' '))) {
        return key as keyof typeof BIG12_TEAMS;
      }
    }

    return null;
  }

  /**
   * Analyze trending topics from posts
   */
  private analyzeTrendingTopics(posts: XPost[]): Array<{
    tag: string;
    count: number;
    engagement: number;
  }> {
    const tagCounts = new Map<string, { count: number; engagement: number }>();

    posts.forEach((post) => {
      const hashtags = post.entities?.hashtags || [];
      const engagement =
        post.public_metrics.like_count + post.public_metrics.retweet_count;

      hashtags.forEach((hashtag) => {
        const current = tagCounts.get(hashtag.tag) || {
          count: 0,
          engagement: 0,
        };
        tagCounts.set(hashtag.tag, {
          count: current.count + 1,
          engagement: current.engagement + engagement,
        });
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, data]) => ({ tag, ...data }))
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 10);
  }

  /**
   * Clean up old updates from cache
   */
  private cleanupCache(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    this.updateCache.forEach((update, id) => {
      if (update.timestamp < oneHourAgo) {
        this.updateCache.delete(id);
      }
    });
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();
