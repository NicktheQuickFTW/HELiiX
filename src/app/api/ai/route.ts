import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, prompt } = await req.json()

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages: messages || [{ role: 'user', content: prompt }],
    system: `You are an AI assistant for HELiiX, an awards and invoice management system. 
    Help users with:
    - Managing awards inventory
    - Tracking invoices and payments
    - Understanding analytics and reports
    - Best practices for award management
    - Invoice processing tips
    Be helpful, concise, and professional.`,
  })

  return result.toDataStreamResponse()
}