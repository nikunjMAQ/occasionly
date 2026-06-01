"use client";

import { OccasionEvent } from "@/types/event";
import { MessageSquareCode, Plus } from "lucide-react";

export default function QuickActions({
  event,
}: {
  event: OccasionEvent;
}) {
  const hasWhatsapp = !!event.whatsappNumber && event.whatsappNumber.trim().length > 0;
  const quickMessage = `Happy ${event.eventType} ${event.personName}! 🎉`;

  const whatsappUrl = hasWhatsapp
    ? `https://wa.me/${event.whatsappNumber}?text=${encodeURIComponent(quickMessage)}`
    : "#";

  return (
    <div className="flex gap-3 flex-wrap">
      {hasWhatsapp ? (
        <a
          href={whatsappUrl}
          target="_blank"
          className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center gap-1.5"
        >
          <MessageSquareCode className="h-3.5 w-3.5" />
          Quick WhatsApp
        </a>
      ) : (
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium italic flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800/20 border border-dashed border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl">
          No WhatsApp number added
        </span>
      )}
    </div>
  );
}
