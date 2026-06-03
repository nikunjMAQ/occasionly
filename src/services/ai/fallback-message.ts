export function getFallbackMessage({
  personName,
  type,
}: {
  personName: string;
  type: string;
}): string {
  switch (type) {
    case "birthday":
      return `Happy Birthday ${personName}! Wishing you happiness and success.`;
    case "anniversary":
      return `Happy Anniversary ${personName}! Wishing you both a wonderful journey ahead.`;
    default:
      return `Best wishes to ${personName}!`;
  }
}
