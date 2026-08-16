import { describe, it, expect } from "vitest";
import { summarizeEvidence } from "../src/utils/evidenceUtils";

describe("evidenceUtils", () => {
  it("summarizes evidence by type", () => {
    const result = summarizeEvidence([
      { type: "github" },
      { type: "github" },
      { type: "assessment" },
    ]);
    expect(result.total).toBe(3);
    expect(result.byType.github).toBe(2);
  });
});
