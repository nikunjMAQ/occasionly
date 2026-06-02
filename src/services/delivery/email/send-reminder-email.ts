import { resend } from "@/lib/resend";

/**
 * Dispatches a transaction email alert containing connection milestone details.
 * 
 * @param to Recipient email address (note: sandbox restricted to account owner).
 * @param subject Email subject header text.
 * @param html Formatted HTML string content template.
 */
export async function sendReminderEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return resend.emails.send({
    from: "Occasionly <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
}
