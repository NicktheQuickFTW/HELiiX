import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { geminiPro } from '@/lib/ai-providers'
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

interface CategoryAnalysisRequest {
  category: {
    id: string
    name: string
    description: string
    keywords: string[]
    sports_applicable: string[]
    query_template: string
  }
  sports?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { category, sports } = await request.json() as CategoryAnalysisRequest

    if (!category || !category.keywords) {
      return NextResponse.json({ 
        error: 'Category with keywords is required' 
      }, { status: 400 })
    }

    // Determine which sports to analyze
    const sportsToAnalyze = sports && sports.length > 0 
      ? sports 
      : category.sports_applicable

    // Extract relevant content for this category
    const categoryContent = await extractCategoryContent(category, sportsToAnalyze)
    
    if (!categoryContent.length) {
      return NextResponse.json({
        error: `No relevant content found for "${category.name}" across the selected sports`,
        category: category.name,
        sports: sportsToAnalyze
      }, { status: 404 })
    }

    // Generate AI analysis using the category's query template
    const analysis = await generateCategoryAnalysis(category, categoryContent)

    // Structure the findings by sport
    const sportFindings = structureFindingsBySport(categoryContent, analysis)

    return NextResponse.json({
      category: category.name,
      description: category.description,
      sports_analyzed: sportsToAnalyze,
      total_sections_found: categoryContent.reduce((acc, sport) => acc + sport.sections.length, 0),
      analysis: analysis,
      sport_findings: sportFindings,
      sources: categoryContent.map(sport => ({
        sport: sport.sport,
        filename: sport.filename,
        sections_found: sport.sections.length,
        relevance_score: calculateSportRelevance(sport.sections, category.keywords)
      })),
      query_used: category.query_template,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Category analysis error:', error)
    return NextResponse.json({ 
      error: 'Failed to analyze category',
      details: error.message 
    }, { status: 500 })
  }
}

async function extractCategoryContent(category: any, sports: string[]) {
  const files = fs.readdirSync(MANUALS_PATH)
  const categoryContent = []

  for (const filename of files) {
    if (!filename.endsWith('.pdf')) continue
    
    // Parse filename to extract sport
    const sportMatch = Object.keys(SPORT_MAPPING).find(sport => 
      filename.toLowerCase().includes(sport.toLowerCase())
    )
    
    if (!sportMatch || !sports.includes(sportMatch)) continue
    
    const fullPath = path.join(MANUALS_PATH, filename)
    
    try {
      console.log(`Analyzing ${filename} for category: ${category.name}`)
      
      // Extract text from PDF
      const { stdout } = await execAsync(`pdftotext "${fullPath}" -`)
      
      // Extract sections relevant to this category
      const sections = extractCategorySpecificSections(stdout, category)
      
      if (sections.length > 0) {
        categoryContent.push({
          sport: sportMatch,
          sportCode: SPORT_MAPPING[sportMatch],
          filename,
          sections,
          totalRelevance: sections.reduce((acc, s) => acc + s.relevance, 0)
        })
      }
    } catch (error) {
      console.error(`Error processing ${filename}:`, error)
    }
  }

  return categoryContent.sort((a, b) => b.totalRelevance - a.totalRelevance)
}

function extractCategorySpecificSections(pdfText: string, category: any) {
  const lines = pdfText.split('\n')
  const sections = []
  const keywords = category.keywords.map(k => k.toLowerCase())
  
  let currentSection = ''
  let sectionRelevance = 0
  let sectionHeader = ''
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    // Check if this is a section header
    const isHeader = /^[A-Z][A-Z\s\-&]+$/.test(line) || 
                    /^\d+\.\s+[A-Z]/.test(line) ||
                    /^Section \d+/i.test(line) ||
                    /^Chapter \d+/i.test(line)
    
    if (isHeader) {
      // Save previous section if relevant to category
      if (currentSection && sectionRelevance > 0) {
        sections.push({
          header: sectionHeader,
          content: currentSection,
          relevance: sectionRelevance,
          keywords_found: findMatchingKeywords(currentSection, keywords)
        })
      }
      
      // Start new section
      sectionHeader = line
      currentSection = line + '\n'
      sectionRelevance = calculateCategoryRelevance(line, keywords)
    } else {
      // Add to current section
      currentSection += line + '\n'
      sectionRelevance += calculateCategoryRelevance(line, keywords)
    }
  }
  
