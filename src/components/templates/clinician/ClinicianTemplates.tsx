import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import Card from "../../molecules/Card";
import SectionTitle from "../../molecules/SectionTitle";
import AddDocumentModal from "../../organisms/forms/AddDocumentModal";
import type { AddDocumentPayload } from "../../organisms/forms/AddDocumentModal";
import type { Appointment, ClinicalPatient, ClinicianTab, DiabeticPatientFiche, DocumentItem, NoteItem, PatientProfile } from "../../../features/diabetcare/types";

type BaseProps = {
  patient: PatientProfile;
  clinicianInitials: string;
  onPatientsClick: () => void;
  onProfileClick: () => void;
};

function ScreenHeader(_props: { clinicianInitials: string; onProfileClick: () => void }) {
  return null;
}

function formatRdvTime(date: string, time: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const day = new Date(y, m - 1, d).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
  const [h, min] = time.split(":");
  return `${day} · ${h}h${min}`;
}

type CockpitProps = BaseProps & {
  clinicianPatients: ClinicalPatient[];
  appointments: Appointment[];
  onDocumentsClick?: () => void;
  onMessagesClick?: () => void;
  onNotesClick?: () => void;
  onCapteurClick?: () => void;
  onOpenPlanning?: () => void;
};

export function ClinicianCockpitTemplate({ clinicianInitials, clinicianPatients, appointments, onPatientsClick, onProfileClick, onDocumentsClick, onMessagesClick, onNotesClick, onCapteurClick, onOpenPlanning }: CockpitProps) {
  const nextRdv = appointments.slice(0, 3);

  return (
    <section aria-label="Cockpit clinicien">
      <ScreenHeader clinicianInitials={clinicianInitials} onProfileClick={onProfileClick} />
      <SectionTitle title="Cockpit" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-stretch">
        <button type="button" onClick={onPatientsClick} className="w-full text-left rounded-[var(--radius-xl)] shadow-sm transition-all duration-150 bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] p-5 min-h-[100px] flex flex-col text-white hover:shadow-md active:shadow-lg">
          <span className="text-base font-semibold leading-tight">Mes patients</span>
          <span className="text-sm text-white/90 mt-2 block leading-snug">{clinicianPatients.length} patient(s) suivi(s)</span>
        </button>
        <button type="button" onClick={onDocumentsClick} className="w-full text-left rounded-[var(--radius-xl)] shadow-sm transition-all duration-150 bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] p-5 min-h-[100px] flex flex-col text-white hover:shadow-md active:shadow-lg">
          <span className="text-base font-semibold leading-tight">Documents</span>
          <span className="text-sm text-white/90 mt-2 block leading-snug">Partagés avec les patients</span>
        </button>
        <button type="button" onClick={onMessagesClick} className="w-full text-left rounded-[var(--radius-xl)] shadow-sm transition-all duration-150 bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] p-5 min-h-[100px] flex flex-col text-white hover:shadow-md active:shadow-lg">
          <span className="text-base font-semibold leading-tight">Messagerie</span>
          <span className="text-sm text-white/90 mt-2 block leading-snug">Échanges avec les patients</span>
        </button>
        {onNotesClick && (
          <button type="button" onClick={onNotesClick} className="w-full text-left rounded-[var(--radius-xl)] shadow-sm transition-all duration-150 bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] p-5 min-h-[100px] flex flex-col text-white hover:shadow-md active:shadow-lg">
            <span className="text-base font-semibold leading-tight">Notes</span>
            <span className="text-sm text-white/90 mt-2 block leading-snug">Notes thérapeutiques</span>
          </button>
        )}
        <button type="button" onClick={onCapteurClick} className="w-full text-left rounded-[var(--radius-xl)] shadow-sm transition-all duration-150 bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] p-5 min-h-[100px] flex flex-col text-white hover:shadow-md active:shadow-lg">
          <span className="text-base font-semibold leading-tight">Capteurs</span>
          <span className="text-sm text-white/90 mt-2 block leading-snug">Données et alertes</span>
        </button>
      </div>
      <Card variant="surface" className="p-0 border border-[var(--color-border-subtle)] hover:shadow-md active:shadow-lg overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-3 bg-gradient-to-r from-[var(--color-teal-deep)] to-[var(--color-teal-end)]">
          <span className="text-base font-semibold text-white">Mes rendez-vous</span>
          <button
            type="button"
            onClick={onOpenPlanning}
            className="shrink-0 text-base font-semibold text-white hover:underline focus:underline focus:outline-none transition-all duration-150"
            aria-label="Ouvrir le planning des rendez-vous"
          >
            Voir planning
          </button>
        </div>
        <div className="p-5">
        <ul className="space-y-2 list-none p-0 m-0">
          {nextRdv.length === 0 ? (
            <li className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">Aucun rendez-vous à venir.</li>
          ) : (
            nextRdv.map((rdv) => (
              <li key={rdv.id} className="flex items-baseline justify-between gap-2 py-2 border-b border-[var(--color-border-subtle)] last:border-0">
                <div>
                  <span className="text-[var(--text-sm)] font-medium text-[var(--color-text)]">{rdv.patientName}</span>
                  <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)] ml-2">— {rdv.type}</span>
                </div>
                <span className="text-[var(--text-xs)] text-[var(--color-text-secondary)] shrink-0">{formatRdvTime(rdv.date, rdv.time)}</span>
              </li>
            ))
          )}
        </ul>
        </div>
      </Card>
    </section>
  );
}

