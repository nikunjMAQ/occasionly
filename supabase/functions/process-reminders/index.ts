import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// --- AI Prompt resolver ---
function getAiPrompt(type: string): string {
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

// --- Email Templates ---
function birthdayTemplate({
  personName,
  message,
  whatsappLink,
}: {
  personName: string;
  message: string;
  whatsappLink: string;
}) {
  return {
    subject: `🎉 ${personName}'s Birthday Today`,
    cta: "Send Birthday Wish",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Celebration Alert</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #0b0d12;
              color: #f8fafc;
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 24px;
              padding: 32px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              background: linear-gradient(to right, #818cf8, #a78bfa, #fb7185);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 24px;
              text-align: center;
            }
            .title {
              font-size: 28px;
              font-weight: 800;
              color: #ffffff;
              margin-top: 0;
              margin-bottom: 12px;
              text-align: center;
            }
            .description {
              color: #94a3b8;
              font-size: 14px;
              line-height: 1.6;
              margin-bottom: 28px;
              text-align: center;
            }
            .wish-card {
              background-color: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.06);
              border-radius: 16px;
              padding: 24px;
              margin-bottom: 28px;
            }
            .wish-label {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #fb7185;
              margin-bottom: 12px;
            }
            .wish-text {
              color: #e2e8f0;
              font-size: 15px;
              line-height: 1.6;
              font-style: italic;
              margin: 0;
            }
            .btn-container {
              text-align: center;
            }
            .btn-primary {
              display: inline-block;
              background: linear-gradient(135deg, #ec4899, #db2777);
              color: #ffffff !important;
              font-weight: 700;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 12px;
              box-shadow: 0 4px 14px rgba(236, 72, 153, 0.3);
              transition: all 0.2s ease;
            }
            .footer {
              margin-top: 36px;
              font-size: 11px;
              color: #475569;
              text-align: center;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Occasionly 🎉</div>
            <h2 class="title">🎂 It's ${personName}'s Birthday Today!</h2>
            <p class="description">
              Nurture your connection network today by celebrating this birthday. We've customized a tailored AI wish for ${personName} based on your notes.
            </p>
            <div class="wish-card">
              <div class="wish-label">Suggested Birthday Wish</div>
              <p class="wish-text">"${message}"</p>
            </div>
            <div class="btn-container">
              <a href="${whatsappLink}" class="btn-primary" target="_blank">
                Send Birthday Wish
              </a>
            </div>
            <div class="footer">
              Sent automatically by Occasionly Relationship OS. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

function anniversaryTemplate({
  personName,
  message,
  whatsappLink,
}: {
  personName: string;
  message: string;
  whatsappLink: string;
}) {
  return {
    subject: `❤️ Happy Anniversary: ${personName}`,
    cta: "Send Anniversary Wish",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Anniversary Alert</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #0b0d12;
              color: #f8fafc;
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 24px;
              padding: 32px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              background: linear-gradient(to right, #818cf8, #a78bfa, #fb7185);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 24px;
              text-align: center;
            }
            .title {
              font-size: 28px;
              font-weight: 800;
              color: #ffffff;
              margin-top: 0;
              margin-bottom: 12px;
              text-align: center;
            }
            .description {
              color: #94a3b8;
              font-size: 14px;
              line-height: 1.6;
              margin-bottom: 28px;
              text-align: center;
            }
            .wish-card {
              background-color: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.06);
              border-radius: 16px;
              padding: 24px;
              margin-bottom: 28px;
            }
            .wish-label {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #f43f5e;
              margin-bottom: 12px;
            }
            .wish-text {
              color: #e2e8f0;
              font-size: 15px;
              line-height: 1.6;
              font-style: italic;
              margin: 0;
            }
            .btn-container {
              text-align: center;
            }
            .btn-primary {
              display: inline-block;
              background: linear-gradient(135deg, #e11d48, #be123c);
              color: #ffffff !important;
              font-weight: 700;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 12px;
              box-shadow: 0 4px 14px rgba(225, 29, 72, 0.3);
              transition: all 0.2s ease;
            }
            .footer {
              margin-top: 36px;
              font-size: 11px;
              color: #475569;
              text-align: center;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Occasionly 🎉</div>
            <h2 class="title">❤️ Happy Anniversary to ${personName}!</h2>
            <p class="description">
              Celebrate this anniversary milestone with ${personName}. We've customized a tailored AI wish for them based on your notes.
            </p>
            <div class="wish-card">
              <div class="wish-label">Suggested Anniversary Wish</div>
              <p class="wish-text">"${message}"</p>
            </div>
            <div class="btn-container">
              <a href="${whatsappLink}" class="btn-primary" target="_blank">
                Send Anniversary Wish
              </a>
            </div>
            <div class="footer">
              Sent automatically by Occasionly Relationship OS. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

function promotionTemplate({
  personName,
  message,
  whatsappLink,
}: {
  personName: string;
  message: string;
  whatsappLink: string;
}) {
  return {
    subject: `🚀 Congratulate ${personName} on their Promotion`,
    cta: "Send Congratulations",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Promotion Alert</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #0b0d12;
              color: #f8fafc;
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 24px;
              padding: 32px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              background: linear-gradient(to right, #818cf8, #a78bfa, #fb7185);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 24px;
              text-align: center;
            }
            .title {
              font-size: 28px;
              font-weight: 800;
              color: #ffffff;
              margin-top: 0;
              margin-bottom: 12px;
              text-align: center;
            }
            .description {
              color: #94a3b8;
              font-size: 14px;
              line-height: 1.6;
              margin-bottom: 28px;
              text-align: center;
            }
            .wish-card {
              background-color: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.06);
              border-radius: 16px;
              padding: 24px;
              margin-bottom: 28px;
            }
            .wish-label {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #60a5fa;
              margin-bottom: 12px;
            }
            .wish-text {
              color: #e2e8f0;
              font-size: 15px;
              line-height: 1.6;
              font-style: italic;
              margin: 0;
            }
            .btn-container {
              text-align: center;
            }
            .btn-primary {
              display: inline-block;
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              color: #ffffff !important;
              font-weight: 700;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 12px;
              box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
              transition: all 0.2s ease;
            }
            .footer {
              margin-top: 36px;
              font-size: 11px;
              color: #475569;
              text-align: center;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Occasionly 🎉</div>
            <h2 class="title">🚀 Congratulate ${personName}!</h2>
            <p class="description">
              Celebrate ${personName}'s career advancement. We've customized a tailored AI wish for them based on your notes.
            </p>
            <div class="wish-card">
              <div class="wish-label">Suggested Congratulatory Message</div>
              <p class="wish-text">"${message}"</p>
            </div>
            <div class="btn-container">
              <a href="${whatsappLink}" class="btn-primary" target="_blank">
                Send Congratulations
              </a>
            </div>
            <div class="footer">
              Sent automatically by Occasionly Relationship OS. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

function festivalTemplate({
  personName,
  message,
  whatsappLink,
}: {
  personName: string;
  message: string;
  whatsappLink: string;
}) {
  return {
    subject: `🪔 Festival Greetings with ${personName}`,
    cta: "Send Festival Greetings",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Festival Greetings</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #0b0d12;
              color: #f8fafc;
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 24px;
              padding: 32px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              background: linear-gradient(to right, #818cf8, #a78bfa, #fb7185);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 24px;
              text-align: center;
            }
            .title {
              font-size: 28px;
              font-weight: 800;
              color: #ffffff;
              margin-top: 0;
              margin-bottom: 12px;
              text-align: center;
            }
            .description {
              color: #94a3b8;
              font-size: 14px;
              line-height: 1.6;
              margin-bottom: 28px;
              text-align: center;
            }
            .wish-card {
              background-color: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.06);
              border-radius: 16px;
              padding: 24px;
              margin-bottom: 28px;
            }
            .wish-label {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #fbbf24;
              margin-bottom: 12px;
            }
            .wish-text {
              color: #e2e8f0;
              font-size: 15px;
              line-height: 1.6;
              font-style: italic;
              margin: 0;
            }
            .btn-container {
              text-align: center;
            }
            .btn-primary {
              display: inline-block;
              background: linear-gradient(135deg, #f59e0b, #d97706);
              color: #ffffff !important;
              font-weight: 700;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 12px;
              box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);
              transition: all 0.2s ease;
            }
            .footer {
              margin-top: 36px;
              font-size: 11px;
              color: #475569;
              text-align: center;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Occasionly 🎉</div>
            <h2 class="title">🪔 Festival Greetings to ${personName}!</h2>
            <p class="description">
              Connect with ${personName} during this festive time. We've customized a tailored AI wish for them based on your notes.
            </p>
            <div class="wish-card">
              <div class="wish-label">Suggested Festival Wish</div>
              <p class="wish-text">"${message}"</p>
            </div>
            <div class="btn-container">
              <a href="${whatsappLink}" class="btn-primary" target="_blank">
                Send Festival Greetings
              </a>
            </div>
            <div class="footer">
              Sent automatically by Occasionly Relationship OS. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

function genericTemplate({
  personName,
  message,
  whatsappLink,
}: {
  personName: string;
  message: string;
  whatsappLink: string;
}) {
  return {
    subject: `✨ Special Moment: ${personName}`,
    cta: "Send a Friendly Message",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Special Milestone Alert</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #0b0d12;
              color: #f8fafc;
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 24px;
              padding: 32px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              background: linear-gradient(to right, #818cf8, #a78bfa, #fb7185);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 24px;
              text-align: center;
            }
            .title {
              font-size: 28px;
              font-weight: 800;
              color: #ffffff;
              margin-top: 0;
              margin-bottom: 12px;
              text-align: center;
            }
            .description {
              color: #94a3b8;
              font-size: 14px;
              line-height: 1.6;
              margin-bottom: 28px;
              text-align: center;
            }
            .wish-card {
              background-color: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.06);
              border-radius: 16px;
              padding: 24px;
              margin-bottom: 28px;
            }
            .wish-label {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #a78bfa;
              margin-bottom: 12px;
            }
            .wish-text {
              color: #e2e8f0;
              font-size: 15px;
              line-height: 1.6;
              font-style: italic;
              margin: 0;
            }
            .btn-container {
              text-align: center;
            }
            .btn-primary {
              display: inline-block;
              background: linear-gradient(135deg, #6d28d9, #4f46e5);
              color: #ffffff !important;
              font-weight: 700;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 12px;
              box-shadow: 0 4px 14px rgba(109, 40, 217, 0.3);
              transition: all 0.2s ease;
            }
            .footer {
              margin-top: 36px;
              font-size: 11px;
              color: #475569;
              text-align: center;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Occasionly 🎉</div>
            <h2 class="title">✨ Special Milestone: ${personName}!</h2>
            <p class="description">
              A special moment has arrived for ${personName}. We've customized a tailored AI wish for them based on your notes.
            </p>
            <div class="wish-card">
              <div class="wish-label">Suggested Message Text</div>
              <p class="wish-text">"${message}"</p>
            </div>
            <div class="btn-container">
              <a href="${whatsappLink}" class="btn-primary" target="_blank">
                Send a Friendly Message
              </a>
            </div>
            <div class="footer">
              Sent automatically by Occasionly Relationship OS. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

function getTemplate(type: string) {
  switch (type) {
    case "birthday":
      return birthdayTemplate;
    case "anniversary":
      return anniversaryTemplate;
    case "promotion":
      return promotionTemplate;
    case "festival":
      return festivalTemplate;
    default:
      return genericTemplate;
  }
}

function parseZonedTimeToUtc(dateStr: string, timeZone: string): Date {
  const utcDate = new Date(dateStr + "Z");
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
  
  const parts = formatter.formatToParts(utcDate);
  const partVal = (type: string) => parts.find(p => p.type === type)!.value;
  
  const year = parseInt(partVal("year"));
  const month = parseInt(partVal("month"));
  const day = parseInt(partVal("day"));
  let hour = parseInt(partVal("hour"));
  if (hour === 24) hour = 0;
  const minute = parseInt(partVal("minute"));
  const second = parseInt(partVal("second"));
  
  const formattedUtc = Date.UTC(year, month - 1, day, hour, minute, second);
  const diff = utcDate.getTime() - formattedUtc;
  
  return new Date(utcDate.getTime() + diff);
}

function calculateNextReminderAtZoned({
  occasionDate,
  reminderDaysBefore,
  reminderTime,
  timezone,
  referenceDate,
}: {
  occasionDate: string;
  reminderDaysBefore: number;
  reminderTime: string;
  timezone: string;
  referenceDate: Date;
}): string {
  const parts = occasionDate.split("-");
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  
  let targetYear = referenceDate.getFullYear();
  let reminderZoned: Date;
  
  while (true) {
    const celebrationDateStr = `${targetYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${reminderTime}:00`;
    const celebrationZoned = parseZonedTimeToUtc(celebrationDateStr, timezone);
    
    const candidateReminder = new Date(celebrationZoned);
    candidateReminder.setDate(candidateReminder.getDate() - reminderDaysBefore);
    
    if (candidateReminder > referenceDate) {
      reminderZoned = candidateReminder;
      break;
    }
    targetYear += 1;
  }
  return reminderZoned.toISOString();
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  // 1. Authorize calling client via service role key
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || authHeader !== `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const now = new Date().toISOString();
  console.log(`[Scheduler Triggered] Processing due reminders at: ${now}`);

  // 2. Query and lock active and due events atomically
  const { data: reminders, error: queryError } = await supabase
    .from("events")
    .update({ processing: true })
    .eq("reminder_enabled", true)
    .or("processing.eq.false,processing.is.null")
    .lte("next_reminder_at", now)
    .select();

  if (queryError) {
    console.error("Scheduler query failed:", queryError);
    return new Response(
      JSON.stringify({
        error: "Failed to load active reminders from database",
        details: queryError,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || "";
  const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";

  const processed = [];
  const failures = [];

  for (const reminder of reminders || []) {
    const reminderId = reminder.id;
    const userId = reminder.user_id;

    try {
      // 1. Failure Retry Protection (Limit to 3 failures today to avoid infinite retry spam)
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { count, error: countError } = await supabase
        .from("reminder_deliveries")
        .select("*", { count: "exact", head: true })
        .eq("reminder_id", reminderId)
        .eq("status", "failed")
        .gte("created_at", todayStart.toISOString());

      if (countError) {
        console.warn(`Error querying delivery records for ${reminderId}:`, countError);
      }

      if (count !== null && count >= 3) {
        console.warn(`Skipping reminder ${reminderId} - exceeded max failures today.`);
        // Reschedule to next year anyway so we don't get stuck in a loop forever
        const nextReminder = calculateNextReminderAtZoned({
          occasionDate: reminder.occasion_date,
          reminderDaysBefore: reminder.reminder_days_before || 0,
          reminderTime: reminder.reminder_time || "09:00",
          timezone: reminder.timezone || "UTC",
          referenceDate: new Date(),
        });

        await supabase
          .from("events")
          .update({
            next_reminder_at: nextReminder,
            processing: false, // Release lock
          })
          .eq("id", reminderId);

        failures.push({
          id: reminderId,
          reason: "Max failures exceeded today",
        });
        continue;
      }

      // 2. Duplicate Protection (Verify last_reminded_at and recent successful deliveries)
      if (reminder.last_reminded_at) {
        const lastReminded = new Date(reminder.last_reminded_at);
        const hoursSinceLast = (new Date().getTime() - lastReminded.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLast < 23) {
          console.log(`[Duplicate Skip] Reminder ${reminderId} already sent recently (last_reminded_at: ${reminder.last_reminded_at}).`);
          await supabase.from("events").update({ processing: false }).eq("id", reminderId);
          continue;
        }
      }

      const { data: recentDeliveries, error: deliveryCheckErr } = await supabase
        .from("reminder_deliveries")
        .select("id")
        .eq("reminder_id", reminderId)
        .eq("status", "delivered")
        .gte("created_at", new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString());

      if (deliveryCheckErr) {
        console.warn(`Error checking recent deliveries for ${reminderId}:`, deliveryCheckErr);
      }

      if (recentDeliveries && recentDeliveries.length > 0) {
        console.log(`[Duplicate Skip] Successful delivery log found for reminder ${reminderId} in last 23 hours.`);
        await supabase.from("events").update({ processing: false }).eq("id", reminderId);
        continue;
      }

      // 3. Fetch Connection Owner Email details
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (userError || !userData?.user) {
        throw new Error(
          `Failed to resolve connection owner ${userId}: ${userError?.message || "Profile not found"}`
        );
      }

      const userEmail = userData.user.email;
      if (!userEmail) {
        throw new Error(`Owner ${userId} has no registered email destination`);
      }

      // 4. AI Wish generation via Gemini Flash API
      const occasion = reminder.occasion_type || "celebration";
      const tone = reminder.tone || "warm";
      const relationship = reminder.relationship_type || "friend";
      const nickname = reminder.nickname || "";
      const interests = reminder.interests || [];
      const notes = reminder.notes || "";
      const personName = reminder.person_name || "Connection";

      const promptPrefix = getAiPrompt(occasion);

      const prompt = `${promptPrefix}
 
Relationship details:
- Relationship: ${relationship}
- Person name: ${personName}
${nickname ? `- Nickname: ${nickname}\n` : ""}
${interests.length > 0 ? `- Interests: ${interests.join(", ")}\n` : ""}
${notes ? `- Personal Context: ${notes}\n` : ""}
 
Rules:
- Keep the wish under 30 words (highly concise, punchy, and premium)
- Write in a natural, warm, and authentic human tone (no generic greetings or corporate speak)
- Do NOT include hashtags
- Do NOT wrap in quotation marks
- Match the requested tone: "${tone}"
- Use the person's name or nickname naturally
- Make it emotionally intelligent, high-impact, and premium.`;

      let wish = `Wishing you a wonderful ${occasion}! 🎉`;

      if (geminiApiKey) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: prompt,
                      },
                    ],
                  },
                ],
              }),
            }
          );
          if (response.ok) {
            const resData = await response.json();
            const geminiWish = resData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (geminiWish) {
              wish = geminiWish;
            }
          } else {
            console.warn(`Gemini API returned code: ${response.status}`);
          }
        } catch (geminiErr) {
          console.error("AI Wish generation failed. Using default template:", geminiErr);
        }
      }

      // 5. WhatsApp deep link
      const cleanPhone = (reminder.whatsapp_number || "").replace(/[^\d]/g, "");
      const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(wish)}`;

      // 6. Resolve email template
      const templateFn = getTemplate(occasion);
      const emailContent = templateFn({
        personName,
        message: wish,
        whatsappLink,
      });

      // 7. Send email via Resend
      if (!resendApiKey) {
        throw new Error("RESEND_API_KEY environment variable is not configured");
      }

      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Occasionly <onboarding@resend.dev>",
          to: [userEmail],
          subject: emailContent.subject,
          html: emailContent.html,
        }),
      });

      if (!emailResponse.ok) {
        const emailErr = await emailResponse.text();
        throw new Error(`Resend API returned failure: ${emailErr}`);
      }

      // 8. Log success record
      const { error: logError } = await supabase
        .from("reminder_deliveries")
        .insert({
          reminder_id: reminderId,
          user_id: userId,
          delivery_type: "email",
          status: "delivered",
          delivered_at: new Date().toISOString(),
        });

      if (logError) {
        console.warn(`Could not insert success log for reminder ${reminderId}:`, logError);
      }

      // 9. Send push notification (best-effort — never blocks email delivery)
      const appUrl = Deno.env.get("NEXT_PUBLIC_APP_URL") || "";
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

      if (appUrl && serviceRoleKey) {
        try {
          const pushRes = await fetch(`${appUrl}/api/send-push`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${serviceRoleKey}`,
            },
            body: JSON.stringify({
              user_id: userId,
              title: emailContent.subject,
              body: `Tap to send your wish to ${personName} on WhatsApp 💬`,
              url: whatsappLink,
            }),
          });
          const pushData = await pushRes.json();
          console.log(`[Push] Delivery for reminder ${reminderId}:`, pushData);
        } catch (pushErr) {
          // Push failure is non-fatal — email was already delivered
          console.warn(`[Push] Non-fatal push error for reminder ${reminderId}:`, pushErr);
        }
      } else {
        console.log(`[Push] Skipped — NEXT_PUBLIC_APP_URL or service role key not configured.`);
      }

      // 10. Update last reminded and reschedule next occurrence in target timezone
      const nextReminder = calculateNextReminderAtZoned({
        occasionDate: reminder.occasion_date,
        reminderDaysBefore: reminder.reminder_days_before || 0,
        reminderTime: reminder.reminder_time || "09:00",
        timezone: reminder.timezone || "UTC",
        referenceDate: new Date(),
      });

      const { error: updateError } = await supabase
        .from("events")
        .update({
          last_reminded_at: new Date().toISOString(),
          next_reminder_at: nextReminder,
          processing: false, // Release lock
        })
        .eq("id", reminderId);

      if (updateError) {
        throw new Error(`Recurrence rescheduling write failed: ${updateError.message}`);
      }

      console.log(`Successfully completed execution for reminder ID: ${reminderId}`);
      processed.push(reminderId);

    } catch (err: any) {
      console.error(`Execution error for reminder ID ${reminderId}:`, err);
      failures.push({
        id: reminderId,
        reason: err.message || err.toString(),
      });

      try {
        await supabase
          .from("reminder_deliveries")
          .insert({
            reminder_id: reminderId,
            user_id: userId,
            delivery_type: "email",
            status: "failed",
            error_message: err.message || err.toString(),
          });
      } catch (dbLogErr) {
        console.error(`Could not write failed delivery log to Supabase:`, dbLogErr);
      }

      // Space out retries on failure (backoff)
      try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const { count: failCount } = await supabase
          .from("reminder_deliveries")
          .select("*", { count: "exact", head: true })
          .eq("reminder_id", reminderId)
          .eq("status", "failed")
          .gte("created_at", todayStart.toISOString());
        
        const currentFailures = (failCount || 0);

        let nextRetry: Date;
        if (currentFailures >= 3) {
          console.warn(`Rescheduling reminder ${reminderId} to next year due to consecutive failures.`);
          nextRetry = new Date(calculateNextReminderAtZoned({
            occasionDate: reminder.occasion_date,
            reminderDaysBefore: reminder.reminder_days_before || 0,
            reminderTime: reminder.reminder_time || "09:00",
            timezone: reminder.timezone || "UTC",
            referenceDate: new Date(),
          }));
        } else {
          // Space out retries: 1st -> +15m, 2nd -> +1h
          const delayMs = currentFailures === 1 ? 15 * 60 * 1000 : 60 * 60 * 1000;
          nextRetry = new Date(Date.now() + delayMs);
          console.log(`Scheduling retry ${currentFailures} for reminder ${reminderId} in ${delayMs / 60000} minutes.`);
        }

        await supabase
          .from("events")
          .update({
            processing: false, // Release lock
            next_reminder_at: nextRetry.toISOString(),
          })
          .eq("id", reminderId);
      } catch (updateErr) {
        console.error(`Could not reset processing lock/retry time for reminder ${reminderId}:`, updateErr);
      }
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      processed_count: processed.length,
      processed_ids: processed,
      failures_count: failures.length,
      failures,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
});
