import type { ReactNode } from "react";
import Badge from "../../atoms/Badge";
import Card from "../../molecules/Card";
import SectionTitle from "../../molecules/SectionTitle";
import HeaderPill from "../../organisms/app-shell/HeaderPill";
import type { ClinicalPatient, DiabeticPatientFiche, NoteItem, PatientProfile } from "../../../features/diabetcare/types";

type BaseProps = {
  patient: PatientProfile;
  clinicianInitials: string;
  onPatientsClick: () => void;
  onProfileClick: () => void;
};

function ScreenHeader({ clinicianInitials, onPatientsClick }: { clinicianInitials: string; onPatientsClick: () => void }) {
  return <HeaderPill dateLabel="Mercredi 11 mars" initials={clinicianInitials} onProfileClick={onPatientsClick} />;
}

type CockpitProps = BaseProps & {
  clinicianPatients: ClinicalPatient[];
  onSelectPatient: (id: string) => void;
};

export function ClinicianCockpitTemplate({ clinicianInitials, clinicianPatients, onSelectPatient, onPatientsClick }: CockpitProps) {
  const totalAlerts = clinicianPatients.reduce((sum, p) => sum + p.openAlerts, 0);
  const riskySensors = clinicianPatients.filter((p) => p.openAlerts > 0 || p.freshness.includes("58") || p.status === "Données manquantes").length;
  // Tri : alertes décroissant, puis statut, puis nom.
  const priorityPatients = [...clinicianPatients].sort((a, b) => {
    if (b.openAlerts !== a.openAlerts) return b.openAlerts - a.openAlerts;
    if (a.status !== b.status) return a.status.localeCompare(b.status);
    return a.name.localeCompare(b.name);
  });

  return (
    <section aria-label="Cockpit clinicien">
      <ScreenHeader clinicianInitials={clinicianInitials} onPatientsClick={onPatientsClick} />
      <SectionTitle title="Cockpit clinique" subtitle="Alertes, priorités patient et vision populationnelle" />
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card variant="default" className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[var(--text-sm)] text-[var(--color-on-teal)]">Alertes ouvertes</div>
              <div className="text-critical-number text-3xl font-bold text-[var(--color-on-teal)] mt-1">{totalAlerts}</div>
            </div>
            <Badge tone="hypo">Priorité</Badge>
          </div>
        </Card>
        <Card variant="default" className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[var(--text-sm)] text-[var(--color-on-teal)]">Capteurs à risque</div>
              <div className="text-critical-number text-3xl font-bold text-[var(--color-on-teal)] mt-1">{riskySensors}</div>
            </div>
            <Badge tone="hyper">Surveillance</Badge>
          </div>
        </Card>
        <Card variant="default" className="p-4">
          <div className="text-[var(--text-sm)] text-[var(--color-on-teal)]">Patients suivis</div>
          <div className="text-critical-number text-3xl font-bold text-[var(--color-on-teal)] mt-1">{clinicianPatients.length}</div>
        </Card>
        <Card variant="default" className="p-4">
          <div className="text-[var(--text-sm)] text-[var(--color-on-teal)]">TIR médian</div>
          <div className="text-critical-number text-3xl font-bold text-[var(--color-on-teal)] mt-1">72%</div>
        </Card>
      </div>
      <Card variant="surface" className="p-4 hover:shadow-md active:shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-xs tracking-[0.2em] text-[#2c4443] font-semibold">PRIORITÉ CLINIQUE</div>
            <div className="text-lg font-semibold text-[#233636] mt-1">Patients à surveiller</div>
          </div>
          <button type="button" onClick={onPatientsClick} className="text-[var(--text-sm)] font-semibold text-[var(--color-teal)]">Voir liste</button>
        </div>
        <div className="space-y-2">
          {priorityPatients.slice(0, 3).map((p) => {
            const statusTone = p.openAlerts > 1 ? "hypo" : p.openAlerts === 1 ? "hyper" : p.tone;
            return (
              <button key={p.id} type="button" onClick={() => onSelectPatient(p.id)} className="w-full rounded-[var(--radius-md)] bg-[var(--color-mint)] border border-[var(--color-border)] p-3 text-left hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-[#233636] truncate">{p.name}</div>
                    <div className="text-sm text-[#616f73] mt-1 truncate">{p.sensor} · fraîcheur {p.freshness}</div>
                    <div className="text-xs text-[#616f73] mt-1">{p.lastReading} mg/dL · TIR {p.tir}%</div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge tone={statusTone === "hypo" ? "info" : statusTone === "hyper" ? "neutral" : statusTone}>{p.status}</Badge>
                    <div className="text-xs text-[#616f73]">{p.openAlerts} alerte(s)</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </section>
  );
}

type PatientsProps = BaseProps & {
  clinicianPatients: ClinicalPatient[];
  selectedClinicalPatientId: string;
  onSelectPatient: (id: string) => void;
};

export function ClinicianPatientsTemplate({ clinicianInitials, clinicianPatients, selectedClinicalPatientId, onSelectPatient, onPatientsClick }: PatientsProps) {
  return (
    <section aria-label="Liste des patients">
      <ScreenHeader clinicianInitials={clinicianInitials} onPatientsClick={onPatientsClick} />
      <SectionTitle title="Patients" subtitle="Liste surveillée et accès rapide aux dossiers" />
      <div className="space-y-3">
        {clinicianPatients.map((p) => (
          <button key={p.id} type="button" onClick={() => onSelectPatient(p.id)} className={`w-full rounded-[var(--radius-lg)] p-4 text-left ${selectedClinicalPatientId === p.id ? "bg-[#dfeceb] border border-[var(--color-border-strong)]" : "bg-[#e3e8e7] border border-[var(--color-border)]"}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--color-teal)] text-white flex items-center justify-center font-semibold">{p.initials}</div>
                <div>
                  <div className="font-semibold text-[var(--color-text)]">{p.name}</div>
                  <div className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-1">{p.id} · {p.sensor}</div>
                </div>
              </div>
              <div className="text-right">
                <Badge tone={p.tone}>{p.status}</Badge>
                <div className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-2">{p.lastReading} mg/dL · TIR {p.tir}%</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

type PatientViewProps = BaseProps & {
  selectedClinicalPatient: ClinicalPatient;
  patientFiche: DiabeticPatientFiche | undefined;
  onGoToTab: (tab: "mesures" | "messages" | "docs" | "notes") => void;
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

export function ClinicianPatientViewTemplate({ clinicianInitials, selectedClinicalPatient, patientFiche, onGoToTab, onPatientsClick }: PatientViewProps) {
  const diabetesTypeLabel = patientFiche?.diabetesType === "1" ? "Diabète de type 1" : patientFiche?.diabetesType === "2" ? "Diabète de type 2" : "Autre";

  return (
    <section aria-label="Fiche patient">
      <ScreenHeader clinicianInitials={clinicianInitials} onPatientsClick={onPatientsClick} />
      <SectionTitle title={selectedClinicalPatient.name} subtitle={`Fiche patient · ${selectedClinicalPatient.id}`} action={<Badge tone={selectedClinicalPatient.tone}>{selectedClinicalPatient.status}</Badge>} />
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
            {(patientFiche.allergies ?? patientFiche.comorbidities) && (
              <Card variant="surface" className="p-5 mb-5">
                <FicheSection title="ALLERGIES & COMORBIDITÉS">
                  <div className="space-y-2">
                    {patientFiche.allergies && <p className="text-[var(--text-sm)] text-[var(--color-text)]"><span className="text-[var(--color-text-secondary)]">Allergies : </span>{patientFiche.allergies}</p>}
                    {patientFiche.comorbidities && <p className="text-[var(--text-sm)] text-[var(--color-text)]"><span className="text-[var(--color-text-secondary)]">Comorbidités : </span>{patientFiche.comorbidities}</p>}
                  </div>
                </FicheSection>
              </Card>
            )}
            {patientFiche.notes && (
              <Card variant="surface" className="p-5 mb-5">
                <FicheSection title="NOTES CLINIQUES">
                  <p className="text-[var(--text-sm)] text-[var(--color-text)] leading-relaxed">{patientFiche.notes}</p>
                </FicheSection>
              </Card>
            )}
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
        <Card variant="surface" className="p-5 hover:shadow-md active:shadow-lg">
          <div className="text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[#2c4443] font-semibold mb-3">ACTIONS SOIGNANT</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Voir courbe", "mesures"],
              ["Ouvrir messages", "messages"],
              ["Voir documents", "docs"],
              ["Écrire une note", "notes"],
            ].map(([label, target]) => (
              <button key={label} type="button" onClick={() => onGoToTab(target as "mesures" | "messages" | "docs" | "notes")} className="rounded-[var(--radius-md)] bg-[var(--color-teal)] text-white py-3 font-semibold">
                {label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

type ClinicianNotesProps = BaseProps & {
  notes: NoteItem[];
  selectedNoteId: string;
  setSelectedNoteId: (id: string) => void;
};

export function ClinicianNotesTemplate({ clinicianInitials, notes, selectedNoteId, setSelectedNoteId, onPatientsClick }: ClinicianNotesProps) {
  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? notes[0];

  return (
    <section aria-label="Notes thérapeutiques">
      <ScreenHeader clinicianInitials={clinicianInitials} onPatientsClick={onPatientsClick} />
      <SectionTitle title="Notes thérapeutiques" subtitle="Notes cliniques du patient sélectionné" />
      <div className="grid grid-cols-[126px_1fr] gap-4">
        <div className="space-y-3">
          {notes.map((note) => (
            <button key={note.id} type="button" onClick={() => setSelectedNoteId(note.id)} className={`w-full rounded-[22px] p-3 text-left ${selectedNoteId === note.id ? "bg-[var(--color-teal)] text-white" : "bg-[#e3e8e7] text-[var(--color-text)] border border-[var(--color-border)]"}`}>
              <div className="font-semibold text-sm leading-tight">{note.title}</div>
              <div className="text-xs mt-1 opacity-80">{note.author}</div>
            </button>
          ))}
        </div>
        <Card variant="surface" className="p-5">
          <div className="text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[#2c4443] font-semibold">NOTE</div>
          <div className="text-2xl font-semibold text-[var(--color-text)] mt-1">{selectedNote.title}</div>
          <div className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-1">{selectedNote.author} · {selectedNote.date}</div>
          <div className="mt-5 rounded-[var(--radius-lg)] bg-white p-5 text-[var(--color-text)] leading-7 text-[15px]">{selectedNote.content}</div>
          <div className="mt-5 flex gap-3">
            <button type="button" className="flex-1 rounded-[var(--radius-md)] bg-[var(--color-teal)] text-white py-3 font-semibold">Nouvelle note</button>
            <button type="button" className="flex-1 rounded-[var(--radius-md)] bg-[var(--color-mint)] text-[var(--color-text)] py-3 font-semibold border border-[var(--color-border)]">Archiver</button>
          </div>
        </Card>
      </div>
    </section>
  );
}
