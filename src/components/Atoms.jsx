import { useState, useEffect, useRef } from 'react';
import { C, FONT_SERIF, FONT_SANS, ease, spring } from '../lib/constants';

const shimmerStyle = {
  background: `linear-gradient(90deg, ${C.light} 25%, var(--c-shimmer) 50%, ${C.light} 75%)`,
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s ease-in-out infinite",
  borderRadius: 8,
};

export function SkeletonCard() {
  return (
    <div style={{ display:"flex", gap:16, alignItems:"center", padding:"18px 0", borderBottom:`1px solid ${C.light}` }}>
      <div style={{ width:54, height:54, borderRadius:18, flexShrink:0, ...shimmerStyle }}/>
      <div style={{ flex:1 }}>
        <div style={{ height:15, width:"60%", marginBottom:8, ...shimmerStyle }}/>
        <div style={{ height:11, width:"40%", marginBottom:10, ...shimmerStyle }}/>
        <div style={{ display:"flex", gap:5 }}>
          <div style={{ height:20, width:52, borderRadius:99, ...shimmerStyle }}/>
          <div style={{ height:20, width:40, borderRadius:99, ...shimmerStyle }}/>
        </div>
      </div>
      <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
        <div style={{ height:24, width:28, borderRadius:6, ...shimmerStyle }}/>
        <div style={{ height:10, width:46, borderRadius:99, ...shimmerStyle }}/>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 7 }) {
  return <>{Array.from({ length: count }, (_, i) => <SkeletonCard key={i}/>)}</>;
}

export function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export function FadeIn({ children, delay = 0, y = 18 }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity 0.5s ${ease} ${delay}ms, transform 0.55s ${spring} ${delay}ms`,
    }}>{children}</div>
  );
}

export function Stars({ rating, size = 13 }) {
  return (
    <span style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24"
          style={{ fill: s <= Math.round(rating) ? C.primary : C.light }}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </span>
  );
}

export function Pill({ children, color = C.primary, bg = C.light, small }) {
  return (
    <span style={{
      background: bg, color, borderRadius: 99, fontWeight: 600,
      fontSize: small ? 10 : 12, padding: small ? "3px 8px" : "5px 11px",
      display: "inline-block", whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

export function LabelBadge({ label }) {
  const map = {
    "Bio":                 { bg: C.accent08,  color: C.roast },
    "Fair Trade":          { bg: C.accent13,  color: C.roast },
    "Rainforest Alliance": { bg: C.accent08,  color: C.primary },
    "Direct Trade":        { bg: C.primary08, color: C.primary },
  };
  const s = map[label] || { bg: C.light, color: C.primary };
  return <Pill bg={s.bg} color={s.color}>{label}</Pill>;
}

export function BackBtn({ onBack }) {
  return (
    <button onClick={onBack} style={{
      background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 99,
      width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", backdropFilter: "blur(8px)", flexShrink: 0,
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
  );
}

export function Section({ title, children }) {
  return (
    <FadeIn>
      <div style={{ marginBottom:28, paddingTop:22, borderTop:`1px solid ${C.light}` }}>
        <p style={{ color:C.muted, fontSize:11, fontWeight:500, textTransform:"uppercase",
          letterSpacing:1.5, margin:"0 0 14px", fontFamily:FONT_SANS }}>{title}</p>
        {children}
      </div>
    </FadeIn>
  );
}

export function FormInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <p style={{ color:C.muted, fontSize:12, fontWeight:600, marginBottom:6 }}>{label}</p>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width:"100%", border:`1.5px solid ${C.light}`, borderRadius:14,
          padding:"12px 14px", fontSize:14, color:C.text, background:C.surface,
          outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}/>
    </div>
  );
}

export function Toggle({ on, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      width:46, height:26, borderRadius:99, cursor:"pointer",
      background: on ? C.green : C.light,
      transition:`background 0.25s ${ease}`, position:"relative", flexShrink:0,
    }}>
      <div style={{
        width:22, height:22, borderRadius:"50%", background:C.white,
        position:"absolute", top:2, left: on ? 22 : 2,
        transition:`left 0.25s ${spring}`,
        boxShadow:"0 1px 3px rgba(0,0,0,0.15)",
      }}/>
    </div>
  );
}

export function Sheet({ visible, onClose, children, maxH = "85vh" }) {
  return (
    <>
      <div onClick={onClose} style={{
        position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:400,
        opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none",
        transition:`opacity 0.25s ${ease}`,
      }}/>
      <div style={{
        position:"fixed", bottom:0, left:"50%",
        transform:`translateX(-50%) translateY(${visible ? "0" : "110%"})`,
        visibility: visible ? "visible" : "hidden",
        width:"100%", maxWidth:430, zIndex:401, background:C.bg,
        borderRadius:"28px 28px 0 0", padding:"24px 22px 40px",
        transition:`transform 0.38s ${spring}, visibility 0s ${visible ? "0s" : "0.38s"}`,
        maxHeight:maxH, overflowY:"auto",
        boxShadow:"0 -8px 40px rgba(0,0,0,0.18)",
      }}>
        <div style={{ width:36, height:4, background:C.light, borderRadius:99, margin:"0 auto 22px" }}/>
        {children}
      </div>
    </>
  );
}
