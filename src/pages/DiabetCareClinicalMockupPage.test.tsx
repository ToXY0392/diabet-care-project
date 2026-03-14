import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DiabetCareClinicalMockupPage from "./DiabetCareClinicalMockupPage";

describe("DiabetCareClinicalMockupPage", () => {
  it("renders the main content and patient dashboard by default", () => {
    render(<DiabetCareClinicalMockupPage />);
    expect(screen.getByRole("main", { name: /contenu principal/i })).toBeInTheDocument();
    expect(screen.getByText(/Tableau de bord/i)).toBeInTheDocument();
  });

  it("renders bottom navigation for patient", () => {
    render(<DiabetCareClinicalMockupPage />);
    const nav = screen.getByRole("navigation", { name: /navigation principale/i });
    expect(nav).toBeInTheDocument();
  });
});
