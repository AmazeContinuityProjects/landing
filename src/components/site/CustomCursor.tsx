"use client";

import { useEffect, useRef, useState } from "react";

const TRAIL = 4;

/** The arrow, as in the hero fragment: electric blue with a white edge. */
function Arrow({ ghost = false }: { ghost?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M2 1l11 6-5 1.5L6 14z"
        fill={ghost ? "none" : "var(--volt)"}
        stroke="white"
        strokeWidth={ghost ? 1.1 : 1.2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * A custom cursor: an arrow trailing ghost arrows, like a multiplayer cursor in
 * a design tool.
 *
 * - Only for fine pointers (mouse and trackpad) and when motion is allowed;
 *   touch devices and reduced-motion users keep the system cursor.
 * - Grows and turns mint over links and buttons. Elements with
 *   `data-cursor="Label"` show that label in a pill beside it.
 * - Text fields get the normal text cursor back.
 * - Driven by refs and one rAF loop, so moving the mouse never re-renders React.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const root = useRef<HTMLDivElement | null>(null);
  const head = useRef<HTMLDivElement | null>(null);
  const label = useRef<HTMLSpanElement | null>(null);
  const ghosts = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !calm.matches);
    update();
    fine.addEventListener("change", update);
    calm.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      calm.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    const target = { x: -100, y: -100 };
    const points = Array.from({ length: TRAIL + 1 }, () => ({ x: -100, y: -100 }));
    let visible = false;
    let hovering = false;
    let pressed = false;
    let raf = 0;

    const setVisible = (v: boolean) => {
      visible = v;
      if (root.current) root.current.style.opacity = v ? "1" : "0";
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        points.forEach((p) => ((p.x = e.clientX), (p.y = e.clientY)));
        setVisible(true);
      }
      const el = e.target instanceof Element ? e.target : null;
      const typing = el?.closest("input, textarea, select, [contenteditable='true']");
      if (typing) {
        setVisible(false);
        return;
      }
      const interactive = el?.closest<HTMLElement>("a, button, [role='button'], label, summary, [data-cursor]");
      hovering = Boolean(interactive);
      const text = interactive?.dataset.cursor ?? "";
      if (label.current) {
        label.current.textContent = text;
        label.current.style.opacity = text ? "1" : "0";
        label.current.style.transform = text ? "translate(18px, 14px) scale(1)" : "translate(18px, 14px) scale(0.6)";
      }
      if (head.current) head.current.dataset.hover = hovering ? "true" : "false";
    };
    const onDown = () => (pressed = true);
    const onUp = () => (pressed = false);
    const onLeave = () => setVisible(false);

    const tick = () => {
      // The head eases quickly toward the mouse; each ghost follows the one before it.
      points[0].x += (target.x - points[0].x) * 0.55;
      points[0].y += (target.y - points[0].y) * 0.55;
      for (let i = 1; i < points.length; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * 0.32;
        points[i].y += (points[i - 1].y - points[i].y) * 0.32;
      }
      const scale = pressed ? 0.82 : hovering ? 1.25 : 1;
      if (head.current) head.current.style.transform = `translate3d(${points[0].x}px, ${points[0].y}px, 0) scale(${scale})`;
      ghosts.current.forEach((g, i) => {
        if (!g) return;
        const p = points[i + 1];
        // Ghosts only show while moving, so a resting cursor is one clean arrow.
        const spread = Math.hypot(points[0].x - p.x, points[0].y - p.y);
        g.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        g.style.opacity = String(Math.min(1, spread / 24) * (0.55 - i * 0.12));
      });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-[80] opacity-0 transition-opacity duration-200">
      {Array.from({ length: TRAIL }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            ghosts.current[i] = el;
          }}
          className="absolute left-0 top-0 -ml-[3px] -mt-[2px] will-change-transform"
          style={{ opacity: 0 }}
        >
          <Arrow ghost />
        </div>
      ))}
      <div ref={head} data-hover="false" className="cursor-head absolute left-0 top-0 -ml-[3px] -mt-[2px] will-change-transform">
        <Arrow />
        <span
          ref={label}
          className="absolute left-0 top-0 whitespace-nowrap rounded-full bg-[var(--volt)] px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-[opacity,transform] duration-200"
          style={{ transform: "translate(18px, 14px) scale(0.6)", transformOrigin: "top left" }}
        />
      </div>
    </div>
  );
}
