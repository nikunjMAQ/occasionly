"use client";

import { OccasionEvent } from "@/types/event";

export default function ContactSummary({
  event,
}: {
  event: OccasionEvent;
}) {
  const hasNickname = !!event.nickname;
  const hasInterests = !!(event.interests && event.interests.length > 0);
  const hasGiftIdeas = !!(event.giftIdeas && event.giftIdeas.length > 0);
  const hasNotes = !!event.notes;

  if (!hasNickname && !hasInterests && !hasGiftIdeas && !hasNotes) {
    return null;
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800 space-y-2.5 text-sm text-gray-600 dark:text-zinc-400">
      {hasNickname && (
        <p className="flex items-center gap-1.5">
          <span className="font-medium text-gray-500 dark:text-zinc-500">Nickname:</span>
          <span className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md font-medium text-gray-800 dark:text-zinc-200 text-xs">
            {event.nickname}
          </span>
        </p>
      )}

      {hasInterests && (
        <div className="space-y-1">
          <span className="font-medium text-gray-500 dark:text-zinc-500 text-xs block">Interests:</span>
          <div className="flex flex-wrap gap-1.5">
            {event.interests?.map((interest, idx) => (
              <span
                key={idx}
                className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
              >
                <span>✨</span>
                <span>{interest}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {hasGiftIdeas && (
        <div className="space-y-1">
          <span className="font-medium text-gray-500 dark:text-zinc-500 text-xs block">Gift Ideas:</span>
          <div className="flex flex-wrap gap-1.5">
            {event.giftIdeas?.map((gift, idx) => (
              <span
                key={idx}
                className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
              >
                <span>🎁</span>
                <span>{gift}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {hasNotes && (
        <div className="bg-gray-50/70 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-500 dark:text-zinc-400 italic">
          <span className="font-semibold text-gray-600 dark:text-zinc-300 not-italic block mb-0.5 text-[10px] uppercase tracking-wider">
            Notes:
          </span>
          "{event.notes}"
        </div>
      )}
    </div>
  );
}
