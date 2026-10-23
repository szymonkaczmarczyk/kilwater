import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const navigationEvent = "kilwater:navigate";

let lenis: Lenis | undefined;

export const startSmoothScroll = () => {
  if (lenis || prefersReducedMotion()) return lenis;

  lenis = new Lenis({ duration: 1.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
};

const targetTop = (target: number | HTMLElement) => {
  if (typeof target === "number") return target;
  const scrollMargin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  return target.getBoundingClientRect().top + window.scrollY - scrollMargin;
};

export const scrollToTarget = (target: number | HTMLElement, immediate = false) => {
  const top = targetTop(target);
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(top, { immediate, force: true });
    return;
  }
  window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? "auto" : "smooth" });
};

const samePageTarget = (url: URL) => {
  if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return null;
  return document.getElementById(decodeURIComponent(url.hash.slice(1)));
};

const focusSection = (target: HTMLElement) => {
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
};

export const startAnchorNavigation = () => {
  ScrollTrigger.clearScrollMemory("manual");

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href*='#']");
    if (!link || link.target === "_blank") return;
    const url = new URL(link.href);
    const target = samePageTarget(url);
    if (!target) return;

    event.preventDefault();
    history.replaceState(null, "", url.pathname + url.search);
    window.dispatchEvent(new Event(navigationEvent));
    scrollToTarget(target);
    focusSection(target);
  });

  const initialTarget = samePageTarget(new URL(window.location.href));
  history.replaceState(null, "", window.location.pathname + window.location.search);

  let userHasScrolled = false;
  const markUserScroll = () => {
    userHasScrolled = true;
  };
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach((type) =>
    window.addEventListener(type, markUserScroll, { once: true, passive: true }),
  );

  if (!initialTarget) window.scrollTo(0, 0);

  window.addEventListener(
    "load",
    () => {
      if (userHasScrolled) return;
      ScrollTrigger.refresh();
      if (!initialTarget) {
        if (window.scrollY > 0) scrollToTarget(0, true);
        return;
      }
      scrollToTarget(initialTarget, true);
      focusSection(initialTarget);
    },
    { once: true },
  );
};

export { gsap, ScrollTrigger };
