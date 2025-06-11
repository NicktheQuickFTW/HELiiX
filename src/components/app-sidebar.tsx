"use client"

import * as React from "react"
import { 
  Package2, 
  FileText, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Home, 
  Brain,
  Calendar,
  Trophy,
  DollarSign,
  MapPin,
  Building2,
  Users,
  Zap,
  Activity,
  Cloud,
  BookOpen,
  Star,
  Sparkles
} from "lucide-react"
import { NavUser } from "@/components/nav-user"
import { SidebarCalendar31 } from "@/components/sidebar-calendar-31"
import { ThemeToggleSimple } from "@/components/theme-toggle"
import { ConferenceLogo } from "@/components/ui/conference-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Platform Overview",
      url: "/overview",
      icon: Activity,
      badge: "Featured",
    },
    {
      title: "Championship Credentials",
      url: "#",
      icon: Trophy,
      badge: "New",
      items: [
        {
          title: "Events Overview",
          url: "/championships",
        },
        {
          title: "Request Credential",
          url: "/championships/request",
        },
        {
          title: "My Credentials",
          url: "/championships/credentials",
        },
        {
          title: "QR Scanner",
          url: "/championships/scanner",
        },
        {
          title: "Admin Reviews",
          url: "/championships/admin/reviews",
        },
        {
          title: "Analytics",
          url: "/championships/admin/analytics",
        },
      ],
    },
    {
      title: "Operations Center",
      url: "#",
      icon: Activity,
      items: [
        {
          title: "Overview",
          url: "/operations",
        },
        {
          title: "Scheduling",
          url: "/scheduling",
        },
        {
          title: "Weather Command",
          url: "/weather",
          badge: "Live",
        },
      ],
    },
    {
      title: "Financial Operations",
      url: "#",
      icon: DollarSign,
      items: [
        {
          title: "Revenue Distributions",
          url: "/finance/distributions",
        },
        {
          title: "Budget Management",
          url: "/finance/budgets",
        },
        {
          title: "Awards Tracking",
          url: "/awards",
        },
        {
          title: "All Invoices",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Teams & Venues",
      url: "#",
      icon: Building2,
      items: [
        {
          title: "Member Schools",
          url: "/teams/schools",
        },
        {
          title: "Venues Management",
          url: "/teams/venues",
        },
        {
          title: "Travel Coordination",
          url: "/travel",
        },
        {
          title: "Conference Contacts",
          url: "/contacts",
          badge: "Live",
        },
      ],
    },
    {
      title: "Analytics & AI",
      url: "#",
      icon: Brain,
      items: [
        {
          title: "AI Assistant",
          url: "/ai-assistant",
          badge: "Alpha",
        },
        {
          title: "AI Features Overview",
          url: "/ai-features",
        },
        {
          title: "Analytics Dashboard",
          url: "/analytics",
          badge: "New",
        },
        {
          title: "Data Sync",
          url: "/sync",
          badge: "Live",
        },
        {
          title: "Vector Search",
          url: "/ai-features?tab=vector",
        },
        {
          title: "Predictions",
          url: "/ai-features?tab=predictions",
        },
        {
          title: "Divine Showcase",
          url: "/divine-showcase",
          badge: "✨",
        },
      ],
    },
    {
      title: "Awards & Recognition",
      url: "#",
      icon: Trophy,
      items: [
        {
          title: "Awards Management",
          url: "/awards",
        },
        {
          title: "Categories",
          url: "/awards/categories",
        },
        {
          title: "Recipients",
          url: "/awards/recipients",
        },
        {
          title: "Dashboard View",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Sports Programs",
      url: "#",
      icon: Trophy,
      items: [
        {
          title: "All Sports Overview",
          url: "/sports",
        },
        {
          title: "Football",
          url: "/sports/football",
        },
        {
          title: "Men's Basketball",
          url: "/sports/mens-basketball",
        },
        {
          title: "Women's Basketball", 
          url: "/sports/womens-basketball",
        },
        {
          title: "Soccer",
          url: "/sports/soccer",
        },
        {
          title: "Volleyball",
          url: "/sports/volleyball",
        },
        {
          title: "More Sports →",
          url: "/sports",
        },
      ],
    },
    {
      title: "Resources",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Championship Manuals",
          url: "/manuals",
          badge: "Complete",
        },
        {
          title: "Notion Database",
          url: "/notion",
          badge: "Live",
        },
        {
          title: "FlexTime Scheduling",
          url: "http://localhost:3000/schedule-builder",
          external: true,
        },
        {
          title: "External Analytics",
          url: "http://localhost:3000/analytics",
          external: true,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Account",
      url: "/account",
      icon: Users,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Help",
      url: "/help",
      icon: HelpCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white dark:bg-gray-800 border p-1">
                  <ConferenceLogo size="xs" variant="auto" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold font-orbitron">Big 12 Conference</span>
                  <span className="truncate text-xs">HELiiX Operations Platform</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  {item.items ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : (
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <a href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarMenu>
            {data.navSecondary.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarCalendar31 />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-2">
          <NavUser />
          <ThemeToggleSimple />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}