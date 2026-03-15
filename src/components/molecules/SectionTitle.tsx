import type { ReactNode } from "react";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  titleClassName?: string;
};

export default function SectionTitle({ title, subtitle, action, className = "", titleClassName = "" }: SectionTitleProps) {
  return (
    <header className={`flex items-start justify-between gap-3 mb-3 ${className}`.trim()}>
      <div className={className.includes("justify-center") ? "w-full" : undefined}>
        <div className={`text-[var(--text-section)] font-semibold text-[var(--color-text)] leading-tight ${titleClassName}`.trim()}>{title}</div>
        {subtitle ? <div className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-1">{subtitle}</div> : null}
      </div>
      {action}
    </header>
  );
}
