import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import ReactDOM from "react-dom";
import { FileText, Home, Menu, MessageSquare, StickyNote, User, Users } from "lucide-react";
import type { ClinicianTab } from "../../../features/diabetcare/types";
import Footer from "./Footer";

type ClinicianDesktopLayoutProps = {
  children: ReactNode;
  roleSwitcher: ReactNode;
  modals?: ReactNode;
  activeTab: ClinicianTab;
  onNavigate: (tab: ClinicianTab) => void;
  onProfileClick: () => void;
  /** Déconnexion soignant : retour au rôle patient. Si fourni, le bouton compte affiche un menu Compte / Déconnexion. */
  onLogout?: () => void;
  clinicianInitials: string;
};

const MAIN_NAV_ITEMS: { key: ClinicianTab; label: string; icon: ReactNode }[] = [
  { key: "cockpit", label: "Accueil", icon: <Home className="w-3.5 h-3.5 shrink-0" strokeWidth={2} /> },
];

const DROPDOWN_NAV_ITEMS: { key: ClinicianTab; label: string; icon: ReactNode }[] = [
  { key: "patients", label: "Patients", icon: <Users className="w-4 h-4 shrink-0" strokeWidth={2} /> },
  { key: "documents", label: "Documents", icon: <FileText className="w-4 h-4 shrink-0" strokeWidth={2} /> },
  { key: "echanges", label: "Messagerie", icon: <MessageSquare className="w-4 h-4 shrink-0" strokeWidth={2} /> },
  { key: "notes", label: "Notes", icon: <StickyNote className="w-4 h-4 shrink-0" strokeWidth={2} /> },
  { key: "compte", label: "Compte", icon: <User className="w-4 h-4 shrink-0" strokeWidth={2} /> },
];

