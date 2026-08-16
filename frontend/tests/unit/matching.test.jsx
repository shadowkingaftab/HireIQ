import { describe, it, expect } from "vitest";
import { formatScore, clamp } from "../src/utils/scoreUtils";

describe("scoreUtils", () => {
  it("formats score as percentage", () => {
    expect(formatScore(0.85)).toBe("85.0%");
  });

  it("returns dash for null", () => {
    expect(formatScore(null)).toBe("—");
  });

  it("clamps value", () => {
    expect(clamp(10, 0, 5)).toBe(5);
    expect(clamp(-1, 0, 5)).toBe(0);
  });
});
