import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SectionTitle } from "@/components/Editorial";
import { worksQuery, type WorkRow } from "@/lib/content-queries";

export const Route = createFileRoute("/works")({
  head: () => ({
    meta: [
      { title: "Portfolio — Bona Nox" },
      { name: "description", content: "Portfolio profesional: pósteres, portadas de álbumes musicales, diseño editorial." },
      { property: "og:title", content: "Portfolio — Bona Nox" },
      { property: "og:description", content: "Selección de proyectos realizados por Bona Nox." },
    ],
    links: [{ rel: "canonical", href: "/works" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(worksQuery),
  component: WorksPage,
  errorComponent: ({ error }) => <div className="p-10">{error.message}</div>,
  notFoundComponent: () => <div className="p-10">No encontrado</div>,
});

const SUBCATEGORIES = {
  posters: ["music", "cinema", "games", "concept", "events"],
  album_covers: [],
  editorial: ["covers", "books", "magazines", "catalogs", "ebooks"],
} as const;
type Category = keyof typeof SUBCATEGORIES;
const CATEGORIES = ["posters", "album_covers", "editorial"] as const satisfies readonly Category[];

const TECH_TAGS = ["Fotomanipulación", "Dirección de arte", "IA Generativa", "Photoshop", "Illustrator", "InDesign", "Montaje", "Retoque"] as const;

// Derive subcategory and tech tags from caption/title (schema doesn't have these fields)
function deriveMeta(w: WorkRow): { subcategory: string | null; tags: string[] } {
  const text = `${w.caption ?? ""} ${w.title ?? ""}`.toLowerCase();
  const cat = w.category as Category;
  const subs = SUBCATEGORIES[cat] ?? [];

  const subMap: Record<string, string[]> = {
    music: ["music", "música", "musica", "disco", "album", "álbum", "banda", "single"],
    cinema: ["cine", "film", "movie", "película", "pelicula"],
    games: ["game", "juego", "videojuego"],
    concept: ["concept", "conceptual"],
    events: ["event", "evento", "festival"],
    advertising: ["publicidad", "advert", "ad "],
    campaigns: ["campaña", "campaign"],
    culture: ["cultura", "cultural"],
    info: ["info", "informativ"],
    covers: ["portada", "cover", "cubierta"],
    books: ["libro", "book", "novela"],
    magazines: ["revista", "magazine"],
    catalogs: ["catálogo", "catalogo", "catalog"],
    ebooks: ["ebook", "e-book"],
  };

  let detectedSubcategory: string | null = null;
  for (const s of subs) {
    if ((subMap[s] ?? []).some((kw) => text.includes(kw))) {
      detectedSubcategory = s;
      break;
    }
  }

  const subcategory = w.subcategory?.trim() || detectedSubcategory;

  const tags: string[] = [];
  for (const tag of TECH_TAGS) {
    if (text.includes(tag.toLowerCase())) tags.push(tag);
  }
  return { subcategory, tags };
}

function WorksPage() {
  const { t } = useTranslation();
  const { data: works } = useSuspenseQuery(worksQuery);
  const [cat, setCat] = useState<"all" | Category>("all");
  const [sub, setSub] = useState<string>("all");

  const enriched = useMemo(
    () =>
      works.map((w) => {
        const { subcategory, tags } = deriveMeta(w);
        return {
          ...w,
          subcategory,
          tags,
        };
      }),
    [works]
  );

  const filtered = useMemo(() => {
    return enriched.filter((w) => {
      if (cat !== "all" && w.category !== cat) return false;
      if (cat !== "all" && sub !== "all" && w.subcategory !== sub) return false;
      return true;
    });
  }, [enriched, cat, sub]);

  const availableSubs = cat === "all" ? [] : SUBCATEGORIES[cat];

  return (
    <>
      <section className="border-b border-border bg-secondary/30 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <SectionTitle eyebrow={t("sections.selected")} title={t("works.title")} subtitle={t("works.sub")} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setCat("all"); setSub("all"); }}
            className={`rounded-full border px-4 py-2 font-heading text-sm transition ${
              cat === "all"
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-foreground/75 hover:border-accent hover:text-accent"
            }`}
          >
            {t("works.categories.all")}
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCat(c); setSub("all"); }}
              className={`rounded-full border px-4 py-2 font-heading text-sm transition ${
                cat === c
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-foreground/75 hover:border-accent hover:text-accent"
              }`}
            >
              {t(`works.categories.${c}`)}
            </button>
          ))}
        </div>

        {/* Subcategory chips (only when a category is selected) */}
        {cat !== "all" && availableSubs.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t("works.subcategory")}:
            </span>
            <button
              onClick={() => setSub("all")}
              className={`rounded-full border px-3 py-1.5 font-body text-xs transition ${
                sub === "all"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground/70 hover:border-foreground"
              }`}
            >
              {t("works.allSubcategories")}
            </button>
            {availableSubs.map((s) => (
              <button
                key={s}
                onClick={() => setSub(s)}
                className={`rounded-full border px-3 py-1.5 font-body text-xs transition ${
                  sub === s
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground/70 hover:border-foreground"
                }`}
              >
                {t(`works.subcategories.${cat}.${s}`)}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((w, i) => (
            <Link
              key={w.id}
              to="/works/$workId"
              params={{ workId: w.id }}
              className="group flex flex-col"
            >
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 group-hover:border-accent"
              >
                <div className="aspect-4/5 overflow-hidden bg-foreground">
                  <img src={w.image_url} alt={w.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-heading text-[11px] uppercase tracking-[0.2em] text-accent">
                    {t(`works.categories.${w.category}` as any, w.category)}
                  </p>
                  <h3 className="mt-2 font-display text-lg text-foreground">{w.title}</h3>
                  <p className="mt-1 font-body text-sm text-muted-foreground">{w.caption}</p>
                  {w.tags.length > 0 && (
                    <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
                      {w.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                          {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-foreground p-8 text-center text-background md:mt-20 md:p-14">
          <h2 className="font-display text-3xl md:text-5xl">{t("contact.title")}</h2>
          <p className="mx-auto mt-3 max-w-lg font-body text-background/75">{t("contact.sub")}</p>
          <Link to="/contact" className="mt-6 inline-flex rounded-full bg-accent px-7 py-3 font-heading text-accent-foreground">
            {t("contact.send")}
          </Link>
        </div>
      </section>
    </>
  );
}
