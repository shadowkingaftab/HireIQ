import { create } from "zustand";

export const useSkillGraphState = create((set) => ({
  nodes: [],
  edges: [],
  query: { skill_names: [], depth: 1 },
  setGraph: ({ nodes, edges }) => set({ nodes, edges }),
  setQuery: (query) => set({ query }),
  clear: () => set({ nodes: [], edges: [], query: { skill_names: [], depth: 1 } }),
}));
