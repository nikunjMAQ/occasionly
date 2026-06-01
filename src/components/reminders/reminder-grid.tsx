import { ReminderItem } from "@/types/reminder";
import PremiumReminderCard from "./premium-reminder-card";

export default function ReminderGrid({
  reminders,
  onEdit,
  refresh,
}: {
  reminders: ReminderItem[];
  onEdit?: (event: any) => void;
  refresh?: () => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {reminders.map((reminder) => (
        <PremiumReminderCard
          key={reminder.event.id}
          reminder={reminder}
          onEdit={onEdit}
          refresh={refresh}
        />
      ))}
    </div>
  );
}
