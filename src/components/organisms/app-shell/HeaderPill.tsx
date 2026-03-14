type HeaderPillProps = {
  dateLabel: string;
  initials: string;
  onProfileClick: () => void;
};

export default function HeaderPill({ dateLabel, initials, onProfileClick }: HeaderPillProps) {
  return (
    <header className="flex items-center justify-between mb-3">
      <div className="bg-[#e7f4f2] text-[#1c8f84] border border-[#1c8f84]/30 text-sm font-semibold px-4 py-2 rounded-full">{dateLabel}</div>
      <button
        type="button"
        onClick={onProfileClick}
        className="w-9 h-9 rounded-full bg-[#1c8f84] flex items-center justify-center text-white font-semibold shadow-sm"
        aria-label={`Ouvrir le profil ${initials}`}
      >
        {initials}
      </button>
    </header>
  );
}
