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
  Scroller,
  Avatar,
  AvatarGroup,
  ProgressBar,
  Skeleton,
  Line,
  InteractiveDetails,
  Input,
  Select,
  Option
} from "@once-ui-system/core";
import { RevealFx, GlitchFx, HoloFx, TiltFx } from "@/components/effects";
import { BorderBeam } from "@/components/ui/Concepts/border-beam";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Meteors } from "@/components/ui/meteors";

// Premium gradients
const gradients = {
  primary: "linear-gradient(135deg, var(--brand-electric-500) 0%, var(--brand-purple-600) 50%, var(--brand-midnight-800) 100%)",
  gold: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
  silver: "linear-gradient(135deg, #C0C0C0 0%, #808080 50%, #696969 100%)",
  bronze: "linear-gradient(135deg, #CD7F32 0%, #B87333 50%, #A0522D 100%)",
  mesh: "radial-gradient(at 40% 20%, var(--brand-electric-500) 0px, transparent 50%), radial-gradient(at 80% 0%, var(--brand-midnight-600) 0px, transparent 50%)",
};

// Award categories with 3D icons
const awardCategories = [
  { id: "academic", name: "Academic Excellence", icon: "graduation-cap", color: gradients.gold, count: 1250 },
  { id: "athletic", name: "Athletic Achievement", icon: "trophy", color: gradients.silver, count: 890 },
  { id: "leadership", name: "Leadership Awards", icon: "users", color: gradients.bronze, count: 456 },
  { id: "special", name: "Special Recognition", icon: "star", color: gradients.primary, count: 234 },
  { id: "championship", name: "Championship Rings", icon: "medal", color: gradients.gold, count: 128 },
  { id: "service", name: "Service Awards", icon: "heart", color: gradients.primary, count: 342 },
];

