import type { ReactNode } from "react";

export type CardVariant = "default" | "hero" | "danger" | "warning" | "surface" | "surfaceWhite" | "surfaceMint";

type CardProps = {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
};

const variantClass: Record<CardVariant, string> = {
  default: "app-card-default",
  hero: "app-card-hero",
  danger: "app-card-danger",
  warning: "app-card-warning",
  surface: "app-card-surface-neutral",
  surfaceWhite: "app-card-surface-white",
  surfaceMint: "app-card-surface-mint",
};

export default function Card({ children, variant = "default", className = "" }: CardProps) {
  return (
    <div className={`rounded-[var(--radius-xl)] shadow-sm transition-all duration-150 ${variantClass[variant]} ${className}`}>
      {children}
    </div>
  );
}
