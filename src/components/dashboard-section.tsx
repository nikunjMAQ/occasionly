import { ReminderItem } from "@/types/reminder";

import ReminderCard from "./reminder-card";

export default function DashboardSection({
  title,
  reminders,
}: {
  title: string;

  reminders: ReminderItem[];
}) {
  if (reminders.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold capitalize">
        {title}
      </h2>

      <div className="space-y-4">
        {reminders.map(
          (reminder) => (
            <ReminderCard
              key={
                reminder.event.id
              }
              reminder={reminder}
            />
          )
        )}
      </div>
    </section>
  );
}
