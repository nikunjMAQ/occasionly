export interface AnalyticsData {
  totalEvents: number;

  birthdays: number;

  anniversaries: number;

  favoriteContacts: number;

  upcomingThisWeek: number;

  completionRate: number;

  relationshipBreakdown: {
    friend: number;

    family: number;

    colleague: number;

    partner: number;

    other: number;
  };

  categories: {
    personal: number;

    career: number;

    memory: number;

    celebration: number;
  };
}
