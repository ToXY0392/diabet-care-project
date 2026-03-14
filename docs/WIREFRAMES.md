# Wireframes - DiabetCare

Ce document présente la structure schématique des écrans principaux de l'application DiabetCare pour les deux rôles utilisateurs.

---

## 1. Vues Patient

### A. Tableau de Bord (Accueil)
Focus : État immédiat et actions prioritaires.

```text
+---------------------------------------+
| [ Date: Mercredi 11 ]        (Initials|
+---------------------------------------+
|  Tableau de bord                      |
|  Vue complète du suivi...             |
|                                       |
|  +---------------------------------+  |
|  | CAPTEUR PRINCIPAL               |  |
|  | Dexcom G6                       |  |
|  |                                 |  |
|  |     118 mg/dL                   |  |
|  |     Stable · sync 2m            |  |
|  +---------------------------------+  |
|                                       |
|        [ BOUTON: AJOUTER REPAS ]      |
|                                       |
|  +---------------------------------+  |
|  | NON LU            [Badge: 2]    |  |
|  | +-----------------------------+ |  |
|  | | Dr. Martin                  | |  |
|  | | "Pensez à votre..."   10:30 | |  |
|  | +-----------------------------+ |  |
|  | [ Ouvrir ]       [ Voir tout ]  |  |
|  +---------------------------------+  |
|                                       |
+---------------------------------------+
| [Home]  [Stats]  [Msg]  [Note] [User] |
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
*Note: Ces wireframes représentent la hiérarchie visuelle implémentée dans les fichiers templates.tsx.*
