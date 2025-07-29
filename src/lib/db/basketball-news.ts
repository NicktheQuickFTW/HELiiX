export interface BasketballNews {
  id: string;
  tweet_id: string;
  text: string;
  author_id: string;
  author_username: string;
  author_name: string;
  author_verified: boolean;
  created_at: Date;

  // Grok Analysis Results
  category:
    | 'breaking_news'
    | 'game_update'
    | 'injury'
    | 'roster_change'
    | 'recruiting'
    | 'general';
  priority: 'high' | 'medium' | 'low';
  sentiment: 'positive' | 'negative' | 'neutral';
  teams_mentioned: string[];
  key_events: string[];
  action_required: boolean;
  summary: string;

  // Engagement Metrics
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;

  // Additional metadata
  hashtags: string[];
  mentions: string[];
  is_processed: boolean;
  processed_at?: Date;
  notification_sent: boolean;
  notification_sent_at?: Date;
}

export interface BasketballGame {
  id: string;
  home_team: string;
  away_team: string;
  game_date: Date;
  venue?: string;

  // Live game data
  current_score?: {
    home: number;
    away: number;
  };
  period?: string;
  game_status: 'scheduled' | 'live' | 'final';

  // Analysis data
  momentum: 'home' | 'away' | 'neutral';
  upset_potential: boolean;
  key_moments: string[];

  // Social metrics
  social_volume: number;
  sentiment_score: number;
  trending_topics: string[];
}

export interface TeamSentiment {
  id: string;
  team_name: string;
  date: Date;

  // Sentiment metrics
  sentiment_score: number; // -1 to 1
  sentiment_trend: 'improving' | 'declining' | 'stable';
  tweet_volume: number;

  // Topic analysis
  positive_topics: string[];
  negative_topics: string[];
  neutral_topics: string[];

  // Engagement
  total_engagement: number;
  average_engagement_per_tweet: number;

  // Time-based data
  hourly_sentiment: Record<string, number>; // hour -> sentiment score
  peak_activity_hour: number;
}

export interface NotificationPreference {
  id: string;
  user_id: string;

  // Team preferences
  teams: string[]; // Array of team names to follow
  all_teams: boolean;

  // Priority preferences
  high_priority_only: boolean;
  categories: Array<
    | 'breaking_news'
    | 'game_update'
    | 'injury'
    | 'roster_change'
    | 'recruiting'
    | 'general'
  >;

  // Delivery preferences
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;

  // Timing
  quiet_hours_start?: number; // 0-23
  quiet_hours_end?: number; // 0-23
  digest_frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';

  created_at: Date;
  updated_at: Date;
}

export interface BasketballDigest {
  id: string;
  period_start: Date;
  period_end: Date;

  // Content
  high_priority_items: BasketballNews[];
  game_summaries: BasketballGame[];
  team_sentiments: TeamSentiment[];

  // Analytics
  total_tweets_analyzed: number;
  total_engagement: number;
  most_discussed_teams: Array<{ team: string; mentions: number }>;
  trending_topics: Array<{ topic: string; count: number }>;

  // Executive summary
  executive_summary: string;
  action_items: string[];

  created_at: Date;
}

// Helper types for API responses
export interface NewsUpdateEvent {
  type: 'new' | 'update';
  news: BasketballNews;
  timestamp: Date;
}

export interface SentimentUpdateEvent {
  type: 'sentiment';
  team: string;
  current_sentiment: number;
  change: number;
  timestamp: Date;
}

export interface GameUpdateEvent {
  type: 'game';
  game: BasketballGame;
  update_type: 'score' | 'period' | 'final' | 'momentum';
  timestamp: Date;
}
