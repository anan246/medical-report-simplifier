"use client";

import { useEffect, useRef } from "react";

export default function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    // Observe the element itself and all .reveal children
    const targets = el.querySelectorAll(".reveal");
    if (targets.length > 0) {
      targets.forEach((t) => observer.observe(t));
    } else {
      el.classList.add("reveal");
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}
