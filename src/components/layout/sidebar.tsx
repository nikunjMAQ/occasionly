"use client";

import {
  LayoutDashboard,
  Calendar,
  Bell,
  Users,
  Settings,
  LucideIcon,
  BarChart3,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const sections: SidebarSection[] = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Calendar",
        href: "/calendar",
        icon: Calendar,
      },
      {
        label: "People",
        href: "/people",
        icon: Users,
      },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      {
        label: "Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
      {
        label: "Notifications",
        href: "/notifications",
        icon: Bell,
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
      {
        label: "Contact Us",
        href: "/contact",
        icon: Mail,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isLoggedIn = !!user;
  const email = loading 
    ? "Checking session..." 
    : isLoggedIn 
    ? user.email 
    : "Local offline database cache";

  const name = loading
    ? "Loading..."
    : isLoggedIn
    ? (user.user_metadata?.full_name || user.email?.split("@")[0])
    : "Guest Vault";

  const initials = loading
    ? "..."
    : isLoggedIn
    ? name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "🔒";

  return (
    <aside className="w-60 border-r border-white/5 bg-black/30 backdrop-blur-xl hidden md:flex flex-col h-screen fixed left-0 top-0 bottom-0 justify-between overflow-hidden z-30">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/10 via-transparent to-violet-950/10 pointer-events-none" />

      <div className="relative z-10">
        {/* Logo */}
        <div className="px-6 pt-7 pb-6">
          <Link href="/dashboard" className="block focus:outline-none">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-violet-400 to-rose-400 bg-clip-text text-transparent tracking-tight">
              Occasionly
            </h1>
            <p className="text-[11px] text-gray-500 mt-1 font-medium tracking-widest uppercase">
              Relationship OS
            </p>
          </Link>
        </div>

        {/* Nav sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <p className="px-6 text-[9px] text-gray-600 font-bold tracking-widest uppercase mb-1">
                {section.title}
              </p>
              <nav className="px-3 space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-150 font-medium text-sm group relative ${
                        isActive
                          ? "bg-white/10 text-white font-semibold shadow-xs"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {/* Active sidebar highlight border */}
                      {isActive && (
                        <div className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r bg-violet-500" />
                      )}
                      <Icon
                        size={16}
                        className={`flex-shrink-0 transition-colors duration-150 ${
                          isActive
                            ? "text-indigo-400"
                            : "group-hover:text-indigo-400"
                        }`}
                      />
                      <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Profile footer */}
      <div className="relative z-10 p-4 border-t border-white/8">
        <Link href="/settings" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors duration-200 cursor-pointer group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 text-indigo-300 font-bold flex items-center justify-center text-sm border border-indigo-500/25 shadow-sm flex-shrink-0 capitalize">
            {initials}
          </div>
          <div className="text-left min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-200 truncate capitalize">
              {name.replace(".", " ")}
            </p>
            <p className="text-[10px] text-gray-500 truncate">
              {email}
            </p>
          </div>
          {/* Online indicator */}
          <div className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0 shadow-sm shadow-emerald-400/50" />
        </Link>
      </div>
    </aside>
  );
}

