import { useEffect } from "react";
import Toast from "./Toast";
import { useToastStore } from "../../store/toastStore";

const DEFAULT_DURATION = 4200;

/**
 * Global toast host — mounted once in main.jsx. Owns auto-dismiss timers.
 */
export default function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    if (!toasts.length) return undefined;
    const timers = toasts
      .filter((t) => t.duration !== 0)
      .map((t) =>
        setTimeout(() => dismiss(t.id), t.duration ?? DEFAULT_DURATION)
      );
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-toast flex w-full max-w-sm flex-col items-end gap-2.5 px-1"
    >
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={() => dismiss(t.id)} />
      ))}
    </div>
  );
}
