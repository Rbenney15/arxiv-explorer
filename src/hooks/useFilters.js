/*
 * Custom hook that owns filter state and derives the filtered result set.
 *
 * Why useMemo here?
 * With 358k records, re-running applyFilters() on every render
 * would be expensive. useMemo caches the result and only re-runs
 * when records or filters actually change.
 */
import { useState, useMemo } from "react";
import { applyFilters, collectCategories } from "../utils/filterHelpers";

// Default filter state — exported so tests can reference the shape
export const DEFAULT_FILTERS = {
  category: "", // top-level arXiv category, e.g. "cs"
  dateFrom: "", // "YYYY-MM-DD" string, inclusive
  dateTo: "", // "YYYY-MM-DD" string, inclusive
  affiliation: "", // free-text substring search
};

export function useFilters(records) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const categories = useMemo(() => collectCategories(records), [records]);

  /*
   * Applies all active filters to the full record set.
   * Only recomputes when either records or filters change.
   * This is the key performance optimization for a 358k-record dataset.
   */
  const filteredRecords = useMemo(
    () => applyFilters(records, filters),
    [records, filters],
  );

  /**
   * Generic setter: merges a partial update into filter state.
   * Usage: updateFilter({ category: 'cs' })
   * This pattern avoids a separate setter per filter field.
   */
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
