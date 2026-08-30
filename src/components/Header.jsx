import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { AUTHOR, BOOKS, NAV } from "../data/books";
import { useStore } from "../context/StoreContext";
import { useI18n } from "../i18n";
import { prefersReduced } from "../hooks/hooks";
import {
  CartIcon,
  ChevronDown,
  CloseIcon,
  InstagramIcon,
  FacebookIcon,
  MenuIcon,
  SearchIcon,
} from "./Icons";
import { LangTrigger } from "./LanguageDrawer";
import BookCover from "./BookCover";
import { cn } from "../utils/cn";

/* ================= search overlay ================= */
function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    if (open) {
      setQ("");
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  const needle = q.trim().toLowerCase();
  const results = needle.length > 0
    ? BOOKS.filter((b) =>
        [b.title, b.genre.en, b.genre.es, b.blurb.en, b.blurb.es,
          ...b.tags.map((x) => x.en), ...b.tags.map((x) => x.es)]
          .join(" ")
          .toLowerCase()
          .includes(needle)
      )
    : [];

  const submit = (e) => {
    e.preventDefault();
    if (results.length > 0) {
      navigate(`/books/${results[0].slug}`);
      onClose();
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[75] transition-all duration-500",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <button
        className="absolute inset-0 bg-pine-950/85 backdrop-blur-[2px] cursor-default"
        onClick={onClose}
        aria-label={t("header.searchClose")}
      />
      <div
        className={cn(
          "relative mx-auto max-w-3xl px-5 pt-[18vh] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
          open ? "translate-y-0" : "-translate-y-6"
        )}
        role="dialog"
        aria-label={t("header.searchAria")}
      >
        <form onSubmit={submit} className="flex items-end gap-4 border-b-2 border-gold-500/70 pb-3">
          <SearchIcon className="w-6 h-6 text-gold-400 mb-2.5 shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.placeholder")}
            className="flex-1 bg-transparent text-paper-50 font-display text-2xl sm:text-4xl font-medium outline-none placeholder:text-paper-100/35"
            aria-label={t("header.searchAria")}
          />
          <button
            type="button"
            onClick={onClose}
            className="text-paper-100/70 hover:text-paper-50 transition-colors mb-2"
            aria-label={t("header.searchClose")}
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </form>

        {q.trim().length > 0 && (
          <p className="mt-5 text-[11px] font-bold tracking-[0.28em] uppercase text-gold-400">
            {t("search.found", { n: results.length })}
          </p>
        )}

        <div className="mt-5 max-h-[46vh] overflow-y-auto pr-2 space-y-2">
          {results.map((b) => (
            <Link
              key={b.id}
              to={`/books/${b.slug}`}
              onClick={onClose}
              className="flex items-center gap-4 bg-paper-50/[0.04] hover:bg-paper-50/[0.1] border border-paper-50/10 p-3 transition-colors group"
            >
              <div className="w-10 shrink-0 @container">
                <BookCover product={b} interactive={false} />
              </div>
              <div className="min-w-0">
                <p className="font-display font-semibold text-paper-50 text-lg truncate group-hover:text-gold-300 transition-colors">
                  {b.title}
                </p>
                <p className="text-xs text-paper-100/60">
                  {b.year} · {b.genre.en} · {b.price.toFixed(2).replace(".", ",")} €
                </p>
              </div>
            </Link>
          ))}
          {q.trim().length > 0 && results.length === 0 && (
            <p className="text-paper-100/60 font-display italic text-lg py-6">{t("search.empty")}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= header ================= */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { count, openCart } = useStore();
  const { lang, setLang, t } = useI18n();
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close overlays on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setDropOpen(false);
  }, [location.pathname]);

  // lock scroll when overlay open
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  // animate mobile menu links
  useEffect(() => {
    if (!menuRef.current) return;
    const items = menuRef.current.querySelectorAll("[data-menu-item]");
    if (menuOpen && !prefersReduced()) {
      gsap.fromTo(
        items,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.06, delay: 0.12 }
      );
    }
  }, [menuOpen]);

  const activeCls = ({ isActive }) =>
    cn("link-ink font-body font-semibold text-[13px] tracking-[0.08em] uppercase transition-colors", isActive ? "active text-wine-600" : "text-pine-800 hover:text-pine-950");

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[60]">
        {/* top strip */}
        <div
          className={cn(
            "bg-pine-950 text-paper-100/85 overflow-hidden transition-all duration-500",
            scrolled ? "max-h-0" : "max-h-10"
          )}
        >
          <div className="max-w-7xl mx-auto px-5 lg:px-8 h-9 flex items-center justify-between text-[11px] font-medium tracking-[0.14em] uppercase">
            <p className="hidden sm:block">{t("topbar.shipping")}</p>
            <p className="sm:hidden">{t("topbar.short")}</p>
            <div className="flex items-center gap-4">
              <a href={AUTHOR.instagram} target="_blank" rel="noreferrer" className="hover:text-gold-300 transition-colors flex items-center gap-1.5">
                <InstagramIcon className="w-3.5 h-3.5" /> luis.caparrosmiron
              </a>
              <a href={AUTHOR.facebook} target="_blank" rel="noreferrer" className="hover:text-gold-300 transition-colors hidden md:flex items-center gap-1.5">
                <FacebookIcon className="w-3.5 h-3.5" /> caparrosmiron
              </a>
            </div>
          </div>
        </div>

        {/* main bar */}
        <div
          className={cn(
            "transition-all duration-500 border-b",
            scrolled
              ? "bg-paper-50/95 backdrop-blur-md border-pine-800/15 shadow-[0_10px_30px_-18px_rgba(16,26,21,0.35)]"
              : "bg-paper-100/80 backdrop-blur-sm border-transparent"
          )}
        >
          <div className={cn("max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between transition-all duration-500", scrolled ? "h-16" : "h-[74px]")}>
            {/* logo */}
            <Link to="/" className="flex items-center gap-3 group" aria-label={t("header.logoAria")}>
              <span className="grid place-items-center w-10 h-10 bg-pine-900 text-gold-300 font-display italic font-bold text-lg rounded-[4px] transition-transform duration-500 group-hover:-rotate-6">
                LC
              </span>
              <span className="leading-none">
                <span className="block font-display font-bold text-[17px] tracking-[0.04em] text-pine-900">LUIS CAPARRÓS</span>
                <span className="block text-[9.5px] font-body font-bold tracking-[0.42em] uppercase text-wine-600 mt-1">{t("header.writer")}</span>
              </span>
            </Link>

            {/* desktop nav */}
            <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
              {NAV.map((item) =>
                item.dropdown ? (
                  <div key={item.key} className="relative" onMouseEnter={() => setDropOpen(true)} onMouseLeave={() => setDropOpen(false)}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(activeCls({ isActive }), "flex items-center gap-1.5 py-2")
                      }
                      onFocus={() => setDropOpen(true)}
                    >
                      {t(`nav.${item.key}`)}
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", dropOpen && "rotate-180")} />
                    </NavLink>
                    <div
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[380px] transition-all duration-300 origin-top",
                        dropOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                      )}
                    >
                      <div className="bg-pine-950 text-paper-100 shadow-2xl shadow-pine-950/40 border border-gold-500/20 p-3">
                        <p className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-[0.3em] uppercase text-gold-400">{t("header.dropTitle")}</p>
                        {BOOKS.slice(1).map((b) => (
                          <Link
                            key={b.id}
                            to={`/books/${b.slug}`}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-paper-50/[0.06] transition-colors group/item"
                          >
                            <span className="font-display italic text-gold-400/80 text-sm w-4">{b.year.toString().slice(2)}</span>
                            <span className="font-body font-medium text-sm text-paper-100/90 group-hover/item:text-gold-300 transition-colors">
                              {b.title}
                            </span>
                          </Link>
                        ))}
                        <Link to="/books" className="mt-2 block text-center border-t border-paper-50/10 pt-3 pb-1 text-[11px] font-bold tracking-[0.24em] uppercase text-gold-300 hover:text-gold-400 transition-colors">
                          {t("header.dropAll")}
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <NavLink key={item.key} to={item.to} className={activeCls} end={item.to === "/"}>
                    {t(`nav.${item.key}`)}
                  </NavLink>
                )
              )}
            </nav>

            {/* actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <LangTrigger className="hidden sm:flex" />
              <button
                onClick={() => setSearchOpen(true)}
                className="grid place-items-center w-10 h-10 text-pine-800 hover:text-wine-600 hover:bg-pine-800/8 rounded-full transition-all duration-300 active:scale-90"
                aria-label={t("header.search")}
              >
                <SearchIcon className="w-5 h-5" />
              </button>
              <button
                onClick={openCart}
                className="relative grid place-items-center w-10 h-10 text-pine-800 hover:text-wine-600 hover:bg-pine-800/8 rounded-full transition-all duration-300 active:scale-90"
                aria-label={t("header.cartAria", { count })}
              >
                <CartIcon className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 grid place-items-center min-w-[18px] h-[18px] px-1 rounded-full bg-wine-600 text-paper-50 text-[10px] font-bold animate-[pop_.35s_cubic-bezier(.34,1.56,.64,1)]">
                    {count}
                  </span>
                )}
                <style>{`@keyframes pop { 0% { transform: scale(.3);} 100% { transform: scale(1);} }`}</style>
              </button>
              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden grid place-items-center w-10 h-10 text-pine-800 hover:text-wine-600 rounded-full transition-colors"
                aria-label={t("header.menuOpen")}
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-[80] lg:hidden transition-opacity duration-400",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!menuOpen}
      >
        <button className="absolute inset-0 bg-pine-950 cursor-default" onClick={() => setMenuOpen(false)} aria-label={t("header.menuClose")} />
        <div className="olive-branch-bg relative h-full overflow-y-auto px-7 py-6 flex flex-col">
          <div className="flex items-center justify-between">
            <p className="font-display italic text-gold-400 text-xl">{t("menu.title")}</p>
            <button
              onClick={() => setMenuOpen(false)}
              className="grid place-items-center w-11 h-11 border border-paper-100/25 text-paper-100 rounded-full hover:bg-paper-50/10 transition-colors"
              aria-label={t("header.menuClose")}
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* language switch */}
          <div data-menu-item className="mt-6 flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-paper-100/50 mr-1">{t("menu.langTitle")}</span>
            {["en", "es"].map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={cn(
                  "px-4 py-1.5 border font-body font-bold text-[12px] tracking-[0.14em] uppercase transition-all duration-300",
                  lang === code
                    ? "bg-gold-500 border-gold-500 text-pine-950"
                    : "border-paper-100/25 text-paper-100/80 hover:border-gold-400 hover:text-gold-300"
                )}
              >
                {code}
              </button>
            ))}
          </div>

          <nav ref={menuRef} className="mt-6 flex-1" aria-label="Mobile navigation">
            {NAV.map((item, i) => (
              <div key={item.key} data-menu-item className="border-b border-paper-50/10">
                {item.dropdown ? (
                  <details className="group">
                    <summary className="flex items-center justify-between py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      <span className="font-display font-semibold text-3xl text-paper-50 group-open:text-gold-300 transition-colors">
                        <span className="text-gold-500/60 text-base font-body font-bold mr-3">0{i + 1}</span>
                        {t(`nav.${item.key}`)}
                      </span>
                      <ChevronDown className="w-5 h-5 text-gold-400 transition-transform duration-300 group-open:rotate-180" />
                    </summary>
                    <div className="pb-4 pl-9 space-y-2.5">
                      {BOOKS.map((b) => (
                        <Link key={b.id} to={`/books/${b.slug}`} className="block font-body text-paper-100/80 hover:text-gold-300 transition-colors text-[15px]">
                          {b.title} <span className="text-paper-100/40 text-xs">· {b.year}</span>
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center py-4 font-display font-semibold text-3xl transition-colors",
                        isActive ? "text-gold-300" : "text-paper-50 hover:text-gold-300"
                      )
                    }
                  >
                    <span className="text-gold-500/60 text-base font-body font-bold mr-3">0{i + 1}</span>
                    {t(`nav.${item.key}`)}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          <div data-menu-item className="mt-8 flex items-center justify-between">
            <div className="flex gap-3">
              <a href={AUTHOR.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid place-items-center w-11 h-11 border border-paper-100/25 text-paper-100 rounded-full hover:bg-gold-500 hover:text-pine-950 hover:border-gold-500 transition-all duration-300">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href={AUTHOR.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid place-items-center w-11 h-11 border border-paper-100/25 text-paper-100 rounded-full hover:bg-gold-500 hover:text-pine-950 hover:border-gold-500 transition-all duration-300">
                <FacebookIcon className="w-5 h-5" />
              </a>
            </div>
            <Link to="/store" onClick={() => setMenuOpen(false)} className="font-body font-bold text-[12px] tracking-[0.22em] uppercase text-gold-300 flex items-center gap-2">
              <CartIcon className="w-4 h-4" /> {t("menu.store")}
            </Link>
          </div>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}