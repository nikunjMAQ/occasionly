"use client";

import { EventType } from "@/types/event";
import { occasionMeta } from "@/constants/occasion-meta";
import clsx from "clsx";

export default function OccasionBadge({
  type,
  size = "sm",
  showLabel = true,
}: {
  type: EventType;
  size?: "xs" | "sm" | "md";
  showLabel?: boolean;
}) {
  const meta = occasionMeta[type] ?? occasionMeta.custom;
  const Icon = meta.icon;

  const sizeClasses = {
    xs: { wrap: "px-2 py-0.5 rounded-lg gap-1 text-[9px]", icon: 10 },
    sm: { wrap: "px-2.5 py-1 rounded-xl gap-1.5 text-[10px]", icon: 11 },
    md: { wrap: "px-3 py-1.5 rounded-xl gap-2 text-xs", icon: 13 },
  }[size];

  return (
    <span
      className={clsx(
        "inline-flex items-center font-semibold border",
        `bg-gradient-to-r ${meta.gradient}`,
        meta.iconColor,
        meta.iconBorder,
        sizeClasses.wrap
      )}
    >
      <Icon size={sizeClasses.icon} className="flex-shrink-0" />
      {showLabel && <span>{meta.label}</span>}
    </span>
  );
}
