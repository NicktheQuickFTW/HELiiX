'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  FileText,
  Search,
  Filter
} from 'lucide-react'
import { useState } from 'react'

const distributions = [
  {
    quarter: 'Q2 2024',
    date: '2024-06-15',
    totalAmount: 31700000,
    type: 'Revenue Distribution',
    status: 'completed',
    schools: 16,
    perSchool: 1981250,
    categories: {
      television: 24500000,
      championship: 3200000,
      sponsorship: 2800000,
      other: 1200000
    },
    notes: 'Record television revenue quarter'
  },
  {
    quarter: 'Q1 2024',
    date: '2024-03-15',
    totalAmount: 28900000,
    type: 'Revenue Distribution',
    status: 'completed',
    schools: 16,
    perSchool: 1806250,
    categories: {
      television: 22100000,
      championship: 2900000,
      sponsorship: 2600000,
      other: 1300000
    },
    notes: 'March Madness bonus included'
  },
  {
    quarter: 'Q4 2023',
    date: '2023-12-15',
    totalAmount: 26500000,
    type: 'Revenue Distribution',
    status: 'completed',
    schools: 16,
    perSchool: 1656250,
    categories: {
      television: 19800000,
      championship: 3100000,
      sponsorship: 2400000,
      other: 1200000
    },
    notes: 'Football playoff revenue included'
  },
  {
    quarter: 'Q3 2024',
    date: '2024-09-15',
    totalAmount: 32100000,
    type: 'Revenue Distribution',
    status: 'processing',
    schools: 16,
    perSchool: 2006250,
    categories: {
      television: 25200000,
      championship: 3400000,
      sponsorship: 2900000,
      other: 600000
    },
    notes: 'Pending final television reconciliation'
  },
  {
    quarter: 'Q4 2024',
    date: '2024-12-15',
    totalAmount: 33500000,
    type: 'Revenue Distribution',
    status: 'pending',
    schools: 16,
    perSchool: 2093750,
    categories: {
      television: 26800000,
      championship: 3200000,
      sponsorship: 3000000,
      other: 500000
    },
    notes: 'Projected based on current performance'
  }
]

const schoolDistributions = [
  {
    school: 'Arizona',
    q1: 1806250,
    q2: 1981250,
    q3: 2006250,
    q4: 2093750,
    total: 7887500,
    bonuses: 125000,
    adjustments: -15000
  },
  {
    school: 'Arizona State',
    q1: 1806250,
    q2: 1981250,
    q3: 2006250,
    q4: 2093750,
    total: 7887500,
    bonuses: 89000,
    adjustments: 0
  },
  {
    school: 'Baylor',
    q1: 1806250,
    q2: 1981250,
    q3: 2006250,
    q4: 2093750,
    total: 7887500,
    bonuses: 245000,
    adjustments: 25000
  },
  {
    school: 'BYU',
    q1: 1806250,
    q2: 1981250,
    q3: 2006250,
    q4: 2093750,
    total: 7887500,
    bonuses: 156000,
    adjustments: 0
  },
  {
    school: 'Cincinnati',
    q1: 1806250,
    q2: 1981250,
    q3: 2006250,
    q4: 2093750,
    total: 7887500,
    bonuses: 78000,
    adjustments: -8000
  },
  {
    school: 'Colorado',
    q1: 1806250,
    q2: 1981250,
    q3: 2006250,
    q4: 2093750,
    total: 7887500,
    bonuses: 134000,
    adjustments: 12000
  },
  {
    school: 'Houston',
    q1: 1806250,
    q2: 1981250,
    q3: 2006250,
    q4: 2093750,
    total: 7887500,
    bonuses: 98000,
    adjustments: 0
  },
  {
    school: 'Iowa State',
    q1: 1806250,
    q2: 1981250,
    q3: 2006250,
    q4: 2093750,
    total: 7887500,
    bonuses: 189000,
    adjustments: 18000
  },
  {
    school: 'Kansas',
    q1: 1806250,
    q2: 1981250,
    q3: 2006250,
    q4: 2093750,
    total: 7887500,
    bonuses: 287000,
    adjustments: 35000
  },
  {
    school: 'Kansas State',
    q1: 1806250,
    q2: 1981250,
    q3: 2006250,
    q4: 2093750,
    total: 7887500,
    bonuses: 156000,
    adjustments: 8000
  },
  {
    school: 'Oklahoma State',
    q1: 1806250,
    q2: 1981250,
    q3: 2006250,
    q4: 2093750,
    total: 7887500,
    bonuses: 203000,
    adjustments: 15000
  },
  {
    school: 'TCU',
    q1: 1806250,
    q2: 1981250,
    q3: 2006250,
    q4: 2093750,
    total: 7887500,
    bonuses: 298000,
    adjustments: 42000
  },
  {
    school: 'Texas Tech',
    q1: 1806250,
    q2: 1981250,
    q3: 2006250,
    q4: 2093750,
    total: 7887500,
    bonuses: 134000,
    adjustments: 5000
  },
  {
    school: 'UCF',
    q1: 1806250,
    q2: 1981250,
    q3: 2006250,
    q4: 2093750,
    total: 7887500,
    bonuses: 67000,
    adjustments: -12000
  },
  {
    school: 'Utah',
    q1: 1806250,
    q2: 1981250,
    q3: 2006250,
    q4: 2093750,
    total: 7887500,
    bonuses: 178000,
    adjustments: 20000
  },
  {
    school: 'West Virginia',
    q1: 1806250,
    q2: 1981250,
    q3: 2006250,
    q4: 2093750,
    total: 7887500,
    bonuses: 123000,
    adjustments: 3000
  }
]

