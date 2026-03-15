import { useState, useEffect } from "react";
import type { ClinicalPatient } from "../../../features/diabetcare/types";

type CapteursModalProps = {
  open: boolean;
  patients: ClinicalPatient[];
  onClose: () => void;
};

export default function CapteursModal({ open, patients, onClose }: CapteursModalProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  useEffect(() => {
    if (open) setSelectedPatientId(null);
  }, [open]);

  if (!open) return null;

  const selectedPatient = selectedPatientId ? patients.find((p) => p.id === selectedPatientId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" aria-modal="true" role="dialog" aria-labelledby="capteurs-title">
      <div className="w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col rounded-[var(--radius-xl)] bg-white border border-[var(--color-border)] shadow-xl">
        <div className="flex items-center justify-between gap-3 p-4 border-b border-[var(--color-border-subtle)] shrink-0">
          <h2 id="capteurs-title" className="text-lg font-semibold text-[var(--color-text)]">
            Capteurs portés par les patients
          </h2>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-full bg-[var(--color-mint)] text-[var(--color-text)] flex items-center justify-center font-semibold" aria-label="Fermer">
            ×
          </button>
        </div>
        <div className="overflow-y-auto p-4 flex flex-col gap-4">
          <ul className="space-y-2 list-none p-0 m-0">
            {patients.length === 0 ? (
              <li className="text-sm text-[var(--color-text-secondary)]">Aucun patient avec capteur.</li>
            ) : (
              patients.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`w-full text-left rounded-[var(--radius-md)] bg-[var(--color-mint)] border p-3 transition-all ${
                      selectedPatientId === p.id ? "border-[var(--color-teal-deep)] ring-2 ring-[var(--color-teal-deep)]/30" : "border-[var(--color-border)]"
                    }`}
                  >
                    <div className="font-semibold text-[var(--color-text)]">{p.name}</div>
                    <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                      {p.sensor} · fraîcheur {p.freshness}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                      {p.lastReading} mg/dL · TIR {p.tir}% · {p.status}
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
          {selectedPatient && (
            <section className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4" aria-labelledby="capteur-detail-title">
              <h3 id="capteur-detail-title" className="text-sm font-semibold text-[var(--color-text)] mb-3">
                Informations capteur — {selectedPatient.name}
              </h3>
              <dl className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <dt className="text-[var(--color-text-secondary)]">Modèle</dt>
                  <dd className="font-medium text-[var(--color-text)]">{selectedPatient.sensor}</dd>
                </div>
                <div>
                  <dt className="text-[var(--color-text-secondary)]">Fraîcheur des données</dt>
                  <dd className="font-medium text-[var(--color-text)]">{selectedPatient.freshness}</dd>
                </div>
                <div>
                  <dt className="text-[var(--color-text-secondary)]">Dernière mesure</dt>
                  <dd className="font-medium text-[var(--color-text)]">{selectedPatient.lastReading} mg/dL</dd>
                </div>
                <div>
                  <dt className="text-[var(--color-text-secondary)]">TIR (temps dans la cible)</dt>
                  <dd className="font-medium text-[var(--color-text)]">{selectedPatient.tir} %</dd>
                </div>
                <div>
                  <dt className="text-[var(--color-text-secondary)]">Statut</dt>
                  <dd className="font-medium text-[var(--color-text)]">{selectedPatient.status}</dd>
                </div>
                {selectedPatient.openAlerts > 0 && (
                  <div>
                    <dt className="text-[var(--color-text-secondary)]">Alertes ouvertes</dt>
                    <dd className="font-medium text-[var(--color-text)]">{selectedPatient.openAlerts}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
