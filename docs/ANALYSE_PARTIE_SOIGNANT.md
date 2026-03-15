# Analyse partie soignant – Cohérence avec la partie patient

Document d’analyse de la vue **soignant (clinician)** et des écarts à résorber pour la rendre cohérente avec la partie **patient**. Aucune modification de code dans ce document.

---

## 1. Vue d’ensemble des deux rôles

| Aspect | Patient | Soignant |
|--------|---------|----------|
| **Onglets principaux** | Accueil, Capteur, Mesures, Échanges, Profil (5) | Cockpit, Patients, Fiche, Courbes, Messages, Docs, Notes (7) |
| **Entrée « profil »** | Clic sur pill → Compte (Profil + Paramètres) | Clic sur pill → Liste des patients |
| **Données centrées sur** | Soi (1 patient) | Population + patient sélectionné |
| **Templates dédiés** | 6 (Dashboard, Sensor, Measures, Exchanges, Profile, Notes) | 4 (Cockpit, Patients, PatientView, Notes) |
| **Templates réutilisés** | — | Mesures, Messages, Docs = templates *patient* avec `role=clinician` et `selectedClinicalPatient` |

---

## 2. Points déjà alignés

- **Design system** : mêmes composants (Card, Badge, SectionTitle, HeaderPill), mêmes variables CSS (teal, mint).
- **Fiche patient (soignant)** : même structure de données que la fiche côté patient (DiabeticPatientFiche) : Identité, Diabétologie, Traitement, Capteur, Médecin & urgence, Allergies/comorbidités, Notes cliniques.
- **Actions depuis la fiche** : Voir courbe → Mesures, Ouvrir messages → Messages, etc. Navigation claire.
- **Mesures (Courbes)** : le template patient affiche déjà « Suivi · [Nom du patient] » quand `role === "clinician"`. Contexte patient visible.
- **Notes** : asymétrie assumée – le soignant rédige (ClinicianNotesTemplate), le patient consulte en lecture seule (PatientNotesTemplate).

---

## 3. Incohérences et pistes de cohérence

### 3.1 Compte / Paramètres soignant

- **Patient** : onglet Profil avec sous-onglets Profil (fiche) et Paramètres (liste : Paramètres du capteur, Notifications, Documents partagés, Sécurité, Déconnexion). Le pill du header ouvre ce Compte.
- **Soignant** : pas d’équivalent. Le pill ouvre la liste des patients. Aucun accès à « Mon compte soignant », Paramètres (notifications, sécurité) ni Déconnexion dédiée (la déconnexion actuelle passe par Paramètres patient puis bascule de rôle).

**Piste** : Introduire un « Compte soignant » (onglet ou écran accessible depuis le pill ou un menu) avec au minimum : Paramètres (notifications, sécurité), Déconnexion. Optionnel : profil soignant (nom, initiales). Aligner le comportement du pill : patient → Compte patient, soignant → Compte soignant (ou menu Compte / Liste patients).

---

### 3.2 Navigation : 7 onglets vs 5, et regroupement Échanges

- **Patient** : un onglet « Échanges » contenant Messages | Documents (sous-onglets).
- **Soignant** : deux onglets séparés « Messages » et « Docs » en barre principale.

Résultat : la barre soignant est plus chargée et le regroupement « tout ce qui est échange avec le patient » n’est pas explicite.

**Piste** : Regrouper Messages et Docs en un seul onglet « Échanges » pour le soignant, avec sous-onglets Messages | Documents, comme côté patient. Réduire à 6 onglets : Cockpit, Patients, Fiche, Échanges, Courbes, Notes (et éventuellement Compte si ajouté). Adapter la state (activeTab) et la barre de navigation en conséquence.

---

### 3.3 Contexte patient dans Messages / Documents soignant

- **Mesures** : le titre « Suivi · [Nom patient] » donne le contexte.
- **Messages / Docs** : le template réutilisé affiche le titre « Échanges » et le sous-titre « Messagerie et documents partagés avec le soignant », rédigé pour le patient. Aucun nom du patient sélectionné dans le header.

Risque : le soignant ne voit pas clairement pour quel patient s’affichent les conversations/documents (surtout si les données deviennent filtrées par patient).

**Piste** : Quand `role === "clinician"` dans PatientExchangesTemplate, adapter titre/sous-titre (ex. « Messages · [Nom patient] » / « Documents · [Nom patient] ») et, si besoin, afficher un fil d’Ariane ou un bandeau « Patient : [Nom] ». Filtrer threads et documents par `selectedClinicalPatient.id` dans les données (côté mock puis API).

---

### 3.4 Boutons « Nouveau message » / « Ajouter soignant » en vue soignant

