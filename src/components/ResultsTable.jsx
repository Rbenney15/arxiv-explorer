/**
 * ResultsTable.jsx
 * Renders the paginated slice of filtered records as a table.
 * Owns the pagination state because only this component cares about it.
 * Resets to page 1 whenever the filtered records change (new filter applied).
 */
import { useState, useEffect, useMemo } from "react";
import PaperCard from "./PaperCard";
import Pagination from "./Pagination";

const PAGE_SIZE = 50; // rows per page — easy to change in one place

export default function ResultsTable({ records }) {
  const [page, setPage] = useState(1);

  /**
   * When filters change, filteredRecords is a new array.
   * We reset to page 1 so the user isn't left on page 40 of 5
   * after narrowing a search.
   */
  useEffect(() => {
    setPage(1);
  }, [records]);

  // Total number of pages — recomputes only when records.length changes
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(records.length / PAGE_SIZE)),
    [records.length],
  );

  // The slice of records to render right now
  const pageRecords = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return records.slice(start, start + PAGE_SIZE);
  }, [records, page]);

  if (records.length === 0) {
    return <p className="no-results">No papers match the current filters.</p>;
  }

  return (
    <div className="results-wrapper">
      <div className="table-scroll">
        <table className="results-table">
          <thead>
            <tr>
              <th>Paper ID</th>
              <th>Date</th>
              <th>Affiliation</th>
              <th>Subjects</th>
            </tr>
          </thead>
          <tbody>
            {/* Only PAGE_SIZE rows in the DOM at a time — no virtualization needed */}
            {pageRecords.map((record) => (
              <PaperCard key={record.id} record={record} />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
