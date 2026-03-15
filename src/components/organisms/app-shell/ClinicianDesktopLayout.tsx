import type { ReactNode } from "react";
import type { ClinicianTab } from "../../../features/diabetcare/types";

type ClinicianDesktopLayoutProps = {
  children: ReactNode;
  roleSwitcher: ReactNode;
  modals?: ReactNode;
  activeTab: ClinicianTab;
  onNavigate: (tab: ClinicianTab) => void;
  onProfileClick: () => void;
  clinicianInitials: string;
};

const SIDEBAR_ITEMS: { key: ClinicianTab; label: string }[] = [
  { key: "cockpit", label: "Accueil" },
  { key: "patients", label: "Patients" },
  { key: "documents", label: "Documents" },
  { key: "echanges", label: "Messagerie" },
  { key: "notes", label: "Notes" },
  { key: "compte", label: "Compte" },
];

/** Layout PC/tablette pour la partie soignant : header horizontal, sidebar de navigation, zone de contenu. */
export default function ClinicianDesktopLayout({
  children,
  roleSwitcher,
  modals,
  activeTab,
  onNavigate,
  onProfileClick,
  clinicianInitials,
}: ClinicianDesktopLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <header className="shrink-0 flex items-center justify-between gap-4 h-14 px-4 lg:px-6 border-b border-[var(--color-teal-deep)]/30 bg-gradient-to-r from-[var(--color-teal-deep)] to-[var(--color-teal-end)]">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-white">DiabetCare</h1>
          <span className="text-[var(--text-sm)] text-white/90 hidden sm:inline">Soignant</span>
          {roleSwitcher}
        </div>
        <button
          type="button"
          onClick={onProfileClick}
          className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center text-white font-semibold text-sm shadow-sm hover:bg-white/35 transition-colors"
          aria-label="Ouvrir le compte"
        >
          {clinicianInitials}
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="w-56 shrink-0 border-r border-[var(--color-border)] bg-[#f8faf9] flex flex-col">
          <nav className="p-2 lg:p-3" aria-label="Navigation soignant">
            <ul className="space-y-0.5 list-none p-0 m-0">
              {SIDEBAR_ITEMS.map(({ key, label }) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => onNavigate(key)}
                    className={`w-full text-left rounded-[var(--radius-md)] py-2.5 px-3 text-[var(--text-sm)] font-medium transition ${activeTab === key ? "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm" : "text-[var(--color-text)] hover:bg-[var(--color-mint)]"}`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 min-w-0 overflow-auto bg-[var(--color-bg)] p-4 lg:p-6" aria-label="Contenu principal">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>

      {modals}
    </div>
  );
}
