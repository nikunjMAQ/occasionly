import { OccasionEvent } from "@/types/event";
import { generateInsights } from "@/services/insight-service";

export default function EventInsights({
  event,
}: {
  event: OccasionEvent;
}) {
  const insights = generateInsights(event);

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {insights.map((insight, index) => (
        <div
          key={index}
          className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800 rounded-full px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1 shadow-3xs"
        >
          <span>{insight.emoji}</span>
          <span>{insight.label}</span>
        </div>
      ))}
    </div>
  );
}
