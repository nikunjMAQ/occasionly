"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, EventFormData } from "@/lib/validations/event-schema";
import { addEvent, updateEvent } from "@/services/event-service";
import { OccasionEvent } from "@/types/event";
import { v4 as uuidv4 } from "uuid";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { occasionMeta } from "@/constants/occasion-meta";
import { EventType } from "@/types/event";
import { calculateNextReminderAt } from "@/services/reminder-service";
import { db } from "@/lib/db";

const EVENT_TYPES = (Object.keys(occasionMeta) as EventType[]).map((key) => {
  const meta = occasionMeta[key];
  return {
    value: key,
    label: `${meta.emoji} ${meta.label}`,
    icon: meta.icon,
    desc: meta.smartCopy,
  };
});

const RELATIONSHIP_TYPES = [
  { value: "friend",       label: "👫 Friend" },
  { value: "family",       label: "👨‍👩‍👦 Family" },
  { value: "partner",      label: "💑 Partner" },
  { value: "colleague",    label: "🤝 Colleague" },
  { value: "mentor",       label: "🎯 Mentor" },
  { value: "acquaintance", label: "👋 Acquaintance" },
  { value: "other",        label: "⭐ Other" },
];

const TONE_TYPES = [
  { value: "funny",          label: "😄 Funny & Playful" },
  { value: "warm",           label: "🤗 Warm & Heartfelt" },
  { value: "emotional",      label: "💖 Emotional & Deep" },
  { value: "formal",         label: "👔 Formal & Polished" },
  { value: "professional",   label: "💼 Professional" },
  { value: "inspirational",  label: "🚀 Inspirational" },
];

const REMINDER_OFFSETS = [
  { value: 0,  label: "Same Day" },
  { value: 1,  label: "1 Day Before" },
  { value: 2,  label: "2 Days Before" },
  { value: 3,  label: "3 Days Before" },
  { value: 7,  label: "1 Week Before" },
  { value: 14, label: "2 Weeks Before" },
  { value: 30, label: "1 Month Before" },
];

