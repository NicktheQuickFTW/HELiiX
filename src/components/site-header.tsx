import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppMenubar } from "@/components/app-menubar"

export function SiteHeader() {
  return (
    <header className="flex h-auto shrink-0 items-center border-b">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
      </div>
      <AppMenubar />
    </header>
  )
}