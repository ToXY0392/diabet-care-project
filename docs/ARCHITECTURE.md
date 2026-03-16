# Architecture Technique

L'application DiabetCare est construite comme un prototype interactif robuste utilisant React et TypeScript.

## Démarrage rapide du projet

- **Application web (racine du dépôt)**  
  - Installer les dépendances si nécessaire : `npm install`  
  - Lancer le serveur de développement : `npm run dev`  
  - Ouvrir l’URL affichée par Vite dans le navigateur (par défaut `http://localhost:5173`).

- **Application mobile Expo (`mobile/`)**  
  - Se placer dans le dossier : `cd mobile`  
  - Lancer Expo : `npm start`  
  - Scanner le QR code avec l’app **Expo Go** (voir `EXPO_GUIDE.md` pour le détail).

Ces deux applications partagent la même vision produit DiabetCare : la version web sert de prototype riche et la version mobile de base pour une future app native connectée à un backend Rails.

## Structure des Dossiers
- `src/components/` : Suit les principes de l'Atomic Design.
    - `atoms/` : Éléments de base (Badge, icônes simples).
    - `molecules/` : Combinaisons d'atomes (Cartes, sélecteurs).
    - `organisms/` : Sections complexes (App Shell, Dashboard widgets).
    - `templates/` : Mise en page complète des pages (Patient et Clinicien).
- `src/features/diabetcare/` : Logique métier.
    - `hooks/` : Hooks personnalisés pour l'état de l'application.
    - `data/` : Données fictives pour le prototype.
    - `types/` : Définitions TypeScript globales.
- `src/pages/` : Point d'entrée des routes (ici une page unique multi-rôles).

## Gestion de l'État
L'état de la maquette est centralisé dans le hook `useClinicalMockupState`. Il gère :
- Le rôle actif (Patient ou Clinicien).
- L'onglet de navigation actif (accueil, capteur, mesures, échanges, profil pour le patient).
- Les sous-onglets (Échanges : messages / documents ; Profil : profil / paramètres).
- L’ouverture des paramètres du capteur depuis l’onglet Paramètres (`openSensorParamsOnCapteurTab`), réinitialisée à la sortie de l’onglet Capteur.
- Les données des modales (saisie de repas, glycémie, ajout de fichier dans Échanges).
- La sélection des patients cliniques, threads, documents et notes.

Les templates patient exposent des callbacks pour les actions (ex. `onOpenSensorParams`, `onOpenNotifications`, `onLogout`), branchés en page pour la navigation ou des toasts en mockup.

## Visualisation (SVG)
Les graphiques de glycémie et de tendances sont générés dynamiquement en SVG à l'aide de hooks de calcul (`useMeasureChart`) pour simuler des courbes réelles à partir de données statiques.
