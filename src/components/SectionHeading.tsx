export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
  onDark = false,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  /** For sections with a dark background. */
  onDark?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {kicker && (
        <p
          className={`text-xs font-semibold uppercase tracking-[0.25em] ${onDark ? "text-pink-200" : "text-pink-600"}`}
        >
          {kicker}
        </p>
      )}
      <h2 className={`mt-2 font-display text-3xl sm:text-4xl ${onDark ? "text-white" : "text-ink-900"}`}>{title}</h2>
      {subtitle && (
        <p
          className={`mt-3 ${onDark ? "text-white/85" : "text-ink-700"} ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
