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

function LearnPage({ onOpenArticle }) {
  return (
    <div>
      <div style={{ background:`linear-gradient(135deg, ${C.roast}, ${C.primary})`,
        borderRadius:24, padding:"22px 20px", marginBottom:24 }}>
        <p style={{ color:"rgba(255,255,255,0.65)", fontSize:13, marginBottom:4 }}>Tout savoir sur</p>
        <p style={{ color:"white", fontSize:26, fontWeight:600, marginBottom:4, fontFamily:FONT_SERIF }}>Le monde du café.</p>
        <p style={{ color:"rgba(255,255,255,0.6)", fontSize:13 }}>6 guides pour tout comprendre</p>
      </div>

      <div onClick={() => onOpenArticle(ARTICLES[0])} style={{
        background:`linear-gradient(135deg, ${C.accent}, ${C.primary})`,
        borderRadius:22, padding:22, marginBottom:20, cursor:"pointer",
      }}>
        <p style={{ color:"rgba(255,255,255,0.7)", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:1, margin:"0 0 6px" }}>À la une</p>
        <p style={{ color:"white", fontSize:22, fontWeight:600, margin:"0 0 4px", fontFamily:FONT_SERIF }}>{ARTICLES[0].title}</p>
        <p style={{ color:"rgba(255,255,255,0.75)", fontSize:13, margin:"0 0 14px" }}>{ARTICLES[0].desc}</p>
        <span style={{ color:"rgba(255,255,255,0.65)", fontSize:12 }}>⏱ {ARTICLES[0].min} de lecture</span>
      </div>

      {ARTICLES.slice(1).map((a, i) => (
        <FadeIn key={i} delay={i * 40}>
          <div onClick={() => onOpenArticle(a)} style={{
            display:"flex", gap:18, alignItems:"flex-start",
            padding:"18px 0", borderBottom:`1px solid ${C.light}`, cursor:"pointer",
          }}>
            <span style={{ fontSize:30, flexShrink:0, lineHeight:1, marginTop:2 }}>{a.icon}</span>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:600, color:C.dark, fontSize:16, margin:"0 0 4px", fontFamily:FONT_SERIF, letterSpacing:-0.1 }}>{a.title}</p>
              <p style={{ color:C.muted, fontSize:12, margin:"0 0 6px" }}>{a.desc}</p>
              <span style={{ color:C.accent, fontSize:12, fontWeight:500 }}>⏱ {a.min} de lecture</span>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
