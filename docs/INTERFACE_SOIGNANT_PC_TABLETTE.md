# Interface soignant : cible PC / tablettes

La **partie soignant** de l’application doit être pensée pour une **interface PC et tablettes** (grand écran), et non pour le même cadre téléphone que la partie patient.

---

## 1. Contexte actuel

- Toute l’app est rendue dans un **PhoneFrame** fixe (390×844 px) centré sur la page.
- Patient et soignant partagent ce cadre : même largeur, même barre de navigation en bas, même header type « pill ».
- La maquette est donc **mobile-first** pour les deux rôles.

---

## 2. Objectif

- **Patient** : conserver une expérience **mobile / téléphone** (cadre téléphone ou mise en page type app mobile sur petit écran).
- **Soignant** : proposer une expérience **bureau / tablette** :
  - Utilisation sur ordinateur (consultation, suivi de plusieurs patients, tableaux de bord).
  - Utilisation sur tablette en cabinet ou à l’hôpital.
  - Pas de contrainte de largeur 390 px ; utilisation de la largeur disponible (layout fluide, colonnes, sidebar).

---

## 3. Principes pour l’interface soignant PC/tablette

### 3.1 Layout

- **Pas de PhoneFrame** pour le rôle soignant : la vue soignant occupe la fenêtre (ou une zone dédiée) sans cadre téléphone.
- **Structure type « app bureau »** :
  - **Header** horizontal : logo/titre, recherche éventuelle, compte soignant (menu ou lien), déconnexion.
  - **Navigation principale** : barre latérale (sidebar) ou barre d’onglets en haut, avec les entrées Cockpit, Patients, Échanges, Courbes, Notes, Compte.
  - **Zone de contenu** : zone centrale qui affiche le template actif (liste patients, fiche patient, courbes, messages, etc.), avec possibilité de **colonnes** (ex. liste patients à gauche, détail à droite).
- **Breakpoints** : définir au moins un seuil (ex. 768 px ou 1024 px) au-delà duquel le layout soignant bascule en « desktop » ; en dessous, on peut garder un layout plus compact (tablette portrait) ou réutiliser une variante « étroite » du même layout.

### 3.2 Contenu et densité

- **Cockpit** : cartes indicateurs (alertes, patients, TIR) en grille plus large ; liste « Priorité clinique » pouvant afficher plus d’éléments ou un tableau.
- **Liste patients** : tableau ou grille (colonnes : nom, ID, capteur, dernière lecture, TIR, alerte) avec tri/filtre, au lieu d’une seule colonne de cartes.
- **Fiche patient** : blocs Identité, Diabétologie, Traitement, etc. en **colonnes** (2 ou 3) sur grand écran, ou accordéons.
- **Échanges (messages / documents)** : liste des conversations ou documents à gauche, détail à droite (layout « master-detail »).
- **Courbes** : graphiques plus larges, éventuellement plusieurs périodes ou patients côte à côte.

### 3.3 Navigation

- Sidebar fixe ou repliable avec les entrées : Cockpit, Patients, Échanges, Courbes, Notes, Compte.
- Le **patient sélectionné** (contexte) peut être affiché en permanence dans le header ou une barre secondaire (breadcrumb « Patients > Léa Bernard ») pour garder le contexte sur toutes les vues (Fiche, Courbes, Échanges).

### 3.4 Cohérence avec l’existant

- **Même design system** : couleurs (teal, mint), typo, composants (Card, Badge, boutons) réutilisables ; seuls le layout et l’agencement changent.
- **Mêmes données et flux** : les templates soignant (Cockpit, Patients, Fiche, Notes, etc.) et la logique (state, sélection patient) restent utilisables ; on change le **conteneur** (plus de PhoneFrame) et l’**agencement** (sidebar + zone centrale, colonnes).
- **Détection de rôle + viewport** : au chargement ou au switch de rôle, si `role === "clinician"` et largeur ≥ breakpoint, afficher le layout PC/tablette au lieu du PhoneFrame.

---

## 4. Points à trancher plus tard (sans coder pour l’instant)

- **Breakpoint exact** : 768 px, 1024 px ou autre pour basculer en « desktop soignant ».
- **Sidebar** : toujours visible ou repliable (icône hamburger) sur tablette.
- **Route / URL** : une URL dédiée pour la vue soignant (ex. `/clinician` ou `?role=clinician`) pour permettre l’accès direct et le partage de lien.
- **Responsive soignant** : en dessous du breakpoint, garder un layout « tablette » (une colonne, sidebar en drawer) ou réutiliser temporairement le cadre téléphone pour la démo.

---

## 5. Résumé

| Aspect | Patient | Soignant (cible) |
|--------|---------|-------------------|
| **Device cible** | Mobile / téléphone | PC / tablette |
| **Conteneur** | PhoneFrame 390×844 | Pleine largeur (layout fluide) |
| **Navigation** | Barre en bas (onglets) | Sidebar ou onglets en haut |
| **Contenu** | Une colonne, cartes empilées | Colonnes, tableaux, master-detail |
| **Même design system** | Oui | Oui |

Cette note sert de référence pour les évolutions à venir ; aucune modification de code n’est demandée pour l’instant.
