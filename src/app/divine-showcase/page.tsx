"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Meteors } from "@/components/ui/meteors";
import { DivineButton } from "@/components/ui/divine-button";
import { 
  DivineCard, 
  DivineCardHeader, 
  DivineCardTitle, 
  DivineCardDescription 
} from "@/components/ui/divine-card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BorderBeam } from "@/components/ui/border-beam";
import { Award, Trophy, Medal, Star, Zap, Sparkles } from "lucide-react";

export default function DivineShowcasePage() {
  return (
    <AuroraBackground>
      <div className="relative z-50 w-full max-w-7xl mx-auto px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 divine-holographic">
            Divine UI Components
          </h1>
          <p className="text-xl text-divine-text-secondary">
            Experience the heavenly aesthetic of HELiiX
          </p>
        </div>

        {/* 3D Cards Showcase */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 divine-text-glow-golden text-center">
            3D Interactive Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CardContainer className="inter-var">
              <CardBody className="bg-divine-glass relative group/card divine-glass hover:divine-glass rounded-xl p-6 border border-divine-glass-border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold divine-text-glow-golden"
                >
                  Championship Awards
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-divine-text-secondary text-sm max-w-sm mt-2"
                >
                  Track and manage championship awards across all Big 12 sports
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                  <div className="h-60 w-full bg-gradient-to-r from-divine-golden to-divine-amber rounded-xl relative">
                    <Award className="w-20 h-20 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>

            <CardContainer className="inter-var">
              <CardBody className="bg-divine-glass relative group/card divine-glass hover:divine-glass rounded-xl p-6 border border-divine-glass-border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold divine-text-glow-amber"
                >
                  Team Analytics
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-divine-text-secondary text-sm max-w-sm mt-2"
                >
                  Real-time performance metrics and insights for all teams
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                  <div className="h-60 w-full bg-gradient-to-r from-divine-amber to-divine-golden rounded-xl relative">
                    <Trophy className="w-20 h-20 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>

            <CardContainer className="inter-var">
              <CardBody className="bg-divine-glass relative group/card divine-glass hover:divine-glass rounded-xl p-6 border border-divine-glass-border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold divine-text-glow-golden"
                >
                  Recognition System
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-divine-text-secondary text-sm max-w-sm mt-2"
                >
                  Automated award distribution and achievement tracking
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                  <div className="h-60 w-full bg-gradient-to-r from-divine-golden to-divine-amber rounded-xl relative">
                    <Medal className="w-20 h-20 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>
        </div>

        {/* Meteor Cards */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 divine-text-glow-amber text-center">
            Meteor Effect Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden divine-glass rounded-xl p-8 border border-divine-glass-border">
              <Meteors number={20} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 divine-text-glow-golden">
                  AI-Powered Analytics
                </h3>
                <p className="text-divine-text-secondary mb-6">
                  Leverage advanced AI to predict team performance, optimize schedules, and generate insights.
                </p>
                <DivineButton>
                  <Star className="w-4 h-4 mr-2" />
                  Explore AI Features
                </DivineButton>
              </div>
            </div>

            <div className="relative overflow-hidden divine-glass rounded-xl p-8 border border-divine-glass-border">
              <Meteors number={15} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 divine-text-glow-amber">
                  Real-Time Sync
                </h3>
                <p className="text-divine-text-secondary mb-6">
                  Seamless integration with Notion, automatic data synchronization, and instant updates.
                </p>
                <DivineButton variant="secondary">
                  <Star className="w-4 h-4 mr-2" />
                  View Sync Status
                </DivineButton>
              </div>
            </div>
          </div>
        </div>

        {/* Divine Cards Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 divine-text-glow-golden text-center">
            Glassmorphic Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DivineCard glowColor="golden" intensity="high">
              <DivineCardHeader>
                <DivineCardTitle>Conference Stats</DivineCardTitle>
                <DivineCardDescription>
                  Live statistics and performance metrics
                </DivineCardDescription>
              </DivineCardHeader>
            </DivineCard>
            <DivineCard glowColor="amber" intensity="high">
              <DivineCardHeader>
                <DivineCardTitle>Award Tracking</DivineCardTitle>
                <DivineCardDescription>
                  Comprehensive award management system
                </DivineCardDescription>
              </DivineCardHeader>
            </DivineCard>
            <DivineCard glowColor="golden" intensity="high">
              <DivineCardHeader>
                <DivineCardTitle>Team Portal</DivineCardTitle>
                <DivineCardDescription>
                  Centralized hub for all team operations
                </DivineCardDescription>
              </DivineCardHeader>
            </DivineCard>
          </div>
        </div>

        {/* Button Showcase */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 divine-text-glow-amber text-center">
            Divine Actions
          </h2>
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <DivineButton size="lg">
              Primary Action
            </DivineButton>
            <DivineButton variant="secondary" size="lg">
              Secondary Action
            </DivineButton>
            <DivineButton variant="ghost" size="lg">
              Ghost Action
            </DivineButton>
          </div>
          
          {/* Shimmer Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <ShimmerButton variant="primary">
              <Sparkles className="w-4 h-4 mr-2" />
              Divine Shimmer
            </ShimmerButton>
            <ShimmerButton variant="secondary">
              <Zap className="w-4 h-4 mr-2" />
              Electric Pulse
            </ShimmerButton>
            <ShimmerButton variant="destructive">
              <Star className="w-4 h-4 mr-2" />
              Cosmic Energy
            </ShimmerButton>
          </div>
        </div>
        
        {/* Border Beam Cards */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 divine-text-glow-golden text-center">
            Border Beam Effects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative divine-glass rounded-xl p-6 border border-divine-glass-border">
              <BorderBeam duration={12} delay={0} />
              <h3 className="text-xl font-bold mb-2 divine-text-glow-golden">Real-Time Analytics</h3>
              <p className="text-divine-text-secondary">Advanced metrics with live updates</p>
            </div>
            <div className="relative divine-glass rounded-xl p-6 border border-divine-glass-border">
              <BorderBeam duration={12} delay={4} colorFrom="#FF6B00" colorTo="#FFD700" />
              <h3 className="text-xl font-bold mb-2 divine-text-glow-amber">Neural Processing</h3>
              <p className="text-divine-text-secondary">AI-powered decision making</p>
            </div>
            <div className="relative divine-glass rounded-xl p-6 border border-divine-glass-border">
              <BorderBeam duration={12} delay={8} />
              <h3 className="text-xl font-bold mb-2 divine-text-glow-golden">Quantum Sync</h3>
              <p className="text-divine-text-secondary">Instant data synchronization</p>
            </div>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}