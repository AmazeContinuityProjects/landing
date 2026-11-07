"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Teammate cursors inside the hero illustration, as if the scene were being
 * designed live.
 *
 * They live in the illustration, not on the screen: positioned within the
 * hero's stage, they move only between its pieces (elements marked
 * `data-collab-target`), scroll away with it, and never cross the headline,
 * copy or buttons. Decorative only: labelled by role (no real person appears
 * "online"), no pointer events, hidden from assistive tech, wide screens with
 * motion allowed, and paused while the hero is off screen.
 */

type Persona = { name: string; color: string; ink: string; lines: string[] };

const PEOPLE: Persona[] = [
  { name: "Design", color: "#edcbff", ink: "#2b1440", lines: ["love this ribbon ✨", "more grain?", "pixel-perfect"] },
  { name: "Frontend", color: "#9df5b4", ink: "#0b2b16", lines: ["shipped 🚀", "3× faster now", "PR's up"] },
  { name: "Backend", color: "#8fd3ff", ink: "#08243a", lines: ["API is up ✅", "cache is warm", "tests passing 🟢"] },
];

type Point = { x: number; y: number };
type Mover = { pos: Point; from: Point; ctrl: Point; to: Point; start: number; dur: number; restUntil: number; bubbleUntil: number; line: number };

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function Arrow({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden>
      <path d="M2 1l11 6-5 1.5L6 14z" fill={color} stroke="#060a0a" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}

export function CollaboratorCursors() {
  const [enabled, setEnabled] = useState(false);
  const box = useRef<HTMLDivElement | null>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const bubbles = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 900px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(wide.matches && !calm.matches);
    update();
    wide.addEventListener("change", update);
    calm.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      calm.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const container = box.current;
    if (!enabled || !container) return;
    const stage = container.parentElement;
    if (!stage) return;

    /** A point on one of the illustration's pieces, in the stage's coordinates. */
    const pickTarget = (avoid: Point): Point => {
      const s = stage.getBoundingClientRect();
      const pieces = [...stage.querySelectorAll<HTMLElement>("[data-collab-target]")]
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.width > 0 && r.height > 0);
      for (let tries = 0; tries < 6; tries++) {
        const r = pieces[Math.floor(Math.random() * pieces.length)];
        if (!r) break;
        const p = {
          x: rand(r.left + r.width * 0.25, r.left + r.width * 0.85) - s.left,
          y: rand(r.top + r.height * 0.35, r.top + r.height * 0.9) - s.top,
        };
        if (Math.hypot(p.x - avoid.x, p.y - avoid.y) > 120) return p;
      }
      return { x: rand(s.width * 0.15, s.width * 0.85), y: rand(s.height * 0.3, s.height * 0.8) };
    };

    const now = performance.now();
    const movers: Mover[] = PEOPLE.map((_, i) => {
      const start = pickTarget({ x: -999, y: -999 });
      return { pos: { ...start }, from: start, ctrl: start, to: start, start: now, dur: 1, restUntil: now + 1800 + i * 1500, bubbleUntil: 0, line: -1 };
    });

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(stage);

    const tick = (t: number) => {
      raf = 0;
      if (!visible) return; // Off screen: stop until the observer brings it back.
      movers.forEach((m, i) => {
        const el = els.current[i];
        if (!el) return;
        const k = Math.min(1, (t - m.start) / m.dur);
        if (k < 1) {
          const e = ease(k);
          const u = 1 - e;
          m.pos.x = u * u * m.from.x + 2 * u * e * m.ctrl.x + e * e * m.to.x;
          m.pos.y = u * u * m.from.y + 2 * u * e * m.ctrl.y + e * e * m.to.y;
        } else if (t > m.restUntil) {
          m.from = { ...m.pos };
          m.to = pickTarget(m.pos);
          const mid = { x: (m.from.x + m.to.x) / 2, y: (m.from.y + m.to.y) / 2 };
          const bend = rand(-0.3, 0.3);
          m.ctrl = { x: mid.x - (m.to.y - m.from.y) * bend, y: mid.y + (m.to.x - m.from.x) * bend };
          m.start = t;
          m.dur = Math.min(2400, 800 + Math.hypot(m.to.x - m.from.x, m.to.y - m.from.y) * 1.8);
          m.restUntil = t + m.dur + rand(1800, 4500);
          if (Math.random() < 0.3) {
            m.line = (m.line + 1 + Math.floor(Math.random() * 2)) % PEOPLE[i].lines.length;
            const b = bubbles.current[i];
            if (b) b.textContent = PEOPLE[i].lines[m.line];
            m.bubbleUntil = t + m.dur + 2400;
          }
        }
        el.style.transform = `translate3d(${m.pos.x}px, ${m.pos.y}px, 0)`;
        const b = bubbles.current[i];
        if (b) {
          const talking = t < m.bubbleUntil && t > m.start + m.dur;
          b.style.opacity = talking ? "1" : "0";
          b.style.transform = talking ? "translateY(0) scale(1)" : "translateY(4px) scale(0.92)";
        }
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  return (
    <div ref={box} aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden min-[900px]:block">
      {enabled
        ? PEOPLE.map((p, i) => (
            <div
              key={p.name}
              ref={(el) => {
                els.current[i] = el;
              }}
              className="absolute left-0 top-0 will-change-transform"
              style={{ transform: "translate3d(-100px, -100px, 0)" }}
            >
              <Arrow color={p.color} />
              <span className="absolute left-3.5 top-4 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-lg" style={{ background: p.color, color: p.ink }}>
                {p.name}
              </span>
              <span
                ref={(el) => {
                  bubbles.current[i] = el;
                }}
                className="absolute left-3.5 top-10 whitespace-nowrap rounded-2xl rounded-tl-sm border border-white/15 bg-ink-2/90 px-2.5 py-1 text-[11px] text-white shadow-xl transition-[opacity,transform] duration-300"
                style={{ opacity: 0, transformOrigin: "top left" }}
              />
            </div>
          ))
        : null}
    </div>
  );
}
