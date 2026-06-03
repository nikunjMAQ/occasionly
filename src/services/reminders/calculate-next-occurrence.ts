export function calculateNextOccurrence(currentDate: Date | string | number) {
  const next = new Date(currentDate);
  next.setFullYear(next.getFullYear() + 1);
  return next;
}
