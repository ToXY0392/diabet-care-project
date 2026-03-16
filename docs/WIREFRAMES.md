# Wireframes - DiabetCare

Ce document présente la structure schématique des écrans principaux de l'application DiabetCare pour les deux rôles utilisateurs.

---

## 1. Vues Patient (mode "téléphone")

### A. Tableau de Bord (Accueil)
Focus : état immédiat du capteur + accès rapide aux échanges.

```text
+---------------------------------------+
| [Pill header : Initiales patient]     |
+---------------------------------------+
|  Tableau de bord                      |
|                                       |
|          [ Cercle glycémie ]          |
|          118 mg/dL                    |
|          Stable · sync 2m             |
|                                       |
|       [ BOUTON : AJOUTER REPAS ]      |
|                                       |
|  [Card dégradé : Messages non lus]    |
|   - Titre : "Messages non lus"        |
|   - Badge : "2 non lus"               |
|   - Ligne : "Dr Martin" + extrait     |
|   - Boutons : [Ouvrir] [Voir tout]    |
|                                       |
+---------------------------------------+
| [Home] [Capteur] [Courbes] [Échanges] |
|                   [Profil] (icônes)   |
+---------------------------------------+
```

### B. Suivi (Mesures - Vue Jour)
Focus : Visualisation clinique journalière.

```text
+---------------------------------------+
| [Header Pill]                         |
+---------------------------------------+
| [ Jour ] [ Tendances ] [ Carnet ]     |
+---------------------------------------+
|  +-------+ +-------+ +-------+ +----+ |
|  | 118   | | 0     | | 6.5   | | 0  | |
|  | mg/dL | | u     | | u     | | g  | |
|  +-------+ +-------+ +-------+ +----+ |
|                                       |
|  +--- TEMPS DANS LA CIBLE ---------+  |
|  | [===BARRE_COULEUR_TIR_81%=====] |  |
|  |  0%  0%  81%  19%  0%           |  |
|  +---------------------------------+  |
|                                       |
|  +--- GRAPHIQUE GLYCÉMIE ----------+  |
|  | Points : ○ cible □ hypo △ hyper |  |
|  |          ~~~~/\~~~~             |  |
|  |  [+]    /      \                |  |
|  +---------------------------------+  |
|                                       |
|  +--- INJECTIONS & GLUCIDES -------+  |
|  |      | | |                      |  |
|  |  [+] | | |  _________           |  |
|  +---------------------------------+  |
+---------------------------------------+
```

### C. Échanges (Messages / Documents)
Focus : Communication sécurisée. Fil d'Ariane (breadcrumbs) : Échanges › Messages ou Échanges › Documents ; en thread/détail : dernier segment = conversation ou titre document. États vides : "Aucune conversation" / "Aucun document reçu". Toasts de confirmation après enregistrement (repas, glycémie).

```text
+---------------------------------------+
| [Header Pill]                         |
+---------------------------------------+
|  Échanges  ›  Messages                |
|  +---------------------------------+  |
|  | [ Messages ]     [ Documents ]  |  |
|  +---------------------------------+  |
|  [ BOUTON: NOUVEAU MESSAGE ]          |
|  +--- LISTE CONVERSATIONS ---------+  |
|  | (DM) Dr. Martin             10:30 |  |
|  | (SC) Secrétariat           Hier |  |
|  +---------------------------------+  |
+---------------------------------------+
```

---

## 2. Vues Clinicien

### A. Cockpit Clinique (Populationnel)
Focus : Triage et alertes.

```text
+---------------------------------------+
| [Date]                     (Initials) |
+---------------------------------------+
|  Cockpit clinique                     |
|                                       |
|  +------------+    +---------------+  |
|  | Alertes: 12|    | Risque : 5    |  |
|  +------------+    +---------------+  |
|  | Patients:48|    | TIR Médian:72%|  |
|  +------------+    +---------------+  |
|                                       |
|  PRIORITÉ CLINIQUE        [Voir tout] |
|  +---------------------------------+  |
|  | Jean Dupont                     |  |
|  | [Alerte Hypo]   24 mg/dL        |  |
|  +---------------------------------+  |
|  | Alice Durand                    |  |
|  | [Manque Données]  -- mg/dL      |  |
|  +---------------------------------+  |
+---------------------------------------+
```

