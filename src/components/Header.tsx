import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/Bona-nox-icon.svg";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const nav = [
    { to: "/", label: t("nav.home") },
    { to: "/works", label: t("nav.works") },
    { to: "/services", label: t("nav.services") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-10">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Bona Nox"
            width={42}
            height={42}
            className="h-10 w-10 rounded-full ring-1 ring-border transition-transform group-hover:scale-105"
          />
          <span className="font-logo text-3xl leading-none text-foreground translate-y-[2px]">
            Bona Nox
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 font-heading text-[15px] tracking-wide">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-accent ember-underline" }}
              className="text-foreground/80 hover:text-accent transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            aria-label="Menu"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-border"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border bg-background">
          <div className="mx-auto flex max-w-7xl flex-col px-5 py-4 font-heading text-lg">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-foreground/85 hover:text-accent"
                activeProps={{ className: "text-accent" }}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
