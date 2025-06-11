'use client'

import { useState } from "react"
import { 
  Card, 
  Badge, 
  Button, 
  SegmentedControl, 
  Heading, 
  Text, 
  Flex, 
  Grid, 
  Column,
  Row,
  Background
} from "@once-ui-system/core"
import { ContactsAnalyticsChart } from "@/components/charts/ContactsAnalyticsChart"
import { SportsPerformanceChart } from "@/components/charts/SportsPerformanceChart"
import { OperationalMetricsChart } from "@/components/charts/OperationalMetricsChart"
import { 
  BarChart3, 
  TrendingUp, 
  Activity,
  Target,
  Users,
  Trophy,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Share,
  Settings,
  Database
} from "lucide-react"

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('contacts')

  return (
    <Background background="page" fillWidth>
      <Column gap="xl" padding="l" paddingTop="m">
        {/* Header */}
        <Column gap="m">
          <Flex gap="m" style={{ alignItems: "center" }}>
            <Flex 
              style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '8px', 
                backgroundColor: 'var(--accent-600)' 
              }} 
              style={{ alignItems: "center" }} 
              style={{ justifyContent: "center" }}
            >
              <BarChart3 size={32} color="white" />
            </Flex>
            <Column>
              <Heading variant="display-strong-l">Big 12 Analytics Dashboard</Heading>
              <Text variant="body-default-m">
                Comprehensive data insights and performance metrics across all conference operations.
              </Text>
            </Column>
          </Flex>
          
          <Flex justifyContent="between" style={{ alignItems: "center" }}>
            <Flex gap="m" style={{ alignItems: "center" }}>
              <Badge variant="secondary">Real-time Data</Badge>
              <Badge variant="outline">Interactive Charts</Badge>
              <Badge variant="accent">AI Insights</Badge>
            </Flex>
            <Flex gap="s" style={{ alignItems: "center" }}>
              <Button variant="secondary" size="s" href="/sync">
                <RefreshCw size={16} />
                Data Sync
              </Button>
              <Button variant="secondary" size="s" href="/contacts">
                <Database size={16} />
                Contacts
              </Button>
            </Flex>
          </Flex>
        </Column>

        {/* Quick Stats Overview */}
        <Grid columns="6" gap="m">
          <Card padding="m">
            <Flex justifyContent="between" style={{ alignItems: "center" }} marginBottom="s">
              <Heading variant="label-default-s">Total Contacts</Heading>
              <Users size={16} />
            </Flex>
            <Heading variant="display-strong-l">125</Heading>
            <Text variant="body-default-xs">
              +12% from last month
            </Text>
          </Card>
          <Card padding="m">
            <Flex justifyContent="between" style={{ alignItems: "center" }} marginBottom="s">
              <Heading variant="label-default-s">Championships</Heading>
              <Trophy size={16} />
            </Flex>
            <Heading variant="display-strong-l">19</Heading>
            <Text variant="body-default-xs">
              +3 from last season
            </Text>
          </Card>
          <Card padding="m">
            <Flex justifyContent="between" style={{ alignItems: "center" }} marginBottom="s">
              <Heading variant="label-default-s">Budget Used</Heading>
              <DollarSign size={16} />
            </Flex>
            <Heading variant="display-strong-l">60%</Heading>
            <Text variant="body-default-xs">
              $290K of $485K
            </Text>
          </Card>
          <Card padding="m">
            <Flex justifyContent="between" style={{ alignItems: "center" }} marginBottom="s">
              <Heading variant="label-default-s">Events On Time</Heading>
              <Calendar size={16} />
            </Flex>
            <Heading variant="display-strong-l">94%</Heading>
            <Text variant="body-default-xs">
              +5% improvement
            </Text>
          </Card>
          <Card padding="m">
            <Flex justifyContent="between" style={{ alignItems: "center" }} marginBottom="s">
              <Heading variant="label-default-s">System Uptime</Heading>
              <Activity size={16} />
            </Flex>
            <Heading variant="display-strong-l">99.8%</Heading>
            <Text variant="body-default-xs">
              Above SLA target
            </Text>
          </Card>
          <Card padding="m">
            <Flex justifyContent="between" style={{ alignItems: "center" }} marginBottom="s">
              <Heading variant="label-default-s">Conference Rank</Heading>
              <Target size={16} />
            </Flex>
            <Heading variant="display-strong-l">#1</Heading>
            <Text variant="body-default-xs">
              Nationally ranked
            </Text>
          </Card>
        </Grid>

        {/* Controls */}
        <Card padding="l">
          <Column gap="m">
            <Flex justifyContent="between" style={{ alignItems: "center" }}>
              <Flex gap="s" style={{ alignItems: "center" }}>
                <Settings size={20} />
                <Heading variant="heading-strong-l">Dashboard Controls</Heading>
              </Flex>
              <Flex gap="s" style={{ alignItems: "center" }}>
                <Button variant="secondary" size="s">
                  <RefreshCw size={16} />
                  Refresh Data
                </Button>
                <Button variant="secondary" size="s">
                  <Download size={16} />
                  Export Report
                </Button>
                <Button variant="secondary" size="s">
                  <Share size={16} />
                  Share Dashboard
                </Button>
              </Flex>
            </Flex>
            <Text variant="body-default-m">
              Manage data sources, refresh intervals, and export options for comprehensive reporting
            </Text>
            <Flex gap="l" style={{ alignItems: "center" }}>
              <Flex gap="s" style={{ alignItems: "center" }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: '#10b981' 
                }}></div>
                <Text variant="body-default-s">Live Data Connected</Text>
              </Flex>
              <Flex gap="s" style={{ alignItems: "center" }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: '#3b82f6' 
                }}></div>
                <Text variant="body-default-s">Auto-refresh: 5 minutes</Text>
              </Flex>
              <Flex gap="s" style={{ alignItems: "center" }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: '#8b5cf6' 
                }}></div>
                <Text variant="body-default-s">Data Sources: Notion, Supabase, Internal APIs</Text>
              </Flex>
            </Flex>
          </Column>
        </Card>

        {/* Main Analytics Tabs */}
        <Column gap="l">
          <SegmentedControl
            name="analytics-tabs"
            items={[
              { label: "Contact Analytics", value: "contacts" },
              { label: "Sports Performance", value: "sports" },
              { label: "Operational Metrics", value: "operations" }
            ]}
            onSelectionChange={setActiveTab}
          />

          {/* Contact Analytics Tab */}
          {activeTab === 'contacts' && (
            <Column gap="l">
              <ContactsAnalyticsChart />
              
              {/* Additional Contact Insights */}
              <Grid columns="2" gap="l">
                <Card padding="l">
                  <Column gap="m">
                    <Column gap="s">
                      <Heading variant="heading-strong-l">Contact Engagement Trends</Heading>
                      <Text variant="body-default-m">
                        Communication patterns and outreach effectiveness
                      </Text>
                    </Column>
                    <Column gap="m">
                      <Flex justifyContent="between" style={{ alignItems: "center" }}>
                        <Text variant="body-default-s">Email Open Rate</Text>
                        <Text variant="body-strong-s">68%</Text>
                      </Flex>
                      <Flex justifyContent="between" style={{ alignItems: "center" }}>
                        <Text variant="body-default-s">Response Rate</Text>
                        <Text variant="body-strong-s">34%</Text>
                      </Flex>
                      <Flex justifyContent="between" style={{ alignItems: "center" }}>
                        <Text variant="body-default-s">Conference Call Attendance</Text>
                        <Text variant="body-strong-s">89%</Text>
                      </Flex>
                      <Flex justifyContent="between" style={{ alignItems: "center" }}>
                        <Text variant="body-default-s">Directory Completeness</Text>
                        <Text variant="body-strong-s">92%</Text>
                      </Flex>
                    </Column>
                  </Column>
                </Card>

                <Card padding="l">
                  <Column gap="m">
                    <Column gap="s">
                      <Heading variant="heading-strong-l">Top Contacted Organizations</Heading>
                      <Text variant="body-default-m">
                        Most frequent communication partners this quarter
                      </Text>
                    </Column>
                    <Column gap="s">
                      {[
                        { org: "Texas Athletics", contacts: 45, change: "+12%" },
                        { org: "Kansas Athletics", contacts: 38, change: "+8%" },
                        { org: "Iowa State Athletics", contacts: 32, change: "+5%" },
                        { org: "Oklahoma State", contacts: 29, change: "+15%" },
                        { org: "Baylor Athletics", contacts: 27, change: "+3%" },
                      ].map((item, index) => (
                        <Flex key={index} justifyContent="between" style={{ alignItems: "center" }}>
                          <Column>
                            <Text variant="body-strong-s">{item.org}</Text>
                            <Text variant="body-default-xs">{item.contacts} interactions</Text>
                          </Column>
                          <Badge variant="secondary" style={{ color: '#10b981' }}>
                            {item.change}
                          </Badge>
                        </Flex>
                      ))}
                    </Column>
                  </Column>
                </Card>
              </Grid>
            </Column>
          )}

          {/* Sports Performance Tab */}
          {activeTab === 'sports' && (
            <Column gap="l">
              <SportsPerformanceChart />
              
              {/* Additional Sports Insights */}
              <Grid columns="2" gap="l">
                <Card padding="l">
                  <Column gap="m">
                    <Column gap="s">
                      <Heading variant="heading-strong-l">National Recognition</Heading>
                      <Text variant="body-default-m">
                        Big 12 achievements in national rankings and awards
                      </Text>
                    </Column>
                    <Column gap="m">
                      <Flex justifyContent="between" style={{ alignItems: "center" }}>
                        <Text variant="body-default-s">Sports in Top 25</Text>
                        <Text variant="body-strong-s">42</Text>
                      </Flex>
                      <Flex justifyContent="between" style={{ alignItems: "center" }}>
                        <Text variant="body-default-s">All-Americans</Text>
                        <Text variant="body-strong-s">89</Text>
                      </Flex>
                      <Flex justifyContent="between" style={{ alignItems: "center" }}>
                        <Text variant="body-default-s">Coach of the Year Awards</Text>
                        <Text variant="body-strong-s">12</Text>
                      </Flex>
                      <Flex justifyContent="between" style={{ alignItems: "center" }}>
                        <Text variant="body-default-s">Academic All-Americans</Text>
                        <Text variant="body-strong-s">156</Text>
                      </Flex>
                    </Column>
                  </Column>
                </Card>

                <Card padding="l">
                  <Column gap="m">
                    <Column gap="s">
                      <Heading variant="heading-strong-l">Revenue Impact</Heading>
                      <Text variant="body-default-m">
                        Financial performance driven by athletic success
                      </Text>
                    </Column>
                    <Column gap="s">
                      {[
                        { metric: "TV Revenue", value: "$42.6M", change: "+18%" },
                        { metric: "Ticket Sales", value: "$28.3M", change: "+12%" },
                        { metric: "Merchandise", value: "$15.7M", change: "+8%" },
                        { metric: "Sponsorships", value: "$31.2M", change: "+22%" },
                        { metric: "Championship Bonuses", value: "$8.9M", change: "+35%" },
                      ].map((item, index) => (
                        <Flex key={index} justifyContent="between" style={{ alignItems: "center" }}>
                          <Column>
                            <Text variant="body-strong-s">{item.metric}</Text>
                            <Text variant="body-default-xs">{item.value}</Text>
                          </Column>
                          <Badge variant="secondary" style={{ color: '#10b981' }}>
                            {item.change}
                          </Badge>
                        </Flex>
                      ))}
                    </Column>
                  </Column>
                </Card>
              </Grid>
            </Column>
          )}

          {/* Operations Tab */}
          {activeTab === 'operations' && (
            <Column gap="l">
              <OperationalMetricsChart />
              
              {/* Additional Operational Insights */}
              <Grid columns="2" gap="l">
                <Card padding="l">
                  <Column gap="m">
                    <Column gap="s">
                      <Heading variant="heading-strong-l">Process Automation</Heading>
                      <Text variant="body-default-m">
                        Efficiency gains through HELiiX platform automation
                      </Text>
                    </Column>
                    <Column gap="m">
                      <Flex justifyContent="between" style={{ alignItems: "center" }}>
                        <Text variant="body-default-s">Automated Workflows</Text>
                        <Text variant="body-strong-s">67</Text>
                      </Flex>
                      <Flex justifyContent="between" style={{ alignItems: "center" }}>
                        <Text variant="body-default-s">Manual Tasks Reduced</Text>
                        <Text variant="body-strong-s">78%</Text>
                      </Flex>
                      <Flex justifyContent="between" style={{ alignItems: "center" }}>
                        <Text variant="body-default-s">Processing Time Saved</Text>
                        <Text variant="body-strong-s">342 hrs/month</Text>
                      </Flex>
                      <Flex justifyContent="between" style={{ alignItems: "center" }}>
                        <Text variant="body-default-s">Error Rate Reduction</Text>
                        <Text variant="body-strong-s">85%</Text>
                      </Flex>
                    </Column>
                  </Column>
                </Card>

                <Card padding="l">
                  <Column gap="m">
                    <Column gap="s">
                      <Heading variant="heading-strong-l">Resource Utilization</Heading>
                      <Text variant="body-default-m">
                        Conference resource allocation and efficiency metrics
                      </Text>
                    </Column>
                    <Column gap="s">
                      {[
                        { resource: "Staff Productivity", utilization: "91%", status: "optimal" },
                        { resource: "Technology Assets", utilization: "87%", status: "good" },
                        { resource: "Facility Usage", utilization: "94%", status: "optimal" },
                        { resource: "Vendor Contracts", utilization: "89%", status: "good" },
                        { resource: "Budget Allocation", utilization: "92%", status: "optimal" },
                      ].map((item, index) => (
                        <Flex key={index} justifyContent="between" style={{ alignItems: "center" }}>
                          <Column>
                            <Text variant="body-strong-s">{item.resource}</Text>
                            <Text variant="body-default-xs">{item.utilization} utilized</Text>
                          </Column>
                          <Badge 
                            variant={item.status === "optimal" ? "accent" : "secondary"}
                            style={item.status === "optimal" ? { color: '#10b981' } : {}}
                          >
                            {item.status}
                          </Badge>
                        </Flex>
                      ))}
                    </Column>
                  </Column>
                </Card>
              </Grid>
            </Column>
          )}
        </Column>

        {/* Performance Summary */}
        <Card padding="l">
          <Column gap="l">
            <Flex gap="s" style={{ alignItems: "center" }}>
              <TrendingUp size={20} style={{ color: 'var(--accent-600)' }} />
              <Heading variant="heading-strong-l">Executive Summary</Heading>
            </Flex>
            <Text variant="body-default-m">
              Key performance indicators and strategic insights for leadership
            </Text>
            <Grid columns="3" gap="xl">
              <Column gap="s">
                <Heading variant="heading-strong-m" style={{ color: '#10b981' }}>Strengths</Heading>
                <Column gap="xs">
                  <Text variant="body-default-s">• #1 conference ranking nationally</Text>
                  <Text variant="body-default-s">• 99.8% system uptime exceeds SLA</Text>
                  <Text variant="body-default-s">• 94% event completion rate</Text>
                  <Text variant="body-default-s">• Strong revenue growth (+18% TV)</Text>
                </Column>
              </Column>
              <Column gap="s">
                <Heading variant="heading-strong-m" style={{ color: '#f59e0b' }}>Opportunities</Heading>
                <Column gap="xs">
                  <Text variant="body-default-s">• Expand contact database (+12% growth)</Text>
                  <Text variant="body-default-s">• Automate remaining manual processes</Text>
                  <Text variant="body-default-s">• Increase championship success rate</Text>
                  <Text variant="body-default-s">• Optimize Technology budget allocation</Text>
                </Column>
              </Column>
              <Column gap="s">
                <Heading variant="heading-strong-m" style={{ color: '#3b82f6' }}>Strategic Focus</Heading>
                <Column gap="xs">
                  <Text variant="body-default-s">• Continue digital transformation</Text>
                  <Text variant="body-default-s">• Maintain competitive advantage</Text>
                  <Text variant="body-default-s">• Enhance member school relations</Text>
                  <Text variant="body-default-s">• Invest in championship programs</Text>
                </Column>
              </Column>
            </Grid>
          </Column>
        </Card>
      </Column>
    </Background>
  )
}