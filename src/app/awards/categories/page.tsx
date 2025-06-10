'use client';

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const categories = [
  { id: 1, name: "Championship Trophies", description: "First place trophies for championship events", count: 25, color: "gold" },
  { id: 2, name: "Runner-up Awards", description: "Second place awards and recognition", count: 30, color: "silver" },
  { id: 3, name: "Participation Medals", description: "Medals for tournament participation", count: 150, color: "bronze" },
  { id: 4, name: "Academic Excellence", description: "Awards for academic achievement", count: 45, color: "blue" },
  { id: 5, name: "Sportsmanship Awards", description: "Recognition for exceptional sportsmanship", count: 20, color: "green" },
]

export default function CategoriesPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Trophy className="h-8 w-8" />
                Award Categories
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage different types of awards and recognition
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
          
          <Separator className="mb-6" />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="secondary">{category.count} items</Badge>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Category Statistics</CardTitle>
              <CardDescription>Overview of award categories and inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">5</div>
                  <p className="text-sm text-muted-foreground">Total Categories</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">270</div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">89%</div>
                  <p className="text-sm text-muted-foreground">In Stock</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">$45K</div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}