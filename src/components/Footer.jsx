import { Link } from "react-router-dom";
import { AUTHOR, BOOKS, LEGAL, NAV } from "../data/books";
import { useI18n } from "../i18n";
import { FacebookIcon, GlobeIcon, GoodreadsIcon, InstagramIcon, MailIcon, OliveBranch, PenNib } from "./Icons";
import { cn } from "../utils/cn";

const LEGAL_LABELS = {
  accessibility: "lang.legal.accessibility",
  legalNotice: "lang.legal.legalNotice",
  cookies: "lang.legal.cookies",
  privacy: "lang.legal.privacy",
};

export default function Footer() {
  const { lang, setLang, t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-pine-950 text-paper-100 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 olive-branch-bg opacity-40 pointer-events-none" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gold-500/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
          {/* brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <span className="grid place-items-center w-11 h-11 bg-gold-500 text-pine-950 font-display italic font-bold text-lg rounded-[4px] transition-transform duration-500 group-hover:rotate-6">
                LC
              </span>
              <span className="leading-none">
                <span className="block font-display font-bold text-lg text-paper-50">LUIS CAPARRÓS</span>
                <span className="block text-[9.5px] font-body font-bold tracking-[0.42em] uppercase text-gold-400 mt-1">{t("header.writer")}</span>
              </span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-paper-100/70 max-w-xs">{t("footer.desc")}</p>
            <OliveBranch className="w-28 h-9 mt-6 text-gold-500/70" />
          </div>

          {/* nav */}
          <nav aria-label="Footer navigation">
            <h3 className="font-body font-bold text-[11px] tracking-[0.3em] uppercase text-gold-400">{t("footer.nav")}</h3>
            <ul className="mt-5 space-y-2.5">
              {NAV.map((n) => (
                <li key={n.key}>
                  <Link to={n.to} className="link-ink text-sm text-paper-100/85 hover:text-gold-300 transition-colors">
                    {t(`nav.${n.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* latest books - ALL 7 BOOKS */}
          <nav aria-label="Latest books">
            <h3 className="font-body font-bold text-[11px] tracking-[0.3em] uppercase text-gold-400">{t("footer.latest")}</h3>
            <ul className="mt-5 space-y-2.5">
              {BOOKS.map((b) => (
                <li key={b.id}>
                  <Link to={`/books/${b.slug}`} className="group flex items-baseline gap-2.5 text-sm text-paper-100/85 hover:text-gold-300 transition-colors">
                    <PenNib className="w-3.5 h-3.5 text-gold-500/70 shrink-0 translate-y-0.5 group-hover:translate-y-0 transition-transform" />
                    {b.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* social + contact */}
          <div>
            <h3 className="font-body font-bold text-[11px] tracking-[0.3em] uppercase text-gold-400">{t("footer.social")}</h3>
            
            {/* ✅ SOCIAL ICONS - Clean icon-only with brand colors */}
            <div className="mt-5 flex gap-3">
              <a
                href="https://www.instagram.com/caparrosmiron/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex items-center justify-center w-11 h-11 rounded-full border border-paper-100/20 text-paper-100/60 hover:text-[#E4405F] hover:border-[#E4405F] hover:bg-[#E4405F]/10 transition-all duration-300"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/luis.caparrosmiron/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex items-center justify-center w-11 h-11 rounded-full border border-paper-100/20 text-paper-100/60 hover:text-[#1877F2] hover:border-[#1877F2] hover:bg-[#1877F2]/10 transition-all duration-300"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
            </div>
            
            <p className="mt-3 text-xs text-paper-100/55">@luis.caparrosmiron · /caparrosmiron</p>
            <a
              href={`mailto:${AUTHOR.email}`}
              className="mt-6 inline-flex items-center gap-2.5 text-sm text-paper-100/85 hover:text-gold-300 transition-colors"
            >
              <MailIcon className="w-4.5 h-4.5 text-gold-400" /> {AUTHOR.email}
            </a>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 pt-6 border-t border-paper-50/12 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-xs text-paper-100/55">{t("footer.rights")}</p>
            {/* language switch */}
            <div className="flex items-center gap-1.5" role="group" aria-label={t("lang.title")}>
              <GlobeIcon className="w-3.5 h-3.5 text-gold-500/80" />
              {["en", "es"].map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={cn(
                    "px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] uppercase border transition-all duration-300",
                    lang === code
                      ? "bg-gold-500 border-gold-500 text-pine-950"
                      : "border-paper-100/25 text-paper-100/70 hover:border-gold-400 hover:text-gold-300"
                  )}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Legal links">
            {LEGAL.map((l) => (
              <Link key={l.to} to={l.to} className="link-ink text-xs text-paper-100/70 hover:text-gold-300 transition-colors">
                {t(LEGAL_LABELS[l.key])}
              </Link>
            ))}
          </nav>
        </div>

        {/* Developer Credit */}
        <div className="mt-8 pt-6 border-t border-paper-50/8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-paper-100/35 tracking-[0.08em]">
              © {currentYear} Luis Caparrós. {lang === "en" ? "All rights reserved." : "Todos los derechos reservados."}
            </p>
            <div className="hidden sm:block w-px h-6 bg-paper-50/10" />
            <div className="flex items-center gap-3">
              <span className="text-[9px] text-paper-100/25 tracking-[0.12em] uppercase">
                {lang === "en" ? "Crafted by" : "Hecho por"}
              </span>
              <span className="w-px h-4 bg-paper-50/10" />
              <a
                href="https://inam-portfolio-mu.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 text-[11px] font-medium tracking-[0.06em] text-gold-400/60 hover:text-gold-300 transition-all duration-300"
              >
                <span className="relative">
                  INAM ULLAH AFRIDI
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold-400/40 group-hover:w-full transition-all duration-500" />
                </span>
                <svg 
                  className="w-3 h-3 text-gold-400/40 group-hover:text-gold-300 group-hover:translate-x-0.5 transition-all duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-gold-500/10" />
            <span className="w-1 h-1 rounded-full bg-gold-500/20" />
            <span className="w-8 h-px bg-gold-500/10" />
          </div>
        </div>
      </div>
    </footer>
  );
}