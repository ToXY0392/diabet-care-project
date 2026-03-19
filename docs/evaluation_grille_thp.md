# Evaluation de l'application selon la grille THP

Source du bareme :

- [Grille projets finaux - Version mouss'](https://docs.google.com/document/d/1FCpDrL4c8lpUlRpDRycF2tE8JoSqzdAD8k7iH2jCRLE/edit?tab=t.0)

## Methode de lecture

Cette evaluation est basee sur :

- le code actuellement present dans le depot
- les routes, models, services, tests et documentation de l'application
- l'etat visible des parcours patient, soignant et Dexcom

Quand un critere depend d'une verification visuelle, d'un deploiement distant ou d'un process d'equipe hors code, il est note `A verifier manuellement`.

## Legende

- `Respecte`
- `Partiellement respecte`
- `Non respecte`
- `A verifier manuellement`

## Synthese rapide

### Jury Produit

- globalement `plutot recevable`
- plusieurs points paraissent `respectes` d'apres le code et les parcours existants
- les points UX/UI les plus fins restent a confirmer en navigation et revue visuelle reelle

### Jury Technique

- `partiellement respecte`
- beaucoup de fondamentaux Rails sont bons : associations, validations, seeds, services, Hotwire, tests, CI
- il reste toutefois des points de vigilance stricts pour la grille :
  - inscription demandant `name` en plus de l'email et du mot de passe
  - endpoints hardcodes dans le bridge soignant
  - architecture pas totalement REST pure avec des actions custom comme `sync`, `mark_read`, `mark_taken`
  - presence de quelques noms de variables en francais dans le JavaScript injecte de la maquette

### Jury Cursus

- `partiellement respecte` a `non respecte` selon la severite du jury
- points forts : API externe Dexcom, plusieurs models relies, front present, Hotwire/Stimulus, branches Git, CI
- points faibles probables :
  - pas de flux `mot de passe oublie / reinitialisation`
  - pas de mailer fonctionnel visible en production
  - pas de dashboard admin dedie evident
  - mise en production non demontree dans le code local

## Jury Produit

### Points eliminatoires

#### 1. La page d'accueil explique clairement l'application

- Statut : `Partiellement respecte`
- Observation : la page publique d'entree est la page de connexion, qui explique quand meme assez clairement la promesse du produit avec un titre, une accroche et des fonctionnalites patient.
- Risque : il ne s'agit pas d'une landing page produit classique avec slogan, proposition de valeur et demonstration complete.

#### 2. La fonctionnalite principale est utilisable

- Statut : `Respecte`
- Observation : les parcours principaux existent vraiment : mesures glycemiques, repas, journal, rappels, alertes, espace soignant, Dexcom.

#### 3. La navigation sur le site est compliquee

- Statut : `Plutot respecte`
- Observation : la navigation connectee est explicite dans le layout principal avec des liens directs vers dashboard, mesures, repas, traitements, journal, alertes et profil.
- Verification utile : faire un test utilisateur rapide en navigation reelle.

#### 4. Le signup demande autre chose qu'email et mot de passe

- Statut : `Point de vigilance fort`
- Observation : l'inscription demande aussi `name`.
- Commentaire : la grille indique que c'est acceptable seulement avec justification. Ce point devra etre assume devant jury, ou simplifie si vous voulez reduire le risque.

### UX

#### Intelligibilite

- Statut : `Partiellement respecte`
- L'application montre clairement un usage patient des l'ecran de connexion.
- Les espaces patient et soignant existent bien.
- Une landing page publique plus demonstrative renforcerait nettement ce point.

#### Utilisabilite

- Statut : `Plutot respecte`
- Les parcours CRUD sont presents.
- Les endpoints soignant sont relies a la maquette et persistants.
- Les liens principaux semblent avoir une vraie utilite.
- La fluidite exacte du parcours reste a valider manuellement dans le navigateur.

### UI

#### Lisibilite

- Statut : `A verifier manuellement`
- Le code CSS montre une vraie structure, des tailles hierarchisees et seulement deux familles de polices.
- Il faut quand meme verifier les ecrans reels pour conclure sur la lisibilite.

#### Couleurs

- Statut : `A verifier manuellement`
- La feuille de style montre une palette limitee et coherente.
- Le contraste parait pense, mais cela reste un critere visuel a valider sur le rendu reel.

#### Organisation

- Statut : `Partiellement respecte`
- La navbar est coherente et stable une fois connecte.
- L'app est plutot aeree dans son CSS.
- Le branding existe avec `DiabetCare` et une interface soignee.
- La page d'accueil publique ne suit pas parfaitement le schema "logo + slogan + proposition de valeur juste en dessous" de la grille.

#### Photos / videos

- Statut : `Non applicable ou a verifier`
- Le projet ne semble pas reposer sur des medias lourds.
- Ce point n'apparait pas comme un risque majeur.

### Besoin

- Statut : `Respecte`
- Le projet repond clairement a un probleme de suivi diabetique patient / soignant.
- La reponse est partielle mais reelle et coherent avec le besoin.

### Proposition de valeur

- Statut : `Partiellement respecte`
- La proposition est globalement compréhensible : centraliser le suivi diabetique, les alertes et le lien avec le soignant.
- Elle gagnerait a etre affichee de maniere plus frontale sur une page d'accueil publique dediee.

## Jury Technique

### Points eliminatoires

#### 1. Melanges de langages inappropries

- Statut : `Respecte`
- Observation : pas de HTML dans les controllers, pas de conflit Git visible dans le code.

#### 2. Plusieurs models sans relations entre eux

- Statut : `Respecte`
- Observation : les models principaux sont relies entre eux par associations explicites.

#### 3. Architecture pas RESTway

- Statut : `Partiellement respecte`
- Observation : la base est majoritairement REST, mais il existe des actions custom :
  - `POST /dexcom_connection/sync`
  - `PATCH /health_alerts/:id/mark_read`
  - `PATCH /medication_reminders/:id/mark_taken`
  - `PATCH /clinician/conversations/:id/mark_read`
- Commentaire : d'un point de vue Rails pratique, c'est acceptable. D'un point de vue grille THP stricte, cela peut etre challenge.

#### 4. Clefs d'API en clair dans le code

- Statut : `Respecte`
- Observation : Dexcom passe par des variables d'environnement `DEXCOM_*` et `.env` est ignore.

#### 5. Noms de classes, models et variables en francais

- Statut : `Partiellement respecte`
- Observation : les classes et models sont en anglais, ce qui est bien.
- Point de vigilance : il existe des noms de variables locales en francais dans le JavaScript injecte de la maquette, par exemple `prenom` et `nom`.

#### 6. Liens hardcodes au lieu des helpers

- Statut : `Partiellement respecte`
- Observation : la plupart des vues Rails utilisent bien les helpers.
- Point de vigilance : `Dashboard::MockupRenderer` contient des chemins JSON hardcodes comme `"/clinician/conversations"` pour le bridge de la maquette.

### Backend

#### Fat Model Skinny Controllers

- Statut : `Plutot respecte`
- Les controllers sont globalement legers.
- La logique est surtout dans les models et services.

#### Utilisation de services

- Statut : `Respecte`
- Services presents pour dashboard, Dexcom, alertes et synchronisation des traitements.

#### Business logic et noms de tables

- Statut : `Respecte`
- Les noms de models et tables sont orientes produit : `GlucoseReading`, `MedicationReminder`, `ClinicalNote`, `ClinicianConversation`, etc.

#### Presence d'un mailer

- Statut : `Respecte techniquement`
- `ApplicationMailer` existe dans `app/mailers/`.
- Limite : il n'y a pas de mailer metier reel utilise par l'application.

#### Routes propres et nested resources

- Statut : `Partiellement respecte`
- La structure est globalement claire.
- Les nested resources sont utilisees pour les messages de conversation.
- Il reste des actions custom non REST strictes.

#### Validations dans les models

- Statut : `Respecte`
- De nombreuses validations sont presentes sur les models principaux.

#### APIs enveloppees dans des services

- Statut : `Respecte`
- L'API Dexcom est bien encapsulee dans `Dexcom::Client` et `Dexcom::SyncReadings`.

### Base de donnee

- Types d'attributs adaptes : `Plutot respecte`
- Migrations propres et repliquables : `Respecte`
- Seeds presentes : `Respecte`
- Relations N-N en `has_many :through` : `Respecte`

### Frontend

#### Responsive

- Statut : `Plutot respecte`
- Le CSS contient plusieurs media queries et une vraie adaptation de layout.
- A confirmer visuellement sur mobile et desktop.

#### DRY / partials

- Statut : `Partiellement respecte`
- Les vues Rails sont raisonnablement structurees, mais l'app n'est pas particulierement basee sur des partials reutilisables.

#### Composants

- Statut : `Partiellement respecte`
- Hotwire est present, mais il n'y a pas de vraie couche de composants type ViewComponent.

#### Framework CSS

- Statut : `Non respecte` si le jury attend explicitement un framework
- Observation : le projet utilise une feuille CSS custom, pas Bootstrap/Tailwind.

#### Helpers Rails

- Statut : `Plutot respecte`
- `link_to`, `button_to` et autres helpers sont utilises dans les vues.
- Exception notable : les URLs du bridge soignant dans `MockupRenderer`.

#### Assets presents en production

- Statut : `A verifier manuellement`
- La structure assets est en place.
- Il faut verifier sur un build/release reel qu'aucun asset ne manque.

#### Utilisation de Hotwire

- Statut : `Respecte`
- `turbo-rails` et `stimulus-rails` sont installes et utilises.

#### Code bien range dans les assets

- Statut : `Respecte`
- Le CSS principal est centralise dans `app/assets/stylesheets/application.css`.

## Jury Cursus

### Backend - points eliminatoires

#### 1. Pas d'application fonctionnelle en production

- Statut : `A verifier manuellement`
- Le code, la CI et la structure de deploiement existent, mais cela ne prouve pas a lui seul un environnement de production fonctionnel.

#### 2. Pas de systeme d'authentification branche avec les 5 vues

- Statut : `Non respecte`
- Il existe inscription et connexion, mais pas de flux mot de passe oublie / reinitialisation visibles.

#### 3. Pas de mailer fonctionnel en production

- Statut : `Non respecte a ce stade`
- Un `ApplicationMailer` existe, mais aucun mailer metier fonctionnel n'est branche.

#### 4. Pas d'API externe

- Statut : `Respecte`
- Dexcom remplit ce critere.

#### 5. Au moins deux models relies

- Statut : `Respecte`

#### 6. Pas de front orienté composants

- Statut : `Partiellement respecte`
- Il y a bien un front, mais pas une architecture composants forte au sens strict de certains jurys.

#### 7. Les 5 vues de devises n'ont pas de CSS

- Statut : `Non applicable ou non pertinent`
- Ce critere semble issu d'un cas pedagogique standard et ne mappe pas directement sur cette application.

#### 8. Le front est irrecevable

- Statut : `Plutot respecte`
- Rien dans le code n'indique un front irrecevable.
- A valider visuellement devant jury.

#### 9. Le site est illisible

- Statut : `Plutot respecte`
- La structure CSS et les ecrans existants laissent penser le contraire.

### Concepts clefs

#### Dashboard admin

- Statut : `Non respecte`
- Aucun namespace ou dashboard `admin` dedie n'apparait.

#### Hotwire et Stimulus

- Statut : `Respecte`

### Travail en equipe - points eliminatoires

Ces points ne sont pas pleinement auditables depuis le code seul.

- personnes ayant code ou non : `A verifier manuellement`
- Trello / Asana / Atlassian : `A verifier manuellement`
- code heberge sur GitHub/GitLab : `Respecte`
- branches Git/GitHub utilisees : `Respecte`

### Bonnes pratiques

- code commente : `Respecte`
- code correctement indente : `Respecte`
- pas de commit sur master : `Plutot respecte`, mais a verifier sur l'historique complet de l'equipe
- commits frequents : `A verifier manuellement`
- messages de commit explicites : `Respecte`
- messages de commit en anglais : `Partiellement respecte`
- pipeline de production / CI : `Respecte` pour la CI
- branche par fonctionnalite : `Plutot respecte`

### Travail en equipe

- concepts d'agilite : `A verifier manuellement`
- stand-up quotidiens : `A verifier manuellement`
- repartition equitable du travail : `A verifier manuellement`

## Liste des points a corriger en priorite si l'objectif est de maximiser la grille

1. Ajouter un vrai flux `mot de passe oublie / reinitialisation`
2. Brancher un mailer metier reel et demonstrable
3. Ajouter ou justifier clairement un dashboard admin
4. Supprimer ou justifier le champ `name` au signup
5. Remplacer les chemins hardcodes du bridge soignant par des helpers ou une generation centralisee
6. Revoir les actions custom les plus sensibles si le jury applique une lecture REST tres stricte
7. Uniformiser tous les noms de variables techniques en anglais si vous voulez etre sereins sur ce point de grille
8. Verifier en demo reelle la proposition de valeur et la page d'accueil publique

## Verdict global

### Si le jury est pragmatique

- application `plutot solide`
- bonne base technique
- produit credible
- plusieurs points cursus encore incomplets

### Si le jury applique la grille de facon tres stricte

Le projet risque surtout d'etre fragilise par :

- le signup avec `name`
- l'authentification incomplete
- l'absence de mailer metier fonctionnel
- l'absence de dashboard admin
- les chemins hardcodes et les actions custom hors REST strict
