"use client";

import React, { useState, useEffect } from "react";
import {
  Column,
  Row,
  Grid,
  Card,
  Button,
  Heading,
  Text,
  Badge,
  StatusIndicator,
  Icon,
  Background,
  Flex,
  LineChart,
  BarChart,
  Tag,
  Chip,
  SegmentedControl,
  Avatar,
  AvatarGroup,
  ProgressBar,
  Skeleton,
  Line,
  Select,
  Option,
  Scroller,
  Tooltip
} from "@once-ui-system/core";
import { RevealFx, GlitchFx, HoloFx, TiltFx } from "@/components/effects";
import { BorderBeam } from "@/components/ui/Concepts/border-beam";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Meteors } from "@/components/ui/meteors";

// Futuristic gradients
const gradients = {
  primary: "linear-gradient(135deg, var(--brand-electric-500) 0%, var(--brand-purple-600) 50%, var(--brand-midnight-800) 100%)",
  data: "linear-gradient(135deg, #00D9FF 0%, #0099FF 50%, #0066CC 100%)",
  success: "linear-gradient(135deg, #00FF88 0%, #00CC66 50%, #009944 100%)",
  chart: "linear-gradient(180deg, rgba(var(--brand-electric-500-rgb), 0.2) 0%, transparent 100%)",
  mesh: "radial-gradient(at 40% 20%, var(--brand-electric-500) 0px, transparent 50%), radial-gradient(at 80% 0%, var(--brand-midnight-600) 0px, transparent 50%)",
};

// Analytics metric card with live updates
const MetricCard: React.FC<{
  title: string;
  value: number;
  unit: string;
  change: number;
  icon: string;
  color: string;
  live?: boolean;
}> = ({ title, value, unit, change, icon, color, live }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    if (live) {
      const interval = setInterval(() => {
        const fluctuation = Math.random() * 10 - 5;
        const newValue = Math.max(0, value + fluctuation);
        setCurrentValue(newValue);
        setPulseAnimation(true);
        setTimeout(() => setPulseAnimation(false), 500);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [live, value]);

  return (
    <TiltFx>
      <Card
        radius="l"
        padding="l"
        style={{
          background: "rgba(var(--background-primary-rgb), 0.8)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${color}30`,
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s ease",
        }}
      >
        <Column gap="m" fillWidth>
          <Row horizontal="space-between" vertical="center">
            <HoloFx shine={{ opacity: 40 }}>
              <Flex
                alignItems="center"
                justifyContent="center"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-m)",
                  background: `${color}20`,
                  animation: pulseAnimation ? "pulse 0.5s ease" : "none",
                }}
              >
                <Icon name={icon as any} size="m" style={{ color }} />
              </Flex>
            </HoloFx>
            {live && (
              <Flex gap="xs" alignItems="center">
                <StatusIndicator variant="success" size="s" />
                <Text variant="label-default-xs" onBackground="neutral-weak">LIVE</Text>
              </Flex>
            )}
          </Row>
          
          <Column gap="xs">
            <Text variant="label-default-s" onBackground="neutral-medium">{title}</Text>
            <Row alignItems="baseline" gap="xs">
              <GlitchFx trigger={live ? "custom" : "hover"} interval={5000} speed="fast">
                <Heading variant="display-strong-m" style={{ color }}>
                  {currentValue.toFixed(1)}
                </Heading>
              </GlitchFx>
              <Text variant="body-strong-s" onBackground="neutral-medium">{unit}</Text>
            </Row>
            <Row gap="xs" vertical="center">
              <Icon 
                name={change > 0 ? "trending-up" : "trending-down"} 
                size="xs" 
                style={{ color: change > 0 ? "var(--success)" : "var(--danger)" }}
              />
              <Text 
                variant="label-default-xs" 
                style={{ color: change > 0 ? "var(--success)" : "var(--danger)" }}
              >
                {Math.abs(change)}% from last period
              </Text>
            </Row>
          </Column>
        </Column>
      </Card>
    </TiltFx>
  );
};

// Real-time data stream visualization
const DataStreamVisualization: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints(prev => {
        const newPoints = [...prev.slice(1)];
        newPoints.push(Math.random() * 100);
        return newPoints;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", height: "100px", width: "100%" }}>
      <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="dataGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-electric-500)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--brand-electric-500)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d={`M 0 ${100 - dataPoints[0]} ${dataPoints.map((point, i) => `L ${(i + 1) * 20} ${100 - point}`).join(" ")} L 400 100 L 0 100 Z`}
          fill="url(#dataGradient)"
          stroke="var(--brand-electric-500)"
          strokeWidth="2"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          padding: "8px",
          background: "rgba(0,0,0,0.8)",
          borderRadius: "4px",
        }}
      >
        <Text variant="label-default-xs" style={{ color: "var(--success)" }}>
          {dataPoints[dataPoints.length - 1].toFixed(0)} MB/s
        </Text>
      </div>
    </div>
  );
};

