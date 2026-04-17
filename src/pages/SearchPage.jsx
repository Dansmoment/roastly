import { useState, useEffect } from 'react';
import { C, FONT_SERIF, FONT_SANS, ease } from '../lib/constants';
import { FilterBar } from '../components/FilterBar';
import { CoffeeCard, TopRatedCarousel } from '../components/CoffeeCard';

export function SearchPage({ coffees, onOpen, onNotFound }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [heroScroll, setHeroScroll] = useState(0);

  useEffect(() => {
    const handler = () => setHeroScroll(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

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
        <div style={{ position:"absolute", inset:"-20px -1px", background:`linear-gradient(140deg, ${C.primary}, ${C.dark})`,
          transform:`translateY(${heroScroll * 0.3}px)`, transition:"transform 0.05s linear" }}/>
        <div style={{ position:"absolute", top:-30, right:-20, width:130, height:130,
          borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
        <p style={{ color:"rgba(255,255,255,0.65)", fontSize:12, marginBottom:4, fontFamily:FONT_SANS,
          letterSpacing:1, textTransform:"uppercase", fontWeight:500, position:"relative" }}>Bienvenue sur Roastly.</p>
        <p style={{ color:"white", fontSize:26, fontWeight:600, marginBottom:18, lineHeight:1.2,
          fontFamily:FONT_SERIF, letterSpacing:-0.2, position:"relative" }}>Explorez le monde<br/>du café.</p>
        <div style={{ background:"rgba(255,255,255,0.20)", border:"1px solid rgba(255,255,255,0.35)",
          borderRadius:14, display:"flex", alignItems:"center",
          padding:"11px 14px", gap:10, position:"relative" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Nom, marque, torréfacteur..."
            style={{ border:"none", outline:"none", flex:1, fontSize:14, color:"white", background:"transparent" }}/>
          {query && (
            <button onClick={() => setQuery("")} style={{ border:"none", background:"none",
              color:"rgba(255,255,255,0.6)", cursor:"pointer", fontSize:18, lineHeight:1 }}>×</button>
          )}
        </div>
      </div>

      <FilterBar active={filter} onSelect={setFilter}/>

      <div style={{
        maxHeight: isExploring ? 280 : 0, overflow:"hidden",
        opacity: isExploring ? 1 : 0,
        transition:`max-height 0.35s ${ease}, opacity 0.25s ${ease}`,
      }}>
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
            margin:"0 auto 20px", fontSize:44 }}>
            ☕
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
            boxShadow:`0 6px 20px ${C.primary}40`,
          }}>
            {query ? `Ajouter "${query}" +` : "Ajouter un café +"}
          </button>
        </div>
      )}
    </div>
  );
}
