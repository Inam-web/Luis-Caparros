import { Link } from "react-router-dom";
import { BOOKS, HOME_STATS, LATEST, TRILOGY, formatPrice } from "../data/books";
import { usePageFX, useParallax, useSEO } from "../hooks/hooks";
import { useLenis } from "../components/Layout";
import { useI18n } from "../i18n";
import BookCover from "../components/BookCover";
import { AddToCart, ArrowLink, Divider, ProductCard, SectionTitle, Stat } from "../components/ui";
import { ArrowRight, CartIcon, FeatherIcon, OliveBranch, PenNib, QuoteMark } from "../components/Icons";
import { useStore } from "../context/StoreContext";

const MARQUEE_TITLES = BOOKS.map((b) => b.title);

export default function Home() {
  const { lang, t } = useI18n();
  useSEO(
    lang === "en"
      ? "Luis Caparrós — Spanish Novelist of Memory, the Civil War & Andalusia"
      : "Luis Caparrós — Escritor: novela de memoria, Guerra Civil y Andalucía",
    lang === "en"
      ? "The Lágrimas Saladas trilogy, Hijas del Viento, Lucía la Romí Lorquina and more: novels of memory, the Spanish Civil War and rural Andalusia. Signed copies direct from the author's shop."
      : "La trilogía Lágrimas Saladas, Hijas del Viento, Lucía la Romí Lorquina y más: novelas de memoria, la Guerra Civil española y la Andalucía rural. Ejemplares firmados, directos de la tienda del autor."
  );
  usePageFX([lang]);
  useParallax();
  const { scrollToId } = useLenis();
  const { addToCart, pushToast } = useStore();

  const addTrilogy = () => {
    TRILOGY.forEach((b, i) => addToCart(b, 1, i > 0));
    pushToast(t("cart.trilogyAdded"));
  };

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative min-h-[100svh] flex items-end lg:items-center overflow-hidden paper-grain">
        {/* right photo band */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[46%]">
          <div className="img-reveal absolute inset-0">
            <img
              src="/images/olivar.jpg"
              alt={lang === "en" ? "Andalusian olive grove at dusk, the landscape that inhabits the works of Luis Caparrós" : "Olivar andaluz al atardecer, paisaje que habita la obra de Luis Caparrós"}
              className="w-full h-full object-cover"
              data-parallax="0.12"
              fetchPriority="high"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-paper-100 via-paper-100/55 to-transparent lg:via-paper-100/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-paper-100 via-transparent to-paper-100/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 w-full pt-40 pb-16 lg:pt-36 lg:pb-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
          {/* left: words */}
          <div>
            <p className="hero-el flex items-center gap-3 font-body font-bold text-[11px] sm:text-xs tracking-[0.34em] uppercase text-wine-600">
              <OliveBranch className="w-16 h-5 text-gold-600" />
              {t("home.eyebrow")}
            </p>
            <h1 className="mt-6 font-display font-semibold text-pine-900 leading-[0.98] text-[clamp(2.7rem,7.2vw,5.6rem)]">
              <span className="line-mask"><span>{t("home.l1")}</span></span>
              <span className="line-mask"><span>{t("home.l2")}</span></span>
              <span className="line-mask"><span className="italic font-light text-wine-600">{t("home.l3")}</span></span>
            </h1>
            <p className="hero-el mt-7 max-w-lg text-[15px] sm:text-base leading-relaxed text-pine-700">{t("home.intro")}</p>
            <div className="hero-el mt-9 flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollToId("latest-release")}
                className="btn-primary group inline-flex items-center gap-3 bg-pine-900 text-paper-50 border border-pine-900 font-body font-bold text-[12.5px] tracking-[0.16em] uppercase px-7 py-4"
              >
                {t("home.cta1")}
                <ArrowRight className="w-4.5 h-4.5 transition-transform duration-400 group-hover:translate-x-1" />
              </button>
              <Link
                to="/biography"
                className="link-ink font-body font-bold text-[12.5px] tracking-[0.16em] uppercase text-pine-800 py-4"
              >
                {t("home.cta2")}
              </Link>
            </div>

            {/* epigraph */}
            <figure className="hero-el mt-12 max-w-md border-l-2 border-gold-500 pl-5">
              <QuoteMark className="w-6 h-5 text-gold-600 mb-1.5" />
              <blockquote className="font-display italic text-lg sm:text-xl leading-snug text-pine-800">
                {t("home.epigraph")}
              </blockquote>
              <figcaption className="mt-3 text-[11px] font-bold tracking-[0.26em] uppercase text-pine-600">
                {t("home.epigraphBy")}
              </figcaption>
            </figure>
          </div>

          {/* right: floating latest cover */}
          <div className="hero-el relative hidden sm:block justify-self-end w-[58%] max-w-[330px] lg:mr-6">
            <div className="floaty [--tilt:0deg]">
              <Link to={`/books/${LATEST.slug}`} aria-label={t("home.latestAria", { title: LATEST.title })} className="block @container">
                <BookCover product={LATEST} />
              </Link>
            </div>
            <div className="absolute -bottom-5 -left-8 lg:-left-16 bg-paper-50 border border-pine-800/15 shadow-xl shadow-pine-950/15 px-5 py-3.5 rotate-[-3deg]">
              <p className="text-[10px] font-bold tracking-[0.26em] uppercase text-wine-600">{t("home.latestBadge")}</p>
              <p className="font-display font-semibold text-pine-900 leading-tight">{LATEST.title} · {LATEST.year}</p>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <button
          onClick={() => scrollToId("biography")}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-pine-700 hover:text-wine-600 transition-colors"
          aria-label={t("home.scroll")}
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">{t("home.scroll")}</span>
          <span className="w-px h-10 bg-current inkpulse" />
        </button>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="relative bg-pine-950 text-paper-100 py-4 overflow-hidden border-y border-gold-500/25" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex items-center shrink-0">
              {MARQUEE_TITLES.map((tl, i) => (
                <span key={rep + "-" + i} className="flex items-center">
                  <span className="font-display italic text-lg sm:text-xl px-6 whitespace-nowrap text-paper-100/90">{tl}</span>
                  <PenNib className="w-4 h-4 text-gold-500 shrink-0" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============ BIOGRAPHY intro (sticky two-column) ============ */}
      <section id="biography" className="relative py-24 lg:py-32 olive-branch-bg">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20">
          <div className="lg:sticky lg:top-32 self-start">
            <div className="rv-left relative">
              <div className="img-reveal relative overflow-hidden">
                <img
                  src="/images/autor.jpg"
                  alt={lang === "en" ? "Portrait of the writer Luis Caparrós in his study" : "Retrato del escritor Luis Caparrós en su estudio"}
                  className="w-full aspect-[4/5] object-cover"
                  loading="lazy"
                  data-parallax="0.06"
                />
              </div>
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-gold-500/50 -z-10" aria-hidden="true" />
              <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-pine-900 text-paper-50 px-6 py-4 shadow-xl rotate-2">
                <p className="font-display italic text-lg leading-tight">{t("home.photoQuote1")}</p>
                <p className="font-display italic text-lg leading-tight">{t("home.photoQuote2")}</p>
              </div>
            </div>
          </div>

          <div>
            <SectionTitle eyebrow={t("home.bioEyebrow")}>{t("home.bioTitle")}</SectionTitle>
            <div className="mt-7 space-y-5 text-[15px] sm:text-base leading-relaxed text-pine-700 max-w-xl">
              <p className="rv drop-cap">{t("home.bioP1")}</p>
              <p className="rv">{t("home.bioP2")}</p>
              <p className="rv">{t("home.bioP3")}</p>
            </div>
            <div className="rv mt-9">
              <ArrowLink to="/biography">{t("home.bioLink")}</ArrowLink>
            </div>

            {/* signature strip */}
            <div className="rv mt-12 pt-8 border-t border-pine-800/15 grid grid-cols-2 gap-6">
              <div>
                <p className="font-display font-bold text-2xl text-pine-900">{t("home.strip1t")}</p>
                <p className="mt-1 text-sm text-pine-700/80">{t("home.strip1d")}</p>
              </div>
              <div>
                <p className="font-display font-bold text-2xl text-pine-900">{t("home.strip2t")}</p>
                <p className="mt-1 text-sm text-pine-700/80">{t("home.strip2d")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="relative bg-pine-950 text-paper-50 py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 olive-branch-bg opacity-30" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-5 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-10">
          <Stat value={HOME_STATS.works} label={t("home.statsBooks")} />
          <Stat value={HOME_STATS.pages} suffix="+" label={t("home.statsPages")} />
          <Stat value={HOME_STATS.goodreadsReviews} label={t("home.statsReviews")} />
          <Stat value={HOME_STATS.trilogyVolumes} label={t("home.statsTrilogy")} />
        </div>
      </section>

      {/* ============ LATEST PUBLICATION ============ */}
      <section id="latest-release" className="relative py-24 lg:py-32 paper-grain">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-14 items-center">
          <div className="rv-scale relative justify-self-center w-full max-w-[340px] @container group">
            <BookCover product={LATEST} />
            <span className="absolute top-4 -left-2 bg-wine-600 text-paper-50 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 shadow-lg rotate-[-3deg]">
              {t("badge.new", { year: LATEST.year })}
            </span>
          </div>
          <div>
            <SectionTitle eyebrow={t("home.latestEyebrow", { year: LATEST.year })}>{LATEST.title}</SectionTitle>
            <p className="rv mt-6 max-w-xl text-[15px] sm:text-base leading-relaxed text-pine-700">
              {LATEST.description[lang][0]}
            </p>
            <figure className="rv mt-6 border-l-2 border-wine-600/70 pl-5 max-w-xl">
              <blockquote className="font-display italic text-xl text-pine-800">«{LATEST.quote?.[lang]}»</blockquote>
            </figure>
            <div className="rv mt-8 flex flex-wrap items-center gap-5">
              <p className="font-display font-black text-3xl text-pine-900">{formatPrice(LATEST.price)}</p>
              <AddToCart product={LATEST} />
            </div>
            <div className="rv mt-6">
              <ArrowLink to={`/books/${LATEST.slug}`}>{t("home.latestSheet")}</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WORKS GRID ============ */}
      <section className="relative py-24 lg:py-28 bg-paper-200/60 border-y border-pine-800/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle eyebrow={t("home.worksEyebrow")}>{t("home.worksTitle")}</SectionTitle>
            <span className="rv"><ArrowLink to="/books">{t("home.worksAll")}</ArrowLink></span>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {BOOKS.slice(0, 6).map((b, i) => (
              <ProductCard key={b.id} product={b} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRILOGY ============ */}
      <section className="relative bg-pine-950 text-paper-50 py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 olive-branch-bg opacity-25" aria-hidden="true" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full bg-pine-700/25 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="rv flex items-center justify-center gap-3 font-body font-bold text-[11px] tracking-[0.34em] uppercase text-gold-400">
              <span className="h-px w-10 bg-gold-400/60" /> {t("home.trilogyPre")} <span className="h-px w-10 bg-gold-400/60" />
            </p>
            <h2 className="mt-4 font-display font-semibold leading-[1.05] text-[clamp(2rem,4.8vw,3.6rem)]">
              <span className="line-mask"><span>{t("home.trilogyTitle")}</span></span>
            </h2>
            <p className="rv mt-5 text-paper-100/75 text-[15px] leading-relaxed">{t("home.trilogyText")}</p>
          </div>

          <div className="mt-16 grid sm:grid-cols-3 gap-10 lg:gap-8 max-w-4xl mx-auto">
            {TRILOGY.map((b, i) => (
              <Link key={b.id} to={`/books/${b.slug}`} className="rv group block text-center" style={{ transitionDelay: `${i * 90}ms` }}>
                <div className="@container relative mx-auto w-[78%]">
                  <BookCover product={b} />
                </div>
                <h3 className="mt-5 font-display font-semibold text-xl text-paper-50 group-hover:text-gold-300 transition-colors">
                  {b.title}
                </h3>
                <p className="mt-1 text-sm text-paper-100/60">{b.year} · {formatPrice(b.price)}</p>
              </Link>
            ))}
          </div>

          <div className="rv mt-14 flex flex-col items-center gap-4">
            <button
              onClick={addTrilogy}
              className="btn-primary inline-flex items-center gap-3 border border-gold-400 text-gold-300 font-body font-bold text-[12.5px] tracking-[0.18em] uppercase px-8 py-4"
            >
              <CartIcon className="w-4.5 h-4.5" />
              {t("home.trilogyAdd")} · {formatPrice(TRILOGY.reduce((a, b) => a + b.price, 0))}
            </button>
            <p className="text-xs text-paper-100/50">{t("home.trilogyHint")}</p>
            <Link
              to="/lagrimas-saladas-trilogy"
              className="link-ink font-body font-bold text-[12px] tracking-[0.2em] uppercase text-paper-100/70 hover:text-gold-300"
            >
              {t("home.trilogyCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* ============ THE CRAFT (numbered rows) ============ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionTitle eyebrow={t("home.oficioEyebrow")}>{t("home.oficioTitle")}</SectionTitle>
          <div className="mt-14 divide-y divide-pine-800/12 border-y border-pine-800/12">
            {[1, 2, 3].map((n, i) => (
              <div key={n} className="rv group grid md:grid-cols-[110px_1fr_auto] gap-4 md:gap-8 items-baseline py-8 hover:bg-paper-50/70 transition-colors px-2 md:px-4" style={{ transitionDelay: `${i * 70}ms` }}>
                <p className="font-display italic font-light text-4xl md:text-5xl text-gold-600/80 group-hover:text-wine-600 transition-colors duration-500">0{n}</p>
                <div>
                  <h3 className="font-display font-semibold text-xl md:text-2xl text-pine-900">{t(`home.oficio${n}t`)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-pine-700/90 max-w-2xl">{t(`home.oficio${n}d`)}</p>
                </div>
                <FeatherIcon className="hidden md:block w-8 h-8 text-pine-600/40 group-hover:text-gold-600 group-hover:-rotate-12 transition-all duration-500 justify-self-end" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL QUOTE + CTA ============ */}
      <section className="relative py-24 lg:py-32 text-center overflow-hidden paper-grain">
        <Divider className="rv mb-10" />
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="font-display font-light italic text-pine-900 leading-[1.15] text-[clamp(1.7rem,4.2vw,3rem)] text-balance">
            <span className="line-mask"><span>{t("home.quoteL1")}</span></span>
            <span className="line-mask"><span className="font-semibold not-italic text-wine-600">{t("home.quoteL2")}</span></span>
          </h2>
          <p className="rv mt-8 text-[11px] font-bold tracking-[0.3em] uppercase text-pine-600">Luis Caparrós</p>
          <div className="rv mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/store"
              className="btn-primary group inline-flex items-center gap-3 bg-pine-900 text-paper-50 border border-pine-900 font-body font-bold text-[12.5px] tracking-[0.16em] uppercase px-7 py-4"
            >
              {t("home.quoteCta1")} <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform duration-400" />
            </Link>
            <Link
              to="/contact"
              className="link-ink font-body font-bold text-[12.5px] tracking-[0.16em] uppercase text-pine-800 py-4"
            >
              {t("home.quoteCta2")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}