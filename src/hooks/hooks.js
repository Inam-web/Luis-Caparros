import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
/* Avoid refresh jitter when the mobile URL bar shows/hides */
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

export const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- SEO ---------------- */
export function useSEO(title, description, path = "") {
  const location = useLocation();
  useEffect(() => {
    document.title = title;
    const setMeta = (attr, key, content) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", `https://luiscaparrosescritor.com${path || location.pathname}`);
    let canon = document.head.querySelector('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.appendChild(canon);
    }
    canon.href = `https://luiscaparrosescritor.com${path || location.pathname}`;
  }, [title, description, path, location.pathname]);
}

/* ---------------- Page FX (scroll reveals) ---------------- */
const DONE = "fxDone";

function revealAll() {
  gsap.set(".rv, .rv-left, .rv-right, .rv-scale", { opacity: 1, x: 0, y: 0, scale: 1 });
  gsap.set(".line-mask > span", { y: 0 });
  gsap.set(".img-reveal", { clipPath: "inset(0 0 0% 0)" });
}

const isDone = (el) => !!el.dataset[DONE];
const markDone = (el) => () => {
  el.dataset[DONE] = "1";
};
const pending = (sel) =>
  gsap.utils.toArray(sel).filter((el) => !isDone(el));

export function usePageFX(deps = []) {
  const location = useLocation();

  useEffect(() => {
    if (prefersReduced()) {
      revealAll();
      return;
    }

    const triggers = [];
    let heroTween = null;

    /* ---- hero entrance (elements not yet revealed) ---- */
    const heroEls = pending(".hero-el");
    if (heroEls.length) {
      heroTween = gsap.fromTo(
        heroEls,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          delay: 0.1,
          onComplete: () => heroEls.forEach((el) => (el.dataset[DONE] = "1")),
        }
      );
    }

    /* ---- line-mask reveals ---- */
    pending(".line-mask").forEach((mask) => {
      const spans = mask.querySelectorAll(":scope > span");
      triggers.push(
        ScrollTrigger.create({
          trigger: mask,
          start: "top 89%",
          once: true,
          onEnter: () =>
            gsap.to(spans, {
              y: 0,
              duration: 0.85,
              ease: "power4.out",
              stagger: 0.08,
              onComplete: markDone(mask),
            }),
        })
      );
    });

    /* ---- image wipes ---- */
    pending(".img-reveal").forEach((el) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () =>
            gsap.to(el, {
              clipPath: "inset(0 0 0% 0)",
              duration: 0.95,
              ease: "power3.inOut",
              onComplete: markDone(el),
            }),
        })
      );
    });

    /* ---- directional fades ---- */
    const defs = [
      [".rv", { y: 28 }],
      [".rv-left", { x: -34 }],
      [".rv-right", { x: 34 }],
      [".rv-scale", { scale: 0.95 }],
    ];
    defs.forEach(([sel, from]) => {
      pending(sel).forEach((el) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () =>
              gsap.fromTo(
                el,
                { opacity: 0, ...from },
                {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  duration: 0.75,
                  ease: "power3.out",
                  onComplete: markDone(el),
                }
              ),
          })
        );
      });
    });

    /* ---- settle-aware refresh ---- */
    const refresh = () => ScrollTrigger.refresh();
    const timer = window.setTimeout(refresh, 90);
    window.addEventListener("load", refresh);
    let alive = true;
    document.fonts?.ready
      ?.then(() => {
        if (alive) refresh();
      })
      .catch(() => {});

    return () => {
      alive = false;
      window.clearTimeout(timer);
      window.removeEventListener("load", refresh);
      heroTween?.kill();
      triggers.forEach((t) => t.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, ...deps]);
}

/* ---------------- Parallax ---------------- */
export function useParallax() {
  const location = useLocation();
  useEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        const speed = Math.min(parseFloat(el.dataset.parallax ?? "0.1"), 0.2);
        gsap.set(el, { scale: 1 + speed * 2 + 0.06 });
        gsap.fromTo(
          el,
          { yPercent: -speed * 100 },
          {
            yPercent: speed * 100,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, [location.pathname]);
}