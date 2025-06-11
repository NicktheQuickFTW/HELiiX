import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    
    const sport_id = searchParams.get('sport_id')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit') || '50'
    
    let query = supabase
      .from('policies')
      .select(`
        *,
        sports:sport_id(sport_code, sport_name),
        created_by_user:created_by(email),
        approved_by_user:approved_by(email)
      `)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))

    // Apply filters
    if (sport_id) {
      query = query.eq('sport_id', sport_id)
    }
    
    if (category) {
      query = query.eq('category', category)
    }
    
    if (status) {
      query = query.eq('status', status)
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,content_text.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching policies:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Policies API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    
    // Generate policy number if not provided
    if (!body.policy_number) {
      const sportCode = body.sport_code || 'GEN'
      const timestamp = Date.now().toString().slice(-6)
      body.policy_number = `POL-${sportCode}-${timestamp}`
    }
    
    const { data, error } = await supabase
      .from('policies')
      .insert([body])
      .select(`
        *,
        sports:sport_id(sport_code, sport_name)
      `)
      .single()

    if (error) {
      console.error('Error creating policy:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Create policy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}