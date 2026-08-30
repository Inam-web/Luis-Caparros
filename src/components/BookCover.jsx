import { AUTHOR } from "../data/books";
import { useI18n } from "../i18n";
import { cn } from "../utils/cn";

/* ------- decorative motifs drawn inline, one per book ------- */
function Motif({ motif, accent }) {
  const s = { stroke: accent, fill: "none", strokeWidth: 1.4 };
  switch (motif) {
    case "wind":
      return (
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-40" aria-hidden="true">
          <path {...s} d="M-10 120 C 40 100, 70 150, 120 128 S 200 100, 215 118" strokeLinecap="round" />
          <path {...s} d="M-10 140 C 45 122, 80 168, 130 146 S 205 122, 215 138" strokeLinecap="round" opacity="0.7" />
          <path {...s} d="M-10 100 C 50 84, 85 128, 135 108 S 205 84, 215 100" strokeLinecap="round" opacity="0.55" />
          <circle cx="150" cy="52" r="16" stroke={accent} fill="none" strokeWidth="1.4" opacity="0.8" />
        </svg>
      );
    case "sea":
      return (
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-40" aria-hidden="true">
          {[118, 136, 154, 172].map((y, i) => (
            <path key={y} {...s} opacity={1 - i * 0.18} d={`M-10 ${y} q 14 -10 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0`} strokeLinecap="round" />
          ))}
          <circle cx="100" cy="70" r="20" stroke={accent} fill="none" strokeWidth="1.4" opacity="0.85" />
        </svg>
      );
    case "tree":
      return (
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-40" aria-hidden="true">
          <path {...s} d="M100 178 C 98 150, 104 132, 100 112 M100 112 C 88 100, 76 96, 66 84 M100 112 C 112 98, 124 96, 132 82 M100 130 C 90 124, 82 122, 74 114 M100 130 C 110 124, 118 122, 126 112" strokeLinecap="round" />
          <circle cx="64" cy="74" r="17" stroke={accent} fill="none" strokeWidth="1.3" />
          <circle cx="100" cy="62" r="21" stroke={accent} fill="none" strokeWidth="1.3" />
          <circle cx="136" cy="72" r="16" stroke={accent} fill="none" strokeWidth="1.3" />
          <circle cx="80" cy="96" r="3" fill={accent} stroke="none" opacity="0.8" />
          <circle cx="118" cy="92" r="3" fill={accent} stroke="none" opacity="0.8" />
        </svg>
      );
    case "path":
      return (
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-40" aria-hidden="true">
          <path {...s} d="M30 185 C 70 150, 60 120, 100 96 S 150 60, 168 28" strokeDasharray="1 7" strokeLinecap="round" strokeWidth="2" />
          {[
            [46, 168, -30], [70, 140, -22], [84, 112, -14], [108, 88, -8], [132, 66, -4], [154, 44, 4],
          ].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="5.4" ry="8.4" transform={`rotate(${r} ${x} ${y})`} stroke={accent} fill="none" strokeWidth="1.3" opacity={0.9 - i * 0.08} />
          ))}
        </svg>
      );
    case "fan":
      return (
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-40" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => {
            const a = (-80 + i * 20) * (Math.PI / 180);
            return <path key={i} {...s} d={`M100 150 L ${100 + Math.sin(a) * 78} ${150 - Math.cos(a) * 78}`} strokeLinecap="round" opacity={0.85} />;
          })}
          <path {...s} d="M22 150 A 78 78 0 0 1 178 150" strokeLinecap="round" />
          <path {...s} d="M52 150 A 48 48 0 0 1 148 150" strokeLinecap="round" opacity="0.7" />
          <circle cx="100" cy="150" r="4.5" fill={accent} stroke="none" />
        </svg>
      );
    case "chalk":
      return (
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-35" aria-hidden="true">
          {[60, 78, 96, 114, 132, 150].map((y, i) => (
            <path key={y} {...s} d={`M30 ${y} H ${i % 2 ? 150 : 170}`} strokeDasharray="10 6" strokeLinecap="round" opacity="0.9" />
          ))}
          <path {...s} d="M150 40 l 14 14 M164 40 l -14 14" strokeLinecap="round" />
          <circle cx="52" cy="42" r="9" stroke={accent} fill="none" strokeWidth="1.3" />
          <path {...s} d="M52 33 C 50 28, 56 26, 58 30" strokeLinecap="round" />
        </svg>
      );
    case "city":
    default:
      return (
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-40" aria-hidden="true">
          {[
            [28, 90, 26, 70], [60, 60, 30, 100], [96, 104, 24, 56], [126, 76, 30, 84], [160, 96, 22, 64],
          ].map(([x, y, w, h], i) => (
            <g key={i} opacity={0.9 - i * 0.06}>
              <rect x={x} y={y} width={w} height={h} stroke={accent} fill="none" strokeWidth="1.3" />
              <path {...s} d={`M${x + 6} ${y + 10} h ${w - 12} M${x + 6} ${y + 22} h ${w - 12} M${x + 6} ${y + 34} h ${w - 12}`} opacity="0.6" />
            </g>
          ))}
          <path {...s} d="M20 160 H 180 M40 160 V 30 M40 42 H 92 M84 36 v 12" strokeLinecap="round" />
        </svg>
      );
  }
}

