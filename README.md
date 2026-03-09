# Application de Suivi du Diabète

## 1. Présentation

La gestion du diabète nécessite un suivi quotidien, une communication claire avec les professionnels de santé et une centralisation fiable des informations médicales. Aujourd’hui, ces données sont souvent dispersées entre carnets papier, applications non connectées ou dossiers médicaux fragmentés, ce qui complique le suivi des patients et la coordination des soins.

Cette application web responsive, développée avec **Ruby on Rails**, vise à **centraliser et sécuriser les données médicales des patients diabétiques**.

Elle permet aux patients de :
- enregistrer leur glycémie,
- suivre leurs traitements,
- ajouter des observations ou symptômes.

Les professionnels de santé peuvent quant à eux **consulter ces données en temps réel**, facilitant ainsi le suivi médical.

L’application est conçue pour être :

- simple d’utilisation  
- sécurisée  
- conforme au **RGPD**  

La première version est destinée au **territoire français**.

---

# 2. Parcours utilisateur

Un patient crée un **compte sécurisé** sur la plateforme et renseigne ses informations de base.

Une fois connecté, il accède à son **tableau de bord**, où il peut :

- enregistrer ses glycémies quotidiennes  
- renseigner ses injections d’insuline  
- suivre ses traitements  
- ajouter des observations ou symptômes  

Toutes ces données sont **stockées et consultables dans un historique**, affiché sous forme de **tableaux et graphiques**, permettant au patient de suivre l’évolution de sa santé.

Les **professionnels de santé** (médecins ou infirmiers) disposent d’un accès dédié leur permettant de :

- consulter les données de leurs patients en temps réel
- accéder à un **tableau de bord professionnel**
- communiquer via une **messagerie sécurisée**
- organiser des consultations grâce à un **calendrier intégré**

En cas de besoin, un **module d’urgence** permet d’accéder rapidement aux informations médicales essentielles et aux contacts d’urgence.

---

# 3. Conception technique

L’application est développée sous forme d’une **application web responsive** avec **Ruby on Rails**, accessible depuis :

- ordinateur
- tablette
- smartphone

via un navigateur web.

---

## 3.1 Base de données

La base de données doit permettre de gérer plusieurs types d’utilisateurs avec des rôles différents.

### Table `users`

- email
- mot de passe sécurisé
- rôle (patient, médecin, infirmier, administrateur)

### Table `patient_profiles`

- informations médicales de base
- contacts d’urgence

### Table `glycemia_records`

- valeur de glycémie
- date / heure
- patient associé

### Table `treatments`

- type de traitement
- dosage
- fréquence

### Table `prescriptions`

- prescriptions médicales
- médecin associé
- historique des modifications

### Table `appointments`

- date
- patient
- professionnel de santé
- statut

### Table `messages`

- expéditeur
- destinataire
- contenu
- date

Les **données médicales sensibles doivent être chiffrées** afin de garantir la confidentialité.

---

## 3.2 Frontend

Le frontend doit être **responsive** afin de fonctionner correctement sur :

- mobile
- tablette
- ordinateur

Les principaux composants comprennent :

- page d’inscription / connexion
- tableau de bord patient
- tableau de bord professionnel de santé
- formulaire de saisie des glycémies
- gestion des traitements
- messagerie sécurisée
- calendrier de rendez-vous
- visualisation graphique des données

Du **JavaScript** sera utilisé pour :

- les graphiques de suivi de glycémie
- le calendrier interactif
- certaines interactions dynamiques (mise à jour du dashboard, messagerie)

---

## 3.3 Backend

Le backend est développé avec **Ruby on Rails**.

Il gère :

- l’authentification sécurisée des utilisateurs
- la gestion des rôles et permissions
- le chiffrement des données médicales
- la gestion des rendez-vous
- l’envoi de rappels automatiques (traitements ou rendez-vous)
- la messagerie sécurisée entre patients et professionnels de santé

Des **API internes** permettent de connecter les différentes fonctionnalités de l’application :

- gestion des données médicales
- messagerie
- calendrier

---

## 3.4 Besoins techniques

### Compétences actuelles

- développement web avec Ruby on Rails  
- conception d’applications web  
- gestion de bases de données  
- structuration de projets applicatifs  

### Compétences à compléter

- développement frontend (UI / UX et composants dynamiques)
- sécurité et gestion de données sensibles
- implémentation de graphiques et visualisations
- optimisation de l’expérience utilisateur
- tests et validation de l’application

---

# 4. Version minimale fonctionnelle (MVP)

Le **MVP** doit permettre de livrer une première version simple mais fonctionnelle de l’application.

Fonctionnalités minimales :

- inscription et connexion des utilisateurs
- gestion des rôles (patient / professionnel de santé)
- saisie des glycémies par les patients
- affichage de l’historique des mesures
- accès des médecins aux données des patients
- interface simple de tableau de bord

Cette première version permettra déjà :

- aux patients d’enregistrer leurs données
- aux médecins de les consulter

Les fonctionnalités avancées (messagerie, rappels automatiques, graphiques avancés, calendrier complet) pourront être ajoutées par la suite.

---

# 5. Version présentée au jury

Lors de la deuxième semaine, plusieurs fonctionnalités pourront être ajoutées afin d’améliorer l’expérience utilisateur :

- graphiques de suivi glycémique
- messagerie sécurisée patient / médecin
- calendrier interactif de rendez-vous
- rappels automatiques de traitement
- tableau de bord professionnel amélioré
- interface utilisateur plus avancée
- amélioration de la sécurité et du chiffrement des données

L’objectif est de proposer une **application plus complète, fluide et agréable à utiliser**, tout en conservant une base technique solide.

---

# 6. Intégration Dexcom

> ⚠️ **Note : l'intégration Dexcom ne fonctionne pas encore actuellement.**

## Configuration

Pour connecter **Dexcom G7** :

1. Créer une application sur  
   https://developer.dexcom.com/

2. Configurer la **Redirect URI** :
  http://localhost:3000/dexcom/callback/

3. Définir les variables d’environnement :
  DEXCOM_CLIENT_ID=your_client_id
  DEXCOM_CLIENT_SECRET=your_client_secret
  DEXCOM_SANDBOX=true

Ou ajouter les informations dans `config/credentials.yml.enc` :
  dexcom:
  client_id: "xxx"
  client_secret: "xxx"

## 7. Fonctionnalités

- Authentification : inscription et connexion
- Glycémies : saisie manuelle + import Dexcom
- Repas : glucides (g) et bolus d’insuline (U) par repas
- Objectifs : plage cible personnalisée (70–180 mg/dL par défaut)
- Rapports : courbe glycémique et temps dans la cible

## 8. Conformité RGPD

- export des données utilisateur
- suppression du compte
- politique de confidentialité