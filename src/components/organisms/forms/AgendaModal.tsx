import { useState, useMemo, useEffect, useRef } from "react";
import type { Appointment } from "../../../features/diabetcare/types";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

/** Normalise une chaîne pour la recherche : sans accents, minuscules. */
function normalizeForSearch(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function formatMonthYear(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatTime(time: string): string {
  const [h, min] = time.split(":");
  return `${h}h${min}`;
}

function toDateAt(isoDate: string, time: string): Date {
  const [y, m, d] = isoDate.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);
  return new Date(y, m - 1, d, h, min, 0, 0);
}

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function getCalendarDays(year: number, month: number): { date: string; day: number; isCurrentMonth: boolean }[] {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const firstWeekday = first.getDay(); // 0=Dim, 1=Lun
  const startOffset = firstWeekday === 0 ? 6 : firstWeekday - 1; // Lundi = 0
  const days: { date: string; day: number; isCurrentMonth: boolean }[] = [];
  for (let i = 0; i < startOffset; i++) {
    const d = new Date(year, month - 1, 1 - (startOffset - i));
    days.push({ date: toISO(d.getFullYear(), d.getMonth() + 1, d.getDate()), day: d.getDate(), isCurrentMonth: false });
  }
  for (let d = 1; d <= last.getDate(); d++) {
    days.push({ date: toISO(year, month, d), day: d, isCurrentMonth: true });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month, i);
    days.push({ date: toISO(d.getFullYear(), d.getMonth() + 1, d.getDate()), day: d.getDate(), isCurrentMonth: false });
  }
  return days;
}

type AgendaModalProps = {
  open: boolean;
  appointments: Appointment[];
  onClose: () => void;
};

