import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    const { data: sports, error } = await supabase
      .from('sports')
      .select('sport_id, sport_name, sport_code')
      .order('sport_name')
    
    if (error) {
      console.error('Error fetching sports:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    
    return NextResponse.json({ sports })
    
  } catch (error) {
    console.error('Sports API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}