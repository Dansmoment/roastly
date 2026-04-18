import { useState } from 'react';
import { C, FONT_SERIF, ease, spring } from '../lib/constants';
import { FadeIn, Stars, Pill } from './Atoms';
import { CoffeeIllustration } from './CoffeeIllustration';

export function CoffeeCard({ coffee, onOpen, index = 0 }) {
  const [pressed, setPressed] = useState(false);
  const press = { onMouseDown:() => setPressed(true), onMouseUp:() => setPressed(false), onMouseLeave:() => setPressed(false), onTouchStart:() => setPressed(true), onTouchEnd:() => setPressed(false), onTouchCancel:() => setPressed(false) };
  return (
    <FadeIn delay={index * 55}>
      <div onClick={() => onOpen(coffee)} {...press}
        style={{
          display:"flex", gap:16, alignItems:"center",
          padding:"18px 0", borderBottom:`1px solid ${C.light}`,
          cursor:"pointer",
          transform: pressed ? "scale(0.97)" : "scale(1)",
          transition:`transform 0.18s ${spring}`,
        }}>
        <div style={{ width:54, height:54, borderRadius:18, flexShrink:0,
          background:`linear-gradient(145deg, ${coffee.gradient[0]}, ${coffee.gradient[1]})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`0 4px 14px ${coffee.gradient[0]}55` }}>
          <CoffeeIllustration emoji={coffee.emoji} size={34}/>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ color:C.dark, fontWeight:600, fontSize:16, margin:"0 0 2px",
            fontFamily:FONT_SERIF, letterSpacing:-0.1,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{coffee.name}</p>
          <p style={{ color:C.muted, fontSize:12, margin:"0 0 7px" }}>
            {coffee.brand} · {coffee.origin_flag} {coffee.origin_country}
          </p>
          <div style={{ display:"flex", gap:5 }}>
            {(coffee.tags || []).slice(0,2).map(t => <Pill key={t} small>{t}</Pill>)}
          </div>
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <p style={{ color:C.accent, fontWeight:700, fontSize:22, margin:"0 0 2px",
            fontFamily:FONT_SERIF, lineHeight:1 }}>{coffee.avg_rating || "—"}</p>
          {coffee.avg_rating > 0 && <Stars rating={coffee.avg_rating} size={10}/>}
          <p style={{ color:C.muted, fontSize:10, marginTop:3 }}>{coffee.review_count} avis</p>
        </div>
      </div>
    </FadeIn>
  );
}

export function TopRatedCarousel({ coffees, onOpen }) {
  const sorted = [...coffees].filter(c => c.avg_rating > 0).sort((a, b) => b.avg_rating - a.avg_rating);
  if (sorted.length === 0) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <p style={{ color:C.dark, fontWeight:600, fontSize:19, fontFamily:FONT_SERIF, letterSpacing:-0.1, margin:0, display:"flex", alignItems:"center", gap:7 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill={C.accent}>
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          Mieux notés
        </p>
        <span style={{ color:C.muted, fontSize:12 }}>{sorted.length} cafés</span>
      </div>
      <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:6,
        scrollbarWidth:"none", WebkitOverflowScrolling:"touch", marginLeft:-16, paddingLeft:16,
        marginRight:-16, paddingRight:16 }}>
        {sorted.map(c => (
          <CarouselCard key={c.id} coffee={c} onOpen={onOpen}/>
        ))}
      </div>
    </div>
  );
}

function CarouselCard({ coffee, onOpen }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div onClick={() => onOpen(coffee)}
      onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        flexShrink:0, width:148, borderRadius:18, overflow:"hidden",
        boxShadow:"0 4px 18px rgba(44,62,53,0.10)", cursor:"pointer",
        transform: pressed ? "scale(0.95)" : "scale(1)",
        transition:`transform 0.18s ${spring}`,
      }}>
      <div style={{ height:90, background:`linear-gradient(145deg, ${coffee.gradient[0]}, ${coffee.gradient[1]})`,
        display:"flex", alignItems:"center", justifyContent:"center",
        position:"relative" }}>
        <CoffeeIllustration emoji={coffee.emoji} size={58}/>
        <div style={{ position:"absolute", top:8, right:8, background:"rgba(44,62,53,0.06)",
          backdropFilter:"blur(6px)", borderRadius:99, padding:"3px 8px",
          display:"flex", alignItems:"center", gap:3 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          <span style={{ color:"white", fontWeight:700, fontSize:11 }}>{coffee.avg_rating}</span>
        </div>
      </div>
      <div style={{ background:C.bg, padding:"10px 12px 14px" }}>
        <p style={{ color:C.dark, fontWeight:700, fontSize:13, margin:"0 0 2px",
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
          fontFamily:FONT_SERIF }}>{coffee.name}</p>
        <p style={{ color:C.muted, fontSize:11, margin:"0 0 8px" }}>{coffee.origin_flag} {coffee.origin_country}</p>
        <div style={{ display:"flex", gap:4 }}>
          {(coffee.tags || []).slice(0,1).map(t => <Pill key={t} small>{t}</Pill>)}
        </div>
      </div>
    </div>
  );
}