export default function AgendaModal({ open, appointments, onClose }: AgendaModalProps) {
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPatientName, setSelectedPatientName] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const uniquePatientNames = useMemo(() => {
    const names = new Set(appointments.map((a) => a.patientName));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [appointments]);

  const suggestions = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return [];
    const nq = normalizeForSearch(q);
    return uniquePatientNames
      .filter((name) => normalizeForSearch(name).includes(nq))
      .slice(0, 8);
  }, [uniquePatientNames, searchQuery]);

  const filteredAppointments = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return appointments;
    const nq = normalizeForSearch(q);
    return appointments.filter((rdv) => normalizeForSearch(rdv.patientName).includes(nq));
  }, [appointments, searchQuery]);

  const byDate = useMemo(
    () =>
      filteredAppointments.reduce<Record<string, Appointment[]>>((acc, rdv) => {
        if (!acc[rdv.date]) acc[rdv.date] = [];
        acc[rdv.date].push(rdv);
        return acc;
      }, {}),
    [filteredAppointments]
  );

  const { lastRdv, nextRdv } = useMemo(() => {
    if (!selectedPatientName) return { lastRdv: null as Appointment | null, nextRdv: null as Appointment | null };
    const now = new Date();
    const patientRdvs = appointments.filter((a) => a.patientName === selectedPatientName);
    const withDate = patientRdvs.map((rdv) => ({ rdv, at: toDateAt(rdv.date, rdv.time) }));
    const past = withDate.filter(({ at }) => at < now).sort((a, b) => b.at.getTime() - a.at.getTime());
    const future = withDate.filter(({ at }) => at >= now).sort((a, b) => a.at.getTime() - b.at.getTime());
    return {
      lastRdv: past[0]?.rdv ?? null,
      nextRdv: future[0]?.rdv ?? null,
    };
  }, [appointments, selectedPatientName]);

  useEffect(() => {
    if (searchQuery.trim() === "") setSelectedPatientName(null);
  }, [searchQuery]);

  useEffect(() => {
    if (open) {
      setSearchQuery("");
      setSelectedDate(null);
      setSelectedPatientName(null);
      const today = new Date();
      const firstDate = appointments.map((a) => a.date).sort()[0];
      if (firstDate) {
        setCurrentMonth(firstDate.slice(0, 7));
      } else {
        setCurrentMonth(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);
      }
    }
  }, [open, appointments]);

  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth() + 1;
  const todayISO = toISO(todayY, todayM, today.getDate());
  const displayMonth = currentMonth || `${todayY}-${String(todayM).padStart(2, "0")}`;
  const [y, m] = displayMonth.split("-").map(Number);
  const calendarDays = getCalendarDays(y, m);

  const prevMonth = () => {
    if (m === 1) setCurrentMonth(`${y - 1}-12`);
    else setCurrentMonth(`${y}-${String(m - 1).padStart(2, "0")}`);
  };
  const nextMonth = () => {
    if (m === 12) setCurrentMonth(`${y + 1}-01`);
    else setCurrentMonth(`${y}-${String(m + 1).padStart(2, "0")}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" aria-modal="true" role="dialog" aria-labelledby="agenda-title">
      <div className="w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col rounded-[var(--radius-xl)] bg-white border border-[var(--color-border)] shadow-xl">
        <div className="p-4 shrink-0 space-y-3 bg-gradient-to-r from-[var(--color-teal-deep)] to-[var(--color-teal-end)]">
          <div className="flex items-center justify-between gap-3">
            <h2 id="agenda-title" className="text-lg font-semibold text-white">
              Planning des rendez-vous
            </h2>
            <button type="button" onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center font-semibold shrink-0 hover:bg-white/30" aria-label="Fermer">
              ×
            </button>
          </div>
          <div className="flex gap-2">
            <div className="relative w-56 min-w-0">
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un patient"
                className="w-full rounded-[var(--radius-md)] border border-white/30 bg-white/95 px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Rechercher un patient"
                aria-autocomplete="list"
                aria-expanded={suggestions.length > 0 && searchQuery.trim().length > 0 && !selectedPatientName}
                aria-controls="agenda-patient-suggestions"
                id="agenda-patient-search"
              />
              {searchQuery.trim().length > 0 && !selectedPatientName && (
                <ul
                  id="agenda-patient-suggestions"
                  role="listbox"
                  className="absolute top-full left-0 right-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white shadow-lg list-none p-0 m-0"
                >
                  {suggestions.length === 0 ? (
                    <li className="px-3 py-2 text-sm text-[var(--color-text-secondary)]">Aucun patient trouvé</li>
                  ) : (
                    suggestions.map((name) => (
                      <li key={name} role="option">
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-mint)] focus:bg-[var(--color-mint)] focus:outline-none"
                          onClick={() => {
                            setSearchQuery(name);
                            setSelectedPatientName(name);
                            searchInputRef.current?.blur();
                          }}
                        >
                          {name}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="overflow-y-auto p-4 flex flex-col gap-4">
          {selectedPatientName && (
            <section className="shrink-0 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-mint)] p-4 space-y-3" aria-label="Dernier et prochain rendez-vous">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">{selectedPatientName}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)] mb-1">Dernier RDV</div>
                  {lastRdv ? (
                    <div className="text-sm text-[var(--color-text)]">
                      {formatDateLong(lastRdv.date)} · {formatTime(lastRdv.time)}
                      <span className="block text-[var(--color-text-secondary)]">{lastRdv.type}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--color-text-secondary)]">Aucun</p>
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)] mb-1">Prochain RDV</div>
                  {nextRdv ? (
                    <div className="text-sm text-[var(--color-text)]">
                      {formatDateLong(nextRdv.date)} · {formatTime(nextRdv.time)}
                      <span className="block text-[var(--color-text-secondary)]">{nextRdv.type}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--color-text-secondary)]">Aucun</p>
                  )}
                </div>
              </div>
            </section>
          )}
          {/* Calendrier */}
          <section className="shrink-0" aria-label="Calendrier">
            <div className="flex items-center justify-between gap-2 mb-2">
              <button type="button" onClick={prevMonth} className="w-9 h-9 rounded-full bg-[var(--color-mint)] text-[var(--color-text)] flex items-center justify-center font-semibold" aria-label="Mois précédent">
                ‹
              </button>
              <span className="text-base font-semibold text-[var(--color-text)] capitalize">{formatMonthYear(displayMonth)}</span>
              <button type="button" onClick={nextMonth} className="w-9 h-9 rounded-full bg-[var(--color-mint)] text-[var(--color-text)] flex items-center justify-center font-semibold" aria-label="Mois suivant">
                ›
              </button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {WEEKDAYS.map((wd) => (
                <div key={wd} className="py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
                  {wd}
                </div>
              ))}
              {calendarDays.map((cell) => {
                const hasRdv = !!byDate[cell.date];
                const isSelected = selectedDate === cell.date;
                const isToday = cell.date === todayISO;
                return (
                  <button
                    key={cell.date}
                    type="button"
                    onClick={() => setSelectedDate(cell.date)}
                    className={`
                      min-h-[36px] rounded-[var(--radius-md)] text-sm font-medium transition-all
                      ${!cell.isCurrentMonth ? "text-[var(--color-text-secondary)]/50" : "text-[var(--color-text)]"}
                      ${isSelected ? "bg-[var(--color-teal-deep)] text-white" : ""}
                      ${!isSelected && isToday ? "ring-1 ring-[var(--color-teal-deep)]" : ""}
                      ${!isSelected && hasRdv ? "bg-[var(--color-mint)]" : ""}
                      hover:opacity-90
                    `}
                  >
                    {cell.day}
                    {hasRdv && !isSelected && <span className="block w-1 h-1 rounded-full bg-[var(--color-teal-deep)] mx-auto mt-0.5" />}
                  </button>
                );
              })}
            </div>
            {selectedDate && (
              <button type="button" onClick={() => setSelectedDate(null)} className="mt-2 text-sm text-[var(--color-teal-deep)] font-medium hover:underline">
                Voir tous les rendez-vous
              </button>
            )}
          </section>

          {selectedDate && (
            <section className="shrink-0" aria-label="Rendez-vous du jour">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)] mb-2 capitalize">
                {formatDateLong(selectedDate)}
              </div>
              {byDate[selectedDate]?.length ? (
                <ul className="space-y-2 list-none p-0 m-0">
                  {[...(byDate[selectedDate] || [])]
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((rdv) => (
                      <li key={rdv.id} className="rounded-[var(--radius-md)] bg-[var(--color-mint)] border border-[var(--color-border)] p-3">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-semibold text-[var(--color-text)]">{formatTime(rdv.time)}</span>
                          <span className="text-xs text-[var(--color-text-secondary)]">{rdv.type}</span>
                        </div>
                        <div className="text-sm text-[var(--color-text)] mt-1">{rdv.patientName}</div>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)]">Aucun rendez-vous ce jour-là.</p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
