import { NextRequest, NextResponse } from 'next/server'
import { streamText, generateText } from 'ai'
import { geminiPro, geminiFlash } from '@/lib/ai-providers'
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

interface QueryRequest {
  question: string
  sports?: string[]
  mode: 'question' | 'comparison' | 'summary' | 'policy-analysis'
  stream?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const { question, sports, mode, stream = false } = await request.json() as QueryRequest

    // Get relevant manual content based on the query
    const manualContent = await getRelevantManualContent(question, sports)
    
    if (!manualContent.length) {
      return NextResponse.json({ 
        error: 'No relevant manual content found for this query' 
      }, { status: 400 })
    }

    // Build context-aware prompt based on mode
    const systemPrompt = buildSystemPrompt(mode, manualContent)
    const userPrompt = buildUserPrompt(question, mode, sports)

    if (stream) {
      // Stream response for real-time interaction with Gemini Flash for speed
      const result = await streamText({
        model: geminiFlash,
        system: systemPrompt,
        prompt: userPrompt,
        maxTokens: 4000,
        temperature: 0.1
      })

      return result.toDataStreamResponse()
    } else {
      // Generate complete response with Gemini Pro for deep analysis
      const result = await generateText({
        model: geminiPro,
        system: systemPrompt,
        prompt: userPrompt,
        maxTokens: 4000,
        temperature: 0.1
      })

      return NextResponse.json({
        answer: result.text,
        sources: manualContent.map(m => ({
          sport: m.sport,
          filename: m.filename,
          relevantSections: m.sections.length
        })),
        mode,
        query: question
      })
    }

  } catch (error) {
    console.error('AI Query error:', error)
    return NextResponse.json({ 
      error: 'Failed to process query',
      details: error.message 
    }, { status: 500 })
  }
}

async function getRelevantManualContent(question: string, sports?: string[]) {
  const files = fs.readdirSync(MANUALS_PATH)
  const relevantContent = []

  for (const filename of files) {
    if (!filename.endsWith('.pdf')) continue
    
    // Parse filename to extract sport
    const sportMatch = Object.keys(SPORT_MAPPING).find(sport => 
      filename.toLowerCase().includes(sport.toLowerCase())
    )
    
    if (!sportMatch) continue
    
    // Filter by requested sports if specified
    if (sports && sports.length > 0 && !sports.includes(sportMatch)) continue
    
    const fullPath = path.join(MANUALS_PATH, filename)
    
    try {
      // Extract text from PDF
      const { stdout } = await execAsync(`pdftotext "${fullPath}" -`)
      
      // Extract relevant sections based on question keywords
      const sections = extractRelevantSections(stdout, question)
      
      if (sections.length > 0) {
        relevantContent.push({
          sport: sportMatch,
          sportCode: SPORT_MAPPING[sportMatch],
          filename,
          sections
        })
      }
    } catch (error) {
      console.error(`Error processing ${filename}:`, error)
    }
  }

  return relevantContent
}

function extractRelevantSections(pdfText: string, question: string) {
  const lines = pdfText.split('\n')
  const sections = []
  const questionKeywords = extractKeywords(question)
  
  let currentSection = ''
  let sectionRelevance = 0
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    // Check if this is a section header
    const isHeader = /^[A-Z][A-Z\s\-&]+$/.test(line) || 
                    /^\d+\.\s+[A-Z]/.test(line) ||
                    /^Section \d+/i.test(line)
    
    if (isHeader) {
      // Save previous section if relevant
      if (currentSection && sectionRelevance > 0) {
        sections.push({
          header: currentSection.split('\n')[0],
          content: currentSection,
          relevance: sectionRelevance
        })
      }
      
      // Start new section
      currentSection = line + '\n'
      sectionRelevance = calculateRelevance(line, questionKeywords)
    } else {
      // Add to current section
      currentSection += line + '\n'
      sectionRelevance += calculateRelevance(line, questionKeywords)
    }
  }
  
  // Add final section if relevant
  if (currentSection && sectionRelevance > 0) {
    sections.push({
      header: currentSection.split('\n')[0],
      content: currentSection,
      relevance: sectionRelevance
    })
  }
  
  // Return top relevant sections
  return sections
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5)
    .map(s => s.content)
}

function extractKeywords(question: string): string[] {
  const commonWords = ['what', 'how', 'when', 'where', 'why', 'who', 'is', 'are', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
  return question.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word))
}

function calculateRelevance(text: string, keywords: string[]): number {
  const textLower = text.toLowerCase()
  return keywords.reduce((score, keyword) => {
    return score + (textLower.includes(keyword) ? 1 : 0)
  }, 0)
}

function buildSystemPrompt(mode: string, manualContent: any[]) {
  const basePrompt = `You are an expert Big 12 Conference athletics administrator with deep analytical and research capabilities. You have comprehensive access to administrative manuals for all Big 12 sports and can perform detailed cross-referencing, pattern analysis, and policy comparison.

Available manual content from: ${manualContent.map(m => m.sport).join(', ')}

Your analytical capabilities include:
- Deep document analysis and cross-referencing
- Pattern recognition across multiple sports policies
- Comparative policy analysis with nuanced insights
- Identification of inconsistencies, gaps, or optimization opportunities
- Historical context and implications assessment

Provide thorough, research-backed responses with:
1. Specific citations from manual sections
2. Cross-sport analysis when applicable
3. Policy implications and operational impact
4. Recommendations based on best practices identified across sports
5. Clear organization with headers and bullet points

Always ground your analysis in the actual manual content provided.`

  switch (mode) {
    case 'comparison':
      return basePrompt + `

Focus on comparing policies, procedures, or requirements across different sports. Highlight similarities, differences, and unique aspects. Structure your response with clear comparisons.`

    case 'summary':
      return basePrompt + `

Provide clear, concise summaries of policies or procedures. Extract the key points and present them in an organized, easy-to-understand format.`

    case 'policy-analysis':
      return basePrompt + `

Analyze policies for compliance requirements, implementation challenges, or strategic implications. Consider operational impact and provide insights on policy effectiveness.`

    default:
      return basePrompt + `

Answer questions directly and comprehensively. If the question involves multiple sports or complex policies, break down your response clearly.`
  }
}

function buildUserPrompt(question: string, mode: string, sports?: string[]) {
  let prompt = `Based on the Big 12 administrative manual content provided, please answer this question:\n\n${question}`
  
  if (sports && sports.length > 0) {
    prompt += `\n\nFocus specifically on these sports: ${sports.join(', ')}`
  }
  
  switch (mode) {
    case 'comparison':
      prompt += `\n\nPlease provide a detailed comparison, highlighting key differences and similarities.`
      break
    case 'summary':
      prompt += `\n\nPlease provide a clear, organized summary of the relevant information.`
      break
    case 'policy-analysis':
      prompt += `\n\nPlease analyze the policy implications, compliance requirements, and operational considerations.`
      break
  }
  
  prompt += `\n\nAlways cite specific sections or manual sources when possible.`
  
  return prompt
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'AI Query API for Big 12 Administrative Manuals',
    endpoints: {
      'POST /': 'Submit a query with question, sports filter, and mode',
    },
    modes: ['question', 'comparison', 'summary', 'policy-analysis'],
    sports: Object.keys(SPORT_MAPPING),
    example: {
      question: 'What are the weather postponement policies for outdoor sports?',
      sports: ['Soccer', 'Baseball', 'Softball'],
      mode: 'comparison',
      stream: false
    }
  })
}