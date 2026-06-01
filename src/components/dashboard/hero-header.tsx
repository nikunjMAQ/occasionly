"use client";

import { motion } from "framer-motion";
import { Sparkles, Plus, CalendarClock } from "lucide-react";

export default function HeroHeader({
  onAddClick,
  upcomingCount = 0,
}: {
  onAddClick?: () => void;
  upcomingCount?: number;
}) {
  const hours = new Date().getHours();
  const greeting =
    hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening";

  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      id="dashboard-hero"
      className="relative mb-2 overflow-hidden"
    >
      {/* Ambient floating glows */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-10 right-0 w-[300px] h-[300px] bg-blue-500/8 rounded-full blur-[80px]" />

      <div className="relative z-10">
        {/* Date pill */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 font-medium"
        >
          <CalendarClock size={12} className="text-violet-400" />
          <span>{dayName}, {dateStr}</span>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            {/* Greeting */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
            >
              {greeting} 👋
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="text-gray-400 mt-4 text-base sm:text-lg max-w-lg leading-relaxed"
            >
              Stay effortlessly connected with the people who matter most.
              {upcomingCount > 0 && (
                <>
                  {" "}You have{" "}
                  <span className="text-violet-400 font-semibold">
                    {upcomingCount} moment{upcomingCount !== 1 ? "s" : ""}
                  </span>{" "}
                  coming up this week.
                </>
              )}
            </motion.p>
          </div>

        </div>

        {/* Stats strip */}
        {upcomingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex items-center gap-2 text-xs text-violet-400 font-medium"
          >
            <Sparkles size={12} className="animate-pulse" />
            <span>
              {upcomingCount} reminder{upcomingCount !== 1 ? "s" : ""} need your attention this week
            </span>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
