/* Pure-SVG chart primitives — no external library */

/* ─── Sparkline ───────────────────────────────────────── */
export function Sparkline({
  data, color = "#0EA5E9", width = 120, height = 40, strokeWidth = 2,
}: {
  data: number[]; color?: string; width?: number; height?: number; strokeWidth?: number;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = strokeWidth;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const pts = data.map((v, i) => [
    pad + (i / (data.length - 1)) * w,
    pad + (1 - (v - min) / range) * h,
  ]);

  const line    = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area    = `${line} L${pts[pts.length - 1][0].toFixed(1)},${(pad + h).toFixed(1)} L${pts[0][0].toFixed(1)},${(pad + h).toFixed(1)} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace("#","")})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Bar chart (vertical) ────────────────────────────── */
export function BarChart({
  data, color = "#0EA5E9", width = 160, height = 60, gap = 4,
}: {
  data: number[]; color?: string; width?: number; height?: number; gap?: number;
}) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const bw  = (width - gap * (data.length - 1)) / data.length;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {data.map((v, i) => {
        const bh = Math.max(2, (v / max) * height);
        return (
          <rect
            key={i}
            x={(bw + gap) * i}
            y={height - bh}
            width={bw}
            height={bh}
            rx={Math.min(bw / 2, 4)}
            fill={color}
            opacity={i === data.length - 1 ? 1 : 0.5}
          />
        );
      })}
    </svg>
  );
}

/* ─── Line chart (multi-day trend) ───────────────────────*/
export function LineChart({
  data, color = "#0EA5E9", width = 600, height = 160,
}: {
  data: { label: string; value: number }[]; color?: string; width?: number; height?: number;
}) {
  if (data.length < 2) return null;
  const values = data.map(d => d.value);
  const min  = Math.min(...values);
  const max  = Math.max(...values);
  const range = max - min || 1;
  const padX = 8, padY = 12;
  const w = width  - padX * 2;
  const h = height - padY * 2;

  const pts = data.map((d, i) => [
    padX + (i / (data.length - 1)) * w,
    padY + (1 - (d.value - min) / range) * h,
  ]);

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length-1][0].toFixed(1)},${(padY+h).toFixed(1)} L${pts[0][0].toFixed(1)},${(padY+h).toFixed(1)} Z`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Horizontal guide lines */}
      {[0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} x1={padX} y1={padY + f * h} x2={width - padX} y2={padY + f * h}
          stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4,4" />
      ))}
      <path d={area} fill="url(#lc-fill)" />
      <path d={line} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r={4} fill={color} />
    </svg>
  );
}
