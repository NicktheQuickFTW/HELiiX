import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Mock storage for categories (in production, this would be in the database)
let customCategories = [
  {
    id: 'video_replay',
    name: 'Video Replay',
    description: 'Video replay systems, review procedures, and technology usage',
    keywords: ['video', 'replay', 'review', 'technology', 'instant replay', 'VAR', 'video assistant'],
    sports_applicable: ['Football', 'Basketball', 'Soccer', 'Baseball', 'Volleyball'],
    created_at: new Date().toISOString(),
    query_template: 'Compare video replay systems, review procedures, and technology usage policies'
  },
  {
    id: 'injury_protocols',
    name: 'Injury Protocols',
    description: 'Player injury assessment, concussion protocols, and medical procedures',
    keywords: ['injury', 'concussion', 'medical', 'protocol', 'assessment', 'trainer', 'physician'],
    sports_applicable: ['Football', 'Basketball', 'Soccer', 'Wrestling', 'Gymnastics'],
    created_at: new Date().toISOString(),
    query_template: 'Compare injury assessment protocols, concussion procedures, and medical staff requirements'
  },
  {
    id: 'timeout_procedures',
    name: 'Timeout Procedures',
    description: 'Team timeouts, media timeouts, and game stoppage procedures',
    keywords: ['timeout', 'stoppage', 'break', 'media timeout', 'team timeout', 'clock'],
    sports_applicable: ['Football', 'Basketball', 'Volleyball', 'Soccer'],
    created_at: new Date().toISOString(),
    query_template: 'Compare timeout procedures, media timeouts, and game stoppage policies'
  }
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      categories: customCategories,
      total: customCategories.length
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, keywords, sports_applicable, query_template } = await request.json()

    // Validate required fields
    if (!name || !description || !keywords || !sports_applicable) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, description, keywords, sports_applicable' 
      }, { status: 400 })
    }

    // Generate ID from name
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '_')

    // Check if category already exists
    if (customCategories.find(cat => cat.id === id)) {
      return NextResponse.json({ 
        error: 'Category with this name already exists' 
      }, { status: 409 })
    }

    const newCategory = {
      id,
      name,
      description,
      keywords: Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim()),
      sports_applicable: Array.isArray(sports_applicable) ? sports_applicable : [sports_applicable],
      query_template: query_template || `Compare ${name.toLowerCase()} policies and procedures across sports`,
      created_at: new Date().toISOString()
    }

    customCategories.push(newCategory)

    return NextResponse.json({
      message: 'Category created successfully',
      category: newCategory
    })

  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, keywords, sports_applicable, query_template } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const categoryIndex = customCategories.findIndex(cat => cat.id === id)
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Update category
    customCategories[categoryIndex] = {
      ...customCategories[categoryIndex],
      ...(name && { name }),
      ...(description && { description }),
      ...(keywords && { keywords: Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim()) }),
      ...(sports_applicable && { sports_applicable: Array.isArray(sports_applicable) ? sports_applicable : [sports_applicable] }),
      ...(query_template && { query_template }),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({
      message: 'Category updated successfully',
      category: customCategories[categoryIndex]
    })

  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const categoryIndex = customCategories.findIndex(cat => cat.id === id)
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const deletedCategory = customCategories.splice(categoryIndex, 1)[0]

    return NextResponse.json({
      message: 'Category deleted successfully',
      category: deletedCategory
    })

  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}