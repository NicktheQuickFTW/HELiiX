'use client';

import { useState, useEffect } from 'react';
import { 
  Column, Row, Grid, Card, Button, Heading, Text,
  Background, Icon, Badge, StatusIndicator, Dropdown,
  Option, MegaMenu, User, ToggleButton, AutoScroll,
  Fade, HeadingLink, MediaUpload, ToastProvider, Toast
} from "@once-ui-system/core";
import { BorderBeamEffect } from '@/components/ui/border-beam-effect';
import { ThreeDCard } from '@/components/ui/3d-card';
import { Meteors } from '@/components/ui/meteors';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { DivineButton } from '@/components/ui/divine-button';
import { DivineCard } from '@/components/ui/divine-card';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, Award, Calendar, TrendingUp, 
  Package, Users, Sparkles, Zap, Target,
  BarChart3, Activity, Crown, Medal, Shield
} from 'lucide-react';

// Glitch effect component for live counters
const GlitchCounter = ({ value, label }: { value: number; label: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayValue(prev => {
        if (prev < value) return prev + Math.ceil((value - prev) / 10);
        return value;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-[#F0B90A] to-[#9B59B6] opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
      <div className="relative">
        <Text 
          variant="display-medium-strong" 
          className="bg-gradient-to-r from-[#F0B90A] via-[#E91E8C] to-[#9B59B6] text-transparent bg-clip-text glitch-text"
        >
          {displayValue.toLocaleString()}
        </Text>
        <Text variant="body-default-s" onBackground="neutral-weak">{label}</Text>
      </div>
    </div>
  );
};

// 3D Award Visualization Component
const AwardVisualization = ({ award }: { award: any }) => {
  return (
    <ThreeDCard className="w-full h-full">
      <div className="relative p-6 bg-gradient-to-br from-surface-background via-surface-elevated to-surface-background rounded-xl">
        <BorderBeamEffect size={300} duration={10} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#F0B90A] to-[#9B59B6] blur-3xl opacity-50" />
            <Trophy className="w-24 h-24 text-[#F0B90A] relative z-10" />
          </motion.div>
          <Heading variant="title-strong">{award.name}</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            {award.category}
          </Text>
          <Badge variant="success">{award.count} Available</Badge>
        </div>
      </div>
    </ThreeDCard>
  );
};

// Award Category Card with Visual Hierarchy
const CategoryCard = ({ category, index }: { category: any; index: number }) => {
  const icons = [Trophy, Star, Award, Medal, Crown, Shield];
  const Icon = icons[index % icons.length];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <DivineCard className="relative overflow-hidden group cursor-pointer">
        <Meteors number={5} />
        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-[#F0B90A]/20 to-[#9B59B6]/20">
              <Icon className="w-6 h-6 text-[#F0B90A]" />
            </div>
            <Badge variant="neutral">{category.count}</Badge>
          </div>
          <Heading variant="heading-strong" className="mb-2">
            {category.name}
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            {category.description}
          </Text>
          <div className="mt-4 pt-4 border-t border-surface-elevated">
            <div className="flex items-center justify-between">
              <Text variant="body-default-xs" onBackground="neutral-weak">
                Budget Used
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-strong">
                {category.budgetUsed}%
              </Text>
            </div>
            <div className="mt-2 h-2 bg-surface-elevated rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#F0B90A] to-[#9B59B6]"
                initial={{ width: 0 }}
                animate={{ width: `${category.budgetUsed}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
              />
            </div>
          </div>
        </div>
      </DivineCard>
    </motion.div>
  );
};

// AI Recommendations Section
const AIRecommendations = () => {
  const recommendations = [
    { 
      title: "Championship Rings", 
      reason: "Basketball championship winners need recognition",
      priority: "high",
      savings: "$2,450"
    },
    { 
      title: "Academic Excellence Awards", 
      reason: "Q4 academic honors approaching",
      priority: "medium",
      savings: "$1,200"
    },
    { 
      title: "Coach Recognition Plaques", 
      reason: "End of season awards ceremony",
      priority: "medium",
      savings: "$850"
    }
  ];

  return (
    <DivineCard className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E91E8C]/20 to-transparent blur-3xl" />
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-[#E91E8C]" />
          <Heading variant="heading-strong">AI Recommendations</Heading>
        </div>
        <Column gap="m">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-surface-elevated rounded-lg border border-surface-elevated hover:border-[#E91E8C]/50 transition-all"
            >
              <Row justifyContent="space-between" alignItems="start">
                <Column gap="xs" className="flex-1">
                  <Text variant="body-strong">{rec.title}</Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {rec.reason}
                  </Text>
                </Column>
                <Column gap="xs" alignItems="end">
                  <Badge variant={rec.priority === 'high' ? 'danger' : 'warning'}>
                    {rec.priority}
                  </Badge>
                  <Text variant="body-default-xs" className="text-[#00D4AA]">
                    Save {rec.savings}
                  </Text>
                </Column>
              </Row>
            </motion.div>
          ))}
        </Column>
      </div>
    </DivineCard>
  );
};

// Distribution Timeline Component
const DistributionTimeline = () => {
  const events = [
    { date: 'Dec 15', event: 'Football Championship Awards', status: 'completed' },
    { date: 'Dec 20', event: 'Basketball Tournament Prep', status: 'in-progress' },
    { date: 'Jan 5', event: 'Academic Excellence Awards', status: 'upcoming' },
    { date: 'Jan 15', event: 'Winter Sports Recognition', status: 'upcoming' },
  ];

  return (
    <DivineCard>
      <div className="p-6">
        <Heading variant="heading-strong" className="mb-6">Distribution Timeline</Heading>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-surface-elevated" />
          <Column gap="l">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center relative z-10
                  ${event.status === 'completed' ? 'bg-[#00D4AA]' : 
                    event.status === 'in-progress' ? 'bg-[#F0B90A]' : 'bg-surface-elevated'}
                `}>
                  {event.status === 'completed' && <span className="text-white text-xs">✓</span>}
                  {event.status === 'in-progress' && (
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
                <Column gap="xs" className="flex-1">
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {event.date}
                  </Text>
                  <Text variant="body-strong">{event.event}</Text>
                </Column>
              </motion.div>
            ))}
          </Column>
        </div>
      </div>
    </DivineCard>
  );
};

// Recent Activity Feed
const RecentActivity = () => {
  const activities = [
    { action: 'Ordered', item: '50 Championship Rings', user: 'Scott D.', time: '2 hours ago' },
    { action: 'Distributed', item: '25 MVP Trophies', user: 'Brian L.', time: '5 hours ago' },
    { action: 'Approved', item: 'Academic Awards Budget', user: 'Nicole K.', time: '1 day ago' },
    { action: 'Received', item: '100 Participation Medals', user: 'Anna M.', time: '2 days ago' },
  ];

  return (
    <DivineCard>
      <div className="p-6">
        <Row justifyContent="space-between" alignItems="center" className="mb-6">
          <Heading variant="heading-strong">Recent Activity</Heading>
          <Activity className="w-5 h-5 text-[#E91E8C]" />
        </Row>
        <Column gap="m">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-elevated transition-colors"
            >
              <Row gap="m" alignItems="center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F0B90A] to-[#9B59B6] flex items-center justify-center text-white text-xs font-bold">
                  {activity.user.charAt(0)}
                </div>
                <Column gap="xs">
                  <Text variant="body-default-s">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-onBackground-neutral-weak">{activity.action.toLowerCase()}</span>{' '}
                    <span className="font-medium">{activity.item}</span>
                  </Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {activity.time}
                  </Text>
                </Column>
              </Row>
            </motion.div>
          ))}
        </Column>
      </div>
    </DivineCard>
  );
};

