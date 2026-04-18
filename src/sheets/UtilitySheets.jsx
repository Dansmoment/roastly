import { useState, useEffect } from 'react';
import { C, FONT_SERIF, FONT_SANS, ease, spring, FAQ_DATA } from '../lib/constants';
import { Sheet, Toggle, Section, FadeIn } from '../components/Atoms';
import * as api from '../lib/api';

async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  const result = await Notification.requestPermission();
  return result;
}

async function sendTestNotification() {
  if (Notification.permission !== 'granted') return;
  // Use service worker notification if available, else fallback
  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.ready;
    reg.showNotification('Roastly. ☕', {
      body: 'Notifications activées ! On vous dira quand de nouveaux cafés sont disponibles.',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [80, 40, 80],
    });
  } else {
    new Notification('Roastly. ☕', {
      body: 'Notifications activées !',
      icon: '/icons/icon-192.png',
    });
  }
}

export function SettingsSheet({ visible, onClose, user, onLogout, darkMode, onToggleDark }) {
  const [notifs, setNotifs] = useState(() => {
    return localStorage.getItem('roastly_notifs') === 'true' ||
      Notification?.permission === 'granted';
  });
  const [lang, setLang] = useState("fr");
  const [notifStatus, setNotifStatus] = useState(Notification?.permission || 'default');

  function SettingRow({ icon, label, right, onClick, danger }) {
    return (
      <div onClick={onClick} style={{
        display:"flex", alignItems:"center", gap:14, padding:"16px 0",
        borderBottom:`1px solid ${C.light}`, cursor: onClick ? "pointer" : "default",
      }}>
        <span style={{ fontSize:20, width:28, textAlign:"center" }}>{icon}</span>
        <span style={{ flex:1, color: danger ? "#D32F2F" : C.text, fontSize:15, fontWeight:500 }}>{label}</span>
        {right || (onClick && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ stroke: C.muted }} strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        ))}
      </div>
    );
  }

  return (
    <Sheet visible={visible} onClose={onClose}>
      <p style={{ color:C.dark, fontWeight:700, fontSize:22, fontFamily:FONT_SERIF, margin:"0 0 4px" }}>Paramètres</p>
      <p style={{ color:C.muted, fontSize:13, marginBottom:20 }}>Personnalisez votre expérience Roastly.</p>

      {user && (
        <div style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 0", borderBottom:`1px solid ${C.light}`, marginBottom:4 }}>
          <div style={{ width:48, height:48, background:C.accent, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color:"white" }}>{(user.user_metadata?.name || user.email)?.[0]?.toUpperCase()}</div>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:600, color:C.dark, fontSize:16, margin:0 }}>{user.user_metadata?.name || user.email?.split('@')[0]}</p>
            <p style={{ color:C.muted, fontSize:12, margin:0 }}>{user.email}</p>
          </div>
        </div>
      )}

      <p style={{ color:C.muted, fontSize:11, fontWeight:500, textTransform:"uppercase", letterSpacing:1.5, margin:"20px 0 4px" }}>Préférences</p>
      <SettingRow icon="🔔" label="Notifications"
        right={<Toggle on={notifs} onToggle={async () => {
          if (!notifs) {
            const perm = await requestNotificationPermission();
            setNotifStatus(perm);
            if (perm === 'granted') {
              setNotifs(true);
              localStorage.setItem('roastly_notifs', 'true');
              sendTestNotification();
            } else if (perm === 'denied') {
              alert("Les notifications sont bloquées. Autorisez-les dans les réglages de votre appareil.");
            }
          } else {
            setNotifs(false);
            localStorage.setItem('roastly_notifs', 'false');
          }
        }}/>}
      />
      {notifStatus === 'denied' && (
        <p style={{ color: C.muted, fontSize: 12, marginTop: -8, marginBottom: 8, paddingLeft: 42 }}>
          Bloquées dans les réglages système
        </p>
      )}
      <SettingRow icon="🌙" label="Mode sombre" right={<Toggle on={darkMode} onToggle={onToggleDark}/>}/>
      <SettingRow icon="🌍" label="Langue" right={<span style={{ color:C.muted, fontSize:13 }}>{lang === "fr" ? "Français" : "English"}</span>} onClick={() => setLang(l => l === "fr" ? "en" : "fr")}/>

      <p style={{ color:C.muted, fontSize:11, fontWeight:500, textTransform:"uppercase", letterSpacing:1.5, margin:"20px 0 4px" }}>Données</p>
      <SettingRow icon="📦" label="Exporter mes données" onClick={() => {
        const data = { exported_at: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type:"application/json" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
        a.download = "roastly-export.json"; a.click();
      }}/>

      <p style={{ color:C.muted, fontSize:11, fontWeight:500, textTransform:"uppercase", letterSpacing:1.5, margin:"20px 0 4px" }}>Informations</p>
      <SettingRow icon="📱" label="Version" right={<span style={{ color:C.muted, fontSize:13 }}>2.0.0</span>}/>
      <SettingRow icon="📜" label="Conditions d'utilisation" onClick={() => alert("CGU — Roastly. est une application de découverte de café. En utilisant l'application, vous acceptez nos conditions d'utilisation.")}/>
      <SettingRow icon="🔒" label="Politique de confidentialité" onClick={() => alert("Vos données sont stockées de manière sécurisée via Supabase. Nous ne partageons aucune donnée personnelle avec des tiers.")}/>

      {user && (
        <>
          <div style={{ height:20 }}/>
          <SettingRow icon="🚪" label="Se déconnecter" danger onClick={() => { onLogout(); onClose(); }}/>
        </>
      )}
    </Sheet>
  );
}

