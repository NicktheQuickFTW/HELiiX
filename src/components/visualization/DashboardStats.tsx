"use client"

import { Card } from "@once-ui-system/core"
import { Package, FileText, TrendingUp, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"

interface StatsData {
  totalAwards: number
  totalInvoices: number
  totalAmount: number
  pendingItems: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData>({
    totalAwards: 0,
    totalInvoices: 0,
    totalAmount: 0,
    pendingItems: 0
  })

  useEffect(() => {
    // Fetch stats from API
    Promise.all([
      fetch('/api/awards').then(res => res.json()),
      fetch('/api/invoices').then(res => res.json())
    ]).then(([awards, invoices]) => {
      const totalAmount = invoices.reduce((sum: number, inv: any) => sum + inv.amount, 0)
      const pendingItems = [...awards, ...invoices].filter(
        (item: any) => item.status === 'planned' || item.status === 'ordered'
      ).length

      setStats({
        totalAwards: awards.length,
        totalInvoices: invoices.length,
        totalAmount: totalAmount / 100, // Convert from cents
        pendingItems
      })
    }).catch(console.error)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Awards</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAwards}</div>
          <p className="text-xs text-muted-foreground">
            Awards in inventory
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalInvoices}</div>
          <p className="text-xs text-muted-foreground">
            Invoices tracked
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats.totalAmount.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Total invoice value
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Items</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingItems}</div>
          <p className="text-xs text-muted-foreground">
            Awaiting action
          </p>
        </CardContent>
      </Card>
    </div>
  )
}