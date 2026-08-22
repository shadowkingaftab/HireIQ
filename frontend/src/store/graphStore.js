import { create } from "zustand";

export const useGraphStore = create((set) => ({
  nodes: [],
  edges: [],
  setGraph: ({ nodes, edges }) => set({ nodes, edges }),
  clear: () => set({ nodes: [], edges: [] }),
}));
