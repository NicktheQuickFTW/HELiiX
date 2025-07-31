import { z } from 'zod';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { pinecone } from '@/lib/pinecone';
import { supabase } from '@/lib/supabase';

// Feedback schemas
export const FeedbackSchema = z.object({
  id: z.string().optional(),
  source: z.enum([
    'platform',
    'email',
    'support',
    'social',
    'survey',
    'direct',
  ]),
  content: z.string(),
  userId: z.string().optional(),
  userEmail: z.string().optional(),
  userName: z.string().optional(),
  category: z.string().optional(),
  sentiment: z.enum(['positive', 'negative', 'neutral', 'mixed']).optional(),
  priority: z.enum(['urgent', 'high', 'medium', 'low']).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.string().default(() => new Date().toISOString()),
  status: z.enum(['new', 'processing', 'analyzed', 'actioned']).default('new'),
});

export const FeedbackAnalysisSchema = z.object({
  feedbackId: z.string(),
  sentiment: z.object({
    overall: z.enum(['positive', 'negative', 'neutral', 'mixed']),
    score: z.number().min(-1).max(1),
    confidence: z.number().min(0).max(1),
  }),
  categories: z.array(
    z.object({
      name: z.string(),
      confidence: z.number().min(0).max(1),
    })
  ),
  themes: z.array(z.string()),
  actionItems: z.array(
    z.object({
      description: z.string(),
      priority: z.enum(['urgent', 'high', 'medium', 'low']),
      assignTo: z.string().optional(),
    })
  ),
  summary: z.string(),
  keyInsights: z.array(z.string()),
  suggestedResponses: z.array(z.string()).optional(),
  relatedFeedback: z.array(z.string()).optional(),
});

export type Feedback = z.infer<typeof FeedbackSchema>;
export type FeedbackAnalysis = z.infer<typeof FeedbackAnalysisSchema>;

