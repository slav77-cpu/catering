export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {kicker && (
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-500">{kicker}</p>
      )}
      <h2 className="mt-2 font-display text-3xl text-ink-900 sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className={`mt-3 text-ink-700 ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
