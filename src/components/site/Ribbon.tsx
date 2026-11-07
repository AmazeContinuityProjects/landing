/**
 * The grainy 3D ribbon: the site's "continuity" thread.
 *
 * A thick gradient stroke with fractal-noise grain blended in, a soft highlight
 * for depth, and a thin centre line with nodes. It draws itself in on load
 * (pathLength + dash animation) and sits behind content (aria-hidden).
 *
 * `id` must be unique per page: it namespaces the SVG gradient and filter.
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
}: RibbonProps) {
  const anim = (ms: number) => ({
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
      </defs>

      <g filter={`url(#${id}-grain)`}>
        <path
          className="ribbon-path"
          d={d}
          pathLength={1}
          stroke={`url(#${id}-g)`}
          strokeWidth={width}
          strokeLinecap="round"
          style={anim(delayMs)}
        />
        {/* Highlight along the upper edge, so the stroke reads as a tube. */}
        <path
          className="ribbon-path"
          d={d}
          pathLength={1}
          stroke="white"
          strokeOpacity="0.28"
          strokeWidth={width * 0.28}
          strokeLinecap="round"
          transform={`translate(0 ${-width * 0.2})`}
          style={anim(delayMs + 60)}
        />
      </g>
      {/* The thin centre line, like a path in an editor. */}
      <path
        className="ribbon-path"
        d={d}
        pathLength={1}
        stroke="white"
        strokeOpacity="0.8"
        strokeWidth={1.5}
        style={anim(delayMs + 140)}
      />
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={6}
          fill="white"
          style={{ opacity: 0, animation: `rise 0.6s ease-out ${delayMs + 900 + i * 180}ms forwards` }}
        />
      ))}
    </svg>
  );
}
