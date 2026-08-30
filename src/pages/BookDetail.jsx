import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { BOOKS, TRILOGY, bySlug, externalLinks, formatPrice } from "../data/books";
import { usePageFX, useSEO } from "../hooks/hooks";
import { useI18n } from "../i18n";
import BookCover from "../components/BookCover";
import { AddToCart, ProductCard, QtyStepper, SectionTitle } from "../components/ui";
import { BookIcon, ChevronDown, PenNib, QuoteMark, ShieldIcon, TruckIcon } from "../components/Icons";

export default function BookDetail() {
  const { slug } = useParams();
  /* Accented slug variants (e.g. /books/lágrimas-saladas) resolve to the
     canonical ASCII slug so externally shared accented links never break. */
  const normalized = slug
    ? slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    : undefined;
  const product = normalized ? bySlug(normalized) : undefined;
  const [qty, setQty] = useState(1);
  const { lang, t } = useI18n();
  const isOil = product?.kind === "oil";

  useSEO(
    product ? `${product.title} - LUIS CAPARRÓS` : "Book - LUIS CAPARRÓS",
    product
      ? lang === "en"
        ? `${product.blurb.en} ${product.genre.en} by Luis Caparrós (${product.year}). Buy direct from the author's shop — ${formatPrice(product.price)}.`
        : `${product.blurb.es} ${product.genre.es} de Luis Caparrós (${product.year}). Compra directa en la tienda del autor — ${formatPrice(product.price)}.`
      : "Book page by Luis Caparrós."
  );
  usePageFX([slug, lang]);

  if (product && slug !== product.slug) return <Navigate to={`/books/${product.slug}`} replace />;
  if (!product) return <Navigate to="/books" replace />;

  const siblings = product.trilogy ? TRILOGY.filter((b) => b.id !== product.id) : [];
  const ext = externalLinks(product);
  const related = BOOKS.filter((b) => b.id !== product.id).slice(0, 3);
  const index = BOOKS.findIndex((b) => b.id === product.id);

  const chips = isOil
    ? [
        t("book.bottle"),
        t("book.harvest", { year: product.year }),
        t("book.picual"),
        t("book.cold"),
      ]
    : [
        t("book.pages", { n: product.pages ?? 0 }),
        t("book.edition", { year: product.year }),
        t("book.paperback"),
        t("book.spanish"),
      ];

  return (
    <>
      {/* breadcrumb band */}
      <div className="bg-pine-950 text-paper-100/70 pt-[104px]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-4 flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase">
          <Link to="/" className="hover:text-gold-300 transition-colors">{t("legal.home")}</Link>
          <ChevronDown className="w-3 h-3 -rotate-90" />
          <Link to={isOil ? "/store" : "/books"} className="hover:text-gold-300 transition-colors">
            {isOil ? t("nav.store") : t("nav.books")}
          </Link>
          <ChevronDown className="w-3 h-3 -rotate-90" />
          <span className="text-gold-400">{product.title}</span>
        </div>
      </div>

      {/* main */}
      <section className="paper-grain py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20">
          {/* left: sticky cover */}
          <div className="lg:sticky lg:top-32 self-start">
            <div className="rv-scale relative max-w-[400px] mx-auto lg:mx-0 @container group">
              <BookCover product={product} />
              {product.isNew && (
                <span className="absolute top-4 -left-2 bg-wine-600 text-paper-50 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 shadow-lg rotate-[-3deg]">
                  {t("badge.new", { year: product.year })}
                </span>
              )}
            </div>
            <div className="rv mt-8 flex items-center justify-center lg:justify-start gap-6 text-pine-700 text-xs font-semibold">
              <span className="flex items-center gap-2"><TruckIcon className="w-4.5 h-4.5 text-wine-600" /> {t("book.shipFast")}</span>
              <span className="flex items-center gap-2"><ShieldIcon className="w-4.5 h-4.5 text-wine-600" /> {t("book.secure")}</span>
            </div>
          </div>

          {/* right: info */}
          <div>
            <p className="hero-el flex flex-wrap items-center gap-3 font-body font-bold text-[11px] tracking-[0.3em] uppercase text-wine-600">
              <BookIcon className="w-4 h-4" /> {product.genre[lang]} · {product.year}
              {product.trilogy && (
                <span className="bg-gold-500/20 text-gold-600 border border-gold-500/40 px-2.5 py-0.5 tracking-[0.18em]">{t("book.trilogyBadge")}</span>
              )}
            </p>
            <h1 className="mt-4 font-display font-semibold text-pine-900 leading-[1.03] text-[clamp(2.2rem,5vw,3.8rem)] text-balance">
              <span className="line-mask"><span>{product.title}</span></span>
            </h1>
            {product.subtitle && (
              <p className="hero-el mt-3 font-display italic text-xl text-pine-700">{product.subtitle[lang]}</p>
            )}

            {/* meta chips */}
            <div className="hero-el mt-6 flex flex-wrap gap-2.5">
              {chips.map((chip) => (
                <span key={chip} className="chip border border-pine-800/25 px-3.5 py-1.5 text-[12px] font-bold tracking-wide text-pine-800 bg-paper-50/60">
                  {chip}
                </span>
              ))}
            </div>

            {/* price + buy */}
            <div className="hero-el mt-8 p-6 bg-paper-50 border border-pine-800/15 shadow-sm">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-pine-600">{t("book.price")}</p>
                  <p className="font-display font-black text-4xl text-pine-900 leading-none mt-1">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-pine-700/70 mt-1">
                    {t("book.vat", { n: product.stock, unit: isOil ? t("book.units") : t("book.copies") })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <QtyStepper qty={qty} max={Math.min(product.stock, 10)} onChange={(q) => setQty(Math.max(1, q))} />
                  <AddToCart product={product} qty={qty} />
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-pine-800/12 flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-pine-600">{t("book.alsoOn")}</span>
                <a href={ext.amazon} target="_blank" rel="noreferrer" className="link-ink text-[12px] font-semibold text-pine-700/80 hover:text-wine-600">
                  {t("book.verAmazon")} ↗
                </a>
                <a href={ext.goodreads} target="_blank" rel="noreferrer" className="link-ink text-[12px] font-semibold text-pine-700/80 hover:text-wine-600">
                  {t("book.verGoodreads")} ↗
                </a>
              </div>
            </div>

            {/* series banner — only for trilogy volumes, deliberately unnumbered */}
            {product.trilogy && (
              <div className="hero-el mt-6 relative bg-pine-900 text-paper-50 p-6 sm:p-7 overflow-hidden">
                <div className="absolute inset-0 olive-branch-bg opacity-25" aria-hidden="true" />
                <div className="relative flex flex-wrap items-center justify-between gap-5">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold tracking-[0.26em] uppercase text-gold-400">{t("book.seriesEyebrow")}</p>
                    <p className="mt-1.5 text-sm text-paper-100/85 max-w-md">{t("book.seriesText")}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {siblings.map((b) => (
                        <Link
                          key={b.id}
                          to={`/books/${b.slug}`}
                          className="chip border border-paper-50/25 px-3 py-1.5 text-[12px] font-semibold text-paper-100/90 hover:border-gold-400 hover:text-gold-300"
                        >
                          {b.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link
                    to="/lagrimas-saladas-trilogy"
                    className="btn-primary shrink-0 inline-flex items-center gap-2.5 border border-gold-400 text-gold-300 font-body font-bold text-[11.5px] tracking-[0.16em] uppercase px-5 py-3"
                  >
                    {t("book.seriesCta")}
                  </Link>
                </div>
              </div>
            )}

            {/* description */}
            <div className="mt-10">
              <h2 className="font-display font-bold text-xl text-pine-900 flex items-center gap-3">
                <span className="h-px w-8 bg-wine-600/60" /> {t("book.desc")}
              </h2>
              <div className="mt-4 space-y-5 text-[15px] sm:text-base leading-relaxed text-pine-700">
                {product.description[lang].map((p, i) => (
                  <p key={i} className={i === 0 ? "rv drop-cap" : "rv"}>{p}</p>
                ))}
              </div>
            </div>

            {/* quote */}
            {product.quote && (
              <figure className="rv mt-10 relative bg-pine-950 text-paper-50 p-8 lg:p-10 overflow-hidden">
                <div className="absolute inset-0 olive-branch-bg opacity-30" aria-hidden="true" />
                <QuoteMark className="relative w-9 h-7 text-gold-500" />
                <blockquote className="relative mt-4 font-display italic text-xl lg:text-2xl leading-snug text-balance">
                  {product.quote[lang]}
                </blockquote>
                <figcaption className="relative mt-4 text-[11px] font-bold tracking-[0.26em] uppercase text-gold-400">
                  — {product.title}
                </figcaption>
              </figure>
            )}

            {/* details table */}
            <div className="rv mt-10">
              <h2 className="font-display font-bold text-xl text-pine-900 flex items-center gap-3">
                <span className="h-px w-8 bg-wine-600/60" /> {t("book.tech")}
              </h2>
              <dl className="mt-4 divide-y divide-pine-800/12 border-y border-pine-800/12">
                {product.details.map((d) => (
                  <div key={d.label.en} className="grid grid-cols-[130px_1fr] sm:grid-cols-[180px_1fr] gap-4 py-3 text-sm">
                    <dt className="font-bold tracking-wide text-pine-800">{d.label[lang]}</dt>
                    <dd className="text-pine-700/90">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* tags */}
            <div className="rv mt-8 flex flex-wrap items-center gap-2.5">
              <PenNib className="w-4 h-4 text-wine-600" />
              {product.tags.map((tag) => (
                <Link
                  key={tag.en}
                  to="/books"
                  className="chip bg-pine-800/8 hover:bg-gold-500/25 border border-pine-800/20 px-3.5 py-1.5 text-[12px] font-semibold text-pine-800"
                >
                  #{tag[lang]}
                </Link>
              ))}
            </div>

            {/* author info */}
            <div className="rv mt-10 flex items-start gap-5 bg-paper-50 border border-pine-800/15 p-6">
              <img
                src="/images/autor.jpg"
                alt="Luis Caparrós"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shrink-0 border-2 border-gold-500/60"
                loading="lazy"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-[0.26em] uppercase text-wine-600">{t("book.aboutAuthor")}</p>
                <h2 className="mt-1 font-display font-bold text-xl text-pine-900">Luis Caparrós</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-pine-700/90">{t("book.aboutAuthorText")}</p>
                <Link to="/biography" className="link-ink mt-3 inline-block font-body font-bold text-[11.5px] tracking-[0.18em] uppercase text-wine-600">
                  {t("book.aboutAuthorCta")} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* related */}
      <section className="pt-20 pb-36 lg:py-24 bg-paper-200/60 border-t border-pine-800/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle eyebrow={t("book.position", { i: index + 1, n: BOOKS.length })}>{t("book.reading")}</SectionTitle>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {related.map((b, i) => (
              <ProductCard key={b.id} product={b} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Sticky mobile purchase bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-paper-50/95 backdrop-blur border-t border-pine-800/15 shadow-[0_-12px_32px_-18px_rgba(16,26,21,0.45)] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3 max-w-2xl mx-auto">
          <div className="min-w-0">
            <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-pine-600 truncate">{product.title}</p>
            <p className="font-display font-black text-xl text-pine-900 leading-none mt-0.5">{formatPrice(product.price)}</p>
          </div>
          <AddToCart product={product} className="!px-5 !py-3 shrink-0" />
        </div>
      </div>
    </>
  );
}