import { useState, useEffect, useRef } from 'react';
import { C, FONT_SERIF, ease, spring } from '../lib/constants';
import { Stars, Pill, LabelBadge, BackBtn, Section, FadeIn } from '../components/Atoms';
import { RadarChart, CarbonArc } from '../components/Charts';
import * as api from '../lib/api';

export function CoffeeDetailSheet({ coffee, visible, onClose, user }) {
  const scrollRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [rated, setRated] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible && coffee) {
      setScrollY(0); setHoverStar(0); setSubmitting(false);
      if (user) {
        // Load both fav state and existing review in parallel
        Promise.all([
          api.isFavorite(user.id, coffee.id),
          api.fetchUserReview(user.id, coffee.id),
        ]).then(([fav, review]) => {
          setIsFav(fav);
          if (review) {
            setMyRating(review.rating);
            setRated(true);
          } else {
            setMyRating(0);
            setRated(false);
          }
        }).catch(() => {
          setMyRating(0);
          setRated(false);
        });
      } else {
        setIsFav(false);
        setMyRating(0);
        setRated(false);
      }
    }
  }, [visible, coffee, user]);

  const handleScroll = () => { if (scrollRef.current) setScrollY(scrollRef.current.scrollTop); };

  const handleFavorite = async () => {
    if (!user || !coffee) return;
    try {
      if (isFav) { await api.removeFavorite(user.id, coffee.id); setIsFav(false); }
      else { await api.addFavorite(user.id, coffee.id); setIsFav(true); }
    } catch {}
  };

  const handleRate = async () => {
    if (!user || !coffee || myRating === 0 || submitting) return;
    setSubmitting(true);
    try {
      await api.addReview({ coffeeId: coffee.id, userId: user.id, rating: myRating, comment: "" });
      setRated(true);
    } catch {
      setRated(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!coffee) return null;
  const g = coffee.gradient || ["#B8652A","#D4874A"];
  const heroH = 260;
  const parallaxOffset = Math.min(scrollY * 0.45, heroH * 0.4);
  const headerOpacity = Math.min(scrollY / 80, 1);
  const flavor = coffee.flavor_profile || [];
  const brewing = coffee.brewing_methods || [];
  const reviews = coffee._reviews || [];

  return (
    <>
      <div onClick={onClose} style={{
        position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:200,
        opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none",
        transition:`opacity 0.3s ${ease}`,
      }}/>
      <div style={{
        position:"fixed", inset:0, zIndex:201, display:"flex", flexDirection:"column",
        transform: visible ? "translateY(0)" : "translateY(102%)",
        visibility: visible ? "visible" : "hidden",
        transition:`transform 0.42s ${spring}, visibility 0s ${visible ? "0s" : "0.42s"}`,
        maxWidth:430, left:"50%", marginLeft:-215,
      }}>
        <div style={{
          position:"absolute", top:0, left:0, right:0, zIndex:10, padding:"14px 16px",
          display:"flex", alignItems:"center", gap:12,
          background:`rgba(253,246,238,${headerOpacity})`,
          backdropFilter:`blur(${headerOpacity * 12}px)`,
        }}>
          <BackBtn onBack={onClose}/>
          <span style={{ color:C.text, fontWeight:700, fontSize:15, opacity:headerOpacity, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{coffee.name}</span>
        </div>
        <div ref={scrollRef} onScroll={handleScroll} style={{ flex:1, overflowY:"auto", background:C.bg }}>
          <div style={{ height:heroH, overflow:"hidden", position:"relative", borderRadius:"0 0 28px 28px" }}>
            <div style={{ position:"absolute", inset:"-20px -1px", background:`linear-gradient(145deg, ${g[0]}, ${g[1]})`, transform:`translateY(${parallaxOffset}px)`, transition:"transform 0.05s linear" }}>
              <div style={{ position:"absolute", top:-40, right:-30, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }}/>
              <div style={{ position:"absolute", bottom:-20, left:20, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }}/>
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-54%)", fontSize:80 }}>{coffee.emoji}</div>
            </div>
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:80, background:`linear-gradient(transparent, ${C.bg})` }}/>
          </div>
          <div style={{ padding:"0 20px 120px" }}>
            <div style={{ marginTop:4, marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ flex:1, marginRight:12 }}>
                  <h1 style={{ color:C.dark, fontSize:28, fontWeight:700, margin:"0 0 4px", lineHeight:1.15, fontFamily:FONT_SERIF, letterSpacing:-0.3 }}>{coffee.name}</h1>
                  <p style={{ color:C.muted, fontSize:14, margin:0 }}>{coffee.brand}</p>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <p style={{ color:C.accent, fontSize:32, fontWeight:800, lineHeight:1, margin:0, fontFamily:FONT_SERIF }}>{coffee.avg_rating}</p>
                  <Stars rating={coffee.avg_rating} size={14}/>
                  <p style={{ color:C.muted, fontSize:11, marginTop:2 }}>{coffee.review_count} avis</p>
                </div>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:12 }}>
                {(coffee.labels || []).map(l => <LabelBadge key={l} label={l}/>)}
                <Pill bg={C.light} color={C.primary}>Torréfaction {coffee.roast_level}</Pill>
              </div>
              {coffee.ean && <p style={{ color:C.muted, fontSize:11, marginTop:8, fontFamily:"monospace" }}>EAN {coffee.ean}</p>}
            </div>

            <Section title="À propos">
              <p style={{ color:C.text, fontSize:14, lineHeight:1.7, margin:0 }}>{coffee.description}</p>
            </Section>

            {flavor.length > 0 && (
              <Section title="Profil aromatique">
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, flexWrap:"wrap" }}>
                  <RadarChart data={flavor} size={210}/>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {flavor.map(f => (
                      <div key={f.label} style={{ minWidth:110 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                          <span style={{ fontSize:12, color:C.text, fontWeight:500 }}>{f.label}</span>
                          <span style={{ fontSize:12, color:C.muted }}>{f.v}%</span>
                        </div>
                        <div style={{ height:5, background:C.light, borderRadius:99, overflow:"hidden" }}>
                          <div style={{ width:`${f.v}%`, height:"100%", borderRadius:99, background:`linear-gradient(90deg, ${C.primary}, ${C.accent})` }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:12 }}>
                  {(coffee.tags || []).map(t => <Pill key={t}>{t}</Pill>)}
                </div>
              </Section>
            )}

            <Section title={`Origine ${coffee.origin_flag}`}>
              <div style={{ background:`linear-gradient(135deg, ${g[0]}, ${g[1]})`, borderRadius:20, padding:20, color:"white" }}>
                <p style={{ fontSize:24, fontWeight:600, margin:"0 0 2px", fontFamily:FONT_SERIF }}>{coffee.origin_region}</p>
                <p style={{ fontSize:14, opacity:0.75, margin:"0 0 16px" }}>{coffee.origin_country}</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {[
                    { icon:"⛰️", label:"Altitude", val:coffee.altitude },
                    { icon:"🌿", label:"Récolte", val:coffee.harvest },
                  ].map(i => (
                    <div key={i.label} style={{ background:"rgba(255,255,255,0.12)", borderRadius:14, padding:12 }}>
                      <p style={{ fontSize:18, margin:"0 0 4px" }}>{i.icon}</p>
                      <p style={{ fontSize:11, opacity:0.7, margin:"0 0 2px" }}>{i.label}</p>
                      <p style={{ fontSize:13, fontWeight:700, margin:0 }}>{i.val || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            <Section title="Durabilité & Préparation">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
                <div style={{ textAlign:"center" }}>
                  <p style={{ color:C.muted, fontSize:11, textTransform:"uppercase", letterSpacing:1.5, marginBottom:10 }}>Impact carbone</p>
                  <CarbonArc score={coffee.carbon_score}/>
                </div>
                <div>
                  <p style={{ color:C.muted, fontSize:11, textTransform:"uppercase", letterSpacing:1.5, marginBottom:12 }}>Préparations</p>
                  {brewing.map((b, i) => (
                    <div key={b} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                      <span style={{ color:C.accent, fontWeight:700, fontSize:11, fontFamily:FONT_SERIF }}>{String(i+1).padStart(2,'0')}</span>
                      <span style={{ color:C.text, fontSize:14, fontFamily:FONT_SERIF }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            <Section title="Votre avis">
              <div style={{ textAlign:"center", padding:"8px 0" }}>
                <p style={{ color:C.muted, fontSize:13, marginBottom:16 }}>
                  {rated ? "Votre note actuelle — cliquez pour modifier" : "Comment l'avez-vous trouvé ?"}
                </p>
                <div style={{ display:"flex", justifyContent:"center", gap:10, marginBottom:16 }}>
                  {[1,2,3,4,5].map(s => (
                    <button key={s}
                      onMouseEnter={() => setHoverStar(s)} onMouseLeave={() => setHoverStar(0)}
                      onClick={() => { setMyRating(s); setRated(false); }}
                      style={{ background:"none", border:"none", cursor:"pointer", padding:2,
                        transform: (hoverStar || myRating) >= s ? "scale(1.25)" : "scale(1)",
                        transition:`transform 0.15s ${spring}` }}>
                      <svg width="30" height="30" viewBox="0 0 24 24"
                        fill={(hoverStar || myRating) >= s ? C.accent : C.light}
                        style={{ transition:"fill 0.15s" }}>
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                    </button>
                  ))}
                </div>
                {!rated && myRating > 0 && (
                  <button onClick={handleRate} disabled={submitting} style={{
                    background: C.primary, color:"white", border:"none", borderRadius:99,
                    padding:"11px 28px", fontSize:14, fontWeight:600, cursor:"pointer",
                    opacity: submitting ? 0.6 : 1,
                  }}>{submitting ? "Envoi..." : "Soumettre"}</button>
                )}
                {rated && (
                  <p style={{ color:C.roast, fontSize:13, fontWeight:600 }}>✓ Note enregistrée</p>
                )}
                {!user && (
                  <p style={{ color:C.muted, fontSize:12, marginTop:8 }}>Connectez-vous pour laisser un avis</p>
                )}
              </div>
            </Section>
          </div>
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"12px 20px 24px", background:`linear-gradient(transparent, ${C.bg} 30%)`, pointerEvents:"none" }}>
          <button onClick={handleFavorite} style={{ width:"100%", background: isFav ? C.accent : C.primary, color:"white", border:"none",
            borderRadius:16, padding:"15px 20px", fontSize:15, fontWeight:700, cursor:"pointer",
            boxShadow:`0 8px 24px ${isFav ? C.accent : C.primary}55`, pointerEvents:"auto",
            transition:`all 0.25s ${ease}`,
          }}>{isFav ? "Retirer des favoris 💔" : "Ajouter à ma liste ❤️"}</button>
        </div>
      </div>
    </>
  );
}
