/**
 * The grainy 3D ribbon: the site's "continuity" thread.
 *
 * Built as a stack of strokes along one path, so it reads as a tube:
 *   1. a soft blurred shadow cast on the page below it,
 *   2. the gradient body with fractal-noise grain,
 *   3. a darker band along the underside,
 *   4. a bright band and a thin specular line along the top,
 *   5. the editor-style centre line with nodes,
 *   6. a glint of light that travels along it, forever.
 * It draws itself in on load (pathLength + dash animation), sits behind
 * content, and is hidden from assistive tech.
 *
 * `id` must be unique per page: it namespaces the SVG gradient and filters.
 */

type RibbonProps = {
  id: string;
  d: string;
  viewBox: string;
  className?: string;
  from?: string;
  to?: string;
  width?: number;
  /** Points (in viewBox units) to mark with nodes on the centre line. */
  nodes?: [number, number][];
  delayMs?: number;
  /** The travelling highlight. On by default. */
  glint?: boolean;
};

export function Ribbon({
  id,
  d,
  viewBox,
  className = "",
  from = "var(--lilac)",
  to = "var(--volt)",
  width = 46,
  nodes = [],
  delayMs = 200,
  glint = true,
}: RibbonProps) {
  const draw = (ms: number) => ({
    strokeDasharray: 1,
    strokeDashoffset: 1,
    animation: `draw 2.6s cubic-bezier(0.65, 0, 0.35, 1) ${ms}ms forwards`,
  });

  return (
    <svg aria-hidden="true" viewBox={viewBox} className={className} fill="none" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={from} />
          <stop offset="55%" stopColor={from} stopOpacity="0.95" />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <filter id={`${id}-grain`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
          <feComposite in="mono" in2="SourceGraphic" operator="in" result="grain" />
          <feBlend in="SourceGraphic" in2="grain" mode="overlay" />
        </filter>
        <filter id={`${id}-shadow`} x="-10%" y="-30%" width="120%" height="160%">
          <feGaussianBlur stdDeviation={width * 0.45} />
        </filter>
        <filter id={`${id}-soft`} x="-10%" y="-30%" width="120%" height="160%">
          <feGaussianBlur stdDeviation={width * 0.12} />
        </filter>
        {/* Clip the shading bands to the body, so they never spill past its edges. */}
        <mask id={`${id}-body`} maskUnits="userSpaceOnUse">
          <path d={d} stroke="white" strokeWidth={width} strokeLinecap="round" />
        </mask>
      </defs>

      {/* 1. Cast shadow */}
      <path
        className="ribbon-path"
        d={d}
        pathLength={1}
        stroke="black"
        strokeOpacity="0.55"
        strokeWidth={width * 1.1}
        strokeLinecap="round"
        transform={`translate(0 ${width * 0.55})`}
        filter={`url(#${id}-shadow)`}
        style={draw(delayMs)}
      />

      <g filter={`url(#${id}-grain)`}>
        {/* 2. Body */}
        <path className="ribbon-path" d={d} pathLength={1} stroke={`url(#${id}-g)`} strokeWidth={width} strokeLinecap="round" style={draw(delayMs)} />
        <g mask={`url(#${id}-body)`}>
          {/* 3. Underside shade */}
          <path
            className="ribbon-path"
            d={d}
            pathLength={1}
            stroke="#060a0a"
            strokeOpacity="0.38"
            strokeWidth={width * 0.7}
            strokeLinecap="round"
            transform={`translate(0 ${width * 0.42})`}
            filter={`url(#${id}-soft)`}
            style={draw(delayMs + 40)}
          />
          {/* 4. Top light */}
          <path
            className="ribbon-path"
            d={d}
            pathLength={1}
            stroke="white"
            strokeOpacity="0.32"
            strokeWidth={width * 0.34}
            strokeLinecap="round"
            transform={`translate(0 ${-width * 0.24})`}
            filter={`url(#${id}-soft)`}
            style={draw(delayMs + 60)}
          />
          <path
            className="ribbon-path"
            d={d}
            pathLength={1}
            stroke="white"
            strokeOpacity="0.55"
            strokeWidth={Math.max(1.5, width * 0.05)}
            strokeLinecap="round"
            transform={`translate(0 ${-width * 0.3})`}
            style={draw(delayMs + 80)}
          />
        </g>
      </g>

      {/* 5. Centre line and nodes, like a path in an editor */}
      <path className="ribbon-path" d={d} pathLength={1} stroke="white" strokeOpacity="0.8" strokeWidth={1.5} style={draw(delayMs + 140)} />
      {nodes.map(([x, y], i) => (
        <g key={i} style={{ opacity: 0, animation: `rise 0.6s ease-out ${delayMs + 900 + i * 180}ms forwards` }}>
          <circle cx={x} cy={y} r={11} fill="white" fillOpacity="0.18" />
          <circle cx={x} cy={y} r={6} fill="white" />
        </g>
      ))}

      {/* 6. Travelling glint */}
      {glint ? (
        <path
          className="ribbon-glint"
          d={d}
          pathLength={1}
          stroke="white"
          strokeOpacity="0.7"
          strokeWidth={width * 0.5}
          strokeLinecap="round"
          filter={`url(#${id}-soft)`}
          mask={`url(#${id}-body)`}
          style={{
            strokeDasharray: "0.07 1",
            strokeDashoffset: 0.07,
            animation: `glint 6.5s cubic-bezier(0.45, 0, 0.55, 1) ${delayMs + 2600}ms infinite`,
          }}
        />
      ) : null}
    </svg>
  );
}
