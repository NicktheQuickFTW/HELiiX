"use client";

import React from 'react';
import {
  Heading,
  Text,
  Button,
  Column,
  Row,
  Grid,
  Card,
  Badge,
  StatusIndicator,
  Icon,
  Background
} from "@once-ui-system/core";

const stats = [
  {
    title: "Total Revenue",
    value: "$12.5M",
    change: "+15.2%",
    status: "positive"
  },
  {
    title: "Active Events",
    value: "24",
    change: "+4",
    status: "positive"
  },
  {
    title: "Schools",
    value: "16",
    change: "0",
    status: "neutral"
  },
  {
    title: "Operations",
    value: "142",
    change: "+12",
    status: "positive"
  }
];

export default function DashboardPage() {
  return (
    <Background background="page" fillWidth>
      <Column fillWidth padding="l" gap="l" maxWidth="xl" style={{ margin: "0 auto" }}>
      {/* Header */}
      <Row fillWidth justify="space-between" align="center">
        <Column gap="xs">
          <Heading variant="heading-strong-xl">
            Big 12 Operations Dashboard
          </Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Overview of conference operations and metrics
          </Text>
        </Column>
        <Button variant="primary" size="m">
          Generate Report
        </Button>
      </Row>

      {/* Stats Grid */}
      <Grid columns="1" tabletColumns="2" desktopColumns="4" gap="m">
        {stats.map((stat, index) => (
          <Card key={index} padding="l" background="surface">
            <Column gap="s">
              <Text variant="body-default-s" onBackground="neutral-weak">
                {stat.title}
              </Text>
              <Row align="center" gap="s">
                <Heading variant="heading-strong-xl">
                  {stat.value}
                </Heading>
                <Badge 
                  variant={stat.status === "positive" ? "success" : stat.status === "negative" ? "danger" : "neutral"}
                  size="s"
                >
                  {stat.change}
                </Badge>
              </Row>
            </Column>
          </Card>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid columns="1" desktopColumns="3" gap="l">
        {/* Left Column - Recent Activity */}
        <Column span="2" gap="l">
          <Card padding="l" background="surface">
            <Column gap="m">
              <Row justify="space-between" align="center">
                <Heading variant="heading-strong-l">
                  Recent Activity
                </Heading>
                <Button variant="tertiary" size="s">
                  View All
                </Button>
              </Row>
              
              <Column gap="s">
                {[
                  "Championship credentials updated for Basketball",
                  "New contact added: Arizona Athletics Director", 
                  "Travel arrangements finalized for Football",
                  "Awards inventory updated - 250 items added"
                ].map((activity, index) => (
                  <Row key={index} gap="m" align="center" padding="s">
                    <StatusIndicator size="s" variant="accent" />
                    <Text variant="body-default-s">
                      {activity}
                    </Text>
                  </Row>
                ))}
              </Column>
            </Column>
          </Card>
        </Column>

        {/* Right Column - Quick Actions */}
        <Column gap="l">
          <Card padding="l" background="surface">
            <Column gap="m">
              <Heading variant="heading-strong-l">
                Quick Actions
              </Heading>
              
              <Column gap="s">
                {[
                  { label: "Add Contact", href: "/contacts" },
                  { label: "Create Event", href: "/championships" },
                  { label: "View Analytics", href: "/analytics" },
                  { label: "Manage Awards", href: "/awards" }
                ].map((action, index) => (
                  <Button 
                    key={index}
                    variant="secondary" 
                    size="m" 
                    fillWidth
                    href={action.href}
                  >
                    {action.label}
                  </Button>
                ))}
              </Column>
            </Column>
          </Card>

          {/* Status Card */}
          <Card padding="l" background="surface">
            <Column gap="m">
              <Heading variant="heading-strong-l">
                System Status
              </Heading>
              
              <Column gap="s">
                {[
                  { service: "Database", status: "operational" },
                  { service: "API", status: "operational" },
                  { service: "Storage", status: "operational" },
                  { service: "Sync", status: "operational" }
                ].map((item, index) => (
                  <Row key={index} justify="space-between" align="center">
                    <Text variant="body-default-s">
                      {item.service}
                    </Text>
                    <Badge variant="success" size="s">
                      {item.status}
                    </Badge>
                  </Row>
                ))}
              </Column>
            </Column>
          </Card>
        </Column>
      </Grid>
    </Column>
    </Background>
  );
}