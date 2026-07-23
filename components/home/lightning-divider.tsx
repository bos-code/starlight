/**
 * The fracture that separates the hero's Starlite and INGCO zones. It lives inside
 * a fixed-width band between two ordinary (non-clipped) content columns — the
 * jaggedness is purely decorative, so it can never collide with or clip real
 * content, at any viewport width.
 */

export interface FracturePoint {
  x: number;
  y: number;
}

// Percentages within the band's own box. Oscillates across the full band width so
// it reads as a real fracture, not a straight line — irregular, not diagonal.
export const verticalFracturePoints: FracturePoint[] = [
  { x: 50, y: 0 },
  { x: 78, y: 7 },
  { x: 28, y: 15 },
  { x: 70, y: 25 },
  { x: 20, y: 34 },
  { x: 65, y: 45 },
  { x: 30, y: 55 },
  { x: 75, y: 65 },
  { x: 25, y: 75 },
  { x: 68, y: 86 },
  { x: 35, y: 94 },
  { x: 52, y: 100 },
];

export const horizontalFracturePoints: FracturePoint[] = [
  { x: 0, y: 50 },
  { x: 7, y: 22 },
  { x: 15, y: 78 },
  { x: 25, y: 30 },
  { x: 34, y: 75 },
  { x: 45, y: 20 },
  { x: 55, y: 80 },
  { x: 65, y: 25 },
  { x: 75, y: 70 },
  { x: 86, y: 28 },
  { x: 100, y: 50 },
];

function toPathD(points: FracturePoint[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
}

// Short branch stubs departing from a couple of points, allowed to poke slightly
// past the band's own edges (0/100) into the neighbouring content column.
const verticalBranches: [FracturePoint, FracturePoint][] = [
  [{ x: 70, y: 25 }, { x: 108, y: 20 }],
  [{ x: 20, y: 34 }, { x: -14, y: 30 }],
  [{ x: 68, y: 86 }, { x: 100, y: 90 }],
];

const sparkIndices = [3, 6, 9];

export function LightningDivider({
  orientation = "vertical",
  className = "",
}: {
  orientation?: "vertical" | "horizontal";
  className?: string;
}) {
  const points = orientation === "vertical" ? verticalFracturePoints : horizontalFracturePoints;
  const branches = orientation === "vertical" ? verticalBranches : [];
  const pathD = toPathD(points);
  const glowId = orientation === "vertical" ? "fracture-glow-v" : "fracture-glow-h";

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`}
      aria-hidden="true"
    >
      <defs>
        <filter id={glowId} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft warm glow beneath the crack */}
      <path
        d={pathD}
        vectorEffect="non-scaling-stroke"
        fill="none"
        stroke="var(--color-orange)"
        strokeWidth={6}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.4}
        filter={`url(#${glowId})`}
        className="animate-fracture-pulse"
      />

      {/* Branch stubs */}
      {branches.map(([from, to], i) => (
        <line
          key={i}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          vectorEffect="non-scaling-stroke"
          stroke="var(--color-orange)"
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
      ))}

      {/* Crisp core crack line */}
      <path
        d={pathD}
        vectorEffect="non-scaling-stroke"
        fill="none"
        stroke="var(--color-white)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.9}
      />

      {/* Thin sparks along the seam */}
      {sparkIndices
        .filter((i) => i < points.length)
        .map((i, idx) => (
          <circle
            key={i}
            cx={points[i].x}
            cy={points[i].y}
            r={1.1}
            fill="var(--color-orange)"
            className="animate-spark-flicker"
            style={{ animationDelay: `${idx * 0.6}s` }}
          />
        ))}
    </svg>
  );
}
