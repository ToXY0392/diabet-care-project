import { useRef, useEffect, useState } from "react";
import type { NavItem } from "../../../features/diabetcare/types";

type BottomNavigationProps<T extends string> = {
  items: NavItem<T>[];
  activeKey: T;
  onChange: (key: T) => void;
};

export default function BottomNavigation<T extends string>({ items, activeKey, onChange }: BottomNavigationProps<T>) {
  const navRef = useRef<HTMLElement>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  // Positionner le pill (fond dégradé) sous l’onglet actif pour l’animation de transition.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const activeBtn = nav.querySelector<HTMLButtonElement>("[aria-current='page']");
    if (!activeBtn) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    setPillStyle({
      left: btnRect.left - navRect.left,
      width: btnRect.width,
    });
  }, [activeKey]);

  return (
    <nav
      ref={navRef}
      aria-label="Navigation principale"
      className="relative mt-3 bg-[#f1f5f6] rounded-full px-2 py-1.5 flex justify-between items-center text-[length:11px] gap-1 overflow-x-auto scrollbar-hide"
    >
      <div
        className="absolute top-1 bottom-1 rounded-full bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ left: pillStyle.left, width: pillStyle.width }}
        aria-hidden="true"
      />
      {items.map((item) => {
        const isActive = activeKey === item.key;

        if (item.variant === "filledIcon" || item.variant === "plainIcon") {
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 active:scale-[0.93] ${isActive ? "text-white" : "text-[color:var(--color-inactive)]"}`}
              aria-label={String(item.key)}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </button>
          );
        }

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`relative z-10 px-3 py-2 whitespace-nowrap rounded-full transition-all duration-200 active:scale-[0.93] ${isActive ? "text-white font-semibold" : "text-[color:var(--color-inactive)]"}`}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
