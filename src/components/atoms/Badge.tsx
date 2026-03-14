import type { ReactNode } from "react";

export type Tone = "neutral" | "active" | "hypo" | "hyper" | "info" | "teal";

type BadgeProps = {
  children: ReactNode;
  tone?: Tone;
};

const tones: Record<Tone, string> = {
  neutral: "bg-[var(--color-mint)] text-[#344442] border border-[#cfe0dc]",
  active: "bg-[#d8efe9] text-[#134e4a] border border-[var(--color-border-strong)]",
  hypo: "bg-[#fde8e8] text-[#9b1c1c] border border-[#f8b4b4]",
  hyper: "bg-[#fff1e3] text-[#92400e] border border-[#fde68a]",
  info: "bg-[#d1e6e4] text-[var(--color-info)] border border-[#5eead4]",
  teal: "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white border border-transparent inline-flex items-center justify-center min-w-[5.5rem]",
};

export default function Badge({ children, tone = "neutral" }: BadgeProps) {
  return <span className={`px-3 py-1 rounded-[var(--radius-sm)] text-[var(--text-xs)] font-semibold ${tones[tone]}`}>{children}</span>;
}
