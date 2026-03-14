# Plan d'Amélioration Visuelle et d'Accessibilité Universelle

**Objectif :** Atteindre un rendu "Premium Medical Grade" et garantir une utilisabilité totale pour toutes les tranches d'âge (Design Inclusif).

---

## 1. Ergonomie Cognitive & Accessibilité (Focus Seniors/Déficients)

Pour qu'une application de santé soit adoptée par des seniors ou des personnes en situation de stress (hypoglycémie), la clarté doit primer sur l'esthétique pure.

### Actions Immédiates
- **Cibles Tactiles (Touch Targets)** : Porter toutes les zones cliquables à un minimum de `44x44px` pour compenser les tremblements ou le manque de précision.
- **Iconographie Parlante** : Ne jamais afficher une icône seule. Accompagner systématiquement chaque icône d'un label textuel clair (ex: "✉ Messages" au lieu de juste "✉").
- **Contrastes AAA** : Ajuster la palette pour dépasser les standards WCAG 2.1 (ratio 7:1 pour le texte critique).
- **Mode "Texte Large"** : Utiliser des unités `rem` pour que l'interface s'adapte automatiquement à la taille de police choisie dans les réglages système du smartphone.

---

## 2. Design Visuel "Premium Medical"

L'objectif est de passer d'un aspect "Application mobile classique" à un "Dispositif Médical de Confiance".

### Raffinement de la Surface
- **Hiérarchie par la Lumière** : Utiliser des dégradés plus subtils et des ombres portées douces (soft shadows) pour créer de la profondeur sans charger l'écran.
- **Micro-interactions Sémantiques** : 
    - Une glycémie qui monte doit déclencher une animation de pulsation lente et ambrée.
    - Une validation de repas doit afficher une coche de succès "bienveillante" (vert doux).
- **Typographie de Précision** : En place via la classe `.text-critical-number` et la variable `--font-mono` dans `src/styles.css`, appliquée aux chiffres de glycémie et indicateurs numériques critiques pour éviter que les valeurs ne "sautent" lors des mises à jour.

---

## 3. Data Visualization Inclusive

Le diabète est une maladie de la donnée. Celle-ci doit être interprétable en un clin d'œil.

### Optimisation des Graphiques
- **Double Codage** : Ne pas se fier uniquement à la couleur (rouge/vert) pour les daltoniens. Utiliser des formes (cercle pour stable, triangle haut pour hyper) ou des textures sur les courbes.
- **Contextualisation** : Afficher la "Zone de Confort" en arrière-plan des graphiques de manière plus explicite avec un libellé "Zone Cible".
- **Focus Temporel** : Permettre un zoom "pincé" (pinch-to-zoom) sur les courbes pour les utilisateurs ayant besoin de voir les détails des 30 dernières minutes.

---

## 4. Roadmap de Déploiement Global

| Phase | Focus | Impact Utilisateur |
| :--- | :--- | :--- |
| **Phase 1** | **Lisibilité & Contrastes** | Immédiat pour les seniors et malvoyants. |
| **Phase 2** | **Standardisation des Composants** | Cohérence visuelle sur toute l'app. (Tokens, variantes Card, `.text-critical-number` ; voir `docs/DESIGN_SYSTEM.md`.) |
| **Phase 3** | **Animations & Feedbacks** | Réduction de l'anxiété liée à l'usage. |
| **Phase 4** | **Tests Utilisateurs Multi-âges** | Validation de l'ergonomie réelle. |

---

## 5. Principes de Design "Âge-Agnotique"

1.  **Prédictibilité** : Un bouton doit toujours ressembler à un bouton. Pas de gestes cachés (long press, swipe complexe) pour les fonctions vitales.
2.  **Pardonnance** : Les erreurs de saisie doivent être faciles à corriger (gros boutons "Annuler").
3.  **Calme visuel** : Pas de notifications intrusives ou de couleurs criardes en dehors des alertes vitales.
4.  **Assistance** : Présence d'une bulle d'aide ou d'un lexique pour les termes médicaux complexes (HbA1c, TIR, GMI).

---
*Ce plan sert de guide pour transformer DiabetCare en un standard d'excellence UI/UX santé.*
