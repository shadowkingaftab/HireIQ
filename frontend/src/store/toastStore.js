import { create } from "zustand";

let nextId = 1;

/**
 * Lightweight toast queue. The only stateful piece of the toast system —
 * ToastHost renders from it; components call `toast()` helpers below.
 */
export const useToastStore = create((set) => ({
  toasts: [],
  push: (t) => {
    const id = t.id ?? nextId++;
    set((s) => ({ toasts: [...s.toasts, { tone: "info", ...t, id }] }));
    return id;
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Imperative helpers — safe to call from anywhere (handlers, services). */
export const toast = {
  info: (message, opts = {}) => useToastStore.getState().push({ message, ...opts }),
  success: (message, opts = {}) =>
    useToastStore.getState().push({ message, tone: "success", ...opts }),
  warning: (message, opts = {}) =>
    useToastStore.getState().push({ message, tone: "warning", ...opts }),
  danger: (message, opts = {}) =>
    useToastStore.getState().push({ message, tone: "danger", ...opts }),
};