type PatientsProps = BaseProps & {
  clinicianPatients: ClinicalPatient[];
  selectedClinicalPatientId: string;
  onSelectPatient: (id: string) => void;
  onSearchPatient?: () => void;
};

export function ClinicianPatientsTemplate({ clinicianInitials, clinicianPatients, selectedClinicalPatientId, onSelectPatient, onSearchPatient, onPatientsClick, onProfileClick }: PatientsProps) {
  return (
    <section aria-label="Liste des patients">
      <ScreenHeader clinicianInitials={clinicianInitials} onProfileClick={onProfileClick} />
      <SectionTitle title="Patients" subtitle="Liste des patients suivis" />
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={onSearchPatient ?? (() => {})}
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white border-0 py-2 px-3 text-[var(--text-sm)] font-semibold shadow-sm hover:shadow-md transition-shadow"
          aria-label="Rechercher un patient"
        >
          <Search className="w-4 h-4 shrink-0 stroke-[currentColor]" strokeWidth={2} aria-hidden />
          Rechercher patient
        </button>
      </div>
      <ul className="space-y-1 list-none p-0 m-0">
        {clinicianPatients.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onSelectPatient(p.id)}
              className={`w-full rounded-[var(--radius-md)] py-3 px-4 flex items-center gap-3 text-left transition shadow-sm hover:shadow-md ${selectedClinicalPatientId === p.id ? "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white border-2 border-white ring-2 ring-[var(--color-teal)]" : "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white border border-transparent"}`}
            >
              <div className="w-10 h-10 rounded-full bg-white/25 text-white flex items-center justify-center text-sm font-semibold shrink-0">{p.initials}</div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white truncate">{p.name}</div>
                <div className="text-[var(--text-sm)] text-white/90 truncate">{p.id} · {p.sensor}</div>
              </div>
              <span className="text-white shrink-0" aria-hidden>›</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

type PatientViewProps = BaseProps & {
  selectedClinicalPatient: ClinicalPatient;
  patientFiche: DiabeticPatientFiche | undefined;
};

function FicheSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-label)] font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

function FicheRow({ label, value }: { label: string; value: string | number | undefined }) {
  if (value === undefined || value === "") return null;
  return (
    <div className="flex justify-between gap-3 py-1.5 border-b border-[var(--color-border-subtle)] last:border-0">
      <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">{label}</span>
      <span className="text-[var(--text-sm)] font-medium text-[var(--color-text)] text-right">{value}</span>
    </div>
  );
}

