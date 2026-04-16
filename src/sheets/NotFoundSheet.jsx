import { useState, useEffect } from 'react';
import { C, FONT_SERIF, ease, spring, ADD_STEPS, FLAVOR_TAGS, GRADIENTS, EMOJIS, ROAST_LEVELS, LABEL_OPTIONS, BREW_OPTIONS } from '../lib/constants';
import { FormInput } from '../components/Atoms';
import * as api from '../lib/api';

export function NotFoundSheet({ visible, onClose, scannedEAN, offData, onAdd, user }) {
  const [step, setStep] = useState(0);
  const [savedCoffee, setSavedCoffee] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [form, setForm] = useState({
    name: "", brand: "", ean: "", description: "",
    country: "", region: "", altitude: "", harvest: "",
    roast_level: "", labels: [], brewing_methods: [],
    tags: [],
  });

  useEffect(() => {
    if (visible) {
      setStep(0);
      setSavedCoffee(null);
      setAuthError(false);
      setValidationError(false);
      setForm({
        name: offData?.name || "",
        brand: offData?.brand || "",
        ean: scannedEAN || "",
        description: "",
        country: offData?.origin_country || "",
        region: "",
        altitude: "",
        harvest: "",
        roast_level: "",
        labels: [],
        brewing_methods: [],
        tags: [],
      });
    }
  }, [visible, scannedEAN, offData]);

  const toggleItem = (key, item) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(item) ? f[key].filter(x => x !== item) : [...f[key], item],
    }));
  };

  const totalSteps = ADD_STEPS.length;
  const next = () => setStep(s => Math.min(s + 1, totalSteps - 1));
  const back = () => { if (step === 0) onClose(); else setStep(s => s - 1); };

  const submit = async () => {
    if (!user) {
      setAuthError(true);
      return;
    }
    const gi = Math.floor(Math.random() * GRADIENTS.length);
    const ei = Math.floor(Math.random() * EMOJIS.length);
    const newCoffee = {
      name: form.name || "Café inconnu",
      brand: form.brand || "Inconnu",
      ean: form.ean || null,
      origin_country: form.country || "—",
      origin_region: form.region || "—",
      origin_flag: getFlagEmoji(form.country),
      altitude: form.altitude || "—",
      harvest: form.harvest || "—",
      roast_level: form.roast_level || "Médium",
      tags: form.tags.length ? form.tags : ["Nouveau"],
      labels: form.labels,
      carbon_score: 50,
      carbon_label: "Moyen",
      description: form.description || `${form.name || "Café"} ajouté par la communauté Roastly.`,
      flavor_profile: buildFlavorProfile(form.tags),
      brewing_methods: form.brewing_methods.length ? form.brewing_methods : ["Filtre"],
      emoji: EMOJIS[ei],
      gradient: GRADIENTS[gi],
    };
    try {
      const saved = await api.addCoffee(newCoffee);
      setSavedCoffee(saved);
    } catch {
      setSavedCoffee({ id: Date.now(), ...newCoffee, avg_rating: 0, review_count: 0 });
    }
    next();
  };

  const canContinue = step === 0 ? !!form.name : true;

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 300,
        opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none",
        transition: `opacity 0.25s ${ease}`,
      }}/>
      <div style={{
        position: "fixed", bottom: 0, left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "110%"})`,
        visibility: visible ? "visible" : "hidden",
        width: "100%", maxWidth: 430, zIndex: 301, background: C.bg,
        borderRadius: "28px 28px 0 0", padding: "28px 24px 40px",
        transition: `transform 0.38s ${spring}, visibility 0s ${visible ? "0s" : "0.38s"}`,
        boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
        maxHeight: "88vh", overflowY: "auto",
      }}>
        <div style={{ width: 36, height: 4, background: C.light, borderRadius: 99, margin: "0 auto 24px" }}/>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24, justifyContent: "center" }}>
          {ADD_STEPS.map((_, i) => (
            <div key={i} style={{
              height: 4, borderRadius: 99, flex: 1, maxWidth: 60,
              background: i <= step ? C.primary : C.light,
              transition: `background 0.3s ${ease}`,
            }}/>
          ))}
        </div>

        {/* Step label */}
        {step < totalSteps - 1 && (
          <p style={{ color: C.muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
            Étape {step + 1}/{totalSteps - 1}
          </p>
        )}
        <p style={{ color: C.dark, fontWeight: 800, fontSize: 20, marginBottom: 4 }}>
          {step === 0 && "☕ Nouveau café !"}
          {step === 1 && "📍 Origine & Terroir"}
          {step === 2 && "🔥 Torréfaction & Labels"}
          {step === 3 && "🌸 Profil aromatique"}
          {step === 4 && "🎉 Merci !"}
        </p>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: offData && step === 0 ? 10 : 22 }}>
          {step === 0 && "Ce café n'est pas encore dans notre base. Soyez le premier à l'ajouter !"}
          {step === 1 && "D'où vient ce café ? Ajoutez autant d'infos que possible."}
          {step === 2 && "Type de torréfaction, labels et méthodes de préparation."}
          {step === 3 && "Quelles saveurs percevez-vous dans ce café ?"}
          {step === 4 && "Votre contribution aide toute la communauté Roastly."}
        </p>

        {offData && step === 0 && (
          <div style={{
            background: `${C.primary}12`, border: `1px solid ${C.primary}30`,
            borderRadius: 12, padding: "10px 14px", marginBottom: 18,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>🌍</span>
            <p style={{ color: C.primary, fontSize: 12, fontWeight: 600, margin: 0 }}>
              Données pré-remplies via Open Food Facts — vérifiez et complétez
            </p>
          </div>
        )}

        {/* ── Step 0: Infos de base ── */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FormInput label="Nom du café *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="ex. Yirgacheffe Natural"/>
            <FormInput label="Marque / Torréfacteur" value={form.brand} onChange={v => setForm(f => ({ ...f, brand: v }))} placeholder="ex. Café Lutécia"/>
            {!scannedEAN && (
              <FormInput label="Code-barres EAN (optionnel)" value={form.ean} onChange={v => setForm(f => ({ ...f, ean: v }))} placeholder="ex. 3760123456001"/>
            )}
            <div>
              <p style={{ color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Description</p>
              <textarea
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Décrivez ce café en quelques mots... (notes de dégustation, aspect, particularités)"
                rows={3}
                style={{
                  width: "100%", border: `1.5px solid ${C.light}`, borderRadius: 14,
                  padding: "12px 14px", fontSize: 14, color: C.text, background: C.white,
                  outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical",
                }}
              />
            </div>
          </div>
        )}

        {/* ── Step 1: Origine ── */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FormInput label="Pays d'origine" value={form.country} onChange={v => setForm(f => ({ ...f, country: v }))} placeholder="ex. Éthiopie"/>
            <FormInput label="Région" value={form.region} onChange={v => setForm(f => ({ ...f, region: v }))} placeholder="ex. Sidamo, Yirgacheffe"/>
            <FormInput label="Altitude" value={form.altitude} onChange={v => setForm(f => ({ ...f, altitude: v }))} placeholder="ex. 1800-2200m"/>
            <FormInput label="Période de récolte" value={form.harvest} onChange={v => setForm(f => ({ ...f, harvest: v }))} placeholder="ex. Oct-Dec"/>

            {/* Quick country chips */}
            <div>
              <p style={{ color: C.muted, fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Pays populaires</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { flag: "🇪🇹", name: "Éthiopie" }, { flag: "🇨🇴", name: "Colombie" },
                  { flag: "🇰🇪", name: "Kenya" }, { flag: "🇧🇷", name: "Brésil" },
                  { flag: "🇬🇹", name: "Guatemala" }, { flag: "🇨🇷", name: "Costa Rica" },
                  { flag: "🇮🇩", name: "Indonésie" }, { flag: "🇷🇼", name: "Rwanda" },
                ].map(c => {
                  const on = form.country === c.name;
                  return (
                    <button key={c.name} onClick={() => setForm(f => ({ ...f, country: c.name }))} style={{
                      border: `1.5px solid ${on ? C.primary : C.light}`, borderRadius: 99,
                      padding: "7px 14px", fontSize: 13, fontWeight: on ? 700 : 500,
                      background: on ? C.primary : C.white, color: on ? C.white : C.muted,
                      cursor: "pointer", transition: `all 0.18s ${ease}`,
                      display: "flex", alignItems: "center", gap: 5,
                    }}>
                      <span style={{ fontSize: 15 }}>{c.flag}</span> {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Torréfaction & Labels ── */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Roast level */}
            <div>
              <p style={{ color: C.muted, fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Niveau de torréfaction</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {ROAST_LEVELS.map(r => {
                  const on = form.roast_level === r;
                  const colors = {
                    "Blonde": "#E8D5A0", "Légère": "#C8A865", "Légère-Médium": "#A08040",
                    "Médium": "#7A5C2A", "Médium-Foncée": "#5A3D15", "Foncée": "#3A2510",
                  };
                  return (
                    <button key={r} onClick={() => setForm(f => ({ ...f, roast_level: r }))} style={{
                      border: `1.5px solid ${on ? C.primary : C.light}`, borderRadius: 14,
                      padding: "10px 16px", fontSize: 13, fontWeight: on ? 700 : 500,
                      background: on ? C.primary : C.white, color: on ? C.white : C.text,
                      cursor: "pointer", transition: `all 0.18s ${ease}`,
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: "50%",
                        background: colors[r] || "#7A5C2A",
                        border: "1.5px solid rgba(0,0,0,0.1)",
                      }}/>
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Labels */}
            <div>
              <p style={{ color: C.muted, fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Labels & Certifications</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {LABEL_OPTIONS.map(l => {
                  const on = form.labels.includes(l);
                  const icons = { "Bio": "🌱", "Fair Trade": "🤝", "Rainforest Alliance": "🌿", "Direct Trade": "🔗" };
                  return (
                    <button key={l} onClick={() => toggleItem('labels', l)} style={{
                      border: `1.5px solid ${on ? C.green : C.light}`, borderRadius: 99,
                      padding: "8px 14px", fontSize: 13, fontWeight: on ? 700 : 500,
                      background: on ? "#DFF0E8" : C.white, color: on ? "#2A5E40" : C.muted,
                      cursor: "pointer", transition: `all 0.18s ${ease}`,
                      display: "flex", alignItems: "center", gap: 5,
                    }}>
                      <span style={{ fontSize: 14 }}>{icons[l]}</span> {l}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brewing methods */}
            <div>
              <p style={{ color: C.muted, fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Méthodes de préparation recommandées</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {BREW_OPTIONS.map(b => {
                  const on = form.brewing_methods.includes(b);
                  const icons = {
                    "Espresso": "☕", "Filtre": "🫗", "AeroPress": "🔄", "Chemex": "⏳",
                    "V60": "🔺", "French Press": "🪣", "Cold Brew": "🧊", "Moka": "🫖",
                  };
                  return (
                    <button key={b} onClick={() => toggleItem('brewing_methods', b)} style={{
                      border: `1.5px solid ${on ? C.accent : C.light}`, borderRadius: 99,
                      padding: "8px 14px", fontSize: 13, fontWeight: on ? 700 : 500,
                      background: on ? `${C.accent}15` : C.white, color: on ? C.accent : C.muted,
                      cursor: "pointer", transition: `all 0.18s ${ease}`,
                      display: "flex", alignItems: "center", gap: 5,
                    }}>
                      <span style={{ fontSize: 14 }}>{icons[b]}</span> {b}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Profil aromatique ── */}
        {step === 3 && (
          <div>
            <p style={{ color: C.muted, fontSize: 12, marginBottom: 14 }}>
              Sélectionnez les saveurs dominantes ({form.tags.length} sélectionnée{form.tags.length > 1 ? "s" : ""})
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {FLAVOR_TAGS.map(t => {
                const on = form.tags.includes(t);
                return (
                  <button key={t} onClick={() => toggleItem('tags', t)} style={{
                    border: `1.5px solid ${on ? C.primary : C.light}`, borderRadius: 99,
                    padding: "9px 18px", fontSize: 13, fontWeight: on ? 700 : 500,
                    background: on ? C.primary : C.white, color: on ? C.white : C.muted,
                    cursor: "pointer", transition: `all 0.18s ${ease}`,
                    transform: on ? "scale(1.05)" : "scale(1)",
                  }}>{t}</button>
                );
              })}
            </div>
            {form.tags.length > 0 && (
              <div style={{ marginTop: 18, background: C.light, borderRadius: 16, padding: 16 }}>
                <p style={{ color: C.muted, fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Aperçu du profil</p>
                {form.tags.map(t => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: C.text, fontWeight: 500, minWidth: 70 }}>{t}</span>
                    <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.6)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{
                        width: "70%", height: "100%", borderRadius: 99,
                        background: `linear-gradient(90deg, ${C.primary}, ${C.accent})`,
                      }}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Step 4: Confirmation ── */}
        {step === 4 && (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 60, marginBottom: 12, animation: "popIn 0.4s cubic-bezier(0.34,1.2,0.64,1)" }}>🫘</div>
            <p style={{ color: C.green, fontWeight: 700, fontSize: 16 }}>"{form.name || "Café"}" ajouté avec succès !</p>
            <p style={{ color: C.muted, fontSize: 13, marginTop: 4, marginBottom: 20 }}>Il sera visible dans la recherche.</p>

            {/* Recap card */}
            <div style={{
              background: C.white, borderRadius: 20, padding: 18, textAlign: "left",
              border: `1px solid ${C.light}`,
            }}>
              <p style={{ color: C.muted, fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Récapitulatif</p>
              <RecapRow label="Nom" value={form.name}/>
              {form.brand && <RecapRow label="Marque" value={form.brand}/>}
              {form.country && <RecapRow label="Origine" value={`${getFlagEmoji(form.country)} ${form.country}${form.region ? ` · ${form.region}` : ""}`}/>}
              {form.altitude && <RecapRow label="Altitude" value={form.altitude}/>}
              {form.roast_level && <RecapRow label="Torréfaction" value={form.roast_level}/>}
              {form.labels.length > 0 && <RecapRow label="Labels" value={form.labels.join(", ")}/>}
              {form.brewing_methods.length > 0 && <RecapRow label="Préparation" value={form.brewing_methods.join(", ")}/>}
              {form.tags.length > 0 && <RecapRow label="Arômes" value={form.tags.join(", ")}/>}
            </div>
          </div>
        )}

        {/* Error messages */}
        {validationError && step === 0 && !form.name && (
          <p style={{ color: "#D32F2F", fontSize: 13, fontWeight: 600, marginTop: 8 }}>
            Veuillez renseigner le nom du cafe avant de continuer.
          </p>
        )}
        {authError && (
          <p style={{ color: "#D32F2F", fontSize: 13, fontWeight: 600, marginTop: 8 }}>
            Vous devez etre connecte pour ajouter un cafe.
          </p>
        )}

        {/* Navigation buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          {step < totalSteps - 1 && (
            <button onClick={back} style={{
              flex: 1, border: `1.5px solid ${C.light}`, borderRadius: 14, padding: "13px",
              fontSize: 14, fontWeight: 600, background: "transparent", color: C.muted, cursor: "pointer",
            }}>Retour</button>
          )}
          <button
            onClick={() => {
              if (step === 0 && !canContinue) { setValidationError(true); return; }
              setValidationError(false);
              if (step < totalSteps - 2) next();
              else if (step === totalSteps - 2) submit();
              else { if (onAdd && savedCoffee) onAdd(savedCoffee); onClose(); }
            }}
            disabled={!canContinue && step === 0}
            style={{
              flex: 2, background: C.primary, color: "white", border: "none", borderRadius: 14,
              padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer",
              opacity: !canContinue && step === 0 ? 0.5 : 1,
              transition: `opacity 0.2s ${ease}`,
            }}>
            {step < totalSteps - 2 ? "Continuer →" : step === totalSteps - 2 ? "Soumettre ✓" : "Fermer"}
          </button>
        </div>
      </div>
    </>
  );
}

function RecapRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.light}` }}>
      <span style={{ color: C.muted, fontSize: 12 }}>{label}</span>
      <span style={{ color: C.text, fontSize: 13, fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

function getFlagEmoji(country) {
  const map = {
    "Éthiopie": "🇪🇹", "Colombie": "🇨🇴", "Kenya": "🇰🇪", "Brésil": "🇧🇷",
    "Guatemala": "🇬🇹", "Costa Rica": "🇨🇷", "Indonésie": "🇮🇩", "Rwanda": "🇷🇼",
    "Pérou": "🇵🇪", "Honduras": "🇭🇳", "Mexique": "🇲🇽", "Tanzanie": "🇹🇿",
    "Ouganda": "🇺🇬", "Panama": "🇵🇦", "Jamaïque": "🇯🇲", "Inde": "🇮🇳",
  };
  return map[country] || "🌍";
}

function buildFlavorProfile(tags) {
  const mapping = {
    "Agrumes": { label: "Acidité", boost: 25 },
    "Floral": { label: "Floral", boost: 30 },
    "Fraise": { label: "Fruité", boost: 20 },
    "Caramel": { label: "Douceur", boost: 25 },
    "Chocolat": { label: "Corps", boost: 20 },
    "Noix": { label: "Corps", boost: 15 },
    "Cassis": { label: "Fruité", boost: 25 },
    "Épicé": { label: "Amertume", boost: 15 },
    "Boisé": { label: "Corps", boost: 20 },
    "Miel": { label: "Douceur", boost: 20 },
    "Vanille": { label: "Douceur", boost: 15 },
    "Fruité": { label: "Fruité", boost: 25 },
  };
  const base = { "Acidité": 40, "Fruité": 40, "Floral": 35, "Corps": 40, "Douceur": 40, "Amertume": 35 };
  tags.forEach(t => {
    const m = mapping[t];
    if (m && base[m.label] !== undefined) base[m.label] = Math.min(100, base[m.label] + m.boost);
  });
  return Object.entries(base).map(([label, v]) => ({ label, v }));
}
