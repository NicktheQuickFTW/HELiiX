"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Search,
  Trophy,
  Calendar,
  DollarSign,
  Users,
  Brain,
  Award,
  FileText,
  Settings,
  Home,
  Sparkles,
  Star,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigate = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 p-4 divine-glass rounded-xl divine-glow-button flex items-center gap-2 z-50"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm font-medium">CMD+K</span>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command Menu"
        className="fixed inset-0 z-[100]"
      >
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
          <div className="divine-glass rounded-2xl overflow-hidden border border-divine-glass-border shadow-2xl">
            <Command className="bg-transparent">
              <div className="flex items-center border-b border-divine-glass-border px-4">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Command.Input
                  placeholder="Type a command or search..."
                  className="flex h-14 w-full bg-transparent py-3 text-sm outline-none placeholder:text-divine-text-secondary disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Command.List className="max-h-[400px] overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-divine-text-secondary">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Navigation" className="px-2 py-2">
                  <Command.Item
                    onSelect={() => navigate("/")}
                    className="relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-divine-glass-bg aria-selected:bg-divine-glass-bg"
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => navigate("/dashboard")}
                    className="relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-divine-glass-bg aria-selected:bg-divine-glass-bg"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => navigate("/divine-showcase")}
                    className="relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-divine-glass-bg aria-selected:bg-divine-glass-bg"
                  >
                    <Star className="h-4 w-4 text-divine-golden" />
                    <span>Divine Showcase</span>
                    <span className="ml-auto text-xs text-divine-golden">✨</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Operations" className="px-2 py-2">
                  <Command.Item
                    onSelect={() => navigate("/championships")}
                    className="relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-divine-glass-bg aria-selected:bg-divine-glass-bg"
                  >
                    <Trophy className="h-4 w-4" />
                    <span>Championships</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => navigate("/scheduling")}
                    className="relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-divine-glass-bg aria-selected:bg-divine-glass-bg"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Scheduling</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => navigate("/awards")}
                    className="relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-divine-glass-bg aria-selected:bg-divine-glass-bg"
                  >
                    <Award className="h-4 w-4" />
                    <span>Awards Management</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Financial" className="px-2 py-2">
                  <Command.Item
                    onSelect={() => navigate("/finance/distributions")}
                    className="relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-divine-glass-bg aria-selected:bg-divine-glass-bg"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Revenue Distributions</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => navigate("/finance/budgets")}
                    className="relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-divine-glass-bg aria-selected:bg-divine-glass-bg"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Budget Management</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="AI & Analytics" className="px-2 py-2">
                  <Command.Item
                    onSelect={() => navigate("/ai-assistant")}
                    className="relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-divine-glass-bg aria-selected:bg-divine-glass-bg"
                  >
                    <Brain className="h-4 w-4" />
                    <span>AI Assistant</span>
                    <span className="ml-auto text-xs bg-divine-golden/20 text-divine-golden px-2 py-0.5 rounded">Alpha</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => navigate("/ai-features")}
                    className="relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-divine-glass-bg aria-selected:bg-divine-glass-bg"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>AI Features</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => navigate("/analytics")}
                    className="relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-divine-glass-bg aria-selected:bg-divine-glass-bg"
                  >
                    <Brain className="h-4 w-4" />
                    <span>Analytics Dashboard</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Teams & Contacts" className="px-2 py-2">
                  <Command.Item
                    onSelect={() => navigate("/teams/schools")}
                    className="relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-divine-glass-bg aria-selected:bg-divine-glass-bg"
                  >
                    <Users className="h-4 w-4" />
                    <span>Member Schools</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => navigate("/contacts")}
                    className="relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-divine-glass-bg aria-selected:bg-divine-glass-bg"
                  >
                    <Users className="h-4 w-4" />
                    <span>Conference Contacts</span>
                  </Command.Item>
                </Command.Group>

                <Command.Separator className="my-2 h-px bg-divine-glass-border" />

                <Command.Group heading="Settings" className="px-2 py-2">
                  <Command.Item
                    onSelect={() => navigate("/settings")}
                    className="relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-divine-glass-bg aria-selected:bg-divine-glass-bg"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      </Command.Dialog>
    </>
  );
}