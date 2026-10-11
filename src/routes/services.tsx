import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Clock, ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/Editorial";

// ============================================================
// EJEMPLOS VISUALES DE SERVICIOS
// Agrega aquí los imports de tus imágenes conforme las vayas creando.
//
// Ejemplo:
// import editorial01 from "@/assets/services/editorial-01.jpg";
// ============================================================

import editorial01 from "@/assets/services/editorial-01.png";
import editorial02 from "@/assets/services/editorial-02.png";
import editorial03 from "@/assets/services/editorial-03.png";
import editorial04 from "@/assets/services/editorial-04.png";

import posters01 from "@/assets/services/posters-01.png";
import posters02 from "@/assets/services/posters-02.png";
import posters03 from "@/assets/services/posters-03.png";
import posters04 from "@/assets/services/posters-04.png";

import covers01 from "@/assets/services/covers-01.jpg";
import covers02 from "@/assets/services/covers-02.png";
import covers03 from "@/assets/services/covers-03.png";
import covers04 from "@/assets/services/covers-04.png";
import artdirection01 from "@/assets/services/artdirection-01.jpg";
import artdirection02 from "@/assets/services/artdirection-02.jpg";
import artdirection03 from "@/assets/services/artdirection-03.jpg";
import artdirection04 from "@/assets/services/artdirection-04.png";

import photoedit01 from "@/assets/services/photoedit-01.png";
import photoedit02 from "@/assets/services/photoedit-02.png";
import photoedit03 from "@/assets/services/photoedit-03.png";
import photoedit04 from "@/assets/services/photoedit-04.png";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Servicios — Bona Nox" },
      {
        name: "description",
        content:
          "Diseño editorial, pósteres, portadas, dirección de arte, fotomanipulación y edición fotográfica.",
      },
      { property: "og:title", content: "Servicios — Bona Nox" },
      {
        property: "og:description",
        content: "Diseño digital listo para impresión o distribución digital.",
      },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const SERVICES = [
  "editorial",
  "posters",
  "covers",
  "artdirection",
  "photoedit",
] as const;

const PROCESS_STEPS = ["1", "2", "3", "4"] as const;

const SERVICE_EXAMPLES = {
    editorial: [editorial01, editorial02, editorial03, editorial04],
  posters: [posters01, posters02, posters03, posters04],
  covers: [covers01, covers02, covers03, covers04],
  artdirection: [artdirection01, artdirection02, artdirection03, artdirection04],
  photoedit: [photoedit01, photoedit02, photoedit03, photoedit04],
};

function ServicesPage() {
  const { t } = useTranslation();

  return (
    <>
      <section className="border-b border-border bg-secondary/30 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <SectionTitle
            eyebrow={t("sections.services")}
            title={t("services.title")}
            subtitle={t("services.sub")}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-8 md:gap-10">
          {SERVICES.map((k, i) => {
            const examples = SERVICE_EXAMPLES[k];

            return (
              <article
                key={k}
                className="grid gap-8 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] md:grid-cols-12 md:gap-10 md:p-10"
              >
                <div className="md:col-span-7">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-4xl text-foreground/15">
                      0{i + 1}
                    </span>

                    <h2 className="font-display text-2xl text-foreground md:text-3xl">
                      {t(`services.items.${k}.t`)}
                    </h2>
                  </div>

                  <p className="mt-4 font-body text-muted-foreground">
                    {t(`services.items.${k}.d`)}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 font-heading text-sm text-accent">
                    <Clock size={14} />
                    <span>
                      {t("services.estimated")}:{" "}
                      {t(`services.items.${k}.time`)}
                    </span>
                  </div>

                  <div className="mt-8">
                    <p className="font-heading text-xs uppercase tracking-[0.2em] text-accent">
                      {t("process.title")}
                    </p>

                    <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                      {PROCESS_STEPS.map((s) => (
                        <li
                          key={s}
                          className="rounded-xl border border-border bg-background/50 p-3"
                        >
                          <div className="font-display text-2xl text-accent">
                            0{s}
                          </div>

                          <p className="mt-1 font-heading text-sm text-foreground">
                            {t(`process.steps.${s}.t`)}
                          </p>

                          <p className="mt-1 font-body text-xs text-muted-foreground">
                            {t(`process.steps.${s}.d`)}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <Link
                    to="/contact"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-heading text-background hover:bg-accent"
                  >
                    {t("services.cta")} <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="md:col-span-5">
                  <p className="font-heading text-xs uppercase tracking-[0.2em] text-accent">
                    {t("services.examplesTitle")}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {examples.length > 0
                      ? examples.slice(0, 4).map((image, index) => (
                          <div
                            key={index}
                            className="aspect-[4/5] overflow-hidden rounded-xl border border-border"
                          >
                            <img
                              src={image}
                              alt={`${t(`services.items.${k}.t`)} — ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))
                      : [0, 1, 2, 3].map((n) => (
                          <div
                            key={n}
                            className="flex aspect-[4/5] items-center justify-center rounded-xl border border-dashed border-border/70 bg-secondary/40 p-3 text-center"
                          >
                            <span className="font-body text-[11px] uppercase tracking-wider text-muted-foreground">
                              {t("services.examplesSoon")}
                            </span>
                          </div>
                        ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}