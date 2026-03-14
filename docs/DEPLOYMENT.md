# Déploiement

## Cible d’hébergement

- **Front** : application SPA (Vite + React). Déployable sur tout hébergeur de fichiers statiques : **Vercel**, **Netlify**, **GitHub Pages**, **Cloudflare Pages**, ou serveur nginx/Apache.
- **Build** : `npm run build` produit le dossier `dist/` (HTML, CSS, JS). Servir `dist/` à la racine.

## Variables d’environnement

En développement, aucune variable obligatoire. Pour une évolution future (API, analytics) :

- `VITE_API_URL` : URL de l’API backend (si branchement).
- `VITE_APP_ENV` : `development` | `staging` | `production` (optionnel).

Les variables préfixées par `VITE_` sont exposées au client via `import.meta.env`.

## Étapes de déploiement (exemple générique)

1. Cloner le dépôt, puis :
   ```bash
   npm ci --legacy-peer-deps
   npm run build
   ```
2. Déployer le contenu de `dist/` vers la racine du site (ou le répertoire configuré pour la SPA).
3. Configurer la redirection SPA : toutes les routes vers `index.html` (pour un futur routage client).

## CI

Le workflow `.github/workflows/ci.yml` exécute sur push/PR : installation, build, tests unitaires. Optionnel : ajouter `npm run test:e2e` avec services Playwright en CI.
