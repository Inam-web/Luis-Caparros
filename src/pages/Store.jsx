import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BOOKS } from "../data/books";
import { usePageFX, useSEO } from "../hooks/hooks";
import { useI18n } from "../i18n";
import { ProductCard, SectionTitle } from "../components/ui";
import { ArrowRight, CartIcon, PenNib, ShieldIcon, TruckIcon } from "../components/Icons";

const SORTS = ["recent", "priceAsc", "priceDesc", "title"];
const SORT_KEYS = {
  recent: "store.sRecent",
  priceAsc: "store.sPriceAsc",
  priceDesc: "store.sPriceDesc",
  title: "store.sTitle",
};

export default function Store() {
  const { lang, t } = useI18n();
  useSEO(
    lang === "en" ? "Online Store - LUIS CAPARRÓS" : "Tienda Online - LUIS CAPARRÓS",
    lang === "en"
      ? "The author's own shop: buy the seven books of Luis Caparrós direct, with the margin that keeps the literature alive. Free shipping on orders over €30."
      : "La tienda del propio autor: compra los siete libros de Luis Caparrós directamente, con el margen que mantiene viva la literatura. Envío gratuito a partir de 30 €."
  );
  const [sort, setSort] = useState("recent");
  usePageFX([sort, lang]);

  const items = useMemo(() => {
    // The author-brand store carries books only. The olive oil lives on its
    // own standalone page (/olive-oil), unlinked from author pages.
    let list = [...BOOKS];
    switch (sort) {
      case "priceAsc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "title":
        list.sort((a, b) => a.title.localeCompare(b.title, "es"));
        break;
      default:
        list.sort((a, b) => b.year - a.year);
    }
    return list;
  }, [sort]);

  return (
    <>
      {/* hero */}
      <section className="relative bg-pine-950 text-paper-50 pt-40 pb-16 lg:pt-48 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 olive-branch-bg opacity-25" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="hero-el flex items-center gap-3 font-body font-bold text-[11px] tracking-[0.34em] uppercase text-gold-400">
              <CartIcon className="w-4.5 h-4.5" /> {t("store.eyebrow")}
            </p>
            <h1 className="mt-5 font-display font-semibold leading-[1.02] text-[clamp(2.6rem,6.5vw,5rem)]">
              <span className="line-mask"><span>{t("store.l1")}</span></span>
              <span className="line-mask"><span className="italic font-light text-gold-300">{t("store.l2")}</span></span>
            </h1>
            <p className="hero-el mt-6 max-w-xl text-[15px] leading-relaxed text-paper-100/80">{t("store.intro")}</p>
          </div>
          <ul className="hero-el space-y-2.5 text-sm text-paper-100/85">
            <li className="flex items-center gap-3"><TruckIcon className="w-4.5 h-4.5 text-gold-400" /> {t("store.trust1")}</li>
            <li className="flex items-center gap-3"><ShieldIcon className="w-4.5 h-4.5 text-gold-400" /> {t("store.trust2")}</li>
            <li className="flex items-center gap-3"><PenNib className="w-4.5 h-4.5 text-gold-400" /> {t("store.trust3")}</li>
          </ul>
        </div>
      </section>

      {/* toolbar + grid */}
      <section className="py-14 lg:py-18 paper-grain">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-display font-bold text-xl text-pine-900">{t("store.products")}</p>
            <label className="ml-auto flex items-center gap-3 text-sm text-pine-700">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase">{t("store.sort")}</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="field !w-auto !py-2 !pr-8 bg-paper-50 border !border-pine-800/30 !px-3 text-sm font-semibold"
                aria-label={t("store.sortAria")}
              >
                {SORTS.map((s) => (
                  <option key={s} value={s}>{t(SORT_KEYS[s])}</option>
                ))}
              </select>
            </label>
          </div>

          <p className="mt-5 text-sm text-pine-700/70 tabular-nums">
            {t("store.showing", { a: items.length, b: BOOKS.length })}
          </p>

          <div key={sort + lang} className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-14">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* buying notes — editorial rows */}
      <section className="py-20 lg:py-24 bg-paper-200/60 border-y border-pine-800/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionTitle eyebrow={t("store.howEyebrow")}>{t("store.howTitle")}</SectionTitle>
          <div className="mt-12 grid md:grid-cols-3 gap-x-10 gap-y-10">
            {[
              { n: "I", icon: <TruckIcon className="w-7 h-7" />, tKey: "store.note1t", dKey: "store.note1d" },
              { n: "II", icon: <PenNib className="w-7 h-7" />, tKey: "store.note2t", dKey: "store.note2d" },
              { n: "III", icon: <ShieldIcon className="w-7 h-7" />, tKey: "store.note3t", dKey: "store.note3d" },
            ].map((row, i) => (
              <div key={row.n} className="rv relative bg-paper-50 border border-pine-800/15 p-7 lg:p-8 card-lift" style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="absolute top-6 right-7 font-display italic font-light text-4xl text-gold-600/50">{row.n}</span>
                <span className="text-wine-600">{row.icon}</span>
                <h3 className="mt-4 font-display font-semibold text-xl text-pine-900">{t(row.tKey)}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-pine-700/90">{t(row.dKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* book clubs */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <SectionTitle eyebrow={t("store.clubsEyebrow")}>{t("store.clubsTitle")}</SectionTitle>
            <p className="rv mt-5 max-w-xl text-[15px] leading-relaxed text-pine-700">{t("store.clubsText")}</p>
          </div>
          <div className="rv lg:justify-self-end">
            <Link
              to="/contact"
              className="btn-primary group inline-flex items-center gap-3 bg-pine-900 text-paper-50 border border-pine-900 font-body font-bold text-[12.5px] tracking-[0.16em] uppercase px-7 py-4"
            >
              {t("store.clubsCta")}
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform duration-400" />
            </Link>
            <p className="mt-3 text-xs text-pine-700/70 text-right lg:text-left">{t("store.clubsNote", { n: BOOKS.length })}</p>
          </div>
        </div>
      </section>
    </>
  );
}