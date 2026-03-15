import { useEffect, useState } from "react";
import { BarChart3, Home, Settings } from "lucide-react";

import Toast from "../components/atoms/Toast";
import BottomNavigation from "../components/organisms/app-shell/BottomNavigation";
import PhoneFrame from "../components/organisms/app-shell/PhoneFrame";
import RoleSwitcher from "../components/organisms/app-shell/RoleSwitcher";
import { GlycemiaModalForm, MealModalForm, SensorChoiceModal } from "../components/organisms/forms/Modals";
import { ClinicianCockpitTemplate, ClinicianNotesTemplate, ClinicianPatientViewTemplate, ClinicianPatientsTemplate } from "../components/templates/clinician/ClinicianTemplates";
import {
  PatientDashboardTemplate,
  PatientExchangesTemplate,
  PatientMeasuresTemplate,
  PatientNotesTemplate,
  PatientProfileTemplate,
  PatientSensorTemplate,
} from "../components/templates/patient/PatientTemplates";
import {
  availableCaregivers,
  clinicianPatients,
  clinicianProfile,
  clinicianThreads,
  deviceConnections,
  documents,
  getFicheByPatientId,
  glucoseSeriesByPeriod,
  carnetEntries,
  historyRows,
  patient,
  patientThreads,
  therapyNotes,
} from "../features/diabetcare/data/mockData";
import { useClinicalMockupState } from "../features/diabetcare/hooks/useClinicalMockupState";
import { useMeasureChart } from "../features/diabetcare/hooks/useMeasureChart";
import type { Caregiver, ClinicianTab, ConversationThread, DiabeticPatientFiche, NavItem, PatientTab } from "../features/diabetcare/types";

/**
 * Page maquette DiabetCare : un seul écran avec bascule patient / clinicien, navigation par onglets,
 * modales (glycémie, repas, choix capteur) et toasts. Les données sont dérivées des mocks + état local (threads, profil, fiche).
 */
