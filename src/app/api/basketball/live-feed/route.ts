import { NextRequest, NextResponse } from 'next/server';
import { RealtimeBasketballService } from '@/lib/services/realtime-service';

// Server-sent events for real-time updates
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Initialize realtime service
      const realtimeService = new RealtimeBasketballService({
        pollInterval: 30000, // 30 seconds
        xApiConfig: {
          bearerToken: process.env.X_BEARER_TOKEN,
          appKey: process.env.X_API_KEY,
          appSecret: process.env.X_API_SECRET,
          accessToken: process.env.X_ACCESS_TOKEN,
          accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
        },
        grokConfig: {
          apiKey: process.env.GROK_API_KEY,
          apiUrl: process.env.GROK_API_URL,
          model: process.env.GROK_MODEL,
        },
      });

      // Event listeners
      const sendEvent = (type: string, data: any) => {
        const event = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(event));
      };

      // Send initial data
      sendEvent('connected', { timestamp: new Date() });

      // Send latest news on connection
      const latestNews = realtimeService.getLatestNews(10);
      sendEvent('initial', { news: latestNews });

      // Set up event listeners
      realtimeService.on('news', (event) => {
        sendEvent('news', event);
      });

      realtimeService.on('alert', (news) => {
        sendEvent('alert', news);
      });

      realtimeService.on('game', (event) => {
        sendEvent('game', event);
      });

      realtimeService.on('sentiment', (event) => {
        sendEvent('sentiment', event);
      });

      realtimeService.on('error', (error) => {
        sendEvent('error', { message: error.message });
      });

      // Start the service
      await realtimeService.start();

      // Keep connection alive
      const keepAlive = setInterval(() => {
        sendEvent('ping', { timestamp: new Date() });
      }, 30000);

      // Clean up on disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(keepAlive);
        realtimeService.stop();
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
