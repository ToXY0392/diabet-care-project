# Integration Dexcom

Cette documentation explique comment brancher Dexcom dans `DiabetCare`, depuis la configuration OAuth jusqu'a l'import des mesures CGM dans l'application Rails.

## Vue d'ensemble

L'integration repose sur 4 briques principales :

- `Dexcom::Config` lit les variables d'environnement et construit les URLs Dexcom.
- `Dexcom::Client` appelle les endpoints OAuth et EGV.
- `Dexcom::SyncReadings` importe les mesures dans `glucose_readings`.
- `DexcomConnectionsController` orchestre connexion, callback, synchronisation et suppression.

## Configuration

Les variables suivantes doivent etre definies dans `.env` :

```dotenv
PORT=5000
DEXCOM_ENV=sandbox
DEXCOM_CLIENT_ID=replace_with_your_dexcom_client_id
DEXCOM_CLIENT_SECRET=replace_with_your_dexcom_client_secret
DEXCOM_REDIRECT_URI=http://127.0.0.1:5000/dexcom_connection/callback
```

Variables utiles :

- `DEXCOM_ENV` : `sandbox` ou `production`
- `DEXCOM_CLIENT_ID` : identifiant OAuth Dexcom
- `DEXCOM_CLIENT_SECRET` : secret OAuth Dexcom
- `DEXCOM_REDIRECT_URI` : URL de callback declaree chez Dexcom

Le domaine Dexcom est choisi automatiquement :

- `sandbox` -> `https://sandbox-api.dexcom.com`
- `production` -> `https://api.dexcom.com`

## Configuration cote Dexcom

Dans le portail Dexcom Developer :

1. creer une application OAuth
2. declarer l'URL `DEXCOM_REDIRECT_URI` comme callback
3. recuperer `client_id` et `client_secret`
4. choisir le bon environnement

Point critique : l'URL de redirection configuree chez Dexcom doit correspondre exactement a celle de l'application Rails.

## Routes et endpoints

Routes Rails exposees :

- `GET /dexcom_connection/connect`
- `GET /dexcom_connection/callback`
- `POST /dexcom_connection/sync`
- `DELETE /dexcom_connection`

Endpoints Dexcom utilises :

- `POST /v3/oauth2/token` pour l'echange de code et le refresh token
- `GET /v3/users/self/egvs` pour recuperer les mesures glycemiques

## Flux de connexion

### 1. Demarrage OAuth

Quand l'utilisateur clique sur `Connecter Dexcom`, la route `GET /dexcom_connection/connect` :

- verifie que la configuration est complete
- genere un `state` OAuth
- stocke ce `state` en session
- redirige vers la page Dexcom

### 2. Retour sur le callback

La route `GET /dexcom_connection/callback` :

- verifie qu'aucune erreur OAuth n'a ete renvoyee
- compare le `state` recu avec celui stocke en session
- echange le `code` contre un `access_token` et un `refresh_token`
- cree ou met a jour `DexcomConnection`
- lance une premiere synchronisation

### 3. Import des mesures

`Dexcom::SyncReadings.call(user: current_user)` :

- rafraichit le token si necessaire
- appelle `GET /v3/users/self/egvs`
- importe les `records`
- met a jour `last_synced_at`
- enregistre `external_user_id` si Dexcom le renvoie

## Stockage en base

### Table `dexcom_connections`

Une connexion par utilisateur, avec notamment :

- `user_id`
- `access_token`
- `refresh_token`
- `expires_at`
- `environment`
- `external_user_id`
- `last_synced_at`
- `revoked_at`

### Table `glucose_readings`

Les mesures Dexcom sont stockees avec les lectures manuelles, mais avec des attributs specifiques :

- `source: "dexcom"`
- `context: "cgm"`
- `external_id` pour dedoublonner les imports
- `trend` si Dexcom renvoie une tendance

L'import evite les doublons via la combinaison `source + external_id`.

## Regles de synchronisation

Fenetre par defaut :

- premiere synchronisation : 24 dernieres heures
- synchronisation suivante : depuis `last_synced_at - 15 minutes`
- limite basse : 30 jours en arriere maximum

Gestion des tokens :

- si le token expire dans moins de 5 minutes, il est rafraichi
- si le refresh echoue, la connexion est marquee comme revoquee
- l'utilisateur doit alors reconnecter Dexcom

## Procedure locale

### 1. Renseigner `.env`

```dotenv
DEXCOM_ENV=sandbox
DEXCOM_CLIENT_ID=your_real_client_id
DEXCOM_CLIENT_SECRET=your_real_client_secret
DEXCOM_REDIRECT_URI=http://127.0.0.1:5000/dexcom_connection/callback
```

### 2. Demarrer l'application

```bash
cd DiabetCare
bin/dev
```

Ou, en mode simple :

```bash
cd DiabetCare
ruby bin/rails server -p 5000
```

### 3. Lancer le parcours

- ouvrir `http://127.0.0.1:5000`
- se connecter avec un compte patient
- cliquer sur `Connecter Dexcom`

### 4. Verifier l'import initial

Au retour sur le dashboard :

- verifier qu'une connexion Dexcom est active
- verifier la date de derniere synchronisation
- verifier l'apparition de lectures `source: "dexcom"`

## Synchronisation manuelle

Le bouton `Synchroniser Dexcom` appelle :

```text
POST /dexcom_connection/sync
```

Ce endpoint relance `Dexcom::SyncReadings` pour l'utilisateur courant.

## Deconnexion

Le bouton `Deconnecter Dexcom` appelle :

```text
DELETE /dexcom_connection
```

Cela supprime l'enregistrement `dexcom_connections` de l'utilisateur courant.

Les `glucose_readings` deja importees restent en base.

## Points de vigilance

- garder `DEXCOM_REDIRECT_URI` strictement identique entre Dexcom et `.env`
- utiliser `sandbox` pour les essais locaux
- ne jamais versionner un `.env` avec de vrais secrets
- verifier que l'application tourne sur le port reference par `DEXCOM_REDIRECT_URI`
- chaque connexion Dexcom est rattachee au `current_user`

## Depannage rapide

### "Configuration Dexcom manquante"

Verifier :

- `DEXCOM_CLIENT_ID`
- `DEXCOM_CLIENT_SECRET`
- `DEXCOM_REDIRECT_URI`

### "La verification Dexcom a echoue"

Verifier :

- la presence du `state` OAuth
- la persistance de la session entre `connect` et `callback`

### "Dexcom: ..."

Verifier :

- la validite du code OAuth
- la validite des tokens
- la coherence de la configuration
- l'accessibilite de l'API Dexcom

### Aucune glycemie importee

Verifier :

- que le compte Dexcom contient bien des donnees EGV
- que l'environnement choisi est le bon
- que `last_synced_at` n'est pas deja trop recent

## Fichiers a connaitre

- `app/controllers/dexcom_connections_controller.rb`
- `app/models/dexcom_connection.rb`
- `app/services/dexcom/config.rb`
- `app/services/dexcom/client.rb`
- `app/services/dexcom/sync_readings.rb`
- `.env.example`

## Evolutions utiles

- ajouter une synchronisation planifiee en job
- enrichir la journalisation des erreurs Dexcom
- mieux exposer dans l'UI l'etat d'une connexion revoquee
- ajouter un outillage de diagnostic OAuth
