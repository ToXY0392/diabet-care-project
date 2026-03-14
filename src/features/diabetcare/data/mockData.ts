import type {
  ClinicalPatient,
  ClinicianProfile,
  ConversationThread,
  DeviceConnection,
  DocumentItem,
  HistoryRow,
  NoteItem,
  PatientProfile,
} from "../types";

export const patient: PatientProfile = {
  id: "PAT-001",
  name: "Léa Bernard",
  initials: "LB",
  sensor: "Dexcom G7",
  source: "Dexcom",
  syncAgo: "il y a 5 min",
  lastReading: 118,
  tir: 74,
  freshness: "5 min",
  coverage: 93,
};

export const clinicianProfile: ClinicianProfile = {
  name: "Dr Claire Lambert",
  initials: "CL",
};

export const clinicianPatients: ClinicalPatient[] = [
  { id: "PAT-001", name: "Léa Bernard", initials: "LB", sensor: "Dexcom G7", freshness: "5 min", status: "À surveiller", tone: "info", lastReading: 118, tir: 74, openAlerts: 1 },
  { id: "PAT-002", name: "Lucas Moreau", initials: "LM", sensor: "FreeStyle Libre", freshness: "14 min", status: "Stable", tone: "active", lastReading: 132, tir: 81, openAlerts: 0 },
  { id: "PAT-003", name: "Nina Roche", initials: "NR", sensor: "Dexcom G7", freshness: "58 min", status: "Données manquantes", tone: "hyper", lastReading: 186, tir: 61, openAlerts: 2 },
];

export const glucoseSeriesByPeriod = {
  "7j": {
    data: [248, 226, 205, 188, 196, 224, 278, 306, 332, 338, 320, 309, 301, 292, 282, 272, 263, 248, 226, 198, 176, 181, 191, 188, 214, 248, 239, 271, 262, 258, 261, 279, 295, 287, 252],
    xLabels: ["0h", "4h", "8h", "12h", "16h", "20h", "24h"],
  },
  "15j": {
    data: [236, 228, 219, 212, 221, 238, 257, 274, 291, 306, 298, 286, 279, 268, 252, 241, 229, 214, 201, 196, 204, 216, 231, 244, 259, 271, 266, 252],
    xLabels: ["J1", "J3", "J5", "J7", "J9", "J11", "J13", "J15"],
  },
  "30j": {
    data: [228, 224, 219, 214, 208, 203, 198, 194, 201, 209, 221, 234, 246, 257, 263, 259, 248, 236, 227, 219, 211, 204, 199, 205, 216, 229, 241, 236],
    xLabels: ["S1", "S2", "S3", "S4"],
  },
  "90j": {
    data: [242, 238, 233, 227, 221, 215, 210, 208, 214, 223, 235, 248, 259, 267, 261, 252, 243, 234, 226, 219, 213, 209, 216, 225, 236, 244, 239, 231],
    xLabels: ["M1", "M2", "M3"],
  },
} as const;

export const historyRows: HistoryRow[] = [
  { time: "12:10", value: 118, status: "Stable", note: "Synchronisé" },
  { time: "12:05", value: 111, status: "↗ légère hausse", note: "Après collation" },
  { time: "12:00", value: 102, status: "Stable", note: "RAS" },
  { time: "11:55", value: 88, status: "↘ baisse", note: "Surveillance" },
  { time: "11:50", value: 72, status: "Bas", note: "Seuil approché" },
  { time: "11:45", value: 68, status: "Hypo", note: "Événement détecté" },
];

