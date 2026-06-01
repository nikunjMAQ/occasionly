import { 
  Users, 
  Cake, 
  Heart, 
  Star, 
  CalendarClock, 
  CheckCircle,
  LucideIcon
} from "lucide-react";

const titleToIconMap: Record<string, { icon: LucideIcon; color: string; bgColor: string }> = {
  "total events": { 
    icon: Users, 
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30"
  },
  "birthdays": { 
    icon: Cake, 
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30"
  },
  "anniversaries": { 
    icon: Heart, 
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/30"
  },
  "favorites": { 
    icon: Star, 
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30"
  },
  "this week": { 
    icon: CalendarClock, 
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950/30"
  },
  "completion rate": { 
    icon: CheckCircle, 
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30"
  },
};

export default function AnalyticsCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  const normTitle = title.toLowerCase().trim();
  const config = titleToIconMap[normTitle] || { 
    icon: Users, 
    color: "text-zinc-600 dark:text-zinc-400",
    bgColor: "bg-zinc-50 dark:bg-zinc-950/30"
  };
  const IconComponent = config.icon;

  return (
    <div className="group relative overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
      {/* Decorative accent blur behind */}
      <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-2xl opacity-10 dark:opacity-20 transition-opacity duration-300 ${config.bgColor}`} />

      <div className="flex items-center justify-between gap-3">
        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold tracking-wider uppercase">
          {title}
        </p>
        <div className={`p-2 rounded-xl transition-all duration-300 ${config.bgColor} ${config.color} group-hover:scale-110`}>
          <IconComponent className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline">
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          {value}
        </h2>
      </div>
    </div>
  );
}
