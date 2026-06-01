"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { OccasionEvent } from "@/types/event";
import { db } from "@/lib/db";
import { deleteEvent } from "@/services/event-service";
import PageHeader from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui-store";
import AIWishGenerator from "@/components/ai-wish-generator";
import RelationshipBadge from "@/components/relationship-badge";
import {
  ArrowLeft,
  Calendar,
  Gift,
  Heart,
  MessageSquare,
  Smile,
  Clock,
  Globe,
  BellRing,
  Sparkles,
  Edit3,
  Trash2,
  Bookmark
} from "lucide-react";

export default function ContactProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { openEditReminder } = useUIStore();
  const [event, setEvent] = useState<OccasionEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const id = params.id as string;

  async function loadEvent() {
    setIsLoading(true);
    try {
      if (id) {
        const data = await db.events.get(id);
        if (data) {
          setEvent(data);
        } else {
          setEvent(null);
        }
      }
    } catch (e) {
      console.error("Failed to load contact profile event", e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEvent();
    window.addEventListener("event-saved", loadEvent);
    return () => window.removeEventListener("event-saved", loadEvent);
  }, [id]);

  async function handleDelete() {
    if (!event) return;
    if (confirm("Are you sure you want to delete this relationship connection?")) {
      await deleteEvent(event.id);
      window.dispatchEvent(new Event("event-saved"));
      router.push("/people");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back
        </Button>
        <GlassCard className="p-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 rounded-full border-2 border-t-transparent border-violet-500 animate-spin" />
            <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase animate-pulse">
              Opening memory profile...
            </p>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back
        </Button>
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center gap-4">
          <div className="p-4 rounded-full bg-white/5 border border-white/10 text-gray-600">
            <Bookmark size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-300">Profile not found</h3>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              The relationship contact ID does not exist or has been deleted from your local offline container.
            </p>
          </div>
          <Button
            onClick={() => router.push("/people")}
            className="bg-violet-600 hover:bg-violet-750 text-white font-bold text-xs px-4 py-2 rounded-xl"
          >
            Return to Directory
          </Button>
        </GlassCard>
      </div>
    );
  }

  const initials = event.personName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/people")}
          className="text-gray-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back to Connections
        </Button>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => openEditReminder(event)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5"
          >
            <Edit3 size={13} />
            Edit Profile
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5"
          >
            <Trash2 size={13} />
            Delete Connection
          </Button>
        </div>
      </div>

      {/* Header Profile Cover Block */}
      <GlassCard className="p-6 relative overflow-hidden">
        {/* Decorative backdrop glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          <div className="h-20 w-20 rounded-3xl flex items-center justify-center font-extrabold text-2xl tracking-wide bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-400 border border-indigo-500/25 shadow-md flex-shrink-0">
            {initials}
          </div>

          <div className="text-center md:text-left space-y-2 flex-1">
            <div className="flex flex-col md:flex-row items-center gap-2 flex-wrap justify-center md:justify-start">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                {event.personName}
              </h1>
              {event.nickname && (
                <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg font-medium">
                  &ldquo;{event.nickname}&rdquo;
                </span>
              )}
              {event.isFavorite && (
                <span className="text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase flex items-center gap-0.5">
                  ★ Fav
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              <RelationshipBadge type={event.relationshipType || "friend"} />
              <span className="text-[10px] text-zinc-500 font-semibold bg-zinc-50 dark:bg-zinc-800/40 px-2.5 py-1 rounded-full border border-zinc-150 dark:border-zinc-850 shadow-3xs flex items-center gap-1">
                <Smile className="h-3 w-3 text-violet-400" /> AI Tone: {event.tone || "Friendly"}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Main Grid Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Span: Schedule & Details Details */}
        <div className="space-y-6 lg:col-span-1">
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={14} className="text-indigo-400" />
              Event Schedule
            </h3>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <Bookmark className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 font-medium text-[10px] uppercase">Occasion Type</p>
                  <p className="font-semibold capitalize mt-0.5">{event.eventType}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-300">
                <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 font-medium text-[10px] uppercase">Recurring Date</p>
                  <p className="font-semibold mt-0.5">{event.recurringDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-300">
                <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 font-medium text-[10px] uppercase">Daily Alert Time</p>
                  <p className="font-semibold mt-0.5">{event.reminderTime || "09:00"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-300">
                <BellRing className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 font-medium text-[10px] uppercase">Remind Before</p>
                  <p className="font-semibold mt-0.5">{event.reminderOffsetDays} days ahead</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-300">
                <Globe className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 font-medium text-[10px] uppercase">Timezone</p>
                  <p className="font-semibold mt-0.5">{event.timezone || "Local Time"}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare size={14} className="text-emerald-400" />
              Delivery Channels
            </h3>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-gray-500">Preferred Channel:</span>
              <span className="text-gray-300 font-semibold capitalize">
                {event.preferredReminderChannel}
              </span>
            </div>
            {event.whatsappNumber ? (
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 text-xs flex flex-col gap-1">
                <span className="text-gray-500 text-[10px]">WhatsApp Destination</span>
                <span className="text-emerald-400 font-bold tracking-wide">{event.whatsappNumber}</span>
              </div>
            ) : (
              <p className="text-[10px] text-gray-600 italic">No phone number configured for automatic drafts.</p>
            )}
          </GlassCard>
        </div>

        {/* Right Span: Gift list, Interests and AI suite */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI suite */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-violet-400" />
              Relationship Memory AI Suite
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Use Gemini AI to instantly generate deep-context templates tailored for their anniversary milestones, career promotions, or holidays.
            </p>
            <div className="pt-2">
              <AIWishGenerator event={event} />
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interests card */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Heart size={14} className="text-rose-400" />
                Interests & Passions
              </h3>
              {event.interests && event.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {event.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl text-gray-300 font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-650 italic leading-relaxed pt-1">
                  No interests or favorite hobbies logged yet. Edit the profile to capture notes like &ldquo;loves specialty coffee&rdquo; or &ldquo;hikes often&rdquo;.
                </p>
              )}
            </GlassCard>

            {/* Gift ledger card */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Gift size={14} className="text-amber-400" />
                Gift ideas
              </h3>
              {event.giftIdeas && event.giftIdeas.length > 0 ? (
                <div className="flex flex-col gap-2 pt-1">
                  {event.giftIdeas.map((gift, idx) => (
                    <div
                      key={idx}
                      className="text-xs bg-white/5 border border-white/10 p-2.5 rounded-xl text-gray-300 font-semibold flex items-center gap-2"
                    >
                      <span className="text-amber-400">🎁</span> {gift}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-650 italic leading-relaxed pt-1">
                  No gift ledger elements registered yet. Log ideas like book names, tool sets, or voucher vouchers to remember for the next celebration.
                </p>
              )}
            </GlassCard>
          </div>

          {/* Notes Card */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Personal Memories & Notes
            </h3>
            {event.notes ? (
              <p className="text-xs text-gray-300 bg-white/[0.02] border border-white/5 rounded-xl p-4 leading-relaxed whitespace-pre-line">
                {event.notes}
              </p>
            ) : (
              <p className="text-xs text-gray-600 italic">No notes captured for this connection yet.</p>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
