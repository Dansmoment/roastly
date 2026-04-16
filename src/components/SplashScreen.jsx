import { useState, useEffect } from 'react';
import { FONT_SERIF, ease } from '../lib/constants';

// ─── Palette splash (autonome, ne dépend pas de C pour éviter tout flash) ────
const BG    = "#0E0804";
const AMBER = "#C47A2A";
const GOLD  = "#D49040";
const CREAM = "#F5EFE4";

function SteamLine({ delay, x }) {
  return (
    <div style={{
      position: "absolute",
      bottom: "100%",
      left: x,
      width: 3,
      height: 22,
      borderRadius: 99,
      background: `linear-gradient(to top, ${AMBER}99, transparent)`,
      animation: `steamUp 1.8s ease-in-out ${delay}s infinite`,
      transformOrigin: "bottom center",
    }}/>
  );
}

function CoffeeCupIcon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      {/* Saucer */}
      <ellipse cx="40" cy="62" rx="26" ry="5" fill={AMBER} opacity="0.25"/>
      {/* Cup body */}
      <path
        d="M18 30 L22 62 Q22 66 28 66 L52 66 Q58 66 58 62 L62 30 Z"
        fill={`${AMBER}22`}
        stroke={AMBER}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Handle */}
      <path
        d="M62 38 Q74 38 74 48 Q74 58 62 58"
        fill="none"
        stroke={AMBER}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Coffee surface */}
      <ellipse cx="40" cy="30" rx="22" ry="5" fill={AMBER} opacity="0.5"/>
      {/* Swirl on surface */}
      <path
        d="M34 30 Q37 27 40 30 Q43 33 46 30"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

export function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0);
  // phase 0 = dark / phase 1 = logo / phase 2 = text / phase 3 = fade out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 250);
    const t2 = setTimeout(() => setPhase(2), 1100);
    const t3 = setTimeout(() => setPhase(3), 2400);
    const t4 = setTimeout(() => onDone(), 3050);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: BG,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 0,
      opacity: phase === 3 ? 0 : 1,
      transition: phase === 3 ? "opacity 0.65s ease" : "none",
    }}>

      {/* CSS animations */}
      <style>{`
        @keyframes steamUp {
          0%   { transform: translateY(0) scaleX(1);   opacity: 0; }
          20%  { opacity: 0.7; }
          60%  { transform: translateY(-28px) scaleX(1.4); opacity: 0.4; }
          100% { transform: translateY(-44px) scaleX(0.8); opacity: 0; }
        }
        @keyframes splashRing {
          0%   { transform: translate(-50%,-50%) scale(0.6); opacity: 0.5; }
          100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0; }
        }
        @keyframes splashLogoIn {
          0%   { transform: scale(0.55) translateY(12px); opacity: 0; }
          65%  { transform: scale(1.06) translateY(-3px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes splashTextIn {
          0%   { transform: translateY(18px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes splashTagIn {
          0%   { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes shimmer {
          0%   { opacity: 0.4; }
          50%  { opacity: 0.9; }
          100% { opacity: 0.4; }
        }
      `}</style>

      {/* Ambient rings */}
      {phase >= 1 && [280, 380, 480].map((size, i) => (
        <div key={size} style={{
          position: "absolute", top: "42%", left: "50%",
          width: size, height: size, borderRadius: "50%",
          border: `1px solid ${AMBER}`,
          opacity: 0,
          animation: `splashRing 3s ease-out ${i * 0.5}s infinite`,
        }}/>
      ))}

      {/* Glow behind cup */}
      <div style={{
        position: "absolute", top: "38%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 160, height: 160, borderRadius: "50%",
        background: `radial-gradient(circle, ${AMBER}28 0%, transparent 70%)`,
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}/>

      {/* Logo cup + steam */}
      <div style={{
        position: "relative",
        display: "flex", flexDirection: "column", alignItems: "center",
        animation: phase >= 1 ? `splashLogoIn 0.85s cubic-bezier(0.34,1.15,0.64,1) both` : "none",
        opacity: phase >= 1 ? 1 : 0,
        marginBottom: 28,
      }}>
        {/* Steam lines */}
        <div style={{ position: "relative", height: 44, width: 80, marginBottom: -4 }}>
          {phase >= 1 && (
            <>
              <SteamLine delay={0.1} x="24px"/>
              <SteamLine delay={0.6} x="37px"/>
              <SteamLine delay={0.3} x="50px"/>
            </>
          )}
        </div>

        <CoffeeCupIcon size={88}/>
      </div>

      {/* Brand name */}
      <div style={{ textAlign: "center" }}>
        <p style={{
          fontFamily: FONT_SERIF, fontWeight: 700,
          fontSize: 48, color: CREAM,
          margin: "0 0 6px", letterSpacing: "-1px",
          lineHeight: 1,
          opacity: phase >= 2 ? 1 : 0,
          animation: phase >= 2 ? `splashTextIn 0.55s cubic-bezier(0.4,0,0.2,1) both` : "none",
        }}>
          Roastly<span style={{ color: AMBER }}>.</span>
        </p>

        <p style={{
          color: `${CREAM}55`,
          fontSize: 13,
          fontWeight: 400,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          margin: 0,
          opacity: phase >= 2 ? 1 : 0,
          animation: phase >= 2 ? `splashTagIn 0.55s ease 0.15s both` : "none",
        }}>
          Explorez le monde du café
        </p>
      </div>

      {/* Bottom dot indicator */}
      <div style={{
        position: "absolute", bottom: 52,
        display: "flex", gap: 6,
        opacity: phase >= 2 ? 1 : 0,
        transition: "opacity 0.4s ease 0.3s",
      }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: i === 1 ? 20 : 6, height: 6,
            borderRadius: 99,
            background: i === 1 ? AMBER : `${AMBER}44`,
            transition: "all 0.3s ease",
            animation: i === 1 ? `shimmer 1.5s ease-in-out infinite` : "none",
          }}/>
        ))}
      </div>

    </div>
  );
}
