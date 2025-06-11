"use client";

import React from "react";
import { useState, useEffect } from "react";
import { 
  Column, Row, Grid, Card, Button, Heading, Text,
  Background, Icon, Badge, StatusIndicator, Flex,
  SmartImage, Logo, Fade, Scroller, StylePanel
} from "@once-ui-system/core";
import { RevealFx, GlitchFx, HoloFx, TiltFx } from "@/components/effects";
import { useRouter } from "next/navigation";
import { TeamLogo } from "@/components/ui/TeamLogo";
import { CommandPalette } from "@/components/CommandPalette";
import { Meteors } from "@/components/ui/meteors";
import { BorderBeam } from "@/components/ui/Concepts/border-beam";

// Premium gradient backgrounds with our electric blue/purple scheme
const gradients = {
  primary: "linear-gradient(135deg, var(--brand-electric-500) 0%, var(--brand-purple-600) 50%, var(--brand-midnight-800) 100%)",
  secondary: "radial-gradient(circle at 20% 80%, var(--brand-electric-400) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--brand-purple-500) 0%, transparent 50%), radial-gradient(circle at 40% 40%, var(--brand-midnight-700) 0%, transparent 50%)",
  mesh: "radial-gradient(at 40% 20%, var(--brand-electric-500) 0px, transparent 50%), radial-gradient(at 80% 0%, var(--brand-midnight-600) 0px, transparent 50%), radial-gradient(at 0% 50%, var(--brand-purple-600) 0px, transparent 50%), radial-gradient(at 80% 50%, var(--brand-electric-400) 0px, transparent 50%), radial-gradient(at 0% 100%, var(--brand-purple-500) 0px, transparent 50%)",
};

// Big 12 teams data
const teams = [
  { name: "Arizona", logo: "arizona" },
  { name: "Arizona State", logo: "arizona_state" },
  { name: "Baylor", logo: "baylor" },
  { name: "BYU", logo: "byu" },
  { name: "Cincinnati", logo: "cincinnati" },
  { name: "Colorado", logo: "colorado" },
  { name: "Houston", logo: "houston" },
  { name: "Iowa State", logo: "iowa_state" },
  { name: "Kansas", logo: "kansas" },
  { name: "Kansas State", logo: "kansas_state" },
  { name: "Oklahoma State", logo: "oklahoma_state" },
  { name: "TCU", logo: "tcu" },
  { name: "Texas Tech", logo: "texas_tech" },
  { name: "UCF", logo: "ucf" },
  { name: "Utah", logo: "utah" },
  { name: "West Virginia", logo: "west_virginia" },
];

