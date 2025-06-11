import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execAsync = promisify(exec)
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

interface ManualAnalysis {
  filename: string
  sport: string
  sportCode: string
  sections: SectionHeader[]
  tableOfContents: string[]
  sportSpecificSections: SectionHeader[]
}

interface SectionHeader {
  title: string
  level: number
  pageNumber?: number
  category?: string
  isSportSpecific: boolean
}

export async function POST(request: NextRequest) {
  try {
    const files = fs.readdirSync(MANUALS_PATH)
    const analyses: ManualAnalysis[] = []
    
    for (const filename of files) {
      if (!filename.endsWith('.pdf')) continue
      
      // Parse filename to extract sport
      const sportMatch = Object.keys(SPORT_MAPPING).find(sport => 
        filename.toLowerCase().includes(sport.toLowerCase())
      )
      
      if (!sportMatch) continue
      
      const fullPath = path.join(MANUALS_PATH, filename)
      
      try {
        console.log(`Analyzing ${filename}...`)
        
        // Extract text from PDF using pdftotext (part of poppler-utils)
        const { stdout } = await execAsync(`pdftotext "${fullPath}" -`)
        
        const analysis = await analyzePDFContent(stdout, filename, sportMatch)
        analyses.push(analysis)
        
      } catch (error) {
        console.error(`Error analyzing ${filename}:`, error)
        analyses.push({
          filename,
          sport: sportMatch,
          sportCode: SPORT_MAPPING[sportMatch],
          sections: [],
          tableOfContents: [],
          sportSpecificSections: [],
          error: error.message
        } as any)
      }
    }
    
    // Analyze patterns across all sports
    const categoryAnalysis = analyzeCategoryPatterns(analyses)
    
    return NextResponse.json({
      message: 'Manual section analysis completed',
      analyses,
      categoryAnalysis,
      totalManuals: analyses.length
    })
    
  } catch (error) {
    console.error('Manual analysis error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function analyzePDFContent(pdfText: string, filename: string, sport: string): Promise<ManualAnalysis> {
  const lines = pdfText.split('\n')
  const sections: SectionHeader[] = []
  const tableOfContents: string[] = []
  let inTOC = false
  let inSportSpecific = false
  
  // Patterns to identify different section types
  const CONFERENCE_KEYWORDS = [
    'conference rules', 'conference policies', 'big 12 policies',
    'general conference', 'conference governance', 'conference procedures'
  ]
  
  const SPORT_SPECIFIC_KEYWORDS = [
    'sport-specific', `${sport.toLowerCase()} specific`, 'sport specific',
    'playing rules', 'competition format', 'championship procedures'
  ]
  
  const TOC_PATTERNS = [
    /table of contents/i,
    /contents/i,
    /^\.{3,}/,  // Lines with multiple dots
    /^\d+\..*\d+$/  // Lines ending with page numbers
  ]
  
  const HEADER_PATTERNS = [
    /^[A-Z][A-Z\s\-&]+$/,  // ALL CAPS headers
    /^\d+\.\s+[A-Z]/, // Numbered sections
    /^[A-Z][a-z]+.*:$/, // Title case with colon
    /^Section \d+/i,  // Section headers
    /^Chapter \d+/i,  // Chapter headers
    /^Part [A-Z]/i,   // Part headers
    /^Appendix/i      // Appendix headers
  ]
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    // Detect table of contents
    if (TOC_PATTERNS.some(pattern => pattern.test(line))) {
      inTOC = true
      continue
    }
    
    // Stop TOC detection after significant content
    if (inTOC && line.length > 100) {
      inTOC = false
    }
    
    if (inTOC) {
      tableOfContents.push(line)
      continue
    }
    
    // Detect sport-specific sections
    const lowerLine = line.toLowerCase()
    if (SPORT_SPECIFIC_KEYWORDS.some(keyword => lowerLine.includes(keyword))) {
      inSportSpecific = true
    }
    
    if (CONFERENCE_KEYWORDS.some(keyword => lowerLine.includes(keyword))) {
      inSportSpecific = false
    }
    
    // Identify section headers
    if (HEADER_PATTERNS.some(pattern => pattern.test(line))) {
      const level = getHeaderLevel(line)
      const pageNumber = extractPageNumber(lines, i)
      
      sections.push({
        title: line,
        level,
        pageNumber,
        isSportSpecific: inSportSpecific,
        category: categorizeSection(line, sport)
      })
    }
  }
  
  const sportSpecificSections = sections.filter(s => s.isSportSpecific)
  
  return {
    filename,
    sport,
    sportCode: SPORT_MAPPING[sport],
    sections,
    tableOfContents,
    sportSpecificSections
  }
}

function getHeaderLevel(line: string): number {
  if (line.match(/^Chapter \d+/i)) return 1
  if (line.match(/^Section \d+/i)) return 2
  if (line.match(/^\d+\.\s/)) return 3
  if (line.match(/^[A-Z][A-Z\s\-&]+$/)) return 2
  return 3
}

function extractPageNumber(lines: string[], currentIndex: number): number | undefined {
  // Look for page numbers in nearby lines
  for (let i = Math.max(0, currentIndex - 2); i <= Math.min(lines.length - 1, currentIndex + 2); i++) {
    const match = lines[i].match(/\b(\d+)\b/)
    if (match) {
      const num = parseInt(match[1])
      if (num > 0 && num < 1000) return num
    }
  }
  return undefined
}

function categorizeSection(title: string, sport: string): string {
  const lowerTitle = title.toLowerCase()
  
  // Weather-related
  if (lowerTitle.includes('weather') || lowerTitle.includes('postpone') || lowerTitle.includes('delay')) {
    return 'weather_policies'
  }
  
  // Competition format
  if (lowerTitle.includes('format') || lowerTitle.includes('competition') || lowerTitle.includes('game')) {
    return 'season_format'
  }
  
  // Eligibility
  if (lowerTitle.includes('eligib') || lowerTitle.includes('roster') || lowerTitle.includes('player')) {
    return 'eligibility_requirements'
  }
  
  // Equipment
  if (lowerTitle.includes('equipment') || lowerTitle.includes('uniform') || lowerTitle.includes('gear')) {
    return 'equipment_specifications'
  }
  
  // Facilities
  if (lowerTitle.includes('facility') || lowerTitle.includes('venue') || lowerTitle.includes('field') || lowerTitle.includes('court')) {
    return 'facility_standards'
  }
  
  // Officials
  if (lowerTitle.includes('official') || lowerTitle.includes('referee') || lowerTitle.includes('umpire')) {
    return 'officiating'
  }
  
  // Safety
  if (lowerTitle.includes('safety') || lowerTitle.includes('injury') || lowerTitle.includes('medical')) {
    return 'safety_protocols'
  }
  
  // Media
  if (lowerTitle.includes('media') || lowerTitle.includes('broadcast') || lowerTitle.includes('television')) {
    return 'media_relations'
  }
  
  // Travel
  if (lowerTitle.includes('travel') || lowerTitle.includes('transportation') || lowerTitle.includes('hotel')) {
    return 'travel_procedures'
  }
  
  // Championship
  if (lowerTitle.includes('championship') || lowerTitle.includes('tournament') || lowerTitle.includes('postseason')) {
    return 'championship_procedures'
  }
  
  // Awards
  if (lowerTitle.includes('award') || lowerTitle.includes('recognition') || lowerTitle.includes('honor')) {
    return 'awards_recognition'
  }
  
  // Academic
  if (lowerTitle.includes('academic') || lowerTitle.includes('education') || lowerTitle.includes('grade')) {
    return 'academic_standards'
  }
  
  return 'sport_specific'
}

function analyzeCategoryPatterns(analyses: ManualAnalysis[]) {
  const categoryCount: Record<string, number> = {}
  const categoriesBySport: Record<string, Set<string>> = {}
  const sectionTitlesBySport: Record<string, string[]> = {}
  
  analyses.forEach(analysis => {
    if (!analysis.sportSpecificSections) return
    
    categoriesBySport[analysis.sport] = new Set()
    sectionTitlesBySport[analysis.sport] = []
    
    analysis.sportSpecificSections.forEach(section => {
      if (section.category) {
        categoryCount[section.category] = (categoryCount[section.category] || 0) + 1
        categoriesBySport[analysis.sport].add(section.category)
      }
      sectionTitlesBySport[analysis.sport].push(section.title)
    })
  })
  
  // Convert sets to arrays for JSON serialization
  const categoriesBySporyArray: Record<string, string[]> = {}
  Object.keys(categoriesBySport).forEach(sport => {
    categoriesBySporyArray[sport] = Array.from(categoriesBySport[sport])
  })
  
  return {
    totalCategories: Object.keys(categoryCount).length,
    categoryCount,
    categoriesBySport: categoriesBySporyArray,
    sectionTitlesBySport,
    commonCategories: Object.entries(categoryCount)
      .filter(([_, count]) => count >= analyses.length * 0.5) // Present in 50%+ of sports
      .map(([category, _]) => category)
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return available manuals for analysis
    const files = fs.readdirSync(MANUALS_PATH)
    const manuals = []
    
    for (const filename of files) {
      if (!filename.endsWith('.pdf')) continue
      
      const sportMatch = Object.keys(SPORT_MAPPING).find(sport => 
        filename.toLowerCase().includes(sport.toLowerCase())
      )
      
      if (!sportMatch) continue
      
      const stats = fs.statSync(path.join(MANUALS_PATH, filename))
      
      manuals.push({
        filename,
        sport: sportMatch,
        sportCode: SPORT_MAPPING[sportMatch],
        size: stats.size,
        modified: stats.mtime
      })
    }
    
    return NextResponse.json({
      manuals,
      total: manuals.length,
      message: 'Ready to analyze section headers from sport-specific information'
    })
    
  } catch (error) {
    console.error('Error scanning manuals for analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}