"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function EmptyState({
  title,
  description,
  onActionClick,
  actionLabel,
}: {
  title: string;
  description: string;
  onActionClick?: () => void;
  actionLabel?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative rounded-3xl border border-dashed border-white/10 p-12 sm:p-16 text-center bg-white/[0.02] backdrop-blur-md max-w-lg mx-auto flex flex-col items-center justify-center space-y-5 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-violet-500/8 rounded-full blur-[60px]" />

      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-lg shadow-violet-500/10">
          <Sparkles size={22} />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {onActionClick && actionLabel && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onActionClick}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer text-sm shadow-lg shadow-violet-600/20"
          >
            {actionLabel}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
