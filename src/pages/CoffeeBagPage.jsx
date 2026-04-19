import { useState, useEffect } from 'react';
import { C, FONT_SERIF, FONT_SANS, ease, spring, ARTICLES } from '../lib/constants';
import { FadeIn } from '../components/Atoms';
import { RadarChart } from '../components/Charts';
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
          background:C.surface, boxShadow:"0 1px 4px rgba(0,0,0,0.1)",
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
          <p style={{ color:C.dark, fontWeight:800, fontSize:22, margin:"0 0 4px", fontFamily:FONT_SERIF, letterSpacing:-0.3 }}>{learnArticle.title}</p>
          <p style={{ color:C.muted, fontSize:12, margin:"0 0 20px" }}>⏱ {learnArticle.min} de lecture</p>

          {/* Key facts chips */}
          {learnArticle.keyFacts && (
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:22 }}>
              {learnArticle.keyFacts.map((f, i) => (
                <div key={i} style={{
                  background:C.accent08, border:`1px solid ${C.accent19}`,
                  borderRadius:12, padding:"9px 14px",
                  color:C.text, fontSize:13, fontWeight:500, lineHeight:1.4,
                }}>
                  {f}
                </div>
              ))}
            </div>
          )}

          {/* Sections */}
          {learnArticle.sections ? learnArticle.sections.map((s, i) => (
            <div key={i} style={{ marginBottom:22 }}>
              <p style={{
                color:C.dark, fontWeight:700, fontSize:15,
                fontFamily:FONT_SERIF, margin:"0 0 8px", letterSpacing:-0.1,
              }}>{s.title}</p>
              <p style={{ color:C.text, fontSize:13, lineHeight:1.78, margin:0 }}>{s.body}</p>
            </div>
          )) : (
            <p style={{ color:C.text, fontSize:13, lineHeight:1.78 }}>{learnArticle.desc}.</p>
          )}
        </>}
      </div>
    </div>
  );
}

// ─── Badges ──────────────────────────────────────────────────────────────────
const BADGE_DEFS = [
  { id: "first_review", icon: "🫘", label: "Curieux", desc: "1er avis posté", check: (s, c) => s.reviews >= 1 },
  { id: "five_reviews", icon: "⭐", label: "Connaisseur", desc: "5 avis postés", check: (s, c) => s.reviews >= 5 },
  { id: "ten_reviews", icon: "🏆", label: "Expert", desc: "10 avis postés", check: (s, c) => s.reviews >= 10 },
  { id: "explorer", icon: "🌍", label: "Explorateur", desc: "3 pays différents", check: (s, c) => c >= 3 },
  { id: "passionate", icon: "❤️", label: "Passionné", desc: "10 favoris", check: (s, c) => s.favorites >= 10 },
  { id: "collector", icon: "🗂️", label: "Collectionneur", desc: "20 avis postés", check: (s, c) => s.reviews >= 20 },
];

