import type { ReactNode } from "react";

/**
 * Types et contrats de données pour la maquette DiabetCare.
 * Conçus pour rester sérialisables et compatibles avec une future API Rails (ressources Patient, Document, Note, etc.).
 */
export type Role = "patient" | "clinician";
export type PatientTab = "accueil" | "capteur" | "mesures" | "echanges" | "profil";
export type ClinicianTab = "cockpit" | "documents" | "patients" | "patient_view" | "echanges" | "mesures" | "notes" | "compte";
export type AnyTab = PatientTab | ClinicianTab;
export type Tone = "neutral" | "active" | "hypo" | "hyper" | "info";
export type MeasurePeriod = "7j" | "15j" | "30j" | "90j";
export type FollowUpView = "jour" | "tendances" | "carnet";
export type ExchangeTab = "messages" | "documents";
export type AccountTab = "profil" | "parametres";

export type ClinicalPatient = {
  id: string;
  name: string;
  initials: string;
  sensor: string;
  freshness: string;
  status: string;
  tone: Tone;
  lastReading: number;
  tir: number;
  openAlerts: number;
  /** Âge (années). */
  age?: number;
  /** Sexe (ex. "F", "M", "Non renseigné"). */
  sex?: string;
  /** Taille (ex. "165 cm"). */
  height?: string;
  /** Poids (ex. "62 kg"). */
  weight?: string;
  /** Type de diabète (ex. "Type 2"). */
  diabetesType?: string;
  /** Type de traitement (ex. "Insuline + metformine"). */
  treatmentType?: string;
};

export type ConversationMessage = {
  id: string;
  author: string;
  side: "them" | "me";
  text: string;
  time: string;
  date?: string;
  status?: "sent" | "delivered" | "read";
};

export type ConversationThread = {
  id: string;
  name: string;
  initials: string;
  preview: string;
  time: string;
  unread: number;
  online?: boolean;
  messages: ConversationMessage[];
};

/** Soignant inscrit, recherchable par le patient pour démarrer une discussion */
export type Caregiver = {
  id: string;
  name: string;
  initials: string;
  role?: string;
};

export type DocumentItem = {
  id: string;
  /** Identifiant du patient concerné (pour la vue soignant, gestion par patient). */
  patientId?: string;
  title: string;
  category: string;
  date: string;
  content: string;
  source: "soignant" | "patient";
  status?: string;
  isNew?: boolean;
};

export type NoteItem = {
  id: string;
  /** Identifiant du patient concerné (pour la vue soignant). */
  patientId: string;
  title: string;
  author: string;
  date: string;
  content: string;
};

export type PatientProfile = {
  id: string;
  name: string;
  initials: string;
  sensor: string;
  source: string;
  syncAgo: string;
  lastReading: number;
  tir: number;
  freshness: string;
  coverage: number;
  /** Jours restants sur le capteur (optionnel, pour la page Connexions) */
  sensorDaysRemaining?: number;
  /** Durée totale du capteur en jours (ex. 10 pour G7) */
  sensorDaysTotal?: number;
};

/** Type de diabète */
export type DiabetesType = "1" | "2" | "autre";

/** Fiche patient diabétique : identité, diabétologie, traitement, capteur, contacts. */
export type DiabeticPatientFiche = {
  patientId: string;
  /** Identité */
  lastName: string;
  firstName: string;
  birthDate: string;
  /** Contact */
  phone?: string;
  email?: string;
  /** Diabétologie */
  diabetesType: DiabetesType;
  dateDiagnosis: string;
  lastHbA1c?: number;
  lastHbA1cDate?: string;
  targetGlucoseMin: number;
  targetGlucoseMax: number;
  /** Traitement (insuline, pompe, antidiabétiques oraux) */
  treatmentSummary: string;
  /** Capteur / CGM */
  sensorType: string;
  lastCalibration?: string;
  /** Médecin / équipe */
  treatingPhysician: string;
  physicianPhone?: string;
  /** Urgence */
  emergencyContact?: string;
  emergencyPhone?: string;
  /** Clinique */
  allergies?: string;
  comorbidities?: string;
  notes?: string;
};

export type ClinicianProfile = {
  name: string;
  initials: string;
};

/** Rendez-vous soignant : date/heure, patient, type. Sérialisable pour API Rails. */
export type Appointment = {
  id: string;
  date: string;
  time: string;
  patientId: string;
  patientName: string;
  type: string;
};

export type DeviceConnection = {
  vendor: string;
  product: string;
  status: string;
  lastSync: string;
};

export type HistoryRow = {
  time: string;
  value: number;
  status: string;
  note: string;
};

/** Type d'entrée du carnet diabète (glycémie, repas, insuline, activité, note) */
export type CarnetEntryKind = "glucose" | "meal" | "bolus" | "basal" | "activity" | "note";

/** Créneau repas pour la grille du carnet */
export type MealSlot = "petit-dejeuner" | "dejeuner" | "diner" | "en-cas";
/** Moment par rapport au repas */
export type MealMoment = "avant" | "apres";

export type CarnetEntry = {
  id: string;
  date: string;
  time: string;
  kind: CarnetEntryKind;
  /** Valeur principale (mg/dL, unités, g glucides, etc.) */
  value?: number;
  unit?: string;
  /** Libellé ou détail (ex. "Petit-déjeuner", "Marche 30 min") */
  label?: string;
  note?: string;
  /** Créneau repas (pour affichage grille Avant/Après) */
  mealSlot?: MealSlot;
  moment?: MealMoment;
};

export type NavItem<T extends string> = {
  key: T;
  label: ReactNode;
  variant?: "filledIcon" | "plainIcon" | "text";
};
