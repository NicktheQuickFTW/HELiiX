import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { perplexity } from '@ai-sdk/perplexity';

// OpenAI Models
export const gpt4 = openai('gpt-4-turbo');
export const gpt4o = openai('gpt-4o');
export const gpt35 = openai('gpt-3.5-turbo');

// Anthropic Models
export const claude3Opus = anthropic('claude-3-opus-20240229');
export const claude3Sonnet = anthropic('claude-3-5-sonnet-20241022');
export const claude3Haiku = anthropic('claude-3-haiku-20240307');

// Google Models
export const geminiPro = google('gemini-1.5-pro');
export const geminiFlash = google('gemini-1.5-flash');

// Perplexity Models
export const perplexityOnline = perplexity('perplexity-online');
export const perplexitySonar = perplexity('sonar-medium-online');

// Model selection based on task
export function getModelForTask(task: 'research' | 'analysis' | 'creative' | 'fast' | 'web-search') {
  switch (task) {
    case 'research':
      return claude3Opus; // Best for deep analysis
    case 'analysis':
      return gpt4o; // Great for structured data
    case 'creative':
      return claude3Sonnet; // Excellent for creative tasks
    case 'fast':
      return geminiFlash; // Fastest responses
    case 'web-search':
      return perplexityOnline; // Real-time web data
    default:
      return gpt4; // Default fallback
  }
}

// Embedding models
export const openaiEmbeddings = openai.embedding('text-embedding-3-small');