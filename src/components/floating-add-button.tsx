"use client";

import { Plus } from "lucide-react";
import { useUIStore } from "@/store/ui-store";

export default function FloatingAddButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  const { openAddReminder } = useUIStore();

  function handleInteraction() {
    openAddReminder();
    if (onClick) onClick();
  }

  return (
    <button 
      onClick={handleInteraction}
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-white text-black shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer z-40"
      title="Add New Reminder"
    >
      <Plus size={28} />
    </button>
  );
}
