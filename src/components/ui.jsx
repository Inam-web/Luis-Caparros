import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { formatPrice } from "../data/books";
import { useStore } from "../context/StoreContext";
import { useI18n } from "../i18n";
import BookCover from "./BookCover";
import { ArrowRight, CartIcon, CheckIcon, MinusIcon, PlusIcon } from "./Icons";
import { cn } from "../utils/cn";
import { prefersReduced } from "../hooks/hooks";

/* ---------- section heading with line-mask reveal ---------- */
export function SectionTitle({
  eyebrow,
  children,
  tone = "light",
  className,
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow && (
        <p
          className={cn(
            "rv flex items-center gap-3 font-body text-[11px] sm:text-xs font-bold tracking-[0.32em] uppercase",
            tone === "light" ? "text-wine-600" : "text-gold-400"
          )}
        >
          <span className={cn("h-px w-10", tone === "light" ? "bg-wine-600/60" : "bg-gold-400/60")} />
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "mt-4 font-display font-semibold leading-[1.04] text-balance",
          "text-[clamp(1.9rem,4.6vw,3.4rem)]",
          tone === "light" ? "text-pine-900" : "text-paper-50"
        )}
      >
        <span className="line-mask">
          <span>{children}</span>
        </span>
      </h2>
    </div>
  );
}

/* ---------- quantity stepper ---------- */
export function QtyStepper({
  qty,
  onChange,
  max = 99,
  small,
}) {
  const { t } = useI18n();
  const btn = cn(
    "grid place-items-center border border-pine-700/25 text-pine-800 transition-all duration-300 hover:bg-pine-800 hover:text-paper-50 active:scale-90 disabled:opacity-35 disabled:pointer-events-none",
    small ? "w-7 h-7" : "w-9 h-9"
  );
  return (
    <div className="inline-flex items-center gap-0.5">
      <button type="button" className={btn} onClick={() => onChange(qty - 1)} aria-label={t("cart.qtySub")}>
        <MinusIcon className="w-3.5 h-3.5" />
      </button>
      <span className={cn("text-center font-semibold tabular-nums", small ? "w-8 text-sm" : "w-10")}>{qty}</span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(qty + 1)}
        disabled={qty >= max}
        aria-label={t("cart.qtyAdd")}
      >
        <PlusIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ---------- add to cart button with state feedback ---------- */
export function AddToCart({
  product,
  qty = 1,
  full,
  dark,
  className,
}) {
  const { addToCart, openCart } = useStore();
  const { t } = useI18n();
  const [added, setAdded] = useState(false);

  const handle = () => {
    addToCart(product, qty);
    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
      openCart();
    }, 650);
  };

  return (
    <button
      type="button"
      onClick={handle}
      className={cn(
        "btn-primary inline-flex items-center justify-center gap-2.5 font-body font-bold text-[13px] tracking-[0.14em] uppercase px-6 py-3.5 border transition-colors duration-300",
        dark
          ? "border-gold-400/70 text-gold-300"
          : "border-pine-800 text-pine-900 hover:border-pine-900",
        added && "!text-pine-950 [&::before]:!translate-y-0",
        full && "w-full",
        className
      )}
    >
      {added ? (
        <>
          <CheckIcon className="w-4 h-4" /> {t("cart.addedBtn")}
        </>
      ) : (
        <>
          <CartIcon className="w-4 h-4" />{" "}
          {t(product.kind === "oil" ? "cart.buyOil" : "cart.buyBtn")}
        </>
      )}
    </button>
  );
}

