"use client";

import { useEffect, useState } from "react";
import { OccasionEvent } from "@/types/event";
import { getAllEvents } from "@/services/event-service";
import { getUpcomingReminders } from "@/services/reminder-service";
import { ReminderLog } from "@/types/reminder-log";
import { getReminderLogs } from "@/services/reminder-log-service";
import HeroHeader from "@/components/dashboard/hero-header";
import DashboardGrid from "@/components/dashboard/dashboard-grid";
import StatCard from "@/components/dashboard/stat-card";
import FeaturedReminder from "@/components/dashboard/featured-reminder";
import UpcomingTimeline from "@/components/upcoming-timeline";
import { generateAnalytics } from "@/services/analytics-service";
import SectionBlock from "@/components/ui/section-block";
import EmptyState from "@/components/empty-state";
import GlassCard from "@/components/ui/glass-card";
import { useUIStore } from "@/store/ui-store";

export default function DashboardPage() {
  const [events, setEvents] = useState<OccasionEvent[]>([]);
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { openAddReminder } = useUIStore();

  async function loadData() {
    setIsLoading(true);
    try {
      const eventData = await getAllEvents();
      setEvents(eventData);
      const logData = await getReminderLogs();
      setLogs(logData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    window.addEventListener("event-saved", loadData);
    return () => window.removeEventListener("event-saved", loadData);
  }, []);

  const reminders = getUpcomingReminders(events);
  const upcomingCount = reminders.filter((r) => r.daysRemaining <= 7).length;
  const featuredReminder = reminders.length > 0 ? reminders[0] : null;

  const analytics = generateAnalytics({
    events,
    logs,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero welcome greeting banner */}
      <HeroHeader upcomingCount={upcomingCount} />

      {isLoading ? (
        <GlassCard className="p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 rounded-full border-2 border-t-transparent border-violet-500 animate-spin" />
            <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase animate-pulse">
              Syncing vaults...
            </p>
          </div>
        </GlassCard>
      ) : events.length === 0 ? (
        <div className="py-12">
          <EmptyState
            title="Your Relationship OS is completely fresh"
            description="Occasionly is designed to nurture relationship intelligence. Let's start by adding your first important connection—whether it's a partner's anniversary, a friend's career milestone, or a family birthday."
            actionLabel="✨ Add Your First Connection"
            onActionClick={openAddReminder}
          />
        </div>
      ) : (
        <>
          {/* Featured centerpiece alert */}
          {featuredReminder && (
            <div className="py-2">
              <FeaturedReminder
                reminder={featuredReminder}
                onAddReminder={openAddReminder}
              />
            </div>
          )}

          {/* Overview Stats */}
          <SectionBlock
            title="Overview"
            description="Your relationship intelligence dashboard."
          >
            <DashboardGrid>
              <StatCard title="Total Connections" value={analytics.totalEvents} index={0} />
              <StatCard title="Life Milestones" value={analytics.categories.career} index={1} />
              <StatCard title="Deep Memories" value={analytics.categories.memory} index={2} />
              <StatCard title="Upcoming" value={analytics.upcomingThisWeek} index={3} />
            </DashboardGrid>
          </SectionBlock>

          {/* Upcoming Timeline alerts */}
          <SectionBlock
            title="Timeline Alerts"
            description="Moments requiring your attention in the next few days."
          >
            <div className="max-w-3xl">
              <UpcomingTimeline reminders={reminders} />
            </div>
          </SectionBlock>
        </>
      )}
    </div>
  );
}
