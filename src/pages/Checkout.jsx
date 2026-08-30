import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { formatPrice } from "../data/books";
import { useStore } from "../context/StoreContext";
import { usePageFX, useSEO } from "../hooks/hooks";
import { useI18n } from "../i18n";
import BookCover from "../components/BookCover";
import { QtyStepper } from "../components/ui";
import { ArrowRight, CheckIcon, ChevronDown, ShieldIcon, SpinnerIcon, TruckIcon } from "../components/Icons";
import { cn } from "../utils/cn";

const PAYMENTS = [
  { id: "transfer", labelKey: "checkout.payTransfer", hintKey: "checkout.payTransferHint" },
  { id: "bizum", labelKey: "checkout.payBizum", hintKey: "checkout.payBizumHint" },
  { id: "card", labelKey: "checkout.payCard", hintKey: "checkout.payCardHint" },
];

export function Checkout() {
  const { lang, t } = useI18n();
  useSEO(
    lang === "en" ? "Checkout - LUIS CAPARRÓS" : "Finalizar compra - LUIS CAPARRÓS",
    lang === "en"
      ? "Complete your order of books and olive oil by Luis Caparrós. Secure payment and shipping across Spain."
      : "Completa tu pedido de libros y aceite de Luis Caparrós. Pago seguro y envío a toda España."
  );
  usePageFX([lang]);
  const { lines, productOf, subtotal, shipping, total, setQty, removeLine, placeOrder, count } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postcode: "",
    notes: "",
  });
  const [payment, setPayment] = useState("transfer");
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  if (lines.length === 0 && !sending) {
    return (
      <section className="min-h-[80vh] grid place-items-center paper-grain pt-32 pb-20 px-5">
        <div className="text-center max-w-md">
          <p className="font-display italic text-3xl text-pine-900">{t("checkout.emptyTitle")}</p>
          <p className="mt-3 text-sm text-pine-700/80">{t("checkout.emptyText")}</p>
          <Link
            to="/store"
            className="btn-primary mt-8 inline-flex items-center gap-3 bg-pine-900 text-paper-50 border border-pine-900 font-body font-bold text-[12.5px] tracking-[0.16em] uppercase px-7 py-4"
          >
            {t("checkout.emptyCta")} <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      </section>
    );
  }

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
  };

  const validate = () => {
    const er = {};
    if (form.name.trim().length < 2) er.name = t("checkout.errName");
    if (form.surname.trim().length < 2) er.surname = t("checkout.errSurname");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) er.email = t("checkout.errEmail");
    if (form.phone && !/^[+\d][\d\s\-]{7,}$/.test(form.phone)) er.phone = t("checkout.errPhone");
    if (form.address.trim().length < 5) er.address = t("checkout.errStreet");
    if (form.city.trim().length < 2) er.city = t("checkout.errCity");
    if (!/^\d{5}$/.test(form.postcode.trim())) er.postcode = t("checkout.errZip");
    return er;
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length > 0) return;
    setSending(true);
    await placeOrder({ ...form }, payment);
    navigate("/order-confirmed");
  };

  const field = (k, label, props = {}) => (
    <div>
      <label htmlFor={k} className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">
        {label}
      </label>
      <input
        id={k}
        value={form[k]}
        onChange={set(k)}
        className={cn("field", errors[k] && "field-invalid")}
        aria-invalid={!!errors[k]}
        {...props}
      />
      {errors[k] && <p className="mt-1.5 text-xs font-semibold text-wine-600">{errors[k]}</p>}
    </div>
  );

  return (
    <>
      <div className="bg-pine-950 text-paper-100 pt-[104px]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-4 flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase text-paper-100/70">
          <Link to="/store" className="hover:text-gold-300 transition-colors">{t("nav.store")}</Link>
          <ChevronDown className="w-3 h-3 -rotate-90" />
          <span className="text-gold-400">{t("checkout.crumb")}</span>
        </div>
      </div>

      <section className="paper-grain py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <h1 className="font-display font-semibold text-pine-900 text-[clamp(2rem,4.5vw,3.2rem)] leading-tight">
            <span className="line-mask"><span>{t("checkout.title")}</span></span>
          </h1>
          <p className="hero-el mt-3 text-[15px] text-pine-700 max-w-xl">{t("checkout.intro")}</p>

          <form onSubmit={submit} className="mt-10 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-start" noValidate>
            {/* -------- customer + address -------- */}
            <div className="space-y-10">
              <fieldset className="rv bg-paper-50 border border-pine-800/15 p-6 sm:p-8">
                <legend className="font-display font-bold text-xl text-pine-900 px-2">{t("checkout.contact")}</legend>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-6 pt-2">
                  {field("name", `${t("checkout.name")} *`, { autoComplete: "given-name", placeholder: lang === "en" ? "Mary" : "María" })}
                  {field("surname", `${t("checkout.surname")} *`, { autoComplete: "family-name", placeholder: "García López" })}
                  {field("email", `${t("checkout.email")} *`, { type: "email", autoComplete: "email", placeholder: "maria@email.com" })}
                  {field("phone", t("checkout.phone"), { type: "tel", autoComplete: "tel", placeholder: "600 000 000" })}
                </div>
              </fieldset>

              <fieldset className="rv bg-paper-50 border border-pine-800/15 p-6 sm:p-8">
                <legend className="font-display font-bold text-xl text-pine-900 px-2">{t("checkout.address")}</legend>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-6 pt-2">
                  <div className="sm:col-span-2">
                    {field("address", `${t("checkout.street")} *`, { autoComplete: "street-address", placeholder: lang === "en" ? "12 Olive Street, 2nd floor" : "C/ del Olivo, 12, 2ºB" })}
                  </div>
                  {field("city", `${t("checkout.city")} *`, { autoComplete: "address-level2", placeholder: "Úbeda" })}
                  {field("province", t("checkout.province"), { autoComplete: "address-level1", placeholder: "Jaén" })}
                  {field("postcode", `${t("checkout.zip")} *`, { inputMode: "numeric", maxLength: 5, autoComplete: "postal-code", placeholder: "23400" })}
                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">{t("checkout.country")}</label>
                    <input className="field opacity-70" value={t("checkout.countryValue")} readOnly aria-label={t("checkout.country")} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="notes" className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">
                      {t("checkout.notes")}
                    </label>
                    <textarea
                      id="notes"
                      value={form.notes}
                      onChange={set("notes")}
                      rows={3}
                      className="field resize-none"
                      placeholder={t("checkout.notesPh")}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="rv bg-paper-50 border border-pine-800/15 p-6 sm:p-8">
                <legend className="font-display font-bold text-xl text-pine-900 px-2 flex items-center gap-2.5">
                  <ShieldIcon className="w-5 h-5 text-wine-600" /> {t("checkout.payment")}
                </legend>
                <div className="space-y-3 pt-2">
                  {PAYMENTS.map((p) => (
                    <label
                      key={p.id}
                      className={cn(
                        "flex items-center gap-4 border p-4 cursor-pointer transition-all duration-300",
                        payment === p.id ? "border-wine-600 bg-wine-600/[0.06] shadow-sm" : "border-pine-800/20 hover:border-pine-800/50"
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={p.id}
                        checked={payment === p.id}
                        onChange={() => setPayment(p.id)}
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          "grid place-items-center w-5 h-5 rounded-full border-2 shrink-0 transition-all",
                          payment === p.id ? "border-wine-600" : "border-pine-800/40"
                        )}
                      >
                        <span className={cn("w-2.5 h-2.5 rounded-full bg-wine-600 transition-transform", payment === p.id ? "scale-100" : "scale-0")} />
                      </span>
                      <span>
                        <span className="block font-semibold text-pine-900 text-[15px]">{t(p.labelKey)}</span>
                        <span className="block text-xs text-pine-700/70 mt-0.5">{t(p.hintKey)}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* -------- order summary -------- */}
            <aside className="lg:sticky lg:top-32 bg-pine-950 text-paper-50 p-6 sm:p-8">
              <h2 className="font-display font-bold text-xl flex items-center justify-between">
                {t("checkout.yourOrder")}
                <span className="text-xs font-body font-bold bg-wine-600 rounded-full px-2.5 py-1 tabular-nums">{count}</span>
              </h2>
              <ul className="mt-6 space-y-5 max-h-[38vh] overflow-y-auto pr-1">
                {lines.map((l) => {
                  const p = productOf(l.id);
                  if (!p) return null;
                  return (
                    <li key={l.id} className="flex gap-4">
                      <div className="w-12 shrink-0 @container">
                        <BookCover product={p} interactive={false} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm leading-tight truncate">{p.title}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <QtyStepper small qty={l.qty} max={p.stock} onChange={(q) => (q <= 0 ? removeLine(l.id) : setQty(l.id, q))} />
                          <p className="font-display font-bold tabular-nums text-sm">{formatPrice(p.price * l.qty)}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <dl className="mt-6 pt-5 border-t border-paper-50/15 space-y-2 text-sm">
                <div className="flex justify-between text-paper-100/75">
                  <dt>{t("cart.subtotal")}</dt>
                  <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-paper-100/75">
                  <dt className="flex items-center gap-2"><TruckIcon className="w-4 h-4 text-gold-400" /> {t("cart.shipping")}</dt>
                  <dd className="tabular-nums">{shipping === 0 ? t("cart.free") : formatPrice(shipping)}</dd>
                </div>
                <div className="flex justify-between pt-3 border-t border-paper-50/15 font-display font-bold text-xl">
                  <dt>{t("cart.total")}</dt>
                  <dd className="tabular-nums">{formatPrice(total)}</dd>
                </div>
              </dl>
              <button
                type="submit"
                disabled={sending}
                className="btn-primary mt-6 w-full inline-flex items-center justify-center gap-3 border border-gold-400 text-gold-300 font-body font-bold text-[13px] tracking-[0.16em] uppercase px-6 py-4 disabled:opacity-60 disabled:pointer-events-none"
              >
                {sending ? (
                  <>
                    <SpinnerIcon className="w-5 h-5" /> {t("checkout.sending")}
                  </>
                ) : (
                  <>{t("checkout.confirm")} <ArrowRight className="w-4.5 h-4.5" /></>
                )}
              </button>
              <p className="mt-4 text-[11px] leading-relaxed text-paper-100/50 text-center">{t("checkout.legal")}</p>
            </aside>
          </form>
        </div>
      </section>
    </>
  );
}

/* ================= order confirmation ================= */
export function Confirmacion() {
  const { lang, t } = useI18n();
  useSEO(
    lang === "en" ? "Order confirmed - LUIS CAPARRÓS" : "Pedido confirmado - LUIS CAPARRÓS",
    lang === "en" ? "Your order has been registered. Thank you for reading." : "Tu pedido ha quedado registrado. Gracias por leer."
  );
  usePageFX([lang]);
  const { lastOrder } = useStore();

  if (!lastOrder) return <Navigate to="/store" replace />;

  const payDef = PAYMENTS.find((p) => p.id === lastOrder.payment);
  const payLabel = payDef ? t(payDef.labelKey) : lastOrder.payment;

  return (
    <section className="paper-grain pt-40 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-5">
        <div className="text-center">
          <div className="rv-scale mx-auto grid place-items-center w-20 h-20 rounded-full bg-pine-900 text-gold-300">
            <CheckIcon className="w-9 h-9" />
          </div>
          <p className="hero-el mt-6 text-[11px] font-bold tracking-[0.3em] uppercase text-wine-600">
            {t("checkout.badge", { number: lastOrder.number })}
          </p>
          <h1 className="mt-3 font-display font-semibold text-pine-900 text-[clamp(2rem,5vw,3.4rem)] leading-tight">
            <span className="line-mask"><span>{t("checkout.confTitle")}</span></span>
          </h1>
          <p className="hero-el mt-4 text-[15px] text-pine-700 max-w-lg mx-auto">
            {t("checkout.confText", { date: lastOrder.date, city: lastOrder.customer.city })}
          </p>
        </div>

        <div className="rv mt-12 bg-paper-50 border border-pine-800/15 shadow-sm">
          <div className="px-6 sm:px-8 py-5 border-b border-pine-800/12 flex flex-wrap justify-between gap-3">
            <p className="font-display font-bold text-lg text-pine-900">{t("checkout.summary")}</p>
            <p className="text-sm text-pine-700 font-semibold">{payLabel}</p>
          </div>
          <ul className="px-6 sm:px-8 py-5 divide-y divide-pine-800/10">
            {lastOrder.lines.map((l) => (
              <li key={l.title} className="py-3 flex justify-between gap-4 text-sm">
                <span className="text-pine-800">
                  <strong className="font-display">{l.title}</strong>
                  <span className="text-pine-700/60"> × {l.qty}</span>
                </span>
                <span className="font-semibold tabular-nums text-pine-900">{formatPrice(l.price)}</span>
              </li>
            ))}
            <li className="py-4 flex justify-between font-display font-bold text-xl text-pine-900">
              <span>{t("cart.total")}</span>
              <span className="tabular-nums">{formatPrice(lastOrder.total)}</span>
            </li>
          </ul>
          <div className="px-6 sm:px-8 py-5 bg-paper-100 border-t border-pine-800/12 grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-pine-600">{t("checkout.shipTo")}</p>
              <p className="mt-1.5 text-pine-800 font-semibold">
                {lastOrder.customer.name} {lastOrder.customer.surname}
              </p>
              <p className="text-pine-700/85">{lastOrder.customer.address}</p>
              <p className="text-pine-700/85">{lastOrder.customer.postcode} {lastOrder.customer.city}{lastOrder.customer.province ? `, ${lastOrder.customer.province}` : ""}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-pine-600">{t("checkout.contactInfo")}</p>
              <p className="mt-1.5 text-pine-800">{lastOrder.customer.email}</p>
              {lastOrder.customer.phone && <p className="text-pine-700/85">{lastOrder.customer.phone}</p>}
              {lastOrder.customer.notes && (
                <p className="mt-2 font-display italic text-pine-700">«{lastOrder.customer.notes}»</p>
              )}
            </div>
          </div>
        </div>

        <div className="rv mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/store"
            className="btn-primary inline-flex items-center gap-3 bg-pine-900 text-paper-50 border border-pine-900 font-body font-bold text-[12.5px] tracking-[0.16em] uppercase px-7 py-4"
          >
            {t("checkout.backStore")}
          </Link>
          <Link
            to="/"
            className="link-ink font-body font-bold text-[12.5px] tracking-[0.16em] uppercase text-pine-800 py-4"
          >
            {t("checkout.goHome")}
          </Link>
        </div>
      </div>
    </section>
  );
}