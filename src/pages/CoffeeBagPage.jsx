import { useState, useEffect } from 'react';
import { C, FONT_SERIF, ease, spring, ARTICLES } from '../lib/constants';
import { FadeIn, Pill } from '../components/Atoms';
import * as api from '../lib/api';

export function CoffeeBagPage({ coffees, onOpen, user }) {
  const [activeTab, setActiveTab] = useState(0);
  const [learnArticle, setLearnArticle] = useState(null);
  const tabs = ["Mon café", "Apprendre"];

  return (
    <div>
      <div style={{ background:C.light, borderRadius:12, padding:3, display:"flex", marginBottom:24, position:"relative" }}>
        <div style={{
          position:"absolute", top:3, bottom:3, width:"calc(50% - 3px)", borderRadius:10,
          background:C.white, boxShadow:"0 1px 4px rgba(0,0,0,0.1)",
          transform:`translateX(${activeTab * 100}%)`,
          transition:`transform 0.3s ${spring}`,
        }}/>
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setActiveTab(i)} style={{
            flex:1, position:"relative", zIndex:1, border:"none", background:"transparent",
            padding:"10px 0", fontSize:14, fontWeight: activeTab === i ? 700 : 500,
            color: activeTab === i ? C.dark : C.muted, cursor:"pointer",
            transition:`color 0.2s ${ease}`,
          }}>{t}</button>
        ))}
      </div>

      <div style={{ overflow:"hidden", width:"100%" }}>
        <div style={{
          display:"flex",
          transform:`translateX(${-activeTab * 100}%)`,
          transition:`transform 0.35s ${spring}`,
        }}>
          <div style={{ width:"100%", minWidth:"100%", flexShrink:0 }}>
            <ProfilePage coffees={coffees} onOpen={onOpen} user={user}/>
          </div>
          <div style={{ width:"100%", minWidth:"100%", flexShrink:0 }}>
            <LearnPage onOpenArticle={setLearnArticle}/>
          </div>
        </div>
      </div>

      {/* Article modal — rendered OUTSIDE the sliding container */}
      <div onClick={() => setLearnArticle(null)} style={{
        position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:300,
        opacity: learnArticle ? 1 : 0, pointerEvents: learnArticle ? "auto" : "none",
        transition:`opacity 0.25s ${ease}`,
      }}/>
      <div style={{
        position:"fixed", bottom:0, left:"50%",
        transform:`translateX(-50%) translateY(${learnArticle ? "0" : "110%"})`,
        visibility: learnArticle ? "visible" : "hidden",
        width:"100%", maxWidth:430, zIndex:301, background:C.bg,
        borderRadius:"28px 28px 0 0", padding:"24px 22px 44px",
        transition:`transform 0.35s ${spring}, visibility 0s ${learnArticle ? "0s" : "0.35s"}`,
        maxHeight:"75vh", overflowY:"auto",
      }}>
        <div style={{ width:36, height:4, background:C.light, borderRadius:99, margin:"0 auto 22px" }}/>
        {learnArticle && <>
          <p style={{ fontSize:40, margin:"0 0 10px" }}>{learnArticle.icon}</p>
          <p style={{ color:C.dark, fontWeight:800, fontSize:20, margin:"0 0 4px", fontFamily:FONT_SERIF }}>{learnArticle.title}</p>
          <p style={{ color:C.muted, fontSize:12, margin:"0 0 18px" }}>⏱ {learnArticle.min} de lecture</p>
          <p style={{ color:C.text, fontSize:14, lineHeight:1.75 }}>
            {learnArticle.desc}. Ce guide détaillé vous expliquera tout ce que vous devez savoir. Le contenu complet sera disponible dans la version finale de Roastly.
          </p>
          <div style={{ background:C.light, borderRadius:14, padding:16, marginTop:20, textAlign:"center" }}>
            <p style={{ color:C.muted, fontSize:13, margin:0 }}>📝 Contenu en cours de rédaction</p>
          </div>
        </>}
      </div>
    </div>
  );
}

