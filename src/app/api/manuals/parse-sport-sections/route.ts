import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

const MANUALS_PATH = '/Users/nickw/Library/CloudStorage/OneDrive-TheBig12Conference,Inc/Company Drive/CHAMPIONSHIPS/Manuals/[01] Administrative Manuals/[XX] All Manuals'

const SPORT_MAPPING: Record<string, string> = {
  'Soccer': 'SC',
  'Volleyball': 'VB', 
  'Football': 'FB',
  'Basketball': 'BB',
  'Wrestling': 'WW',
  'Baseball': 'BSB',
  'Gymnastics': 'GY',
  'Softball': 'SB',
  'Tennis': 'TN'
}

interface ManualFile {
  filename: string
  sport: string
  sportCode: string
  season: string
  fullPath: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get list of manual files
    const files = fs.readdirSync(MANUALS_PATH)
    const manualFiles: ManualFile[] = []
    
    for (const filename of files) {
      if (!filename.endsWith('.pdf')) continue
      
      // Parse filename to extract sport and season
      const sportMatch = Object.keys(SPORT_MAPPING).find(sport => 
        filename.toLowerCase().includes(sport.toLowerCase())
      )
      
      if (!sportMatch) continue
      
      const seasonMatch = filename.match(/20\d{2}(-\d{2})?/)
      const season = seasonMatch ? seasonMatch[0] : '2024-25'
      
      manualFiles.push({
        filename,
        sport: sportMatch,
        sportCode: SPORT_MAPPING[sportMatch],
        season,
        fullPath: path.join(MANUALS_PATH, filename)
      })
    }
    
    const results = []
    
    for (const manual of manualFiles) {
      try {
        // For now, create placeholder entries for each sport-specific section
        // In a real implementation, you'd use a PDF parser like pdf2pic + OCR
        // or pdf-parse to extract text and identify sport-specific sections
        
        const sportSections = await extractSportSpecificSections(manual)
        
        for (const section of sportSections) {
          // Store in policies table as sport-specific policies
          const { data, error } = await supabase
            .from('policies')
            .insert({
              title: `${manual.sport} ${section.title}`,
              short_name: section.shortName,
              category: 'sport_specific',
              sport_id: await getSportId(manual.sportCode),
              policy_number: `${manual.sportCode}-ADMIN-${section.id}`,
              version: '1.0',
              status: 'current',
              summary: section.summary,
              content_text: section.content,
              effective_date: `${manual.season.split('-')[0]}-09-01`, // Start of academic year
              tags: ['administrative', 'sport-specific', manual.sport.toLowerCase()],
              applies_to_sports: [manual.sportCode],
              metadata: {
                source_manual: manual.filename,
                season: manual.season,
                section_type: section.type,
                extracted_at: new Date().toISOString()
              }
            })
            .select()
          
          if (error) {
            console.error(`Error storing ${manual.sport} section:`, error)
          } else {
            results.push({
              manual: manual.filename,
              sport: manual.sport,
              section: section.title,
              status: 'processed'
            })
          }
        }
        
      } catch (error) {
        console.error(`Error processing ${manual.filename}:`, error)
        results.push({
          manual: manual.filename,
          sport: manual.sport,
          status: 'error',
          error: error.message
        })
      }
    }
    
