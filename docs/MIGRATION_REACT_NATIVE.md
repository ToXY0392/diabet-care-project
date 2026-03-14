# Migration React (web) vers React Native – DiabetCare Mobile

Ce document décrit la migration de l’application DiabetCare du prototype web (Vite + React) vers une application mobile native (Expo + React Native) dans le dossier `mobile/`.

---

## 1. Contexte

- **App web** (racine du projet) : Vite, React, Tailwind CSS, DOM. Écrans patient : tableau de bord, capteur, mesures, échanges (messages/documents), profil.
- **App mobile** (`mobile/`) : Expo SDK 54, React Native, navigation native. Même parcours patient, implémenté en composants RN (sans WebView).

---

## 2. Structure de `mobile/`

```
mobile/
├── App.tsx                 # Point d’entrée : SafeAreaProvider, NavigationContainer, AppTabs
├── index.ts                # registerRootComponent + import gesture-handler (première ligne)
├── package.json
├── src/
│   ├── theme.ts            # Couleurs, spacing, radius (équivalent design system web)
│   ├── types.ts            # Types partagés (sans ReactNode pour RN)
│   ├── data/
│   │   └── mockData.ts     # Données mock (patient, threads, documents, deviceConnections, etc.)
│   ├── components/
│   │   ├── Card.tsx        # Carte (variants: surface, hero)
│   │   ├── HeaderPill.tsx  # En-tête avec date + initiales
│   │   ├── SectionTitle.tsx
│   │   └── Badge.tsx
│   ├── screens/
│   │   ├── DashboardScreen.tsx   # Accueil (capteur, ajouter repas, messages non lus)
│   │   ├── SensorScreen.tsx     # Capteur + connexions
│   │   ├── MeasuresScreen.tsx    # Suivi (Jour / Tendances / Carnet), TIR, historique
│   │   ├── ExchangesScreen.tsx  # Messages | Documents, liste threads / docs
│   │   ├── ChatScreen.tsx        # Conversation (bulles, composer, safe area)
│   │   └── ProfileScreen.tsx    # Profil | Paramètres
│   └── navigation/
│       └── AppTabs.tsx      # Stack (MainTabs + Chat) + Bottom Tabs (5 onglets)
```

---

## 3. Modifications et choix techniques

### 3.1 Passage de WebView à React Native pur

- **Avant** : Une seule WebView chargeant l’URL de l’app Vite (`EXPO_PUBLIC_WEB_APP_URL` ou IP déduite de Metro). Un seul code (web).
- **Après** : Plus de WebView pour le flux principal. Tous les écrans patient sont réimplémentés en composants React Native (View, Text, ScrollView, FlatList, etc.).

### 3.2 Dépendances ajoutées (Expo + React Navigation)

| Package | Rôle |
|--------|------|
| `@react-navigation/native` | Conteneur de navigation |
| `@react-navigation/bottom-tabs` | Barre d’onglets (Accueil, Capteur, Mesures, Échanges, Profil) |
| `@react-navigation/native-stack` | Stack (tabs + écran Chat) |
| `react-native-screens` | Écrans natifs pour le stack |
| `react-native-safe-area-context` | SafeAreaProvider, useSafeAreaInsets (encoches, barre d’accueil) |
| `react-native-gesture-handler` | Gestes (recommandé par React Navigation), import en première ligne de `index.ts` |

`react-native-webview` et `expo-constants` restent dans le projet mais ne sont plus utilisés par le flux principal.

### 3.3 Données et types

- **Types** : Recopiés/adaptés dans `src/types.ts` (sans `ReactNode` pour les labels de navigation). Types principaux : `PatientProfile`, `ConversationThread`, `ConversationMessage`, `DocumentItem`, `DeviceConnection`, `HistoryRow`, etc.
- **Mock** : `src/data/mockData.ts` contient les mêmes données métier que le web (patient, patientThreads, documents, deviceConnections, historyRows) avec des exports dérivés (ex. `providerDocuments`, `patientDocuments`).

Aucun package partagé entre web et mobile pour l’instant : types et mock sont dupliqués dans `mobile/src/`.

### 3.4 UI et design system

