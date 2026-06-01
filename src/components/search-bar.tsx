"use client";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;

  onChange: (
    value: string
  ) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      placeholder="Search people..."
      className="w-full border rounded-2xl p-4 bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-black/10 transition"
    />
  );
}
