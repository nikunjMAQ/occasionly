import { OccasionEvent } from "@/types/event";

import { EventInsight } from "@/types/insight";

export function generateInsights(
  event: OccasionEvent
): EventInsight[] {
  const insights: EventInsight[] =
    [];

  if (!event.startingYear) {
    return insights;
  }

  const currentYear =
    new Date().getFullYear();

  const years =
    currentYear -
    event.startingYear;

  if (
    event.eventType ===
    "birthday"
  ) {
    insights.push({
      label: `Turning ${years}`,
      emoji: "🎂",
    });
  }

  if (
    event.eventType ===
    "anniversary"
  ) {
    insights.push({
      label: `${years} Year Anniversary`,
      emoji: "💍",
    });

    if (years === 25) {
      insights.push({
        label:
          "Silver Jubilee",
        emoji: "🥈",
      });
    }

    if (years === 50) {
      insights.push({
        label:
          "Golden Jubilee",
        emoji: "🥇",
      });
    }
  }

  return insights;
}
