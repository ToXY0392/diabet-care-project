# Architecture Technique

L'application DiabetCare est construite comme un prototype interactif robuste utilisant React et TypeScript.

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
- L'onglet de navigation actif.
- Les données des modales (saisie de repas, glycémie).
- La sélection des patients cliniques.

## Visualisation (SVG)
Les graphiques de glycémie et de tendances sont générés dynamiquement en SVG à l'aide de hooks de calcul (`useMeasureChart`) pour simuler des courbes réelles à partir de données statiques.