- En vue **Messages** soignant, on réutilise le même template avec les boutons « Nouveau message » et « Ajouter soignant », pensés pour le patient (créer une conversation avec un soignant, ou ajouter un soignant à sa liste).
- Pour le soignant, le sens n’est pas le même : il est déjà « le soignant » ; les actions pertinentes seraient plutôt « Nouveau message (au patient) » ou « Démarrer une conversation », et pas « Ajouter soignant ».

**Piste** : Adapter les libellés et visibilité des boutons selon `role` : en `clinician`, afficher par exemple un seul bouton « Envoyer un message » (ou « Nouveau message » au patient) et masquer « Ajouter soignant ». Optionnel : réutiliser la même modale de composition en changeant le contexte (destinataire = patient sélectionné).

---

### 3.5 Bloc « Dépôt document » en vue Documents soignant

- Côté patient : « DÉPOSER UN DOCUMENT », « Envoyer un document au soignant », boutons Choisir un fichier / Prendre une photo.
- En vue **Docs** soignant, le même bloc s’affiche alors que le soignant envoie des documents *au* patient, pas « au soignant ».

**Piste** : En `role === "clinician"`, adapter le libellé (ex. « Envoyer un document au patient ») et, si besoin, le titre de section (« DÉPOSER UN DOCUMENT POUR LE PATIENT »). Garder la même modale d’ajout de fichier, avec destinataire = patient sélectionné côté logique métier.

---

### 3.6 Retour explicite depuis la Fiche patient (soignant)

- Wireframes : « [ < Patients ] » sur la fiche patient.
- Aujourd’hui : le pill (initiales) est branché sur « Liste des patients ». Pas de bouton « Retour » ou « ← Patients » explicite.

**Piste** : Ajouter un bouton « ← Patients » (ou « Retour ») en en-tête de ClinicianPatientViewTemplate, comme sur les vues patient (ex. Paramètres capteur). Garder le pill pour « Compte soignant » si un tel espace est ajouté.

---

### 3.7 Style des boutons d’action (primaire)

- **Patient** : boutons principaux en dégradé teal (radiant green) : `from-[var(--color-teal-deep)] to-[var(--color-teal-end)]`, texte blanc.
- **Soignant** : Cockpit et Fiche utilisent notamment `bg-[var(--color-teal)]` ou Card `variant="default"`. Les boutons « Voir courbe », « Ouvrir messages », etc. sont en `bg-[var(--color-teal)]`.

**Piste** : Unifier les boutons d’action principaux soignant avec le même dégradé que le patient pour une identité visuelle commune (radiant green sur les CTAs).

---

### 3.8 Données : scope patient pour Messages / Docs soignant

- En mock, `providerDocuments` / `patientDocuments` et les threads ne sont pas forcément filtrés par `selectedClinicalPatient`. Pour une maquette multi-patients, le soignant devrait voir les messages/documents du *patient sélectionné* uniquement.

**Piste** : Prévoir un filtre par `selectedClinicalPatient.id` (ou équivalent) sur les listes de threads et de documents pour la vue soignant, en mock puis en API (ressources par patient).

---

## 4. Synthèse des priorités

| Priorité | Sujet | Effet |
|----------|--------|--------|
| Haute | Contexte patient dans Messages/Docs soignant (titre + données) | Compréhension immédiate pour quel patient on agit |
| Haute | Compte / Paramètres soignant (pill, Déconnexion) | Parité avec le patient et vraie déconnexion soignant |
| Moyenne | Regrouper Messages + Docs en onglet « Échanges » soignant | Navigation alignée avec le patient, barre moins chargée |
| Moyenne | Adapter libellés et boutons (Nouveau message, Dépôt document) selon rôle | Pas de formulations « patient » quand on est soignant |
| Moyenne | Bouton « ← Patients » sur la Fiche patient | Conforme aux wireframes et au pattern Retour patient |
| Basse | Dégradé teal sur boutons soignant | Cohérence visuelle des CTAs |
| Basse | Filtrage des données Messages/Docs par patient (mock puis API) | Données cohérentes avec le patient sélectionné |

---

## 5. Parcours soignant cible (après alignement)

1. **Connexion** : choix rôle Soignant (ou connexion dédiée).
2. **Cockpit** : indicateurs, priorités, accès à la liste des patients.
3. **Patients** : liste ; clic → Fiche patient (avec bouton « ← Patients »).
4. **Fiche patient** : fiche complète + actions (Courbe, Messages, Documents, Note).
5. **Échanges** (un onglet) : Messages | Documents pour le patient sélectionné ; titres « Messages · [Patient] » / « Documents · [Patient] » ; envoi document au patient.
6. **Courbes** : suivi du patient sélectionné (déjà « Suivi · [Patient] »).
7. **Notes** : notes du patient sélectionné.
8. **Compte soignant** (depuis pill ou menu) : Paramètres, Déconnexion.

Cette analyse peut servir de base pour des tickets ou une roadmap d’alignement partie soignant / partie patient sans toucher au code dans l’immédiat.
