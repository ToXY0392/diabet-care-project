# Application mobile DiabetCare (Expo + React Native)

Application mobile native (React Native) pour le parcours patient : tableau de bord, capteur, mesures, échanges (messages/documents), profil. Construite avec Expo SDK 54 et React Navigation.

## Lancer l’app

1. Installe **Expo Go** sur ton téléphone (Play Store ou App Store).
2. Téléphone et PC sur le **même Wi‑Fi** (pour Expo Go en dev).
3. Dans ce dossier :

```bash
npm install
npm start
```

4. Scanne le **QR code** avec Expo Go (Android) ou l’app Caméra (iPhone).

Aucune autre commande n’est nécessaire (pas d’app web à lancer).

## Commandes

| Commande | Description |
|----------|-------------|
| `npm start` | Démarre Expo et affiche le QR code |
| `npm run web` | Ouvre l’app dans le navigateur (mode web Expo) |
| `npm run android` | Lance sur l’émulateur Android (si configuré) |
| `npm run ios` | Lance sur le simulateur iOS (Mac uniquement) |

## Structure rapide

- `App.tsx` – Point d’entrée (SafeAreaProvider, NavigationContainer, onglets + stack).
- `src/` – Thème, types, données mock, composants, écrans, navigation.
- `src/screens/` – Dashboard, Capteur, Mesures, Échanges, Chat, Profil.
- `src/navigation/AppTabs.tsx` – Bottom tabs (5 onglets) + écran Chat en stack.

## Documentation

- **Migration React → React Native** (modifs, structure, différences web/mobile) : **[../docs/MIGRATION_REACT_NATIVE.md](../docs/MIGRATION_REACT_NATIVE.md)**.
- **Expo (débutant, dépannage)** : **[../docs/EXPO_GUIDE.md](../docs/EXPO_GUIDE.md)**.
