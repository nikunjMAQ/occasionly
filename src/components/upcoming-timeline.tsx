import Link from "next/link";
import { motion } from "framer-motion";
import { ReminderItem } from "@/types/reminder";
import { Sparkles, Calendar } from "lucide-react";
import GlassCard from "./ui/glass-card";
import { occasionMeta } from "@/constants/occasion-meta";

export default function UpcomingTimeline({
  reminders,
}: {
  reminders: ReminderItem[];
}) {
  return (
    <section className="space-y-4 h-full flex flex-col">
      {/* Section header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
          Coming up
        </p>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Timeline
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Your next important life moments.
        </p>
      </div>

      {reminders.length === 0 ? (
        <GlassCard className="p-8 text-center flex-1">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/5 text-gray-600">
              <Calendar className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-gray-400">
              No moments this week ✨
            </p>
            <p className="text-xs text-gray-600 max-w-[200px] leading-relaxed">
              A calm week ahead. Maybe it&apos;s time to reconnect with someone unexpectedly.
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="relative pl-5 ml-2 space-y-3 flex-1">
          {/* Timeline vertical line */}
          <div className="absolute left-0 top-3 bottom-3 w-px bg-gradient-to-b from-violet-500/30 via-white/10 to-transparent" />

          {reminders.slice(0, 8).map((reminder, i) => {
            const meta = occasionMeta[reminder.event.eventType] || occasionMeta.custom;

            const dotColor = reminder.isToday
              ? "bg-emerald-400 ring-4 ring-emerald-400/20 shadow-emerald-400/50 shadow-sm"
              : reminder.isTomorrow
              ? "bg-amber-400 ring-4 ring-amber-400/20"
              : "bg-gray-700 group-hover:bg-violet-500 transition-colors duration-200";

            return (
              <motion.div
                key={reminder.event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className="relative group"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[22px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`}
                />

                <Link href={`/contact/${reminder.event.id}`} className="block focus:outline-none">
                  <GlassCard className="px-4 py-3 flex items-center gap-3 hover:border-white/20 transition-all duration-250 cursor-pointer">
                    {/* Avatar */}
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 border bg-gradient-to-br ${meta.gradient} ${meta.iconBorder}`}
                    >
                      {meta.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-gray-200 text-sm truncate group-hover:text-violet-300 transition-colors duration-150">
                          {reminder.event.personName}
                        </p>
                        {reminder.event.isFavorite && (
                          <Sparkles className="h-3 w-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5 font-medium">
                        {meta.label} · {reminder.event.recurringDate}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      {reminder.isToday ? (
                        <span className="text-[9px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-lg">
                          Today 🎉
                        </span>
                      ) : reminder.isTomorrow ? (
                        <span className="text-[9px] font-bold tracking-wider uppercase text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded-lg">
                          Tomorrow
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-gray-500 bg-white/5 border border-white/8 px-2 py-1 rounded-lg">
                          {reminder.daysRemaining}d
                        </span>
                      )}
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
