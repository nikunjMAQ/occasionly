import { ReactNode } from "react";

export default function DashboardGrid({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-12 gap-6 w-full mb-8">
      {children}
    </div>
  );
}
