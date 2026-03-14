import { useId, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ open, title, onClose, children }: ModalProps) {
  const titleId = useId();
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center bg-black/25 px-4 pb-24 pt-10">
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-[330px] rounded-[var(--radius-xl)] bg-gradient-to-b from-white to-[var(--color-surface)] border border-[var(--color-border)] shadow-[0_12px_30px_rgba(120,136,145,0.16)] p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div id={titleId} className="text-xl font-semibold text-[var(--color-text)]">{title}</div>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-full bg-[var(--color-mint)] text-[var(--color-text)] text-lg leading-none" aria-label="Fermer la fenêtre">
            x
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
