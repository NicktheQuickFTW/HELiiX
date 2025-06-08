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
  Activity
} from "lucide-react"
import { NavUser } from "@/components/nav-user"
import { SidebarCalendar31 } from "@/components/sidebar-calendar-31"
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
      title: "Operations Center",
      url: "/operations",
      icon: Activity,
      isActive: true,
      badge: "New",
    },
    {
      title: "FlexTime Scheduling",
      url: "#",
      icon: Calendar,
      items: [
        {
          title: "Schedule Builder",
          url: "http://localhost:3000/schedule-builder",
          external: true,
        },
        {
          title: "Analytics Dashboard",
          url: "http://localhost:3000/analytics",
          external: true,
        },
        {
          title: "Sports Overview",
          url: "http://localhost:3000/sports",
          external: true,
        },
      ],
    },
    {
      title: "Awards & Recognition",
      url: "#",
      icon: Trophy,
      items: [
        {
          title: "Inventory",
          url: "/dashboard?tab=awards",
        },
        {
          title: "Categories",
          url: "#",
        },
        {
          title: "Recipients",
          url: "#",
        },
      ],
    },
    {
      title: "Financial Operations",
      url: "#",
      icon: DollarSign,
      items: [
        {
          title: "All Invoices",
          url: "/dashboard?tab=invoices",
        },
        {
          title: "Budgets",
          url: "#",
        },
        {
          title: "Distributions",
          url: "#",
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
          url: "#",
        },
        {
          title: "Venues",
          url: "#",
        },
        {
          title: "Travel Planning",
          url: "#",
        },
      ],
    },
    {
      title: "Analytics & AI",
      url: "#",
      icon: Brain,
      items: [
        {
          title: "COMPASS Analytics",
          url: "/dashboard?tab=overview",
        },
        {
          title: "AI Features",
          url: "/ai-features",
        },
        {
          title: "Vector Search",
          url: "/ai-features?tab=vector",
        },
        {
          title: "Predictions",
          url: "/ai-features?tab=predictions",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Help",
      url: "#",
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
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <Zap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">HELiiX</span>
                  <span className="truncate text-xs">Big 12 Operations OS</span>
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}