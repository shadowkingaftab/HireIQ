import { create } from "zustand";

export const useCandidateProfileState = create((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clear: () => set({ profile: null }),
}));
