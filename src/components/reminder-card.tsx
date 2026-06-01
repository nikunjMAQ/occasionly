import { ReminderItem } from "@/types/reminder";
import AIWishGenerator from "./ai-wish-generator";
import EventInsights from "./event-insights";
import RelationshipBadge from "./relationship-badge";
import PriorityBadge from "./priority-badge";
import QuickActions from "./quick-actions";
import ContactSummary from "./contact-summary";
import { getReminderPriority } from "@/services/reminder-priority";
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  MessageSquare,
  Globe,
  BellRing
} from "lucide-react";

export default function ReminderCard({
  reminder,
}: {
  reminder: ReminderItem;
}) {
  const priority = getReminderPriority(reminder);
  const initials = reminder.event.personName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const hasWhatsapp = !!reminder.event.whatsappNumber && reminder.event.whatsappNumber.trim().length > 0;

  return (
    <div className="group relative overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 bg-white dark:bg-zinc-900/60 backdrop-blur-md shadow-xs hover:shadow-md transition-all duration-300 ease-out flex flex-col justify-between gap-5">
      
      {/* Glow highlight inside card on hover */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="space-y-4">
        {/* Header Grid: Avatar and Profile Details */}
        <div className="flex items-start gap-3.5">
          <div className="h-12 w-12 rounded-2xl flex items-center justify-center font-extrabold text-base tracking-wide bg-gradient-to-br from-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-950/40 shadow-3xs flex-shrink-0">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {reminder.event.personName}
              </h2>
              {reminder.event.isFavorite && (
                <span className="text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border border-yellow-100 dark:border-yellow-900/30 flex items-center gap-0.5 shadow-3xs">
                  <Sparkles className="h-2.5 w-2.5 fill-yellow-500" /> Fav
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <RelationshipBadge
                type={reminder.event.relationshipType || "friend"}
              />
              <PriorityBadge priority={priority} />
            </div>
          </div>
        </div>

        {/* Date and Time Info Grid */}
        <div className="grid grid-cols-2 gap-3 bg-zinc-50/50 dark:bg-zinc-800/20 border border-zinc-150 dark:border-zinc-800/40 rounded-xl p-3 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
            <span className="truncate capitalize">{reminder.event.eventType} • {reminder.event.recurringDate}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
            <span>Time: {reminder.event.reminderTime || "09:00"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <BellRing className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
            <span>Notify: {reminder.event.reminderOffsetDays}d before</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
            <span className="truncate">{reminder.event.timezone || "Local Time"}</span>
          </div>
        </div>

        {/* Event Insights (Tone status, details) */}
        <div>
          <EventInsights event={reminder.event} />
        </div>

        {/* Progressive Enrichment summary inside card (Interests, Gifts, Notes) */}
        <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
          <ContactSummary event={reminder.event} />
        </div>
      </div>

      {/* Footer / CTA Actions Row */}
      <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 mt-auto">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <span>Countdown:</span>
          {reminder.isToday ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/30">
              Today 🎉
            </span>
          ) : reminder.isTomorrow ? (
            <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-900/30">
              Tomorrow 🎈
            </span>
          ) : (
            <span className="text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/40 px-2 py-0.5 rounded-md border border-zinc-100 dark:border-zinc-800">
              In {reminder.daysRemaining} days
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {hasWhatsapp ? (
            <a
              href={reminder.whatsappLink}
              target="_blank"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition duration-200 shadow-sm flex items-center justify-center gap-1.5 text-center"
            >
              <MessageSquare className="h-4 w-4" />
              Send on WhatsApp
            </a>
          ) : (
            <div className="w-full text-center text-[10px] text-zinc-400 dark:text-zinc-500 italic py-2 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/10">
              No WhatsApp number configured
            </div>
          )}

          <AIWishGenerator event={reminder.event} />

          <div className="border-t border-zinc-100 dark:border-zinc-800/40 pt-2 mt-1">
            <QuickActions event={reminder.event} />
          </div>
        </div>
      </div>
    </div>
  );
}
