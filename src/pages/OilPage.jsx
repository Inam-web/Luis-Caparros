import { OIL, formatPrice } from "../data/books";
import { usePageFX, useSEO } from "../hooks/hooks";
import { useI18n } from "../i18n";
import { AddToCart, QtyStepper } from "../components/ui";
import { CheckIcon, OliveBranch } from "../components/Icons";
import { useState } from "react";

/**
 * Standalone olive-oil page.
 * Per client instruction this product lives on its own page and is NOT linked
 * from any author-brand page (home, biography, books, store, footer, nav).
 * It is reachable only by its direct URL.
 */
export default function OilPage() {
  const { lang, t } = useI18n();
  useSEO(
    lang === "en"
      ? "Extra Virgin Olive Oil — Own Harvest"
      : "Aceite de Oliva Virgen Extra — Cosecha Propia",
    lang === "en"
      ? "Own-harvest extra virgin olive oil from the family olive grove in Andalusia. Mountain picual, cold-pressed within 24 hours. 500 ml bottle."
      : "Aceite de oliva virgen extra de cosecha propia del olivar familiar en Andalucía. Picual de sierra, prensado en frío en menos de 24 horas. Botella de 500 ml."
  );
  usePageFX([lang]);
  const [qty, setQty] = useState(1);

  return (
    <section className="paper-grain pt-36 lg:pt-44 pb-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* photo */}
        <div className="rv-left relative">
          <div className="img-reveal overflow-hidden">
            <img
              src="/images/aceite.jpg"
              alt={
                lang === "en"
                  ? "Bottle of own-harvest extra virgin olive oil on a wooden table with fresh olives"
                  : "Botella de aceite de oliva virgen extra de cosecha propia sobre mesa de madera con aceitunas frescas"
              }
              className="w-full aspect-[4/3] object-cover"
              fetchPriority="high"
            />
          </div>
          <div className="absolute -bottom-5 -right-3 sm:-right-5 bg-gold-500 text-pine-950 px-5 py-3 shadow-xl rotate-[2deg]">
            <p className="text-[10px] font-bold tracking-[0.24em] uppercase">{t("home.oilBadge1")}</p>
            <p className="font-display font-bold text-lg leading-tight">{t("home.oilBadge2")}</p>
          </div>
        </div>

        {/* product */}
        <div>
          <OliveBranch className="rv w-24 h-8 text-gold-600" />
          <h1 className="mt-5 font-display font-semibold text-pine-900 leading-[1.05] text-[clamp(2rem,4.5vw,3.4rem)] text-balance">
            <span className="line-mask"><span>{lang === "en" ? "Extra Virgin Olive Oil" : "Aceite de Oliva Virgen Extra"}</span></span>
          </h1>
          <p className="rv mt-3 font-display italic text-xl text-pine-700">{OIL.subtitle?.[lang]}</p>
          <p className="rv mt-5 text-[15px] leading-relaxed text-pine-700">{OIL.description[lang][0]}</p>
          <p className="rv mt-4 text-[15px] leading-relaxed text-pine-700">{OIL.description[lang][1]}</p>

          <ul className="rv mt-6 space-y-2.5">
            {OIL.details.map((d) => (
              <li key={d.label.en} className="flex items-start gap-3 text-sm text-pine-800">
                <span className="grid place-items-center w-5 h-5 rounded-full bg-pine-800/10 text-pine-700 shrink-0 mt-0.5">
                  <CheckIcon className="w-3 h-3" />
                </span>
                <span><strong className="font-semibold">{d.label[lang]}:</strong> {d.value}</span>
              </li>
            ))}
          </ul>

          <div className="rv mt-8 p-6 bg-paper-50 border border-pine-800/15 shadow-sm">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <div>
                <p className="font-display font-black text-4xl text-pine-900 leading-none">
                  {formatPrice(OIL.price)}
                  <span className="ml-2.5 text-lg font-body font-medium text-pine-700/50 line-through">{formatPrice(OIL.oldPrice ?? 0)}</span>
                </p>
                <p className="text-xs text-pine-700/70 mt-1.5">{t("home.oilPriceNote")}</p>
              </div>
              <div className="flex items-center gap-4">
                <QtyStepper qty={qty} max={10} onChange={(q) => setQty(Math.max(1, q))} />
                <AddToCart product={OIL} qty={qty} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}