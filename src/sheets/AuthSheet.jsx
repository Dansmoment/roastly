import { useState, useEffect } from 'react';
import { C, FONT_SERIF, ease, spring } from '../lib/constants';
import { Sheet, FormInput } from '../components/Atoms';
import * as api from '../lib/api';

export function AuthSheet({ visible, onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => { if (visible) { setMode("login"); setForm({ name:"", email:"", password:"" }); setError(""); setResetSent(false); } }, [visible]);

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Veuillez remplir tous les champs."); return; }
    if (mode === "signup" && !form.name) { setError("Veuillez entrer votre prénom."); return; }
    if (!form.email.includes("@")) { setError("Adresse email invalide."); return; }
    if (form.password.length < 6) { setError("Le mot de passe doit faire au moins 6 caractères."); return; }
    setLoading(true);
    try {
      if (mode === "login") {
        const { user } = await api.signIn({ email: form.email, password: form.password });
        onLogin(user);
      } else {
        const { user } = await api.signUp({ email: form.email, password: form.password, name: form.name });
        onLogin(user);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!form.email || !form.email.includes("@")) { setError("Entrez votre email pour réinitialiser."); return; }
    try {
      await api.resetPassword(form.email);
      setResetSent(true);
      setError("");
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi.");
    }
  };

  const handleSocial = async (provider) => {
    try {
      await api.signInWithProvider(provider);
    } catch (err) {
      setError(err.message || "Erreur de connexion.");
    }
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <div style={{ background:C.light, borderRadius:12, padding:3, display:"flex", marginBottom:28, position:"relative" }}>
        <div style={{
          position:"absolute", top:3, bottom:3, width:"calc(50% - 3px)", borderRadius:10,
          background:C.surface, boxShadow:"0 1px 4px rgba(0,0,0,0.1)",
          transform:`translateX(${mode === "signup" ? "100%" : "0"})`,
          transition:`transform 0.3s ${spring}`,
        }}/>
        {[["login","Se connecter"],["signup","Créer un compte"]].map(([id,label]) => (
          <button key={id} onClick={() => { setMode(id); setError(""); setResetSent(false); }} style={{
            flex:1, position:"relative", zIndex:1, border:"none", background:"transparent",
            padding:"10px 0", fontSize:13, fontWeight: mode === id ? 700 : 500,
            color: mode === id ? C.dark : C.muted, cursor:"pointer",
          }}>{label}</button>
        ))}
      </div>

      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:48, marginBottom:12 }}>{mode === "login" ? "👋" : "🌱"}</div>
        <p style={{ color:C.dark, fontWeight:700, fontSize:22, fontFamily:FONT_SERIF, margin:"0 0 4px" }}>
          {mode === "login" ? "Bon retour !" : "Bienvenue !"}
        </p>
        <p style={{ color:C.muted, fontSize:13 }}>
          {mode === "login" ? "Connectez-vous pour retrouver vos cafés" : "Créez votre compte Roastly. gratuitement"}
        </p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {mode === "signup" && (
          <FormInput label="Prénom" value={form.name} onChange={v => setForm(f=>({...f,name:v}))} placeholder="Daniel"/>
        )}
        <FormInput label="Email" value={form.email} onChange={v => setForm(f=>({...f,email:v}))} placeholder="daniel@email.com"/>
        <div>
          <p style={{ color:C.muted, fontSize:12, fontWeight:600, marginBottom:6 }}>Mot de passe</p>
          <input type="password" value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))}
            placeholder="••••••••"
            style={{ width:"100%", border:`1.5px solid ${C.light}`, borderRadius:14,
              padding:"12px 14px", fontSize:14, color:C.text, background:C.surface,
              outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}/>
        </div>

        {error && <p style={{ color:"#D32F2F", fontSize:13, margin:0 }}>{error}</p>}
        {resetSent && <p style={{ color:C.green, fontSize:13, margin:0 }}>Email de réinitialisation envoyé ! Vérifiez votre boîte mail.</p>}

        <button onClick={handleSubmit} disabled={loading} style={{
          background:C.primary, color:"white", border:"none", borderRadius:14,
          padding:"14px", fontSize:15, fontWeight:700, cursor:"pointer",
          opacity: loading ? 0.6 : 1, marginTop:4,
          transition:`opacity 0.2s ${ease}`,
        }}>{loading ? "Chargement..." : (mode === "login" ? "Se connecter" : "Créer mon compte")}</button>

        {mode === "login" && (
          <button onClick={handleReset} style={{ background:"none", border:"none", color:C.accent, fontSize:13,
            fontWeight:500, cursor:"pointer", padding:4 }}>Mot de passe oublié ?</button>
        )}
      </div>

      <div style={{ borderTop:`1px solid ${C.light}`, marginTop:20, paddingTop:18, textAlign:"center" }}>
        <p style={{ color:C.muted, fontSize:12, marginBottom:12 }}>Ou continuer avec</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          {[
            { name:"Apple", icon:"🍎", provider:"apple" },
            { name:"Google", icon:"🔵", provider:"google" },
          ].map(p => (
            <button key={p.name} onClick={() => handleSocial(p.provider)} style={{
              flex:1, maxWidth:160, border:`1.5px solid ${C.light}`, borderRadius:14,
              padding:"12px", background:C.surface, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}>
              <span style={{ fontSize:18 }}>{p.icon}</span>
              <span style={{ color:C.text, fontWeight:600, fontSize:13 }}>{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
