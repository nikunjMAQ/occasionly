"use client";

import { useEffect, useState } from "react";
import { OccasionEvent } from "@/types/event";
import { getAllEvents } from "@/services/event-service";
import CalendarView from "@/components/calendar-view";
import PageHeader from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";

export default function CalendarPage() {
  const [events, setEvents] = useState<OccasionEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadData() {
    setIsLoading(true);
    try {
      const eventData = await getAllEvents();
      setEvents(eventData);
    } catch (e) {
      console.error("Failed to load events in calendar page", e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    window.addEventListener("event-saved", loadData);
    return () => window.removeEventListener("event-saved", loadData);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        eyebrow="Planning"
        title="Calendar"
        description="Pick a day to see your moments, milestones, and spontaneous relationship check-ins."
      />

      {isLoading ? (
        <GlassCard className="p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 rounded-full border-2 border-t-transparent border-violet-500 animate-spin" />
            <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase animate-pulse">
              Loading calendar...
            </p>
          </div>
        </GlassCard>
      ) : (
        <CalendarView events={events} />
      )}
    </div>
  );
}
