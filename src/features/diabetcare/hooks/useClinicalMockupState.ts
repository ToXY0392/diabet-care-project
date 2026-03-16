import { useEffect, useState } from "react";

import type { AccountTab, AnyTab, ExchangeTab, FollowUpView, MeasurePeriod, Role } from "../types";

const STORAGE_KEY = "diabetcare-mockup-session";

const PATIENT_TABS: AnyTab[] = ["accueil", "capteur", "mesures", "echanges", "profil"];
const CLINICIAN_TABS: AnyTab[] = ["cockpit", "documents", "patients", "patient_view", "echanges", "mesures", "notes", "compte"];

function parseStoredSession(raw: string | null): { role: Role; activeTab: AnyTab } | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as unknown;
    if (data && typeof data === "object" && "role" in data && "activeTab" in data) {
      const role = data.role === "clinician" ? "clinician" : "patient";
      const tab = typeof data.activeTab === "string" ? data.activeTab : null;
      const validTab = role === "clinician"
        ? (CLINICIAN_TABS.includes(tab as AnyTab) ? tab : "cockpit")
        : (PATIENT_TABS.includes(tab as AnyTab) ? tab : "accueil");
      return { role, activeTab: validTab as AnyTab };
    }
  } catch {
    // ignore
  }
  return null;
}

function loadSession(): { role: Role; activeTab: AnyTab } | null {
  const fromLocal = parseStoredSession(typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null);
  if (fromLocal) return fromLocal;
  const fromSession = parseStoredSession(typeof sessionStorage !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null);
  return fromSession;
}

function saveSession(role: Role, activeTab: AnyTab) {
  const payload = JSON.stringify({ role, activeTab });
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, payload);
    if (typeof sessionStorage !== "undefined") sessionStorage.setItem(STORAGE_KEY, payload);
  } catch {
    // ignore
  }
}

/**
 * État global de la maquette single-page : rôle (patient/clinicien), onglet actif, sous-onglets (Échanges, Compte),
 * modales (glycémie, repas, choix capteur), sélections (thread, document, patient clinique) et données de formulaire.
 * Le rôle et l’onglet actif sont persistés (localStorage + sessionStorage) pour ne pas perdre la « connexion » au rechargement.
 */
export function useClinicalMockupState() {
  const [role, setRoleState] = useState<Role>(() => loadSession()?.role ?? "patient");
  const [activeTab, setActiveTabState] = useState<AnyTab>(() => loadSession()?.activeTab ?? "accueil");

  useEffect(() => {
    saveSession(role, activeTab);
  }, [role, activeTab]);

  const setRole = (next: Role) => {
    const tab = next === "patient" ? "accueil" : "cockpit";
    setRoleState(next);
    setActiveTabState(tab);
    saveSession(next, tab);
  };
  const setActiveTab = (tab: AnyTab) => setActiveTabState(tab);
  const [activeExchangeTab, setActiveExchangeTab] = useState<ExchangeTab>("messages");
  const [activeAccountTab, setActiveAccountTab] = useState<AccountTab>("profil");
  const [messageViewMode, setMessageViewMode] = useState<"list" | "thread">("list");
  const [documentViewMode, setDocumentViewMode] = useState<"list" | "detail">("list");
  const [messagesCardExpanded, setMessagesCardExpanded] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [selectedClinicalPatientId, setSelectedClinicalPatientId] = useState("");
  const [showGlycemiaModal, setShowGlycemiaModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [showSensorChoiceModal, setShowSensorChoiceModal] = useState(false);
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
  /** Si true, l’onglet Capteur s’ouvre directement sur la vue Paramètres du capteur (depuis Compte > Paramètres). Réinitialisé en quittant l’onglet Capteur. */
  const [openSensorParamsOnCapteurTab, setOpenSensorParamsOnCapteurTab] = useState(false);

  return {
    role,
    setRole,
    activeTab,
    setActiveTab,
    activeExchangeTab,
    setActiveExchangeTab,
    activeAccountTab,
    setActiveAccountTab,
    messageViewMode,
    setMessageViewMode,
    documentViewMode,
    setDocumentViewMode,
    messagesCardExpanded,
    setMessagesCardExpanded,
    selectedThreadId,
    setSelectedThreadId,
    selectedDocumentId,
    setSelectedDocumentId,
    selectedNoteId,
    setSelectedNoteId,
    selectedClinicalPatientId,
    setSelectedClinicalPatientId,
    showGlycemiaModal,
    setShowGlycemiaModal,
    showMealModal,
    setShowMealModal,
    showSensorChoiceModal,
    setShowSensorChoiceModal,
    glycemiaInput,
    setGlycemiaInput,
    mealType,
    setMealType,
    mealTime,
    setMealTime,
    carbsInput,
    setCarbsInput,
    mealBolusEnabled,
    setMealBolusEnabled,
    mealBolusUnits,
    setMealBolusUnits,
    mealBolusTiming,
    setMealBolusTiming,
    mealGlucoseMode,
    setMealGlucoseMode,
    mealGlucoseValue,
    setMealGlucoseValue,
    mealNote,
    setMealNote,
    mealUnusual,
    setMealUnusual,
    mealInsulinExpanded,
    setMealInsulinExpanded,
    mealNotesExpanded,
    setMealNotesExpanded,
    activeMeasurePeriod,
    setActiveMeasurePeriod,
    activeFollowUpView,
    setActiveFollowUpView,
    historyExpanded,
    setHistoryExpanded,
    openSensorParamsOnCapteurTab,
    setOpenSensorParamsOnCapteurTab,
  };
}