export default function SpectacularLandingPage() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <CommandPalette />
      
      {/* Epic full-screen hero section */}
      <Background
        style={{
          background: gradients.mesh,
          minHeight: "100vh",
        }}
      >
        <Column fillWidth paddingY="xl" gap="2xl">
          
          {/* Floating navigation header */}
          <RevealFx speed="fast" translateY={-4}>
            <Card
              variant="secondary"
              borderStyle="solid"
              style={{
                backdropFilter: "blur(20px)",
                background: "rgba(var(--background-secondary-rgb), 0.6)",
                border: "1px solid rgba(var(--brand-electric-500-rgb), 0.2)",
              }}
            >
              <Row paddingX="l" paddingY="m" alignItems="center" justifyContent="space-between">
                <HoloFx
                  shine={{ opacity: 40 }}
                  burn={{ opacity: 20 }}
                >
                  <Flex alignItems="center" gap="m">
                    <Logo size="l" />
                    <GlitchFx speed="slow" interval={5000} trigger="custom">
                      <Heading variant="heading-strong-l">HELiiX</Heading>
                    </GlitchFx>
                  </Flex>
                </HoloFx>
                
                <Row gap="m" alignItems="center">
                  <Button variant="ghost" size="m" onClick={() => router.push("/dashboard")}>
                    Dashboard
                  </Button>
                  <Button variant="ghost" size="m" onClick={() => router.push("/operations")}>
                    Operations
                  </Button>
                  <Button variant="ghost" size="m" onClick={() => router.push("/analytics")}>
                    Analytics
                  </Button>
                  <Button 
                    variant="primary" 
                    size="m"
                    onClick={() => router.push("/login")}
                    style={{
                      background: gradients.primary,
                      border: "none",
                    }}
                  >
                    <Icon name="arrowRight" />
                    Enter Platform
                  </Button>
                </Row>
              </Row>
            </Card>
          </RevealFx>

          {/* Main hero content */}
          <Column fillWidth alignItems="center" justifyContent="center" style={{ minHeight: "80vh" }}>
            <RevealFx speed="medium" delay={0.3} translateY={8}>
              <Column alignItems="center" gap="xl" maxWidth="xl">
                
                {/* Glitching main title */}
                <GlitchFx speed="medium" continuous>
                  <Heading
                    variant="display-strong-xl"
                    align="center"
                    style={{
                      background: gradients.primary,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: "clamp(3rem, 8vw, 7rem)",
                      lineHeight: 1.1,
                    }}
                  >
                    THE FUTURE OF
                    <br />
                    CONFERENCE OPS
                  </Heading>
                </GlitchFx>

                {/* Animated subtitle */}
                <RevealFx speed="fast" delay={0.5}>
                  <Text
                    variant="body-default-l"
                    align="center"
                    style={{ maxWidth: "600px", opacity: 0.8 }}
                  >
                    HELiiX revolutionizes Big 12 Conference operations with AI-powered intelligence,
                    real-time analytics, and seamless collaboration tools.
                  </Text>
                </RevealFx>

                {/* CTA buttons with holographic effects */}
                <RevealFx speed="fast" delay={0.7}>
                  <Row gap="m" wrap>
                    <HoloFx
                      shine={{ opacity: 60 }}
                      burn={{ opacity: 40 }}
                      texture={{ opacity: 20 }}
                    >
                      <Button
                        size="l"
                        variant="primary"
                        onClick={() => router.push("/dashboard")}
                        style={{
                          background: gradients.primary,
                          border: "none",
                          padding: "var(--spacing-m) var(--spacing-xl)",
                        }}
                      >
                        Launch Platform
                        <Icon name="arrowUpRight" />
                      </Button>
                    </HoloFx>
                    
                    <TiltFx>
                      <Button
                        size="l"
                        variant="secondary"
                        onClick={() => router.push("/ai-assistant")}
                        style={{
                          borderColor: "var(--brand-electric-500)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <BorderBeam />
                        Meet Aura AI
                        <Icon name="magic" />
                      </Button>
                    </TiltFx>
                  </Row>
                </RevealFx>

                {/* Live stats ticker */}
                <RevealFx speed="medium" delay={0.9}>
                  <Card
                    variant="secondary"
                    padding="m"
                    style={{
                      background: "rgba(var(--background-secondary-rgb), 0.4)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(var(--brand-electric-500-rgb), 0.3)",
                    }}
                  >
                    <Row gap="xl" wrap justifyContent="center">
                      <Column alignItems="center" gap="xs">
                        <GlitchFx trigger="custom" interval={3000}>
                          <Heading variant="heading-strong-xl" style={{ color: "var(--brand-electric-500)" }}>
                            16
                          </Heading>
                        </GlitchFx>
                        <Text variant="body-default-s" muted>Member Schools</Text>
                      </Column>
                      <Column alignItems="center" gap="xs">
                        <GlitchFx trigger="custom" interval={3500}>
                          <Heading variant="heading-strong-xl" style={{ color: "var(--brand-purple-500)" }}>
                            28
                          </Heading>
                        </GlitchFx>
                        <Text variant="body-default-s" muted>Championships</Text>
                      </Column>
                      <Column alignItems="center" gap="xs">
                        <GlitchFx trigger="custom" interval={4000}>
                          <Heading variant="heading-strong-xl" style={{ color: "var(--brand-electric-400)" }}>
                            ∞
                          </Heading>
                        </GlitchFx>
                        <Text variant="body-default-s" muted>Possibilities</Text>
                      </Column>
                    </Row>
                  </Card>
                </RevealFx>
              </Column>
            </RevealFx>

            {/* Floating meteors effect */}
            <Meteors number={20} />
          </Column>

          {/* Features section with 3D cards */}
          <Column gap="2xl" paddingTop="2xl">
            <RevealFx speed="medium">
              <Column alignItems="center" gap="l">
                <Badge variant="info" size="l">PLATFORM FEATURES</Badge>
                <Heading variant="display-strong-l" align="center">
                  Engineered for Excellence
                </Heading>
              </Column>
            </RevealFx>

            <Grid
              columns={{ base: 1, m: 2, l: 3 }}
              gap="l"
              paddingX="xl"
            >
              {[
                {
                  icon: "brain",
                  title: "AI-Powered Intelligence",
                  description: "Aura AI assistant provides real-time insights and predictive analytics",
                  color: "var(--brand-electric-500)",
                },
                {
                  icon: "chartBar",
                  title: "Real-Time Analytics",
                  description: "Track performance metrics and operational data with live dashboards",
                  color: "var(--brand-purple-500)",
                },
                {
                  icon: "users",
                  title: "Seamless Collaboration",
                  description: "Connect all 16 member schools with unified communication tools",
                  color: "var(--brand-midnight-600)",
                },
                {
                  icon: "shield",
                  title: "Enterprise Security",
                  description: "Bank-grade encryption and compliance with NCAA regulations",
                  color: "var(--brand-electric-600)",
                },
                {
                  icon: "zap",
                  title: "Lightning Fast",
                  description: "Optimized performance with edge computing and CDN delivery",
                  color: "var(--brand-purple-600)",
                },
                {
                  icon: "globe",
                  title: "Universal Access",
                  description: "Access from anywhere with responsive design and mobile apps",
                  color: "var(--brand-midnight-700)",
                },
              ].map((feature, index) => (
                <RevealFx key={index} speed="fast" delay={index * 0.1}>
                  <TiltFx>
                    <Card
                      variant="primary"
                      padding="l"
                      style={{
                        background: "rgba(var(--background-primary-rgb), 0.8)",
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${feature.color}20`,
                        height: "100%",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Column gap="m">
                        <HoloFx shine={{ opacity: 30 }}>
                          <Flex
                            alignItems="center"
                            justifyContent="center"
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "var(--radius-l)",
                              background: `${feature.color}20`,
                            }}
                          >
                            <Icon name={feature.icon as any} size="l" style={{ color: feature.color }} />
                          </Flex>
                        </HoloFx>
                        <Column gap="s">
                          <Heading variant="heading-strong-l">{feature.title}</Heading>
                          <Text variant="body-default-m" muted>{feature.description}</Text>
                        </Column>
                      </Column>
                    </Card>
                  </TiltFx>
                </RevealFx>
              ))}
            </Grid>
          </Column>

          {/* Team showcase with scrolling logos */}
          <Column gap="xl" paddingTop="2xl">
            <RevealFx speed="medium">
              <Column alignItems="center" gap="l">
                <Badge variant="primary" size="l">BIG 12 CONFERENCE</Badge>
                <Heading variant="display-strong-l" align="center">
                  Powering 16 Elite Programs
                </Heading>
              </Column>
            </RevealFx>

            <RevealFx speed="fast" delay={0.3}>
              <Card
                variant="secondary"
                padding="l"
                style={{
                  background: "rgba(var(--background-secondary-rgb), 0.6)",
                  backdropFilter: "blur(20px)",
                  overflow: "hidden",
                }}
              >
                <Scroller speed="slow" pauseOnHover>
                  <Row gap="xl" alignItems="center">
                    {[...teams, ...teams].map((team, index) => (
                      <HoloFx key={index} shine={{ opacity: 20 }}>
                        <Flex
                          alignItems="center"
                          justifyContent="center"
                          style={{
                            width: "120px",
                            height: "120px",
                            flexShrink: 0,
                          }}
                        >
                          <TeamLogo
                            team={team.logo}
                            size={80}
                            variant="light"
                            showFallback
                          />
                        </Flex>
                      </HoloFx>
                    ))}
                  </Row>
                </Scroller>
              </Card>
            </RevealFx>
          </Column>

          {/* Final CTA section */}
          <Column alignItems="center" gap="xl" paddingY="2xl">
            <RevealFx speed="medium">
              <Column alignItems="center" gap="l" maxWidth="l">
                <GlitchFx trigger="hover" speed="fast">
                  <Heading
                    variant="display-strong-xl"
                    align="center"
                    style={{
                      background: gradients.primary,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Ready to Transform Your Operations?
                  </Heading>
                </GlitchFx>
                
                <Text variant="body-default-l" align="center" muted>
                  Join the revolution in conference management. Experience the power of HELiiX.
                </Text>

                <HoloFx
                  shine={{ opacity: 80 }}
                  burn={{ opacity: 60 }}
                  texture={{ opacity: 30 }}
                >
                  <Button
                    size="xl"
                    variant="primary"
                    onClick={() => router.push("/login")}
                    style={{
                      background: gradients.primary,
                      border: "none",
                      padding: "var(--spacing-l) var(--spacing-2xl)",
                      fontSize: "var(--font-size-l)",
                    }}
                  >
                    Start Your Journey
                    <Icon name="arrowRight" size="l" />
                  </Button>
                </HoloFx>
              </Column>
            </RevealFx>
          </Column>

        </Column>
      </Background>
    </>
  );
}