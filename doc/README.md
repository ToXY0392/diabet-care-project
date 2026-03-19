<h1 align="center">DiabetCare</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Rails-8.1-CC0000?style=for-the-badge&logo=rubyonrails&logoColor=white" alt="Rails 8.1" />
  <img src="https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite 3" />
  <img src="https://img.shields.io/badge/Hotwire-Turbo%20%2B%20Stimulus-111111?style=for-the-badge" alt="Hotwire" />
  <img src="https://img.shields.io/badge/Minitest-Tested-1f6f43?style=for-the-badge" alt="Minitest" />
</p>

Application de suivi diabetique maintenant centree sur Ruby on Rails.

La version fonctionnelle de l'application vit dans `../`. Le dossier `doc/` du depot Git sert a documenter l'etat produit, la reference visuelle et les points d'entree utiles pour comprendre l'application telle qu'elle fonctionne aujourd'hui.

## Vue d'ensemble

DiabetCare est une application Rails de suivi diabetique avec deux espaces :

- un espace `patient` pour le suivi quotidien
- un espace `clinician` pour le suivi soignant

L'application fournit aujourd'hui :

- l'authentification avec roles `patient` et `clinician`
- un dashboard patient et un dashboard soignant rendus depuis Rails
- la gestion des glycemies, repas, journal et rappels medicamenteux
- un domaine soignant persistant pour les rendez-vous, conversations, messages et notes
- l'integration Dexcom OAuth avec import de mesures CGM

## Fonctionnalites actives

### Cote patient

- inscription et connexion
- dashboard personnalise
- saisie et consultation des `glucose_readings`
- suivi des repas via `meals`
- journal personnel via `journal_entries`
- rappels et plannings medicamenteux
- consultation et mise a jour du `patient_profile`
- affichage des alertes de sante

### Cote soignant

- acces reserve au role `clinician`
- visualisation des patients suivis
- consultation et creation de conversations
- envoi de messages persistants
- gestion des rendez-vous
- notes cliniques par patient
- note de coordination globale
- persistance des modales de fiche patient

## API et routes actives

L'application expose des routes HTML et des endpoints JSON internes.

### Routes principales

- `GET /dashboard`
- `resource /session`
- `resource /patient_profile`
- `resources /glucose_readings`
- `resources /meals`
- `resources /journal_entries`
- `resources /medication_schedules`
- `resources /medication_reminders`
- `resources /health_alerts`

### Endpoints soignant

Sous `namespace :clinician` :

- `appointments`
- `clinical_notes`
- `patient_records`
- `coordination_note`
- `conversations`
- `conversations/:id/messages`
- `conversations/:id/mark_read`

Ces endpoints sont relies a la vue soignant rendue par Rails et ne servent plus seulement a alimenter une demonstration statique.

## Dexcom

L'integration Dexcom est fonctionnelle.

Elle couvre :

- la connexion OAuth
- l'echange de code contre tokens
- le stockage de `DexcomConnection`
- le refresh des tokens
- l'import des mesures EGV dans `glucose_readings`
- la synchronisation manuelle

Documentation technique :

- `../docs/dexcom_integration.md`

## Comptes de demo

Les seeds actuelles creent :

- `demo@diabetcare.local` / `password123`
- `other@diabetcare.local` / `password123`
- `clinician@diabetcare.local` / `password123`

## Lancer l'application

```bash
bundle install
npm install
ruby bin/rails db:prepare
ruby bin/rails db:seed
bin/dev
```

Puis ouvrir `http://127.0.0.1:5000`.

## Arborescence utile

```text
DiabetCare/
├── app/                        # controllers, models, services, views
├── config/                     # routing, environnements, puma, queue
├── db/                         # migrations, schema, seeds
├── doc/                        # documentation fonctionnelle suivie par Git
├── docs/                       # documentation technique, dont Dexcom
└── test/                       # tests modeles, integration, services, systeme
```

## Source de verite technique

Pour comprendre l'etat reel de l'application, les points d'entree utiles sont :

- `README.md`
- `config/routes.rb`
- `app/controllers/`
- `app/services/dashboard/mockup_renderer.rb`
- `app/services/dexcom/`
- `db/seeds.rb`
- `test/`

## Position du dossier `doc/`

Le dossier `doc/` du depot Git n'est plus la description d'un prototype a venir.

Il sert maintenant surtout a :

- conserver une documentation fonctionnelle lisible
- documenter l'etat reel du produit
- pointer vers les zones du code Rails qui portent les parcours reels

## Maintenance documentaire

Si l'application evolue, ce document doit rester coherent avec :

1. `README.md`
2. `config/routes.rb`
3. `db/seeds.rb`
4. `docs/dexcom_integration.md`
