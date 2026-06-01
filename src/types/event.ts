export type EventType =
  | "birthday"
  | "anniversary"
  | "graduation"
  | "work_anniversary"
  | "first_meeting"
  | "memorial"
  | "festival"
  | "promotion"
  | "custom";

export type ToneType =
  | "funny"
  | "formal"
  | "emotional"
  | "professional"
  | "warm"
  | "inspirational";

export type ReminderChannel =
  | "whatsapp";

export type RelationshipType =
  | "friend"
  | "family"
  | "colleague"
  | "partner"
  | "mentor"
  | "acquaintance"
  | "other";

export interface OccasionEvent {
  id: string;
  personName: string;
  relationshipType: RelationshipType;
  isFavorite: boolean;
  eventType: EventType;
  recurringDate: string;
  startingYear?: number;
  whatsappNumber: string;
  reminderOffsetDays: number;
  reminderTime: string;
  timezone: string;
  preferredReminderChannel: ReminderChannel;
  tone: ToneType;
  notes?: string;
  nickname?: string;
  interests?: string[];
  giftIdeas?: string[];
  createdAt: string;
  updatedAt: string;
  version: number;
}
