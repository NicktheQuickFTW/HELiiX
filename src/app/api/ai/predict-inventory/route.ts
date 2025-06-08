import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'

// Schema for inventory predictions
const predictionSchema = z.object({
  predictions: z.array(z.object({
    awardId: z.number(),
    awardName: z.string(),
    currentStock: z.number(),
    predictedDemand: z.object({
      nextWeek: z.number(),
      nextMonth: z.number(),
      nextQuarter: z.number()
    }),
    recommendedOrderQuantity: z.number(),
    reorderPoint: z.number(),
    reasoning: z.string()
  })),
  insights: z.array(z.string()),
  seasonalTrends: z.array(z.object({
    period: z.string(),
    trend: z.enum(['increasing', 'decreasing', 'stable']),
    percentage: z.number()
  }))
})

export async function POST(req: Request) {
  try {
    const { historicalData, currentInventory } = await req.json()

    const result = await generateObject({
      model: openai('gpt-4-turbo'),
      schema: predictionSchema,
      prompt: `Analyze this inventory data and provide predictions:
        
        Current Inventory:
        ${JSON.stringify(currentInventory, null, 2)}
        
        Historical Data (last 6 months):
        ${JSON.stringify(historicalData, null, 2)}
        
        Consider:
        1. Historical usage patterns
        2. Seasonal trends
        3. Current stock levels
        4. Lead times for reordering
        5. Safety stock requirements
        
        Provide predictions for demand, recommended order quantities, and insights.`,
    })

    return Response.json(result.object)
  } catch (error) {
    return Response.json(
      { error: 'Failed to generate predictions' },
      { status: 500 }
    )
  }
}