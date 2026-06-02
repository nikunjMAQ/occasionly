/**
 * Resolves the appropriate Gemini instruction prefix based on the event type.
 */
export function getAiPrompt(type: string): string {
  switch (type) {
    case "birthday":
      return "Generate cheerful birthday wish";
    case "anniversary":
      return "Generate warm romantic or relationship anniversary greeting";
    case "promotion":
      return "Generate congratulatory professional message";
    case "festival":
      return "Generate warm and traditional festival greeting";
    case "graduation":
      return "Generate inspirational graduation congratulations";
    case "work_anniversary":
      return "Generate warm work anniversary congratulations";
    case "first_meeting":
      return "Generate nostalgic message commemorating first meeting anniversary";
    case "memorial":
      return "Generate respectful and warm memorial remembrance message";
    default:
      return "Generate friendly personalized greeting message";
  }
}
