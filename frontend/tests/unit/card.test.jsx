import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Card from "../../src/components/ui/Card";

describe("Card", () => {
  it("renders its composed subcomponents", () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Dashboard summary</Card.Title>
        </Card.Header>
        <Card.Content>Candidate overview</Card.Content>
      </Card>
    );

    expect(screen.getByRole("heading", { name: "Dashboard summary" })).toBeDefined();
    expect(screen.getByText("Candidate overview")).toBeDefined();
  });
});
