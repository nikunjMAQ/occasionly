"use client";

import { motion } from "framer-motion";
import { MessageCircle, Edit3, Trash2, Calendar, MoreHorizontal } from "lucide-react";
import { OccasionEvent } from "@/types/event";
import { ReminderItem } from "@/types/reminder";
import { deleteEvent } from "@/services/event-service";
import AIWishGenerator from "../ai-wish-generator";
import RelationshipBadge from "../relationship-badge";
import PriorityBadge from "../priority-badge";
import { getReminderPriority } from "@/services/reminder-priority";
import ContactSummary from "../contact-summary";
import OccasionBadge from "../ui/occasion-badge";
import { occasionMeta } from "@/constants/occasion-meta";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function PremiumReminderCard({
  reminder,
  onEdit,
  refresh,
}: {
  reminder: ReminderItem;
  onEdit?: (event: OccasionEvent) => void;
  refresh?: () => void;
}) {
  const priority = getReminderPriority(reminder);
  const eventType = reminder.event.eventType;
  const meta = occasionMeta[eventType] ?? occasionMeta.custom;
  const EventIcon = meta.icon;

  const initials = reminder.event.personName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const hasWhatsapp =
    !!reminder.event.whatsappNumber &&
    reminder.event.whatsappNumber.trim().length > 0;

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (
      confirm(
        `Remove the reminder for ${reminder.event.personName}?`
      )
    ) {
      await deleteEvent(reminder.event.id);
      if (refresh) refresh();
    }
  }

  const currentYear = new Date().getFullYear();
  const occurrenceCount = reminder.event.startingYear
    ? currentYear - reminder.event.startingYear
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 space-y-5 flex flex-col justify-between relative overflow-hidden group cursor-default"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 20px 60px -10px rgba(99,102,241,0.12), 0 8px 25px -5px rgba(139,92,246,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Gradient accent line on hover */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Dynamic event-type avatar */}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border bg-gradient-to-br ${meta.gradient} ${meta.iconColor} ${meta.iconBorder}`}
            >
              <EventIcon size={22} />
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  {reminder.event.personName}
                </h2>
                {reminder.event.isFavorite && (
                  <span className="text-yellow-400 text-[10px] font-extrabold">★</span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <RelationshipBadge type={reminder.event.relationshipType || "friend"} />
                <PriorityBadge priority={priority} />
              </div>
            </div>
          </div>

          {/* Countdown chip */}
          <div className="bg-white/[0.06] border border-white/10 px-3 py-1.5 rounded-2xl text-xs font-bold flex-shrink-0">
            {reminder.isToday ? (
              <span className="text-emerald-400">Today 🎉</span>
            ) : reminder.isTomorrow ? (
              <span className="text-amber-400">Tomorrow 🎈</span>
            ) : (
              <span className="text-violet-300">In {reminder.daysRemaining}d</span>
            )}
          </div>
        </div>

        {/* Occasion identity row */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <OccasionBadge type={eventType} size="sm" />
            {occurrenceCount > 0 && (
              <span className="text-[10px] text-gray-500 font-medium">
                · {occurrenceCount} year{occurrenceCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Smart contextual copy */}
          <p className="text-xs text-gray-500 italic leading-relaxed">
            {meta.smartCopy}
          </p>

          <p className="text-[11px] text-gray-600 flex items-center gap-1.5">
            <Calendar size={11} />
            {reminder.event.recurringDate} · {reminder.event.reminderTime || "09:00"}
          </p>
        </div>

        {/* Insights */}
        <div className="border-t border-white/5 pt-3">
          <ContactSummary event={reminder.event} />
        </div>
      </div>

      {/* Actions footer */}
      <div className="space-y-3 pt-3 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-2">
          {/* Primary Action: Generate AI Wish */}
          <div className="flex-1">
            <AIWishGenerator event={reminder.event} />
          </div>

          {/* Secondary Action: More Actions (...) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-2xl transition-colors duration-150 cursor-pointer flex-shrink-0" title="More Actions">
                <MoreHorizontal size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#171a20] border border-white/10 text-gray-200 rounded-2xl shadow-2xl p-1.5 min-w-[150px]">
              {hasWhatsapp ? (
                <DropdownMenuItem asChild className="hover:bg-white/5 rounded-lg px-2.5 py-2 text-xs flex items-center gap-2 cursor-pointer font-medium text-gray-200">
                  <a href={reminder.whatsappLink} target="_blank">
                    <MessageCircle size={14} className="text-emerald-400" />
                    Open WhatsApp
                  </a>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem disabled className="text-gray-500 rounded-lg px-2.5 py-2 text-xs flex items-center gap-2">
                  <MessageCircle size={14} className="opacity-40" />
                  No WhatsApp
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(reminder.event)}
                  className="hover:bg-white/5 rounded-lg px-2.5 py-2 text-xs flex items-center gap-2 cursor-pointer font-medium text-gray-200"
                >
                  <Edit3 size={14} className="text-violet-400" />
                  Edit Reminder
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleDelete}
                className="hover:bg-red-500/10 text-red-400 hover:text-red-400 rounded-lg px-2.5 py-2 text-xs flex items-center gap-2 cursor-pointer font-medium"
              >
                <Trash2 size={14} />
                Delete Reminder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}
