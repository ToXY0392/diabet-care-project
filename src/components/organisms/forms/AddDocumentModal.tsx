import { useEffect, useState } from "react";

export type AddDocumentPayload = {
  title: string;
  category: string;
  content: string;
  /** Nom du fichier joint (transfert vers le patient). */
  fileName?: string;
};

type AddDocumentModalProps = {
  open: boolean;
  patientName: string;
  onClose: () => void;
  onSave: (payload: AddDocumentPayload) => void;
};

const CATEGORIES = ["Prescription", "Clinique", "Administratif", "PDF", "Image", "Autre"];

export default function AddDocumentModal({
  open,
  patientName,
  onClose,
  onSave,
}: AddDocumentModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setTitle("");
      setCategory(CATEGORIES[0]);
      setContent("");
      setSelectedFile(null);
    }
  }, [open]);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file ?? null);
    if (file && !title.trim()) setTitle(file.name.replace(/\.[^.]+$/, ""));
    e.target.value = "";
  };

  const handleSave = () => {
    const finalTitle = title.trim() || selectedFile?.name || "Document";
    onSave({
      title: finalTitle,
      category,
      content: content.trim(),
      fileName: selectedFile?.name,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="add-document-title"
    >
      <div className="w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col rounded-[var(--radius-xl)] bg-white border border-[var(--color-border)] shadow-xl">
        <div className="flex items-center justify-between gap-3 p-4 shrink-0 bg-gradient-to-r from-[var(--color-teal-deep)] to-[var(--color-teal-end)]">
          <h2 id="add-document-title" className="text-lg font-semibold text-white">
            Ajouter un document — {patientName}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center font-semibold hover:bg-white/30"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col gap-4 p-4 overflow-auto min-h-0 flex-1">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du document"
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal-deep)]"
              aria-label="Titre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal-deep)]"
              aria-label="Catégorie"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Transfert de fichier</label>
            <input
              id="add-document-file-input"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              aria-label="Choisir un fichier"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <label
                htmlFor="add-document-file-input"
                className="cursor-pointer rounded-[var(--radius-md)] bg-[var(--color-mint)] text-[var(--color-text)] border border-[var(--color-border)] px-3 py-2 text-sm font-medium hover:shadow-sm inline-block"
              >
                Choisir un fichier
              </label>
              {selectedFile && (
                <span className="text-sm text-[var(--color-text-secondary)] truncate max-w-[200px]" title={selectedFile.name}>
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} ko)
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Contenu / description</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenu ou description du document…"
              className="w-full min-h-[100px] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal-deep)] resize-y"
              aria-label="Contenu"
            />
          </div>
          <div className="flex gap-3 justify-end shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold bg-[var(--color-mint)] text-[var(--color-text)] border border-[var(--color-border)] hover:shadow-sm"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!title.trim() && !selectedFile}
              className="px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
