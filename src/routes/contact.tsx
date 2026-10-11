import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Mail, Instagram, Send, Clock } from "lucide-react";
import { toast } from "sonner";
import { SectionTitle } from "@/components/Editorial";
import { submitContactMessage } from "@/lib/contact-message.functions";

const CONTACT_EMAIL = "bonanox.studio@outlook.com";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contacto — Bona Nox" },
      { name: "description", content: "Conversemos sobre tu próximo libro, disco o campaña. Horario de atención Manaus (GMT-4)." },
      { property: "og:title", content: "Contacto — Bona Nox" },
      { property: "og:description", content: "Respondo en menos de 48 horas." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Nombre requerido").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  message: z.string().trim().min(1, "Mensaje requerido").max(2000),
});

const STEPS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

function ContactPage() {
  const { t } = useTranslation();
  const [type, setType] = useState<"contact" | "custom_order">("contact");
  const [values, setValues] = useState({ name: "", email: "", message: "", website: "" });
  const submit = useServerFn(submitContactMessage);
  const mutation = useMutation({
    mutationFn: submit,
    onSuccess: ({ emailSent }) => {
      toast.success(t(emailSent ? "contact.toastSent" : "contact.toastSavedEmailFailed"));
      setValues({ name: "", email: "", message: "", website: "" });
    },
    onError: (e: any) => toast.error(e?.message ?? "Error al enviar"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }
    mutation.mutate({ data: { ...parsed.data, type, website: values.website } });
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
      <SectionTitle eyebrow={t("sections.contact")} title={t("contact.title")} subtitle={t("contact.sub")} />

      <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:gap-12">
        {/* Info column */}
        <aside className="md:col-span-5 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <ul className="space-y-3 font-body">
              <li className="flex items-center gap-3 break-all text-foreground">
                <Mail size={16} className="shrink-0 text-accent" /> {CONTACT_EMAIL}
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <Instagram size={16} className="shrink-0 text-accent" /> @bona.rox_nox
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-accent">
              <Clock size={16} />
              <h3 className="font-heading text-sm uppercase tracking-[0.2em]">{t("contact.hours.title")}</h3>
            </div>
            <p className="mt-2 font-body text-xs uppercase tracking-wider text-muted-foreground">
              {t("contact.hours.location")}
            </p>
            <dl className="mt-4 space-y-2 font-body text-sm text-foreground">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t("contact.hours.weekdays")}</dt>
                <dd>09:00 – 17:00</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t("contact.hours.saturday")}</dt>
                <dd>09:00 – 13:00</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t("contact.hours.sunday")}</dt>
                <dd>{t("contact.hours.closed")}</dd>
              </div>
            </dl>
            <p className="mt-4 font-body text-xs leading-relaxed text-muted-foreground">
              {t("contact.hours.note")}
            </p>
          </div>

          {/* Espacio reservado para ilustración oficial de Roxy */}
        </aside>

        {/* Form column */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-7 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] md:p-8"
        >
          <div className="mb-6 flex flex-wrap gap-2">
            {(["contact", "custom_order"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setType(k)}
                className={`rounded-full border px-4 py-2 font-heading text-xs uppercase tracking-wider transition ${
                  type === k
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-foreground/70 hover:border-accent"
                }`}
              >
                {k === "contact" ? t("contact.typeContact") : t("contact.typeCustom")}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={t("contact.name")}
              name="name"
              value={values.name}
              onChange={(v) => setValues((s) => ({ ...s, name: v }))}
              maxLength={100}
            />
            <Field
              label={t("contact.email")}
              name="email"
              type="email"
              value={values.email}
              onChange={(v) => setValues((s) => ({ ...s, email: v }))}
              maxLength={255}
            />
          </div>
          <div className="mt-5">
            <label htmlFor="message" className="font-heading text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {t("contact.message")}
            </label>
            <textarea
              id="message"
              required
              rows={6}
              maxLength={2000}
              value={values.message}
              onChange={(e) => setValues((s) => ({ ...s, message: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 font-body text-foreground outline-none focus:border-accent"
            />
          </div>
          {/* honeypot */}
          <input
            type="text"
            name="website"
            value={values.website}
            onChange={(e) => setValues((s) => ({ ...s, website: e.target.value }))}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <button
            type="submit"
            disabled={mutation.isPending}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-heading text-accent-foreground hover:opacity-90 disabled:opacity-60"
          >
            <Send size={16} /> {mutation.isPending ? "Enviando…" : t("contact.send")}
          </button>
          {mutation.isSuccess && (
            <p className="mt-5 font-heading text-sm text-accent">
              {t(mutation.data.emailSent ? "contact.toastSent" : "contact.toastSavedEmailFailed")}
            </p>
          )}
        </form>
      </div>

      {/* Proceso de contratación */}
      <div className="mt-16 md:mt-24">
        <SectionTitle eyebrow={t("sections.process")} title={t("process.title")} subtitle={t("process.sub")} />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s} className="rounded-2xl border border-border bg-card p-5">
              <div className="font-display text-3xl text-accent">0{s}</div>
              <p className="mt-2 font-heading text-base text-foreground">{t(`process.steps.${s}.t`)}</p>
              <p className="mt-1 font-body text-sm text-muted-foreground">{t(`process.steps.${s}.d`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Field({
  label, name, type = "text", value, onChange, maxLength,
}: {
  label: string; name: string; type?: string;
  value: string; onChange: (v: string) => void; maxLength?: number;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className="font-heading text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 font-body text-foreground outline-none focus:border-accent"
      />
    </div>
  );
}
