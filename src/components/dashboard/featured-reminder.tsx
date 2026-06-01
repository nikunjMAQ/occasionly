"use client";

import { motion } from "framer-motion";
import { Star, MessageCircle, Calendar, Sparkles } from "lucide-react";
import { EventType } from "@/types/event";
import { ReminderItem } from "@/types/reminder";
import { occasionMeta } from "@/constants/occasion-meta";

interface FeaturedReminderProps {
  reminder: ReminderItem;
  onAddReminder?: () => void;
}

export default function FeaturedReminder({
  reminder,
  onAddReminder,
}: FeaturedReminderProps) {
  const eventType = reminder.event.eventType;
  const config = occasionMeta[eventType] || occasionMeta.custom;
  const EventIcon = config.icon;

  const hasWhatsapp =
    !!reminder.event.whatsappNumber &&
    reminder.event.whatsappNumber.trim().length > 0;

  const initials = reminder.event.personName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const currentYear = new Date().getFullYear();
  const occurrenceCount = reminder.event.startingYear
    ? currentYear - reminder.event.startingYear
    : 0;

  const urgencyLabel = reminder.isToday
    ? "Today 🎉"
    : reminder.isTomorrow
    ? "Tomorrow 🎈"
    : `In ${reminder.daysRemaining} days`;

  const urgencyColor = reminder.isToday
    ? "text-emerald-400"
    : reminder.isTomorrow
    ? "text-amber-400"
    : "text-violet-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/60 via-[#171a20] to-[#0f1115] p-7 shadow-[0_0_60px_rgba(124,58,237,0.12)]"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px]" />
      <div className="pointer-events-none absolute bottom-0 left-10 w-48 h-48 bg-indigo-500/8 rounded-full blur-[60px]" />

      {/* Gradient line top */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 via-indigo-500 to-rose-400" />

      <div className="relative z-10 space-y-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Large event-type avatar */}
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center border font-bold text-xl tracking-wide shadow-lg bg-gradient-to-br ${config.gradient} ${config.iconColor} ${config.iconBorder}`}
            >
              <EventIcon size={26} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {reminder.event.personName}
                </h3>
                {reminder.event.isFavorite && (
                  <Star size={14} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                )}
              </div>

              <p className={`text-sm mt-1 flex items-center gap-1.5 font-medium ${config.iconColor}`}>
                <span>{config.emoji}</span>
                <span>
                  {config.label}
                  {occurrenceCount > 0 &&
                    ` · ${occurrenceCount} year${occurrenceCount !== 1 ? "s" : ""}`}
                </span>
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex-shrink-0 text-right">
            <p className={`text-2xl font-extrabold tracking-tight ${urgencyColor}`}>
              {urgencyLabel}
            </p>
            <p className="text-[10px] text-gray-500 mt-1 flex items-center justify-end gap-1">
              <Calendar size={10} />
              {reminder.event.recurringDate}
            </p>
          </div>
        </div>

        {/* Relationship pill */}
        {reminder.event.relationshipType && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 capitalize">
              {reminder.event.relationshipType.replace("_", " ")}
            </span>
          </div>
        )}

        {/* Suggested action */}
        <div className="bg-violet-500/8 border border-violet-500/15 rounded-2xl p-4 space-y-2">
          <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={10} />
            Suggested action
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            {reminder.isToday
              ? `It's ${reminder.event.personName}'s ${config.label.toLowerCase()} today! Send a warm message right now.`
              : reminder.isTomorrow
              ? `Tomorrow is the day. Set aside a moment tonight to craft a personal message.`
              : `${reminder.daysRemaining} days left — a perfect time to plan something thoughtful.`}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {hasWhatsapp && (
            <a
              href={reminder.whatsappLink}
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-4 py-3 font-semibold text-sm transition-colors duration-200 shadow-lg shadow-emerald-600/15"
            >
              <MessageCircle size={16} />
              Open WhatsApp
            </a>
          )}
          <button
            onClick={onAddReminder}
            className="flex items-center justify-center gap-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 rounded-2xl px-4 py-3 font-semibold text-sm transition-all duration-200 cursor-pointer"
          >
            <Sparkles size={15} />
            Generate Wish
          </button>
        </div>
      </div>
    </motion.div>
  );
}