### B. Fiche Patient (Individuel)
Focus : Prise de décision rapide.

```text
+---------------------------------------+
| [ < Patients ]             (Initials) |
+---------------------------------------+
|  Jean Dupont      [Badge: Alerte]     |
|  PAT-001                              |
|                                       |
|  +---------------------------------+  |
|  | [24 mg/dL]    [Sync 5m]         |  |
|  | [Dexcom G6]   [2 alertes]       |  |
|  +---------------------------------+  |
|                                       |
|  ACTIONS SOIGNANT                     |
|  +---------------------------------+  |
|  | [ Voir Courbe ]  [ Messages ]    |  |
|  | [ Documents ]    [ Note Clin. ]  |  |
|  +---------------------------------+  |
+---------------------------------------+
```

---

## Comportements implémentés (maquette)

- **Compte > Paramètres** : liste d’entrées cliquables (Paramètres du capteur → onglet Capteur + vue paramètres ; Notifications, Historique, Sécurité → toasts « Bientôt disponible » ; Documents partagés → onglet Échanges > Documents ; Déconnexion → bascule soignant + Cockpit).
- **Échanges > Documents** : « Choisir un fichier » ouvre une modale Ajouter un fichier (parcourir/glisser, commentaire optionnel, Annuler / Envoyer).

---
*Note: Ces wireframes représentent la hiérarchie visuelle implémentée dans les fichiers templates.tsx.*

---

## 3. Vue responsive type "trois colonnes"

Référence inspirée du modèle "Default / Browser – Tablet Portrait – Smartphone" de wireframes classiques, déclinée pour l’app DiabetCare.

### 3.1 Desktop / Browser (Cockpit clinicien)

```text
+------------------------------------------------------------------+
| [Top bar]                                                        |
|  DiabetCare | Cockpit | Patients | Courbes | Notes | Documents   |
|                                   (Profil soignant)              |
+------------------------------------------------------------------+
| [KPI row]                                                        |
|  [ Alertes ]  [ Patients ]  [ TIR médian ]  [ Capteurs ]         |
+------------------------------------------------------------------+
| [Colonne gauche]        | [Colonne centre]     | [Colonne droite]|
|  Liste patients         |  Graphiques TIR      |  Messages        |
|  (triable)              |  Courbes glycémie    |  (threads)       |
|                         |  Injections/glucides |  + détails doc   |
|                         |                      |                  |
+------------------------------------------------------------------+
| [Footer léger / mentions si besoin]                              |
+------------------------------------------------------------------+
```

### 3.2 Tablette portrait (Fiche + courbes)

```text
+--------------------------------------------------+
| [Barre haute compacte]                           |
|  ← Patients      Jean Dupont (initiales)   Profil|
+--------------------------------------------------+
| [Bloc 1 : Fiche synthèse]                        |
|  - Identité (nom, âge, type diabète)            |
|  - Capteur / alertes                            |
|  - Dernière HbA1c                               |
+--------------------------------------------------+
| [Bloc 2 : Courbes & TIR]                         |
|  - Onglets : Jour | Tendances | Carnet          |
|  - Courbe glycémie + légende                    |
|  - Carte "Temps dans la cible"                  |
+--------------------------------------------------+
| [Bloc 3 : Actions]                               |
|  - Boutons : Voir messages / Documents / Notes  |
+--------------------------------------------------+
```

### 3.3 Smartphone (Vue patient actuelle)

```text
+---------------------------------------+
| [Pill header : patient]  (switch rôle)|
+---------------------------------------+
| [Écran principal selon onglet]        |
|  - Accueil : cercle glycémie, repas   |
|  - Capteur : connexions + paramètres  |
|  - Courbes : TIR + graphique + carnet|
|  - Échanges : messages / documents    |
|  - Profil : fiche patient + réglages  |
+---------------------------------------+
| [Bottom nav]                          |
|  Home | Capteur | Courbes | Échanges  |
|                      Profil (icône)   |
+---------------------------------------+
```

Ces trois vues reprennent le même contenu fonctionnel adapté à chaque support : **cockpit multi-colonnes** sur desktop, **pile de blocs lisibles** sur tablette, **flux unique + bottom nav** sur smartphone.
