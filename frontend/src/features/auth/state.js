import { create } from "zustand";

export const useAuthFeature = create((set) => ({
  status: "idle",
  error: null,
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  reset: () => set({ status: "idle", error: null }),
}));
