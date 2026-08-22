import { describe, it, expect } from "vitest";
import { buildGraphData, filterGraphData } from "../src/utils/graphUtils";

describe("graphUtils", () => {
  it("builds graph payload from nodes and edges", () => {
    const result = buildGraphData([{ id: "1", name: "Python" }], [{ source: "1", target: "2" }]);
    expect(result.nodes[0].label).toBe("Python");
    expect(result.edges[0].source).toBe("1");
  });

  it("returns same graph when no filters", () => {
    const graph = { nodes: [], edges: [] };
    expect(filterGraphData(graph)).toEqual(graph);
  });
});
