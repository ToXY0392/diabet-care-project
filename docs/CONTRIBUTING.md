# Guide de Contribution

Pour maintenir la qualité et la cohérence du prototype DiabetCare, merci de suivre ces directives.

## Workflow
1.  **Éviter les changements globaux** : Préférez modifier les composants atomiques plutôt que de dupliquer des styles.
2.  **Tailwind CSS** : Utilisez les classes utilitaires existantes. Évitez d'ajouter de nouvelles classes personnalisées dans `styles.css` sauf nécessité absolue.
3.  **TypeScript** : Assurez-vous que tous les nouveaux types sont définis dans `src/features/diabetcare/types/index.ts`.

## Conventions de Nommage
- **Composants** : PascalCase (ex: `PatientDashboard.tsx`).
- **Hooks** : camelCase avec préfixe `use` (ex: `useMeasureChart.ts`).
- **Variables & Types** : camelCase pour les variables, PascalCase pour les interfaces/types.

## Langue
- **Interface** : Uniquement en **Français**.
- **Code/Commentaires** : Mélange d'anglais (technique) et de français (métier).