  // Add final section if relevant
  if (currentSection && sectionRelevance > 0) {
    sections.push({
      header: sectionHeader,
      content: currentSection,
      relevance: sectionRelevance,
      keywords_found: findMatchingKeywords(currentSection, keywords)
    })
  }
  
  // Return top relevant sections for this category
  return sections
    .filter(s => s.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 10) // Top 10 most relevant sections per sport
}

function calculateCategoryRelevance(text: string, keywords: string[]): number {
  const textLower = text.toLowerCase()
  let score = 0
  
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase()
    // Exact match gets higher score
    if (textLower.includes(keywordLower)) {
      score += keywordLower.length > 5 ? 3 : 2
    }
    // Partial word match
    const words = textLower.split(/\s+/)
    words.forEach(word => {
      if (word.includes(keywordLower) || keywordLower.includes(word)) {
        score += 1
      }
    })
  })
  
  return score
}

function findMatchingKeywords(text: string, keywords: string[]): string[] {
  const textLower = text.toLowerCase()
  return keywords.filter(keyword => 
    textLower.includes(keyword.toLowerCase())
  )
}

function calculateSportRelevance(sections: any[], keywords: string[]): number {
  return sections.reduce((acc, section) => acc + section.relevance, 0)
}

async function generateCategoryAnalysis(category: any, categoryContent: any[]) {
  const contentSummary = categoryContent.map(sport => ({
    sport: sport.sport,
    sections: sport.sections.length,
    top_sections: sport.sections.slice(0, 3).map(s => s.header),
    key_content: sport.sections.slice(0, 2).map(s => s.content.substring(0, 500))
  }))

  const systemPrompt = `You are an expert Big 12 Conference policy analyst specializing in cross-sport policy comparison and analysis. You have deep knowledge of athletic administration and can identify patterns, inconsistencies, and best practices across different sports.

You are analyzing the category: "${category.name}"
Description: ${category.description}
Keywords: ${category.keywords.join(', ')}

Your task is to provide a comprehensive analysis of how this category is addressed across the Big 12 sports, including:
1. Presence and coverage across sports
2. Key similarities and differences
3. Best practices identified
4. Gaps or inconsistencies
5. Recommendations for standardization or improvement

Provide detailed, actionable insights based on the manual content provided.`

  const userPrompt = `Analyze the "${category.name}" category across Big 12 sports based on this extracted content:

${JSON.stringify(contentSummary, null, 2)}

Please provide:

## Overall Analysis
- How consistently is "${category.name}" addressed across sports?
- What are the main approaches or variations found?

## Sport-by-Sport Findings
- Key policies and procedures for each sport
- Notable differences or unique approaches

## Cross-Sport Insights
- Common patterns or standards
- Significant variations or inconsistencies
- Best practices that could be adopted by other sports

## Recommendations
- Areas for policy standardization
- Gaps that need to be addressed
- Opportunities for improvement

Format your response with clear headers and bullet points for easy reading.`

  const result = await generateText({
    model: geminiPro,
    system: systemPrompt,
    prompt: userPrompt,
    maxTokens: 3000,
    temperature: 0.1
  })

  return result.text
}

function structureFindingsBySport(categoryContent: any[], analysis: string) {
  return categoryContent.map(sport => ({
    sport: sport.sport,
    sections_analyzed: sport.sections.length,
    relevance_score: sport.totalRelevance,
    top_sections: sport.sections.slice(0, 5).map(section => ({
      header: section.header,
      relevance: section.relevance,
      keywords_found: section.keywords_found
    })),
    key_findings: extractSportFindings(analysis, sport.sport)
  }))
}

function extractSportFindings(analysis: string, sport: string): string[] {
  // Simple extraction of lines mentioning the sport
  const lines = analysis.split('\n')
  return lines
    .filter(line => line.toLowerCase().includes(sport.toLowerCase()))
    .map(line => line.trim())
    .filter(line => line.length > 10)
    .slice(0, 3) // Top 3 findings per sport
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Category Analysis API for Big 12 Administrative Manuals',
    description: 'Analyze specific policy categories across sports',
    example_request: {
      category: {
        id: 'video_replay',
        name: 'Video Replay',
        description: 'Video replay systems and review procedures',
        keywords: ['video', 'replay', 'review', 'technology'],
        sports_applicable: ['Football', 'Basketball', 'Soccer'],
        query_template: 'Compare video replay systems and procedures'
      },
      sports: ['Football', 'Basketball', 'Soccer']
    }
  })
}