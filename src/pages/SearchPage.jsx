import { useState, useEffect, useRef } from 'react';
import { C, FONT_SERIF, FONT_SANS, ease, spring } from '../lib/constants';
import { FilterBar } from '../components/FilterBar';
import { CoffeeCard, TopRatedCarousel } from '../components/CoffeeCard';
import { Stars } from '../components/Atoms';

function WeeklyFeatured({ coffee, onOpen }) {
  const [pressed, setPressed] = useState(false);
  if (!coffee) return null;
  const g = coffee.gradient || [C.accent, C.copper];
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <p style={{ color:C.dark, fontWeight:600, fontSize:16, fontFamily:FONT_SERIF, margin:0, letterSpacing:-0.1 }}>
          ✨ Coup de cœur de la semaine
        </p>
      </div>
      <div onClick={() => onOpen(coffee)}
        onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)} onTouchEnd={() => setPressed(false)}
        style={{
          borderRadius: 20, overflow:"hidden", cursor:"pointer",
          transform: pressed ? "scale(0.97)" : "scale(1)",
          transition: `transform 0.18s ${spring}`,
          boxShadow: `0 8px 28px ${g[0]}44`,
        }}>
        <div style={{ background:`linear-gradient(135deg, ${g[0]}, ${g[1]})`, padding:"20px 20px 16px", position:"relative" }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:110, height:110, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }}/>
          <div style={{ position:"absolute", bottom:-30, left:10, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:16, position:"relative" }}>
            <div style={{ fontSize:52, lineHeight:1 }}>{coffee.emoji}</div>
            <div style={{ flex:1 }}>
              <p style={{ color:"rgba(255,255,255,0.7)", fontSize:11, fontWeight:600, letterSpacing:1, textTransform:"uppercase", margin:"0 0 3px" }}>
                {coffee.origin_flag} {coffee.origin_country}
              </p>
              <p style={{ color:"white", fontSize:20, fontWeight:700, fontFamily:FONT_SERIF, margin:"0 0 6px", letterSpacing:-0.2, lineHeight:1.1 }}>
                {coffee.name}
              </p>
              <p style={{ color:"rgba(255,255,255,0.65)", fontSize:12, margin:"0 0 8px" }}>{coffee.brand}</p>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <Stars rating={coffee.avg_rating} size={12}/>
                <span style={{ color:"rgba(255,255,255,0.85)", fontSize:13, fontWeight:700 }}>{coffee.avg_rating}</span>
                <span style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>· {coffee.review_count} avis</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background:C.bg, padding:"12px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:`1px solid ${C.light}` }}>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {(coffee.tags || []).slice(0,2).map(t => (
              <span key={t} style={{ background:C.light, color:C.primary, borderRadius:99, fontSize:11, fontWeight:600, padding:"3px 10px" }}>{t}</span>
            ))}
          </div>
          <span style={{ color:C.accent, fontSize:13, fontWeight:700 }}>Découvrir →</span>
        </div>
      </div>
    </div>
  );
}

function SearchSuggestions({ coffees, query, onSelect, onClose }) {
  const suggestions = coffees
    .filter(c => {
      const q = query.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q);
    })
    .slice(0, 6);

  if (!suggestions.length) return null;

  return (
    <div style={{
      position:"absolute", top:"calc(100% - 8px)", left:0, right:0, zIndex:50,
      background:C.white, borderRadius:"0 0 16px 16px",
      boxShadow:"0 12px 32px rgba(0,0,0,0.14)",
      overflow:"hidden",
      animation: `pageSlideInRight 0.18s ${ease}`,
    }}>
      {suggestions.map((c, i) => (
        <SuggestionRow key={c.id} coffee={c} onSelect={onSelect} isLast={i === suggestions.length - 1}/>
      ))}
    </div>
  );
}

