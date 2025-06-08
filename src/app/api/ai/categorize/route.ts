import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'

// Schema for award categorization
const categorySchema = z.object({
  category: z.enum([
    'achievement',
    'leadership',
    'teamwork',
    'innovation',
    'service',
    'academic',
    'sports',
    'recognition',
    'milestone',
    'other'
  ]),
  subcategory: z.string(),
  tags: z.array(z.string()),
  confidence: z.number().min(0).max(1)
})

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json()

    const result = await generateObject({
      model: openai('gpt-4-turbo'),
      schema: categorySchema,
      prompt: `Categorize this award based on its name and description:
        Name: ${name}
        Description: ${description || 'N/A'}
        
        Provide appropriate category, subcategory, relevant tags, and confidence score.`,
    })

    return Response.json(result.object)
  } catch (error) {
    return Response.json(
      { error: 'Failed to categorize award' },
      { status: 500 }
    )
  }
}