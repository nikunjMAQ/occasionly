import { OccasionEvent } from "@/types/event";

import { ReminderLog } from "@/types/reminder-log";

import { AnalyticsData } from "@/types/analytics";

import { occasionMeta } from "@/constants/occasion-meta";

export function generateAnalytics({
  events,
  logs,
}: {
  events: OccasionEvent[];

  logs: ReminderLog[];
}): AnalyticsData {
  const birthdays =
    events.filter(
      (e) =>
        e.eventType ===
        "birthday"
    ).length;

  const anniversaries =
    events.filter(
      (e) =>
        e.eventType ===
        "anniversary"
    ).length;

  const favoriteContacts =
    events.filter(
      (e) => e.isFavorite
    ).length;

  const upcomingThisWeek =
    events.filter((event) => {
      const today =
        new Date();

      const date = new Date(
        event.recurringDate
      );

      const nextOccurrence =
        new Date(
          today.getFullYear(),
          date.getMonth(),
          date.getDate()
        );

      const diff =
        nextOccurrence.getTime() -
        today.getTime();

      const days =
        diff /
        (1000 *
          60 *
          60 *
          24);

      return (
        days >= 0 &&
        days <= 7
      );
    }).length;

  const sentLogs =
    logs.filter(
      (l) =>
        l.status === "sent"
    ).length;

  const completionRate =
    logs.length === 0
      ? 0
      : Math.round(
          (sentLogs /
            logs.length) *
            100
        );

  return {
    totalEvents: events.length,

    birthdays,

    anniversaries,

    favoriteContacts,

    upcomingThisWeek,

    completionRate,

    relationshipBreakdown: {
      friend: events.filter(
        (e) =>
          (e.relationshipType || "friend") ===
          "friend"
      ).length,

      family: events.filter(
        (e) =>
          e.relationshipType ===
          "family"
      ).length,

      colleague:
        events.filter(
          (e) =>
            e.relationshipType ===
            "colleague"
        ).length,

      partner: events.filter(
        (e) =>
          e.relationshipType ===
          "partner"
      ).length,

      other: events.filter(
        (e) =>
          e.relationshipType ===
          "other"
      ).length,
    },

    categories: {
      personal: events.filter(
        (e) => (occasionMeta[e.eventType] || occasionMeta.custom).category === "personal"
      ).length,

      career: events.filter(
        (e) => (occasionMeta[e.eventType] || occasionMeta.custom).category === "career"
      ).length,

      memory: events.filter(
        (e) => (occasionMeta[e.eventType] || occasionMeta.custom).category === "memory"
      ).length,

      celebration: events.filter(
        (e) => (occasionMeta[e.eventType] || occasionMeta.custom).category === "celebration"
      ).length,
    },
  };
}
