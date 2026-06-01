import { RelationshipType } from "@/types/event";

const relationshipStyles: Record<string, string> = {
  family: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30",
  friend: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30",
  colleague: "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30",
  other: "bg-zinc-50 text-zinc-600 border-zinc-150 dark:bg-zinc-800/30 dark:text-zinc-400 dark:border-zinc-800",
};

export default function RelationshipBadge({
  type,
}: {
  type: RelationshipType;
}) {
  const normType = (type || "friend").toLowerCase();
  const themeClass = relationshipStyles[normType] || relationshipStyles.other;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-3xs ${themeClass}`}>
      {type}
    </span>
  );
}
