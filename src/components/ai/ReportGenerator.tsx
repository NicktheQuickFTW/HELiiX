'use client'

import { useState } from 'react'
import { Button, Card } from '@once-ui-system/core'
import { Select } from '@once-ui-system/core'
// Note: Select components need Once UI implementation
import { FileText, Download } from 'lucide-react'
import { toast } from 'sonner'

export function ReportGenerator() {
  const [reportType, setReportType] = useState('summary')
  const [format, setFormat] = useState('markdown')
  const [loading, setLoading] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<any>(null)

  const generateReport = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
          format,
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          }
        })
      })

      const data = await response.json()
      setGeneratedReport(data)
      
      toast.success('Report generated', {
        description: `${reportType} report ready for download`
      })
    } catch (error) {
      toast.error('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = () => {
    if (!generatedReport) return

    const blob = new Blob([generatedReport.report], { 
      type: format === 'html' ? 'text/html' : 'text/markdown' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `heliix-${reportType}-report-${new Date().toISOString().split('T')[0]}.${format === 'html' ? 'html' : 'md'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Generate Reports</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Select 
              id="report-type-select"
              label="Report Type"
              value={reportType}
              onChange={setReportType}
              options={[
                { label: "Summary Report", value: "summary" },
                { label: "Executive Summary", value: "executive" },
                { label: "Inventory Analysis", value: "inventory" },
                { label: "Financial Report", value: "financial" },
                { label: "Compliance Report", value: "compliance" }
              ]}
            />
          </div>

          <div>
            <Select 
              id="format-select"
              label="Format"
              value={format}
              onChange={setFormat}
              options={[
                { label: "Markdown", value: "markdown" },
                { label: "HTML", value: "html" },
                { label: "PDF (Preview)", value: "pdf" }
              ]}
            />
          </div>
        </div>

        <Button onClick={generateReport} disabled={loading} className="w-full">
          <FileText className="h-4 w-4 mr-2" />
          {loading ? 'Generating...' : 'Generate Report'}
        </Button>
      </Card>

      {generatedReport && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Report Preview</h3>
            <Button size="sm" variant="outline" onClick={downloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          
          <div className="prose prose-sm max-w-none max-h-96 overflow-y-auto">
            {format === 'html' ? (
              <div dangerouslySetInnerHTML={{ __html: generatedReport.report }} />
            ) : (
              <pre className="whitespace-pre-wrap text-sm">{generatedReport.report}</pre>
            )}
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Generated at: {new Date(generatedReport.metadata.generatedAt).toLocaleString()}
              {' • '}
              Data points: {generatedReport.metadata.dataPoints.awards} awards, {generatedReport.metadata.dataPoints.invoices} invoices
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}