function BadgesSection({ stats, countriesCount }) {
  const earned = BADGE_DEFS.filter(b => b.check(stats, countriesCount));
  const locked = BADGE_DEFS.filter(b => !b.check(stats, countriesCount));
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ color: C.dark, fontSize: 15, fontWeight: 700, fontFamily: FONT_SERIF, margin: "0 0 12px" }}>Badges</p>
      {earned.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: locked.length > 0 ? 12 : 0 }}>
          {earned.map(b => (
            <div key={b.id} style={{
              background: C.accent08, border: `1px solid ${C.accent19}`,
              borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8,
              minWidth: 130, flex: "1 1 130px",
            }}>
              <span style={{ fontSize: 20 }}>{b.icon}</span>
              <div>
                <p style={{ color: C.accent, fontWeight: 700, fontSize: 12, margin: 0 }}>{b.label}</p>
                <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {locked.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {locked.slice(0, 3).map(b => (
            <div key={b.id} style={{
              background: C.light, borderRadius: 14, padding: "8px 12px",
              display: "flex", alignItems: "center", gap: 6, opacity: 0.5,
              minWidth: 120, flex: "1 1 120px",
            }}>
              <span style={{ fontSize: 16, filter: "grayscale(1)" }}>{b.icon}</span>
              <div>
                <p style={{ color: C.muted, fontWeight: 600, fontSize: 11, margin: 0 }}>{b.label}</p>
                <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {earned.length === 0 && locked.length > 0 && (
        <p style={{ color: C.muted, fontSize: 12, margin: "8px 0 0" }}>Notez votre premier café pour débloquer vos badges !</p>
      )}
    </div>
  );
}

// ─── Archetypes ──────────────────────────────────────────────────────────────
const ARCHETYPES = {
  fruity: {
    icon: "🫐", name: "L'Aventurier Fruité",
    tagline: "Fruité · Acidité vive · Complexe",
    desc: "Les terroirs d'altitude vous font vibrer. Vous cherchez la complexité aromatique et les notes de fruits rouges.",
    grad: ["#8E3E63", "#2D1040"],
  },
  floral: {
    icon: "🌸", name: "L'Explorateur Floral",
    tagline: "Floral · Délicat · Aromatique",
    desc: "Les cafés d'Éthiopie et du Panama vous enchantent. Votre palais est sensible aux arômes les plus subtils.",
    grad: ["#7B4F9E", "#2D1B69"],
  },
  sweet: {
    icon: "🍫", name: "L'Épicurien Doux",
    tagline: "Douceur · Chocolat · Velouté",
    desc: "Vous aimez les cafés ronds et généreux, aux notes de caramel et chocolat. Le réconfort dans la tasse.",
    grad: ["#7A3E1E", "#C47A2A"],
  },
  bold: {
    icon: "☕", name: "Le Puriste Espresso",
    tagline: "Corps · Intense · Corsé",
    desc: "Puissance et caractère. Vous appréciez les cafés qui ne laissent pas indifférent.",
    grad: ["#1A0F07", "#3A2010"],
  },
  balanced: {
    icon: "✨", name: "Le Connaisseur",
    tagline: "Éclectique · Curieux · Nuancé",
    desc: "Votre palais affûté apprécie toutes les nuances. Vous voyagez entre origines et styles sans frontières.",
    grad: ["#0D3B6E", "#1A5C74"],
  },
};

function computeArchetype(profile) {
  if (!profile || profile.length === 0) return null;
  const s = {};
  profile.forEach(({ l, v }) => { s[l] = v; });
  const floral = s['Floral'] || 0;
  const fruity = (s['Fruité'] || 0) + (s['Acidité'] || 0) * 0.5;
  const sweet = (s['Douceur'] || 0) + (s['Chocolat'] || 0) * 0.6;
  const bold = s['Corps'] || 0;
  const scores = { floral, fruity, sweet, bold };
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (top[1] < 40) return ARCHETYPES.balanced;
  return { floral: ARCHETYPES.floral, fruity: ARCHETYPES.fruity, sweet: ARCHETYPES.sweet, bold: ARCHETYPES.bold }[top[0]];
}

function shareProfile(name, archetype) {
  const text = archetype
    ? `Mon profil café sur Roastly. : ${archetype.icon} ${archetype.name}\n"${archetype.tagline}"\n\nDécouvre le tien sur roastly.app`
    : `Je découvre mes préférences café sur Roastly.app`;
  if (navigator.share) {
    navigator.share({ title: 'Mon profil Roastly.', text }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(text).then(() => alert('Profil copié !')).catch(() => {});
  }
}

function YearCard({ year, found, reviews, countries }) {
  return (
    <div style={{ background: C.light, borderRadius: 20, padding: "18px 16px 16px", marginBottom: 16 }}>
      <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 12px" }}>
        Votre {year} en cafés
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { v: found, label: "Découverts", icon: "🫘", color: C.accent },
          { v: countries, label: "Pays", icon: "🌍", color: "#2E7D32" },
          { v: reviews, label: "Avis", icon: "⭐", color: "#5C6BC0" },
        ].map((s, i) => (
          <div key={i} style={{ background: C.surface, borderRadius: 14, padding: "12px 6px", textAlign: "center" }}>
            <p style={{ fontSize: 18, margin: "0 0 4px" }}>{s.icon}</p>
            <p style={{ color: C.dark, fontWeight: 800, fontSize: 20, margin: "0 0 2px", fontFamily: FONT_SERIF }}>{s.v}</p>
            <p style={{ color: C.muted, fontSize: 10, margin: 0, lineHeight: 1.3 }}>{s.label}</p>
          </div>
        ))}
      </div>
      {found === 0 && reviews === 0 && (
        <p style={{ color: C.muted, fontSize: 12, textAlign: "center", margin: "12px 0 0", lineHeight: 1.5 }}>
          Scannez votre premier café pour commencer votre aventure !
        </p>
      )}
    </div>
  );
}

function DNATeaser() {
  const fakeData = [
    { label: "Fruité", v: 72 }, { label: "Floral", v: 55 },
    { label: "Acidité", v: 60 }, { label: "Corps", v: 38 }, { label: "Douceur", v: 65 },
  ];
  return (
    <div style={{ background: C.surface, borderRadius: 20, padding: "20px 18px", marginBottom: 16, textAlign: "center", boxShadow: `0 2px 12px ${C.shadowSm}` }}>
      <p style={{ color: C.dark, fontSize: 15, fontWeight: 700, fontFamily: FONT_SERIF, margin: "0 0 6px" }}>Mon ADN café</p>
      <p style={{ color: C.muted, fontSize: 12, margin: "0 0 16px", lineHeight: 1.5 }}>
        Notez 3 cafés pour faire apparaître votre profil de goût
      </p>
      <div style={{ position: "relative", display: "inline-block" }}>
        <div style={{ filter: "blur(5px)", opacity: 0.35 }}>
          <RadarChart data={fakeData} size={160}/>
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: C.primary, borderRadius: 99, padding: "6px 18px" }}>
            <p style={{ color: "white", fontSize: 12, fontWeight: 700, margin: 0 }}>À débloquer</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuestTeaser() {
  const preview = Object.values(ARCHETYPES);
  return (
    <div>
      <div style={{ textAlign: "center", padding: "16px 0 20px" }}>
        <div style={{ fontSize: 52, marginBottom: 14 }}>☕</div>
        <p style={{ fontFamily: FONT_SERIF, fontSize: 26, fontWeight: 700, color: C.primary, margin: "0 0 8px", letterSpacing: -0.5 }}>
          Quel type de café<br/>êtes-vous ?
        </p>
        <p style={{ color: C.muted, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
          Scannez, notez, et découvrez votre profil de goût unique.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, marginBottom: 20, scrollbarWidth: "none" }}>
        {preview.map((a, i) => (
          <div key={i} style={{
            flexShrink: 0, width: 130,
            background: `linear-gradient(145deg, ${a.grad[0]}, ${a.grad[1]})`,
            borderRadius: 18, padding: "16px 12px",
          }}>
            <p style={{ fontSize: 26, margin: "0 0 8px" }}>{a.icon}</p>
            <p style={{ color: "white", fontWeight: 700, fontSize: 11, fontFamily: FONT_SERIF, margin: "0 0 4px", lineHeight: 1.3 }}>{a.name}</p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, margin: 0, lineHeight: 1.3 }}>{a.tagline}</p>
          </div>
        ))}
      </div>

      <div style={{ background: C.primary, borderRadius: 20, padding: "22px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontWeight: 700, fontSize: 18, fontFamily: FONT_SERIF, margin: "0 0 6px" }}>
          Créez votre profil café
        </p>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, margin: "0 0 16px" }}>
          Gratuit · 30 secondes · Sans engagement
        </p>
        <div style={{ background: C.accent, borderRadius: 99, padding: "13px 28px", display: "inline-block" }}>
          <p style={{ color: "white", fontWeight: 700, fontSize: 14, margin: 0 }}>Commencer →</p>
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ coffees, onOpen, user }) {
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || null;
  const userInitial = userName?.[0]?.toUpperCase() || '?';
  const currentYear = new Date().getFullYear();

  const [stats, setStats] = useState({ favorites: 0, reviews: 0 });
  const [tasteProfile, setTasteProfile] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [favoriteCoffees, setFavoriteCoffees] = useState([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.fetchUserStats(user.id).then(setStats).catch(() => {}),
      api.fetchUserTasteProfile(user.id).then(setTasteProfile).catch(() => {}),
      api.fetchScanHistory(user.id).then(d => setScanHistory(d || [])).catch(() => {}),
      api.fetchFavorites(user.id).then(d => setFavoriteCoffees(d || [])).catch(() => {}),
    ]);
  }, [user]);

  if (!user) return <GuestTeaser />;

  const archetype = computeArchetype(tasteProfile?.profile);
  const grad = archetype?.grad || [C.primary, C.dark];
  const radarData = tasteProfile?.profile?.map(p => ({ label: p.l, v: p.v })) || [];
  const foundCoffees = scanHistory.filter(s => s.coffees);
  const thisYearFound = scanHistory.filter(s =>
    s.coffees && new Date(s.scanned_at || s.created_at).getFullYear() === currentYear
  ).length;
  const countries = new Set(scanHistory.map(s => s.coffees?.country).filter(Boolean));

  return (
    <div>
      {/* ── Hero identity card ─────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(145deg, ${grad[0]}, ${grad[1]})`,
        borderRadius: 24, padding: "22px 20px 18px", marginBottom: 16,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -50, right: -50, width: 160, height: 160,
          borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none",
        }}/>

        {/* Avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <div style={{
            width: 54, height: 54, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 800, color: "white", flexShrink: 0,
          }}>{userInitial}</div>
          <div>
            <p style={{ color: "white", fontWeight: 700, fontSize: 18, margin: "0 0 2px", fontFamily: FONT_SERIF }}>{userName || "Café lover"}</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: 0 }}>Membre Roastly.</p>
          </div>
        </div>

        {/* Archetype */}
        {archetype ? (
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 20 }}>{archetype.icon}</span>
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2 }}>{archetype.tagline}</span>
            </div>
            <p style={{ color: "white", fontWeight: 700, fontSize: 21, fontFamily: FONT_SERIF, margin: "0 0 7px", letterSpacing: -0.3 }}>{archetype.name}</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{archetype.desc}</p>
          </div>
        ) : (
          <div style={{ marginBottom: 18 }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0, fontStyle: "italic" }}>
              Notez des cafés pour révéler votre archétype...
            </p>
          </div>
        )}

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "rgba(0,0,0,0.2)", borderRadius: 14, overflow: "hidden" }}>
          {[
            { v: stats.favorites, label: "Favoris" },
            { v: stats.reviews,   label: "Avis" },
            { v: countries.size,  label: "Pays" },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign: "center", padding: "10px 0",
              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}>
              <p style={{ color: "white", fontWeight: 800, fontSize: 20, margin: "0 0 1px", fontFamily: FONT_SERIF }}>{s.v}</p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Year in coffee ─────────────────────────────────────────────── */}
      <YearCard year={currentYear} found={thisYearFound} reviews={stats.reviews} countries={countries.size} />

      {/* ── ADN de goût ────────────────────────────────────────────────── */}
      {radarData.length > 0 ? (
        <div style={{ background: C.surface, borderRadius: 20, padding: "18px", marginBottom: 16, boxShadow: `0 2px 12px ${C.shadowSm}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <p style={{ color: C.dark, fontSize: 15, fontWeight: 700, fontFamily: FONT_SERIF, margin: 0 }}>Mon ADN café</p>
            {archetype && (
              <span style={{ background: `${archetype.grad[0]}22`, color: archetype.grad[0], fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "3px 10px" }}>
                {archetype.icon} {archetype.name}
              </span>
            )}
          </div>
          <p style={{ color: C.muted, fontSize: 11, margin: "0 0 14px" }}>Basé sur {tasteProfile.reviewCount} avis</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <RadarChart data={radarData} size={190}/>
          </div>
          {tasteProfile.topTags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 14 }}>
              {tasteProfile.topTags.map((tag, i) => (
                <span key={i} style={{
                  background: C.accent08, color: C.accent, border: `1px solid ${C.accent19}`,
                  borderRadius: 99, padding: "4px 12px", fontSize: 12, fontWeight: 600,
                }}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <DNATeaser />
      )}

      {/* ── Badges ─────────────────────────────────────────────────────── */}
      <BadgesSection stats={stats} countriesCount={countries.size} />

      {/* ── Dernières découvertes ───────────────────────────────────────── */}
      {foundCoffees.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: C.dark, fontSize: 14, fontWeight: 700, fontFamily: FONT_SERIF, margin: "0 0 12px" }}>Dernières découvertes</p>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
            {foundCoffees.slice(0, 8).map((s, i) => {
              const c = s.coffees;
              const g = c.gradient || [C.accent, C.copper];
              return (
                <div key={i} onClick={() => onOpen(c)} style={{
                  flexShrink: 0, width: 110,
                  background: `linear-gradient(145deg, ${g[0]}, ${g[1]})`,
                  borderRadius: 16, padding: "14px 10px", cursor: "pointer",
                }}>
                  <p style={{ fontSize: 26, margin: "0 0 8px" }}>{c.emoji || "☕"}</p>
                  <p style={{ color: "white", fontWeight: 700, fontSize: 10, fontFamily: FONT_SERIF, margin: "0 0 2px", lineHeight: 1.3 }}>{c.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, margin: 0 }}>{c.brand}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Mes favoris ─────────────────────────────────────────────────── */}
      {favoriteCoffees.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ color: C.dark, fontSize: 14, fontWeight: 700, fontFamily: FONT_SERIF, margin: 0 }}>
              ❤️ Mes favoris
            </p>
            <span style={{ color: C.muted, fontSize: 11 }}>{favoriteCoffees.length} café{favoriteCoffees.length > 1 ? "s" : ""}</span>
          </div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
            {favoriteCoffees.map((c, i) => {
              const g = c.gradient || [C.accent, C.copper];
              return (
                <div key={c.id || i} onClick={() => onOpen(c)} style={{
                  flexShrink: 0, width: 110,
                  background: c.image_url ? "transparent" : `linear-gradient(145deg, ${g[0]}, ${g[1]})`,
                  borderRadius: 16, overflow: "hidden", cursor: "pointer",
                  position: "relative",
                }}>
                  {c.image_url ? (
                    <>
                      <img src={c.image_url} alt={c.name} style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }}/>
                      <div style={{
                        padding: "8px 10px 10px",
                        background: `linear-gradient(145deg, ${g[0]}, ${g[1]})`,
                      }}>
                        <p style={{ color: "white", fontWeight: 700, fontSize: 10, fontFamily: FONT_SERIF, margin: "0 0 2px", lineHeight: 1.3 }}>{c.name}</p>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, margin: 0 }}>{c.brand}</p>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: "14px 10px" }}>
                      <p style={{ fontSize: 26, margin: "0 0 8px" }}>{c.emoji || "☕"}</p>
                      <p style={{ color: "white", fontWeight: 700, fontSize: 10, fontFamily: FONT_SERIF, margin: "0 0 2px", lineHeight: 1.3 }}>{c.name}</p>
                      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, margin: 0 }}>{c.brand}</p>
                    </div>
                  )}
                  <div style={{
                    position: "absolute", top: 6, right: 6,
                    width: 18, height: 18, borderRadius: "50%",
                    background: "rgba(0,0,0,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9,
                  }}>❤️</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Favoris vide ────────────────────────────────────────────────── */}
      {favoriteCoffees.length === 0 && stats.reviews > 0 && (
        <div style={{
          background: C.surface, borderRadius: 18, padding: "18px 20px",
          marginBottom: 20, display: "flex", alignItems: "center", gap: 14,
          border: `1px solid ${C.light}`,
        }}>
          <div style={{ fontSize: 32, flexShrink: 0 }}>❤️</div>
          <div>
            <p style={{ color: C.dark, fontWeight: 700, fontSize: 14, fontFamily: FONT_SERIF, margin: "0 0 3px" }}>
              Aucun favori pour l'instant
            </p>
            <p style={{ color: C.muted, fontSize: 12, margin: 0, lineHeight: 1.5 }}>
              Appuyez sur ❤️ dans une fiche café pour la retrouver ici.
            </p>
          </div>
        </div>
      )}

      {/* ── Partager ────────────────────────────────────────────────────── */}
      <button onClick={() => shareProfile(userName, archetype)} style={{
        width: "100%", padding: "14px 0", marginBottom: 4,
        background: "transparent", border: `1.5px solid ${C.light}`,
        borderRadius: 99, color: C.muted, fontSize: 13, fontWeight: 600,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        fontFamily: FONT_SANS,
        transition: `border-color 0.2s ${ease}`,
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
        onMouseLeave={e => e.currentTarget.style.borderColor = C.light}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
        Partager mon profil café
      </button>
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
    <div style={{ background: C.surface, borderRadius: 20, padding: "18px 18px 16px", marginBottom: 20, boxShadow: `0 2px 12px ${C.shadowSm}` }}>
      <p style={{ color: C.dark, fontSize: 14, fontWeight: 700, fontFamily: FONT_SERIF, margin: "0 0 14px" }}>La torréfaction en un coup d'œil</p>
      <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", height: 28, marginBottom: 8 }}>
        {ROAST_LEVELS.map((r, i) => (
          <div key={i} style={{ flex: 1, background: r.hex, position: "relative" }}>
            {i < ROAST_LEVELS.length - 1 && (
              <div style={{
                position: "absolute", right: 0, top: 0, bottom: 0, width: 2,
                background: `rgba(var(--c-bg-rgb),0.5)`,
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
    <div style={{ background: C.surface, borderRadius: 20, padding: "18px 18px 14px", marginBottom: 24, boxShadow: `0 2px 12px ${C.shadowSm}` }}>
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
