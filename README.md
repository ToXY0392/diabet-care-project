<h1 align="center">DiabetCare</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Rails-8.1-CC0000?style=for-the-badge&logo=rubyonrails&logoColor=white" alt="Rails 8.1" />
  <img src="https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite 3" />
  <img src="https://img.shields.io/badge/Hotwire-Turbo%20%2B%20Stimulus-111111?style=for-the-badge" alt="Hotwire" />
  <img src="https://img.shields.io/badge/Minitest-Tested-1f6f43?style=for-the-badge" alt="Minitest" />
</p>

Application de suivi diabetique maintenant centree sur Ruby on Rails.

La maquette HTML historique sert encore de reference visuelle via `../doc/index.html`, tandis que les donnees patient, soignant et Dexcom sont maintenant alimentees par l'application Rails.

## Stack

- Ruby on Rails 8.1
- SQLite
- Hotwire (`turbo-rails`, `stimulus-rails`)
- Active Storage
- Minitest
- Dexcom OAuth + import CGM

## Lancer le projet

### Prerequis

- Ruby 3.4+
- Bundler
- Node.js / npm

### Mode de travail

Important : l'application Rails vit dans `DiabetCare/`. Si vous lancez Rails depuis le dossier parent `diabet-care-project/`, vous n'etes pas dans le contexte applicatif.

```bash
cd DiabetCare
bundle install
npm install
ruby bin/rails db:prepare
ruby bin/rails db:seed
bin/dev
```

Puis ouvrir `http://127.0.0.1:5000`.

Si `bin/dev` n'est pas utilise, vous pouvez aussi lancer :

```bash
cd DiabetCare
ruby bin/rails server -p 5000
```

## Verification recommandee

```bash
cd DiabetCare
ruby bin/rails test
ruby bin/rails zeitwerk:check
```

## Comptes de demo

- `demo@diabetcare.local` / `password123`
- `other@diabetcare.local` / `password123`
- `clinician@diabetcare.local` / `password123`

## Configuration Dexcom

Le projet supporte un fichier `.env` pour la configuration locale via `dotenv-rails`.

Variables utiles :

- `PORT` : port local de l'application, par defaut `5000`
- `DEXCOM_ENV` : `sandbox` ou `production`
- `DEXCOM_CLIENT_ID` : identifiant OAuth Dexcom
- `DEXCOM_CLIENT_SECRET` : secret OAuth Dexcom
- `DEXCOM_REDIRECT_URI` : URL de callback Dexcom, ex. `http://127.0.0.1:5000/dexcom_connection/callback`

Un fichier `.env.example` est versionne pour servir de modele, et un `.env` local avec placeholders a ete prepare pour le developpement.

Documentation detaillee :

- Integration Dexcom : `docs/dexcom_integration.md`
- Vue fonctionnelle du produit : `doc/README.md`

## Arborescence utile

```text
diabet-care-project/
├── DiabetCare/                 # application Rails active
│   ├── app/                    # controllers, models, services, views
│   ├── config/                 # routing, environnements, queue, puma
│   ├── db/                     # migrations, schema, seeds
│   ├── docs/                   # documentation technique
│   └── test/                   # model, integration, service et system tests
└── doc/                        # maquette HTML source utilisee comme reference
```

## Points d'entree

- `config/routes.rb` : routes HTML, Dexcom et endpoints JSON soignant
- `app/controllers/pages_controller.rb` : entree dashboard et rendu de la maquette dynamique
- `app/controllers/sessions_controller.rb` : authentification
- `app/controllers/dexcom_connections_controller.rb` : OAuth Dexcom, sync et deconnexion
- `app/controllers/clinician/` : endpoints du domaine soignant
- `app/models/user.rb` : roles `patient` / `clinician` et associations principales
- `app/services/dashboard/build_data.rb` : agregats patient pour le dashboard
- `app/services/dashboard/mockup_renderer.rb` : injection des donnees Rails dans la maquette HTML
- `app/services/dexcom/` : configuration, client API et synchronisation CGM
- `db/seeds.rb` : scenario de demo patient + soignant
- `test/integration/dashboard_mockup_rendering_test.rb` : verification du rendu injecte

## Etat actuel

- Rails est l'unique runtime applicatif du projet
- les parcours patient sont disponibles pour le suivi glycemique, les repas, le journal, le profil et les alertes
- l'authentification par mot de passe et les roles `patient` / `clinician` sont en place
- le dashboard visuel s'appuie sur la maquette HTML source tout en affichant des donnees Rails reelles
- le domaine soignant persiste les patients suivis, conversations, messages, rendez-vous, notes cliniques et notes de coordination
- les actions principales de la maquette soignant sont reliees aux endpoints Rails persistants
- les modales patient soignant enregistrent aussi leurs donnees cote Rails
- l'integration Dexcom OAuth est branchee avec import des mesures CGM dans `glucose_readings`
- des tests Minitest couvrent le rendu, le domaine soignant et les services Dexcom

## Prochaine etape recommandee

La base produit est en place. La suite utile est maintenant :

1. renforcer les tests systeme autour des interactions maquette patient et soignant
2. industrialiser la synchronisation Dexcom avec des jobs planifies
3. preparer l'exploitation en environnement distant avec monitoring et gestion des secrets

## Regle de maintenance documentaire

Toute tache terminee dans ce depot doit declencher automatiquement, dans le meme travail :

1. la mise a jour de la documentation concernee dans `README.md` ou `docs/`
2. la mise a jour des exemples de configuration si une variable change
3. la verification que les comptes, commandes ou chemins documentes correspondent bien au depot reel
