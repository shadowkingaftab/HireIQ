import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ProofNetwork from "../../src/components/landing/ProofNetwork";

describe("ProofNetwork", () => {
  it("renders the connected profile network and its accessible nodes", () => {
    render(<ProofNetwork />);

    expect(screen.getByRole("group", { name: /profile connected to coding platforms and skills/i })).toBeDefined();
    expect(screen.getByRole("link", { name: /github \(opens in a new tab\)/i })).toBeDefined();
    expect(screen.getByRole("link", { name: /linkedin \(opens in a new tab\)/i })).toBeDefined();
    expect(screen.getByText("PYTHON")).toBeDefined();
  });
});
