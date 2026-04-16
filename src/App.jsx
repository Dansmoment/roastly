import { useState, useEffect, useCallback, useRef } from 'react';
import { C, FONT_SERIF, FONT_SANS, ease, spring } from './lib/constants';
import { supabase } from './lib/supabase';
import * as api from './lib/api';
import { SearchPage } from './pages/SearchPage';
import { ScanPage } from './pages/ScanPage';
import { CoffeeBagPage } from './pages/CoffeeBagPage';
import { CoffeeDetailSheet } from './sheets/CoffeeDetailSheet';
import { NotFoundSheet } from './sheets/NotFoundSheet';
import { AuthSheet } from './sheets/AuthSheet';
import { SettingsSheet, HelpSheet, AboutSheet, ProfileMenuSheet } from './sheets/UtilitySheets';
import { SplashScreen } from './components/SplashScreen';
import { SkeletonList } from './components/Atoms';

const TAB_ORDER = ["search", "scan", "bag"];

const TABS = [
  { id: "search", label: "Rechercher", icon: "search" },
  { id: "scan",   label: "Scanner",    icon: "scan" },
  { id: "bag",    label: "Mon espace", icon: "bag" },
];

// ─── Nouveau logo Roastly — tasse stylisée + grain ─────────────────────────
function RoastlyLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Cup body */}
      <path
        d="M8 13 L10 24 Q10 26 13 26 L19 26 Q22 26 22 24 L24 13 Z"
        fill={`${C.accent}20`}
        stroke={C.accent}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Handle */}
      <path
        d="M24 17 Q29 17 29 21 Q29 25 24 25"
        fill="none"
        stroke={C.accent}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Coffee surface */}
      <ellipse cx="16" cy="13" rx="8" ry="2.2" fill={C.accent} opacity="0.45"/>
      {/* Swirl */}
      <path
        d="M13 13 Q15 11.2 16 13 Q17 14.8 19 13"
        fill="none"
        stroke={C.copper}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* Steam */}
      <path d="M13 9 Q12 7 13 5" fill="none" stroke={`${C.accent}88`} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M16 8 Q15 6 16 4" fill="none" stroke={`${C.accent}66`} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M19 9 Q18 7 19 5" fill="none" stroke={`${C.accent}88`} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function TabIcon({ type, active }) {
  const color = active ? C.accent : C.muted;
  if (type === "search") return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
  if (type === "scan") return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? C.white : C.muted} strokeWidth="2">
      <path d="M4 7V4h3"/><path d="M17 4h3v3"/><path d="M20 17v3h-3"/><path d="M7 20H4v-3"/>
      <line x1="7" y1="12" x2="17" y2="12"/>
    </svg>
  );
  if (type === "bag") return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
  return null;
}

