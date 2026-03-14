# Qualité et validation

## Tests

- **Unitaires (Vitest)** : `npm run test` ou `npm run test:run`
  - `src/features/diabetcare/hooks/useMeasureChart.test.ts` : logique du graphique et formes (hypo / in_range / hyper).
  - `src/pages/DiabetCareClinicalMockupPage.test.tsx` : rendu de la page et navigation.
- **E2E (Playwright)** : `npm run test:e2e`
  - `e2e/patient-flow.spec.ts` : tableau de bord patient, onglet Mesures, Échanges.
  - `e2e/clinician-flow.spec.ts` : bascule Soignant, Cockpit, liste Patients.

Configuration : `vite.config.ts` (test), `playwright.config.ts` (E2E). Setup des tests unitaires : `src/test/setup.ts`.

## Build et Tailwind

Tailwind est intégré au build Vite via `@tailwindcss/vite` (plus de CDN). Entrée CSS : `src/styles.css` avec `@import "tailwindcss"` et tokens du design system.

## Accessibilité

- Focus visible, landmarks (`main`, `nav`, `section`), `aria-label` sur les boutons et actions.
- Double codage visuel sur les courbes (forme + couleur).
- Pour un audit automatisé : lancer l’app (`npm run dev`), puis Lighthouse (Chrome DevTools) ou axe DevTools sur la page. Objectif : viser 100 en accessibilité et corriger les régressions.

## Multi-tailles d’écran

Le cadre téléphone (`PhoneFrame`) fixe (390×844) sert au mockup. Pour valider d’autres tailles :
- Réduire la dépendance au cadre : le contenu principal peut être rendu dans un conteneur responsive ; `PhoneFrame` peut être conditionnel (ex. variable d’environnement ou mode “demo”).
- Tester en redimensionnant la fenêtre ou en désactivant temporairement le cadre pour vérifier grilles et espacements (tokens `--space-*`, `--radius-*`).