export default function AwardsPageNew() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock data
  const stats = {
    totalAwards: 2847,
    distributed: 1523,
    pending: 324,
    budget: 85
  };

  const categories = [
    { name: 'Championship Awards', count: 450, description: 'Rings, trophies, and medals', budgetUsed: 78 },
    { name: 'Academic Excellence', count: 320, description: 'Scholar athlete recognition', budgetUsed: 65 },
    { name: 'MVP & All-Conference', count: 280, description: 'Individual performance awards', budgetUsed: 82 },
    { name: 'Coach Recognition', count: 150, description: 'Leadership and achievement', budgetUsed: 45 },
    { name: 'Team Accomplishments', count: 520, description: 'Collective success awards', budgetUsed: 71 },
    { name: 'Special Recognition', count: 180, description: 'Community and service awards', budgetUsed: 55 },
  ];

  const featuredAwards = [
    { name: 'Championship Ring', category: 'Football', count: 125 },
    { name: 'MVP Trophy', category: 'Basketball', count: 48 },
    { name: 'Academic Excellence Medal', category: 'All Sports', count: 200 },
  ];

  return (
    <Background className="min-h-screen">
      <Column gap="xl" padding="xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#F0B90A]/10 via-[#E91E8C]/10 to-[#9B59B6]/10 blur-3xl" />
          <Row justifyContent="space-between" alignItems="center" className="relative z-10">
            <Column gap="s">
              <Heading variant="display-strong">Awards Management</Heading>
              <Text variant="body-default-m" onBackground="neutral-weak">
                Manage and distribute Big 12 Conference awards with style
              </Text>
            </Column>
            <Row gap="m">
              <ShimmerButton>
                <Package className="w-4 h-4 mr-2" />
                New Order
              </ShimmerButton>
              <DivineButton variant="secondary">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </DivineButton>
            </Row>
          </Row>
        </motion.div>

        {/* Stats Grid */}
        <Grid columns="repeat(auto-fit, minmax(200px, 1fr))" gap="l">
          <DivineCard>
            <div className="p-6 relative">
              <Meteors number={3} />
              <GlitchCounter value={stats.totalAwards} label="Total Awards" />
            </div>
          </DivineCard>
          <DivineCard>
            <div className="p-6 relative">
              <Meteors number={3} />
              <GlitchCounter value={stats.distributed} label="Distributed" />
            </div>
          </DivineCard>
          <DivineCard>
            <div className="p-6 relative">
              <Meteors number={3} />
              <GlitchCounter value={stats.pending} label="Pending Orders" />
            </div>
          </DivineCard>
          <DivineCard>
            <div className="p-6 relative">
              <Meteors number={3} />
              <div className="relative">
                <Text variant="display-medium-strong" className="bg-gradient-to-r from-[#00D4AA] to-[#00D4AA]/60 text-transparent bg-clip-text">
                  {stats.budget}%
                </Text>
                <Text variant="body-default-s" onBackground="neutral-weak">Budget Utilized</Text>
              </div>
            </div>
          </DivineCard>
        </Grid>

        {/* Featured Awards Section */}
        <Column gap="l">
          <Row justifyContent="space-between" alignItems="center">
            <Heading variant="heading-strong">Featured Awards</Heading>
            <Badge variant="success">Live Inventory</Badge>
          </Row>
          <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="l">
            {featuredAwards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <AwardVisualization award={award} />
              </motion.div>
            ))}
          </Grid>
        </Column>

        {/* Main Content Grid */}
        <Grid columns="3fr 1fr" gap="l" className="items-start">
          <Column gap="l">
            {/* Categories Grid */}
            <Column gap="l">
              <Row justifyContent="space-between" alignItems="center">
                <Heading variant="heading-strong">Award Categories</Heading>
                <Dropdown value={selectedCategory} onValueChange={setSelectedCategory}>
                  <Option value="all">All Categories</Option>
                  <Option value="championship">Championship</Option>
                  <Option value="academic">Academic</Option>
                  <Option value="mvp">MVP Awards</Option>
                </Dropdown>
              </Row>
              <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="l">
                {categories.map((category, index) => (
                  <CategoryCard key={index} category={category} index={index} />
                ))}
              </Grid>
            </Column>

            {/* Distribution Timeline */}
            <DistributionTimeline />
          </Column>

          <Column gap="l">
            {/* AI Recommendations */}
            <AIRecommendations />
            
            {/* Recent Activity */}
            <RecentActivity />
          </Column>
        </Grid>
      </Column>
    </Background>
  );
}