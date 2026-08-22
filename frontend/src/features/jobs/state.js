import { create } from "zustand";

export const useJobsState = create((set) => ({
  items: [],
  activeId: null,
  setItems: (items) => set({ items }),
  setActive: (id) => set({ activeId: id }),
  clear: () => set({ items: [], activeId: null }),
}));
