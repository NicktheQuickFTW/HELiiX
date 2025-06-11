import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('policies')
      .select(`
        *,
        sports:sport_id(sport_code, sport_name),
        created_by_user:created_by(email),
        approved_by_user:approved_by(email),
        policy_versions(*)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Policy not found' }, { status: 404 })
      }
      console.error('Error fetching policy:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Policy detail API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const body = await request.json()
    
    // Create new version if content changed
    if (body.content_text || body.content_url) {
      const { data: currentPolicy } = await supabase
        .from('policies')
        .select('version, content_text, content_url')
        .eq('id', params.id)
        .single()
      
      if (currentPolicy && 
          (currentPolicy.content_text !== body.content_text || 
           currentPolicy.content_url !== body.content_url)) {
        
        // Create version entry
        await supabase
          .from('policy_versions')
          .insert({
            policy_id: params.id,
            version_number: currentPolicy.version,
            content_url: currentPolicy.content_url,
            content_text: currentPolicy.content_text,
            changes_made: body.change_summary || 'Content updated',
            created_by: body.updated_by
          })
        
        // Increment version
        const versionParts = currentPolicy.version.split('.')
        const newVersion = `${versionParts[0]}.${parseInt(versionParts[1] || '0') + 1}`
        body.version = newVersion
      }
    }
    
    const { data, error } = await supabase
      .from('policies')
      .update(body)
      .eq('id', params.id)
      .select(`
        *,
        sports:sport_id(sport_code, sport_name)
      `)
      .single()

    if (error) {
      console.error('Error updating policy:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Update policy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('policies')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting policy:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Policy deleted successfully' })
    
  } catch (error) {
    console.error('Delete policy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}