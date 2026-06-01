"use client";

import { useEffect, useState } from "react";
import { OccasionEvent } from "@/types/event";
import { getAllEvents } from "@/services/event-service";
import EventList from "@/components/event-list";
import PageHeader from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import DashboardFilters from "@/components/dashboard-filters";
import { useUIStore } from "@/store/ui-store";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { occasionMeta } from "@/constants/occasion-meta";

export default function PeoplePage() {
  const [events, setEvents] = useState<OccasionEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const { openAddReminder, openEditReminder } = useUIStore();

  async function loadData() {
    setIsLoading(true);
    try {
      const eventData = await getAllEvents();
      setEvents(eventData);
    } catch (e) {
      console.error("Failed to load events in people page", e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    window.addEventListener("event-saved", loadData);
    return () => window.removeEventListener("event-saved", loadData);
  }, []);

  const filteredEvents = events.filter((e) => {
    // Filters
    if (filter === "all") return true;
    if (filter === "favorites") return e.isFavorite;
    if (filter.startsWith("category:")) {
      const catKey = filter.split(":")[1];
      const meta = occasionMeta[e.eventType] || occasionMeta.custom;
      return meta.category === catKey;
    }
    return e.relationshipType === filter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        eyebrow="Directory"
        title="Connections"
        description="Browse and manage the people who occupy central places in your life."
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-end">
        {/* Dropdowns / Filter Select */}
        <DashboardFilters value={filter} onChange={setFilter} />
      </div>

      {isLoading ? (
        <GlassCard className="p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 rounded-full border-2 border-t-transparent border-violet-500 animate-spin" />
            <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase animate-pulse">
              Loading connections directory...
            </p>
          </div>
        </GlassCard>
      ) : filteredEvents.length === 0 ? (
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center gap-4">
          <div className="p-4 rounded-full bg-white/5 border border-white/10 text-gray-600">
            <Search size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-300">No connections found</h3>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              We couldn&apos;t find any records matching your search or filters. Try adjusting your query or create a new contact.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setFilter("all");
            }}
            className="border-white/10 text-gray-300 hover:bg-white/5 rounded-xl text-xs font-semibold px-4 py-2"
          >
            Clear Filters
          </Button>
        </GlassCard>
      ) : (
        <EventList
          events={filteredEvents}
          refreshEvents={loadData}
          onEdit={openEditReminder}
        />
      )}
    </div>
  );
}
