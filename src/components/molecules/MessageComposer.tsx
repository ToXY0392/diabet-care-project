import { useState, useRef, useEffect } from "react";

type MessageComposerProps = {
  onSend?: (text: string) => void;
};

const attachmentOptions = [
  { id: "photo", label: "Photo", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "document", label: "Document", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { id: "ordonnance", label: "Ordonnance", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { id: "glycemie", label: "Glycémie", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
];

export default function MessageComposer({ onSend }: MessageComposerProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [trayHeight, setTrayHeight] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const trayTarget = (focused || showAttach) ? 220 : 0;

  useEffect(() => {
    let h = trayHeight;
    const goingUp = trayTarget > h;
    const step = () => {
      if (goingUp) {
        h = Math.min(h + 18, trayTarget);
      } else {
        h = Math.max(h - 24, 0);
      }
      setTrayHeight(h);
      if (h !== trayTarget) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trayTarget]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 96)}px`;
  };

  const toggleAttach = () => {
    setShowAttach((prev) => !prev);
  };

  return (
    <>
      {/* Barre de saisie */}
      <div className="flex items-end gap-1.5 px-1 pt-2 pb-1 bg-[var(--color-bg)]">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleAttach}
          className={`shrink-0 w-[36px] h-[36px] mb-[1px] rounded-full border flex items-center justify-center transition-all duration-200 active:scale-90 ${showAttach ? "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] border-transparent text-white" : "bg-[var(--color-mint)] border-[var(--color-border)] text-[color:var(--color-teal)]"}`}
          aria-label={showAttach ? "Fermer les options" : "Ouvrir les options de pièce jointe"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 transition-transform duration-200 ${showAttach ? "rotate-45" : ""}`} aria-hidden="true">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => { setValue(e.target.value); handleInput(); }}
            onKeyDown={handleKeyDown}
            onFocus={() => { setFocused(true); setShowAttach(false); }}
            onBlur={() => setFocused(false)}
            placeholder="Écrire un message…"
            rows={1}
            className="block w-full resize-none rounded-[18px] bg-[var(--color-surface)] border border-[var(--color-border)] px-3.5 py-[7px] text-[length:var(--text-sm)] text-[color:var(--color-text)] placeholder:text-[color:var(--color-inactive)] outline-none focus:border-[var(--color-teal)] focus:ring-1 focus:ring-[var(--color-teal)]/30 transition-colors max-h-[96px] overflow-y-auto scrollbar-hide"
            style={{ lineHeight: "20px", height: "36px" }}
          />
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={!value.trim()}
          className="shrink-0 w-[36px] h-[36px] mb-[1px] rounded-full bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white flex items-center justify-center shadow-sm transition-all duration-150 active:scale-[0.92] disabled:opacity-40 disabled:scale-100"
          aria-label="Envoyer le message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path d="M3.4 20.6l17.2-8.6c.5-.25.5-.95 0-1.2L3.4 2.2c-.46-.23-.98.14-.92.64l1.1 6.88c.04.27.25.48.52.52l7.33 1.06-7.33 1.06a.6.6 0 00-.52.52l-1.1 6.88c-.06.5.46.87.92.64z" />
          </svg>
        </button>
      </div>

      {/* Zone basse : clavier OU panneau PJ, meme espace */}
      <div className="overflow-hidden transition-none" style={{ height: trayHeight }} aria-hidden={trayHeight === 0}>
        {showAttach ? (
          <div className="h-full bg-[var(--color-bg)] flex flex-col">
            <div className="flex-1 px-3 pt-4 pb-2">
              <div className="grid grid-cols-4 gap-3">
                {attachmentOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] flex items-center justify-center shadow-sm group-active:scale-90 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d={opt.icon} />
                      </svg>
                    </div>
                    <span className="text-[11px] text-[color:var(--color-text)] font-medium leading-tight">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="px-3 pb-3">
              <div className="text-center text-[10px] text-[color:var(--color-muted)]">Taille max : 10 Mo par fichier</div>
            </div>
          </div>
        ) : (
          <div className="h-full bg-[#d1d5db] flex flex-col">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-[#cdd1d6] border-b border-[#bfc4c9]">
              <span className="px-3 py-1 rounded-md bg-white text-[11px] text-[#3c3c43] font-medium shadow-sm">Bonjour</span>
              <span className="px-3 py-1 rounded-md bg-white text-[11px] text-[#3c3c43] font-medium shadow-sm">Merci</span>
              <span className="px-3 py-1 rounded-md bg-white text-[11px] text-[#3c3c43] font-medium shadow-sm">D'accord</span>
            </div>
            <div className="flex-1 bg-[#d1d5db] px-1 pt-1.5 flex flex-col gap-1.5">
              <div className="flex gap-[5px] justify-center">
                {"AZERTYUIOP".split("").map((k) => (
                  <div key={k} className="w-[28px] h-[38px] rounded-[5px] bg-white shadow-[0_1px_0_#898a8d] flex items-center justify-center text-[14px] text-[#1c1c1e] font-normal">{k}</div>
                ))}
              </div>
              <div className="flex gap-[5px] justify-center">
                {"QSDFGHJKLM".split("").map((k) => (
                  <div key={k} className="w-[28px] h-[38px] rounded-[5px] bg-white shadow-[0_1px_0_#898a8d] flex items-center justify-center text-[14px] text-[#1c1c1e] font-normal">{k}</div>
                ))}
              </div>
              <div className="flex gap-[5px] justify-center">
                <div className="w-[36px] h-[38px] rounded-[5px] bg-[#adb0b8] shadow-[0_1px_0_#898a8d] flex items-center justify-center text-[11px] text-[#1c1c1e]">⇧</div>
                {"WXCVBN".split("").map((k) => (
                  <div key={k} className="w-[28px] h-[38px] rounded-[5px] bg-white shadow-[0_1px_0_#898a8d] flex items-center justify-center text-[14px] text-[#1c1c1e] font-normal">{k}</div>
                ))}
                <div className="w-[36px] h-[38px] rounded-[5px] bg-[#adb0b8] shadow-[0_1px_0_#898a8d] flex items-center justify-center text-[11px] text-[#1c1c1e]">⌫</div>
              </div>
              <div className="flex gap-[5px] justify-center items-center">
                <div className="w-[36px] h-[38px] rounded-[5px] bg-[#adb0b8] shadow-[0_1px_0_#898a8d] flex items-center justify-center text-[11px] text-[#1c1c1e]">123</div>
                <div className="w-[28px] h-[38px] rounded-[5px] bg-[#adb0b8] shadow-[0_1px_0_#898a8d] flex items-center justify-center text-[16px] text-[#1c1c1e]">🌐</div>
                <div className="flex-1 h-[38px] rounded-[5px] bg-white shadow-[0_1px_0_#898a8d] flex items-center justify-center text-[13px] text-[#1c1c1e]">espace</div>
                <div className="w-[72px] h-[38px] rounded-[5px] bg-[#007aff] shadow-[0_1px_0_#0063d1] flex items-center justify-center text-[13px] text-white font-medium">Envoyer</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