export function HelpSheet({ visible, onClose }) {
  const [openIdx, setOpenIdx] = useState(-1);
  const [searchQ, setSearchQ] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const [contactMsg, setContactMsg] = useState("");

  useEffect(() => { if (visible) { setOpenIdx(-1); setContactSent(false); setContactMsg(""); setSearchQ(""); } }, [visible]);

  const filtered = searchQ
    ? FAQ_DATA.filter(f => f.q.toLowerCase().includes(searchQ.toLowerCase()) || f.a.toLowerCase().includes(searchQ.toLowerCase()))
    : FAQ_DATA;

  return (
    <Sheet visible={visible} onClose={onClose}>
      <p style={{ color:C.dark, fontWeight:700, fontSize:22, fontFamily:FONT_SERIF, margin:"0 0 4px" }}>Aide & FAQ</p>
      <p style={{ color:C.muted, fontSize:13, marginBottom:24 }}>Trouvez rapidement les réponses à vos questions.</p>

      <div style={{ background:C.white, border:`1.5px solid ${C.light}`, borderRadius:14, display:"flex", alignItems:"center", padding:"10px 14px", gap:10, marginBottom:24 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ stroke: C.muted }} strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Rechercher dans la FAQ..." style={{
          border:"none", outline:"none", flex:1, fontSize:14, color:C.text, background:"transparent",
        }}/>
        {searchQ && <button onClick={() => setSearchQ("")} style={{ border:"none", background:"none", color:C.muted, cursor:"pointer", fontSize:16 }}>×</button>}
      </div>

      <p style={{ color:C.muted, fontSize:11, fontWeight:500, textTransform:"uppercase", letterSpacing:1.5, marginBottom:12 }}>Questions fréquentes</p>

      {filtered.length === 0 && <p style={{ color:C.muted, fontSize:13, textAlign:"center", padding:20 }}>Aucun résultat pour "{searchQ}"</p>}

      {filtered.map((faq, i) => {
        const realIdx = FAQ_DATA.indexOf(faq);
        const isOpen = openIdx === realIdx;
        return (
          <div key={realIdx} style={{ borderBottom:`1px solid ${C.light}` }}>
            <div onClick={() => setOpenIdx(isOpen ? -1 : realIdx)} style={{
              display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", cursor:"pointer", gap:12,
            }}>
              <p style={{ color:C.text, fontSize:14, fontWeight:600, margin:0, flex:1 }}>{faq.q}</p>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ stroke: C.muted }} strokeWidth="2"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition:`transform 0.25s ${ease}`, flexShrink:0 }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            <div style={{ maxHeight: isOpen ? 200 : 0, overflow:"hidden", transition:`max-height 0.3s ${ease}` }}>
              <p style={{ color:C.muted, fontSize:13, lineHeight:1.7, margin:"0 0 16px", paddingRight:20 }}>{faq.a}</p>
            </div>
          </div>
        );
      })}

      <div style={{ marginTop:28 }}>
        <p style={{ color:C.muted, fontSize:11, fontWeight:500, textTransform:"uppercase", letterSpacing:1.5, marginBottom:12 }}>Nous contacter</p>
        {!contactSent ? (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <textarea value={contactMsg} onChange={e => setContactMsg(e.target.value)}
              placeholder="Décrivez votre problème ou suggestion..." rows={4} style={{
                width:"100%", border:`1.5px solid ${C.light}`, borderRadius:14,
                padding:"12px 14px", fontSize:14, color:C.text, background:C.white,
                outline:"none", boxSizing:"border-box", fontFamily:"inherit", resize:"vertical",
              }}/>
            <button onClick={() => { if (contactMsg.trim()) setContactSent(true); }} style={{
              background:C.primary, color:"white", border:"none", borderRadius:14,
              padding:"13px", fontSize:14, fontWeight:600, cursor:"pointer",
              opacity: contactMsg.trim() ? 1 : 0.5,
            }}>Envoyer le message</button>
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <p style={{ fontSize:40, marginBottom:8 }}>✉️</p>
            <p style={{ color:C.green, fontWeight:700, fontSize:15 }}>Message envoyé !</p>
            <p style={{ color:C.muted, fontSize:13, marginTop:4 }}>Nous vous répondrons sous 24h.</p>
          </div>
        )}
      </div>
    </Sheet>
  );
}

