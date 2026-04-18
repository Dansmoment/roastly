const EMOJIS_ORDER = ["☕","🫘","🌿","🍂","✨","🌸","🍫","🫐","🔥","🌍"];

export function emojiToIndex(emoji) {
  const i = EMOJIS_ORDER.indexOf(emoji);
  return i >= 0 ? i : 0;
}

// All SVGs: white strokes/fills on gradient background
const SHAPES = [
  // 0 ☕ — Espresso cup
  (s) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="27.5" rx="9.5" ry="2.2" fill="rgba(255,255,255,0.12)"/>
      <path d="M8 14 L10 23 Q10 25 13 25 L19 25 Q22 25 22 23 L24 14 Z"
        fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M24 18 Q29 18 29 21 Q29 24 24 24"
        fill="none" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
      <ellipse cx="16" cy="14" rx="8" ry="2.2" fill="rgba(255,255,255,0.4)"/>
      <path d="M13 10 Q11.8 8 13 6" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M16 9 Q14.8 7 16 5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M19 10 Q17.8 8 19 6" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  ),
  // 1 🫘 — Coffee bean cross-section
  (s) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="16" rx="10" ry="13" fill="rgba(255,255,255,0.18)" stroke="white" strokeWidth="1.4"/>
      <path d="M11 5 Q14 10 14 16 Q14 22 11 27"
        fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M21 5 Q18 10 18 16 Q18 22 21 27"
        fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.9" strokeLinecap="round"/>
    </svg>
  ),
  // 2 🌿 — Coffee branch with leaves
  (s) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M16 28 Q16 20 16 6" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 21 Q10 19 7 15" fill="none" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M16 14 Q22 12 25 8" fill="none" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
      <ellipse cx="8.5" cy="13" rx="5.5" ry="3" transform="rotate(-30 8.5 13)"
        fill="rgba(255,255,255,0.28)" stroke="white" strokeWidth="1.1"/>
      <ellipse cx="24" cy="7.5" rx="5.5" ry="3" transform="rotate(-30 24 7.5)"
        fill="rgba(255,255,255,0.28)" stroke="white" strokeWidth="1.1"/>
      <circle cx="16" cy="22" r="2.8" fill="rgba(255,255,255,0.32)" stroke="white" strokeWidth="1"/>
      <circle cx="12.5" cy="25.5" r="2.2" fill="rgba(255,255,255,0.22)" stroke="white" strokeWidth="0.9"/>
    </svg>
  ),
  // 3 🍂 — Coffee cherry cluster
  (s) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M16 7 Q14 13 12 17" fill="none" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M16 7 Q18 13 20 17" fill="none" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M14 11 Q10 15 8.5 20" fill="none" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
      <circle cx="12" cy="21" r="5" fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="1.3"/>
      <circle cx="20" cy="21" r="5" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.3"/>
      <circle cx="8.5" cy="23.5" r="3.8" fill="rgba(255,255,255,0.16)" stroke="white" strokeWidth="1.1"/>
      <circle cx="12" cy="19" r="1" fill="rgba(255,255,255,0.6)"/>
      <circle cx="20" cy="19" r="1" fill="rgba(255,255,255,0.6)"/>
    </svg>
  ),
  // 4 ✨ — Pour-over dripper
  (s) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M7 6 L12 22 Q12.5 24 16 24 Q19.5 24 20 22 L25 6 Z"
        fill="rgba(255,255,255,0.18)" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M6 6 L26 6" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M16 24 L16 28" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      <ellipse cx="16" cy="28.5" rx="4" ry="1.5" fill="rgba(255,255,255,0.2)"/>
      <path d="M11 11 L21 11" stroke="rgba(255,255,255,0.4)" strokeWidth="0.9" strokeLinecap="round"/>
      <path d="M12.5 15.5 L19.5 15.5" stroke="rgba(255,255,255,0.3)" strokeWidth="0.9" strokeLinecap="round"/>
      <path d="M14 20 L18 20" stroke="rgba(255,255,255,0.2)" strokeWidth="0.9" strokeLinecap="round"/>
    </svg>
  ),
  // 5 🌸 — Coffee blossom
  (s) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="7.5" rx="3.5" ry="6" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.1"/>
      <ellipse cx="16" cy="24.5" rx="3.5" ry="6" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.1"/>
      <ellipse cx="7.5" cy="16" rx="6" ry="3.5" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.1"/>
      <ellipse cx="24.5" cy="16" rx="6" ry="3.5" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.1"/>
      <ellipse cx="10" cy="10" rx="3.5" ry="6" transform="rotate(45 10 10)"
        fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.9"/>
      <ellipse cx="22" cy="22" rx="3.5" ry="6" transform="rotate(45 22 22)"
        fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.9"/>
      <ellipse cx="22" cy="10" rx="3.5" ry="6" transform="rotate(-45 22 10)"
        fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.9"/>
      <ellipse cx="10" cy="22" rx="3.5" ry="6" transform="rotate(-45 10 22)"
        fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.9"/>
      <circle cx="16" cy="16" r="4.5" fill="rgba(255,255,255,0.45)"/>
      <circle cx="16" cy="16" r="2.2" fill="rgba(255,255,255,0.75)"/>
    </svg>
  ),
  // 6 🍫 — French press
  (s) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <rect x="10" y="9" width="12" height="17" rx="2.5"
        fill="rgba(255,255,255,0.18)" stroke="white" strokeWidth="1.3"/>
      <path d="M16 9 L16 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="13" y="4" width="6" height="2.5" rx="1.2"
        fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="1"/>
      <path d="M22 17 Q27 17 27 20.5 Q27 24 22 24"
        fill="none" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M10 17.5 L22 17.5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round"/>
      <rect x="11" y="18.5" width="10" height="7" rx="1.5"
        fill="rgba(255,255,255,0.12)"/>
      <path d="M9.5 26 L22.5 26" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  // 7 🫐 — Moka pot
  (s) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M12 27 L10.5 19 Q10 17 12 16 L20 16 Q22 17 21.5 19 L20 27 Z"
        fill="rgba(255,255,255,0.18)" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M13 16 Q11.5 11.5 13.5 9 L18.5 9 Q20.5 11.5 19 16"
        fill="rgba(255,255,255,0.22)" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
      <ellipse cx="16" cy="8.8" rx="2.5" ry="1.8" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="1"/>
      <path d="M16 8 L16 5.5" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M13.5 5.5 L18.5 5.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M21.5 20 Q26 20 26 23 Q26 26 21.5 26"
        fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="16" cy="27" rx="4" ry="1.2" fill="rgba(255,255,255,0.2)"/>
    </svg>
  ),
  // 8 🔥 — Roaster drum
  (s) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <rect x="5" y="11" width="22" height="13" rx="6.5"
        fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.3"/>
      <path d="M5 17.5 L27 17.5" stroke="rgba(255,255,255,0.35)" strokeWidth="0.9"/>
      <circle cx="16" cy="17.5" r="3.2" fill="rgba(255,255,255,0.35)" stroke="white" strokeWidth="1"/>
      <path d="M3.5 11 L28.5 11" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M11 24 L11 28" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M21 24 L21 28" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M11 28 Q16 27 21 28" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M13 7 Q12 5 13 3" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M16 6 Q15 4 16 2" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M19 7 Q18 5 19 3" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  ),
  // 9 🌍 — Globe with coffee origin markers
  (s) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="12" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.3"/>
      <ellipse cx="16" cy="16" rx="6" ry="12" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.9"/>
      <path d="M4 16 L28 16" stroke="rgba(255,255,255,0.35)" strokeWidth="0.9"/>
      <path d="M5.5 11 Q10 9.5 16 11 Q22 9.5 26.5 11"
        fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8"/>
      <path d="M5.5 21 Q10 22.5 16 21 Q22 22.5 26.5 21"
        fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8"/>
      <circle cx="11" cy="14" r="1.8" fill="white" opacity="0.72"/>
      <circle cx="20" cy="12" r="1.8" fill="white" opacity="0.72"/>
      <circle cx="17.5" cy="19.5" r="1.8" fill="white" opacity="0.72"/>
      <circle cx="11" cy="14" r="0.8" fill="rgba(0,0,0,0.2)"/>
      <circle cx="20" cy="12" r="0.8" fill="rgba(0,0,0,0.2)"/>
      <circle cx="17.5" cy="19.5" r="0.8" fill="rgba(0,0,0,0.2)"/>
    </svg>
  ),
];

export function CoffeeIllustration({ emoji, size = 32 }) {
  const idx = emojiToIndex(emoji);
  return SHAPES[idx](size);
}