export default function AddEventForm({
  onEventSaved,
  editingEvent,
  clearEditing,
}: {
  onEventSaved: () => void;
  editingEvent: OccasionEvent | null;
  clearEditing: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [formMonth, setFormMonth] = useState("01");
  const [formDay, setFormDay] = useState("01");
  const [formYear, setFormYear] = useState("");

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: {
      eventType: "birthday",
      relationshipType: "friend",
      isFavorite: false,
      tone: "warm",
      reminderOffsetDays: 0,
      reminderTime: "09:00",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      preferredReminderChannel: "whatsapp",
      whatsappNumber: "",
    },
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const selectedEventType = watch("eventType");

  const inputClasses =
    "w-full border border-white/10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 bg-white/5 text-gray-200 transition placeholder-gray-600 text-sm";
  const selectClasses =
    "w-full border border-white/10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 bg-[#1a1d24] text-gray-200 transition text-sm cursor-pointer";
  const labelClasses = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider";

  useEffect(() => {
    if (editingEvent) {
      const num = editingEvent.whatsappNumber || "";
      const displayNum = (num.length === 12 && num.startsWith("91")) ? num.slice(2) : num;
      reset({
        ...editingEvent,
        whatsappNumber: displayNum,
      } as any);

      const parts = (editingEvent.recurringDate || "").split("-");
      if (parts.length === 3) {
        setFormMonth(parts[1]);
        setFormDay(parts[2]);
      }
      setFormYear(editingEvent.startingYear ? String(editingEvent.startingYear) : "");
    } else {
      setFormMonth("01");
      setFormDay("01");
      setFormYear("");
    }
  }, [editingEvent, reset]);

  useEffect(() => {
    const finalYear = formYear.trim() ? formYear.trim() : "2004";
    const finalDate = `${finalYear}-${formMonth.padStart(2, "0")}-${formDay.padStart(2, "0")}`;
    setValue("recurringDate", finalDate);
    setValue("startingYear", formYear.trim() ? Number(formYear) : undefined);
  }, [formMonth, formDay, formYear, setValue]);

  async function onSubmit(data: EventFormData) {
    setError(null);

    // Duplicate Prevention (Fix 6)
    if (!editingEvent) {
      const allEvents = await db.events.toArray();
      const duplicate = allEvents.find(
        (e) =>
          e.personName.trim().toLowerCase() === data.personName.trim().toLowerCase() &&
          e.eventType === data.eventType &&
          e.recurringDate === data.recurringDate
      );

      if (duplicate) {
        setError("Reminder already exists");
        return;
      }
    }

    const phone = data.whatsappNumber || "";
    const cleanPhone = phone.replace(/[^\d]/g, "");
    const normalizedPhone = cleanPhone ? `91${cleanPhone}` : "";

    const nextReminder = calculateNextReminderAt({
      recurringDate: data.recurringDate,
      reminderOffsetDays: Number(data.reminderOffsetDays),
      reminderTime: data.reminderTime,
      timezone: data.timezone,
    });

    if (editingEvent) {
      await updateEvent({
        ...editingEvent,
        ...data,
        whatsappNumber: normalizedPhone,
        nextReminderAt: nextReminder,
        reminderOffsetDays: Number(data.reminderOffsetDays),
        updatedAt: new Date().toISOString(),
        version: (editingEvent.version || 1) + 1,
      });
      clearEditing();
    } else {
      await addEvent({
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        ...data,
        whatsappNumber: normalizedPhone,
        nextReminderAt: nextReminder,
        reminderOffsetDays: Number(data.reminderOffsetDays),
      } as any);
    }

    reset({
      eventType: "birthday",
      relationshipType: "friend",
      isFavorite: false,
      tone: "warm",
      reminderOffsetDays: 0,
      reminderTime: "09:00",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      preferredReminderChannel: "whatsapp",
      whatsappNumber: "",
    } as any);

    onEventSaved();
  }


  const selectedEventConfig = EVENT_TYPES.find(e => e.value === selectedEventType);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs font-medium flex items-center justify-between animate-in fade-in-0 duration-200">
          <span>⚠️ {error}</span>
          <button type="button" onClick={() => setError(null)} className="text-rose-400 hover:text-white font-bold cursor-pointer text-sm">×</button>
        </div>
      )}
      {/* Person name */}
      <div>
        <label className={labelClasses}>Person Name</label>
        <input
          {...register("personName")}
          placeholder="e.g. Rahul Sharma"
          className={inputClasses}
        />
      </div>

      {/* Relationship type */}
      <div>
        <label className={labelClasses}>Relationship</label>
        <select {...register("relationshipType")} className={selectClasses}>
          {RELATIONSHIP_TYPES.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Favorite toggle */}
      <label className="flex items-center gap-3 py-1 cursor-pointer select-none group">
        <div className="relative">
          <input
            type="checkbox"
            {...register("isFavorite")}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-white/10 border border-white/15 rounded-full peer-checked:bg-violet-600 peer-checked:border-violet-500 transition-colors duration-200" />
          <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5 shadow-sm" />
        </div>
        <span className="text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
          Mark as Favourite ⭐
        </span>
      </label>

      {/* Event type — visual grid */}
      <div>
        <label className={labelClasses}>Event Type</label>
        <select {...register("eventType")} className={selectClasses}>
          {EVENT_TYPES.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
        {selectedEventConfig && (
          <p className="text-[11px] text-gray-600 mt-1.5 ml-1">
            {selectedEventConfig.desc}
          </p>
        )}
      </div>

      {/* Celebration Date (Month + Day Dropdowns, Optional Year) */}
      <div className="space-y-1.5">
        <label className={labelClasses}>Celebration Date</label>
        <div className="grid grid-cols-3 gap-3">
          {/* Day Selector */}
          <div>
            <select
              value={formDay}
              onChange={(e) => setFormDay(e.target.value)}
              className={selectClasses}
            >
              {Array.from(
                {
                  length: [4, 6, 9, 11].includes(Number(formMonth))
                    ? 30
                    : Number(formMonth) === 2
                    ? 29
                    : 31,
                },
                (_, i) => {
                  const dStr = String(i + 1).padStart(2, "0");
                  return (
                    <option key={dStr} value={dStr}>
                      {i + 1}
                    </option>
                  );
                }
              )}
            </select>
          </div>

          {/* Month Selector */}
          <div>
            <select
              value={formMonth}
              onChange={(e) => {
                const newMonth = e.target.value;
                setFormMonth(newMonth);
                const maxDays = [4, 6, 9, 11].includes(Number(newMonth))
                  ? 30
                  : Number(newMonth) === 2
                  ? 29
                  : 31;
                if (Number(formDay) > maxDays) {
                  setFormDay(String(maxDays).padStart(2, "0"));
                }
              }}
              className={selectClasses}
            >
              {[
                { value: "01", label: "January" },
                { value: "02", label: "February" },
                { value: "03", label: "March" },
                { value: "04", label: "April" },
                { value: "05", label: "May" },
                { value: "06", label: "June" },
                { value: "07", label: "July" },
                { value: "08", label: "August" },
                { value: "09", label: "September" },
                { value: "10", label: "October" },
                { value: "11", label: "November" },
                { value: "12", label: "December" },
              ].map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Input (Optional) */}
          <div>
            <input
              type="number"
              value={formYear}
              onChange={(e) => setFormYear(e.target.value)}
              placeholder="Year (optional)"
              min={1900}
              max={new Date().getFullYear() + 10}
              className={inputClasses}
            />
          </div>
        </div>
        <input type="hidden" {...register("recurringDate")} />
        <input type="hidden" {...register("startingYear")} />
      </div>

      {/* WhatsApp number */}
      <div>
        <label className={labelClasses}>
          WhatsApp Number
          <span className="text-gray-600 ml-1 normal-case font-normal">(optional)</span>
        </label>
        <div className="flex items-center gap-2 w-full border border-white/10 rounded-xl bg-white/5 focus-within:ring-2 focus-within:ring-violet-500/30 transition overflow-hidden">
          <span className="pl-3.5 pr-2.5 py-3 border-r border-white/5 text-gray-500 text-sm select-none font-medium bg-white/[0.02]">
            +91
          </span>
          <input
            {...register("whatsappNumber")}
            placeholder="9876543210"
            maxLength={10}
            className="w-full p-3 pl-1.5 focus:outline-none bg-transparent text-gray-200 text-sm transition placeholder-gray-600"
          />
        </div>
        {errors.whatsappNumber && (
          <p className="text-rose-500 text-[11px] mt-1.5 font-medium ml-1">
            {errors.whatsappNumber.message}
          </p>
        )}
      </div>


      {/* Reminder timing — 2 col */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClasses}>Remind me</label>
          <select {...register("reminderOffsetDays")} className={selectClasses}>
            {REMINDER_OFFSETS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>At time</label>
          <input
            type="time"
            {...register("reminderTime")}
            className={inputClasses}
          />
        </div>
      </div>

      {/* AI Wish Tone */}
      <div>
        <label className={labelClasses}>AI Wish Tone</label>
        <select {...register("tone")} className={selectClasses}>
          {TONE_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Advanced toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full text-center text-xs font-semibold py-2.5 px-4 rounded-xl border border-dashed border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-center gap-1.5"
      >
        {showAdvanced ? (
          <><ChevronUp size={14} /> Hide extra details</>
        ) : (
          <><ChevronDown size={14} /> Add interests, gift ideas & notes</>
        )}
      </button>

      {showAdvanced && (
        <div key={editingEvent?.id || "new"} className="space-y-4 border-t border-white/8 pt-4">
          <div>
            <label className={labelClasses}>Nickname</label>
            <input
              {...register("nickname")}
              placeholder="e.g. Rahul Bhai, Dadi"
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Interests</label>
            <input
              placeholder="Football, Travel, Reading, Music..."
              defaultValue={editingEvent?.interests?.join(", ") || ""}
              onBlur={(e) =>
                setValue(
                  "interests",
                  e.target.value.split(",").map((v) => v.trim()).filter(Boolean)
                )
              }
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Gift Ideas</label>
            <input
              placeholder="Watch, Kindle, Shoes, Experience..."
              defaultValue={editingEvent?.giftIdeas?.join(", ") || ""}
              onBlur={(e) =>
                setValue(
                  "giftIdeas",
                  e.target.value.split(",").map((v) => v.trim()).filter(Boolean)
                )
              }
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Notes</label>
            <textarea
              {...register("notes")}
              placeholder="Any personal notes, inside jokes, memories..."
              className={`${inputClasses} min-h-[90px] resize-none`}
            />
          </div>

          <div>
            <label className={labelClasses}>Timezone</label>
            <input
              {...register("timezone")}
              className={inputClasses}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-xl cursor-pointer transition-colors duration-200 shadow-lg shadow-violet-600/20 font-semibold text-sm"
        >
          <Sparkles size={15} />
          {editingEvent ? "Save Changes" : "Add Reminder"}
        </button>

        {editingEvent && (
          <button
            type="button"
            onClick={() => {
              clearEditing();
              reset({
                eventType: "birthday",
                relationshipType: "friend",
                isFavorite: false,
                tone: "warm",
                reminderOffsetDays: 0,
                reminderTime: "09:00",
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                preferredReminderChannel: "whatsapp",
                whatsappNumber: "",
              } as any);
            }}
            className="px-5 py-3 rounded-xl cursor-pointer transition-colors duration-200 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white font-medium text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
