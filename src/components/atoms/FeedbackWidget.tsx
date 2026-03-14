import { useState } from "react";

/** Widget de feedback utilisateur (préparé pour branchement futur API / analytics). */
export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-30">
      {open ? (
        <div className="rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg p-3 w-48">
          <p className="text-[var(--text-sm)] text-[var(--color-text)] mb-2">Un problème ou une idée ?</p>
          <a
            href="mailto:feedback@example.com?subject=DiabetCare%20feedback"
            className="block text-[var(--text-sm)] font-semibold text-[var(--color-teal)]"
          >
            Envoyer un message
          </a>
          <button type="button" onClick={() => setOpen(false)} className="mt-2 text-[var(--text-xs)] text-[var(--color-text-secondary)]">
            Fermer
          </button>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-[var(--color-teal)] text-white shadow-md flex items-center justify-center text-sm font-semibold"
        aria-label={open ? "Fermer le feedback" : "Ouvrir le feedback"}
      >
        ?
      </button>
    </div>
  );
}