function SuggestionRow({ coffee, onSelect, isLast }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div onClick={() => onSelect(coffee)}
      onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)} onTouchEnd={() => setPressed(false)}
      style={{
        display:"flex", alignItems:"center", gap:12, padding:"11px 16px",
        borderBottom: isLast ? "none" : `1px solid ${C.light}`,
        cursor:"pointer",
        background: pressed ? C.light : C.white,
        transition:`background 0.12s`,
      }}>
      <div style={{ width:36, height:36, borderRadius:12, flexShrink:0,
        background:`linear-gradient(135deg, ${coffee.gradient?.[0] || C.accent}, ${coffee.gradient?.[1] || C.copper})`,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
        {coffee.emoji}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ color:C.dark, fontWeight:600, fontSize:14, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:FONT_SERIF }}>{coffee.name}</p>
        <p style={{ color:C.muted, fontSize:11, margin:0 }}>{coffee.brand} · {coffee.origin_flag} {coffee.origin_country}</p>
      </div>
      <span style={{ color:C.accent, fontWeight:700, fontSize:14, fontFamily:FONT_SERIF, flexShrink:0 }}>{coffee.avg_rating || "—"}</span>
    </div>
  );
}

export function SearchPage({ coffees, onOpen, onNotFound }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [heroScroll, setHeroScroll] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const handler = () => setHeroScroll(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setShowSuggestions(query.length >= 1);
  }, [query]);

  useEffect(() => {
    const handleClick = (e) => {
      if (heroRef.current && !heroRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, []);

  const weeklyPick = coffees.length > 0
    ? coffees[Math.floor(Date.now() / (7 * 24 * 3600 * 1000)) % coffees.length]
    : null;

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

  const handleSuggestionSelect = (coffee) => {
    setShowSuggestions(false);
    setQuery("");
    onOpen(coffee);
  };

  return (
    <div>
      {/* Hero + suggestions wrapper */}
      <div ref={heroRef} style={{ position:"relative", marginBottom: 22 }}>
        <div style={{ borderRadius:24, padding:"22px 20px 24px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:"-20px -1px", background:`linear-gradient(140deg, ${C.primary}, ${C.dark})`,
            transform:`translateY(${heroScroll * 0.3}px)`, transition:"transform 0.05s linear" }}/>
          <div style={{ position:"absolute", top:-30, right:-20, width:130, height:130,
            borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:12, marginBottom:4, fontFamily:FONT_SANS,
            letterSpacing:1, textTransform:"uppercase", fontWeight:500, position:"relative" }}>Bienvenue sur Roastly.</p>
          <p style={{ color:"white", fontSize:26, fontWeight:600, marginBottom:18, lineHeight:1.2,
            fontFamily:FONT_SERIF, letterSpacing:-0.2, position:"relative" }}>Explorez le monde<br/>du café.</p>
          <div style={{ background:"rgba(255,255,255,0.20)", border:"1px solid rgba(255,255,255,0.35)",
            borderRadius: showSuggestions ? "14px 14px 0 0" : 14, display:"flex", alignItems:"center",
            padding:"11px 14px", gap:10, position:"relative",
            transition:`border-radius 0.15s ${ease}` }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input ref={inputRef} value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => query.length >= 1 && setShowSuggestions(true)}
              placeholder="Nom, marque, torréfacteur..."
              style={{ border:"none", outline:"none", flex:1, fontSize:14, color:"white", background:"transparent" }}/>
            {query && (
              <button onClick={() => { setQuery(""); setShowSuggestions(false); }} style={{ border:"none", background:"none",
                color:"rgba(255,255,255,0.6)", cursor:"pointer", fontSize:18, lineHeight:1 }}>×</button>
            )}
          </div>
        </div>

        {showSuggestions && (
          <SearchSuggestions
            coffees={coffees}
            query={query}
            onSelect={handleSuggestionSelect}
          />
        )}
      </div>

      <FilterBar active={filter} onSelect={setFilter}/>

      {/* Coup de cœur de la semaine */}
      {isExploring && weeklyPick && (
        <WeeklyFeatured coffee={weeklyPick} onOpen={onOpen}/>
      )}

      {/* Top rated carousel */}
      {isExploring && (
        <TopRatedCarousel coffees={coffees} onOpen={onOpen}/>
      )}

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
