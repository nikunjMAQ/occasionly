"use client";

import { motion } from "framer-motion";
import { Users, Trophy, Heart, CalendarClock, LucideIcon } from "lucide-react";

const titleToIconMap: Record<
  string,
  { icon: LucideIcon; color: string; bgColor: string; glowColor: string }
> = {
  "total connections": {
    icon: Users,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    glowColor: "rgba(99,102,241,0.12)",
  },
  "total events": {
    icon: Users,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    glowColor: "rgba(99,102,241,0.12)",
  },
  "life milestones": {
    icon: Trophy,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    glowColor: "rgba(251,191,36,0.10)",
  },
  "deep memories": {
    icon: Heart,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    glowColor: "rgba(244,63,94,0.10)",
  },
  upcoming: {
    icon: CalendarClock,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    glowColor: "rgba(124,58,237,0.12)",
  },
};

export default function StatCard({
  title,
  value,
  index = 0,
}: {
  title: string;
  value: string | number;
  index?: number;
}) {
  const normTitle = title.toLowerCase().trim();
  const config = titleToIconMap[normTitle] || {
    icon: Users,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    glowColor: "rgba(99,102,241,0.12)",
  };
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="col-span-6 md:col-span-3 rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] p-5 backdrop-blur-xl relative overflow-hidden transition-all duration-300 group cursor-default"
      style={{
        boxShadow: `0 4px 24px rgba(0,0,0,0.25)`,
      }}
    >
      {/* Background glow */}
      <div
        className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${config.glowColor}, transparent)` }}
      />

      {/* Top row */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          {title}
        </p>
        <div
          className={`p-2 rounded-xl ${config.bgColor} ${config.color} transition-transform duration-300 group-hover:scale-110`}
        >
          <IconComponent size={14} />
        </div>
      </div>

      <h2 className="text-4xl font-extrabold mt-4 text-white tracking-tight tabular-nums">
        {value}
      </h2>
    </motion.div>
  );
}
