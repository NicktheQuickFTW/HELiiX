import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'

// Schema for extracted invoice data
const invoiceSchema = z.object({
  invoiceNumber: z.string(),
  vendorName: z.string(),
  date: z.string(),
  dueDate: z.string().optional(),
  totalAmount: z.number(),
  currency: z.string().default('USD'),
  lineItems: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    total: z.number()
  })),
  taxAmount: z.number().optional(),
  notes: z.string().optional()
})

export async function POST(req: Request) {
  try {
    const { pdfText, imageBase64 } = await req.json()

    const prompt = imageBase64 
      ? `Extract invoice information from this image. The image is in base64 format.`
      : `Extract invoice information from this text: ${pdfText}`

    const result = await generateObject({
      model: openai('gpt-4-vision-preview'),
      schema: invoiceSchema,
      prompt,
      messages: imageBase64 ? [{
        role: 'user',
        content: [
          { type: 'text', text: 'Extract all invoice information from this image' },
          { type: 'image', image: imageBase64 }
        ]
      }] : undefined
    })

    return Response.json(result.object)
  } catch (error) {
    return Response.json(
      { error: 'Failed to extract invoice data' },
      { status: 500 }
    )
  }
}