import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement = HTMLDivElement>(staggerMs = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-revealed");
      return;
    }

    // Immediately reveal if already scrolled past or visible in viewport
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (staggerMs > 0) {
              setTimeout(() => {
                el.classList.add("is-revealed");
              }, staggerMs);
            } else {
              el.classList.add("is-revealed");
            }
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: "0px 0px 80px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [staggerMs]);

  return ref;
}
