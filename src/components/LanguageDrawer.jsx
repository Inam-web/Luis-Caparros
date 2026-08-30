import { useEffect, useSyncExternalStore } from "react";
import { LANGS, useI18n } from "../i18n";
import { useStore } from "../context/StoreContext";
import { CheckIcon, CloseIcon, GlobeIcon, OliveBranch } from "./Icons";
import { cn } from "../utils/cn";

/* tiny external state so trigger + drawer can live apart if needed */
let drawerOpen = false;
const subs = new Set();

function useLangDrawerState() {
  const v = useSyncExternalStore(
    (fn) => {
      subs.add(fn);
      return () => subs.delete(fn);
    },
    () => drawerOpen
  );
  return [v, (nv) => {
    drawerOpen = nv;
    subs.forEach((fn) => fn());
  }];
}

export function LangTrigger({ className }) {
  const { lang, t } = useI18n();
  const [open, setOpen] = useLangDrawerState();
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-1.5 h-10 px-3 rounded-full border border-pine-800/25 text-pine-800 hover:border-wine-600 hover:text-wine-600 transition-all duration-300 active:scale-90",
          className
        )}
        aria-label={t("lang.ariaOpen")}
        aria-haspopup="dialog"
      >
        <GlobeIcon className="w-4 h-4" />
        <span className="font-body font-bold text-[12px] tracking-[0.14em]">{lang.toUpperCase()}</span>
      </button>
      <LanguageDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default function LanguageDrawer({ open, onClose }) {
  const { lang, setLang, t } = useI18n();
  const { pushToast } = useStore();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const choose = (code) => {
    setLang(code);
    onClose();
    pushToast(code === "es" ? "Idioma cambiado a Español" : "Language changed to English", "info");
  };

  return (
    <div
      className={cn("fixed inset-0 z-[88]", open ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!open}
    >
      <button
        className={cn(
          "absolute inset-0 bg-pine-950/70 transition-opacity duration-500 cursor-default",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-label={t("lang.drawerAria")}
      />
      <aside
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-[330px] bg-pine-950 text-paper-50 shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] overflow-hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-label={t("lang.drawerAria")}
      >
        <div className="absolute inset-0 olive-branch-bg opacity-30 pointer-events-none" aria-hidden="true" />

        <div className="relative flex items-center justify-between px-6 h-[70px] border-b border-paper-50/12">
          <h2 className="font-display font-bold text-xl flex items-center gap-3">
            <GlobeIcon className="w-5 h-5 text-gold-400" />
            {t("lang.title")}
          </h2>
          <button
            onClick={onClose}
            className="grid place-items-center w-10 h-10 rounded-full border border-paper-100/25 text-paper-100 hover:bg-paper-50/10 transition-colors active:scale-90"
            aria-label={t("lang.drawerAria")}
          >
            <CloseIcon className="w-4.5 h-4.5" />
          </button>
        </div>

        <p className="relative px-6 pt-6 text-sm text-paper-100/70">{t("lang.subtitle")}</p>

        <div className="relative px-6 mt-5 space-y-3">
          {LANGS.map((l) => {
            const active = lang === l.code;
            return (
              <button
                key={l.code}
                onClick={() => choose(l.code)}
                aria-pressed={active}
                className={cn(
                  "w-full flex items-center gap-4 p-4 border text-left transition-all duration-300 group",
                  active
                    ? "border-gold-500 bg-gold-500/[0.12] shadow-lg shadow-gold-500/10"
                    : "border-paper-50/15 hover:border-paper-50/40 hover:bg-paper-50/[0.05] hover:translate-x-1"
                )}
              >
                <span
                  className={cn(
                    "grid place-items-center w-12 h-12 rounded-[4px] font-display italic font-bold text-lg shrink-0 transition-colors duration-300",
                    active ? "bg-gold-500 text-pine-950" : "bg-paper-50/10 text-paper-100 group-hover:bg-paper-50/20"
                  )}
                >
                  {l.monogram}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-display font-semibold text-lg leading-tight">{l.native}</span>
                  <span className="block text-xs text-paper-100/55 mt-0.5 tracking-wide uppercase">{l.exo}</span>
                </span>
                <span
                  className={cn(
                    "grid place-items-center w-6 h-6 rounded-full border transition-all duration-300",
                    active ? "border-gold-400 bg-gold-500 text-pine-950 scale-100" : "border-paper-50/30 scale-75 opacity-0"
                  )}
                >
                  <CheckIcon className="w-3.5 h-3.5" />
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative mt-auto px-6 pb-8">
          <OliveBranch className="w-24 h-8 text-gold-500/60 mb-4" />
          <p className="text-xs text-paper-100/50 leading-relaxed">{t("lang.note")}</p>
        </div>
      </aside>
    </div>
  );
}