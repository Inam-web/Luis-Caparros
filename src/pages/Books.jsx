import { useMemo, useState } from "react";
import { BOOKS, TRILOGY, formatPrice } from "../data/books";
import { usePageFX, useSEO } from "../hooks/hooks";
import { useI18n } from "../i18n";
import { ProductCard, SectionTitle } from "../components/ui";
import { BookIcon, CartIcon } from "../components/Icons";
import { useStore } from "../context/StoreContext";
import { Link } from "react-router-dom";
import { cn } from "../utils/cn";

const FILTER_IDS = ["all", "novel", "trilogy", "memoir"];

const LABEL_KEYS = {
  all: "booksPage.fAll",
  novel: "booksPage.fNovel",
  trilogy: "booksPage.fTrilogy",
  memoir: "booksPage.fMemoir",
};

export default function Books() {
  const { lang, t } = useI18n();
  useSEO(
    lang === "en" ? "Books - LUIS CAPARRÓS" : "Libros - LUIS CAPARRÓS",
    lang === "en"
      ? "The complete works of Luis Caparrós: the Lágrimas Saladas trilogy, Hijas del Viento and other novels of the Civil War, rural Spain and the housing-bubble years. Buy direct from the author."
      : "La obra completa de Luis Caparrós: la trilogía Lágrimas Saladas, Hijas del Viento y otras novelas de la Guerra Civil, la España rural y los años de la burbuja. Compra directa al autor."
  );
  const [filter, setFilter] = useState("all");
  usePageFX([filter, lang]);
  const { addToCart, pushToast } = useStore();

  const filtered = useMemo(() => {
    if (filter === "all") return BOOKS;
    if (filter === "trilogy") return BOOKS.filter((b) => b.trilogy);
    if (filter === "novel") return BOOKS.filter((b) => (b.genre.en + " " + b.genre.es).toLowerCase().includes("novel"));
    return BOOKS.filter((b) => b.genre.en.toLowerCase().includes(filter));
  }, [filter]);

  const addTrilogy = () => {
    TRILOGY.forEach((b, i) => addToCart(b, 1, i > 0));
    pushToast(t("cart.trilogyAdded"));
  };

  return (
    <>
      {/* hero */}
      <section className="relative bg-pine-950 text-paper-50 pt-40 pb-16 lg:pt-48 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 olive-branch-bg opacity-25" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="hero-el flex items-center gap-3 font-body font-bold text-[11px] tracking-[0.34em] uppercase text-gold-400">
              <BookIcon className="w-4.5 h-4.5" /> {t("booksPage.eyebrow")}
            </p>
            <h1 className="mt-5 font-display font-semibold leading-[1.02] text-[clamp(2.6rem,6.5vw,5rem)]">
              <span className="line-mask"><span>{t("booksPage.l1")}</span></span>
              <span className="line-mask"><span className="italic font-light text-gold-300">{t("booksPage.l2")}</span></span>
            </h1>
            <p className="hero-el mt-6 max-w-xl text-[15px] leading-relaxed text-paper-100/80">{t("booksPage.intro")}</p>
          </div>
          <div className="hero-el text-right">
            <p className="font-display font-black text-6xl text-gold-300 leading-none tabular-nums">{BOOKS.length}</p>
            <p className="mt-1 text-[11px] font-bold tracking-[0.28em] uppercase text-paper-100/60">{t("booksPage.count")}</p>
          </div>
        </div>
      </section>

      {/* filters + grid */}
      <section className="py-16 lg:py-20 paper-grain">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex flex-wrap items-center gap-2.5" role="tablist" aria-label={t("booksPage.filterAria")}>
            {FILTER_IDS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "chip px-5 py-2.5 border font-body font-bold text-[12px] tracking-[0.14em] uppercase transition-all duration-300",
                  filter === f
                    ? "bg-pine-900 text-paper-50 border-pine-900 shadow-lg shadow-pine-950/20"
                    : "border-pine-800/30 text-pine-800 hover:border-pine-800 hover:bg-paper-50"
                )}
              >
                {t(LABEL_KEYS[f])}
              </button>
            ))}
            <span className="ml-auto text-sm text-pine-700/70 tabular-nums">{t("booksPage.titles", { n: filtered.length })}</span>
          </div>

          <div key={filter + lang} className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {filtered.map((b, i) => (
              <ProductCard key={b.id} product={b} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* trilogy strip */}
      <section className="relative bg-pine-900 text-paper-50 py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 olive-branch-bg opacity-25" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <SectionTitle tone="dark" eyebrow={t("booksPage.stripEyebrow")}>{t("booksPage.stripTitle")}</SectionTitle>
            <p className="rv mt-4 text-[15px] text-paper-100/75">{t("booksPage.stripText")}</p>
          </div>
          <div className="rv flex flex-col items-center gap-3 shrink-0">
            <button
              onClick={addTrilogy}
              className="btn-primary inline-flex items-center gap-3 border border-gold-400 text-gold-300 font-body font-bold text-[12.5px] tracking-[0.16em] uppercase px-8 py-4"
            >
              <CartIcon className="w-4.5 h-4.5" /> {t("booksPage.stripCta")} · {formatPrice(47)}
            </button>
            <Link to="/lagrimas-saladas-trilogy" className="link-ink text-[12px] font-bold tracking-[0.18em] uppercase text-paper-100/70">
              {t("booksPage.stripSeries")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}