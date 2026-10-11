import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import logo from "@/assets/Bona-nox-icon.svg";
import { SectionTitle } from "@/components/Editorial";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Estudio — Bona Nox" },
      { name: "description", content: "Bona Nox." },
      { property: "og:title", content: "Estudio — Bona Nox" },
      { property: "og:description", content: "Filosofía, experiencia y metodología del estudio Bona Nox." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useTranslation();
  const blocks = [
    { k: "philosophy", title: t("about.philosophyTitle"), body: t("about.philosophy") },
    { k: "aboutstudio", title: t("about.aboutstudioTitle"), body: t("about.aboutstudio") },
    { k: "creativeprocess", title: t("about.creativeprocessTitle"), body: t("about.creativeprocess") },
    { k: "languages", title: t("about.languagesTitle"), body: t("about.languages") },
    { k: "tools", title: t("about.toolsTitle"), body: t("about.tools") },
    { k: "focus", title: t("about.focusTitle"), body: t("about.focus") },
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
      <div className="grid gap-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-foreground p-8 md:p-10">
              <img src={logo} alt="Bona Nox" className="h-full w-full object-contain" />
            </div>
          </div>
        </div>
        <div className="md:col-span-7">
          <SectionTitle eyebrow="Studio" title={t("about.title")} />
          <div className="mt-8 rule" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {blocks.map((b) => (
              <div key={b.k} className="rounded-2xl border border-border bg-card p-6">
                <p className="font-heading text-xs uppercase tracking-[0.2em] text-accent">{b.title}</p>
                <p className="mt-3 font-body text-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
