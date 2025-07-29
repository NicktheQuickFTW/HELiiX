import { NextRequest, NextResponse } from 'next/server';
import { GrokAnalysisService } from '@/lib/services/grok-analysis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, type = 'tweet' } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const grokAnalysis = new GrokAnalysisService({
      apiKey: process.env.GROK_API_KEY,
      apiUrl: process.env.GROK_API_URL,
      model: process.env.GROK_MODEL,
    });

    let result;

    switch (type) {
      case 'tweet':
        result = await grokAnalysis.analyzeTweet(text, 'manual_input');
        break;

      case 'game':
        const tweets = Array.isArray(text) ? text : [text];
        result = await grokAnalysis.analyzeGameTweets(tweets);
        break;

      case 'sentiment':
        const { team, tweets: teamTweets } = body;
        if (!team || !teamTweets) {
          return NextResponse.json(
            { error: 'Team and tweets are required for sentiment analysis' },
            { status: 400 }
          );
        }
        result = await grokAnalysis.analyzeSentimentTrend(team, teamTweets);
        break;

      case 'summary':
        const { analyses } = body;
        if (!analyses || !Array.isArray(analyses)) {
          return NextResponse.json(
            { error: 'Analyses array is required for summary' },
            { status: 400 }
          );
        }
        result = await grokAnalysis.generateOperationalSummary(analyses);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      type,
      result,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      {
        error: 'Analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
