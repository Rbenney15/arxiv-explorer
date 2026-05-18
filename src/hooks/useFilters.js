/*
 * Owns filter state and derives the filtered result set.
 * Filtering is memoized because the dataset is large.
 */
import { useState, useMemo } from "react";
import { applyFilters, collectCategories } from "../utils/filterHelpers";

// Default filter state — exported so tests can reference the shape
export const DEFAULT_FILTERS = {
  category: "",
  dateFrom: "",
  dateTo: "",
  affiliation: "",
};

export function useFilters(records) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const categories = useMemo(() => collectCategories(records), [records]);

  // Memoize filtering so it only reruns when records or filters change.
  const filteredRecords = useMemo(
    () => applyFilters(records, filters),
    [records, filters],
  );

  // Merge partial filter updates, e.g. updateFilter({ category: "cs" }).
  function updateFilter(partial) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  /* Resets all filters back to their defaults in one click. */
  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return {
    filters,
    filteredRecords,
    categories,
    updateFilter,
    clearFilters,
  };
}
