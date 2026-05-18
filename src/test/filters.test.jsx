/*
 * Unit tests for our utility functions in filterHelpers.js
 *
 * WHY test these first?
 * Pure functions are the easiest thing to test — no DOM, no React,
 * no mocking. Just input → output. If these pass, our core
 * filtering logic is solid regardless of how the UI is wired.
 */
import { describe, it, expect } from "vitest";
import {
  parseDate,
  topCategory,
  normalizeRecord,
  applyFilters,
  collectCategories,
} from "../utils/filterHelpers";

// --- parseDate -------------------------------------------
describe("parseDate", () => {
  it("extracts YYYY-MM-DD from a full ISO string", () => {
    expect(parseDate("2020-07-02T00:00:00")).toBe("2020-07-02");
  });

  it("returns null for a null input", () => {
    expect(parseDate(null)).toBeNull();
  });

  it("returns null for an undefined input", () => {
    expect(parseDate(undefined)).toBeNull();
  });
});

// --- topCategory -----------------------------------------
describe("topCategory", () => {
  it("splits on dot and returns the first segment", () => {
    expect(topCategory("cs.SY")).toBe("cs");
    expect(topCategory("physics.soc-ph")).toBe("physics");
    expect(topCategory("math.CO")).toBe("math");
  });

  it("returns the whole string if there is no dot", () => {
    expect(topCategory("quant-ph")).toBe("quant-ph");
  });

  it("returns unknown for an empty input", () => {
    expect(topCategory("")).toBe("unknown");
  });
});

// --- normalizeRecord -------------------------------------
describe("normalizeRecord", () => {
  const raw = {
    id: "2007.00980",
    author_affiliation: "MIT",
    created: "2020-07-02T00:00:00",
    subject_labels: ["cs.SY", "stat.CO"],
  };

  it("maps raw field names to clean ones", () => {
    const result = normalizeRecord(raw);
    expect(result.id).toBe("2007.00980");
    expect(result.affiliation).toBe("MIT");
    expect(result.date).toBe("2020-07-02");
    expect(result.subjects).toEqual(["cs.SY", "stat.CO"]);
  });

  it("precomputes top-level categories", () => {
    const result = normalizeRecord(raw);
    expect(result.categories).toEqual(["cs", "stat"]);
  });

  it("handles missing affiliation gracefully", () => {
    const result = normalizeRecord({ ...raw, author_affiliation: undefined });
    expect(result.affiliation).toBe("");
  });

  it("handles missing subject_labels gracefully", () => {
    const result = normalizeRecord({ ...raw, subject_labels: undefined });
    expect(result.subjects).toEqual([]);
    expect(result.categories).toEqual([]);
  });
});

// --- applyFilters ----------------------------------------
describe("applyFilters", () => {
  // Reusable test dataset — covers multiple categories and dates
  const records = [
    {
      id: "1",
      affiliation: "MIT",
      date: "2020-01-01",
      subjects: ["cs.SY"],
      categories: ["cs"],
    },
    {
      id: "2",
      affiliation: "Stanford",
      date: "2021-06-15",
      subjects: ["math.CO"],
      categories: ["math"],
    },
    {
      id: "3",
      affiliation: "CERN",
      date: "2019-11-30",
      subjects: ["hep-ph"],
      categories: ["hep-ph"],
    },
    {
      id: "4",
      affiliation: "MIT",
      date: "2022-03-10",
      subjects: ["cs.LG", "stat.ML"],
      categories: ["cs", "stat"],
    },
  ];

  it("returns all records when no filters are active", () => {
    const result = applyFilters(records, {
      category: "",
      dateFrom: "",
      dateTo: "",
      affiliation: "",
    });
    expect(result).toHaveLength(4);
  });

  it("filters by category", () => {
    const result = applyFilters(records, {
      category: "cs",
      dateFrom: "",
      dateTo: "",
      affiliation: "",
    });
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id)).toEqual(["1", "4"]);
  });

  it("filters by dateFrom (inclusive)", () => {
    const result = applyFilters(records, {
      category: "",
      dateFrom: "2021-01-01",
      dateTo: "",
      affiliation: "",
    });
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id)).toEqual(["2", "4"]);
  });

  it("filters by dateTo (inclusive)", () => {
    const result = applyFilters(records, {
      category: "",
      dateFrom: "",
      dateTo: "2020-12-31",
      affiliation: "",
    });
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id)).toEqual(["1", "3"]);
  });

  it("filters by date range", () => {
    const result = applyFilters(records, {
      category: "",
      dateFrom: "2020-01-01",
      dateTo: "2021-12-31",
      affiliation: "",
    });
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id)).toEqual(["1", "2"]);
  });

  it("filters by affiliation (case-insensitive substring)", () => {
    const result = applyFilters(records, {
      category: "",
      dateFrom: "",
      dateTo: "",
      affiliation: "mit",
    });
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id)).toEqual(["1", "4"]);
  });

  it("combines multiple filters with AND logic", () => {
    const result = applyFilters(records, {
      category: "cs",
      dateFrom: "2021-01-01",
      dateTo: "",
      affiliation: "",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("4");
  });

  it("returns empty array when nothing matches", () => {
    const result = applyFilters(records, {
      category: "cs",
      dateFrom: "",
      dateTo: "",
      affiliation: "CERN",
    });
    expect(result).toHaveLength(0);
  });
});

// --- collectCategories -----------------------------------
describe("collectCategories", () => {
  it("returns sorted unique top-level categories", () => {
    const records = [
      { categories: ["cs", "stat"] },
      { categories: ["math"] },
      { categories: ["cs"] }, // duplicate — should be deduped
    ];
    expect(collectCategories(records)).toEqual(["cs", "math", "stat"]);
  });

  it("returns an empty array for empty input", () => {
    expect(collectCategories([])).toEqual([]);
  });
});
