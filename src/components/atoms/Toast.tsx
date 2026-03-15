type ToastProps = {
  message: string;
  variant?: "success" | "info" | "error";
};

export default function Toast({ message, variant = "success" }: ToastProps) {
  const bg = variant === "success" ? "bg-[var(--color-success)]" : variant === "error" ? "bg-[var(--color-danger)]" : "bg-[var(--color-teal)]";
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-[var(--radius-md)] ${bg} text-white text-[var(--text-sm)] font-medium shadow-lg animate-[fadeIn_0.3s_ease-out]`}
    >
      {message}
    </div>
  );
}
