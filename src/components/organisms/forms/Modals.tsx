import { useState, useRef, useEffect } from "react";
import Modal from "../../molecules/Modal";
import type { PatientProfile } from "../../../features/diabetcare/types";
import iconNoConnectUrl from "../../../public/assets/icon-no-connect.svg?url";

type SensorChoiceModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SensorChoiceModal({ open, onClose }: SensorChoiceModalProps) {
  return (
    <Modal open={open} title="Source glycémie" onClose={onClose}>
      <div className="space-y-3">
        <div className="rounded-[20px] bg-[var(--color-mint)] border border-[var(--color-border-mint)] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] flex items-center justify-center shrink-0">
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" aria-hidden="true" />
            </div>
            <div>
              <div className="font-semibold text-[var(--color-text)]">Capteur connecté</div>
              <div className="text-sm text-[var(--color-text-secondary)] mt-0.5">En attente d'informations…</div>
            </div>
          </div>
        </div>
        <div className="rounded-[20px] bg-[var(--color-surface)] border border-[var(--color-danger)]/40 p-4 flex items-center gap-3">
          <img src={iconNoConnectUrl} alt="" className="w-8 h-8 shrink-0 animate-blink" aria-hidden="true" />
          <div>
            <div className="font-semibold text-[var(--color-text)]">Capteur non connecté</div>
            <div className="text-sm text-[var(--color-text-secondary)] mt-0.5">Aucun appareil détecté</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

type GlycemiaModalProps = {
  open: boolean;
  glycemiaInput: string;
  setGlycemiaInput: (value: string) => void;
  onClose: () => void;
  onManualSave: () => void;
  onUseSensor: () => void;
};

export function GlycemiaModalForm({ open, glycemiaInput, setGlycemiaInput, onClose, onManualSave, onUseSensor }: GlycemiaModalProps) {
  return (
    <Modal open={open} title="Ajouter glycémie" onClose={onClose}>
      <div className="space-y-3">
        <div className="rounded-[20px] bg-[var(--color-mint)] p-4">
          <div className="text-sm text-[var(--color-text-secondary)] mb-2">Valeur manuelle</div>
          <input value={glycemiaInput} onChange={(event) => setGlycemiaInput(event.target.value)} className="w-full rounded-[16px] bg-white border border-[var(--color-border)] px-4 py-3 text-[var(--color-text)] outline-none" inputMode="numeric" />
        </div>
        <button type="button" onClick={onManualSave} className="w-full rounded-[18px] bg-[#1c8f84] text-white py-3 font-semibold">Enregistrer manuellement</button>
        <button type="button" onClick={onUseSensor} className="w-full rounded-[18px] bg-[var(--color-mint)] text-[var(--color-text)] py-3 font-semibold border border-[var(--color-border-mint)]">Utiliser capteur</button>
      </div>
    </Modal>
  );
}

type MealModalProps = {
  open: boolean;
  patient: PatientProfile;
  mealType: string;
  setMealType: (value: string) => void;
  mealTime: string;
  setMealTime: (value: string) => void;
  carbsInput: string;
  setCarbsInput: (value: string) => void;
  mealBolusEnabled: boolean;
  setMealBolusEnabled: (value: boolean) => void;
  mealBolusUnits: string;
  setMealBolusUnits: (value: string) => void;
  mealBolusTiming: string;
  setMealBolusTiming: (value: string) => void;
  mealGlucoseMode: "capteur";
  setMealGlucoseMode: (value: "capteur") => void;
  mealGlucoseValue: string;
  setMealGlucoseValue: (value: string) => void;
  mealNote: string;
  setMealNote: (value: string) => void;
  mealUnusual: boolean;
  setMealUnusual: (value: boolean) => void;
  mealInsulinExpanded: boolean;
  setMealInsulinExpanded: (value: boolean) => void;
  mealNotesExpanded: boolean;
  setMealNotesExpanded: (value: boolean) => void;
  onClose: () => void;
  onSave: () => void;
  onOpenSensorChoice?: () => void;
};

export function MealModalForm({
  open,
  patient,
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
  onClose,
  onSave,
  onOpenSensorChoice,
}: MealModalProps) {
  const [carbsDropdownOpen, setCarbsDropdownOpen] = useState(false);
  const carbsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!carbsDropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (carbsDropdownRef.current && !carbsDropdownRef.current.contains(event.target as Node)) {
        setCarbsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [carbsDropdownOpen]);

  const carbsSuggestions = [15, 30, 45, 60, 90];

  return (
    <Modal open={open} title="Ajouter un repas" onClose={onClose}>
      <div className="space-y-2 max-h-[55vh] overflow-y-auto scrollbar-hide pr-1">
        <div>
          <div className="text-[11px] tracking-[0.14em] text-[#2c4443] font-semibold mb-1">REPAS</div>
          <div className="grid grid-cols-2 gap-1.5">
            {["Petit-déjeuner", "Déjeuner", "Dîner", "Collation"].map((item) => (
              <button key={item} type="button" onClick={() => setMealType(item)} className={`rounded-[12px] px-2.5 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-[0.985] ${mealType === item ? "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm" : "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white border-transparent shadow-sm"}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 items-stretch">
          <div className="flex flex-col rounded-[14px] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] border border-transparent shadow-sm p-2 min-h-0">
            <span className="text-xs text-white/90 mb-1 shrink-0">Heure</span>
            <input value={mealTime} onChange={(event) => setMealTime(event.target.value)} className="w-full h-9 rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-border)] px-2.5 text-sm text-[var(--color-text)] outline-none shrink-0" />
          </div>
          <div className="meal-carbs-wrapper meal-carbs-wrapper--compact relative flex flex-col min-h-0" ref={carbsDropdownRef}>
            <span className="meal-carbs-label mb-1 shrink-0">Glucides</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <input
                id="meal-carbs-input"
                value={carbsInput}
                onChange={(event) => setCarbsInput(event.target.value)}
                onFocus={() => setCarbsDropdownOpen(true)}
                className="meal-carbs-field meal-carbs-field--compact flex-1 min-w-0"
                inputMode="numeric"
                placeholder="Choisir ou saisir"
              />
              <button
                type="button"
                onClick={() => setCarbsDropdownOpen((v) => !v)}
                className="shrink-0 w-8 h-9 rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:border-[var(--color-teal)] hover:text-[var(--color-teal)] transition-colors"
                aria-label="Ouvrir les suggestions"
                aria-expanded={carbsDropdownOpen}
              >
                <span className={`text-xs transition-transform duration-200 ${carbsDropdownOpen ? "rotate-180" : ""}`}>▾</span>
              </button>
              <span className="text-xs text-white/90 self-center shrink-0">g</span>
            </div>
            {carbsDropdownOpen ? (
              <div className="meal-carbs-dropdown absolute left-0 right-0 z-10" role="listbox">
                {carbsSuggestions.map((value) => (
                  <button
                    key={value}
                    type="button"
                    role="option"
                    data-selected={carbsInput === String(value) ? "true" : undefined}
                    className="meal-carbs-dropdown-option"
                    onClick={() => {
                      setCarbsInput(String(value));
                      setCarbsDropdownOpen(false);
                    }}
                  >
                    {value} g
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <button type="button" onClick={() => setMealInsulinExpanded(!mealInsulinExpanded)} className="w-full rounded-[14px] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white border-transparent shadow-sm p-2 text-left" aria-expanded={mealInsulinExpanded} aria-label={mealInsulinExpanded ? "Réduire la section insuline" : "Développer la section insuline"}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[11px] tracking-[0.14em] text-white font-semibold">INSULINE</div>
                <div className="text-xs text-white/90 mt-0.5">Bolus associé au repas</div>
              </div>
              <div className={`text-white/90 text-xs transition-transform duration-200 ${mealInsulinExpanded ? "rotate-180" : ""}`}>▾</div>
            </div>
          </button>
          {mealInsulinExpanded ? (
            <div className="rounded-[14px] bg-[var(--color-mint)] border border-[var(--color-border-mint)] p-2 mt-1.5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div>
                  <div className="text-sm font-semibold text-[var(--color-text)]">Bolus associé</div>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">Ajouter la dose liée au repas</div>
                </div>
                <button type="button" onClick={() => setMealBolusEnabled(!mealBolusEnabled)} className={`w-12 h-7 rounded-full transition relative ${mealBolusEnabled ? "bg-[#1c8f84]" : "bg-[#c9d2d1]"}`} aria-pressed={mealBolusEnabled} aria-label="Activer ou désactiver le bolus associé">
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-[var(--color-mint)] transition-all ${mealBolusEnabled ? "left-6" : "left-1"}`} />
                </button>
              </div>
              {mealBolusEnabled ? (
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <div className="text-xs text-[var(--color-text-secondary)] mb-1">Unités</div>
                    <input value={mealBolusUnits} onChange={(event) => setMealBolusUnits(event.target.value)} className="w-full rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-border)] px-2.5 py-2 text-sm text-[var(--color-text)] outline-none" inputMode="decimal" />
                  </div>
                  <div>
                    <div className="text-xs text-[var(--color-text-secondary)] mb-1">Timing</div>
                    <div className="flex flex-col gap-1">
                      {["Avant repas", "Pendant repas", "Après repas"].map((item) => (
                        <button key={item} type="button" onClick={() => setMealBolusTiming(item)} className={`rounded-[10px] px-2.5 py-1.5 text-xs font-semibold text-left ${mealBolusTiming === item ? "bg-[#1c8f84] text-white" : "bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)]"}`}>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <div>
          <div className="text-[11px] tracking-[0.14em] text-[#2c4443] font-semibold mb-1">GLYCÉMIE ASSOCIÉE</div>
          <div className="rounded-[14px] bg-[var(--color-mint)] border border-[var(--color-border-mint)] p-2">
            <div className="flex mb-2">
              <button type="button" onClick={() => { setMealGlucoseMode("capteur"); setMealGlucoseValue(String(patient.lastReading)); onOpenSensorChoice?.(); }} className="w-full rounded-[12px] px-2.5 py-2 text-xs font-semibold bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm">
                Utiliser capteur
              </button>
            </div>
            <div className="rounded-[12px] bg-[var(--color-surface)] border border-[var(--color-border)] px-2.5 py-2">
              <div className="text-xs text-[var(--color-text-secondary)] mb-0.5">Valeur avant repas</div>
              <div className="flex items-end gap-2">
                <input value={mealGlucoseValue} onChange={(event) => setMealGlucoseValue(event.target.value)} className="w-full bg-transparent text-lg font-semibold text-[var(--color-text)] outline-none" inputMode="numeric" />
                <div className="text-xs text-[var(--color-text-secondary)] pb-0.5">mg/dL</div>
              </div>
              {mealGlucoseMode === "capteur" ? <div className="text-[11px] text-[var(--color-text-secondary)] mt-1">Dernière mesure capteur</div> : null}
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-0.5">
          <button type="button" onClick={onClose} className="flex-1 rounded-[14px] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white py-2 text-sm font-semibold border-transparent shadow-sm">Annuler</button>
          <button type="button" onClick={onSave} className="flex-1 rounded-[14px] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white py-2 text-sm font-semibold shadow-sm">Enregistrer</button>
        </div>
      </div>
    </Modal>
  );
}
