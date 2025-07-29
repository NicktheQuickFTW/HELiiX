# AI Providers Configuration Command

Configure and manage AI providers for HELiiX-OS multi-provider support.

## Command: /ai-providers

### Available Providers:

1. **Claude (Anthropic)** - Complex reasoning, code generation
2. **GPT-4 (OpenAI)** - General purpose, structured data
3. **Gemini (Google)** - Multimodal tasks, long context
4. **Perplexity** - Real-time web search, current events

### Configuration File:

```typescript
// lib/ai-providers.ts
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { perplexity } from '@ai-sdk/perplexity';

export const aiProviders = {
  // Claude - Best for complex reasoning
  claude: {
    model: anthropic('claude-3-5-sonnet-20241022'),
    name: 'Claude 3.5 Sonnet',
    description: 'Best for complex reasoning and code generation',
    maxTokens: 4096,
    temperature: 0.7,
  },

  // GPT-4 - General purpose
  gpt4: {
    model: openai('gpt-4-turbo'),
    name: 'GPT-4 Turbo',
    description: 'General purpose with vision capabilities',
    maxTokens: 4096,
    temperature: 0.7,
  },

  // Gemini - Multimodal
  gemini: {
    model: google('gemini-1.5-pro-latest'),
    name: 'Gemini 1.5 Pro',
    description: 'Multimodal with 2M token context',
    maxTokens: 8192,
    temperature: 0.7,
  },

  // Perplexity - Web search
  perplexity: {
    model: perplexity('llama-3.1-sonar-large-128k-online'),
    name: 'Perplexity Sonar',
    description: 'Real-time web search and current events',
    maxTokens: 4096,
    temperature: 0.7,
  },
};
```

### Environment Variables:

```bash
# .env.local

# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-api03-...

# OpenAI (GPT-4)
OPENAI_API_KEY=sk-...

# Google (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=AIza...

# Perplexity
PERPLEXITY_API_KEY=pplx-...
```

### API Implementation:

```typescript
// app/api/ai/chat/route.ts
import { streamText } from 'ai';
import { aiProviders } from '@/lib/ai-providers';

export async function POST(req: Request) {
  const { messages, provider = 'claude' } = await req.json();

  const selectedProvider = aiProviders[provider];

  const result = await streamText({
    model: selectedProvider.model,
    messages,
    maxTokens: selectedProvider.maxTokens,
    temperature: selectedProvider.temperature,
  });

  return result.toDataStreamResponse();
}
```

### Provider Selection Logic:

```typescript
// Automatic provider selection based on task
export function selectProvider(task: string): string {
  // Web search tasks
  if (
    task.includes('search') ||
    task.includes('current') ||
    task.includes('latest')
  ) {
    return 'perplexity';
  }

  // Code generation or complex reasoning
  if (
    task.includes('code') ||
    task.includes('implement') ||
    task.includes('debug')
  ) {
    return 'claude';
  }

  // Image or multimodal tasks
  if (task.includes('image') || task.includes('analyze visual')) {
    return 'gemini';
  }

  // Default to GPT-4 for general tasks
  return 'gpt4';
}
```

### Usage in Components:

```typescript
// components/ai/ChatInterface.tsx
import { useChat } from 'ai/react'

export function ChatInterface() {
  const { messages, input, handleSubmit, handleInputChange } = useChat({
    api: '/api/ai/chat',
    body: {
      provider: 'claude', // or dynamic selection
    },
  })

  return (
    // Chat UI implementation
  )
}
```

### Rate Limits & Quotas:

| Provider   | Requests/Min | Tokens/Min | Monthly Limit |
| ---------- | ------------ | ---------- | ------------- |
| Claude     | 50           | 100K       | 1M tokens     |
| GPT-4      | 60           | 150K       | 2M tokens     |
| Gemini     | 60           | 1M         | 10M tokens    |
| Perplexity | 20           | 50K        | 500K tokens   |

### Error Handling:

```typescript
try {
  const result = await streamText({
    model: provider.model,
    messages,
  });
} catch (error) {
  if (error.code === 'rate_limit_exceeded') {
    // Fallback to another provider
    return fallbackProvider(messages);
  }

  if (error.code === 'invalid_api_key') {
    console.error(`Invalid API key for ${provider.name}`);
    return NextResponse.json(
      { error: 'AI provider configuration error' },
      { status: 500 }
    );
  }
}
```

### Performance Monitoring:

```typescript
// Track response times
const startTime = Date.now();
const result = await generateText({ model, prompt });
const responseTime = Date.now() - startTime;

// Log if exceeds 3ms target
if (responseTime > 3) {
  console.warn(`Slow AI response: ${responseTime}ms from ${provider}`);
}
```

### Cost Optimization:

```typescript
// Use appropriate models for tasks
const modelSelection = {
  simple: 'gpt-3.5-turbo', // Fast, cheap
  standard: 'gpt-4-turbo', // Balanced
  complex: 'claude-3-5-sonnet', // Best quality
  search: 'perplexity-sonar', // Web data
};
```

### Testing Providers:

```bash
# Test Claude
curl -X POST http://localhost:3002/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"provider":"claude"}'

# Test all providers
for provider in claude gpt4 gemini perplexity; do
  echo "Testing $provider..."
  curl -X POST http://localhost:3002/api/ai/chat \
    -H "Content-Type: application/json" \
    -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Hello\"}],\"provider\":\"$provider\"}"
done
```

### Usage:

```
/ai-providers
```

Configure AI providers for optimal performance and cost efficiency.