function ProfilePage({ coffees, onOpen, user }) {
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || "Vous";
  const userInitial = userName[0]?.toUpperCase() || "?";

  const [stats, setStats] = useState({ favorites: 0, reviews: 0 });
  const [tasteProfile, setTasteProfile] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!user) {
      setStats({ favorites: 0, reviews: 0 });
      setTasteProfile(null);
      setScanHistory([]);
      return;
    }
    // Load stats + taste profile + scan history in parallel
    api.fetchUserStats(user.id).then(setStats).catch(() => {});
    api.fetchUserTasteProfile(user.id).then(setTasteProfile).catch(() => {});
    setLoadingHistory(true);
    api.fetchScanHistory(user.id)
      .then(data => setScanHistory(data || []))
      .catch(() => setScanHistory([]))
      .finally(() => setLoadingHistory(false));
  }, [user]);

  // Format relative time
  function relativeTime(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = diff / 3600000;
    if (h < 24) return "Aujourd'hui";
    if (h < 48) return "Hier";
    const d = Math.floor(h / 24);
    if (d < 7) return `Il y a ${d}j`;
    if (d < 30) return `Il y a ${Math.floor(d/7)} sem.`;
    return `Il y a ${Math.floor(d/30)} mois`;
  }

  // Build display for scan history items
  const historyItems = scanHistory
    .filter(s => s.coffees)
    .slice(0, 5);

  return (
    <div>
      {/* Profile card */}
      <div style={{ background:`linear-gradient(135deg, ${C.primary}, ${C.dark})`,
        borderRadius:24, padding:"24px 20px", marginBottom:24, textAlign:"center" }}>
        <div style={{ width:66, height:66, background:`linear-gradient(135deg, ${C.accent}, ${C.copper})`, borderRadius:"50%",
          margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:28, fontWeight:800, color:"white", boxShadow:"0 4px 16px rgba(0,0,0,0.3)" }}>{userInitial}</div>
        <p style={{ color:"white", fontWeight:600, fontSize:24, margin:"0 0 4px", fontFamily:FONT_SERIF }}>{userName}</p>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:12, margin:"0 0 20px" }}>Membre Roastly.</p>
        <div style={{ display:"flex", justifyContent:"space-around" }}>
          {[
            { v: coffees.length, l:"Cafés" },
            { v: stats.reviews, l:"Avis" },
            { v: stats.favorites, l:"Favoris" },
          ].map(s => (
            <div key={s.l}>
              <p style={{ color:"white", fontWeight:800, fontSize:22, margin:"0 0 2px" }}>{s.v}</p>
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:12, margin:0 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Taste profile */}
      <p style={{ color:C.dark, fontWeight:600, fontSize:19, fontFamily:FONT_SERIF, letterSpacing:-0.1, marginBottom:12 }}>🎯 Mon profil de goût</p>
      {!user ? (
        <div style={{ background:C.light, borderRadius:16, padding:"20px", textAlign:"center", marginBottom:28 }}>
          <p style={{ color:C.muted, fontSize:13, margin:0 }}>Connectez-vous pour voir votre profil</p>
        </div>
      ) : tasteProfile && tasteProfile.profile.length > 0 ? (
        <div style={{ marginBottom:28 }}>
          {tasteProfile.profile.map((t, i) => (
            <FadeIn key={t.l} delay={i * 50}>
              <div style={{ marginBottom:18 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                  <span style={{ color:C.text, fontSize:15, fontFamily:FONT_SERIF, fontWeight:500 }}>{t.l}</span>
                  <span style={{ color:C.accent, fontSize:13, fontWeight:600 }}>{t.v}%</span>
                </div>
                <div style={{ height:3, background:C.light, borderRadius:99, overflow:"hidden" }}>
                  <div style={{ width:`${t.v}%`, height:"100%", borderRadius:99,
                    background:`linear-gradient(90deg, ${C.primary}, ${C.accent})`, transition:"width 0.8s ease" }}/>
                </div>
              </div>
            </FadeIn>
          ))}
          <p style={{ color:C.muted, fontSize:12, marginTop:8 }}>
            Basé sur {tasteProfile.reviewCount} avis
            {tasteProfile.topTags.length > 0 && ` · Vous aimez ${tasteProfile.topTags.join(", ")}`}
          </p>
        </div>
      ) : (
        <div style={{ background:C.light, borderRadius:16, padding:"20px", textAlign:"center", marginBottom:28 }}>
          <p style={{ fontSize:28, marginBottom:8 }}>☕</p>
          <p style={{ color:C.muted, fontSize:13, margin:0 }}>Notez des cafés pour construire votre profil de goût</p>
        </div>
      )}

      {/* Scan history */}
      <p style={{ color:C.dark, fontWeight:600, fontSize:19, fontFamily:FONT_SERIF, letterSpacing:-0.1, marginBottom:12 }}>📋 Historique des scans</p>
      {!user ? (
        <p style={{ color:C.muted, fontSize:13 }}>Connectez-vous pour voir votre historique</p>
      ) : loadingHistory ? (
        <p style={{ color:C.muted, fontSize:13 }}>Chargement...</p>
      ) : historyItems.length === 0 ? (
        <div style={{ background:C.light, borderRadius:16, padding:"20px", textAlign:"center" }}>
          <p style={{ fontSize:28, marginBottom:8 }}>📷</p>
          <p style={{ color:C.muted, fontSize:13, margin:0 }}>Aucun scan pour l'instant</p>
        </div>
      ) : (
        historyItems.map((s, i) => {
          const c = s.coffees;
          const g = c.gradient || [C.accent, C.copper];
          return (
            <FadeIn key={s.id || i} delay={i * 55}>
              <div onClick={() => onOpen(c)} style={{
                display:"flex", alignItems:"center", gap:14,
                padding:"16px 0", borderBottom:`1px solid ${C.light}`, cursor:"pointer",
              }}>
                <div style={{ width:46, height:46, borderRadius:14, flexShrink:0,
                  background:`linear-gradient(135deg, ${g[0]}, ${g[1]})`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
                  boxShadow:`0 4px 12px ${g[0]}44` }}>{c.emoji || "☕"}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:600, color:C.dark, fontSize:15, margin:"0 0 2px",
                    fontFamily:FONT_SERIF, letterSpacing:-0.1 }}>{c.name}</p>
                  <p style={{ color:C.muted, fontSize:12, margin:0 }}>{c.brand} · {relativeTime(s.scanned_at)}</p>
                </div>
                <span style={{ color:C.accent, fontWeight:700, fontSize:17, fontFamily:FONT_SERIF }}>{c.avg_rating || "—"}</span>
              </div>
            </FadeIn>
          );
        })
      )}
    </div>
  );
}

