"use client";

import { OccasionEvent } from "@/types/event";
import { deleteEvent } from "@/services/event-service";
import ContactSummary from "@/components/contact-summary";
import RelationshipBadge from "./relationship-badge";
import EventInsights from "./event-insights";
import AIWishGenerator from "./ai-wish-generator";
import Link from "next/link";
import { 
  Edit3, 
  Trash2, 
  Sparkles, 
  Calendar, 
  Clock, 
  Globe,
  BellRing,
  Smile
} from "lucide-react";

export default function EventList({
  events,
  refreshEvents,
  onEdit,
}: {
  events: OccasionEvent[];
  refreshEvents: () => void;
  onEdit: (event: OccasionEvent) => void;
}) {
  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this reminder?")) {
      await deleteEvent(id);
      refreshEvents();
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map((event) => {
        const initials = event.personName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();

        return (
          <div
            key={event.id}
            className="group relative overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 bg-white dark:bg-zinc-900/60 backdrop-blur-md shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4"
          >
            {/* Hover top border gradient glow */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="space-y-4">
              {/* Header Info */}
              <Link
                href={`/contact/${event.id}`}
                className="flex items-start gap-3 hover:opacity-85 transition-all duration-200 group-hover:translate-x-0.5 cursor-pointer block"
              >
                <div className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm tracking-wide bg-gradient-to-br from-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-950/40 shadow-3xs flex-shrink-0">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {event.personName}
                    </h3>
                    {event.isFavorite && (
                      <span className="text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wider uppercase border border-yellow-100 dark:border-yellow-900/30 flex items-center gap-0.5 shadow-3xs">
                        ★ Fav
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <RelationshipBadge
                      type={event.relationshipType || "friend"}
                    />
                    <span className="text-[10px] text-zinc-500 font-semibold bg-zinc-50 dark:bg-zinc-800/40 px-2 py-0.5 rounded-full border border-zinc-150 dark:border-zinc-850 shadow-3xs flex items-center gap-1">
                      <Smile className="h-2.5 w-2.5" /> Tone: {event.tone || "Friendly"}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Time details table */}
              <div className="grid grid-cols-2 gap-2 bg-zinc-50/50 dark:bg-zinc-800/20 border border-zinc-150 dark:border-zinc-850 rounded-xl p-2.5 text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-zinc-400 flex-shrink-0" />
                  <span className="truncate capitalize">{event.eventType} • {event.recurringDate}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-zinc-400 flex-shrink-0" />
                  <span>Time: {event.reminderTime || "09:00"}</span>
                </div>

                <div className="flex items-center gap-1">
                  <BellRing className="h-3 w-3 text-zinc-400 flex-shrink-0" />
                  <span>Notify: {event.reminderOffsetDays}d before</span>
                </div>

                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3 text-zinc-400 flex-shrink-0" />
                  <span className="truncate">{event.timezone || "Local Time"}</span>
                </div>
              </div>

              {/* Insights */}
              <EventInsights event={event} />

              {/* Progressive summary */}
              <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-2">
                <ContactSummary event={event} />
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-3 flex items-center justify-between gap-3 mt-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(event)}
                  className="p-1.5 text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-lg transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-zinc-200/50 dark:border-zinc-800/40 shadow-3xs"
                  title="Edit Reminder"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-1.5 text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-zinc-200/50 dark:border-zinc-800/40 shadow-3xs"
                  title="Delete Reminder"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <div className="flex-shrink-0">
                <AIWishGenerator event={event} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
