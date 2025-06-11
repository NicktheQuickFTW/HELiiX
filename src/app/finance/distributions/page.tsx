'use client'

import { 
  Background,
  Column,
  Row,
  Grid,
  Card,
  Heading,
  Text,
  Icon,
  Badge,
  StatusIndicator,
  Button,
  Dropdown,
  Option
} from '@once-ui-system/core'
import { 
  DollarSign, 
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  FileText,
  Search,
  CalendarPlus,
  Bell
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
        return (
          <Badge variant="success" size="s">
            <Icon size="xs">
              <CheckCircle2 />
            </Icon>
            Completed
          </Badge>
        )
      case 'processing':
        return (
          <Badge variant="brand" size="s">
            <Icon size="xs">
              <Clock />
            </Icon>
            Processing
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="warning" size="s">
            <Icon size="xs">
              <AlertTriangle />
            </Icon>
            Pending
          </Badge>
        )
      default:
        return <Badge variant="neutral" size="s">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const exportToCalendar = (distribution: typeof distributions[0]) => {
    const icsContent = generateICSFile(distribution)
    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `big12-distribution-${distribution.quarter.toLowerCase().replace(' ', '-')}.ics`
    link.click()
    URL.revokeObjectURL(url)
  }

  const generateICSFile = (distribution: typeof distributions[0]) => {
    const startDate = new Date(distribution.date)
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // 1 hour duration
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Big 12 Conference//HELiiX//EN
BEGIN:VEVENT
UID:${distribution.quarter}-${Date.now()}@big12.org
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Big 12 ${distribution.quarter} Revenue Distribution
DESCRIPTION:${distribution.type} - ${formatCurrency(distribution.totalAmount)} total\n${distribution.notes || ''}
LOCATION:Big 12 Conference Office
STATUS:${distribution.status === 'completed' ? 'CONFIRMED' : 'TENTATIVE'}
END:VEVENT
END:VCALENDAR`
  }

  const setReminder = (distribution: typeof distributions[0]) => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          const reminderDate = new Date(distribution.date)
          reminderDate.setDate(reminderDate.getDate() - 7) // 1 week before
          
          const timeUntilReminder = reminderDate.getTime() - Date.now()
          
          if (timeUntilReminder > 0) {
            setTimeout(() => {
              new Notification(`Big 12 ${distribution.quarter} Distribution Reminder`, {
                body: `Distribution scheduled for ${new Date(distribution.date).toLocaleDateString()}`,
                icon: '/favicon.ico'
              })
            }, timeUntilReminder)
            
            alert(`Reminder set for ${reminderDate.toLocaleDateString()}`)
          } else {
            alert('Distribution date has already passed or is too soon for a 7-day reminder')
          }
        }
      })
    } else {
      alert('Browser notifications not supported')
    }
  }

  return (
    <Background background="page" fillWidth>
      <Column 
        fillWidth 
        paddingX="xl" 
        paddingY="xl" 
        gap="xl"
        maxWidth="1440"
      >
        <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Column gap="s">
            <Row style={{ alignItems: "center" }} gap="s">
              <Icon size="xl">
                <DollarSign />
              </Icon>
              <Heading size="xxl" weight="bold">
                Revenue Distributions
              </Heading>
            </Row>
            <Text size="m" onBackground="neutral-weak">
              Quarterly revenue distributions to Big 12 member schools
            </Text>
          </Column>
          <Row gap="s">
            <Button variant="secondary" size="m">
              <Icon>
                <CalendarPlus />
              </Icon>
              Add to Calendar
            </Button>
            <Button variant="primary" size="m">
              <Icon>
                <Download />
              </Icon>
              Export Report
            </Button>
          </Row>
        </Row>

        {/* Key Stats */}
        <Grid 
          columns="1" 
          mobileColumns="2" 
          tabletColumns="3" 
          desktopColumns="5" 
          gap="l"
        >
          <Card padding="l" border="neutral-medium" radius="l">
            <Column gap="s">
              <Text size="s" weight="medium" onBackground="neutral-weak">
                Total Distributed
              </Text>
              <Text size="xl" weight="bold">
                {formatCurrency(yearlyStats.totalDistributed)}
              </Text>
              <Text size="xs" onBackground="neutral-weak">
                This fiscal year
              </Text>
            </Column>
          </Card>
          
          <Card padding="l" border="neutral-medium" radius="l">
            <Column gap="s">
              <Text size="s" weight="medium" onBackground="neutral-weak">
                Average Per School
              </Text>
              <Text size="xl" weight="bold">
                {formatCurrency(yearlyStats.averagePerSchool)}
              </Text>
              <Text size="xs" onBackground="neutral-weak">
                Base distribution
              </Text>
            </Column>
          </Card>
          
          <Card padding="l" border="neutral-medium" radius="l">
            <Column gap="s">
              <Text size="s" weight="medium" onBackground="neutral-weak">
                YoY Growth
              </Text>
              <Text size="xl" weight="bold" onBackground="success-strong">
                +{yearlyStats.growthFromPreviousYear}%
              </Text>
              <Text size="xs" onBackground="neutral-weak">
                vs. last year
              </Text>
            </Column>
          </Card>
          
          <Card padding="l" border="neutral-medium" radius="l">
            <Column gap="s">
              <Text size="s" weight="medium" onBackground="neutral-weak">
                Performance Bonuses
              </Text>
              <Text size="xl" weight="bold">
                {formatCurrency(yearlyStats.totalBonuses)}
              </Text>
              <Text size="xs" onBackground="neutral-weak">
                Total bonuses
              </Text>
            </Column>
          </Card>
          
          <Card padding="l" border="neutral-medium" radius="l">
            <Column gap="s">
              <Text size="s" weight="medium" onBackground="neutral-weak">
                Pending Adjustments
              </Text>
              <Text size="xl" weight="bold">
                {formatCurrency(yearlyStats.pendingAdjustments)}
              </Text>
              <Text size="xs" onBackground="neutral-weak">
                Net adjustments
              </Text>
            </Column>
          </Card>
        </Grid>

        {/* Filters */}
        <Row style={{ alignItems: "center" }} gap="m" wrap>
          <Column flex="1" maxWidth="400">
            <Row style={{ alignItems: "center" }} gap="s" paddingX="m" paddingY="s" 
                 border="neutral-medium" radius="m">
              <Icon size="s" onBackground="neutral-weak">
                <Search />
              </Icon>
              <input
                type="text"
                placeholder="Search distributions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  border: 'none', 
                  outline: 'none', 
                  background: 'transparent',
                  width: '100%'
                }}
              />
            </Row>
          </Column>
          
          <Dropdown label={quarterFilter === 'all' ? 'All Quarters' : quarterFilter}>
            <Option onClick={() => setQuarterFilter('all')}>All Quarters</Option>
            <Option onClick={() => setQuarterFilter('Q1')}>Q1 2024</Option>
            <Option onClick={() => setQuarterFilter('Q2')}>Q2 2024</Option>
            <Option onClick={() => setQuarterFilter('Q3')}>Q3 2024</Option>
            <Option onClick={() => setQuarterFilter('Q4')}>Q4 2024</Option>
          </Dropdown>
          
          <Dropdown label={statusFilter === 'all' ? 'All Status' : statusFilter}>
            <Option onClick={() => setStatusFilter('all')}>All Status</Option>
            <Option onClick={() => setStatusFilter('completed')}>Completed</Option>
            <Option onClick={() => setStatusFilter('processing')}>Processing</Option>
            <Option onClick={() => setStatusFilter('pending')}>Pending</Option>
          </Dropdown>
          
          <Badge variant="secondary" size="s">
            {filteredDistributions.length} of {distributions.length} distributions
          </Badge>
        </Row>

        <Tabs defaultValue="distributions" onValueChange={setSelectedView}>
          <Row gap="s" marginBottom="xl">
            <Button 
              variant={selectedView === 'distributions' ? 'primary' : 'secondary'} 
              size="s"
              onClick={() => setSelectedView('distributions')}
            >
              Quarterly Distributions
            </Button>
            <Button 
              variant={selectedView === 'calendar' ? 'primary' : 'secondary'} 
              size="s"
              onClick={() => setSelectedView('calendar')}
            >
              Calendar View
            </Button>
            <Button 
              variant={selectedView === 'schools' ? 'primary' : 'secondary'} 
              size="s"
              onClick={() => setSelectedView('schools')}
            >
              School Breakdown
            </Button>
            <Button 
              variant={selectedView === 'analytics' ? 'primary' : 'secondary'} 
              size="s"
              onClick={() => setSelectedView('analytics')}
            >
              Revenue Analytics
            </Button>
            <Button 
              variant={selectedView === 'reconciliation' ? 'primary' : 'secondary'} 
              size="s"
              onClick={() => setSelectedView('reconciliation')}
            >
              Reconciliation
            </Button>
          </Row>

          {selectedView === 'distributions' && (
            <Column gap="l">
              {filteredDistributions.map((dist, index) => (
                <Card key={index} padding="xl" border="neutral-medium" radius="l" style={{ cursor: "pointer" }}>
                  <Column gap="l">
                    <Row style={{ justifyContent: "space-between" }} alignItems="flex-start">
                      <Column gap="xs">
                        <Heading size="l" weight="semibold">
                          {dist.quarter} Distribution
                        </Heading>
                        <Text size="s" onBackground="neutral-weak">
                          {new Date(dist.date).toLocaleDateString()} • {dist.type}
                        </Text>
                      </Column>
                      {getStatusBadge(dist.status)}
                    </Row>
                    <Grid columns="2" tabletColumns="4" gap="m" marginY="l">
                      <Column 
                        textAlign="center" 
                        padding="l" 
                        background="neutral-alpha-weak" 
                        radius="m"
                      >
                        <Text size="xl" weight="bold">
                          {formatCurrency(dist.totalAmount)}
                        </Text>
                        <Text size="s" onBackground="neutral-weak">
                          Total Amount
                        </Text>
                      </Column>
                      <Column 
                        textAlign="center" 
                        padding="l" 
                        background="neutral-alpha-weak" 
                        radius="m"
                      >
                        <Text size="xl" weight="bold">
                          {formatCurrency(dist.perSchool)}
                        </Text>
                        <Text size="s" onBackground="neutral-weak">
                          Per School
                        </Text>
                      </Column>
                      <Column 
                        textAlign="center" 
                        padding="l" 
                        background="neutral-alpha-weak" 
                        radius="m"
                      >
                        <Text size="xl" weight="bold">
                          {dist.schools}
                        </Text>
                        <Text size="s" onBackground="neutral-weak">
                          Schools
                        </Text>
                      </Column>
                      <Column 
                        textAlign="center" 
                        padding="l" 
                        background="neutral-alpha-weak" 
                        radius="m"
                      >
                        <Text size="xl" weight="bold">
                          {dist.status === 'completed' ? '100%' : 
                           dist.status === 'processing' ? '75%' : '0%'}
                        </Text>
                        <Text size="s" onBackground="neutral-weak">
                          Complete
                        </Text>
                      </Column>
                    </Grid>
                  
                    <Column gap="m">
                      <Heading size="m" weight="semibold">
                        Revenue Breakdown
                      </Heading>
                      <Grid columns="1" tabletColumns="2" gap="m">
                        <Column gap="s">
                          <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                            <Text size="s">Television Revenue</Text>
                            <Text weight="medium">{formatCurrency(dist.categories.television)}</Text>
                          </Row>
                          <StatusIndicator 
                            value={(dist.categories.television / dist.totalAmount) * 100} 
                            variant="brand" 
                            size="s"
                          />
                        </Column>
                        
                        <Column gap="s">
                          <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                            <Text size="s">Championship Revenue</Text>
                            <Text weight="medium">{formatCurrency(dist.categories.championship)}</Text>
                          </Row>
                          <StatusIndicator 
                            value={(dist.categories.championship / dist.totalAmount) * 100} 
                            variant="accent" 
                            size="s"
                          />
                        </Column>
                        
                        <Column gap="s">
                          <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                            <Text size="s">Sponsorship Revenue</Text>
                            <Text weight="medium">{formatCurrency(dist.categories.sponsorship)}</Text>
                          </Row>
                          <StatusIndicator 
                            value={(dist.categories.sponsorship / dist.totalAmount) * 100} 
                            variant="success" 
                            size="s"
                          />
                        </Column>
                        
                        <Column gap="s">
                          <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                            <Text size="s">Other Revenue</Text>
                            <Text weight="medium">{formatCurrency(dist.categories.other)}</Text>
                          </Row>
                          <StatusIndicator 
                            value={(dist.categories.other / dist.totalAmount) * 100} 
                            variant="neutral" 
                            size="s"
                          />
                        </Column>
                      </Grid>
                    </Column>
                  
                    {dist.notes && (
                      <Card padding="m" background="neutral-alpha-weak" radius="m">
                        <Text size="s">
                          <Text weight="bold">Notes:</Text> {dist.notes}
                        </Text>
                      </Card>
                    )}
                    
                    <Row gap="s" wrap>
                      <Button variant="secondary" size="s">
                        <Icon>
                          <FileText />
                        </Icon>
                        View Report
                      </Button>
                      <Button variant="secondary" size="s" onClick={() => exportToCalendar(dist)}>
                        <Icon>
                          <CalendarPlus />
                        </Icon>
                        Add to Calendar
                      </Button>
                      <Button variant="secondary" size="s">
                        <Icon>
                          <Download />
                        </Icon>
                        Export
                      </Button>
                      {dist.status !== 'completed' && (
                        <Button variant="secondary" size="s" onClick={() => setReminder(dist)}>
                          <Icon>
                            <Bell />
                          </Icon>
                          Set Reminder
                        </Button>
                      )}
                    </Row>
                  </Column>
                </Card>
              ))}
            </Column>
          )}

          {selectedView === 'calendar' && (
            <Grid columns="1" tabletColumns="2" gap="l">
              <Card padding="xl" border="neutral-medium" radius="l">
                <Column gap="m">
                  <Column gap="xs">
                    <Heading size="l" weight="semibold">
                      Distribution Calendar
                    </Heading>
                    <Text size="s" onBackground="neutral-weak">
                      Upcoming and completed distribution dates
                    </Text>
                  </Column>
                  <Column 
                    padding="l" 
                    border="neutral-medium" 
                    radius="m"
                    minHeight="320"
                    justifyContent="center"
                    style={{ alignItems: "center" }}
                  >
                    <Text size="s" onBackground="neutral-weak">
                      Calendar component placeholder
                    </Text>
                  </Column>
                </Column>
              </Card>
              
              <Card padding="xl" border="neutral-medium" radius="l">
                <Column gap="m">
                  <Column gap="xs">
                    <Heading size="l" weight="semibold">
                      Upcoming Deadlines
                    </Heading>
                    <Text size="s" onBackground="neutral-weak">
                      Important dates and reminders
                    </Text>
                  </Column>
                  <Column gap="m">
                    {distributions
                      .filter(d => new Date(d.date) > new Date())
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((dist, index) => (
                      <Row key={index} 
                           style={{ justifyContent: "space-between" }} 
                           style={{ alignItems: "center" }} 
                           padding="m" 
                           border="neutral-medium" 
                           radius="m"
                      >
                        <Column gap="xs">
                          <Text weight="medium">{dist.quarter} Distribution</Text>
                          <Text size="s" onBackground="neutral-weak">
                            {new Date(dist.date).toLocaleDateString()}
                          </Text>
                          <Text size="s" onBackground="neutral-weak">
                            {formatCurrency(dist.totalAmount)}
                          </Text>
                        </Column>
                        <Row gap="s">
                          {getStatusBadge(dist.status)}
                          <Button 
                            variant="secondary" 
                            size="s"
                            onClick={() => setReminder(dist)}
                          >
                            <Icon>
                              <Bell />
                            </Icon>
                          </Button>
                        </Row>
                      </Row>
                    ))}
                  </Column>
                </Column>
              </Card>
            </Grid>
          )}

          {selectedView === 'schools' && (
            <Card padding="xl" border="neutral-medium" radius="l">
              <Column gap="l">
                <Column gap="xs">
                  <Heading size="l" weight="semibold">
                    School Distribution Summary
                  </Heading>
                  <Text size="s" onBackground="neutral-weak">
                    Revenue breakdown by member institution
                  </Text>
                </Column>
                <Column style={{ overflowX: 'auto' }}>
                  <Grid columns="8" gap="0" minWidth="800">
                    {/* Header */}
                    <Text size="s" weight="semibold" padding="s" style={{ textAlign: "left" }}>School</Text>
                    <Text size="s" weight="semibold" padding="s" style={{ textAlign: "right" }}>Q1 2024</Text>
                    <Text size="s" weight="semibold" padding="s" style={{ textAlign: "right" }}>Q2 2024</Text>
                    <Text size="s" weight="semibold" padding="s" style={{ textAlign: "right" }}>Q3 2024</Text>
                    <Text size="s" weight="semibold" padding="s" style={{ textAlign: "right" }}>Q4 2024</Text>
                    <Text size="s" weight="semibold" padding="s" style={{ textAlign: "right" }}>Bonuses</Text>
                    <Text size="s" weight="semibold" padding="s" style={{ textAlign: "right" }}>Adjustments</Text>
                    <Text size="s" weight="semibold" padding="s" style={{ textAlign: "right" }}>Total</Text>
                    
                    {schoolDistributions.map((school, index) => [
                      <Row key={`${index}-school`} style={{ alignItems: "center" }} gap="s" padding="s" border="neutral-weak" borderPosition="bottom">
                        <Icon size="s">
                          <Building2 />
                        </Icon>
                        <Text weight="medium">{school.school}</Text>
                      </Row>,
                      <Text key={`${index}-q1`} padding="s" style={{ textAlign: "right" }} border="neutral-weak" borderPosition="bottom">{formatCurrency(school.q1)}</Text>,
                      <Text key={`${index}-q2`} padding="s" style={{ textAlign: "right" }} border="neutral-weak" borderPosition="bottom">{formatCurrency(school.q2)}</Text>,
                      <Text key={`${index}-q3`} padding="s" style={{ textAlign: "right" }} border="neutral-weak" borderPosition="bottom" onBackground="brand-strong">{formatCurrency(school.q3)}</Text>,
                      <Text key={`${index}-q4`} padding="s" style={{ textAlign: "right" }} border="neutral-weak" borderPosition="bottom" onBackground="neutral-weak">{formatCurrency(school.q4)}</Text>,
                      <Text key={`${index}-bonuses`} padding="s" style={{ textAlign: "right" }} border="neutral-weak" borderPosition="bottom" onBackground="success-strong">+{formatCurrency(school.bonuses)}</Text>,
                      <Text key={`${index}-adj`} padding="s" style={{ textAlign: "right" }} border="neutral-weak" borderPosition="bottom" 
                            onBackground={school.adjustments >= 0 ? 'success-strong' : 'danger-strong'}>
                        {school.adjustments >= 0 ? '+' : ''}{formatCurrency(school.adjustments)}
                      </Text>,
                      <Text key={`${index}-total`} padding="s" style={{ textAlign: "right" }} border="neutral-weak" borderPosition="bottom" weight="bold">{formatCurrency(school.total + school.bonuses + school.adjustments)}</Text>
                    ]).flat()}
                  </Grid>
                </Column>
              </Column>
            </Card>
          )}

          {selectedView === 'analytics' && (
            <Grid columns="1" tabletColumns="2" gap="l">
              <Card padding="xl" border="neutral-medium" radius="l">
                <Column gap="l">
                  <Column gap="xs">
                    <Heading size="l" weight="semibold">
                      Revenue Growth Trend
                    </Heading>
                    <Text size="s" onBackground="neutral-weak">
                      Quarterly revenue comparison year-over-year
                    </Text>
                  </Column>
                  <Column gap="m">
                    <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Text size="s">Q1 Growth</Text>
                      <Column style={{ textAlign: "right" }}>
                        <Text weight="medium" onBackground="success-strong">+8.5%</Text>
                        <Text size="xs" onBackground="neutral-weak">vs. Q1 2023</Text>
                      </Column>
                    </Row>
                    <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Text size="s">Q2 Growth</Text>
                      <Column style={{ textAlign: "right" }}>
                        <Text weight="medium" onBackground="success-strong">+12.3%</Text>
                        <Text size="xs" onBackground="neutral-weak">vs. Q2 2023</Text>
                      </Column>
                    </Row>
                    <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Text size="s">Q3 Projected Growth</Text>
                      <Column style={{ textAlign: "right" }}>
                        <Text weight="medium" onBackground="success-strong">+15.2%</Text>
                        <Text size="xs" onBackground="neutral-weak">vs. Q3 2023</Text>
                      </Column>
                    </Row>
                    <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Text size="s">Q4 Projected Growth</Text>
                      <Column style={{ textAlign: "right" }}>
                        <Text weight="medium" onBackground="success-strong">+11.8%</Text>
                        <Text size="xs" onBackground="neutral-weak">vs. Q4 2023</Text>
                      </Column>
                    </Row>
                  </Column>
                </Column>
              </Card>
              
              <Card padding="xl" border="neutral-medium" radius="l">
                <Column gap="l">
                  <Column gap="xs">
                    <Heading size="l" weight="semibold">
                      Revenue Source Analysis
                    </Heading>
                    <Text size="s" onBackground="neutral-weak">
                      Breakdown of revenue sources this fiscal year
                    </Text>
                  </Column>
                  <Column gap="m">
                    <Column gap="s">
                      <Row style={{ justifyContent: "space-between" }}>
                        <Text size="s">Television (77%)</Text>
                        <Text weight="medium">$97.6M</Text>
                      </Row>
                      <StatusIndicator value={77} variant="brand" size="s" />
                    </Column>
                    <Column gap="s">
                      <Row style={{ justifyContent: "space-between" }}>
                        <Text size="s">Championships (10%)</Text>
                        <Text weight="medium">$12.6M</Text>
                      </Row>
                      <StatusIndicator value={10} variant="accent" size="s" />
                    </Column>
                    <Column gap="s">
                      <Row style={{ justifyContent: "space-between" }}>
                        <Text size="s">Sponsorships (9%)</Text>
                        <Text weight="medium">$11.7M</Text>
                      </Row>
                      <StatusIndicator value={9} variant="success" size="s" />
                    </Column>
                    <Column gap="s">
                      <Row style={{ justifyContent: "space-between" }}>
                        <Text size="s">Other (4%)</Text>
                        <Text weight="medium">$4.3M</Text>
                      </Row>
                      <StatusIndicator value={4} variant="neutral" size="s" />
                    </Column>
                  </Column>
                </Column>
              </Card>
            </Grid>
          )}

          {selectedView === 'reconciliation' && (
            <Card padding="xl" border="neutral-medium" radius="l">
              <Column gap="xl">
                <Column gap="xs">
                  <Heading size="l" weight="semibold">
                    Distribution Reconciliation
                  </Heading>
                  <Text size="s" onBackground="neutral-weak">
                    Audit trail and reconciliation status
                  </Text>
                </Column>
                
                <Column gap="xl">
                  <Grid columns="1" tabletColumns="3" gap="m">
                    <Column 
                      textAlign="center" 
                      padding="l" 
                      border="neutral-medium" 
                      radius="m"
                    >
                      <Text size="xl" weight="bold" onBackground="success-strong">
                        $126.2M
                      </Text>
                      <Text size="s" onBackground="neutral-weak">
                        Total Distributed
                      </Text>
                      <Text size="xs" onBackground="neutral-weak">
                        Fully reconciled
                      </Text>
                    </Column>
                    <Column 
                      textAlign="center" 
                      padding="l" 
                      border="neutral-medium" 
                      radius="m"
                    >
                      <Text size="xl" weight="bold" onBackground="brand-strong">
                        $32.1M
                      </Text>
                      <Text size="s" onBackground="neutral-weak">
                        Q3 Processing
                      </Text>
                      <Text size="xs" onBackground="neutral-weak">
                        95% complete
                      </Text>
                    </Column>
                    <Column 
                      textAlign="center" 
                      padding="l" 
                      border="neutral-medium" 
                      radius="m"
                    >
                      <Text size="xl" weight="bold" onBackground="warning-strong">
                        $148K
                      </Text>
                      <Text size="s" onBackground="neutral-weak">
                        Pending Adjustments
                      </Text>
                      <Text size="xs" onBackground="neutral-weak">
                        Under review
                      </Text>
                    </Column>
                  </Grid>
                  
                  <Column gap="m">
                    <Heading size="m" weight="semibold">
                      Recent Reconciliation Activity
                    </Heading>
                    <Column gap="m">
                      <Row 
                        alignItems="flex-start" 
                        gap="m" 
                        padding="m" 
                        border="neutral-medium" 
                        radius="m"
                      >
                        <Icon onBackground="success-strong">
                          <CheckCircle2 />
                        </Icon>
                        <Column gap="xs">
                          <Text weight="medium" size="s">
                            Q2 2024 Distribution Reconciled
                          </Text>
                          <Text size="s" onBackground="neutral-weak">
                            All $31.7M distributed and confirmed by member schools
                          </Text>
                          <Text size="xs" onBackground="neutral-weak">
                            Completed: June 30, 2024
                          </Text>
                        </Column>
                      </Row>
                      <Row 
                        alignItems="flex-start" 
                        gap="m" 
                        padding="m" 
                        border="neutral-medium" 
                        radius="m"
                      >
                        <Icon onBackground="brand-strong">
                          <Clock />
                        </Icon>
                        <Column gap="xs">
                          <Text weight="medium" size="s">
                            Q3 2024 Final TV Revenue Reconciliation
                          </Text>
                          <Text size="s" onBackground="neutral-weak">
                            Pending final television revenue reports from media partners
                          </Text>
                          <Text size="xs" onBackground="neutral-weak">
                            Expected: September 30, 2024
                          </Text>
                        </Column>
                      </Row>
                      <Row 
                        alignItems="flex-start" 
                        gap="m" 
                        padding="m" 
                        border="neutral-medium" 
                        radius="m"
                      >
                        <Icon onBackground="warning-strong">
                          <AlertTriangle />
                        </Icon>
                        <Column gap="xs">
                          <Text weight="medium" size="s">
                            Performance Bonus Adjustments
                          </Text>
                          <Text size="s" onBackground="neutral-weak">
                            Reviewing championship performance bonuses for final calculations
                          </Text>
                          <Text size="xs" onBackground="neutral-weak">
                            Review ongoing
                          </Text>
                        </Column>
                      </Row>
                    </Column>
                  </Column>
                </Column>
              </Column>
            </Card>
          )}
        </Tabs>
      </Column>
    </Background>
  )
}