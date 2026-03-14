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
        <div className="rounded-[20px] bg-[#E9F6F3] p-4">
          <div className="text-sm text-[#616f73] mb-2">Valeur manuelle</div>
          <input value={glycemiaInput} onChange={(event) => setGlycemiaInput(event.target.value)} className="w-full rounded-[16px] bg-white border border-[#dde5e7] px-4 py-3 text-[#233636] outline-none" inputMode="numeric" />
        </div>
        <button type="button" onClick={onManualSave} className="w-full rounded-[18px] bg-[#1c8f84] text-white py-3 font-semibold">Enregistrer manuellement</button>
        <button type="button" onClick={onUseSensor} className="w-full rounded-[18px] bg-[#E9F6F3] text-[#233636] py-3 font-semibold border border-[#dde5e7]">Utiliser capteur</button>
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
      <div className="space-y-3 max-h-[48vh] overflow-y-auto scrollbar-hide pr-1">
        <div>
          <div className="text-xs tracking-[0.18em] text-[#2c4443] font-semibold mb-2">REPAS</div>
          <div className="grid grid-cols-2 gap-2">
            {["Petit-déjeuner", "Déjeuner", "Dîner", "Collation"].map((item) => (
              <button key={item} type="button" onClick={() => setMealType(item)} className={`rounded-[14px] px-3 py-2 text-sm font-semibold transition-all duration-150 active:scale-[0.985] ${mealType === item ? "bg-[#1c8f84] text-white shadow-sm" : "bg-[#E9F6F3] text-[#5e7379] border border-[#dde5e7]"}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[18px] bg-[#E9F6F3] border border-[#e4ebed] p-3">
            <div className="text-sm text-[#616f73] mb-2">Heure</div>
            <input value={mealTime} onChange={(event) => setMealTime(event.target.value)} className="w-full rounded-[14px] bg-[#f7fafb] border border-[#dde5e7] px-3 py-2.5 text-[#233636] outline-none" />
          </div>
          <div className="meal-carbs-wrapper relative" ref={carbsDropdownRef}>
            <div className="meal-carbs-label mb-2">Glucides</div>
            <div className="flex items-end gap-2">
              <input
                id="meal-carbs-input"
                value={carbsInput}
                onChange={(event) => setCarbsInput(event.target.value)}
                onFocus={() => setCarbsDropdownOpen(true)}
                className="meal-carbs-field w-full"
                inputMode="numeric"
                placeholder="Choisir ou saisir"
              />
              <button
                type="button"
                onClick={() => setCarbsDropdownOpen((v) => !v)}
                className="shrink-0 w-9 h-[42px] rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:border-[var(--color-teal)] hover:text-[var(--color-teal)] transition-colors"
                aria-label="Ouvrir les suggestions"
                aria-expanded={carbsDropdownOpen}
              >
                <span className={`text-sm transition-transform duration-200 ${carbsDropdownOpen ? "rotate-180" : ""}`}>▾</span>
              </button>
              <div className="text-[var(--text-xs)] text-[var(--color-text-secondary)] pb-1 self-center">g</div>
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
          <button type="button" onClick={() => setMealInsulinExpanded(!mealInsulinExpanded)} className="w-full rounded-[18px] bg-[#E9F6F3] border border-[#e4ebed] p-3 text-left" aria-expanded={mealInsulinExpanded} aria-label={mealInsulinExpanded ? "Réduire la section insuline" : "Développer la section insuline"}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs tracking-[0.18em] text-[#2c4443] font-semibold">INSULINE</div>
                <div className="text-sm text-[#616f73] mt-1">Bolus associé au repas</div>
              </div>
              <div className={`text-[#616f73] text-sm transition-transform duration-200 ${mealInsulinExpanded ? "rotate-180" : ""}`}>▾</div>
            </div>
          </button>
          {mealInsulinExpanded ? (
            <div className="rounded-[18px] bg-[#E9F6F3] border border-[#e4ebed] p-3 mt-2">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <div className="font-semibold text-[#233636]">Bolus associé</div>
                  <div className="text-sm text-[#616f73] mt-1">Ajouter la dose liée au repas</div>
                </div>
                <button type="button" onClick={() => setMealBolusEnabled(!mealBolusEnabled)} className={`w-12 h-7 rounded-full transition relative ${mealBolusEnabled ? "bg-[#1c8f84]" : "bg-[#c9d2d1]"}`} aria-pressed={mealBolusEnabled} aria-label="Activer ou désactiver le bolus associé">
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-[#E9F6F3] transition-all ${mealBolusEnabled ? "left-6" : "left-1"}`} />
                </button>
              </div>
              {mealBolusEnabled ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-sm text-[#616f73] mb-2">Unités</div>
                    <input value={mealBolusUnits} onChange={(event) => setMealBolusUnits(event.target.value)} className="w-full rounded-[14px] bg-[#f7fafb] border border-[#dde5e7] px-3 py-2.5 text-[#233636] outline-none" inputMode="decimal" />
                  </div>
                  <div>
                    <div className="text-sm text-[#616f73] mb-2">Timing</div>
                    <div className="flex flex-col gap-2">
                      {["Avant repas", "Pendant repas", "Après repas"].map((item) => (
                        <button key={item} type="button" onClick={() => setMealBolusTiming(item)} className={`rounded-[12px] px-3 py-2 text-sm font-semibold text-left ${mealBolusTiming === item ? "bg-[#1c8f84] text-white" : "bg-[#f7fafb] text-[#233636] border border-[#dde5e7]"}`}>
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
          <div className="text-xs tracking-[0.18em] text-[#2c4443] font-semibold mb-2">GLYCÉMIE ASSOCIÉE</div>
          <div className="rounded-[18px] bg-[#E9F6F3] border border-[#e4ebed] p-3">
            <div className="flex mb-3">
              <button type="button" onClick={() => { setMealGlucoseMode("capteur"); setMealGlucoseValue(String(patient.lastReading)); onOpenSensorChoice?.(); }} className="w-full rounded-[14px] px-3 py-2.5 text-sm font-semibold bg-[#1c8f84] text-white">
                Utiliser capteur
              </button>
            </div>
            <div className="rounded-[14px] bg-[#f7fafb] border border-[#dde5e7] px-3 py-3">
              <div className="text-sm text-[#616f73] mb-1">Valeur avant repas</div>
              <div className="flex items-end gap-2">
                <input value={mealGlucoseValue} onChange={(event) => setMealGlucoseValue(event.target.value)} className="w-full bg-transparent text-[24px] font-semibold text-[#233636] outline-none" inputMode="numeric" />
                <div className="text-sm text-[#616f73] pb-1">mg/dL</div>
              </div>
              {mealGlucoseMode === "capteur" ? <div className="text-xs text-[#616f73] mt-1.5">Dernière mesure capteur</div> : null}
            </div>
          </div>
        </div>
        <div>
          <button type="button" onClick={() => setMealNotesExpanded(!mealNotesExpanded)} className="w-full rounded-[18px] bg-[#E9F6F3] border border-[#e4ebed] p-3 text-left" aria-expanded={mealNotesExpanded} aria-label={mealNotesExpanded ? "Réduire la section notes" : "Développer la section notes"}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs tracking-[0.18em] text-[#2c4443] font-semibold">NOTES</div>
                <div className="text-sm text-[#616f73] mt-1">Contexte clinique facultatif</div>
              </div>
              <div className={`text-[#616f73] text-sm transition-transform duration-200 ${mealNotesExpanded ? "rotate-180" : ""}`}>▾</div>
            </div>
          </button>
          {mealNotesExpanded ? (
            <div className="rounded-[18px] bg-[#E9F6F3] border border-[#e4ebed] p-3 mt-2">
              <button type="button" onClick={() => setMealUnusual(!mealUnusual)} className={`mb-3 rounded-full px-3 py-1.5 text-xs font-semibold ${mealUnusual ? "bg-[#1c8f84] text-white" : "bg-[#f7fafb] text-[#4d6260] border border-[#dde5e7]"}`}>
                {mealUnusual ? "Repas inhabituel" : "Marquer comme inhabituel"}
              </button>
              <textarea value={mealNote} onChange={(event) => setMealNote(event.target.value)} className="w-full min-h-[72px] rounded-[14px] bg-[#f7fafb] border border-[#dde5e7] px-3 py-2.5 text-[#233636] outline-none resize-none" placeholder="Notes cliniques ou contexte du repas" />
            </div>
          ) : null}
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 rounded-[16px] bg-[#E9F6F3] text-[#233636] py-2.5 font-semibold border border-[#dde5e7]">Annuler</button>
          <button type="button" onClick={onSave} className="flex-1 rounded-[16px] bg-[#1c8f84] text-white py-2.5 font-semibold">Enregistrer</button>
        </div>
      </div>
    </Modal>
  );
}
