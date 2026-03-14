import React, { useMemo, useState, type ReactNode } from "react";
import { BarChart3, Home, Plus, Settings } from "lucide-react";

type Role = "patient" | "clinician";
type PatientTab = "accueil" | "capteur" | "mesures" | "echanges" | "profil";
type ClinicianTab = "cockpit" | "patients" | "patient_view" | "mesures" | "messages" | "docs" | "notes";
type AnyTab = PatientTab | ClinicianTab;
type Tone = "neutral" | "active" | "hypo" | "hyper" | "info";
type MeasurePeriod = "7j" | "15j" | "30j" | "90j";
type FollowUpView = "jour" | "tendances" | "carnet";
type ExchangeTab = "messages" | "documents";
type AccountTab = "profil" | "parametres";

type ClinicalPatient = {
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
};

type ConversationMessage = {
  id: string;
  author: string;
  side: "them" | "me";
  text: string;
  time: string;
};

type ConversationThread = {
  id: string;
  name: string;
  initials: string;
  preview: string;
  time: string;
  unread: number;
  messages: ConversationMessage[];
};

type DocumentItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string;
  source: "soignant" | "patient";
  status?: string;
  isNew?: boolean;
};

type NoteItem = {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string;
};

type NavItem<T extends string> = {
  key: T;
  label: ReactNode;
  variant?: "filledIcon" | "plainIcon" | "text";
};

const patient = {
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

const clinicianProfile = {
  name: "Dr Claire Lambert",
  initials: "CL",
};

const clinicianPatients: ClinicalPatient[] = [
  { id: "PAT-001", name: "Léa Bernard", initials: "LB", sensor: "Dexcom G7", freshness: "5 min", status: "À surveiller", tone: "info", lastReading: 118, tir: 74, openAlerts: 1 },
  { id: "PAT-002", name: "Lucas Moreau", initials: "LM", sensor: "FreeStyle Libre", freshness: "14 min", status: "Stable", tone: "active", lastReading: 132, tir: 81, openAlerts: 0 },
  { id: "PAT-003", name: "Nina Roche", initials: "NR", sensor: "Dexcom G7", freshness: "58 min", status: "Données manquantes", tone: "hyper", lastReading: 186, tir: 61, openAlerts: 2 },
];

const glucoseSeriesByPeriod = {
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

const historyRows = [
  { time: "12:10", value: 118, status: "Stable", note: "Synchronisé" },
  { time: "12:05", value: 111, status: "↗ légère hausse", note: "Après collation" },
  { time: "12:00", value: 102, status: "Stable", note: "RAS" },
  { time: "11:55", value: 88, status: "↘ baisse", note: "Surveillance" },
  { time: "11:50", value: 72, status: "Bas", note: "Seuil approché" },
  { time: "11:45", value: 68, status: "Hypo", note: "Événement détecté" },
];

const documents: DocumentItem[] = [
  { id: "ordonnance-mars", title: "Ordonnance mars", category: "Prescription", date: "11 mars 2026", source: "soignant", isNew: true, content: "Insuline rapide avant repas. Maintien du schéma basal actuel. Surveillance CGM continue recommandée avec revue des épisodes bas de fin de matinée." },
  { id: "compte-rendu", title: "Compte-rendu consultation", category: "Clinique", date: "09 mars 2026", source: "soignant", content: "Temps dans la cible satisfaisant. Quelques épisodes bas en fin de matinée. Réévaluation prévue après une semaine de surveillance continue." },
  { id: "consentement", title: "Consentement télésurveillance", category: "Administratif", date: "01 mars 2026", source: "soignant", content: "Consentement actif pour le partage des données de surveillance continue du glucose et l'échange de documents cliniques avec l'équipe soignante." },
  { id: "bilan-mars-patient", title: "Bilan glycémique mars.pdf", category: "PDF", date: "10 mars 2026", source: "patient", status: "Consulté", content: "Document patient transmis à l'équipe soignante avec récapitulatif des mesures, événements et remarques cliniques." },
  { id: "ordonnance-photo-patient", title: "Ordonnance photo.jpg", category: "Image", date: "07 mars 2026", source: "patient", status: "Envoyé", content: "Capture photo d'ordonnance déposée par le patient et transmise au soignant." },
];

const patientThreads: ConversationThread[] = [
  {
    id: "dr-martin",
    name: "Dr Martin",
    initials: "DM",
    preview: "Parfait. Votre tendance Dexcom reste stable.",
    time: "08:04",
    unread: 1,
    messages: [
      { id: "m1", author: "Dr Martin", side: "them", text: "Pensez à joindre votre dernier bilan dans l'application.", time: "07:52" },
      { id: "m2", author: "Léa Bernard", side: "me", text: "Je vous l'envoie aujourd'hui avec mes mesures du matin.", time: "08:03" },
      { id: "m3", author: "Dr Martin", side: "them", text: "Parfait. Votre tendance Dexcom reste stable.", time: "08:04" },
    ],
  },
  {
    id: "service-suivi",
    name: "Service suivi",
    initials: "SS",
    preview: "Votre document a bien été reçu.",
    time: "07:20",
    unread: 0,
    messages: [
      { id: "s1", author: "Service suivi", side: "them", text: "Votre document a bien été reçu.", time: "07:20" },
      { id: "s2", author: "Léa Bernard", side: "me", text: "Merci pour la confirmation.", time: "07:24" },
    ],
  },
  {
    id: "dr-lambert",
    name: "Dr Lambert",
    initials: "DL",
    preview: "On garde le même schéma aujourd'hui.",
    time: "Hier",
    unread: 0,
    messages: [{ id: "l1", author: "Dr Lambert", side: "them", text: "On garde le même schéma aujourd'hui et on réévalue demain.", time: "Hier" }],
  },
];

const clinicianThreads: ConversationThread[] = [
  {
    id: "patient-lea",
    name: "Léa Bernard",
    initials: "LB",
    preview: "Je vous l'envoie aujourd'hui avec mes mesures du matin.",
    time: "08:03",
    unread: 1,
    messages: [
      { id: "c1", author: "Dr Martin", side: "me", text: "Pensez à joindre votre dernier bilan dans l'application.", time: "07:52" },
      { id: "c2", author: "Léa Bernard", side: "them", text: "Je vous l'envoie aujourd'hui avec mes mesures du matin.", time: "08:03" },
      { id: "c3", author: "Dr Martin", side: "me", text: "Parfait. Votre tendance Dexcom reste stable.", time: "08:04" },
    ],
  },
  {
    id: "patient-nina",
    name: "Nina Roche",
    initials: "NR",
    preview: "Le capteur ne remonte plus depuis ce midi.",
    time: "08:11",
    unread: 2,
    messages: [
      { id: "n1", author: "Nina Roche", side: "them", text: "Le capteur ne remonte plus depuis ce midi.", time: "08:11" },
      { id: "n2", author: "Dr Claire Lambert", side: "me", text: "Je vois la rupture. Relancez la synchronisation et vérifiez le capteur.", time: "08:13" },
    ],
  },
  {
    id: "patient-lucas",
    name: "Lucas Moreau",
    initials: "LM",
    preview: "Tout est stable aujourd'hui.",
    time: "Hier",
    unread: 0,
    messages: [{ id: "u1", author: "Lucas Moreau", side: "them", text: "Tout est stable aujourd'hui.", time: "Hier" }],
  },
];

const therapyNotes: NoteItem[] = [
  { id: "note-1", title: "Note clinique du jour", author: "Dr Lambert", date: "11 mars 2026 · 12:20", content: "Hypoglycémie brève détectée vers 11:45. Pas d’escalade immédiate. Maintien du traitement avec surveillance rapprochée demain matin." },
  { id: "note-2", title: "Ajustement précédent", author: "Dr Lambert", date: "08 mars 2026 · 09:10", content: "Réduction légère du risque post-prandial observée. Poursuite du suivi Dexcom et revue des collations intermédiaires." },
];

const deviceConnections = [
  { vendor: "Dexcom", product: "G7", status: "Actif", lastSync: "il y a 5 min" },
  { vendor: "LibreView", product: "FreeStyle Libre", status: "Inactif", lastSync: "aucune sync" },
];

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  const tones: Record<Tone, string> = {
    neutral: "bg-[#E9F6F3] text-[#4d6260]",
    active: "bg-[#d8efe9] text-white",
    hypo: "bg-[#fde8e8] text-[#c81e1e]",
    hyper: "bg-[#fff1e3] text-[#b45309]",
    info: "bg-[#e4efee] text-[#1f6d67]",
  };

  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[28px] bg-[#E9F6F3] border border-[#dde5e7] shadow-sm transition-all duration-150 ${className}`}>{children}</div>;
}

function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-3">
      <div>
        <div className="text-[22px] font-semibold text-[#233636] leading-tight">{title}</div>
        {subtitle ? <div className="text-sm text-[#7a8b91] mt-1">{subtitle}</div> : null}
      </div>
      {action}
    </div>
  );
}

