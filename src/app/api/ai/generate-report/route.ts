import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: Request) {
  try {
    const { 
      reportType = 'summary',
      dateRange,
      format = 'markdown'
    } = await req.json()

    // Fetch relevant data
    const [awardsResult, invoicesResult] = await Promise.all([
      supabase
        .from('awards')
        .select('*')
        .gte('created_at', dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .lte('created_at', dateRange?.end || new Date().toISOString()),
      supabase
        .from('invoices')
        .select('*')
        .gte('created_at', dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .lte('created_at', dateRange?.end || new Date().toISOString())
    ])

    const awards = awardsResult.data || []
    const invoices = invoicesResult.data || []

    // Generate report based on type
    const prompt = buildReportPrompt(reportType, awards, invoices, dateRange)

    const result = await generateText({
      model: openai('gpt-4-turbo'),
      prompt,
      system: `You are a professional report generator for HELiiX awards and invoice management system. 
        Generate clear, concise, and insightful reports in ${format} format.
        Include relevant statistics, trends, and actionable recommendations.`
    })

    // Format the report based on requested format
    const formattedReport = formatReport(result.text, format)

    return Response.json({
      report: formattedReport,
      metadata: {
        generatedAt: new Date().toISOString(),
        type: reportType,
        format,
        dataPoints: {
          awards: awards.length,
          invoices: invoices.length
        }
      }
    })
  } catch (error) {
    return Response.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

function buildReportPrompt(type: string, awards: any[], invoices: any[], dateRange: any) {
  const baseData = `
    Awards Data (${awards.length} records):
    ${JSON.stringify(awards.slice(0, 10), null, 2)}
    
    Invoices Data (${invoices.length} records):
    ${JSON.stringify(invoices.slice(0, 10), null, 2)}
  `

  switch (type) {
    case 'executive':
      return `Generate an executive summary report with:
        - High-level overview of awards and invoices
        - Key metrics and KPIs
        - Budget utilization
        - Notable trends
        - Strategic recommendations
        
        Data: ${baseData}`

    case 'inventory':
      return `Generate an inventory analysis report with:
        - Current stock levels by award type
        - Usage patterns and trends
        - Reorder recommendations
        - Cost analysis
        - Optimization opportunities
        
        Data: ${baseData}`

    case 'financial':
      return `Generate a financial report with:
        - Total spending breakdown
        - Vendor analysis
        - Budget vs actual
        - Cost trends
        - Savings opportunities
        
        Data: ${baseData}`

    case 'compliance':
      return `Generate a compliance report with:
        - Invoice processing status
        - Approval workflows
        - Outstanding items
        - Policy adherence
        - Risk areas
        
        Data: ${baseData}`

    default:
      return `Generate a comprehensive summary report with:
        - Overview of all awards and invoices
        - Key statistics
        - Recent activity
        - Recommendations
        
        Data: ${baseData}`
  }
}

function formatReport(content: string, format: string): string {
  switch (format) {
    case 'html':
      return `
        <div class="report">
          <style>
            .report { font-family: Arial, sans-serif; line-height: 1.6; }
            .report h1 { color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
            .report h2 { color: #555; margin-top: 20px; }
            .report ul { margin: 10px 0; }
            .report .metric { font-weight: bold; color: #0066cc; }
          </style>
          ${content.replace(/\n/g, '<br>').replace(/#{1,6} (.+)/g, '<h$1>$2</h$1>')}
        </div>
      `

    case 'pdf':
      // Return markdown for now, actual PDF generation would require additional libraries
      return `# PDF Report\n\n${content}\n\n---\n*Note: PDF generation requires additional setup*`

    default:
      return content
  }
}