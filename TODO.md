# TODO Migration Ruby on Rails

## Objectif

Faire évoluer le prototype front `DiabetCare` vers une application web structurée autour d'un backend Ruby on Rails, tout en conservant :
- la séparation métier déjà initiée dans `src/features/diabetcare`
- l'architecture UI en Atomic Design
- les flux `patient` et `soignant`
- l'identité visuelle définie dans `CHARTE_GRAPHIQUE.md`

## Etat actuel

- [x] Prototype source conservé dans `diabetcare_clinical_mockup.jsx`
- [x] Migration front initiale vers `src/`
- [x] Lancement local via `npm run dev`
- [x] Règles Cursor orientées migration future Rails
- [ ] Contrats API réels
- [ ] Backend Rails
- [ ] Base de données
- [ ] Authentification
- [ ] Persistance métier

## 1. Cadrage produit et technique

- [ ] Valider le périmètre MVP Rails
- [ ] Définir les rôles applicatifs exacts : `patient`, `clinician`, `admin`
- [ ] Définir les flux critiques à livrer en premier
- [ ] Lister les écrans du front qui doivent devenir de vraies pages métier
- [ ] Identifier ce qui reste mocké aujourd'hui et devra être remplacé par des données API

## 2. Inventaire des entités métier

- [ ] Formaliser les entités principales
- [ ] Définir les attributs obligatoires de chaque entité
- [ ] Normaliser les statuts et enums métier
- [ ] Définir les relations entre entités

### Entités à prévoir

- [ ] `Patient`
- [ ] `Clinician`
- [ ] `Sensor`
- [ ] `GlucoseReading`
- [ ] `MealEntry`
- [ ] `InsulinEntry`
- [ ] `ConversationThread`
- [ ] `ConversationMessage`
- [ ] `ClinicalDocument`
- [ ] `ClinicalNote`
- [ ] `Alert`
- [ ] `Consent`

## 3. Mapping front actuel vers domaine Rails

- [ ] Mapper `patient` vers `Patient`
- [ ] Mapper `clinicianProfile` vers `Clinician`
- [ ] Mapper `clinicianPatients` vers `Patient` + vues de suivi
- [ ] Mapper `documents` vers `ClinicalDocument`
- [ ] Mapper `patientThreads` et `clinicianThreads` vers `ConversationThread` et `ConversationMessage`
- [ ] Mapper `therapyNotes` vers `ClinicalNote`
- [ ] Mapper `deviceConnections` vers `Sensor`
- [ ] Mapper `historyRows` vers `GlucoseReading`
- [ ] Mapper `glucoseSeriesByPeriod` vers agrégats calculés côté backend

## 4. Conception base de données Rails

- [ ] Créer le schéma relationnel cible
- [ ] Définir les clés étrangères
- [ ] Ajouter les index nécessaires
- [ ] Prévoir les contraintes d'intégrité
- [ ] Prévoir les timestamps standards Rails
- [ ] Prévoir les tables de jointure si nécessaire

### Tables probables

- [ ] `users`
- [ ] `patients`
- [ ] `clinicians`
- [ ] `patient_clinicians`
- [ ] `sensors`
- [ ] `glucose_readings`
- [ ] `meal_entries`
- [ ] `insulin_entries`
- [ ] `conversation_threads`
- [ ] `conversation_messages`
- [ ] `clinical_documents`
- [ ] `clinical_notes`
- [ ] `alerts`
- [ ] `consents`

## 5. Architecture Rails cible

- [ ] Choisir le mode d'intégration front/back
- [ ] Décider entre Rails full stack, Rails API + front séparé, ou Rails + composants progressifs
- [ ] Définir l'organisation `models`, `controllers`, `services`, `policies`, `serializers`
- [ ] Définir une convention de nommage stable entre TypeScript et Rails

### Recommandation de structure backend

- [ ] `app/models`
- [ ] `app/controllers`
- [ ] `app/services`
- [ ] `app/serializers` ou équivalent
- [ ] `app/policies` si Pundit
- [ ] `app/jobs`
- [ ] `app/channels` si temps réel

## 6. Authentification et autorisation

- [ ] Choisir la stratégie d'authentification Rails
- [ ] Définir les permissions par rôle
- [ ] Restreindre l'accès aux patients suivis uniquement
- [ ] Sécuriser documents, notes et messagerie
- [ ] Définir les règles de visibilité des données cliniques

### Cas à couvrir

- [ ] Un patient voit uniquement ses données
- [ ] Un soignant voit uniquement ses patients
- [ ] Les notes internes sont séparées des notes visibles patient
- [ ] Les documents ont un niveau de visibilité explicite

## 7. API et contrats JSON

- [ ] Définir les endpoints REST ou JSON API
- [ ] Définir les payloads d'entrée et de sortie
- [ ] Unifier les formats de dates, ids et statuts
- [ ] Prévoir les réponses paginées pour messages, documents et historiques
- [ ] Prévoir les endpoints d'agrégats pour les courbes

