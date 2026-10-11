import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Términos y Condiciones — Bona Nox" },
      {
        name: "description",
        content: "Términos y condiciones de uso de Bona Nox.",
      },
      {
        property: "og:title",
        content: "Términos y Condiciones — Bona Nox",
      },
      {
        property: "og:description",
        content: "Condiciones de uso del sitio y de los servicios creativos de Bona Nox.",
      },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});


function TermsPage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-5xl px-6 py-20">

      <header className="mb-14">

        <h1 className="font-logo text-center text-6xl text-foreground">
          {t("terms.title")}
        </h1>

        <p className="mt-4 text-center font-body text-sm text-muted-foreground">
          {t("terms.updated")}
        </p>

      </header>

      <article className="space-y-12">

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("terms.introduction.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("terms.introduction.body")}
          </p>

        </section>

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("terms.about.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("terms.about.body")}
          </p>

        </section>

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("terms.custom.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("terms.custom.body")}
          </p>

        </section>

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("terms.intellectual.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("terms.intellectual.body")}
          </p>

        </section>

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("terms.liability.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("terms.liability.body")}
          </p>

        </section>

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("terms.modifications.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("terms.modifications.body")}
          </p>

        </section>

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("terms.contact.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("terms.contact.body")}
          </p>

        </section>

      </article>

    </main>
  );
}