- **Web** : Tailwind + variables CSS (`--color-teal`, `--radius-lg`, etc.), classes utilitaires.
- **Mobile** : `StyleSheet.create()`, tokens dans `src/theme.ts` (couleurs, spacing, radius). Mêmes couleurs (teal, mint, surface, text, etc.) et même logique visuelle (cartes hero teal, boutons mint, badges).

Composants réutilisables : `Card`, `HeaderPill`, `SectionTitle`, `Badge`. Pas de bibliothèque de composants tierce (ex. NativeBase) : tout est custom.

### 3.5 Navigation

- **Stack** : `MainTabs` (écran avec les 5 onglets) + `Chat` (conversation). Paramètre de route : `Chat` reçoit `{ thread: ConversationThread }`.
- **Tabs** : Accueil, Capteur, Mesures, Échanges, Profil. Onglet actif : pastille teal + icône/label.
- **Navigation depuis les écrans** : `navigation.getParent()?.navigate('Chat', { thread })` depuis les onglets pour ouvrir une conversation ; `navigation.navigate('Exchanges')` depuis le tableau de bord pour « Voir tout ».

### 3.6 Écrans et comportements

| Écran | Équivalent web | Particularités RN |
|-------|----------------|-------------------|
| DashboardScreen | PatientDashboardTemplate | ScrollView, boutons « Ouvrir » / « Voir tout » → navigation stack ou tab |
| SensorScreen | PatientSensorTemplate | Liste des connexions (deviceConnections) en cartes |
| MeasuresScreen | PatientMeasuresTemplate | Segmented control (Jour / Tendances / Carnet), stats, TIR, zone courbe placeholder, historique avec clé stable (`key={time-value}`) |
| ExchangesScreen | PatientExchangesTemplate (liste) | Onglets Messages / Documents, FlatList threads, ScrollView + liste documents |
| ChatScreen | Vue thread + MessageComposer | FlatList messages, KeyboardAvoidingView, useSafeAreaInsets pour le composer |
| ProfileScreen | PatientProfileTemplate | Onglets Profil / Paramètres, liste réglages, bouton Déconnexion |

### 3.7 Corrections post-migration (Biome, perf, UX)

- **Imports** : Suppression des `import React` inutiles (JSX transform) ; `Card` utilise `import type { ReactNode }`.
- **Clés de liste** : `MeasuresScreen` – remplacement de `key={i}` par `key={\`${row.time}-${row.value}\`}` (noArrayIndexKey).
- **Safe area** : ChatScreen utilise `useSafeAreaInsets()` pour le `paddingBottom` du bloc de saisie (clavier + barre d’accueil).
- **Gesture handler** : `import 'react-native-gesture-handler'` en première ligne de `index.ts` (recommandation React Navigation).
- **Format / organiseImports** : Application de Biome sur `mobile/` (format + tri des imports).

---

## 4. Différences principales Web vs React Native

| Aspect | Web (Vite + React) | Mobile (Expo + RN) |
|--------|--------------------|--------------------|
| Rendu | DOM (div, span, etc.) | Views natives (View, Text, ScrollView, FlatList) |
| Styles | CSS / Tailwind, classes | StyleSheet, objet de styles |
| Navigation | État local (activeTab, etc.) | React Navigation (stack + tabs) |
| Données | Même logique métier | Même mock, copié dans `mobile/src/data` |
| Clavier | Comportement navigateur | KeyboardAvoidingView + insets |
| Liste longue | map dans le DOM | FlatList (virtualisation) |

---

## 5. Lancer l’app mobile

Plus besoin de lancer l’app web. Dans `mobile/` :

```bash
npm install
npm start
```

Puis ouvrir avec Expo Go (QR code). L’app est autonome (données mock).

---

## 6. Évolutions possibles

- **Partage de code** : Extraire types et mock dans un package ou dossier partagé (`shared/` ou `packages/data`) et les importer depuis le web et `mobile/`.
- **État global** : Si besoin (auth, préférences), ajouter un store (Context, Zustand, etc.) côté mobile.
- **API réelle** : Remplacer les imports depuis `mockData.ts` par des appels API (fetch ou client type React Query) avec la même interface de types.
- **WebView en secours** : Garder une entrée optionnelle (ex. écran « Version web ») qui charge l’URL Vite si besoin (variable d’env déjà documentée dans `.env.example`).

---

*Dernière mise à jour : migration complète WebView → React Native, corrections Biome et safe area.*
