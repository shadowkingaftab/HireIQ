import { create } from "zustand";

export const useEvidenceStore = create((set) => ({
  evidence: [],
  setEvidence: (evidence) => set({ evidence }),
  clear: () => set({ evidence: [] }),
}));