export default function SpectacularAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("performance");
  const [dataRefreshRate, setDataRefreshRate] = useState(5);

  const metrics = [
    { title: "System Performance", value: 94.7, unit: "%", change: 5.2, icon: "activity", color: "var(--brand-electric-500)", live: true },
    { title: "User Engagement", value: 78.3, unit: "%", change: 12.8, icon: "users", color: "var(--brand-purple-500)", live: true },
    { title: "Data Processing", value: 2.34, unit: "TB", change: -3.1, icon: "database", color: "var(--info)", live: false },
    { title: "API Latency", value: 42.5, unit: "ms", change: -8.4, icon: "zap", color: "var(--success)", live: true },
  ];

  return (
    <Background
      style={{
        background: gradients.mesh,
        minHeight: "100vh",
      }}
    >
      <Column fillWidth gap="xl" padding="l">
        {/* Futuristic header */}
        <RevealFx speed="fast">
          <Card
            variant="secondary"
            radius="l"
            padding="l"
            style={{
              background: "rgba(var(--background-secondary-rgb), 0.6)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(var(--brand-electric-500-rgb), 0.3)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Meteors number={20} />
            
            <Row fillWidth horizontal="space-between" vertical="center" wrap>
              <Column gap="s">
                <Row gap="m" vertical="center">
                  <GlitchFx speed="medium" continuous>
                    <Heading variant="display-strong-xl">
                      ANALYTICS COMMAND CENTER
                    </Heading>
                  </GlitchFx>
                  <HoloFx shine={{ opacity: 60 }}>
                    <Badge variant="info" size="l">
                      <StatusIndicator variant="info" size="s" />
                      REAL-TIME DATA
                    </Badge>
                  </HoloFx>
                </Row>
                <Text variant="body-default-m" onBackground="neutral-medium">
                  Advanced analytics and insights for Big 12 Conference operations
                </Text>
              </Column>
              
              <Row gap="m">
                <SegmentedControl
                  buttons={[
                    { label: "24H", value: "24h" },
                    { label: "7D", value: "7d" },
                    { label: "30D", value: "30d" },
                    { label: "1Y", value: "1y" },
                  ]}
                  defaultValue="7d"
                  onToggle={setTimeRange}
                />
                <Button
                  variant="primary"
                  size="m"
                  prefixIcon="download"
                  style={{
                    background: gradients.primary,
                    border: "none",
                  }}
                >
                  Export Report
                </Button>
              </Row>
            </Row>
          </Card>
        </RevealFx>

        {/* Key metrics grid */}
        <Grid columns={{ base: 1, s: 2, l: 4 }} gap="m">
          {metrics.map((metric, index) => (
            <RevealFx key={index} speed="fast" delay={index * 0.1}>
              <MetricCard {...metric} />
            </RevealFx>
          ))}
        </Grid>

        {/* Data stream visualization */}
        <RevealFx speed="medium">
          <Card
            radius="l"
            padding="l"
            style={{
              background: "rgba(var(--background-primary-rgb), 0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(var(--brand-electric-500-rgb), 0.3)",
            }}
          >
            <Column gap="m">
              <Row horizontal="space-between" vertical="center">
                <Heading variant="heading-strong-l">Live Data Stream</Heading>
                <Row gap="s">
                  <Tag size="s" variant="success">
                    <StatusIndicator variant="success" size="xs" />
                    Connected
                  </Tag>
                  <Tag size="s" variant="neutral">
                    {dataRefreshRate}s refresh
                  </Tag>
                </Row>
              </Row>
              <DataStreamVisualization />
            </Column>
          </Card>
        </RevealFx>

        {/* Main analytics content */}
        <Grid columns={{ base: 1, l: 3 }} gap="l">
          {/* Performance Analytics - 2 columns */}
          <Column span={{ base: 1, l: 2 }}>
            <RevealFx speed="medium">
              <Card
                radius="l"
                padding="l"
                style={{
                  background: "rgba(var(--background-primary-rgb), 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(var(--brand-purple-500-rgb), 0.3)",
                  height: "100%",
                }}
              >
                <Column gap="l" fillWidth>
                  <Row horizontal="space-between" vertical="center">
                    <Column gap="xs">
                      <Heading variant="heading-strong-l">Performance Analytics</Heading>
                      <Text variant="body-default-s" onBackground="neutral-medium">
                        System performance metrics over time
                      </Text>
                    </Column>
                    <Row gap="s">
                      <Chip active={selectedMetric === "performance"} onClick={() => setSelectedMetric("performance")}>
                        Performance
                      </Chip>
                      <Chip active={selectedMetric === "usage"} onClick={() => setSelectedMetric("usage")}>
                        Usage
                      </Chip>
                      <Chip active={selectedMetric === "errors"} onClick={() => setSelectedMetric("errors")}>
                        Errors
                      </Chip>
                    </Row>
                  </Row>

                  <LineChart
                    minHeight={20}
                    axis="x"
                    legend={{
                      display: true,
                      position: "top",
                    }}
                    date={{
                      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      end: new Date(),
                      format: "MMM dd"
                    }}
                    series={[
                      { key: "CPU Usage", color: "var(--brand-electric-500)" },
                      { key: "Memory Usage", color: "var(--brand-purple-500)" },
                      { key: "Network I/O", color: "var(--success)" }
                    ]}
                    data={Array.from({ length: 7 }, (_, i) => ({
                      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
                      "CPU Usage": Math.random() * 30 + 60,
                      "Memory Usage": Math.random() * 25 + 55,
                      "Network I/O": Math.random() * 40 + 40,
                    }))}
                  />

                  {/* Insight cards */}
                  <Grid columns={2} gap="m">
                    <Card
                      padding="m"
                      radius="m"
                      style={{
                        background: gradients.data,
                        border: "none",
                      }}
                    >
                      <Column gap="s">
                        <Row gap="s" vertical="center">
                          <Icon name="zap" size="s" style={{ color: "white" }} />
                          <Text variant="body-strong-s" style={{ color: "white" }}>
                            Peak Performance
                          </Text>
                        </Row>
                        <Text variant="body-default-xs" style={{ color: "rgba(255,255,255,0.8)" }}>
                          System achieved 99.8% uptime this week, exceeding target by 2.3%
                        </Text>
                      </Column>
                    </Card>
                    
                    <Card
                      padding="m"
                      radius="m"
                      style={{
                        background: gradients.success,
                        border: "none",
                      }}
                    >
                      <Column gap="s">
                        <Row gap="s" vertical="center">
                          <Icon name="trending-up" size="s" style={{ color: "white" }} />
                          <Text variant="body-strong-s" style={{ color: "white" }}>
                            Efficiency Gain
                          </Text>
                        </Row>
                        <Text variant="body-default-xs" style={{ color: "rgba(255,255,255,0.8)" }}>
                          Resource optimization saved 23% in operational costs
                        </Text>
                      </Column>
                    </Card>
                  </Grid>
                </Column>
              </Card>
            </RevealFx>
          </Column>

          {/* Advanced Metrics - 1 column */}
          <Column>
            <RevealFx speed="medium" delay={0.1}>
              <Card
                radius="l"
                style={{
                  background: "rgba(var(--background-primary-rgb), 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(var(--brand-midnight-600-rgb), 0.3)",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                <Column fillHeight>
                  <Row horizontal="space-between" vertical="center" padding="l" paddingBottom="m">
                    <Heading variant="heading-strong-l">AI Insights</Heading>
                    <Button variant="ghost" size="s" prefixIcon="sparkles">
                      Generate
                    </Button>
                  </Row>
                  
                  <Column padding="l" paddingTop="0" gap="m">
                    {[
                      {
                        type: "prediction",
                        title: "Traffic Spike Expected",
                        description: "Basketball championship will increase load by 340%",
                        confidence: 94,
                        icon: "chart-bar",
                      },
                      {
                        type: "anomaly",
                        title: "Unusual Pattern Detected",
                        description: "Award processing showing 15% slower response",
                        confidence: 87,
                        icon: "alert-triangle",
                      },
                      {
                        type: "optimization",
                        title: "Resource Optimization",
                        description: "Reallocate 20% capacity to improve efficiency",
                        confidence: 91,
                        icon: "cpu",
                      },
                    ].map((insight, index) => (
                      <Card
                        key={index}
                        padding="m"
                        radius="m"
                        style={{
                          background: "rgba(var(--background-secondary-rgb), 0.4)",
                          border: "1px solid var(--border-medium)",
                        }}
                      >
                        <Column gap="s">
                          <Row horizontal="space-between" vertical="center">
                            <Row gap="s" vertical="center">
                              <Icon 
                                name={insight.icon as any} 
                                size="s" 
                                style={{ 
                                  color: insight.type === "anomaly" 
                                    ? "var(--warning)" 
                                    : "var(--brand-electric-500)" 
                                }}
                              />
                              <Text variant="body-strong-s">{insight.title}</Text>
                            </Row>
                            <Tag size="xs" variant="neutral">
                              {insight.confidence}% confidence
                            </Tag>
                          </Row>
                          <Text variant="body-default-xs" onBackground="neutral-medium">
                            {insight.description}
                          </Text>
                          <ProgressBar 
                            size="xs" 
                            value={insight.confidence} 
                            variant="info"
                          />
                        </Column>
                      </Card>
                    ))}
                  </Column>
                </Column>
              </Card>
            </RevealFx>
          </Column>
        </Grid>

        {/* Bottom section with team analytics */}
        <RevealFx speed="medium" delay={0.2}>
          <Card
            radius="l"
            padding="l"
            style={{
              background: "rgba(var(--background-primary-rgb), 0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(var(--brand-electric-500-rgb), 0.3)",
            }}
          >
            <Column gap="l">
              <Row horizontal="space-between" vertical="center">
                <Heading variant="heading-strong-l">Team Performance Matrix</Heading>
                <Select defaultValue="all">
                  <Option value="all">All Sports</Option>
                  <Option value="basketball">Basketball</Option>
                  <Option value="football">Football</Option>
                  <Option value="baseball">Baseball</Option>
                </Select>
              </Row>

              <Scroller hideScrollbar>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "8px" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "12px" }}>
                        <Text variant="label-default-s" onBackground="neutral-medium">Team</Text>
                      </th>
                      <th style={{ textAlign: "center", padding: "12px" }}>
                        <Text variant="label-default-s" onBackground="neutral-medium">Win Rate</Text>
                      </th>
                      <th style={{ textAlign: "center", padding: "12px" }}>
                        <Text variant="label-default-s" onBackground="neutral-medium">Attendance</Text>
                      </th>
                      <th style={{ textAlign: "center", padding: "12px" }}>
                        <Text variant="label-default-s" onBackground="neutral-medium">Revenue</Text>
                      </th>
                      <th style={{ textAlign: "center", padding: "12px" }}>
                        <Text variant="label-default-s" onBackground="neutral-medium">Engagement</Text>
                      </th>
                      <th style={{ textAlign: "center", padding: "12px" }}>
                        <Text variant="label-default-s" onBackground="neutral-medium">Trend</Text>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { team: "Kansas", winRate: 82, attendance: 94, revenue: 89, engagement: 91, trend: "up" },
                      { team: "Houston", winRate: 78, attendance: 88, revenue: 85, engagement: 87, trend: "up" },
                      { team: "Baylor", winRate: 75, attendance: 86, revenue: 82, engagement: 84, trend: "stable" },
                      { team: "Texas Tech", winRate: 71, attendance: 83, revenue: 79, engagement: 81, trend: "down" },
                    ].map((team, index) => (
                      <tr key={index}>
                        <td style={{ padding: "12px" }}>
                          <Text variant="body-strong-s">{team.team}</Text>
                        </td>
                        <td style={{ textAlign: "center", padding: "12px" }}>
                          <Badge variant={team.winRate > 75 ? "success" : "warning"}>
                            {team.winRate}%
                          </Badge>
                        </td>
                        <td style={{ textAlign: "center", padding: "12px" }}>
                          <ProgressBar size="xs" value={team.attendance} variant="info" />
                        </td>
                        <td style={{ textAlign: "center", padding: "12px" }}>
                          <ProgressBar size="xs" value={team.revenue} variant="success" />
                        </td>
                        <td style={{ textAlign: "center", padding: "12px" }}>
                          <ProgressBar size="xs" value={team.engagement} variant="warning" />
                        </td>
                        <td style={{ textAlign: "center", padding: "12px" }}>
                          <Icon 
                            name={team.trend === "up" ? "trending-up" : team.trend === "down" ? "trending-down" : "minus"}
                            size="s"
                            style={{ 
                              color: team.trend === "up" ? "var(--success)" : team.trend === "down" ? "var(--danger)" : "var(--neutral-medium)" 
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Scroller>
            </Column>
          </Card>
        </RevealFx>

        <style jsx>{`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}</style>
      </Column>
    </Background>
  );
}