/**
 * A crafted CSS/SVG book cover — no raster images, crisp at any size.
 * Sized via container queries: wrap it in an element with @container.
 */
export default function BookCover({ product, className, interactive = true }) {
  const c = product.cover;
  const { lang } = useI18n();
  const isOil = product.kind === "oil";
  return (
    <div className={cn("@container w-full", className)}>
      <div className={cn("cover-3d w-full", !interactive && "[&_.cover-3d-inner]:!transform-none [&_.cover-3d-inner]:!shadow-none")}>
        <div
          className="cover-3d-inner relative w-full aspect-[2/3] rounded-r-[3px] rounded-l-[6px] overflow-hidden select-none"
          style={{ background: c.bg, color: c.text }}
          role="img"
          aria-label={`${lang === "en" ? "Cover of" : "Portada de"} ${product.title}, ${AUTHOR.name}`}
        >
          <Motif motif={c.motif} accent={c.accent} />
          {/* sheen */}
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.16)_0%,transparent_28%,transparent_72%,rgba(0,0,0,0.22)_100%)]" />
          {/* inner frame */}
          <div className="absolute inset-[5cqw] border rounded-[2px] pointer-events-none" style={{ borderColor: `${c.accent}55` }} />
          <div className="cover-spine" />
          <div className="cover-pages" />

          <div className="relative h-full flex flex-col items-center text-center px-[9cqw] py-[8cqw]">
            <p className="font-body font-semibold tracking-[0.34em] uppercase text-[3.4cqw] opacity-90">
              {AUTHOR.name}
            </p>
            <div className="my-[4cqw] h-px w-[26cqw]" style={{ background: c.accent }} />
            <div className="flex-1 flex flex-col items-center justify-center">
              {isOil ? (
                <>
                  <p className="font-display italic font-medium text-[6.4cqw] leading-[1.05] text-balance">Aceite de Oliva</p>
                  <p className="font-display font-black uppercase tracking-wide text-[9.5cqw] leading-[1.02] mt-[1cqw]">Virgen Extra</p>
                  <p className="mt-[3.5cqw] text-[3.6cqw] font-body tracking-[0.22em] uppercase opacity-85">
                    {lang === "en" ? "Own harvest · 500 ml" : "Cosecha propia · 500 ml"}
                  </p>
                </>
              ) : (
                <>
                  <h3
                    className={cn(
                      "font-display font-semibold leading-[1.06] text-balance",
                      // longer titles need a smaller optical size to fit the cover face
                      product.title.length > 26 ? "text-[6.6cqw]" : "text-[8.6cqw]"
                    )}
                  >
                    {product.title}
                  </h3>
                  {product.subtitle && (
                    <p className="mt-[2.6cqw] font-display italic text-[4.2cqw] leading-snug opacity-80 px-[2cqw]">
                      {product.subtitle[lang]}
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-[2.4cqw] opacity-85">
              <svg viewBox="0 0 20 20" className="w-[4.6cqw] h-[4.6cqw]" fill="none" stroke={c.accent} strokeWidth="1.3" aria-hidden="true">
                <path d="M10 3 C 6 3, 3.5 6, 3.5 9.5 C 3.5 14, 7 17, 10 17 C 13 17, 16.5 14, 16.5 9.5 C 16.5 6, 14 3, 10 3 Z M10 3 v 14 M10 7 C 8 7, 6.5 8.5, 6.5 10.5 M10 10 C 12 10, 13.5 11, 13.5 13" />
              </svg>
              <p className="text-[3.2cqw] tracking-[0.3em] uppercase font-body font-medium opacity-90">
                Círculo Rojo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}