# Templates Patient

Templates de mise en page pour les vues côté patient (maquette DiabetCare).

## Liste des templates

- **PatientDashboardTemplate** — Tableau de bord (accueil), capteur principal, bouton repas, messages non lus.
- **PatientSensorTemplate** — Connexions (capteur connecté, connexions disponibles) et vue Paramètres du capteur avec bouton Retour.
- **PatientMeasuresTemplate** — Suivi des mesures (glycémies, injections/glucides), périodes et vues Jour / Tendances / Carnet.
- **PatientExchangesTemplate** — Échanges : onglets Messages / Documents, listes et détail ; dépôt de document via modal « Ajouter un fichier ».
- **PatientProfileTemplate** — Compte : onglets Profil (fiche + édition) et Paramètres (liste d’entrées cliquables).
- **PatientNotesTemplate** — Notes du soignant (lecture seule).

---

## Props et comportements principaux

### PatientSensorTemplate
- **initialShowSensorParams** (optionnel) : si `true`, affiche directement la vue « Paramètres du capteur » au montage (ex. navigation depuis Paramètres → « Paramètres du capteur »).
- Carte « Capteur » : ouvre la vue paramètres du capteur ; bouton Retour ramène à la liste des connexions.

### PatientExchangesTemplate
- **Onglet Documents** : bouton « Choisir un fichier » ouvre une modale « Ajouter un fichier » (zone fichier, commentaire optionnel, Annuler / Envoyer). État local : `showAddFileModal`, `addFileComment`, `fileInputRef`.

### PatientProfileTemplate
- **Onglet Paramètres** : chaque entrée est cliquable et reliée à un callback optionnel :
  - **Paramètres du capteur** → `onOpenSensorParams` (ex. aller à l’onglet Capteur et ouvrir les paramètres).
  - **Notifications** → `onOpenNotifications`
  - **Historique de synchronisation** → `onOpenSyncHistory`
  - **Documents partagés** → `onOpenSharedDocuments` (ex. aller à Échanges > Documents).
  - **Sécurité du compte** → `onOpenAccountSecurity`
  - **Déconnexion** → `onLogout` (ex. toast + bascule rôle en mockup)

Les callbacks sont branchés dans la page mockup (`DiabetCareClinicalMockupPage`) pour la navigation, les toasts ou la déconnexion simulée.