export const documents: DocumentItem[] = [
  { id: "ordonnance-mars", title: "Ordonnance mars", category: "Prescription", date: "11 mars 2026", source: "soignant", isNew: true, content: "Insuline rapide avant repas. Maintien du schéma basal actuel. Surveillance CGM continue recommandée avec revue des épisodes bas de fin de matinée." },
  { id: "compte-rendu", title: "Compte-rendu consultation", category: "Clinique", date: "09 mars 2026", source: "soignant", content: "Temps dans la cible satisfaisant. Quelques épisodes bas en fin de matinée. Réévaluation prévue après une semaine de surveillance continue." },
  { id: "consentement", title: "Consentement télésurveillance", category: "Administratif", date: "01 mars 2026", source: "soignant", content: "Consentement actif pour le partage des données de surveillance continue du glucose et l'échange de documents cliniques avec l'équipe soignante." },
  { id: "bilan-mars-patient", title: "Bilan glycémique mars.pdf", category: "PDF", date: "10 mars 2026", source: "patient", status: "Consulté", content: "Document patient transmis à l'équipe soignante avec récapitulatif des mesures, événements et remarques cliniques." },
  { id: "ordonnance-photo-patient", title: "Ordonnance photo.jpg", category: "Image", date: "07 mars 2026", source: "patient", status: "Envoyé", content: "Capture photo d'ordonnance déposée par le patient et transmise au soignant." },
];

export const patientThreads: ConversationThread[] = [
  {
    id: "dr-martin",
    name: "Dr Martin",
    initials: "DM",
    preview: "Parfait. Votre tendance Dexcom reste stable.",
    time: "08:04",
    unread: 1,
    online: true,
    messages: [
      { id: "m0a", author: "Dr Martin", side: "them", text: "Bonjour Léa, j'ai bien reçu vos dernières glycémies.", time: "16:30", date: "12 mars" },
      { id: "m0b", author: "Dr Martin", side: "them", text: "Les valeurs sont encourageantes. On reste sur le schéma actuel.", time: "16:31", date: "12 mars" },
      { id: "m0c", author: "Léa Bernard", side: "me", text: "Merci docteur ! J'avais une question sur le Libre 3.", time: "17:02", date: "12 mars", status: "read" },
      { id: "m0d", author: "Léa Bernard", side: "me", text: "Le capteur s'est déconnecté deux fois cette semaine, c'est normal ?", time: "17:03", date: "12 mars", status: "read" },
      { id: "m0e", author: "Dr Martin", side: "them", text: "Ça arrive parfois. Vérifiez que le Bluetooth reste actif. Si ça persiste, on changera de capteur.", time: "17:15", date: "12 mars" },
      { id: "m0f", author: "Léa Bernard", side: "me", text: "D'accord, je surveille. Bonne soirée !", time: "17:18", date: "12 mars", status: "read" },
      { id: "m1", author: "Dr Martin", side: "them", text: "Pensez à joindre votre dernier bilan dans l'application.", time: "07:52", date: "Aujourd'hui" },
      { id: "m2", author: "Léa Bernard", side: "me", text: "Je vous l'envoie aujourd'hui avec mes mesures du matin.", time: "08:03", date: "Aujourd'hui", status: "delivered" },
      { id: "m3", author: "Dr Martin", side: "them", text: "Parfait. Votre tendance Dexcom reste stable.", time: "08:04", date: "Aujourd'hui" },
    ],
  },
  {
    id: "service-suivi",
    name: "Service suivi",
    initials: "SS",
    preview: "Votre document a bien été reçu.",
    time: "07:20",
    unread: 0,
    online: false,
    messages: [
      { id: "s0", author: "Service suivi", side: "them", text: "Bienvenue sur DiabetCare. Nous sommes disponibles du lundi au vendredi de 8h à 18h.", time: "09:00", date: "10 mars" },
      { id: "s1", author: "Service suivi", side: "them", text: "Votre document a bien été reçu.", time: "07:20", date: "Aujourd'hui" },
      { id: "s2", author: "Léa Bernard", side: "me", text: "Merci pour la confirmation.", time: "07:24", date: "Aujourd'hui", status: "read" },
    ],
  },
  {
    id: "dr-lambert",
    name: "Dr Lambert",
    initials: "DL",
    preview: "On garde le même schéma aujourd'hui.",
    time: "Hier",
    unread: 0,
    online: false,
    messages: [
      { id: "l0", author: "Léa Bernard", side: "me", text: "Bonjour Dr Lambert, j'ai eu un épisode d'hypoglycémie hier soir.", time: "08:30", date: "Hier", status: "read" },
      { id: "l1", author: "Dr Lambert", side: "them", text: "Merci de me prévenir. Quelle valeur avez-vous relevée ?", time: "09:15", date: "Hier" },
      { id: "l2", author: "Léa Bernard", side: "me", text: "58 mg/dL vers 22h. J'ai pris du sucre et c'est remonté en 15 min.", time: "09:18", date: "Hier", status: "read" },
      { id: "l3", author: "Dr Lambert", side: "them", text: "On garde le même schéma aujourd'hui et on réévalue demain.", time: "09:22", date: "Hier" },
    ],
  },
];

