import { NextRequest, NextResponse } from 'next/server'
import { notionSupabaseSync } from '@/lib/supabase/sync-service'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const syncType = searchParams.get('type') || 'full'
    const since = searchParams.get('since')

    console.log(`Starting ${syncType} sync...`)

    let result
    
    if (syncType === 'incremental' && since) {
      result = await notionSupabaseSync.syncIncremental(new Date(since))
    } else if (syncType === 'incremental') {
      result = await notionSupabaseSync.syncIncremental()
    } else {
      result = await notionSupabaseSync.syncAll()
    }

    return NextResponse.json({
      success: true,
      message: `${syncType} sync completed successfully`,
      data: result
    })

  } catch (error) {
    console.error('Sync API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Sync failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const status = await notionSupabaseSync.getSyncStatus()
    
    return NextResponse.json({
      success: true,
      data: status
    })

  } catch (error) {
    console.error('Sync status API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sync status',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}