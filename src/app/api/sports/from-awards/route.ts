import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get unique sport codes from awards table
    const { data: awards, error } = await supabase
      .from('awards')
      .select('recipient_details')
      .not('recipient_details', 'is', null)
      .limit(100)
    
    if (error) {
      console.error('Error fetching awards:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    
    // Extract unique sport codes and names
    const sportMap = new Map()
    
    awards.forEach(award => {
      if (award.recipient_details && typeof award.recipient_details === 'object') {
        const details = award.recipient_details as any
        if (details.sport_code && details.sport) {
          sportMap.set(details.sport_code, details.sport)
        }
      }
    })
    
    const sports = Array.from(sportMap.entries()).map(([sport_code, sport_name]) => ({
      sport_code,
      sport_name
    }))
    
    return NextResponse.json({ sports: sports.sort((a, b) => a.sport_name.localeCompare(b.sport_name)) })
    
  } catch (error) {
    console.error('Sports from awards API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}