import { OccasionEvent } from "@/types/event";

export function getEventsForDate({
  events,
  date,
}: {
  events: OccasionEvent[];

  date: Date;
}) {
  return events.filter((event) => {
    const eventDate = new Date(
      event.recurringDate
    );

    return (
      eventDate.getDate() ===
        date.getDate() &&
      eventDate.getMonth() ===
        date.getMonth()
    );
  });
}
