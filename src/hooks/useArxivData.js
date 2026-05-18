/* Custom hook responsible for fetching and normalizing the arXiv dataset. */
import { useState, useEffect } from "react";
import { normalizeRecord } from "../utils/filterHelpers";

export function useArxivData() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load the static dataset once on mount.

    let cancelled = false; // prevents a state update if the component unmounts mid-fetch

    async function loadData() {
      try {
        // Vite serves everything in /public at the root URL
        const response = await fetch("/data.json");

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const raw = await response.json();

        // Normalize every record once here so filters never have to
        // touch raw field names like "author_affiliation" again
        const normalized = raw.map(normalizeRecord);

        if (!cancelled) {
          setRecords(normalized);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    loadData();

    // Cleanup: if the component unmounts before fetch resolves,
    // we flip cancelled=true so we don't call setState on an unmounted component
    return () => {
      cancelled = true;
    };
  }, []); // empty array = run once on mount only

  return { records, loading, error };
}
