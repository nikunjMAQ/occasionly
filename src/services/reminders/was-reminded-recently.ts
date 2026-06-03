export function wasRemindedRecently(lastRemindedAt?: string | Date | null): boolean {
  if (!lastRemindedAt) return false;
  const lastReminded = new Date(lastRemindedAt);
  const now = new Date();
  
  // Prevent sending duplicate notifications within 23 hours
  const hoursSinceLast = (now.getTime() - lastReminded.getTime()) / (1000 * 60 * 60);
  return hoursSinceLast < 23;
}
