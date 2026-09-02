import { useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { formatPrice } from "../data/books";
import { useStore } from "../context/StoreContext";
import { usePageFX, useSEO } from "../hooks/hooks";
import { useI18n } from "../i18n";
import BookCover from "../components/BookCover";
import { QtyStepper } from "../components/ui";
import { ArrowRight, CheckIcon, ChevronDown, ShieldIcon, SpinnerIcon, TruckIcon } from "../components/Icons";
import { cn } from "../utils/cn";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PAYMENTS = [
  { id: "card", labelKey: "checkout.payCard", hintKey: "checkout.payCardHint" },
  { id: "bizum", labelKey: "checkout.payBizum", hintKey: "checkout.payBizumHint" },
  { id: "transfer", labelKey: "checkout.payTransfer", hintKey: "checkout.payTransferHint" },
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
  const { lines, productOf, subtotal, shipping, total, setQty, removeLine, count } = useStore();
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
  const [payment, setPayment] = useState("card");
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

    try {
      const items = lines.map((l) => {
        const p = productOf(l.id);
        return { title: p.title, slug: p.slug, price: p.price, qty: l.qty };
      });

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shipping,
          customer: {
            name: `${form.name} ${form.surname}`,
            email: form.email,
            phone: form.phone,
            notes: form.notes,
          },
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setSending(false);
      setErrors({ form: 'Payment failed. Please try again.' });
    }
  };

  // ... rest of the component (the form and UI)
  return (
    <>
      {/* Breadcrumb */}
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

          {errors.form && (
            <div className="mt-4 p-4 bg-wine-600/10 border border-wine-600/30 text-wine-700 rounded-md">
              {errors.form}
            </div>
          )}

          <form onSubmit={submit} className="mt-10 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-start" noValidate>
            {/* ... rest of the form (same as before) */}
            {/* Customer + Address fields */}
            <div className="space-y-10">
              {/* Contact Details */}
              <fieldset className="rv bg-paper-50 border border-pine-800/15 p-6 sm:p-8">
                <legend className="font-display font-bold text-xl text-pine-900 px-2">{t("checkout.contact")}</legend>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-6 pt-2">
                  <div>
                    <label htmlFor="name" className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">{t("checkout.name")} *</label>
                    <input id="name" value={form.name} onChange={set("name")} className={cn("field", errors.name && "field-invalid")} autoComplete="given-name" placeholder={lang === "en" ? "Mary" : "María"} />
                    {errors.name && <p className="mt-1.5 text-xs font-semibold text-wine-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="surname" className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">{t("checkout.surname")} *</label>
                    <input id="surname" value={form.surname} onChange={set("surname")} className={cn("field", errors.surname && "field-invalid")} autoComplete="family-name" placeholder="García López" />
                    {errors.surname && <p className="mt-1.5 text-xs font-semibold text-wine-600">{errors.surname}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">{t("checkout.email")} *</label>
                    <input id="email" type="email" value={form.email} onChange={set("email")} className={cn("field", errors.email && "field-invalid")} autoComplete="email" placeholder="maria@email.com" />
                    {errors.email && <p className="mt-1.5 text-xs font-semibold text-wine-600">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">{t("checkout.phone")}</label>
                    <input id="phone" type="tel" value={form.phone} onChange={set("phone")} className={cn("field", errors.phone && "field-invalid")} autoComplete="tel" placeholder="600 000 000" />
                    {errors.phone && <p className="mt-1.5 text-xs font-semibold text-wine-600">{errors.phone}</p>}
                  </div>
                </div>
              </fieldset>

              {/* Address */}
              <fieldset className="rv bg-paper-50 border border-pine-800/15 p-6 sm:p-8">
                <legend className="font-display font-bold text-xl text-pine-900 px-2">{t("checkout.address")}</legend>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-6 pt-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">{t("checkout.street")} *</label>
                    <input id="address" value={form.address} onChange={set("address")} className={cn("field", errors.address && "field-invalid")} autoComplete="street-address" placeholder={lang === "en" ? "12 Olive Street, 2nd floor" : "C/ del Olivo, 12, 2ºB"} />
                    {errors.address && <p className="mt-1.5 text-xs font-semibold text-wine-600">{errors.address}</p>}
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">{t("checkout.city")} *</label>
                    <input id="city" value={form.city} onChange={set("city")} className={cn("field", errors.city && "field-invalid")} autoComplete="address-level2" placeholder="Úbeda" />
                    {errors.city && <p className="mt-1.5 text-xs font-semibold text-wine-600">{errors.city}</p>}
                  </div>
                  <div>
                    <label htmlFor="province" className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">{t("checkout.province")}</label>
                    <input id="province" value={form.province} onChange={set("province")} className="field" autoComplete="address-level1" placeholder="Jaén" />
                  </div>
                  <div>
                    <label htmlFor="postcode" className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">{t("checkout.zip")} *</label>
                    <input id="postcode" value={form.postcode} onChange={set("postcode")} className={cn("field", errors.postcode && "field-invalid")} inputMode="numeric" maxLength="5" autoComplete="postal-code" placeholder="23400" />
                    {errors.postcode && <p className="mt-1.5 text-xs font-semibold text-wine-600">{errors.postcode}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">{t("checkout.country")}</label>
                    <input className="field opacity-70" value={t("checkout.countryValue")} readOnly />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="notes" className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">{t("checkout.notes")}</label>
                    <textarea id="notes" value={form.notes} onChange={set("notes")} rows={3} className="field resize-none" placeholder={t("checkout.notesPh")} />
                  </div>
                </div>
              </fieldset>

              {/* Payment */}
              <fieldset className="rv bg-paper-50 border border-pine-800/15 p-6 sm:p-8">
                <legend className="font-display font-bold text-xl text-pine-900 px-2 flex items-center gap-2.5">
                  <ShieldIcon className="w-5 h-5 text-wine-600" /> {t("checkout.payment")}
                </legend>
                <div className="space-y-3 pt-2">
                  {PAYMENTS.map((p) => (
                    <label key={p.id} className={cn("flex items-center gap-4 border p-4 cursor-pointer transition-all duration-300", payment === p.id ? "border-wine-600 bg-wine-600/[0.06] shadow-sm" : "border-pine-800/20 hover:border-pine-800/50")}>
                      <input type="radio" name="payment" value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} className="sr-only" />
                      <span className={cn("grid place-items-center w-5 h-5 rounded-full border-2 shrink-0 transition-all", payment === p.id ? "border-wine-600" : "border-pine-800/40")}>
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

            {/* Order Summary */}
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

/* ================= ORDER CONFIRMATION ================= */
export function Confirmacion() {
  const { lang, t } = useI18n();
  const { lastOrder, setLastOrder } = useStore();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  
  useSEO(
    lang === "en" ? "Order confirmed - LUIS CAPARRÓS" : "Pedido confirmado - LUIS CAPARRÓS",
    lang === "en" ? "Your order has been registered. Thank you for reading." : "Tu pedido ha quedado registrado. Gracias por leer."
  );
  usePageFX([lang]);

  useEffect(() => {
    // Get session_id from URL
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (sessionId) {
      // Fetch order details from our API
      fetch(`/api/order-confirmed?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrder(data.order);
            setLastOrder(data.order);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (lastOrder) {
      setOrder(lastOrder);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen grid place-items-center paper-grain pt-40">
        <div className="text-center">
          <SpinnerIcon className="w-12 h-12 animate-spin text-gold-500 mx-auto" />
          <p className="mt-4 text-pine-700">{lang === "en" ? "Confirming your order..." : "Confirmando tu pedido..."}</p>
        </div>
      </section>
    );
  }

  if (!order && !lastOrder) {
    return <Navigate to="/store" replace />;
  }

  const orderData = order || lastOrder;

  return (
    <section className="paper-grain pt-40 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-5">
        <div className="text-center">
          <div className="rv-scale mx-auto grid place-items-center w-20 h-20 rounded-full bg-emerald-600 text-white">
            <CheckIcon className="w-9 h-9" />
          </div>
          <p className="hero-el mt-6 text-[11px] font-bold tracking-[0.3em] uppercase text-emerald-600">
            {lang === "en" ? "Payment Successful" : "Pago Exitoso"}
          </p>
          <h1 className="mt-3 font-display font-semibold text-pine-900 text-[clamp(2rem,5vw,3.4rem)] leading-tight">
            <span className="line-mask"><span>{t("checkout.confTitle")}</span></span>
          </h1>
          <p className="hero-el mt-4 text-[15px] text-pine-700 max-w-lg mx-auto">
            {lang === "en" 
              ? `Your order #${orderData.number} has been confirmed. You will receive a confirmation email shortly.`
              : `Tu pedido #${orderData.number} ha sido confirmado. Recibirás un email de confirmación en breve.`
            }
          </p>
          <p className="mt-2 text-sm text-pine-500">
            {lang === "en" 
              ? `A confirmation email has been sent to ${orderData.customer?.email || 'your email'}`
              : `Se ha enviado un email de confirmación a ${orderData.customer?.email || 'tu email'}`
            }
          </p>
        </div>

        <div className="rv mt-12 bg-paper-50 border border-pine-800/15 shadow-sm">
          <div className="px-6 sm:px-8 py-5 border-b border-pine-800/12 flex flex-wrap justify-between gap-3">
            <p className="font-display font-bold text-lg text-pine-900">{t("checkout.summary")}</p>
            <p className="text-sm text-pine-700 font-semibold">#{orderData.number}</p>
          </div>
          <ul className="px-6 sm:px-8 py-5 divide-y divide-pine-800/10">
            {orderData.lines.map((l) => (
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
              <span className="tabular-nums">{formatPrice(orderData.total)}</span>
            </li>
          </ul>
          <div className="px-6 sm:px-8 py-5 bg-paper-100 border-t border-pine-800/12 grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-pine-600">{t("checkout.shipTo")}</p>
              <p className="mt-1.5 text-pine-800 font-semibold">
                {orderData.customer?.name} {orderData.customer?.surname}
              </p>
              <p className="text-pine-700/85">{orderData.customer?.address}</p>
              <p className="text-pine-700/85">{orderData.customer?.postcode} {orderData.customer?.city}{orderData.customer?.province ? `, ${orderData.customer?.province}` : ""}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-pine-600">{t("checkout.contactInfo")}</p>
              <p className="mt-1.5 text-pine-800">{orderData.customer?.email}</p>
              {orderData.customer?.phone && <p className="text-pine-700/85">{orderData.customer?.phone}</p>}
              {orderData.customer?.notes && (
                <p className="mt-2 font-display italic text-pine-700">«{orderData.customer?.notes}»</p>
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