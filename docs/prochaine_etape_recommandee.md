# Prochaine etape recommandee

Ce document developpe la section `Prochaine etape recommandee` du `README.md` principal.

La base produit est en place : les parcours patient et soignant existent, la maquette est branchee sur les donnees Rails, et l'integration Dexcom OAuth importe deja des mesures CGM.

La suite utile se concentre maintenant sur la qualite, l'automatisation et la preparation d'un environnement plus proche de la production.

## Priorite 1 - Renforcer les tests systeme

### Pourquoi

Les parcours principaux sont fonctionnels, mais une partie importante de l'experience repose encore sur :

- le rendu injecte dans la maquette
- des interactions JavaScript cote patient et soignant
- des endpoints JSON relies au dashboard soignant

Ces zones sont sensibles aux regressions visuelles et fonctionnelles.

### Objectif

Securiser les parcours critiques qui combinent :

- rendu HTML Rails
- JavaScript de la maquette
- persistence en base

### Cible de couverture

En priorite :

1. connexion patient et affichage du dashboard
2. creation d'une mesure glycemique et mise a jour des indicateurs
3. ouverture d'une conversation soignant et envoi d'un message
4. sauvegarde d'une note clinique
5. sauvegarde d'une note de coordination
6. mise a jour de la fiche patient soignant
7. affichage de l'etat Dexcom connecte / non connecte

### Pistes d'implementation

- etendre les tests systeme existants dans `test/system/`
- ajouter des assertions sur le HTML final rendu
- couvrir les actions persistantes qui passent par les endpoints `clinician/*`
- separer les scenarios patient et clinician pour garder des tests lisibles

### Definition de termine

- les parcours critiques ci-dessus sont couverts par des tests systeme ou integration
- une regression visible sur la maquette soignant ou patient fait echouer la suite de tests
- les cas Dexcom de base sont verifies a minima cote UI ou integration

## Priorite 2 - Industrialiser la synchronisation Dexcom

### Pourquoi

L'integration Dexcom fonctionne deja, mais elle repose surtout sur :

- une connexion OAuth manuelle
- une synchronisation manuelle declenchee depuis l'application

Pour un usage plus robuste, il faut sortir du modele purement interactif.

### Objectif

Faire evoluer la synchronisation Dexcom vers un flux automatise, observable et relancable.

### Travaux recommandes

1. creer un job dedie de synchronisation Dexcom
2. planifier ce job sur une frequence explicite
3. proteger le job contre les doublons et les erreurs transitoires
4. journaliser les echecs de refresh token et d'import
5. exposer un etat de synchro plus lisible dans l'interface

### Cibles techniques

- job Rails dans `app/jobs/`
- orchestration via `solid_queue`
- eventuelle planification via `config/recurring.yml`
- messages d'erreur plus actionnables dans la couche `Dexcom::SyncReadings`

### Definition de termine

- la synchronisation peut etre declenchee sans action manuelle utilisateur
- les erreurs Dexcom sont tracables
- les imports repetes ne creent pas de doublons
- l'etat de derniere synchronisation est visible clairement

## Priorite 3 - Preparer l'exploitation distante

### Pourquoi

Le produit fonctionne localement, mais une mise a disposition reelle demande plus qu'un simple serveur Rails demarre a la main.

### Objectif

Rendre l'application deployable dans de bonnes conditions de securite et d'exploitation.

### Axes de travail

#### Secrets et configuration

- separer clairement les valeurs locales et distantes
- verifier la gestion des variables `DEXCOM_*`
- documenter les prerequis d'environnement

#### Observabilite

- definir les logs applicatifs utiles
- identifier les erreurs critiques a suivre
- ajouter des points de controle sur les flux Dexcom et les endpoints soignant

#### Robustesse operationnelle

- verifier les migrations et seeds sur un environnement propre
- clarifier la strategie de stockage SQLite si un hebergement distant est vise
- preparer une trajectoire vers une base plus adaptee si necessaire

#### Exploitation

- documenter le lancement applicatif
- documenter les verifications post-deploiement
- preparer un checklist de recette minimale

### Definition de termine

- un environnement distant peut etre configure sans dependre de connaissances implicites
- les secrets ne sont pas stockes en clair dans le depot
- les points de controle applicatifs sont identifies
- l'equipe sait verifier qu'un deploiement est sain

## Ordre recommande

L'ordre recommande reste :

1. tests systeme
2. synchronisation Dexcom automatisee
3. preparation a l'exploitation distante

Cet ordre permet de stabiliser le produit avant d'automatiser, puis d'automatiser avant d'exposer davantage l'application.

## Fichiers a suivre en priorite

- `README.md`
- `docs/dexcom_integration.md`
- `app/services/dashboard/mockup_renderer.rb`
- `app/services/dexcom/sync_readings.rb`
- `app/controllers/clinician/`
- `test/system/`
- `test/integration/`

## Resultat attendu

Si cette feuille de route est suivie, l'application passe d'un produit fonctionnel localement a une base plus solide pour :

- absorber des evolutions UI sans regressions
- synchroniser Dexcom de facon fiable
- preparer une mise en ligne plus sereine
