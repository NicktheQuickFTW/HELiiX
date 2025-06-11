/**
 * PREMIUM AI CHAT API
 * Multi-provider AI chat with intelligent routing and premium features
 */

import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { cohere } from '@ai-sdk/cohere';
import { mistral } from '@ai-sdk/mistral';
import { streamText, convertToCoreMessages } from 'ai';
import { z } from 'zod';

// === PROVIDER CONFIGURATION ===
const providers = {
  openai: {
    model: openai('gpt-4o'),
    strengths: ['general', 'creative', 'coding'],
    cost: 0.03,
  },
  anthropic: {
    model: anthropic('claude-3-5-sonnet-20241022'),
    strengths: ['analysis', 'reasoning', 'safety'],
    cost: 0.03,
  },
  google: {
    model: google('gemini-1.5-pro'),
    strengths: ['multimodal', 'search', 'factual'],
    cost: 0.007,
  },
  cohere: {
    model: cohere('command-r-plus'),
    strengths: ['enterprise', 'rag', 'chat'],
    cost: 0.003,
  },
  mistral: {
    model: mistral('mistral-large-latest'),
    strengths: ['multilingual', 'code', 'efficiency'],
    cost: 0.008,
  },
};

// === REQUEST VALIDATION ===
const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })),
  provider: z.enum(['auto', 'openai', 'anthropic', 'google', 'cohere', 'mistral']).optional(),
  mode: z.enum(['creative', 'balanced', 'precise']).optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(4096).optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  context: z.object({
    page: z.string().optional(),
    feature: z.string().optional(),
    userPreferences: z.record(z.any()).optional(),
  }).optional(),
});

// === INTELLIGENT PROVIDER SELECTION ===
function selectOptimalProvider(
  messages: any[],
  mode: string = 'balanced',
  userPreferences?: any
): keyof typeof providers {
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  // Analyze message content for optimal provider selection
  const contentAnalysis = {
    hasCode: /```|`/.test(lastMessage),
    hasData: /data|chart|graph|analyze|statistics/.test(lastMessage.toLowerCase()),
    hasCreative: /creative|story|poem|imagine|design/.test(lastMessage.toLowerCase()),
    hasReasoning: /why|how|explain|analyze|compare|evaluate/.test(lastMessage.toLowerCase()),
    hasMultilingual: /translate|français|español|deutsch/.test(lastMessage.toLowerCase()),
    isComplex: lastMessage.length > 1000,
  };

  // Smart provider routing based on content and mode
  if (contentAnalysis.hasCode && mode === 'precise') {
    return 'anthropic'; // Claude excels at code analysis
  }
  
  if (contentAnalysis.hasCreative && mode === 'creative') {
    return 'openai'; // GPT-4 great for creative tasks
  }
  
  if (contentAnalysis.hasData || contentAnalysis.isComplex) {
    return 'google'; // Gemini strong with data and long context
  }
  
  if (contentAnalysis.hasMultilingual) {
    return 'mistral'; // Mistral excellent for multilingual
  }
  
  if (userPreferences?.preferredProvider && providers[userPreferences.preferredProvider as keyof typeof providers]) {
    return userPreferences.preferredProvider;
  }
  
  // Default to most balanced option
  return mode === 'creative' ? 'openai' : 
         mode === 'precise' ? 'anthropic' : 
         'google';
}

// === SYSTEM PROMPTS ===
const SYSTEM_PROMPTS = {
  creative: `You are AURA, an AI assistant with exceptional creative capabilities. You excel at:
- Creative writing and storytelling
- Design suggestions and visual concepts
- Innovative problem-solving
- Artistic and aesthetic guidance

Respond with creativity, flair, and visual thinking. Use vivid descriptions and imaginative solutions.`,

  balanced: `You are AURA, an intelligent AI assistant for the HELiiX platform. You excel at:
- Providing accurate, helpful information
- Offering balanced perspectives
- Clear, concise communication
- Practical solutions and recommendations

Maintain a professional yet approachable tone. Focus on being helpful and accurate.`,

  precise: `You are AURA, a precise AI assistant specialized in technical and analytical tasks. You excel at:
- Code analysis and programming help
- Data interpretation and analysis
- Technical documentation
- Step-by-step problem solving

Be thorough, accurate, and methodical in your responses. Provide detailed explanations when helpful.`,
};

// === RATE LIMITING ===
const rateLimits = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimits.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimits.set(userId, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }
  
  if (userLimit.count >= 10) { // 10 requests per minute
    return false;
  }
  
  userLimit.count++;
  return true;
}

// === MAIN API HANDLER ===
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = ChatRequestSchema.parse(body);
    
    const {
      messages,
      provider: requestedProvider,
      mode = 'balanced',
      temperature,
      maxTokens = 1000,
      userId = 'anonymous',
      sessionId,
      context,
    } = validatedData;

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return Response.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Select optimal provider
    const selectedProvider = requestedProvider === 'auto' || !requestedProvider
      ? selectOptimalProvider(messages, mode, context?.userPreferences)
      : requestedProvider;

    // Get provider configuration
    const providerConfig = providers[selectedProvider];
    if (!providerConfig) {
      return Response.json(
        { error: 'Invalid provider selected' },
        { status: 400 }
      );
    }

    // Prepare system message based on mode
    const systemMessage = {
      role: 'system' as const,
      content: SYSTEM_PROMPTS[mode as keyof typeof SYSTEM_PROMPTS] + 
        (context ? `\n\nContext: User is on ${context.page || 'unknown page'} using ${context.feature || 'general features'}.` : ''),
    };

    // Convert messages and add system prompt
    const coreMessages = convertToCoreMessages([systemMessage, ...messages]);

    // Enhanced temperature based on mode
    const enhancedTemperature = temperature ?? (
      mode === 'creative' ? 0.8 :
      mode === 'balanced' ? 0.5 :
      0.2 // precise
    );

    // Stream response with enhanced configuration
    const result = await streamText({
      model: providerConfig.model,
      messages: coreMessages,
      temperature: enhancedTemperature,
      maxTokens,
      topP: 0.95,
      presencePenalty: 0.1,
      frequencyPenalty: 0.1,
      seed: sessionId ? hashCode(sessionId) : undefined,
      onFinish: async (result) => {
        // Log usage for analytics (implement your logging here)
        console.log(`Chat completed - Provider: ${selectedProvider}, Tokens: ${result.usage?.totalTokens}, Mode: ${mode}`);
      },
    });

    // Add custom headers for client-side optimization
    const headers = new Headers();
    headers.set('X-AI-Provider', selectedProvider);
    headers.set('X-AI-Mode', mode);
    headers.set('X-AI-Cost', providerConfig.cost.toString());
    headers.set('Cache-Control', 'no-cache');

    return result.toAIStreamResponse({ headers });

  } catch (error) {
    console.error('Premium chat API error:', error);
    
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// === UTILITY FUNCTIONS ===
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// === OPTIONS HANDLER ===
export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}