### Endpoints probables

- [ ] `GET /patients`
- [ ] `GET /patients/:id`
- [ ] `GET /patients/:id/glucose_readings`
- [ ] `POST /patients/:id/meal_entries`
- [ ] `POST /patients/:id/insulin_entries`
- [ ] `GET /conversation_threads`
- [ ] `GET /conversation_threads/:id/messages`
- [ ] `POST /conversation_threads/:id/messages`
- [ ] `GET /clinical_documents`
- [ ] `POST /clinical_documents`
- [ ] `GET /clinical_notes`
- [ ] `POST /clinical_notes`

## 8. Logique métier à sortir du front

- [ ] Déplacer les calculs de tendance hors du front
- [ ] Déplacer les stats cliniques calculées côté page vers le backend
- [ ] Déplacer le tri des patients prioritaires côté service Rails
- [ ] Déplacer la logique d'alertes dans le domaine métier
- [ ] Déplacer les filtres de documents et messages côté API ou service

### Calculs à migrer

- [ ] temps dans la cible
- [ ] glycémie moyenne
- [ ] détection hypo et hyper
- [ ] fraîcheur des capteurs
- [ ] priorisation clinique

## 9. Remplacement progressif des mocks

- [ ] Remplacer `mockData.ts` par une couche d'accès API
- [ ] Créer un client HTTP dédié
- [ ] Introduire des adaptateurs de mapping front <-> backend
- [ ] Conserver les types de réponse séparés des types UI
- [ ] Prévoir une stratégie de fallback en développement

## 10. Refonte front pour compatibilité backend

- [ ] Isoler les composants encore trop gros
- [ ] Réduire la taille de `PatientTemplates.tsx`
- [ ] Réduire la taille de `DiabetCareClinicalMockupPage.tsx`
- [ ] Créer un dossier `services` ou `api` côté front
- [ ] Créer des hooks de récupération de données
- [ ] Préparer les états `loading`, `error`, `empty`

## 11. UI/UX avant branchement backend

- [x] Corriger les contrastes de texte identifiés dans le rapport d'audit
- [x] Ajouter des états de focus visibles
- [x] Ajouter les `aria-label` manquants
- [x] Introduire des feedbacks après actions (toasts, breadcrumbs)
- [x] Clarifier les niveaux de navigation imbriqués (breadcrumbs Échanges)

## 12. Messagerie et temps réel

- [ ] Décider si la messagerie doit être temps réel
- [ ] Décider si les alertes patient doivent être push ou polling
- [ ] Evaluer `Action Cable` pour la messagerie et les alertes
- [ ] Définir les événements métier temps réel minimum

## 13. Documents cliniques

- [ ] Définir le stockage des fichiers
- [ ] Gérer l'upload sécurisé
- [ ] Gérer les métadonnées de document
- [ ] Définir les règles de partage patient/soignant
- [ ] Prévoir les aperçus et téléchargements

## 14. Tests à mettre en place

- [ ] Tests modèles Rails
- [ ] Tests services métier
- [ ] Tests contrôleurs ou requêtes API
- [ ] Tests policies/permissions
- [ ] Tests système sur les flux critiques
- [x] Tests front : Vitest (useMeasureChart, page), Playwright E2E (flux patient/clinicien) — voir `docs/QUALITY.md`

## 15. Déploiement et exploitation

- [x] Définir l'environnement cible (front statique : Vercel, Netlify, etc. — voir `docs/DEPLOYMENT.md`)
- [ ] Choisir la base de données Rails
- [ ] Définir la gestion des secrets
- [ ] Prévoir les logs applicatifs
- [x] Prévoir la supervision (CI dans `.github/workflows/ci.yml`, instrumentation perf dans `main.tsx`)
- [ ] Prévoir la stratégie de migration de schéma

## 16. Plan de migration recommandé

- [ ] Phase 1 : stabiliser les types métier et les composants
- [ ] Phase 2 : modéliser le domaine Rails
- [ ] Phase 3 : créer la base Rails et les premiers endpoints
- [ ] Phase 4 : brancher le front sur lecture seule
- [ ] Phase 5 : brancher les écritures critiques
- [ ] Phase 6 : ajouter auth, permissions et temps réel
- [ ] Phase 7 : supprimer progressivement les mocks

## 17. Définition de terminé

- [ ] Le front ne dépend plus de `mockData.ts`
- [ ] Les entités métier sont persistées en base Rails
- [ ] Les flux patient et soignant fonctionnent avec vraies données
- [ ] Les permissions sont testées
- [ ] Les documents sont uploadés et consultables
- [ ] Les notes et messages sont persistés
- [ ] Les indicateurs cliniques proviennent du backend
- [ ] Les écarts critiques du rapport d'audit sont corrigés
