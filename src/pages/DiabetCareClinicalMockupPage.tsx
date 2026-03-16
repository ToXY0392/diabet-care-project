import { useEffect, useRef, useState } from "react";
import { BarChart3, Home, Settings } from "lucide-react";

import Toast from "../components/atoms/Toast";
import BottomNavigation from "../components/organisms/app-shell/BottomNavigation";
import ClinicianDesktopLayout from "../components/organisms/app-shell/ClinicianDesktopLayout";
import PhoneFrame from "../components/organisms/app-shell/PhoneFrame";
import RoleSwitcher from "../components/organisms/app-shell/RoleSwitcher";
import AgendaModal from "../components/organisms/forms/AgendaModal";
import CapteursModal from "../components/organisms/forms/CapteursModal";
import SearchPatientModal from "../components/organisms/forms/SearchPatientModal";
import ClinicianNoteModal from "../components/organisms/forms/ClinicianNoteModal";
import { GlycemiaModalForm, MealModalForm, SensorChoiceModal } from "../components/organisms/forms/Modals";
import { ClinicianCockpitTemplate, ClinicianCompteTemplate, ClinicianDocumentsTemplate, ClinicianNotesTemplate, ClinicianPatientViewTemplate, ClinicianPatientsTemplate } from "../components/templates/clinician/ClinicianTemplates";
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
  clinicianAppointments,
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
import type { AnyTab, Appointment, Caregiver, ClinicianTab, ConversationThread, DiabeticPatientFiche, DocumentItem, NavItem, PatientTab, Role } from "../features/diabetcare/types";

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
  const [agendaModalOpen, setAgendaModalOpen] = useState(false);
  const [capteursModalOpen, setCapteursModalOpen] = useState(false);
  const [searchPatientModalOpen, setSearchPatientModalOpen] = useState(false);
  const [clinicianNoteModalOpen, setClinicianNoteModalOpen] = useState(false);
  const [clinicianQuickNotes, setClinicianQuickNotes] = useState<Record<string, string>>({});
  const [importedReportData, setImportedReportData] = useState<unknown>(null);
  const [clinicianNoteOverrides, setClinicianNoteOverrides] = useState<Record<string, string>>({});
  const [clinicianAddedDocuments, setClinicianAddedDocuments] = useState<DocumentItem[]>([]);
  const [removedDocumentIds, setRemovedDocumentIds] = useState<string[]>([]);

  const skipHistoryPushRef = useRef(false);
  const initialHistoryReplacedRef = useRef(false);

  const sortedAppointments: Appointment[] = [...clinicianAppointments].sort(
    (a, b) => (a.date !== b.date ? a.date.localeCompare(b.date) : a.time.localeCompare(b.time))
  );

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 2500);
    return () => clearTimeout(t);
  }, [toastMessage]);

  useEffect(() => {
    if (state.role === "clinician" && state.activeTab === "mesures") {
      state.setActiveFollowUpView("tendances");
    }
  }, [state.role, state.activeTab]);

  useEffect(() => {
    if (!state.selectedThreadId && state.messageViewMode === "thread") {
      state.setMessageViewMode("list");
    }
  }, [state.selectedThreadId, state.messageViewMode]);

  // Synchronisation avec l’historique navigateur : replaceState au montage, pushState à chaque navigation, popstate pour le bouton Retour.
  useEffect(() => {
    const stateForHistory = {
      role: state.role,
      tab: state.activeTab,
      patientId: state.selectedClinicalPatientId,
    };
    if (!initialHistoryReplacedRef.current) {
      initialHistoryReplacedRef.current = true;
      window.history.replaceState(stateForHistory, "", window.location.pathname + window.location.search);
      return;
    }
    if (skipHistoryPushRef.current) {
      skipHistoryPushRef.current = false;
      return;
    }
    window.history.pushState(stateForHistory, "", window.location.pathname + window.location.search);
  }, [state.role, state.activeTab, state.selectedClinicalPatientId]);

  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const s = e.state as { role?: Role; tab?: AnyTab; patientId?: string } | null;
      if (s) {
        skipHistoryPushRef.current = true;
        if (s.role) state.setRole(s.role);
        if (s.tab) state.setActiveTab(s.tab);
        if (s.patientId) state.setSelectedClinicalPatientId(s.patientId);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Données dérivées : config graphique selon période, documents filtrés par source, threads triés (non lus en premier), thread/document/patient sélectionnés.
  const currentMeasureConfig = glucoseSeriesByPeriod[state.activeMeasurePeriod];
  const chart = useMeasureChart(currentMeasureConfig.data);
  const visibleHistoryRows = state.historyExpanded ? historyRows : historyRows.slice(0, 1);
  const contextPatientId = state.role === "patient" ? patientState.id : state.selectedClinicalPatientId;
  const baseProviderDocuments = documents.filter(
    (item) => item.source === "soignant" && (!item.patientId || item.patientId === contextPatientId)
  );
  const addedDocsForContext = clinicianAddedDocuments.filter(
    (d) => d.source === "soignant" && d.patientId === contextPatientId
  );
  const providerDocuments = [...baseProviderDocuments, ...addedDocsForContext];
  const patientDocuments = documents.filter(
    (item) => item.source === "patient" && (!item.patientId || item.patientId === contextPatientId)
  );
  const threads = state.role === "patient" ? patientThreadsState : clinicianThreads;
  const sortedThreads = [...threads].sort((a, b) => (b.unread !== a.unread ? b.unread - a.unread : a.name.localeCompare(b.name)));
  const visibleThreads = state.messagesCardExpanded ? sortedThreads : sortedThreads.slice(0, 3);
  const selectedThread = state.selectedThreadId ? threads.find((item) => item.id === state.selectedThreadId) ?? threads[0] : threads[0];

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
  const contextDocs = [...providerDocuments, ...patientDocuments];
  const selectedDocument = contextDocs.find((d) => d.id === state.selectedDocumentId) ?? contextDocs[0] ?? documents[0];
  const selectedClinicalPatient = state.selectedClinicalPatientId ? clinicianPatients.find((item) => item.id === state.selectedClinicalPatientId) : undefined;

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
    { key: "echanges", label: "Échanges" },
    { key: "mesures", label: "Courbes" },
    { key: "notes", label: "Notes" },
    { key: "compte", label: "Compte" },
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
    state.setActiveTab(state.role === "patient" ? "profil" : "compte");
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

  const goToClinicianTab = (tab: ClinicianTab | "messages" | "docs") => {
    if (tab === "messages") {
      state.setActiveTab("echanges");
      state.setActiveExchangeTab("messages");
    } else if (tab === "docs") {
      state.setActiveTab("echanges");
      state.setActiveExchangeTab("documents");
    } else {
      state.setActiveTab(tab);
    }
  };

  const selectClinicianPatient = (id: string) => {
    state.setSelectedClinicalPatientId(id);
    state.setActiveTab("mesures");
    state.setActiveFollowUpView("tendances");
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
              clinicianPatients={clinicianPatients}
              onSelectPatient={state.setSelectedClinicalPatientId}
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
              onAddCaregiver={() => setToastMessage("Ajouter soignant — Bientôt disponible")}
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
          <>
            <ClinicianCockpitTemplate
              patient={patient}
              clinicianInitials={clinicianProfile.initials}
              clinicianPatients={clinicianPatients}
              appointments={sortedAppointments}
              onPatientsClick={() => state.setActiveTab("patients")}
              onProfileClick={openProfile}
              onDocumentsClick={() => state.setActiveTab("documents")}
              onMessagesClick={() => { state.setActiveTab("echanges"); state.setActiveExchangeTab("messages"); }}
              onNotesClick={() => state.setActiveTab("notes")}
              onCapteurClick={() => setCapteursModalOpen(true)}
              onOpenPlanning={() => setAgendaModalOpen(true)}
            />
            <AgendaModal open={agendaModalOpen} appointments={sortedAppointments} onClose={() => setAgendaModalOpen(false)} />
            <CapteursModal open={capteursModalOpen} patients={clinicianPatients} onClose={() => setCapteursModalOpen(false)} />
          </>
        );
      case "patients":
        return (
          <>
            <ClinicianPatientsTemplate
              patient={patient}
              clinicianInitials={clinicianProfile.initials}
              clinicianPatients={clinicianPatients}
              selectedClinicalPatientId={state.selectedClinicalPatientId}
              onSelectPatient={selectClinicianPatient}
              onSearchPatient={() => setSearchPatientModalOpen(true)}
              onPatientsClick={() => state.setActiveTab("patients")}
              onProfileClick={openProfile}
            />
            <SearchPatientModal
              open={searchPatientModalOpen}
              patients={clinicianPatients}
              onClose={() => setSearchPatientModalOpen(false)}
              onSelectPatient={(id) => {
                selectClinicianPatient(id);
                setSearchPatientModalOpen(false);
              }}
            />
          </>
        );
      case "patient_view":
        if (!selectedClinicalPatient) {
          return (
            <>
              <ClinicianPatientsTemplate
                patient={patient}
                clinicianInitials={clinicianProfile.initials}
                clinicianPatients={clinicianPatients}
                selectedClinicalPatientId={state.selectedClinicalPatientId}
                onSelectPatient={selectClinicianPatient}
                onSearchPatient={() => setSearchPatientModalOpen(true)}
                onPatientsClick={() => state.setActiveTab("patients")}
                onProfileClick={openProfile}
              />
              <SearchPatientModal
                open={searchPatientModalOpen}
                patients={clinicianPatients}
                onClose={() => setSearchPatientModalOpen(false)}
                onSelectPatient={(id) => {
                  selectClinicianPatient(id);
                  setSearchPatientModalOpen(false);
                }}
              />
            </>
          );
        }
        return (
          <>
            <div className="mb-4 py-2">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[var(--color-teal)] flex items-center justify-center text-white font-semibold text-sm shrink-0" aria-hidden>
                  {selectedClinicalPatient.initials}
                </span>
                <h2 className="text-2xl font-semibold text-[var(--color-text)]">{selectedClinicalPatient.name}</h2>
              </div>
              <p className="mt-2 ml-[52px] text-sm text-[var(--color-text-secondary)]">
                {[
                  selectedClinicalPatient.age != null ? `${selectedClinicalPatient.age} ans` : null,
                  selectedClinicalPatient.sex ?? null,
                  selectedClinicalPatient.height ?? null,
                  selectedClinicalPatient.weight ?? null,
                  selectedClinicalPatient.diabetesType ?? null,
                  selectedClinicalPatient.treatmentType ?? null,
                ]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </p>
            </div>
            <ClinicianPatientViewTemplate
              patient={patient}
              clinicianInitials={clinicianProfile.initials}
              selectedClinicalPatient={selectedClinicalPatient}
              patientFiche={getFicheByPatientId(selectedClinicalPatient.id)}
              onPatientsClick={() => state.setActiveTab("patients")}
              onProfileClick={openProfile}
            />
          </>
        );
      case "mesures":
        if (!selectedClinicalPatient) {
          return (
            <>
              <ClinicianPatientsTemplate
                patient={patient}
                clinicianInitials={clinicianProfile.initials}
                clinicianPatients={clinicianPatients}
                selectedClinicalPatientId={state.selectedClinicalPatientId}
                onSelectPatient={selectClinicianPatient}
                onSearchPatient={() => setSearchPatientModalOpen(true)}
                onPatientsClick={() => state.setActiveTab("patients")}
                onProfileClick={openProfile}
              />
              <SearchPatientModal
                open={searchPatientModalOpen}
                patients={clinicianPatients}
                onClose={() => setSearchPatientModalOpen(false)}
                onSelectPatient={(id) => {
                  selectClinicianPatient(id);
                  setSearchPatientModalOpen(false);
                }}
              />
            </>
          );
        }
        return (
          <>
            <div className="mb-4 py-2">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[var(--color-teal)] flex items-center justify-center text-white font-semibold text-sm shrink-0" aria-hidden>
                  {selectedClinicalPatient.initials}
                </span>
                <h2 className="text-2xl font-semibold text-[var(--color-text)]">{selectedClinicalPatient.name}</h2>
              </div>
              <p className="mt-2 ml-[52px] text-sm text-[var(--color-text-secondary)]">
                {[
                  selectedClinicalPatient.age != null ? `${selectedClinicalPatient.age} ans` : null,
                  selectedClinicalPatient.sex ?? null,
                  selectedClinicalPatient.height ?? null,
                  selectedClinicalPatient.weight ?? null,
                  selectedClinicalPatient.diabetesType ?? null,
                  selectedClinicalPatient.treatmentType ?? null,
                ]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </p>
            </div>
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
              onOpenFiche={state.role === "clinician" ? () => state.setActiveTab("patient_view") : undefined}
              onOpenNotes={state.role === "clinician" ? () => state.setActiveTab("notes") : undefined}
              onOpenMessages={
                state.role === "clinician"
                  ? () => {
                      state.setActiveTab("echanges");
                      state.setActiveExchangeTab("messages");
                      if (selectedClinicalPatient) {
                        state.setSelectedClinicalPatientId(selectedClinicalPatient.id);
                        const threadsForRole = state.role === "patient" ? patientThreadsState : clinicianThreads;
                        const threadForPatient =
                          threadsForRole.find((t) => t.name === selectedClinicalPatient.name) ?? threadsForRole[0];
                        if (threadForPatient) {
                          state.setSelectedThreadId(threadForPatient.id);
                          state.setMessageViewMode("thread");
                        } else {
                          state.setSelectedThreadId("");
                          state.setMessageViewMode("list");
                        }
                      }
                    }
                  : undefined
              }
              onImportData={
                state.role === "clinician"
                  ? (data) => {
                      if (data && typeof data === "object" && "error" in data) {
                        setToastMessage("Fichier JSON invalide");
                        return;
                      }
                      setImportedReportData(data);
                      setToastMessage("Données importées");
                    }
                  : undefined
              }
              onGoHome={state.role === "clinician" ? () => state.setActiveTab("cockpit") : undefined}
            />
            <ClinicianNoteModal
              open={clinicianNoteModalOpen}
              patientName={selectedClinicalPatient.name}
              initialContent={clinicianQuickNotes[selectedClinicalPatient.id] ?? ""}
              onClose={() => setClinicianNoteModalOpen(false)}
              onSave={(content) => setClinicianQuickNotes((prev) => ({ ...prev, [selectedClinicalPatient.id]: content }))}
            />
          </>
        );
      case "documents":
        return (
          <ClinicianDocumentsTemplate
            patient={selectedClinicalPatient ? { ...patient, id: selectedClinicalPatient.id, name: selectedClinicalPatient.name, initials: selectedClinicalPatient.initials } : patient}
            clinicianInitials={clinicianProfile.initials}
            patients={clinicianPatients}
            documents={[...documents.filter((d) => !removedDocumentIds.includes(d.id)), ...clinicianAddedDocuments]}
            selectedPatientId={state.selectedClinicalPatientId}
            onSelectPatient={(id) => {
              state.setSelectedClinicalPatientId(id);
              state.setSelectedDocumentId("");
            }}
            onSearchPatient={() => setSearchPatientModalOpen(true)}
            selectedDocumentId={state.selectedDocumentId}
            setSelectedDocumentId={state.setSelectedDocumentId}
            onAddDocument={(payload) => {
              const { title, category, content = "", fileName } = payload;
              const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
              const contentWithFile = fileName
                ? (content ? `${content}\n\nFichier joint : ${fileName}` : `Fichier joint : ${fileName}`)
                : (content || "—");
              const newDoc: DocumentItem = {
                id: `doc-added-${Date.now()}`,
                patientId: state.selectedClinicalPatientId,
                title: title || "Sans titre",
                category: category || "Autre",
                date,
                content: contentWithFile,
                source: "soignant",
              };
              setClinicianAddedDocuments((prev) => [...prev, newDoc]);
              setToastMessage(fileName ? "Document et fichier transférés" : "Document ajouté");
            }}
            onEditDocument={() => setToastMessage("Modification à venir")}
            onDeleteDocument={(id) => {
              setClinicianAddedDocuments((prev) => prev.filter((d) => d.id !== id));
              setRemovedDocumentIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
              if (state.selectedDocumentId === id) state.setSelectedDocumentId("");
              setToastMessage("Document supprimé");
            }}
            onPatientsClick={() => state.setActiveTab("patients")}
            onProfileClick={openProfile}
          />
        );
      case "echanges":
        return (
          <PatientExchangesTemplate
            role={state.role}
            patient={patient}
            clinicianInitials={clinicianProfile.initials}
            selectedClinicalPatient={selectedClinicalPatient}
            clinicianPatients={clinicianPatients}
            onSelectPatient={state.setSelectedClinicalPatientId}
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
            onStartNewConversation={() => {}}
            onProfileClick={() => state.setActiveTab("patients")}
          />
        );
      case "notes":
        return (
          <>
            <ClinicianNotesTemplate
              patient={patient}
              clinicianInitials={clinicianProfile.initials}
              patients={clinicianPatients}
              notes={therapyNotes}
              selectedPatientId={state.selectedClinicalPatientId}
              onSelectPatient={state.setSelectedClinicalPatientId}
              onSearchPatient={() => setSearchPatientModalOpen(true)}
              selectedNoteId={state.selectedNoteId}
              setSelectedNoteId={state.setSelectedNoteId}
              noteContentOverride={clinicianNoteOverrides}
              onSaveNote={(noteId, content) => {
                setClinicianNoteOverrides((prev) => ({ ...prev, [noteId]: content }));
                setToastMessage("Note enregistrée");
              }}
              onPatientsClick={() => state.setActiveTab("patients")}
              onProfileClick={openProfile}
            />
            <SearchPatientModal
              open={searchPatientModalOpen}
              patients={clinicianPatients}
              onClose={() => setSearchPatientModalOpen(false)}
              onSelectPatient={(id) => {
                state.setSelectedClinicalPatientId(id);
                setSearchPatientModalOpen(false);
              }}
            />
          </>
        );
      case "compte":
        return (
          <ClinicianCompteTemplate
            patient={patient}
            clinicianInitials={clinicianProfile.initials}
            onPatientsClick={() => state.setActiveTab("patients")}
            onProfileClick={openProfile}
            onLogout={() => {
              setToastMessage("Déconnexion");
              state.setRole("patient");
              state.setActiveTab("profil");
            }}
          />
        );
      default:
        return null;
    }
  };

  const isInThread = (state.role === "patient" && state.activeTab === "echanges" && state.activeExchangeTab === "messages" && state.messageViewMode === "thread")
    || (state.role === "clinician" && state.activeTab === "echanges" && state.activeExchangeTab === "messages" && state.messageViewMode === "thread");

  const modalsBlock = (
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
  );

  // Soignant : layout bureau (header + sidebar), jamais dans le cadre téléphone.
  if (state.role === "clinician") {
    return (
      <div key="clinician-layout" data-layout="clinician-desktop" className="min-h-screen w-full">
        <ClinicianDesktopLayout
          activeTab={state.activeTab as ClinicianTab}
          onNavigate={(tab) => {
            state.setActiveTab(tab);
            if (tab === "documents") state.setActiveExchangeTab("documents");
          }}
          onProfileClick={openProfile}
          onLogout={() => {
            setToastMessage("Déconnexion");
            state.setRole("patient");
            state.setActiveTab("profil");
          }}
          clinicianInitials={clinicianProfile.initials}
          roleSwitcher={<RoleSwitcher role={state.role} onSwitchRole={switchRole} />}
          modals={modalsBlock}
        >
          {renderActiveScreen()}
        </ClinicianDesktopLayout>
        {toastMessage ? <Toast message={toastMessage} variant="success" /> : null}
      </div>
    );
  }

  // Patient : cadre téléphone + barre de navigation en bas.
  return (
    <PhoneFrame
      key="patient-layout"
      roleSwitcher={<RoleSwitcher role={state.role} onSwitchRole={switchRole} />}
      fullscreen={isInThread}
      bottomNavigation={!isInThread ? (
        <BottomNavigation items={patientNavItems} activeKey={state.activeTab as PatientTab} onChange={(tab) => { state.setActiveTab(tab); if (tab !== "capteur") state.setOpenSensorParamsOnCapteurTab(false); }} />
      ) : null}
      modals={modalsBlock}
    >
      {renderActiveScreen()}
      {toastMessage ? <Toast message={toastMessage} variant="success" /> : null}
    </PhoneFrame>
  );
}
