<h1 align="center">DiabetCare</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Rails-8.1-CC0000?style=for-the-badge&logo=rubyonrails&logoColor=white" alt="Rails 8.1" />
  <img src="https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite 3" />
  <img src="https://img.shields.io/badge/Hotwire-Turbo%20%2B%20Stimulus-111111?style=for-the-badge" alt="Hotwire" />
  <img src="https://img.shields.io/badge/Minitest-Tested-1f6f43?style=for-the-badge" alt="Minitest" />
</p>

Application de suivi diabetique maintenant centree sur Ruby on Rails.

La version fonctionnelle de l'application vit dans `../DiabetCare/`. Le dossier `doc/` sert a documenter l'etat produit, la reference visuelle et les points d'entree utiles pour comprendre l'application telle qu'elle fonctionne aujourd'hui.

## Vue d'ensemble

DiabetCare est une application Rails de suivi diabetique avec deux espaces :

- un espace `patient` pour le suivi quotidien
- un espace `clinician` pour le suivi soignant

L'application fournit aujourd'hui :

- l'authentification avec roles `patient` et `clinician` (voir section **Parcours d'authentification** ci-dessous)
- un dashboard patient et un dashboard soignant rendus depuis Rails
- la gestion des glycemies, repas, journal et rappels medicamenteux
- un domaine soignant persistant pour les rendez-vous, conversations, messages et notes
- l'integration Dexcom OAuth avec import de mesures CGM

## Fonctionnalites actives

### Cote patient

- inscription et connexion (ecran d'accueil `/` avec choix du profil, puis `/connexion` ; apres login : `/dashboard?phone=1` par defaut)
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

## Parcours d'authentification

- **`/`** : selection **patient** ou **soignant** (POST `choisir-profil`), lien **Accès administration**, presentation produit sur `/home`.
- **`/connexion`** : formulaire selon le role choisi ; le lien **Changer d'espace** reinitialise le role (`GET /profil/retour`).
- **Redirection post-login** : patient → **`/dashboard?phone=1`** (maquette en mode smartphone par defaut) ; clinicien → **`/dashboard?view=soignant`** ; admin → **`/admin/dashboard`**.
- **UI Rails** : les ecrans accueil + connexion utilisent un **cadre ~390px** centre (`auth-page--phone`, `application.css`), coherent visuellement avec le `main.page` de la maquette.

## Maquette HTML (`index.html`)

- Fichier de reference : `index.html` dans ce dossier ; injection des donnees Rails via `DiabetCare/app/services/dashboard/mockup_renderer.rb`.
- **Fond** : variable **`--app-canvas-bg`** (meme reference que l'espace soignant dans la feuille de style de la maquette).
- **Patient** : mode telephone active par defaut dans le script ; **`?desktop=1`** pour la vue patient « bureau ». **Soignant** : **`?view=soignant`** (pas de mode telephone sur ce flux).
- Pas de bouton de bascule telephone / bureau : reglage via **URL** uniquement.

## API et routes actives

L'application expose des routes HTML et des endpoints JSON internes.

### Routes principales

- `GET /` (choix du profil), `GET /connexion`, `POST /choisir-profil`
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

- `../DiabetCare/docs/dexcom_integration.md`

## Comptes de demo

Les seeds actuelles creent :

- `demo@diabetcare.local` / `password123`
- `other@diabetcare.local` / `password123`
- `clinician@diabetcare.local` / `password123`

## Lancer l'application

```bash
cd ../DiabetCare
bundle install
npm install
ruby bin/rails db:prepare
ruby bin/rails db:seed
bin/dev
```

Puis ouvrir `http://127.0.0.1:5000`.

## Arborescence utile

```text
diabet-care-project/
├── DiabetCare/                 # application Rails active
│   ├── app/                    # controllers, models, services, views
│   ├── config/                 # routing, environnements, puma, queue
│   ├── db/                     # migrations, schema, seeds
│   ├── docs/                   # documentation technique, dont Dexcom
│   └── test/                   # tests modeles, integration, services, systeme
└── doc/                        # documentation produit + reference visuelle
```

## Source de verite technique

Pour comprendre l'etat reel de l'application, les points d'entree utiles sont :

- `../DiabetCare/README.md`
- `../DiabetCare/config/routes.rb`
- `../DiabetCare/app/controllers/`
- `../DiabetCare/app/services/dashboard/mockup_renderer.rb`
- `../DiabetCare/app/services/dexcom/`
- `../DiabetCare/db/seeds.rb`
- `../DiabetCare/test/`

## Position du dossier `doc/`

Le dossier `doc/` n'est plus la description d'un prototype a venir.

Il sert maintenant surtout a :

- conserver la reference visuelle `index.html`
- exposer une vue lisible de l'etat fonctionnel du projet
- documenter l'etat reel du produit
- pointer vers les zones du code Rails qui portent les parcours reels

## Maintenance documentaire

Si l'application evolue, ce document doit rester coherent avec :

1. `../DiabetCare/README.md`
2. `../DiabetCare/config/routes.rb`
3. `../DiabetCare/db/seeds.rb`
4. `../DiabetCare/docs/dexcom_integration.md`
