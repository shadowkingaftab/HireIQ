import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../../src/pages/Login";

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe("Login page", () => {
  it("renders login form", () => {
    renderWithRouter(<Login />);
    expect(screen.getByText("Login")).toBeDefined();
  });
});
