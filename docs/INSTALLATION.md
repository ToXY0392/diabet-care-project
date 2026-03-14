# Guide d'Installation

Ce guide vous aide à configurer votre environnement local pour travailler sur le prototype DiabetCare.

## Prérequis
- **Node.js** (Version 18.0 ou supérieure recommandée)
- **npm** (Inclus avec Node.js)

## Installation
1.  **Cloner le dépôt** (ou ouvrir le dossier du projet).
2.  **Installer les dépendances** :
    ```bash
    npm install
    ```

## Lancement
- **Mode développement** (avec rechargement automatique) :
    ```bash
    npm run dev
    ```
    L'application sera disponible sur `http://localhost:5173`.

- **Build de production** :
    ```bash
    npm run build
    ```

- **Prévisualiser le build** :
    ```bash
    npm run preview
    ```

## Tests
- **Tests unitaires** : `npm run test` (watch) ou `npm run test:run`.
- **Tests E2E** : `npm run test:e2e` (Playwright ; lancer `npx playwright install` une fois si besoin).
Voir `docs/QUALITY.md` pour le détail.

## Technologies utilisées
- **Vite** : Serveur de développement et bundler rapide.
- **React (TypeScript)** : Framework UI.
- **Tailwind CSS** : Intégré au build via `@tailwindcss/vite` (voir `src/styles.css`).
- **Lucide React** : Bibliothèque d'icônes.

## Déploiement
Voir `docs/DEPLOYMENT.md` pour la cible d’hébergement, les variables d’environnement et les étapes de déploiement.