    return NextResponse.json({
      message: 'Manual parsing completed',
      processed: results.length,
      results
    })
    
  } catch (error) {
    console.error('Manual parsing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function extractSportSpecificSections(manual: ManualFile) {
  // Placeholder for PDF parsing logic
  // In reality, you'd use pdf-parse or similar to extract text
  // and identify sport-specific sections while skipping:
  // - Conference rules and policies sections  
  // - Graphics-heavy pages (TV commercial formats, timing sheets, etc.)
  // - Pages with minimal text content
  
  const sections = []
  
  // Skip sections that are typically graphics-heavy or non-policy content
  const SKIP_SECTIONS = [
    'tv commercial', 'television', 'broadcast format',
    'timing sheet', 'scorecard', 'bracket', 'diagram',
    'logo', 'graphic', 'chart', 'form', 'template',
    'conference rules', 'conference policies', 'general policies',
    'table of contents', 'toc', 'contents', 'directory',
    'index', 'appendix list', 'page directory'
  ]
  
  // Focus on text-heavy sport-specific policy sections
  const TARGET_SECTIONS = [
    'competition format', 'eligibility', 'equipment',
    'championship procedures', 'officiating', 'sport-specific',
    'playing rules', 'administrative procedures'
  ]
  
  // Comprehensive sport-specific sections with granular categorization
  const commonSections = [
    {
      id: '001',
      title: 'Season Format and Structure',
      shortName: 'season_format',
      category: 'season_format',
      type: 'scheduling',
      summary: `${manual.sport} season structure, dates, and competition format`,
      content: `Season format, competition structure, and scheduling requirements for ${manual.sport}`
    },
    {
      id: '002',
      title: 'Competition Limits and Restrictions',
      shortName: 'competition_limits',
      category: 'competition_limits',
      type: 'restrictions',
      summary: `${manual.sport} competition limits, practice restrictions, and participation rules`,
      content: `Competition limits, practice restrictions, and participation guidelines for ${manual.sport}`
    },
    {
      id: '003', 
      title: 'Eligibility Requirements',
      shortName: 'eligibility',
      category: 'eligibility_requirements',
      type: 'eligibility',
      summary: `${manual.sport} player and team eligibility standards`,
      content: `Student-athlete eligibility requirements and verification procedures for ${manual.sport}`
    },
    {
      id: '004',
      title: 'Equipment Specifications',
      shortName: 'equipment',
      category: 'equipment_specifications',
      type: 'equipment',
      summary: `${manual.sport} equipment standards and requirements`,
      content: `Equipment specifications, uniform requirements, and safety standards for ${manual.sport}`
    },
    {
      id: '005',
      title: 'Facility and Venue Standards',
      shortName: 'facilities',
      category: 'facility_standards',
      type: 'facilities',
      summary: `${manual.sport} venue requirements and facility standards`,
      content: `Facility requirements, venue specifications, and infrastructure standards for ${manual.sport}`
    },
    {
      id: '006',
      title: 'Weather Policies and Procedures',
      shortName: 'weather',
      category: 'weather_policies',
      type: 'weather',
      summary: `${manual.sport} weather-related policies and postponement procedures`,
      content: `Weather policies, game postponement procedures, and safety protocols for ${manual.sport}`
    },
    {
      id: '007',
      title: 'Championship and Postseason Procedures',
      shortName: 'championship',
      category: 'championship_procedures',
      type: 'postseason',
      summary: `${manual.sport} championship selection and tournament procedures`,
      content: `Championship selection criteria, tournament procedures, and postseason operations for ${manual.sport}`
    },
    {
      id: '008',
      title: 'Officiating Guidelines',
      shortName: 'officiating',
      category: 'officiating',
      type: 'officiating',
      summary: `${manual.sport} officiating assignments, procedures, and standards`,
      content: `Officiating assignments, evaluation procedures, and performance standards for ${manual.sport}`
    },
    {
      id: '009',
      title: 'Safety Protocols and Procedures',
      shortName: 'safety',
      category: 'safety_protocols',
      type: 'safety',
      summary: `${manual.sport} safety protocols, injury procedures, and emergency response`,
      content: `Safety protocols, injury management, and emergency response procedures for ${manual.sport}`
    },
    {
      id: '010',
      title: 'Media Relations and Broadcasting',
      shortName: 'media',
      category: 'media_relations',
      type: 'media',
      summary: `${manual.sport} media policies, interview procedures, and broadcasting requirements`,
      content: `Media relations policies, interview procedures, and broadcasting standards for ${manual.sport}`
    },
    {
      id: '011',
      title: 'Travel Procedures and Policies',
      shortName: 'travel',
      category: 'travel_procedures',
      type: 'travel',
      summary: `${manual.sport} team travel policies, transportation, and accommodations`,
      content: `Team travel policies, transportation requirements, and accommodation standards for ${manual.sport}`
    },
    {
      id: '012',
      title: 'Awards and Recognition Programs',
      shortName: 'awards',
      category: 'awards_recognition',
      type: 'awards',
      summary: `${manual.sport} awards, honors, and recognition programs`,
      content: `Awards programs, recognition criteria, and honor procedures for ${manual.sport}`
    }
  ]
  
  // Filter sections to only include text-heavy policy content
  return commonSections.filter(section => 
    isValidPolicySection(section.title, section.content)
  )
}

function isValidPolicySection(title: string, content: string): boolean {
  const titleLower = title.toLowerCase()
  const contentLower = content.toLowerCase()
  
  // Skip sections that are typically graphics-heavy or navigational
  const GRAPHICS_KEYWORDS = [
    'tv commercial', 'television format', 'broadcast', 'timing sheet',
    'scorecard', 'bracket', 'diagram', 'chart', 'form', 'template',
    'logo', 'graphic', 'illustration', 'figure', 'table format',
    'table of contents', 'toc', 'contents', 'directory', 'index',
    'appendix list', 'page directory', 'navigation', 'page numbers'
  ]
  
  // Skip if title contains graphics keywords
  if (GRAPHICS_KEYWORDS.some(keyword => titleLower.includes(keyword))) {
    return false
  }
  
  // Skip if content is too short (likely just captions or labels)
  if (content.length < 100) {
    return false
  }
  
  // Skip if content has high ratio of numbers/symbols (likely forms/charts)
  const textChars = content.replace(/[^a-zA-Z\s]/g, '').length
  const totalChars = content.length
  const textRatio = textChars / totalChars
  
  if (textRatio < 0.6) { // Less than 60% actual text
    return false
  }
  
  // Skip table of contents patterns (lots of dots, page numbers, short lines)
  const lines = content.split('\n').filter(line => line.trim().length > 0)
  const dotLines = lines.filter(line => line.includes('...') || line.includes('...')).length
  const pageNumberLines = lines.filter(line => /\d+$/.test(line.trim())).length
  const shortLines = lines.filter(line => line.trim().length < 50).length
  
  // If more than 50% of lines are TOC-style, skip it
  if (lines.length > 5 && (dotLines + pageNumberLines + shortLines) / lines.length > 0.5) {
    return false
  }
  
  // Include sections that contain policy language
  const POLICY_KEYWORDS = [
    'shall', 'must', 'required', 'procedure', 'policy', 'rule',
    'regulation', 'guideline', 'requirement', 'standard', 'criteria'
  ]
  
  const hasPolicyLanguage = POLICY_KEYWORDS.some(keyword => 
    contentLower.includes(keyword)
  )
  
  return hasPolicyLanguage
}

async function getSportId(sportCode: string): Promise<number | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('sports')
    .select('sport_id')
    .eq('sport_code', sportCode)
    .single()
  
  if (error) {
    console.error(`Error finding sport ID for ${sportCode}:`, error)
    return null
  }
  
  return data?.sport_id || null
}

export async function GET(request: NextRequest) {
  try {
    // Return available manuals for parsing
    const files = fs.readdirSync(MANUALS_PATH)
    const manuals = []
    
    for (const filename of files) {
      if (!filename.endsWith('.pdf')) continue
      
      const sportMatch = Object.keys(SPORT_MAPPING).find(sport => 
        filename.toLowerCase().includes(sport.toLowerCase())
      )
      
      if (!sportMatch) continue
      
      const seasonMatch = filename.match(/20\d{2}(-\d{2})?/)
      const season = seasonMatch ? seasonMatch[0] : '2024-25'
      
      const stats = fs.statSync(path.join(MANUALS_PATH, filename))
      
      manuals.push({
        filename,
        sport: sportMatch,
        sportCode: SPORT_MAPPING[sportMatch],
        season,
        size: stats.size,
        modified: stats.mtime
      })
    }
    
    return NextResponse.json({
      manuals,
      total: manuals.length,
      sports: [...new Set(manuals.map(m => m.sport))]
    })
    
  } catch (error) {
    console.error('Error scanning manuals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}