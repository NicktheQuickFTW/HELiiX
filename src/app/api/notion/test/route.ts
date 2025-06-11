import { NextRequest, NextResponse } from 'next/server'
import { NOTION_CONFIG } from '@/lib/notion'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Notion integration test successful',
    config: {
      hasApiKey: !!process.env.NOTION_API_KEY,
      hasDatabaseId: !!process.env.NOTION_DATABASE_ID,
      databaseId: NOTION_CONFIG.DATABASE_ID,
      embedUrl: NOTION_CONFIG.EMBED_URL,
      publicUrl: NOTION_CONFIG.PUBLIC_URL,
    },
    timestamp: new Date().toISOString(),
  })
}