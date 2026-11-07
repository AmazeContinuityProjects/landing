"use client";

import { useEffect, useRef, useState } from "react";

/** Ghost arrows in the motion trail. */
const GHOSTS = 4;
/** How far back in time each successive ghost sits, in ms. */
const GHOST_SPACING_MS = 26;
/** Skip the selection frame on elements bigger than this (full-width blocks). */
const MAX_FRAME = { w: 640, h: 320 };
/** Breathing room between an element and its selection frame, in px. */
const FRAME_PAD = 6;

const INTERACTIVE = "a, button, [role='button'], label, summary, [data-cursor]";
const TYPING = "input, textarea, [contenteditable='true'], iframe";

/** The arrow, as in the hero fragment: electric blue with a white edge. Tip at (3, 2). */
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

type Sample = { x: number; y: number; t: number };

/** Where the pointer was `ago` ms before the newest sample, interpolated. */
function sampleAt(history: Sample[], ago: number): Sample {
  const newest = history[history.length - 1];
  const when = newest.t - ago;
  for (let i = history.length - 1; i > 0; i--) {
    const a = history[i - 1];
    const b = history[i];
    if (a.t <= when) {
      const k = b.t === a.t ? 0 : (when - a.t) / (b.t - a.t);
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, t: when };
    }
  }
  return history[0];
}

