"use client";

import { useEffect, useState } from "react";
import { OccasionEvent } from "@/types/event";
import { getAllEvents } from "@/services/event-service";
import { ReminderLog } from "@/types/reminder-log";
import { getReminderLogs } from "@/services/reminder-log-service";
import { generateAnalytics } from "@/services/analytics-service";
import PageHeader from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import SectionBlock from "@/components/ui/section-block";
import AnalyticsCard from "@/components/analytics-card";
import { occasionCategories } from "@/constants/occasion-meta";
import { Award, Briefcase, Heart, Smile, Sparkles, Users } from "lucide-react";

export default function AnalyticsPage() {
  const [events, setEvents] = useState<OccasionEvent[]>([]);
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadData() {
    setIsLoading(true);
    try {
      const eventData = await getAllEvents();
      setEvents(eventData);
      const logData = await getReminderLogs();
      setLogs(logData);
    } catch (e) {
      console.error("Failed to load analytics data", e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    window.addEventListener("event-saved", loadData);
    return () => window.removeEventListener("event-saved", loadData);
  }, []);

  const analytics = generateAnalytics({
    events,
    logs,
  });

  // Calculate totals for breakdowns
  const totalRelationships =
    analytics.relationshipBreakdown.friend +
    analytics.relationshipBreakdown.family +
    analytics.relationshipBreakdown.colleague +
    analytics.relationshipBreakdown.partner +
    analytics.relationshipBreakdown.other;

  function getPercentage(value: number) {
    if (totalRelationships === 0) return 0;
    return Math.round((value / totalRelationships) * 100);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Detailed relationship intelligence metrics, category distributions, and delivery performance."
      />

      {isLoading ? (
        <GlassCard className="p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 rounded-full border-2 border-t-transparent border-violet-500 animate-spin" />
            <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase animate-pulse">
              Computing relationship insights...
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-8">
          {/* Key Metrics Dashboard Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AnalyticsCard title="Total Events" value={analytics.totalEvents} />
            <AnalyticsCard title="Birthdays" value={analytics.birthdays} />
            <AnalyticsCard title="Anniversaries" value={analytics.anniversaries} />
            <AnalyticsCard title="Favorites" value={analytics.favoriteContacts} />
            <AnalyticsCard title="This Week" value={analytics.upcomingThisWeek} />
            <AnalyticsCard title="Completion Rate" value={`${analytics.completionRate}%`} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distributions */}
            <GlassCard className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  Category Distributions
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  How your events are distributed across functional domains.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {Object.entries(occasionCategories).map(([key, cat]) => {
                  const val = analytics.categories[key as keyof typeof analytics.categories] || 0;
                  return (
                    <div
                      key={key}
                      className="border border-white/[0.06] bg-white/[0.01] rounded-2xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-semibold text-gray-400 capitalize">
                          {cat.emoji} {cat.label}
                        </span>
                        <h4 className="text-2xl font-extrabold text-white mt-1.5">{val}</h4>
                      </div>
                      <span className="text-[10px] bg-white/5 border border-white/10 text-gray-500 rounded-lg px-2 py-1 font-bold">
                        {analytics.totalEvents > 0
                          ? `${Math.round((val / analytics.totalEvents) * 100)}%`
                          : "0%"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Relationship Balance */}
            <GlassCard className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-400" />
                  Relationship Dynamics
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  The current diversity of connections in your Relationship OS.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { label: "Friends 👫", value: analytics.relationshipBreakdown.friend, color: "bg-indigo-500" },
                  { label: "Family 👨‍👩‍👦", value: analytics.relationshipBreakdown.family, color: "bg-rose-500" },
                  { label: "Colleagues 🤝", value: analytics.relationshipBreakdown.colleague, color: "bg-amber-500" },
                  { label: "Partners 💑", value: analytics.relationshipBreakdown.partner, color: "bg-emerald-500" },
                  { label: "Others ⭐", value: analytics.relationshipBreakdown.other, color: "bg-zinc-500" },
                ].map((item) => {
                  const pct = getPercentage(item.value);
                  return (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-gray-400">{item.label}</span>
                        <span className="text-gray-200">
                          {item.value} <span className="text-gray-600 font-medium">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* AI Assistance metrics */}
          <GlassCard className="p-6 space-y-4 max-w-2xl">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <Award size={18} className="text-indigo-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-200">AI Tone Preferences</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Occasionly leverages tailored tone mapping to output high-emotional relevance wishes. The current engine uses preferred channels (WhatsApp logs) coupled with customized tones for family milestones versus team promotions.
                </p>
                <div className="flex items-center gap-3 pt-3 flex-wrap">
                  <span className="text-[10px] text-zinc-500 font-semibold bg-zinc-50 dark:bg-zinc-800/40 px-2.5 py-1 rounded-full border border-zinc-150 dark:border-zinc-850 shadow-3xs flex items-center gap-1">
                    <Smile className="h-3 w-3 text-violet-400" /> Conversational Tone Adapters
                  </span>
                  <span className="text-[10px] text-zinc-500 font-semibold bg-zinc-50 dark:bg-zinc-800/40 px-2.5 py-1 rounded-full border border-zinc-150 dark:border-zinc-850 shadow-3xs flex items-center gap-1">
                    <Briefcase className="h-3 w-3 text-amber-400" /> Career Milestones Mapping
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