const yearlyStats = {
  totalDistributed: 126200000,
  averagePerSchool: 7887500,
  growthFromPreviousYear: 12.3,
  totalBonuses: 2765000,
  pendingAdjustments: 148000
}

export default function DistributionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [quarterFilter, setQuarterFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedView, setSelectedView] = useState('distributions')

  const filteredDistributions = distributions.filter(dist => {
    const matchesSearch = dist.quarter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dist.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesQuarter = quarterFilter === 'all' || dist.quarter.includes(quarterFilter)
    const matchesStatus = statusFilter === 'all' || dist.status === statusFilter
    return matchesSearch && matchesQuarter && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Processing</Badge>
      case 'pending':
        return <Badge variant="secondary"><AlertTriangle className="h-3 w-3 mr-1" />Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Revenue Distributions
          </h1>
          <p className="text-muted-foreground mt-2">
            Quarterly revenue distributions to Big 12 member schools
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Distributed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(yearlyStats.totalDistributed)}</div>
            <p className="text-xs text-muted-foreground">This fiscal year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Per School</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(yearlyStats.averagePerSchool)}</div>
            <p className="text-xs text-muted-foreground">Base distribution</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">YoY Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{yearlyStats.growthFromPreviousYear}%</div>
            <p className="text-xs text-muted-foreground">vs. last year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Performance Bonuses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(yearlyStats.totalBonuses)}</div>
            <p className="text-xs text-muted-foreground">Total bonuses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Adjustments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(yearlyStats.pendingAdjustments)}</div>
            <p className="text-xs text-muted-foreground">Net adjustments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search distributions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={quarterFilter} onValueChange={setQuarterFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Quarters</SelectItem>
            <SelectItem value="Q1">Q1 2024</SelectItem>
            <SelectItem value="Q2">Q2 2024</SelectItem>
            <SelectItem value="Q3">Q3 2024</SelectItem>
            <SelectItem value="Q4">Q4 2024</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        
        <Badge variant="secondary">
          {filteredDistributions.length} of {distributions.length} distributions
        </Badge>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="distributions">Quarterly Distributions</TabsTrigger>
          <TabsTrigger value="schools">School Breakdown</TabsTrigger>
          <TabsTrigger value="analytics">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="distributions" className="space-y-4">
          <div className="grid gap-4">
            {filteredDistributions.map((dist, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{dist.quarter} Distribution</CardTitle>
                      <CardDescription>
                        {new Date(dist.date).toLocaleDateString()} • {dist.type}
                      </CardDescription>
                    </div>
                    {getStatusBadge(dist.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold">{formatCurrency(dist.totalAmount)}</div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold">{formatCurrency(dist.perSchool)}</div>
                      <p className="text-sm text-muted-foreground">Per School</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold">{dist.schools}</div>
                      <p className="text-sm text-muted-foreground">Schools</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold">
                        {dist.status === 'completed' ? '100%' : 
                         dist.status === 'processing' ? '75%' : '0%'}
                      </div>
                      <p className="text-sm text-muted-foreground">Complete</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Revenue Breakdown</h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Television Revenue</span>
                          <span className="font-medium">{formatCurrency(dist.categories.television)}</span>
                        </div>
                        <Progress value={(dist.categories.television / dist.totalAmount) * 100} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Championship Revenue</span>
                          <span className="font-medium">{formatCurrency(dist.categories.championship)}</span>
                        </div>
                        <Progress value={(dist.categories.championship / dist.totalAmount) * 100} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Sponsorship Revenue</span>
                          <span className="font-medium">{formatCurrency(dist.categories.sponsorship)}</span>
                        </div>
                        <Progress value={(dist.categories.sponsorship / dist.totalAmount) * 100} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Other Revenue</span>
                          <span className="font-medium">{formatCurrency(dist.categories.other)}</span>
                        </div>
                        <Progress value={(dist.categories.other / dist.totalAmount) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  {dist.notes && (
                    <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                      <p className="text-sm"><strong>Notes:</strong> {dist.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      View Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    {dist.status !== 'completed' && (
                      <Button variant="outline" size="sm">
                        <Clock className="h-4 w-4 mr-1" />
                        Track Status
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>School Distribution Summary</CardTitle>
              <CardDescription>Revenue breakdown by member institution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">School</th>
                      <th className="text-right p-2">Q1 2024</th>
                      <th className="text-right p-2">Q2 2024</th>
                      <th className="text-right p-2">Q3 2024</th>
                      <th className="text-right p-2">Q4 2024</th>
                      <th className="text-right p-2">Bonuses</th>
                      <th className="text-right p-2">Adjustments</th>
                      <th className="text-right p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolDistributions.map((school, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {school.school}
                          </div>
                        </td>
                        <td className="p-2 text-right">{formatCurrency(school.q1)}</td>
                        <td className="p-2 text-right">{formatCurrency(school.q2)}</td>
                        <td className="p-2 text-right text-blue-600">{formatCurrency(school.q3)}</td>
                        <td className="p-2 text-right text-muted-foreground">{formatCurrency(school.q4)}</td>
                        <td className="p-2 text-right text-green-600">+{formatCurrency(school.bonuses)}</td>
                        <td className="p-2 text-right">
                          <span className={school.adjustments >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {school.adjustments >= 0 ? '+' : ''}{formatCurrency(school.adjustments)}
                          </span>
                        </td>
                        <td className="p-2 text-right font-bold">{formatCurrency(school.total + school.bonuses + school.adjustments)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth Trend</CardTitle>
                <CardDescription>Quarterly revenue comparison year-over-year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Q1 Growth</span>
                    <div className="text-right">
                      <span className="font-medium text-green-600">+8.5%</span>
                      <p className="text-xs text-muted-foreground">vs. Q1 2023</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Q2 Growth</span>
                    <div className="text-right">
                      <span className="font-medium text-green-600">+12.3%</span>
                      <p className="text-xs text-muted-foreground">vs. Q2 2023</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Q3 Projected Growth</span>
                    <div className="text-right">
                      <span className="font-medium text-green-600">+15.2%</span>
                      <p className="text-xs text-muted-foreground">vs. Q3 2023</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Q4 Projected Growth</span>
                    <div className="text-right">
                      <span className="font-medium text-green-600">+11.8%</span>
                      <p className="text-xs text-muted-foreground">vs. Q4 2023</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Source Analysis</CardTitle>
                <CardDescription>Breakdown of revenue sources this fiscal year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Television (77%)</span>
                      <span className="font-medium">$97.6M</span>
                    </div>
                    <Progress value={77} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Championships (10%)</span>
                      <span className="font-medium">$12.6M</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Sponsorships (9%)</span>
                      <span className="font-medium">$11.7M</span>
                    </div>
                    <Progress value={9} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Other (4%)</span>
                      <span className="font-medium">$4.3M</span>
                    </div>
                    <Progress value={4} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribution Reconciliation</CardTitle>
              <CardDescription>Audit trail and reconciliation status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$126.2M</div>
                    <p className="text-sm text-muted-foreground">Total Distributed</p>
                    <p className="text-xs text-muted-foreground">Fully reconciled</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$32.1M</div>
                    <p className="text-sm text-muted-foreground">Q3 Processing</p>
                    <p className="text-xs text-muted-foreground">95% complete</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">$148K</div>
                    <p className="text-sm text-muted-foreground">Pending Adjustments</p>
                    <p className="text-xs text-muted-foreground">Under review</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Recent Reconciliation Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Q2 2024 Distribution Reconciled</p>
                        <p className="text-sm text-muted-foreground">
                          All $31.7M distributed and confirmed by member schools
                        </p>
                        <p className="text-xs text-muted-foreground">Completed: June 30, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Q3 2024 Final TV Revenue Reconciliation</p>
                        <p className="text-sm text-muted-foreground">
                          Pending final television revenue reports from media partners
                        </p>
                        <p className="text-xs text-muted-foreground">Expected: September 30, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Performance Bonus Adjustments</p>
                        <p className="text-sm text-muted-foreground">
                          Reviewing championship performance bonuses for final calculations
                        </p>
                        <p className="text-xs text-muted-foreground">Review ongoing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}