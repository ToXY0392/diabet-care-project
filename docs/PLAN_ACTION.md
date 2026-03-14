# Plan d'Action : Mise en œuvre de DiabetCare V1.0

Ce document détaille les étapes opérationnelles pour transformer le mockup interactif en une application de santé robuste, inclusive et professionnelle.

---

## ✅ Phase 1 : Accessibilité & "Quick Wins" (Terminée)
*Objectif : Corriger les défauts critiques identifiés lors de l'audit WCAG.*

1.  **Ajustement des Contrastes** : [TERMINÉ]
    - Variables de couleur pour le texte gris mises à jour.
    - Couleurs de badges "Info" améliorées pour le contraste.
2.  **Accessibilité Sémantique** : [TERMINÉ]
    - Balises structurelles remplacées par `<main>`, `<nav>`, `<section>`.
    - `aria-label` ajoutés sur les boutons iconographiques.
3.  **Navigation au Clavier** : [TERMINÉ]
    - Classe `:focus-visible` implémentée avec un indicateur visuel clair.

---

## ✅ Phase 2 : Standardisation du Design System (Terminée)
*Objectif : Appliquer la nouvelle charte graphique de manière rigoureuse.*

1.  **Refactorisation des Composants** : [TERMINÉ]
    - Tokens CSS dans `src/styles.css` (couleurs, typo, espacements, rayons). Variantes Card : `default`, `hero`, `danger`, `warning`, `surface`.
    - Composants transverses alignés (Badge, SectionTitle, Modal, MessageComposer, PhoneFrame). Classe `.text-critical-number` pour chiffres critiques.
2.  **Harmonisation Typographique** : [TERMINÉ]
    - Échelle via variables CSS. Police monospace pour glycémie/indicateurs (voir `docs/DESIGN_SYSTEM.md`).

---

## ✅ Phase 3 : Optimisation UX & User Flows (Terminée)
*Objectif : Fluidifier les parcours et réduire la charge cognitive.*

1.  **Navigation Intuitive** : [TERMINÉ]
    - Breadcrumbs dans Échanges (Messages / Documents, liste et détail/thread). Fil d'Ariane cliquable pour remonter.
2.  **Feedback Utilisateur** : [TERMINÉ]
    - Toasts de confirmation (glycémie, repas). États vides (aucune conversation, aucun document) dans les listes.
3.  **Data-viz Inclusive** : [TERMINÉ]
    - Double codage dans `useMeasureChart` et courbe glycémie : cercle = dans la cible, triangle = hyper, carré = hypo (formes + couleurs).

---

## ✅ Phase 4 : Validation & Assurance Qualité (Terminée)
*Objectif : Garantir la robustesse et la compatibilité universelle.*

1.  **Outillage de test** : [TERMINÉ]
    - Vitest + @testing-library/react + jsdom ; `vitest.config` dans `vite.config.ts`, setup dans `src/test/setup.ts`.
    - Tests unitaires : `useMeasureChart` (path, areaPath, points, stats, shape hypo/in_range/hyper), page principale (rendu, navigation).
    - Playwright E2E : flux patient (dashboard, Mesures, Échanges), flux clinicien (Soignant, Cockpit, Patients). Voir `docs/QUALITY.md`.
2.  **Build** : [TERMINÉ]
    - Tailwind CDN remplacé par pipeline Vite + `@tailwindcss/vite` ; `@import "tailwindcss"` dans `src/styles.css`.
3.  **Audit a11y et performance** :
    - Principes en place (focus, landmarks, aria-label, double codage). Audit automatisé : Lighthouse / Axe (voir `docs/QUALITY.md`).
4.  **Multi-tailles** :
    - Préparation documentée : réduction de la dépendance au cadre fixe, tests en responsive (voir `docs/QUALITY.md`).

---

## ✅ Phase 5 : Déploiement & Maintenance (Terminée)
- **CI** : Workflow `.github/workflows/ci.yml` (build, tests unitaires sur push/PR).
- **Doc déploiement** : `docs/DEPLOYMENT.md` (cible hébergement statique, variables `VITE_*`, étapes).
- **Feedback** : Composant `FeedbackWidget` (bulle « ? » ouvrant un lien mail / préparation future API).
- **Instrumentation** : Marques `performance.mark` / `performance.measure` au boot (`app-boot`) dans `main.tsx` ; base pour monitoring des rendus critiques et navigation.
- **Docs** : `docs/INSTALLATION.md` et `TODO.md` réalignés avec tests, build Tailwind et déploiement.

---
*Ce plan est évolutif et sera mis à jour en fonction des retours des tests utilisateurs.*
