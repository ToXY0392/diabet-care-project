# Regle de maintenance documentaire

Ce document developpe la section `Regle de maintenance documentaire` du `README.md` principal.

L'objectif est simple : eviter que la documentation diverge de l'etat reel de l'application.

Dans ce projet, chaque tache terminee ne doit pas seulement produire du code fonctionnel. Elle doit aussi laisser une trace documentaire coherent avec :

- les parcours reels
- la structure actuelle du depot
- les commandes de lancement
- les comptes de demo
- les integrations actives, notamment Dexcom

## Regle generale

Toute tache terminee dans ce depot doit declencher automatiquement, dans le meme travail :

1. la mise a jour de la documentation concernee dans `README.md` ou `docs/`
2. la mise a jour des exemples de configuration si une variable change
3. la verification que les comptes, commandes ou chemins documentes correspondent bien au depot reel

Autrement dit : une tache n'est pas completement terminee tant que sa documentation n'est pas alignee.

## Quand mettre a jour la documentation

Une mise a jour documentaire est attendue des qu'un changement touche au moins un des points suivants :

- une fonctionnalite visible par l'utilisateur
- une route Rails
- un endpoint JSON
- un workflow patient ou soignant
- une variable d'environnement
- un compte ou un scenario de demo
- une commande de lancement ou de test
- une integration externe comme Dexcom
- l'organisation des fichiers ou des repertoires

## Quels fichiers mettre a jour

### `README.md`

A mettre a jour quand un changement impacte :

- la vision d'ensemble du projet
- la stack
- la maniere de lancer l'application
- les comptes de demo
- les points d'entree techniques
- l'etat actuel du produit
- les prochaines priorites

### `docs/`

A mettre a jour quand un changement concerne une zone specialisee, par exemple :

- `docs/dexcom_integration.md` pour Dexcom
- `docs/prochaine_etape_recommandee.md` pour la feuille de route court terme
- toute nouvelle documentation thematique liee a un domaine fonctionnel ou technique

## Reflexe attendu a la fin d'une tache

Avant de considerer une tache comme terminee, il faut verifier :

1. est-ce que le comportement de l'application a change ?
2. est-ce qu'un utilisateur ou un developpeur lira encore une information desormais fausse ?
3. est-ce qu'une commande documentee n'est plus correcte ?
4. est-ce qu'un compte de demo, une route ou un chemin a change ?
5. est-ce qu'une doc specialisee doit etre ajoutee plutot qu'une simple ligne dans le `README` ?

Si la reponse est oui a au moins une de ces questions, la documentation doit etre mise a jour dans le meme travail.

## Niveau de detail attendu

La documentation doit etre :

- exacte
- courte quand un resume suffit
- detaillee quand un workflow technique l'exige
- ancree dans le code reel du depot

Elle ne doit pas :

- decrire un etat futur comme s'il etait deja livre
- conserver des commandes obsoletes
- mentionner des chemins qui n'existent plus
- annoncer une integration absente ou partielle comme si elle etait complete

## Cas concrets

### Exemple 1 - Nouvelle route soignant

Si un nouvel endpoint est ajoute dans `app/controllers/clinician/` :

- mettre a jour `README.md` si cela change la vue d'ensemble des endpoints actifs
- ajouter ou mettre a jour une doc dans `docs/` si le flux merite une explication dediee

### Exemple 2 - Changement Dexcom

Si le flux Dexcom change :

- mettre a jour `docs/dexcom_integration.md`
- verifier les variables `DEXCOM_*` documentees
- mettre a jour `README.md` si l'etat global de l'integration evolue

### Exemple 3 - Changement des seeds

Si les comptes ou scenarios de demo changent :

- mettre a jour `README.md`
- verifier toute doc qui cite ces comptes

### Exemple 4 - Nouvelle doc de cadrage

Si une section du `README.md` devient trop dense :

- extraire le detail dans un fichier sous `docs/`
- laisser un resume dans le `README.md`
- ajouter un lien clair vers la doc detaillee

## Definition de termine

Une tache peut etre consideree comme completement terminee seulement si :

- le code est a jour
- les tests utiles ont ete executes ou explicitement signales
- la documentation impactee a ete mise a jour
- les chemins, comptes, commandes et variables documentes ont ete verifies

## Checklist rapide

Avant de finir une tache, verifier au minimum :

- `README.md` est-il encore juste ?
- faut-il mettre a jour un fichier dans `docs/` ?
- les commandes documentees marchent-elles encore ?
- les comptes de demo sont-ils toujours corrects ?
- les variables d'environnement documentees sont-elles toujours valides ?
- les liens entre docs principales et docs detaillees sont-ils presents ?

## Resultat attendu

Si cette regle est appliquee de facon systematique :

- le depot reste lisible
- la doc GitHub reste fiable
- les nouveaux contributeurs se trompent moins
- les regressions documentaires diminuent
- les integrations comme Dexcom restent comprises sans relecture complete du code
