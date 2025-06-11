import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { policy_id, version_from, version_to } = await request.json()
    
    if (!policy_id || !version_from || !version_to) {
      return NextResponse.json({ 
        error: 'policy_id, version_from, and version_to are required' 
      }, { status: 400 })
    }

    // Get the two versions to compare
    const { data: fromVersion, error: fromError } = await supabase
      .from('policy_versions')
      .select('content_text, content_url, version_number')
      .eq('policy_id', policy_id)
      .eq('version_number', version_from)
      .single()

    const { data: toVersion, error: toError } = await supabase
      .from('policy_versions')
      .select('content_text, content_url, version_number')
      .eq('policy_id', policy_id)
      .eq('version_number', version_to)
      .single()

    if (fromError || toError) {
      return NextResponse.json({ 
        error: 'One or both versions not found' 
      }, { status: 404 })
    }

    // Simple text comparison (in a real app, you'd use a proper diff library)
    const comparison = {
      policy_id,
      version_from,
      version_to,
      from_content: fromVersion.content_text,
      to_content: toVersion.content_text,
      from_url: fromVersion.content_url,
      to_url: toVersion.content_url,
      changes_detected: fromVersion.content_text !== toVersion.content_text,
      comparison_summary: generateComparisonSummary(fromVersion.content_text, toVersion.content_text)
    }

    // Store the comparison result
    const { data: savedComparison, error: saveError } = await supabase
      .from('policy_comparisons')
      .upsert({
        policy_id,
        version_from,
        version_to,
        comparison_data: comparison,
        changes_summary: comparison.comparison_summary
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving comparison:', saveError)
      // Continue even if save fails
    }

    return NextResponse.json(comparison)
    
  } catch (error) {
    console.error('Policy comparison API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateComparisonSummary(fromText: string, toText: string): string {
  if (!fromText || !toText) {
    return 'One or both versions have no content'
  }
  
  if (fromText === toText) {
    return 'No changes detected'
  }
  
  const fromLength = fromText.length
  const toLength = toText.length
  const lengthDiff = toLength - fromLength
  
  let summary = `Content length changed by ${lengthDiff} characters. `
  
  if (lengthDiff > 0) {
    summary += 'Content was expanded.'
  } else if (lengthDiff < 0) {
    summary += 'Content was reduced.'
  }
  
  // Simple word count comparison
  const fromWords = fromText.split(/\s+/).length
  const toWords = toText.split(/\s+/).length
  const wordDiff = toWords - fromWords
  
  if (wordDiff !== 0) {
    summary += ` Word count changed by ${wordDiff} words.`
  }
  
  return summary
}