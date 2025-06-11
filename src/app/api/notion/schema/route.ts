import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseSchema, NOTION_CONFIG } from '@/lib/notion'

export async function GET(request: NextRequest) {
  try {
    const schema = await getDatabaseSchema(NOTION_CONFIG.DATABASE_ID)

    return NextResponse.json({
      success: true,
      data: schema,
    })
  } catch (error) {
    console.error('Error fetching Notion database schema:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch database schema',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}