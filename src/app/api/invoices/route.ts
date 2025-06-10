import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function GET() {
  try {
    const { data: allInvoices, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
    }
    
    return NextResponse.json(allInvoices)
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data: newInvoice, error } = await supabase
      .from('invoices')
      .insert(body)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
    }
    
    return NextResponse.json(newInvoice)
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    const { data: updated, error } = await supabase
      .from('invoices')
      .update({ ...updateData, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
    }
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
  }
}