/*
 * Component tests using React Testing Library.
 *
 * WHY React Testing Library over Enzyme or raw Jest?
 * RTL encourages testing behavior the user actually experiences
 * (what's visible, what happens on interaction) rather than
 * implementation details (state values, method calls).
 * The guiding principle: "test what the user sees and does."
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterPanel from "../components/FilterPanel";

// Reusable default props — mirrors what App.jsx passes down
const defaultProps = {
  filters: {
    category: "",
    dateFrom: "",
    dateTo: "",
    affiliation: "",
  },
  categories: ["cs", "math", "physics"],
  onFilterChange: vi.fn(), // vi.fn() is Vitest's mock function (like jest.fn())
  onClear: vi.fn(),
  resultCount: 358490,
};

describe("FilterPanel", () => {
  it("renders all filter controls", () => {
    render(<FilterPanel {...defaultProps} />);

    expect(screen.getByLabelText("Subject category")).toBeInTheDocument();
    expect(screen.getByLabelText("Date from")).toBeInTheDocument();
    expect(screen.getByLabelText("Date to")).toBeInTheDocument();
    expect(screen.getByLabelText("Affiliation")).toBeInTheDocument();
  });

  it("populates the category dropdown with provided options", () => {
    render(<FilterPanel {...defaultProps} />);

    // The "All categories" default option should always be present
    expect(screen.getByText("All categories")).toBeInTheDocument();
    expect(screen.getByText("cs")).toBeInTheDocument();
    expect(screen.getByText("math")).toBeInTheDocument();
    expect(screen.getByText("physics")).toBeInTheDocument();
  });

  it("calls onFilterChange with the selected category", () => {
    const onFilterChange = vi.fn();
    render(<FilterPanel {...defaultProps} onFilterChange={onFilterChange} />);

    fireEvent.change(screen.getByLabelText("Subject category"), {
      target: { value: "cs" },
    });

    expect(onFilterChange).toHaveBeenCalledWith({ category: "cs" });
  });

  it("calls onFilterChange when affiliation text is typed", () => {
    const onFilterChange = vi.fn();
    render(<FilterPanel {...defaultProps} onFilterChange={onFilterChange} />);

    fireEvent.change(screen.getByLabelText("Affiliation"), {
      target: { value: "MIT" },
    });

    expect(onFilterChange).toHaveBeenCalledWith({ affiliation: "MIT" });
  });

  it("shows the Clear all button as disabled when no filters are active", () => {
    render(<FilterPanel {...defaultProps} />);
    expect(screen.getByText("Clear all")).toBeDisabled();
  });

  it("enables the Clear all button when a filter is active", () => {
    render(
      <FilterPanel
        {...defaultProps}
        filters={{ ...defaultProps.filters, category: "cs" }}
      />,
    );
    expect(screen.getByText("Clear all")).not.toBeDisabled();
  });

  it("calls onClear when Clear all is clicked", () => {
    const onClear = vi.fn();
    render(
      <FilterPanel
        {...defaultProps}
        filters={{ ...defaultProps.filters, category: "cs" }}
        onClear={onClear}
      />,
    );

    fireEvent.click(screen.getByText("Clear all"));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("displays the result count", () => {
    render(<FilterPanel {...defaultProps} resultCount={1234} />);
    expect(screen.getByText("1,234 results")).toBeInTheDocument();
  });
});
