# Charte Graphique - DiabetCare

Ce document définit les standards visuels et les principes de design de l'application DiabetCare afin de garantir une cohérence entre les différents écrans et fonctionnalités. Les tokens sont définis dans `src/styles.css` (variables CSS `:root`).

---

## 1. Univers de Marque
**DiabetCare** est une solution de santé numérique. Son identité visuelle doit inspirer la **confiance**, la **sérénité** et la **précision**. L'usage de teintes de vert d'eau et de mint évoque le calme et la santé.

---

## 2. Tokens (variables CSS)

### Couleurs
- `--color-text` : Texte principal (#233636).
- `--color-text-secondary` : Texte secondaire (#616f73).
- `--color-bg` : Fond de page (#e3f2ee).
- `--color-surface` : Surfaces (#f7fafb).
- `--color-mint` : Mint (#E9F6F3).
- `--color-teal` : Teal principal (#1c8f84).
- `--color-teal-deep` / `--color-teal-end` : Dégradé cartes hero.
- `--color-teal-on-mint` : Teal foncé sur fond mint, contraste AA (#0d4d48).
- `--color-border` : Bordures (#dde5e7).
- `--color-border-strong`, `--color-border-subtle`, `--color-border-mint` : Variantes de bordure.
- `--color-label` (#2c4443), `--color-muted` (#4d6260), `--color-muted-strong` (#6d716f), `--color-inactive` (#7a8483) : Hiérarchie texte secondaire.
- `--color-surface-alt` : Fonds d’onglets / zones (#f1f5f6).
- `--color-info`, `--color-danger`, `--color-warning`, `--color-success` : Sémantique santé.

### Typographie
- `--font-sans` : Inter, system-ui, sans-serif.
- `--font-mono` : Chiffres critiques (glycémie).
- `--text-hero` : Valeur glycémie (clamp 2.5rem–4rem).
- `--text-title` : Titres (clamp 1.25rem–1.875rem).
- `--text-section` : Titre de section (1.375rem).
- `--text-body`, `--text-sm`, `--text-xs`, `--text-label`, `--tracking-label`.

### Espacements (base 4px)
- `--space-1` à `--space-20` (0.25rem à 5rem).

### Rayons
- `--radius-sm` (14px), `--radius-md` (18px), `--radius-lg` (24px), `--radius-xl` (28px), `--radius-2xl` (38px), `--radius-frame` (48px).

### Chiffres critiques
Classe utilitaire `.text-critical-number` : police monospace, `tabular-nums`, pour éviter le « saut » visuel des valeurs (glycémie, TIR, etc.).

---

## 3. Composant Card (variantes)
- **default** : Dégradé teal (boutons d’action, KPI).
- **hero** : Même dégradé, usage « bloc principal » (capteur, dashboard).
- **danger** : Fond rouge (alerte hypo).
- **warning** : Fond ambre (alerte hyper).
- **surface** : Fond clair, bordure (listes, formulaires, contenu secondaire).

---

## 4. Palette & couleurs sémantiques
Les hex historiques restent alignés avec les variables : Teal `#1c8f84`, Gradient `#1f8f83` / `#33b2a3`, Cible `#58c56d`, Hypo `#e04b42`, Hyper `#d9a41b`, Info `#1f6d67`.

### Vérification des contrastes (WCAG 2.1 AA)
| Combinaison | Ratio (approx.) | Usage |
| :--- | :--- | :--- |
| `--color-text` (#233636) sur `--color-bg` / `--color-mint` | ≥ 4,5:1 | Texte principal, corps |
| `--color-text-secondary` (#616f73) sur fond clair | ≥ 4,5:1 | Texte secondaire |
| `--color-teal-on-mint` (#0d4d48) sur `--color-mint` | ≥ 4,5:1 | Badges, boutons secondaires sur mint |
| Blanc sur `--color-teal` (#1c8f84) | ~3,5:1 | Boutons primaires, titres sur teal (viser 4,5:1 si texte petit) |
| `--color-label` (#2c4443) sur fond clair | ≥ 4,5:1 | Labels en majuscules |
| `--color-danger` / `--color-warning` avec blanc ou `#1a1a1a` | ≥ 4,5:1 | Cartes alerte |
| `--color-inactive` (#7a8483) sur `--color-surface-alt` | limite | Onglets inactifs uniquement ; éviter pour paragraphes |

---

## 5. Composants transverses
- **Badge** : tons `neutral`, `active`, `hypo`, `hyper`, `info` ; rayons et tailles via tokens.
- **SectionTitle** : titre en `--text-section`, sous-titre en `--text-sm` / `--color-text-secondary`.
- **Modal** : rayon `--radius-xl`, couleurs surface et bordure via tokens.
- **MessageComposer** : Card `surface`, champs avec `--color-border`, bouton dégradé teal.
- **PhoneFrame** : fond et cadres via `--color-bg`, `--color-mint`, `--radius-frame`, `--radius-2xl`.

---

## 6. Icônographie & Layout
- **Icônes** : [Lucide React](https://lucide.dev/), traits fins, couleurs Teal ou sémantiques.
- **Grille mobile** : marges 16–20px ; espacements pilotés par tokens (système 4px).
- **Navigation** : barre basse (Bottom Nav).

---
*Document de référence pour le développement de DiabetCare. Réaligné avec les tokens et variantes de Card en place.*
