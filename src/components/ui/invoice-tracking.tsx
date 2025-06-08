"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface Invoice {
  id: string
  number: string
  date: string
  status: string
  amount: number
  image: string | null
}

export function InvoiceTracking() {
  const [invoices] = useState<Invoice[]>([])
  const [search, setSearch] = useState("")

  const filteredInvoices = invoices.filter(invoice =>
    invoice.number.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Invoice Tracking</h2>
        <Button>Add Invoice</Button>
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
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.number}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`bg-${invoice.status.toLowerCase()}-500/10 text-${invoice.status.toLowerCase()}-500`}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>${invoice.amount.toFixed(2)}</TableCell>
              <TableCell>
                {invoice.image ? (
                  <img 
                    src={invoice.image} 
                    alt={`Invoice ${invoice.number}`} 
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
