import { Link, useNavigate } from "react-router-dom";
import { SHOP, formatPrice } from "../data/books";
import { useStore } from "../context/StoreContext";
import { useI18n } from "../i18n";
import BookCover from "./BookCover";
import { QtyStepper } from "./ui";
import { ArrowRight, CartIcon, CloseIcon, FeatherIcon, TrashIcon, TruckIcon } from "./Icons";
import { cn } from "../utils/cn";

export default function CartDrawer() {
  const { isOpen, closeCart, lines, productOf, setQty, removeLine, subtotal, shipping, total, count } = useStore();
  const { t } = useI18n();
  const navigate = useNavigate();

  const progress = Math.min(subtotal / SHOP.freeShippingThreshold, 1);
  const remaining = SHOP.freeShippingThreshold - subtotal;

  return (
    <div
      className={cn("fixed inset-0 z-[85]", isOpen ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!isOpen}
    >
      <button
        className={cn(
          "absolute inset-0 bg-pine-950/70 transition-opacity duration-500 cursor-default",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={closeCart}
        aria-label={t("cart.closeAria")}
      />
      <aside
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-md bg-paper-50 shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-label={t("cart.title")}
      >
        {/* head */}
        <div className="flex items-center justify-between px-6 h-[70px] border-b border-pine-800/15 bg-paper-100">
          <h2 className="font-display font-bold text-xl text-pine-900 flex items-center gap-3">
            <CartIcon className="w-5 h-5 text-wine-600" />
            {t("cart.title")}
            <span className="text-xs font-body font-bold bg-wine-600 text-paper-50 rounded-full px-2.5 py-0.5 tabular-nums">
              {count}
            </span>
          </h2>
          <button
            onClick={closeCart}
            className="grid place-items-center w-10 h-10 rounded-full border border-pine-800/25 text-pine-800 hover:bg-pine-900 hover:text-paper-50 transition-all duration-300 active:scale-90"
            aria-label={t("cart.closeAria")}
          >
            <CloseIcon className="w-4.5 h-4.5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 grid place-items-center px-8 text-center">
            <div>
              <FeatherIcon className="w-14 h-14 mx-auto text-pine-600/50" />
              <p className="mt-5 font-display italic text-2xl text-pine-800">{t("cart.emptyTitle")}</p>
              <p className="mt-2 text-sm text-pine-700/75">{t("cart.emptyText")}</p>
              <Link
                to="/store"
                onClick={closeCart}
                className="btn-primary mt-7 inline-flex items-center gap-2.5 border border-pine-800 text-pine-900 font-body font-bold text-[12px] tracking-[0.18em] uppercase px-6 py-3.5"
              >
                {t("cart.emptyCta")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* free shipping meter */}
            <div className="px-6 py-4 bg-paper-100/70 border-b border-pine-800/10">
              <p className="flex items-center gap-2 text-xs font-semibold text-pine-800">
                <TruckIcon className="w-4.5 h-4.5 text-wine-600" />
                {remaining > 0 ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("cart.missing", { amount: `<strong class="text-wine-600">${formatPrice(remaining)}</strong>` }),
                    }}
                  />
                ) : (
                  <span className="text-pine-600 font-bold">{t("cart.freeShip")}</span>
                )}
              </p>
              <div className="mt-2 h-1.5 bg-pine-800/12 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-500 to-wine-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>

            {/* lines */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {lines.map((l) => {
                const p = productOf(l.id);
                if (!p) return null;
                return (
                  <div key={l.id} className="flex gap-4 group">
                    <Link
                      to={p.kind === "book" ? `/books/${p.slug}` : "/olive-oil"}
                      onClick={closeCart}
                      className="w-16 shrink-0 @container"
                      aria-label={p.title}
                    >
                      <BookCover product={p} interactive={false} />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={p.kind === "book" ? `/books/${p.slug}` : "/olive-oil"}
                          onClick={closeCart}
                          className="font-display font-semibold text-[15px] leading-tight text-pine-900 hover:text-wine-600 transition-colors"
                        >
                          {p.title}
                        </Link>
                        <button
                          onClick={() => removeLine(l.id)}
                          className="text-pine-600/60 hover:text-wine-600 transition-colors shrink-0 mt-0.5"
                          aria-label={t("cart.removeAria", { title: p.title })}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-pine-700/70 mt-0.5">{formatPrice(p.price)} {t("cart.unit")}</p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <QtyStepper small qty={l.qty} max={p.stock} onChange={(q) => setQty(l.id, q)} />
                        <p className="font-display font-bold text-pine-900 tabular-nums">{formatPrice(p.price * l.qty)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* summary */}
            <div className="border-t border-pine-800/15 px-6 py-5 bg-paper-100">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-pine-700">
                  <dt>{t("cart.subtotal")}</dt>
                  <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-pine-700">
                  <dt>{t("cart.shipping")}</dt>
                  <dd className="tabular-nums">{shipping === 0 ? t("cart.free") : formatPrice(shipping)}</dd>
                </div>
                <div className="flex justify-between pt-2 border-t border-pine-800/12 font-display font-bold text-lg text-pine-900">
                  <dt>{t("cart.total")}</dt>
                  <dd className="tabular-nums">{formatPrice(total)}</dd>
                </div>
              </dl>
              <button
                onClick={() => {
                  closeCart();
                  navigate("/checkout");
                }}
                className="btn-primary mt-4 w-full inline-flex items-center justify-center gap-3 bg-pine-900 text-paper-50 border border-pine-900 font-body font-bold text-[13px] tracking-[0.16em] uppercase px-6 py-4"
              >
                {t("cart.checkout")} <ArrowRight className="w-4.5 h-4.5" />
              </button>
              <Link
                to="/store"
                onClick={closeCart}
                className="mt-3 block text-center text-[12px] font-bold tracking-[0.14em] uppercase text-wine-600 link-ink w-fit mx-auto"
              >
                {t("cart.continue")}
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}