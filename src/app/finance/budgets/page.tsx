'use client';

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function BudgetsPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <DollarSign className="h-8 w-8" />
              Budget Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage conference budgets across all operations
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Operations Budget</CardTitle>
                <CardDescription>FY2024-25 Operational Expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">$1.2M</span>
                    <Badge variant="secondary">68% Used</Badge>
                  </div>
                  <Progress value={68} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>$820K spent</span>
                    <span>$380K remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Championships</CardTitle>
                <CardDescription>Tournament & Championship Events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">$450K</span>
                    <Badge variant="destructive">89% Used</Badge>
                  </div>
                  <Progress value={89} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>$400K spent</span>
                    <span>$50K remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technology</CardTitle>
                <CardDescription>HELiiX Platform & Infrastructure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">$200K</span>
                    <Badge variant="default">45% Used</Badge>
                  </div>
                  <Progress value={45} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>$90K spent</span>
                    <span>$110K remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}