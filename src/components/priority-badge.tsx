export default function PriorityBadge({
  priority,
}: {
  priority: string;
}) {
  const styles = {
    high: "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 font-bold",
    medium: "bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30 font-semibold",
    normal: "bg-zinc-50 text-zinc-600 border-zinc-150 dark:bg-zinc-800/30 dark:text-zinc-400 dark:border-zinc-800 font-medium",
  };

  const activeStyle = styles[priority as keyof typeof styles] || styles.normal;

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border shadow-3xs ${activeStyle}`}
    >
      {priority} priority
    </span>
  );
}
