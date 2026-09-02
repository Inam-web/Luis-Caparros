import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { AUTHOR } from "../data/books";

import { usePageFX, useSEO } from "../hooks/hooks";

import { useI18n } from "../i18n";

import {
  ArrowRight,
  CheckIcon,
  FacebookIcon,
  GoodreadsIcon,
  InstagramIcon,
  MailIcon,
  PinIcon,
  SpinnerIcon,
} from "../components/Icons";

import { SectionTitle } from "../components/ui";

import { cn } from "../utils/cn";

export default function Contact() {
  const { lang, t, ta } = useI18n();

  useSEO(
    lang === "en"
      ? "Contact - LUIS CAPARRÓS"
      : "Contacto - LUIS CAPARRÓS",
    lang === "en"
      ? "Write to Luis Caparrós: questions about books, orders, presentations and reading clubs."
      : "Escríbele a Luis Caparrós: consultas sobre libros, pedidos, presentaciones y clubes de lectura."
  );

  usePageFX([lang]);

  const subjects = ta("contact.subjects");

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    privacy: false,
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  /*
   * Toast is only used for errors now.
   * Successful submissions use the centered confirmation.
   */
  const [toast, setToast] = useState({
    visible: false,
    type: "",
    message: "",
  });

  /*
   * Controls the centered success animation.
   */
  const [showSuccess, setShowSuccess] = useState(false);

  const subject = form.subject || subjects[0] || "";

  /*
   * ---------------------------------------------------------
   * SUCCESS AUTO HIDE
   * ---------------------------------------------------------
   *
   * Success animation stays visible for 5 seconds.
   */
  useEffect(() => {
    if (!showSuccess) return;

    const timer = setTimeout(() => {
      setShowSuccess(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showSuccess]);

  /*
   * ---------------------------------------------------------
   * ERROR TOAST AUTO HIDE
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!toast.visible) return;

    const timer = setTimeout(() => {
      setToast((current) => ({
        ...current,
        visible: false,
      }));
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.visible]);

  /*
   * ---------------------------------------------------------
   * SET FORM FIELD
   * ---------------------------------------------------------
   */
  const set = (k, v) => {
    setForm((f) => ({
      ...f,
      [k]: v,
    }));

    if (errors[k]) {
      setErrors((er) => ({
        ...er,
        [k]: "",
      }));
    }
  };

  /*
   * ---------------------------------------------------------
   * VALIDATION
   * ---------------------------------------------------------
   */
  const validate = () => {
    const er = {};

    if (form.name.trim().length < 2) {
      er.name = t("contact.errName");
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
        form.email.trim()
      )
    ) {
      er.email = t("contact.errEmail");
    }

    if (form.message.trim().length < 10) {
      er.message = t("contact.errMessage");
    }

    if (!form.privacy) {
      er.privacy = t("contact.errPrivacy");
    }

    return er;
  };

  /*
   * ---------------------------------------------------------
   * SHOW ERROR TOAST
   * ---------------------------------------------------------
   */
  const showErrorToast = (message) => {
    setToast({
      visible: false,
      type: "",
      message: "",
    });

    requestAnimationFrame(() => {
      setToast({
        visible: true,
        type: "error",
        message,
      });
    });
  };

  /*
   * ---------------------------------------------------------
   * CLOSE ERROR TOAST
   * ---------------------------------------------------------
   */
  const closeToast = () => {
    setToast((current) => ({
      ...current,
      visible: false,
    }));
  };

  /*
   * ---------------------------------------------------------
   * SUBMIT
   * ---------------------------------------------------------
   */
  const submit = async (e) => {
    e.preventDefault();

    const er = validate();

    setErrors(er);

    if (Object.keys(er).length > 0) {
      return;
    }

    setStatus("sending");

    // Hide any previous error toast.
    setToast({
      visible: false,
      type: "",
      message: "",
    });

    try {
      const response = await fetch(
        "http://localhost:5000/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            subject: form.subject || subjects[0] || "",
            message: form.message.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send");
      }

      /*
       * -------------------------------------------------------
       * SUCCESS
       * -------------------------------------------------------
       */

      setStatus("sent");
      setErrors({});

      /*
       * Show centered success animation.
       */
      setShowSuccess(true);

      /*
       * Clear the form.
       */
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        privacy: false,
      });
    } catch (error) {
      console.error("Contact form error:", error);

      setStatus("error");

      showErrorToast(
        lang === "en"
          ? "Something went wrong. Please try again or email us directly."
          : "Algo salió mal. Por favor, inténtalo de nuevo o escríbenos directamente."
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * RESET
   * ---------------------------------------------------------
   */
  const handleReset = () => {
    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
      privacy: false,
    });

    setStatus("idle");
    setErrors({});
    setShowSuccess(false);
    closeToast();
  };

  return (
    <>
      {/* =====================================================
          CENTERED SUCCESS CONFIRMATION
      ====================================================== */}

      <div
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          "fixed inset-0 z-[10000] flex items-center justify-center",
          "px-5",
          "transition-all duration-500",
          showSuccess
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none"
        )}
      >
        {/* BACKDROP */}

        <div
          className={cn(
            "absolute inset-0 bg-pine-950/45 backdrop-blur-[6px]",
            "transition-opacity duration-500",
            showSuccess ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setShowSuccess(false)}
          aria-hidden="true"
        />

        {/* SUCCESS CARD */}

        <div
          className={cn(
            "relative z-10 w-full max-w-sm",
            "flex flex-col items-center text-center",
            "px-8 py-10 sm:px-12 sm:py-12",
            "bg-paper-50",
            "border border-pine-900/10",
            "shadow-[0_30px_100px_rgba(0,0,0,0.25)]",
            "transition-all duration-700",
            showSuccess
              ? "translate-y-0 scale-100"
              : "translate-y-8 scale-90"
          )}
        >
          {/* =================================================
              RADIATING SUCCESS ICON
          ================================================== */}

          <div className="relative w-32 h-32 flex items-center justify-center">

            {/* OUTER RING */}

            <span
              className={cn(
                "absolute inset-0 rounded-full",
                "border border-emerald-500/25",
                showSuccess && "success-ring-one"
              )}
            />

            {/* SECOND RING */}

            <span
              className={cn(
                "absolute inset-3 rounded-full",
                "border border-emerald-500/20",
                showSuccess && "success-ring-two"
              )}
            />

            {/* SPIKES / RAYS */}

            <div
              className={cn(
                "absolute inset-0",
                showSuccess && "success-rays"
              )}
            >
              {/* TOP */}
              <span className="success-ray success-ray-top" />

              {/* RIGHT */}
              <span className="success-ray success-ray-right" />

              {/* BOTTOM */}
              <span className="success-ray success-ray-bottom" />

              {/* LEFT */}
              <span className="success-ray success-ray-left" />

              {/* TOP RIGHT */}
              <span className="success-ray success-ray-tr" />

              {/* BOTTOM RIGHT */}
              <span className="success-ray success-ray-br" />

              {/* BOTTOM LEFT */}
              <span className="success-ray success-ray-bl" />

              {/* TOP LEFT */}
              <span className="success-ray success-ray-tl" />
            </div>

            {/* GREEN CIRCLE */}

            <div
              className={cn(
                "relative z-20",
                "w-[76px] h-[76px]",
                "rounded-full",
                "bg-emerald-600",
                "flex items-center justify-center",
                "shadow-[0_12px_35px_rgba(16,185,129,0.35)]",
                showSuccess && "success-circle"
              )}
            >
              {/* CHECK CIRCLE */}

              <div
                className={cn(
                  "w-[62px] h-[62px]",
                  "rounded-full",
                  "border-2 border-white/30",
                  "flex items-center justify-center"
                )}
              >
                <CheckIcon
                  className={cn(
                    "w-8 h-8 text-white",
                    showSuccess && "success-check"
                  )}
                />
              </div>
            </div>
          </div>

          {/* =================================================
              MESSAGE
          ================================================== */}

          <div
            className={cn(
              "mt-7",
              "transition-all duration-700 delay-200",
              showSuccess
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            )}
          >
            <p className="font-body font-bold text-[10px] tracking-[0.32em] uppercase text-emerald-600">
              {lang === "en"
                ? "Success"
                : "Éxito"}
            </p>

            <h2 className="mt-2 font-display font-semibold text-3xl text-pine-950">
              {lang === "en"
                ? "Message Sent"
                : "Mensaje enviado"}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-pine-700 max-w-xs mx-auto">
              {lang === "en"
                ? "Thank you for reaching out. Your message has been sent successfully."
                : "Gracias por escribir. Tu mensaje se ha enviado correctamente."}
            </p>
          </div>

          {/* =================================================
              CLOSE / CONTINUE
          ================================================== */}

          <button
            type="button"
            onClick={() => setShowSuccess(false)}
            className={cn(
              "mt-7",
              "font-body font-bold text-[10px]",
              "tracking-[0.2em] uppercase",
              "text-pine-600",
              "hover:text-emerald-600",
              "transition-colors duration-300",
              showSuccess
                ? "opacity-100"
                : "opacity-0"
            )}
          >
            {lang === "en"
              ? "Continue"
              : "Continuar"}
          </button>

          {/* BOTTOM PROGRESS */}

          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 h-[2px]",
              "bg-emerald-500",
              showSuccess && "success-progress"
            )}
          />
        </div>
      </div>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative bg-pine-950 text-paper-50 pt-40 pb-16 lg:pt-48 lg:pb-20 overflow-hidden">
        <div
          className="absolute inset-0 olive-branch-bg opacity-25"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <p className="hero-el flex items-center gap-3 font-body font-bold text-[11px] tracking-[0.34em] uppercase text-gold-400">
            <MailIcon className="w-4.5 h-4.5" />

            {t("contact.eyebrow")}
          </p>

          <h1 className="mt-5 font-display font-semibold leading-[1.02] text-[clamp(2.6rem,6.5vw,5rem)] max-w-3xl">
            <span className="line-mask">
              <span>{t("contact.l1")}</span>
            </span>

            <span className="line-mask">
              <span className="italic font-light text-gold-300">
                {t("contact.l2")}
              </span>
            </span>
          </h1>

          <p className="hero-el mt-6 max-w-xl text-[15px] leading-relaxed text-paper-100/80">
            {t("contact.intro")}
          </p>
        </div>
      </section>

      {/* =====================================================
          CONTACT SECTION
      ====================================================== */}

      <section className="paper-grain py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-start">

          {/* FORM */}

          <div>
            <form
              onSubmit={submit}
              className="rv bg-paper-50 border border-pine-800/15 p-6 sm:p-10"
              noValidate
            >
              <h2 className="font-display font-bold text-2xl text-pine-900">
                {t("contact.formTitle")}
              </h2>

              {/* FIELDS */}

              <div className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-7">

                {/* NAME */}

                <div>
                  <label
                    htmlFor="c-name"
                    className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1"
                  >
                    {t("contact.name")} *
                  </label>

                  <input
                    id="c-name"
                    value={form.name}
                    onChange={(e) =>
                      set("name", e.target.value)
                    }
                    placeholder={t("contact.namePh")}
                    className={cn(
                      "field",
                      errors.name && "field-invalid"
                    )}
                    aria-invalid={!!errors.name}
                  />

                  {errors.name && (
                    <p className="mt-1.5 text-xs font-semibold text-wine-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="c-email"
                    className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1"
                  >
                    {t("contact.email")} *
                  </label>

                  <input
                    id="c-email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      set("email", e.target.value)
                    }
                    placeholder={t("contact.emailPh")}
                    className={cn(
                      "field",
                      errors.email && "field-invalid"
                    )}
                    aria-invalid={!!errors.email}
                  />

                  {errors.email && (
                    <p className="mt-1.5 text-xs font-semibold text-wine-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* SUBJECT */}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="c-subject"
                    className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1"
                  >
                    {t("contact.subject")}
                  </label>

                  <select
                    id="c-subject"
                    value={subject}
                    onChange={(e) =>
                      set("subject", e.target.value)
                    }
                    className="field"
                  >
                    {subjects.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* MESSAGE */}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="c-message"
                    className="block text-[11px] font-bold tracking-[0.2em] uppercase text-pine-700 mb-1"
                  >
                    {t("contact.message")} *
                  </label>

                  <textarea
                    id="c-message"
                    rows={6}
                    value={form.message}
                    onChange={(e) =>
                      set("message", e.target.value)
                    }
                    placeholder={t("contact.messagePh")}
                    className={cn(
                      "field resize-none",
                      errors.message && "field-invalid"
                    )}
                    aria-invalid={!!errors.message}
                  />

                  {errors.message && (
                    <p className="mt-1.5 text-xs font-semibold text-wine-600">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* PRIVACY */}

                <div className="sm:col-span-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.privacy}
                      onChange={(e) =>
                        set(
                          "privacy",
                          e.target.checked
                        )
                      }
                      className="mt-1 w-4 h-4 accent-[#71201f]"
                    />

                    <span className="text-sm text-pine-700">
                      {t("contact.privacy1")}

                      <Link
                        to="/privacy-policy"
                        className="link-ink font-semibold text-wine-600"
                      >
                        {t("contact.privacyLink")}
                      </Link>

                      {t("contact.privacy2")}
                    </span>
                  </label>

                  {errors.privacy && (
                    <p className="mt-1.5 text-xs font-semibold text-wine-600">
                      {errors.privacy}
                    </p>
                  )}
                </div>
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary mt-9 inline-flex items-center gap-3 bg-pine-900 text-paper-50 border border-pine-900 font-body font-bold text-[12.5px] tracking-[0.16em] uppercase px-8 py-4 disabled:opacity-60 disabled:pointer-events-none"
              >
                {status === "sending" ? (
                  <>
                    <SpinnerIcon className="w-5 h-5 animate-spin" />

                    {t("contact.sending")}
                  </>
                ) : (
                  <>
                    {t("contact.send")}

                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>

              <p className="mt-4 text-xs text-pine-600/70 text-center">
                {lang === "en"
                  ? "Your message will be sent directly to the author's email."
                  : "Tu mensaje se enviará directamente al correo del autor."}
              </p>
            </form>
          </div>

          {/* =================================================
              SIDEBAR
          ================================================== */}

          <aside className="space-y-8 lg:sticky lg:top-32">

            {/* STUDIO */}

            <div className="rv bg-pine-950 text-paper-50 p-8 relative overflow-hidden">
              <div
                className="absolute inset-0 olive-branch-bg opacity-30"
                aria-hidden="true"
              />

              <h2 className="relative font-display font-bold text-xl">
                {t("contact.studio")}
              </h2>

              <ul className="relative mt-5 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MailIcon className="w-4.5 h-4.5 text-gold-400 shrink-0 mt-0.5" />

                  <a
                    href={`mailto:${AUTHOR.email}`}
                    className="hover:text-gold-300 transition-colors break-all"
                  >
                    {AUTHOR.email}
                  </a>
                </li>

                <li className="flex items-start gap-3">
                  <PinIcon className="w-4.5 h-4.5 text-gold-400 shrink-0 mt-0.5" />

                  <span>{t("contact.location")}</span>
                </li>
              </ul>

              {/* SOCIAL */}

              <div className="relative mt-6 pt-5 border-t border-paper-50/15">
                <p className="text-[10px] font-bold tracking-[0.26em] uppercase text-gold-400">
                  {t("contact.social")}
                </p>

                <div className="mt-3 flex gap-3">
                  <a
                    href={AUTHOR.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="chip grid place-items-center w-10 h-10 border border-paper-100/25 rounded-full hover:bg-gold-500 hover:text-pine-950 hover:border-gold-500 transition-all duration-300"
                  >
                    <InstagramIcon className="w-4.5 h-4.5" />
                  </a>

                  <a
                    href={AUTHOR.facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="chip grid place-items-center w-10 h-10 border border-paper-100/25 rounded-full hover:bg-gold-500 hover:text-pine-950 hover:border-gold-500 transition-all duration-300"
                  >
                    <FacebookIcon className="w-4.5 h-4.5" />
                  </a>

                  <a
                    href={AUTHOR.goodreads}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Goodreads"
                    className="chip grid place-items-center w-10 h-10 border border-paper-100/25 rounded-full hover:bg-gold-500 hover:text-pine-950 hover:border-gold-500 transition-all duration-300"
                  >
                    <GoodreadsIcon className="w-4.5 h-4.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* BOOK CLUBS */}

            <div className="rv">
              <SectionTitle eyebrow={t("contact.clubsEyebrow")}>
                {t("contact.clubsTitle")}
              </SectionTitle>

              <p className="rv mt-4 text-sm leading-relaxed text-pine-700">
                {t("contact.clubsText")}
              </p>
            </div>

            {/* QUOTE */}

            <div className="rv border-l-2 border-gold-500 pl-5">
              <p className="font-display italic text-lg text-pine-800 leading-snug">
                {t("contact.quote")}
              </p>

              <p className="mt-2 text-[10px] font-bold tracking-[0.26em] uppercase text-pine-600">
                {t("contact.quoteBy")}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* =====================================================
          ERROR TOAST
      ====================================================== */}

      <div
        aria-live="assertive"
        aria-atomic="true"
        className={cn(
          "fixed right-5 bottom-5 sm:right-8 sm:bottom-8 z-[11000]",
          "w-[calc(100%-2.5rem)] sm:w-auto sm:min-w-[360px] max-w-md",
          "transition-all duration-500 ease-out",
          toast.visible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-6 opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div className="relative overflow-hidden bg-paper-50 border border-wine-600/30 shadow-2xl p-4 sm:p-5">

          <div className="flex items-start gap-4">

            {/* ERROR ICON */}

            <div className="shrink-0 grid place-items-center w-11 h-11 rounded-full bg-wine-600/10 text-wine-600">
              <span className="font-bold text-lg">
                !
              </span>
            </div>

            {/* MESSAGE */}

            <div className="flex-1 min-w-0 pr-5">
              <h3 className="font-display font-semibold text-base text-pine-900">
                {lang === "en"
                  ? "Message not sent"
                  : "Mensaje no enviado"}
              </h3>

              <p className="mt-1 text-sm leading-relaxed text-pine-700">
                {toast.message}
              </p>
            </div>

            {/* CLOSE */}

            <button
              type="button"
              onClick={closeToast}
              aria-label={
                lang === "en"
                  ? "Close notification"
                  : "Cerrar notificación"
              }
              className="absolute top-3 right-3 w-7 h-7 grid place-items-center text-pine-600/60 hover:text-pine-900 transition-colors"
            >
              <span className="text-xl leading-none">
                ×
              </span>
            </button>
          </div>

          {/* ERROR PROGRESS */}

          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-wine-600 animate-toast-progress" />
        </div>
      </div>
    </>
  );
}