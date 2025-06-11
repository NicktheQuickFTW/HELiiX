"use client"

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
  Heading,
  Text,
  Button,
  Column,
  Row,
  Grid,
  Card,
  Badge,
  Background,
  StatusIndicator,
} from "@once-ui-system/core"
import { SafeCard } from "@/components/ui/SafeCard"
import { SafeRow } from "@/components/ui/SafeRow"
import { SafeFade } from "@/components/ui/SafeFade"
import { SafeBadge } from "@/components/ui/SafeBadge"
import { 
  Trophy, 
  Database,
  BarChart3,
  Building,
  Sparkles,
  Brain,
  Globe,
  Activity,
  DollarSign
} from 'lucide-react'

export default function HomePage() {
  const platformStats = [
    {
      icon: Building,
      label: "Member Schools",
      value: "16",
      description: "Universities",
    },
    {
      icon: Trophy,
      label: "Sports Programs",
      value: "23",
      description: "Championship sports",
    },
    {
      icon: Database,
      label: "Active Contacts",
      value: "1,200+",
      description: "Conference personnel",
    },
    {
      icon: Activity,
      label: "System Uptime",
      value: "99.9%",
      description: "Reliability",
    }
  ];

  const featuredCapabilities = [
    {
      icon: Database,
      title: "Contact Management",
      description: "Comprehensive directory of all Big 12 personnel with real-time sync from Notion",
      url: "/contacts",
      badge: "Live Sync",
    },
    {
      icon: Trophy,
      title: "Championships",
      description: "Manage championship events, credentials, and logistics across all sports",
      url: "/championships",
      badge: "23 Sports",
    },
    {
      icon: BarChart3,
      title: "Analytics & Intelligence",
      description: "Real-time insights and performance metrics for conference operations",
      url: "/analytics",
      badge: "AI-Powered",
    },
    {
      icon: Brain,
      title: "AI Operations Center",
      description: "Intelligent automation and predictive analytics for operational excellence",
      url: "/ai-assistant",
      badge: "Advanced AI",
    },
    {
      icon: DollarSign,
      title: "Financial Management",
      description: "Revenue distributions, budget tracking, and financial analytics",
      url: "/finance",
      badge: "$126M+ Managed",
    },
    {
      icon: Globe,
      title: "Weather Command",
      description: "Real-time weather monitoring and alerts across all 16 campuses",
      url: "/weather",
      badge: "Real-time",
    },
  ];

  return (
    <Background background="page" fillWidth>
      <Column fillWidth style={{ minHeight: "100vh" }}>
        
        {/* Hero Section */}
        <Column fillWidth paddingY="xl" style={{ alignItems: "center" }}>
          <Column maxWidth="l" fillWidth paddingX="l" gap="xl" style={{ alignItems: "center" }}>
            
            <Column gap="l" style={{ alignItems: "center" }}>
              <Row gap="s" style={{ alignItems: "center" }}>
                <SafeBadge style={{
                  background: "var(--brand-background-alpha-medium)",
                  border: "1px solid var(--brand-border-alpha-weak)",
                  color: "var(--brand-text-strong)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <Sparkles size={16} />
                  Big 12 Conference Management
                </SafeBadge>
                <StatusIndicator color="green" />
                <Text variant="body-default-s" onBackground="neutral-weak">
                  All systems operational
                </Text>
              </Row>
              
              <Column gap="m" style={{ alignItems: "center" }}>
                <Heading 
                  variant="display-strong-xl" 
                  className="gradient-text"
                  style={{ 
                    textAlign: "center",
                    marginBottom: "16px",
                    fontSize: "2.5rem"
                  }}
                >
                  Streamlined Conference Operations
                </Heading>
                
                <Text
                  variant="heading-default-l"
                  onBackground="neutral-weak"
                  style={{ textAlign: "center", maxWidth: "48rem" }}
                >
                  Comprehensive platform for managing Big 12 Conference athletics, 
                  communications, and operational excellence across all 16 member institutions.
                </Text>
              </Column>
              
              <Row gap="l" style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                <Link href="/dashboard">
                  <Button 
                    variant="primary"
                    size="l"
                    suffixIcon="arrowRight"
                  >
                    Access Dashboard
                  </Button>
                </Link>
                <Link href="/overview">
                  <Button 
                    variant="secondary"
                    size="l"
                  >
                    Learn More
                  </Button>
                </Link>
              </Row>
            </Column>
          </Column>
        </Column>

        {/* Statistics Section */}
        <Column fillWidth paddingY="xl" background="surface">
          <Column maxWidth="xl" paddingX="l" gap="xl">
            <Grid columns="4" mobileColumns="1" tabletColumns="2" gap="l">
              {platformStats.map((stat, index) => (
                <SafeCard key={index} padding="l" hover border="neutral-medium">
                  <Column gap="m" style={{ textAlign: "center" }}>
                    <Column 
                      style={{ 
                        background: "var(--brand-background-alpha-weak)",
                        padding: "12px",
                        borderRadius: "12px",
                        width: "48px", 
                        height: "48px", 
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <stat.icon size={24} />
                    </Column>
                    <Column gap="xs">
                      <Text variant="body-strong-s" onBackground="neutral-medium">
                        {stat.label}
                      </Text>
                      <Heading variant="display-strong-l">
                        {stat.value}
                      </Heading>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        {stat.description}
                      </Text>
                    </Column>
                  </Column>
                </SafeCard>
              ))}
            </Grid>
          </Column>
        </Column>

        {/* Features Section */}
        <Column fillWidth paddingY="xl">
          <Column maxWidth="xl" paddingX="l" gap="xl">
            
            <Column gap="l" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <SafeBadge style={{
                background: "var(--accent-background-alpha-medium)",
                color: "var(--accent-text-strong)",
                margin: "0 auto"
              }}>
                Platform Capabilities
              </SafeBadge>
              
              <Column gap="m">
                <Heading variant="display-strong-xl">
                  Everything You Need for Conference Excellence
                </Heading>
                <Text
                  variant="heading-default-l"
                  onBackground="neutral-weak"
                  style={{ maxWidth: "42rem", margin: "0 auto" }}
                >
                  Manage operations efficiently and effectively with our comprehensive suite 
                  of tools designed specifically for Big 12 Conference operations.
                </Text>
              </Column>
            </Column>
            
            <Grid columns="3" mobileColumns="1" tabletColumns="2" gap="l">
              {featuredCapabilities.map((feature, index) => (
                <SafeCard key={index} padding="l" hover border="neutral-medium">
                  <Column gap="l">
                    <Row gap="m" style={{ alignItems: "center" }}>
                      <Column 
                        style={{
                          background: "var(--brand-background-alpha-medium)",
                          padding: "8px",
                          borderRadius: "8px",
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <feature.icon size={20} />
                      </Column>
                      <Column gap="xs" style={{ flex: 1 }}>
                        <Heading variant="heading-strong-m">{feature.title}</Heading>
                        {feature.badge && (
                          <SafeBadge style={{
                            background: "var(--brand-background-alpha-medium)",
                            color: "var(--brand-text-strong)",
                            fontSize: "12px"
                          }}>
                            {feature.badge}
                          </SafeBadge>
                        )}
                      </Column>
                    </Row>
                    
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      {feature.description}
                    </Text>
                    
                    <Link href={feature.url}>
                      <Button 
                        variant="secondary" 
                        size="m" 
                        fillWidth 
                        suffixIcon="chevronRight"
                      >
                        Explore
                      </Button>
                    </Link>
                  </Column>
                </SafeCard>
              ))}
            </Grid>
          </Column>
        </Column>

        {/* Call-to-Action Section */}
        <Column fillWidth paddingY="xl" background="brand-alpha-weak">
          <Column maxWidth="xl" paddingX="l" gap="xl">
            <Card 
              padding="xl" 
              style={{
                background: "linear-gradient(135deg, var(--brand-background-alpha-medium) 0%, var(--accent-background-alpha-medium) 100%)",
                border: "1px solid var(--brand-border-alpha-strong)"
              }}
            >
              <Row gap="l" style={{ alignItems: "center", flexWrap: "wrap" }}>
                <Column 
                  style={{
                    background: "var(--brand-background-alpha-strong)",
                    padding: "16px",
                    borderRadius: "16px",
                    width: "64px",
                    height: "64px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Brain size={32} />
                </Column>
                
                <Column gap="l" style={{ flex: 1, minWidth: "280px" }}>
                  <Column gap="m">
                    <Heading variant="display-strong-l" onBackground="brand-strong">
                      Ready to Transform Your Operations?
                    </Heading>
                    <Text variant="body-default-l" onBackground="brand-medium">
                      Join the future of conference management with AI-powered insights, 
                      real-time analytics, and streamlined workflows designed for the Big 12.
                    </Text>
                  </Column>
                  
                  <Row gap="m" style={{ flexWrap: "wrap" }}>
                    <Link href="/dashboard">
                      <Button variant="primary" size="l" suffixIcon="arrowRight">
                        Get Started Now
                      </Button>
                    </Link>
                    <Link href="/ai-assistant">
                      <Button variant="tertiary" size="l" prefixIcon="brain">
                        Try AI Assistant
                      </Button>
                    </Link>
                  </Row>
                </Column>
              </Row>
            </Card>
          </Column>
        </Column>

        {/* Footer */}
        <Column 
          fillWidth 
          paddingY="l" 
          background="surface"
          style={{ borderTop: "1px solid var(--neutral-border-medium)" }}
        >
          <Column maxWidth="xl" paddingX="l">
            <Row style={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
              <Row gap="m" style={{ alignItems: "center" }}>
                <Image
                  src="/assets/logos/HELiiX/HELiiX-Blk.svg"
                  alt="HELiiX"
                  width={40}
                  height={40}
                  style={{ height: "40px", width: "auto" }}
                />
                <Column gap="2">
                  <Heading variant="heading-strong-m">HELiiX</Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Big 12 Operations Platform
                  </Text>
                </Column>
              </Row>
              
              <Column gap="2" style={{ textAlign: "right" }}>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  © 2025 Big 12 Conference. All rights reserved.
                </Text>
                <Row gap="s" style={{ alignItems: "center", justifyContent: "flex-end" }}>
                  <StatusIndicator color="green" />
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    System Status: Operational
                  </Text>
                </Row>
              </Column>
            </Row>
          </Column>
        </Column>

      </Column>
    </Background>
  )
}