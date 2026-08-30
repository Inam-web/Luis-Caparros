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
  return (
    <footer className="relative bg-pine-950 text-paper-100 overflow-hidden">
      <div className="absolute inset-0 olive-branch-bg opacity-40 pointer-events-none" />
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

          {/* latest books */}
          <nav aria-label="Latest books">
            <h3 className="font-body font-bold text-[11px] tracking-[0.3em] uppercase text-gold-400">{t("footer.latest")}</h3>
            <ul className="mt-5 space-y-2.5">
              {BOOKS.slice(1).map((b) => (
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
            <div className="mt-5 flex gap-3">
              <a
                href={AUTHOR.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="chip grid place-items-center w-11 h-11 border border-paper-100/25 rounded-full text-paper-100 hover:bg-gold-500 hover:border-gold-500 hover:text-pine-950"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={AUTHOR.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="chip grid place-items-center w-11 h-11 border border-paper-100/25 rounded-full text-paper-100 hover:bg-gold-500 hover:border-gold-500 hover:text-pine-950"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href={AUTHOR.goodreads}
                target="_blank"
                rel="noreferrer"
                aria-label="Goodreads"
                className="chip grid place-items-center w-11 h-11 border border-paper-100/25 rounded-full text-paper-100 hover:bg-gold-500 hover:border-gold-500 hover:text-pine-950"
              >
                <GoodreadsIcon className="w-5 h-5" />
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
          <nav aria-label="Legal links" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {LEGAL.map((l) => (
              <Link key={l.to} to={l.to} className="link-ink text-xs text-paper-100/70 hover:text-gold-300 transition-colors">
                {t(LEGAL_LABELS[l.key])}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}