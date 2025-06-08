"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FileText, Eye, Edit2, Plus, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useSupabaseUpload } from "@/lib/hooks/use-supabase-upload"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { InvoiceExtractor } from "@/components/ai/invoice-extractor"

interface Invoice {
  id: number
  invoiceNumber: string
  vendorName: string
  amount: number
  status: 'planned' | 'ordered' | 'approved' | 'delivered' | 'received'
  date: string
  dueDate?: string | null
  imageUrl?: string | null
  notes?: string | null
  awardId?: number | null
  createdAt: string
  updatedAt: string
}

const statusColors = {
  planned: "bg-gray-500/10 text-gray-500",
  ordered: "bg-blue-500/10 text-blue-500",
  approved: "bg-purple-500/10 text-purple-500",
  delivered: "bg-orange-500/10 text-orange-500",
  received: "bg-green-500/10 text-green-500"
}

export function InvoiceTrackingSupabase() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [search, setSearch] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    vendorName: "",
    amount: 0,
    status: "planned" as Invoice['status'],
    date: new Date().toISOString().split('T')[0],
    dueDate: "",
    imageUrl: "",
    notes: ""
  })

  const { startUpload, isUploading } = useSupabaseUpload({
    onUploadComplete: (results) => {
      if (results[0]) {
        setFormData(prev => ({ ...prev, imageUrl: results[0].url }))
      }
    },
    onUploadError: (error) => {
      toast.error(`Upload failed: ${error.message}`)
    }
  })

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices')
      const data = await response.json()
      setInvoices(data)
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
      toast.error('Failed to fetch invoices')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file)
      } else {
        toast.error('Please select a PDF or image file')
      }
    }
  }

  const handleUpload = async () => {
    if (selectedFile) {
      await startUpload([selectedFile], 'heliix-invoices')
    }
  }

  const handleSubmit = async () => {
    try {
      const method = editingInvoice ? 'PUT' : 'POST'
      const url = editingInvoice ? `/api/invoices?id=${editingInvoice.id}` : '/api/invoices'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: Math.round(formData.amount * 100), // Convert to cents
          dueDate: formData.dueDate || null
        })
      })

      if (response.ok) {
        fetchInvoices()
        setIsAddDialogOpen(false)
        resetForm()
        toast.success(editingInvoice ? 'Invoice updated' : 'Invoice created', {
          description: editingInvoice 
            ? `Invoice #${formData.invoiceNumber} has been updated`
            : `Invoice #${formData.invoiceNumber} from ${formData.vendorName} has been created`,
          action: {
            label: "View",
            onClick: () => console.log("View invoice", formData),
          },
        })
      }
    } catch (error) {
      toast.error('Failed to save invoice', {
        description: 'Please check your connection and try again',
        action: {
          label: "Retry",
          onClick: () => handleSubmit(),
        },
      })
    }
  }

  const resetForm = () => {
    setFormData({
      invoiceNumber: "",
      vendorName: "",
      amount: 0,
      status: "planned",
      date: new Date().toISOString().split('T')[0],
      dueDate: "",
      imageUrl: "",
      notes: ""
    })
    setEditingInvoice(null)
    setSelectedFile(null)
  }

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setFormData({
      invoiceNumber: invoice.invoiceNumber,
      vendorName: invoice.vendorName,
      amount: invoice.amount / 100, // Convert from cents
      status: invoice.status,
      date: new Date(invoice.date).toISOString().split('T')[0],
      dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : "",
      imageUrl: invoice.imageUrl || "",
      notes: invoice.notes || ""
    })
    setIsAddDialogOpen(true)
  }

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    invoice.vendorName.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusCounts = () => {
    const counts: Record<Invoice['status'], number> = {
      planned: 0,
      ordered: 0,
      approved: 0,
      delivered: 0,
      received: 0
    }
    let total = 0
    invoices.forEach(invoice => {
      counts[invoice.status]++
      total += invoice.amount
    })
    return { counts, total }
  }

  const { counts: statusCounts, total: totalAmount } = getStatusCounts()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} className="p-4">
            <div className="text-sm text-gray-500 capitalize">{status}</div>
            <div className="text-2xl font-bold">{count}</div>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      <Card className="p-4 bg-blue-50 dark:bg-blue-950">
        <div className="text-sm text-gray-500">Total Invoice Amount</div>
        <div className="text-2xl font-bold">${(totalAmount / 100).toFixed(2)}</div>
      </Card>

      <Separator className="my-6" />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Invoice Tracking</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{editingInvoice ? 'Edit' : 'Add'} Invoice</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <InvoiceExtractor 
                onExtract={(data) => {
                  setFormData({
                    ...formData,
                    invoiceNumber: data.invoiceNumber || formData.invoiceNumber,
                    vendorName: data.vendorName || formData.vendorName,
                    amount: data.totalAmount || formData.amount,
                    date: data.date || formData.date,
                    dueDate: data.dueDate || formData.dueDate,
                    notes: data.notes || formData.notes
                  })
                  toast.success('Invoice data extracted')
                }}
              />
              <Separator />
              <div className="grid gap-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vendorName">Vendor Name</Label>
                <Input
                  id="vendorName"
                  value={formData.vendorName}
                  onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                />
              </div>
              <Separator />
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({...formData, status: value as Invoice['status']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="ordered">Ordered</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Invoice Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
              <Separator />
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Invoice Document</Label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={handleFileSelect}
                    className="flex-1"
                  />
                  <Button 
                    type="button"
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    size="sm"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {formData.imageUrl && (
                  <div className="text-sm text-green-600">Document uploaded successfully</div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingInvoice ? 'Update' : 'Create'} Invoice
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="my-4" />

      <Input
        placeholder="Search invoices..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
              <TableCell>{invoice.vendorName}</TableCell>
              <TableCell>${(invoice.amount / 100).toFixed(2)}</TableCell>
              <TableCell>
                <Badge className={statusColors[invoice.status]}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
              <TableCell>
                {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(invoice)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  {invoice.imageUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={invoice.imageUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}