export const clinicianThreads: ConversationThread[] = [
  {
    id: "patient-lea",
    name: "Léa Bernard",
    initials: "LB",
    preview: "Je vous l'envoie aujourd'hui avec mes mesures du matin.",
    time: "08:03",
    unread: 1,
    online: true,
    messages: [
      { id: "c0a", author: "Dr Martin", side: "me", text: "Bonjour Léa, j'ai bien reçu vos dernières glycémies.", time: "16:30", date: "12 mars", status: "read" },
      { id: "c0b", author: "Dr Martin", side: "me", text: "Les valeurs sont encourageantes. On reste sur le schéma actuel.", time: "16:31", date: "12 mars", status: "read" },
      { id: "c0c", author: "Léa Bernard", side: "them", text: "Merci docteur ! J'avais une question sur le Libre 3.", time: "17:02", date: "12 mars" },
      { id: "c1", author: "Dr Martin", side: "me", text: "Pensez à joindre votre dernier bilan dans l'application.", time: "07:52", date: "Aujourd'hui", status: "delivered" },
      { id: "c2", author: "Léa Bernard", side: "them", text: "Je vous l'envoie aujourd'hui avec mes mesures du matin.", time: "08:03", date: "Aujourd'hui" },
      { id: "c3", author: "Dr Martin", side: "me", text: "Parfait. Votre tendance Dexcom reste stable.", time: "08:04", date: "Aujourd'hui", status: "delivered" },
    ],
  },
  {
    id: "patient-nina",
    name: "Nina Roche",
    initials: "NR",
    preview: "Le capteur ne remonte plus depuis ce midi.",
    time: "08:11",
    unread: 2,
    online: true,
    messages: [
      { id: "n1", author: "Nina Roche", side: "them", text: "Le capteur ne remonte plus depuis ce midi.", time: "08:11", date: "Aujourd'hui" },
      { id: "n2", author: "Dr Claire Lambert", side: "me", text: "Je vois la rupture. Relancez la synchronisation et vérifiez le capteur.", time: "08:13", date: "Aujourd'hui", status: "delivered" },
    ],
  },
  {
    id: "patient-lucas",
    name: "Lucas Moreau",
    initials: "LM",
    preview: "Tout est stable aujourd'hui.",
    time: "Hier",
    unread: 0,
    online: false,
    messages: [
      { id: "u0", author: "Dr Martin", side: "me", text: "Comment vous sentez-vous aujourd'hui Lucas ?", time: "08:00", date: "Hier", status: "read" },
      { id: "u1", author: "Lucas Moreau", side: "them", text: "Tout est stable aujourd'hui.", time: "08:22", date: "Hier" },
      { id: "u2", author: "Dr Martin", side: "me", text: "Parfait, continuez comme ça.", time: "08:30", date: "Hier", status: "read" },
    ],
  },
];

export const therapyNotes: NoteItem[] = [
  { id: "note-1", title: "Note clinique du jour", author: "Dr Lambert", date: "11 mars 2026 · 12:20", content: "Hypoglycémie brève détectée vers 11:45. Pas d’escalade immédiate. Maintien du traitement avec surveillance rapprochée demain matin." },
  { id: "note-2", title: "Ajustement précédent", author: "Dr Lambert", date: "08 mars 2026 · 09:10", content: "Réduction légère du risque post-prandial observée. Poursuite du suivi Dexcom et revue des collations intermédiaires." },
];

export const deviceConnections: DeviceConnection[] = [
  { vendor: "Dexcom", product: "G7", status: "Actif", lastSync: "il y a 5 min" },
  { vendor: "LibreView", product: "FreeStyle Libre", status: "Inactif", lastSync: "aucune sync" },
];
