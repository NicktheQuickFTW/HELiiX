import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function GET() {
  try {
    const { data: allAwards, error } = await supabase
      .from('awards')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch awards' }, { status: 500 })
    }
    
    return NextResponse.json(allAwards)
  } catch (error) {
    console.error('Error fetching awards:', error)
    return NextResponse.json({ error: 'Failed to fetch awards' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data: newAward, error } = await supabase
      .from('awards')
      .insert(body)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create award' }, { status: 500 })
    }
    
    return NextResponse.json(newAward)
  } catch (error) {
    console.error('Error creating award:', error)
    return NextResponse.json({ error: 'Failed to create award' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    const { data: updated, error } = await supabase
      .from('awards')
      .update({ ...updateData, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update award' }, { status: 500 })
    }
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating award:', error)
    return NextResponse.json({ error: 'Failed to update award' }, { status: 500 })
  }
}