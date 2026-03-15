import { useState } from "react";

import PhoneFrame from "../components/organisms/app-shell/PhoneFrame";
import RoleSwitcher from "../components/organisms/app-shell/RoleSwitcher";
import BottomNavigation from "../components/organisms/app-shell/BottomNavigation";
import { GlycemiaModalForm, MealModalForm, SensorChoiceModal } from "../components/organisms/forms/Modals";
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
  deviceConnections,
  documents,
  glucoseSeriesByPeriod,
  carnetEntries,
  historyRows,
  patient,
  patientThreads,
  therapyNotes,
} from "../features/diabetcare/data/mockData";
import { useMeasureChart } from "../features/diabetcare/hooks/useMeasureChart";
import type { AccountTab, Caregiver, ConversationThread, ExchangeTab, FollowUpView, MeasurePeriod, PatientTab } from "../features/diabetcare/types";

export default function PatientShowcasePage() {
  const [activeMeasurePeriod, setActiveMeasurePeriod] = useState<MeasurePeriod>("7j");
  const [activeFollowUpView, setActiveFollowUpView] = useState<FollowUpView>("jour");
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [activeAccountTab, setActiveAccountTab] = useState<AccountTab>("profil");
  const [activeExchangeTab, setActiveExchangeTab] = useState<ExchangeTab>("messages");
  const [messageViewMode, setMessageViewMode] = useState<"list" | "thread">("list");
  const [documentViewMode, setDocumentViewMode] = useState<"list" | "detail">("list");
  const [selectedThreadId, setSelectedThreadId] = useState<string>(patientThreads[0]?.id ?? "");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>(documents[0]?.id ?? "");
  const [messagesCardExpanded, setMessagesCardExpanded] = useState(false);
  const [patientThreadsState, setPatientThreadsState] = useState<ConversationThread[]>(patientThreads);

  const currentMeasureConfig = glucoseSeriesByPeriod[activeMeasurePeriod];
  const chart = useMeasureChart(currentMeasureConfig.data);
  const visibleHistoryRows = historyExpanded ? historyRows : historyRows.slice(0, 1);

  const selectedClinicalPatient = clinicianPatients[0];
  const threads = patientThreadsState;
  const selectedThread = threads.find((thread) => thread.id === selectedThreadId) ?? threads[0];
  const sortedThreads = [...threads].sort((a, b) => (b.unread !== a.unread ? b.unread - a.unread : a.name.localeCompare(b.name)));
  const visibleThreads = messagesCardExpanded ? sortedThreads : sortedThreads.slice(0, 3);

  const startNewConversation = (caregiver: Caregiver) => {
    if (threads.some((t) => t.id === caregiver.id)) {
      setSelectedThreadId(caregiver.id);
      setMessageViewMode("thread");
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
    setSelectedThreadId(caregiver.id);
    setMessageViewMode("thread");
  };
  const selectedDocument = documents.find((item) => item.id === selectedDocumentId) ?? documents[0];
  const providerDocuments = documents.filter((item) => item.source === "soignant");
  const patientDocuments = documents.filter((item) => item.source === "patient");

  const [mealModalOpen, setMealModalOpen] = useState(true);
  const [glycemiaModalOpen, setGlycemiaModalOpen] = useState(false);
  const [sensorChoiceOpen, setSensorChoiceOpen] = useState(false);

  const [mealType, setMealType] = useState<string>("Déjeuner");
  const [mealTime, setMealTime] = useState<string>("12:30");
  const [carbsInput, setCarbsInput] = useState<string>("45");
  const [mealBolusEnabled, setMealBolusEnabled] = useState<boolean>(true);
  const [mealBolusUnits, setMealBolusUnits] = useState<string>("5");
  const [mealBolusTiming, setMealBolusTiming] = useState<string>("Avant repas");
  const [mealGlucoseMode, setMealGlucoseMode] = useState<"capteur">("capteur");
  const [mealGlucoseValue, setMealGlucoseValue] = useState<string>(String(patient.lastReading));
  const [mealNote, setMealNote] = useState<string>("");
  const [mealUnusual, setMealUnusual] = useState<boolean>(false);
  const [mealInsulinExpanded, setMealInsulinExpanded] = useState<boolean>(true);
  const [mealNotesExpanded, setMealNotesExpanded] = useState<boolean>(false);

  const [glycemiaInput, setGlycemiaInput] = useState<string>(String(patient.lastReading));

  const patientNavItems: Array<{ key: PatientTab; label: React.ReactNode; variant?: "filledIcon" | "plainIcon" | "text" }> = [
    { key: "accueil", label: "Accueil", variant: "text" },
    { key: "capteur", label: "Capteur", variant: "text" },
    { key: "mesures", label: "Mesures", variant: "text" },
    { key: "echanges", label: "Échanges", variant: "text" },
    { key: "profil", label: "Profil", variant: "text" },
  ];

  const roleSwitcher = <RoleSwitcher role="patient" onSwitchRole={() => {}} />;
  const bottomNavigation = <BottomNavigation items={patientNavItems} activeKey="accueil" onChange={() => {}} />;

  const clinicianInitials = clinicianProfile.initials;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-2">Patient – Showcase</h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">Aperçu simultané des principaux écrans patient et du modal « Ajouter un repas ».</p>

      <div className="grid gap-8 lg:grid-cols-2">
        <PhoneFrame roleSwitcher={roleSwitcher} bottomNavigation={bottomNavigation}>
          <PatientDashboardTemplate
            role="patient"
            patient={patient}
            clinicianInitials={clinicianInitials}
            patientThreads={patientThreads}
            onOpenMealModal={() => setMealModalOpen(true)}
            onOpenPriorityThread={() => {}}
            onOpenMessagesList={() => {}}
            onProfileClick={() => {}}
          />
        </PhoneFrame>

        <PhoneFrame roleSwitcher={roleSwitcher} bottomNavigation={bottomNavigation}>
          <PatientSensorTemplate
            role="patient"
            patient={patient}
            clinicianInitials={clinicianInitials}
            deviceConnections={deviceConnections}
            onOpenProfile={() => {}}
            onProfileClick={() => {}}
          />
        </PhoneFrame>

        <PhoneFrame roleSwitcher={roleSwitcher} bottomNavigation={bottomNavigation} modals={null}>
          <PatientMeasuresTemplate
            role="patient"
            patient={patient}
            clinicianInitials={clinicianInitials}
            selectedClinicalPatient={selectedClinicalPatient}
            activeFollowUpView={activeFollowUpView}
            setActiveFollowUpView={setActiveFollowUpView}
            activeMeasurePeriod={activeMeasurePeriod}
            setActiveMeasurePeriod={setActiveMeasurePeriod}
            chart={chart}
            currentMeasureConfig={currentMeasureConfig}
            visibleHistoryRows={visibleHistoryRows}
            historyExpanded={historyExpanded}
            setHistoryExpanded={setHistoryExpanded}
            carnetEntries={carnetEntries}
            onOpenMealModal={() => setMealModalOpen(true)}
            onProfileClick={() => {}}
          />
        </PhoneFrame>

        <PhoneFrame roleSwitcher={roleSwitcher} bottomNavigation={bottomNavigation}>
          <PatientExchangesTemplate
            role="patient"
            patient={patient}
            clinicianInitials={clinicianInitials}
            selectedClinicalPatient={selectedClinicalPatient}
            activeExchangeTab={activeExchangeTab}
            setActiveExchangeTab={setActiveExchangeTab}
            messageViewMode={messageViewMode}
            setMessageViewMode={setMessageViewMode}
            selectedThread={selectedThread}
            selectedThreadId={selectedThreadId}
            setSelectedThreadId={setSelectedThreadId}
            visibleThreads={visibleThreads}
            messagesCardExpanded={messagesCardExpanded}
            setMessagesCardExpanded={setMessagesCardExpanded}
            providerDocuments={providerDocuments}
            patientDocuments={patientDocuments}
            selectedDocument={selectedDocument}
            documentViewMode={documentViewMode}
            setDocumentViewMode={setDocumentViewMode}
            setSelectedDocumentId={setSelectedDocumentId}
            availableCaregivers={availableCaregivers}
            onStartNewConversation={startNewConversation}
            onProfileClick={() => {}}
          />
        </PhoneFrame>

        <PhoneFrame roleSwitcher={roleSwitcher} bottomNavigation={bottomNavigation}>
          <PatientProfileTemplate
            role="patient"
            patient={patient}
            clinicianInitials={clinicianInitials}
            activeAccountTab={activeAccountTab}
            setActiveAccountTab={setActiveAccountTab}
            onProfileClick={() => {}}
            onEditProfile={() => {}}
          />
        </PhoneFrame>

        <PhoneFrame roleSwitcher={roleSwitcher} bottomNavigation={bottomNavigation}>
          <PatientNotesTemplate role="patient" patient={patient} clinicianInitials={clinicianInitials} notes={therapyNotes} onProfileClick={() => {}} />
        </PhoneFrame>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Modal « Ajouter un repas »</h2>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1">
            <PhoneFrame roleSwitcher={roleSwitcher} bottomNavigation={bottomNavigation} modals={null}>
              <PatientMeasuresTemplate
                role="patient"
                patient={patient}
                clinicianInitials={clinicianInitials}
                selectedClinicalPatient={selectedClinicalPatient}
                activeFollowUpView="jour"
                setActiveFollowUpView={setActiveFollowUpView}
                activeMeasurePeriod={activeMeasurePeriod}
                setActiveMeasurePeriod={setActiveMeasurePeriod}
                chart={chart}
                currentMeasureConfig={currentMeasureConfig}
                visibleHistoryRows={visibleHistoryRows}
                historyExpanded={historyExpanded}
                setHistoryExpanded={setHistoryExpanded}
                carnetEntries={carnetEntries}
                onOpenMealModal={() => setMealModalOpen(true)}
                onProfileClick={() => {}}
              />
            </PhoneFrame>
          </div>
          <div className="flex-1">
            <PhoneFrame roleSwitcher={roleSwitcher} bottomNavigation={bottomNavigation} modals={null}>
              <div className="flex-1 min-h-0" />
              <GlycemiaModalForm
                open={glycemiaModalOpen}
                glycemiaInput={glycemiaInput}
                setGlycemiaInput={setGlycemiaInput}
                onClose={() => setGlycemiaModalOpen(false)}
                onManualSave={() => {}}
                onUseSensor={() => {
                  setGlycemiaInput(String(patient.lastReading));
                  setSensorChoiceOpen(true);
                }}
              />
              <MealModalForm
                open={mealModalOpen}
                patient={patient}
                mealType={mealType}
                setMealType={setMealType}
                mealTime={mealTime}
                setMealTime={setMealTime}
                carbsInput={carbsInput}
                setCarbsInput={setCarbsInput}
                mealBolusEnabled={mealBolusEnabled}
                setMealBolusEnabled={setMealBolusEnabled}
                mealBolusUnits={mealBolusUnits}
                setMealBolusUnits={setMealBolusUnits}
                mealBolusTiming={mealBolusTiming}
                setMealBolusTiming={setMealBolusTiming}
                mealGlucoseMode={mealGlucoseMode}
                setMealGlucoseMode={setMealGlucoseMode}
                mealGlucoseValue={mealGlucoseValue}
                setMealGlucoseValue={setMealGlucoseValue}
                mealNote={mealNote}
                setMealNote={setMealNote}
                mealUnusual={mealUnusual}
                setMealUnusual={setMealUnusual}
                mealInsulinExpanded={mealInsulinExpanded}
                setMealInsulinExpanded={setMealInsulinExpanded}
                mealNotesExpanded={mealNotesExpanded}
                setMealNotesExpanded={setMealNotesExpanded}
                onClose={() => setMealModalOpen(false)}
                onSave={() => setMealModalOpen(false)}
                onOpenSensorChoice={() => setSensorChoiceOpen(true)}
              />
              <SensorChoiceModal open={sensorChoiceOpen} onClose={() => setSensorChoiceOpen(false)} />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </div>
  );
}

