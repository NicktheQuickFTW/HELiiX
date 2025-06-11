import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

const CONFERENCE_MANUALS_PATH = '/Users/nickw/Library/CloudStorage/OneDrive-TheBig12Conference,Inc/Company Drive/CHAMPIONSHIPS/Manuals/[03] General Conference Manuals + Info'

interface ConferenceManual {
  filename: string
  type: 'handbook' | 'tv_handbook' | 'far_manual'
  fullPath: string
  season: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Define the conference manuals to parse
    const conferenceManuals: ConferenceManual[] = [
      {
        filename: '2024-25 Big 12 TV Handbook.pdf',
        type: 'tv_handbook',
        fullPath: path.join(CONFERENCE_MANUALS_PATH, '2024-25 Big 12 TV Handbook.pdf'),
        season: '2024-25'
      },
      {
        filename: '2024-25 FAR Manual.pdf', 
        type: 'far_manual',
        fullPath: path.join(CONFERENCE_MANUALS_PATH, 'FAR/2024-25 FAR Manual.pdf'),
        season: '2024-25'
      }
      // Note: Big 12 Conference Handbook path to be confirmed
    ]
    
    const results = []
    
    for (const manual of conferenceManuals) {
      try {
        // Check if file exists
        if (!fs.existsSync(manual.fullPath)) {
          results.push({
            manual: manual.filename,
            status: 'error',
            error: 'File not found'
          })
          continue
        }
        
        const conferenceSections = await extractConferenceSections(manual)
        
        for (const section of conferenceSections) {
          // Store conference-wide policies (sport_id = null)
          const { data, error } = await supabase
            .from('policies')
            .insert({
              title: section.title,
              short_name: section.shortName,
              category: section.category,
              sport_id: null, // Conference-wide policy
              policy_number: `CONF-${manual.type.toUpperCase()}-${section.id}`,
              version: '1.0',
              status: 'current',
              summary: section.summary,
              content_text: section.content,
              effective_date: `${manual.season.split('-')[0]}-09-01`,
              tags: ['conference', manual.type, 'general'],
              applies_to_sports: [], // Applies to all sports
              metadata: {
                source_manual: manual.filename,
                manual_type: manual.type,
                season: manual.season,
                section_type: section.type,
                extracted_at: new Date().toISOString()
              }
            })
            .select()
          
          if (error) {
            console.error(`Error storing conference section:`, error)
          } else {
            results.push({
              manual: manual.filename,
              section: section.title,
              category: section.category,
              status: 'processed'
            })
          }
        }
        
      } catch (error) {
        console.error(`Error processing ${manual.filename}:`, error)
        results.push({
          manual: manual.filename,
          status: 'error',
          error: error.message
        })
      }
    }
    
