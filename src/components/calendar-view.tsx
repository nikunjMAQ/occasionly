"use client";

import Calendar from "react-calendar";
import { useState } from "react";
import { motion } from "framer-motion";
import { OccasionEvent } from "@/types/event";
import { getEventsForDate } from "@/services/calendar-service";
import { CalendarDays } from "lucide-react";
import GlassCard from "./ui/glass-card";
import { occasionMeta } from "@/constants/occasion-meta";

export default function CalendarView({
  events,
}: {
  events: OccasionEvent[];
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selectedEvents = getEventsForDate({ events, date: selectedDate });

  return (
    <section className="space-y-4 h-full flex flex-col">
      {/* Section header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
          Schedule
        </p>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Calendar
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Pick a day to see your moments.
        </p>
      </div>

      <GlassCard className="p-4 flex-1">
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          className="border-none font-sans !w-full rounded-xl overflow-hidden bg-transparent"
          tileContent={({ date }) => {
            const dateEvents = getEventsForDate({ events, date });
            if (dateEvents.length === 0) return null;

            const primaryEvent = dateEvents[0];
            const meta = occasionMeta[primaryEvent.eventType] || occasionMeta.custom;

            return (
              <div className="flex justify-center mt-0.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full bg-current ${meta.iconColor}`}
                />
              </div>
            );
          }}
        />
      </GlassCard>

      {/* Selected date events */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-400">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
          <span className="text-[10px] text-gray-600 font-medium">
            {selectedEvents.length} event{selectedEvents.length !== 1 ? "s" : ""}
          </span>
        </div>

        {selectedEvents.length === 0 ? (
          <GlassCard className="p-5 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2.5 rounded-xl bg-white/5 text-gray-600">
                <CalendarDays className="h-4 w-4" />
              </div>
              <p className="text-xs font-medium text-gray-500">
                No events here
              </p>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                A calm day. Perfect for a spontaneous check-in.
              </p>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-2">
            {selectedEvents.map((event, i) => {
              const meta = occasionMeta[event.eventType] || occasionMeta.custom;
              const EventIcon = meta.icon;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard className="px-4 py-3 flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center border font-bold text-xs flex-shrink-0 bg-gradient-to-br ${meta.gradient} ${meta.iconColor} ${meta.iconBorder}`}
                    >
                      <EventIcon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-200 text-sm truncate">
                        {event.personName}
                      </p>
                      <p className="text-[10px] text-gray-500 capitalize flex items-center gap-1 mt-0.5">
                        <span className="mr-0.5">{meta.emoji}</span>
                        {meta.label}
                      </p>
                    </div>
                    {event.isFavorite && (
                      <span className="text-[9px] font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-1.5 py-0.5">
                        ★ Fav
                      </span>
                    )}
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
