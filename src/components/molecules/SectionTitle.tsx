import type { ReactNode } from "react";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export default function SectionTitle({ title, subtitle, action }: SectionTitleProps) {
  return (
    <header className="flex items-start justify-between gap-3 mb-3">
      <div>
        <div className="text-[var(--text-section)] font-semibold text-[var(--color-text)] leading-tight">{title}</div>
        {subtitle ? <div className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-1">{subtitle}</div> : null}
      </div>
      {action}
    </header>
  );
}
