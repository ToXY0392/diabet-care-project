# Déploiement en local

Guide pour installer et lancer l’application en local.

## Prérequis

- **Node.js** 18+ ([nodejs.org](https://nodejs.org))
- **npm** (fourni avec Node.js)

Vérifier les versions :

```bash
node -v
npm -v
```

## Commandes

### 1. Cloner le projet

```bash
git clone <url-du-repo> vince
cd vince
```

*(Si le projet est déjà cloné, aller dans le dossier du projet.)*

### 2. Installer les dépendances

```bash
npm install
```

En cas de conflits de peer dependencies :

```bash
npm install --legacy-peer-deps
```

### 3. Lancer en développement

```bash
npm run dev
```

L’app est disponible sur **http://localhost:5173**.

Arrêter le serveur : `Ctrl+C`.

### 4. Build de production (optionnel)

```bash
npm run build
```

Les fichiers sont générés dans `dist/`.

### 5. Prévisualiser le build

```bash
npm run preview
```

Sert le contenu de `dist/` en local (souvent sur http://localhost:4173).

## Récapitulatif des commandes

| Action              | Commande                    |
|---------------------|-----------------------------|
| Installer           | `npm install`               |
| Lancer en dev       | `npm run dev`               |
| Build production    | `npm run build`             |
| Prévisualiser build | `npm run preview`            |
| Tests unitaires     | `npm run test` ou `npm run test:run` |
| Tests E2E           | `npm run test:e2e` (après `npx playwright install` si besoin) |

## Variables d’environnement

Aucune variable obligatoire pour le lancement en local. Pour un futur branchement API :

- `VITE_API_URL` : URL de l’API
- `VITE_APP_ENV` : `development` | `staging` | `production`

Créer un fichier `.env` à la racine si besoin (il est ignoré par Git).

## Dépannage

- **Port 5173 déjà utilisé** : Vite propose un autre port dans le terminal, ou définir `PORT` dans `.env`.
- **Erreurs après `npm install`** : supprimer `node_modules` et `package-lock.json`, puis relancer `npm install`.
- **Tests E2E** : première fois, exécuter `npx playwright install` pour télécharger les navigateurs.
