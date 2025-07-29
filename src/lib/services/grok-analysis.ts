import OpenAI from 'openai';

interface GrokConfig {
  apiKey?: string;
  apiUrl?: string;
  model?: string;
}

export interface TweetAnalysis {
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
}

export interface GameAnalysis {
  home_team: string;
  away_team: string;
  score?: { home: number; away: number };
  period?: string;
  key_moments: string[];
  momentum: 'home' | 'away' | 'neutral';
  upset_potential: boolean;
}

export interface SentimentTrend {
  team: string;
  sentiment_score: number; // -1 to 1
  trend: 'improving' | 'declining' | 'stable';
  volume: number;
  key_topics: string[];
}

export class GrokAnalysisService {
  private client: OpenAI | null = null;
  private model: string;

  constructor(config?: GrokConfig) {
    if (config?.apiKey) {
      this.client = new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.apiUrl || 'https://api.x.ai/v1',
      });
      this.model = config.model || 'grok-beta';
    } else if (process.env.XAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: process.env.XAI_API_KEY,
        baseURL: process.env.GROK_API_URL || 'https://api.x.ai/v1',
      });
      this.model = process.env.GROK_MODEL || 'grok-beta';
    }
  }

  async analyzeTweet(
    tweetText: string,
    authorUsername: string
  ): Promise<TweetAnalysis> {
    if (!this.client) {
      return this.getMockAnalysis(tweetText);
    }

    try {
      const prompt = `Analyze this Big 12 Conference basketball tweet and provide structured analysis:

Tweet from @${authorUsername}: "${tweetText}"

Respond with a JSON object containing:
- category: one of [breaking_news, game_update, injury, roster_change, recruiting, general]
- priority: one of [high, medium, low] based on operational importance
- sentiment: one of [positive, negative, neutral]
- teams_mentioned: array of Big 12 team names mentioned
- key_events: array of specific events or facts extracted
- action_required: boolean indicating if conference office needs to take action
- summary: one sentence summary for operations team

Focus on information relevant to conference operations and media relations.`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a sports analyst specializing in Big 12 Conference basketball. Provide concise, operational insights for conference staff.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 500,
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      return analysis as TweetAnalysis;
    } catch (error) {
      console.error('Grok analysis error:', error);
      return this.getMockAnalysis(tweetText);
    }
  }

  async analyzeGameTweets(tweets: string[]): Promise<GameAnalysis> {
    if (!this.client) {
      return this.getMockGameAnalysis();
    }

    try {
      const prompt = `Analyze these live game tweets from a Big 12 basketball game:

${tweets.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Extract and provide:
- home_team and away_team (Big 12 schools)
- current score if mentioned
- period/time if mentioned
- key_moments: important plays or events
- momentum: which team has momentum
- upset_potential: boolean if lower-ranked team is threatening

Respond as JSON.`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a live basketball game analyst. Extract game information from social media updates.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 400,
      });

      return JSON.parse(
        response.choices[0].message.content || '{}'
      ) as GameAnalysis;
    } catch (error) {
      console.error('Game analysis error:', error);
      return this.getMockGameAnalysis();
    }
  }

  async analyzeSentimentTrend(
    teamName: string,
    tweets: string[]
  ): Promise<SentimentTrend> {
    if (!this.client) {
      return this.getMockSentimentTrend(teamName);
    }

    try {
      const prompt = `Analyze sentiment trends for ${teamName} basketball based on these recent tweets:

${tweets.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Provide:
- sentiment_score: -1 (very negative) to 1 (very positive)
- trend: improving, declining, or stable
- volume: relative tweet volume (1-10 scale)
- key_topics: main topics being discussed

Respond as JSON.`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a social media sentiment analyst for college basketball.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 300,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        team: teamName,
        ...result,
      } as SentimentTrend;
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return this.getMockSentimentTrend(teamName);
    }
  }

  async generateOperationalSummary(analyses: TweetAnalysis[]): Promise<string> {
    const highPriority = analyses.filter((a) => a.priority === 'high');
    const actionRequired = analyses.filter((a) => a.action_required);

    if (!this.client) {
      return this.getMockOperationalSummary(highPriority, actionRequired);
    }

    try {
      const prompt = `Generate a brief operational summary for Big 12 Conference staff based on these tweet analyses:

High Priority Items (${highPriority.length}):
${highPriority.map((a) => `- ${a.summary}`).join('\n')}

Action Required (${actionRequired.length}):
${actionRequired.map((a) => `- ${a.summary}`).join('\n')}

Provide a 2-3 sentence executive summary highlighting what the conference office needs to know or act on immediately.`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are preparing briefings for Big 12 Conference executives. Be concise and action-oriented.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 200,
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('Summary generation error:', error);
      return this.getMockOperationalSummary(highPriority, actionRequired);
    }
  }

  private getMockAnalysis(tweetText: string): TweetAnalysis {
    const text = tweetText.toLowerCase();
    let category: TweetAnalysis['category'] = 'general';
    let priority: TweetAnalysis['priority'] = 'low';

    if (text.includes('injury') || text.includes('injured')) {
      category = 'injury';
      priority = 'high';
    } else if (text.includes('final') || text.includes('score')) {
      category = 'game_update';
      priority = 'medium';
    } else if (text.includes('transfer') || text.includes('portal')) {
      category = 'recruiting';
      priority = 'medium';
    }

    return {
      category,
      priority,
      sentiment: 'neutral',
      teams_mentioned: ['Kansas', 'Houston'],
      key_events: ['Mock analysis for development'],
      action_required: priority === 'high',
      summary: 'Mock analysis - Grok API not configured',
    };
  }

  private getMockGameAnalysis(): GameAnalysis {
    return {
      home_team: 'Kansas',
      away_team: 'Houston',
      score: { home: 78, away: 72 },
      period: 'Final/OT',
      key_moments: [
        'Overtime thriller',
        'Late three-pointer',
        'Key defensive stop',
      ],
      momentum: 'home',
      upset_potential: false,
    };
  }

  private getMockSentimentTrend(teamName: string): SentimentTrend {
    return {
      team: teamName,
      sentiment_score: 0.65,
      trend: 'improving',
      volume: 7,
      key_topics: ['winning streak', 'player development', 'tournament hopes'],
    };
  }

  private getMockOperationalSummary(
    highPriority: TweetAnalysis[],
    actionRequired: TweetAnalysis[]
  ): string {
    return `Mock Summary: ${highPriority.length} high-priority items detected, ${actionRequired.length} requiring action. Key focus areas include injury updates and game results. Conference should monitor developing situations.`;
  }
}
