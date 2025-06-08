'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Shield, 
  BookOpen,
  Search,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  FolderOpen,
  Edit,
  Eye
} from 'lucide-react';

// Playing rules and policy documents
const playingRulesDocuments = [
  {
    id: 1,
    title: 'Big 12 Conference Handbook',
    category: 'Governance',
    version: '2024-25',
    lastUpdated: '2024-08-01',
    status: 'current',
    type: 'Core Document',
    pages: 245,
    compliance: 100
  },
  {
    id: 2,
    title: 'Football Playing Rules',
    category: 'Playing Rules',
    sport: 'Football',
    version: '2024',
    lastUpdated: '2024-06-15',
    status: 'current',
    type: 'Sport-Specific',
    pages: 112,
    compliance: 100
  },
  {
    id: 3,
    title: 'Basketball Playing Rules',
    category: 'Playing Rules',
    sport: 'Basketball',
    version: '2024-25',
    lastUpdated: '2024-10-01',
    status: 'current',
    type: 'Sport-Specific',
    pages: 98,
    compliance: 100
  },
  {
    id: 4,
    title: 'Transfer Portal Policy',
    category: 'Policy',
    version: '2024.2',
    lastUpdated: '2024-11-15',
    status: 'current',
    type: 'Policy Document',
    pages: 45,
    compliance: 100
  },
  {
    id: 5,
    title: 'NIL Guidelines',
    category: 'Policy',
    version: '2024.3',
    lastUpdated: '2024-12-01',
    status: 'current',
    type: 'Policy Document',
    pages: 62,
    compliance: 98
  },
  {
    id: 6,
    title: 'Championship Selection Criteria',
    category: 'Policy',
    version: '2024-25',
    lastUpdated: '2024-07-01',
    status: 'current',
    type: 'Policy Document',
    pages: 28,
    compliance: 100
  }
];

// Sample compliance tasks
const complianceTasks = [
  {
    id: 1,
    task: 'Annual Eligibility Certification',
    deadline: '2025-07-01',
    status: 'in-progress',
    progress: 65,
    responsible: 'All Schools',
    priority: 'high'
  },
  {
    id: 2,
    task: 'APR Reporting',
    deadline: '2025-05-15',
    status: 'pending',
    progress: 0,
    responsible: 'Academic Services',
    priority: 'high'
  },
  {
    id: 3,
    task: 'Financial Aid Audit',
    deadline: '2025-03-31',
    status: 'in-progress',
    progress: 40,
    responsible: 'Financial Aid Office',
    priority: 'medium'
  }
];

// All 25 Big 12 sport manuals
const sportManuals = [
  { sport: 'Football', lastUpdated: '2024-07-20', pages: 67, status: 'review' },
  { sport: 'Men\'s Basketball', lastUpdated: '2024-11-01', pages: 89, status: 'current' },
  { sport: 'Women\'s Basketball', lastUpdated: '2024-11-01', pages: 87, status: 'current' },
  { sport: 'Baseball', lastUpdated: '2024-02-15', pages: 72, status: 'outdated' },
  { sport: 'Softball', lastUpdated: '2024-02-15', pages: 68, status: 'outdated' },
  { sport: 'Men\'s Soccer', lastUpdated: '2024-08-10', pages: 54, status: 'current' },
  { sport: 'Women\'s Soccer', lastUpdated: '2024-08-10', pages: 56, status: 'current' },
  { sport: 'Volleyball', lastUpdated: '2024-08-10', pages: 58, status: 'current' },
  { sport: 'Men\'s Cross Country', lastUpdated: '2024-09-01', pages: 42, status: 'current' },
  { sport: 'Women\'s Cross Country', lastUpdated: '2024-09-01', pages: 42, status: 'current' },
  { sport: 'Men\'s Track & Field', lastUpdated: '2023-12-01', pages: 94, status: 'outdated' },
  { sport: 'Women\'s Track & Field', lastUpdated: '2023-12-01', pages: 94, status: 'outdated' },
  { sport: 'Men\'s Golf', lastUpdated: '2024-08-15', pages: 48, status: 'current' },
  { sport: 'Women\'s Golf', lastUpdated: '2024-08-15', pages: 48, status: 'current' },
  { sport: 'Men\'s Tennis', lastUpdated: '2024-03-20', pages: 52, status: 'current' },
  { sport: 'Women\'s Tennis', lastUpdated: '2024-03-20', pages: 52, status: 'current' },
  { sport: 'Wrestling', lastUpdated: '2023-11-15', pages: 76, status: 'outdated' },
  { sport: 'Gymnastics', lastUpdated: '2024-10-01', pages: 84, status: 'current' },
  { sport: 'Men\'s Swimming & Diving', lastUpdated: '2024-09-15', pages: 62, status: 'current' },
  { sport: 'Women\'s Swimming & Diving', lastUpdated: '2024-09-15', pages: 62, status: 'current' },
  { sport: 'Beach Volleyball', lastUpdated: '2024-04-01', pages: 45, status: 'current' },
  { sport: 'Lacrosse', lastUpdated: '2024-03-01', pages: 58, status: 'current' },
  { sport: 'Rowing', lastUpdated: '2024-09-01', pages: 54, status: 'current' },
  { sport: 'Equestrian', lastUpdated: '2024-10-15', pages: 72, status: 'current' },
  { sport: 'Bowling', lastUpdated: '2024-08-01', pages: 38, status: 'current' }
];

