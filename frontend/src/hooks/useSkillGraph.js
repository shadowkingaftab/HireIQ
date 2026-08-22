import { useQuery } from "@tanstack/react-query";
import { useGet } from "./useApi";

export function useSkillGraph(skillNames = [], depth = 1) {
  const params = new URLSearchParams({ skill_names: skillNames.join(","), depth: String(depth) }).toString();
  return useGet(`/skill-graph?${params}`, ["skill-graph", skillNames, depth]);
}
