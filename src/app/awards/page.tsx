'use client';

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Trophy, 
  Plus, 
  Search, 
  Filter,
  Package,
  Calendar,
  Users,
  Truck,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  MoreHorizontal,
  Eye,
  Edit,
  Download
} from "lucide-react"
import { AddAwardDialog } from "@/components/add-award-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data - replace with real Supabase queries
const awardsSummary = {
  total: 245,
  distributed: 156,
  inProduction: 32,
  pending: 57,
  totalValue: 290985
}

const recentAwards = [
  {
    id: 1,
    name: "Champion Trophy",
    sport: "Baseball",
    type: "Champion Trophy",
    classification: "RS",
    recipient: "University of Kansas",
    status: "shipped",
    cost: 2628.75,
    invoice: "791346",
    dueDate: "2025-05-15"
  },
  {
    id: 2,
    name: "Tournament MOP Award",
    sport: "Men's Basketball",
    type: "MOP",
    classification: "CC",
    recipient: "Individual Player",
    status: "in_production",
    cost: 94.50,
    invoice: "791347",
    dueDate: "2025-03-12"
  },
  {
    id: 3,
    name: "All-Big 12 First Team",
    sport: "Football",
    type: "All-Big 12-A",
    classification: "RS",
    recipient: "Multiple Players",
    status: "pending",
    cost: 39.96,
    invoice: null,
    dueDate: "2025-02-01"
  }
]

const sportCategories = [
  { name: "Football", awards: 45, budget: 125000, spent: 78500 },
  { name: "Men's Basketball", awards: 35, budget: 85000, spent: 67200 },
  { name: "Women's Basketball", awards: 35, budget: 85000, spent: 62800 },
  { name: "Baseball", awards: 28, budget: 65000, spent: 42300 },
  { name: "Softball", awards: 25, budget: 55000, spent: 38900 }
]

const awardTypes = [
  { type: "Tournament Trophy", count: 16, avgCost: 1598.63 },
  { type: "Champion Trophy", count: 16, avgCost: 2760.19 },
  { type: "MOP", count: 32, avgCost: 99.23 },
  { type: "OTY-A", count: 48, avgCost: 245.70 },
  { type: "All-Big 12-A", count: 64, avgCost: 39.96 },
  { type: "All-Big 12-B", count: 48, avgCost: 32.94 },
  { type: "Medallion", count: 120, avgCost: 16.26 },
  { type: "Specialty", count: 89, avgCost: 150.00 }
]

export default function AwardsPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'shipped': return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'in_production': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'pending': return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shipped': return 'bg-green-100 text-green-800'
      case 'in_production': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-600" />
                Awards Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage awards inventory, recipients, and distribution across all Big 12 sports
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <AddAwardDialog />
            </div>
          </div>
          
          <Separator className="mb-6" />

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Awards</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{awardsSummary.total}</div>
                <p className="text-xs text-muted-foreground">All award types</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Distributed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{awardsSummary.distributed}</div>
                <p className="text-xs text-muted-foreground">Completed deliveries</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Production</CardTitle>
                <Package className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{awardsSummary.inProduction}</div>
                <p className="text-xs text-muted-foreground">Being manufactured</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{awardsSummary.pending}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${awardsSummary.totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Current season</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="inventory" className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="recipients">Recipients</TabsTrigger>
              <TabsTrigger value="sports">By Sport</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search awards..." className="pl-8 w-80" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sports</SelectItem>
                      <SelectItem value="football">Football</SelectItem>
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="baseball">Baseball</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_production">In Production</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>

              {/* Awards Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Awards Inventory</CardTitle>
                  <CardDescription>Complete list of all awards with current status and details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Award</TableHead>
                        <TableHead>Sport</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentAwards.map((award) => (
                        <TableRow key={award.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{award.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {award.classification} • {award.invoice && `Invoice #${award.invoice}`}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{award.sport}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{award.type}</Badge>
                          </TableCell>
                          <TableCell>{award.recipient}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(award.status)}
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(award.status)}`}>
                                {award.status.replace('_', ' ')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>${award.cost.toLocaleString()}</TableCell>
                          <TableCell>{award.dueDate}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Award
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Invoice
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Award Types & Pricing</CardTitle>
                  <CardDescription>Standardized award types with cost breakdown and inventory counts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {awardTypes.map((type) => (
                      <Card key={type.type} className="border-2">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{type.type}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Count:</span>
                              <span className="font-medium">{type.count}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Avg Cost:</span>
                              <span className="font-medium">${type.avgCost}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Total Value:</span>
                              <span className="font-medium">${(type.count * type.avgCost).toLocaleString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recipients" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recipients Management</CardTitle>
                  <CardDescription>Manage award recipients, schools, and distribution details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Recipients Management</h3>
                    <p className="text-muted-foreground mb-4">
                      Detailed recipient management features coming soon
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Recipient
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Awards by Sport</CardTitle>
                  <CardDescription>Budget allocation and award distribution across Big 12 sports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sportCategories.map((sport) => (
                      <div key={sport.name} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{sport.name}</h4>
                          <Badge variant="outline">{sport.awards} awards</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Budget</p>
                            <p className="font-medium">${sport.budget.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Spent</p>
                            <p className="font-medium">${sport.spent.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Remaining</p>
                            <p className="font-medium">${(sport.budget - sport.spent).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(sport.spent / sport.budget) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}