    return NextResponse.json({
      message: 'Conference manual parsing completed',
      processed: results.length,
      results
    })
    
  } catch (error) {
    console.error('Conference manual parsing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function extractConferenceSections(manual: ConferenceManual) {
  const sections = []
  
  switch (manual.type) {
    case 'tv_handbook':
      sections.push(
        {
          id: '001',
          title: 'Television Broadcasting Standards',
          shortName: 'tv_standards',
          category: 'broadcasting_standards',
          type: 'broadcasting',
          summary: 'Big 12 Conference television broadcasting standards and technical requirements',
          content: 'Conference-wide television broadcasting policies, technical standards, and production requirements'
        },
        {
          id: '002',
          title: 'Media Production Guidelines',
          shortName: 'media_production',
          category: 'media_relations',
          type: 'media',
          summary: 'Guidelines for media production, content creation, and distribution',
          content: 'Media production standards, content guidelines, and distribution procedures for Big 12 Conference'
        },
        {
          id: '003',
          title: 'Broadcast Rights and Procedures',
          shortName: 'broadcast_rights',
          category: 'financial_regulations',
          type: 'broadcasting',
          summary: 'Television broadcast rights management and operational procedures',
          content: 'Broadcast rights management, revenue distribution, and operational procedures for conference events'
        },
        {
          id: '004',
          title: 'Commercial and Advertising Standards',
          shortName: 'advertising',
          category: 'broadcasting_standards',
          type: 'advertising',
          summary: 'Commercial content standards and advertising guidelines for broadcasts',
          content: 'Commercial content standards, advertising guidelines, and sponsorship integration for TV broadcasts'
        }
      )
      break
      
    case 'far_manual':
      sections.push(
        {
          id: '001',
          title: 'Faculty Athletic Representative Duties',
          shortName: 'far_duties',
          category: 'governance',
          type: 'administrative',
          summary: 'Roles, responsibilities, and authority of Faculty Athletic Representatives',
          content: 'Comprehensive duties, responsibilities, and decision-making authority for Faculty Athletic Representatives'
        },
        {
          id: '002',
          title: 'Academic Integrity Standards',
          shortName: 'academic_integrity',
          category: 'academic_standards',
          type: 'academic',
          summary: 'Academic integrity standards and compliance requirements for student-athletes',
          content: 'Academic integrity policies, monitoring procedures, and compliance requirements for Big 12 institutions'
        },
        {
          id: '003',
          title: 'Eligibility Oversight Procedures',
          shortName: 'eligibility_oversight',
          category: 'eligibility_requirements',
          type: 'eligibility',
          summary: 'Student-athlete eligibility oversight, monitoring, and certification procedures',
          content: 'Procedures for monitoring, verifying, and ensuring student-athlete eligibility compliance across all sports'
        },
        {
          id: '004',
          title: 'Academic Progress Monitoring',
          shortName: 'academic_progress',
          category: 'academic_standards',
          type: 'monitoring',
          summary: 'Academic progress tracking and intervention procedures for student-athletes',
          content: 'Academic progress monitoring systems, intervention procedures, and support services for student-athletes'
        },
        {
          id: '005',
          title: 'Transfer and Recruiting Oversight',
          shortName: 'transfer_recruiting',
          category: 'recruiting_rules',
          type: 'oversight',
          summary: 'FAR oversight of transfer portal and recruiting compliance',
          content: 'Faculty Athletic Representative oversight responsibilities for transfer portal and recruiting compliance'
        }
      )
      break
      
    case 'handbook':
      sections.push(
        {
          id: '001',
          title: 'Conference Governance Structure',
          shortName: 'governance',
          category: 'governance',
          type: 'organizational',
          summary: 'Big 12 Conference organizational structure and governance',
          content: 'Conference governance structure, board composition, and decision-making processes'
        },
        {
          id: '002',
          title: 'General Conference Policies',
          shortName: 'general_policies',
          category: 'governance',
          type: 'policy',
          summary: 'General policies applicable across all conference operations',
          content: 'General conference policies and procedures applicable to all member institutions'
        },
        {
          id: '003',
          title: 'Member Institution Requirements',
          shortName: 'member_requirements',
          category: 'compliance',
          type: 'membership',
          summary: 'Requirements and obligations for Big 12 member institutions',
          content: 'Membership requirements, obligations, and standards for Big 12 institutions'
        },
        {
          id: '004',
          title: 'Championship Operations',
          shortName: 'championship_ops',
          category: 'championship_procedures',
          type: 'operations',
          summary: 'General championship operations and procedures',
          content: 'Conference championship organization, operations, and administrative procedures'
        }
      )
      break
  }
  
  // Filter to only include policy-relevant sections
  return sections.filter(section => 
    isValidConferenceSection(section.title, section.content)
  )
}

function isValidConferenceSection(title: string, content: string): boolean {
  const titleLower = title.toLowerCase()
  
  // Skip sections that are administrative/operational only
  const SKIP_KEYWORDS = [
    'contact', 'directory', 'phone', 'address', 'calendar',
    'schedule', 'timeline', 'budget', 'financial'
  ]
  
  if (SKIP_KEYWORDS.some(keyword => titleLower.includes(keyword))) {
    return false
  }
  
  // Include policy-related content
  const POLICY_KEYWORDS = [
    'policy', 'procedure', 'requirement', 'standard', 'guideline',
    'rule', 'regulation', 'compliance', 'governance', 'eligibility',
    'oversight', 'monitoring', 'integrity', 'responsibility'
  ]
  
  return POLICY_KEYWORDS.some(keyword => 
    titleLower.includes(keyword) || content.toLowerCase().includes(keyword)
  )
}

export async function GET(request: NextRequest) {
  try {
    // Return available conference manuals for parsing
    const manuals = [
      {
        filename: '2024-25 Big 12 TV Handbook.pdf',
        type: 'tv_handbook',
        description: 'Television broadcasting standards and media production guidelines',
        exists: fs.existsSync(path.join(CONFERENCE_MANUALS_PATH, '2024-25 Big 12 TV Handbook.pdf'))
      },
      {
        filename: '2024-25 FAR Manual.pdf',
        type: 'far_manual', 
        description: 'Faculty Athletic Representative duties and academic compliance',
        exists: fs.existsSync(path.join(CONFERENCE_MANUALS_PATH, 'FAR/2024-25 FAR Manual.pdf'))
      }
    ]
    
    return NextResponse.json({
      manuals,
      total: manuals.length,
      available: manuals.filter(m => m.exists).length
    })
    
  } catch (error) {
    console.error('Error scanning conference manuals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}