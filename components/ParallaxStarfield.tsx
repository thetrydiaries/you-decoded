"use client";

import { useEffect, useRef } from "react";

export function ParallaxStarfield() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId: number;
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (el) el.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={ref} className="starfield" aria-hidden />;
}
