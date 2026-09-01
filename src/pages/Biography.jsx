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

  // Premium gallery data - all images must be 900x1200 (3:4) .jpeg
  const galleryImages = [
    { src: "/images/author/author-1.jpeg", alt: "Luis Caparrós portrait in natural light", caption: lang === "en" ? "Natural Light Portrait" : "Retrato en Luz Natural" },
    { src: "/images/author/author-2.jpeg", alt: "Writing at his study desk", caption: lang === "en" ? "The Writing Desk" : "El Escritorio de Trabajo" },
    { src: "/images/author/author-3.jpeg", alt: "In the Andalusian olive grove", caption: lang === "en" ? "Among the Olive Trees" : "Entre los Olivos" },
    { src: "/images/author/author-4.jpeg", alt: "Literary event appearance", caption: lang === "en" ? "Literary Presentation" : "Presentación Literaria" },
    { src: "/images/author/author-5.jpeg", alt: "Close-up of handwritten manuscript", caption: lang === "en" ? "Original Manuscript" : "Manuscrito Original" },
    { src: "/images/author/author-6.jpeg", alt: "Published works on wooden shelf", caption: lang === "en" ? "Published Works" : "Obras Publicadas" },
  ];

  return (
    <>
            {/* hero */}
      <section className="relative bg-pine-950 text-paper-50 pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 olive-branch-bg opacity-25" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
          <div>
            <p className="hero-el flex items-center gap-3 font-body font-bold text-[11px] tracking-[0.34em] uppercase text-gold-400">
              <FeatherIcon className="w-4.5 h-4.5" /> {t("bioPage.eyebrow")}
            </p>
            
            {/* Fixed 'g' clipping: Added overflow-visible to allow descenders to show */}
            <h1 className="mt-5 font-display font-semibold leading-[1.0] text-[clamp(2.6rem,6.5vw,5rem)] overflow-visible">
              <span className="line-mask"><span>{t("bioPage.l1")}</span></span>
              <span className="line-mask"><span className="italic font-light text-gold-300">{t("bioPage.l2")}</span></span>
              <span className="line-mask"><span>{t("bioPage.l3")}</span></span>
            </h1>
            
            <p className="hero-el mt-7 max-w-xl text-[15px] leading-relaxed text-paper-100/80">{t("bioPage.intro")}</p>

            {/* UNIQUE ADDITION: Signature & Date to fill the empty space */}
            <div className="hero-el mt-12 flex items-end gap-6 opacity-80">
              <div className="flex flex-col">
                <span className="font-display italic text-2xl text-gold-400/80 transform -rotate-2 origin-bottom-left">
                  Luis Caparrós
                </span>
                <span className="mt-1 h-px w-16 bg-gold-400/40" />
              </div>
              <div className="pb-1">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-paper-100/40">
                  {lang === "en" ? "Andalusia" : "Andalucía"}
                </p>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-paper-100/40">
                  Est. 1955
                </p>
              </div>
            </div>

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

      {/* PREMIUM GALLERY: Swipe on Mobile / Compact Staggered Grid on Desktop */}
      <section className="py-24 lg:py-32 bg-paper-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          {/* Section Header */}
          <div className="mb-14 lg:mb-16 max-w-3xl rv">
            <p className="font-body font-bold text-[11px] tracking-[0.34em] uppercase text-gold-600 mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-gold-600 inline-block" />
              {lang === "en" ? "VISUAL CHRONICLE" : "CRÓNICA VISUAL"}
            </p>
            <h2 className="font-display font-semibold text-pine-900 text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] whitespace-pre-line">
              {lang === "en"
                ? "The Man Behind\nthe Manuscripts"
                : "El Hombre Detrás\nde los Manuscritos"}
            </h2>
            {/* Mobile-only swipe hint */}
            <p className="lg:hidden mt-4 text-[12px] font-body font-bold tracking-[0.2em] uppercase text-pine-600/60 flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-l-2 border-b-2 border-pine-600/40 rotate-[-45deg]" />
              {lang === "en" ? "Swipe to explore" : "Desliza para explorar"}
            </p>
          </div>

          {/* MOBILE: Horizontal Swipe | DESKTOP: Compact Staggered Grid */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-x-5 lg:gap-y-10">

            {/* Mobile-only horizontal scroll container (unchanged) */}
            <div
              className="lg:hidden -mx-5 px-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="flex gap-4 w-max">
                {galleryImages.map((img, i) => (
                  <div
                    key={img.src}
                    className="rv snap-center shrink-0 w-[75vw] max-w-[320px]"
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div className="group relative aspect-[3/4] overflow-hidden bg-pine-100 border border-pine-800/5 shadow-md">
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-pine-950/90 via-pine-950/40 to-transparent">
                        <span className="inline-block w-6 h-px bg-gold-400 mb-2" />
                        <p className="font-display font-medium text-paper-50 text-base leading-snug">{img.caption}</p>
                        <p className="mt-1 text-[10px] font-body font-bold tracking-[0.2em] uppercase text-gold-300">
                          {String(i + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop-only COMPACT staggered cards */}
            {galleryImages.map((img, i) => {
              // Reduced stagger offsets for tighter rhythm
              const stagger = i % 3 === 1 ? "lg:mt-10" : i % 3 === 2 ? "lg:mt-20" : "";
              return (
                <div
                  key={`desk-${img.src}`}
                  className={`hidden lg:block rv group relative ${stagger}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {/* Smaller card: reduced padding, tighter caption */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-pine-100 border border-pine-800/5 shadow-sm transition-all duration-500 ease-out group-hover:shadow-lg group-hover:border-gold-400/30 group-hover:-translate-y-1.5">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      loading="lazy"
                      data-parallax="0.02"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pine-950/80 via-pine-950/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

                    {/* Compact caption panel */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-3 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="inline-block w-5 h-px bg-gold-400 mb-2 transition-all duration-500 delay-100 group-hover:w-10" />
                      <p className="font-display font-medium text-paper-50 text-[15px] leading-snug">{img.caption}</p>
                      <p className="mt-0.5 text-[10px] font-body font-bold tracking-[0.2em] uppercase text-gold-300">
                        {String(i + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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