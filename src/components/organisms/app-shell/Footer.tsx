export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="shrink-0 border-t border-[var(--color-border)] bg-gradient-to-br from-[#2d6b63] via-[#3a8a80] to-[#2d7a70] py-8 px-4 lg:px-6"
      aria-label="Pied de page"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <span className="text-base font-semibold text-white">DiabetCare</span>
            <span className="hidden sm:inline text-white/70">|</span>
            <span className="text-xs text-white/90">Suivi diabète · © {year}</span>
          </div>
          <nav className="flex items-center gap-6" aria-label="Liens légaux">
            <a
              href="#"
              className="text-xs font-medium text-white/90 hover:text-white transition-colors"
            >
              Mentions légales
            </a>
            <a
              href="#"
              className="text-xs font-medium text-white/90 hover:text-white transition-colors"
            >
              Confidentialité
            </a>
            <a
              href="#"
              className="text-xs font-medium text-white/90 hover:text-white transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
