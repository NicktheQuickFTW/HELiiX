"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react"

const chartConfig = {
  planned: {
    label: "Planned",
    color: "hsl(var(--chart-1))",
  },
  ordered: {
    label: "Ordered",
    color: "hsl(var(--chart-2))",
  },
  approved: {
    label: "Approved",
    color: "hsl(var(--chart-3))",
  },
  delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-4))",
  },
  received: {
    label: "Received",
    color: "hsl(var(--chart-5))",
  },
}

export function StatusChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Fetch and process data
    Promise.all([
      fetch('/api/awards').then(res => res.json()),
      fetch('/api/invoices').then(res => res.json())
    ]).then(([awards, invoices]) => {
      const statusCounts: Record<string, { awards: number; invoices: number }> = {
        planned: { awards: 0, invoices: 0 },
        ordered: { awards: 0, invoices: 0 },
        approved: { awards: 0, invoices: 0 },
        delivered: { awards: 0, invoices: 0 },
        received: { awards: 0, invoices: 0 }
      }

      awards.forEach((award: any) => {
        if (statusCounts[award.status]) {
          statusCounts[award.status].awards++
        }
      })

      invoices.forEach((invoice: any) => {
        if (statusCounts[invoice.status]) {
          statusCounts[invoice.status].invoices++
        }
      })

      const chartData = Object.entries(statusCounts).map(([status, counts]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        awards: counts.awards,
        invoices: counts.invoices,
        total: counts.awards + counts.invoices
      }))

      setData(chartData)
    }).catch(console.error)
  }, [])

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Status Overview</CardTitle>
        <CardDescription>
          Current status distribution for awards and invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="status" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="awards" fill="var(--color-planned)" name="Awards" stackId="a" />
              <Bar dataKey="invoices" fill="var(--color-ordered)" name="Invoices" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}