export default function DiabetCareClinicalMockupPage() {
  const state = useClinicalMockupState();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [patientThreadsState, setPatientThreadsState] = useState<ConversationThread[]>(patientThreads);
  const [patientState, setPatientState] = useState(patient);
  const [patientFicheState, setPatientFicheState] = useState<DiabeticPatientFiche | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 2500);
    return () => clearTimeout(t);
  }, [toastMessage]);

  // Données dérivées : config graphique selon période, documents filtrés par source, threads triés (non lus en premier), thread/document/patient sélectionnés.
  const currentMeasureConfig = glucoseSeriesByPeriod[state.activeMeasurePeriod];
  const chart = useMeasureChart(currentMeasureConfig.data);
  const visibleHistoryRows = state.historyExpanded ? historyRows : historyRows.slice(0, 1);
  const providerDocuments = documents.filter((item) => item.source === "soignant");
  const patientDocuments = documents.filter((item) => item.source === "patient");
  const threads = state.role === "patient" ? patientThreadsState : clinicianThreads;
  const sortedThreads = [...threads].sort((a, b) => (b.unread !== a.unread ? b.unread - a.unread : a.name.localeCompare(b.name)));
  const visibleThreads = state.messagesCardExpanded ? sortedThreads : sortedThreads.slice(0, 3);
  const selectedThread = threads.find((item) => item.id === state.selectedThreadId) ?? threads[0];

  /** Crée un thread vide si le soignant n’a pas encore de conversation, puis ouvre le thread. */
  const startNewConversation = (caregiver: Caregiver) => {
    const existing = patientThreadsState.find((t) => t.id === caregiver.id);
    if (existing) {
      state.setSelectedThreadId(caregiver.id);
      state.setMessageViewMode("thread");
      return;
    }
    const newThread: ConversationThread = {
      id: caregiver.id,
      name: caregiver.name,
      initials: caregiver.initials,
      preview: "Nouvelle conversation",
      time: "Maintenant",
      unread: 0,
      messages: [],
    };
    setPatientThreadsState((prev) => [...prev, newThread]);
    state.setSelectedThreadId(caregiver.id);
    state.setMessageViewMode("thread");
  };
  const selectedDocument = documents.find((item) => item.id === state.selectedDocumentId) ?? documents[0];
  const selectedClinicalPatient = clinicianPatients.find((item) => item.id === state.selectedClinicalPatientId) ?? clinicianPatients[0];

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

  /** Bascule patient ↔ clinicien et réinitialise onglet, échanges, compte et vue messages. */
  const switchRole = (nextRole: "patient" | "clinician") => {
    state.setRole(nextRole);
    state.setActiveTab(nextRole === "patient" ? "accueil" : "cockpit");
    state.setActiveExchangeTab("messages");
    state.setActiveAccountTab("profil");
    state.setSelectedThreadId(nextRole === "patient" ? patientThreadsState[0]?.id ?? "dr-martin" : clinicianThreads[0].id);
    state.setMessageViewMode("list");
    state.setDocumentViewMode("list");
  };

  const openProfile = () => {
    state.setActiveTab(state.role === "patient" ? "profil" : "patients");
    if (state.role === "patient") state.setActiveAccountTab("profil");
  };

  const openPatientPriorityThread = (threadId: string) => {
    state.setActiveTab("echanges");
    state.setActiveExchangeTab("messages");
    state.setSelectedThreadId(threadId);
    state.setMessageViewMode("thread");
  };

  const openPatientMessagesList = () => {
    state.setActiveTab("echanges");
    state.setActiveExchangeTab("messages");
    state.setMessageViewMode("list");
  };

  const goToClinicianTab = (tab: "mesures" | "messages" | "docs" | "notes") => {
    state.setActiveTab(tab);
  };

  const selectClinicianPatient = (id: string) => {
    state.setSelectedClinicalPatientId(id);
    state.setActiveTab("patient_view");
  };

  /** Affiche le template correspondant au rôle et à l’onglet actif (patient : accueil, capteur, mesures, échanges, profil ; clinicien : cockpit, patients, fiche, etc.). */
  const renderActiveScreen = () => {
    if (state.role === "patient") {
      switch (state.activeTab) {
        case "accueil":
          return (
            <PatientDashboardTemplate
              role={state.role}
              patient={patientState}
              clinicianInitials={clinicianProfile.initials}
              patientThreads={patientThreads}
              onOpenMealModal={() => state.setShowMealModal(true)}
              onOpenPriorityThread={openPatientPriorityThread}
              onOpenMessagesList={openPatientMessagesList}
              onProfileClick={openProfile}
            />
          );
        case "capteur":
          // openSensorParamsOnCapteurTab = true lorsque l’utilisateur vient de Compte > Paramètres > Paramètres du capteur.
          return (
            <PatientSensorTemplate
              role={state.role}
              patient={patientState}
              clinicianInitials={clinicianProfile.initials}
              deviceConnections={deviceConnections}
              onOpenProfile={() => state.setActiveTab("profil")}
              onProfileClick={openProfile}
              initialShowSensorParams={state.openSensorParamsOnCapteurTab}
            />
          );
        case "mesures":
          return (
            <PatientMeasuresTemplate
              role={state.role}
              patient={patientState}
              clinicianInitials={clinicianProfile.initials}
              selectedClinicalPatient={selectedClinicalPatient}
              activeFollowUpView={state.activeFollowUpView}
              setActiveFollowUpView={state.setActiveFollowUpView}
              activeMeasurePeriod={state.activeMeasurePeriod}
              setActiveMeasurePeriod={state.setActiveMeasurePeriod}
              chart={chart}
              currentMeasureConfig={currentMeasureConfig}
              visibleHistoryRows={visibleHistoryRows}
              historyExpanded={state.historyExpanded}
              setHistoryExpanded={state.setHistoryExpanded}
              carnetEntries={carnetEntries}
              onOpenMealModal={() => state.setShowMealModal(true)}
              onProfileClick={openProfile}
            />
          );
        case "echanges":
          return (
            <PatientExchangesTemplate
              role={state.role}
              patient={patientState}
              clinicianInitials={clinicianProfile.initials}
              selectedClinicalPatient={selectedClinicalPatient}
              activeExchangeTab={state.activeExchangeTab}
              setActiveExchangeTab={state.setActiveExchangeTab}
              messageViewMode={state.messageViewMode}
              setMessageViewMode={state.setMessageViewMode}
              selectedThread={selectedThread}
              selectedThreadId={state.selectedThreadId}
              setSelectedThreadId={state.setSelectedThreadId}
              visibleThreads={visibleThreads}
              messagesCardExpanded={state.messagesCardExpanded}
              setMessagesCardExpanded={state.setMessagesCardExpanded}
              providerDocuments={providerDocuments}
              patientDocuments={patientDocuments}
              selectedDocument={selectedDocument}
              documentViewMode={state.documentViewMode}
              setDocumentViewMode={state.setDocumentViewMode}
              setSelectedDocumentId={state.setSelectedDocumentId}
              availableCaregivers={availableCaregivers}
              onStartNewConversation={startNewConversation}
              onProfileClick={openProfile}
            />
          );
        case "profil":
          return (
            <PatientProfileTemplate
              role={state.role}
              patient={patientState}
              clinicianInitials={clinicianProfile.initials}
              activeAccountTab={state.activeAccountTab}
              setActiveAccountTab={state.setActiveAccountTab}
              onProfileClick={openProfile}
              onEditProfile={() => {}}
              onSaveProfile={(data) => setPatientState((prev) => ({ ...prev, ...data }))}
              onSaveFiche={(data) => setPatientFicheState((prev) => ({ ...(prev ?? getFicheByPatientId(patientState.id)!), ...data } as DiabeticPatientFiche))}
              patientFiche={patientFicheState ?? getFicheByPatientId(patientState.id)}
              // Paramètres : Paramètres du capteur → onglet Capteur + params ; Documents partagés → Échanges > Documents ; Déconnexion → rôle soignant + Cockpit.
              onOpenSensorParams={() => {
                state.setActiveTab("capteur");
                state.setOpenSensorParamsOnCapteurTab(true);
              }}
              onOpenNotifications={() => setToastMessage("Notifications — Bientôt disponible")}
              onOpenSyncHistory={() => setToastMessage("Historique de synchronisation — Bientôt disponible")}
              onOpenSharedDocuments={() => {
                state.setActiveTab("echanges");
                state.setActiveExchangeTab("documents");
              }}
              onOpenAccountSecurity={() => setToastMessage("Sécurité du compte — Bientôt disponible")}
              onLogout={() => {
                setToastMessage("Déconnexion");
                state.setRole("clinician");
                state.setActiveTab("cockpit");
              }}
            />
          );
        default:
          return null;
      }
    }

    switch (state.activeTab) {
      case "cockpit":
        return (
          <ClinicianCockpitTemplate
            patient={patient}
            clinicianInitials={clinicianProfile.initials}
            clinicianPatients={clinicianPatients}
            onSelectPatient={selectClinicianPatient}
            onPatientsClick={() => state.setActiveTab("patients")}
            onProfileClick={openProfile}
          />
        );
      case "patients":
        return (
          <ClinicianPatientsTemplate
            patient={patient}
            clinicianInitials={clinicianProfile.initials}
            clinicianPatients={clinicianPatients}
            selectedClinicalPatientId={state.selectedClinicalPatientId}
            onSelectPatient={selectClinicianPatient}
            onPatientsClick={() => state.setActiveTab("patients")}
            onProfileClick={openProfile}
          />
        );
      case "patient_view":
        return (
          <ClinicianPatientViewTemplate
            patient={patient}
            clinicianInitials={clinicianProfile.initials}
            selectedClinicalPatient={selectedClinicalPatient}
            patientFiche={getFicheByPatientId(selectedClinicalPatient.id)}
            onGoToTab={goToClinicianTab}
            onPatientsClick={() => state.setActiveTab("patients")}
            onProfileClick={openProfile}
          />
        );
      case "mesures":
        return (
          <PatientMeasuresTemplate
            role={state.role}
            patient={patient}
            clinicianInitials={clinicianProfile.initials}
            selectedClinicalPatient={selectedClinicalPatient}
            activeFollowUpView={state.activeFollowUpView}
            setActiveFollowUpView={state.setActiveFollowUpView}
            activeMeasurePeriod={state.activeMeasurePeriod}
            setActiveMeasurePeriod={state.setActiveMeasurePeriod}
            chart={chart}
            currentMeasureConfig={currentMeasureConfig}
            visibleHistoryRows={visibleHistoryRows}
            historyExpanded={state.historyExpanded}
            setHistoryExpanded={state.setHistoryExpanded}
            carnetEntries={carnetEntries}
            onOpenMealModal={() => state.setShowMealModal(true)}
            onProfileClick={() => state.setActiveTab("patients")}
          />
        );
      case "messages":
        return (
          <PatientExchangesTemplate
            role={state.role}
            patient={patient}
            clinicianInitials={clinicianProfile.initials}
            selectedClinicalPatient={selectedClinicalPatient}
            activeExchangeTab="messages"
            setActiveExchangeTab={state.setActiveExchangeTab}
            messageViewMode={state.messageViewMode}
            setMessageViewMode={state.setMessageViewMode}
            selectedThread={selectedThread}
            selectedThreadId={state.selectedThreadId}
            setSelectedThreadId={state.setSelectedThreadId}
            visibleThreads={visibleThreads}
            messagesCardExpanded={state.messagesCardExpanded}
            setMessagesCardExpanded={state.setMessagesCardExpanded}
            providerDocuments={providerDocuments}
            patientDocuments={patientDocuments}
            selectedDocument={selectedDocument}
            documentViewMode={state.documentViewMode}
            setDocumentViewMode={state.setDocumentViewMode}
            setSelectedDocumentId={state.setSelectedDocumentId}
            onProfileClick={() => state.setActiveTab("patients")}
          />
        );
      case "docs":
        return (
          <PatientExchangesTemplate
            role={state.role}
            patient={patient}
            clinicianInitials={clinicianProfile.initials}
            selectedClinicalPatient={selectedClinicalPatient}
            activeExchangeTab="documents"
            setActiveExchangeTab={state.setActiveExchangeTab}
            messageViewMode={state.messageViewMode}
            setMessageViewMode={state.setMessageViewMode}
            selectedThread={selectedThread}
            selectedThreadId={state.selectedThreadId}
            setSelectedThreadId={state.setSelectedThreadId}
            visibleThreads={visibleThreads}
            messagesCardExpanded={state.messagesCardExpanded}
            setMessagesCardExpanded={state.setMessagesCardExpanded}
            providerDocuments={providerDocuments}
            patientDocuments={patientDocuments}
            selectedDocument={selectedDocument}
            documentViewMode={state.documentViewMode}
            setDocumentViewMode={state.setDocumentViewMode}
            setSelectedDocumentId={state.setSelectedDocumentId}
            onProfileClick={() => state.setActiveTab("patients")}
          />
        );
      case "notes":
        return (
          <ClinicianNotesTemplate
            patient={patient}
            clinicianInitials={clinicianProfile.initials}
            notes={therapyNotes}
            selectedNoteId={state.selectedNoteId}
            setSelectedNoteId={state.setSelectedNoteId}
            onPatientsClick={() => state.setActiveTab("patients")}
            onProfileClick={openProfile}
          />
        );
      default:
        return null;
    }
  };

  const isInThread = (state.role === "patient" && state.activeTab === "echanges" && state.activeExchangeTab === "messages" && state.messageViewMode === "thread")
    || (state.role === "clinician" && state.activeTab === "messages" && state.messageViewMode === "thread");

  return (
    <PhoneFrame
      roleSwitcher={<RoleSwitcher role={state.role} onSwitchRole={switchRole} />}
      fullscreen={isInThread}
      bottomNavigation={!isInThread ? (
        state.role === "patient" ? (
          // En quittant l’onglet Capteur, on réinitialise openSensorParamsOnCapteurTab pour ne pas rouvrir les paramètres au prochain passage.
          <BottomNavigation items={patientNavItems} activeKey={state.activeTab as PatientTab} onChange={(tab) => { state.setActiveTab(tab); if (tab !== "capteur") state.setOpenSensorParamsOnCapteurTab(false); }} />
        ) : (
          <BottomNavigation items={clinicianNavItems} activeKey={state.activeTab as ClinicianTab} onChange={state.setActiveTab} />
        )
      ) : null}
      modals={
        <>
          <GlycemiaModalForm
            open={state.showGlycemiaModal}
            glycemiaInput={state.glycemiaInput}
            setGlycemiaInput={state.setGlycemiaInput}
            onClose={() => state.setShowGlycemiaModal(false)}
            onManualSave={() => {
              setToastMessage("Glycémie enregistrée");
              state.setActiveTab("mesures");
              state.setShowGlycemiaModal(false);
            }}
            onUseSensor={() => {
              state.setActiveTab("capteur");
              state.setShowGlycemiaModal(false);
            }}
          />
          <MealModalForm
            open={state.showMealModal}
            patient={patient}
            mealType={state.mealType}
            setMealType={state.setMealType}
            mealTime={state.mealTime}
            setMealTime={state.setMealTime}
            carbsInput={state.carbsInput}
            setCarbsInput={state.setCarbsInput}
            mealBolusEnabled={state.mealBolusEnabled}
            setMealBolusEnabled={state.setMealBolusEnabled}
            mealBolusUnits={state.mealBolusUnits}
            setMealBolusUnits={state.setMealBolusUnits}
            mealBolusTiming={state.mealBolusTiming}
            setMealBolusTiming={state.setMealBolusTiming}
            mealGlucoseMode={state.mealGlucoseMode}
            setMealGlucoseMode={state.setMealGlucoseMode}
            mealGlucoseValue={state.mealGlucoseValue}
            setMealGlucoseValue={state.setMealGlucoseValue}
            mealNote={state.mealNote}
            setMealNote={state.setMealNote}
            mealUnusual={state.mealUnusual}
            setMealUnusual={state.setMealUnusual}
            mealInsulinExpanded={state.mealInsulinExpanded}
            setMealInsulinExpanded={state.setMealInsulinExpanded}
            mealNotesExpanded={state.mealNotesExpanded}
            setMealNotesExpanded={state.setMealNotesExpanded}
            onClose={() => state.setShowMealModal(false)}
            onSave={() => {
              setToastMessage("Repas enregistré");
              state.setShowMealModal(false);
            }}
            onOpenSensorChoice={() => state.setShowSensorChoiceModal(true)}
          />
          <SensorChoiceModal open={state.showSensorChoiceModal} onClose={() => state.setShowSensorChoiceModal(false)} />
        </>
      }
    >
      {renderActiveScreen()}
      {toastMessage ? <Toast message={toastMessage} variant="success" /> : null}
    </PhoneFrame>
  );
}
