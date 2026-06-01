import { ReactNode } from "react";

export default function SectionBlock({
  title,
  description,
  children,
  id,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="py-10 border-t border-white/5 first:border-none">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold">
          {title}
        </p>

        {description && (
          <p className="text-gray-400 mt-1.5 text-xs">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}
