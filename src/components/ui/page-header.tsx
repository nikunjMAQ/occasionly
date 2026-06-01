export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10">
      <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold">
        {eyebrow}
      </p>

      <h1 className="text-4xl font-extrabold mt-3 text-white tracking-tight leading-tight">
        {title}
      </h1>

      {description && (
        <p className="text-gray-400 mt-2 max-w-2xl text-sm leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
