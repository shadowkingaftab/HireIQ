import { create } from "zustand";

export const useEvidenceState = create((set) => ({
  items: [],
  selectedId: null,
  setItems: (items) => set({ items }),
  select: (id) => set({ selectedId: id }),
  clear: () => set({ items: [], selectedId: null }),
}));
