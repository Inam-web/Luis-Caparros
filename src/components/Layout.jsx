import { createContext, useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReduced } from "../hooks/hooks";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import { ToastHost } from "./ui";

const Ctx = createContext({ lenis: null, scrollToId: () => {} });
export const useLenis = () => useContext(Ctx);

export default function Layout({ children }) {
  const lenisRef = useRef(null);
  const location = useLocation();

  // ---- Lenis smooth scroll + GSAP ScrollTrigger sync ----
  useEffect(() => {
    if (prefersReduced()) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", () => ScrollTrigger.update());

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // ---- scroll to top on route change ----
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    // refresh on the next frame (after the new page has laid out), and again
    // once fonts/images settle — prevents reveals firing against stale bounds
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [location.pathname]);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    let alive = true;
    document.fonts?.ready
      ?.then(() => {
        if (alive) refresh();
      })
      .catch(() => {});
    return () => {
      alive = false;
      window.removeEventListener("load", refresh);
    };
  }, []);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Ctx.Provider value={{ lenis: lenisRef.current, scrollToId }}>
      <div className="noise-layer" aria-hidden="true" />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
      <ToastHost />
    </Ctx.Provider>
  );
}