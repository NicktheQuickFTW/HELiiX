import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardStats } from "@/components/dashboard-stats"
import { StatusChart } from "@/components/status-chart"
import { RecentActivity } from "@/components/recent-activity"
import { AwardsInventorySupabase } from "@/components/ui/awards-inventory-supabase"
import { InvoiceTrackingSupabase } from "@/components/ui/invoice-tracking-supabase"
import { QuickActionsSheet } from "@/components/quick-actions-sheet"
import { Separator } from "@/components/ui/separator"
import { AISuggestions } from "@/components/ai-suggestions"

export default function Page({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  const tab = searchParams.tab || "overview"
  
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">HELiiX Dashboard</h1>
            <QuickActionsSheet />
          </div>
          
          <Separator className="mb-6" />
          
          <Tabs defaultValue={tab} className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="awards">Awards</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <DashboardStats />
              
              <Separator />
              
              <div className="grid gap-6 md:grid-cols-7">
                <div className="md:col-span-3">
                  <StatusChart />
                </div>
                <div className="md:col-span-2">
                  <RecentActivity />
                </div>
                <div className="md:col-span-2">
                  <AISuggestions />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="awards" className="mt-6">
              <AwardsInventorySupabase />
            </TabsContent>
            
            <TabsContent value="invoices" className="mt-6">
              <InvoiceTrackingSupabase />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}