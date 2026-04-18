import { useState } from 'react';
import { C, FONT_SERIF, FONT_SANS, ease, spring } from '../lib/constants';

const SLIDES = [
  {
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="32" fill={`${C.accent}18`} stroke={`${C.accent}40`} strokeWidth="1.5"/>
        <path d="M22 38 L28 50 Q28 52 32 52 L40 52 Q44 52 44 50 L50 38 Z" fill={`${C.accent}30`} stroke={C.accent} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M50 42 Q57 42 57 47 Q57 52 50 52" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="36" cy="38" rx="14" ry="3.5" fill={C.accent} opacity="0.4"/>
        <path d="M30 38 Q33 35.5 36 38 Q39 40.5 42 38" fill="none" stroke={C.copper} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M29 32 Q27.5 29 29 26" fill="none" stroke={`${C.accent}99`} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M36 31 Q34.5 28 36 25" fill="none" stroke={`${C.accent}77`} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M43 32 Q41.5 29 43 26" fill="none" stroke={`${C.accent}99`} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: "Bienvenue sur Roastly.",
    subtitle: "Découvrez, explorez et notez\nles meilleurs cafés du monde.",
    color: C.accent,
  },
  {
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="32" fill={`${C.accent}18`} stroke={`${C.accent}40`} strokeWidth="1.5"/>
        <rect x="20" y="22" width="32" height="28" rx="4" fill={`${C.primary}15`} stroke={C.accent} strokeWidth="2"/>
        <path d="M26 30V26"/><path d="M46 30V26" stroke={C.accent} strokeWidth="2" strokeLinecap="round"/>
        <line x1="28" y1="36" x2="44" y2="36" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="36" cy="36" r="3" fill={C.accent} opacity="0.6"/>
        <path d="M26 30V26" stroke={C.accent} strokeWidth="2" strokeLinecap="round"/>
        <path d="M46 30V26" stroke={C.accent} strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 42 L36 52 L52 42" fill="none" stroke={`${C.accent}55`} strokeWidth="1.5"/>
      </svg>
    ),
    title: "Scannez vos paquets",
    subtitle: "Pointez la caméra vers le\ncode-barres — on trouve tout le reste.",
    color: C.roast,
  },
  {
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="32" fill={`${C.accent}18`} stroke={`${C.accent}40`} strokeWidth="1.5"/>
        <path d="M36 24 L39.1 30.8 L47 31.6 L41.5 36.8 L43.1 44.7 L36 40.8 L28.9 44.7 L30.5 36.8 L25 31.6 L32.9 30.8 Z" fill={C.accent} stroke={C.copper} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M22 54 Q29 50 36 52 Q43 50 50 54" fill="none" stroke={`${C.accent}66`} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Notez & sauvegardez",
    subtitle: "Gardez une trace de vos\ncafés favoris et partagez vos avis.",
    color: C.copper,
  },
];

export function OnboardingScreen({ onDone }) {
  const [slide, setSlide] = useState(0);
  const [exiting, setExiting] = useState(false);

  const next = () => {
    if (slide < SLIDES.length - 1) {
      setSlide(s => s + 1);
    } else {
      finish();
    }
  };

  const finish = () => {
    setExiting(true);
    localStorage.setItem('roastly_onboarded', '1');
    setTimeout(() => onDone(), 350);
  };

  const s = SLIDES[slide];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9990,
      background: C.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT_SANS,
      opacity: exiting ? 0 : 1,
      transition: `opacity 0.35s ${ease}`,
    }}>
      {/* Background gradient accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "50%",
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${s.color}14 0%, transparent 70%)`,
        transition: `background 0.4s ${ease}`,
        pointerEvents: "none",
      }}/>

      {/* Slide content */}
      <div key={slide} style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "0 40px", textAlign: "center", flex: 1,
        justifyContent: "center",
        animation: `slideUp 0.45s ${ease} both`,
      }}>
        <div style={{ marginBottom: 36 }}>{s.icon}</div>

        <h1 style={{
          fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 32,
          color: C.primary, margin: "0 0 14px", letterSpacing: "-0.5px",
          lineHeight: 1.15,
        }}>
          {s.title.includes("Roastly") ? (
            <>
              {s.title.replace("Roastly.", "")}
              <span style={{ color: C.accent }}>Roastly<span style={{ color: C.accent }}>.</span></span>
            </>
          ) : s.title}
        </h1>

        <p style={{
          color: C.muted, fontSize: 16, lineHeight: 1.65,
          margin: 0, whiteSpace: "pre-line",
        }}>
          {s.subtitle}
        </p>
      </div>

      {/* Bottom controls */}
      <div style={{ width: "100%", maxWidth: 430, padding: "0 32px 56px" }}>
        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
          {SLIDES.map((_, i) => (
            <div key={i} style={{
              width: i === slide ? 20 : 6, height: 6,
              borderRadius: 99,
              background: i === slide ? C.accent : `${C.accent}30`,
              transition: `all 0.3s ${spring}`,
            }}/>
          ))}
        </div>

        {/* CTA */}
        <button onClick={next} style={{
          width: "100%", padding: "16px 0",
          background: C.primary, border: "none", borderRadius: 99,
          color: "white", fontSize: 16, fontWeight: 700,
          cursor: "pointer", fontFamily: FONT_SANS,
          boxShadow: `0 8px 24px ${C.primary}30`,
          transition: `transform 0.12s ${ease}`,
        }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          onTouchStart={e => e.currentTarget.style.transform = "scale(0.97)"}
          onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {slide < SLIDES.length - 1 ? "Continuer →" : "C'est parti !"}
        </button>

        {/* Skip */}
        {slide < SLIDES.length - 1 && (
          <button onClick={finish} style={{
            background: "transparent", border: "none",
            color: C.muted, fontSize: 14, cursor: "pointer",
            display: "block", margin: "14px auto 0",
            fontFamily: FONT_SANS,
          }}>
            Passer
          </button>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
