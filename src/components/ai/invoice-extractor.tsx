'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileText, Upload } from 'lucide-react'
import { toast } from 'sonner'

interface InvoiceExtractorProps {
  onExtract: (data: any) => void
}

export function InvoiceExtractor({ onExtract }: InvoiceExtractorProps) {
  const [loading, setLoading] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      // Convert PDF to base64 or extract text
      const base64 = await fileToBase64(file)
      
      const response = await fetch('/api/ai/extract-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      })

      const data = await response.json()
      setExtractedData(data)
      onExtract(data)
      
      toast.success('Invoice data extracted', {
        description: `Found ${data.lineItems?.length || 0} line items`
      })
    } catch (error) {
      toast.error('Failed to extract invoice data')
    } finally {
      setLoading(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="invoice-upload" className="cursor-pointer">
          <Button variant="outline" disabled={loading} asChild>
            <span>
              <Upload className="h-4 w-4 mr-2" />
              {loading ? 'Extracting...' : 'Extract from PDF/Image'}
            </span>
          </Button>
          <input
            id="invoice-upload"
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {extractedData && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Extracted Data
          </h3>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="font-medium">Invoice #:</dt>
              <dd>{extractedData.invoiceNumber}</dd>
            </div>
            <div>
              <dt className="font-medium">Vendor:</dt>
              <dd>{extractedData.vendorName}</dd>
            </div>
            <div>
              <dt className="font-medium">Total:</dt>
              <dd>${extractedData.totalAmount?.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="font-medium">Date:</dt>
              <dd>{extractedData.date}</dd>
            </div>
          </dl>
        </Card>
      )}
    </div>
  )
}