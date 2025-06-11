"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle, Calendar, Download, FileText } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface FinancialData {
  totalBudget: number
  spent: number
  pending: number
  allocated: number
  variance: number
  categoryBreakdown: Array<{
    category: string
    allocated: number
    spent: number
    pending: number
    variance: number
  }>
  monthlySpending: Array<{
    month: string
    budget: number
    actual: number
    forecast: number
  }>
  vendorSpending: Array<{
    vendor: string
    amount: number
    orders: number
    lastOrder: string
    status: 'active' | 'pending' | 'overdue'
  }>
  classCodeBreakdown: Array<{
    classCode: string
    sport: string
    type: 'regular_season' | 'championship'
    allocated: number
    spent: number
    remaining: number
    utilization: number
  }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function AwardsFinanceDashboard() {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("2025-26")
  const [selectedSport, setSelectedSport] = useState("all")
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false)
  const [budgetForm, setBudgetForm] = useState({
    classCode: "",
    sport: "",
    type: "regular_season" as const,
    amount: 0,
    description: ""
  })

  useEffect(() => {
    fetchFinancialData()
  }, [selectedFiscalYear, selectedSport])

  const fetchFinancialData = async () => {
    // Mock data - replace with actual API call
    const mockData: FinancialData = {
      totalBudget: 166581.25,
      spent: 89432.15,
      pending: 23149.60,
      allocated: 151437.50,
      variance: -15143.75,
      categoryBreakdown: [
        { category: "Champion Trophies", allocated: 44000, spent: 38500, pending: 2800, variance: -3300 },
        { category: "OTY Awards", allocated: 25000, spent: 22100, pending: 1900, variance: -1000 },
        { category: "All-Big 12 Trophies", allocated: 45000, spent: 39200, pending: 4100, variance: -1700 },
        { category: "Medallions", allocated: 20000, spent: 18632, pending: 1200, variance: -168 },
        { category: "MOP Awards", allocated: 17437.50, spent: 15000, pending: 1500, variance: -937.50 }
      ],
      monthlySpending: [
        { month: "Jul", budget: 12000, actual: 11200, forecast: 11500 },
        { month: "Aug", budget: 15000, actual: 14800, forecast: 14900 },
        { month: "Sep", budget: 18000, actual: 17500, forecast: 17800 },
        { month: "Oct", budget: 22000, actual: 21300, forecast: 21600 },
        { month: "Nov", budget: 25000, actual: 24100, forecast: 24500 },
        { month: "Dec", budget: 20000, actual: 19800, forecast: 19900 },
        { month: "Jan", budget: 18000, actual: 0, forecast: 17500 },
        { month: "Feb", budget: 15000, actual: 0, forecast: 14800 },
        { month: "Mar", budget: 12000, actual: 0, forecast: 11900 },
        { month: "Apr", budget: 8000, actual: 0, forecast: 7800 },
        { month: "May", budget: 6000, actual: 0, forecast: 5900 },
        { month: "Jun", budget: 4000, actual: 0, forecast: 3900 }
      ],
      vendorSpending: [
        { vendor: "Trophy Craft Inc", amount: 45600, orders: 12, lastOrder: "2024-12-15", status: "active" },
        { vendor: "Elite Awards Co", amount: 32400, orders: 8, lastOrder: "2024-12-10", status: "pending" },
        { vendor: "Championship Designs", amount: 28900, orders: 6, lastOrder: "2024-12-08", status: "active" },
        { vendor: "Crystal Creations", amount: 18200, orders: 4, lastOrder: "2024-11-30", status: "overdue" },
        { vendor: "Sports Recognition", amount: 12800, orders: 3, lastOrder: "2024-12-12", status: "active" }
      ],
      classCodeBreakdown: [
        { classCode: "S-050-00-FB-0", sport: "Football", type: "regular_season", allocated: 25000, spent: 21500, remaining: 3500, utilization: 86 },
        { classCode: "S-060-00-FB-0", sport: "Football", type: "championship", allocated: 18000, spent: 16200, remaining: 1800, utilization: 90 },
        { classCode: "S-050-00-BB-M", sport: "Basketball (M)", type: "regular_season", allocated: 15000, spent: 12800, remaining: 2200, utilization: 85.3 },
        { classCode: "S-060-00-BB-M", sport: "Basketball (M)", type: "championship", allocated: 12000, spent: 11100, remaining: 900, utilization: 92.5 },
        { classCode: "S-050-00-BB-W", sport: "Basketball (W)", type: "regular_season", allocated: 15000, spent: 13200, remaining: 1800, utilization: 88 },
        { classCode: "S-060-00-BB-W", sport: "Basketball (W)", type: "championship", allocated: 12000, spent: 10800, remaining: 1200, utilization: 90 }
      ]
    }
    setFinancialData(mockData)
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-600"
    if (utilization >= 80) return "text-yellow-600"
    return "text-green-600"
  }

  const getVarianceDisplay = (variance: number) => {
    const isPositive = variance >= 0
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        ${Math.abs(variance).toLocaleString()}
        <span className="text-xs">({isPositive ? 'under' : 'over'} budget)</span>
      </div>
    )
  }

  const handleAddBudget = async () => {
    try {
      // Mock API call - replace with actual implementation
      toast.success("Budget allocation added successfully", {
        description: `${budgetForm.classCode} - $${budgetForm.amount.toLocaleString()}`,
      })
      setIsAddBudgetOpen(false)
      setBudgetForm({ classCode: "", sport: "", type: "regular_season", amount: 0, description: "" })
      fetchFinancialData()
    } catch (error) {
      toast.error("Failed to add budget allocation")
    }
  }

  const exportFinancialReport = () => {
    toast.success("Financial report exported", {
      description: "Awards financial report has been downloaded as PDF",
    })
  }

  if (!financialData) {
    return <div>Loading financial data...</div>
  }

  const utilizationPercentage = (financialData.spent / financialData.totalBudget) * 100

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Awards Finance Dashboard</h2>
          <p className="text-muted-foreground">Big 12 Conference Awards Program Financial Management</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedFiscalYear} onValueChange={setSelectedFiscalYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-26">FY 25-26</SelectItem>
              <SelectItem value="2024-25">FY 24-25</SelectItem>
              <SelectItem value="2023-24">FY 23-24</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
              <SelectItem value="baseball">Baseball</SelectItem>
              <SelectItem value="softball">Softball</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportFinancialReport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Separator />

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Account 4105 - Awards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Spent</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.spent.toLocaleString()}</div>
            <Progress value={utilizationPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {utilizationPercentage.toFixed(1)}% utilized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.pending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting delivery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Variance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getVarianceDisplay(financialData.variance)}
            </div>
            <p className="text-xs text-muted-foreground">
              vs. allocated budget
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="class-codes">Class Codes</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Spending Trend</CardTitle>
                <CardDescription>Budget vs Actual vs Forecast</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={financialData.monthlySpending}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                    <Line type="monotone" dataKey="budget" stroke="#8884d8" strokeDasharray="5 5" name="Budget" />
                    <Line type="monotone" dataKey="actual" stroke="#82ca9d" strokeWidth={2} name="Actual" />
                    <Line type="monotone" dataKey="forecast" stroke="#ffc658" strokeDasharray="2 2" name="Forecast" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Distribution</CardTitle>
                <CardDescription>Allocation by Award Category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={financialData.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, value }) => `${category}: $${value.toLocaleString()}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="allocated"
                    >
                      {financialData.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Budget allocation and spending by award category</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Variance</TableHead>
                    <TableHead>Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialData.categoryBreakdown.map((category) => {
                    const utilization = (category.spent / category.allocated) * 100
                    return (
                      <TableRow key={category.category}>
                        <TableCell className="font-medium">{category.category}</TableCell>
                        <TableCell>${category.allocated.toLocaleString()}</TableCell>
                        <TableCell>${category.spent.toLocaleString()}</TableCell>
                        <TableCell>${category.pending.toLocaleString()}</TableCell>
                        <TableCell>{getVarianceDisplay(category.variance)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={utilization} className="w-16" />
                            <span className={`text-sm ${getUtilizationColor(utilization)}`}>
                              {utilization.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="class-codes" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Class Code Analysis</h3>
              <p className="text-sm text-muted-foreground">Budget breakdown by Big 12 class codes</p>
            </div>
            <Dialog open={isAddBudgetOpen} onOpenChange={setIsAddBudgetOpen}>
              <DialogTrigger asChild>
                <Button>Add Budget Allocation</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Budget Allocation</DialogTitle>
                  <DialogDescription>Create a new budget allocation for a class code</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="classCode">Class Code</Label>
                    <Input
                      id="classCode"
                      placeholder="S-050-00-FB-0"
                      value={budgetForm.classCode}
                      onChange={(e) => setBudgetForm({...budgetForm, classCode: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sport">Sport</Label>
                    <Input
                      id="sport"
                      placeholder="Football"
                      value={budgetForm.sport}
                      onChange={(e) => setBudgetForm({...budgetForm, sport: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={budgetForm.type}
                      onValueChange={(value) => setBudgetForm({...budgetForm, type: value as "regular_season" | "championship"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular_season">Regular Season</SelectItem>
                        <SelectItem value="championship">Championship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="25000"
                      value={budgetForm.amount}
                      onChange={(e) => setBudgetForm({...budgetForm, amount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Award allocation for..."
                      value={budgetForm.description}
                      onChange={(e) => setBudgetForm({...budgetForm, description: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddBudgetOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddBudget}>Add Allocation</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Code</TableHead>
                    <TableHead>Sport</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialData.classCodeBreakdown.map((item) => (
                    <TableRow key={item.classCode}>
                      <TableCell className="font-mono text-sm">{item.classCode}</TableCell>
                      <TableCell>{item.sport}</TableCell>
                      <TableCell>
                        <Badge variant={item.type === 'championship' ? 'default' : 'secondary'}>
                          {item.type === 'championship' ? 'Championship' : 'Regular Season'}
                        </Badge>
                      </TableCell>
                      <TableCell>${item.allocated.toLocaleString()}</TableCell>
                      <TableCell>${item.spent.toLocaleString()}</TableCell>
                      <TableCell>${item.remaining.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={item.utilization} className="w-16" />
                          <span className={`text-sm ${getUtilizationColor(item.utilization)}`}>
                            {item.utilization}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance</CardTitle>
              <CardDescription>Spending and order tracking by vendor</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Total Spending</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialData.vendorSpending.map((vendor) => (
                    <TableRow key={vendor.vendor}>
                      <TableCell className="font-medium">{vendor.vendor}</TableCell>
                      <TableCell>${vendor.amount.toLocaleString()}</TableCell>
                      <TableCell>{vendor.orders}</TableCell>
                      <TableCell>{vendor.lastOrder}</TableCell>
                      <TableCell>
                        <Badge variant={
                          vendor.status === 'active' ? 'default' : 
                          vendor.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Forecast</CardTitle>
              <CardDescription>Projected spending and budget utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={financialData.monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                  <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                  <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
                  <Bar dataKey="forecast" fill="#ffc658" name="Forecast" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}