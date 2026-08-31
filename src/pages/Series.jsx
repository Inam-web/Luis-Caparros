import { Link } from "react-router-dom";
import { SERIES_ORDER, TRILOGY, formatPrice, externalLinks } from "../data/books";
import { usePageFX, useSEO } from "../hooks/hooks";
import { useI18n } from "../i18n";
import { useStore } from "../context/StoreContext";
import RealBookCover from "../components/RealBookCover";
import { AddToCart, SectionTitle } from "../components/ui";
import { ArrowRight, BookIcon, CartIcon, OliveBranch } from "../components/Icons";

/**
 * Dedicated series page for the Lágrimas Saladas trilogy.
 * NOTE: the reading order is NOT confirmed by the client yet — this page
 * deliberately presents the three volumes without any "book 1/2/3" ordering.
 */
export default function Series() {
  const { lang, t } = useI18n();
  useSEO(
    lang === "en"
      ? "The Lágrimas Saladas Trilogy - LUIS CAPARRÓS"
      : "La Trilogía Lágrimas Saladas - LUIS CAPARRÓS",
    lang === "en"
      ? "Lágrimas Saladas, El Árbol de la Memoria and Volver tras mis Pasos: the complete trilogy by Luis Caparrós. Buy the three volumes signed, direct from the author."
      : "Lágrimas Saladas, El Árbol de la Memoria y Volver tras mis Pasos: la trilogía completa de Luis Caparrós. Compra los tres volúmenes firmados, directamente al autor."
  );
  usePageFX([lang]);
  const { addToCart, pushToast } = useStore();

  const addTrilogy = () => {
    TRILOGY.forEach((b, i) => addToCart(b, 1, i > 0));
    pushToast(t("cart.trilogyAdded"));
  };

  /* Reading order is PENDING client confirmation. SERIES_ORDER is null until
     Luis confirms it; only then are volumes numbered. See src/data/books.js. */
  const volumes = SERIES_ORDER
    ? SERIES_ORDER.map((s) => TRILOGY.find((b) => b.slug === s)).filter((b) => !!b)
    : TRILOGY;
  const orderConfirmed = SERIES_ORDER !== null;

  const goodreads = externalLinks(volumes[0] ?? TRILOGY[0]).goodreads;

  return (
    <>
      {/* hero */}
      <section className="relative bg-pine-950 text-paper-50 pt-40 pb-16 lg:pt-48 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 olive-branch-bg opacity-25" aria-hidden="true" />
        <div className="absolute -top-24 right-[-10%] w-[520px] h-[520px] rounded-full bg-pine-700/30 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 flex flex-wrap items-end justify-between gap-10">
          <div className="max-w-2xl">
            <p className="hero-el flex items-center gap-3 font-body font-bold text-[11px] tracking-[0.34em] uppercase text-gold-400">
              <BookIcon className="w-4.5 h-4.5" /> {t("series.eyebrow")}
            </p>
            <h1 className="mt-5 font-display font-semibold leading-[1.0] text-[clamp(2.6rem,6.5vw,5rem)]">
              <span className="line-mask"><span>{t("series.l1")}</span></span>
              <span className="line-mask"><span className="italic font-light text-gold-300">{t("series.l2")}</span></span>
            </h1>
            <p className="hero-el mt-6 text-[15px] leading-relaxed text-paper-100/80">{t("series.intro")}</p>
            <div className="hero-el mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={addTrilogy}
                className="btn-primary inline-flex items-center gap-3 border border-gold-400 text-gold-300 font-body font-bold text-[12.5px] tracking-[0.16em] uppercase px-7 py-4"
              >
                <CartIcon className="w-4.5 h-4.5" />
                {t("series.bundleCta")} · {formatPrice(TRILOGY.reduce((a, b) => a + b.price, 0))}
              </button>
              <a
                href={goodreads}
                target="_blank"
                rel="noreferrer"
                className="link-ink font-body font-bold text-[12.5px] tracking-[0.16em] uppercase text-paper-100/70 hover:text-gold-300 py-4"
              >
                Goodreads ↗
              </a>
            </div>
          </div>

          {/* stacked covers */}
          <div className="hero-el hidden md:flex items-end gap-4 lg:gap-6 justify-self-end">
            {volumes.map((b, i) => (
              <Link
                key={b.id}
                to={`/books/${b.slug}`}
                className="@container w-[120px] lg:w-[150px] transition-transform duration-500 hover:-translate-y-3"
                style={{ transform: `rotate(${(i - 1) * 4}deg) translateY(${i === 1 ? -14 : 0}px)` }}
                aria-label={b.title}
              >
                <RealBookCover product={b} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* volumes — deliberately unnumbered (reading order pending client confirmation) */}
      <section className="py-20 lg:py-28 paper-grain">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle eyebrow={t("series.volumes")}>{t("series.standalone")}</SectionTitle>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-x-6 gap-y-10">
            {volumes.map((b, i) => (
              <article key={b.id} className="rv group flex flex-col" style={{ transitionDelay: `${i * 80}ms` }}>
                <Link to={`/books/${b.slug}`} className="block @container max-w-[280px] mx-auto w-full" aria-label={b.title}>
                  <RealBookCover product={b} />
                </Link>
                <div className="mt-6 text-center">
                  {orderConfirmed && (
                    <p className="font-display italic text-3xl text-gold-600">{i + 1}</p>
                  )}
                  <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-wine-600">{b.year} · {b.genre[lang]}</p>
                  <h2 className="mt-1.5 font-display font-semibold text-2xl text-pine-900">
                    <Link to={`/books/${b.slug}`} className="hover:text-wine-600 transition-colors duration-300">{b.title}</Link>
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-pine-700/85 max-w-xs mx-auto">{b.blurb[lang]}</p>
                  <div className="mt-5 flex items-center justify-center gap-5">
                    <p className="font-display font-bold text-xl text-pine-900">{formatPrice(b.price)}</p>
                    <AddToCart product={b} className="!px-5 !py-2.5" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* why readers love it */}
      <section className="relative bg-pine-950 text-paper-50 py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 olive-branch-bg opacity-25" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <SectionTitle tone="dark" eyebrow={t("series.whyEyebrow")}>{t("series.whyTitle")}</SectionTitle>
          <div className="mt-12 grid md:grid-cols-3 gap-10">
            {[1, 2, 3].map((n, i) => (
              <div key={n} className="rv" style={{ transitionDelay: `${i * 80}ms` }}>
                <OliveBranch className="w-16 h-5 text-gold-500/80" />
                <h3 className="mt-4 font-display font-semibold text-xl text-paper-50">{t(`series.why${n}t`)}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-paper-100/75">{t(`series.why${n}d`)}</p>
              </div>
            ))}
          </div>

          {/* cross-links between the three volumes */}
          <nav className="rv mt-16 pt-10 border-t border-paper-50/12" aria-label="Trilogy cross-links">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-gold-400 mb-5">{t("series.volumes")}</p>
            <div className="flex flex-wrap gap-3">
              {volumes.map((b) => (
                <Link
                  key={b.id}
                  to={`/books/${b.slug}`}
                  className="chip border border-paper-50/20 px-5 py-3 font-body font-semibold text-sm text-paper-100/90 hover:border-gold-400 hover:text-gold-300 flex items-center gap-2.5"
                >
                  {b.title}
                  <ArrowRight className="w-4 h-4 text-gold-500" />
                </Link>
              ))}
            </div>
          </nav>

          <div className="rv mt-14 flex flex-wrap items-center justify-between gap-6">
            <Link to="/books" className="link-ink font-body font-bold text-[12px] tracking-[0.2em] uppercase text-paper-100/70 hover:text-gold-300">
              ← {t("series.backBooks")}
            </Link>
            <a
              href={goodreads}
              target="_blank"
              rel="noreferrer"
              className="font-body font-semibold text-sm text-gold-300 hover:text-gold-400 transition-colors link-ink"
            >
              {t("series.goodreads")} ↗
            </a>
          </div>
        </div>
      </section>
    </>
  );
}