/** Layout PC/tablette pour la partie soignant : header horizontal, sidebar de navigation, zone de contenu. */
export default function ClinicianDesktopLayout({
  children,
  roleSwitcher,
  modals,
  activeTab,
  onNavigate,
  onProfileClick,
  onLogout,
  clinicianInitials,
}: ClinicianDesktopLayoutProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownAnimate, setDropdownAnimate] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; right: number } | null>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [accountMenuAnimate, setAccountMenuAnimate] = useState(false);
  const [accountMenuPosition, setAccountMenuPosition] = useState<{ top: number; right: number } | null>(null);
  const accountTriggerRef = useRef<HTMLButtonElement>(null);
  const accountPanelRef = useRef<HTMLDivElement>(null);

  const isDropdownTab = (DROPDOWN_NAV_ITEMS as { key: ClinicianTab }[]).some(({ key }) => key === activeTab);

  const handleNavigate = (key: ClinicianTab) => {
    onNavigate(key);
    setDropdownOpen(false);
  };

  useEffect(() => {
    if (!dropdownOpen) {
      setDropdownAnimate(false);
      return;
    }
    const raf = requestAnimationFrame(() => setDropdownAnimate(true));
    return () => cancelAnimationFrame(raf);
  }, [dropdownOpen]);

  useLayoutEffect(() => {
    if (!dropdownOpen) {
      setDropdownPosition(null);
      return;
    }
    if (!triggerRef.current) return;
    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    };
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent) {
        if (e.key === "Escape") setDropdownOpen(false);
        return;
      }
      const target = e.target as Node;
      if (dropdownRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", close, true);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close, true);
      document.removeEventListener("keydown", close);
    };
  }, [dropdownOpen]);

  // Menu compte : ouverture / position / animation
  useEffect(() => {
    if (!accountMenuOpen) {
      setAccountMenuAnimate(false);
      return;
    }
    const raf = requestAnimationFrame(() => setAccountMenuAnimate(true));
    return () => cancelAnimationFrame(raf);
  }, [accountMenuOpen]);

  useLayoutEffect(() => {
    if (!accountMenuOpen) {
      setAccountMenuPosition(null);
      return;
    }
    if (!accountTriggerRef.current) return;
    const updatePosition = () => {
      if (!accountTriggerRef.current) return;
      const rect = accountTriggerRef.current.getBoundingClientRect();
      setAccountMenuPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    };
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [accountMenuOpen]);

  useEffect(() => {
    if (!accountMenuOpen) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent) {
        if (e.key === "Escape") setAccountMenuOpen(false);
        return;
      }
      const target = e.target as Node;
      if (accountTriggerRef.current?.contains(target) || accountPanelRef.current?.contains(target)) return;
      setAccountMenuOpen(false);
    };
    document.addEventListener("click", close, true);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close, true);
      document.removeEventListener("keydown", close);
    };
  }, [accountMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <header className="shrink-0 flex items-center justify-between gap-3 h-12 px-3 lg:px-4 border-b border-[var(--color-teal-deep)]/30 bg-gradient-to-r from-[var(--color-teal-deep)] to-[var(--color-teal-end)]">
        <div className="flex items-center gap-3 shrink-0">
          <h1 className="text-base font-semibold text-white">DiabetCare</h1>
          <span className="text-xs text-white/90 hidden sm:inline">Soignant</span>
          {roleSwitcher}
        </div>
        <div className="flex items-center gap-1 shrink-0 pl-2 border-l border-white/20">
          <nav className="flex items-center min-w-0" aria-label="Navigation soignant">
            <ul className="flex items-center gap-0.5 list-none p-0 m-0 shrink-0">
            {MAIN_NAV_ITEMS.map(({ key, label, icon }) => {
              const isActive = activeTab === key;
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => onNavigate(key)}
                    className={`flex items-center gap-1.5 rounded-lg py-1.5 px-2.5 text-xs font-medium transition-all duration-150 whitespace-nowrap ${isActive ? "bg-white/25 text-white" : "text-white/90 hover:bg-white/15 hover:text-white"}`}
                    aria-current={isActive ? "page" : undefined}
                    title={label}
                  >
                    <span aria-hidden>{icon}</span>
                    <span className="hidden md:inline">{label}</span>
                  </button>
                </li>
              );
            })}
            <li className="relative" ref={dropdownRef}>
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className={`flex items-center justify-center rounded-lg p-2 text-xs font-medium transition-all duration-150 ${isDropdownTab ? "bg-white/25 text-white" : "text-white/90 hover:bg-white/15 hover:text-white"}`}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-label={dropdownOpen ? "Fermer le menu" : "Ouvrir le menu"}
                title="Menu"
              >
                <Menu className="w-5 h-5 shrink-0" strokeWidth={2} aria-hidden />
              </button>
              {dropdownOpen &&
                dropdownPosition &&
                ReactDOM.createPortal(
                  <div
                    ref={panelRef}
                    className={`nav-dropdown-panel fixed z-[9999] min-w-[160px] rounded-xl border border-[var(--color-border)]/80 bg-white/75 backdrop-blur-sm shadow-lg py-1 ${dropdownAnimate ? "nav-dropdown-panel--animate" : ""}`}
                    style={{ top: dropdownPosition.top, right: dropdownPosition.right }}
                    role="menu"
                  >
                    {DROPDOWN_NAV_ITEMS.map(({ key, label, icon }) => (
                      <button
                        key={key}
                        type="button"
                        role="menuitem"
                        onClick={() => handleNavigate(key)}
                        className={`w-full flex items-center gap-3 rounded-lg mx-1 py-2.5 px-3 text-left text-sm font-medium transition-colors ${activeTab === key ? "bg-[var(--color-mint)] text-[var(--color-teal)]" : "text-[var(--color-text)] hover:bg-[var(--color-mint)]"}`}
                      >
                        <span className="text-[var(--color-teal)]">{icon}</span>
                        {label}
                      </button>
                    ))}
                  </div>,
                  document.body
                )}
            </li>
          </ul>
        </nav>
          {/* Menu déroulant Compte / Déconnexion quand le soignant est connecté */}
          <>
            <button
              ref={accountTriggerRef}
              type="button"
              onClick={() => setAccountMenuOpen((open) => !open)}
              className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center text-white font-semibold text-xs hover:bg-white/35 transition-colors shrink-0"
              aria-label="Compte et déconnexion"
              aria-expanded={accountMenuOpen}
              aria-haspopup="true"
            >
              {clinicianInitials}
            </button>
            {accountMenuOpen && accountMenuPosition &&
              ReactDOM.createPortal(
                <div
                  ref={accountPanelRef}
                  className={`fixed z-[100] min-w-[160px] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white/95 shadow-lg backdrop-blur-sm py-1 ${accountMenuAnimate ? "nav-dropdown-panel" : "opacity-0 -translate-y-1"}`}
                  style={{ top: accountMenuPosition.top, right: accountMenuPosition.right }}
                  role="menu"
                  aria-label="Menu compte"
                >
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-mint)]/50"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      onProfileClick();
                    }}
                  >
                    Compte
                  </button>
                  {onLogout && (
                    <button
                      type="button"
                      role="menuitem"
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#b45309] hover:bg-[#fff5f5]"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        onLogout();
                      }}
                    >
                      Déconnexion
                    </button>
                  )}
                </div>,
                document.body
              )}
          </>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-auto bg-[var(--color-bg)] p-4 lg:p-6" aria-label="Contenu principal">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>

      <Footer />

      {modals}
    </div>
  );
}
