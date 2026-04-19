import { C, FONT_SERIF, FONT_SANS } from '../lib/constants';
import { Sheet, Section } from '../components/Atoms';

function LegalBlock({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <p style={{ color: C.dark, fontWeight: 700, fontSize: 14, fontFamily: FONT_SERIF, margin: "0 0 8px" }}>{title}</p>
      <p style={{ color: C.text, fontSize: 13, lineHeight: 1.75, margin: 0 }}>{children}</p>
    </div>
  );
}

export function CGUSheet({ visible, onClose }) {
  return (
    <Sheet visible={visible} onClose={onClose} maxH="90vh">
      <p style={{ color: C.dark, fontWeight: 700, fontSize: 22, fontFamily: FONT_SERIF, margin: "0 0 4px" }}>Conditions d'utilisation</p>
      <p style={{ color: C.muted, fontSize: 12, margin: "0 0 24px" }}>Dernière mise à jour : avril 2026</p>

      <LegalBlock title="1. Objet">
        Les présentes conditions régissent l'utilisation de l'application Roastly. (ci-après « le Service »), accessible via navigateur web et téléphone mobile. En utilisant le Service, vous acceptez ces conditions dans leur intégralité.
      </LegalBlock>

      <LegalBlock title="2. Accès au service">
        Le Service est accessible gratuitement à toute personne disposant d'un accès internet. Certaines fonctionnalités (notation, favoris synchronisés) nécessitent la création d'un compte. L'utilisation en lecture seule ne requiert aucune inscription.
      </LegalBlock>

      <LegalBlock title="3. Compte utilisateur">
        Vous êtes responsable de la confidentialité de vos identifiants de connexion. Tout accès au Service via votre compte est réputé effectué par vous. En cas d'utilisation non autorisée, vous devez nous en informer immédiatement à hello@roastly.app.
      </LegalBlock>

      <LegalBlock title="4. Contenu utilisateur">
        En ajoutant un café ou en postant un avis, vous garantissez être titulaire des droits nécessaires sur le contenu soumis. Vous accordez à Roastly. une licence mondiale, non exclusive, pour utiliser, reproduire et afficher ce contenu dans le cadre du Service. Les images de packaging appartiennent à leurs propriétaires respectifs — leur utilisation à des fins d'identification est couverte par le droit de citation.
      </LegalBlock>

      <LegalBlock title="5. Comportement interdit">
        Il est interdit d'utiliser le Service pour publier du contenu illicite, trompeur ou offensant ; de tenter d'accéder sans autorisation aux systèmes de Roastly. ; d'utiliser des robots ou scripts pour collecter automatiquement des données.
      </LegalBlock>

      <LegalBlock title="6. Limitation de responsabilité">
        Le Service est fourni « en l'état ». Roastly. ne garantit pas l'exactitude des informations fournies par la communauté. En aucun cas Roastly. ne saurait être tenu responsable de dommages indirects résultant de l'utilisation du Service.
      </LegalBlock>

      <LegalBlock title="7. Modification des CGU">
        Roastly. se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs enregistrés seront notifiés par email. La poursuite de l'utilisation du Service vaut acceptation des nouvelles conditions.
      </LegalBlock>

      <LegalBlock title="8. Droit applicable">
        Les présentes CGU sont soumises au droit français. Tout litige relève de la compétence exclusive des tribunaux de Paris.
      </LegalBlock>
    </Sheet>
  );
}

