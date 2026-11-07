"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Fades and lifts its children into view the first time they scroll on screen.
 * The styles live in globals.css ([data-reveal]); reduced-motion users see the
 * content immediately.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Very old browsers: just show it (deferred, not during the effect).
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal
      data-visible={visible ? "true" : "false"}
      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  );
}

/** Counts up to `value` once visible. Renders the final number for no-JS and reduced motion. */
export function CountUp({
  value,
  suffix = "",
  durationMs = 1600,
  plain = false,
}: {
  value: number;
  suffix?: string;
  durationMs?: number;
  /** No thousands separator (for years). */
  plain?: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const base = plain ? Math.max(0, value - 40) : 0;
    let raf = 0;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      // Starts the count as the number scrolls in (its section fades in at the same moment).
      setShown(base);
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 4);
        setShown(Math.round(base + (value - base) * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, durationMs, plain]);

  return (
    <span ref={ref} className="tabular-nums">
      {plain ? shown : shown.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
