# Projet DiabetCare Clinical Mockup

## Aperçu du projet
Ce projet est une maquette interactive (mockup) d'une application de gestion du diabète nommée **DiabetCare**. Elle est conçue pour présenter les fonctionnalités destinées à la fois aux patients et aux cliniciens (médecins). L'application permet de suivre la glycémie, l'alimentation (glucides), les doses d'insuline, et de faciliter les échanges entre patients et soignants.

### Technologies clés
- **Frontend :** React (TypeScript)
- **Outil de build :** Vite
- **Stylisation :** Tailwind CSS (via CDN dans `index.html`)
- **Icônes :** Lucide React
- **Gestion de l'état :** React Hooks (`useState`)

## Architecture et Organisation
Le projet suit une structure modulaire inspirée de l'Atomic Design :
- `src/components/` : Composants réutilisables classés par niveau de complexité (`atoms`, `molecules`, `organisms`, `templates`).
- `src/features/diabetcare/` : Logique spécifique au domaine (données fictives, hooks personnalisés, types).
- `src/pages/` : Page principale assemblant les templates.
- `src/styles.css` : Styles globaux de base.

## Commandes de développement
Les commandes suivantes sont définies dans le fichier `package.json` :

- **Lancer le serveur de développement :**
  ```bash
  npm run dev
  ```
- **Construire le projet pour la production :**
  ```bash
  npm run build
  ```
- **Prévisualiser le build de production :**
  ```bash
  npm run preview
  ```

## Conventions de développement
- **Langue :** L'interface utilisateur et le contenu sont en **français**. Le code (nommage des variables, commentaires) utilise un mélange d'anglais technique et de français métier.
- **Stylisation :** Utilisation intensive des classes utilitaires **Tailwind CSS**. Note : Tailwind est chargé via un script CDN dans `index.html`.
- **Composants :** Les composants fonctionnels React avec TypeScript sont privilégiés.
- **État :** L'état de la maquette est centralisé dans le hook personnalisé `useClinicalMockupState` pour simuler les interactions complexes.
