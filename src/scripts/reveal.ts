import { gsap, ScrollTrigger, prefersReducedMotion } from "./motion";

export const startScrollReveals = () => {
  if (prefersReducedMotion()) return;

  gsap.set("[data-reveal]", { opacity: 0, y: 40 });
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 85%",
    once: true,
    onEnter: (elements) =>
      gsap.to(elements, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.12 }),
  });

  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((image) => {
    const frame = image.closest(".frame") ?? image;
    gsap.fromTo(
      image,
      { yPercent: -6, scale: 1.14 },
      {
        yPercent: 6,
        scale: 1.14,
        ease: "none",
        scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });
};
