/* Pure utility functions for data transformation and filtering. */

/* Extracts YYYY-MM-DD from an ISO date string. */
export function parseDate(isoString) {
  if (!isoString) return null;
  return isoString.slice(0, 10);
}

/* This lets us group the ~200 fine-grained labels into ~20 buckets. */
export function topCategory(subjectLabel) {
  if (!subjectLabel) return "unknown";
  return subjectLabel.split(".")[0];
}

/* Builds a normalized record from a raw JSON entry. */
export function normalizeRecord(raw) {
  return {
    id: raw.id,
    affiliation: raw.author_affiliation ?? "",
    date: parseDate(raw.created), // "2020-07-02"
    subjects: raw.subject_labels ?? [], // ["cs.SY", "stat.CO"]
    // Precompute top-level categories so filters don't re-split on every render
    categories: (raw.subject_labels ?? []).map(topCategory),
  };
}

/*
 * Applies all active filters to the full normalized dataset.
 * Returns only records that pass every active filter.
 */
export function applyFilters(records, filters) {
  const { category, dateFrom, dateTo, affiliation } = filters;

  return records.filter((record) => {
    // Empty filter values are treated as "all."
    if (category && !record.categories.includes(category)) return false;

    if (dateFrom && record.date < dateFrom) return false;
    if (dateTo && record.date > dateTo) return false;

    if (affiliation) {
      const term = affiliation.toLowerCase();
      if (!record.affiliation.toLowerCase().includes(term)) return false;
    }

    return true;
  });
}

/* Used to populate the category dropdown with real values from the data. */
export function collectCategories(records) {
  const seen = new Set();
  for (const record of records) {
    for (const cat of record.categories) {
      seen.add(cat);
    }
  }
  return [...seen].sort();
}
