"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Package2, FileText, Download, Upload, BarChart3, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function QuickActionsSheet() {
  const router = useRouter()

  const quickActions = [
    {
      icon: Package2,
      label: "Add New Award",
      description: "Create a new award entry",
      action: () => {
        router.push("/dashboard?tab=awards")
        toast.info("Navigate to Awards tab")
      }
    },
    {
      icon: FileText,
      label: "Create Invoice",
      description: "Add a new invoice",
      action: () => {
        router.push("/dashboard?tab=invoices")
        toast.info("Navigate to Invoices tab")
      }
    },
    {
      icon: Upload,
      label: "Import Data",
      description: "Import from CSV or Excel",
      action: () => toast.info("Import feature coming soon")
    },
    {
      icon: Download,
      label: "Export Reports",
      description: "Download reports as PDF/Excel",
      action: () => toast.info("Export feature coming soon")
    },
    {
      icon: BarChart3,
      label: "View Analytics",
      description: "Check detailed analytics",
      action: () => {
        router.push("/dashboard?tab=overview")
        toast.info("Navigate to Overview")
      }
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Configure system settings",
      action: () => toast.info("Settings page coming soon")
    }
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Quick Actions
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
          <SheetDescription>
            Access frequently used features and shortcuts
          </SheetDescription>
        </SheetHeader>
        
        <Separator className="my-6" />
        
        <div className="grid gap-4">
          {quickActions.map((action, index) => (
            <div key={index}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-4 h-auto py-4"
                onClick={action.action}
              >
                <action.icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Button>
              {index < quickActions.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <strong>Keyboard Shortcuts:</strong>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span>New Award</span>
              <kbd className="px-2 py-1 text-xs bg-muted rounded">⌘N</kbd>
            </div>
            <div className="flex justify-between">
              <span>New Invoice</span>
              <kbd className="px-2 py-1 text-xs bg-muted rounded">⌘I</kbd>
            </div>
            <div className="flex justify-between">
              <span>Search</span>
              <kbd className="px-2 py-1 text-xs bg-muted rounded">⌘K</kbd>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}