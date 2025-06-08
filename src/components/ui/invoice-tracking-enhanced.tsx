"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Upload, Eye, Edit2, Plus, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UploadButton } from "@/lib/uploadthing"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

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

export function InvoiceTrackingEnhanced() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [search, setSearch] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
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

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices')
      const data = await response.json()
      setInvoices(data)
    } catch (error) {
      console.error('Error fetching invoices:', error)
    }
  }

  const handleSubmit = async () => {
    try {
      const url = '/api/invoices'
      const method = editingInvoice ? 'PUT' : 'POST'
      const body = editingInvoice 
        ? { id: editingInvoice.id, ...formData, amount: formData.amount * 100 }
        : { ...formData, amount: formData.amount * 100 }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        fetchInvoices()
        setIsAddDialogOpen(false)
        setEditingInvoice(null)
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
      }
    } catch (error) {
      console.error('Error saving invoice:', error)
    }
  }

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    invoice.vendorName.toLowerCase().includes(search.toLowerCase())
  )

  const getTotalsByStatus = () => {
    const totals = {
      planned: 0,
      ordered: 0,
      approved: 0,
      delivered: 0,
      received: 0
    }
    invoices.forEach(invoice => {
      totals[invoice.status] += invoice.amount
    })
    return totals
  }

  const totalsByStatus = getTotalsByStatus()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4 mb-6">
        {Object.entries(totalsByStatus).map(([status, total]) => (
          <Card key={status} className="p-4">
            <div className="text-sm text-gray-500 capitalize">{status}</div>
            <div className="text-2xl font-bold">${(total / 100).toFixed(2)}</div>
          </Card>
        ))}
      </div>

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
            <div className="grid gap-4 py-4">
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
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Invoice Document</Label>
                <UploadButton<OurFileRouter>
                  endpoint="documentUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      setFormData({...formData, imageUrl: res[0].url})
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`)
                  }}
                />
                {formData.imageUrl && (
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Document uploaded</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingInvoice ? 'Update' : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search invoices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
              <TableCell>{invoice.vendorName}</TableCell>
              <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
              <TableCell>
                {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColors[invoice.status]}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>${(invoice.amount / 100).toFixed(2)}</TableCell>
              <TableCell>
                {invoice.imageUrl ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(invoice.imageUrl!, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                ) : (
                  <span className="text-sm text-gray-500">-</span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingInvoice(invoice)
                    setFormData({
                      invoiceNumber: invoice.invoiceNumber,
                      vendorName: invoice.vendorName,
                      amount: invoice.amount / 100,
                      status: invoice.status,
                      date: invoice.date.split('T')[0],
                      dueDate: invoice.dueDate?.split('T')[0] || "",
                      imageUrl: invoice.imageUrl || "",
                      notes: invoice.notes || ""
                    })
                    setIsAddDialogOpen(true)
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}