// Initialize AI providers
const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class FeedbackAnalysisAgent {
  private vectorIndex: string = 'feedback-analysis';

  constructor() {
    this.initializeVectorIndex();
  }

  private async initializeVectorIndex() {
    try {
      const indexes = await pinecone.listIndexes();
      const indexExists = indexes.indexes?.some(
        (index) => index.name === this.vectorIndex
      );

      if (!indexExists) {
        await pinecone.createIndex({
          name: this.vectorIndex,
          dimension: 1536,
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'aws',
              region: 'us-east-1',
            },
          },
        });
      }
    } catch (error) {
      console.error('Error initializing vector index:', error);
    }
  }

  async analyzeFeedback(feedback: Feedback): Promise<FeedbackAnalysis> {
    try {
      // Perform sentiment analysis
      const sentiment = await this.analyzeSentiment(feedback.content);

      // Categorize feedback
      const categories = await this.categorizeFeedback(feedback.content);

      // Extract themes
      const themes = await this.extractThemes(feedback.content);

      // Generate action items
      const actionItems = await this.generateActionItems(
        feedback.content,
        sentiment,
        categories
      );

      // Create summary
      const summary = await this.generateSummary(feedback.content);

      // Extract key insights
      const keyInsights = await this.extractKeyInsights(feedback.content);

      // Find related feedback
      const relatedFeedback = await this.findRelatedFeedback(feedback.content);

      // Generate suggested responses if needed
      const suggestedResponses =
        sentiment.overall === 'negative'
          ? await this.generateSuggestedResponses(feedback.content)
          : undefined;

      const analysis: FeedbackAnalysis = {
        feedbackId: feedback.id || crypto.randomUUID(),
        sentiment,
        categories,
        themes,
        actionItems,
        summary,
        keyInsights,
        suggestedResponses,
        relatedFeedback,
      };

      // Store in database
      await this.storeFeedbackAnalysis(feedback, analysis);

      // Store in vector database
      await this.storeInVectorDB(feedback, analysis);

      return analysis;
    } catch (error) {
      console.error('Error analyzing feedback:', error);
      throw error;
    }
  }

  private async analyzeSentiment(
    content: string
  ): Promise<FeedbackAnalysis['sentiment']> {
    const response = await anthropic.claude.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      messages: [
        {
          role: 'user',
          content: `Analyze the sentiment of this feedback and provide:
1. Overall sentiment (positive, negative, neutral, or mixed)
2. Sentiment score between -1 (very negative) and 1 (very positive)
3. Confidence score between 0 and 1

Feedback: ${content}

Respond in JSON format.`,
        },
      ],
      max_tokens: 200,
    });

    const result = JSON.parse(response.content[0].text) as {
      overall: 'positive' | 'negative' | 'neutral' | 'mixed';
      score: number;
      confidence: number;
    };
    return {
      overall: result.overall,
      score: result.score,
      confidence: result.confidence,
    };
  }

  private async categorizeFeedback(
    content: string
  ): Promise<FeedbackAnalysis['categories']> {
    const categories = [
      'Feature Request',
      'Bug Report',
      'Performance Issue',
      'User Experience',
      'Documentation',
      'Pricing',
      'Integration',
      'Security',
      'Support',
      'General Feedback',
    ];

    const response = await anthropic.claude.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      messages: [
        {
          role: 'user',
          content: `Categorize this feedback into one or more of these categories:
${categories.join(', ')}

For each applicable category, provide a confidence score between 0 and 1.

Feedback: ${content}

Respond in JSON format as an array of {name: string, confidence: number}.`,
        },
      ],
      max_tokens: 300,
    });

    return JSON.parse(response.content[0].text) as Array<{
      name: string;
      confidence: number;
    }>;
  }

  private async extractThemes(content: string): Promise<string[]> {
    const response = await anthropic.claude.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      messages: [
        {
          role: 'user',
          content: `Extract 3-5 key themes from this feedback. Return as a JSON array of strings.

Feedback: ${content}`,
        },
      ],
      max_tokens: 200,
    });

    return JSON.parse(response.content[0].text) as string[];
  }

  private async generateActionItems(
    content: string,
    sentiment: FeedbackAnalysis['sentiment'],
    categories: FeedbackAnalysis['categories']
  ): Promise<FeedbackAnalysis['actionItems']> {
    const response = await anthropic.claude.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      messages: [
        {
          role: 'user',
          content: `Based on this feedback, generate actionable items:

Feedback: ${content}
Sentiment: ${sentiment.overall} (score: ${sentiment.score})
Categories: ${categories.map((c) => c.name).join(', ')}

Generate 1-3 specific action items with priority levels (urgent, high, medium, low).
Consider the sentiment and categories when determining priority.

Respond in JSON format as an array of {description: string, priority: string}.`,
        },
      ],
      max_tokens: 400,
    });

    return JSON.parse(response.content[0].text) as Array<{
      description: string;
      priority: 'urgent' | 'high' | 'medium' | 'low';
      assignTo?: string;
    }>;
  }

  private async generateSummary(content: string): Promise<string> {
    const response = await anthropic.claude.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      messages: [
        {
          role: 'user',
          content: `Summarize this feedback in 1-2 sentences:

${content}`,
        },
      ],
      max_tokens: 100,
    });

    return response.content[0].text;
  }

  private async extractKeyInsights(content: string): Promise<string[]> {
    const response = await anthropic.claude.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      messages: [
        {
          role: 'user',
          content: `Extract 2-4 key insights from this feedback that would be valuable for product improvement.
Return as a JSON array of strings.

Feedback: ${content}`,
        },
      ],
      max_tokens: 300,
    });

    return JSON.parse(response.content[0].text) as string[];
  }

  private async generateSuggestedResponses(content: string): Promise<string[]> {
    const response = await anthropic.claude.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      messages: [
        {
          role: 'user',
          content: `Generate 2-3 professional, empathetic response templates for this negative feedback.
Each response should acknowledge the issue and outline next steps.
Return as a JSON array of strings.

Feedback: ${content}`,
        },
      ],
      max_tokens: 500,
    });

    return JSON.parse(response.content[0].text) as string[];
  }

  private async findRelatedFeedback(content: string): Promise<string[]> {
    try {
      // Generate embedding for the feedback
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: content,
      });

      const embedding = embeddingResponse.data[0].embedding;

      // Query Pinecone for similar feedback
      const index = pinecone.index(this.vectorIndex);
      const queryResponse = await index.query({
        vector: embedding,
        topK: 5,
        includeMetadata: true,
      });

      return queryResponse.matches
        .filter((match) => match.score && match.score > 0.8)
        .map((match) => match.id);
    } catch (error) {
      console.error('Error finding related feedback:', error);
      return [];
    }
  }

  private async storeFeedbackAnalysis(
    feedback: Feedback,
    analysis: FeedbackAnalysis
  ) {
    const { error } = await supabase.from('feedback_analysis').upsert({
      feedback_id: feedback.id,
      source: feedback.source,
      content: feedback.content,
      user_id: feedback.userId,
      user_email: feedback.userEmail,
      user_name: feedback.userName,
      sentiment_overall: analysis.sentiment.overall,
      sentiment_score: analysis.sentiment.score,
      sentiment_confidence: analysis.sentiment.confidence,
      categories: analysis.categories,
      themes: analysis.themes,
      action_items: analysis.actionItems,
      summary: analysis.summary,
      key_insights: analysis.keyInsights,
      suggested_responses: analysis.suggestedResponses,
      related_feedback: analysis.relatedFeedback,
      status: 'analyzed',
      analyzed_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error storing feedback analysis:', error);
      throw error;
    }
  }

  private async storeInVectorDB(
    feedback: Feedback,
    analysis: FeedbackAnalysis
  ) {
    try {
      // Generate embedding
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: `${feedback.content}\n\nSummary: ${analysis.summary}\n\nThemes: ${analysis.themes.join(', ')}`,
      });

      const embedding = embeddingResponse.data[0].embedding;

      // Store in Pinecone
      const index = pinecone.index(this.vectorIndex);
      await index.upsert([
        {
          id: analysis.feedbackId,
          values: embedding,
          metadata: {
            source: feedback.source,
            sentiment: analysis.sentiment.overall,
            categories: analysis.categories.map((c) => c.name),
            themes: analysis.themes,
            timestamp: feedback.timestamp,
            summary: analysis.summary,
          },
        },
      ]);
    } catch (error) {
      console.error('Error storing in vector DB:', error);
    }
  }

  async batchAnalyzeFeedback(
    feedbackList: Feedback[]
  ): Promise<FeedbackAnalysis[]> {
    const results = await Promise.all(
      feedbackList.map((feedback) => this.analyzeFeedback(feedback))
    );
    return results;
  }

  async getAnalysisTrends(timeframe: 'day' | 'week' | 'month' = 'week') {
    const startDate = new Date();
    switch (timeframe) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    const { data, error } = await supabase
      .from('feedback_analysis')
      .select('*')
      .gte('analyzed_at', startDate.toISOString())
      .order('analyzed_at', { ascending: false });

    if (error) {
      console.error('Error fetching trends:', error);
      return null;
    }

    // Calculate trends
    const sentimentTrend = this.calculateSentimentTrend(data);
    const categoryDistribution = this.calculateCategoryDistribution(data);
    const themeFrequency = this.calculateThemeFrequency(data);
    const priorityBreakdown = this.calculatePriorityBreakdown(data);

    return {
      totalFeedback: data.length,
      sentimentTrend,
      categoryDistribution,
      themeFrequency,
      priorityBreakdown,
      timeframe,
    };
  }

  private calculateSentimentTrend(
    data: Array<{
      sentiment_overall: string;
      [key: string]: unknown;
    }>
  ) {
    const sentiments = data.reduce<Record<string, number>>((acc, item) => {
      acc[item.sentiment_overall] = (acc[item.sentiment_overall] || 0) + 1;
      return acc;
    }, {});

    const total = data.length;
    return Object.entries(sentiments).map(([sentiment, count]) => ({
      sentiment,
      count: count as number,
      percentage: ((count as number) / total) * 100,
    }));
  }

  private calculateCategoryDistribution(
    data: Array<{
      categories?: Array<{ name: string; confidence: number }>;
      [key: string]: unknown;
    }>
  ) {
    const categories: Record<string, number> = {};

    data.forEach((item) => {
      item.categories?.forEach((cat) => {
        categories[cat.name] = (categories[cat.name] || 0) + 1;
      });
    });

    return Object.entries(categories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }

  private calculateThemeFrequency(
    data: Array<{
      themes?: string[];
      [key: string]: unknown;
    }>
  ) {
    const themes: Record<string, number> = {};

    data.forEach((item) => {
      item.themes?.forEach((theme) => {
        themes[theme] = (themes[theme] || 0) + 1;
      });
    });

    return Object.entries(themes)
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private calculatePriorityBreakdown(
    data: Array<{
      action_items?: Array<{ priority: string }>;
      [key: string]: unknown;
    }>
  ) {
    const priorities: Record<string, number> = {};

    data.forEach((item) => {
      item.action_items?.forEach((action) => {
        priorities[action.priority] = (priorities[action.priority] || 0) + 1;
      });
    });

    return Object.entries(priorities)
      .map(([priority, count]) => ({ priority, count }))
      .sort((a, b) => {
        const order = ['urgent', 'high', 'medium', 'low'];
        return order.indexOf(a.priority) - order.indexOf(b.priority);
      });
  }
}

// Export singleton instance
export const feedbackAnalysisAgent = new FeedbackAnalysisAgent();
