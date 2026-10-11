import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { worksQuery, type WorkRow } from "@/lib/content-queries";

const CATEGORIES = ["posters", "album_covers", "editorial"] as const;
type Category = typeof CATEGORIES[number];

const SUBCATEGORIES: Record<Category, readonly string[]> = {
  posters: ["music", "cinema", "games", "concept", "events"],
  album_covers: [],
  editorial: ["covers", "books", "magazines", "catalogs", "ebooks"],
};

const TECH_TAGS = ["Fotomanipulación", "Dirección de arte", "IA Generativa", "Photoshop", "Illustrator", "InDesign", "Montaje", "Retoque"] as const;

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
    covers: ["portada", "cover", "cubierta"],
    books: ["libro", "book", "novela"],
    magazines: ["revista", "magazine"],
    catalogs: ["catálogo", "catalogo", "catalog"],
    ebooks: ["ebook", "e-book"],
  };

  let subcategory: string | null = null;
  for (const s of subs) {
    if ((subMap[s] ?? []).some((kw) => text.includes(kw))) {
      subcategory = s;
      break;
    }
  }

  const tags: string[] = [];
  for (const tag of TECH_TAGS) {
    if (text.includes(tag.toLowerCase())) tags.push(tag);
  }
  return { subcategory, tags };
}

export const Route = createFileRoute("/works_/$workId")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(worksQuery),
  component: WorksDetailPage,
});

function WorksDetailPage() {
  const { t } = useTranslation();
  const { workId } = Route.useParams();
  const { data: works } = useSuspenseQuery(worksQuery);

  const work = works.find((w) => w.id === workId);

  if (!work) {
    return (
      <div className="p-10">
        {t("works.notFound") ?? "Work not found"}
      </div>
    );
  }

  const { subcategory, tags } = deriveMeta(work);

  const gallery =
  Array.isArray(work.gallery_urls)
    ? work.gallery_urls
    : typeof work.gallery_urls === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(work.gallery_urls);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : [];

const images = [work.image_url, ...gallery];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-3.5 md:px-10 md:py-20">
      <Link
        to="/works"
        className="inline-flex items-center gap-2 font-heading text-sm text-foreground/70 hover:text-accent"
      >
        <ArrowLeft size={14} />
        {t("works.back") ?? "Back to Portfolio"}
      </Link>

      <div className="mt-8 grid gap-8 md:grid-cols-12 md:gap-12">
        {/* Gallery */}
        <div className="md:col-span-7">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-3xl border border-border bg-foreground"
          >
            <img
              src={selectedImage}
              alt={work.title}
              className="h-full w-full object-cover"
            />
          </motion.div>

          {images.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`overflow-hidden rounded-xl border transition ${
                    selectedImage === img
                      ? "border-accent"
                      : "border-border"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Information */}
        <div className="md:col-span-5">
          <div className="flex flex-wrap gap-2">
            <span className="font-heading text-[11px] uppercase tracking-[0.25em] text-accent">
              {t(`works.categories.${work.category}` as any, work.category)}
            </span>

            {subcategory && (
              <span className="font-heading text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                /{" "}
                {t(
                  `works.subcategories.${work.category}.${subcategory}`,
                  subcategory
                )}
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-3xl md:text-4xl">
            {work.title}
          </h1>

          <p className="mt-4 text-muted-foreground leading-relaxed">
            {work.caption}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-6">
              <h3 className="font-heading text-[11px] uppercase tracking-[0.2em] text-accent mb-3">
                {t("works.techniques") ?? "Techniques"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 font-body text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h3 className="font-heading text-sm uppercase tracking-[0.2em] text-accent">
              {t("works.interested") ?? "Interested in this project?"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("works.contactForCustom") ?? "Let's discuss your next project. Get in touch with us to learn more about our services."}
            </p>
            <Link
              to="/contact"
              className="mt-4 inline-flex rounded-full bg-foreground px-6 py-3 font-heading text-sm text-background transition hover:bg-accent hover:text-accent-foreground"
            >
              {t("works.contactUs") ?? "Contact Us"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
