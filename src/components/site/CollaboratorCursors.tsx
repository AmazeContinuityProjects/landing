"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ambient multiplayer cursors, as if teammates were in the same file.
 *
 * Purely decorative: they're labelled by role (not real people, so nobody
 * appears "online" who isn't), never take clicks, and are hidden from
 * assistive tech. Each one glides along a gentle curve to something visible on
 * screen, pauses as if reading, and now and then says something in a
 * cursor-chat bubble. Targets are picked from what's in the viewport, so they
 * follow you as you scroll.
 *
 * Shown on wide screens with motion allowed; driven by refs and one rAF loop.
 */

type Persona = { name: string; color: string; ink: string; lines: string[] };

const PEOPLE: Persona[] = [
  { name: "Design", color: "#edcbff", ink: "#2b1440", lines: ["love this ribbon ✨", "a touch more grain?", "pixel-perfect", "this gradient though"] },
  { name: "Frontend", color: "#9df5b4", ink: "#0b2b16", lines: ["shipped 🚀", "3× faster now", "looks great on mobile", "PR's up for review"] },
  { name: "Backend", color: "#8fd3ff", ink: "#08243a", lines: ["API is up ✅", "cache is warm", "215 routes and counting", "tests passing 🟢"] },
];

/** Things worth "looking at". */
const TARGETS = "h1, h2, h3, [data-cursor], .glass, .holo, .holo-plate, li";

type Point = { x: number; y: number };
type Mover = {
  pos: Point;
  from: Point;
  ctrl: Point;
  to: Point;
  start: number;
  dur: number;
  restUntil: number;
  bubbleUntil: number;
  lastLine: number;
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** A random point inside something visible, kept away from the edges. */
function pickTarget(): Point {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pad = 80;
  const candidates = [...document.querySelectorAll<HTMLElement>(TARGETS)]
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.width > 40 && r.height > 16 && r.top > pad && r.bottom < vh - pad / 2 && r.left > 0 && r.right < vw);
  if (!candidates.length) return { x: rand(pad, vw - pad), y: rand(pad * 1.5, vh - pad) };
  const r = candidates[Math.floor(Math.random() * candidates.length)];
  return { x: rand(r.left + r.width * 0.2, r.left + r.width * 0.8), y: rand(r.top + r.height * 0.3, r.top + r.height * 0.8) };
}

function Arrow({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden>
      <path d="M2 1l11 6-5 1.5L6 14z" fill={color} stroke="#060a0a" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}

export function CollaboratorCursors() {
  const [enabled, setEnabled] = useState(false);
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
    if (!enabled) return;
    const now = performance.now();
    const movers: Mover[] = PEOPLE.map((_, i) => {
      const start = { x: rand(window.innerWidth * 0.2, window.innerWidth * 0.8), y: window.innerHeight + 40 };
      // Stagger arrivals after the hero has drawn in.
      return { pos: { ...start }, from: start, ctrl: start, to: start, start: now, dur: 1, restUntil: now + 2600 + i * 1400, bubbleUntil: 0, lastLine: -1 };
    });
    let raf = 0;

    const tick = (t: number) => {
      movers.forEach((m, i) => {
        const el = els.current[i];
        if (!el) return;
        const k = Math.min(1, (t - m.start) / m.dur);
        if (k < 1) {
          // Quadratic Bézier from → ctrl → to, eased: a hand-drawn arc, not a straight line.
          const e = ease(k);
          const u = 1 - e;
          m.pos.x = u * u * m.from.x + 2 * u * e * m.ctrl.x + e * e * m.to.x;
          m.pos.y = u * u * m.from.y + 2 * u * e * m.ctrl.y + e * e * m.to.y;
        } else if (t > m.restUntil) {
          // Next destination.
          m.from = { ...m.pos };
          m.to = pickTarget();
          const mid = { x: (m.from.x + m.to.x) / 2, y: (m.from.y + m.to.y) / 2 };
          const bend = rand(-0.35, 0.35);
          m.ctrl = { x: mid.x - (m.to.y - m.from.y) * bend, y: mid.y + (m.to.x - m.from.x) * bend };
          m.start = t;
          m.dur = Math.min(2600, 700 + Math.hypot(m.to.x - m.from.x, m.to.y - m.from.y) * 1.6);
          m.restUntil = t + m.dur + rand(1400, 4200);
          // Sometimes say something on arrival.
          if (Math.random() < 0.35) {
            let line = Math.floor(Math.random() * PEOPLE[i].lines.length);
            if (line === m.lastLine) line = (line + 1) % PEOPLE[i].lines.length;
            m.lastLine = line;
            const b = bubbles.current[i];
            if (b) b.textContent = PEOPLE[i].lines[line];
            m.bubbleUntil = t + m.dur + 2600;
          }
        } else {
          // Resting: a tiny idle drift, like a hand on a trackpad.
          m.pos.x += Math.sin(t / 700 + i) * 0.08;
          m.pos.y += Math.cos(t / 900 + i * 2) * 0.06;
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
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[75] overflow-hidden">
      {PEOPLE.map((p, i) => (
        <div
          key={p.name}
          ref={(el) => {
            els.current[i] = el;
          }}
          className="absolute left-0 top-0 will-change-transform"
          style={{ transform: "translate3d(-100px, -100px, 0)" }}
        >
          <Arrow color={p.color} />
          <span
            className="absolute left-4 top-5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold shadow-lg"
            style={{ background: p.color, color: p.ink }}
          >
            {p.name}
          </span>
          {/* Cursor chat */}
          <span
            ref={(el) => {
              bubbles.current[i] = el;
            }}
            className="absolute left-4 top-11 whitespace-nowrap rounded-2xl rounded-tl-sm border border-white/15 bg-ink-2/90 px-3 py-1.5 text-xs text-white shadow-xl backdrop-blur transition-[opacity,transform] duration-300"
            style={{ opacity: 0, transformOrigin: "top left" }}
          />
        </div>
      ))}
    </div>
  );
}
