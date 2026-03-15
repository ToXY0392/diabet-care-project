import { useId, useRef, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Badge from "../../atoms/Badge";
import Breadcrumbs from "../../atoms/Breadcrumbs";
import Card from "../../molecules/Card";
import MessageComposer from "../../molecules/MessageComposer";
import SectionTitle from "../../molecules/SectionTitle";
import HeaderPill from "../../organisms/app-shell/HeaderPill";
import type { MeasureChartPoint } from "../../../features/diabetcare/hooks/useMeasureChart";
import type {
  AccountTab,
  Caregiver,
  CarnetEntry,
  ClinicalPatient,
  ConversationThread,
  DeviceConnection,
  DocumentItem,
  FollowUpView,
  HistoryRow,
  MeasurePeriod,
  MealSlot,
  NoteItem,
  PatientProfile,
  Role,
} from "../../../features/diabetcare/types";

type HeaderProps = {
  role: Role;
  patient: PatientProfile;
  clinicianInitials: string;
  onProfileClick: () => void;
};

function ScreenHeader({ role, patient, clinicianInitials, onProfileClick }: HeaderProps) {
  return <HeaderPill dateLabel="Mercredi 11 mars" initials={role === "patient" ? patient.initials : clinicianInitials} onProfileClick={onProfileClick} />;
}

type DashboardProps = HeaderProps & {
  patientThreads: ConversationThread[];
  onOpenMealModal: () => void;
  onOpenPriorityThread: (threadId: string) => void;
  onOpenMessagesList: () => void;
};

export function PatientDashboardTemplate({
  role,
  patient,
  clinicianInitials,
  patientThreads,
  onOpenMealModal,
  onOpenPriorityThread,
  onOpenMessagesList,
  onProfileClick,
}: DashboardProps) {
  const patientPriorityThread = patientThreads.find((thread) => thread.unread > 0) ?? patientThreads[0];

  return (
    <section className="pb-20" aria-label="Tableau de bord patient">
      <ScreenHeader role={role} patient={patient} clinicianInitials={clinicianInitials} onProfileClick={onProfileClick} />
      <SectionTitle title="Tableau de bord" />
      <div className="flex flex-col items-center text-center py-2" aria-label="Glycémie actuelle">
        <div className="text-[var(--text-section)] font-semibold text-[var(--color-text)] leading-tight">{patient.sensor}</div>
        <div className="relative mt-3">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] flex flex-col items-center justify-center shadow-md text-white">
              <div className="text-critical-number text-4xl font-bold leading-none">{patient.lastReading}</div>
              <div className="text-[var(--text-sm)] text-white/90 mt-1">mg/dL</div>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1">
              <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[10px] border-l-white drop-shadow-sm" aria-hidden />
          </div>
        </div>
        <div className="mt-3 text-[var(--text-section)] font-semibold text-[var(--color-text)] leading-tight">Stable · synchronisé {patient.syncAgo}</div>
      </div>
      <div className="flex justify-center mt-3 mb-3">
        <button type="button" onClick={onOpenMealModal} className="rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white px-7 py-2.5 font-semibold shadow-sm hover:shadow-md">
          Ajouter repas
        </button>
      </div>
      <section
        className="rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white p-3 shadow-sm"
        aria-labelledby="non-lu-heading"
        aria-describedby="non-lu-badge"
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <h2 id="non-lu-heading" className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] font-semibold text-white m-0">
            Messages non lus
          </h2>
          <span id="non-lu-badge" className="px-3 py-1 rounded-full text-[length:var(--text-xs)] font-semibold bg-[var(--color-mint)] text-[color:var(--color-teal-on-mint)]">
            {patientPriorityThread.unread} non lu{patientPriorityThread.unread > 1 ? "s" : ""}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onOpenPriorityThread(patientPriorityThread.id)}
          className="w-full rounded-[var(--radius-lg)] bg-[var(--color-mint)] border border-[var(--color-teal)]/20 p-3 text-left min-h-[44px]"
          aria-label={`Ouvrir la conversation avec ${patientPriorityThread.name}, ${patientPriorityThread.unread} message${patientPriorityThread.unread > 1 ? "s" : ""} non lu${patientPriorityThread.unread > 1 ? "s" : ""}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold text-[color:var(--color-text)] text-base leading-5 truncate">{patientPriorityThread.name}</div>
              <div className="text-[length:var(--text-sm)] text-[color:var(--color-text-secondary)] mt-1 truncate">{patientPriorityThread.preview}</div>
            </div>
            <div className="text-[length:var(--text-xs)] text-[color:var(--color-text-secondary)] shrink-0">{patientPriorityThread.time}</div>
          </div>
        </button>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            type="button"
            onClick={() => onOpenPriorityThread(patientPriorityThread.id)}
            className="rounded-[var(--radius-sm)] bg-[var(--color-mint)] text-[color:var(--color-teal-on-mint)] min-h-[44px] min-w-[44px] py-2 text-[length:var(--text-sm)] font-semibold border border-[var(--color-teal)]/20"
            aria-label={`Ouvrir la conversation avec ${patientPriorityThread.name}`}
          >
            Ouvrir
          </button>
          <button
            type="button"
            onClick={onOpenMessagesList}
            className="rounded-[var(--radius-sm)] bg-[var(--color-mint)] text-[color:var(--color-teal-on-mint)] min-h-[44px] min-w-[44px] py-2 text-[length:var(--text-sm)] font-semibold border border-[var(--color-teal)]/20"
            aria-label="Voir toutes les conversations"
          >
            Voir tout
          </button>
        </div>
      </section>
    </section>
  );
}

type SensorProps = HeaderProps & {
  patient: PatientProfile;
  deviceConnections: DeviceConnection[];
  onOpenProfile: () => void;
};

export function PatientSensorTemplate({ role, patient, clinicianInitials, deviceConnections, onOpenProfile, onProfileClick }: SensorProps) {
  const mainConnection = deviceConnections.find((c) => c.status === "Actif");
  const daysRemaining = patient.sensorDaysRemaining ?? 7;
  const daysTotal = patient.sensorDaysTotal ?? 10;
  const filledSegments = Math.min(Math.max(0, daysRemaining), daysTotal);

  const connectionCards: Array<{ id: string; icon: string; title: string; subtitle: string; onClick?: () => void }> = [
    {
      id: "capteur",
      icon: "sensor",
      title: patient.sensor,
      subtitle: mainConnection ? `${daysRemaining} jours restants · Sync ${mainConnection.lastSync}` : `${daysRemaining} jours restants`,
      onClick: onOpenProfile,
    },
    {
      id: "parametres",
      icon: "settings",
      title: "Paramètres du capteur",
      subtitle: "Configurer le capteur et les alertes.",
      onClick: onOpenProfile,
    },
  ];

  const availableCards: Array<{ id: string; icon: string; title: string; subtitle: string }> = [
    {
      id: "share",
      icon: "share",
      title: "Share",
      subtitle: "Permet aux amis et à la famille de consulter les mesures du capteur.",
    },
    {
      id: "health-connect",
      icon: "link",
      title: "Health Connect",
      subtitle: "Mis à jour : 14 mars 2026",
    },
  ];

  const ConnectionIcon = ({ type }: { type: string }) => {
    const iconWrap = "w-11 h-11 rounded-full bg-white/30 flex items-center justify-center shrink-0";
    if (type === "sensor") {
      return (
        <div className={iconWrap} aria-hidden>
          <div className="w-5 h-5 rounded-full bg-white" />
        </div>
      );
    }
    if (type === "chart") {
      return (
        <div className={iconWrap} aria-hidden>
          <div className="flex gap-0.5 items-end h-4">
            {[4, 6, 3].map((h, i) => <div key={i} className="w-1.5 bg-white rounded-t" style={{ height: `${h * 4}px` }} />)}
          </div>
        </div>
      );
    }
    if (type === "settings") {
      return (
        <div className={iconWrap} aria-hidden>
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
        </div>
      );
    }
    if (type === "link") {
      return (
        <div className={iconWrap} aria-hidden>
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
        </div>
      );
    }
    if (type === "share") {
      return (
        <div className={iconWrap} aria-hidden>
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" /></svg>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="pb-24" aria-label="Connexions">
      <ScreenHeader role={role} patient={patient} clinicianInitials={clinicianInitials} onProfileClick={onProfileClick} />
      <div className="mb-5">
        <h2 className="text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)] mb-3">Capteur connecté</h2>
        <div className="space-y-2">
          {connectionCards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={card.onClick}
              className="w-full rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] border-0 p-4 flex items-center gap-4 text-left text-white shadow-sm hover:shadow-md active:shadow-md transition-shadow"
            >
              <ConnectionIcon type={card.icon} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white">{card.title}</div>
                <div className="text-[var(--text-sm)] text-white/90 mt-0.5">{card.subtitle}</div>
                {card.id === "capteur" && (
                  <div className="mt-2 flex gap-0.5">
                    {Array.from({ length: daysTotal }).map((_, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-sm ${i < filledSegments ? "bg-white" : "bg-white/30"}`} aria-hidden />
                    ))}
                  </div>
                )}
              </div>
              <svg className="w-5 h-5 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M9 18l6-6-6-6" /></svg>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)] mb-3">Connexions disponibles</h2>
        <div className="space-y-2">
          {availableCards.map((card) => (
            <button
              key={card.id}
              type="button"
              className="w-full rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] border-0 p-4 flex items-center gap-4 text-left text-white shadow-sm hover:shadow-md active:shadow-md transition-shadow"
            >
              <ConnectionIcon type={card.icon} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white">{card.title}</div>
                <div className="text-[var(--text-sm)] text-white/90 mt-0.5">{card.subtitle}</div>
              </div>
              <svg className="w-5 h-5 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M9 18l6-6-6-6" /></svg>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

type MeasuresProps = HeaderProps & {
  role: Role;
  selectedClinicalPatient: ClinicalPatient;
  activeFollowUpView: FollowUpView;
  setActiveFollowUpView: (view: FollowUpView) => void;
  activeMeasurePeriod: MeasurePeriod;
  setActiveMeasurePeriod: (period: MeasurePeriod) => void;
  chart: {
    path: string;
    areaPath: string;
    points: MeasureChartPoint[];
    stats: { avg: number; min: number; max: number };
  };
  currentMeasureConfig: {
    xLabels: readonly string[];
  };
  visibleHistoryRows: HistoryRow[];
  historyExpanded: boolean;
  setHistoryExpanded: (value: boolean) => void;
  carnetEntries: CarnetEntry[];
  onOpenMealModal: () => void;
};

export function PatientMeasuresTemplate({
  role,
  patient,
  clinicianInitials,
  selectedClinicalPatient,
  activeFollowUpView,
  setActiveFollowUpView,
  activeMeasurePeriod,
  setActiveMeasurePeriod,
  chart,
  currentMeasureConfig,
  visibleHistoryRows,
  historyExpanded,
  setHistoryExpanded,
  carnetEntries,
  onOpenMealModal,
  onProfileClick,
}: MeasuresProps) {
  const measureGradientId = useId();

  if (activeFollowUpView === "carnet") {
    const MEAL_SLOTS: MealSlot[] = ["petit-dejeuner", "dejeuner", "diner", "en-cas"];
    const mealLabels: Record<MealSlot, string> = {
      "petit-dejeuner": "Petit-déjeuner",
      "dejeuner": "Déjeuner",
      "diner": "Dîner",
      "en-cas": "En-cas",
    };
    const rowTypes = [
      { key: "glucose" as const, label: "Glycémie", unit: "mg/dL" },
      { key: "bolus" as const, label: "Insuline rapide", unit: "u" },
      { key: "meal" as const, label: "Glucides", unit: "g" },
    ];
    const getCellEntry = (date: string, slot: MealSlot, moment: "avant" | "apres", kind: "glucose" | "bolus" | "meal") =>
      carnetEntries.find((e) => e.date === date && e.mealSlot === slot && e.moment === moment && e.kind === kind);
    const glucoseCellBg = (v: number) =>
      v > 250 ? "bg-[var(--color-danger)]/15 text-[var(--color-danger)]" : v > 180 ? "bg-[var(--color-warning)]/15 text-[var(--color-warning)]" : v < 70 ? "bg-[var(--color-danger)]/12 text-[var(--color-danger)]" : "bg-[var(--color-success)]/12 text-[var(--color-teal)]";
    const entriesByDate = carnetEntries.reduce<Record<string, CarnetEntry[]>>((acc, e) => {
      if (!e.mealSlot || !e.moment) return acc;
      if (!acc[e.date]) acc[e.date] = [];
      acc[e.date].push(e);
      return acc;
    }, {});
    const sortedDates = Object.keys(entriesByDate).sort((a, b) => b.localeCompare(a));
    const formatDateHeader = (iso: string) => {
      const [y, m, d] = iso.split("-").map(Number);
      const dObj = new Date(y, m - 1, d);
      return dObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    };

    return (
      <section className="pb-24 animate-[softTabSlide_0.2s_ease-out]" aria-label="Carnet diabète">
        <ScreenHeader role={role} patient={patient} clinicianInitials={clinicianInitials} onProfileClick={onProfileClick} />
        <div className="flex rounded-full bg-[#f1f5f6] border border-[var(--color-border)] p-1 mb-5">
          {[["jour", "Jour"], ["tendances", "Tendances"], ["carnet", "Carnet"]].map(([key, label]) => (
            <button key={key} type="button" onClick={() => setActiveFollowUpView(key as FollowUpView)} className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${activeFollowUpView === key ? "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm" : "text-[var(--color-inactive)]"}`}>
              {label}
            </button>
          ))}
        </div>
        <SectionTitle title="Carnet diabète" />
        <div className="space-y-5">
          {sortedDates.map((dateKey) => (
            <Card key={dateKey} variant="surfaceMint" className="p-0 overflow-hidden">
              <div className="bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white px-4 py-3 text-[var(--text-sm)] font-semibold capitalize">
                {formatDateHeader(dateKey)}
              </div>
              <div className="p-3 space-y-4 bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)]">
                {MEAL_SLOTS.map((slot) => (
                  <div key={slot} className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden">
                    <div className="bg-[var(--color-mint)] px-3 py-1.5 text-[var(--text-xs)] font-semibold text-[var(--color-text)]">
                      {mealLabels[slot]}
                    </div>
                    <table className="w-full border-collapse text-[var(--text-sm)]">
                      <thead>
                        <tr className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                          <th className="w-[5rem] p-2 text-left" scope="col"><span className="sr-only">Type</span></th>
                          <th className="w-1/2 p-2 text-center border-l border-[var(--color-border-subtle)]" scope="col">Avant</th>
                          <th className="w-1/2 p-2 text-center border-l border-[var(--color-border-subtle)]" scope="col">Après</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowTypes.map((row) => (
                          <tr key={row.key} className="border-t border-[var(--color-border-subtle)]">
                            <td className="p-1.5 align-middle text-[var(--text-xs)] font-medium text-[var(--color-text-secondary)]">
                              {row.label}
                            </td>
                            {(["avant", "apres"] as const).map((mom) => {
                              const entry = getCellEntry(dateKey, slot, mom, row.key);
                              if (row.key === "glucose" && entry?.value != null) {
                                const bg = glucoseCellBg(entry.value);
                                return (
                                  <td key={mom} className="p-1.5 align-middle w-1/2">
                                    <div className={`rounded-md px-2 py-1.5 text-center text-xs font-semibold tabular-nums ${bg}`}>
                                      {entry.value} {entry.unit}
                                    </div>
                                  </td>
                                );
                              }
                              if (row.key === "bolus" && entry?.value != null) {
                                return (
                                  <td key={mom} className="p-1.5 align-middle w-1/2">
                                    <div className="rounded-md bg-[var(--color-warning)]/12 px-2 py-1.5 text-center text-xs font-semibold tabular-nums text-[var(--color-text)]">
                                      {entry.value} u
                                    </div>
                                  </td>
                                );
                              }
                              if (row.key === "meal" && entry?.value != null) {
                                return (
                                  <td key={mom} className="p-1.5 align-middle w-1/2">
                                    <div className="rounded-md bg-[var(--color-danger)]/10 px-2 py-1.5 text-center text-xs font-semibold tabular-nums text-[var(--color-text)]">
                                      {entry.value} g
                                    </div>
                                  </td>
                                );
                              }
                              return (
                                <td key={mom} className="p-1.5 align-middle w-1/2">
                                  <div className="rounded-md border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-bg)]/50 py-1.5 min-h-[1.75rem]" aria-label="Vide" />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <button type="button" onClick={onOpenMealModal} className="rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white px-6 py-3.5 font-semibold shadow-md flex items-center gap-2">
            <Plus className="w-5 h-5" aria-hidden />
            Ajouter des données
          </button>
        </div>
      </section>
    );
  }

  if (activeFollowUpView === "tendances") {
    const periodTabs: Array<{ key: MeasurePeriod; label: string }> = [
      { key: "7j", label: "7 jours" },
      { key: "15j", label: "15 jours" },
      { key: "30j", label: "30 jours" },
      { key: "90j", label: "90 jours" },
    ];
    const trendStats = [
      { label: "Glycémie moyenne", value: "232", unit: "mg/dL", cardClass: "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm" },
      { label: "Bolus total", value: "6,37", unit: "u", cardClass: "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm" },
      { label: "Basal total", value: "23,76", unit: "u", cardClass: "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm" },
      { label: "Glucides", value: "3", unit: "g", cardClass: "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm" },
    ];
    const tirLegend = [
      { value: "1%", label: "<54", color: "#364ea1" },
      { value: "0%", label: "54-69", color: "#4aa0ff" },
      { value: "40%", label: "70-180", color: "#58c56d" },
      { value: "22%", label: "181-250", color: "#d9a41b" },
      { value: "38%", label: ">250", color: "#e04b42" },
    ];
    const trendCurve = [250, 228, 202, 186, 195, 228, 276, 305, 326, 334, 318, 306, 299, 291, 281, 271, 261, 244, 222, 198, 176, 183, 190, 188, 214, 248, 238, 269, 261, 257, 260, 278, 294, 286, 252];
    const weightCurve = [3.2, 3.2, 3.19, 3.18, 3.18, 3.17, 3.16, 3.16, 3.15, 3.15, 3.14, 3.14];
    const buildTrendPath = (series: number[], width: number, height: number, paddingTop: number, paddingBottom: number) => {
      const min = Math.min(...series);
      const max = Math.max(...series);
      const range = Math.max(max - min, 1);
      const points = series.map((value, index) => {
        const x = (index / (series.length - 1)) * width;
        const y = height - ((value - min) / range) * (height - paddingTop - paddingBottom) - paddingBottom;
        return { x, y };
      });
      const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
      const areaPath = `${path} L${width},${height} L0,${height} Z`;
      return { path, areaPath };
    };
    const trendChart = buildTrendPath(trendCurve, 310, 220, 18, 14);
    const weightChart = buildTrendPath(weightCurve, 310, 150, 18, 18);

    return (
      <section className="pb-24 animate-[softTabSlide_0.2s_ease-out]" aria-label="Tendances glycémiques">
        <ScreenHeader role={role} patient={patient} clinicianInitials={clinicianInitials} onProfileClick={onProfileClick} />
        <div className="flex rounded-full bg-[#f1f5f6] border border-[var(--color-border)] p-1 mb-5">
          {[
            ["jour", "Jour"],
            ["tendances", "Tendances"],
            ["carnet", "Carnet"],
          ].map(([key, label]) => (
            <button key={key} type="button" onClick={() => setActiveFollowUpView(key as FollowUpView)} className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${activeFollowUpView === key ? "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm" : "text-[var(--color-inactive)]"}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-2 mb-4">
          {periodTabs.map((tab) => {
            const isActive = activeMeasurePeriod === tab.key;
            return (
              <button key={tab.key} type="button" onClick={() => setActiveMeasurePeriod(tab.key)} className={`min-w-[60px] px-2.5 py-1.5 rounded-[14px] text-[12px] font-semibold transition ${isActive ? "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm" : "text-[var(--color-text)]"}`}>
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-4 gap-2 mb-5">
          {trendStats.map((item) => (
            <div key={item.label} className={`rounded-[22px] p-3 shadow-sm min-h-[112px] flex flex-col items-center justify-center text-center gap-2 ${item.cardClass}`}>
              <div className="text-[15px] font-bold leading-none">
                {item.value}
                <span className="text-[11px] font-semibold ml-0.5">{item.unit}</span>
              </div>
              <div className="text-[11px] leading-4 font-medium opacity-95">{item.label}</div>
            </div>
          ))}
        </div>
        <Card variant="surfaceMint" className="p-5 mb-5 hover:shadow-md active:shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-[var(--text-section)] text-[var(--color-muted-strong)]">◉</div>
            <div className="text-[var(--text-title)] font-semibold text-[var(--color-muted-strong)]">Temps dans la cible</div>
          </div>
          <div className="rounded-full overflow-hidden h-6 bg-[var(--color-mint)] mb-5 flex shadow-inner">
            <div className="bg-[#364ea1]" style={{ width: "1%" }} />
            <div className="bg-[#4aa0ff]" style={{ width: "0%" }} />
            <div className="bg-[#58c56d]" style={{ width: "40%" }} />
            <div className="bg-[#d9a41b]" style={{ width: "22%" }} />
            <div className="bg-[#e04b42]" style={{ width: "37%" }} />
          </div>
          <div className="grid grid-cols-5 gap-2 text-center mb-5">
            {tirLegend.map((item) => (
              <div key={item.label}>
                <div className="text-[15px] font-semibold" style={{ color: item.color }}>{item.value}</div>
                <div className="mt-1 h-1 rounded-full" style={{ backgroundColor: item.color }} />
                <div className="mt-1 text-[11px] text-[var(--color-muted)]">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm text-[var(--color-muted)]">
            {[["% des données recueillies par CGM", "69%"], ["HbA1c estimée", "0%"], ["GMI estimé", "0%"], ["Coefficient de variation", "38,21"]].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <div>{label}</div>
                <div className="font-semibold text-[var(--color-text)]">{value}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card variant="surfaceMint" className="p-5 mb-5 hover:shadow-md active:shadow-lg !bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-[var(--text-section)] text-white/95">◔</div>
            <div>
              <div className="text-[var(--text-title)] font-semibold text-white">Tendance glycémique</div>
              <div className="text-[var(--text-sm)] text-white/90 mt-1">mg/dL</div>
            </div>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-4 border border-[var(--color-border-subtle)]">
            <div className="relative w-full">
              {/* Barres en % du viewBox 310 pour scaling sans scroll */}
              {[(26 / 310) * 100, (92 / 310) * 100, (184 / 310) * 100, (250 / 310) * 100].map((pct) => (
                <div key={pct} className="absolute top-0 h-full bg-[#dfe5e8]/70 rounded-md" style={{ left: `${pct}%`, width: `${(28 / 310) * 100}%` }} />
              ))}
              <svg viewBox="0 0 310 240" className="block w-full h-[260px] relative z-10" preserveAspectRatio="xMidYMid meet">
                  <title>Tendance glycémique</title>
                  {[24, 60, 96, 132, 168, 204].map((y) => <line key={y} x1="0" y1={y} x2="310" y2={y} stroke="#d7e3e1" strokeWidth="1" />)}
                  <defs>
                    <linearGradient id="trendAreaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7ccfbe" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#7ccfbe" stopOpacity="0.08" />
                    </linearGradient>
                  </defs>
                  <path d={trendChart.areaPath} fill="url(#trendAreaFill)" />
                  <path d={trendChart.path} fill="none" stroke="#1c8f84" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="mt-2 flex items-center justify-between text-[12px] text-[var(--color-text-secondary)] px-1">{["0h", "4h", "8h", "12h", "16h", "20h", "24h"].map((label) => <span key={label}>{label}</span>)}</div>
              <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)] flex flex-wrap items-center justify-center gap-4 text-[12px] text-[var(--color-text-secondary)]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)]" aria-hidden />
                  70–180 cible
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[var(--color-danger)]" aria-hidden />
                  Hypo
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 shrink-0 bg-[var(--color-warning)]" style={{ transform: "rotate(45deg)" }} aria-hidden />
                  Hyper
                </span>
              </div>
          </div>
        </Card>
        <Card variant="surfaceMint" className="p-5 hover:shadow-md active:shadow-lg !bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-[var(--text-section)] text-white/95">⚖</div>
            <div>
              <div className="text-[var(--text-title)] font-semibold text-white">Tendance de poids</div>
              <div className="text-[var(--text-sm)] text-white/90 mt-1">kg</div>
            </div>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-4 border border-[var(--color-border-subtle)] relative overflow-hidden min-h-[220px]">
            <svg viewBox="0 0 310 170" className="w-full h-[180px] opacity-40">
              <title>Tendance de poids</title>
              {[24, 58, 92, 126].map((y) => <line key={y} x1="0" y1={y} x2="310" y2={y} stroke="#d7e3e1" strokeWidth="1" />)}
              <path d={weightChart.path} fill="none" stroke="#8fc9bc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button type="button" className="pointer-events-auto rounded-full bg-[var(--color-teal)] text-white px-6 py-3 font-semibold shadow-md flex items-center gap-2" aria-label="Ajouter des données de poids">
                Ajouter des données <span className="text-xl leading-none">+</span>
              </button>
            </div>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="pb-24 animate-[softTabSlide_0.2s_ease-out]" aria-label="Suivi patient">
      <ScreenHeader role={role} patient={patient} clinicianInitials={clinicianInitials} onProfileClick={onProfileClick} />
      <div className="flex rounded-full bg-[#f1f5f6] border border-[var(--color-border)] p-1 mb-5">
        {[["jour", "Jour"], ["tendances", "Tendances"], ["carnet", "Carnet"]].map(([key, label]) => (
          <button key={key} type="button" onClick={() => setActiveFollowUpView(key as FollowUpView)} className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${activeFollowUpView === key ? "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm" : "text-[var(--color-inactive)]"}`}>
            {label}
          </button>
        ))}
      </div>
      <SectionTitle title={role === "patient" ? "Suivi" : `Suivi · ${selectedClinicalPatient.name}`} />
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[{ label: "Glycémie moyenne", value: `${chart.stats.avg}`, unit: "mg/dL" }, { label: "Bolus total", value: "0", unit: "u" }, { label: "Basal total", value: "6,5", unit: "u" }, { label: "Glucides", value: "0", unit: "g" }].map((item) => (
          <div key={item.label} className="rounded-[22px] p-4 text-white shadow-sm bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)]">
            <div className="text-critical-number text-3xl font-bold leading-none">{item.value}<span className="text-xl font-semibold ml-1">{item.unit}</span></div>
            <div className="mt-4 text-base leading-6 opacity-95">{item.label}</div>
          </div>
        ))}
      </div>
      <Card variant="surfaceMint" className="p-4 mb-3 hover:shadow-md active:shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">◉</div>
          <div className="text-[var(--text-title)] font-semibold text-[var(--color-muted-strong)]">Temps dans la cible</div>
        </div>
        <div className="rounded-full overflow-hidden h-6 bg-[var(--color-mint)] mb-5 flex">
          <div className="bg-[#364ea1]" style={{ width: "0%" }} />
          <div className="bg-[#4aa0ff]" style={{ width: "0%" }} />
          <div className="bg-[#58c56d]" style={{ width: "81%" }} />
          <div className="bg-[#e7b40d]" style={{ width: "19%" }} />
          <div className="bg-[#e04b42]" style={{ width: "0%" }} />
        </div>
        <div className="grid grid-cols-5 gap-2 text-center mb-5">
          {[["0%", "<54", "#364ea1"], ["0%", "54-69", "#4aa0ff"], ["81%", "70-180", "#67b96a"], ["19%", "181-250", "#e7b40d"], ["0%", ">250", "#e04b42"]].map(([value, label, color]) => (
            <div key={label}>
              <div className="text-[16px] font-semibold" style={{ color }}>{value}</div>
              <div className="mt-1 h-1 rounded-full" style={{ backgroundColor: color }} />
              <div className="mt-1 text-[11px] text-[var(--color-muted)]">{label}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-[var(--color-muted)]"><div>% des données recueillies par CGM</div><div className="font-semibold">27%</div></div>
      </Card>
      <Card variant="surfaceMint" className="p-5 mb-5 hover:shadow-md active:shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">◔</div>
            <div>
              <div className="text-[var(--text-title)] font-semibold text-[var(--color-muted-strong)]">Glycémies</div>
              <div className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-1">mg/dL</div>
            </div>
          </div>
          <button type="button" onClick={onOpenMealModal} className="w-9 h-9 rounded-full bg-[var(--color-teal)] text-white flex items-center justify-center" title="Ajouter un repas" aria-label="Ajouter un repas">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="rounded-2xl bg-white p-4 border border-[var(--color-border)] shadow-sm">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">mg/dL</span>
            <span className="text-xs text-[var(--color-text-secondary)]">70–180 cible</span>
          </div>
          <div className="relative flex gap-3">
            <div className="flex flex-col justify-between text-[11px] font-medium text-[var(--color-text-secondary)] tabular-nums shrink-0 pt-0.5 pb-6">
              <span>{chart.stats.max}</span>
              <span>{Math.round((chart.stats.max + chart.stats.min) / 2)}</span>
              <span>{chart.stats.min}</span>
            </div>
            <div className="relative flex-1 min-w-0">
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[18%] bg-[var(--color-danger)]/10" />
                <div className="absolute inset-x-0 top-[18%] h-[64%] bg-[var(--color-success)]/8" />
                <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[var(--color-warning)]/12" />
              </div>
              <svg viewBox="0 0 310 190" className="w-full h-[220px] relative z-10" aria-labelledby="glycemia-chart-title">
                <title id="glycemia-chart-title">Courbe des glycémies</title>
                <defs>
                  <linearGradient id={measureGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1c8f84" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#1c8f84" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[20, 55, 90, 125, 160].map((y) => (
                  <line key={y} x1="0" y1={y} x2="310" y2={y} stroke="var(--color-border-subtle)" strokeWidth="1" strokeDasharray="4 4" />
                ))}
                <path d={chart.areaPath} fill={`url(#${measureGradientId})`} />
                <path d={chart.path} fill="none" stroke="#1c8f84" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="mt-1 flex justify-between text-[13px] font-medium text-[var(--color-text)]">{currentMeasureConfig.xLabels.map((label) => <span key={label}>{label}</span>)}</div>
          <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)] flex flex-wrap items-center justify-center gap-4 text-[12px] text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)]" aria-hidden />
              70–180 cible
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[var(--color-danger)]" aria-hidden />
              Hypo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 shrink-0 bg-[var(--color-warning)]" style={{ transform: "rotate(45deg)" }} aria-hidden />
              Hyper
            </span>
          </div>
        </div>
      </Card>
      <Card variant="surfaceMint" className="p-5 mb-5 hover:shadow-md active:shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">✎</div>
            <div className="text-[var(--text-title)] font-semibold text-[var(--color-muted-strong)]">Injections d'insuline & glucides</div>
          </div>
          <button type="button" onClick={onOpenMealModal} className="w-9 h-9 rounded-full bg-[var(--color-teal)] text-white flex items-center justify-center" title="Ajouter un repas" aria-label="Ajouter un repas">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="rounded-[24px] bg-[var(--color-surface)] p-4 border border-[var(--color-border-subtle)]">
          <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)] mb-3"><span>u/h</span><span>u</span></div>
          <div className="relative h-[180px]">
            <div className="absolute inset-x-0 bottom-4 h-[2px] bg-[#4b9fb7]" />
            {[12, 32, 54, 77, 102, 128, 164, 188, 215, 242, 268, 296].map((x) => <div key={x} className="absolute bottom-0 w-[2px] h-3 bg-[#c8d2d1]" style={{ left: `${x}px` }} />)}
          </div>
          <div className="mt-2 flex items-center justify-between text-[12px] text-[var(--color-text-secondary)]"><span>0h</span><span>4h</span><span>8h</span><span>12h</span><span>16h</span><span>20h</span><span>24h</span></div>
          <div className="mt-5 flex items-center justify-end gap-5 text-sm text-[var(--color-muted)]">
            {["Glucides", "Bolus", "Basal"].map((label) => (
              <div key={label} className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[var(--color-teal)] inline-block" />{label}</div>
            ))}
          </div>
        </div>
      </Card>
      <Card variant="surface" className="p-5 hover:shadow-md active:shadow-lg">
        <button type="button" onClick={() => setHistoryExpanded(!historyExpanded)} className="w-full flex items-center justify-between gap-3 text-left text-white" aria-label={historyExpanded ? "Réduire l'historique des mesures" : "Développer l'historique des mesures"} aria-expanded={historyExpanded}>
          <div className="text-xs tracking-[0.2em] text-white font-semibold">HISTORIQUE DES MESURES</div>
          <div className={`text-white/90 text-sm transition-transform duration-200 ${historyExpanded ? "rotate-180" : ""}`}>▾</div>
        </button>
        <div className="space-y-3 mt-4">
          {visibleHistoryRows.map((row) => (
            <div key={`${row.time}-${row.value}`} className="rounded-[22px] bg-[var(--color-mint)] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-[var(--color-text)]">{row.value} mg/dL</div>
                  <div className="text-sm text-[var(--color-text-secondary)] mt-1">{row.status} · {row.note}</div>
                </div>
                <div className="text-sm text-[var(--color-text-secondary)]">{row.time}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

type ExchangesProps = HeaderProps & {
  role: Role;
  selectedClinicalPatient: ClinicalPatient;
  activeExchangeTab: "messages" | "documents";
  setActiveExchangeTab: (tab: "messages" | "documents") => void;
  messageViewMode: "list" | "thread";
  setMessageViewMode: (mode: "list" | "thread") => void;
  selectedThread: ConversationThread;
  selectedThreadId: string;
  setSelectedThreadId: (id: string) => void;
  visibleThreads: ConversationThread[];
  messagesCardExpanded: boolean;
  setMessagesCardExpanded: (value: boolean) => void;
  providerDocuments: DocumentItem[];
  patientDocuments: DocumentItem[];
  selectedDocument: DocumentItem;
  documentViewMode: "list" | "detail";
  setDocumentViewMode: (mode: "list" | "detail") => void;
  setSelectedDocumentId: (id: string) => void;
  availableCaregivers: Caregiver[];
  onStartNewConversation: (caregiver: Caregiver) => void;
};

export function PatientExchangesTemplate({
  role,
  patient,
  clinicianInitials,
  selectedClinicalPatient,
  activeExchangeTab,
  setActiveExchangeTab,
  messageViewMode,
  setMessageViewMode,
  selectedThread,
  selectedThreadId,
  setSelectedThreadId,
  visibleThreads,
  messagesCardExpanded,
  setMessagesCardExpanded,
  providerDocuments,
  patientDocuments,
  selectedDocument,
  documentViewMode,
  setDocumentViewMode,
  setSelectedDocumentId,
  availableCaregivers,
  onStartNewConversation,
  onProfileClick,
}: ExchangesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [callBooked, setCallBooked] = useState(false);
  const [showCaregiverSearch, setShowCaregiverSearch] = useState(false);
  const [caregiverSearchQuery, setCaregiverSearchQuery] = useState("");

  useEffect(() => {
    if (messageViewMode === "thread" && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageViewMode, selectedThread.id]);

  const renderMessagesContent = () => {
    if (messageViewMode === "thread") {
      const messages = selectedThread.messages;
      const grouped: { date: string; items: typeof messages }[] = [];
      for (const msg of messages) {
        const d = msg.date ?? "";
        if (grouped.length === 0 || grouped[grouped.length - 1].date !== d) {
          grouped.push({ date: d, items: [msg] });
        } else {
          grouped[grouped.length - 1].items.push(msg);
        }
      }

      const StatusIcon = ({ status }: { status?: string }) => {
        if (status === "read") return <span className="text-[color:var(--color-teal)] text-[10px]">✓✓</span>;
        if (status === "delivered") return <span className="text-[color:var(--color-inactive)] text-[10px]">✓✓</span>;
        if (status === "sent") return <span className="text-[color:var(--color-inactive)] text-[10px]">✓</span>;
        return null;
      };

      return (
        <section className="h-full flex flex-col min-h-0" aria-label="Conversation">
          {/* Chat header */}
          <div className="flex items-center gap-3 pb-3 mb-1 shrink-0 border-b border-[var(--color-border)]">
            <button type="button" onClick={() => setMessageViewMode("list")} className="w-9 h-9 rounded-full bg-[var(--color-mint)] border border-[var(--color-border)] flex items-center justify-center text-[color:var(--color-text)] active:scale-95 transition" aria-label="Retour à la liste des conversations">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
            </button>
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white flex items-center justify-center text-sm font-semibold">{selectedThread.initials}</div>
              {selectedThread.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--color-success)] border-2 border-[var(--color-bg)]" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[length:var(--text-body)] font-semibold text-[color:var(--color-text)] truncate leading-tight">{selectedThread.name}</div>
              <div className="text-[length:var(--text-xs)] text-[color:var(--color-text-secondary)] mt-0.5">{selectedThread.online ? "En ligne" : "Hors ligne"}</div>
            </div>
            <button type="button" onClick={() => { setShowCallModal(true); setSelectedSlot(null); setCallBooked(false); }} className="w-9 h-9 rounded-full bg-[var(--color-mint)] border border-[var(--color-border)] flex items-center justify-center text-[color:var(--color-text)] active:scale-90 transition-transform" aria-label="Prendre rendez-vous téléphonique">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
            </button>
          </div>

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-1 pb-2 pt-3">
            {grouped.map((group) => (
              <div key={group.date}>
                {group.date && (
                  <div className="flex justify-center my-4">
                    <span className="px-3 py-1 rounded-full bg-[var(--color-surface-alt)] text-[length:var(--text-xs)] text-[color:var(--color-muted)] font-medium">{group.date}</span>
                  </div>
                )}
                {group.items.map((message, idx) => {
                  const isMe = message.side === "me";
                  const prev = group.items[idx - 1];
                  const next = group.items[idx + 1];
                  const sameSideAsPrev = prev?.side === message.side;
                  const sameSideAsNext = next?.side === message.side;
                  const isLastInGroup = !sameSideAsNext;

                  const radiusMe = `${sameSideAsPrev ? "8px" : "24px"} 24px 24px ${sameSideAsNext ? "8px" : "24px"}`;
                  const radiusThem = `24px ${sameSideAsPrev ? "8px" : "24px"} ${sameSideAsNext ? "8px" : "24px"} 24px`;

                  return (
                    <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"} ${sameSideAsPrev ? "mt-0.5" : "mt-3"}`}>
                      {!isMe && (
                        <div className="w-7 shrink-0 mr-1.5 self-end">
                          {isLastInGroup && (
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white flex items-center justify-center text-[9px] font-semibold">{selectedThread.initials}</div>
                          )}
                        </div>
                      )}
                      <div className={`max-w-[78%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                        <div
                          className={`px-3.5 py-2 text-[length:var(--text-sm)] leading-relaxed ${isMe ? "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white" : "bg-white border border-[var(--color-border)] text-[color:var(--color-text)]"}`}
                          style={{ borderRadius: isMe ? radiusMe : radiusThem }}
                        >
                          {message.text}
                        </div>
                        {isLastInGroup && (
                          <div className={`flex items-center gap-1 mt-0.5 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                            <span className="text-[10px] text-[color:var(--color-muted)]">{message.time}</span>
                            {isMe && <StatusIcon status={message.status} />}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="shrink-0 border-t border-[var(--color-border)]">
            <MessageComposer />
          </div>

          {/* Modal RDV telephonique */}
          {showCallModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 animate-[fadeInOverlay_0.2s_ease-out]">
              <style>{`
                @keyframes fadeInOverlay { from { opacity:0; } to { opacity:1; } }
                @keyframes slideUpModal { from { opacity:0; transform:translateY(24px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
              `}</style>
              <div role="dialog" aria-modal="true" aria-label="Prendre un rendez-vous téléphonique" className="w-[calc(100%-32px)] max-w-[340px] rounded-3xl bg-white border border-[var(--color-border)] shadow-2xl overflow-hidden animate-[slideUpModal_0.25s_ease-out]">
                {callBooked ? (
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-mint)] flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-teal)" className="w-8 h-8" aria-hidden="true"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                    </div>
                    <div className="text-lg font-semibold text-[color:var(--color-text)]">Rendez-vous confirme</div>
                    <div className="text-[length:var(--text-sm)] text-[color:var(--color-text-secondary)] mt-2">
                      Appel avec <span className="font-semibold text-[color:var(--color-text)]">{selectedThread.name}</span>
                    </div>
                    <div className="mt-1 text-[length:var(--text-sm)] font-semibold text-[color:var(--color-teal)]">{selectedSlot}</div>
                    <div className="text-[length:var(--text-xs)] text-[color:var(--color-muted)] mt-3">Vous recevrez un rappel 15 min avant l'appel.</div>
                    <button type="button" onClick={() => setShowCallModal(false)} className="mt-5 w-full rounded-2xl bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white py-3 font-semibold active:scale-[0.98] transition-transform">
                      Fermer
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold text-[color:var(--color-text)]">Rendez-vous telephonique</div>
                        <div className="text-[length:var(--text-sm)] text-[color:var(--color-text-secondary)] mt-1">Choisissez un creneau avec {selectedThread.name}</div>
                      </div>
                      <button type="button" onClick={() => setShowCallModal(false)} className="w-8 h-8 shrink-0 rounded-full bg-[var(--color-surface-alt)] flex items-center justify-center text-[color:var(--color-text-secondary)] active:scale-90 transition-transform" aria-label="Fermer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                      </button>
                    </div>
                    <div className="px-5 pb-2">
                      <div className="text-[length:var(--text-xs)] text-[color:var(--color-label)] font-semibold tracking-wide mb-2">AUJOURD'HUI</div>
                      <div className="grid grid-cols-3 gap-2">
                        {["10:00", "11:30", "14:00"].map((slot) => (
                          <button key={slot} type="button" onClick={() => setSelectedSlot(`Aujourd'hui a ${slot}`)} className={`rounded-xl py-2.5 text-[13px] font-semibold transition-all duration-150 active:scale-95 ${selectedSlot === `Aujourd'hui a ${slot}` ? "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm" : "bg-[var(--color-mint)] text-[color:var(--color-teal)] border border-[var(--color-border)]"}`}>
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="px-5 pb-2 pt-1">
                      <div className="text-[length:var(--text-xs)] text-[color:var(--color-label)] font-semibold tracking-wide mb-2">DEMAIN</div>
                      <div className="grid grid-cols-3 gap-2">
                        {["09:00", "10:30", "15:00", "16:30"].map((slot) => (
                          <button key={slot} type="button" onClick={() => setSelectedSlot(`Demain a ${slot}`)} className={`rounded-xl py-2.5 text-[13px] font-semibold transition-all duration-150 active:scale-95 ${selectedSlot === `Demain a ${slot}` ? "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm" : "bg-[var(--color-mint)] text-[color:var(--color-teal)] border border-[var(--color-border)]"}`}>
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="px-5 pt-3 pb-5">
                      <button type="button" onClick={() => { if (selectedSlot) setCallBooked(true); }} disabled={!selectedSlot} className="w-full rounded-2xl bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white py-3 font-semibold active:scale-[0.98] transition-transform disabled:opacity-40">
                        Confirmer le rendez-vous
                      </button>
                      <div className="text-center text-[length:var(--text-xs)] text-[color:var(--color-muted)] mt-2">Duree estimee : 10-15 min</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </section>
      );
    }

    const filteredCaregivers = availableCaregivers.filter(
      (c) =>
        c.name.toLowerCase().includes(caregiverSearchQuery.trim().toLowerCase()) ||
        (c.role ?? "").toLowerCase().includes(caregiverSearchQuery.trim().toLowerCase())
    );

    if (showCaregiverSearch) {
      return (
        <section aria-label="Choisir un soignant">
          <button type="button" onClick={() => { setShowCaregiverSearch(false); setCaregiverSearchQuery(""); }} className="mb-3 flex items-center gap-2 rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] border-transparent px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md active:scale-[0.985] transition-all" aria-label="Retour à la liste des messages">
            ← Retour
          </button>
          <div className="mb-3">
            <label htmlFor="caregiver-search" className="sr-only">Rechercher un soignant</label>
            <input
              id="caregiver-search"
              type="search"
              value={caregiverSearchQuery}
              onChange={(e) => setCaregiverSearchQuery(e.target.value)}
              placeholder="Rechercher par nom ou rôle..."
              className="caregiver-search-field w-full rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-inactive)] outline-none focus:border-[var(--color-teal)]"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            {filteredCaregivers.length === 0 ? (
              <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] py-4 text-center">Aucun soignant trouvé</p>
            ) : (
              filteredCaregivers.map((caregiver) => (
                <button
                  key={caregiver.id}
                  type="button"
                  onClick={() => {
                    onStartNewConversation(caregiver);
                    setShowCaregiverSearch(false);
                    setCaregiverSearchQuery("");
                  }}
                  className="w-full rounded-[18px] p-3 text-left bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm hover:shadow-md flex items-center gap-3"
                >
                  <div className="w-11 h-11 rounded-full bg-[var(--color-mint)] text-[var(--color-teal-on-mint)] flex items-center justify-center text-sm font-semibold shrink-0">
                    {caregiver.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white">{caregiver.name}</div>
                    {caregiver.role ? <div className="text-sm text-white/90 mt-0.5">{caregiver.role}</div> : null}
                  </div>
                </button>
              ))
            )}
          </div>
        </section>
      );
    }

    return (
      <section aria-label="Liste des conversations">
        <div className="mb-3">
          <Breadcrumbs items={[{ label: "Échanges" }, { label: "Messages" }]} />
        </div>
        <button type="button" onClick={() => setShowCaregiverSearch(true)} className="w-full rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white py-2.5 font-semibold shadow-sm mb-3 hover:shadow-md">Nouveau message</button>
        <Card variant="surface" className="p-5 mb-5 hover:shadow-md active:shadow-lg">
          <button type="button" onClick={() => setMessagesCardExpanded(!messagesCardExpanded)} className="w-full flex items-center justify-between gap-3 text-left" aria-label={messagesCardExpanded ? "Réduire les messages" : "Développer les messages"} aria-expanded={messagesCardExpanded}>
            <div>
              <div className="text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-label)] font-semibold">MES MESSAGES</div>
              <div className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-0.5">Conversations prioritaires et non lus</div>
            </div>
          </button>
          <div className="space-y-3 mt-4">
            {visibleThreads.length === 0 ? (
              <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] py-4 text-center">Aucune conversation</p>
            ) : visibleThreads.map((thread) => (
              <button key={thread.id} type="button" onClick={() => { setSelectedThreadId(thread.id); setMessageViewMode("thread"); }} className={`w-full rounded-[18px] p-3 text-left transition ${selectedThreadId === thread.id ? "bg-[#dfeceb] border border-[var(--color-border-strong)]" : "bg-[var(--color-mint)]"} hover:shadow-md`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-[var(--color-teal)] text-white flex items-center justify-center text-sm font-semibold shrink-0">{thread.initials}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="font-semibold text-[var(--color-text)]">{thread.name}</div>
                        {thread.unread > 0 ? <Badge tone="teal">{thread.unread} non lu{thread.unread > 1 ? "s" : ""}</Badge> : null}
                      </div>
                      <div className="text-sm text-[var(--color-text-secondary)] mt-1 truncate">{thread.preview}</div>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] shrink-0">{thread.time}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </section>
    );
  };

  const renderDocsContent = () => {
    if (documentViewMode === "detail") {
      return (
        <article>
          <div className="mb-3">
            <Breadcrumbs
              items={[
                { label: "Échanges" },
                { label: "Documents", onClick: () => { setDocumentViewMode("list"); setActiveExchangeTab("documents"); } },
                { label: selectedDocument.title },
              ]}
            />
          </div>
          <div className="flex items-center gap-3 mb-5">
            <button type="button" onClick={() => setDocumentViewMode("list")} className="w-10 h-10 rounded-full bg-[var(--color-mint)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)]" aria-label="Retour à la liste des documents">
              ←
            </button>
            <div>
              <div className="text-xl font-semibold text-[var(--color-text)]">{selectedDocument.title}</div>
              <div className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-1">{selectedDocument.category} · {selectedDocument.date}</div>
            </div>
          </div>
          <Card variant="surface" className="p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-label)] font-semibold">DOCUMENT</div>
              {selectedDocument.source === "soignant" ? <Badge tone="active">Envoyé par le soignant</Badge> : <Badge tone="info">Document patient</Badge>}
            </div>
            <div className="rounded-[24px] bg-[var(--color-mint)] p-5 text-[var(--color-text)] leading-7 text-[15px]">{selectedDocument.content}</div>
            <div className="mt-5 flex gap-3">
              <button type="button" className="flex-1 rounded-[18px] bg-[var(--color-teal)] text-white py-3 font-semibold">Télécharger</button>
              <button type="button" className="flex-1 rounded-[18px] bg-[var(--color-mint)] text-[var(--color-text)] py-3 font-semibold border border-[var(--color-border)]">Partager</button>
            </div>
          </Card>
        </article>
      );
    }

    return (
      <section aria-label="Documents">
        <div className="mb-3">
          <Breadcrumbs items={[{ label: "Échanges" }, { label: "Documents" }]} />
        </div>
        <SectionTitle title="Documents" subtitle={role === "patient" ? "Documents reçus et fichiers envoyés au soignant" : `Documents · ${selectedClinicalPatient.name}`} />
        <Card variant="surface" className="p-5 mb-5 hover:shadow-md active:shadow-lg">
          <div className="text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-label)] font-semibold mb-3">ENVOYÉS PAR LE SOIGNANT</div>
          <div className="space-y-3">
            {providerDocuments.length === 0 ? (
              <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] py-4 text-center">Aucun document reçu</p>
            ) : providerDocuments.map((document) => (
              <button key={document.id} type="button" onClick={() => { setSelectedDocumentId(document.id); setDocumentViewMode("detail"); }} className="w-full rounded-[22px] bg-[var(--color-mint)] p-4 text-left hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-semibold text-[var(--color-text)]">{document.title}</div>
                      {document.isNew ? <Badge tone="teal">Nouveau</Badge> : null}
                    </div>
                    <div className="text-sm text-[var(--color-text-secondary)] mt-1">{document.category} · {document.date}</div>
                  </div>
                  <div className="text-[var(--color-text-secondary)]">›</div>
                </div>
              </button>
            ))}
          </div>
        </Card>
        <Card variant="surface" className="p-5 mb-5 hover:shadow-md active:shadow-lg">
          <div className="text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-label)] font-semibold mb-3">DÉPOSER UN DOCUMENT</div>
          <div className="rounded-[22px] bg-[var(--color-mint)] p-5">
            <div className="text-[17px] font-semibold text-[var(--color-text)]">Envoyer un document au soignant</div>
            <div className="text-sm text-[var(--color-text-secondary)] mt-2">PDF, photo d'ordonnance, bilan glycémique ou résultat de laboratoire.</div>
            <div className="mt-4 flex gap-3">
              <button type="button" className="flex-1 rounded-[18px] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white py-3 font-semibold">Choisir un fichier</button>
              <button type="button" className="flex-1 rounded-[18px] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white py-3 font-semibold border border-transparent">Prendre une photo</button>
            </div>
          </div>
        </Card>
        <Card variant="surface" className="p-5 hover:shadow-md active:shadow-lg">
          <div className="text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-label)] font-semibold mb-3">MES DOCUMENTS ENVOYÉS</div>
          <div className="space-y-3">
            {patientDocuments.length === 0 ? (
              <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] py-4 text-center">Aucun document envoyé</p>
            ) : patientDocuments.map((document) => (
              <button key={document.id} type="button" onClick={() => { setSelectedDocumentId(document.id); setDocumentViewMode("detail"); }} className="w-full rounded-[22px] bg-[var(--color-mint)] p-4 text-left hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[var(--color-text)]">{document.title}</div>
                    <div className="text-sm text-[var(--color-text-secondary)] mt-1">{document.category} · envoyé le {document.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {document.status ? <Badge tone={document.status === "Consulté" || document.status === "Envoyé" ? "teal" : "neutral"}>{document.status}</Badge> : null}
                    <div className="text-[var(--color-text-secondary)]">›</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </section>
    );
  };

  if (messageViewMode === "thread") {
    return (
      <section aria-label="Conversation" className="h-full flex flex-col min-h-0">
        {renderMessagesContent()}
      </section>
    );
  }

  return (
    <section aria-label="Échanges">
      <ScreenHeader role={role} patient={patient} clinicianInitials={clinicianInitials} onProfileClick={onProfileClick} />
      <SectionTitle title="Échanges" subtitle="Messagerie et documents partagés avec le soignant" />
      <div className="mb-3 flex items-center justify-center">
        <div className="relative bg-[#f1f5f6] rounded-full p-1 flex gap-1 border border-[var(--color-border)] w-full overflow-hidden">
          <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-[var(--color-teal)] transition-all duration-200 ease-in-out ${activeExchangeTab === "messages" ? "left-1" : "left-[calc(50%+2px)]"}`} />
          <button type="button" onClick={() => setActiveExchangeTab("messages")} className={`relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.985] ${activeExchangeTab === "messages" ? "text-white" : "text-[var(--color-text-secondary)]"}`}>
            Messages
          </button>
          <button type="button" onClick={() => setActiveExchangeTab("documents")} className={`relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.985] ${activeExchangeTab === "documents" ? "text-white" : "text-[var(--color-text-secondary)]"}`}>
            Documents
          </button>
        </div>
      </div>
      <div className="relative overflow-hidden min-h-0 flex-1">
        {activeExchangeTab === "messages" ? <div className="animate-[slideFromLeft_0.2s_ease-in-out]">{renderMessagesContent()}</div> : <div className="animate-[slideFromRight_0.2s_ease-in-out]">{renderDocsContent()}</div>}
      </div>
    </section>
  );
}

type NotesProps = HeaderProps & {
  notes: NoteItem[];
};

export function PatientNotesTemplate({ role, patient, clinicianInitials, notes, onProfileClick }: NotesProps) {
  return (
    <section aria-label="Notes du soignant">
      <ScreenHeader role={role} patient={patient} clinicianInitials={clinicianInitials} onProfileClick={onProfileClick} />
      <SectionTitle title="Notes du soignant" subtitle="Commentaires cliniques et décisions de suivi partagés avec le patient" />
      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id} variant="surface" className="p-5 hover:shadow-md active:shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-[var(--color-text)]">{note.title}</div>
                <div className="text-sm text-[var(--color-text-secondary)] mt-1">{note.author} · {note.date}</div>
              </div>
              <Badge tone="info">Clinique</Badge>
            </div>
            <div className="mt-4 rounded-[24px] bg-white p-5 text-[var(--color-text)] leading-7 text-[15px]">{note.content}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}

type ProfileProps = HeaderProps & {
  patient: PatientProfile;
  activeAccountTab: AccountTab;
  setActiveAccountTab: (tab: AccountTab) => void;
};

export function PatientProfileTemplate({
  role,
  patient,
  clinicianInitials,
  activeAccountTab,
  setActiveAccountTab,
  onProfileClick,
}: ProfileProps) {
  return (
    <section aria-label="Compte patient">
      <ScreenHeader role={role} patient={patient} clinicianInitials={clinicianInitials} onProfileClick={onProfileClick} />
      <SectionTitle title="Compte" subtitle="Informations du patient et préférences de l’application" />
      <div className="mb-3 flex items-center justify-center">
        <div className="relative bg-[#f1f5f6] rounded-full p-1 flex gap-1 border border-[var(--color-border)] w-full overflow-hidden">
          <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] transition-all duration-200 ease-in-out ${activeAccountTab === "profil" ? "left-1" : "left-[calc(50%+2px)]"}`} />
          <button type="button" onClick={() => setActiveAccountTab("profil")} className={`relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.985] ${activeAccountTab === "profil" ? "text-white" : "text-[var(--color-text-secondary)]"}`}>
            Profil
          </button>
          <button type="button" onClick={() => setActiveAccountTab("parametres")} className={`relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.985] ${activeAccountTab === "parametres" ? "text-white" : "text-[var(--color-text-secondary)]"}`}>
            Paramètres
          </button>
        </div>
      </div>
      <div className="relative overflow-hidden min-h-[320px]">
        {activeAccountTab === "profil" ? (
          <div className="animate-[slideFromLeft_0.2s_ease-in-out] space-y-4">
            <Card variant="surface" className="p-4 hover:shadow-md active:shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[var(--color-mint)] flex items-center justify-center text-[var(--color-teal-on-mint)] text-xl font-semibold shrink-0">{patient.initials}</div>
                <div className="min-w-0">
                  <div className="text-xl font-semibold text-white truncate">{patient.name}</div>
                  <div className="text-sm text-white/90 mt-1">{patient.sensor}</div>
                  <div className="text-sm text-white/80 mt-1">Synchronisé {patient.syncAgo}</div>
                </div>
              </div>
            </Card>
            <div>
              <div className="text-xs tracking-[0.2em] text-[var(--color-label)] font-semibold mb-3">PARAMÈTRES</div>
              <div className="space-y-3">
                {[
                  { title: "Capteur connecté", desc: `${patient.sensor} · synchronisé ${patient.syncAgo}`, icon: "◉" },
                  { title: "Sources de données", desc: `${patient.source} · télésurveillance active`, icon: "▣" },
                  { title: "Notifications", desc: "Alertes hypo, hyper et messages médecin", icon: "◌" },
                  { title: "Confidentialité", desc: "Consentement actif et partage des données", icon: "◍" },
                  { title: "Sécurité", desc: "Accès au compte et protection des données", icon: "◎" },
                ].map((item) => (
                  <button key={item.title} type="button" className="w-full rounded-[20px] bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] border border-transparent text-white p-4 text-left flex items-center gap-3 hover:shadow-md">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-mint)] text-[var(--color-teal-on-mint)] flex items-center justify-center text-base shrink-0">{item.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white truncate">{item.title}</div>
                      <div className="text-sm text-white/90 mt-1 truncate">{item.desc}</div>
                    </div>
                    <div className="text-white shrink-0">›</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-[slideFromRight_0.2s_ease-in-out]">
            <Card variant="surface" className="p-5 hover:shadow-md active:shadow-lg">
              <div className="text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-label)] font-semibold">PARAMÈTRES</div>
              <div className="space-y-3 mt-4">
                {["Notifications", "Historique de synchronisation", "Documents partagés", "Sécurité du compte", "Déconnexion"].map((item, index) => (
                  <button key={item} type="button" className={`w-full rounded-[20px] ${index === 4 ? "bg-[#fff5f5] text-[#b45309] border border-[#f3d6d6]" : "bg-[var(--color-mint)] text-[var(--color-text)] border border-[var(--color-border)]"} p-4 text-left font-semibold hover:shadow-md`}>
                    {item}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
