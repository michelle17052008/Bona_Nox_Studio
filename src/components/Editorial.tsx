import { useTranslation } from "react-i18next";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-3 font-heading text-xs uppercase tracking-[0.28em] text-accent">
      <span className="inline-block h-px w-8 bg-accent" />
      {children}
    </span>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 font-display text-4xl md:text-6xl text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 font-body text-base md:text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Marquee() {
  const { t } = useTranslation();
  const items = [
    t("manifesto.pillars.one.t"),
    t("manifesto.pillars.two.t"),
    t("manifesto.pillars.three.t"),
    "Bona Nox",
    "ES · EN · PT",
  ];
  const row = [...items, ...items, ...items];
  return (
    <div className="marquee-mask relative overflow-hidden border-y border-border bg-foreground py-6">
      <div className="flex animate-[marquee_38s_linear_infinite] gap-12 whitespace-nowrap font-display text-3xl md:text-5xl text-background/85">
        {row.map((s, i) => (
          <span key={i} className="flex items-center gap-12">
            {s} <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }`}</style>
    </div>
  );
}