const COFFEE_FACTS = [
  { stat: "2.5 Md", unit: "tasses par jour", detail: "consommées dans le monde entier", color: C.accent },
  { stat: "70+", unit: "pays producteurs", detail: "du Brésil à l'Éthiopie, en passant par le Yemen", color: C.roast },
  { stat: "60", unit: "espèces de caféier", detail: "mais seulement 2 dominent le commerce mondial", color: "#4A7C59" },
  { stat: "3ème", unit: "boisson mondiale", detail: "après l'eau et le thé, le café est partout", color: "#5C6BC0" },
];

const ROAST_LEVELS = [
  { label: "Blonde", hex: "#E8C47A", notes: "Fruité · Floral" },
  { label: "Légère", hex: "#C89448", notes: "Acidité vive" },
  { label: "Médium", hex: "#8B5E2A", notes: "Équilibré" },
  { label: "Foncée", hex: "#4A2C10", notes: "Chocolaté" },
  { label: "Espresso", hex: "#1A0A04", notes: "Intense · Amer" },
];

const PRODUCERS = [
  { flag: "🇧🇷", country: "Brésil",     pct: 38 },
  { flag: "🇻🇳", country: "Vietnam",    pct: 18 },
  { flag: "🇨🇴", country: "Colombie",   pct: 11 },
  { flag: "🇮🇩", country: "Indonésie",  pct: 8  },
  { flag: "🇪🇹", country: "Éthiopie",   pct: 7  },
];

