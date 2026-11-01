import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import EvidenceConstellation from "../../src/components/landing/EvidenceConstellation";

describe("EvidenceConstellation", () => {
  it("renders the accessible evidence-to-match graph", () => {
    const { container } = render(<EvidenceConstellation />);

    expect(
      screen.getByRole("img", {
        name: /repositories, assessments and contributions support verified skills/i,
      })
    ).toBeDefined();
    expect(container.querySelectorAll(".constellation-match-node, .constellation-mobile-match")).toHaveLength(2);
  });
});
