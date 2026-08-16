import { create } from "zustand";

export const useOrganizationsState = create((set) => ({
  current: null,
  setCurrent: (current) => set({ current }),
  clear: () => set({ current: null }),
}));