const TOPIC_CARDS = [
  {
    title: "Les origines",
    sub: "Terroirs & géographie",
    min: "5 min",
    grad: ["#2E7D32", "#1B5E20"],
    articleIdx: 0,
    Illustration: () => (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="24" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
        <ellipse cx="32" cy="32" rx="10" ry="24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <line x1="8" y1="32" x2="56" y2="32" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <circle cx="22" cy="26" r="3.5" fill="rgba(255,255,255,0.8)"/>
        <circle cx="38" cy="36" r="2.5" fill="rgba(255,255,255,0.6)"/>
        <circle cx="30" cy="42" r="2" fill="rgba(255,255,255,0.5)"/>
      </svg>
    ),
  },
  {
    title: "Torréfaction",
    sub: "De blonde à espresso",
    min: "4 min",
    grad: ["#C47A2A", "#7A3E1E"],
    articleIdx: 1,
    Illustration: () => (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="44" rx="14" ry="5" fill="rgba(255,255,255,0.15)"/>
        <path d="M24 44 Q22 32 26 22 Q32 10 38 22 Q42 32 40 44 Z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
        <path d="M32 38 Q29 28 32 18" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="32" cy="15" r="2.5" fill="rgba(255,255,255,0.9)"/>
        <path d="M26 30 Q30 26 34 30" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Spécialité",
    sub: "Qu'est-ce qui fait la différence ?",
    min: "6 min",
    grad: ["#4B6CB7", "#182848"],
    articleIdx: 2,
    Illustration: () => (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path d="M32 12 L35.5 22.5 L47 22.5 L37.5 29 L41 40 L32 33.5 L23 40 L26.5 29 L17 22.5 L28.5 22.5 Z" fill="rgba(255,255,255,0.85)" opacity="0.9"/>
        <path d="M32 18 L34.2 24.5 L41 24.5 L35.5 28.5 L37.5 35 L32 31.5 L26.5 35 L28.5 28.5 L23 24.5 L29.8 24.5 Z" fill="rgba(255,255,255,0.2)"/>
      </svg>
    ),
  },
  {
    title: "Équitable",
    sub: "Fair Trade & labels",
    min: "7 min",
    grad: ["#00897B", "#004D40"],
    articleIdx: 3,
    Illustration: () => (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path d="M20 36 Q20 28 32 26 Q44 28 44 36 L44 46 Q44 50 32 50 Q20 50 20 46 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
        <path d="M24 36 L30 42 L42 28" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="32" cy="22" r="7" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
        <path d="M29 22 L31.5 24.5 L36 19" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Préparation",
    sub: "Espresso, filtre, cold brew…",
    min: "8 min",
    grad: ["#37474F", "#102027"],
    articleIdx: 4,
    Illustration: () => (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path d="M20 28 L22 48 Q22 50 26 50 L38 50 Q42 50 42 48 L44 28 Z" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M44 34 Q50 34 50 39 Q50 44 44 44" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round"/>
        <ellipse cx="32" cy="28" rx="12" ry="3" fill="rgba(255,255,255,0.6)"/>
        <path d="M27 28 Q30 24.5 32 28 Q34 31.5 37 28" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M27 20 Q26 17 27 14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M32 19 Q31 16 32 13" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M37 20 Q36 17 37 14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Empreinte",
    sub: "L'impact carbone du café",
    min: "5 min",
    grad: ["#558B2F", "#1B5E20"],
    articleIdx: 5,
    Illustration: () => (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path d="M32 48 Q20 40 20 28 Q20 16 32 14" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M32 48 Q44 40 44 28 Q44 16 32 14" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="32" y1="14" x2="32" y2="52" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M26 22 Q32 18 38 22" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M24 30 Q32 26 40 30" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M25 38 Q32 34 39 38" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

function FactCard() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const f = COFFEE_FACTS[idx];

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % COFFEE_FACTS.length);
        setVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      background: C.primary, borderRadius: 20, padding: "20px 22px",
      marginBottom: 20, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -20, right: -20, width: 100, height: 100,
        borderRadius: "50%", background: `${f.color}20`,
      }}/>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 10px" }}>Le saviez-vous ?</p>
      <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}>
        <p style={{ color: f.color, fontSize: 42, fontWeight: 800, fontFamily: FONT_SERIF, margin: "0 0 2px", letterSpacing: -1 }}>{f.stat}</p>
        <p style={{ color: "white", fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>{f.unit}</p>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, margin: 0 }}>{f.detail}</p>
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 16 }}>
        {COFFEE_FACTS.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{
            height: 3, borderRadius: 99, cursor: "pointer",
            width: i === idx ? 18 : 6,
            background: i === idx ? f.color : "rgba(255,255,255,0.2)",
            transition: "all 0.3s ease",
          }}/>
        ))}
      </div>
    </div>
  );
}

