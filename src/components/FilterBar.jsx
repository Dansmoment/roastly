import { C, FILTERS, ease } from '../lib/constants';

export function FilterBar({ active, onSelect }) {
  return (
    <div style={{ overflowX: "auto", display: "flex", gap: 8, paddingBottom: 4,
      scrollbarWidth: "none", WebkitOverflowScrolling: "touch", marginBottom: 16 }}>
      {FILTERS.map(f => {
        const on = active === f.id;
        return (
          <button key={f.id} onClick={() => onSelect(f.id)} style={{
            flexShrink: 0, border: `1.5px solid ${on ? C.primary : C.light}`,
            borderRadius: 99, padding: "7px 16px", fontSize: 13, fontWeight: on ? 700 : 500,
            background: on ? C.primary : C.bg, color: on ? C.white : C.muted,
            cursor: "pointer", transition: `all 0.22s ${ease}`, whiteSpace: "nowrap",
          }}>{f.label}</button>
        );
      })}
    </div>
  );
}
