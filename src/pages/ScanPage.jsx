import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { C, FONT_SERIF, ease, spring } from '../lib/constants';
import { Stars } from '../components/Atoms';
import * as api from '../lib/api';

const BARCODE_FORMATS = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.QR_CODE,
];

// Full-screen fixed overlay covering the whole app
const FULLSCREEN = {
  position: "fixed",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
  width: "100%",
  maxWidth: 430,
  height: "100dvh",
  zIndex: 200,
  overflow: "hidden",
};

function BackButton({ onBack }) {
  return (
    <button onClick={onBack} style={{
      position: "absolute", top: 52, left: 20, zIndex: 210,
      background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 99,
      width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", backdropFilter: "blur(8px)",
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
  );
}

export function ScanPage({ onFound, onNotFound, onBack, user }) {
  const [phase, setPhase] = useState("intro"); // intro | scanning | loading | found | not_found | error
  const [logoVisible, setLogoVisible] = useState(false);
  const [foundCoffee, setFoundCoffee] = useState(null);
  const [lastEAN, setLastEAN] = useState("");
  const [offData, setOffData] = useState(null);
  const scannerRef = useRef(null);
  const scannerId = useRef("roastly-scanner-" + Date.now()).current;
  const mountedRef = useRef(true);

  // Intro: animate logo in, then launch camera after 2s
  useEffect(() => {
    mountedRef.current = true;
    const t1 = setTimeout(() => setLogoVisible(true), 80);
    const t2 = setTimeout(() => { if (mountedRef.current) setPhase("scanning"); }, 2000);
    return () => {
      mountedRef.current = false;
      clearTimeout(t1);
      clearTimeout(t2);
      stopScanner();
    };
  }, []);

  // Start camera when phase becomes "scanning"
  useEffect(() => {
    if (phase !== "scanning") return;
    const timer = setTimeout(async () => {
      if (!mountedRef.current) return;
      const el = document.getElementById(scannerId);
      if (!el) return;
      try {
        scannerRef.current = new Html5Qrcode(scannerId, {
          formatsToSupport: BARCODE_FORMATS,
          verbose: false,
        });
        await scannerRef.current.start(
          { facingMode: "environment" },
          {
            fps: 15,
            qrbox: (vw, vh) => ({
              width: Math.round(Math.min(vw * 0.85, 320)),
              height: Math.round(Math.min(vw * 0.85, 320) * 0.4),
            }),
          },
          handleDetection,
          () => {}
        );
      } catch {
        if (mountedRef.current) setPhase("error");
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [phase]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === 2) await scannerRef.current.stop();
      } catch {}
      scannerRef.current = null;
    }
  }, []);

  const handleDetection = useCallback(async (decodedText) => {
    if (!mountedRef.current) return;
    const ean = decodedText.trim();
    setLastEAN(ean);
    if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
    await stopScanner();
    try {
      setPhase("loading");
      const found = await api.lookupByEAN(ean);
      if (!mountedRef.current) return;
      if (found) {
        setFoundCoffee(found);
        setPhase("found");
        if (user) api.addScanToHistory({ userId: user.id, coffeeId: found.id, ean, found: true }).catch(() => {});
      } else {
        const off = await api.fetchFromOpenFoodFacts(ean);
        setOffData(off);
        setPhase("not_found");
        if (user) api.addScanToHistory({ userId: user.id, coffeeId: null, ean, found: false }).catch(() => {});
      }
    } catch {
      if (mountedRef.current) setPhase("not_found");
    }
  }, [user, stopScanner]);

  const resetScan = useCallback(async () => {
    await stopScanner();
    setFoundCoffee(null);
    setLastEAN("");
    setOffData(null);
    setPhase("scanning");
  }, [stopScanner]);

  // ── INTRO ────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div style={{ ...FULLSCREEN, background: C.primary }}>
        <BackButton onBack={onBack}/>
        {/* Ambient rings */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 280, height: 280, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}22 0%, transparent 70%)`,
          animation: "pulse 2.5s ease-in-out infinite",
        }}/>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 180, height: 180, borderRadius: "50%",
          border: `1px solid ${C.accent}33`,
          animation: "pulse 2.5s ease-in-out infinite 0.4s",
        }}/>

        {/* Logo centré */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -60%)",
          textAlign: "center",
          opacity: logoVisible ? 1 : 0,
          animation: logoVisible ? `rotateCoffee 0.7s cubic-bezier(0.34,1.2,0.64,1) both` : "none",
        }}>
          <svg width="72" height="72" viewBox="0 0 30 30" fill="none" style={{ display: "block", margin: "0 auto 16px" }}>
            <ellipse cx="15" cy="15" rx="9" ry="12" fill={C.accent} opacity="0.18"/>
            <ellipse cx="15" cy="15" rx="9" ry="12" stroke={C.accent} strokeWidth="1.8"/>
            <path d="M15 4 C11.5 8.5 11.5 21.5 15 26" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <p style={{
            fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 38,
            color: "white", margin: "0 0 8px",
            letterSpacing: "-0.5px",
          }}>
            Roastly<span style={{ color: C.accent }}>.</span>
          </p>
          <p style={{
            color: "rgba(255,255,255,0.45)", fontSize: 13,
            animation: `slideUp 0.5s ${ease} 0.5s both`,
          }}>
            Pointez vers un code-barres
          </p>
        </div>

        {/* Barre de chargement en bas */}
        <div style={{
          position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)",
          width: 120, height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 99,
          overflow: "hidden",
          animation: `slideUp 0.4s ${ease} 0.8s both`,
        }}>
          <div style={{
            height: "100%", background: C.accent, borderRadius: 99,
            animation: "loadBar 1.2s cubic-bezier(0.4,0,0.2,1) 0.8s forwards",
            width: "0%",
          }}/>
        </div>

        <style>{`
          @keyframes loadBar {
            from { width: 0% }
            to   { width: 100% }
          }
        `}</style>
      </div>
    );
  }

  // ── SCANNING ─────────────────────────────────────────────────────────────
  if (phase === "scanning" || phase === "error") {
    return (
      <div style={{ ...FULLSCREEN, background: "#000" }}>
        <BackButton onBack={() => { stopScanner(); onBack(); }}/>
        {/* Camera div — html5-qrcode injects video here */}
        <div
          id={scannerId}
          className="roastly-scanner-fullscreen"
          style={{ position: "absolute", inset: 0, zIndex: 201 }}
        />

        {/* Gradient top overlay */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 202,
          padding: "56px 24px 28px",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)",
          pointerEvents: "none",
        }}>
          <p style={{
            color: "white", fontFamily: FONT_SERIF,
            fontSize: 24, fontWeight: 700, margin: "0 0 4px",
            animation: `slideUp 0.4s ${ease} both`,
          }}>Scanner</p>
          <p style={{
            color: "rgba(255,255,255,0.55)", fontSize: 13, margin: 0,
            animation: `slideUp 0.4s ${ease} 0.1s both`,
          }}>
            Alignez le code-barres dans le cadre
          </p>
        </div>

        {/* Scan frame overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 202,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          {/* Dark vignette sides */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 75% 35% at 50% 50%, transparent 100%, rgba(0,0,0,0.55) 100%)",
          }}/>

          {/* Scan frame */}
          <div style={{
            width: "82%", maxWidth: 310, position: "relative",
            animation: `fadeIn 0.4s ${ease} 0.2s both`,
          }}>
            {/* Corner brackets */}
            {[
              { top: -1, left: -1,   borderTop: `3px solid ${C.accent}`, borderLeft: `3px solid ${C.accent}`,   borderRadius: "10px 0 0 0" },
              { top: -1, right: -1,  borderTop: `3px solid ${C.accent}`, borderRight: `3px solid ${C.accent}`,  borderRadius: "0 10px 0 0" },
              { bottom: -1, left: -1,  borderBottom: `3px solid ${C.accent}`, borderLeft: `3px solid ${C.accent}`,   borderRadius: "0 0 0 10px" },
              { bottom: -1, right: -1, borderBottom: `3px solid ${C.accent}`, borderRight: `3px solid ${C.accent}`,  borderRadius: "0 0 10px 0" },
            ].map((s, i) => (
              <div key={i} style={{ position: "absolute", width: 32, height: 32, ...s }}/>
            ))}

            {/* Scanline */}
            <div style={{
              height: 2, margin: "44px 0",
              background: `linear-gradient(90deg, transparent, ${C.accent}CC, ${C.accent}, ${C.accent}CC, transparent)`,
              animation: "scanline 2s ease-in-out infinite",
              borderRadius: 99,
            }}/>
          </div>
        </div>

        {/* Bottom hint */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 202,
          padding: "24px 24px calc(env(safe-area-inset-bottom, 16px) + 80px)",
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
          textAlign: "center",
          animation: `slideUp 0.4s ${ease} 0.3s both`,
        }}>
          {phase === "error" ? (
            <>
              <p style={{ color: "white", fontWeight: 600, fontSize: 16, margin: "0 0 6px" }}>📷 Caméra indisponible</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0 }}>Autorisez l'accès dans les réglages</p>
            </>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
              EAN-13 · UPC-A · Code 128
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div style={{
        ...FULLSCREEN, background: C.primary,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 20,
      }}>
        <BackButton onBack={onBack}/>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          border: `3px solid rgba(255,255,255,0.15)`,
          borderTop: `3px solid ${C.accent}`,
          animation: "spin 0.8s linear infinite",
        }}/>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, fontWeight: 600 }}>
          Recherche en cours…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── FOUND ─────────────────────────────────────────────────────────────────
  if (phase === "found" && foundCoffee) {
    return (
      <div style={{
        ...FULLSCREEN,
        background: `linear-gradient(160deg, ${foundCoffee.gradient[0]} 0%, ${foundCoffee.gradient[1]} 100%)`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 32px",
      }}>
        {/* Flash vert au scan réussi */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
          background: "rgba(60,220,100,0.45)",
          animation: "flashFade 0.55s ease forwards",
        }}/>
        {/* Success checkmark */}
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20,
          animation: `popIn 0.5s cubic-bezier(0.34,1.2,0.64,1) both`,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <div style={{
          fontSize: 80, marginBottom: 16,
          animation: `popIn 0.5s cubic-bezier(0.34,1.2,0.64,1) 0.1s both`,
        }}>{foundCoffee.emoji}</div>

        <p style={{
          color: "white", fontWeight: 700, fontSize: 28,
          fontFamily: FONT_SERIF, textAlign: "center",
          margin: "0 0 6px", letterSpacing: "-0.3px",
          animation: `slideUp 0.4s ${ease} 0.2s both`,
        }}>{foundCoffee.name}</p>

        <p style={{
          color: "rgba(255,255,255,0.65)", fontSize: 16,
          margin: "0 0 18px",
          animation: `slideUp 0.4s ${ease} 0.25s both`,
        }}>{foundCoffee.brand}</p>

        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 40,
          animation: `slideUp 0.4s ${ease} 0.3s both`,
        }}>
          <span style={{ color: "white", fontWeight: 800, fontSize: 32, fontFamily: FONT_SERIF }}>
            {foundCoffee.avg_rating}
          </span>
          <Stars rating={foundCoffee.avg_rating} size={18}/>
        </div>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, animation: `slideUp 0.4s ${ease} 0.35s both` }}>
          <button onClick={() => onFound(foundCoffee)} style={{
            background: "rgba(255,255,255,0.22)",
            border: "2px solid rgba(255,255,255,0.45)",
            borderRadius: 99, padding: "16px 32px",
            color: "white", fontSize: 16, fontWeight: 700,
            cursor: "pointer", backdropFilter: "blur(12px)",
            width: "100%",
          }}>Voir la fiche →</button>

          <button onClick={resetScan} style={{
            background: "transparent", border: "none",
            color: "rgba(255,255,255,0.55)", fontSize: 14,
            cursor: "pointer", padding: "10px",
          }}>Scanner un autre café</button>
        </div>
      </div>
    );
  }

  // ── NOT FOUND ─────────────────────────────────────────────────────────────
  if (phase === "not_found") {
    return (
      <div style={{
        ...FULLSCREEN,
        background: C.dark,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 32px",
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          border: `2px solid rgba(255,255,255,0.15)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, marginBottom: 24,
          animation: `popIn 0.5s cubic-bezier(0.34,1.2,0.64,1) both`,
        }}>🔍</div>

        <p style={{
          color: "white", fontWeight: 700, fontSize: 26,
          fontFamily: FONT_SERIF, textAlign: "center",
          margin: "0 0 10px",
          animation: `slideUp 0.4s ${ease} 0.15s both`,
        }}>Café introuvable</p>

        <p style={{
          color: "rgba(255,255,255,0.4)", fontSize: 14,
          textAlign: "center", margin: "0 0 40px", lineHeight: 1.6,
          animation: `slideUp 0.4s ${ease} 0.2s both`,
        }}>
          Ce café n'est pas encore dans<br/>notre base de données.
        </p>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, animation: `slideUp 0.4s ${ease} 0.25s both` }}>
          <button onClick={() => onNotFound(lastEAN, offData)} style={{
            background: C.accent, border: "none",
            borderRadius: 99, padding: "16px 32px",
            color: "white", fontSize: 16, fontWeight: 700,
            cursor: "pointer", width: "100%",
            boxShadow: `0 8px 24px ${C.accent}55`,
          }}>
            ＋ Ajouter ce café
          </button>

          <button onClick={resetScan} style={{
            background: "rgba(255,255,255,0.08)",
            border: "1.5px solid rgba(255,255,255,0.12)",
            borderRadius: 99, padding: "14px 32px",
            color: "rgba(255,255,255,0.6)", fontSize: 14,
            cursor: "pointer", width: "100%",
          }}>Rescanner</button>
        </div>
      </div>
    );
  }

  return null;
}
