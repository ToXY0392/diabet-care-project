import type { ReactNode } from "react";

export type BreadcrumbItem = {
  label: string;
  onClick?: () => void;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  separator?: ReactNode;
};

export default function Breadcrumbs({ items, separator = "›" }: BreadcrumbsProps) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-[var(--text-sm)] text-[var(--color-text-secondary)] flex-wrap">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && <span className="shrink-0" aria-hidden>{separator}</span>}
            {item.onClick && !isLast ? (
              <button type="button" onClick={item.onClick} className="hover:text-[var(--color-teal)] underline-offset-2 hover:underline">
                {item.label}
              </button>
            ) : (
              <span className={isLast ? "font-semibold text-[var(--color-text)]" : ""}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
