import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    
    // Test creating a simple policy entry without sport_id dependency
    const testPolicy = {
      title: 'Football Television Timeout Test Policy',
      short_name: 'fb_tv_timeout_test',
      category: 'media_relations',
      sport_id: null, // Start with null to avoid sport ID issues
      policy_number: 'TEST-FB-001',
      version: '1.0',
      status: 'draft',
      summary: 'Test policy for football television timeouts',
      content_text: 'This is a test policy to verify the database connection and policy creation.',
      effective_date: '2024-08-15',
      tags: ['test', 'football', 'media'],
      applies_to_sports: ['FB'],
      metadata: {
        source: 'test_creation',
        created_via: 'api_test'
      }
    }
    
    const { data, error } = await supabase
      .from('policies')
      .insert(testPolicy)
      .select()
    
    if (error) {
      console.error('Error creating test policy:', error)
      return NextResponse.json({ 
        error: 'Database error', 
        details: error.message,
        hint: error.hint 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Test policy created successfully',
      policy: data[0]
    })
    
  } catch (error) {
    console.error('Test policy API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    
    // Test reading policies
    const { data: policies, error } = await supabase
      .from('policies')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('Error fetching policies:', error)
      return NextResponse.json({ 
        error: 'Database error', 
        details: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Policies fetched successfully',
      count: policies.length,
      policies 
    })
    
  } catch (error) {
    console.error('Test policy fetch error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}