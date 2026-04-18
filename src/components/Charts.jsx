import { C } from '../lib/constants';

export function RadarChart({ data, size = 200 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const n = data.length;
  const angle = (i) => (i * 2 * Math.PI / n) - Math.PI / 2;
  const pt = (i, pct) => ({
    x: cx + r * pct * Math.cos(angle(i)),
    y: cy + r * pct * Math.sin(angle(i)),
  });
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPath = data.map((d, i) => {
    const p = pt(i, d.v / 100);
    return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ") + "Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map(lv => {
        const pts = data.map((_, i) => { const p = pt(i, lv); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(" ");
        return <polygon key={lv} points={pts} fill="none" style={{ stroke: C.light }} strokeWidth="1"/>;
      })}
      {data.map((_, i) => {
        const p = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} style={{ stroke: C.light }} strokeWidth="1"/>;
      })}
      <path d={dataPath} style={{ fill: C.primary16, stroke: C.primary }} strokeWidth="2" strokeLinejoin="round"/>
      {data.map((d, i) => {
        const p = pt(i, d.v / 100);
        return <circle key={i} cx={p.x} cy={p.y} r="4" style={{ fill: C.primary }} stroke="white" strokeWidth="1.5"/>;
      })}
      {data.map((d, i) => {
        const p = pt(i, 1.32);
        return (
          <text key={i} x={p.x.toFixed(1)} y={p.y.toFixed(1)} textAnchor="middle"
            dominantBaseline="middle" fontSize="9.5" fontWeight="600" style={{ fill: C.text }}>
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

export function CarbonArc({ score }) {
  const r = 36, cx = 50, cy = 50, sw = 8;
  const circ = Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 75 ? C.green : score >= 50 ? C.accent : "#E57373";
  const label = score >= 75 ? "Excellent" : score >= 50 ? "Moyen" : "Élevé";
  return (
    <div style={{ textAlign: "center" }}>
      <svg width="100" height="60" viewBox="0 0 100 60">
        <path d={`M${cx-r},${cy} A${r},${r} 0 0,1 ${cx+r},${cy}`}
          fill="none" style={{ stroke: C.light }} strokeWidth={sw} strokeLinecap="round"/>
        <path d={`M${cx-r},${cy} A${r},${r} 0 0,1 ${cx+r},${cy}`}
          fill="none" style={{ stroke: color }} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}/>
        <text x={cx} y={cy-4} textAnchor="middle" fontSize="14" fontWeight="800" style={{ fill: C.text }}>{score}</text>
        <text x={cx} y={cy+8} textAnchor="middle" fontSize="8" style={{ fill: C.muted }}>/ 100</text>
      </svg>
      <p style={{ color, fontWeight: 700, fontSize: 12, marginTop: -4 }}>{label}</p>
    </div>
  );
}
