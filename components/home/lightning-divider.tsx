/**
 * The fracture that splits the hero into its Starlite and INGCO zones. Deliberately
 * irregular (not a straight diagonal) so it reads as energy breaking through the
 * interface rather than a plain CSS split. The same point set drives both this SVG
 * overlay and the clip-path polygons in dual-brand-hero.tsx, so the glow always sits
 * exactly on the seam between the two zones.
 */

export interface FracturePoint {
  x: number;
  y: number;
}

// Percentages within the hero box. Biased toward ~65% so the Starlite zone reads as
// the larger side, but irregular enough that it never looks like a straight cut.
export const verticalFracturePoints: FracturePoint[] = [
  { x: 65, y: 0 },
  { x: 73, y: 6 },
  { x: 60, y: 14 },
  { x: 71, y: 24 },
  { x: 57, y: 33 },
  { x: 69, y: 44 },
  { x: 59, y: 54 },
  { x: 72, y: 64 },
  { x: 61, y: 74 },
  { x: 70, y: 85 },
  { x: 62, y: 93 },
  { x: 67, y: 100 },
];

export const horizontalFracturePoints: FracturePoint[] = [
  { x: 0, y: 50 },
  { x: 8, y: 32 },
  { x: 18, y: 62 },
  { x: 28, y: 38 },
  { x: 38, y: 60 },
  { x: 50, y: 36 },
  { x: 62, y: 62 },
  { x: 72, y: 40 },
  { x: 82, y: 60 },
  { x: 92, y: 38 },
  { x: 100, y: 50 },
];

function toPathD(points: FracturePoint[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
}

export function getVerticalClipPolygons(): { left: string; right: string } {
  const forward = verticalFracturePoints.map((p) => `${p.x}% ${p.y}%`);
  const left = ["0% 0%", ...forward, "0% 100%"].join(", ");
  const right = [...forward, "100% 100%", "100% 0%"].join(", ");
  return { left, right };
}

export function getHorizontalClipPolygons(): { top: string; bottom: string } {
  const forward = horizontalFracturePoints.map((p) => `${p.x}% ${p.y}%`);
  const top = ["0% 0%", ...forward, "100% 0%"].join(", ");
  const bottom = [...forward, "100% 100%", "0% 100%"].join(", ");
  return { top, bottom };
}

// Short branch stubs departing from a couple of points along the main crack.
const verticalBranches: [FracturePoint, FracturePoint][] = [
  [{ x: 71, y: 24 }, { x: 82, y: 19 }],
  [{ x: 59, y: 54 }, { x: 47, y: 50 }],
  [{ x: 70, y: 85 }, { x: 80, y: 89 }],
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
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
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
        strokeWidth={5}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.35}
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
        strokeWidth={1.25}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.85}
      />

      {/* Thin sparks along the seam */}
      {sparkIndices
        .filter((i) => i < points.length)
        .map((i, idx) => (
          <circle
            key={i}
            cx={points[i].x}
            cy={points[i].y}
            r={0.6}
            fill="var(--color-orange)"
            className="animate-spark-flicker"
            style={{ animationDelay: `${idx * 0.6}s` }}
          />
        ))}
    </svg>
  );
}