export default function App() {
  const [splash, setSplash] = useState(true);
  const [tab, setTab] = useState("search");
  const [slideDir, setSlideDir] = useState("right");
  const [user, setUser] = useState(null);
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const pullStartY = useRef(null);
  const PULL_THRESHOLD = 80;

  // Sheets
  const [detailCoffee, setDetailCoffee] = useState(null);
  const [showNotFound, setShowNotFound] = useState(false);
  const [scannedEAN, setScannedEAN] = useState("");
  const [offData, setOffData] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Auth listener
  useEffect(() => {
    api.getSession().then(session => {
      setUser(session?.user || null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null;
      setUser(u);
      if (u) api.syncLocalFavoritesToSupabase(u.id).catch(() => {});
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fetch coffees
  useEffect(() => {
    setLoading(true);
    api.fetchCoffees()
      .then(data => setCoffees(data || []))
      .catch(() => setCoffees([]))
      .finally(() => setLoading(false));
  }, []);

  // Handlers
  const handleOpenCoffee = useCallback((coffee) => {
    setDetailCoffee(coffee);
  }, []);

  const handleScanFound = useCallback((coffee) => {
    setDetailCoffee(coffee);
  }, []);

  const handleNotFound = useCallback((ean, off = null) => {
    setScannedEAN(typeof ean === "string" ? ean : "");
    setOffData(off);
    setShowNotFound(true);
  }, []);

  const handleNewCoffeeAdded = useCallback((newCoffee) => {
    if (newCoffee) {
      setCoffees(prev => [newCoffee, ...prev]);
    }
    setShowNotFound(false);
  }, []);

  const handleLogout = useCallback(async () => {
    try { await api.signOut(); } catch {}
    setUser(null);
  }, []);

  const handleLogin = useCallback((u) => {
    setUser(u);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await api.fetchCoffees();
      setCoffees(data || []);
    } catch {}
    setRefreshing(false);
  }, []);

  const anySheetOpen = !!(detailCoffee || showNotFound || showAuth || showSettings || showHelp || showAbout || showProfileMenu);

  const onPullStart = (e) => {
    if (window.scrollY < 2 && !anySheetOpen && !refreshing && tab !== "scan") {
      pullStartY.current = e.touches[0].clientY;
    }
  };
  const onPullMove = (e) => {
    if (pullStartY.current === null) return;
    const delta = e.touches[0].clientY - pullStartY.current;
    if (delta > 0) setPullY(Math.min(delta * 0.45, PULL_THRESHOLD + 30));
  };
  const onPullEnd = () => {
    if (pullY >= PULL_THRESHOLD) handleRefresh();
    setPullY(0);
    pullStartY.current = null;
  };

  return (
    <>
      {/* ── Splash screen ────────────────────────────────────────────── */}
      {splash && <SplashScreen onDone={() => setSplash(false)} />}

      {/* ── App shell ────────────────────────────────────────────────── */}
      {/* Dim overlay during splash — does NOT use filter (would break position:fixed children) */}
      {splash && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.35)",
          pointerEvents: "none",
        }}/>
      )}

      <div style={{
        maxWidth: 430, margin: "0 auto",
        background: C.bg, position: "relative", fontFamily: FONT_SANS,
      }}>

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 20px 8px", position: "sticky", top: 0, zIndex: 50,
          background: C.bg,
          borderBottom: `1px solid ${C.light}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <RoastlyLogo size={30}/>
            <span style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 22, color: C.primary, letterSpacing: "-0.3px" }}>
              Roastly<span style={{ color: C.accent }}>.</span>
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {user ? (
              <button onClick={() => setShowProfileMenu(true)} style={{
                width: 36, height: 36, borderRadius: "50%", border: "none",
                background: `linear-gradient(135deg, ${C.accent}, ${C.copper})`,
                color: "white", fontWeight: 800, fontSize: 14, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {(user.user_metadata?.name || user.email)?.[0]?.toUpperCase() || "?"}
              </button>
            ) : (
              <button onClick={() => setShowAuth(true)} style={{
                background: C.primary, color: "white", border: "none", borderRadius: 99,
                padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>Connexion</button>
            )}
          </div>
        </div>

        {/* Pull-to-refresh indicator */}
        {(pullY > 0 || refreshing) && (
          <div style={{
            position: "fixed", top: 62, left: "50%",
            transform: `translateX(-50%) translateY(${refreshing ? 0 : Math.max(0, pullY - 20)}px)`,
            transition: pullY > 0 ? "none" : `transform 0.3s ${spring}`,
            zIndex: 99, pointerEvents: "none",
          }}>
            <div style={{
              background: C.white, borderRadius: 99,
              padding: "8px 18px", display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            }}>
              <span style={{
                fontSize: 18, display: "inline-block",
                animation: refreshing ? "spin 0.7s linear infinite" : "none",
                transform: refreshing ? undefined : `rotate(${Math.min(pullY * 2.5, 180)}deg)`,
                transition: "transform 0.1s",
              }}>☕</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, whiteSpace: "nowrap" }}>
                {refreshing ? "Actualisation…" : pullY >= PULL_THRESHOLD ? "Libérer !" : "Tirer pour actualiser"}
              </span>
            </div>
          </div>
        )}

        {/* Content area */}
        <div
          onTouchStart={onPullStart} onTouchMove={onPullMove} onTouchEnd={onPullEnd}
          style={{
            padding: "0 16px", paddingBottom: 100,
            transform: `translateY(${Math.min(pullY * 0.4, 32)}px)`,
            transition: pullY > 0 ? "none" : `transform 0.3s ${spring}`,
          }}>
          {loading ? (
            <SkeletonList count={7}/>
          ) : (
            <div key={tab} className={`page-slide-${slideDir}`}>
              {tab === "search" && (
                <SearchPage coffees={coffees} onOpen={handleOpenCoffee} onNotFound={handleNotFound}/>
              )}
              {tab === "scan" && (
                <ScanPage onFound={handleScanFound} onNotFound={handleNotFound} user={user}/>
              )}
              {tab === "bag" && (
                <CoffeeBagPage coffees={coffees} onOpen={handleOpenCoffee} user={user}/>
              )}
            </div>
          )}
        </div>

        {/* Bottom Tab Bar */}
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 430, zIndex: 100,
          background: `rgba(245,239,228,0.9)`, backdropFilter: "blur(20px) saturate(1.6)",
          borderTop: `1px solid ${C.light}`,
          padding: "6px 16px calc(env(safe-area-inset-bottom, 8px) + 6px)",
          display: "flex", justifyContent: "space-around", alignItems: "center",
        }}>
          {TABS.map(t => {
            const active = tab === t.id;
            const isScan = t.id === "scan";
            const handleTabClick = () => {
              if (t.id === tab) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
              }
              const oldIdx = TAB_ORDER.indexOf(tab);
              const newIdx = TAB_ORDER.indexOf(t.id);
              setSlideDir(newIdx > oldIdx ? "right" : "left");
              setTab(t.id);
            };
            return (
              <button key={t.id} onClick={handleTabClick} style={{
                background: isScan
                  ? (active ? C.primary : C.accent)
                  : "transparent",
                border: "none",
                borderRadius: isScan ? 99 : 0,
                padding: isScan ? "10px 20px" : "6px 12px",
                cursor: "pointer",
                display: "flex", flexDirection: isScan ? "row" : "column",
                alignItems: "center", gap: isScan ? 6 : 2,
                transform: isScan && active ? "scale(1.05)" : "scale(1)",
                transition: `all 0.25s ${spring}`,
                boxShadow: isScan ? `0 4px 16px ${active ? C.primary : C.accent}55` : "none",
              }}>
                <TabIcon type={t.icon} active={active}/>
                <span style={{
                  fontSize: isScan ? 12 : 10, fontWeight: active ? 700 : 500,
                  color: isScan ? C.white : (active ? C.accent : C.muted),
                  transition: `color 0.2s ${ease}`,
                }}>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sheets */}
        <CoffeeDetailSheet
          coffee={detailCoffee}
          visible={!!detailCoffee}
          onClose={() => setDetailCoffee(null)}
          user={user}
        />
        <NotFoundSheet
          visible={showNotFound}
          onClose={() => setShowNotFound(false)}
          scannedEAN={scannedEAN}
          offData={offData}
          onAdd={handleNewCoffeeAdded}
          user={user}
        />
        <AuthSheet
          visible={showAuth}
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
        />
        <ProfileMenuSheet
          visible={showProfileMenu}
          onClose={() => setShowProfileMenu(false)}
          user={user}
          onOpenSettings={() => setShowSettings(true)}
          onOpenHelp={() => setShowHelp(true)}
          onOpenAbout={() => setShowAbout(true)}
          onLogout={handleLogout}
        />
        <SettingsSheet
          visible={showSettings}
          onClose={() => setShowSettings(false)}
          user={user}
          onLogout={handleLogout}
        />
        <HelpSheet
          visible={showHelp}
          onClose={() => setShowHelp(false)}
        />
        <AboutSheet
          visible={showAbout}
          onClose={() => setShowAbout(false)}
        />
      </div>
    </>
  );
}