// 3D Award Card Component
const Award3DCard: React.FC<{
  category: typeof awardCategories[0];
  selected: boolean;
  onSelect: () => void;
}> = ({ category, selected, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const [count, setCount] = useState(category.count);

  useEffect(() => {
    if (selected) {
      const interval = setInterval(() => {
        setCount(prev => prev + Math.floor(Math.random() * 5));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selected]);

  return (
    <TiltFx>
      <Card
        onClick={onSelect}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        radius="l"
        padding="xl"
        style={{
          background: selected 
            ? category.color 
            : "rgba(var(--background-primary-rgb), 0.8)",
          backdropFilter: "blur(20px)",
          border: selected 
            ? "2px solid var(--brand-electric-500)" 
            : "1px solid rgba(var(--border-medium-rgb), 0.3)",
          cursor: "pointer",
          transform: hovered ? "translateZ(20px)" : "translateZ(0)",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          minHeight: "200px",
        }}
      >
        {selected && <AnimatedBeam />}
        
        <Column gap="l" alignItems="center" justifyContent="center" style={{ height: "100%" }}>
          <HoloFx 
            shine={{ opacity: hovered ? 60 : 30 }}
            burn={{ opacity: 20 }}
          >
            <Flex
              alignItems="center"
              justifyContent="center"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: selected ? "rgba(255,255,255,0.2)" : category.color,
                boxShadow: hovered ? `0 0 40px ${category.color}` : "none",
              }}
            >
              <Icon 
                name={category.icon as any} 
                size="xl" 
                style={{ 
                  color: selected ? "white" : "var(--background-primary)",
                  filter: hovered ? "drop-shadow(0 0 10px currentColor)" : "none",
                }}
              />
            </Flex>
          </HoloFx>
          
          <Column gap="xs" alignItems="center">
            <Heading variant="heading-strong-m" style={{ color: selected ? "white" : "inherit" }}>
              {category.name}
            </Heading>
            <GlitchFx trigger={selected ? "custom" : "hover"} interval={3000} speed="fast">
              <Heading 
                variant="display-strong-m" 
                style={{ 
                  color: selected ? "white" : "var(--brand-electric-500)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {count.toLocaleString()}
              </Heading>
            </GlitchFx>
            <Text variant="label-default-s" style={{ color: selected ? "rgba(255,255,255,0.8)" : "var(--text-tertiary)" }}>
              Total Awards
            </Text>
          </Column>
        </Column>
      </Card>
    </TiltFx>
  );
};

// Recent award activity item
const AwardActivityItem: React.FC<{
  recipient: string;
  award: string;
  school: string;
  timestamp: string;
  type: "gold" | "silver" | "bronze";
}> = ({ recipient, award, school, timestamp, type }) => {
  const typeColors = {
    gold: gradients.gold,
    silver: gradients.silver,
    bronze: gradients.bronze,
  };

  return (
    <Card
      background="transparent"
      border="transparent"
      radius="m"
      padding="m"
      style={{
        transition: "all 0.2s ease",
        "&:hover": {
          background: "rgba(var(--brand-electric-500-rgb), 0.05)",
        }
      }}
    >
      <Row gap="m" vertical="center">
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: typeColors[type],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name="trophy" size="s" style={{ color: "white" }} />
        </div>
        
        <Column flex={1} gap="xs">
          <Text variant="body-strong-s">{recipient}</Text>
          <Row gap="s" wrap>
            <Text variant="body-default-xs" onBackground="neutral-medium">{award}</Text>
            <Text variant="body-default-xs" onBackground="neutral-medium">•</Text>
            <Text variant="body-default-xs" onBackground="neutral-medium">{school}</Text>
          </Row>
        </Column>
        
        <Text variant="label-default-xs" onBackground="neutral-weak">{timestamp}</Text>
      </Row>
    </Card>
  );
};

export default function SpectacularAwardsShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("academic");
  const [viewMode, setViewMode] = useState("inventory");
  const [totalAwards, setTotalAwards] = useState(3300);

  // Simulate live total updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalAwards(prev => prev + Math.floor(Math.random() * 10));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const recentActivity = [
    { recipient: "Sarah Johnson", award: "Academic All-American", school: "Kansas", timestamp: "2 min ago", type: "gold" as const },
    { recipient: "Mike Williams", award: "Championship MVP", school: "Houston", timestamp: "15 min ago", type: "gold" as const },
    { recipient: "Emma Davis", award: "Leadership Excellence", school: "Baylor", timestamp: "1 hour ago", type: "silver" as const },
    { recipient: "James Chen", award: "Community Service", school: "Texas Tech", timestamp: "2 hours ago", type: "bronze" as const },
    { recipient: "Lisa Martinez", award: "Scholar Athlete", school: "TCU", timestamp: "3 hours ago", type: "silver" as const },
  ];

  return (
    <Background
      style={{
        background: gradients.mesh,
        minHeight: "100vh",
      }}
    >
      <Column fillWidth gap="xl" padding="l">
        {/* Epic header with meteors */}
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
            <Meteors number={15} />
            
            <Row fillWidth horizontal="space-between" vertical="center" wrap>
              <Column gap="s">
                <Row gap="m" vertical="center">
                  <GlitchFx speed="slow" continuous>
                    <Heading variant="display-strong-xl">
                      AWARDS EXCELLENCE CENTER
                    </Heading>
                  </GlitchFx>
                  <HoloFx shine={{ opacity: 60 }}>
                    <Badge variant="warning" size="l">
                      <Icon name="trophy" size="s" />
                      {totalAwards.toLocaleString()} TOTAL AWARDS
                    </Badge>
                  </HoloFx>
                </Row>
                <Text variant="body-default-m" onBackground="neutral-medium">
                  Celebrating excellence across all Big 12 Conference member institutions
                </Text>
              </Column>
              
              <Row gap="m">
                <SegmentedControl
                  buttons={[
                    { label: "Inventory", value: "inventory" },
                    { label: "Distribution", value: "distribution" },
                    { label: "Analytics", value: "analytics" },
                  ]}
                  defaultValue="inventory"
                  onToggle={setViewMode}
                />
                <Button
                  variant="primary"
                  size="m"
                  prefixIcon="plus"
                  style={{
                    background: gradients.primary,
                    border: "none",
                  }}
                >
                  Create Award
                </Button>
              </Row>
            </Row>
          </Card>
        </RevealFx>

        {/* 3D Award Categories Grid */}
        <Column gap="l">
          <RevealFx speed="medium">
            <Row horizontal="space-between" vertical="center">
              <Heading variant="heading-strong-l">Award Categories</Heading>
              <Row gap="s">
                <Chip active>All Time</Chip>
                <Chip>This Year</Chip>
                <Chip>This Month</Chip>
              </Row>
            </Row>
          </RevealFx>

          <Grid columns={{ base: 1, s: 2, l: 3 }} gap="l">
            {awardCategories.map((category, index) => (
              <RevealFx key={category.id} speed="fast" delay={index * 0.1}>
                <Award3DCard
                  category={category}
                  selected={selectedCategory === category.id}
                  onSelect={() => setSelectedCategory(category.id)}
                />
              </RevealFx>
            ))}
          </Grid>
        </Column>

        {/* Main content area */}
        <Grid columns={{ base: 1, l: 3 }} gap="l">
          {/* Distribution Timeline - 2 columns */}
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
                      <Heading variant="heading-strong-l">Award Distribution</Heading>
                      <Text variant="body-default-s" onBackground="neutral-medium">
                        Monthly distribution across all categories
                      </Text>
                    </Column>
                    <Select defaultValue="2025">
                      <Option value="2025">2025</Option>
                      <Option value="2024">2024</Option>
                      <Option value="2023">2023</Option>
                    </Select>
                  </Row>

                  <BarChart
                    minHeight={20}
                    axis="y"
                    legend={{
                      display: true,
                      position: "top",
                    }}
                    categories={[
                      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ]}
                    series={[
                      { key: "Academic", color: "var(--warning)" },
                      { key: "Athletic", color: "var(--brand-electric-500)" },
                      { key: "Leadership", color: "var(--brand-purple-500)" },
                    ]}
                    data={[
                      { month: "Jan", Academic: 120, Athletic: 80, Leadership: 40 },
                      { month: "Feb", Academic: 150, Athletic: 90, Leadership: 50 },
                      { month: "Mar", Academic: 180, Athletic: 120, Leadership: 60 },
                      { month: "Apr", Academic: 200, Athletic: 150, Leadership: 80 },
                      { month: "May", Academic: 250, Athletic: 180, Leadership: 100 },
                      { month: "Jun", Academic: 220, Athletic: 160, Leadership: 90 },
                    ]}
                  />

                  {/* Quick stats */}
                  <Grid columns={4} gap="m">
                    {[
                      { label: "This Month", value: "342", change: "+12%", positive: true },
                      { label: "Pending", value: "28", change: "-5", positive: false },
                      { label: "Processing", value: "156", change: "+23", positive: true },
                      { label: "Delivered", value: "2,847", change: "+18%", positive: true },
                    ].map((stat, index) => (
                      <Card
                        key={index}
                        padding="m"
                        radius="m"
                        style={{
                          background: "rgba(var(--background-secondary-rgb), 0.4)",
                          border: "1px solid var(--border-medium)",
                        }}
                      >
                        <Column gap="xs">
                          <Text variant="label-default-xs" onBackground="neutral-medium">
                            {stat.label}
                          </Text>
                          <Row horizontal="space-between" vertical="center">
                            <Heading variant="heading-strong-m">{stat.value}</Heading>
                            <Tag
                              size="xs"
                              variant={stat.positive ? "success" : "danger"}
                            >
                              {stat.change}
                            </Tag>
                          </Row>
                        </Column>
                      </Card>
                    ))}
                  </Grid>
                </Column>
              </Card>
            </RevealFx>
          </Column>

          {/* Recent Activity - 1 column */}
          <Column>
            <RevealFx speed="medium" delay={0.1}>
              <Card
                radius="l"
                style={{
                  background: "rgba(var(--background-primary-rgb), 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(var(--brand-electric-500-rgb), 0.3)",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                <Column fillHeight>
                  <Row horizontal="space-between" vertical="center" padding="l" paddingBottom="m">
                    <Heading variant="heading-strong-l">Recent Awards</Heading>
                    <Button variant="ghost" size="s" suffixIcon="chevronRight">
                      View All
                    </Button>
                  </Row>
                  
                  <Column>
                    {recentActivity.map((activity, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <Line />}
                        <AwardActivityItem {...activity} />
                      </React.Fragment>
                    ))}
                  </Column>
                </Column>
              </Card>
            </RevealFx>
          </Column>
        </Grid>

        {/* AI Recommendations Section */}
        <RevealFx speed="medium" delay={0.2}>
          <Card
            radius="l"
            padding="l"
            style={{
              background: gradients.primary,
              border: "none",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <BorderBeam />
            
            <Grid columns={{ base: 1, m: 2 }} gap="l" alignItems="center">
              <Column gap="m">
                <Row gap="m" vertical="center">
                  <HoloFx shine={{ opacity: 80 }}>
                    <Icon name="sparkles" size="xl" style={{ color: "white" }} />
                  </HoloFx>
                  <Column gap="xs">
                    <GlitchFx trigger="hover" speed="fast">
                      <Heading variant="heading-strong-xl" style={{ color: "white" }}>
                        AI Award Intelligence
                      </Heading>
                    </GlitchFx>
                    <Text variant="body-default-m" style={{ color: "rgba(255,255,255,0.8)" }}>
                      Aura AI has identified 47 students eligible for awards based on recent achievements
                    </Text>
                  </Column>
                </Row>
              </Column>
              
              <Row gap="m" justifyContent="flex-end">
                <Button
                  variant="secondary"
                  size="m"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                  }}
                >
                  View Recommendations
                </Button>
                <Button
                  variant="primary"
                  size="m"
                  suffixIcon="arrowRight"
                  style={{
                    background: "white",
                    color: "var(--brand-midnight-800)",
                  }}
                >
                  Auto-Generate Awards
                </Button>
              </Row>
            </Grid>
          </Card>
        </RevealFx>
      </Column>
    </Background>
  );
}