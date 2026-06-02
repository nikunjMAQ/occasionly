import { z } from "zod";

export const eventSchema = z.object({
  personName: z.string().min(2),

  relationshipType: z.enum([
    "friend",
    "family",
    "colleague",
    "partner",
    "mentor",
    "acquaintance",
    "other",
  ]),

  isFavorite: z.boolean(),

  eventType: z.enum([
    "birthday",
    "anniversary",
    "graduation",
    "work_anniversary",
    "first_meeting",
    "memorial",
    "festival",
    "promotion",
    "custom",
  ]),

  recurringDate: z.string(),

  whatsappNumber: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        const clean = val.replace(/\s+/g, "");
        return /^[6-9]\d{9}$/.test(clean);
      },
      {
        message: "Please enter a valid 10-digit Indian phone number (starting with 6-9)",
      }
    )
    .optional()
    .default(""),


  reminderOffsetDays: z.coerce
    .number()
    .min(0)
    .max(365),

  reminderTime: z.string(),

  timezone: z.string(),

  preferredReminderChannel: z.enum([
    "whatsapp",
  ]),

  tone: z.enum([
    "funny",
    "formal",
    "emotional",
    "professional",
    "warm",
    "inspirational",
  ]),

  startingYear: z.coerce
    .number()
    .optional(),

  notes: z.string().optional(),

  nickname: z.string().optional(),

  interests: z.array(z.string()).optional(),

  giftIdeas: z.array(z.string()).optional(),
});

export type EventFormData =
  z.infer<typeof eventSchema>;
