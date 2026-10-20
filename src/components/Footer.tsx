import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Instagram, Mail, Globe } from "lucide-react";
import logo from "@/assets/bona-nox-icon.svg";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 border-t border-border bg-foreground text-background md:mt-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-4 md:gap-12 md:px-10 md:py-16">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Bona Nox" width={48} height={48} className="h-12 w-12 shrink-0 rounded-full" />
            <span className="font-logo text-4xl leading-none text-background translate-y-[2px]">Bona Nox</span>
          </div>
          <p className="mt-5 max-w-md font-body text-background/70">
            {t("footer.tagline")} {t("about.languages")}.
          </p>
          {/* Espacio reservado para ilustración oficial de Roxy */}
        </div>

        <div className="min-w-0">
          <h4 className="font-heading text-sm uppercase tracking-[0.18em] text-accent">
            {t("nav.home")}
          </h4>
          <ul className="mt-4 space-y-2 font-body text-background/80">
            <li><Link to="/works" className="hover:text-accent">{t("nav.works")}</Link></li>
            <li><Link to="/services" className="hover:text-accent">{t("nav.services")}</Link></li>
            <li><Link to="/about" className="hover:text-accent">{t("nav.about")}</Link></li>
            <li><Link to="/contact" className="hover:text-accent">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div className="min-w-0">
          <h4 className="font-heading text-sm uppercase tracking-[0.18em] text-accent">
            {t("nav.contact")}
          </h4>
          <ul className="mt-4 space-y-3 font-body text-background/80">
            <li className="flex items-center gap-2 break-all">
              <Mail size={14} className="shrink-0" /> bonanox.studio@outlook.com
            </li>
            <li className="flex items-center gap-2">
              <Instagram size={14} className="shrink-0" /> @bona.rox_nox
            </li>
            <li className="flex items-center gap-2">
              <Globe size={14} className="shrink-0" /> ES · EN · PT
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10">
  <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 text-xs text-background/55 md:flex-row md:items-center md:justify-between md:px-10">

    <p>
      © {year} Bona Nox — {t("footer.rights")}.
    </p>

    <div className="flex flex-wrap items-center gap-4 font-body">

      <Link
        to="/terms"
        className="hover:text-accent transition-colors"
      >
        {t("footer.terms")}
      </Link>

      <Link
        to="/privacy"
        className="hover:text-accent transition-colors"
      >
        {t("footer.privacy")}
      </Link>

      <span className="text-background/25">•</span>

      <span className="font-heading tracking-wider">
        Editorial · Promocional · Cultural ·{" "}
        <Link
          to="/admin"
          className="text-background/40 hover:text-accent"
        >
          Admin
        </Link>
      </span>

    </div>

  </div>
</div>
    </footer>
  );
}
