export function buildWhatsAppUrl({
  number,
  message,
}: {
  number: string;

  message: string;
}) {
  return `https://wa.me/${number}?text=${encodeURIComponent(
    message
  )}`;
}

export function getSnoozeUntil(
  hours: number
) {
  const now = new Date();

  now.setHours(
    now.getHours() + hours
  );

  return now.toISOString();
}
