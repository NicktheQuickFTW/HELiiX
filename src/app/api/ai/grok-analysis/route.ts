import { streamText } from 'ai';
import { grokBeta } from '@/lib/ai-providers';
import { XAPIClient } from '@/lib/x-api';
import { Big12SportsAPI } from '@/lib/sports-api';
import { BIG12_TEAMS } from '@/lib/big12-schools';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json();

    let prompt = '';
    let context = '';

    switch (type) {
      case 'game-preview': {
        const { homeTeam, awayTeam, sport } = data;

        // Fetch recent social sentiment
        const xClient = new XAPIClient();
        const recentPosts = await xClient.searchBig12Tweets({
          query: `${homeTeam} vs ${awayTeam}`,
          sport,
          maxResults: 20,
        });

        const sentiment = await xClient.analyzeSentiment(recentPosts.posts);

        context = `Social Sentiment Analysis:
- Positive: ${sentiment.positive}%
- Negative: ${sentiment.negative}%
- Neutral: ${sentiment.neutral}%
- Average Engagement: ${sentiment.engagement}

Recent Social Posts:
${recentPosts.posts
  .slice(0, 5)
  .map((p) => `- ${p.text}`)
  .join('\n')}`;

        prompt = `Analyze the upcoming ${sport} game between ${homeTeam} and ${awayTeam}. 
Consider the social sentiment, team performance, and provide insights on:
1. Key matchups to watch
2. Predicted outcome with reasoning
3. Social media buzz and fan expectations
4. Historical context if relevant`;
        break;
      }

      case 'post-game': {
        const { game, socialPosts } = data;

        context = `Game Result:
${game.awayTeam.name}: ${game.awayTeam.score}
${game.homeTeam.name}: ${game.homeTeam.score}

Top Social Reactions:
${socialPosts
  .slice(0, 10)
  .map((p: any) => `- ${p.text} (${p.public_metrics.like_count} likes)`)
  .join('\n')}`;

        prompt = `Analyze this completed Big 12 ${game.sport} game. Provide:
1. Game summary and key moments
2. Player/team performance analysis
3. Social media reaction summary
4. Impact on conference standings
5. Looking ahead for both teams`;
        break;
      }

      case 'team-sentiment': {
        const { team, timeframe } = data;

        const xClient = new XAPIClient();
        const searchResult = await xClient.searchBig12Tweets({
          team,
          maxResults: 50,
        });

        const sentiment = await xClient.analyzeSentiment(searchResult.posts);

        context = `Team: ${team}
Timeframe: ${timeframe}

Sentiment Analysis:
- Positive: ${sentiment.positive}%
- Negative: ${sentiment.negative}%
- Neutral: ${sentiment.neutral}%
- Average Engagement: ${sentiment.engagement}

Trending Topics:
${Array.from(
  new Set(
    searchResult.posts.flatMap(
      (p) => p.entities?.hashtags?.map((h) => h.tag) || []
    )
  )
)
  .slice(0, 10)
  .join(', ')}`;

        prompt = `Analyze the current social media sentiment for ${team}. Provide:
1. Overall fan mood and reasons
2. Key concerns or celebrations
3. Trending topics and their significance
4. Comparison to conference peers
5. Recommendations for team communications`;
        break;
      }

      case 'conference-trends': {
        const xClient = new XAPIClient();
        const news = await xClient.getConferenceNews(30);

        context = `Recent Conference News and Announcements:
${news
  .slice(0, 10)
  .map((p) => `- ${p.text} (${new Date(p.created_at).toLocaleDateString()})`)
  .join('\n')}`;

        prompt = `Analyze current Big 12 Conference trends based on recent social media activity. Include:
1. Major storylines and narratives
2. Team performance trends
3. Fan engagement patterns
4. Emerging issues or opportunities
5. Predictions for upcoming weeks`;
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        );
    }

    const result = streamText({
      model: grokBeta,
      messages: [
        {
          role: 'system',
          content: `You are Grok, an AI assistant specializing in Big 12 Conference sports analysis. 
You have access to real-time social media data and game information. 
Provide insightful, data-driven analysis with a touch of personality.
Be objective but engaging, and highlight interesting patterns or anomalies in the data.`,
        },
        {
          role: 'user',
          content: `${prompt}\n\nContext:\n${context}`,
        },
      ],
      temperature: 0.7,
      maxTokens: 1500,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in Grok analysis:', error);
    return NextResponse.json(
      { error: 'Failed to generate analysis' },
      { status: 500 }
    );
  }
}