export function ClinicianPatientViewTemplate({ clinicianInitials, selectedClinicalPatient, patientFiche, onPatientsClick, onProfileClick }: PatientViewProps) {
  const diabetesTypeLabel = patientFiche?.diabetesType === "1" ? "Diabète de type 1" : patientFiche?.diabetesType === "2" ? "Diabète de type 2" : "Autre";

  return (
    <section aria-label="Fiche patient">
      <div className="flex items-center gap-3 mb-3">
        <button type="button" onClick={onPatientsClick} className="w-10 h-10 rounded-full bg-[var(--color-mint)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)] shrink-0" aria-label="Retour à la liste des patients">
          <span className="text-lg leading-none">←</span>
        </button>
        <span className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">Patients</span>
      </div>
      <ScreenHeader clinicianInitials={clinicianInitials} onProfileClick={onProfileClick} />
      <div className="pb-24">
        {patientFiche ? (
          <>
            <Card variant="surface" className="p-5 mb-5">
              <FicheSection title="IDENTITÉ">
                <div className="space-y-0">
                  <FicheRow label="Nom" value={`${patientFiche.lastName} ${patientFiche.firstName}`} />
                  <FicheRow label="Date de naissance" value={patientFiche.birthDate} />
                  <FicheRow label="Téléphone" value={patientFiche.phone} />
                  <FicheRow label="Email" value={patientFiche.email} />
                </div>
              </FicheSection>
            </Card>
            <Card variant="surface" className="p-5 mb-5">
              <FicheSection title="DIABÉTOLOGIE">
                <div className="space-y-0">
                  <FicheRow label="Type de diabète" value={diabetesTypeLabel} />
                  <FicheRow label="Date du diagnostic" value={patientFiche.dateDiagnosis} />
                  <FicheRow label="HbA1c (dernière)" value={patientFiche.lastHbA1c != null ? `${patientFiche.lastHbA1c} % (${patientFiche.lastHbA1cDate ?? ""})` : undefined} />
                  <FicheRow label="Cible glycémie" value={`${patientFiche.targetGlucoseMin} – ${patientFiche.targetGlucoseMax} mg/dL`} />
                </div>
              </FicheSection>
            </Card>
            <Card variant="surface" className="p-5 mb-5">
              <FicheSection title="TRAITEMENT">
                <p className="text-[var(--text-sm)] text-[var(--color-text)] leading-relaxed">{patientFiche.treatmentSummary}</p>
              </FicheSection>
            </Card>
            <Card variant="surface" className="p-5 mb-5">
              <FicheSection title="CAPTEUR / CGM">
                <div className="space-y-0">
                  <FicheRow label="Modèle" value={patientFiche.sensorType} />
                  <FicheRow label="Dernier calibrage" value={patientFiche.lastCalibration} />
                  <FicheRow label="Dernière lecture" value={`${selectedClinicalPatient.lastReading} mg/dL`} />
                  <FicheRow label="Fraîcheur" value={selectedClinicalPatient.freshness} />
                  <FicheRow label="Alertes ouvertes" value={String(selectedClinicalPatient.openAlerts)} />
                </div>
              </FicheSection>
            </Card>
            <Card variant="surface" className="p-5 mb-5">
              <FicheSection title="MÉDECIN & URGENCE">
                <div className="space-y-0">
                  <FicheRow label="Médecin traitant" value={patientFiche.treatingPhysician} />
                  <FicheRow label="Tél. médecin" value={patientFiche.physicianPhone} />
                  <FicheRow label="Contact urgence" value={patientFiche.emergencyContact} />
                  <FicheRow label="Tél. urgence" value={patientFiche.emergencyPhone} />
                </div>
              </FicheSection>
            </Card>
          </>
        ) : (
          <Card variant="surface" className="p-5 mb-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Dernière lecture", `${selectedClinicalPatient.lastReading} mg/dL`],
                ["Freshness", selectedClinicalPatient.freshness],
                ["Capteur", selectedClinicalPatient.sensor],
                ["Alertes ouvertes", String(selectedClinicalPatient.openAlerts)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[22px] bg-white p-4">
                  <div className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">{label}</div>
                  <div className="text-critical-number text-lg font-semibold text-[var(--color-text)] mt-1">{value}</div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}

type ClinicianCompteProps = BaseProps & {
  onLogout: () => void;
};

export function ClinicianCompteTemplate({ patient, clinicianInitials, onProfileClick, onLogout }: ClinicianCompteProps) {
  return (
    <section aria-label="Compte soignant">
      <ScreenHeader clinicianInitials={clinicianInitials} onProfileClick={onProfileClick} />
      <SectionTitle title="Compte" subtitle="Paramètres et sécurité" />
      <Card variant="surface" className="p-5 hover:shadow-md active:shadow-lg">
        <div className="text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-label)] font-semibold">PARAMÈTRES</div>
        <div className="space-y-3 mt-4">
          <button type="button" className="w-full rounded-[20px] bg-[var(--color-mint)] text-[var(--color-text)] border border-[var(--color-border)] p-4 text-left font-semibold hover:shadow-md">
            Notifications
          </button>
          <button type="button" className="w-full rounded-[20px] bg-[var(--color-mint)] text-[var(--color-text)] border border-[var(--color-border)] p-4 text-left font-semibold hover:shadow-md">
            Sécurité du compte
          </button>
          <button type="button" onClick={onLogout} className="w-full rounded-[20px] bg-[#fff5f5] text-[#b45309] border border-[#f3d6d6] p-4 text-left font-semibold hover:shadow-md">
            Déconnexion
          </button>
        </div>
      </Card>
    </section>
  );
}

type ClinicianNotesProps = BaseProps & {
  patients: ClinicalPatient[];
  notes: NoteItem[];
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
  onSearchPatient?: () => void;
  selectedNoteId: string;
  setSelectedNoteId: (id: string) => void;
  /** Contenu affiché pour la note (surcharge édition). Si non fourni, utilise note.content. */
  noteContentOverride?: Record<string, string>;
  onSaveNote?: (noteId: string, content: string) => void;
};

export function ClinicianNotesTemplate({
  clinicianInitials,
  patients,
  notes,
  selectedPatientId,
  onSelectPatient,
  onSearchPatient,
  selectedNoteId,
  setSelectedNoteId,
  noteContentOverride = {},
  onSaveNote,
  onPatientsClick,
  onProfileClick,
}: ClinicianNotesProps) {
  const notesForPatient = notes.filter((n) => n.patientId === selectedPatientId);
  const selectedNote = notesForPatient.find((note) => note.id === selectedNoteId) ?? notesForPatient[0];
  const displayContent = selectedNote ? (noteContentOverride[selectedNote.id] ?? selectedNote.content) : "";
  const [editingContent, setEditingContent] = useState(displayContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditingContent(selectedNote ? (noteContentOverride[selectedNote.id] ?? selectedNote.content) : "");
  }, [selectedNote?.id, noteContentOverride, selectedNote?.content]);

  useEffect(() => {
    if (selectedNote) textareaRef.current?.focus();
  }, [selectedNote?.id]);

  const handleSelectPatient = (patientId: string) => {
    onSelectPatient(patientId);
    const firstNoteOfPatient = notes.find((n) => n.patientId === patientId);
    if (firstNoteOfPatient) setSelectedNoteId(firstNoteOfPatient.id);
  };

  const handleSaveNote = () => {
    if (selectedNote && onSaveNote) onSaveNote(selectedNote.id, editingContent);
  };

  return (
    <section aria-label="Notes thérapeutiques">
      <ScreenHeader clinicianInitials={clinicianInitials} onProfileClick={onProfileClick} />
      <SectionTitle title="Notes thérapeutiques" subtitle="Notes cliniques par patient" />
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={onSearchPatient ?? (() => {})}
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white border-0 py-2 px-3 text-[var(--text-sm)] font-semibold shadow-sm hover:shadow-md transition-shadow"
          aria-label="Rechercher un patient"
        >
          <Search className="w-4 h-4 shrink-0 stroke-[currentColor]" strokeWidth={2} aria-hidden />
          Rechercher patient
        </button>
      </div>
      <div className="grid grid-cols-[180px_1fr] gap-4">
        <div className="space-y-4">
          <div className="text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-label)] font-semibold">PATIENTS</div>
          <div className="space-y-2">
            {patients.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPatient(p.id)}
                className={`w-full rounded-[22px] p-3 text-left ${selectedPatientId === p.id ? "bg-[var(--color-teal)] text-white" : "bg-[#e3e8e7] text-[var(--color-text)] border border-[var(--color-border)]"}`}
              >
                <div className="font-semibold text-sm leading-tight">{p.name}</div>
                <div className="text-xs mt-1 opacity-80">{p.initials}</div>
              </button>
            ))}
          </div>
          {notesForPatient.length > 0 && (
            <>
              <div className="text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-label)] font-semibold pt-2">NOTES</div>
              <div className="space-y-2">
                {notesForPatient.map((note) => (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`w-full rounded-[22px] p-3 text-left ${selectedNoteId === note.id ? "bg-[var(--color-teal)] text-white" : "bg-[#e3e8e7] text-[var(--color-text)] border border-[var(--color-border)]"}`}
                  >
                    <div className="font-semibold text-sm leading-tight">{note.title}</div>
                    <div className="text-xs mt-1 opacity-80">{note.author}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <Card variant="surface" className="p-5 flex flex-col min-h-0">
          {selectedNote ? (
            <div className="flex flex-col min-h-0 flex-1">
              <div className="text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[#2c4443] font-semibold">NOTE</div>
              <div className="mt-4 flex-1 min-h-0 flex flex-col">
                <textarea
                  ref={textareaRef}
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="w-full flex-1 min-h-[200px] rounded-[var(--radius-lg)] bg-white border border-[var(--color-border)] p-4 text-[var(--color-text)] leading-7 text-[15px] resize-y"
                  placeholder="Contenu de la note…"
                  aria-label="Contenu de la note"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2 shrink-0">
                {onSaveNote && (
                  <button type="button" onClick={handleSaveNote} className="rounded-[var(--radius-md)] bg-[var(--color-mint)] text-[var(--color-text)] px-4 py-2.5 text-sm font-semibold border border-[var(--color-border)] hover:shadow-sm">
                    Enregistrer
                  </button>
                )}
                <button type="button" className="rounded-[var(--radius-md)] bg-[var(--color-mint)] text-[var(--color-text)] px-4 py-2.5 text-sm font-semibold border border-[var(--color-border)]">
                  Nouvelle note
                </button>
                <button type="button" className="rounded-[var(--radius-md)] bg-[var(--color-mint)] text-[var(--color-text)] px-4 py-2.5 text-sm font-semibold border border-[var(--color-border)]">
                  Archiver
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[var(--color-text-secondary)]">Aucune note pour ce patient.</p>
          )}
        </Card>
      </div>
    </section>
  );
}

type ClinicianDocumentsProps = BaseProps & {
  patients: ClinicalPatient[];
  documents: DocumentItem[];
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
  selectedDocumentId: string;
  setSelectedDocumentId: (id: string) => void;
  onAddDocument?: (payload: AddDocumentPayload) => void;
  onEditDocument?: (documentId: string) => void;
  onDeleteDocument?: (documentId: string) => void;
};

export function ClinicianDocumentsTemplate({
  clinicianInitials,
  patients,
  documents,
  selectedPatientId,
  onSelectPatient,
  selectedDocumentId,
  setSelectedDocumentId,
  onAddDocument,
  onEditDocument,
  onDeleteDocument,
  onPatientsClick,
  onProfileClick,
}: ClinicianDocumentsProps) {
  const [addDocumentModalOpen, setAddDocumentModalOpen] = useState(false);
  const docsForPatient = documents.filter((d) => d.patientId === selectedPatientId);
  const fromSoignant = docsForPatient.filter((d) => d.source === "soignant");
  const fromPatient = docsForPatient.filter((d) => d.source === "patient");
  const selectedDocument = selectedDocumentId ? docsForPatient.find((d) => d.id === selectedDocumentId) ?? null : null;
  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const showDetail = Boolean(selectedDocumentId && selectedDocument);

  return (
    <section aria-label="Gestion des documents">
      <ScreenHeader clinicianInitials={clinicianInitials} onProfileClick={onProfileClick} />
      <SectionTitle title="Documents" subtitle="Gestion des documents par patient" />
      <div className="grid grid-cols-[180px_1fr] gap-4">
        <div className="space-y-2">
          <div className="text-center text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-label)] font-semibold">PATIENTS</div>
          <div className="space-y-2">
            {patients.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPatient(p.id)}
                className={`w-full rounded-[22px] p-3 text-left ${selectedPatientId === p.id ? "bg-[var(--color-teal)] text-white" : "bg-[#e3e8e7] text-[var(--color-text)] border border-[var(--color-border)]"}`}
              >
                <div className="font-semibold text-sm leading-tight">{p.name}</div>
                <div className="text-xs mt-1 opacity-80">{p.initials}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0">
          {showDetail ? (
            <Card variant="surface" className="p-5">
              <div className="text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[#2c4443] font-semibold">DOCUMENT</div>
              <div className="text-xl font-semibold text-[var(--color-text)] mt-1">{selectedDocument.title}</div>
              <div className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-1">{selectedDocument.category} · {selectedDocument.date}</div>
              <div className="mt-4 p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg)] text-[var(--color-text)] text-[15px] leading-7">{selectedDocument.content}</div>
            </Card>
          ) : (
            <div className="space-y-5">
              <Card variant="surface" className="p-5">
                <div className="text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-label)] font-semibold mb-3">ENVOYÉS PAR LE SOIGNANT</div>
                {fromSoignant.length === 0 ? (
                  <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] py-3">Aucun document pour ce patient.</p>
                ) : (
                  <ul className="space-y-2 list-none p-0 m-0">
                    {fromSoignant.map((doc) => (
                      <li key={doc.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedDocumentId(doc.id)}
                          className="w-full rounded-[22px] bg-[var(--color-mint)] p-4 text-left hover:shadow-md border border-[var(--color-border)] flex items-center gap-2"
                        >
                          <span className="flex-1 min-w-0">
                            <div className="font-semibold text-[var(--color-text)]">{doc.title}</div>
                            <div className="text-sm text-[var(--color-text-secondary)] mt-1">{doc.category} · {doc.date}</div>
                          </span>
                          <span className="shrink-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {onEditDocument && (
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEditDocument(doc.id); }}
                                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onEditDocument(doc.id); } }}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-mint)] border border-[var(--color-border)] text-[var(--color-teal)] hover:bg-[#dfeceb] hover:border-[var(--color-teal)] transition-colors cursor-pointer"
                                aria-label={`Modifier ${doc.title}`}
                              >
                                <Pencil className="w-4 h-4 shrink-0 stroke-[currentColor]" strokeWidth={2} aria-hidden />
                              </span>
                            )}
                            {onDeleteDocument && (
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteDocument(doc.id); }}
                                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onDeleteDocument(doc.id); } }}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-mint)] border border-[var(--color-border)] text-[var(--color-teal)] hover:bg-[#dfeceb] hover:border-[var(--color-teal)] transition-colors cursor-pointer"
                                aria-label={`Supprimer ${doc.title}`}
                              >
                                <Trash2 className="w-4 h-4 shrink-0 stroke-[currentColor]" strokeWidth={2} aria-hidden />
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
              <div className="flex justify-center gap-2 flex-wrap">
                {onAddDocument && (
                  <button
                    type="button"
                    onClick={() => setAddDocumentModalOpen(true)}
                    className="w-auto max-w-[240px] rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white border-0 py-1.5 px-2.5 text-[11px] font-semibold shadow-sm hover:shadow-md"
                  >
                    + Ajouter un document
                  </button>
                )}
              </div>
              <Card variant="surface" className="p-5">
                <div className="text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-label)] font-semibold mb-3">ENVOYÉS PAR LE PATIENT</div>
                {fromPatient.length === 0 ? (
                  <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] py-3">Aucun document pour ce patient.</p>
                ) : (
                  <ul className="space-y-2 list-none p-0 m-0">
                    {fromPatient.map((doc) => (
                      <li key={doc.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedDocumentId(doc.id)}
                          className="w-full rounded-[22px] bg-[var(--color-mint)] p-4 text-left hover:shadow-md border border-[var(--color-border)] flex items-center gap-2"
                        >
                          <span className="flex-1 min-w-0">
                            <div className="font-semibold text-[var(--color-text)]">{doc.title}</div>
                            <div className="text-sm text-[var(--color-text-secondary)] mt-1">{doc.category} · {doc.date}{doc.status ? ` · ${doc.status}` : ""}</div>
                          </span>
                          <span className="shrink-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {onEditDocument && (
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEditDocument(doc.id); }}
                                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onEditDocument(doc.id); } }}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-mint)] border border-[var(--color-border)] text-[var(--color-teal)] hover:bg-[#dfeceb] hover:border-[var(--color-teal)] transition-colors cursor-pointer"
                                aria-label={`Modifier ${doc.title}`}
                              >
                                <Pencil className="w-4 h-4 shrink-0 stroke-[currentColor]" strokeWidth={2} aria-hidden />
                              </span>
                            )}
                            {onDeleteDocument && (
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteDocument(doc.id); }}
                                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onDeleteDocument(doc.id); } }}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-mint)] border border-[var(--color-border)] text-[var(--color-teal)] hover:bg-[#dfeceb] hover:border-[var(--color-teal)] transition-colors cursor-pointer"
                                aria-label={`Supprimer ${doc.title}`}
                              >
                                <Trash2 className="w-4 h-4 shrink-0 stroke-[currentColor]" strokeWidth={2} aria-hidden />
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
      {onAddDocument && selectedPatient ? (
        <AddDocumentModal
          open={addDocumentModalOpen}
          patientName={selectedPatient.name}
          onClose={() => setAddDocumentModalOpen(false)}
          onSave={(payload) => {
            try {
              onAddDocument(payload);
              setAddDocumentModalOpen(false);
            } catch (err) {
              console.error("Erreur enregistrement document:", err);
            }
          }}
        />
      ) : null}
    </section>
  );
}
