import { ReactNode } from "react";
import clsx from "clsx";

export default function GlassCard({
  children,
  className,
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={clsx(
        "bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-3xl transition-all duration-300 hover:border-white/[0.15]",
        glow && "shadow-[0_0_40px_rgba(124,58,237,0.12)]",
        !glow && "shadow-[0_4px_24px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      {children}
    </div>
  );
}