/**
 * A design-tool cursor.
 *
 * - The arrow tip sits exactly on the pointer every frame (no easing lag).
 * - A trail of ghost arrows replays the pointer's recent path, spaced in time
 *   rather than per frame, so it looks the same at 60 and 120 Hz and vanishes
 *   when the pointer rests.
 * - Hovering a link or button snaps a selection frame with corner handles
 *   around it, like selecting a layer in Figma. `data-cursor="Label"` names
 *   the layer. The frame glides between elements and tracks them on scroll.
 * - A click leaves a ripple. Text fields and iframes get the system cursor.
 * - Only for fine pointers with motion allowed; driven by refs and one rAF
 *   loop, so moving the mouse never re-renders React.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const root = useRef<HTMLDivElement | null>(null);
  const head = useRef<HTMLDivElement | null>(null);
  const frame = useRef<HTMLDivElement | null>(null);
  const tag = useRef<HTMLSpanElement | null>(null);
  const ripple = useRef<HTMLSpanElement | null>(null);
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

    const pointer = { x: -100, y: -100 };
    const history: Sample[] = [{ x: -100, y: -100, t: performance.now() }];
    // The frame's drawn rect eases toward the hovered element's live rect.
    const box = { x: 0, y: 0, w: 0, h: 0, a: 0 };
    let hovered: HTMLElement | null = null;
    let shown = false;
    let pressed = false;
    let last = performance.now();
    let raf = 0;

    const show = (v: boolean) => {
      if (shown === v) return;
      shown = v;
      if (root.current) root.current.style.opacity = v ? "1" : "0";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!shown) {
        // Arriving: start the trail where the pointer is, so it doesn't streak in from a corner.
        history.length = 0;
        history.push({ x: pointer.x, y: pointer.y, t: performance.now() });
      }
      updateHover(e.target instanceof Element ? e.target : null);
    };

    // Shared by pointer moves and scrolls: a scroll moves the page under a still pointer.
    const updateHover = (el: Element | null) => {
      if (el?.closest(TYPING)) {
        show(false);
        hovered = null;
        return;
      }
      show(true);
      const next = el?.closest<HTMLElement>(INTERACTIVE) ?? null;
      if (next !== hovered) {
        if (!hovered && next) {
          // Snap the frame onto the first element instead of growing from 0×0.
          const r = next.getBoundingClientRect();
          Object.assign(box, { x: r.left - FRAME_PAD, y: r.top - FRAME_PAD, w: r.width + FRAME_PAD * 2, h: r.height + FRAME_PAD * 2 });
        }
        hovered = next;
        const label = next?.dataset.cursor ?? "";
        if (tag.current) {
          tag.current.textContent = label;
          tag.current.style.display = label ? "block" : "none";
        }
        head.current?.setAttribute("data-hover", next ? "true" : "false");
      }
    };

    const onScroll = () => {
      if (shown) updateHover(document.elementFromPoint(pointer.x, pointer.y));
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pressed = true;
      const r = ripple.current;
      if (r) {
        r.style.left = `${e.clientX}px`;
        r.style.top = `${e.clientY}px`;
        // Restart the CSS animation on every click.
        r.classList.remove("cursor-ripple-run");
        void r.offsetWidth;
        r.classList.add("cursor-ripple-run");
      }
    };
    const onUp = () => (pressed = false);
    const onLeave = () => {
      show(false);
      hovered = null;
    };

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;

      // History for the trail: keep ~200 ms of samples.
      history.push({ x: pointer.x, y: pointer.y, t: now });
      while (history.length > 2 && now - history[0].t > GHOST_SPACING_MS * (GHOSTS + 2)) history.shift();

      const scale = pressed ? 0.82 : hovered ? 1.15 : 1;
      if (head.current) head.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) scale(${scale})`;

      ghosts.current.forEach((g, i) => {
        if (!g) return;
        const p = sampleAt(history, (i + 1) * GHOST_SPACING_MS);
        const dist = Math.hypot(pointer.x - p.x, pointer.y - p.y);
        g.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        // Ghosts appear with speed and stay clear of the arrow itself.
        g.style.opacity = String(Math.min(1, Math.max(0, (dist - 8) / 30)) * (0.6 - i * 0.12));
      });

      // Selection frame: ease toward the hovered element's live rect (tracks scrolling and layout).
      const f = frame.current;
      if (f) {
        const r = hovered?.getBoundingClientRect();
        const fits = r && r.width <= MAX_FRAME.w && r.height <= MAX_FRAME.h && r.width > 0;
        const k = 1 - Math.exp(-dt / 70);
        if (r && fits) {
          box.x += (r.left - FRAME_PAD - box.x) * k;
          box.y += (r.top - FRAME_PAD - box.y) * k;
          box.w += (r.width + FRAME_PAD * 2 - box.w) * k;
          box.h += (r.height + FRAME_PAD * 2 - box.h) * k;
        }
        box.a += ((fits ? 1 : 0) - box.a) * (1 - Math.exp(-dt / 90));
        f.style.transform = `translate3d(${box.x}px, ${box.y}px, 0)`;
        f.style.width = `${box.w}px`;
        f.style.height = `${box.h}px`;
        f.style.opacity = String(box.a);
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("scroll", onScroll, { capture: true });
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-[80] opacity-0 transition-opacity duration-200">
      {/* Selection frame with corner handles and a layer-name tag */}
      <div ref={frame} className="cursor-frame absolute left-0 top-0 rounded-[10px] will-change-transform" style={{ opacity: 0 }}>
        {["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"].map((pos) => (
          <span key={pos} className={`absolute ${pos} h-2 w-2 rounded-[2px] border border-[var(--volt)] bg-white`} />
        ))}
        <span
          ref={tag}
          className="absolute -top-6 left-0 hidden whitespace-nowrap rounded-md bg-[var(--volt)] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white shadow-lg"
        />
      </div>

      {Array.from({ length: GHOSTS }, (_, i) => (
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

      <span ref={ripple} className="cursor-ripple absolute h-10 w-10 rounded-full border-2 border-[var(--mint)] opacity-0" />

      {/* The head: translate puts the arrow tip (3px, 2px into the SVG) on the pointer. */}
      <div ref={head} data-hover="false" className="cursor-head absolute left-0 top-0 -ml-[3px] -mt-[2px] origin-[3px_2px] will-change-transform">
        <Arrow />
      </div>
    </div>
  );
}
