import { streamText } from 'ai';
import { getModelForTask } from '@/lib/ai-providers';

export async function POST(req: Request) {
  const { messages, task = 'analysis' } = await req.json();

  // Select the appropriate model based on the task
  const model = getModelForTask(task);

  // Stream the response
  const result = streamText({
    model,
    messages,
    temperature: 0.7,
    maxTokens: 2000,
    system: `You are HELiiX, the AI assistant for Big 12 Conference operations. 
    You help with scheduling, compliance, analytics, and operational intelligence.`,
  });

  return result.toDataStreamResponse();
}