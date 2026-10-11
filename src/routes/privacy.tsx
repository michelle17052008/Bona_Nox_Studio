import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Bona Nox" },
      {
        name: "description",
        content: "Privacy Policy of Bona Nox.",
      },
      {
        property: "og:title",
        content: "Privacy Policy — Bona Nox",
      },
      {
        property: "og:description",
        content:
          "How Bona Nox collects, stores and protects your personal information.",
      },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-5xl px-6 py-20">

      <header className="mb-14">

        <h1 className="font-logo text-center text-6xl text-foreground">
          {t("privacy.title")}
        </h1>

        <p className="mt-4 text-center font-body text-sm text-muted-foreground">
          {t("privacy.updated")}
        </p>

      </header>

      <article className="space-y-12">

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("privacy.introduction.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("privacy.introduction.body")}
          </p>

        </section>

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("privacy.collection.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("privacy.collection.body")}
          </p>

        </section>

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("privacy.usage.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("privacy.usage.body")}
          </p>

        </section>

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("privacy.cookies.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("privacy.cookies.body")}
          </p>

        </section>

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("privacy.thirdParty.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("privacy.thirdParty.body")}
          </p>

        </section>

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("privacy.security.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("privacy.security.body")}
          </p>

        </section>

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("privacy.retention.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("privacy.retention.body")}
          </p>

        </section>

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("privacy.rights.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("privacy.rights.body")}
          </p>

        </section>

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("privacy.children.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("privacy.children.body")}
          </p>

        </section>

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("privacy.changes.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("privacy.changes.body")}
          </p>

        </section>

        <section>

          <h2 className="font-heading text-2xl text-foreground">
            {t("privacy.contact.title")}
          </h2>

          <p className="mt-4 font-body leading-8 text-muted-foreground">
            {t("privacy.contact.body")}
          </p>

        </section>

      </article>

    </main>
  );
}