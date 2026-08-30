import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { STRINGS } from "./strings";

export { LANGS } from "./strings";

const STORAGE_KEY = "lc-lang-v1";

const listeners = new Set();

export function getLang() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === "es" ? "es" : "en";
  } catch {
    return "en";
  }
}

export function setLangStore(l) {
  try {
    localStorage.setItem(STORAGE_KEY, l);
  } catch {
    /* storage unavailable */
  }
  document.documentElement.lang = l;
  listeners.forEach((fn) => fn());
}

function subscribe(fn) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useLang() {
  return useSyncExternalStore(subscribe, getLang, () => "en");
}

function resolve(dict, path) {
  return path
    .split(".")
    .reduce((acc, k) => (acc && typeof acc === "object" ? acc[k] : undefined), dict);
}

export function tr(key, lang = getLang(), vars) {
  let out = resolve(STRINGS[lang], key);
  if (out == null) out = resolve(STRINGS.en, key);
  let s = typeof out === "string" ? out : key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.split(`{${k}}`).join(String(v));
    }
  }
  return s;
}

export function trArr(key, lang = getLang()) {
  const out = resolve(STRINGS[lang], key);
  return Array.isArray(out) ? out : [];
}

/* ---------- React context ---------- */
const Ctx = createContext({
  lang: "en",
  setLang: setLangStore,
  t: (k, v) => tr(k, "en", v),
  ta: (k) => trArr(k, "en"),
});

export function LanguageProvider({ children }) {
  const lang = useLang();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang: setLangStore,
      t: (k, v) => tr(k, lang, v),
      ta: (k) => trArr(k, lang),
    }),
    [lang]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);