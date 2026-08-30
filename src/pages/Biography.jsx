import { Link } from "react-router-dom";
import { usePageFX, useParallax, useSEO } from "../hooks/hooks";
import { useI18n, trArr } from "../i18n";
import { ArrowLink, SectionTitle } from "../components/ui";
import { FeatherIcon, OliveBranch, QuoteMark } from "../components/Icons";

export default function Biography() {
  const { lang, t } = useI18n();
  useSEO(
    lang === "en" ? "Biography - LUIS CAPARRÓS" : "Biografía - LUIS CAPARRÓS",
    lang === "en"
      ? "The life and career of the writer Luis Caparrós: rural schoolteacher, novelist of memory and keeper of an Andalusian olive grove."
      : "La vida y trayectoria del escritor Luis Caparrós: maestro de escuela rural, novelista de la memoria y cuidador de un olivar andaluz."
  );
  usePageFX([lang]);
  useParallax();

  const milestones = trArr("bioPage.milestones", lang);
  const values = trArr("bioPage.values", lang);

  return (
    <>
      {/* hero */}
      <section className="relative bg-pine-950 text-paper-50 pt-40 pb-20 lg:pt-48 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 olive-branch-bg opacity-25" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-end">
          <div>
            <p className="hero-el flex items-center gap-3 font-body font-bold text-[11px] tracking-[0.34em] uppercase text-gold-400">
              <FeatherIcon className="w-4.5 h-4.5" /> {t("bioPage.eyebrow")}
            </p>
            <h1 className="mt-5 font-display font-semibold leading-[1.0] text-[clamp(2.6rem,6.5vw,5rem)]">
              <span className="line-mask"><span>{t("bioPage.l1")}</span></span>
              <span className="line-mask"><span className="italic font-light text-gold-300">{t("bioPage.l2")}</span></span>
              <span className="line-mask"><span>{t("bioPage.l3")}</span></span>
            </h1>
            <p className="hero-el mt-7 max-w-xl text-[15px] leading-relaxed text-paper-100/80">{t("bioPage.intro")}</p>
          </div>
          <div className="hero-el relative max-w-md lg:justify-self-end w-full">
            <div className="img-reveal overflow-hidden">
              <img
                src="/images/autor.jpg"
                alt={lang === "en" ? "Luis Caparrós writing by the window of his study" : "Luis Caparrós escribiendo junto a la ventana de su estudio"}
                className="w-full aspect-[4/5] object-cover"
                data-parallax="0.05"
                fetchPriority="high"
              />
            </div>
            <div className="absolute -bottom-5 -left-4 sm:-left-8 bg-gold-500 text-pine-950 px-5 py-3 shadow-xl rotate-[-2deg]">
              <p className="font-display font-bold text-lg leading-tight">{t("bioPage.badge1")}</p>
              <p className="text-[10px] font-bold tracking-[0.24em] uppercase mt-0.5">{t("bioPage.badge2")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* credo */}
      <section className="py-24 lg:py-28 paper-grain">
        <div className="max-w-4xl mx-auto px-5 lg:px-8">
          <QuoteMark className="rv w-12 h-9 text-gold-600" />
          <p className="rv mt-4 font-display font-light italic text-pine-800 leading-[1.3] text-[clamp(1.25rem,2.6vw,1.8rem)] text-balance">
            {t("bioPage.credo")}
          </p>
          <div className="rv mt-10 grid sm:grid-cols-3 gap-8 border-t border-pine-800/15 pt-10">
            {values.map((v, i) => (
              <div key={v.t} className="rv" style={{ transitionDelay: `${i * 80}ms` }}>
                <h3 className="font-display font-semibold text-lg text-pine-900">{v.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pine-700/90">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* timeline */}
      <section className="relative py-24 lg:py-32 bg-paper-200/60 border-y border-pine-800/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-14">
          <div className="lg:sticky lg:top-32 self-start">
            <SectionTitle eyebrow={t("bioPage.tlEyebrow")}>{t("bioPage.tlTitle")}</SectionTitle>
            <p className="rv mt-6 text-[15px] leading-relaxed text-pine-700 max-w-md">{t("bioPage.tlText")}</p>
            <div className="rv mt-8">
              <ArrowLink to="/books">{t("bioPage.tlLink")}</ArrowLink>
            </div>
          </div>

          <ol className="relative border-l-2 border-pine-800/20 pl-8 lg:pl-12 space-y-12">
            {milestones.map((m, i) => (
              <li key={m.year} className="rv relative" style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
                <span className="absolute -left-[41px] lg:-left-[57px] top-1 grid place-items-center w-5 h-5 rounded-full bg-paper-50 border-2 border-wine-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-wine-600" />
                </span>
                <p className="font-display italic font-light text-3xl text-gold-600">{m.year}</p>
                <h3 className="mt-2 font-display font-semibold text-xl text-pine-900">{m.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-pine-700/90 max-w-xl">{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* closing */}
      <section className="py-24 lg:py-28 text-center">
        <div className="max-w-2xl mx-auto px-5">
          <OliveBranch className="rv w-24 h-8 mx-auto text-gold-600" />
          <h2 className="mt-6 font-display font-semibold text-pine-900 text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-balance">
            <span className="line-mask"><span>{t("bioPage.closingTitle")}</span></span>
          </h2>
          <p className="rv mt-4 text-[15px] text-pine-700">{t("bioPage.closingText")}</p>
          <div className="rv mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/books"
              className="btn-primary inline-flex items-center gap-3 bg-pine-900 text-paper-50 border border-pine-900 font-body font-bold text-[12.5px] tracking-[0.16em] uppercase px-7 py-4"
            >
              {t("bioPage.cta1")}
            </Link>
            <Link
              to="/contact"
              className="link-ink font-body font-bold text-[12.5px] tracking-[0.16em] uppercase text-pine-800 py-4"
            >
              {t("bioPage.cta2")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}