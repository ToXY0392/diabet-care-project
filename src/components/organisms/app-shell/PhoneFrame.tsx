import type { ReactNode } from "react";

type PhoneFrameProps = {
  children: ReactNode;
  roleSwitcher: ReactNode;
  bottomNavigation?: ReactNode;
  modals?: ReactNode;
  fullscreen?: boolean;
};

export default function PhoneFrame({ children, roleSwitcher, bottomNavigation, modals, fullscreen = false }: PhoneFrameProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-6">
      <div className="relative w-[390px] h-[844px] rounded-[var(--radius-frame)] bg-gradient-to-b from-[#0f1f1e] to-[#071314] shadow-2xl overflow-hidden">
        <div className="absolute top-7 left-6 text-white text-xl tracking-tight">9:41</div>
        <div className="absolute top-7 right-6 flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-mint)]/65" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-mint)]/65" />
          <div className="w-5 h-2.5 rounded-full bg-[var(--color-mint)]/65" />
        </div>
        <div className={`absolute inset-[10px] rounded-[var(--radius-2xl)] bg-[var(--color-bg)] flex flex-col overflow-hidden ${fullscreen ? "px-3 pt-12 pb-2" : "px-5 pt-16 pb-6"}`}>
          <style>{`
            @keyframes slideFromLeft { from { opacity: 0; transform: translateX(-18px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes slideFromRight { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes softTabSlide { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: translateX(0); } }
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          {!fullscreen && roleSwitcher}
          <main className={`flex-1 min-h-0 ${fullscreen ? "overflow-hidden" : "pr-1 animate-[softTabSlide_0.2s_ease-out] overflow-y-auto scrollbar-hide"}`} aria-label="Contenu principal">
            {children}
          </main>
          {bottomNavigation}
          {modals}
        </div>
      </div>
    </div>
  );
}
