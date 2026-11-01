import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArrowRight } from "lucide-react";
import Button from "../../src/components/ui/Button";

describe("Button", () => {
  it("renders icon elements and icon components", () => {
    render(
      <Button leadingIcon={<span data-testid="leading-icon" />} trailingIcon={ArrowRight}>
        Continue
      </Button>
    );

    expect(screen.getByTestId("leading-icon").getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByRole("button").querySelector("svg")).not.toBeNull();
  });
});
