import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

const LANGS = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
] as const;

export function LanguageSwitcher() {
  const { i18n: i18nFromHook } = useTranslation();
  const current = (i18nFromHook?.language ?? i18n.language ?? "en").split("-")[0];

  const change = (code: string) => {
    const inst = (i18nFromHook && typeof i18nFromHook.changeLanguage === "function") ? i18nFromHook : i18n;
    inst.changeLanguage?.(code);
  };

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card/60 p-[3px] text-xs font-heading tracking-wider">
      {LANGS.map((l) => {
        const active = current === l.code;
        return (
          <button
            key={l.code}
            onClick={() => change(l.code)}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              active
                ? "bg-foreground text-background"
                : "text-foreground/70 hover:text-foreground"
            }`}
            aria-pressed={active}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
