import { useState, useMemo, useEffect, useRef } from "react";
import type { ClinicalPatient } from "../../../features/diabetcare/types";

/** Normalise une chaîne pour la recherche : sans accents, minuscules. */
function normalizeForSearch(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

type SearchPatientModalProps = {
  open: boolean;
  patients: ClinicalPatient[];
  onClose: () => void;
  onSelectPatient: (patientId: string) => void;
};

export default function SearchPatientModal({
  open,
  patients,
  onClose,
  onSelectPatient,
}: SearchPatientModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const suggestions = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return patients.slice(0, 12);
    const nq = normalizeForSearch(q);
    return patients
      .filter(
        (p) =>
          normalizeForSearch(p.name).includes(nq) ||
          normalizeForSearch(p.id).includes(nq) ||
          normalizeForSearch(p.initials).includes(nq)
      )
      .slice(0, 12);
  }, [patients, searchQuery]);

  useEffect(() => {
    if (open) {
      setSearchQuery("");
      searchInputRef.current?.focus();
    }
  }, [open]);

  const handleSelect = (p: ClinicalPatient) => {
    onSelectPatient(p.id);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="search-patient-title"
    >
      <div className="w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col rounded-[var(--radius-xl)] bg-white border border-[var(--color-border)] shadow-xl">
        <div className="p-4 shrink-0 space-y-3 bg-gradient-to-r from-[var(--color-teal-deep)] to-[var(--color-teal-end)]">
          <div className="flex items-center justify-between gap-3">
            <h2 id="search-patient-title" className="text-lg font-semibold text-white">
              Rechercher un patient
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center font-semibold shrink-0 hover:bg-white/30"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 min-w-0">
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un patient"
                className="w-full rounded-[var(--radius-md)] border border-white/30 bg-white/95 px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Rechercher un patient"
                aria-autocomplete="list"
                aria-expanded={suggestions.length > 0}
                aria-controls="search-patient-suggestions"
                id="search-patient-input"
              />
            </div>
          </div>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0">
          <ul
            id="search-patient-suggestions"
            role="listbox"
            className="list-none p-0 m-0"
          >
            {suggestions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                Aucun patient trouvé
              </li>
            ) : (
              suggestions.map((p) => (
                <li key={p.id} role="option">
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 flex items-center gap-3 rounded-none border-b border-[var(--color-border-subtle)] last:border-0 text-[var(--color-text)] hover:bg-[var(--color-mint)] focus:bg-[var(--color-mint)] focus:outline-none"
                    onClick={() => handleSelect(p)}
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--color-teal)]/15 text-[var(--color-teal)] flex items-center justify-center text-sm font-semibold shrink-0">
                      {p.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[var(--color-text)] truncate">
                        {p.name}
                      </div>
                      <div className="text-sm text-[var(--color-text-secondary)] truncate">
                        {p.id} · {p.sensor}
                      </div>
                    </div>
                    <span className="text-[var(--color-text-secondary)] shrink-0" aria-hidden>
                      ›
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
