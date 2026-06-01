import {
  Cake,
  Heart,
  GraduationCap,
  Briefcase,
  Sparkles,
  Flower2,
  Gift,
  Trophy,
  Calendar,
  LucideIcon,
} from "lucide-react";
import { EventType } from "@/types/event";

export interface OccasionMeta {
  label: string;
  emoji: string;
  icon: LucideIcon;
  /** Tailwind gradient classes for card backgrounds */
  gradient: string;
  /** Single muted color for icons */
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  /** Short emotional copy shown under the person's name */
  smartCopy: string;
  /** AI prompt instruction — tells Gemini the exact occasion context */
  aiContext: string;
  /** Filter category for dashboard grouping */
  category: "personal" | "career" | "memory" | "celebration";
}

export const occasionMeta: Record<EventType, OccasionMeta> = {
  birthday: {
    label: "Birthday",
    emoji: "🎂",
    icon: Cake,
    gradient: "from-indigo-500/20 to-violet-500/20",
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10",
    iconBorder: "border-indigo-500/20",
    smartCopy: "Another year of memories ahead",
    aiContext:
      "Write a warm birthday wish. If age is provided, mention it naturally. Make it feel personal and celebratory.",
    category: "personal",
  },

  anniversary: {
    label: "Anniversary",
    emoji: "💍",
    icon: Heart,
    gradient: "from-rose-500/20 to-red-500/20",
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/10",
    iconBorder: "border-rose-500/20",
    smartCopy: "Celebrate what you built together",
    aiContext:
      "Write a romantic or heartfelt anniversary message. Celebrate the years together and the bond they share.",
    category: "personal",
  },

  graduation: {
    label: "Graduation",
    emoji: "🎓",
    icon: GraduationCap,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    iconBorder: "border-cyan-500/20",
    smartCopy: "A major life milestone achieved",
    aiContext:
      "Write a congratulatory message for a graduation. Acknowledge the hard work, dedication, and the exciting journey ahead.",
    category: "career",
  },

  work_anniversary: {
    label: "Work Anniversary",
    emoji: "💼",
    icon: Briefcase,
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    iconBorder: "border-amber-500/20",
    smartCopy: "Years of dedication worth celebrating",
    aiContext:
      "Write a professional yet warm message for a work anniversary. Acknowledge their loyalty, contributions, and growth at their job.",
    category: "career",
  },

  first_meeting: {
    label: "First Meeting",
    emoji: "🤝",
    icon: Sparkles,
    gradient: "from-violet-500/20 to-fuchsia-500/20",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    iconBorder: "border-violet-500/20",
    smartCopy: "The day a meaningful chapter began",
    aiContext:
      "Write a nostalgic and warm message about the anniversary of first meeting this person. Reflect on the journey since that day and how meaningful the relationship has become.",
    category: "memory",
  },

  memorial: {
    label: "Memorial",
    emoji: "🕯️",
    icon: Flower2,
    gradient: "from-slate-500/20 to-gray-500/20",
    iconColor: "text-slate-400",
    iconBg: "bg-slate-500/10",
    iconBorder: "border-slate-500/20",
    smartCopy: "A moment to remember and reflect",
    aiContext:
      "Write a respectful, gentle remembrance message. Be sensitive, compassionate, and focus on honoring the memory of the person being remembered. Avoid clichés.",
    category: "memory",
  },

  festival: {
    label: "Festival",
    emoji: "🎉",
    icon: Gift,
    gradient: "from-yellow-500/20 to-orange-500/20",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/10",
    iconBorder: "border-orange-500/20",
    smartCopy: "Share the joy of the season",
    aiContext:
      "Write a festive and joyful message for a festival or holiday. Be culturally sensitive and focus on warmth, togetherness, and celebration.",
    category: "celebration",
  },

  promotion: {
    label: "Promotion",
    emoji: "📈",
    icon: Trophy,
    gradient: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/20",
    smartCopy: "Celebrate their new role",
    aiContext:
      "Write an enthusiastic congratulatory message for a career promotion. Acknowledge their achievement, hard work, and express excitement for their next chapter.",
    category: "career",
  },

  custom: {
    label: "Custom Event",
    emoji: "✨",
    icon: Calendar,
    gradient: "from-zinc-500/20 to-slate-500/20",
    iconColor: "text-zinc-400",
    iconBg: "bg-zinc-500/10",
    iconBorder: "border-zinc-500/20",
    smartCopy: "A special moment worth remembering",
    aiContext:
      "Write a warm, thoughtful message for a special occasion. Keep it personal and meaningful.",
    category: "celebration",
  },
};

/** Category display config for filters & grouping */
export const occasionCategories = {
  personal:    { label: "Personal",    emoji: "❤️",  color: "text-rose-400" },
  career:      { label: "Career",      emoji: "💼",  color: "text-amber-400" },
  memory:      { label: "Memories",    emoji: "🕯️", color: "text-slate-400" },
  celebration: { label: "Celebrations",emoji: "🎉",  color: "text-orange-400" },
} as const;

export type OccasionCategory = keyof typeof occasionCategories;
