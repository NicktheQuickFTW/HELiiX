import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { sport_id, template_type, season_year, include_sections } = await request.json()
    
    if (!sport_id || !template_type || !season_year) {
      return NextResponse.json({ 
        error: 'sport_id, template_type, and season_year are required' 
      }, { status: 400 })
    }

    // Get sport information
    const { data: sport, error: sportError } = await supabase
      .from('sports')
      .select('*')
      .eq('sport_id', sport_id)
      .single()

    if (sportError || !sport) {
      return NextResponse.json({ error: 'Sport not found' }, { status: 404 })
    }

    // Get relevant policies for this sport
    const { data: policies, error: policiesError } = await supabase
      .from('policies')
      .select('*')
      .or(`sport_id.eq.${sport_id},sport_id.is.null`)
      .eq('status', 'current')
      .in('category', include_sections || ['sport_specific', 'championship_procedures', 'officiating'])

    if (policiesError) {
      console.error('Error fetching policies:', policiesError)
      return NextResponse.json({ error: 'Error fetching policies' }, { status: 500 })
    }

    // Generate manual content using AI
    const manualContent = await generateManualWithAI({
      sport,
      policies: policies || [],
      template_type,
      season_year,
      include_sections
    })

    // Save generated manual record
    const { data: generatedManual, error: saveError } = await supabase
      .from('generated_manuals')
      .insert({
        sport_id,
        title: `${sport.sport_name} ${template_type.replace('_', ' ')} Manual ${season_year}`,
        season_year,
        policies_included: policies?.map(p => p.id) || [],
        status: 'generated',
        metadata: {
          template_type,
          include_sections,
          generated_at: new Date().toISOString(),
          content_preview: manualContent.substring(0, 500)
        }
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving manual:', saveError)
      return NextResponse.json({ error: 'Error saving manual' }, { status: 500 })
    }

    return NextResponse.json({
      manual: generatedManual,
      content: manualContent,
      policies_included: policies?.length || 0
    })

  } catch (error) {
    console.error('Manual generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateManualWithAI({ sport, policies, template_type, season_year, include_sections }: any) {
  // This would integrate with the existing AI providers
  // For now, return a structured manual template
  
  const sections = []
  
  // Title Page
  sections.push(`
# ${sport.sport_name} ${template_type.replace('_', ' ')} Manual
## Big 12 Conference
### ${season_year} Season

---
`)

  // Table of Contents
  sections.push(`
## Table of Contents

1. Overview
2. Competition Format
3. Eligibility Requirements
4. Championship Procedures
5. Officiating Guidelines
6. Equipment Specifications
7. Administrative Procedures
8. Appendices

---
`)

  // Overview Section
  sections.push(`
## 1. Overview

This manual provides comprehensive guidelines for ${sport.sport_name} operations within the Big 12 Conference for the ${season_year} season.

### Sport Information
- **Sport Code**: ${sport.sport_code}
- **Gender**: ${sport.gender}
- **Season**: ${sport.sport_season}
- **Participating Teams**: ${sport.team_count}

---
`)

  // Generate sections based on policies
  if (include_sections?.includes('sport_specific')) {
    const sportPolicies = policies.filter((p: any) => p.category === 'sport_specific')
    if (sportPolicies.length > 0) {
      sections.push(`
## 2. Competition Format

${sportPolicies
  .filter((p: any) => p.title.toLowerCase().includes('format') || p.title.toLowerCase().includes('competition'))
  .map((p: any) => `
### ${p.title}
${p.summary || 'Policy content to be inserted here.'}

${p.content_text || 'Detailed policy content will be extracted from the source document.'}
`).join('\n')}

---
`)
    }
  }

  if (include_sections?.includes('championship_procedures')) {
    const championshipPolicies = policies.filter((p: any) => 
      p.category === 'championship_procedures' || 
      p.title.toLowerCase().includes('championship')
    )
    if (championshipPolicies.length > 0) {
      sections.push(`
## 4. Championship Procedures

${championshipPolicies.map((p: any) => `
### ${p.title}
${p.summary || 'Championship procedure details.'}

${p.content_text || 'Detailed championship procedures will be extracted from the source document.'}
`).join('\n')}

---
`)
    }
  }

  if (include_sections?.includes('officiating')) {
    const officiatingPolicies = policies.filter((p: any) => 
      p.category === 'officiating' || 
      p.title.toLowerCase().includes('official')
    )
    if (officiatingPolicies.length > 0) {
      sections.push(`
## 5. Officiating Guidelines

${officiatingPolicies.map((p: any) => `
### ${p.title}
${p.summary || 'Officiating guidelines and procedures.'}

${p.content_text || 'Detailed officiating guidelines will be extracted from the source document.'}
`).join('\n')}

---
`)
    }
  }

  // Administrative Procedures
  sections.push(`
## 7. Administrative Procedures

### Contact Information
- **Conference Office**: Big 12 Conference
- **Sport Supervisor**: TBD
- **Championship Director**: TBD

### Important Dates
- **Season Start**: TBD
- **Championship Selection**: TBD
- **Championship Event**: TBD

### Compliance Requirements
- All participating institutions must comply with Big 12 Conference policies
- NCAA regulations apply to all championship events
- Regular updates will be provided throughout the season

---
`)

  // Appendices
  sections.push(`
## 8. Appendices

### Appendix A: Contact Directory
[Contact information for all participating schools]

### Appendix B: Forms and Documents
[Required forms and documentation]

### Appendix C: Emergency Procedures
[Emergency contact information and procedures]

---

*This manual was generated automatically from current Big 12 Conference policies and procedures. For the most up-to-date information, please contact the Conference office.*

**Generated**: ${new Date().toLocaleDateString()}
**Season**: ${season_year}
**Version**: 1.0
`)

  return sections.join('\n')
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    
    const sport_id = searchParams.get('sport_id')
    const season = searchParams.get('season')
    
    let query = supabase
      .from('generated_manuals')
      .select(`
        *,
        sports:sport_id(sport_code, sport_name)
      `)
      .order('created_at', { ascending: false })
    
    if (sport_id) {
      query = query.eq('sport_id', sport_id)
    }
    
    if (season) {
      query = query.eq('season_year', season)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching generated manuals:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Get generated manuals error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}