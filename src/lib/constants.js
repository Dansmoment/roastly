// ─── Palette — Café Moulu · Espresso & Cuivre ────────────────────────────────
export const C = {
  bg:      "#F5EFE4",   // Parchemin chaud
  primary: "#1A0F07",   // Espresso profond
  accent:  "#C47A2A",   // Ambre torréfié
  light:   "#E6D8C3",   // Sable doux
  dark:    "#0E0804",   // Noir café
  roast:   "#7A3E1E",   // Torréfaction medium (remplace green)
  text:    "#1A0F07",   // Même qu'espresso
  muted:   "#8C7060",   // Brun-gris chaud
  white:   "#FFFFFF",
  copper:  "#D49040",   // Or cuivré
  // compat alias (évite de casser des refs existantes)
  green:   "#7A3E1E",
};

export const FONT_SERIF = "'Cormorant Garamond', Georgia, serif";
export const FONT_SANS  = "'Inter', system-ui, -apple-system, sans-serif";
export const ease   = "cubic-bezier(0.4, 0, 0.2, 1)";
export const spring = "cubic-bezier(0.34, 1.2, 0.64, 1)";

export const FILTERS = [
  { id: "all", label: "Tous" }, { id: "fruité", label: "Fruité" },
  { id: "floral", label: "Floral" }, { id: "corsé", label: "Corsé" },
  { id: "doux", label: "Doux" }, { id: "bio", label: "Bio" },
  { id: "fairtrade", label: "Fair Trade" }, { id: "ethiopie", label: "Éthiopie" },
  { id: "colombie", label: "Colombie" }, { id: "kenya", label: "Kenya" },
];

export const ADD_STEPS = ["Infos de base", "Origine", "Torréfaction", "Arômes", "Confirmation"];
export const FLAVOR_TAGS = ["Agrumes", "Floral", "Fraise", "Caramel", "Chocolat", "Noix", "Cassis", "Épicé", "Boisé", "Miel", "Vanille", "Fruité"];
export const ROAST_LEVELS = ["Blonde", "Légère", "Légère-Médium", "Médium", "Médium-Foncée", "Foncée"];
export const LABEL_OPTIONS = ["Bio", "Fair Trade", "Rainforest Alliance", "Direct Trade"];
export const BREW_OPTIONS = ["Espresso", "Filtre", "AeroPress", "Chemex", "V60", "French Press", "Cold Brew", "Moka"];
export const GRADIENTS = [["#C47A2A","#D49040"],["#1A0F07","#3A1E0C"],["#0E0804","#1A0F07"],["#7A3E1E","#C47A2A"],["#D49040","#C47A2A"]];
export const EMOJIS = ["☕","🫘","🌿","🍂","✨","🌸","🍫","🫐","🔥","🌍"];

export const ARTICLES = [
  { icon:"🌍", title:"Les grands pays producteurs", desc:"Tour du monde des terroirs café", min:"5 min" },
  { icon:"🔥", title:"La torréfaction expliquée", desc:"Blonde, medium, dark roast — les différences", min:"4 min" },
  { icon:"⭐", title:"Café de spécialité vs standard", desc:"Qu'est-ce qui fait un grand café ?", min:"6 min" },
  { icon:"🤝", title:"Commerce équitable & labels", desc:"Fair Trade, Direct Trade, Rainforest Alliance", min:"7 min" },
  { icon:"☕", title:"Les méthodes de préparation", desc:"Espresso, filtre, cold brew, AeroPress...", min:"8 min" },
  { icon:"🌱", title:"Impact carbone du café", desc:"L'empreinte environnementale de votre tasse", min:"5 min" },
];

export const FAQ_DATA = [
  { q: "Comment scanner un code-barres ?", a: "Ouvrez l'onglet Scanner (au centre de la barre de navigation), autorisez l'accès à la caméra, puis pointez-la vers le code-barres du paquet de café. Le scan est automatique." },
  { q: "Pourquoi mon café n'est pas trouvé ?", a: "Notre base de données s'enrichit grâce à la communauté. Si votre café n'est pas encore référencé, vous pouvez l'ajouter en quelques étapes depuis le scanner ou la recherche." },
  { q: "Mes données sont-elles sécurisées ?", a: "Vos données sont stockées localement sur votre appareil. Aucune information personnelle n'est envoyée à des serveurs tiers dans la version actuelle." },
  { q: "Comment modifier mon profil de goût ?", a: "Votre profil de goût se construit automatiquement à partir de vos notes et avis. Plus vous évaluez de cafés, plus votre profil est précis." },
  { q: "L'application est-elle gratuite ?", a: "Oui, Roastly. est entièrement gratuite. Des fonctionnalités premium pourront être proposées à l'avenir." },
  { q: "Comment contacter l'équipe Roastly. ?", a: "Envoyez-nous un email à hello@roastly.app ou utilisez le formulaire de contact ci-dessous." },
  { q: "Puis-je utiliser Roastly. hors ligne ?", a: "Oui, la recherche et la consultation de vos cafés fonctionnent hors ligne. Le scanner nécessite un accès caméra mais pas de connexion internet." },
];

export const TASTE = [{ l:"Fruité", v:80 },{ l:"Floral", v:60 },{ l:"Acidité", v:72 },{ l:"Corps", v:30 },{ l:"Douceur", v:55 }];
