"use client";

import { occasionCategories } from "@/constants/occasion-meta";

export default function DashboardFilters({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-xl p-3 bg-white/5 border-white/10 text-gray-200 font-medium cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition text-sm"
    >
      <option value="all" className="bg-[#171a20]">✨ All Connections</option>
      <option value="favorites" className="bg-[#171a20]">⭐ Favorites</option>
      
      <optgroup label="Occasion Category" className="bg-[#171a20] text-gray-400 font-bold p-1">
        {Object.entries(occasionCategories).map(([key, cat]) => (
          <option key={key} value={`category:${key}`} className="bg-[#171a20] text-gray-200 font-normal">
            {cat.emoji} {cat.label}
          </option>
        ))}
      </optgroup>

      <optgroup label="Relationship" className="bg-[#171a20] text-gray-400 font-bold p-1">
        <option value="friend" className="bg-[#171a20] text-gray-200 font-normal">👫 Friends</option>
        <option value="family" className="bg-[#171a20] text-gray-200 font-normal">👨‍👩‍👦 Family</option>
        <option value="partner" className="bg-[#171a20] text-gray-200 font-normal">💑 Partners</option>
        <option value="colleague" className="bg-[#171a20] text-gray-200 font-normal">🤝 Colleagues</option>
        <option value="mentor" className="bg-[#171a20] text-gray-200 font-normal">🎯 Mentors</option>
        <option value="acquaintance" className="bg-[#171a20] text-gray-200 font-normal">👋 Acquaintances</option>
        <option value="other" className="bg-[#171a20] text-gray-200 font-normal">⭐ Others</option>
      </optgroup>
    </select>
  );
}