export function GovernanceCompliance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [actualManuals, setActualManuals] = useState<any[]>([]);
  const [loadingManuals, setLoadingManuals] = useState(true);
  const [manualStats, setManualStats] = useState<any>(null);

  // Load actual manuals from OneDrive directory
  useEffect(() => {
    fetchManuals();
  }, []);

  const fetchManuals = async () => {
    try {
      setLoadingManuals(true);
      
      // Get manual scan results
      const response = await fetch('/api/manuals?action=scan');
      const data = await response.json();
      
      if (data.success) {
        setActualManuals(data.manuals);
        
        // Get summary stats
        const summaryResponse = await fetch('/api/manuals');
        const summaryData = await summaryResponse.json();
        if (summaryData.success) {
          setManualStats(summaryData.summary);
        }
      }
    } catch (error) {
      console.error('Error fetching manuals:', error);
    } finally {
      setLoadingManuals(false);
    }
  };

  const downloadManual = async (sportCode: string) => {
    try {
      window.open(`/api/manuals?action=download&sportCode=${sportCode}`, '_blank');
    } catch (error) {
      console.error('Error downloading manual:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'current':
        return <Badge className="bg-green-100 text-green-800">Current</Badge>;
      case 'review':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'outdated':
        return <Badge className="bg-red-100 text-red-800">Needs Update</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            XII Playing Rules and Sport Policies
          </h2>
          <p className="text-muted-foreground">
            Centralized management of Big 12 playing rules, sport policies, and championship manuals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Policy
          </Button>
        </div>
      </div>

      {/* Compliance Health Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <Progress value={98.2} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">147</div>
            <p className="text-xs text-muted-foreground mt-1">23 need review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">3 high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sport Manuals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground mt-1">5 outdated</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="manuals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="manuals">Championship Manuals</TabsTrigger>
          <TabsTrigger value="rules">Playing Rules</TabsTrigger>
          <TabsTrigger value="policies">Sport Policies</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents, policies, or procedures..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Browse
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Document List */}
          <div className="space-y-4">
            {playingRulesDocuments.map((doc) => (
              <Card key={doc.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {doc.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {doc.category} • Version {doc.version} • {doc.pages} pages
                      </CardDescription>
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Last updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={doc.compliance} className="w-24 h-2" />
                        <span className="text-xs">{doc.compliance}% compliant</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manuals" className="space-y-4">
          {/* Show loading state or manual stats */}
          {manualStats && (
            <Alert className="mb-4">
              <FolderOpen className="h-4 w-4" />
              <AlertTitle>Championship Manuals Directory</AlertTitle>
              <AlertDescription>
                Connected to: {manualStats.sourcePath}
                <br />
                {manualStats.totalManuals} manuals found • {manualStats.missingSports} sports missing documentation
              </AlertDescription>
            </Alert>
          )}

          {loadingManuals ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : actualManuals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {actualManuals.map((manual) => (
                <Card key={manual.fileName} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{manual.sport}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {manual.sportCode}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">File</span>
                        <span className="truncate max-w-[150px]" title={manual.fileName}>
                          {manual.fileName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Modified</span>
                        <span>{new Date(manual.lastModified).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size</span>
                        <span>{(manual.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      {manual.season && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Season</span>
                          <span>{manual.season}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => downloadManual(manual.sportCode)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Update
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sportManuals.map((manual) => (
                <Card key={manual.sport} className={manual.status === 'outdated' ? 'border-red-200' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{manual.sport}</CardTitle>
                      {getStatusBadge(manual.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span>{new Date(manual.lastUpdated).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pages</span>
                        <span>{manual.pages}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {manual.status === 'outdated' && (
                        <Button size="sm" variant="default" className="flex-1">
                          Update
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Manual Template Section */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Templates & Guidelines</CardTitle>
              <CardDescription>
                Standardized templates for creating and updating sport manuals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Button variant="outline" className="justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Championship Manual Template
                </Button>
                <Button variant="outline" className="justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Regular Season Guidelines Template
                </Button>
                <Button variant="outline" className="justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Officials Manual Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          {/* Compliance Tasks */}
          <div className="space-y-4">
            {complianceTasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {task.status === 'pending' ? (
                          <Clock className="h-4 w-4 text-gray-400" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                        {task.task}
                      </CardTitle>
                      <CardDescription>
                        Responsible: {task.responsible}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority} priority
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Compliance Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Compliance Deadlines</CardTitle>
              <CardDescription>
                Critical dates for conference compliance requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Spring Compliance Meeting</p>
                      <p className="text-sm text-muted-foreground">All compliance officers required</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">Mar 15, 2025</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">NCAA Regional Rules Seminar</p>
                      <p className="text-sm text-muted-foreground">Virtual attendance available</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">Apr 20, 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Development Pipeline</CardTitle>
              <CardDescription>
                Policies currently under development or review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">NIL Policy Update</h4>
                    <Badge variant="secondary">In Review</Badge>
                  </div>
                  <Progress value={75} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Expected completion: February 2025
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Transfer Portal Guidelines</h4>
                    <Badge variant="outline">Draft</Badge>
                  </div>
                  <Progress value={40} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Expected completion: March 2025
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}