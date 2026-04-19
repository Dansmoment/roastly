import { useState, useEffect, useRef } from 'react';
import { C, FONT_SERIF, FONT_SANS, ease } from '../lib/constants';
import { FilterBar } from '../components/FilterBar';
import { CoffeeCard, TopRatedCarousel, WeeklyFeatured } from '../components/CoffeeCard';
import { CoffeeIllustration } from '../components/CoffeeIllustration';

export function SearchPage({ coffees, onOpen, onNotFound, onOpenCGU, onOpenPrivacy, onOpenLegal }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [heroScroll, setHeroScroll] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = () => setHeroScroll(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = query.length >= 1
    ? coffees.filter(c => {
        const q = query.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q);
      }).slice(0, 6)
    : [];

  const isExploring = !query && filter === "all";

  const filtered = coffees.filter(c => {
    const q = query.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q);
    const matchF = filter === "all"
      || (filter === "bio" && (c.labels || []).includes("Bio"))
      || (filter === "fairtrade" && (c.labels || []).includes("Fair Trade"))
      || (filter === "ethiopie" && c.origin_country === "Éthiopie")
      || (filter === "colombie" && c.origin_country === "Colombie")
      || (filter === "kenya" && c.origin_country === "Kenya")
      || (c.tags || []).some(t => t.toLowerCase().includes(filter));
    return matchQ && matchF;
  });

  return (
    <div>
      <div style={{ borderRadius:24, padding:"22px 20px 24px", marginBottom:22, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:"-20px -1px", background:`linear-gradient(140deg, #1A0F07, #0E0804)`,
          transform:`translateY(${heroScroll * 0.3}px)`, transition:"transform 0.05s linear" }}/>
        <div style={{ position:"absolute", top:-30, right:-20, width:130, height:130,
          borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
        <p style={{ color:"rgba(255,255,255,0.65)", fontSize:12, marginBottom:4, fontFamily:FONT_SANS,
          letterSpacing:1, textTransform:"uppercase", fontWeight:500, position:"relative" }}>Bienvenue sur Roastly.</p>
        <p style={{ color:"white", fontSize:26, fontWeight:600, marginBottom:18, lineHeight:1.2,
          fontFamily:FONT_SERIF, letterSpacing:-0.2, position:"relative" }}>Explorez le monde<br/>du café.</p>
        <div ref={searchRef} style={{ position:"relative" }}>
          <div style={{ background:"rgba(255,255,255,0.20)", border:"1px solid rgba(255,255,255,0.35)",
            borderRadius: showSuggestions && suggestions.length > 0 ? "14px 14px 0 0" : 14,
            display:"flex", alignItems:"center",
            padding:"11px 14px", gap:10 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={query} onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Nom, marque, torréfacteur..."
              style={{ border:"none", outline:"none", flex:1, fontSize:14, color:"white", background:"transparent" }}/>
            {query && (
              <button onClick={() => { setQuery(""); setShowSuggestions(false); }} style={{ border:"none", background:"none",
                color:"rgba(255,255,255,0.6)", cursor:"pointer", fontSize:18, lineHeight:1 }}>×</button>
            )}
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position:"absolute", top:"100%", left:0, right:0, zIndex:50,
              background:C.bg, borderRadius:"0 0 14px 14px",
              border:`1px solid ${C.light}`, borderTop:"none",
              overflow:"hidden",
              boxShadow:"0 8px 24px rgba(0,0,0,0.12)",
            }}>
              {suggestions.map((c, i) => (
                <button key={c.id} onClick={() => { onOpen(c); setShowSuggestions(false); setQuery(""); }}
                  style={{
                    display:"flex", alignItems:"center", gap:12, width:"100%",
                    padding:"10px 14px", border:"none", background:"transparent",
                    cursor:"pointer", textAlign:"left",
                    borderBottom: i < suggestions.length - 1 ? `1px solid ${C.light}` : "none",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = C.light}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{
                    width:36, height:36, borderRadius:10, flexShrink:0, overflow:"hidden",
                    background:`linear-gradient(135deg, ${c.gradient?.[0] || C.accent}, ${c.gradient?.[1] || C.copper})`,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
                  }}>
                    {c.image_url
                      ? <img src={c.image_url} alt={c.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                      : c.emoji}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ color:C.dark, fontSize:13, fontWeight:600, margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.name}</p>
                    <p style={{ color:C.muted, fontSize:11, margin:0 }}>{c.brand}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <FilterBar active={filter} onSelect={setFilter}/>

      <div style={{
        maxHeight: isExploring ? 600 : 0, overflow:"hidden",
        opacity: isExploring ? 1 : 0,
        transition:`max-height 0.35s ${ease}, opacity 0.25s ${ease}`,
        pointerEvents: isExploring ? "auto" : "none",
      }}>
        <WeeklyFeatured coffees={coffees} onOpen={onOpen}/>
        <TopRatedCarousel coffees={coffees} onOpen={onOpen}/>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <p style={{ color:C.dark, fontWeight:600, fontSize:19, fontFamily:FONT_SERIF, letterSpacing:-0.1, margin:0 }}>
          {isExploring ? "Tous les cafés" : "Résultats"}
        </p>
        {!isExploring && (
          <span style={{ color:C.muted, fontSize:12 }}>{filtered.length} café{filtered.length > 1 ? "s" : ""}</span>
        )}
      </div>

      {filtered.length > 0 ? (
        filtered.map((c, i) => <CoffeeCard key={c.id} coffee={c} onOpen={onOpen} index={i}/>)
      ) : (
        <div style={{ textAlign:"center", padding:"52px 24px 40px" }}>
          <div style={{ width:88, height:88, borderRadius:"50%", background:C.light,
            display:"flex", alignItems:"center", justifyContent:"center",
            margin:"0 auto 20px" }}>
            <CoffeeIllustration emoji="☕" size={52}/>
          </div>
          <p style={{ color:C.dark, fontWeight:700, fontSize:20, fontFamily:FONT_SERIF, margin:"0 0 8px", letterSpacing:-0.2 }}>
            {query ? `"${query}" introuvable` : "Aucun café trouvé"}
          </p>
          <p style={{ color:C.muted, fontSize:13, lineHeight:1.6, margin:"0 auto 24px", maxWidth:240 }}>
            {query
              ? "Ce café n'est peut-être pas encore référencé. Aidez la communauté en l'ajoutant !"
              : "Essayez un autre filtre ou ajoutez un café."}
          </p>
          <button onClick={onNotFound} style={{
            background:C.primary, color:"white", border:"none", borderRadius:99,
            padding:"12px 28px", fontSize:14, fontWeight:600, cursor:"pointer",
            boxShadow:`0 6px 20px ${C.primary25}`,
          }}>
            {query ? `Ajouter "${query}" +` : "Ajouter un café +"}
          </button>
        </div>
      )}

      {/* Back to top */}
      {heroScroll > 300 && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{
          position: "fixed", bottom: 88, right: 20, zIndex: 90,
          width: 44, height: 44, borderRadius: "50%",
          background: C.primary, border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 4px 16px ${C.primary25}`,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.bg} strokeWidth="2.5" strokeLinecap="round">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
        </button>
      )}

      {/* Legal footer */}
      <div style={{ borderTop:`1px solid ${C.light}`, marginTop:32, paddingTop:20, paddingBottom:8, textAlign:"center" }}>
        <div style={{ display:"flex", justifyContent:"center", gap:20, flexWrap:"wrap", marginBottom:10 }}>
          {[
            { label:"CGU", onClick: onOpenCGU },
            { label:"Confidentialité", onClick: onOpenPrivacy },
            { label:"Mentions légales", onClick: onOpenLegal },
          ].map(item => (
            <button key={item.label} onClick={item.onClick} style={{
              background:"none", border:"none", color:C.muted,
              fontSize:12, cursor:"pointer", padding:0,
            }}>{item.label}</button>
          ))}
        </div>
        <p style={{ color:C.muted, fontSize:11, margin:0 }}>© 2026 Roastly. — Données : Open Food Facts (ODbL)</p>
      </div>
    </div>
  );
}