function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center bg-black/25 px-4 pb-24 pt-10">
      <div className="w-full max-w-[330px] rounded-[28px] bg-gradient-to-b from-white to-[#f7fafb] border border-[#dde5e7] shadow-[0_12px_30px_rgba(120,136,145,0.16)] p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="text-xl font-semibold text-[#233636]">{title}</div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#E9F6F3] text-[#233636] text-lg leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MessageComposer() {
  return (
    <Card className="p-3 mt-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-[16px] bg-[#f1f3f2] border border-[#dde5e7] px-4 py-2 text-[14px] text-[#7a8483]">Écrire un message</div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-[#1f8f83] to-[#33b2a3] text-white shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.4 20.6l17.2-8.6c.5-.25.5-.95 0-1.2L3.4 2.2c-.46-.23-.98.14-.92.64l1.1 6.88c.04.27.25.48.52.52l7.33 1.06-7.33 1.06a.6.6 0 00-.52.52l-1.1 6.88c-.06.5.46.87.92.64z" />
          </svg>
        </button>
      </div>
    </Card>
  );
}

const interactiveBase = "transition-all duration-150 ease-out active:scale-[0.985] active:brightness-[1.03]";
const interactiveCard = `${interactiveBase} hover:shadow-md active:shadow-lg`;
const interactiveButton = `${interactiveBase} hover:shadow-md`;

export default function DiabetCareClinicalMockup() {
  const [role, setRole] = useState<Role>("patient");
  const [activeTab, setActiveTab] = useState<AnyTab>("accueil");
  const [activeExchangeTab, setActiveExchangeTab] = useState<ExchangeTab>("messages");
  const [activeAccountTab, setActiveAccountTab] = useState<AccountTab>("profil");
  const [messageViewMode, setMessageViewMode] = useState<"list" | "thread">("list");
  const [documentViewMode, setDocumentViewMode] = useState<"list" | "detail">("list");
  const [messagesCardExpanded, setMessagesCardExpanded] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState(patientThreads[0].id);
  const [selectedDocumentId, setSelectedDocumentId] = useState(documents[0].id);
  const [selectedNoteId, setSelectedNoteId] = useState(therapyNotes[0].id);
  const [selectedClinicalPatientId, setSelectedClinicalPatientId] = useState(clinicianPatients[0].id);
  const [showGlycemiaModal, setShowGlycemiaModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [glycemiaInput, setGlycemiaInput] = useState("118");
  const [mealType, setMealType] = useState("Déjeuner");
  const [mealTime, setMealTime] = useState("12:30");
  const [carbsInput, setCarbsInput] = useState("45");
  const [mealBolusEnabled, setMealBolusEnabled] = useState(true);
  const [mealBolusUnits, setMealBolusUnits] = useState("4");
  const [mealBolusTiming, setMealBolusTiming] = useState("Avant repas");
  const [mealGlucoseMode, setMealGlucoseMode] = useState<"capteur">("capteur");
  const [mealGlucoseValue, setMealGlucoseValue] = useState("118");
  const [mealNote, setMealNote] = useState("");
  const [mealUnusual, setMealUnusual] = useState(false);
  const [mealInsulinExpanded, setMealInsulinExpanded] = useState(false);
  const [mealNotesExpanded, setMealNotesExpanded] = useState(false);
  const [activeMeasurePeriod, setActiveMeasurePeriod] = useState<MeasurePeriod>("7j");
  const [activeFollowUpView, setActiveFollowUpView] = useState<FollowUpView>("jour");
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const currentMeasureConfig = glucoseSeriesByPeriod[activeMeasurePeriod];
  const currentMeasureSeries = currentMeasureConfig.data;

  const chart = useMemo(() => {
    const width = 310;
    const height = 170;
    const min = Math.min(...currentMeasureSeries);
    const max = Math.max(...currentMeasureSeries);
    const range = Math.max(max - min, 1);

    const path = currentMeasureSeries
      .map((value, index) => {
        const x = (index / (currentMeasureSeries.length - 1)) * width;
        const y = height - ((value - min) / range) * (height - 24) - 12;
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");

    const areaPath = `${path} L310,170 L0,170 Z`;
    const points = currentMeasureSeries.map((value, index) => {
      const x = (index / (currentMeasureSeries.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 24) - 12;
      return { value, x, y, index };
    });

    return {
      path,
      areaPath,
      points,
      stats: {
        avg: Math.round(currentMeasureSeries.reduce((sum, value) => sum + value, 0) / currentMeasureSeries.length),
        min,
        max,
      },
    };
  }, [currentMeasureSeries]);

  const visibleHistoryRows = historyExpanded ? historyRows : historyRows.slice(0, 1);
  const providerDocuments = documents.filter((item) => item.source === "soignant");
  const patientDocuments = documents.filter((item) => item.source === "patient");
  const threads = role === "patient" ? patientThreads : clinicianThreads;
  const sortedThreads = [...threads].sort((a, b) => (b.unread !== a.unread ? b.unread - a.unread : a.name.localeCompare(b.name)));
  const visibleThreads = messagesCardExpanded ? sortedThreads : sortedThreads.slice(0, 3);
  const selectedThread = threads.find((item) => item.id === selectedThreadId) ?? threads[0];
  const selectedDocument = documents.find((item) => item.id === selectedDocumentId) ?? documents[0];
  const selectedNote = therapyNotes.find((item) => item.id === selectedNoteId) ?? therapyNotes[0];
  const selectedClinicalPatient = clinicianPatients.find((item) => item.id === selectedClinicalPatientId) ?? clinicianPatients[0];
  const firstUnreadThread = sortedThreads.find((thread) => thread.unread > 0) ?? sortedThreads[0];
  const firstNewDocument = providerDocuments.find((document) => document.isNew) ?? providerDocuments[0];
  const correspondenceHighlight = firstUnreadThread?.unread > 0
    ? {
        kind: "message" as const,
        title: firstUnreadThread.name,
        badge: `${firstUnreadThread.unread} non lu${firstUnreadThread.unread > 1 ? "s" : ""}`,
        preview: firstUnreadThread.preview,
        meta: firstUnreadThread.time,
      }
    : firstNewDocument
      ? {
          kind: "document" as const,
          title: firstNewDocument.title,
          badge: "Nouveau",
          preview: `${firstNewDocument.category} envoyé par le soignant`,
          meta: firstNewDocument.date,
        }
      : null;

  const patientNavItems: NavItem<PatientTab>[] = [
    { key: "accueil", label: <Home className="w-5 h-5" />, variant: "filledIcon" },
    { key: "capteur", label: "Capteur", variant: "text" },
    { key: "mesures", label: <BarChart3 size={20} strokeWidth={2} />, variant: "plainIcon" },
    { key: "echanges", label: "Échanges", variant: "text" },
    { key: "profil", label: <Settings className="w-5 h-5" />, variant: "filledIcon" },
  ];

  const clinicianNavItems: NavItem<ClinicianTab>[] = [
    { key: "cockpit", label: "Cockpit" },
    { key: "patients", label: "Patients" },
    { key: "patient_view", label: "Fiche" },
    { key: "mesures", label: "Courbes" },
    { key: "messages", label: "Messages" },
    { key: "docs", label: "Docs" },
    { key: "notes", label: "Notes" },
  ];

  const switchRole = (nextRole: Role) => {
    setRole(nextRole);
    setActiveTab(nextRole === "patient" ? "accueil" : "cockpit");
    setActiveExchangeTab("messages");
    setActiveAccountTab("profil");
    setSelectedThreadId(nextRole === "patient" ? patientThreads[0].id : clinicianThreads[0].id);
    setMessageViewMode("list");
    setDocumentViewMode("list");
  };

  const renderHeaderPill = () => {
    const initials = role === "patient" ? patient.initials : clinicianProfile.initials;
    const profileTab: AnyTab = role === "patient" ? "profil" : "patients";

    return (
      <div className="flex items-center justify-between mb-3">
        <div className="bg-[#e7f4f2] text-[#1c8f84] border border-[#1c8f84]/30 text-sm font-semibold px-4 py-2 rounded-full">Mercredi 11 mars</div>
        <button
          onClick={() => {
            setActiveTab(profileTab);
            if (role === "patient") setActiveAccountTab("profil");
          }}
          className="w-9 h-9 rounded-full bg-[#1c8f84] flex items-center justify-center text-white font-semibold shadow-sm"
        >
          {initials}
        </button>
      </div>
    );
  };

  const renderRoleSwitcher = () => (
    <div className="mb-3 flex items-center justify-center">
      <div className="bg-[#f1f5f6] rounded-full p-1 flex gap-1 border border-[#dde5e7]">
        <button
          onClick={() => switchRole("patient")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${role === "patient" ? "bg-[#1c8f84] text-white" : "text-[#5e7379]"}`}
        >
          Patient
        </button>
        <button
          onClick={() => switchRole("clinician")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${role === "clinician" ? "bg-[#1c8f84] text-white" : "text-[#5e7379]"}`}
        >
          Soignant
        </button>
      </div>
    </div>
  );

  const renderDashboard = () => {
    const patientPriorityThread = patientThreads.find((thread) => thread.unread > 0) ?? patientThreads[0];

    return (
      <div className="pb-20">
        {renderHeaderPill()}
        <SectionTitle title="Tableau de bord" subtitle="Vue complète du suivi CGM et des actions rapides" />

        <Card className={`p-4 bg-gradient-to-br from-[#1f8f83] to-[#33b2a3] text-white border-transparent ${interactiveCard}`}>
          <div className="text-[11px] tracking-[0.18em] opacity-80">CAPTEUR PRINCIPAL</div>
          <div className="text-[20px] font-semibold mt-1">{patient.sensor}</div>
          <div className="flex items-end gap-2 mt-4">
            <div className="text-[64px] font-bold leading-none">{patient.lastReading}</div>
            <div className="text-[18px] pb-1">mg/dL</div>
          </div>
          <div className="mt-2 text-sm opacity-90">Stable · synchronisé {patient.syncAgo}</div>
        </Card>

        <div className="flex justify-center mt-3 mb-3">
          <button onClick={() => setShowMealModal(true)} className={`rounded-[18px] bg-[#1c8f84] text-white px-7 py-2.5 font-semibold shadow-sm ${interactiveButton}`}>
            Ajouter repas
          </button>
        </div>

        <div className="rounded-[24px] bg-[#1c8f84] text-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="text-[11px] tracking-[0.18em] font-semibold text-white">NON LU</div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e4efee] text-[#1f6d67]">
              {patientPriorityThread.unread} non lu{patientPriorityThread.unread > 1 ? "s" : ""}
            </span>
          </div>

          <button
            onClick={() => {
              setActiveTab("echanges");
              setActiveExchangeTab("messages");
              setSelectedThreadId(patientPriorityThread.id);
              setMessageViewMode("thread");
            }}
            className="w-full rounded-[16px] bg-[#E9F6F3] border border-[#1c8f84]/20 p-3 text-left"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-[#233636] text-[16px] leading-5 truncate">{patientPriorityThread.name}</div>
                <div className="text-sm text-[#72858b] mt-1 truncate">{patientPriorityThread.preview}</div>
              </div>
              <div className="text-xs text-[#72858b] shrink-0">{patientPriorityThread.time}</div>
            </div>
          </button>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => {
                setActiveTab("echanges");
                setActiveExchangeTab("messages");
                setSelectedThreadId(patientPriorityThread.id);
                setMessageViewMode("thread");
              }}
              className="rounded-[14px] bg-[#E9F6F3] text-[#1c8f84] py-2 text-sm font-semibold border border-[#1c8f84]/20"
            >
              Ouvrir
            </button>
            <button
              onClick={() => {
                setActiveTab("echanges");
                setActiveExchangeTab("messages");
                setMessageViewMode("list");
              }}
              className="rounded-[14px] bg-[#E9F6F3] text-[#1c8f84] py-2 text-sm font-semibold border border-[#1c8f84]/20"
            >
              Voir tout
            </button>
          </div>
        </div>
      </div>
    );
  };

  /*
THEME RULE
Card CONNEXIONS
- background vert foncé
- titre blanc
Sous-card Dexcom G7
- fond clair mint
- badge actif mint clair
*/

const renderSensor = () => {
    const activeConnections = deviceConnections.filter((connection) => connection.status === "Actif");

    return (
      <div>
        {renderHeaderPill()}
        <SectionTitle title="Capteur" subtitle="Connexion active et état de synchronisation" />
        <Card className={`p-6 bg-gradient-to-br from-[#1f8f83] to-[#33b2a3] text-white border-transparent ${interactiveCard}`}>
          <div className="text-xs tracking-[0.2em] opacity-80">CAPTEUR PRINCIPAL</div>
          <div className="text-3xl font-semibold mt-1">{patient.sensor}</div>
          <div className="flex items-end gap-3 mt-5">
            <div className="text-6xl font-bold leading-none">{patient.lastReading}</div>
            <div className="text-2xl">mg/dL</div>
          </div>
          <div className="mt-3 text-sm opacity-90">Stable · synchronisé {patient.syncAgo}</div>
        </Card>
        <Card className={`p-5 mt-5 bg-[#1c8f84] border-transparent ${interactiveCard}`}>
          <div className="text-xs tracking-[0.2em] text-white font-semibold">CONNEXIONS</div>
          <div className="space-y-3 mt-4">
            {activeConnections.map((connection) => (
              <div key={`${connection.vendor}-${connection.product}`} className="rounded-[22px] bg-[#F7FCFB] border border-[#cfe5e0] p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[#1c8f84]">{connection.vendor} {connection.product}</div>
                    <div className="text-sm text-[#4d6260] mt-1">Dernière sync : {connection.lastSync}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e7f4f2] text-[#1c8f84] border border-[#1c8f84]/10">Actif</span>
                    <button onClick={() => setActiveTab("profil")} className="w-9 h-9 rounded-full bg-white border border-[#cfe5e0] flex items-center justify-center text-[16px] text-[#1c8f84] shadow-sm" title="Paramètres du capteur">⚙</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderMeasures = () => {
    if (activeFollowUpView === "tendances") {
      const periodTabs: Array<{ key: MeasurePeriod; label: string }> = [
        { key: "7j", label: "7 jours" },
        { key: "15j", label: "15 jours" },
        { key: "30j", label: "30 jours" },
        { key: "90j", label: "90 jours" },
      ];

      const trendStats = [
        { label: "Glycémie moyenne", value: "232", unit: "mg/dL", cardClass: "bg-[#1c8f84] text-white" },
        { label: "Bolus total", value: "6,37", unit: "u", cardClass: "bg-[#1c8f84] text-white" },
        { label: "Basal total", value: "23,76", unit: "u", cardClass: "bg-[#1c8f84] text-white" },
        { label: "Glucides", value: "3", unit: "g", cardClass: "bg-[#1c8f84] text-white" },
      ];

      const tirLegend = [
        { value: "1%", label: "<54", color: "#364ea1" },
        { value: "0%", label: "54-69", color: "#4aa0ff" },
        { value: "40%", label: "70-180", color: "#58c56d" },
        { value: "22%", label: "181-250", color: "#d9a41b" },
        { value: "38%", label: ">250", color: "#e04b42" },
      ];

      const trendCurve = [250, 228, 202, 186, 195, 228, 276, 305, 326, 334, 318, 306, 299, 291, 281, 271, 261, 244, 222, 198, 176, 183, 190, 188, 214, 248, 238, 269, 261, 257, 260, 278, 294, 286, 252];
      const weightCurve = [3.2, 3.2, 3.19, 3.18, 3.18, 3.17, 3.16, 3.16, 3.15, 3.15, 3.14, 3.14];

      const buildTrendPath = (series: number[], width: number, height: number, paddingTop: number, paddingBottom: number) => {
        const min = Math.min(...series);
        const max = Math.max(...series);
        const range = Math.max(max - min, 1);
        const points = series.map((value, index) => {
          const x = (index / (series.length - 1)) * width;
          const y = height - ((value - min) / range) * (height - paddingTop - paddingBottom) - paddingBottom;
          return { x, y, value };
        });
        const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
        const areaPath = `${path} L${width},${height} L0,${height} Z`;
        return { points, path, areaPath };
      };

      const trendChart = buildTrendPath(trendCurve, 310, 220, 18, 14);
      const weightChart = buildTrendPath(weightCurve, 310, 150, 18, 18);

      return (
        <div className="pb-24 animate-[softTabSlide_0.2s_ease-out]">
          {renderHeaderPill()}
          <div className="flex rounded-full bg-[#f1f5f6] border border-[#dde5e7] p-1 mb-5">
            {[["jour", "Jour"], ["tendances", "Tendances"], ["carnet", "Carnet"]].map(([key, label]) => (
              <button key={key} onClick={() => setActiveFollowUpView(key as FollowUpView)} className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${activeFollowUpView === key ? "bg-[#1c8f84] text-white" : "text-[#7a8483]"}`}>{label}</button>
            ))}
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {periodTabs.map((tab) => {
              const isActive = activeMeasurePeriod === tab.key;
              return <button key={tab.key} onClick={() => setActiveMeasurePeriod(tab.key)} className={`min-w-[60px] px-2.5 py-1.5 rounded-[14px] text-[12px] font-semibold transition ${isActive ? "bg-[#1c8f84] text-white shadow-sm" : "text-[#233636]"}`}>{tab.label}</button>;
            })}
          </div>
          <div className="grid grid-cols-4 gap-2 mb-5">
            {trendStats.map((item) => (
              <div key={item.label} className={`rounded-[22px] p-3 shadow-sm min-h-[112px] flex flex-col items-center justify-center text-center gap-2 ${item.cardClass}`}>
                <div className="text-[15px] font-bold leading-none">{item.value}{item.unit ? <span className="text-[11px] font-semibold ml-0.5">{item.unit}</span> : null}</div>
                <div className="text-[11px] leading-4 font-medium opacity-95">{item.label}</div>
              </div>
            ))}
          </div>
          <Card className={`p-5 mb-5 bg-[#f5f7f6] ${interactiveCard}`}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="text-[22px] text-[#6d716f]">◉</div>
                <div className="text-[20px] font-semibold text-[#6d716f]">Temps dans la cible</div>
              </div>
            </div>
            <div className="rounded-full overflow-hidden h-6 bg-[#E9F6F3] mb-5 flex shadow-inner">
              <div className="bg-[#364ea1]" style={{ width: "1%" }} />
              <div className="bg-[#4aa0ff]" style={{ width: "0%" }} />
              <div className="bg-[#58c56d]" style={{ width: "40%" }} />
              <div className="bg-[#d9a41b]" style={{ width: "22%" }} />
              <div className="bg-[#e04b42]" style={{ width: "37%" }} />
            </div>
            <div className="grid grid-cols-5 gap-2 text-center mb-5">
              {tirLegend.map((item) => (
                <div key={item.label}>
                  <div className="text-[15px] font-semibold" style={{ color: item.color }}>{item.value}</div>
                  <div className="mt-1 h-1 rounded-full" style={{ backgroundColor: item.color }} />
                  <div className="mt-1 text-[11px] text-[#4d6260]">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm text-[#4d6260]">
              {[ ["% des données recueillies par CGM", "69%"], ["HbA1c estimée", "0%"], ["GMI estimé", "0%"], ["Coefficient de variation", "38,21"] ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <div>{label}</div>
                  <div className="font-semibold text-[#233636]">{value}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card className={`p-5 mb-5 bg-[#f5f7f6] ${interactiveCard}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-[22px] text-[#6d716f]">◔</div>
              <div>
                <div className="text-[20px] font-semibold text-[#6d716f]">Tendance glycémique</div>
                <div className="text-sm text-[#81949a] mt-1">mg/dL</div>
              </div>
            </div>
            <div className="rounded-[24px] bg-[#f7fafb] p-4 border border-[#e1e8ea]">
              <div className="relative">
                {[26, 92, 184, 250].map((x) => <div key={x} className="absolute top-0 h-full w-[28px] bg-[#dfe5e8]/70 rounded-md" style={{ left: `${x}px` }} />)}
                <svg viewBox="0 0 310 240" className="w-full h-[260px] relative z-10">
                  {[24, 60, 96, 132, 168, 204].map((y) => <line key={y} x1="0" y1={y} x2="310" y2={y} stroke="#d7e3e1" strokeWidth="1" />)}
                  <defs><linearGradient id="trendAreaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7ccfbe" stopOpacity="0.35" /><stop offset="100%" stopColor="#7ccfbe" stopOpacity="0.08" /></linearGradient></defs>
                  <path d={trendChart.areaPath} fill="url(#trendAreaFill)" />
                  <path d={trendChart.path} fill="none" stroke="#1c8f84" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="mt-2 flex items-center justify-between text-[12px] text-[#81949a] px-1">{["0h", "4h", "8h", "12h", "16h", "20h", "24h"].map((label) => <span key={label}>{label}</span>)}</div>
            </div>
          </Card>
          <Card className={`p-5 bg-[#f5f7f6] ${interactiveCard}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-[22px] text-[#6d716f]">⚖</div>
              <div>
                <div className="text-[20px] font-semibold text-[#6d716f]">Tendance de poids</div>
                <div className="text-sm text-[#81949a] mt-1">kg</div>
              </div>
            </div>
            <div className="rounded-[24px] bg-[#f7fafb] p-4 border border-[#e1e8ea] relative overflow-hidden min-h-[220px]">
              <svg viewBox="0 0 310 170" className="w-full h-[180px] opacity-40">
                {[24, 58, 92, 126].map((y) => <line key={y} x1="0" y1={y} x2="310" y2={y} stroke="#d7e3e1" strokeWidth="1" />)}
                <path d={weightChart.path} fill="none" stroke="#8fc9bc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><button className="pointer-events-auto rounded-full bg-[#1c8f84] text-white px-6 py-3 font-semibold shadow-md flex items-center gap-2">Ajouter des données <span className="text-xl leading-none">+</span></button></div>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="pb-24 animate-[softTabSlide_0.2s_ease-out]">
        {renderHeaderPill()}
        <div className="flex rounded-full bg-[#f1f5f6] border border-[#dde5e7] p-1 mb-5">
          {[["jour", "Jour"], ["tendances", "Tendances"], ["carnet", "Carnet"]].map(([key, label]) => (
            <button key={key} onClick={() => setActiveFollowUpView(key as FollowUpView)} className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${activeFollowUpView === key ? "bg-[#1c8f84] text-white" : "text-[#7a8483]"}`}>{label}</button>
          ))}
        </div>
        <SectionTitle title={role === "patient" ? "Suivi" : `Suivi · ${selectedClinicalPatient.name}`} subtitle={role === "patient" ? "Vue clinique journalière et indicateurs clés" : "Revue clinique structurée du patient sélectionné"} />
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[{ label: "Glycémie moyenne", value: `${chart.stats.avg}`, unit: "mg/dL" }, { label: "Bolus total", value: "0", unit: "u" }, { label: "Basal total", value: "6,5", unit: "u" }, { label: "Glucides", value: "0", unit: "g" }].map((item) => (
            <div key={item.label} className="rounded-[22px] p-4 text-white shadow-sm bg-[#1c8f84]">
              <div className="text-3xl font-bold leading-none">{item.value}<span className="text-xl font-semibold ml-1">{item.unit}</span></div>
              <div className="mt-4 text-base leading-6 opacity-95">{item.label}</div>
            </div>
          ))}
        </div>
        <Card className={`p-4 mb-3 ${interactiveCard}`}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3"><div className="text-2xl">◉</div><div className="text-[20px] font-semibold text-[#6d716f]">Temps dans la cible</div></div>
          </div>
          <div className="rounded-full overflow-hidden h-6 bg-[#E9F6F3] mb-5 flex"><div className="bg-[#364ea1]" style={{ width: "0%" }} /><div className="bg-[#4aa0ff]" style={{ width: "0%" }} /><div className="bg-[#58c56d]" style={{ width: "81%" }} /><div className="bg-[#e7b40d]" style={{ width: "19%" }} /><div className="bg-[#e04b42]" style={{ width: "0%" }} /></div>
          <div className="grid grid-cols-5 gap-2 text-center mb-5">{[["0%", "<54", "#364ea1"], ["0%", "54-69", "#4aa0ff"], ["81%", "70-180", "#67b96a"], ["19%", "181-250", "#e7b40d"], ["0%", ">250", "#e04b42"]].map(([value, label, color]) => <div key={label}><div className="text-[16px] font-semibold" style={{ color }}>{value}</div><div className="mt-1 h-1 rounded-full" style={{ backgroundColor: color }} /><div className="mt-1 text-[11px] text-[#4d6260]">{label}</div></div>)}</div>
          <div className="flex items-center justify-between text-sm text-[#4d6260]"><div>% des données recueillies par CGM</div><div className="font-semibold">27%</div></div>
        </Card>
        <Card className={`p-5 mb-5 ${interactiveCard}`}>
          <div className="flex items-center justify-between gap-3 mb-4"><div className="flex items-center gap-3"><div className="text-2xl">◔</div><div><div className="text-[20px] font-semibold text-[#6d716f]">Glycémies</div><div className="text-sm text-[#81949a] mt-1">mg/dL</div></div></div><button onClick={() => setShowMealModal(true)} className="w-9 h-9 rounded-full bg-[#1c8f84] text-white flex items-center justify-center" title="Ajouter un repas"><Plus className="w-4 h-4" /></button></div>
          <div className="rounded-[24px] bg-[#f7fafb] p-4 border border-[#e1e8ea]"><div className="relative"><div className="absolute inset-x-0 top-[8%] h-[18%] bg-[#fff1e3]/60 rounded-md" /><div className="absolute inset-x-0 top-[32%] h-[42%] bg-[#dff3ef] rounded-md" /><div className="absolute inset-x-0 bottom-[10%] h-[18%] bg-[#fde8e8]/60 rounded-md" /><svg viewBox="0 0 310 190" className="w-full h-[240px] relative z-10">{[20, 55, 90, 125, 160].map((y) => <line key={y} x1="0" y1={y} x2="310" y2={y} stroke="#d7e3e1" strokeWidth="1" />)}<defs><linearGradient id="measureAreaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#67b96a" stopOpacity="0.22" /><stop offset="100%" stopColor="#67b96a" stopOpacity="0.03" /></linearGradient></defs><path d={chart.areaPath} fill="url(#measureAreaGradient)" opacity="0.75" /><path d={chart.path} fill="none" stroke="#58c56d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />{chart.points.map((point) => <circle key={point.index} cx={point.x} cy={point.y} r={point.value > 180 || point.value < 70 ? 4.5 : 3} fill={point.value > 180 ? "#e7b40d" : point.value < 70 ? "#e04b42" : "#58c56d"} />)}</svg></div><div className="mt-2 flex items-center justify-between text-[12px] text-[#81949a]">{currentMeasureConfig.xLabels.map((label) => <span key={label}>{label}</span>)}</div></div>
        </Card>
        <Card className={`p-5 mb-5 ${interactiveCard}`}>
          <div className="flex items-center justify-between gap-3 mb-4"><div className="flex items-center gap-3"><div className="text-2xl">✎</div><div className="text-[20px] font-semibold text-[#6d716f]">Injections d'insuline & glucides</div></div><button onClick={() => setShowMealModal(true)} className="w-9 h-9 rounded-full bg-[#1c8f84] text-white flex items-center justify-center" title="Ajouter un repas"><Plus className="w-4 h-4" /></button></div>
          <div className="rounded-[24px] bg-[#f7fafb] p-4 border border-[#e1e8ea]"><div className="flex items-center justify-between text-sm text-[#81949a] mb-3"><span>u/h</span><span>u</span></div><div className="relative h-[180px]"><div className="absolute inset-x-0 bottom-4 h-[2px] bg-[#4b9fb7]" />{[12, 32, 54, 77, 102, 128, 164, 188, 215, 242, 268, 296].map((x) => <div key={x} className="absolute bottom-0 w-[2px] h-3 bg-[#c8d2d1]" style={{ left: `${x}px` }} />)}</div><div className="mt-2 flex items-center justify-between text-[12px] text-[#81949a]"><span>0h</span><span>4h</span><span>8h</span><span>12h</span><span>16h</span><span>20h</span><span>24h</span></div><div className="mt-5 flex items-center justify-end gap-5 text-sm text-[#4d6260]"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#1c8f84] inline-block" />Glucides</div><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#1c8f84] inline-block" />Bolus</div><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#1c8f84] inline-block" />Basal</div></div></div>
        </Card>
        <Card className={`p-5 ${interactiveCard}`}>
          <button onClick={() => setHistoryExpanded((value) => !value)} className="w-full flex items-center justify-between gap-3 text-left"><div className="text-xs tracking-[0.2em] text-[#2c4443] font-semibold">HISTORIQUE DES MESURES</div><div className={`text-[#72858b] text-sm transition-transform duration-200 ${historyExpanded ? "rotate-180" : ""}`}>▾</div></button>
          <div className="space-y-3 mt-4">{visibleHistoryRows.map((row) => <div key={`${row.time}-${row.value}`} className="rounded-[22px] bg-[#E9F6F3] p-4"><div className="flex items-center justify-between gap-3"><div><div className="font-semibold text-[#233636]">{row.value} mg/dL</div><div className="text-sm text-[#72858b] mt-1">{row.status} · {row.note}</div></div><div className="text-sm text-[#72858b]">{row.time}</div></div></div>)}</div>
        </Card>
      </div>
    );
  };

  const renderMessagesContent = () => {
    if (messageViewMode === "thread") {
      return (
        <div className="h-full flex flex-col min-h-0">
          <div className="flex items-center gap-3 mb-3 shrink-0">
            <button onClick={() => setMessageViewMode("list")} className="w-10 h-10 rounded-full bg-[#E9F6F3] border border-[#dde5e7] flex items-center justify-center text-[#233636]">←</button>
            <div className="min-w-0">
              <div className="text-xl font-semibold text-[#233636] truncate">{selectedThread.name}</div>
              <div className="text-sm text-[#7a8b91] mt-1">Conversation sécurisée</div>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide pr-1 space-y-4 pb-3">
            {selectedThread.messages.map((message) => (
              <div key={message.id} className="space-y-1">
                <div className={`text-sm font-semibold text-[#72858b] ${message.side === "me" ? "text-right" : "text-left"}`}>{message.author}</div>
                <div className={`flex ${message.side === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-[24px] px-5 py-4 text-[17px] leading-9 shadow-sm ${message.side === "me" ? "bg-[#1c8f84] text-white" : "bg-[#E9F6F3] border border-[#dde5e7] text-[#233636]"}`}>{message.text}</div>
                </div>
                <div className={`text-sm text-[#81949a] ${message.side === "me" ? "text-right" : "text-left"}`}>{message.time}</div>
              </div>
            ))}
          </div>
          <div className="shrink-0 pt-3">
            <MessageComposer />
          </div>
        </div>
      );
    }

    return (
      <div>
        <button className={`w-full rounded-[18px] bg-[#1c8f84] text-white py-2.5 font-semibold shadow-sm mb-3 ${interactiveButton}`}>Nouveau message</button>
        <Card className={`p-5 mb-5 ${interactiveCard}`}>
          <button onClick={() => setMessagesCardExpanded((value) => !value)} className="w-full flex items-center justify-between gap-3 text-left">
            <div>
              <div className="text-xs tracking-[0.2em] text-[#2c4443] font-semibold">MES MESSAGES</div>
              <div className="text-sm text-[#7a8b91] mt-0.5">Conversations prioritaires et non lus</div>
            </div>
            <div className={`text-white/80 text-sm transition-transform duration-200 ${messagesCardExpanded ? "rotate-180" : ""}`}>▾</div>
          </button>
          <div className="space-y-3 mt-4">
            {visibleThreads.map((thread) => (
              <button key={thread.id} onClick={() => { setSelectedThreadId(thread.id); setMessageViewMode("thread"); }} className={`w-full rounded-[18px] p-3 text-left transition ${selectedThreadId === thread.id ? "bg-[#dfeceb] border border-[#9bc9c2]" : "bg-[#E9F6F3]"} ${interactiveCard}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-[#1c8f84] text-white flex items-center justify-center text-sm font-semibold shrink-0">{thread.initials}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="font-semibold text-[#233636]">{thread.name}</div>
                        {thread.unread > 0 ? <Badge tone="info">{thread.unread} non lu{thread.unread > 1 ? "s" : ""}</Badge> : null}
                      </div>
                      <div className="text-sm text-[#72858b] mt-1 truncate">{thread.preview}</div>
                    </div>
                  </div>
                  <div className="text-xs text-[#81949a] shrink-0">{thread.time}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderDocsContent = () => {
    if (documentViewMode === "detail") {
      return (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setDocumentViewMode("list")} className="w-10 h-10 rounded-full bg-[#E9F6F3] border border-[#dde5e7] flex items-center justify-center text-[#233636]">←</button>
            <div>
              <div className="text-xl font-semibold text-[#233636]">{selectedDocument.title}</div>
              <div className="text-sm text-[#7a8b91] mt-1">{selectedDocument.category} · {selectedDocument.date}</div>
            </div>
          </div>
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="text-xs tracking-[0.2em] text-[#2c4443] font-semibold">DOCUMENT</div>
              {selectedDocument.source === "soignant" ? <Badge tone="active">Envoyé par le soignant</Badge> : <Badge tone="info">Document patient</Badge>}
            </div>
            <div className="rounded-[24px] bg-[#E9F6F3] p-5 text-[#233636] leading-7 text-[15px]">{selectedDocument.content}</div>
            <div className="mt-5 flex gap-3">
              <button className="flex-1 rounded-[18px] bg-[#1c8f84] text-white py-3 font-semibold">Télécharger</button>
              <button className="flex-1 rounded-[18px] bg-[#E9F6F3] text-[#233636] py-3 font-semibold border border-[#dde5e7]">Partager</button>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div>
        <SectionTitle title="Documents" subtitle={role === "patient" ? "Documents reçus et fichiers envoyés au soignant" : `Documents · ${selectedClinicalPatient.name}`} />
        <Card className={`p-5 mb-5 ${interactiveCard}`}>
          <div className="text-xs tracking-[0.2em] text-[#2c4443] font-semibold mb-3">ENVOYÉS PAR LE SOIGNANT</div>
          <div className="space-y-3">
            {providerDocuments.map((document) => (
              <button key={document.id} onClick={() => { setSelectedDocumentId(document.id); setDocumentViewMode("detail"); }} className={`w-full rounded-[22px] bg-[#E9F6F3] p-4 text-left ${interactiveCard}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-semibold text-[#233636]">{document.title}</div>
                      {document.isNew ? <Badge tone="active">Nouveau</Badge> : null}
                    </div>
                    <div className="text-sm text-[#72858b] mt-1">{document.category} · {document.date}</div>
                  </div>
                  <div className="text-[#72858b]">›</div>
                </div>
              </button>
            ))}
          </div>
        </Card>
        <Card className={`p-5 mb-5 ${interactiveCard}`}>
          <div className="text-xs tracking-[0.2em] text-[#2c4443] font-semibold mb-3">DÉPOSER UN DOCUMENT</div>
          <div className="rounded-[22px] bg-[#E9F6F3] p-5">
            <div className="text-[17px] font-semibold text-[#233636]">Envoyer un document au soignant</div>
            <div className="text-sm text-[#72858b] mt-2">PDF, photo d'ordonnance, bilan glycémique ou résultat de laboratoire.</div>
            <div className="mt-4 flex gap-3">
              <button className="flex-1 rounded-[18px] bg-[#1c8f84] text-white py-3 font-semibold">Choisir un fichier</button>
              <button className="flex-1 rounded-[18px] bg-[#E9F6F3] text-white py-3 font-semibold border border-[#dde5e7]">Prendre une photo</button>
            </div>
          </div>
        </Card>
        <Card className={`p-5 ${interactiveCard}`}>
          <div className="text-xs tracking-[0.2em] text-[#2c4443] font-semibold mb-3">MES DOCUMENTS ENVOYÉS</div>
          <div className="space-y-3">
            {patientDocuments.map((document) => (
              <button key={document.id} onClick={() => { setSelectedDocumentId(document.id); setDocumentViewMode("detail"); }} className={`w-full rounded-[22px] bg-[#E9F6F3] p-4 text-left ${interactiveCard}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[#233636]">{document.title}</div>
                    <div className="text-sm text-[#72858b] mt-1">{document.category} · envoyé le {document.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {document.status ? <Badge tone={document.status === "Consulté" ? "active" : "neutral"}>{document.status}</Badge> : null}
                    <div className="text-[#72858b]">›</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderExchanges = () => (
    <div>
      {renderHeaderPill()}
      <SectionTitle title="Échanges" subtitle="Messagerie et documents partagés avec le soignant" />
      <div className="mb-3 flex items-center justify-center">
        <div className="relative bg-[#f1f5f6] rounded-full p-1 flex gap-1 border border-[#dde5e7] w-full overflow-hidden">
          <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-[#1c8f84] transition-all duration-200 ease-in-out ${activeExchangeTab === "messages" ? "left-1" : "left-[calc(50%+2px)]"}`} />
          <button onClick={() => setActiveExchangeTab("messages")} className={`relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.985] ${activeExchangeTab === "messages" ? "text-white" : "text-[#72858b]"}`}>Messages</button>
          <button onClick={() => setActiveExchangeTab("documents")} className={`relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.985] ${activeExchangeTab === "documents" ? "text-white" : "text-[#72858b]"}`}>Documents</button>
        </div>
      </div>
      <div className="relative overflow-hidden min-h-0 flex-1">
        {activeExchangeTab === "messages" ? <div className="animate-[slideFromLeft_0.2s_ease-in-out]">{renderMessagesContent()}</div> : <div className="animate-[slideFromRight_0.2s_ease-in-out]">{renderDocsContent()}</div>}
      </div>
    </div>
  );

  const renderNotes = () => {
    if (role === "patient") {
      return (
        <div>
          {renderHeaderPill()}
          <SectionTitle title="Notes du soignant" subtitle="Commentaires cliniques et décisions de suivi partagés avec le patient" />
          <div className="space-y-4">
            {therapyNotes.map((note) => (
              <Card key={note.id} className={`p-5 ${interactiveCard}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-white">{note.title}</div>
                    <div className="text-sm text-white/80 mt-1">{note.author} · {note.date}</div>
                  </div>
                  <Badge tone="info">Clinique</Badge>
                </div>
                <div className="mt-4 rounded-[24px] bg-[#E9F6F3] p-5 text-white leading-7 text-[15px]">{note.content}</div>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div>
        {renderHeaderPill()}
        <SectionTitle title="Notes thérapeutiques" subtitle={`Notes cliniques · ${selectedClinicalPatient.name}`} />
        <div className="grid grid-cols-[126px_1fr] gap-4">
          <div className="space-y-3">
            {therapyNotes.map((note) => (
              <button key={note.id} onClick={() => setSelectedNoteId(note.id)} className={`w-full rounded-[22px] p-3 text-left ${selectedNoteId === note.id ? "bg-[#1c8f84] text-white" : "bg-[#e3e8e7] text-white border border-[#dde5e7]"}`}>
                <div className="font-semibold text-sm leading-tight">{note.title}</div>
                <div className={`text-xs mt-1 ${selectedNoteId === note.id ? "text-white/80" : "text-white/80"}`}>{note.author}</div>
              </button>
            ))}
          </div>
          <Card className="p-5">
            <div className="text-xs tracking-[0.2em] text-[#2c4443] font-semibold">NOTE</div>
            <div className="text-2xl font-semibold text-white mt-1">{selectedNote.title}</div>
            <div className="text-sm text-white/80 mt-1">{selectedNote.author} · {selectedNote.date}</div>
            <div className="mt-5 rounded-[24px] bg-[#E9F6F3] p-5 text-white leading-7 text-[15px]">{selectedNote.content}</div>
            <div className="mt-5 flex gap-3">
              <button className="flex-1 rounded-[18px] bg-[#1c8f84] text-white py-3 font-semibold">Nouvelle note</button>
              <button className="flex-1 rounded-[18px] bg-[#E9F6F3] text-white py-3 font-semibold">Archiver</button>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div>
      {renderHeaderPill()}
      <SectionTitle title="Compte" subtitle="Informations du patient et préférences de l’application" />
      <div className="mb-3 flex items-center justify-center">
        <div className="relative bg-[#f1f5f6] rounded-full p-1 flex gap-1 border border-[#dde5e7] w-full overflow-hidden">
          <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-[#1c8f84] transition-all duration-200 ease-in-out ${activeAccountTab === "profil" ? "left-1" : "left-[calc(50%+2px)]"}`} />
          <button onClick={() => setActiveAccountTab("profil")} className={`relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.985] ${activeAccountTab === "profil" ? "text-white" : "text-[#72858b]"}`}>Profil</button>
          <button onClick={() => setActiveAccountTab("parametres")} className={`relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.985] ${activeAccountTab === "parametres" ? "text-white" : "text-[#72858b]"}`}>Paramètres</button>
        </div>
      </div>
      <div className="relative overflow-hidden min-h-[320px]">
        {activeAccountTab === "profil" ? (
          <div className="animate-[slideFromLeft_0.2s_ease-in-out] space-y-4">
            <Card className={`p-4 ${interactiveCard}`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#1c8f84] flex items-center justify-center text-white text-xl font-semibold shrink-0">{patient.initials}</div>
                <div className="min-w-0">
                  <div className="text-xl font-semibold text-[#233636] truncate">{patient.name}</div>
                  <div className="text-sm text-[#72858b] mt-1">{patient.sensor}</div>
                  <div className="text-sm text-white mt-1">Synchronisé {patient.syncAgo}</div>
                </div>
              </div>
            </Card>

            <div>
              <div className="text-xs tracking-[0.2em] text-[#2c4443] font-semibold mb-3">PARAMÈTRES</div>
              <div className="space-y-3">
                {[
                  { title: "Capteur connecté", desc: `${patient.sensor} · synchronisé ${patient.syncAgo}`, icon: "◉" },
                  { title: "Sources de données", desc: `${patient.source} · télésurveillance active`, icon: "▣" },
                  { title: "Notifications", desc: "Alertes hypo, hyper et messages médecin", icon: "◌" },
                  { title: "Confidentialité", desc: "Consentement actif et partage des données", icon: "◍" },
                  { title: "Sécurité", desc: "Accès au compte et protection des données", icon: "◎" },
                ].map((item) => (
                  <button key={item.title} className={`w-full rounded-[20px] bg-[#E9F6F3] border border-[#dde5e7] p-4 text-left flex items-center gap-3 ${interactiveButton}`}>
                    <div className="w-10 h-10 rounded-full bg-[#e7f4f2] text-white flex items-center justify-center text-base shrink-0">{item.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[#233636] truncate">{item.title}</div>
                      <div className="text-sm text-[#72858b] mt-1 truncate">{item.desc}</div>
                    </div>
                    <div className="text-[#72858b] shrink-0">›</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-[slideFromRight_0.2s_ease-in-out]">
            <Card className={`p-5 ${interactiveCard}`}>
              <div className="text-xs tracking-[0.2em] text-[#2c4443] font-semibold">PARAMÈTRES</div>
              <div className="space-y-3 mt-4">
                {[
                  "Notifications",
                  "Historique de synchronisation",
                  "Documents partagés",
                  "Sécurité du compte",
                  "Déconnexion",
                ].map((item, index) => (
                  <button key={item} className={`w-full rounded-[20px] ${index === 4 ? "bg-[#fff5f5] text-[#b45309] border border-[#f3d6d6]" : "bg-[#E9F6F3] text-[#233636] border border-[#dde5e7]"} p-4 text-left font-semibold ${interactiveButton}`}>
                    {item}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  const renderClinicianCockpit = () => {
    const totalAlerts = clinicianPatients.reduce((sum, p) => sum + p.openAlerts, 0);
    const riskySensors = clinicianPatients.filter((p) => p.openAlerts > 0 || p.freshness.includes("58") || p.status === "Données manquantes").length;
    const priorityPatients = [...clinicianPatients].sort((a, b) => {
      if (b.openAlerts !== a.openAlerts) return b.openAlerts - a.openAlerts;
      if (a.status !== b.status) return a.status.localeCompare(b.status);
      return a.name.localeCompare(b.name);
    });

    return (
      <div>
        {renderHeaderPill()}
        <SectionTitle title="Cockpit clinique" subtitle="Alertes, priorités patient et vision populationnelle" />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-4 bg-[#1c8f84] text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-white">Alertes ouvertes</div>
                <div className="text-3xl font-bold text-white mt-1">{totalAlerts}</div>
              </div>
              <Badge tone="hypo">Priorité</Badge>
            </div>
          </Card>
          <Card className="p-4 bg-[#1c8f84] text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-white">Capteurs à risque</div>
                <div className="text-3xl font-bold text-white mt-1">{riskySensors}</div>
              </div>
              <Badge tone="hyper">Surveillance</Badge>
            </div>
          </Card>
          <Card className="p-4 bg-[#1c8f84] text-white">
            <div className="text-sm text-white">Patients suivis</div>
            <div className="text-3xl font-bold text-white mt-1">{clinicianPatients.length}</div>
          </Card>
          <Card className="p-4 bg-[#1c8f84] text-white">
            <div className="text-sm text-white">TIR médian</div>
            <div className="text-3xl font-bold text-white mt-1">72%</div>
          </Card>
        </div>

        <Card className={`p-4 ${interactiveCard}`}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <div className="text-xs tracking-[0.2em] text-[#2c4443] font-semibold">PRIORITÉ CLINIQUE</div>
              <div className="text-lg font-semibold text-white mt-1">Patients à surveiller</div>
            </div>
            <button onClick={() => setActiveTab("patients")} className="text-sm font-semibold text-white">Voir liste</button>
          </div>

          <div className="space-y-2">
            {priorityPatients.slice(0, 3).map((p) => {
              const statusTone: Tone = p.openAlerts > 1 ? "hypo" : p.openAlerts === 1 ? "hyper" : p.tone;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedClinicalPatientId(p.id);
                    setActiveTab("patient_view");
                  }}
                  className={`w-full rounded-[18px] bg-[#E9F6F3] border border-[#dde5e7] p-3 text-left ${interactiveCard}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">{p.name}</div>
                      <div className="text-sm text-white/80 mt-1 truncate">{p.sensor} · fraîcheur {p.freshness}</div>
                      <div className="text-xs text-[#81949a] mt-1">{p.lastReading} mg/dL · TIR {p.tir}%</div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge tone={statusTone === "hypo" ? "info" : statusTone === "hyper" ? "neutral" : statusTone}>{p.status}</Badge>
                      <div className="text-xs text-white/80">{p.openAlerts} alerte(s)</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    );
  };

  const renderClinicianPatients = () => (
    <div>
      {renderHeaderPill()}
      <SectionTitle title="Patients" subtitle="Liste surveillée et accès rapide aux dossiers" />
      <div className="space-y-3">
        {clinicianPatients.map((p) => (
          <button key={p.id} onClick={() => { setSelectedClinicalPatientId(p.id); setActiveTab("patient_view"); }} className={`w-full rounded-[24px] p-4 text-left ${selectedClinicalPatientId === p.id ? "bg-[#dfeceb] border border-[#9bc9c2]" : "bg-[#e3e8e7] border border-[#dde5e7]"}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1c8f84] text-white flex items-center justify-center font-semibold">{p.initials}</div>
                <div>
                  <div className="font-semibold text-white">{p.name}</div>
                  <div className="text-sm text-white/80 mt-1">{p.id} · {p.sensor}</div>
                </div>
              </div>
              <div className="text-right">
                <Badge tone={p.tone}>{p.status}</Badge>
                <div className="text-sm text-white/80 mt-2">{p.lastReading} mg/dL · TIR {p.tir}%</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderClinicianPatientView = () => (
    <div>
      {renderHeaderPill()}
      <SectionTitle title={selectedClinicalPatient.name} subtitle={`Fiche patient · ${selectedClinicalPatient.id}`} action={<Badge tone={selectedClinicalPatient.tone}>{selectedClinicalPatient.status}</Badge>} />
      <Card className="p-5">
        <div className="grid grid-cols-2 gap-4">
          {[
            ["Dernière lecture", `${selectedClinicalPatient.lastReading} mg/dL`],
            ["Freshness", selectedClinicalPatient.freshness],
            ["Capteur", selectedClinicalPatient.sensor],
            ["Alertes ouvertes", String(selectedClinicalPatient.openAlerts)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[22px] bg-[#E9F6F3] p-4">
              <div className="text-sm text-white/80">{label}</div>
              <div className="text-lg font-semibold text-white mt-1">{value}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card className={`p-5 mt-5 ${interactiveCard}`}>
        <div className="text-xs tracking-[0.2em] text-[#2c4443] font-semibold mb-3">ACTIONS SOIGNANT</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Voir courbe", "mesures"],
            ["Ouvrir messages", "messages"],
            ["Voir documents", "docs"],
            ["Écrire une note", "notes"],
          ].map(([label, target]) => (
            <button key={label} onClick={() => setActiveTab(target as ClinicianTab)} className="rounded-[18px] bg-[#1c8f84] text-white py-3 font-semibold">{label}</button>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderActiveScreen = () => {
    if (role === "patient") {
      switch (activeTab) {
        case "accueil":
          return renderDashboard();
        case "capteur":
          return renderSensor();
        case "mesures":
          return renderMeasures();
        case "echanges":
          return renderExchanges();
        case "profil":
          return renderProfile();
        default:
          return renderDashboard();
      }
    }

    switch (activeTab) {
      case "cockpit":
        return renderClinicianCockpit();
      case "patients":
        return renderClinicianPatients();
      case "patient_view":
        return renderClinicianPatientView();
      case "mesures":
        return renderMeasures();
      case "messages":
        return renderMessagesContent();
      case "docs":
        return renderDocsContent();
      case "notes":
        return renderNotes();
      default:
        return renderClinicianCockpit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E9F6F3] p-6">
      <div className="relative w-[390px] h-[844px] rounded-[48px] bg-gradient-to-b from-[#0f1f1e] to-[#071314] shadow-2xl overflow-hidden">
        <div className="absolute top-7 left-6 text-white text-xl tracking-tight">9:41</div>
        <div className="absolute top-7 right-6 flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E9F6F3]/65" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#E9F6F3]/65" />
          <div className="w-5 h-2.5 rounded-full bg-[#E9F6F3]/65" />
        </div>
        <div className="absolute inset-[10px] rounded-[38px] bg-gradient-to-b from-[#EAF6F3] to-[#DDEFEA] px-5 pt-16 pb-6 flex flex-col overflow-hidden">
          <style>{`
            @keyframes slideFromLeft { from { opacity: 0; transform: translateX(-18px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes slideFromRight { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes softTabSlide { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: translateX(0); } }
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          {renderRoleSwitcher()}
          <div className={`flex-1 min-h-0 pr-1 animate-[softTabSlide_0.2s_ease-out] overflow-y-auto scrollbar-hide`}>{renderActiveScreen()}</div>
          {!(role === "patient" && activeTab === "echanges" && activeExchangeTab === "messages" && messageViewMode === "thread") ? (
            <div className="mt-3 bg-[#f1f5f6] rounded-full px-3 py-2 flex justify-between items-center text-[11px] text-[#72858b] gap-1 overflow-x-auto scrollbar-hide">
              {role === "patient"
                ? patientNavItems.map((item) => {
                    const isActive = activeTab === item.key;
                    const activeClass = isActive ? "text-[#1c8f84]" : "text-[#72858b]";

                    if (item.variant === "filledIcon") {
                      return (
                        <button
                          key={item.key}
                          onClick={() => setActiveTab(item.key)}
                          className={`w-9 h-9 flex items-center justify-center transition-all duration-150 active:scale-[0.97] ${activeClass}`}
                        >
                          {item.label}
                        </button>
                      );
                    }

                    if (item.variant === "plainIcon") {
                      return (
                        <button
                          key={item.key}
                          onClick={() => setActiveTab(item.key)}
                          className={`w-10 h-10 flex items-center justify-center transition-all duration-150 active:scale-[0.97] ${activeClass}`}
                        >
                          {item.label}
                        </button>
                      );
                    }

                    return (
                      <button
                        key={item.key}
                        onClick={() => setActiveTab(item.key)}
                        className={`px-3 py-1 whitespace-nowrap transition-all duration-150 active:scale-[0.97] ${isActive ? "text-[#1c8f84] font-semibold" : "text-[#72858b]"}`}
                      >
                        {item.label}
                      </button>
                    );
                  })
                : clinicianNavItems.map((item) => {
                    const isActive = activeTab === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setActiveTab(item.key)}
                        className={`px-3 py-1 whitespace-nowrap transition-all duration-150 active:scale-[0.97] ${isActive ? "text-[#1c8f84] font-semibold" : "text-[#72858b]"}`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
            </div>
          ) : null}

          <Modal open={showGlycemiaModal} title="Ajouter glycémie" onClose={() => setShowGlycemiaModal(false)}>
            <div className="space-y-3">
              <div className="rounded-[20px] bg-[#E9F6F3] p-4">
                <div className="text-sm text-white/80 mb-2">Valeur manuelle</div>
                <input value={glycemiaInput} onChange={(event) => setGlycemiaInput(event.target.value)} className="w-full rounded-[16px] bg-[#E9F6F3] border border-[#dde5e7] px-4 py-3 text-white outline-none" inputMode="numeric" />
              </div>
              <button onClick={() => { setActiveTab("mesures"); setShowGlycemiaModal(false); }} className="w-full rounded-[18px] bg-[#1c8f84] text-white py-3 font-semibold">Enregistrer manuellement</button>
              <button onClick={() => { setActiveTab("capteur"); setShowGlycemiaModal(false); }} className="w-full rounded-[18px] bg-[#E9F6F3] text-white py-3 font-semibold border border-[#dde5e7]">Utiliser capteur</button>
            </div>
          </Modal>

          <Modal open={showMealModal} title="Ajouter un repas" onClose={() => setShowMealModal(false)}>
            <div className="space-y-3 max-h-[48vh] overflow-y-auto scrollbar-hide pr-1">
              <div>
                <div className="text-xs tracking-[0.18em] text-[#2c4443] font-semibold mb-2">REPAS</div>
                <div className="grid grid-cols-2 gap-2">
                  {["Petit-déjeuner", "Déjeuner", "Dîner", "Collation"].map((item) => (
                    <button key={item} onClick={() => setMealType(item)} className={`rounded-[14px] px-3 py-2 text-sm font-semibold transition-all duration-150 active:scale-[0.985] ${mealType === item ? "bg-[#1c8f84] text-white shadow-sm" : "bg-[#E9F6F3] text-[#5e7379] border border-[#dde5e7]"}`}>{item}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-[18px] bg-[#E9F6F3] border border-[#e4ebed] p-3">
                  <div className="text-sm text-[#72858b] mb-2">Heure</div>
                  <input value={mealTime} onChange={(event) => setMealTime(event.target.value)} className="w-full rounded-[14px] bg-[#f7fafb] border border-[#dde5e7] px-3 py-2.5 text-[#233636] outline-none" />
                </div>
                <div className="rounded-[18px] bg-[#E9F6F3] border border-[#e4ebed] p-3">
                  <div className="text-sm text-[#72858b] mb-2">Glucides</div>
                  <div className="flex items-end gap-2">
                    <input value={carbsInput} onChange={(event) => setCarbsInput(event.target.value)} className="w-full rounded-[14px] bg-[#f7fafb] border border-[#dde5e7] px-3 py-2.5 text-[#233636] outline-none" inputMode="numeric" />
                    <div className="text-xs text-[#81949a] pb-1">g</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[15, 30, 45, 60, 90].map((value) => (
                  <button key={value} onClick={() => setCarbsInput(String(value))} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-[0.97] ${carbsInput === String(value) ? "bg-[#1c8f84] text-white shadow-sm" : "bg-[#E9F6F3] text-[#4d6260]"}`}>{value} g</button>
                ))}
              </div>
              <div>
                <button onClick={() => setMealInsulinExpanded((value) => !value)} className="w-full rounded-[18px] bg-[#E9F6F3] border border-[#e4ebed] p-3 text-left">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs tracking-[0.18em] text-[#2c4443] font-semibold">INSULINE</div>
                      <div className="text-sm text-[#72858b] mt-1">Bolus associé au repas</div>
                    </div>
                    <div className={`text-[#81949a] text-sm transition-transform duration-200 ${mealInsulinExpanded ? "rotate-180" : ""}`}>▾</div>
                  </div>
                </button>
                {mealInsulinExpanded ? (
                  <div className="rounded-[18px] bg-[#E9F6F3] border border-[#e4ebed] p-3 mt-2">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="font-semibold text-[#233636]">Bolus associé</div>
                        <div className="text-sm text-[#72858b] mt-1">Ajouter la dose liée au repas</div>
                      </div>
                      <button onClick={() => setMealBolusEnabled((value) => !value)} className={`w-12 h-7 rounded-full transition relative ${mealBolusEnabled ? "bg-[#1c8f84]" : "bg-[#c9d2d1]"}`}>
                        <span className={`absolute top-1 w-5 h-5 rounded-full bg-[#E9F6F3] transition-all ${mealBolusEnabled ? "left-6" : "left-1"}`} />
                      </button>
                    </div>
                    {mealBolusEnabled ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-sm text-[#72858b] mb-2">Unités</div>
                          <input value={mealBolusUnits} onChange={(event) => setMealBolusUnits(event.target.value)} className="w-full rounded-[14px] bg-[#f7fafb] border border-[#dde5e7] px-3 py-2.5 text-[#233636] outline-none" inputMode="decimal" />
                        </div>
                        <div>
                          <div className="text-sm text-[#72858b] mb-2">Timing</div>
                          <div className="flex flex-col gap-2">
                            {["Avant repas", "Pendant repas", "Après repas"].map((item) => (
                              <button key={item} onClick={() => setMealBolusTiming(item)} className={`rounded-[12px] px-3 py-2 text-sm font-semibold text-left ${mealBolusTiming === item ? "bg-[#1c8f84] text-white" : "bg-[#f7fafb] text-[#233636] border border-[#dde5e7]"}`}>{item}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div>
                <div className="text-xs tracking-[0.18em] text-[#2c4443] font-semibold mb-2">GLYCÉMIE ASSOCIÉE</div>
                <div className="rounded-[18px] bg-[#E9F6F3] border border-[#e4ebed] p-3">
                  <div className="flex mb-3">
                    <button onClick={() => { setMealGlucoseMode("capteur"); setMealGlucoseValue(String(patient.lastReading)); }} className="w-full rounded-[14px] px-3 py-2.5 text-sm font-semibold bg-[#1c8f84] text-white">Utiliser capteur</button>
                  </div>
                  <div className="rounded-[14px] bg-[#f7fafb] border border-[#dde5e7] px-3 py-3">
                    <div className="text-sm text-[#72858b] mb-1">Valeur avant repas</div>
                    <div className="flex items-end gap-2">
                      <input value={mealGlucoseValue} onChange={(event) => setMealGlucoseValue(event.target.value)} className="w-full bg-transparent text-[24px] font-semibold text-[#233636] outline-none" inputMode="numeric" />
                      <div className="text-sm text-[#81949a] pb-1">mg/dL</div>
                    </div>
                    {mealGlucoseMode === "capteur" ? <div className="text-xs text-white mt-1.5">Dernière mesure capteur</div> : null}
                  </div>
                </div>
              </div>
              <div>
                <button onClick={() => setMealNotesExpanded((value) => !value)} className="w-full rounded-[18px] bg-[#E9F6F3] border border-[#e4ebed] p-3 text-left">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs tracking-[0.18em] text-[#2c4443] font-semibold">NOTES</div>
                      <div className="text-sm text-[#72858b] mt-1">Contexte clinique facultatif</div>
                    </div>
                    <div className={`text-[#81949a] text-sm transition-transform duration-200 ${mealNotesExpanded ? "rotate-180" : ""}`}>▾</div>
                  </div>
                </button>
                {mealNotesExpanded ? (
                  <div className="rounded-[18px] bg-[#E9F6F3] border border-[#e4ebed] p-3 mt-2">
                    <button onClick={() => setMealUnusual((value) => !value)} className={`mb-3 rounded-full px-3 py-1.5 text-xs font-semibold ${mealUnusual ? "bg-[#1c8f84] text-white" : "bg-[#f7fafb] text-[#4d6260] border border-[#dde5e7]"}`}>{mealUnusual ? "Repas inhabituel" : "Marquer comme inhabituel"}</button>
                    <textarea value={mealNote} onChange={(event) => setMealNote(event.target.value)} className="w-full min-h-[72px] rounded-[14px] bg-[#f7fafb] border border-[#dde5e7] px-3 py-2.5 text-[#233636] outline-none resize-none" placeholder="Notes cliniques ou contexte du repas" />
                  </div>
                ) : null}
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowMealModal(false)} className="flex-1 rounded-[16px] bg-[#E9F6F3] text-white py-2.5 font-semibold border border-[#dde5e7]">Annuler</button>
                <button onClick={() => setShowMealModal(false)} className="flex-1 rounded-[16px] bg-[#1c8f84] text-white py-2.5 font-semibold">Enregistrer</button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}