function RoastScale() {
  return (
    <div style={{ background: C.white, borderRadius: 20, padding: "18px 18px 16px", marginBottom: 20, boxShadow: `0 2px 12px rgba(0,0,0,0.06)` }}>
      <p style={{ color: C.dark, fontSize: 14, fontWeight: 700, fontFamily: FONT_SERIF, margin: "0 0 14px" }}>La torréfaction en un coup d'œil</p>
      <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", height: 28, marginBottom: 8 }}>
        {ROAST_LEVELS.map((r, i) => (
          <div key={i} style={{ flex: 1, background: r.hex, position: "relative" }}>
            {i < ROAST_LEVELS.length - 1 && (
              <div style={{
                position: "absolute", right: 0, top: 0, bottom: 0, width: 2,
                background: `rgba(245,239,228,0.3)`,
              }}/>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        {ROAST_LEVELS.map((r, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: C.dark, margin: "0 0 1px", letterSpacing: 0.2 }}>{r.label}</p>
            <p style={{ fontSize: 8, color: C.muted, margin: 0, lineHeight: 1.3 }}>{r.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductionChart() {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimate(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div style={{ background: C.white, borderRadius: 20, padding: "18px 18px 14px", marginBottom: 24, boxShadow: `0 2px 12px rgba(0,0,0,0.06)` }}>
      <p style={{ color: C.dark, fontSize: 14, fontWeight: 700, fontFamily: FONT_SERIF, margin: "0 0 14px" }}>Top 5 pays producteurs</p>
      {PRODUCERS.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 15, width: 22 }}>{p.flag}</span>
          <span style={{ fontSize: 11, color: C.muted, width: 58, flexShrink: 0 }}>{p.country}</span>
          <div style={{ flex: 1, height: 8, background: C.light, borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 99,
              background: `linear-gradient(90deg, ${C.accent}, ${C.copper})`,
              width: animate ? `${(p.pct / 38) * 100}%` : "0%",
              transition: `width 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 80}ms`,
            }}/>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, width: 28, textAlign: "right" }}>{p.pct}%</span>
        </div>
      ))}
      <p style={{ color: C.muted, fontSize: 10, margin: "10px 0 0", textAlign: "right" }}>Source : ICO 2023</p>
    </div>
  );
}

function LearnPage({ onOpenArticle }) {
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 6px" }}>Encyclopédie</p>
        <p style={{ fontFamily: FONT_SERIF, fontSize: 28, fontWeight: 700, color: C.primary, margin: "0 0 4px", letterSpacing: -0.5 }}>Le monde du café.</p>
        <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Explorez les origines, les méthodes et les saveurs.</p>
      </div>

      <FactCard />
      <RoastScale />
      <ProductionChart />

      <p style={{ color: C.dark, fontSize: 14, fontWeight: 700, fontFamily: FONT_SERIF, margin: "0 0 14px" }}>Guides & articles</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
        {TOPIC_CARDS.map((card, i) => {
          const { Illustration } = card;
          return (
            <FadeIn key={i} delay={i * 50}>
              <div onClick={() => onOpenArticle(ARTICLES[card.articleIdx])} style={{
                background: `linear-gradient(145deg, ${card.grad[0]}, ${card.grad[1]})`,
                borderRadius: 18, padding: "16px 14px 14px",
                cursor: "pointer", minHeight: 160,
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                boxShadow: `0 4px 16px ${card.grad[1]}44`,
                transition: "transform 0.15s ease",
              }}
                onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                onTouchStart={e => e.currentTarget.style.transform = "scale(0.97)"}
                onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <Illustration />
                <div>
                  <p style={{ color: "white", fontWeight: 700, fontSize: 13, fontFamily: FONT_SERIF, margin: "0 0 2px", letterSpacing: -0.1 }}>{card.title}</p>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, margin: "0 0 6px", lineHeight: 1.3 }}>{card.sub}</p>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>⏱ {card.min}</span>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
