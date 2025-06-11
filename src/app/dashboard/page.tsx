"use client"

import { useState } from "react"
import { DivineCard, DivineCardContent, DivineCardDescription, DivineCardHeader, DivineCardTitle } from "@/components/ui/divine-card"
import { DivineButton } from "@/components/ui/divine-button"
import { Activity, Award, CreditCard, DollarSign, School, TrendingUp, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Total Revenue",
    value: "$12.5M",
    change: "+15.2%",
    trend: "up",
    icon: DollarSign,
    color: "golden"
  },
  {
    title: "Active Schools",
    value: "16",
    change: "100%",
    trend: "stable",
    icon: School,
    color: "amber"
  },
  {
    title: "Awards Distributed",
    value: "2,847",
    change: "+23.5%",
    trend: "up",
    icon: Award,
    color: "success"
  },
  {
    title: "Pending Invoices",
    value: "43",
    change: "-12.3%",
    trend: "down",
    icon: CreditCard,
    color: "error"
  }
]

export default function DashboardPage() {
  const [selectedStat, setSelectedStat] = useState<number | null>(null)

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section with Neural Network Visualization Placeholder */}
      <div className="relative h-64 rounded-2xl overflow-hidden divine-glass mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/10 to-[#FF6B00]/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold divine-holographic">HELiiX Operations Center</h1>
            <p className="text-xl text-muted-foreground">Big 12 Conference Management Platform</p>
          </div>
        </div>
        
        {/* Animated lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFB800] to-transparent animate-pulse" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#FF6B00] to-transparent animate-pulse" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <DivineCard
            key={index}
            glowColor={stat.color as any}
            intensity={selectedStat === index ? "high" : "medium"}
            onClick={() => setSelectedStat(index)}
            className="cursor-pointer"
          >
            <DivineCardHeader>
              <div className="flex items-center justify-between">
                <stat.icon className="w-8 h-8 divine-text-glow-golden" />
                <span className={cn(
                  "text-sm font-semibold",
                  stat.trend === "up" && "text-[#00FF88]",
                  stat.trend === "down" && "text-[#FF3366]",
                  stat.trend === "stable" && "text-[#FFB800]"
                )}>
                  {stat.change}
                </span>
              </div>
            </DivineCardHeader>
            <DivineCardContent>
              <DivineCardTitle className="text-3xl">{stat.value}</DivineCardTitle>
              <DivineCardDescription>{stat.title}</DivineCardDescription>
            </DivineCardContent>
          </DivineCard>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DivineCard glowColor="golden" className="md:col-span-2">
          <DivineCardHeader>
            <DivineCardTitle>Operations Overview</DivineCardTitle>
            <DivineCardDescription>Real-time conference activity monitoring</DivineCardDescription>
          </DivineCardHeader>
          <DivineCardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#00FF88]" />
                  <span className="text-sm">Championship Events</span>
                </div>
                <p className="text-2xl font-bold">12 Active</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#FFB800]" />
                  <span className="text-sm">Credentials Issued</span>
                </div>
                <p className="text-2xl font-bold">3,284</p>
              </div>
            </div>
            
            <div className="h-32 relative rounded-lg divine-glass overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFB800]/20 to-[#FF6B00]/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp className="w-16 h-16 text-[#FFB800]/50" />
              </div>
            </div>
          </DivineCardContent>
        </DivineCard>

        <DivineCard glowColor="amber">
          <DivineCardHeader>
            <DivineCardTitle>Quick Actions</DivineCardTitle>
            <DivineCardDescription>Frequently used operations</DivineCardDescription>
          </DivineCardHeader>
          <DivineCardContent className="space-y-3">
            <DivineButton variant="primary" size="md" className="w-full">
              Create Award
            </DivineButton>
            <DivineButton variant="secondary" size="md" className="w-full">
              Issue Credential
            </DivineButton>
            <DivineButton variant="ghost" size="md" className="w-full">
              Generate Report
            </DivineButton>
          </DivineCardContent>
        </DivineCard>
      </div>

      {/* Activity Feed */}
      <DivineCard glowColor="golden" intensity="low">
        <DivineCardHeader>
          <DivineCardTitle>Recent Activity</DivineCardTitle>
          <DivineCardDescription>Latest updates across the conference</DivineCardDescription>
        </DivineCardHeader>
        <DivineCardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg divine-glass">
                <div className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm">New championship credential issued for Basketball Tournament</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </DivineCardContent>
      </DivineCard>
    </div>
  )
}