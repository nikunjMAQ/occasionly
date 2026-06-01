"use client";

import { useState } from "react";
import { OccasionEvent } from "@/types/event";
import { Sparkles, Loader2, Copy, MessageCircle } from "lucide-react";

export default function AIWishGenerator({
  event,
}: {
  event: OccasionEvent;
}) {
  const [wish, setWish] = useState("");
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);

    try {
      const response = await fetch(
        "/api/generate-wish",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      const data = await response.json();
      setWish(data.wish);
    } catch (error) {
      console.error(error);
      setWish(`Wishing ${event.personName} a wonderful ${event.eventType}! 🎉`);
    } finally {
      setGenerating(false);
    }
  }

  const whatsappUrl = `https://wa.me/${
    event.whatsappNumber
  }?text=${encodeURIComponent(wish)}`;

  return (
    <div className="space-y-3 w-full">
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="w-full py-2.5 bg-violet-600 hover:bg-violet-750 disabled:opacity-50 text-white rounded-2xl font-bold flex items-center justify-center gap-2 text-xs transition duration-200 shadow-md shadow-violet-600/10 cursor-pointer"
      >
        {generating ? (
          <>
            <Loader2 className="animate-spin h-3.5 w-3.5" />
            Generating...
          </>
        ) : wish ? (
          <>
            <Sparkles size={13} />
            Regenerate Wish
          </>
        ) : (
          <>
            <Sparkles size={13} />
            Generate AI Wish
          </>
        )}
      </button>

      {wish && (
        <div className="space-y-2.5 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <div className="border border-white/10 rounded-2xl p-4 bg-white/[0.03] text-gray-250 text-xs leading-relaxed italic relative overflow-hidden select-text">
            {wish}
          </div>

          <div className="flex gap-2 text-[11px] font-bold">
            <a
              href={whatsappUrl}
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl transition duration-150 shadow-sm"
            >
              <MessageCircle size={12} />
              WhatsApp
            </a>

            <button
              onClick={() => navigator.clipboard.writeText(wish)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 py-2 px-3 rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5"
            >
              <Copy size={12} />
              Copy Wish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
