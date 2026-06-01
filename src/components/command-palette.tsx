"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/ui-store";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Plus,
  Bell,
  BarChart3,
  Search,
  Sparkles,
  Mail,
} from "lucide-react";
import { OccasionEvent } from "@/types/event";
import { occasionMeta } from "@/constants/occasion-meta";

interface CommandPaletteProps {
  events?: OccasionEvent[];
  onAddReminder?: () => void;
}

export default function CommandPalette({
  events = [],
  onAddReminder,
}: CommandPaletteProps) {
  const router = useRouter();
  const { commandPaletteOpen, closeCommandPalette, openCommandPalette } =
    useUIStore();

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (commandPaletteOpen) {
          closeCommandPalette();
        } else {
          openCommandPalette();
        }
      }
    },
    [commandPaletteOpen, closeCommandPalette, openCommandPalette]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function handleNavigate(url: string) {
    closeCommandPalette();
    router.push(url);
  }

  function handleAddReminder() {
    closeCommandPalette();
    if (onAddReminder) onAddReminder();
  }

  const navItems = [
    {
      label: "Go to Dashboard",
      icon: LayoutDashboard,
      url: "/dashboard",
      shortcut: "D",
    },
    {
      label: "Go to Calendar",
      icon: Calendar,
      url: "/calendar",
      shortcut: "C",
    },
    {
      label: "Go to People Directory",
      icon: Users,
      url: "/people",
      shortcut: "P",
    },
    { label: "Go to Analytics Insights", icon: BarChart3, url: "/analytics", shortcut: "A" },
    { label: "Go to Notifications History", icon: Bell, url: "/notifications", shortcut: "N" },
    { label: "Go to System Settings", icon: Settings, url: "/settings", shortcut: "S" },
    { label: "Contact & Assistance Support", icon: Mail, url: "/contact", shortcut: "H" },
  ];

  return (
    <CommandDialog
      open={commandPaletteOpen}
      onOpenChange={(open) => {
        if (!open) closeCommandPalette();
      }}
      className="bg-[#12141c]/95 border border-white/10 shadow-2xl shadow-black/60 backdrop-blur-2xl max-w-xl rounded-3xl"
    >
      <div className="relative">
        {/* Gradient line at top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-indigo-500/40 via-violet-500/40 to-rose-400/40" />

        <CommandInput
          placeholder="Search people, jump to sections, quick actions..."
          className="text-white placeholder:text-gray-500 bg-transparent border-0 h-14 px-4 text-sm focus:ring-0"
        />
      </div>

      <CommandList className="text-gray-300 max-h-[420px] pb-2">
        <CommandEmpty className="py-10 text-center flex flex-col items-center gap-2">
          <Search className="h-8 w-8 text-gray-600 mx-auto" />
          <p className="text-sm text-gray-500 font-medium">
            No results found.
          </p>
          <p className="text-xs text-gray-650">
            Try searching a person&apos;s name, occasion type, or relationship.
          </p>
        </CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup
          heading="Quick Actions"
          className="[&_[cmdk-group-heading]]:text-indigo-400/80 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1"
        >
          <CommandItem
            onSelect={handleAddReminder}
            className="rounded-xl px-3 py-2.5 cursor-pointer data-[selected=true]:bg-indigo-500/15 data-[selected=true]:text-white hover:bg-white/5 gap-3"
          >
            <div className="h-7 w-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <Plus className="h-3.5 w-3.5 text-indigo-400" />
            </div>
            <span className="font-medium text-sm text-gray-200">
              Add New Connection Reminder
            </span>
            <CommandShortcut className="text-gray-600 text-[10px]">
              ⌘ N
            </CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="bg-white/5 my-1" />

        {/* Search Connections */}
        {events.length > 0 && (
          <>
            <CommandGroup
              heading="Connections Directory"
              className="[&_[cmdk-group-heading]]:text-indigo-400/80 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1"
            >
              {events.map((event) => {
                const meta = occasionMeta[event.eventType] || occasionMeta.custom;
                const EventIcon = meta.icon;

                return (
                  <CommandItem
                    key={event.id}
                    onSelect={() => handleNavigate(`/contact/${event.id}`)}
                    value={`${event.personName} ${event.nickname || ""} ${event.eventType} ${event.relationshipType}`}
                    className="rounded-xl px-3 py-2.5 cursor-pointer data-[selected=true]:bg-white/10 data-[selected=true]:text-white hover:bg-white/5 gap-3"
                  >
                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 border bg-gradient-to-br ${meta.gradient} ${meta.iconBorder} ${meta.iconColor}`}>
                      <EventIcon size={12} />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-semibold text-sm text-gray-200 truncate flex items-center gap-1.5">
                        {event.personName}
                        {event.nickname && (
                          <span className="text-[10px] text-gray-500 font-normal">
                            &ldquo;{event.nickname}&rdquo;
                          </span>
                        )}
                        {event.isFavorite && (
                          <span className="text-[9px] text-yellow-400 bg-yellow-400/10 px-1 rounded">
                            ★
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-gray-500 capitalize">
                        {meta.emoji} {meta.label} · {event.recurringDate} · {event.relationshipType}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator className="bg-white/5 my-1" />
          </>
        )}

        {/* Navigate sections */}
        <CommandGroup
          heading="Navigate Modules"
          className="[&_[cmdk-group-heading]]:text-indigo-400/80 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1"
        >
          {navItems.map((item) => (
            <CommandItem
              key={item.url}
              onSelect={() => handleNavigate(item.url)}
              value={item.label}
              className="rounded-xl px-3 py-2.5 cursor-pointer data-[selected=true]:bg-white/10 data-[selected=true]:text-white hover:bg-white/5 gap-3"
            >
              <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <span className="font-medium text-sm text-gray-300">
                {item.label}
              </span>
              <CommandShortcut className="text-gray-600 text-[10px]">
                ⌘ {item.shortcut}
              </CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        {/* Footer hint */}
        <div className="flex items-center justify-between px-3 py-2 mt-1 border-t border-white/5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] text-gray-600">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500 font-mono text-[9px]">
                ↑↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-600">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500 font-mono text-[9px]">
                ↵
              </kbd>
              select
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-600">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500 font-mono text-[9px]">
                esc
              </kbd>
              close
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-600">
            <Sparkles className="h-3 w-3 text-indigo-500" />
            <span>Occasionly</span>
          </div>
        </div>
      </CommandList>
    </CommandDialog>
  );
}

