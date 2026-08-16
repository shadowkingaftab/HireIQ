import { create } from "zustand";

export const useMatchingState = create((set) => ({
  results: [],
  loading: false,
  error: null,
  setResults: (results) => set({ results }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clear: () => set({ results: [], loading: false, error: null }),
}));
