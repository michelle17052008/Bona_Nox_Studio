import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import heroLogo from "@/assets/bona-nox-icon.svg";
import { Eyebrow, SectionTitle } from "@/components/Editorial";
import { worksQuery } from "@/lib/content-queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bona Nox — Diseño editorial y dirección de arte" },
      {
        name: "description",
        content:
          "Bona Nox diseña archivos digitales listos para impresión o distribución digital: portadas de álbumes, pósteres, diseño editorial y dirección de arte.",
      },
      { property: "og:title", content: "Bona Nox — Diseño editorial y dirección de arte" },
      { property: "og:description", content: "Archivos digitales listos para imprimir o distribuir. No somos imprenta." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(worksQuery),
  component: Index,
  errorComponent: ({ error }) => (
  <div className="p-10">
    {error instanceof Error ? error.message : "Ocurrió un error inesperado."}
  </div>
),
  notFoundComponent: () => <div className="p-10">No encontrado</div>,
});

function Index() {
  const { t } = useTranslation();
  const { data: allWorks } = useSuspenseQuery(worksQuery);
  const featured = allWorks.slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-foreground text-background">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-foreground via-foreground/95 to-foreground" />
          <motion.img
            src={heroLogo}
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute right-[-20%] top-1/2 h-[100%] w-auto -translate-y-1/2 object-contain opacity-15 blur-[2px] md:right-[-4%] md:opacity-35 md:blur-0"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/85 to-transparent md:via-foreground/70" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-24 sm:pt-28 md:min-h-[86vh] md:grid-cols-12 md:gap-14 md:px-10 md:pb-24 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 md:col-span-8"
          >
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
            <h1 className="mt-5 font-display text-[40px] leading-[1.05] text-background sm:text-5xl md:text-[76px] md:leading-[1.02]">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-xl font-body text-base text-background/80 sm:text-lg">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                to="/works"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-heading text-accent-foreground transition-transform hover:translate-y-[-2px]"
              >
                {t("hero.ctaWork")}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-background/40 px-6 py-3.5 font-heading text-background transition-colors hover:bg-background hover:text-foreground"
              >
                {t("hero.ctaServices")}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUÉ ENCONTRARÁS */}
<section className="mx-auto max-w-4xl px-5 py-16 md:px-10 md:py-20">

  <SectionTitle
    eyebrow={t("sections.manifesto")}
    title={t("home.intro.title")}
  />

  <p className="mt-6 font-body text-base leading-8 text-muted-foreground md:text-lg">
    {t("home.intro.body")}
  </p>

  {/* Diseño */}
  <div className="mt-12 space-y-10">

    <div>

      <h3 className="font-heading text-2xl text-foreground">
        {t("home.pillars.services.t")}
      </h3>

      <p className="mt-3 font-body leading-8 text-muted-foreground">
        {t("home.pillars.services.d")}
      </p>

      <p className="mt-3 font-body text-sm italic leading-7 text-muted-foreground">
        {t("home.pillars.services.clarify")}
      </p>

    </div>

  </div>

  {/* Accesos rápidos */}

  <div className="mt-12 flex flex-wrap items-center gap-3">

    <Link
      to="/works"
      className="inline-flex items-center gap-2 font-heading text-sm text-accent transition-all hover:gap-3"
    >
      {t("nav.works")}
      <ArrowRight size={14} />
    </Link>

    <span className="text-border">·</span>

    <Link
      to="/services"
      className="inline-flex items-center gap-2 font-heading text-sm text-accent transition-all hover:gap-3"
    >
      {t("nav.services")}
      <ArrowRight size={14} />
    </Link>

  </div>

</section>

      {/* SERVICIOS DESTACADOS */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <SectionTitle eyebrow={t("sections.services")} title={t("services.title")} subtitle={t("services.sub")} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 md:grid-cols-3">
            {(["editorial", "covers", "posters", "artdirection", "photoedit"] as const).map((k) => (
              <div key={k} className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-accent hover:shadow-[var(--shadow-soft)]">
                <h3 className="font-heading text-base text-foreground md:text-lg">{t(`services.items.${k}.t`)}</h3>
                <div className="my-3 h-px w-10 bg-accent" />
                <p className="font-body text-sm text-muted-foreground">{t(`services.items.${k}.d`)}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-heading text-background hover:bg-accent">
              {t("services.cta")} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <SectionTitle eyebrow={t("sections.selected")} title={t("works.title")} subtitle={t("works.sub")} />
            <Link to="/works" className="inline-flex shrink-0 items-center gap-2 font-heading text-foreground hover:text-accent">
              {t("works.viewAll")} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-12 md:grid-cols-3">
            {featured.map((w) => (
              <figure key={w.id} className="group overflow-hidden rounded-2xl border border-border bg-card">
                <div className="aspect-[4/5] overflow-hidden bg-foreground">
                  <img src={w.image_url} alt={w.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <figcaption className="p-5">
                  <p className="font-heading text-[11px] uppercase tracking-[0.2em] text-accent">{w.caption}</p>
                  <h3 className="mt-2 font-display text-xl text-foreground">{w.title}</h3>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}




      {/* CTA CONTACTO */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-10 md:pb-28">
        <div className="rounded-3xl bg-foreground p-8 text-center text-background md:p-14">
          <h2 className="font-display text-3xl md:text-5xl">{t("contact.title")}</h2>
          <p className="mx-auto mt-3 max-w-lg font-body text-background/75">{t("contact.sub")}</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-heading text-accent-foreground">
            <Mail size={16} /> {t("contact.send")}
          </Link>
        </div>
      </section>
    </>
  );
}
