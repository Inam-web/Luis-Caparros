import { useState } from "react";
import { Link } from "react-router-dom";
import { AUTHOR } from "../data/books";
import { usePageFX, useSEO } from "../hooks/hooks";
import { useI18n } from "../i18n";
import { ArrowRight, CheckIcon, FacebookIcon, GoodreadsIcon, InstagramIcon, MailIcon, PinIcon, SpinnerIcon } from "../components/Icons";
import { SectionTitle } from "../components/ui";
import { cn } from "../utils/cn";

export default function Contact() {
  const { lang, t, ta } = useI18n();
  useSEO(
    lang === "en" ? "Contact - LUIS CAPARRÓS" : "Contacto - LUIS CAPARRÓS",
    lang === "en"
      ? "Write to Luis Caparrós: questions about books, orders, presentations and reading clubs."
      : "Escríbele a Luis Caparrós: consultas sobre libros, pedidos, presentaciones y clubes de lectura."
  );
  usePageFX([lang]);

  const subjects = ta("contact.subjects");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", privacy: false });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const subject = form.subject || subjects[0] || "";

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
  };

  const validate = () => {
    const er = {};
    if (form.name.trim().length < 2) er.name = t("contact.errName");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) er.email = t("contact.errEmail");
    if (form.message.trim().length < 10) er.message = t("contact.errMessage");
    if (!form.privacy) er.privacy = t("contact.errPrivacy");
    return er;
  };

  const submit = (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length > 0) return;
    setStatus("sending");
    // simulate the mail relay of the original site
    window.setTimeout(() => setStatus("sent"), 1300);
  };

  return (
    <>
      {/* hero */}
      <section className="relative bg-pine-950 text-paper-50 pt-40 pb-16 lg:pt-48 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 olive-branch-bg opacity-25" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <p className="hero-el flex items-center gap-3 font-body font-bold text-[11px] tracking-[0.34em] uppercase text-gold-400">
            <MailIcon className="w-4.5 h-4.5" /> {t("contact.eyebrow")}
          </p>
          <h1 className="mt-5 font-display font-semibold leading-[1.02] text-[clamp(2.6rem,6.5vw,5rem)] max-w-3xl">
            <span className="line-mask"><span>{t("contact.l1")}</span></span>
            <span className="line-mask"><span className="italic font-light text-gold-300">{t("contact.l2")}</span></span>
          </h1>
          <p className="hero-el mt-6 max-w-xl text-[15px] leading-relaxed text-paper-100/80">{t("contact.intro")}</p>
        </div>
      </section>

      <section className="paper-grain py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-start">
          {/* form / success */}
          <div>
            {status === "sent" ? (
              <div className="rv-scale bg-paper-50 border border-pine-800/15 p-8 sm:p-12 text-center">
                <span className="mx-auto grid place-items-center w-16 h-16 rounded-full bg-pine-900 text-gold-300">
                  <CheckIcon className="w-7 h-7" />
                </span>
                <h2 className="mt-6 font-display font-semibold text-2xl text-pine-900">
                  {t("contact.sentTitle", { name: form.name.split(" ")[0] })}
                </h2>
                <p className="mt-3 text-[15px] text-pine-700 max-w-md mx-auto">
                  {t("contact.sentText", { subject: subject.toLowerCase(), email: form.email })}
                </p>
                <button
                  onClick={() => {
                    setForm({ name: "", email: "", subject: "", message: "", privacy: false });
                    setStatus("idle");
                  }}
                  className="link-ink mt-8 font-body font-bold text-[12px] tracking-[0.18em] uppercase text-wine-600"
                >
                  {t("contact.again")}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="rv bg-paper-50 border border-pine-800/15 p-6 sm:p-10" noValidate>
                <h2 className="font-display font-bold text-2xl text-pine-900">{t("contact.formTitle")}</h2>
                <div className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-7">
                  <div>
                    <label htmlFor="c-name" className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">{t("contact.name")} *</label>
                    <input id="c-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={t("contact.namePh")} className={cn("field", errors.name && "field-invalid")} aria-invalid={!!errors.name} />
                    {errors.name && <p className="mt-1.5 text-xs font-semibold text-wine-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="c-email" className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">{t("contact.email")} *</label>
                    <input id="c-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder={t("contact.emailPh")} className={cn("field", errors.email && "field-invalid")} aria-invalid={!!errors.email} />
                    {errors.email && <p className="mt-1.5 text-xs font-semibold text-wine-600">{errors.email}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="c-subject" className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">{t("contact.subject")}</label>
                    <select id="c-subject" value={subject} onChange={(e) => set("subject", e.target.value)} className="field">
                      {subjects.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="c-message" className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1">{t("contact.message")} *</label>
                    <textarea
                      id="c-message"
                      rows={6}
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder={t("contact.messagePh")}
                      className={cn("field resize-none", errors.message && "field-invalid")}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && <p className="mt-1.5 text-xs font-semibold text-wine-600">{errors.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.privacy}
                        onChange={(e) => set("privacy", e.target.checked)}
                        className="mt-1 w-4 h-4 accent-[#71201f]"
                      />
                      <span className="text-sm text-pine-700">
                        {t("contact.privacy1")}
                        <Link to="/privacy-policy" className="link-ink font-semibold text-wine-600">{t("contact.privacyLink")}</Link>
                        {t("contact.privacy2")}
                      </span>
                    </label>
                    {errors.privacy && <p className="mt-1.5 text-xs font-semibold text-wine-600">{errors.privacy}</p>}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-primary mt-9 inline-flex items-center gap-3 bg-pine-900 text-paper-50 border border-pine-900 font-body font-bold text-[12.5px] tracking-[0.16em] uppercase px-8 py-4 disabled:opacity-60 disabled:pointer-events-none"
                >
                  {status === "sending" ? (
                    <>
                      <SpinnerIcon className="w-5 h-5" /> {t("contact.sending")}
                    </>
                  ) : (
                    <>
                      {t("contact.send")} <ArrowRight className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* side info */}
          <aside className="space-y-8 lg:sticky lg:top-32">
            <div className="rv bg-pine-950 text-paper-50 p-8 relative overflow-hidden">
              <div className="absolute inset-0 olive-branch-bg opacity-30" aria-hidden="true" />
              <h2 className="relative font-display font-bold text-xl">{t("contact.studio")}</h2>
              <ul className="relative mt-5 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MailIcon className="w-4.5 h-4.5 text-gold-400 shrink-0 mt-0.5" />
                  <a href={`mailto:${AUTHOR.email}`} className="hover:text-gold-300 transition-colors break-all">{AUTHOR.email}</a>
                </li>
                <li className="flex items-start gap-3">
                  <PinIcon className="w-4.5 h-4.5 text-gold-400 shrink-0 mt-0.5" />
                  <span>{t("contact.location")}</span>
                </li>
              </ul>
              <div className="relative mt-6 pt-5 border-t border-paper-50/15">
                <p className="text-[10px] font-bold tracking-[0.26em] uppercase text-gold-400">{t("contact.social")}</p>
                <div className="mt-3 flex gap-3">
                  <a href={AUTHOR.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="chip grid place-items-center w-10 h-10 border border-paper-100/25 rounded-full hover:bg-gold-500 hover:text-pine-950 hover:border-gold-500 transition-all duration-300">
                    <InstagramIcon className="w-4.5 h-4.5" />
                  </a>
                  <a href={AUTHOR.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="chip grid place-items-center w-10 h-10 border border-paper-100/25 rounded-full hover:bg-gold-500 hover:text-pine-950 hover:border-gold-500 transition-all duration-300">
                    <FacebookIcon className="w-4.5 h-4.5" />
                  </a>
                  <a href={AUTHOR.goodreads} target="_blank" rel="noreferrer" aria-label="Goodreads" className="chip grid place-items-center w-10 h-10 border border-paper-100/25 rounded-full hover:bg-gold-500 hover:text-pine-950 hover:border-gold-500 transition-all duration-300">
                    <GoodreadsIcon className="w-4.5 h-4.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="rv">
              <SectionTitle eyebrow={t("contact.clubsEyebrow")}>{t("contact.clubsTitle")}</SectionTitle>
              <p className="rv mt-4 text-sm leading-relaxed text-pine-700">{t("contact.clubsText")}</p>
            </div>

            <div className="rv border-l-2 border-gold-500 pl-5">
              <p className="font-display italic text-lg text-pine-800 leading-snug">{t("contact.quote")}</p>
              <p className="mt-2 text-[10px] font-bold tracking-[0.26em] uppercase text-pine-600">{t("contact.quoteBy")}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}