export function AboutSheet({ visible, onClose }) {
  return (
    <Sheet visible={visible} onClose={onClose}>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <svg width="44" height="44" viewBox="0 0 30 30" fill="none">
            <ellipse cx="15" cy="15" rx="9" ry="12" style={{ fill: C.accent }} opacity="0.15"/>
            <ellipse cx="15" cy="15" rx="9" ry="12" style={{ stroke: C.accent }} strokeWidth="1.6"/>
            <path d="M15 4 C11.5 8.5 11.5 21.5 15 26" style={{ stroke: C.accent }} strokeWidth="1.6" strokeLinecap="round"/>
            <path d="M15 4 C18.5 8.5 18.5 21.5 15 26" style={{ stroke: C.accent }} strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
          </svg>
          <div>
            <span style={{ fontFamily:FONT_SERIF, fontWeight:700, fontSize:32, color:C.primary }}>Roastly</span>
            <span style={{ fontFamily:FONT_SERIF, fontWeight:700, fontSize:32, color:C.accent }}>.</span>
          </div>
        </div>
        <p style={{ color:C.muted, fontSize:13 }}>Version 2.0.0</p>
      </div>

      <Section title="Notre mission">
        <p style={{ color:C.text, fontSize:14, lineHeight:1.7, margin:0 }}>
          Roastly. est né d'une passion simple : rendre le monde du café de spécialité accessible à tous.
          Comme Vivino l'a fait pour le vin, nous voulons vous aider à découvrir, comprendre et apprécier
          chaque tasse de café que vous buvez.
        </p>
      </Section>

      <Section title="Comment ça marche">
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          {[
            { step:"01", icon:"📷", title:"Scannez", desc:"Pointez votre caméra vers le code-barres de votre café" },
            { step:"02", icon:"🔍", title:"Découvrez", desc:"Accédez au profil aromatique, à l'origine et aux labels" },
            { step:"03", icon:"⭐", title:"Évaluez", desc:"Partagez votre avis et affinez votre profil de goût" },
            { step:"04", icon:"📊", title:"Progressez", desc:"Explorez de nouveaux cafés selon vos préférences" },
          ].map(s => (
            <div key={s.step} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
              <span style={{ color:C.accent, fontWeight:700, fontSize:12, fontFamily:FONT_SERIF, minWidth:20 }}>{s.step}</span>
              <span style={{ fontSize:24 }}>{s.icon}</span>
              <div>
                <p style={{ color:C.dark, fontWeight:600, fontSize:15, margin:"0 0 2px", fontFamily:FONT_SERIF }}>{s.title}</p>
                <p style={{ color:C.muted, fontSize:13, margin:0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div style={{ textAlign:"center", padding:"20px 0" }}>
        <p style={{ color:C.muted, fontSize:12 }}>Fait avec ☕ et ❤️ à Paris</p>
        <p style={{ color:C.muted, fontSize:11, marginTop:4 }}>© 2026 Roastly. Tous droits réservés.</p>
      </div>
    </Sheet>
  );
}

export function ProfileMenuSheet({ visible, onClose, user, onOpenSettings, onOpenHelp, onOpenAbout, onLogout }) {
  if (!user) return null;
  const name = user.user_metadata?.name || user.email?.split('@')[0] || "Utilisateur";

  function MenuItem({ icon, label, desc, onClick, danger }) {
    return (
      <div onClick={() => { onClick(); onClose(); }} style={{
        display:"flex", alignItems:"center", gap:14, padding:"16px 0",
        borderBottom:`1px solid ${C.light}`, cursor:"pointer",
      }}>
        <span style={{ fontSize:22, width:32, textAlign:"center" }}>{icon}</span>
        <div style={{ flex:1 }}>
          <p style={{ color: danger ? "#D32F2F" : C.text, fontSize:15, fontWeight:500, margin:0 }}>{label}</p>
          {desc && <p style={{ color:C.muted, fontSize:12, margin:"2px 0 0" }}>{desc}</p>}
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ stroke: C.muted }} strokeWidth="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    );
  }

  return (
    <Sheet visible={visible} onClose={onClose}>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28 }}>
        <div style={{ width:60, height:60, background:`linear-gradient(135deg, ${C.accent}, ${C.copper})`,
          borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:24, fontWeight:800, color:"white", boxShadow:`0 4px 16px ${C.accent20}` }}>
          {name[0]?.toUpperCase()}
        </div>
        <div>
          <p style={{ color:C.dark, fontWeight:700, fontSize:20, margin:0, fontFamily:FONT_SERIF }}>{name}</p>
          <p style={{ color:C.muted, fontSize:13, margin:0 }}>{user.email}</p>
        </div>
      </div>

      <MenuItem icon="⚙️" label="Paramètres" desc="Notifications, langue, données" onClick={onOpenSettings}/>
      <MenuItem icon="❓" label="Aide & FAQ" desc="Questions fréquentes, contact" onClick={onOpenHelp}/>
      <MenuItem icon="☕" label="À propos de Roastly." desc="Notre mission, l'équipe" onClick={onOpenAbout}/>
      <MenuItem icon="⭐" label="Noter l'application" desc="Laissez-nous un avis" onClick={() => alert("Merci pour votre intérêt ! La notation sera disponible sur l'App Store.")}/>
      <MenuItem icon="📤" label="Partager Roastly." desc="Invitez vos amis" onClick={() => {
        if (navigator.share) navigator.share({ title:"Roastly.", text:"Découvre Roastly., l'app pour les amateurs de café !", url:window.location.href });
        else { navigator.clipboard.writeText(window.location.href); alert("Lien copié !"); }
      }}/>
      <div style={{ height:8 }}/>
      <MenuItem icon="🚪" label="Se déconnecter" danger onClick={onLogout}/>
    </Sheet>
  );
}