export function PrivacySheet({ visible, onClose }) {
  return (
    <Sheet visible={visible} onClose={onClose} maxH="90vh">
      <p style={{ color: C.dark, fontWeight: 700, fontSize: 22, fontFamily: FONT_SERIF, margin: "0 0 4px" }}>Politique de confidentialité</p>
      <p style={{ color: C.muted, fontSize: 12, margin: "0 0 24px" }}>Conforme au RGPD — Dernière mise à jour : avril 2026</p>

      <LegalBlock title="Responsable du traitement">
        Daniel Picot — picot1daniel@gmail.com{"\n"}Roastly., Paris, France
      </LegalBlock>

      <LegalBlock title="Données collectées">
        <strong>Lors de l'inscription :</strong> adresse email, prénom (optionnel), mot de passe hashé.{"\n\n"}
        <strong>Lors de l'utilisation :</strong> cafés notés et mis en favoris, historique de scans (EAN + horodatage), profil de goût calculé.{"\n\n"}
        <strong>Automatiquement :</strong> logs de connexion (adresse IP, navigateur) conservés 30 jours par Supabase.
      </LegalBlock>

      <LegalBlock title="Finalités du traitement">
        — Fourniture du Service et personnalisation (profil de goût, archétype){"\n"}
        — Synchronisation de vos favoris entre appareils{"\n"}
        — Amélioration du Service par analyse agrégée et anonymisée{"\n"}
        — Communication en cas de modification des CGU (email uniquement)
      </LegalBlock>

      <LegalBlock title="Bases légales">
        L'exécution du contrat (art. 6.1.b RGPD) pour les données nécessaires au Service. Votre consentement (art. 6.1.a) pour les communications optionnelles. Nos intérêts légitimes (art. 6.1.f) pour la sécurité et l'amélioration du Service.
      </LegalBlock>

      <LegalBlock title="Durée de conservation">
        Données de compte : durée de vie du compte + 1 an après suppression.{"\n"}
        Avis et contributions : conservés même après suppression du compte (contenu dissocié de l'identité).{"\n"}
        Logs de connexion : 30 jours (politique Supabase).
      </LegalBlock>

      <LegalBlock title="Vos droits (RGPD)">
        Vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition. Pour exercer ces droits : hello@roastly.app. Réponse sous 30 jours. En cas de litige non résolu, vous pouvez saisir la CNIL (www.cnil.fr).
      </LegalBlock>

      <LegalBlock title="Sous-traitants">
        <strong>Supabase Inc.</strong> (base de données, authentification) — Politique de confidentialité : supabase.com/privacy{"\n\n"}
        <strong>Vercel Inc.</strong> (hébergement frontend) — Politique de confidentialité : vercel.com/legal/privacy-policy{"\n\n"}
        Aucune donnée personnelle n'est vendue ou transmise à des tiers à des fins publicitaires.
      </LegalBlock>

      <LegalBlock title="Cookies">
        Roastly. utilise uniquement des cookies strictement nécessaires au fonctionnement du Service (session d'authentification, préférences d'affichage). Aucun cookie de tracking tiers n'est utilisé.
      </LegalBlock>
    </Sheet>
  );
}

export function LegalMentionsSheet({ visible, onClose }) {
  return (
    <Sheet visible={visible} onClose={onClose}>
      <p style={{ color: C.dark, fontWeight: 700, fontSize: 22, fontFamily: FONT_SERIF, margin: "0 0 24px" }}>Mentions légales</p>

      <LegalBlock title="Éditeur">
        Roastly. est édité par Daniel Picot, auto-entrepreneur.{"\n"}
        Email : picot1daniel@gmail.com{"\n"}
        Siège : Paris, France
      </LegalBlock>

      <LegalBlock title="Hébergement frontend">
        Vercel Inc.{"\n"}
        340 Pine Street, Suite 603{"\n"}
        San Francisco, CA 94104 — États-Unis{"\n"}
        vercel.com
      </LegalBlock>

      <LegalBlock title="Hébergement base de données">
        Supabase Inc.{"\n"}
        970 Toa Payoh North, #07-04{"\n"}
        Singapour 318992{"\n"}
        supabase.com
      </LegalBlock>

      <LegalBlock title="Propriété intellectuelle">
        Le nom, le logo et le design de Roastly. sont la propriété exclusive de Daniel Picot. Les données produits proviennent de la communauté et d'Open Food Facts (licence ODbL). Les images de packaging appartiennent à leurs marques respectives.
      </LegalBlock>

      <LegalBlock title="Crédits">
        Polices : Cormorant Garamond (SIL OFL), Inter (SIL OFL).{"\n"}
        Icônes : SVG custom.{"\n"}
        Scanner : html5-qrcode (Apache 2.0).
      </LegalBlock>

      <div style={{ marginTop: 8, padding: "16px 0", borderTop: `1px solid ${C.light}` }}>
        <p style={{ color: C.muted, fontSize: 12, textAlign: "center" }}>© 2026 Roastly. — Tous droits réservés</p>
      </div>
    </Sheet>
  );
}
