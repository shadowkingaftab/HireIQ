import { create } from "zustand";

export const useCandidateStore = create((set) => ({
  candidate: null,
  setCandidate: (candidate) => set({ candidate }),
  clear: () => set({ candidate: null }),
}));
