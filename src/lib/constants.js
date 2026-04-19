// ─── Palette — CSS custom properties (light/dark via data-theme) ─────────────
export const C = {
  bg:      "var(--c-bg)",
  primary: "var(--c-primary)",
  accent:  "var(--c-accent)",
  light:   "var(--c-light)",
  dark:    "var(--c-dark)",
  roast:   "var(--c-roast)",
  text:    "var(--c-text)",
  muted:   "var(--c-muted)",
  white:   "#FFFFFF",
  surface: "var(--c-surface)",
  shadowSm: "var(--c-shadow-sm)",
  copper:  "var(--c-copper)",
  green:   "var(--c-green)",
  // Alpha variants — replace ${C.x}HH hex-alpha patterns
  accent08:  "var(--c-accent-08)",
  accent13:  "var(--c-accent-13)",
  accent19:  "var(--c-accent-19)",
  accent20:  "var(--c-accent-20)",
  accent27:  "var(--c-accent-27)",
  accent33:  "var(--c-accent-33)",
  accent40:  "var(--c-accent-40)",
  accent53:  "var(--c-accent-53)",
  accent80:  "var(--c-accent-80)",
  primary07: "var(--c-primary-07)",
  primary08: "var(--c-primary-08)",
  primary16: "var(--c-primary-16)",
  primary19: "var(--c-primary-19)",
  primary25: "var(--c-primary-25)",
  primary33: "var(--c-primary-33)",
  bgA90:     "var(--c-bg-90)",
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

export const VARIETY_OPTIONS = ["Arabica", "Robusta", "Autre"];

export function computeCarbonScore({ country = "", labels = [], roast = "", altitude = "", variety = "" }) {
  let score = 50;

  // Origine
  if (["Éthiopie","Rwanda","Ouganda","Yémen","Burundi"].includes(country)) score += 10;
  else if (["Colombie","Pérou","Bolivie","Guatemala","Costa Rica","Honduras","Mexique","Panama","Kenya","Tanzanie"].includes(country)) score += 5;
  else if (country === "Vietnam") score -= 10;

  // Labels
  if (labels.includes("Bio"))                 score += 15;
  if (labels.includes("Rainforest Alliance")) score += 8;
  if (labels.includes("Direct Trade"))        score += 5;
  if (labels.includes("Fair Trade"))          score += 3;

  // Torréfaction
  if (["Blonde","Légère"].includes(roast))    score += 3;
  else if (roast === "Légère-Médium")         score += 2;
  else if (roast === "Médium-Foncée")         score -= 2;
  else if (roast === "Foncée")                score -= 5;

  // Altitude
  const altMatch = altitude.match(/\d+/);
  if (altMatch) {
    const alt = parseInt(altMatch[0], 10);
    if (alt >= 1800)      score += 8;
    else if (alt >= 1500) score += 5;
    else if (alt < 1000)  score -= 8;
  }

  // Variété
  if (variety === "Arabica")      score += 8;
  else if (variety === "Robusta") score -= 8;

  return Math.max(0, Math.min(100, score));
}

export const ARTICLES = [
  {
    icon:"🌍", title:"Les grands pays producteurs", desc:"Tour du monde des terroirs café", min:"5 min",
    keyFacts:["🇧🇷 Brésil = 38% de la production mondiale","🇪🇹 L'Éthiopie est le berceau de l'Arabica","☕ 70+ pays producteurs dans la ceinture tropicale"],
    sections:[
      { title:"La ceinture du café", body:"Le café pousse exclusivement dans la zone tropicale, entre les tropiques du Cancer et du Capricorne — ce que l'on appelle la \"ceinture du café\". Deux facteurs sont déterminants : l'altitude (entre 600 et 2 200 m pour l'Arabica) et un climat sans gel, avec des pluies régulières et une saison sèche marquée pour favoriser la floraison." },
      { title:"Éthiopie — le berceau de l'Arabica", body:"C'est en Éthiopie, dans la région de Kaffa, que le café a été découvert. Le pays produit des cafés d'une complexité aromatique rare : Yirgacheffe et ses notes florales et agrumes, Sidama avec ses profils fruités, Harrar avec ses notes de baies sauvages. Les variétés cultivées sont souvent des landrace — des variétés locales indigènes qui n'ont jamais été sélectionnées par l'homme." },
      { title:"Colombie, Kenya, Panama", body:"La Colombie est connue pour ses cafés doux et équilibrés, grâce à deux récoltes annuelles et un relief idéal. Le Kenya produit probablement les cafés les plus distinctifs d'Afrique, avec des notes de cassis et d'acidité vive, issus des variétés SL-28 et SL-34. Le Panama, grâce à la vallée de Boquete et à la variété Geisha, a imposé ses cafés parmi les plus chers et les plus recherchés au monde." },
      { title:"Asie & Pacifique", body:"L'Indonésie (Sumatra, Java, Sulawesi) utilise un procédé de déparchage humide unique qui donne aux cafés un corps épais et des notes terreuses. Le Vietnam est le 2ème producteur mondial, essentiellement en Robusta. La Papouasie-Nouvelle-Guinée et le Yémen — berceau du commerce du café au XVe siècle — complètent une géographie productrice d'une richesse insoupçonnée." },
    ],
  },
  {
    icon:"🔥", title:"La torréfaction expliquée", desc:"Blonde, medium, dark roast — les différences", min:"4 min",
    keyFacts:["🌡️ Entre 180°C et 230°C selon le niveau","⏱️ 8 à 15 minutes de torréfaction","💨 Le café libère 1 000+ composés aromatiques"],
    sections:[
      { title:"Qu'est-ce que la torréfaction ?", body:"La torréfaction transforme le grain vert — insipide et dur — en un grain brun, croustillant et aromatique. C'est une réaction chimique complexe : la réaction de Maillard entre les sucres et les acides aminés, et la caramélisation, créent ensemble plus de 1 000 composés volatils qui définissent le goût du café." },
      { title:"Blonde & légère — l'acidité mise en valeur", body:"Une torréfaction blonde (environ 195°C) préserve les arômes d'origine du terroir : notes florales, d'agrumes, de fruits rouges. L'acidité est vive, le corps léger. Ces cafés sont souvent privilégiés par les amateurs de spécialité qui veulent goûter le terroir sans l'interférence de la torréfaction. Ils conviennent parfaitement aux méthodes douces comme le V60, le Chemex ou l'AeroPress." },
      { title:"Médium — l'équilibre", body:"La torréfaction médium (205-215°C) est le point d'équilibre entre les arômes du terroir et ceux de la torréfaction. On y trouve des notes de caramel, de noisette, de chocolat au lait. L'acidité est présente mais plus douce, le corps plus généreux. C'est le niveau le plus polyvalent, adapté à l'espresso comme au filtre." },
      { title:"Foncée — l'intensité", body:"Au-delà de 220°C, les huiles remontent à la surface du grain, lui donnant un aspect brillant. Les arômes de terroir disparaissent au profit de notes de cacao, de fumée, de réglisse. L'amertume s'accentue, l'acidité s'efface. Ces cafés sont souvent utilisés pour les expressos très serrés et les boissons avec du lait — leur corps épais passe la barrière du lait sans se perdre." },
    ],
  },
  {
    icon:"⭐", title:"Café de spécialité vs standard", desc:"Qu'est-ce qui fait un grand café ?", min:"6 min",
    keyFacts:["80+/100 points SCA = café de spécialité","Moins de 5% de la production mondiale","Traçabilité complète du producteur à la tasse"],
    sections:[
      { title:"Commodity vs spécialité", body:"La grande majorité du café mondial est vendu comme une matière première (commodity) : il est mélangé, standardisé, et le prix est fixé à la Bourse de New York. La qualité n'est pas une priorité — seul le volume compte. Le café de spécialité représente moins de 5% de la production mondiale. Il est tracé, singulier, et son prix reflète sa qualité réelle, non les fluctuations boursières." },
      { title:"La notation SCA", body:"La Specialty Coffee Association (SCA) a établi un protocole de notation sur 100 points, évalué par des Q-Graders certifiés. Un café doit obtenir au moins 80 points pour être considéré \"de spécialité\". Les critères incluent la douceur, l'acidité, le corps, l'équilibre, la complexité aromatique et l'absence de défauts. Au-delà de 90 points, on parle de \"café exceptionnel\"." },
      { title:"Les défauts qui font la différence", body:"Un lot de café specialty doit avoir zéro défaut de Catégorie 1 (grains noirs, grains fermentés, corps étrangers) et moins de 5 défauts de Catégorie 2 sur 350 g d'échantillon. Cette rigueur contraste radicalement avec le commodity où les défauts sont tolérés en grande quantité. C'est cette exigence qui garantit la régularité en tasse." },
      { title:"La traçabilité comme valeur", body:"Un café de spécialité a une identité précise : le nom du producteur, la variété, l'altitude, le mode de traitement. Cette traçabilité n'est pas un argument marketing — c'est une garantie de qualité. Elle permet aussi de rémunérer correctement les producteurs, car le torréfacteur achète directement au-dessus du prix du marché en échange de cette information et de cette qualité." },
    ],
  },
  {
    icon:"🤝", title:"Commerce équitable & labels", desc:"Fair Trade, Direct Trade, Rainforest Alliance", min:"7 min",
    keyFacts:["Fair Trade garantit un prix minimum de 1,80$/lb","Direct Trade peut dépasser 3$/lb","Bio = zéro pesticide synthétique"],
    sections:[
      { title:"Le problème du prix du café", body:"Le café est l'une des matières premières les plus échangées au monde, et pourtant la majorité des producteurs vit sous le seuil de pauvreté. Le prix fixé en Bourse fluctue énormément — parfois en dessous du coût de production — laissant les petits agriculteurs dans une situation précaire. Les labels sont nés pour répondre à cette injustice structurelle." },
      { title:"Fair Trade — le prix minimum garanti", body:"Fondé dans les années 1980, le label Fair Trade (commerce équitable) garantit aux coopératives de producteurs un prix minimum de 1,80 $/lb, même si le marché chute en dessous. En plus, une \"prime sociale\" de 0,20 $/lb est versée à la coopérative pour financer des projets communautaires (écoles, accès à l'eau, formation). La certification porte sur les coopératives, pas sur les fermes individuelles." },
      { title:"Direct Trade — la relation directe", body:"Le Direct Trade n'est pas un label certifié — c'est une philosophie d'achat pratiquée par certains torréfacteurs de spécialité. Ils achètent directement aux producteurs, sans intermédiaire, à des prix souvent bien supérieurs au marché (parfois 3 à 5 $/lb). Cette relation directe permet au torréfacteur de suivre la qualité de près et au producteur de recevoir une rémunération juste et prévisible." },
      { title:"Bio & Rainforest Alliance", body:"La certification Bio interdit l'usage de pesticides et engrais synthétiques. Elle protège la biodiversité, les sols et les agriculteurs. Rainforest Alliance certifie les pratiques agricoles durables : protection des forêts, gestion de l'eau, conditions de travail des employés. Ces deux labels sont complémentaires et souvent associés, mais n'adressent pas directement la rémunération du producteur comme le fait Fair Trade." },
    ],
  },
  {
    icon:"☕", title:"Les méthodes de préparation", desc:"Espresso, filtre, cold brew, AeroPress...", min:"8 min",
    keyFacts:["Espresso = 9 bars de pression","Cold brew = 12 à 24h d'extraction","La mouture est la variable la plus impactante"],
    sections:[
      { title:"Les trois grandes familles", body:"Toutes les méthodes de préparation reposent sur un principe simple : mettre en contact l'eau et le café pour en extraire les solubles aromatiques. On distingue trois grandes familles : l'infusion sous pression (espresso, moka), l'infusion par percolation ou filtration (V60, Chemex, filtre), et l'infusion par immersion (French Press, AeroPress, cold brew)." },
      { title:"Espresso — la pression au service de l'intensité", body:"L'espresso extrait en 25-30 secondes avec 9 bars de pression. Cette pression crée une émulsion unique : la crema, cette mousse dorée qui emprisonne les arômes volatils. L'espresso concentre les saveurs mais aussi les défauts — la mouture, la dose et le tassage doivent être parfaits. Il sert de base aux boissons lactées (cappuccino, flat white) qui adoucissent son intensité." },
      { title:"Filtre — la lenteur qui révèle le terroir", body:"Le filtre (V60, Chemex, Kalita) fait couler l'eau chaude (93-96°C) lentement à travers le café moulu, pour une extraction propre et nuancée. Le filtre papier retient les huiles, rendant la tasse claire et légère. C'est la méthode préférée des amateurs de spécialité : elle met en valeur la complexité aromatique d'un café de terroir comme aucune autre. L'AeroPress combine immersion et pression pour une grande flexibilité." },
      { title:"Cold Brew, Moka & French Press", body:"Le cold brew infuse le café pendant 12 à 24 heures dans de l'eau froide. L'extraction lente à basse température donne une boisson douce, peu acide, très concentrée — à diluer. La French Press, elle, laisse le café en contact complet avec l'eau chaude pendant 4 minutes : le résultat est épais, corsé, avec plus de corps. Le Moka (cafetière italienne) crée une pression vapeur modérée pour un café dense, proche de l'espresso mais moins puissant." },
    ],
  },
  {
    icon:"🌱", title:"Impact carbone du café", desc:"L'empreinte environnementale de votre tasse", min:"5 min",
    keyFacts:["15,33 kg CO₂ par kg de café torréfié","60% des émissions viennent de la culture","Le Bio réduit l'impact de 25 à 30%"],
    sections:[
      { title:"La chaîne d'impact", body:"Produire un kilogramme de café torréfié génère en moyenne 15 à 17 kg de CO₂ équivalent — soit l'empreinte d'un trajet de 80 km en voiture. Cette empreinte se répartit sur toute la chaîne : culture (déforestation, intrants chimiques), traitement (eau du procédé lavé), transport maritime des grains verts, torréfaction, et enfin l'emballage." },
      { title:"L'origine : le facteur le plus important", body:"Le pays d'origine d'un café influence fortement son impact environnemental. Les cafés cultivés en altitude, dans des zones de forêt préservée, avec des pratiques agroforestières (ombrage naturel, absence de pesticides) ont une empreinte bien moindre que ceux produits en monoculture intensive à basse altitude. L'Éthiopie, le Rwanda et d'autres pays africains produisent souvent des cafés à faible empreinte grâce à des pratiques traditionnelles." },
      { title:"Arabica vs Robusta", body:"L'Arabica est cultivé en altitude, dans des conditions de forêt, souvent sans intrants chimiques. Le Robusta, cultivé en plaine en monoculture intensive, nécessite davantage de pesticides et d'engrais. Sur le plan environnemental, l'Arabica de montagne bien géré est généralement plus vertueux. Le procédé de traitement compte aussi : le traitement naturel (séchage au soleil) consomme peu d'eau, contrairement au lavé qui nécessite de grandes quantités." },
      { title:"Ce que vous pouvez faire", body:"Choisir un café Bio réduit l'empreinte de 25 à 30% en éliminant les intrants chimiques. Un café Rainforest Alliance ou avec une mention agroforestière garantit que des arbres d'ombrage ont été préservés — habitat de nombreuses espèces et puits de carbone naturel. Enfin, le café acheté en grain et moulu à la maison évite l'emballage des dosettes — dont l'impact cumulé est considérable à l'échelle de millions de consommateurs." },
    ],
  },
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