/* ---------- product card (books + oil) ---------- */
export function ProductCard({ product, index = 0 }) {
  const { addToCart } = useStore();
  const { lang, t } = useI18n();
  return (
    <article className="rv group flex flex-col" style={{ transitionDelay: `${(index % 4) * 60}ms` }}>
      <Link
        to={product.kind === "book" ? `/books/${product.slug}` : "/olive-oil"}
        className="block @container focus-visible:outline-2 outline-gold-600 outline-offset-4"
        aria-label={product.title}
      >
        <div className="relative">
          <BookCover product={product} />
          {product.isNew && (
            <span className="absolute top-3 -left-1 bg-wine-600 text-paper-50 text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 shadow-md">
              Novedad
            </span>
          )}
        </div>
      </Link>
      <div className="mt-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-wine-600">
            {product.year} · {product.genre[lang]}
          </p>
          <h3 className="mt-1 font-display font-semibold text-lg leading-tight text-pine-900 text-balance">
            <Link
              to={product.kind === "book" ? `/books/${product.slug}` : "/olive-oil"}
              className="hover:text-wine-600 transition-colors duration-300"
            >
              {product.title}
            </Link>
          </h3>
          <p className="mt-1.5 text-sm text-pine-700/85 line-clamp-2">{product.blurb[lang]}</p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-pine-700/15 flex items-center justify-between">
        <p className="font-display font-bold text-xl text-pine-900">
          {formatPrice(product.price)}
          {product.oldPrice && (
            <span className="ml-2 text-sm font-body font-medium text-pine-700/55 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={() => addToCart(product)}
          aria-label={`${t("cart.addBtn")} — ${product.title}`}
          className="grid place-items-center w-10 h-10 rounded-full border border-pine-800/50 text-pine-800 transition-all duration-300 hover:bg-wine-600 hover:border-wine-600 hover:text-paper-50 hover:-rotate-6 active:scale-90"
        >
          <CartIcon className="w-4.5 h-4.5" />
        </button>
      </div>
    </article>
  );
}

/* ---------- toast host ---------- */
export function ToastHost() {
  const { toasts } = useStore();
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[90] flex flex-col items-center gap-2 px-4 w-full max-w-md pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-3 bg-pine-950 text-paper-100 border border-gold-500/40 px-5 py-3 shadow-2xl shadow-pine-950/40 text-sm animate-[toastin_.35s_cubic-bezier(.22,1,.36,1)]"
          role="status"
        >
          <span className="grid place-items-center w-6 h-6 rounded-full bg-gold-500 text-pine-950 shrink-0">
            <CheckIcon className="w-3.5 h-3.5" />
          </span>
          {t.msg}
        </div>
      ))}
      <style>{`@keyframes toastin { from { opacity:0; transform: translateY(16px) scale(.96);} to {opacity:1; transform:none;} }`}</style>
    </div>
  );
}

/* ---------- decorative divider ---------- */
export function Divider({ className }) {
  return (
    <div className={cn("flex items-center justify-center gap-4 text-gold-600", className)} aria-hidden="true">
      <span className="h-px w-16 bg-current opacity-40" />
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 3 C 8 3, 5.5 6, 5.5 9.5 C 5.5 14, 9 17, 12 17 C 15 17, 18.5 14, 18.5 9.5 C 18.5 6, 16 3, 12 3 Z M12 3 v 14 M12 7 C 10 7, 8.5 8.5, 8.5 10.5 M12 10 C 14 10, 15.5 11, 15.5 13" strokeLinecap="round" />
      </svg>
      <span className="h-px w-16 bg-current opacity-40" />
    </div>
  );
}

/* ---------- animated counter (stats) ---------- */
function useCountUp(target) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) {
      el.textContent = String(target);
      return;
    }
    const obj = { v: 0 };
    let started = false;
    const tween = gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
      onUpdate: () => {
        started = true;
        el.textContent = String(Math.round(obj.v));
      },
    });
    // Safety net: if the scroll trigger somehow never fires, force the final value
    const fallback = window.setTimeout(() => {
      if (!started && el) el.textContent = String(target);
    }, 2500);
    return () => {
      window.clearTimeout(fallback);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [target]);
  return ref;
}

export function Stat({ value, suffix, label }) {
  const ref = useCountUp(value);
  return (
    <div className="rv text-center">
      <p className="font-display font-black text-[clamp(2.4rem,5vw,3.6rem)] text-gold-300 tabular-nums leading-none">
        <span ref={ref}>0</span>
        {suffix}
      </p>
      <p className="mt-2 text-[11px] font-bold tracking-[0.28em] uppercase text-paper-100/70">{label}</p>
    </div>
  );
}

/* ---------- inline link with arrow ---------- */
export function ArrowLink({ to, children, dark }) {
  return (
    <Link
      to={to}
      className={cn(
        "group inline-flex items-center gap-3 font-body font-bold text-[12px] tracking-[0.22em] uppercase transition-colors duration-300",
        dark ? "text-gold-300 hover:text-gold-400" : "text-wine-600 hover:text-wine-700"
      )}
    >
      {children}
      <ArrowRight className="w-5 h-5 transition-transform duration-400 group-hover:translate-x-1.5" />
    </Link>
  );
}