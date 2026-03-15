import { useState, useEffect } from "react";

type ClinicianNoteModalProps = {
  open: boolean;
  patientName: string;
  initialContent: string;
  onClose: () => void;
  onSave: (content: string) => void;
};

export default function ClinicianNoteModal({
  open,
  patientName,
  initialContent,
  onClose,
  onSave,
}: ClinicianNoteModalProps) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (open) setContent(initialContent);
  }, [open, initialContent]);

  if (!open) return null;

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" aria-modal="true" role="dialog" aria-labelledby="clinician-note-title">
      <div className="w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col rounded-[var(--radius-xl)] bg-white border border-[var(--color-border)] shadow-xl">
        <div className="flex items-center justify-between gap-3 p-4 shrink-0 bg-gradient-to-r from-[var(--color-teal-deep)] to-[var(--color-teal-end)]">
          <h2 id="clinician-note-title" className="text-lg font-semibold text-white">
            Note — {patientName}
          </h2>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center font-semibold hover:bg-white/30" aria-label="Fermer">
            ×
          </button>
        </div>
        <div className="flex flex-col gap-4 p-4 overflow-hidden min-h-0 flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Saisir une note libre pour ce patient…"
            className="w-full min-h-[200px] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal-deep)] resize-y"
            aria-label="Contenu de la note"
          />
          <div className="flex gap-3 justify-end shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold bg-[var(--color-mint)] text-[var(--color-text)] border border-[var(--color-border)] hover:shadow-sm">
              Annuler
            </button>
            <button type="button" onClick={handleSave} className="px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm hover:shadow-md">
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
