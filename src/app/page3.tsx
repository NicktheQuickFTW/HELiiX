'use client';

import {
  Column,
  Row,
  Grid,
  Card,
  Button,
  Heading,
  Text,
  Background,
  Icon,
  Badge,
  StatusIndicator,
  Scroller,
  Carousel,
  SmartImage,
  Line,
  Fade,
  InlineCode,
  Avatar,
  AvatarGroup,
  IconButton,
  Spinner,
  Tag,
} from '@once-ui-system/core';
import { useEffect, useState, useRef } from 'react';
import { Meta } from '@/components/modules';
import { baseURL, meta, effects } from '@/resources/once-ui.config';

// Import advanced effects from magic-docs
const GlitchFx = ({ children, ...props }: any) => (
  <span style={{ position: 'relative', display: 'inline-block' }} {...props}>
    {children}
  </span>
);

const HoloFx = ({ children, ...props }: any) => (
  <div style={{ position: 'relative', display: 'inline-block' }} {...props}>
    {children}
  </div>
);

const LetterFx = ({
  children,
  trigger = 'hover',
  speed = 'fast',
  ...props
}: any) => {
  const [text, setText] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger === 'instant' && !isAnimating) {
      animateText();
    }
  }, []);

  const animateText = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const originalText = children;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const iterations = 3;

    for (let i = 0; i < iterations; i++) {
      setText(
        originalText
          .split('')
          .map(() => chars[Math.floor(Math.random() * chars.length)])
          .join('')
      );
      await new Promise((r) => setTimeout(r, 50));
    }

    for (let i = 0; i < originalText.length; i++) {
      setText(
        originalText.slice(0, i + 1) +
          originalText
            .slice(i + 1)
            .split('')
            .map(() => chars[Math.floor(Math.random() * chars.length)])
            .join('')
      );
      await new Promise((r) => setTimeout(r, 30));
    }

    setText(originalText);
    setIsAnimating(false);
  };

  return (
    <span
      onMouseEnter={trigger === 'hover' ? animateText : undefined}
      style={{ fontFamily: 'monospace' }}
      {...props}
    >
      {text}
    </span>
  );
};

