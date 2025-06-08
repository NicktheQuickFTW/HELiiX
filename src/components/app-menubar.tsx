"use client"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function AppMenubar() {
  const router = useRouter()

  return (
    <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
      <MenubarMenu>
        <MenubarTrigger className="font-bold">HELiiX</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => router.push('/dashboard')}>
            Dashboard <MenubarShortcut>⌘D</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => router.push('/dashboard?tab=awards')}>
            Awards
          </MenubarItem>
          <MenubarItem onClick={() => router.push('/dashboard?tab=invoices')}>
            Invoices
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => window.print()}>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      
      <MenubarMenu>
        <MenubarTrigger>Awards</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => toast.info("Add Award clicked")}>
            New Award <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => toast.info("Import clicked")}>
            Import CSV
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Filter by Status</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Planned</MenubarItem>
              <MenubarItem>Ordered</MenubarItem>
              <MenubarItem>Approved</MenubarItem>
              <MenubarItem>Delivered</MenubarItem>
              <MenubarItem>Received</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem onClick={() => toast.info("Export clicked")}>
            Export to Excel
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      
      <MenubarMenu>
        <MenubarTrigger>Invoices</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => toast.info("Add Invoice clicked")}>
            New Invoice <MenubarShortcut>⌘I</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Scan Document</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Due Dates</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Overdue</MenubarItem>
              <MenubarItem>Due Today</MenubarItem>
              <MenubarItem>Due This Week</MenubarItem>
              <MenubarItem>Due This Month</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Generate Report</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked>
            Show Status Cards
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked>
            Show Analytics
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarRadioGroup value="comfortable">
            <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
            <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
            <MenubarRadioItem value="spacious">Spacious</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem>
            Refresh <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => toast.info("Opening documentation...")}>
            Documentation
          </MenubarItem>
          <MenubarItem onClick={() => toast.info("Keyboard shortcuts")}>
            Keyboard Shortcuts <MenubarShortcut>⌘/</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => toast.info("Contact support")}>
            Contact Support
          </MenubarItem>
          <MenubarItem onClick={() => toast.info("Send feedback")}>
            Send Feedback
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => toast.info("HELiiX v1.0.0")}>
            About HELiiX
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}