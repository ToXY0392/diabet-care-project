# Guide Expo – Débutant

Ce guide explique **à quoi sert Expo**, comment l’utiliser et **quoi faire sur ton téléphone** pour tester l’application mobile du projet.

---

## 1. C’est quoi Expo ?

**Expo** est un outil pour créer et faire tourner des **applications mobiles** (Android et iPhone) avec **React Native**.

- Ton projet actuel **vince-app** (à la racine) est une **application web** : elle tourne dans le navigateur (Chrome, Firefox, etc.) avec Vite + React.
- Le dossier **`mobile/`** est un **projet Expo** : c’est une **app mobile** qui peut tourner sur un vrai téléphone ou un simulateur.

En résumé :

| | **Application web (racine)** | **Application mobile (mobile/)** |
|---|---|---|
| **Où ça tourne** | Navigateur (PC ou mobile) | Téléphone Android / iPhone (ou simulateur) |
| **Techno** | Vite + React | Expo + React Native |
| **Lancer** | `npm run dev` | `cd mobile` puis `npm start` |

Expo sert donc à **développer et tester une version mobile** de ton app, directement sur ton téléphone, sans avoir à installer Android Studio ou Xcode tout de suite.

---

## 2. À quoi ça sert concrètement ?

- **Voir l’app sur ton téléphone** en temps réel pendant que tu codes.
- **Tester** comme un vrai utilisateur (toucher, scroll, clavier, etc.).
- **Un jour**, transformer ton idée (ex. DiabetCare) en une vraie app téléchargeable sur le Play Store / App Store.

Pour commencer, tu utilises **Expo Go** : une app à installer sur ton téléphone qui ouvre ton projet en développement.

---

## 3. Ce qu’il te faut avant de commencer

### Sur ton PC

- **Node.js** (déjà installé si tu peux lancer `npm run dev` à la racine).
- Un **éditeur de code** (Cursor, VS Code, etc.).

### Sur ton téléphone

- **Expo Go** installé (voir section suivante).
- Le téléphone et le PC doivent être sur **le même réseau Wi‑Fi** (sinon le téléphone ne peut pas se connecter au serveur de développement).

---

## 4. Ce que tu dois faire sur ton téléphone

### Étape 1 : Installer Expo Go

- **Android** : va sur le [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) et installe **Expo Go**.
- **iPhone** : va sur l’App Store et installe **Expo Go**.

C’est une app « bac à sable » qui permet d’ouvrir ton projet Expo sans compiler une vraie app.

### Étape 2 : Mettre le téléphone et le PC sur le même Wi‑Fi

- Connecte ton PC et ton téléphone au **même réseau Wi‑Fi**.
- Si tu es en partage de connexion (4G) sur le téléphone, ça ne marchera pas pour cette méthode : il faut que le PC et le téléphone soient sur le même Wi‑Fi.

### Étape 3 : Lancer le projet sur le PC (voir section 5)

Une fois `npm start` lancé dans le dossier `mobile/`, un **QR code** s’affiche dans le terminal.

### Étape 4 : Scanner le QR code avec ton téléphone

- **Android** : ouvre **Expo Go**, puis utilise « Scan QR code » et scanne le QR code affiché dans le terminal.
- **iPhone** : ouvre l’**app Caméra** (pas Expo Go), vise le QR code ; un bandeau proposera d’ouvrir le projet dans Expo Go. Clique dessus.

Après le scan, Expo Go charge ton projet et l’affiche sur ton téléphone. Tu devrais voir l’écran de l’app « mobile » (template blank).

---

## 5. Lancer le projet Expo sur ton PC

Ouvre un terminal (PowerShell ou CMD) et exécute :

```bash
cd mobile
npm start
```

Tu devrais voir :

- Un **QR code** dans le terminal.
- Éventuellement une page web qui s’ouvre avec le même QR code et des infos.

Tant que `npm start` tourne, ton téléphone (s’il a chargé l’app via le QR code) reste connecté : quand tu modifies le code et sauvegardes, l’app peut se recharger automatiquement (Fast Refresh).

### Autres commandes utiles (dans le dossier `mobile/`)

| Commande | Effet |
|----------|--------|
| `npm start` | Démarre le serveur Expo et affiche le QR code (recommandé pour le téléphone). |
| `npm run android` | Ouvre l’app dans un émulateur Android (si Android Studio est installé). |
| `npm run ios` | Ouvre l’app sur le simulateur iOS (uniquement sur Mac avec Xcode). |
| `npm run web` | Ouvre l’app dans le navigateur (version web Expo). |

Pour un **débutant avec un téléphone**, il suffit de retenir : **`cd mobile`** puis **`npm start`**, puis **scanner le QR code** avec Expo Go.

---

## 6. Structure du projet Expo (`mobile/`)

```
mobile/
├── App.tsx          ← Code principal de l’écran (tu peux modifier pour tester).
├── app.json         ← Nom de l’app, icône, splash screen, etc.
├── index.ts         ← Point d’entrée (généralement on ne touche pas).
├── package.json     ← Dépendances et scripts (npm start, etc.).
├── tsconfig.json    ← Config TypeScript.
└── assets/          ← Images, icônes, splash.
```

- Pour **changer ce qui s’affiche** sur le téléphone, édite **`mobile/App.tsx`**.
- Pour **changer le nom ou l’icône** de l’app dans Expo Go, édite **`mobile/app.json`**.

---

## 7. Dépannage rapide

| Problème | À vérifier |
|----------|------------|
| Le téléphone ne charge pas l’app après le scan | PC et téléphone sur le **même Wi‑Fi** ? Expo Go à jour ? |
| « Unable to connect » ou erreur réseau | Pare-feu Windows : autoriser Node/Expo. Sinon essaye « Tunnel » dans le terminal (option proposée par Expo). |
| Le QR code ne s’affiche pas | Vérifier que tu es bien dans le dossier `mobile/` et que tu as fait `npm start`. |
| L’app se déconnecte tout le temps | Éviter la mise en veille agressive du téléphone ; garder Expo Go au premier plan pendant les tests. |

### Mode Tunnel (si le même Wi‑Fi ne suffit pas)

Dans le terminal où `npm start` tourne, tu peux appuyer sur une touche pour afficher le menu Expo. Choisir l’option **Tunnel** : Expo va créer un tunnel (nécessite un outil comme `ngrok`) pour que le téléphone puisse se connecter même sans être sur le même Wi‑Fi. Plus lent, mais utile en dépannage.

---

## 8. Récapitulatif : quoi faire dans l’ordre

1. **Sur le téléphone** : installer **Expo Go** (Play Store ou App Store).
2. **Sur le PC** : ouvrir un terminal, faire `cd mobile` puis `npm start`.
3. **Sur le téléphone** : être sur le **même Wi‑Fi** que le PC, ouvrir Expo Go (ou la caméra sur iPhone), **scanner le QR code** affiché dans le terminal.
4. L’app « mobile » s’ouvre dans Expo Go ; tu peux modifier `mobile/App.tsx` et sauvegarder pour voir le résultat (rechargement automatique si Fast Refresh est activé).

Tu n’as pas besoin de configurer Android Studio ni Xcode pour cette utilisation avec Expo Go. C’est fait pour que tu puisses tout de suite voir ton projet sur ton téléphone.
