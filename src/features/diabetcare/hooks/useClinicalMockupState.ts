import { useState } from "react";

import type { AccountTab, AnyTab, ExchangeTab, FollowUpView, MeasurePeriod, Role } from "../types";

export function useClinicalMockupState() {
  const [role, setRole] = useState<Role>("patient");
  const [activeTab, setActiveTab] = useState<AnyTab>("accueil");
  const [activeExchangeTab, setActiveExchangeTab] = useState<ExchangeTab>("messages");
  const [activeAccountTab, setActiveAccountTab] = useState<AccountTab>("profil");
  const [messageViewMode, setMessageViewMode] = useState<"list" | "thread">("list");
  const [documentViewMode, setDocumentViewMode] = useState<"list" | "detail">("list");
  const [messagesCardExpanded, setMessagesCardExpanded] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState("dr-martin");
  const [selectedDocumentId, setSelectedDocumentId] = useState("ordonnance-mars");
  const [selectedNoteId, setSelectedNoteId] = useState("note-1");
  const [selectedClinicalPatientId, setSelectedClinicalPatientId] = useState("PAT-001");
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
