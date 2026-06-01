import { AnalyticsData } from "@/types/analytics";

import AnalyticsCard from "./analytics-card";

export default function AnalyticsDashboard({
  analytics,
}: {
  analytics: AnalyticsData;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Occasionly Insights
        </h2>
        <p className="text-xs text-zinc-500">Key metrics for your relationships and upcoming reminders.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <AnalyticsCard
          title="Total Events"
          value={
            analytics.totalEvents
          }
        />

        <AnalyticsCard
          title="Birthdays"
          value={
            analytics.birthdays
          }
        />

        <AnalyticsCard
          title="Anniversaries"
          value={
            analytics.anniversaries
          }
        />

        <AnalyticsCard
          title="Favorites"
          value={
            analytics.favoriteContacts
          }
        />

        <AnalyticsCard
          title="This Week"
          value={
            analytics.upcomingThisWeek
          }
        />

        <AnalyticsCard
          title="Completion Rate"
          value={`${analytics.completionRate}%`}
        />
      </div>
    </section>
  );
}
