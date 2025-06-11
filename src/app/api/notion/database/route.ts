import { NextRequest, NextResponse } from 'next/server'
import { queryDatabase, formatDatabaseEntries, NOTION_CONFIG, DEFAULT_QUERY_OPTIONS } from '@/lib/notion'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page_size = parseInt(searchParams.get('page_size') || '50')
    const start_cursor = searchParams.get('cursor') || undefined
    const filter = searchParams.get('filter') ? JSON.parse(searchParams.get('filter')!) : undefined
    const sorts = searchParams.get('sorts') ? JSON.parse(searchParams.get('sorts')!) : DEFAULT_QUERY_OPTIONS.sorts

    const result = await queryDatabase(NOTION_CONFIG.DATABASE_ID, {
      filter,
      sorts,
      page_size,
      start_cursor,
    })

    const formattedEntries = formatDatabaseEntries(result.results)

    return NextResponse.json({
      success: true,
      data: {
        entries: formattedEntries,
        has_more: result.has_more,
        next_cursor: result.next_cursor,
        total_results: formattedEntries.length,
      },
    })
  } catch (error) {
    console.error('Error fetching Notion database:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch database entries',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}