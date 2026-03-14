import type { Role } from "../../../features/diabetcare/types";

type RoleSwitcherProps = {
  role: Role;
  onSwitchRole: (role: Role) => void;
};

export default function RoleSwitcher({ role, onSwitchRole }: RoleSwitcherProps) {
  return (
    <nav aria-label="Changement de rôle" className="mb-3 flex items-center justify-center">
      <div className="bg-[#f1f5f6] rounded-full p-1 flex gap-1 border border-[#dde5e7]">
        <button
          type="button"
          onClick={() => onSwitchRole("patient")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${role === "patient" ? "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white" : "text-[#5e7379]"}`}
        >
          Patient
        </button>
        <button
          type="button"
          onClick={() => onSwitchRole("clinician")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${role === "clinician" ? "bg-gradient-to-br from-[var(--color-teal-deep)] to-[var(--color-teal-end)] text-white" : "text-[#5e7379]"}`}
        >
          Soignant
        </button>
      </div>
    </nav>
  );
}
