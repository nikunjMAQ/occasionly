import { OccasionEvent } from "@/types/event";
import { occasionMeta } from "@/constants/occasion-meta";

export function buildWishPrompt(event: OccasionEvent) {
  const currentYear = new Date().getFullYear();
  const years = event.startingYear ? currentYear - event.startingYear : null;
  const meta = occasionMeta[event.eventType] ?? occasionMeta.custom;

  let milestoneContext = "";
  if (years && years > 0) {
    if (event.eventType === "birthday") {
      milestoneContext = `They are turning ${years} years old.`;
    } else if (event.eventType === "anniversary") {
      milestoneContext = `They are celebrating ${years} years of relationship/marriage together.`;
    } else if (event.eventType === "work_anniversary") {
      milestoneContext = `They are celebrating ${years} years at their job/company.`;
    } else if (event.eventType === "first_meeting") {
      milestoneContext = `It has been ${years} years since you first met.`;
    } else {
      milestoneContext = `This is the ${years}th year milestone of this event.`;
    }
  }

  let enrichmentContext = "";
  if (event.nickname) {
    enrichmentContext += `Nickname/How you address them: ${event.nickname}\n`;
  }
  if (event.interests && event.interests.length > 0) {
    enrichmentContext += `Interests & Hobbies: ${event.interests.join(", ")}\n`;
  }
  if (event.giftIdeas && event.giftIdeas.length > 0) {
    enrichmentContext += `Potential Gift Ideas: ${event.giftIdeas.join(", ")}\n`;
  }
  if (event.notes) {
    enrichmentContext += `Personal notes/inside jokes/context: ${event.notes}\n`;
  }

  return `
Generate a ${event.tone} wish for ${event.personName} for their ${meta.label}.

Specific context instructions:
${meta.aiContext}

Relationship details:
- Relationship: ${event.relationshipType || "friend"}
${milestoneContext ? `- Milestone: ${milestoneContext}\n` : ""}
${enrichmentContext ? `- Personal context:\n${enrichmentContext}` : ""}

Rules for the output:
- Keep the wish under 30 words (highly concise, punchy, and premium)
- Write in a natural, warm, and authentic human tone (no generic greetings or corporate speak)
- Do NOT include hashtags
- Do NOT wrap in quotation marks
- Match the requested tone: "${event.tone}"
- Use the person's name or nickname naturally
- Make it emotionally intelligent, high-impact, and premium.
`;
}