// Animated Counter Component
const AnimatedCounter = ({
  value,
  suffix = '',
}: {
  value: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
};

// Floating Orb Component
const FloatingOrb = ({ delay = 0 }: { delay?: number }) => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, var(--accent-solid-strong) 0%, transparent 70%)',
        opacity: 0.3,
        filter: 'blur(60px)',
        animation: `float ${20 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

// Live Sports Ticker
const SportsTicker = () => {
  const sports = [
    { name: 'Football', status: 'active', score: 'TCU 28 - KSU 21' },
    { name: 'Basketball', status: 'upcoming', time: '7:00 PM' },
    { name: 'Baseball', status: 'completed', score: 'OSU 5 - BU 3' },
    { name: 'Volleyball', status: 'active', score: 'ISU 2 - KU 1' },
    { name: 'Soccer', status: 'upcoming', time: '4:30 PM' },
  ];

  return (
    <Row
      fillWidth
      gap="12"
      style={{ overflowX: 'auto', scrollbarWidth: 'none' }}
    >
      {sports.map((sport, i) => (
        <Card
          key={i}
          padding="12"
          radius="m"
          style={{ minWidth: '200px', backdropFilter: 'blur(10px)' }}
        >
          <Row gap="8" alignItems="center">
            <StatusIndicator
              color={
                sport.status === 'active'
                  ? 'green'
                  : sport.status === 'upcoming'
                    ? 'yellow'
                    : 'neutral'
              }
            />
            <Column gap="4">
              <Text variant="label-default-s" onBackground="neutral-strong">
                {sport.name}
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {sport.score || sport.time}
              </Text>
            </Column>
          </Row>
        </Card>
      ))}
    </Row>
  );
};

// Team Showcase with 3D effect
const TeamShowcase = () => {
  const teams = [
    { name: 'Arizona', logo: '🏈', color: '#003366' },
    { name: 'Arizona State', logo: '🔱', color: '#8C1D40' },
    { name: 'Baylor', logo: '🐻', color: '#154734' },
    { name: 'BYU', logo: 'Y', color: '#002E5D' },
    { name: 'Cincinnati', logo: '🐾', color: '#E00122' },
    { name: 'Colorado', logo: '🦬', color: '#CFB87C' },
    { name: 'Houston', logo: '🐾', color: '#C8102E' },
    { name: 'Iowa State', logo: '🌪️', color: '#C8102E' },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Grid columns="4" mobileColumns="2" tabletColumns="3" gap="16">
      {teams.map((team, i) => (
        <Card
          key={i}
          padding="20"
          radius="l"
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            transform:
              hoveredIndex === i
                ? 'translateY(-10px) scale(1.05)'
                : 'translateY(0) scale(1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            background:
              hoveredIndex === i
                ? `linear-gradient(135deg, ${team.color}20 0%, transparent 100%)`
                : 'var(--neutral-background-weak)',
          }}
        >
          <Column gap="12" alignItems="center">
            <Text variant="display-strong-m" style={{ fontSize: '3rem' }}>
              {team.logo}
            </Text>
            <Text variant="label-default-s" align="center">
              {team.name}
            </Text>
          </Column>
        </Card>
      ))}
    </Grid>
  );
};

export default function SpectacularHomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(100px, -100px) rotate(90deg); }
        50% { transform: translate(-50px, -200px) rotate(180deg); }
        75% { transform: translate(-150px, -50px) rotate(270deg); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.8; }
      }
      
      @keyframes slideInFromLeft {
        0% { transform: translateX(-100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideInFromRight {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideInFromBottom {
        0% { transform: translateY(100%); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      
      .hero-title {
        background: linear-gradient(135deg, var(--brand-solid-strong) 0%, var(--accent-solid-strong) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
      }
      
      .glow-effect {
        text-shadow: 0 0 30px var(--accent-solid-strong), 0 0 60px var(--accent-solid-weak);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Hero Section with Advanced Effects */}
      <Background
        position="fixed"
        mask={effects.mask}
        gradient={effects.gradient}
        dots={effects.dots}
        lines={effects.lines}
      />

      <Column maxWidth="xl" fillWidth gap="xl" padding="32">
        {/* Floating Orbs */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <FloatingOrb delay={0} />
          <FloatingOrb delay={5} />
          <FloatingOrb delay={10} />
        </div>

        {/* Hero Content */}
        <Column
          fillWidth
          gap="xl"
          paddingY="80"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Fade duration="m" delay="s">
            <Column gap="20" alignItems="center">
              <Badge variant="neutral" size="s">
                <Row gap="8" alignItems="center">
                  <StatusIndicator color="green" />
                  <Text variant="label-default-xs">Live Platform</Text>
                </Row>
              </Badge>

              <Heading
                variant="display-strong-xl"
                align="center"
                className="hero-title glow-effect"
                style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1.1 }}
              >
                <LetterFx trigger="instant" speed="fast">
                  HELiiX
                </LetterFx>
              </Heading>

              <Text
                variant="display-default-m"
                align="center"
                onBackground="neutral-weak"
                style={{ maxWidth: '600px' }}
              >
                Next-Generation Operations Platform for{' '}
                <InlineCode>Big 12 Conference</InlineCode> Athletics
              </Text>

              <Row gap="16" style={{ marginTop: '32px' }}>
                <Button
                  size="l"
                  variant="primary"
                  href="/dashboard"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--brand-solid-strong) 0%, var(--accent-solid-strong) 100%)',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                >
                  Enter Command Center
                </Button>
                <Button size="l" variant="secondary" href="/overview">
                  Platform Overview
                </Button>
              </Row>
            </Column>
          </Fade>
        </Column>

        {/* Live Stats Section */}
        <Fade duration="l" delay="m">
          <Grid columns="4" mobileColumns="2" tabletColumns="2" gap="16">
            {[
              {
                label: 'Active Operations',
                value: 1247,
                icon: 'activity',
                color: 'accent',
              },
              {
                label: 'Teams Connected',
                value: 16,
                icon: 'users',
                color: 'brand',
              },
              {
                label: 'Awards Tracked',
                value: 8439,
                icon: 'award',
                color: 'green',
              },
              { label: 'Live Events', value: 23, icon: 'zap', color: 'yellow' },
            ].map((stat, i) => (
              <Card
                key={i}
                padding="24"
                radius="l"
                style={{
                  background: `linear-gradient(135deg, var(--${stat.color}-background-strong) 0%, transparent 100%)`,
                  border: '1px solid var(--neutral-border-weak)',
                  backdropFilter: 'blur(10px)',
                  animation: `slideInFromBottom 0.6s ease-out ${i * 0.1}s both`,
                }}
              >
                <Column gap="12">
                  <Icon name={stat.icon as any} size="m" />
                  <Heading variant="display-strong-l">
                    <AnimatedCounter value={stat.value} />
                  </Heading>
                  <Text variant="label-default-s" onBackground="neutral-weak">
                    {stat.label}
                  </Text>
                </Column>
              </Card>
            ))}
          </Grid>
        </Fade>

        {/* Sports Ticker */}
        <Fade duration="l" delay="l">
          <Column gap="16">
            <Row horizontal="space-between" alignItems="center">
              <Heading variant="display-default-m">
                <GlitchFx speed="slow">Live Sports Updates</GlitchFx>
              </Heading>
              <IconButton
                icon="refresh"
                size="s"
                tooltip="Refresh"
                variant="ghost"
              />
            </Row>
            <SportsTicker />
          </Column>
        </Fade>

        {/* Features Grid with Holographic Effects */}
        <Fade duration="xl" delay="l">
          <Column gap="24" paddingY="40">
            <Heading variant="display-default-l" align="center">
              Platform Capabilities
            </Heading>

            <Grid columns="3" mobileColumns="1" tabletColumns="2" gap="20">
              {[
                {
                  title: 'AI-Powered Analytics',
                  description:
                    'Advanced machine learning algorithms for predictive insights',
                  icon: 'sparkles',
                  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                },
                {
                  title: 'Real-Time Operations',
                  description:
                    'Live monitoring and management of all conference activities',
                  icon: 'activity',
                  gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                },
                {
                  title: 'Unified Dashboard',
                  description:
                    'Comprehensive view of all teams, events, and operations',
                  icon: 'grid',
                  gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                },
                {
                  title: 'Awards Management',
                  description:
                    'Complete tracking and automation of awards programs',
                  icon: 'award',
                  gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                },
                {
                  title: 'Financial Integration',
                  description: 'Seamless budgeting and financial operations',
                  icon: 'dollarSign',
                  gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                },
                {
                  title: 'Weather Intelligence',
                  description: 'Real-time weather monitoring for all venues',
                  icon: 'cloud',
                  gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                },
              ].map((feature, i) => (
                <HoloFx key={i}>
                  <Card
                    padding="32"
                    radius="l"
                    style={{
                      height: '100%',
                      background:
                        'rgba(var(--neutral-background-strong-rgb), 0.5)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--neutral-border-weak)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                  >
                    <Column gap="16" height="100%">
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '16px',
                          background: feature.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon name={feature.icon as any} size="m" />
                      </div>
                      <Column gap="8" fillHeight>
                        <Heading variant="heading-strong-m">
                          {feature.title}
                        </Heading>
                        <Text
                          variant="body-default-s"
                          onBackground="neutral-weak"
                        >
                          {feature.description}
                        </Text>
                      </Column>
                    </Column>
                  </Card>
                </HoloFx>
              ))}
            </Grid>
          </Column>
        </Fade>

        {/* Team Showcase */}
        <Fade duration="xl" delay="xl">
          <Column gap="24" paddingY="40">
            <Column gap="12" alignItems="center">
              <Heading variant="display-default-l" align="center">
                <LetterFx trigger="hover" speed="medium">
                  Conference Teams
                </LetterFx>
              </Heading>
              <Text
                variant="body-default-m"
                onBackground="neutral-weak"
                align="center"
              >
                16 powerhouse institutions united in athletic excellence
              </Text>
            </Column>

            <TeamShowcase />
          </Column>
        </Fade>

        {/* CTA Section */}
        <Fade duration="xl" delay="xl">
          <Card
            padding="48"
            radius="xl"
            style={{
              background:
                'linear-gradient(135deg, var(--brand-background-strong) 0%, var(--accent-background-strong) 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background:
                  'radial-gradient(circle, var(--accent-solid-weak) 0%, transparent 70%)',
                opacity: 0.3,
                animation: 'pulse 4s ease-in-out infinite',
              }}
            />

            <Column
              gap="24"
              alignItems="center"
              style={{ position: 'relative', zIndex: 1 }}
            >
              <Heading variant="display-strong-l" align="center">
                Ready to Transform Your Operations?
              </Heading>
              <Text
                variant="body-default-l"
                align="center"
                style={{ maxWidth: '600px' }}
              >
                Join the future of athletic conference management with HELiiX
              </Text>
              <Row gap="16">
                <Button size="l" variant="primary">
                  Get Started
                </Button>
                <Button size="l" variant="secondary">
                  Schedule Demo
                </Button>
              </Row>
            </Column>
          </Card>
        </Fade>
      </Column>
    </>
  );
}
